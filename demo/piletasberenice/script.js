'use strict';

const WA = '5491138477859';
const MARCA = 'Piletas berenice';
const TOPE_CONSULTA = 100;
const POR_PAGINA = 16;
const MAX_POR_LINEA = 3;

const CATEGORIAS = [
  { id: 'rectangulares', nombre: 'Rectangulares', img: 'images/p-romana.webp', bajada: 'Líneas rectas, con la escalera que elijas' },
  { id: 'curvas', nombre: 'Curvas y redondas', img: 'images/p-oval.webp', bajada: 'Oval, riñón y redonda' },
  { id: 'angostas', nombre: 'Angostas', img: 'images/p-patio.webp', bajada: 'Para patios largos o espacios chicos' },
];

const FORMAS = { rect: 'Rectangular', oval: 'Oval', rinon: 'Forma libre', redonda: 'Redonda' };

const ESCALERAS = [
  { id: 'lateral', nombre: 'Escalera lateral' },
  { id: 'romana', nombre: 'Escalera romana' },
  { id: 'esquina', nombre: 'Escalera en esquina' },
  { id: 'ancho', nombre: 'Escalera de ancho completo' },
  { id: 'recta', nombre: 'Escalera recta' },
  { id: 'curva', nombre: 'Escalera curva' },
];

const TAMANOS = {
  chica: [0, 5, 'Hasta 5 m de largo'],
  mediana: [5.01, 7.5, 'De 5 a 7,5 m de largo'],
  grande: [7.51, 99, 'Más de 7,5 m de largo'],
};

const PRECIOS = {
  hasta10: [0, 10000000, 'Hasta $10 millones'],
  '10a15': [10000000, 15000000, 'De $10 a $15 millones'],
  mas15: [15000000, 1e12, 'Más de $15 millones'],
};

const ORDENES = {
  destacados: 'Recomendadas',
  'precio-asc': 'Menor precio',
  'precio-desc': 'Mayor precio',
  'largo-asc': 'Más chicas primero',
  'largo-desc': 'Más grandes primero',
  nombre: 'Nombre (A-Z)',
};

const VEREDAS = [0.5, 1, 1.5];

const medida = (largo, ancho, prof, precio) => ({ id: `${largo}x${ancho}`, largo, ancho, prof, precio });

