const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

const WSP = '5491127599163';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const PARAMS = new URLSearchParams(location.search);

const CATEGORIAS = [
  { id: 'lajas', nombre: 'Lajas naturales', corto: 'Lajas', img: 'images/p-laja-gris-irregular.webp', bajada: 'Irregulares, en placas grandes y en tiras, para patios, senderos y muros.' },
  { id: 'porfidos', nombre: 'Pórfidos', corto: 'Pórfidos', img: 'images/p-adoquin-porfido-mixto.webp', bajada: 'Adoquines y lajas de pórfido para ingresos de autos, veredas y patios.' },
  { id: 'baldosas', nombre: 'Baldosas', corto: 'Baldosas', img: 'images/p-baldosa-64-panes.webp', bajada: 'Graníticas, táctiles y lisas, de fabricación propia, para veredas y espacios públicos.' },
  { id: 'mosaicos', nombre: 'Mosaicos', corto: 'Mosaicos', img: 'images/p-mosaico-granitico.webp', bajada: 'Mosaicos graníticos para galerías, patios y semicubiertos.' },
];
const USOS = { vereda: 'Vereda', patio: 'Patio y jardín', ingreso: 'Ingreso de autos', muro: 'Muro o fachada', publico: 'Espacio público' };
const TONOS = {
  gris: { nombre: 'Gris', hex: '#9A9FA2' },
  oscuro: { nombre: 'Gris oscuro', hex: '#4A5054' },
  calido: { nombre: 'Cálido', hex: '#B9874E' },
  claro: { nombre: 'Claro', hex: '#E4E1DA' },
  amarillo: { nombre: 'Amarillo', hex: '#D4B04A' },
};
const FORMATOS = { irregular: 'Irregular', modular: 'Medida fija' };
const ORDENES = { destacados: 'Más pedidos', 'precio-asc': 'Menor precio por m²', 'precio-desc': 'Mayor precio por m²', nombre: 'Nombre (A-Z)' };

