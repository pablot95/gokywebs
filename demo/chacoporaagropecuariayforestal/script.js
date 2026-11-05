const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493644502808';
const MARCA = 'Chaco Porá';
const POR_PAGINA = 16;
const TOPE_LINEA = 9999;
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
  { id: 'carbon', nombre: 'Carbón vegetal', grupo: 'carbon', img: 'images/p-carbon-bolsa.webp' },
  { id: 'lena', nombre: 'Leña mezcla', grupo: 'lena', img: 'images/p-lena-tonelada.webp' },
  { id: 'quebracho', nombre: 'Postes de quebracho colorado', grupo: 'postes', img: 'images/p-quebracho-poste.webp' },
  { id: 'guayacan', nombre: 'Postes de guayacán', grupo: 'postes', img: 'images/p-guayacan-poste.webp' },
];
const USOS = [
  { id: 'parrilla', nombre: 'Parrilla y asador' },
  { id: 'hogar', nombre: 'Hogar, salamandra y horno' },
  { id: 'campo', nombre: 'Alambrados y corrales' },
  { id: 'reventa', nombre: 'Reventa y comercios' },
];
const VENTAS = [
  { id: 'unidad', nombre: 'Por unidad, bolsa o atado' },
  { id: 'granel', nombre: 'A granel o por carga' },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'nombre', nombre: 'Nombre A-Z' },
  { id: 'categoria', nombre: 'Por categoría' },
];