const PRODUCTOS = [
  {
    id: 'clasica', nombre: 'Pileta Clásica', cat: 'rectangulares', forma: 'rect', escalera: 'lateral', img: 'images/p-clasica.webp', destacado: 1,
    desc: 'Rectangular de líneas simples, con la escalera al costado y pegada a una esquina: deja todo el largo libre para nadar y jugar.',
    opc: [medida(6, 3, 1.4, 11900000), medida(7, 3.5, 1.4, 14200000), medida(8, 4, 1.5, 16900000)],
  },
  {
    id: 'romana', nombre: 'Pileta Romana', cat: 'rectangulares', forma: 'rect', escalera: 'romana', img: 'images/p-romana.webp', destacado: 2,
    desc: 'Rectangular con escalera romana: escalones anchos en semicírculo para entrar de a poco o quedarse sentado en el agua.',
    opc: [medida(6, 3, 1.4, 12300000), medida(7, 3.5, 1.4, 14600000), medida(8, 4, 1.5, 17400000)],
  },
  {
    id: 'oval', nombre: 'Pileta Oval', cat: 'curvas', forma: 'oval', escalera: 'curva', img: 'images/p-oval.webp', destacado: 3,
    desc: 'Forma oval con la escalera siguiendo la curva del borde. Sin esquinas, queda suave en jardines con césped.',
    opc: [medida(6, 3, 1.4, 12400000), medida(7, 3.5, 1.4, 14900000)],
  },
  {
    id: 'patio', nombre: 'Pileta Patio', cat: 'angostas', forma: 'rect', escalera: 'recta', img: 'images/p-patio.webp', destacado: 4,
    desc: 'Compacta y angosta, pensada para patios chicos: escalera recta en un extremo y lugar para refrescarse sin ocupar todo el espacio.',
    opc: [medida(3.5, 2, 1.2, 6900000), medida(4, 2, 1.2, 7400000), medida(5, 2.2, 1.3, 8600000)],
  },
  {
    id: 'rinon', nombre: 'Pileta Riñón', cat: 'curvas', forma: 'rinon', escalera: 'curva', img: 'images/p-rinon.webp', destacado: 5,
    desc: 'Forma libre tipo riñón, con escalones curvos en la parte ancha. Se acomoda a jardines con canteros y árboles.',
    opc: [medida(5.5, 3, 1.4, 11800000), medida(6.5, 3.5, 1.4, 14100000)],
  },
  {
    id: 'esquina', nombre: 'Pileta Esquina', cat: 'rectangulares', forma: 'rect', escalera: 'esquina', img: 'images/p-esquina.webp', destacado: 6,
    desc: 'Rectangular con escalera en L en una de las esquinas: dos lados para entrar y un rincón para sentarse.',
    opc: [medida(7, 3.5, 1.4, 14700000), medida(8, 4, 1.5, 17300000), medida(9, 4, 1.6, 18900000)],
  },
  {
    id: 'redonda', nombre: 'Pileta Redonda', cat: 'curvas', forma: 'redonda', escalera: 'curva', img: 'images/p-redonda.webp', destacado: 7,
    desc: 'Redonda, con escalones curvos de un lado. Ocupa poco lugar y entra en el centro de un jardín chico.',
    opc: [medida(3.5, 3.5, 1.2, 7900000), medida(4, 4, 1.3, 8900000)],
  },
  {
    id: 'terraza', nombre: 'Pileta Terraza', cat: 'rectangulares', forma: 'rect', escalera: 'ancho', img: 'images/p-terraza.webp', destacado: 8,
    desc: 'Rectangular con escalera de ancho completo en un extremo. Pensada para rodearla de deck o de solado.',
    opc: [medida(6, 3, 1.4, 12200000), medida(7, 3.5, 1.4, 14500000)],
  },
  {
    id: 'andarivel', nombre: 'Pileta Andarivel', cat: 'angostas', forma: 'rect', escalera: 'ancho', img: 'images/p-andarivel.webp', destacado: 9,
    desc: 'Larga y angosta, para nadar de punta a punta. Entra en lotes angostos y deja libre el resto del terreno.',
    opc: [medida(8, 2.5, 1.4, 12600000), medida(10, 2.5, 1.5, 14900000)],
  },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const fmtM = n => Number(n).toLocaleString('es-AR', { maximumFractionDigits: 2 });
const opcDe = (p, opcId) => p.opc.find(x => x.id === opcId) || p.opc[0];
const precioDesde = p => Math.min(...p.opc.map(x => x.precio));
const largoMin = p => Math.min(...p.opc.map(x => x.largo));
const largoMax = p => Math.max(...p.opc.map(x => x.largo));
const catDe = id => CATEGORIAS.find(c => c.id === id);
const escaleraDe = id => ESCALERAS.find(e => e.id === id);
const medidaTxt = (p, o) => (p.forma === 'redonda' ? `Ø ${fmtM(o.largo)} m` : `${fmtM(o.largo)} × ${fmtM(o.ancho)} m`);
const waLink = texto => `https://wa.me/${WA}?text=${encodeURIComponent(texto)}`;
const FACTOR_FORMA = { rect: 1, oval: Math.PI / 4, redonda: Math.PI / 4, rinon: 0.8 };
const litros = (p, o) => Math.round((o.largo * o.ancho * (FACTOR_FORMA[p.forma] || 1) * o.prof * 0.92 * 1000) / 500) * 500;

function cotaCorta(p) {
  const min = largoMin(p), max = largoMax(p);
  if (p.forma === 'redonda') return min === max ? `Ø ${fmtM(min)} m` : `Ø ${fmtM(min)} a ${fmtM(max)} m`;
  return min === max ? `${fmtM(min)} m de largo` : `${fmtM(min)} a ${fmtM(max)} m de largo`;
}

function leerPatio(v, vereda) {
  const m = String(v || '').replace(/,/g, '.').match(/^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)$/i);
  if (!m) return null;
  const l = Number(m[1]), a = Number(m[2]);
  if (!(l >= 2 && l <= 40 && a >= 2 && a <= 40)) return null;
  const ver = VEREDAS.includes(Number(vereda)) ? Number(vereda) : 1;
  return { l, a, m: ver };
}

function entraEn(o, patio) {
  if (!patio) return true;
  const m = patio.m ?? 1;
  const L = patio.l - 2 * m, A = patio.a - 2 * m;
  return (o.largo <= L && o.ancho <= A) || (o.largo <= A && o.ancho <= L);
}

function mejorOpcion(p, patio) {
  const ok = p.opc.filter(o => entraEn(o, patio));
  if (!ok.length) return null;
  return ok.reduce((a, b) => (b.largo * b.ancho > a.largo * a.ancho ? b : a));
}

