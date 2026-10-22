const WA = '5491132654889';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const CATEGORIAS = [
  { id: 'masculinos', nombre: 'Masculinos', img: 'images/cat-masculinos.webp' },
  { id: 'femeninos', nombre: 'Femeninos', img: 'images/cat-femeninos.webp' },
  { id: 'unisex', nombre: 'Unisex', img: 'images/cat-unisex.webp' },
];
const FAMILIAS = { dulce: 'Dulce y avainillado', oud: 'Amaderado, con oud', especiado: 'Especiado y cálido', floral: 'Floral', fresco: 'Fresco y cítrico' };
const FAMILIA_CORTA = { dulce: 'dulce', oud: 'con oud', especiado: 'especiado', floral: 'floral', fresco: 'fresco' };
const MOMENTOS = { dia: 'De día', noche: 'De noche' };
const INTENSIDAD = { 1: 'Suave', 2: 'Media', 3: 'Intensa' };
const PRECIOS = { 'hasta-50': [0, 50000], '50-80': [50001, 80000], 'mas-80': [80001, Infinity] };

const PRODUCTOS = [
  {
    id: 'khamrah', nombre: 'Khamrah', casa: 'Lattafa', cat: 'unisex', ml: 100, conc: 'Eau de parfum', precio: 58000, descuento: 0, stock: 8,
    img: 'images/p-khamrah.webp', alt: 'Frasco redondo facetado color ámbar con tapa dorada en forma de llama',
    familias: ['dulce', 'especiado'], momentos: ['noche'], intensidad: 3,
    notas: { salida: 'Canela, nuez moscada y bergamota', corazon: 'Dátiles, praliné y tuberosa', fondo: 'Vainilla, haba tonka, benjuí y mirra' },
    corto: 'Dátiles, canela y praliné sobre una base de vainilla.',
    desc: 'Dulce y especiado desde el primer momento: los dátiles y el praliné se sienten apenas te lo ponés, y la vainilla con benjuí lo sostiene durante horas. Ideal para las noches de frío.',
    rango: 1, alta: 20260901,
  },
  {
    id: 'asad', nombre: 'Asad', casa: 'Lattafa', cat: 'masculinos', ml: 100, conc: 'Eau de parfum', precio: 46000, descuento: 10, stock: 12,
    img: 'images/p-asad.webp', alt: 'Frasco rectangular negro con tapa dorada facetada, sobre piedra',
    familias: ['especiado', 'oud'], momentos: ['noche'], intensidad: 3,
    notas: { salida: 'Pimienta negra, tabaco y piña', corazon: 'Café, pachulí e iris', fondo: 'Vainilla, ámbar, benjuí y ládano' },
    corto: 'Pimienta negra y tabaco con un fondo de vainilla y ámbar.',
    desc: 'Un masculino con carácter: arranca picante con pimienta negra y tabaco, pasa por un corazón de café y termina cálido, con vainilla y ámbar. Para salir de noche.',
    rango: 2, alta: 20260815,
  },
  {
    id: 'yara', nombre: 'Yara', casa: 'Lattafa', cat: 'femeninos', ml: 100, conc: 'Eau de parfum', precio: 52000, descuento: 0, stock: 3,
    img: 'images/p-yara.webp', alt: 'Frasco facetado de cristal rosado con tapa de cristal tallado',
    familias: ['dulce', 'floral'], momentos: ['dia', 'noche'], intensidad: 2,
    notas: { salida: 'Orquídea, heliotropo y mandarina', corazon: 'Acorde goloso y frutas tropicales', fondo: 'Vainilla, almizcle y sándalo' },
    corto: 'Orquídea y frutas tropicales con un fondo cremoso de vainilla.',
    desc: 'Floral y golosa a la vez: la orquídea y la mandarina abren fresco y enseguida aparece un acorde cremoso de frutas tropicales y vainilla. Suave para el día, linda para la noche.',
    rango: 3, alta: 20260820,
  },
  {
    id: '9pm', nombre: '9PM', casa: 'Afnan', cat: 'masculinos', ml: 100, conc: 'Eau de parfum', precio: 54000, descuento: 0, stock: 10,
    img: 'images/p-9pm.webp', alt: 'Frasco facetado azul petróleo con tapa negra texturada',
    familias: ['dulce', 'especiado'], momentos: ['noche'], intensidad: 3,
    notas: { salida: 'Manzana, canela, lavanda y bergamota', corazon: 'Flor de azahar y lirio de los valles', fondo: 'Vainilla, haba tonka, ámbar y pachulí' },
    corto: 'Manzana y canela con vainilla: dulce, cálido y de noche.',
    desc: 'Dulce y especiado, pensado para la noche: manzana y canela al principio, un toque floral de azahar y un fondo de vainilla con haba tonka que se nota de lejos.',
    rango: 4, alta: 20260710,
  },
  {
    id: 'amber-oud', nombre: 'Amber Oud Gold Edition', casa: 'Al Haramain', cat: 'unisex', ml: 120, conc: 'Eau de parfum', precio: 89000, descuento: 0, stock: 4,
    img: 'images/p-amber-oud.webp', alt: 'Frasco alto de perfume color ámbar con tapa dorada labrada, sobre piedra',
    familias: ['dulce', 'oud'], momentos: ['dia', 'noche'], intensidad: 3,
    notas: { salida: 'Bergamota y notas verdes', corazon: 'Melón, piña y ámbar', fondo: 'Vainilla, almizcle y maderas' },
    corto: 'Ámbar frutal y luminoso, con vainilla y maderas.',
    desc: 'Frutal y ambarado, con una estela que se siente todo el día: bergamota y notas verdes al comienzo, melón y ámbar en el corazón, y vainilla con maderas en el fondo.',
    rango: 5, alta: 20260905,
  },
  {
    id: 'oud-for-glory', nombre: "Bade'e Al Oud for Glory", casa: 'Lattafa', cat: 'unisex', ml: 100, conc: 'Eau de parfum', precio: 49000, descuento: 0, stock: 9,
    img: 'images/p-oud-for-glory.webp', alt: 'Frasco negro facetado con tapa dorada calada terminada en punta',
    familias: ['oud', 'especiado'], momentos: ['noche'], intensidad: 3,
    notas: { salida: 'Azafrán, nuez moscada y lavanda', corazon: 'Oud y pachulí', fondo: 'Oud y almizcle' },
    corto: 'Oud ahumado con azafrán, el perfume árabe más clásico.',
    desc: 'Para quien busca el oud de verdad: el azafrán y la nuez moscada abren paso a una madera oscura y ahumada que se queda en la ropa. Intenso, se usa con poca cantidad.',
    rango: 6, alta: 20260801,
  },
  {
    id: 'choco-musk', nombre: 'Choco Musk', casa: 'Al Rehab', cat: 'unisex', ml: 6, conc: 'Perfume en aceite', precio: 14500, descuento: 0, stock: 20,
    img: 'images/p-choco-musk.webp', alt: 'Frasco chico de perfume en aceite color ámbar con tapa dorada, junto a su caja',
    familias: ['dulce'], momentos: ['dia', 'noche'], intensidad: 2,
    notas: { salida: 'Chocolate y rosa', corazon: 'Vainilla y sándalo', fondo: 'Almizcle' },
    corto: 'Perfume en aceite de chocolate, vainilla y almizcle.',
    desc: 'Perfume en aceite, sin alcohol: con unos toques en las muñecas y el cuello alcanza. Huele a chocolate y vainilla sobre un almizcle suave, y el frasco chico entra en cualquier cartera.',
    rango: 7, alta: 20260910,
  },
  {
    id: 'ana-abiyedh', nombre: 'Ana Abiyedh', casa: 'Lattafa', cat: 'unisex', ml: 60, conc: 'Eau de parfum', precio: 42000, descuento: 0, stock: 7,
    img: 'images/p-ana-abiyedh.webp', alt: 'Frasco blanco redondeado con cúpula dorada calada, sobre piedra',
    familias: ['fresco', 'floral'], momentos: ['dia'], intensidad: 1,
    notas: { salida: 'Bergamota y pera', corazon: 'Almizcle blanco y jazmín', fondo: 'Sándalo y vainilla suave' },
    corto: 'Almizcle blanco, limpio, como recién bañado.',
    desc: 'Limpio y suave, con olor a piel recién bañada: almizcle blanco con un toque de pera y jazmín. Para todos los días y para quienes prefieren un perfume que no invada.',
    rango: 8, alta: 20261005,
  },
  {
    id: 'sublime', nombre: "Bade'e Al Oud Sublime", casa: 'Lattafa', cat: 'femeninos', ml: 100, conc: 'Eau de parfum', precio: 47000, descuento: 0, stock: 6,
    img: 'images/p-sublime.webp', alt: 'Frasco de cristal tallado transparente con tapa dorada labrada en forma de corona',
    familias: ['floral', 'dulce'], momentos: ['dia'], intensidad: 2,
    notas: { salida: 'Manzana, lichi y rosa', corazon: 'Ciruela y jazmín', fondo: 'Vainilla, musgo y pachulí' },
    corto: 'Frutal y floral: manzana, lichi y rosa con vainilla.',
    desc: 'Frutal y floral, alegre: manzana roja y lichi con rosa al comienzo, ciruela y jazmín en el corazón y un fondo de vainilla y musgo. Va bien de día y en primavera.',
    rango: 9, alta: 20261010,
  },
  {
    id: 'hawas', nombre: 'Hawas for Him', casa: 'Rasasi', cat: 'masculinos', ml: 100, conc: 'Eau de parfum', precio: 79000, descuento: 0, stock: 0,
    img: 'images/p-hawas.webp', alt: 'Frasco cuadrado de vidrio verde con tapa dorada',
    familias: ['fresco'], momentos: ['dia'], intensidad: 2,
    notas: { salida: 'Manzana, bergamota, limón y canela', corazon: 'Ciruela, cardamomo y flor de azahar', fondo: 'Ámbar gris, almizcle, pachulí y maderas' },
    corto: 'Fresco y acuático, con manzana, cítricos y ámbar gris.',
    desc: 'El fresco de la casa: cítricos y manzana bien arriba, un corazón suave de cardamomo y ciruela y un fondo de ámbar gris. Para el día y para los meses de calor.',
    rango: 10, alta: 20260701,
  },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const catDe = id => CATEGORIAS.find(c => c.id === id);
const nombreCompleto = p => `${p.casa} ${p.nombre}`;
const esNuevo = p => p.alta >= 20261001;
const wa = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const paginaCatalogo = () => (document.body.dataset.modelo === '2' ? 'catalogo-2.html' : 'catalogo.html');
const refrescarST = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), familia = lista(f.familia), momento = lista(f.momento), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (familia.length && !familia.some(x => p.familias.includes(x))) return false;
    if (momento.length && !momento.some(x => p.momentos.includes(x))) return false;
    if (f.precio && PRECIOS[f.precio]) {
      const [min, max] = PRECIOS[f.precio];
      const v = precioFinal(p);
      if (v < min || v > max) return false;
    }
    if (f.stock && !(p.stock > 0)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function comparador(orden, ids) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    if (orden === 'ids' && Array.isArray(ids)) return (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden, filtros.ids));
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
      p.nombre, p.casa, catDe(p.cat)?.nombre, p.conc, `${p.ml} ml`, ...p.familias.map(f => FAMILIAS[f]), ...p.momentos.map(m => MOMENTOS[m]),
      INTENSIDAD[p.intensidad], p.notas.salida, p.notas.corazon, p.notas.fondo, p.corto, p.desc,
      p.conc === 'Perfume en aceite' ? 'attar aceite sin alcohol' : '', p.descuento > 0 ? 'oferta descuento' : '', esNuevo(p) ? 'nuevo novedad' : '',
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

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
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