const PRODUCTOS = [
  { id: 'laja-gris-irregular', cod: 'AR-L01', nombre: 'Laja gris irregular', cat: 'lajas', usos: ['patio', 'vereda', 'muro'], tonos: ['oscuro'], formato: 'irregular', medida: 'Piezas irregulares de 20 a 50 cm', espesor: '2 a 4 cm', precio: 34900, descuento: 0, stock: 180, rango: 1, img: 'images/p-laja-gris-irregular.webp', alt: 'Lajas grises irregulares sobre un piso de cemento', desc: 'Laja natural gris oscuro en piezas irregulares, para colocar con junta. Va bien en patios, senderos y revestimiento de muros.' },
  { id: 'laja-gris-placas', cod: 'AR-L02', nombre: 'Laja gris en placas grandes', cat: 'lajas', usos: ['patio', 'ingreso', 'vereda'], tonos: ['gris'], formato: 'irregular', medida: 'Placas de 40 a 80 cm', espesor: '3 a 5 cm', precio: 46800, descuento: 0, stock: 95, rango: 2, img: 'images/p-laja-gris-placas.webp', alt: 'Placas grandes de laja gris apoyadas contra un muro', desc: 'Placas grandes y más gruesas, para patios amplios y el ingreso del auto. Menos juntas y una superficie más pareja.' },
  { id: 'laja-dorada-irregular', cod: 'AR-L03', nombre: 'Laja dorada irregular', cat: 'lajas', usos: ['patio', 'muro'], tonos: ['calido'], formato: 'irregular', medida: 'Piezas irregulares de 20 a 50 cm', espesor: '2 a 4 cm', precio: 38500, descuento: 0, stock: 120, rango: 3, img: 'images/p-laja-dorada-irregular.webp', alt: 'Lajas irregulares en tonos dorados y ocres', desc: 'Laja de tonos dorados y ocres que le da calidez a patios, galerías y frentes.' },
  { id: 'laja-rustica-tiras', cod: 'AR-L04', nombre: 'Laja rústica en tiras', cat: 'lajas', usos: ['muro', 'patio'], tonos: ['calido', 'oscuro'], formato: 'modular', medida: 'Tiras de 15 × 60 cm', espesor: '1,5 a 3 cm', precio: 42900, descuento: 0, stock: 40, rango: 6, img: 'images/p-laja-rustica-tiras.webp', alt: 'Tiras de laja con vetas óxido, gris y grafito', desc: 'Tiras de laja con vetas óxido, gris y grafito, para revestir muros, frentes y canteros con un acabado rústico.' },
  { id: 'adoquin-porfido-mixto', cod: 'AR-P01', nombre: 'Adoquín de pórfido 8/10 mixto', cat: 'porfidos', usos: ['ingreso', 'vereda', 'publico'], tonos: ['calido', 'gris'], formato: 'modular', medida: 'Cubos de 8 a 10 cm', espesor: '8 a 10 cm', precio: 52000, descuento: 0, stock: 210, rango: 4, img: 'images/p-adoquin-porfido-mixto.webp', alt: 'Nueve adoquines de pórfido en tonos rojizos y grises', desc: 'Adoquines de pórfido en tonos rojizos y grises, para ingresos de autos, calles internas y veredas de mucho tránsito.' },
  { id: 'porfido-gris-abanico', cod: 'AR-P02', nombre: 'Adoquín de pórfido 6/8 gris', cat: 'porfidos', usos: ['ingreso', 'patio', 'publico'], tonos: ['gris'], formato: 'modular', medida: 'Cubos de 6 a 8 cm', espesor: '6 a 8 cm', precio: 48500, descuento: 0, stock: 150, rango: 7, img: 'images/p-porfido-gris-abanico.webp', alt: 'Adoquines de pórfido gris colocados en abanico', desc: 'Adoquín gris más chico, pensado para colocar en abanico en ingresos, patios y plazas.' },
  { id: 'porfido-irregular', cod: 'AR-P03', nombre: 'Laja de pórfido irregular', cat: 'porfidos', usos: ['patio', 'vereda', 'muro'], tonos: ['oscuro'], formato: 'irregular', medida: 'Piezas irregulares de 15 a 40 cm', espesor: '2 a 4 cm', precio: 39900, descuento: 0, stock: 85, rango: 0, img: 'images/p-porfido-irregular.webp', alt: 'Lajas de pórfido gris azulado colocadas con junta', desc: 'Lajas de pórfido en grises azulados, muy duras, para senderos, patios y muros.' },
  { id: 'baldosa-64-panes', cod: 'AR-B01', nombre: 'Baldosa granítica 64 panes 40 × 40', cat: 'baldosas', usos: ['vereda', 'publico'], tonos: ['gris'], formato: 'modular', medida: '40 × 40 cm', espesor: '3,5 cm', porM2: 6.25, precio: 21500, descuento: 0, stock: 420, rango: 5, img: 'images/p-baldosa-64-panes.webp', alt: 'Cuatro baldosas graníticas grises de 64 panes', desc: 'Baldosa granítica de fabricación propia, con superficie antideslizante de 64 panes. Alta resistencia al tránsito y al clima.' },
  { id: 'baldosa-tactil', cod: 'AR-B02', nombre: 'Baldosa táctil', cat: 'baldosas', usos: ['publico', 'vereda'], tonos: ['amarillo'], formato: 'modular', medida: '40 × 40 o 60 × 40 cm', espesor: '3,5 cm', precio: 27900, descuento: 0, stock: 160, rango: 8, nuevo: true, img: 'images/p-baldosa-tactil.webp', alt: 'Baldosas táctiles amarillas con botones en relieve en una vereda', desc: 'Baldosa podotáctil de alerta, para accesibilidad y orientación en veredas, rampas y espacios públicos.', variantes: { tipo: 'Medida', items: [{ id: '40x40', nombre: '40 × 40 cm', porM2: 6.25 }, { id: '60x40', nombre: '60 × 40 cm', porM2: 4.17 }] } },
  { id: 'baldosa-canto-rodado', cod: 'AR-B03', nombre: 'Baldosa granítica canto rodado 60 × 40', cat: 'baldosas', usos: ['patio', 'vereda', 'publico'], tonos: ['calido'], formato: 'modular', medida: '60 × 40 cm', espesor: '4 cm', porM2: 4.17, precio: 29800, descuento: 0, stock: 130, rango: 0, img: 'images/p-baldosa-canto-rodado.webp', alt: 'Superficie de canto rodado en tonos tierra', desc: 'Baldosa con canto rodado a la vista: la textura de la piedra natural con la regularidad de una baldosa.' },
  { id: 'baldosa-lisa', cod: 'AR-B04', nombre: 'Baldosa lisa gris 40 × 40', cat: 'baldosas', usos: ['vereda', 'patio', 'ingreso'], tonos: ['gris'], formato: 'modular', medida: '40 × 40 cm', espesor: '3,5 cm', porM2: 6.25, precio: 18900, descuento: 0, stock: 500, rango: 0, img: 'images/p-baldosa-lisa.webp', alt: 'Baldosas lisas grises de cemento colocadas', desc: 'Baldosa de cemento lisa, la clásica para veredas, patios y fondos.' },
  { id: 'mosaico-granitico', cod: 'AR-M01', nombre: 'Mosaico granítico 20 × 20', cat: 'mosaicos', usos: ['patio', 'publico'], tonos: ['oscuro', 'gris', 'claro'], formato: 'modular', medida: '20 × 20 cm', espesor: '2,5 cm', porM2: 25, precio: 24500, descuento: 0, stock: 200, rango: 0, img: 'images/p-mosaico-granitico.webp', alt: 'Tres mosaicos graníticos en negro, gris y crema', desc: 'Mosaico granítico con piedra partida a la vista, para galerías, patios y semicubiertos.', variantes: { tipo: 'Color', items: [{ id: 'negro', nombre: 'Negro', hex: '#2F3133' }, { id: 'gris', nombre: 'Gris', hex: '#9EA2A4' }, { id: 'crema', nombre: 'Crema', hex: '#E6DCC8' }] } },
  { id: 'mosaico-granitico-blanco', cod: 'AR-M02', nombre: 'Mosaico granítico blanco 30 × 30', cat: 'mosaicos', usos: ['patio'], tonos: ['claro'], formato: 'modular', medida: '30 × 30 cm', espesor: '2,5 cm', porM2: 11.11, precio: 26900, descuento: 0, stock: 110, rango: 0, img: 'images/p-mosaico-granitico-blanco.webp', alt: 'Mosaico granítico de grano blanco y gris', desc: 'Mosaico granítico de grano blanco y gris, pulido, para galerías y semicubiertos luminosos.' },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/(\d)\s*[x×]\s*(\d)/g, '$1x$2');
const catDe = id => CATEGORIAS.find(c => c.id === id);
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const m2Texto = n => `${n.toLocaleString('es-AR')} m²`;

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), usos = lista(f.usos), tonos = lista(f.tonos), formatos = lista(f.formato), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (usos.length && !usos.some(u => p.usos.includes(u))) return false;
    if (tonos.length && !tonos.some(t => p.tonos.includes(t))) return false;
    if (formatos.length && !formatos.includes(p.formato)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
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
      p.nombre, p.cod, catDe(p.cat)?.nombre, catDe(p.cat)?.corto, ...p.usos.map(u => USOS[u]), ...p.tonos.map(t => TONOS[t]?.nombre),
      FORMATOS[p.formato], p.medida, p.espesor, p.desc, ...(p.variantes?.items || []).map(v => v.nombre),
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const tokensBusqueda = new Map();
function tokensDe(p) {
  if (!tokensBusqueda.has(p.id)) tokensBusqueda.set(p.id, new Set(textoDe(p).split(/[^a-z0-9]+/).filter(Boolean)));
  return tokensBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => (w.length <= 2 ? tokensDe(p).has(w) : textoDe(p).includes(w)));

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
  const palabras = norm(q).split(/\s+/).filter(Boolean);
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

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });
const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));
const varianteDe = (p, v) => p?.variantes?.items.find(x => x.id === v) || null;
const varDefault = p => p?.variantes?.items[0]?.id || '';
const porM2De = (p, v) => varianteDe(p, v)?.porM2 || p?.porM2 || 0;