function crearTienda(coleccion, { tope = TOPE_CONSULTA } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), esc2 = lista(f.esc), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (esc2.length && !esc2.includes(p.escalera)) return false;
    if (f.tam && TAMANOS[f.tam]) {
      const [min, max] = TAMANOS[f.tam];
      if (!p.opc.some(o => o.largo >= min && o.largo <= max)) return false;
    }
    if (f.precio && PRECIOS[f.precio]) {
      const [min, max] = PRECIOS[f.precio];
      if (!p.opc.some(o => o.precio >= min && o.precio < max)) return false;
    }
    if (f.patio && !p.opc.some(o => entraEn(o, f.patio))) return false;
    if (f.destacado && !p.destacado) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'precio-asc': return (a, b) => precioDesde(a) - precioDesde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioDesde(b) - precioDesde(a) || desempate(a, b);
      case 'largo-asc': return (a, b) => largoMin(a) - largoMin(b) || desempate(a, b);
      case 'largo-desc': return (a, b) => largoMax(b) - largoMax(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.destacado || 999) - (b.destacado || 999) || desempate(a, b);
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
      p.nombre, catDe(p.cat)?.nombre, FORMAS[p.forma], escaleraDe(p.escalera)?.nombre, p.desc, 'pileta piscina',
      ...p.opc.flatMap(o => [`${o.largo}x${o.ancho}`, `${fmtM(o.largo)}x${fmtM(o.ancho)}`, `${fmtM(o.largo)} x ${fmtM(o.ancho)}`]),
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => textoDe(p).includes(w));

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
  const palabras = norm(q).replace(/\s*[x×]\s*/g, 'x').split(' ').filter(Boolean);
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
  KEY: 'piletasberenice_cart',
  clave: (id, opc) => `${id}|${opc}`,
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin almacenamiento */ }
    if (typeof document !== 'undefined') document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1, { opc } = {}) {
    const o = opcDe(producto, opc);
    const items = this.get();
    const k = this.clave(producto.id, o.id);
    const existing = items.find(i => this.clave(i.id, i.opc) === k);
    if (existing) existing.qty = Math.min(existing.qty + qty, MAX_POR_LINEA);
    else items.push({ id: producto.id, opc: o.id, qty: Math.min(qty, MAX_POR_LINEA) });
    this.save(items);
  },
  setQty(k, qty) {
    const items = this.get();
    const it = items.find(i => this.clave(i.id, i.opc) === k);
    if (!it) return;
    it.qty = Math.max(1, Math.min(qty, MAX_POR_LINEA));
    this.save(items);
  },
  remove(k) { this.save(this.get().filter(i => this.clave(i.id, i.opc) !== k)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  lineas() {
    return this.get().map(i => {
      const p = getProducto(i.id);
      if (!p) return null;
      const o = opcDe(p, i.opc);
      return { ...i, clave: this.clave(i.id, i.opc), producto: p, opcion: o, unitario: o.precio };
    }).filter(Boolean);
  },
  total() { return this.lineas().reduce((s, l) => s + l.unitario * l.qty, 0); },
};

const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let revealsListos = false;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const paginaCatalogo = () => document.body.dataset.catalogo || 'catalogo.html';
const urlProducto = (id, opc) => `${paginaCatalogo()}?producto=${encodeURIComponent(id)}${opc ? `&medida=${encodeURIComponent(opc)}` : ''}`;

const ICONOS = {
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  basura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  regla: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h18M3 8v8M21 8v8M7 10.5v3M11 10.5v3M15 10.5v3"/></svg>',
  casco: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M14 6a6 6 0 0 1 6 6v3M4 15v-3a6 6 0 0 1 6-6"/><rect x="2" y="15" width="20" height="4" rx="1"/></svg>',
  bomba: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/><circle cx="12" cy="12" r="2.5"/></svg>',
  filtro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h18l-7 8.5V19l-4 2v-8.5z"/></svg>',
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

function precioHTML(p) {
  return `<p class="prod-precio"><span class="prod-desde">desde</span> <strong>${formatearPrecio(precioDesde(p))}</strong></p>`;
}

function cardHTML(p, { patio = null } = {}) {
  const mejor = patio ? mejorOpcion(p, patio) : null;
  const cota = mejor ? `Entra la de ${medidaTxt(p, mejor)}` : cotaCorta(p);
  const opc = mejor ? mejor.id : '';
  return `<article class="prod" data-id="${esc(p.id)}" data-animate="subir" style="opacity:0;transform:translateY(40px)">
    <div class="prod-media">
      <a class="prod-foto" href="${esc(urlProducto(p.id, opc))}" data-ver="${esc(p.id)}"${opc ? ` data-opc="${esc(opc)}"` : ''} aria-label="Ver ${esc(p.nombre)}" tabindex="-1"><img src="${esc(p.img)}" alt="${esc(p.nombre)}, ${esc(FORMAS[p.forma].toLowerCase())} con ${esc(escaleraDe(p.escalera)?.nombre.toLowerCase())}" width="900" height="900" decoding="async"></a>
      <div class="prod-sellos"><span class="badge badge--forma">${esc(escaleraDe(p.escalera)?.nombre)}</span></div>
    </div>
    <div class="prod-body">
      <p class="prod-meta">${esc(FORMAS[p.forma])} · ${p.opc.length} ${p.opc.length === 1 ? 'medida' : 'medidas'}</p>
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      <p class="prod-cota">${ICONOS.regla}<span>${esc(cota)}</span></p>
      ${precioHTML(p)}
      <div class="prod-actions">
        <button type="button" class="prod-add" data-ver="${esc(p.id)}"${opc ? ` data-opc="${esc(opc)}"` : ''} aria-label="Elegir medida: ${esc(p.nombre)}">${ICONOS.regla}<span>Elegir medida</span></button>
      </div>
    </div>
  </article>`;
}

function mosHTML(p, grande) {
  return `<article class="mos${grande ? ' mos--grande' : ''}" data-animate="subir" style="opacity:0;transform:translateY(40px)">
    <a class="mos-foto" href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="${esc(p.nombre)}, ${esc(FORMAS[p.forma].toLowerCase())}" width="900" height="900" decoding="async"></a>
    <div class="prod-sellos"><span class="badge badge--forma">${esc(escaleraDe(p.escalera)?.nombre)}</span></div>
    <div class="mos-body">
      <div class="mos-txt">
        <h3 class="mos-nombre">${esc(p.nombre)}</h3>
        <p class="mos-dato">${esc(cotaCorta(p))}</p>
        <p class="mos-dato">desde <strong>${formatearPrecio(precioDesde(p))}</strong></p>
      </div>
      <button type="button" class="mos-add" data-ver="${esc(p.id)}" aria-label="Elegir medida: ${esc(p.nombre)}">${ICONOS.regla}</button>
    </div>
  </article>`;
}

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.07, 0.6);
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
  const catActual = new URLSearchParams(location.search).get('cat');
  $('[data-menu-cats]', cont).innerHTML = CATEGORIAS.map(c => {
    const n = Tienda.contar({ cat: c.id });
    return `<li><a href="${paginaCatalogo()}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="900" height="900" loading="lazy"><span><strong>${esc(c.nombre)}</strong><small>${n} ${n === 1 ? 'modelo' : 'modelos'} · ${esc(c.bajada)}</small></span></a></li>`;
  }).join('');
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
  $$('[data-cuenta-cat]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.cuentaCat });
    el.textContent = `${n} ${n === 1 ? 'modelo' : 'modelos'}`;
  });
  $$('[data-rango-cat]').forEach(el => {
    const { items } = Tienda.consultar({ filtros: { cat: el.dataset.rangoCat }, limite: TOPE_CONSULTA });
    if (!items.length) return;
    const min = Math.min(...items.map(largoMin)), max = Math.max(...items.map(largoMax));
    el.textContent = `de ${fmtM(min)} a ${fmtM(max)} m`;
  });
  $$('[data-total]').forEach(el => { el.textContent = Tienda.contar({}); });
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
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
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
        <h2>Tu pileta <span class="drawer-cuenta" data-drawer-cuenta></span></h2>
        <button type="button" class="icon-btn drawer-close" aria-label="Cerrar el carrito">${ICONOS.cerrar}</button>
      </header>
      <p class="drawer-aviso">${ICONOS.casco}<span>Colocación, bomba y filtro incluidos en cada pileta</span></p>
      <div class="drawer-body" data-drawer-body></div>
      <footer class="drawer-foot" data-drawer-foot>
        <p class="drawer-total"><span>Total</span><strong data-drawer-total>$0</strong></p>
        <button type="button" class="btn btn--cta btn--block" data-finalizar>Finalizar compra</button>
        <a class="btn btn--wsp btn--block" data-pedido-wsp href="${waLink(`Hola! Quiero hacer un pedido desde la web de ${MARCA}.`)}" target="_blank" rel="noopener">${ICONOS.wsp}<span>Enviar el pedido por WhatsApp</span></a>
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
      body.innerHTML = `<div class="drawer-vacio">${ICONOS.carrito}<p><strong>Todavía no elegiste tu pileta.</strong> Mirá los modelos rectangulares, curvos y angostos, cada uno en varias medidas.</p><a class="btn btn--cta" href="${paginaCatalogo()}">Volver al catálogo</a></div>`;
      return;
    }
    body.innerHTML = `<ul class="drawer-lineas">${lineas.map(l => `
      <li class="linea" data-clave="${esc(l.clave)}">
        <img src="${esc(l.producto.img)}" alt="" width="900" height="900">
        <div class="linea-info">
          <p class="linea-nombre">${esc(l.producto.nombre)}</p>
          <p class="linea-var">${esc(medidaTxt(l.producto, l.opcion))} · ${fmtM(l.opcion.prof)} m de profundidad</p>
          <div class="linea-acciones">
            <div class="stepper stepper--chico">
              <button type="button" data-linea-paso="-1" aria-label="Restar uno"${l.qty <= 1 ? ' disabled' : ''}>${ICONOS.menos}</button>
              <output aria-label="Cantidad">${l.qty}</output>
              <button type="button" data-linea-paso="1" aria-label="Sumar uno"${l.qty >= MAX_POR_LINEA ? ' disabled' : ''}>${ICONOS.mas}</button>
            </div>
            <button type="button" class="linea-quitar" data-linea-quitar aria-label="Quitar ${esc(l.producto.nombre)}">${ICONOS.basura}</button>
          </div>
        </div>
        <p class="linea-precio">${formatearPrecio(l.unitario * l.qty)}</p>
      </li>`).join('')}</ul>`;
    $('[data-drawer-total]', drawer).textContent = formatearPrecio(Cart.total());
    const texto = [`Hola! Quiero hacer este pedido en ${MARCA}:`, ...lineas.map(l => `• ${l.qty} x ${l.producto.nombre} de ${medidaTxt(l.producto, l.opcion)} ${formatearPrecio(l.unitario * l.qty)}`), `Total: ${formatearPrecio(Cart.total())}`].join('\n');
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
    const it = Cart.get().find(i => Cart.clave(i.id, i.opc) === k);
    if (!it) return;
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) { Cart.setQty(k, it.qty + Number(paso.dataset.lineaPaso)); return; }
    if (e.target.closest('[data-linea-quitar]')) Cart.remove(k);
  });
  $('[data-finalizar]', drawer).addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (!drawer.hidden) pintar(); });
  $$('[data-abrir-carrito]').forEach(b => b.addEventListener('click', abrir));
}