const Cart = {
  KEY: 'oudimperial_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
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

const WSP_ICO = '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';
const ANIM_SUBIR = 'data-animate="subir" style="opacity:0;transform:translateY(40px)"';
const waConsulta = p => wa(`¡Hola Oud Imperial! Quiero consultar por ${nombreCompleto(p)} (${p.ml} ml).`);
const notasCortas = p => {
  const vistas = new Set();
  return [p.notas.salida, p.notas.corazon, p.notas.fondo]
    .map(t => t.split(/,| y | e /).map(s => s.trim()).find(s => s && !vistas.has(norm(s))))
    .filter(Boolean)
    .map(s => { vistas.add(norm(s)); return s.charAt(0).toUpperCase() + s.slice(1); })
    .join(' · ');
};

function precioHTML(p) {
  if (p.descuento > 0) return `<p class="precio"><span>${formatearPrecio(precioFinal(p))}</span><s>${formatearPrecio(p.precio)}</s><span class="precio__off">−${p.descuento}%</span></p>`;
  return `<p class="precio"><span>${formatearPrecio(p.precio)}</span></p>`;
}
function badgesDe(p) {
  const b = [];
  if (p.stock <= 0) b.push(['sin', 'Sin stock']);
  if (p.descuento > 0) b.push(['off', `−${p.descuento}%`]);
  if (p.stock > 0 && p.stock <= 3) b.push(['ultimas', 'Últimas unidades']);
  if (esNuevo(p)) b.push(['nuevo', 'Nuevo']);
  return b.slice(0, 2);
}
const badgesHTML = p => { const b = badgesDe(p); return b.length ? `<span class="badges">${b.map(([k, t]) => `<span class="badge badge--${k}">${t}</span>`).join('')}</span>` : ''; };
const fotoHTML = (p, clase) => `<button type="button" class="${clase}" data-open="${p.id}" aria-label="Ver detalle de ${esc(nombreCompleto(p))}">${clase === 'pcard__foto' ? badgesHTML(p) : ''}<img src="${p.img}" alt="${esc(p.alt)}" width="800" height="1000"></button>`;
const stepperHTML = p => `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno" disabled>−</button><input type="number" inputmode="numeric" min="1" max="${p.stock}" value="1" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-step="1" aria-label="Sumar uno"${p.stock <= 1 ? ' disabled' : ''}>+</button></div>`;
const avisameHTML = p => `<a class="prod-avisame" href="${wa(`¡Hola Oud Imperial! ¿Me avisan cuando vuelva a entrar ${nombreCompleto(p)}?`)}" target="_blank" rel="noopener">Avisame cuando llegue</a>`;

function cardH(p) {
  return `<article class="pcard pcard--h" ${ANIM_SUBIR}>
    ${fotoHTML(p, 'pcard__foto')}
    <div class="pcard__info">
      <p class="pcard__casa">${esc(p.casa)} · ${p.ml} ml</p>
      <h3 class="pcard__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="pcard__corto">${esc(p.corto)}</p>
      <span class="regla-mini" aria-hidden="true"></span>
      ${precioHTML(p)}
      <div class="pcard__acc">${p.stock > 0 ? `<button type="button" class="btn btn--cta btn--sm" data-add="${p.id}">Agregar</button>` : '<span class="prod-sin">Sin stock</span>'}<button type="button" class="link-notas" data-open="${p.id}">Ver notas</button></div>
    </div>
  </article>`;
}
function cardV(p) {
  const acc = p.stock > 0
    ? `<div class="prod-actions">${stepperHTML(p)}<button type="button" class="btn btn--cta btn--sm prod-add" data-add="${p.id}">Agregar</button></div><button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>`
    : `<p class="prod-sin">Sin stock por ahora</p>${avisameHTML(p)}`;
  return `<article class="pcard pcard--v" ${ANIM_SUBIR}>
    ${fotoHTML(p, 'pcard__foto')}
    <div class="pcard__body">
      <p class="pcard__casa">${esc(p.casa)} · ${p.ml} ml</p>
      <h3 class="pcard__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="pcard__corto">${esc(p.corto)}</p>
      ${precioHTML(p)}
      <div class="pcard__acc">${acc}</div>
    </div>
  </article>`;
}
function filaHTML(p) {
  const estado = badgesDe(p).filter(([k]) => k !== 'off').map(([, t]) => t).join(' · ');
  const acc = p.stock > 0 ? `<button type="button" class="btn btn--cta btn--sm" data-add="${p.id}">Agregar</button>` : avisameHTML(p);
  return `<article class="fila" ${ANIM_SUBIR}>
    ${fotoHTML(p, 'fila__foto')}
    <div class="fila__main">
      <div class="fila__top"><h3 class="fila__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3><span class="fila__puntos" aria-hidden="true"></span>${precioHTML(p)}</div>
      <p class="fila__meta">${esc(p.casa)} · ${p.ml} ml · ${esc(p.conc)} · ${INTENSIDAD[p.intensidad]}</p>
      <p class="fila__desc">${esc(p.desc)}</p>
      <p class="fila__notas"><b>Notas:</b> ${esc(notasCortas(p))}</p>
      <div class="fila__acc">${acc}${estado ? `<span class="fila__estado">${estado}</span>` : ''}</div>
    </div>
  </article>`;
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
  const desktopMq = window.matchMedia('(min-width: 901px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initNavDrop() {
  const drop = document.querySelector('[data-nav-drop]');
  if (!drop) return;
  const btn = drop.querySelector('.nav-drop__btn');
  const lista = drop.querySelector('[data-drop-lista]');
  const base = paginaCatalogo();
  const enCatalogo = document.body.dataset.pagina === 'catalogo';
  const actual = new URLSearchParams(location.search).get('cat');
  lista.innerHTML = CATEGORIAS.map(c => `<li><a href="${base}?cat=${c.id}"${enCatalogo && actual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="40" height="53"><span>${esc(c.nombre)}</span><small>${Tienda.contar({ cat: c.id })}</small></a></li>`).join('');
  const desktop = window.matchMedia('(min-width: 901px)');
  let t = 0;
  const abrir = () => { clearTimeout(t); drop.classList.add('abierto'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(t); drop.classList.remove('abierto'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (drop.classList.contains('abierto') ? cerrar() : abrir()));
  drop.addEventListener('mouseenter', () => { if (desktop.matches) abrir(); });
  drop.addEventListener('mouseleave', () => { if (desktop.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
  drop.addEventListener('focusout', e => { if (desktop.matches && !drop.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (desktop.matches && !drop.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && desktop.matches && drop.classList.contains('abierto')) { cerrar(); btn.focus(); } });
}

function initCatCounts() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.cuentaCat });
    el.textContent = el.closest('.chk') ? n : `${n} ${n === 1 ? 'perfume' : 'perfumes'}`;
  });
}

function initVitrina() {
  const cont = document.querySelector('[data-vitrina]');
  if (!cont) return;
  const ids = (cont.dataset.ids || '').split(',').filter(Boolean);
  const { items } = Tienda.consultar({ filtros: { ids }, orden: 'ids', limite: ids.length || 6 });
  items.forEach(cachear);
  cont.innerHTML = items.map(cardH).join('');
}

function initCarta() {
  const cont = document.querySelector('[data-carta]');
  if (!cont) return;
  const lim = parseInt(cont.dataset.limite, 10) || 8;
  const tabs = [...document.querySelectorAll('.tabs [data-tab]')];
  const pie = document.querySelector('.carta__pie a');
  const pintar = (cat, animar) => {
    const { items } = Tienda.consultar({ filtros: cat ? { cat } : {}, orden: 'destacados', limite: lim });
    items.forEach(cachear);
    cont.innerHTML = items.map(filaHTML).join('');
    if (pie) pie.href = cat ? `${paginaCatalogo()}?cat=${cat}` : paginaCatalogo();
    if (animar) { revelarNuevos(cont); refrescarST(); }
  };
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.setAttribute('aria-pressed', String(x === t)));
    pintar(t.dataset.tab, true);
  }));
  pintar('', false);
}