const Cart = {
  KEY: 'armonia_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { void 0; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.v || '') === v);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, v, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.v || '') === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (i.v || '') === v))); },
  clear() { this.save([]); },
  count() { return this.get().length; },
  m2() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  syncStock() {
    const items = this.get(); let changed = false;
    const filtered = items.filter(i => {
      const p = getProducto(i.id);
      if (!p || p.stock <= 0) { changed = true; return false; }
      if (i.qty > p.stock) { i.qty = p.stock; changed = true; }
      return true;
    });
    if (changed) this.save(filtered);
  },
};

const ICO = {
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  ir: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  abajo: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  tacho: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};
const ROMBO = '<span class="rombo" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';

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

const ANIM = {
  subir: 'data-animate="subir" style="opacity:0;transform:translateY(32px)"',
  der: 'data-animate="der" style="opacity:0;transform:translateX(56px)"',
};

function precioHTML(p) {
  const fin = precioFinal(p);
  return `<p class="precio">${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}<b>${formatearPrecio(fin)}</b><small>por m²</small></p>`;
}
function tagHTML(p) {
  if (p.nuevo) return '<span class="tag">Nuevo</span>';
  if (p.stock > 0 && p.stock < 50) return '<span class="tag tag--stock">Últimos m²</span>';
  return '';
}
function stepperHTML(p, valor = 1) {
  return `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar un m²">${ICO.menos}</button><input type="number" inputmode="numeric" min="1" max="${p.stock}" value="${valor}" aria-label="Metros cuadrados de ${esc(p.nombre)}"><span class="stepper__u">m²</span><button type="button" data-step="1" aria-label="Sumar un m²">${ICO.mas}</button></div>`;
}
function cardHTML(p, { anim = true, animTipo = 'subir', clase = '' } = {}) {
  const attr = anim ? ANIM[animTipo] : '';
  if (MODELO === '2') {
    return `<li class="${clase}" ${attr}><article class="scard" data-id="${p.id}"><button type="button" class="scard__foto" data-quick="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="800"></button>${tagHTML(p)}<div class="scard__info"><span class="scard__cod">${esc(p.cod)} · ${esc(catDe(p.cat)?.corto || '')}</span><h3 class="scard__nombre">${esc(p.nombre)}</h3>${precioHTML(p)}</div><button type="button" class="scard__add" data-add="${p.id}" aria-label="Agregar 1 m² de ${esc(p.nombre)} al carrito">${ICO.mas}<span>Agregar</span></button></article></li>`;
  }
  return `<li class="${clase}" ${attr}><article class="pcard" data-id="${p.id}"><button type="button" class="pcard__foto" data-quick="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="800"><span class="pcard__cod">${esc(p.cod)}</span>${tagHTML(p)}</button><div class="pcard__info"><h3 class="pcard__nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3><p class="pcard__meta">${esc(p.variantes ? `${p.variantes.items.length} ${p.variantes.tipo === 'Color' ? 'colores' : 'medidas'} · ${p.espesor}` : `${p.medida}`)}</p>${precioHTML(p)}<div class="prod-actions">${stepperHTML(p)}<button type="button" class="btn btn--cta prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">Agregar</button></div></div></article></li>`;
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
  const desktopMq = window.matchMedia('(min-width: 1024px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, .nav-drop__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

const modelos = n => `${n} ${n === 1 ? 'modelo' : 'modelos'}`;

function initMenuCats() {
  const catActual = PAGINA === 'catalogo' ? (PARAMS.get('cat') || '') : '';
  document.querySelectorAll('[data-nav-drop]').forEach(box => {
    const btn = box.querySelector('.nav-drop__btn');
    const lista = box.querySelector('[data-drop-lista]');
    if (!btn || !lista) return;
    lista.innerHTML = CATEGORIAS.map(c => `<li><a href="${URL_CATALOGO}?cat=${c.id}"${c.id === catActual ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="48" height="48"><span><b>${esc(c.nombre)}</b><small>${modelos(Tienda.contar({ cat: c.id }))}</small></span></a></li>`).join('');
    const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1024px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
  });
}

function initBuscadorHeader() {
  const btn = document.querySelector('[data-abrir-buscar]');
  const fila = document.getElementById('hdrBuscar');
  if (!btn || !fila) return;
  btn.addEventListener('click', () => {
    const catQ = document.getElementById('catQ');
    if (catQ) {
      catQ.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      catQ.focus({ preventScroll: true });
      return;
    }
    const abierto = !fila.hidden;
    fila.hidden = abierto;
    btn.setAttribute('aria-expanded', String(!abierto));
    if (!abierto) document.getElementById('hdrQ')?.focus();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !fila.hidden) { fila.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
  });
}

function initCuentas() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => { el.textContent = modelos(Tienda.contar({ cat: el.dataset.cuentaCat })); });
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    if (e.target.closest('input, label, [data-stepper], [data-add]')) return;
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
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initRail() {
  const rail = document.querySelector('[data-rail]');
  if (!rail) return;
  const vp = rail.querySelector('[data-rail-vp]');
  const track = rail.querySelector('[data-rail-track]');
  const prev = rail.querySelector('[data-rail-prev]');
  const next = rail.querySelector('[data-rail-next]');
  if (!vp || !track) return;
  const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  track.innerHTML = items.map(p => cardHTML(p, { animTipo: 'der', clase: 'rail-item' })).join('');
  initRailDrag(vp);
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 280) + 16;
  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= Math.min(inicio, 2) + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initMuestrario() {
  const cont = document.querySelector('[data-muestrario]');
  if (!cont) return;
  const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  cont.innerHTML = items.map(p => cardHTML(p)).join('');
}

function initUsos() {
  const tabs = [...document.querySelectorAll('[data-uso-tab]')];
  if (!tabs.length) return;
  document.querySelectorAll('[data-uso-lista]').forEach(ul => {
    const u = ul.dataset.usoLista;
    const { items } = Tienda.consultar({ filtros: { usos: [u] }, orden: 'destacados', limite: 3 });
    items.forEach(cachear);
    ul.innerHTML = items.map(p => `<li class="uso__fila"><div><button type="button" class="uso__nombre" data-quick="${p.id}">${esc(p.nombre)}</button><small>${esc(p.medida)}</small></div>${precioHTML(p)}<button type="button" class="uso__mas" data-add="${p.id}" aria-label="Agregar 1 m² de ${esc(p.nombre)} al carrito">${ICO.mas}</button></li>`).join('');
  });
  const elegir = (tab, foco = false) => {
    tabs.forEach(t => {
      const activo = t === tab;
      t.setAttribute('aria-selected', String(activo));
      t.tabIndex = activo ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !activo;
      if (activo && panel) revelarNuevos(panel);
    });
    if (foco) tab.focus();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((tab, k) => {
    tab.addEventListener('click', () => elegir(tab));
    tab.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const n = tabs[(k + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        elegir(n, true);
      }
    });
  });
  const desdeHash = () => {
    if (location.hash === '#veredas') elegir(tabs.find(t => t.dataset.usoTab === 'vereda') || tabs[0]);
  };
  window.addEventListener('hashchange', desdeHash);
  desdeHash();
}

function leerCantidad(scope) {
  const input = scope?.querySelector('[data-stepper] input');
  const n = parseInt(input?.value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function sumarAlCarrito(p, { qty = 1, v = '', comprar = false } = {}) {
  if (!p) return;
  const vv = v || varDefault(p);
  const enCarrito = Cart.get().find(i => i.id === p.id && (i.v || '') === vv)?.qty || 0;
  if (enCarrito >= p.stock) { showToast(`Ya tenés en el carrito los ${m2Texto(p.stock)} que hay en fábrica.`); return; }
  const agregar = Math.min(qty, p.stock - enCarrito);
  Cart.add(p, agregar, vv);
  const variante = varianteDe(p, vv);
  if (comprar) { abrirCarrito(); return; }
  showToast(`Sumaste ${m2Texto(agregar)} de ${p.nombre}${variante ? ` (${variante.nombre})` : ''}.`);
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const box = step.closest('[data-stepper]');
      const input = box?.querySelector('input');
      if (!input) return;
      const max = parseInt(input.max, 10) || 999;
      const val = Math.min(Math.max((parseInt(input.value, 10) || 1) + parseInt(step.dataset.step, 10), 1), max);
      input.value = val;
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) { abrirQV(quick.dataset.quick, quick); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const card = add.closest('.pcard');
      sumarAlCarrito(getProducto(add.dataset.add), { qty: leerCantidad(card) });
      const inp = card?.querySelector('[data-stepper] input');
      if (inp) inp.value = 1;
    }
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('[data-stepper] input');
    if (!input) return;
    const max = parseInt(input.max, 10) || 999;
    input.value = Math.min(Math.max(parseInt(input.value, 10) || 1, 1), max);
  });
}