function planoHTML(p, o, { cotas = true } = {}) {
  const ratio = Math.max(1, (o.largo + 0.6) / (o.ancho + 0.6));
  return `<div class="plano-caja"><div class="plano" style="--ratio:${ratio.toFixed(3)}">
    ${cotas ? `<span class="plano-cota plano-cota--h">${fmtM(o.largo)} m</span><span class="plano-cota plano-cota--v">${fmtM(o.ancho)} m</span>` : ''}
    <div class="plano-pileta" data-forma="${esc(p.forma)}"><span>${fmtM(o.prof)} m de prof.</span></div>
  </div></div>`;
}

function initVistaRapida() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="qv-bd" id="qv" hidden>
      <div class="qv" role="dialog" aria-modal="true" aria-label="Detalle de la pileta">
        <button type="button" class="icon-btn qv-close" aria-label="Cerrar">${ICONOS.cerrar}</button>
        <div class="qv-media">
          <div class="qv-foto"><img src="images/p-romana.webp" alt="" width="900" height="900" data-qv-img></div>
          <div class="qv-plano" data-qv-plano></div>
        </div>
        <div class="qv-info" data-qv-info></div>
      </div>
    </div>`);
  const bd = $('#qv');
  const modal = $('.qv', bd);
  const info = $('[data-qv-info]', bd);
  const img = $('[data-qv-img]', bd);
  const plano = $('[data-qv-plano]', bd);
  let opener = null;
  let estado = null;

  const pintar = () => {
    const p = estado.p;
    const o = opcDe(p, estado.opc);
    const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
    if (rel.length < 3) rel.push(...Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
    info.innerHTML = `
      <p class="qv-meta">${esc(FORMAS[p.forma])} · ${esc(escaleraDe(p.escalera)?.nombre)}</p>
      <h2 class="qv-nombre">${esc(p.nombre)}</h2>
      <p class="qv-precio"><strong>${formatearPrecio(o.precio)}</strong><span>${esc(medidaTxt(p, o))}, colocada</span></p>
      <p class="qv-desc">${esc(p.desc)}</p>
      <fieldset class="opciones"><legend>Medida</legend><div class="chips">${p.opc.map(x => `<label class="chip chip--medida"><input type="radio" name="qv-opc" value="${esc(x.id)}"${x.id === o.id ? ' checked' : ''}><span>${esc(medidaTxt(p, x))}<small>${formatearPrecio(x.precio)}</small></span></label>`).join('')}</div></fieldset>
      <p class="qv-incluye"><span>${ICONOS.casco}Colocación</span><span>${ICONOS.bomba}Bomba</span><span>${ICONOS.filtro}Filtrado</span></p>
      <div class="qv-acciones">
        <button type="button" class="btn btn--cta" data-qv-add>Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
      </div>
      <a class="btn btn--wsp" href="${esc(waLink(`Hola! Quiero consultar por la ${p.nombre} de ${medidaTxt(p, o)}.`))}" target="_blank" rel="noopener">${ICONOS.wsp}<span>Consultar por esta pileta</span></a>
      <dl class="qv-ficha">
        <div><dt>Medida</dt><dd>${esc(medidaTxt(p, o))}</dd></div>
        <div><dt>Profundidad</dt><dd>${fmtM(o.prof)} m</dd></div>
        <div><dt>Capacidad aproximada</dt><dd>${litros(p, o).toLocaleString('es-AR')} litros</dd></div>
        <div><dt>Escalera</dt><dd>${esc(escaleraDe(p.escalera)?.nombre)}</dd></div>
      </dl>
      <p class="qv-legal">Foto ilustrativa. Medidas, capacidad y precios de muestra.</p>
      ${rel.length ? `<div class="qv-rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><a href="${esc(urlProducto(r.id))}" data-ver="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="900" height="900"><span>${esc(r.nombre)}</span><strong>desde ${formatearPrecio(precioDesde(r))}</strong></a></li>`).join('')}</ul></div>` : ''}`;
    img.src = p.img;
    img.alt = p.nombre;
    plano.innerHTML = planoHTML(p, o);
    let ld = document.getElementById('ld-producto');
    if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-producto'; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, category: catDe(p.cat)?.nombre,
      image: new URL(p.img, location.href).href, brand: { '@type': 'Brand', name: MARCA },
      offers: p.opc.map(x => ({ '@type': 'Offer', name: medidaTxt(p, x), priceCurrency: 'ARS', price: x.precio, availability: 'https://schema.org/InStock', url: new URL(urlProducto(p.id, x.id), location.href).href })),
    });
  };

  const agregar = () => {
    const p = estado.p;
    const o = opcDe(p, estado.opc);
    Cart.add(p, 1, { opc: o.id });
    showToast(`${p.nombre} de ${medidaTxt(p, o)} al carrito`);
  };

  const abrir = (id, { opc = null } = {}) => {
    const p = getProducto(id);
    if (!p) return;
    estado = { p, opc: p.opc.some(x => x.id === opc) ? opc : p.opc[0].id };
    if (bd.hidden) opener = document.activeElement;
    pintar();
    bd.hidden = false;
    bloquear(true);
    requestAnimationFrame(() => requestAnimationFrame(() => bd.classList.add('open')));
    modal.scrollTop = 0;
    bd.querySelector('.qv-close').focus();
    const url = new URL(location.href);
    url.searchParams.set('producto', id);
    url.searchParams.set('medida', estado.opc);
    window.history.replaceState(null, '', url);
  };
  const cerrar = () => {
    bd.classList.remove('open');
    bd.hidden = true;
    bloquear(false);
    const url = new URL(location.href);
    url.searchParams.delete('producto');
    url.searchParams.delete('medida');
    window.history.replaceState(null, '', url);
    opener?.focus?.();
  };
  abrirVista = abrir;
  bd.addEventListener('click', e => { if (e.target === bd) cerrar(); });
  bd.querySelector('.qv-close').addEventListener('click', cerrar);
  bd.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); trampaFoco(modal, e); });
  info.addEventListener('change', e => {
    if (e.target.name !== 'qv-opc') return;
    estado.opc = e.target.value;
    pintar();
    info.querySelector(`input[name="qv-opc"][value="${window.CSS.escape(estado.opc)}"]`)?.focus();
    const url = new URL(location.href);
    url.searchParams.set('medida', estado.opc);
    window.history.replaceState(null, '', url);
  });
  info.addEventListener('click', e => {
    if (e.target.closest('[data-qv-add]')) { agregar(); cerrar(); return; }
    if (e.target.closest('[data-qv-comprar]')) { agregar(); cerrar(); abrirCarrito(); }
  });
  const params = new URLSearchParams(location.search);
  const inicial = params.get('producto');
  if (inicial && getProducto(inicial)) abrir(inicial, { opc: params.get('medida') });
}