const PRODUCTOS = [
  { id: 'carbon-bolsa', nombre: 'Carbón vegetal · bolsa de 5 kg', cat: 'carbon', img: 'p-carbon-bolsa.webp', unidad: ['bolsa', 'bolsas'], usos: ['parrilla', 'reventa'], venta: 'unidad', rango: 1, cantidades: [10, 50, 100],
    ficha: ['5 kg aprox.', 'Bolsa de papel', 'Leña dura del monte'],
    desc: 'Carbón de leña dura del monte chaqueño en la bolsa de papel de 5 kg, la que va directo a la parrilla o a la góndola. Por cantidad, para almacenes, carnicerías y despensas.',
    claves: ['carbon', 'carbón', 'bolsa', '5 kg', 'asado', 'parrilla', 'almacen', 'carniceria'] },
  { id: 'quebracho-poste', nombre: 'Poste labrado de quebracho colorado', cat: 'quebracho', img: 'p-quebracho-poste.webp', unidad: ['poste', 'postes'], usos: ['campo'], venta: 'unidad', rango: 2, cantidades: [10, 50, 100],
    medidas: ['2,20 m', '2,40 m', '2,70 m'],
    ficha: ['Labrado', 'Madera dura', 'Para alambrados'],
    desc: 'Poste de quebracho colorado labrado: madera dura y pesada, la de los alambrados de campo de toda la vida. Elegí el largo y la cantidad.',
    claves: ['poste', 'postes', 'quebracho', 'colorado', 'labrado', 'alambrado', 'campo', 'cerco'] },
  { id: 'lena-tonelada', nombre: 'Leña mezcla por tonelada', cat: 'lena', img: 'p-lena-tonelada.webp', unidad: ['tonelada', 'toneladas'], usos: ['hogar', 'parrilla', 'reventa'], venta: 'granel', rango: 3, cantidades: [1, 5, 10],
    ficha: ['Por tonelada', 'Trozada', 'Para hornos, salamandras y parrillas'],
    desc: 'Leña mezcla de monte, trozada, para hornos de barro, salamandras, hogares y parrillas. Se cotiza por tonelada según el destino.',
    claves: ['lena', 'leña', 'mezcla', 'tonelada', 'granel', 'salamandra', 'horno', 'hogar', 'pizzeria', 'panaderia'] },
  { id: 'guayacan-poste', nombre: 'Poste labrado de guayacán', cat: 'guayacan', img: 'p-guayacan-poste.webp', unidad: ['poste', 'postes'], usos: ['campo'], venta: 'unidad', rango: 4, cantidades: [10, 50, 100],
    medidas: ['2,20 m', '2,40 m'],
    ficha: ['Labrado', 'Madera dura', 'Para alambrados y corrales'],
    desc: 'Poste de guayacán labrado, otra de las maderas duras del monte chaqueño para alambrados y corrales. Elegí el largo y la cantidad.',
    claves: ['poste', 'postes', 'guayacan', 'guayacán', 'labrado', 'alambrado', 'corral', 'campo'] },
  { id: 'carbon-bolson', nombre: 'Carbón vegetal · bolsón de rafia', cat: 'carbon', img: 'p-carbon-bolson.webp', unidad: ['bolsón', 'bolsones'], usos: ['parrilla', 'reventa'], venta: 'unidad', rango: 5, cantidades: [10, 50, 100],
    ficha: ['20 kg aprox.', 'Bolsa de rafia', 'Para parrillas y restaurantes'],
    desc: 'El bolsón de rafia para el que usa mucho carbón: parrillas, restaurantes, rotiserías y clubes.',
    claves: ['carbon', 'carbón', 'bolson', 'rafia', '20 kg', 'parrilla', 'restaurante'] },
  { id: 'lena-atado', nombre: 'Leña mezcla · atado', cat: 'lena', img: 'p-lena-atado.webp', unidad: ['atado', 'atados'], usos: ['hogar', 'parrilla', 'reventa'], venta: 'unidad', rango: 6, cantidades: [10, 30, 60],
    ficha: ['10 kg aprox.', 'Atado con soga', 'Para hogar y parrilla'],
    desc: 'Leña mezcla trozada y atada, cómoda para vender en el comercio o para el fin de semana: hogar, estufa o parrilla.',
    claves: ['lena', 'leña', 'atado', 'mezcla', 'hogar', 'estufa', 'parrilla'] },
  { id: 'quebracho-esquinero', nombre: 'Esquinero de quebracho colorado', cat: 'quebracho', img: 'p-quebracho-esquinero.webp', unidad: ['esquinero', 'esquineros'], usos: ['campo'], venta: 'unidad', rango: 7, cantidades: [4, 10, 20],
    medidas: ['2,40 m', '3,00 m'],
    ficha: ['Sección gruesa', 'Para esquinas, tranqueras y torniquetes'],
    desc: 'Esquinero de quebracho colorado de sección gruesa, para las esquinas del alambrado, tranqueras y torniquetes.',
    claves: ['esquinero', 'esquineros', 'quebracho', 'colorado', 'tranquera', 'torniquete', 'alambrado', 'poste'] },
  { id: 'guayacan-punta', nombre: 'Poste de guayacán con punta', cat: 'guayacan', img: 'p-guayacan-punta.webp', unidad: ['poste', 'postes'], usos: ['campo'], venta: 'unidad', rango: 8, cantidades: [10, 50, 100],
    medidas: ['1,80 m', '2,20 m'],
    ficha: ['Rollizo con punta', 'Para cercos, corrales y huertas'],
    desc: 'Poste rollizo de guayacán con la punta hecha, para cercos, corrales y huertas.',
    claves: ['poste', 'guayacan', 'guayacán', 'punta', 'rollizo', 'cerco', 'huerta', 'corral'] },
  { id: 'carbon-granel', nombre: 'Carbón vegetal a granel · por tonelada', cat: 'carbon', img: 'p-carbon-granel.webp', unidad: ['tonelada', 'toneladas'], usos: ['reventa', 'parrilla'], venta: 'granel', rango: 9, cantidades: [1, 5, 10],
    ficha: ['Por tonelada', 'Para distribuidores y fraccionadores'],
    desc: 'Carbón vegetal a granel, por tonelada, para distribuidores y fraccionadores que embolsan con su marca.',
    claves: ['carbon', 'carbón', 'granel', 'tonelada', 'distribuidor', 'fraccionador', 'mayorista'] },
  { id: 'lena-carga', nombre: 'Leña mezcla por carga completa', cat: 'lena', img: 'p-lena-carga.webp', real: true, unidad: ['carga', 'cargas'], usos: ['hogar', 'reventa'], venta: 'granel', rango: 10, cantidades: [1, 2, 4],
    ficha: ['Acoplado o camión', 'Para leñeras, panaderías y pizzerías'],
    desc: 'Leña mezcla por carga completa de acoplado o camión, para leñeras, panaderías, pizzerías y hornos.',
    claves: ['lena', 'leña', 'carga', 'acoplado', 'camion', 'camión', 'leñera', 'panaderia', 'pizzeria'] },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const opsDe = p => (p?.medidas?.length ? p.medidas : []);

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, catDe(p.cat).nombre, ...(p.ficha || []), ...(p.medidas || []),
    ...(p.usos || []).map(u => nombreDe(USOS, u)), nombreDe(VENTAS, p.venta), ...(p.claves || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), uso = lista(f.uso), venta = lista(f.venta), grupo = lista(f.grupo), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (grupo.length && !grupo.includes(catDe(p.cat).grupo)) return false;
    if (uso.length && !uso.some(u => (p.usos || []).includes(u))) return false;
    if (venta.length && !venta.includes(p.venta)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/\s+/).filter(Boolean);
    const texto = indice.get(p.id);
    return palabras.every(w => texto.includes(w));
  }
  const posCat = id => CATEGORIAS.findIndex(c => c.id === id);
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      case 'categoria': return (a, b) => posCat(a.cat) - posCat(b.cat) || (a.rango || 999) - (b.rango || 999) || desempate(a, b);
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
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const numero = n => Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const varValida = (p, v) => { const ops = opsDe(p); return ops.includes(v) ? v : ops[0] || 'U'; };
const imgDe = p => `images/${p.img}`;
const unidadTxt = (p, n) => (n === 1 ? p.unidad[0] : p.unidad[1]);
const cantUnidad = (p, n) => `${numero(n)} ${unidadTxt(p, n)}`;
const detalleVar = (p, v) => (opsDe(p).length ? varValida(p, v) : '');
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const plural = (n, uno, varios) => `${numero(n)} ${n === 1 ? uno : varios}`;
const cantInicial = p => p?.cantidades?.[0] || 1;