function initEncontra() {
  const form = document.querySelector('[data-encontra]');
  if (!form) return;
  const lista = document.querySelector('[data-enc-lista]');
  const titulo = document.querySelector('[data-enc-titulo]');
  const linkCat = document.querySelector('[data-enc-catalogo]');
  const linkWsp = document.querySelector('[data-enc-wsp]');
  const pool = Tienda.consultar({ filtros: { stock: true }, orden: 'destacados', limite: Tienda.TOPE }).items;
  pool.forEach(cachear);
  const QUIEN = { masculinos: 'para él', femeninos: 'para ella', unisex: 'para compartir' };
  const pintar = animar => {
    const elegido = n => form.querySelector(`input[name="${n}"]:checked`)?.value || '';
    const quien = elegido('eQuien'), aroma = elegido('eAroma'), momento = elegido('eMomento');
    const conRespuesta = Boolean(quien || aroma || momento);
    const puntuar = p => {
      let s = 0; const por = [];
      if (quien) {
        if (p.cat === quien) { s += 3; por.push(catDe(quien).nombre.toLowerCase()); }
        else if (p.cat === 'unisex') { s += 2; por.push('unisex'); }
        else s -= 6;
      }
      if (aroma && p.familias.includes(aroma)) { s += p.familias[0] === aroma ? 4 : 3; por.push(FAMILIA_CORTA[aroma]); }
      if (momento && p.momentos.includes(momento)) { s += 2; por.push(MOMENTOS[momento].toLowerCase()); }
      return { p, s: s - p.rango * 0.01, por };
    };
    const top = pool.map(puntuar).sort((a, b) => b.s - a.s).slice(0, 3);
    titulo.textContent = conRespuesta ? 'Te recomendamos estos tres' : 'Los más elegidos para empezar';
    lista.innerHTML = top.map(({ p, por }) => `<li class="enc-item" ${ANIM_SUBIR}>
      ${fotoHTML(p, 'pcard__foto')}
      <p class="pcard__casa">${esc(p.casa)} · ${p.ml} ml</p>
      <h3 class="enc-item__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="enc-item__por">${conRespuesta && por.length ? `Coincide: ${por.join(' · ')}` : esc(p.corto)}</p>
      ${precioHTML(p)}
      <button type="button" class="btn btn--cta btn--sm" data-add="${p.id}">Agregar</button>
    </li>`).join('');
    const params = new URLSearchParams();
    if (quien) params.set('cat', quien === 'unisex' ? 'unisex' : `${quien},unisex`);
    if (aroma) params.set('familia', aroma);
    if (momento) params.set('momento', momento);
    const s = params.toString();
    linkCat.href = paginaCatalogo() + (s ? `?${s}` : '');
    const partes = [quien && QUIEN[quien], aroma && `de aroma ${FAMILIAS[aroma].toLowerCase()}`, momento && `para usar ${MOMENTOS[momento].toLowerCase()}`].filter(Boolean);
    linkWsp.href = wa(partes.length ? `¡Hola Oud Imperial! Busco un perfume ${partes.join(', ')}. ¿Qué me recomiendan?` : '¡Hola Oud Imperial! Quiero que me ayuden a elegir un perfume árabe.');
    if (animar) { revelarNuevos(lista); refrescarST(); }
  };
  form.addEventListener('change', () => pintar(true));
  pintar(false);
}