function initAccionesProducto() {
  document.addEventListener('click', e => {
    const ver = e.target.closest('[data-ver]');
    if (!ver) return;
    e.preventDefault();
    abrirVista(ver.dataset.ver, { opc: ver.dataset.opc || null });
    if (ver.classList.contains('prod-add')) { ver.classList.remove('ok'); void ver.offsetWidth; ver.classList.add('ok'); }
  });
}

function initHomeGrid() {
  const grid = document.querySelector('[data-home-grid]');
  if (!grid) return;
  const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: Number(grid.dataset.homeGrid) || 6 });
  grid.innerHTML = items.map(p => cardHTML(p)).join('');
}

function initMosaico() {
  const grid = document.querySelector('[data-mosaico]');
  if (!grid) return;
  const ids = grid.dataset.mosaico.split(',').map(s => s.trim()).filter(Boolean);
  const { items } = Tienda.consultar({ filtros: { ids }, orden: 'destacados', limite: 8 });
  const orden = ids.map(id => items.find(p => p.id === id)).filter(Boolean);
  grid.innerHTML = orden.map((p, i) => mosHTML(p, i === 0)).join('');
}

function initMedidor() {
  const sec = document.querySelector('[data-medidor]');
  if (!sec) return;
  const campos = {
    l: { r: $('#med-largo-r', sec), n: $('#med-largo', sec), min: 3, max: 20 },
    a: { r: $('#med-ancho-r', sec), n: $('#med-ancho', sec), min: 2, max: 14 },
  };
  const plano = $('[data-plano]', sec);
  const vereda = $('[data-plano-vereda]', sec);
  const pileta = $('[data-plano-pileta]', sec);
  const cotaH = $('[data-cota-h]', sec);
  const cotaV = $('[data-cota-v]', sec);
  const txt = $('[data-plano-txt]', sec);
  const lista = $('[data-medidor-lista]', sec);
  const cuenta = $('[data-medidor-cuenta]', sec);
  const vacio = $('[data-medidor-vacio]', sec);
  const ver = $('[data-medidor-ver]', sec);
  const wsp = $('[data-medidor-wsp]', sec);
  const estado = { l: 9, a: 6, m: 1 };
  const total = Tienda.contar({});

  const pintar = () => {
    const L = Math.max(estado.l, estado.a), A = Math.min(estado.l, estado.a);
    plano.style.setProperty('--ratio', (L / A).toFixed(3));
    cotaH.textContent = `${fmtM(L)} m`;
    cotaV.textContent = `${fmtM(A)} m`;
    const mx = (estado.m / L) * 100, my = (estado.m / A) * 100;
    Object.assign(vereda.style, { left: `${mx}%`, right: `${mx}%`, top: `${my}%`, bottom: `${my}%` });
    vereda.hidden = mx >= 50 || my >= 50;
    const { items } = Tienda.consultar({ filtros: { patio: estado }, orden: 'destacados', limite: TOPE_CONSULTA });
    const res = items.map(p => ({ p, o: mejorOpcion(p, estado) })).filter(r => r.o);
    const mejor = res.reduce((a, b) => (!a || b.o.largo * b.o.ancho > a.o.largo * a.o.ancho ? b : a), null);
    if (mejor) {
      const w = (mejor.o.largo / L) * 100, h = (mejor.o.ancho / A) * 100;
      Object.assign(pileta.style, { width: `${w}%`, height: `${h}%`, left: `${(100 - w) / 2}%`, top: `${(100 - h) / 2}%` });
      pileta.dataset.forma = mejor.p.forma;
      pileta.hidden = false;
      $('span', pileta).textContent = w > 22 && h > 18 ? medidaTxt(mejor.p, mejor.o) : '';
      txt.innerHTML = `La más grande que entra: <strong>${esc(mejor.p.nombre)} de ${esc(medidaTxt(mejor.p, mejor.o))}</strong>, con ${fmtM(estado.m)} m de vereda alrededor.`;
    } else {
      pileta.hidden = true;
      txt.textContent = `Con ${fmtM(estado.m)} m de vereda alrededor no entra ningún modelo en ese espacio.`;
    }
    cuenta.textContent = res.length ? `${res.length === total ? 'Entran todos los modelos' : `Entran ${res.length} de ${total} modelos`}${res.length > 4 ? ' · las 4 más grandes' : ''}` : 'No entra ningún modelo';
    const top = [...res].sort((x, y) => y.o.largo * y.o.ancho - x.o.largo * x.o.ancho || (x.p.destacado || 99) - (y.p.destacado || 99)).slice(0, 4);
    lista.innerHTML = top.map(r => {
      const ratio = r.o.largo / r.o.ancho;
      const w = 40, h = Math.max(12, Math.round(w / ratio));
      return `<li><button type="button" data-ver="${esc(r.p.id)}" data-opc="${esc(r.o.id)}"><span class="mini-plano" aria-hidden="true"><i data-forma="${esc(r.p.forma)}" style="width:${w}px;height:${h}px"></i></span><span><strong>${esc(r.p.nombre)}</strong><small>${esc(medidaTxt(r.p, r.o))} · ${formatearPrecio(r.o.precio)}</small></span></button></li>`;
    }).join('');
    vacio.hidden = res.length > 0;
    ver.hidden = !res.length;
    ver.href = `${paginaCatalogo()}?patio=${estado.l}x${estado.a}&vereda=${estado.m}`;
    $('span', ver).textContent = res.length === 1 ? 'Ver el modelo que entra' : `Ver los ${res.length} que entran`;
    wsp.href = waLink(`Hola! Tengo un espacio de ${fmtM(estado.l)} × ${fmtM(estado.a)} m para la pileta. ¿Qué modelo me recomiendan?`);
  };

  Object.entries(campos).forEach(([k, c]) => {
    const fijar = (v, desde) => {
      const n = Math.min(c.max, Math.max(c.min, v));
      estado[k] = Math.round(n * 2) / 2;
      if (desde !== c.r) c.r.value = estado[k];
      if (desde !== c.n) c.n.value = estado[k];
      pintar();
    };
    c.r.addEventListener('input', () => fijar(Number(c.r.value), c.r));
    c.n.addEventListener('change', () => {
      const v = parseFloat(String(c.n.value).replace(',', '.'));
      if (Number.isFinite(v)) fijar(v, null); else c.n.value = estado[k];
    });
    c.n.addEventListener('input', () => {
      const v = parseFloat(String(c.n.value).replace(',', '.'));
      if (Number.isFinite(v) && v >= c.min && v <= c.max) fijar(v, c.n);
    });
  });
  $$('input[name="med-vereda"]', sec).forEach(r => r.addEventListener('change', () => { estado.m = Number(r.value); pintar(); }));
  pintar();
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
  const patioL = $('#f-patio-l', app);
  const patioA = $('#f-patio-a', app);
  const patioV = $('#f-patio-v', app);
  const miga = document.querySelector('[data-miga]');

  $('[data-f-grupo="cat"]', panel).innerHTML = CATEGORIAS.map(c => `<label class="chk"><input type="checkbox" data-f="cat" value="${c.id}"><span>${esc(c.nombre)}</span><small>${Tienda.contar({ cat: c.id })}</small></label>`).join('');
  $('[data-f-grupo="tam"]', panel).innerHTML = [['', 'Todos los largos'], ...Object.entries(TAMANOS).map(([k, v]) => [k, v[2]])].map(([k, t]) => `<label class="chk"><input type="radio" name="tam" data-f="tam" value="${k}"><span>${esc(t)}</span></label>`).join('');
  $('[data-f-grupo="esc"]', panel).innerHTML = ESCALERAS.map(e => `<label class="chk"><input type="checkbox" data-f="esc" value="${e.id}"><span>${esc(e.nombre)}</span><small>${Tienda.contar({ esc: e.id })}</small></label>`).join('');
  $('[data-f-grupo="precio"]', panel).innerHTML = [['', 'Todos los precios'], ...Object.entries(PRECIOS).map(([k, v]) => [k, v[2]])].map(([k, t]) => `<label class="chk"><input type="radio" name="precio" data-f="precio" value="${k}"><span>${esc(t)}</span></label>`).join('');
  patioV.innerHTML = VEREDAS.map(v => `<option value="${v}">${fmtM(v)} m de vereda</option>`).join('');
  orden.innerHTML = Object.entries(ORDENES).map(([k, t]) => `<option value="${k}">${esc(t)}</option>`).join('');

  const params = new URLSearchParams(location.search);
  const validos = (v, lista) => String(v || '').split(',').filter(x => lista.includes(x));
  const estado = {
    q: (params.get('q') || '').slice(0, 60),
    cat: validos(params.get('cat'), CATEGORIAS.map(c => c.id)),
    esc: validos(params.get('esc'), ESCALERAS.map(e => e.id)),
    tam: TAMANOS[params.get('tam')] ? params.get('tam') : '',
    precio: PRECIOS[params.get('precio')] ? params.get('precio') : '',
    patio: leerPatio(params.get('patio'), params.get('vereda')),
    orden: ORDENES[params.get('orden')] ? params.get('orden') : 'destacados',
  };
  let cursor = null;
  let mostrados = 0;

  const filtrosDe = () => ({ cat: estado.cat, esc: estado.esc, tam: estado.tam, precio: estado.precio, patio: estado.patio });
  const patioTxt = pt => `Entra en ${fmtM(pt.l)} × ${fmtM(pt.a)} m`;
  const sincronizarUI = () => {
    buscador.value = estado.q;
    orden.value = estado.orden;
    $$('input[data-f="cat"]', panel).forEach(i => { i.checked = estado.cat.includes(i.value); });
    $$('input[data-f="esc"]', panel).forEach(i => { i.checked = estado.esc.includes(i.value); });
    $$('input[data-f="tam"]', panel).forEach(i => { i.checked = i.value === estado.tam; });
    $$('input[data-f="precio"]', panel).forEach(i => { i.checked = i.value === estado.precio; });
    patioL.value = estado.patio ? estado.patio.l : '';
    patioA.value = estado.patio ? estado.patio.a : '';
    patioV.value = String(estado.patio ? estado.patio.m : 1);
    if (miga) {
      const c = estado.cat.length === 1 ? catDe(estado.cat[0]) : null;
      miga.innerHTML = c ? `<a href="${paginaCatalogo()}">Modelos</a><span aria-hidden="true">/</span><span aria-current="page">${esc(c.nombre)}</span>` : '<span aria-current="page">Modelos</span>';
    }
    $$('[data-menu-cats] a').forEach(a => {
      const cat = new URL(a.href).searchParams.get('cat');
      if (estado.cat.length === 1 && cat === estado.cat[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['q', 'cat', 'esc', 'tam', 'precio', 'patio', 'vereda', 'orden'].forEach(k => u.searchParams.delete(k));
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.cat.length) u.searchParams.set('cat', estado.cat.join(','));
    if (estado.esc.length) u.searchParams.set('esc', estado.esc.join(','));
    if (estado.tam) u.searchParams.set('tam', estado.tam);
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.patio) { u.searchParams.set('patio', `${estado.patio.l}x${estado.patio.a}`); u.searchParams.set('vereda', String(estado.patio.m)); }
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintarActivos = () => {
    const chips = [
      ...(estado.q ? [['q', '', `«${estado.q}»`]] : []),
      ...estado.cat.map(c => ['cat', c, catDe(c).nombre]),
      ...estado.esc.map(e => ['esc', e, escaleraDe(e).nombre]),
      ...(estado.tam ? [['tam', '', TAMANOS[estado.tam][2]]] : []),
      ...(estado.precio ? [['precio', '', PRECIOS[estado.precio][2]]] : []),
      ...(estado.patio ? [['patio', '', patioTxt(estado.patio)]] : []),
    ];
    chipsActivos.innerHTML = chips.length ? chips.map(([k, v, t]) => `<button type="button" class="activo" data-quitar="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICONOS.cerrar}</button>`).join('') + '<button type="button" class="activos-limpiar" data-limpiar>Limpiar filtros</button>' : '';
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    cursor = res.cursor;
    if (!agregar) { grid.innerHTML = ''; mostrados = 0; }
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, { patio: estado.patio })).join(''));
    mostrados += res.items.length;
    verMas.hidden = !cursor;
    vacio.hidden = mostrados > 0;
    const total = estado.q ? null : Tienda.contar(filtrosDe());
    contador.innerHTML = mostrados ? (total != null ? `<strong>${total}</strong> ${total === 1 ? 'modelo' : 'modelos'}` : `<strong>${mostrados}${cursor ? '+' : ''}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»`) : '';
    if (cuentaRes) cuentaRes.textContent = total != null ? total : `${mostrados}${cursor ? '+' : ''}`;
    $('[data-vacio-q]', vacio).textContent = estado.patio && !estado.q ? `Con ${fmtM(estado.patio.m)} m de vereda, ningún modelo entra en ${fmtM(estado.patio.l)} × ${fmtM(estado.patio.a)} m con esos filtros.` : estado.q ? `No encontramos «${estado.q}» con esos filtros.` : 'No hay modelos con esa combinación de filtros.';
    pintarActivos();
    revelarNuevos(grid);
    refrescarScroll();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => { Object.assign(estado, { q: '', cat: [], esc: [], tam: '', precio: '', patio: null }); aplicar(); };

  panel.addEventListener('change', e => {
    const f = e.target.dataset.f;
    if (!f) return;
    if (f === 'cat' || f === 'esc') estado[f] = $$(`input[data-f="${f}"]:checked`, panel).map(i => i.value);
    if (f === 'tam') estado.tam = e.target.value;
    if (f === 'precio') estado.precio = e.target.value;
    aplicar();
  });
  $('[data-patio-form]', panel).addEventListener('submit', e => {
    e.preventDefault();
    const pt = leerPatio(`${patioL.value}x${patioA.value}`, patioV.value);
    if (!pt) { showToast('Poné el largo y el ancho del espacio, en metros.'); (patioL.value ? patioA : patioL).focus(); return; }
    estado.patio = pt;
    aplicar();
  });
  $('[data-patio-quitar]', panel).addEventListener('click', () => { estado.patio = null; aplicar(); });
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
      else if (k === 'cat' || k === 'esc') estado[k] = estado[k].filter(v => v !== quitar.dataset.valor);
      else if (k === 'tam') estado.tam = '';
      else if (k === 'precio') estado.precio = '';
      else if (k === 'patio') estado.patio = null;
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
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.08, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.eyebrow'), { y: 16, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 22, opacity: 0, duration: 1 }, 0.42)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55)
    .from(hero.querySelectorAll('.hero-incluye li'), { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.75);
  if (typeof ScrollTrigger !== 'undefined') {
    const foto = hero.querySelector('[data-parallax]');
    if (foto) gsap.to(foto, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
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
  initHomeGrid();
  initMosaico();
  initMedidor();
  initCatalogo();
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