function atraparFoco(panel, e) {
  if (e.key !== 'Tab') return;
  const f = [...panel.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function abrirCapa(capa, panel) {
  capa.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => capa.classList.add('open')));
  panel?.focus?.();
}
function cerrarCapa(capa, alTerminar) {
  capa.classList.remove('open');
  const fin = () => {
    capa.hidden = true;
    if (!document.querySelector('.qv.open, .drawer.open, .dossier.open')) document.body.classList.remove('no-scroll');
    alTerminar?.();
  };
  if (reduceMotion) fin(); else setTimeout(fin, 320);
}

let ultimoFoco = null;
let qvActual = null;
let qvVariante = '';
function abrirQV(id, origen) {
  const p = getProducto(id);
  const capa = document.getElementById('qv');
  if (!p || !capa) return;
  if (capa.hidden) ultimoFoco = origen || document.activeElement;
  qvActual = p;
  qvVariante = varDefault(p);
  pintarQV();
  abrirCapa(capa);
  setTimeout(() => capa.querySelector('.qv__close')?.focus(), 30);
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, sku: p.cod, image: new URL(p.img, location.href).href, description: p.desc, category: catDe(p.cat)?.nombre, offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', unitText: 'm²' } });
}

function pintarQV() {
  const p = qvActual;
  const box = document.getElementById('qvContent');
  if (!p || !box) return;
  const cat = catDe(p.cat);
  const variantes = p.variantes ? `<div><p class="var-tit">${esc(p.variantes.tipo)}: <span data-qv-var-nombre>${esc(varianteDe(p, qvVariante)?.nombre || '')}</span></p><div class="vars">${p.variantes.items.map(v => `<button type="button" class="var${v.hex ? '' : ' var--txt'}" data-qv-var="${v.id}" aria-pressed="${v.id === qvVariante}">${v.hex ? `<i style="background:${v.hex}"></i>` : ''}${esc(v.nombre)}</button>`).join('')}</div></div>` : '';
  const rinde = porM2De(p, qvVariante) ? `<dt>Rinde</dt><dd data-qv-rinde>${porM2De(p, qvVariante).toLocaleString('es-AR')} piezas por m²</dd>` : '';
  const rel = Tienda.consultar({ filtros: { cat: [p.cat], excluir: [p.id] }, orden: 'destacados', limite: 3 }).items;
  if (rel.length < 3) rel.push(...Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)], destacado: true }, orden: 'destacados', limite: 3 - rel.length }).items);
  rel.forEach(cachear);
  const msg = `Hola Armonía! Quiero consultar por la muestra de ${p.nombre} (${p.cod}).`;
  box.innerHTML = `<div class="qv__grid"><div class="qv__foto"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="800"></div><div class="qv__info"><p class="qv__cod">${esc(p.cod)} · ${esc(cat?.nombre || '')}</p><h2>${esc(p.nombre)}</h2>${precioHTML(p)}<p class="qv__desc">${esc(p.desc)}</p><dl class="ficha"><dt>Medida</dt><dd>${esc(p.medida)}</dd><dt>Espesor</dt><dd>${esc(p.espesor)}</dd>${rinde}<dt>Formato</dt><dd>${esc(FORMATOS[p.formato])}</dd><dt>Usos</dt><dd>${esc(p.usos.map(u => USOS[u]).join(', '))}</dd><dt>En fábrica</dt><dd>${esc(m2Texto(p.stock))}</dd></dl>${variantes}<details class="calc-m2"><summary>¿Cuántos m² necesitás? ${ICO.abajo}</summary><div class="calc-m2__in"><div class="campo-fila campo-fila--medidas"><div class="campo"><label class="sr-only" for="qvLargo">Largo en metros</label><input id="qvLargo" type="text" inputmode="decimal" placeholder="Largo (m)" autocomplete="off"></div><span class="por" aria-hidden="true">×</span><div class="campo"><label class="sr-only" for="qvAncho">Ancho en metros</label><input id="qvAncho" type="text" inputmode="decimal" placeholder="Ancho (m)" autocomplete="off"></div></div><p class="calc-m2__res" id="qvCalcRes" aria-live="polite">Cargá las medidas: sumamos un 10 % para cortes y lo pasamos a la cantidad.</p></div></details><div class="qv__compra">${stepperHTML(p)}<button type="button" class="btn btn--cta" data-qv-add>Agregar al carrito</button><button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button></div><p class="qv__sub">Subtotal: <b data-qv-sub></b> <span data-qv-piezas></span></p><a class="qv__wsp" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Consultar por esta muestra</a></div></div><div class="qv__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" class="rel" data-quick="${r.id}"><img src="${esc(r.img)}" alt="" width="54" height="54"><span><b>${esc(r.nombre)}</b><small>${formatearPrecio(precioFinal(r))} por m²</small></span></button></li>`).join('')}</ul></div>`;
  actualizarSubQV();
  const panel = box.closest('.qv__panel');
  if (panel) panel.scrollTop = 0;
}

function actualizarSubQV() {
  const p = qvActual;
  const box = document.getElementById('qvContent');
  if (!p || !box) return;
  const qty = leerCantidad(box);
  const sub = box.querySelector('[data-qv-sub]');
  if (sub) sub.textContent = `${formatearPrecio(precioFinal(p) * qty)} por ${m2Texto(qty)}`;
  const piezas = box.querySelector('[data-qv-piezas]');
  const porM2 = porM2De(p, qvVariante);
  if (piezas) piezas.textContent = porM2 ? `· unas ${Math.ceil(qty * porM2).toLocaleString('es-AR')} piezas` : '';
}

const leerNumero = v => { const n = parseFloat(String(v || '').replace(',', '.').replace(/[^0-9.]/g, '')); return Number.isFinite(n) && n > 0 ? n : 0; };
const m2ConCortes = (largo, ancho, cortes = true) => Math.ceil(largo * ancho * (cortes ? 1.1 : 1) - 1e-9);

function cerrarQV() {
  const capa = document.getElementById('qv');
  if (!capa || capa.hidden) return;
  cerrarCapa(capa, () => { ultimoFoco?.focus?.(); qvActual = null; });
}

function initQV() {
  const capa = document.getElementById('qv');
  if (!capa) return;
  capa.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const v = e.target.closest('[data-qv-var]');
    if (v && qvActual) {
      qvVariante = v.dataset.qvVar;
      capa.querySelectorAll('[data-qv-var]').forEach(b => b.setAttribute('aria-pressed', String(b === v)));
      const nom = capa.querySelector('[data-qv-var-nombre]');
      if (nom) nom.textContent = varianteDe(qvActual, qvVariante)?.nombre || '';
      const rinde = capa.querySelector('[data-qv-rinde]');
      if (rinde) rinde.textContent = `${porM2De(qvActual, qvVariante).toLocaleString('es-AR')} piezas por m²`;
      actualizarSubQV();
      return;
    }
    if (e.target.closest('[data-qv-add]')) { sumarAlCarrito(qvActual, { qty: leerCantidad(capa), v: qvVariante }); return; }
    if (e.target.closest('[data-qv-comprar]')) {
      const p = qvActual;
      const qty = leerCantidad(capa);
      cerrarCapa(capa, () => { qvActual = null; sumarAlCarrito(p, { qty, v: qvVariante, comprar: true }); });
    }
  });
  capa.addEventListener('input', e => {
    if (e.target.closest('[data-stepper]')) { actualizarSubQV(); return; }
    if (e.target.id === 'qvLargo' || e.target.id === 'qvAncho') {
      const largo = leerNumero(capa.querySelector('#qvLargo')?.value);
      const ancho = leerNumero(capa.querySelector('#qvAncho')?.value);
      const res = capa.querySelector('#qvCalcRes');
      if (!largo || !ancho) { if (res) res.textContent = 'Cargá las medidas: sumamos un 10 % para cortes y lo pasamos a la cantidad.'; return; }
      const necesita = m2ConCortes(largo, ancho);
      const qty = Math.min(necesita, qvActual?.stock || necesita);
      const input = capa.querySelector('[data-stepper] input');
      if (input) input.value = qty;
      if (res) res.innerHTML = `${largo.toLocaleString('es-AR')} × ${ancho.toLocaleString('es-AR')} m = ${(largo * ancho).toLocaleString('es-AR', { maximumFractionDigits: 2 })} m². Con cortes: <b>${m2Texto(necesita)}</b>${qty < necesita ? ` (en fábrica hay ${m2Texto(qty)})` : ''}.`;
      actualizarSubQV();
    }
  });
  document.addEventListener('keydown', e => {
    if (capa.hidden) return;
    if (e.key === 'Escape') cerrarQV();
    else atraparFoco(capa.querySelector('.qv__panel'), e);
  });
}

let focoCarrito = null;
function abrirCarrito() {
  const capa = document.getElementById('cartDrawer');
  if (!capa) return;
  focoCarrito = document.activeElement;
  renderCarrito();
  abrirCapa(capa);
  setTimeout(() => capa.querySelector('.drawer__head .icon-btn')?.focus(), 30);
}
function cerrarCarrito() {
  const capa = document.getElementById('cartDrawer');
  if (!capa || capa.hidden) return;
  cerrarCapa(capa, () => focoCarrito?.focus?.());
}

function renderCarrito() {
  const lines = document.getElementById('cartLines');
  const foot = document.getElementById('cartFoot');
  const titulo = document.querySelector('[data-cart-titulo-n]');
  if (!lines || !foot) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  if (titulo) titulo.textContent = items.length ? `(${m2Texto(Cart.m2())})` : '';
  if (!items.length) {
    lines.innerHTML = `<div class="vacio">${ROMBO}<h3>Tu carrito está vacío</h3><p>Elegí una muestra del catálogo y sumá los m² que necesitás.</p><a class="btn btn--primary" href="${URL_CATALOGO}">Ver el catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  lines.innerHTML = items.map((i, k) => {
    const p = getProducto(i.id);
    const v = varianteDe(p, i.v);
    return `<div class="linea" style="animation-delay:${Math.min(k * 0.05, 0.3)}s" data-linea="${p.id}" data-v="${esc(i.v || '')}"><img src="${esc(p.img)}" alt="" width="64" height="64"><div><b>${esc(p.nombre)}</b><small>${v ? `${esc(p.variantes.tipo)}: ${esc(v.nombre)} · ` : ''}${formatearPrecio(precioFinal(p))} por m²</small><div class="linea__acc"><div class="stepper" data-stepper data-linea-stepper><button type="button" data-step="-1" aria-label="Restar un m²"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><input type="number" inputmode="numeric" min="1" max="${p.stock}" value="${i.qty}" aria-label="Metros cuadrados de ${esc(p.nombre)}"><span class="stepper__u">m²</span><button type="button" data-step="1" aria-label="Sumar un m²"${i.qty >= p.stock ? ' disabled' : ''}>${ICO.mas}</button></div><button type="button" class="linea__quitar" data-quitar aria-label="Quitar ${esc(p.nombre)} del carrito">${ICO.tacho}</button></div></div><span class="linea__sub">${formatearPrecio(precioFinal(p) * i.qty)}</span></div>`;
  }).join('');
  foot.hidden = false;
  foot.innerHTML = `<div class="total"><span>Total <small>(${m2Texto(Cart.m2())})</small></span><span>${formatearPrecio(Cart.total())}</span></div><p class="drawer__nota">Envíos en Zona Oeste: el costo depende de la localidad y te lo confirmamos por WhatsApp.</p><button type="button" class="btn btn--cta btn--block" data-finalizar>Finalizar compra</button><button type="button" class="btn btn--line btn--block" data-cerrar-cart>Seguir comprando</button>`;
}