function initCatalogo() {
  const root = document.querySelector('[data-catalogo]');
  if (!root) return;
  const grid = root.querySelector('[data-grid]');
  const vacio = root.querySelector('[data-vacio]');
  const verMas = root.querySelector('[data-ver-mas]');
  const contador = root.querySelector('[data-contador]');
  const input = document.getElementById('catQ');
  const formQ = root.querySelector('[data-cat-buscar]');
  const selOrden = root.querySelector('[data-orden]');
  const filtrosEl = document.getElementById('filtros');
  const fondo = document.querySelector('[data-filtros-fondo]');
  const cuentaRes = document.querySelector('[data-cuenta-res]');
  const nFiltros = document.querySelector('[data-n-filtros]');
  const migaCat = document.querySelector('[data-miga-cat]');
  const vistas = [...root.querySelectorAll('[data-vista]')];
  const POR_PAGINA = 16;
  const ORDENES = ['destacados', 'precio-asc', 'precio-desc', 'nombre', 'nuevos'];
  const VALIDOS = { cat: CATEGORIAS.map(c => c.id), familia: Object.keys(FAMILIAS), momento: Object.keys(MOMENTOS) };
  const vistaInicial = root.dataset.vistaInicial === 'lista' ? 'lista' : 'fotos';
  const estado = { cat: [], familia: [], momento: [], precio: '', stock: false, q: '', orden: 'destacados', vista: vistaInicial };
  let cursor = null;
  let mostrados = 0;

  const u = new URLSearchParams(location.search);
  const listaURL = k => [...new Set((u.get(k) || '').split(',').map(s => s.trim()).filter(v => VALIDOS[k].includes(v)))];
  estado.cat = listaURL('cat');
  estado.familia = listaURL('familia');
  estado.momento = listaURL('momento');
  estado.precio = PRECIOS[u.get('precio')] ? u.get('precio') : '';
  estado.stock = u.get('stock') === '1';
  estado.q = (u.get('q') || '').trim().slice(0, 60);
  estado.orden = ORDENES.includes(u.get('orden')) ? u.get('orden') : 'destacados';
  if (['fotos', 'lista'].includes(u.get('vista'))) estado.vista = u.get('vista');

  const filtrosDe = () => ({ cat: estado.cat, familia: estado.familia, momento: estado.momento, precio: estado.precio, stock: estado.stock });
  const escribirURL = () => {
    const p = new URLSearchParams();
    if (estado.cat.length) p.set('cat', estado.cat.join(','));
    if (estado.familia.length) p.set('familia', estado.familia.join(','));
    if (estado.momento.length) p.set('momento', estado.momento.join(','));
    if (estado.precio) p.set('precio', estado.precio);
    if (estado.stock) p.set('stock', '1');
    if (estado.q) p.set('q', estado.q);
    if (estado.orden !== 'destacados') p.set('orden', estado.orden);
    if (estado.vista !== vistaInicial) p.set('vista', estado.vista);
    const s = p.toString().replace(/%2C/g, ',');
    window.history.replaceState(null, '', s ? `?${s}` : location.pathname);
  };
  const sincronizarUI = () => {
    document.querySelectorAll('#filtros input[data-f]').forEach(i => {
      i.checked = i.dataset.f === 'stock' ? estado.stock : estado[i.dataset.f].includes(i.value);
    });
    document.querySelectorAll('#filtros input[name="fPrecio"]').forEach(i => { i.checked = i.value === estado.precio; });
    selOrden.value = estado.orden;
    if (document.activeElement !== input) input.value = estado.q;
    vistas.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.vista === estado.vista)));
    grid.classList.toggle('es-lista', estado.vista === 'lista');
    const n = estado.cat.length + estado.familia.length + estado.momento.length + (estado.precio ? 1 : 0) + (estado.stock ? 1 : 0);
    nFiltros.hidden = !n;
    nFiltros.textContent = n;
    if (estado.cat.length === 1) {
      migaCat.hidden = false;
      migaCat.textContent = catDe(estado.cat[0]).nombre;
      migaCat.setAttribute('aria-current', 'page');
    } else {
      migaCat.hidden = true;
      migaCat.removeAttribute('aria-current');
    }
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(estado.vista === 'lista' ? filaHTML : cardV).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    mostrados = agregar ? mostrados + res.items.length : res.items.length;
    verMas.hidden = !cursor;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (estado.q) {
      contador.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'perfume' : 'perfumes'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      cuentaRes.textContent = mostrados + (cursor ? '+' : '');
    } else {
      const total = Tienda.contar(filtrosDe());
      contador.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'perfume' : 'perfumes'}` : '';
      cuentaRes.textContent = total;
    }
    revelarNuevos(grid);
    refrescarST();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };

  filtrosEl.addEventListener('change', e => {
    const i = e.target;
    if (i.name === 'fPrecio') estado.precio = PRECIOS[i.value] ? i.value : '';
    else if (i.dataset.f === 'stock') estado.stock = i.checked;
    else if (i.dataset.f) {
      const set = new Set(estado[i.dataset.f]);
      if (i.checked) set.add(i.value); else set.delete(i.value);
      estado[i.dataset.f] = [...set];
    }
    aplicar();
  });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    Object.assign(estado, { cat: [], familia: [], momento: [], precio: '', stock: false, q: '' });
    input.value = '';
    aplicar();
  }));
  let tq = 0;
  formQ.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tq); estado.q = input.value.trim().slice(0, 60); aplicar(); });
  input.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { estado.q = input.value.trim().slice(0, 60); aplicar(); }, 260); });
  selOrden.addEventListener('change', () => { estado.orden = ORDENES.includes(selOrden.value) ? selOrden.value : 'destacados'; aplicar(); });
  vistas.forEach(b => b.addEventListener('click', () => { if (estado.vista === b.dataset.vista) return; estado.vista = b.dataset.vista; aplicar(); }));
  verMas.addEventListener('click', () => pintar(true));

  let volverFiltros = null;
  const abrirFiltros = () => {
    volverFiltros = document.activeElement;
    filtrosEl.classList.add('abierto');
    fondo.hidden = false;
    document.body.classList.add('no-scroll');
    filtrosEl.querySelector('.filtros__cerrar')?.focus();
  };
  const cerrarFiltros = () => {
    if (!filtrosEl.classList.contains('abierto')) return;
    filtrosEl.classList.remove('abierto');
    fondo.hidden = true;
    document.body.classList.remove('no-scroll');
    volverFiltros?.focus?.();
  };
  document.querySelectorAll('[data-filtros-abrir]').forEach(b => b.addEventListener('click', abrirFiltros));
  document.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarFiltros));
  fondo.addEventListener('click', cerrarFiltros);
  document.addEventListener('keydown', e => {
    if (!filtrosEl.classList.contains('abierto')) return;
    if (e.key === 'Escape') cerrarFiltros();
    else atraparFoco(filtrosEl, e);
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', e => { if (e.matches) cerrarFiltros(); });

  sincronizarUI();
  pintar();
  if (u.has('q')) input.focus({ preventScroll: true });
}

function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function lineaHTML(item, p, mini) {
  return `<div class="linea${mini ? ' linea--mini' : ''}">
    ${mini ? '' : `<div class="linea__foto"><img src="${p.img}" alt="" width="800" height="1000"></div>`}
    <div><p class="linea__casa">${esc(p.casa)} · ${p.ml} ml</p><p class="linea__nombre">${esc(p.nombre)}</p></div>
    <p class="linea__precio">${formatearPrecio(precioFinal(p) * item.qty)}</p>
    <div class="linea__ctrl"><div class="stepper" data-stepper data-linea="${p.id}"><button type="button" data-linea-step="-1" data-id="${p.id}" aria-label="Restar uno de ${esc(p.nombre)}"${item.qty <= 1 ? ' disabled' : ''}>−</button><input type="number" inputmode="numeric" min="1" max="${p.stock}" value="${item.qty}" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-linea-step="1" data-id="${p.id}" aria-label="Sumar uno de ${esc(p.nombre)}"${item.qty >= p.stock ? ' disabled' : ''}>+</button></div><button type="button" class="linea__quitar" data-quitar="${p.id}">Quitar</button></div>
  </div>`;
}

function mensajePedido() {
  const items = Cart.get().map(i => ({ i, p: getProducto(i.id) })).filter(x => x.p);
  if (!items.length) return wa('¡Hola Oud Imperial! Vi la web y quiero consultar por un perfume.');
  const lineas = items.map(({ i, p }) => `• ${i.qty} × ${nombreCompleto(p)} (${p.ml} ml) — ${formatearPrecio(precioFinal(p) * i.qty)}`);
  return wa(`¡Hola Oud Imperial! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`);
}

function renderCarrito() {
  const items = Cart.get().map(i => ({ i, p: getProducto(i.id) })).filter(x => x.p);
  const activo = document.activeElement;
  const enLineas = activo?.closest?.('[data-drawer-lineas], [data-pedido-lineas]');
  let selector = null;
  if (enLineas) {
    if (activo.dataset.lineaStep) selector = `[data-linea-step="${activo.dataset.lineaStep}"][data-id="${activo.dataset.id}"]`;
    else if (activo.dataset.quitar) selector = '.linea__quitar';
  }
  const total = formatearPrecio(Cart.total());
  const vacio = !items.length;
  const drawer = document.querySelector('[data-drawer-lineas]');
  if (drawer) {
    drawer.innerHTML = vacio
      ? `<div class="carrito-vacio"><p>Tu carrito está vacío</p><small>Elegí un perfume del catálogo y sumalo con «Agregar».</small><a class="btn btn--line" href="${paginaCatalogo()}">Volver al catálogo</a></div>`
      : items.map(({ i, p }) => lineaHTML(i, p, false)).join('');
    document.querySelector('[data-drawer-pie]').hidden = vacio;
  }
  const pedido = document.querySelector('[data-pedido-lineas]');
  if (pedido) {
    pedido.innerHTML = vacio
      ? '<p class="pedido__vacio">Todavía no sumaste perfumes. Tocá «Agregar» en los que te gusten y armamos el pedido acá.</p>'
      : items.map(({ i, p }) => lineaHTML(i, p, true)).join('');
  }
  document.querySelectorAll('[data-cart-total]').forEach(el => { el.textContent = total; });
  document.querySelectorAll('[data-finalizar]').forEach(b => { b.disabled = vacio; });
  const msg = mensajePedido();
  document.querySelectorAll('[data-drawer-wsp], [data-pedido-wsp]').forEach(a => { a.href = msg; });
  if (selector && enLineas) {
    const cont = document.querySelector(enLineas.hasAttribute('data-drawer-lineas') ? '[data-drawer-lineas]' : '[data-pedido-lineas]');
    (cont.querySelector(selector) || cont.querySelector('button:not([disabled])'))?.focus();
  }
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

let drawerVolver = null;
let drawerTimer = 0;
function openCartDrawer() {
  const d = document.getElementById('drawer');
  const f = document.querySelector('.drawer-fondo');
  if (!d) return;
  cerrarQV(false);
  clearTimeout(drawerTimer);
  if (d.hidden || !d.classList.contains('abierto')) drawerVolver = document.activeElement;
  renderCarrito();
  d.hidden = false; f.hidden = false;
  void d.offsetWidth;
  d.classList.add('abierto'); f.classList.add('abierto');
  document.body.classList.add('no-scroll');
  d.querySelector('.drawer__cerrar')?.focus();
}
function cerrarDrawer() {
  const d = document.getElementById('drawer');
  const f = document.querySelector('.drawer-fondo');
  if (!d || d.hidden) return;
  d.classList.remove('abierto'); f.classList.remove('abierto');
  drawerTimer = setTimeout(() => { d.hidden = true; f.hidden = true; }, reduceMotion ? 0 : 380);
  document.body.classList.remove('no-scroll');
  if (drawerVolver && document.contains(drawerVolver)) drawerVolver.focus();
}

let qvVolver = null;
let qvTimer = 0;
function qvHTML(p) {
  const cat = catDe(p.cat);
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id], stock: true }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)], stock: true }, limite: 3 - rel.length }).items);
  rel.forEach(cachear);
  const puntos = [1, 2, 3].map(n => `<i${n <= p.intensidad ? ' class="on"' : ''}></i>`).join('');
  const comprar = p.stock > 0
    ? `<div class="qv__comprar">${stepperHTML(p)}<button type="button" class="btn btn--cta prod-add" data-add="${p.id}">Agregar al carrito</button><button type="button" class="btn btn--line" data-buy="${p.id}">Comprar ahora</button></div>${p.stock <= 3 ? `<p class="qv__stock">Quedan ${p.stock} unidades</p>` : ''}`
    : `<p class="qv__stock">Sin stock por ahora.</p>${avisameHTML(p)}`;
  return `<figure class="qv__foto"><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="1000"></figure>
  <div class="qv__info">
    <p class="pcard__casa">${esc(p.casa)} · ${p.ml} ml · ${esc(p.conc)}</p>
    <h2>${esc(p.nombre)}</h2>
    ${precioHTML(p)}
    <p class="qv__desc">${esc(p.desc)}</p>
    <dl class="piramide"><div><dt>Salida</dt><dd>${esc(p.notas.salida)}</dd></div><div><dt>Corazón</dt><dd>${esc(p.notas.corazon)}</dd></div><div><dt>Fondo</dt><dd>${esc(p.notas.fondo)}</dd></div></dl>
    <div class="rasgos"><span class="rasgo">${esc(cat?.nombre)}</span>${p.familias.map(f => `<span class="rasgo">${FAMILIAS[f]}</span>`).join('')}<span class="rasgo">${p.momentos.map(m => MOMENTOS[m]).join(' y ')}</span><span class="rasgo">Intensidad <span class="intensidad" aria-hidden="true">${puntos}</span>${INTENSIDAD[p.intensidad]}</span></div>
    ${comprar}
    <a class="link-wsp" href="${waConsulta(p)}" target="_blank" rel="noopener">${WSP_ICO}Consultar por este perfume</a>
    ${rel.length ? `<div class="rel"><p class="rel__tit">También te puede interesar</p><ul class="rel__lista">${rel.map(r => `<li><button type="button" data-open="${r.id}"><span class="rel__foto"><img src="${r.img}" alt="" width="800" height="1000"></span><b>${esc(r.nombre)}</b><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}
  </div>`;
}
function abrirProducto(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  qv.querySelector('[data-qv-body]').innerHTML = qvHTML(p);
  const ld = document.getElementById('ldProducto');
  if (ld) {
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: nombreCompleto(p), brand: { '@type': 'Brand', name: p.casa },
      image: new URL(p.img, location.href).href, description: p.desc,
      offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
    });
  }
  clearTimeout(qvTimer);
  if (qv.hidden || !qv.classList.contains('abierto')) {
    qvVolver = origen || document.activeElement;
    qv.hidden = false;
    void qv.offsetWidth;
    qv.classList.add('abierto');
    document.body.classList.add('no-scroll');
  }
  qv.querySelector('.qv__panel').scrollTop = 0;
  qv.querySelector('.qv__cerrar').focus();
}
function cerrarQV(devolver = true) {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('abierto');
  qvTimer = setTimeout(() => { qv.hidden = true; }, reduceMotion ? 0 : 360);
  document.body.classList.remove('no-scroll');
  if (devolver && qvVolver && document.contains(qvVolver)) qvVolver.focus();
}

function syncStepper(st) {
  if (!st) return;
  const inp = st.querySelector('input');
  const max = parseInt(inp.max, 10) || 99;
  const v = Math.max(1, Math.min(parseInt(inp.value, 10) || 1, max));
  inp.value = v;
  const [menos, mas] = st.querySelectorAll('button');
  menos.disabled = v <= 1;
  mas.disabled = v >= max;
  return v;
}

function finalizar() {
  if (!Cart.count()) { showToast('Tu carrito está vacío: sumá un perfume primero'); return; }
  showToast('¡Genial! El pago online se activa al pasar la web a producción.');
}

function initDelegacion() {
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-open], [data-add], [data-buy], [data-step], [data-linea-step], [data-quitar], [data-open-cart], [data-finalizar], [data-qv-cerrar], [data-drawer-cerrar]');
    if (!t) return;
    if (t.matches('[data-qv-cerrar]')) { cerrarQV(); return; }
    if (t.matches('[data-drawer-cerrar]')) { cerrarDrawer(); return; }
    if (t.matches('[data-step]')) {
      const st = t.closest('[data-stepper]');
      const inp = st.querySelector('input');
      inp.value = (parseInt(inp.value, 10) || 1) + Number(t.dataset.step);
      syncStepper(st);
      return;
    }
    if (t.matches('[data-linea-step]')) {
      const it = Cart.get().find(i => i.id === t.dataset.id);
      if (it) Cart.setQty(it.id, it.qty + Number(t.dataset.lineaStep));
      return;
    }
    if (t.matches('[data-quitar]')) {
      const p = getProducto(t.dataset.quitar);
      Cart.remove(t.dataset.quitar);
      showToast(`Sacaste ${p ? p.nombre : 'el perfume'} del carrito`);
      return;
    }
    if (t.matches('[data-open-cart]')) { openCartDrawer(); return; }
    if (t.matches('[data-finalizar]')) { finalizar(); return; }
    if (t.matches('[data-open]')) { abrirProducto(t.dataset.open, t.closest('.qv') ? null : t); return; }
    const id = t.dataset.add || t.dataset.buy;
    const p = getProducto(id);
    if (!p || p.stock <= 0) return;
    const st = t.closest('.pcard, .fila, .enc-item, .qv__comprar')?.querySelector('[data-stepper]');
    const qty = st ? syncStepper(st) : 1;
    const enCarrito = Cart.get().find(i => i.id === p.id)?.qty || 0;
    if (enCarrito >= p.stock) { showToast(`Ya tenés todas las unidades de ${p.nombre} en el carrito`); return; }
    Cart.add(p, qty);
    if (t.matches('[data-buy]')) { openCartDrawer(); return; }
    showToast(`Sumaste ${p.nombre} al carrito`);
    if (st) { st.querySelector('input').value = 1; syncStepper(st); }
  });
  document.addEventListener('change', e => {
    const inp = e.target.closest('[data-stepper] input');
    if (!inp) return;
    const st = inp.closest('[data-stepper]');
    const v = syncStepper(st);
    if (st.dataset.linea) Cart.setQty(st.dataset.linea, v);
  });
  document.addEventListener('keydown', e => {
    const qv = document.getElementById('qv');
    const d = document.getElementById('drawer');
    if (qv && !qv.hidden && qv.classList.contains('abierto')) {
      if (e.key === 'Escape') cerrarQV(); else atraparFoco(qv.querySelector('.qv__panel'), e);
    } else if (d && !d.hidden && d.classList.contains('abierto')) {
      if (e.key === 'Escape') cerrarDrawer(); else atraparFoco(d, e);
    }
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); renderCarrito(); });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.regla-oro', { scaleX: 0, duration: 1.1, clearProps: 'transform' }, 0.4);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-buscar', { y: 22, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.55);
  paso('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
}

function abrirDesdeURL() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirProducto(id);
}

Cart.syncStock();
initCatCounts();
initNavDrop();
initVitrina();
initCarta();
initEncontra();
initCatalogo();
renderCarrito();
initReveals();
initNav();
initModelBarScroll();
initFloats();
updateCartBadge();
initDelegacion();
initHeroMotion();
abrirDesdeURL();