const guardar = (k, v) => { try { localStorage.setItem(k, v); return true; } catch { return false; } };
const leerJSON = (k, def) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? def; } catch { return def; } };

const Cart = {
  KEY: 'chacopora_pedido',
  get() { const v = leerJSON(this.KEY, []); return Array.isArray(v) ? v : []; },
  save(items) { guardar(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, v = null, qty = 1) {
    if (!producto) return 0;
    const vv = varValida(producto, v);
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    const existing = items.find(i => i.id === producto.id && i.v === vv);
    let sumadas = n;
    if (existing) { const antes = existing.qty; existing.qty = Math.min(existing.qty + n, TOPE_LINEA); sumadas = existing.qty - antes; }
    else items.push({ id: producto.id, v: vv, qty: n });
    this.save(items);
    return sumadas;
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
  count() { return this.get().length; },
  unidades() { return this.get().reduce((s, i) => s + i.qty, 0); },
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

const DESTINO_KEY = 'chacopora_destino';
const Destino = {
  get() {
    const d = leerJSON(DESTINO_KEY, {});
    return { lugar: typeof d?.lugar === 'string' ? d.lugar.slice(0, 80) : '', entrega: d?.entrega === 'retiro' ? 'retiro' : 'envio' };
  },
  set(cambios) { guardar(DESTINO_KEY, JSON.stringify({ ...this.get(), ...cambios })); },
};

function textoPedido(items = Cart.get(), destino = Destino.get()) {
  const lineas = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return null;
    const det = detalleVar(p, i.v);
    return `• ${cantUnidad(p, i.qty)} · ${p.nombre}${det ? ` (${det})` : ''}`;
  }).filter(Boolean);
  const lugar = destino.lugar.trim();
  const entrega = destino.entrega === 'retiro'
    ? `Retiro en el campo${lugar ? ` (vengo desde ${lugar})` : ''}`
    : `Entrega en ${lugar || 'localidad a confirmar'}`;
  return `Hola! Quiero pedir una cotización a ${MARCA}:\n${lineas.join('\n')}\n${entrega}`;
}

const ICO = {
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  caja: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="m3 8 9 5 9-5M12 13v8"/></svg>',
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

const stepperHTML = (p, n = 1, sm = false) => `<div class="stepper${sm ? ' stepper--sm' : ''}" data-stepper><button type="button" data-paso="-1" aria-label="Restar">${ICO.menos}</button><output data-qty aria-label="Cantidad de ${esc(p.unidad[1])}">${numero(n)}</output><button type="button" data-paso="1" aria-label="Sumar">${ICO.mas}</button></div>`;
const pasoDe = p => (p.cantidades?.[0] >= 10 ? 5 : 1);

function medidaHTML(p, v) {
  const ops = opsDe(p);
  if (!ops.length) return '';
  if (ops.length === 1) return `<span class="medida">Largo ${esc(ops[0])}</span>`;
  const sel = varValida(p, v);
  return `<label class="medida"><span>Largo</span><select data-var aria-label="Largo de ${esc(p.nombre)}">${ops.map(o => `<option value="${esc(o)}"${o === sel ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select></label>`;
}
function badgeHTML(p) {
  if (p.real) return '<span class="prod__badge prod__badge--real">Foto real</span>';
  if (p.venta === 'granel') return '<span class="prod__badge">A granel</span>';
  if (p.medidas?.length > 1) return `<span class="prod__badge">${p.medidas.length} largos</span>`;
  return '';
}
const unidadHTML = p => `<p class="prod__unidad">${ICO.caja}Se pide por ${esc(p.unidad[0])}</p>`;

function cardHTML(p, estilo = 'repisa', anim = '') {
  const v = varValida(p, null);
  const animAttr = anim ? ` ${anim}` : '';
  const id = esc(p.id);
  const img = `<img class="prod__img" src="${esc(imgDe(p))}" alt="${esc(p.nombre)}" width="1000" height="1000" decoding="async">`;
  const nombre = `<h3 class="prod__nombre"><button type="button" data-qv="${id}">${esc(p.nombre)}</button></h3>`;
  const agregar = `<button type="button" class="btn btn--cta btn--sm prod-add" data-sumar="${id}" aria-label="Agregar ${esc(p.nombre)} al pedido">${ICO.carrito}<span>Agregar</span></button>`;
  const acciones = `<div class="prod-actions">${stepperHTML(p, cantInicial(p))}${agregar}</div>`;
  if (estilo === 'ficha') {
    const n = String(p.rango || 0).padStart(2, '0');
    return `<article class="prod prod--ficha" data-id="${id}" data-v="${esc(v)}"${animAttr}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${id}" aria-label="Ver el detalle de ${esc(p.nombre)}">${img}</button>${badgeHTML(p)}</div>
  <div class="prod__info">
    <p class="ficha__num"><span>Ficha <b>${n}</b></span><span>${esc(catDe(p.cat).nombre)}</span></p>
    ${nombre}
    <dl class="ficha__datos"><dt>Se pide por</dt><dd>${esc(p.unidad[0])}</dd><dt>Ficha</dt><dd>${esc(p.ficha.slice(0, 2).join(' · '))}</dd></dl>
    ${medidaHTML(p, v)}
    <div class="prod__pie">${acciones}</div>
  </div>
</article>`;
  }
  const lista = estilo === 'lista';
  return `<article class="prod prod--${lista ? 'lista' : 'repisa'}" data-id="${id}" data-v="${esc(v)}"${animAttr}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${id}" aria-label="Ver el detalle de ${esc(p.nombre)}">${img}</button>${badgeHTML(p)}</div>
  <div class="prod__info">
    <p class="prod__cat">${esc(catDe(p.cat).nombre)}</p>
    ${nombre}
    <p class="prod__ficha">${esc(p.ficha.slice(0, 2).join(' · '))}</p>
    ${unidadHTML(p)}
    ${medidaHTML(p, v)}
    <div class="prod__pie">${acciones}</div>
  </div>
</article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-cart-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir tu pedido de cotización, ${plural(n, 'producto', 'productos')}` : 'Abrir tu pedido de cotización'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function lineaHTML(i, p, k) {
  const key = `${esc(p.id)}|${esc(i.v)}`;
  const det = detalleVar(p, i.v);
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(imgDe(p))}" alt="" width="1000" height="1000">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">${det ? `Largo ${esc(det)} · ` : ''}${esc(catDe(p.cat).nombre)}</p>
    <div class="linea__fila">
      <div class="stepper stepper--sm"><button type="button" data-linea-paso="-1" data-key="${key}" aria-label="Restar de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><input type="number" inputmode="numeric" min="1" max="${TOPE_LINEA}" value="${i.qty}" data-linea-qty data-key="${key}" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-linea-paso="1" data-key="${key}" aria-label="Sumar a ${esc(p.nombre)}"${i.qty >= TOPE_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
      <span class="linea__u">${esc(unidadTxt(p, i.qty))}</span>
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
  const cuenta = drawer.querySelector('[data-drawer-cuenta]');
  const wsp = drawer.querySelector('[data-drawer-wsp]');
  const lugar = drawer.querySelector('[data-destino-lugar]');
  const entregas = drawer.querySelectorAll('[data-entrega]');
  const pintarWsp = () => { if (wsp) wsp.href = wspHref(textoPedido()); };
  const pintarDestino = () => {
    const d = Destino.get();
    if (lugar && document.activeElement !== lugar) lugar.value = d.lugar;
    entregas.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.entrega === d.entrega)));
    if (lugar) lugar.placeholder = d.entrega === 'retiro' ? '¿Desde dónde venís? (opcional)' : 'Localidad y provincia';
  };
  const pintar = () => {
    const items = Cart.get().map(i => ({ i, p: getProducto(i.id) })).filter(x => x.p);
    cuenta.textContent = items.length ? `· ${plural(items.length, 'producto', 'productos')}` : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    lista.innerHTML = items.map(({ i, p }, k) => lineaHTML(i, p, k)).join('');
    pintarDestino();
    pintarWsp();
  };
  lista.addEventListener('click', e => {
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const [id, v] = paso.dataset.key.split('|');
      const p = getProducto(id);
      const it = Cart.get().find(x => x.id === id && x.v === v);
      if (it && p) Cart.setQty(id, v, it.qty + Number(paso.dataset.lineaPaso) * pasoDe(p));
      lista.querySelector(`[data-linea-paso="${paso.dataset.lineaPaso}"][data-key="${window.CSS.escape(paso.dataset.key)}"]:not([disabled])`)?.focus();
      return;
    }
    const q = e.target.closest('[data-quitar]');
    if (!q) return;
    const [id, v] = q.dataset.quitar.split('|');
    const p = getProducto(id);
    Cart.remove(id, v);
    if (p) showToast(`Sacaste «${p.nombre}» del pedido`);
    drawer.querySelector('.drawer__head button')?.focus();
  });
  lista.addEventListener('change', e => {
    const inp = e.target.closest('[data-linea-qty]');
    if (!inp) return;
    const [id, v] = inp.dataset.key.split('|');
    Cart.setQty(id, v, inp.value);
  });
  lugar?.addEventListener('input', () => { Destino.set({ lugar: lugar.value.slice(0, 80) }); pintarWsp(); });
  entregas.forEach(b => b.addEventListener('click', () => { Destino.set({ entrega: b.dataset.entrega }); pintarDestino(); pintarWsp(); }));
  wsp?.addEventListener('click', () => { pintarWsp(); });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  pintar();
}

function sumar(id, v, qty, boton = null) {
  const p = getProducto(id);
  if (!p) return 0;
  const n = Cart.add(p, v, qty);
  if (!n) { showToast(`Llegaste al máximo para «${p.nombre}»`); return 0; }
  const det = detalleVar(p, v);
  showToast(`Sumaste ${cantUnidad(p, n)} · ${p.nombre}${det ? ` (${det})` : ''}`);
  if (boton && !reduceMotion) { boton.classList.remove('sumado'); void boton.offsetWidth; boton.classList.add('sumado'); }
  return n;
}
const cantidadElegida = cont => parseInt(String(cont?.querySelector('[data-qty]')?.textContent || '1').replace(/\./g, ''), 10) || 1;

function initCompras() {
  document.addEventListener('click', e => {
    const ab = e.target.closest('[data-abrir-carrito]');
    if (ab) { window.abrirCarrito?.(ab); return; }
    if (e.target.closest('#quickView')) return;
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const card = paso.closest('[data-id]');
      const p = card && getProducto(card.dataset.id);
      const out = paso.closest('[data-stepper]')?.querySelector('[data-qty]');
      if (out && p) out.textContent = numero(Math.max(1, Math.min(cantidadElegida(card) + Number(paso.dataset.paso) * pasoDe(p), TOPE_LINEA)));
      return;
    }
    const s = e.target.closest('[data-sumar]');
    if (s) {
      e.preventDefault();
      const cont = s.closest('[data-id]');
      const p = getProducto(s.dataset.sumar);
      sumar(p?.id, cont?.dataset.v || null, cantidadElegida(cont), s);
      const out = cont?.querySelector('[data-qty]');
      if (out && p) out.textContent = numero(cantInicial(p));
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      e.preventDefault();
      abrirVistaRapida(qv.dataset.qv, { previo: qv, v: qv.closest('[data-id]')?.dataset.v || null });
    }
  });
  document.addEventListener('change', e => {
    const sel = e.target.closest('select[data-var]');
    if (!sel || sel.closest('#quickView')) return;
    const card = sel.closest('[data-id]');
    const p = card && getProducto(card.dataset.id);
    if (p) card.dataset.v = varValida(p, sel.value);
  });
}

let qvEstado = null;
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement, v = null } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  const vv = varValida(p, v);
  qvEstado = { id: p.id, v: vv };
  let rel = Tienda.consultar({ filtros: { grupo: catDe(p.cat).grupo, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  const ops = opsDe(p);
  const variantes = ops.length > 1
    ? `<p class="qv__var-t">Largo: <span data-qv-var>${esc(vv)}</span></p><div class="chips" role="group" aria-label="Largo">${ops.map(o => `<button type="button" class="chip-op" data-medida="${esc(o)}" aria-pressed="${o === vv}">${esc(o)}</button>`).join('')}</div>`
    : '';
  const cantidades = `<div class="cantidades"><span>Cantidad rápida</span>${(p.cantidades || [1]).map(n => `<button type="button" class="cant-btn" data-cant="${n}">${esc(cantUnidad(p, n))}</button>`).join('')}</div>`;
  body.innerHTML = `<div class="qv__grid" data-id="${esc(p.id)}">
  <figure class="qv__foto"><img src="${esc(imgDe(p))}" alt="${esc(p.nombre)}" width="1000" height="1000"></figure>
  <div class="qv__info">
    <p class="prod__cat">${esc(catDe(p.cat).nombre)}</p>
    <h2>${esc(p.nombre)}</h2>
    <ul class="qv__ficha">${p.ficha.map(f => `<li>${esc(f)}</li>`).join('')}<li>Se pide por ${esc(p.unidad[0])}</li></ul>
    <p class="qv__desc">${esc(p.desc)}</p>
    ${variantes}
    ${cantidades}
    <div class="qv__acciones">${stepperHTML(p, cantInicial(p))}<button type="button" class="btn btn--cta" data-qv-agregar>${ICO.carrito}Agregar al pedido</button></div>
    <a class="qv__wsp" data-qv-wsp href="#" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar solo este producto por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(imgDe(r))}" alt="" width="1000" height="1000"><span>${esc(r.nombre)}</span></button></li>`).join('')}</ul></div>` : ''}`;
  pintarQvWsp();
  modal.querySelector('.qv__panel').scrollTop = 0;
  ponerJsonLdProducto(p);
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { previo, alCerrar: () => { qvEstado = null; if (PAGINA === 'catalogo') setParam('producto', null); } });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') setParam('producto', p.id);
}
function pintarQvWsp() {
  const modal = document.getElementById('quickView');
  const p = qvEstado && getProducto(qvEstado.id);
  const a = modal?.querySelector('[data-qv-wsp]');
  if (!a || !p) return;
  const n = cantidadElegida(modal.querySelector('.qv__grid'));
  a.href = wspHref(textoPedido([{ id: p.id, v: qvEstado.v, qty: n }]));
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const cont = modal.querySelector('.qv__grid');
    const out = cont.querySelector('[data-qty]');
    const med = e.target.closest('[data-medida]');
    if (med) {
      qvEstado.v = varValida(p, med.dataset.medida);
      cont.querySelectorAll('[data-medida]').forEach(b => b.setAttribute('aria-pressed', String(b === med)));
      const tv = cont.querySelector('[data-qv-var]');
      if (tv) tv.textContent = qvEstado.v;
      pintarQvWsp();
      return;
    }
    const cant = e.target.closest('[data-cant]');
    if (cant) { out.textContent = numero(Math.min(parseInt(cant.dataset.cant, 10) || 1, TOPE_LINEA)); pintarQvWsp(); return; }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      out.textContent = numero(Math.max(1, Math.min(cantidadElegida(cont) + Number(paso.dataset.paso) * pasoDe(p), TOPE_LINEA)));
      pintarQvWsp();
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    if (e.target.closest('[data-qv-agregar]')) {
      sumar(p.id, qvEstado.v, cantidadElegida(cont));
      out.textContent = numero(cantInicial(p));
      pintarQvWsp();
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(imgDe(p), location.href).href, brand: { '@type': 'Brand', name: MARCA }, category: catDe(p.cat).nombre,
  });
}