function initCarrito() {
  const capa = document.getElementById('cartDrawer');
  if (!capa) return;
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', abrirCarrito));
  capa.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-cart]')) { cerrarCarrito(); return; }
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea;
    const v = linea.dataset.v || '';
    if (e.target.closest('[data-quitar]')) { Cart.remove(id, v); return; }
    const step = e.target.closest('[data-step]');
    if (step) {
      e.stopPropagation();
      const actual = Cart.get().find(i => i.id === id && (i.v || '') === v)?.qty || 1;
      Cart.setQty(id, v, actual + parseInt(step.dataset.step, 10));
    }
  }, true);
  capa.addEventListener('change', e => {
    const input = e.target.closest('[data-linea-stepper] input');
    const linea = e.target.closest('[data-linea]');
    if (!input || !linea) return;
    Cart.setQty(linea.dataset.linea, linea.dataset.v || '', parseInt(input.value, 10) || 1);
  });
  document.addEventListener('cart:updated', () => { if (!capa.hidden) renderCarrito(); });
  document.addEventListener('keydown', e => {
    if (capa.hidden) return;
    if (e.key === 'Escape') cerrarCarrito();
    else atraparFoco(capa.querySelector('.drawer__panel'), e);
  });
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
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

function initPresentacion() {
  const capa = document.getElementById('dossier');
  if (!capa) return;
  let foco = null;
  const cerrar = () => { if (!capa.hidden) cerrarCapa(capa, () => foco?.focus?.()); };
  document.querySelectorAll('[data-abrir-presentacion]').forEach(b => b.addEventListener('click', () => {
    foco = b;
    abrirCapa(capa);
    setTimeout(() => capa.querySelector('[data-cerrar-dossier].icon-btn')?.focus(), 30);
  }));
  capa.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-dossier]')) { cerrar(); return; }
    if (e.target.closest('[data-imprimir]')) {
      document.body.classList.add('imprimiendo');
      window.print();
    }
  });
  window.addEventListener('afterprint', () => document.body.classList.remove('imprimiendo'));
  document.addEventListener('keydown', e => {
    if (capa.hidden) return;
    if (e.key === 'Escape') cerrar();
    else atraparFoco(capa.querySelector('.dossier__panel'), e);
  });
}

function initConsulta() {
  const form = document.getElementById('consultaForm');
  if (!form) return;
  const largo = form.querySelector('#cLargo');
  const ancho = form.querySelector('#cAncho');
  const cortes = form.querySelector('#cCortes');
  const material = form.querySelector('#cMaterial');
  const resM2 = form.querySelector('[data-res-m2]');
  const resRef = form.querySelector('[data-res-ref]');
  const errUso = form.querySelector('#errUso');
  const errMed = form.querySelector('#errMedidas');
  const usoActual = () => form.querySelector('input[name="uso"]:checked')?.value || '';
  const calcular = () => {
    const l = leerNumero(largo.value), a = leerNumero(ancho.value);
    const m2 = l && a ? m2ConCortes(l, a, cortes.checked) : 0;
    resM2.textContent = m2 ? m2.toLocaleString('es-AR') : '—';
    const mat = material.value;
    if (!m2) { resRef.textContent = 'Cargá el largo y el ancho para calcular.'; return m2; }
    if (!mat) { resRef.textContent = 'Elegí el material y te mostramos un precio de referencia.'; return m2; }
    const uso = usoActual();
    let ref = Tienda.consultar({ filtros: { cat: [mat], usos: uso ? [uso] : [] }, orden: 'precio-asc', limite: 1 }).items[0];
    if (!ref) ref = Tienda.consultar({ filtros: { cat: [mat] }, orden: 'precio-asc', limite: 1 }).items[0];
    if (!ref) { resRef.textContent = 'Te pasamos el precio por WhatsApp.'; return m2; }
    resRef.innerHTML = `${esc(catDe(mat)?.corto || '')} desde <b>${formatearPrecio(precioFinal(ref))}</b> el m² (${esc(ref.nombre)}): unos <b>${formatearPrecio(precioFinal(ref) * m2)}</b>.`;
    return m2;
  };
  const marcarUso = u => {
    const radio = form.querySelector(`input[name="uso"][value="${u}"]`);
    if (radio) { radio.checked = true; errUso.hidden = true; calcular(); }
  };
  form.addEventListener('input', () => {
    if (largo.value || ancho.value) { errMed.hidden = true; largo.removeAttribute('aria-invalid'); ancho.removeAttribute('aria-invalid'); }
    calcular();
  });
  form.addEventListener('change', e => { if (e.target.name === 'uso') errUso.hidden = true; calcular(); });
  document.addEventListener('click', e => {
    const link = e.target.closest('[data-uso]');
    if (link) marcarUso(link.dataset.uso);
  });
  const usoUrl = PARAMS.get('uso');
  if (usoUrl && USOS[usoUrl]) marcarUso(usoUrl);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const uso = usoActual();
    const l = leerNumero(largo.value), a = leerNumero(ancho.value);
    let ok = true;
    if (!uso) { errUso.hidden = false; ok = false; }
    if (!l || !a) {
      errMed.hidden = false; ok = false;
      if (!l) largo.setAttribute('aria-invalid', 'true');
      if (!a) ancho.setAttribute('aria-invalid', 'true');
    }
    if (!ok) {
      showToast('Nos faltan un par de datos para armar la consulta.');
      (!uso ? form.querySelector('input[name="uso"]') : (!l ? largo : ancho)).focus();
      return;
    }
    const m2 = calcular();
    const mat = material.value ? (catDe(material.value)?.corto || material.value) : 'Todavía no sé, quiero asesoramiento';
    const loc = form.querySelector('#cLocalidad').value.trim();
    const nombre = form.querySelector('#cNombre').value.trim();
    const lineas = [
      'Hola Armonía! Quiero hacer una consulta personalizada.',
      `• Obra: ${USOS[uso]}`,
      `• Material: ${mat}`,
      `• Medidas: ${l.toLocaleString('es-AR')} × ${a.toLocaleString('es-AR')} m${cortes.checked ? ` (con 10 % para cortes: ${m2} m²)` : ` (${m2} m²)`}`,
    ];
    if (loc) lineas.push(`• Localidad: ${loc}`);
    if (nombre) lineas.push(`• Nombre: ${nombre}`);
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    window.open(wspLink(lineas.join('\n')), '_blank', 'noopener');
    showToast('Te abrimos WhatsApp con la consulta lista para enviar.');
    setTimeout(() => { btn.disabled = false; }, 800);
  });
  calcular();
}