function setParam(k, v) {
  try {
    const u = new URL(location.href);
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
    else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
    window.history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? `?${u.searchParams.toString().replace(/%2C/g, ',')}` : '') + u.hash);
  } catch { return; }
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
  const otros = ['uso', 'venta', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: c.id });
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="1000" height="1000"><span><b>${esc(c.nombre)}</b><small>${plural(n, 'producto', 'productos')}</small></span></a></li>`;
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

const ANIM = {
  der: 'data-animate="der" style="opacity:0;transform:translateX(56px)"',
  subir: 'data-animate="subir" style="opacity:0;transform:translateY(40px)"',
};
function productosPorIds(ids) {
  const res = Tienda.consultar({ filtros: { ids }, limite: Math.min(ids.length, 16) });
  const orden = new Map(ids.map((id, k) => [id, k]));
  return res.items.sort((a, b) => orden.get(a.id) - orden.get(b.id));
}
function initPreviews() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const ids = (cont.getAttribute('data-preview') || '').split(',').map(s => s.trim()).filter(Boolean);
    const estilo = cont.dataset.estilo || 'repisa';
    const limite = Math.min(parseInt(cont.dataset.limite, 10) || 8, 8);
    const sec = cont.closest('section');
    const verTodo = sec?.querySelector('[data-tab-ver]');
    const todos = productosPorIds(ids);
    const pintar = (tab = '') => {
      let prods = todos;
      if (tab) { const [k, v] = tab.split(':'); prods = todos.filter(p => (k === 'grupo' ? catDe(p.cat).grupo : p[k]) === v); }
      prods = prods.slice(0, limite);
      cont.innerHTML = prods.map(p => cardHTML(p, estilo, ANIM.subir)).join('');
      if (verTodo) {
        const g = tab ? tab.split(':')[1] : '';
        const cats = CATEGORIAS.filter(c => c.grupo === g).map(c => c.id);
        verTodo.href = cats.length ? `${CATALOGO_URL}?cat=${cats.join(',')}` : CATALOGO_URL;
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

function calcularAlambrado({ forma = 'lote', largo = 0, ancho = 0, sep = 10 } = {}) {
  const L = Math.max(0, Math.min(Math.round(Number(largo) || 0), 20000));
  const A = Math.max(0, Math.min(Math.round(Number(ancho) || 0), 20000));
  const s = [8, 10, 12].includes(Number(sep)) ? Number(sep) : 10;
  const tramo = m => (m > 0 ? Math.max(Math.ceil(m / s) - 1, 0) : 0);
  if (forma === 'tramo') {
    if (!L) return { metros: 0, postes: 0, esquineros: 0, sep: s };
    return { metros: L, postes: tramo(L), esquineros: 2, sep: s };
  }
  if (!L || !A) return { metros: 0, postes: 0, esquineros: 0, sep: s };
  return { metros: 2 * (L + A), postes: 2 * tramo(L) + 2 * tramo(A), esquineros: 4, sep: s };
}
const MADERAS = {
  quebracho: { nombre: 'quebracho colorado', poste: ['quebracho-poste', '2,20 m'], esq: ['quebracho-esquinero', '2,40 m'] },
  guayacan: { nombre: 'guayacán', poste: ['guayacan-poste', '2,20 m'], esq: ['guayacan-poste', '2,40 m'] },
};
function lineasAlambrado(r, madera) {
  const m = MADERAS[madera] || MADERAS.quebracho;
  const out = [];
  if (r.postes) out.push({ id: m.poste[0], v: m.poste[1], qty: Math.min(r.postes, TOPE_LINEA) });
  if (r.esquineros) out.push({ id: m.esq[0], v: m.esq[1], qty: r.esquineros });
  return out;
}

function initCalculadora() {
  const form = document.querySelector('[data-calc]');
  if (!form) return;
  const sec = form.closest('section');
  const inL = form.querySelector('[data-calc-largo]');
  const inA = form.querySelector('[data-calc-ancho]');
  const campoA = form.querySelector('[data-campo-ancho]');
  const labelL = form.querySelector('[data-label-largo]');
  const ayuda = form.querySelector('#c-ayuda');
  const est = { forma: 'lote', sep: 10, madera: 'quebracho' };
  const out = {
    postes: sec.querySelector('[data-res-postes]'), postesT: sec.querySelector('[data-res-postes-t]'),
    esq: sec.querySelector('[data-res-esq]'), esqT: sec.querySelector('[data-res-esq-t]'),
    txt: sec.querySelector('[data-res-txt]'), sumarBtn: sec.querySelector('[data-calc-sumar]'), wsp: sec.querySelector('[data-calc-wsp]'),
  };
  const marcar = (attr, val) => form.querySelectorAll(`[data-${attr}]`).forEach(b => b.setAttribute('aria-pressed', String(b.dataset[attr] === String(val))));
  let ultimo = null;
  const pintar = () => {
    const r = calcularAlambrado({ forma: est.forma, largo: inL.value, ancho: inA.value, sep: est.sep });
    const m = MADERAS[est.madera];
    const esqLargo = m.esq[1];
    ultimo = { r, lineas: lineasAlambrado(r, est.madera) };
    out.postes.textContent = numero(r.postes);
    out.postesT.textContent = `${r.postes === 1 ? 'poste' : 'postes'} de 2,20 m`;
    out.esq.textContent = numero(r.esquineros);
    out.esqT.textContent = `${r.esquineros === 1 ? 'esquinero' : 'esquineros'} de ${esqLargo}`;
    out.txt.innerHTML = r.metros
      ? `<b>${numero(r.metros)} m</b> de alambrado en ${esc(m.nombre)}, con un poste cada ${r.sep} m.`
      : 'Completá las medidas en metros para ver la cuenta.';
    out.sumarBtn.disabled = !r.metros;
    out.wsp.href = wspHref(r.metros
      ? `Hola! Quiero cotizar postes para un alambrado de ${numero(r.metros)} m en ${m.nombre} (un poste cada ${r.sep} m): ${numero(r.postes)} postes de 2,20 m y ${numero(r.esquineros)} esquineros de ${esqLargo}. ¿Me pasan precio?`
      : `Hola! Quiero cotizar postes para un alambrado en ${m.nombre}.`);
  };
  form.addEventListener('click', e => {
    const f = e.target.closest('[data-forma]');
    if (f) {
      est.forma = f.dataset.forma; marcar('forma', est.forma);
      campoA.hidden = est.forma === 'tramo';
      labelL.textContent = est.forma === 'tramo' ? 'Largo del tramo' : 'Largo';
      ayuda.textContent = est.forma === 'tramo' ? 'En metros, de punta a punta.' : 'En metros, de esquina a esquina.';
      pintar(); return;
    }
    const s = e.target.closest('[data-sep]');
    if (s) { est.sep = Number(s.dataset.sep); marcar('sep', est.sep); pintar(); return; }
    const md = e.target.closest('[data-madera]');
    if (md) { est.madera = md.dataset.madera; marcar('madera', est.madera); pintar(); }
  });
  [inL, inA].forEach(i => i.addEventListener('input', pintar));
  out.sumarBtn.addEventListener('click', () => {
    if (!ultimo?.lineas.length) return;
    ultimo.lineas.forEach(l => Cart.add(getProducto(l.id), l.v, l.qty));
    showToast(`Sumaste ${numero(ultimo.r.postes)} postes y ${numero(ultimo.r.esquineros)} esquineros a tu pedido`);
    if (!reduceMotion) { out.sumarBtn.classList.remove('sumado'); void out.sumarBtn.offsetWidth; out.sumarBtn.classList.add('sumado'); }
  });
  pintar();
}

function initTextoScroll() {
  const els = document.querySelectorAll('[data-texto-scroll]');
  if (!els.length) return;
  els.forEach(el => {
    const palabras = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = palabras.map(w => `<span class="w" aria-hidden="true">${esc(w)}</span> `).join('');
  });
  if (reduceMotion) { document.querySelectorAll('[data-texto-scroll] .w').forEach(w => w.classList.add('on')); return; }
  let frame = 0;
  const update = () => {
    frame = 0;
    const vh = window.innerHeight;
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      const prog = Math.min(Math.max((vh * 0.86 - r.top) / (vh * 0.5 + r.height * 0.6), 0), 1);
      const ws = el.querySelectorAll('.w');
      const n = Math.round(prog * ws.length);
      ws.forEach((w, k) => w.classList.toggle('on', k < n));
    });
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  update();
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
  const vacioWsp = document.querySelector('[data-vacio-wsp]');
  const estilo = MODELO === '2' ? 'lista' : 'repisa';
  const params = new URLSearchParams(location.search);
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const GRUPOS = { cat: CATEGORIAS, uso: USOS, venta: VENTAS };
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    uso: valida(params.get('uso'), USOS),
    venta: valida(params.get('venta'), VENTAS),
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;
  const filtros = (sin = '') => {
    const f = {};
    Object.keys(GRUPOS).forEach(k => { if (sin !== k && e[k].length) f[k] = e[k]; });
    return f;
  };
  const opcion = (grupo, item, marcado, n) => `<label class="opcion${n ? '' : ' is-cero'}"><input type="checkbox" data-f="${grupo}" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`;
  function pintarFiltros() {
    Object.entries(GRUPOS).forEach(([k, lista]) => {
      panel.querySelector(`[data-f-${k}]`).innerHTML = lista.map(it => opcion(k, it, e[k].includes(it.id), Tienda.contar({ ...filtros(k), [k]: it.id }))).join('');
    });
  }
  function tituloActual() {
    const usados = Object.keys(GRUPOS).filter(k => e[k].length);
    if (usados.length === 1 && usados[0] === 'cat' && e.cat.length === 2 && e.cat.includes('quebracho') && e.cat.includes('guayacan')) return 'Postes labrados';
    if (usados.length !== 1) return '';
    if (e.cat.length === 1) return nombreDe(CATEGORIAS, e.cat[0]);
    if (e.uso.length === 1) return nombreDe(USOS, e.uso[0]);
    if (e.venta.length === 1) return nombreDe(VENTAS, e.venta[0]);
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...Object.entries(GRUPOS).flatMap(([k, lista]) => e[k].map(id => ({ k, id, t: nombreDe(lista, id) }))),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + e[k].length, 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Todo el catálogo';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Catálogo'} — ${MARCA}`;
  }
  function sincronizarUrl() {
    Object.keys(GRUPOS).forEach(k => setParam(k, e[k]));
    setParam('q', e.q);
    setParam('orden', e.orden === 'destacados' ? '' : e.orden);
  }
  function render(reiniciar = true) {
    const f = { ...filtros(), ...(e.q ? { q: e.q } : {}) };
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: f, orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, estilo, ANIM.subir)).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = e.q ? null : Tienda.contar(filtros());
    contador.innerHTML = e.q
      ? `${mostrados}${cursor ? '+' : ''} <small>${mostrados === 1 && !cursor ? 'resultado' : 'resultados'} para «${esc(e.q)}»</small>`
      : `${total} <small>${total === 1 ? 'producto' : 'productos'}</small>`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (!mostrados && vacioWsp) vacioWsp.href = wspHref(e.q ? `Hola! Busqué «${e.q}» en el catálogo de ${MARCA} y no lo encontré. ¿Lo tienen?` : `Hola! Vengo del catálogo de ${MARCA} y quiero hacer una consulta.`);
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
    e[g] = [...panel.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
    aplicar();
  });
  let tq = 0;
  inputQ.value = e.q;
  inputQ.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); }, 220); });
  inputQ.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); inputQ.blur(); });
  selOrden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  selOrden.addEventListener('change', () => { e.orden = selOrden.value; sincronizarUrl(); render(true); });
  const limpiar = () => { Object.keys(GRUPOS).forEach(k => { e[k] = []; }); e.q = ''; inputQ.value = ''; aplicar(); };
  document.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const qf = ev.target.closest('[data-quitar-f]');
    if (qf) {
      const k = qf.dataset.quitarF, v = qf.dataset.v;
      if (GRUPOS[k]) e[k] = e[k].filter(x => x !== v);
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
  desde('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desde('.hero-comp__ancha', { clipPath: 'inset(0% 0% 100% 0% round 14px)', duration: 1.3, ease: 'power3.inOut', clearProps: 'clipPath' }, 0);
  desde('.hero-comp__alta', { y: 40, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.35);
  desde('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.12);
  desde('h1', { y: 36, opacity: 0, duration: 1.2 }, 0.2);
  desde('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.42);
  desde('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56);
  desde('.hero-comp__sello, .hero-ficha .sello', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.75);
  desde('.hero-ficha', { y: 30, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.6);
}

[
  initPreviews, initMenuCategorias, initCatalogo, initTextoScroll, initReveals, initHeroMotion, initNav, initDrawer,
  initVistaRapida, initCompras, initCalculadora, initFloats, initModelBarScroll,
].forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
try { Cart.sync(); } catch (err) { console.error(err); }
updateCartBadge();