function initCatalogo() {
  if (PAGINA !== 'catalogo') return;
  const grid = document.getElementById('catGrid');
  const verMas = document.getElementById('catVerMas');
  const cuenta = document.getElementById('catCuenta');
  const activos = document.getElementById('catActivos');
  const vacio = document.getElementById('catVacio');
  const qInput = document.getElementById('catQ');
  const ordenSel = document.getElementById('catOrden');
  const filtros = document.getElementById('filtros');
  if (!grid) return;
  const GRUPOS = {
    cat: { valores: Object.fromEntries(CATEGORIAS.map(c => [c.id, c.nombre])), filtro: 'cat' },
    uso: { valores: USOS, filtro: 'usos' },
    tono: { valores: Object.fromEntries(Object.entries(TONOS).map(([k, t]) => [k, t.nombre])), filtro: 'tonos' },
    formato: { valores: FORMATOS, filtro: 'formato' },
  };
  const estado = { q: '', orden: 'destacados', cat: [], uso: [], tono: [], formato: [] };
  const validar = (g, lista) => lista.filter(v => GRUPOS[g].valores[v]);
  Object.keys(GRUPOS).forEach(g => { estado[g] = validar(g, (PARAMS.get(g) || '').split(',').filter(Boolean)); });
  estado.q = (PARAMS.get('q') || '').slice(0, 60);
  estado.orden = ORDENES[PARAMS.get('orden')] ? PARAMS.get('orden') : 'destacados';

  ordenSel.innerHTML = Object.entries(ORDENES).map(([k, n]) => `<option value="${k}">${esc(n)}</option>`).join('');
  Object.entries(GRUPOS).forEach(([g, def]) => {
    const box = filtros.querySelector(`[data-ops="${g}"]`);
    if (!box) return;
    box.innerHTML = Object.entries(def.valores).map(([v, n]) => {
      const c = Tienda.contar({ [def.filtro]: [v] });
      const punto = g === 'tono' ? `<i style="background:${TONOS[v].hex}"></i>` : '';
      return `<label class="f-op${g === 'tono' ? ' f-op--tono' : ''}"><input type="checkbox" data-f="${g}" value="${v}">${punto}<span>${esc(n)}</span><small>${c}</small></label>`;
    }).join('');
  });

  const filtrosDe = () => ({ cat: estado.cat, usos: estado.uso, tonos: estado.tono, formato: estado.formato });
  const sincronizarUI = () => {
    qInput.value = estado.q;
    ordenSel.value = estado.orden;
    filtros.querySelectorAll('input[data-f]').forEach(i => { i.checked = estado[i.dataset.f].includes(i.value); });
    const n = ['cat', 'uso', 'tono', 'formato'].reduce((s, g) => s + estado[g].length, 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const unaCat = estado.cat.length === 1 ? catDe(estado.cat[0]) : null;
    const tit = document.getElementById('catTitulo');
    const baj = document.getElementById('catBajada');
    const miga = document.querySelector('[data-miga-cat]');
    if (tit) tit.textContent = unaCat ? unaCat.nombre : 'Catálogo de muestras';
    if (baj) baj.textContent = unaCat ? unaCat.bajada : 'Lajas, pórfidos, baldosas y mosaicos para exterior, con precio por m² y venta directa de fábrica.';
    if (miga) { miga.hidden = !unaCat; miga.textContent = unaCat ? unaCat.nombre : ''; if (unaCat) miga.setAttribute('aria-current', 'page'); else miga.removeAttribute('aria-current'); }
    document.title = unaCat ? `${unaCat.nombre} — Armonía, pisos para exterior` : 'Catálogo de muestras — Armonía, pisos para exterior';
    document.querySelectorAll('.nav-drop__lista a').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (unaCat && id === unaCat.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    const chips = [];
    Object.entries(GRUPOS).forEach(([g, def]) => estado[g].forEach(v => chips.push(`<button type="button" class="activo-chip" data-quitar-f="${g}" data-v="${v}" aria-label="Quitar el filtro ${esc(def.valores[v])}">${esc(def.valores[v])}${ICO.x}</button>`)));
    if (estado.q) chips.push(`<button type="button" class="activo-chip" data-quitar-q aria-label="Quitar la búsqueda">«${esc(estado.q)}»${ICO.x}</button>`);
    activos.innerHTML = chips.join('');
  };
  const escribirURL = () => {
    const u = new URLSearchParams();
    ['cat', 'uso', 'tono', 'formato'].forEach(g => { if (estado[g].length) u.set(g, estado[g].join(',')); });
    if (estado.q) u.set('q', estado.q);
    if (estado.orden !== 'destacados') u.set('orden', estado.orden);
    const prod = new URLSearchParams(location.search).get('producto');
    if (prod) u.set('producto', prod);
    const s = u.toString();
    window.history.replaceState(null, '', s ? `?${s}` : location.pathname);
  };
  let cursor = null;
  let mostrados = 0;
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => cardHTML(p)).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    mostrados = agregar ? mostrados + res.items.length : res.items.length;
    verMas.hidden = !cursor;
    vacio.hidden = mostrados > 0;
    if (estado.q) cuenta.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'material' : 'materiales'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
    else {
      const total = Tienda.contar(filtrosDe());
      cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de <strong>${total}</strong> ${total === 1 ? 'material' : 'materiales'}` : '';
    }
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };

  filtros.addEventListener('change', e => {
    const i = e.target.closest('input[data-f]');
    if (!i) return;
    const g = i.dataset.f;
    estado[g] = i.checked ? [...new Set([...estado[g], i.value])] : estado[g].filter(v => v !== i.value);
    aplicar();
  });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    ['cat', 'uso', 'tono', 'formato'].forEach(g => { estado[g] = []; });
    estado.q = '';
    aplicar();
  }));
  activos.addEventListener('click', e => {
    const f = e.target.closest('[data-quitar-f]');
    if (f) { estado[f.dataset.quitarF] = estado[f.dataset.quitarF].filter(v => v !== f.dataset.v); aplicar(); return; }
    if (e.target.closest('[data-quitar-q]')) { estado.q = ''; aplicar(); }
  });
  ordenSel.addEventListener('change', () => { estado.orden = ordenSel.value; aplicar(); });
  let tq = 0;
  qInput.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { estado.q = qInput.value.trim().slice(0, 60); aplicar(); }, 220); });
  document.getElementById('catBuscar')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tq); estado.q = qInput.value.trim().slice(0, 60); aplicar(); });
  verMas.addEventListener('click', () => pintar(true));

  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  let bd = document.querySelector('.filtros-bd');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-bd'; document.body.appendChild(bd); }
  const mq = window.matchMedia('(max-width: 1023px)');
  const abrirF = () => { filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirBtn?.setAttribute('aria-expanded', 'true'); filtros.removeAttribute('inert'); filtros.querySelector('input')?.focus(); };
  const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirBtn?.setAttribute('aria-expanded', 'false'); if (mq.matches) filtros.setAttribute('inert', ''); };
  abrirBtn?.addEventListener('click', abrirF);
  bd.addEventListener('click', () => { cerrarF(); abrirBtn?.focus(); });
  filtros.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => { cerrarF(); abrirBtn?.focus(); }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('open')) { cerrarF(); abrirBtn?.focus(); } });
  const syncF = () => { if (mq.matches) { if (!filtros.classList.contains('open')) filtros.setAttribute('inert', ''); } else { filtros.removeAttribute('inert'); filtros.classList.remove('open'); bd.classList.remove('open'); } };
  mq.addEventListener('change', syncF);
  syncF();

  sincronizarUI();
  pintar();
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const media = hero.querySelector('[data-hero-media]');
  const img = hero.querySelector('[data-hero-img]');
  if (media) tl.fromTo(media, { clipPath: 'polygon(50% 38%, 58% 50%, 50% 62%, 42% 50%)' }, { clipPath: 'polygon(50% -55%, 155% 50%, 50% 155%, -55% 50%)', duration: 1.5, ease: 'power3.inOut', clearProps: 'clipPath' }, 0);
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const hero = document.querySelector('.hero');
  const img = hero?.querySelector('[data-hero-img]');
  if (!img) return;
  gsap.to(img, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  try {
    const centro = [-34.655, -58.66];
    const mapa = L.map(el, { scrollWheelZoom: false, attributionControl: true, zoomControl: true });
    mapa.setView(centro, 11);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    L.circle(centro, { radius: 9000, color: '#183C47', weight: 1.5, fillColor: '#5B98A6', fillOpacity: 0.16 }).addTo(mapa);
    L.circleMarker(centro, { radius: 7, color: '#FFFFFF', weight: 2, fillColor: '#183C47', fillOpacity: 1 }).addTo(mapa).bindTooltip('Fábrica Armonía · Zona Oeste', { direction: 'top', offset: [0, -8] });
    const ajustar = () => mapa.invalidateSize();
    window.addEventListener('load', ajustar);
    setTimeout(ajustar, 1400);
  } catch (err) { void err; }
}

function abrirDesdeURL() {
  const id = PARAMS.get('producto');
  if (id && getProducto(id)) abrirQV(id);
}

initModelBarScroll();
initNav();
initMenuCats();
initBuscadorHeader();
initCuentas();
initRail();
initMuestrario();
initUsos();
initCatalogo();
initTarjetas();
initQV();
initCarrito();
Cart.syncStock();
document.addEventListener('cart:updated', updateCartBadge);
updateCartBadge();
initFloats();
initConsulta();
initPresentacion();
initReveals();
initHeroMotion();
initParallax();
initMapa();
abrirDesdeURL();
