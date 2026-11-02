const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491158896272';
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
  { id: 'collares', nombre: 'Collares', img: 'images/collar-espiral.webp' },
  { id: 'aros', nombre: 'Aros', img: 'images/aros-hoja.webp' },
  { id: 'anillos', nombre: 'Anillos', img: 'images/anillo-turquesa.webp' },
  { id: 'pulseras', nombre: 'Pulseras', img: 'images/brazalete-martillado.webp' },
  { id: 'prendedores', nombre: 'Prendedores', img: 'images/prendedor-espiral.webp' },
];
const MATERIALES = [
  { id: 'cobre', nombre: 'Cobre' },
  { id: 'cobre-alpaca', nombre: 'Cobre y alpaca' },
  { id: 'cobre-piedra', nombre: 'Cobre con piedra' },
];
const FORMAS = [
  { id: 'espiral', nombre: 'Espiral', lema: 'El camino que vuelve a empezar' },
  { id: 'hoja', nombre: 'Hoja', lema: 'Lo que se renueva' },
  { id: 'circulo', nombre: 'Círculo', lema: 'Lo que no se corta' },
  { id: 'piedra', nombre: 'Piedra', lema: 'La raíz' },
];
const PRECIOS = [
  { id: 'hasta22', nombre: 'Hasta $22.000', min: null, max: 22000 },
  { id: '22a30', nombre: '$22.000 a $30.000', min: 22001, max: 30000 },
  { id: 'mas30', nombre: 'Más de $30.000', min: 30001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  collares: 'collar collares cadena dije colgante cuello',
  aros: 'aros aro pendientes aretes orejas',
  anillos: 'anillo anillos sortija dedo talle',
  pulseras: 'pulsera pulseras brazalete esclava muneca',
  prendedores: 'prendedor prendedores broche alfiler chal poncho',
  cobre: 'cobre martillado', 'cobre-alpaca': 'alpaca plateado dos metales', 'cobre-piedra': 'piedra turquesa',
  espiral: 'espiral ciclos', hoja: 'hoja naturaleza', circulo: 'circulo disco redondo luna', piedra: 'piedra raiz rumi',
};
const TALLES_TURQUESA = ['12', '13', '14', '15', '16', '17', '18', '19', '20'];
const TALLES_BANDA = ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'];

const Tienda = crearTienda([
  { id: 'collar-espiral', nombre: 'Collar Espiral', cat: 'collares', material: 'cobre', forma: 'espiral', precio: 34900, descuento: 0, stock: 6, alta: 30, rango: 1, tag: 'nuevo',
    img: 'images/collar-espiral.webp', alt: 'Collar de cobre con dije en espiral martillado a mano, apoyado sobre lino crudo',
    galeria: [{ src: 'images/collar-espiral-vertical.webp', alt: 'El collar Espiral entero, con su cadena de cobre, sobre lino' }],
    desc: 'Dije en espiral de cobre martillado a mano, con su cadena de cobre. Cada golpe de martillo queda en la superficie, así que no hay dos espirales iguales.',
    datos: [['Dije', '3,5 cm de diámetro'], ['Cadena', 'Cobre, eslabón rolo'], ['Terminación', 'Martillado a mano']],
    opcion: { nombre: 'Largo', valores: ['45 cm', '50 cm', '60 cm'] } },
  { id: 'anillo-turquesa', nombre: 'Anillo Turquesa', cat: 'anillos', material: 'cobre-piedra', forma: 'piedra', precio: 29900, descuento: 0, stock: 3, alta: 26, rango: 2,
    img: 'images/anillo-turquesa.webp', alt: 'Anillo de alambre de cobre trenzado alrededor de una piedra turquesa redonda',
    desc: 'Alambre de cobre trenzado a mano alrededor de una piedra turquesa. El alambre envuelve la piedra y la sostiene como un nido.',
    datos: [['Piedra', 'Turquesa de 1 cm'], ['Aro', 'Triple alambre de cobre'], ['Talles', 'Del 12 al 20']],
    opcion: { nombre: 'Talle', valores: TALLES_TURQUESA } },
  { id: 'aros-hoja', nombre: 'Aros Hoja', cat: 'aros', material: 'cobre', forma: 'hoja', precio: 24900, descuento: 0, stock: 8, alta: 24, rango: 3,
    img: 'images/aros-hoja.webp', alt: 'Par de aros de cobre en forma de hoja con la nervadura marcada, en un plato de cerámica claro',
    desc: 'Hojas de cobre recortadas y martilladas a mano, con la nervadura marcada al centro. Livianas para usar todo el día.',
    datos: [['Largo', '5 cm con el gancho'], ['Gancho', 'Cobre'], ['Peso', 'Liviano']] },
  { id: 'brazalete-martillado', nombre: 'Brazalete martillado', cat: 'pulseras', material: 'cobre', forma: 'circulo', precio: 38500, descuento: 0, stock: 4, alta: 22, rango: 4,
    img: 'images/brazalete-martillado.webp', ancha: 'images/brazalete-ancho.webp', alt: 'Brazalete abierto de cobre martillado, ancho, apoyado sobre una piedra clara',
    galeria: [{ src: 'images/brazalete-ancho.webp', alt: 'El brazalete martillado de perfil sobre la piedra, con la textura del martillo a la vista' }],
    desc: 'Brazalete abierto de chapa de cobre, martillado entero a mano. Se ajusta con una leve presión para que calce en tu muñeca.',
    datos: [['Ancho', '2,5 cm'], ['Cierre', 'Abierto, se ajusta'], ['Material', 'Cobre martillado']] },
  { id: 'pulsera-dije', nombre: 'Pulsera con dije martillado', cat: 'pulseras', material: 'cobre', forma: 'circulo', precio: 21900, descuento: 10, stock: 10, alta: 20, rango: 5,
    img: 'images/pulsera-dije.webp', alt: 'Pulsera de cadena fina de cobre con un pequeño disco martillado que cuelga, sobre mármol',
    desc: 'Cadena fina de cobre con un disco martillado que cuelga. Delicada para sumar a otras pulseras o usarla sola.',
    datos: [['Dije', '1,2 cm'], ['Cierre', 'Mosquetón'], ['Largo', 'A elección']],
    opcion: { nombre: 'Largo', valores: ['16 cm', '18 cm', '20 cm'] } },
  { id: 'colgante-dos-metales', nombre: 'Colgante Dos metales', cat: 'collares', material: 'cobre-alpaca', forma: 'circulo', precio: 36900, descuento: 0, stock: 4, alta: 18, rango: 6,
    img: 'images/colgante-dos-metales.webp', alt: 'Colgante de tres discos superpuestos de cobre y alpaca martillados, con cadena plateada',
    desc: 'Tres discos superpuestos de cobre y alpaca, martillados por separado y unidos a mano. Lleva cadena de alpaca.',
    datos: [['Dije', '4 cm de diámetro'], ['Metales', 'Cobre y alpaca'], ['Cadena', 'Alpaca, 50 cm']] },
  { id: 'prendedor-espiral', nombre: 'Prendedor Espiral', cat: 'prendedores', material: 'cobre', forma: 'espiral', precio: 27500, descuento: 0, stock: 5, alta: 16, rango: 7,
    img: 'images/prendedor-espiral.webp', alt: 'Prendedor de cobre forjado en espiral con alfiler pasante, sobre una tela de lino',
    desc: 'Espiral de cobre forjado con alfiler pasante, para sostener un chal, un poncho o el cuello de un saco.',
    datos: [['Medida', '5,5 cm de diámetro'], ['Alfiler', 'Cobre'], ['Terminación', 'Martillado a mano']] },
  { id: 'aros-discos', nombre: 'Aros Discos', cat: 'aros', material: 'cobre', forma: 'circulo', precio: 18900, descuento: 0, stock: 12, alta: 28, rango: 8, tag: 'nuevo',
    img: 'images/aros-discos.webp', alt: 'Aros pasantes de cobre: dos discos martillados apoyados en un plato de cerámica',
    desc: 'Discos de cobre martillado con perno. Chicos, para usar todos los días.',
    datos: [['Medida', '1,4 cm de diámetro'], ['Cierre', 'Perno con traba'], ['Terminación', 'Martillado a mano']] },
  { id: 'anillo-banda', nombre: 'Anillo Banda martillado', cat: 'anillos', material: 'cobre', forma: 'circulo', precio: 19900, descuento: 0, stock: 9, alta: 14, rango: 9,
    img: 'images/anillo-banda.webp', alt: 'Anillo banda de cobre martillado apoyado sobre una piedra gris redondeada',
    desc: 'Banda de cobre de 5 mm, martillada a mano. Sola o combinada con otros anillos.',
    datos: [['Ancho', '5 mm'], ['Talles', 'Del 12 al 22'], ['Material', 'Cobre martillado']],
    opcion: { nombre: 'Talle', valores: TALLES_BANDA } },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const nombreDe = (lista, id) => (lista.find(x => x.id === id) || {}).nombre || '';
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, p.tags || '', ETIQUETAS[p.cat] || '', nombreDe(CATEGORIAS, p.cat),
    ETIQUETAS[p.material] || '', nombreDe(MATERIALES, p.material), ETIQUETAS[p.forma] || '', nombreDe(FORMAS, p.forma),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), mat = lista(f.material), forma = lista(f.forma), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (mat.length && !mat.includes(p.material)) return false;
    if (forma.length && !forma.includes(p.forma)) return false;
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
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const catDe = id => CATEGORIAS.find(c => c.id === id) || { nombre: '' };
const formaDe = id => FORMAS.find(f => f.id === id) || { nombre: '', lema: '' };
const matDe = id => MATERIALES.find(m => m.id === id) || { nombre: '' };
const piezas = n => `${n} ${n === 1 ? 'pieza' : 'piezas'}`;
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } };
const leer = (k, def) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? def; } catch { return def; } };

const ICO = {
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
};

const Cart = {
  KEY: 'origenrumi_cart',
  get() {
    const a = leer(this.KEY, []);
    if (!Array.isArray(a)) return [];
    return a.filter(i => i && getProducto(i.id) && i.qty > 0).map(i => ({ id: i.id, op: String(i.op || ''), qty: i.qty }));
  },
  save(items) {
    guardar(this.KEY, items.map(({ id, op, qty }) => ({ id, op, qty })));
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  tope(p, items, k) {
    const otros = items.filter(i => i.id === p.id && `${i.id}|${i.op}` !== k).reduce((s, i) => s + i.qty, 0);
    return Math.max(1, (p.stock ?? 99) - otros);
  },
  add(producto, qty = 1, op = '') {
    const items = this.get();
    const k = `${producto.id}|${op}`;
    const max = this.tope(producto, items, k);
    const existing = items.find(i => `${i.id}|${i.op}` === k);
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, op, qty: Math.min(qty, max) });
    this.save(items);
  },
  setQty(idx, qty) {
    const items = this.get(); const it = items[idx]; if (!it) return;
    it.qty = Math.max(1, Math.min(qty, this.tope(getProducto(it.id), items, `${it.id}|${it.op}`)));
    this.save(items);
  },
  maxDe(idx) { const items = this.get(); const it = items[idx]; return it ? this.tope(getProducto(it.id), items, `${it.id}|${it.op}`) : 1; },
  remove(idx) { const items = this.get(); items.splice(idx, 1); this.save(items); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
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
  if (p.descuento > 0) return `<p class="precio precio--desc"><b>${formatearPrecio(precioFinal(p))}</b> <s>${formatearPrecio(p.precio)}</s></p>`;
  return `<p class="precio">${formatearPrecio(p.precio)}</p>`;
}
function badgeHTML(p) {
  if (p.descuento > 0) return `<span class="badge badge--desc">-${p.descuento}%</span>`;
  if ((p.stock ?? 99) <= 3) return '<span class="badge badge--ultimas">Últimas unidades</span>';
  if (p.tag === 'nuevo') return '<span class="badge">Nuevo</span>';
  return '';
}
const ANIM_CARD = 'data-animate="subir" style="opacity:0;transform:translateY(36px)"';
function stepperHTML(id, max) {
  return `<div class="stepper" data-stepper="${id}"><button type="button" data-step="-1" aria-label="Restar uno" disabled>${ICO.menos}</button><output aria-live="polite">1</output><button type="button" data-step="1" aria-label="Sumar uno"${max <= 1 ? ' disabled' : ''}>${ICO.mas}</button></div>`;
}
function cardHTML(p, animar = true) {
  const forma = formaDe(p.forma);
  const etiquetaAdd = p.opcion ? `Elegir ${p.opcion.nombre.toLowerCase()}` : 'Agregar';
  return `<article class="card" ${animar ? ANIM_CARD : ''} data-id="${p.id}">
    <button type="button" class="card__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">${badgeHTML(p)}<img src="${p.img}" width="1000" height="1000" alt="${esc(p.alt)}" decoding="async"></button>
    <div class="card__info">
      <p class="card__forma">${esc(forma.nombre)}</p>
      <h3 class="card__nombre">${esc(p.nombre)}</h3>
      ${precioHTML(p)}
      <div class="prod-actions">${p.opcion ? '' : stepperHTML(p.id, p.stock)}<button type="button" class="prod-add" data-add="${p.id}" aria-label="${esc(etiquetaAdd)}: ${esc(p.nombre)}">${ICO.carrito}<span class="prod-add__txt">${esc(etiquetaAdd)}</span></button></div>
      <button type="button" class="prod-ahora" data-ahora="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}
function vcardHTML(p, animar = true, ancha = false) {
  const forma = formaDe(p.forma);
  const src = ancha && p.ancha ? p.ancha : p.img;
  const dims = ancha && p.ancha ? 'width="1600" height="900"' : 'width="1000" height="1000"';
  const etiquetaAdd = p.opcion ? `Elegir ${p.opcion.nombre.toLowerCase()}` : 'Agregar al carrito';
  return `<article class="vcard" ${animar ? ANIM_CARD : ''} data-id="${p.id}">
    <button type="button" class="vcard__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">${badgeHTML(p)}<img src="${src}" ${dims} alt="${esc(p.alt)}" decoding="async"></button>
    <div class="vcard__info">
      <p class="vcard__forma">${esc(forma.nombre)}</p>
      <h3 class="vcard__nombre">${esc(p.nombre)}</h3>
      <p class="vcard__precio">${formatearPrecio(precioFinal(p))}${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>
      <button type="button" class="vcard__add" data-add="${p.id}" aria-label="${esc(etiquetaAdd)}: ${esc(p.nombre)}">${p.opcion ? ICO.flecha : ICO.carrito}</button>
    </div>
  </article>`;
}
function fichaHTML(p) {
  const forma = formaDe(p.forma);
  return `<article class="ficha" ${ANIM_CARD} data-id="${p.id}">
    <button type="button" class="ficha__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">${badgeHTML(p)}<img src="${p.img}" width="1000" height="1000" alt="${esc(p.alt)}" decoding="async"></button>
    <div class="ficha__info">
      <p class="ficha__forma">${esc(forma.nombre)}</p>
      <h3 class="ficha__nombre">${esc(p.nombre)}</h3>
      <p class="ficha__sentido">${esc(forma.lema)}</p>
      <div class="ficha__pie">${precioHTML(p)}<button type="button" class="ficha__ver" data-quick="${p.id}">Ver pieza</button></div>
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
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const sellos = hero.querySelectorAll('.sello');
  const dibujar = () => sellos.forEach(s => s.classList.add('dibujado'));
  if (reduceMotion || typeof gsap === 'undefined') { dibujar(); return; }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  const arcos = hero.querySelectorAll('.vitrina__arco');
  if (arcos.length) {
    tl.from(arcos, { y: 70, duration: 1.4, stagger: 0.12, clearProps: 'transform' }, 0.1);
    tl.from(hero.querySelectorAll('.vitrina__arco img'), { scale: 1.12, duration: 1.8, stagger: 0.12, clearProps: 'transform' }, 0.1);
  }
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero__nota span, .vitrina__pie'), { y: 12, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75)
    .from(sellos, { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity', onStart: dibujar }, 0.7);
}
function initSello() {
  const anillos = document.querySelectorAll('.sello__anillo');
  if (!anillos.length || reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  anillos.forEach(a => gsap.to(a, { rotation: 300, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 1.2 } }));
}
function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const img = document.querySelector('.hero--partido [data-hero-img]');
  if (img) gsap.to(img, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
}
function initLeeScroll() {
  const els = document.querySelectorAll('[data-lee]');
  if (!els.length) return;
  els.forEach(el => {
    const palabras = el.textContent.trim().split(/\s+/);
    if (palabras.length < 2) return;
    el.textContent = '';
    palabras.forEach((palabra, i) => {
      const s = document.createElement('span');
      s.className = 'lee-w';
      s.textContent = palabra;
      el.appendChild(s);
      if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    document.querySelectorAll('.lee-w').forEach(w => w.classList.add('on'));
    return;
  }
  els.forEach(el => {
    const ws = el.querySelectorAll('.lee-w');
    if (!ws.length) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: .4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
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
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('.nav-drop__btn, a')?.focus();
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
  const lista = document.querySelector('[data-menu-categorias]');
  if (lista) {
    const actual = PAGINA === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
    lista.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: c.id });
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${actual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" width="44" height="44" alt=""><span class="nav-drop__nom">${esc(c.nombre)}</span><span class="nav-drop__cant">${n}</span></a></li>`;
    }).join('');
  }
  const drop = document.querySelector('[data-drop]');
  if (!drop) return;
  const btn = drop.querySelector('.nav-drop__btn');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  let timer = 0;
  const abrir = () => { clearTimeout(timer); drop.classList.add('abierto'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(timer); drop.classList.remove('abierto'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (drop.classList.contains('abierto') ? cerrar() : abrir()));
  drop.addEventListener('mouseenter', () => { if (hover.matches) abrir(); });
  drop.addEventListener('mouseleave', () => { if (hover.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 120); } });
  drop.addEventListener('focusout', e => { if (hover.matches && !drop.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (!drop.contains(e.target) && window.matchMedia('(min-width: 1025px)').matches) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drop.classList.contains('abierto')) { cerrar(); btn.focus(); } });
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

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
function atrapar(cont, e) {
  if (e.key !== 'Tab') return;
  const els = [...cont.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
  if (!els.length) return;
  const primero = els[0], ultimo = els[els.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
function abrirCapa(el, bd) {
  el.hidden = false; bd.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.add('open'); bd.classList.add('open'); }));
}
function cerrarCapa(el, bd, despues) {
  el.classList.remove('open'); bd.classList.remove('open');
  setTimeout(() => {
    el.hidden = true; bd.hidden = true;
    if (!document.querySelector('.drawer.open, .modal.open')) document.body.classList.remove('no-scroll');
    despues?.();
  }, 320);
}

const Drawer = {
  el: null, bd: null, origen: null,
  init() {
    this.el = document.getElementById('carrito');
    this.bd = document.querySelector('[data-drawer-bd]');
    if (!this.el || !this.bd) return;
    this.bd.addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); else atrapar(this.el, e); });
    this.el.addEventListener('click', e => {
      if (e.target.closest('[data-close-cart]')) { this.close(); return; }
      const paso = e.target.closest('[data-linea-step]');
      if (paso) {
        const idx = Number(paso.closest('[data-idx]').dataset.idx);
        const it = Cart.get()[idx];
        if (it) Cart.setQty(idx, it.qty + Number(paso.dataset.lineaStep));
        return;
      }
      const quitar = e.target.closest('[data-quitar]');
      if (quitar) {
        const idx = Number(quitar.closest('[data-idx]').dataset.idx);
        const it = Cart.get()[idx];
        Cart.remove(idx);
        if (it) showToast(`Sacaste ${getProducto(it.id)?.nombre || 'la pieza'} del carrito.`);
        this.el.querySelector('.drawer__cab button')?.focus();
        return;
      }
      if (e.target.closest('[data-checkout]')) {
        showToast('¡Genial! El pago online se activa al pasar la web a producción.');
        return;
      }
      if (e.target.closest('[data-ir-catalogo]')) this.close();
    });
    document.addEventListener('cart:updated', () => this.render());
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-open-cart]');
      if (b) { e.preventDefault(); this.open(b); }
    });
    this.render();
  },
  render() {
    if (!this.el) return;
    const body = this.el.querySelector('[data-lineas]');
    const foot = this.el.querySelector('[data-foot]');
    const items = Cart.get();
    if (!items.length) {
      body.innerHTML = `<div class="carrito-vacio">${ICO.carrito}<h3>Tu carrito está vacío</h3><p>Elegí una pieza y sumala desde la tienda: queda guardada acá.</p><a class="btn btn--cta" href="${CATALOGO_URL}" data-ir-catalogo>Ver el catálogo</a></div>`;
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    body.innerHTML = items.map((it, idx) => {
      const p = getProducto(it.id);
      const max = Cart.maxDe(idx);
      const op = it.op ? `${p.opcion?.nombre || 'Opción'}: ${esc(it.op)}` : esc(formaDe(p.forma).nombre);
      return `<div class="linea" data-idx="${idx}" style="animation-delay:${Math.min(idx * 0.05, 0.3)}s">
        <img src="${p.img}" width="72" height="72" alt="">
        <div><p class="linea__nom">${esc(p.nombre)}</p><p class="linea__op">${op}</p>
          <div class="linea__fila"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno"${it.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${it.qty}</output><button type="button" data-linea-step="1" aria-label="Sumar uno"${it.qty >= max ? ' disabled' : ''}>${ICO.mas}</button></div>
          <button type="button" class="linea__quitar" data-quitar>Quitar</button></div></div>
        <p class="linea__precio">${formatearPrecio(precioFinal(p) * it.qty)}</p>
      </div>`;
    }).join('');
    this.el.querySelector('[data-cart-total]').textContent = formatearPrecio(Cart.total());
  },
  open(origen) {
    if (!this.el) return;
    this.origen = origen || document.activeElement;
    this.render();
    abrirCapa(this.el, this.bd);
    setTimeout(() => this.el.querySelector('.drawer__cab button')?.focus(), 60);
  },
  close() {
    if (!this.el || !this.el.classList.contains('open')) return;
    cerrarCapa(this.el, this.bd, () => this.origen?.focus?.());
  },
};
function openCartDrawer() { Drawer.open(); }

const Modal = {
  el: null, bd: null, origen: null, p: null, op: '', qty: 1,
  init() {
    this.el = document.getElementById('vista');
    this.bd = document.querySelector('[data-modal-bd]');
    if (!this.el || !this.bd) return;
    this.bd.addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); else atrapar(this.el, e); });
    this.el.addEventListener('click', e => {
      if (e.target.closest('[data-close-modal]')) { this.close(); return; }
      const mini = e.target.closest('[data-mini]');
      if (mini) {
        const img = this.el.querySelector('.vista__principal img');
        img.src = mini.dataset.mini; img.alt = mini.dataset.alt || '';
        this.el.querySelectorAll('[data-mini]').forEach(b => b.setAttribute('aria-pressed', String(b === mini)));
        return;
      }
      const op = e.target.closest('[data-op]');
      if (op) {
        this.op = op.dataset.op;
        this.el.querySelectorAll('[data-op]').forEach(b => b.setAttribute('aria-pressed', String(b === op)));
        const aviso = this.el.querySelector('[data-op-aviso]');
        if (aviso) aviso.hidden = true;
        this.syncQty();
        return;
      }
      const paso = e.target.closest('[data-vstep]');
      if (paso) { this.qty += Number(paso.dataset.vstep); this.syncQty(); return; }
      if (e.target.closest('[data-vadd]')) { this.agregar(false); return; }
      if (e.target.closest('[data-vahora]')) { this.agregar(true); return; }
      if (e.target.closest('[data-ir-guia]')) { this.close(false); return; }
      const rel = e.target.closest('[data-rel]');
      if (rel) this.mostrar(rel.dataset.rel);
    });
  },
  maximo() {
    if (!this.p) return 1;
    const items = Cart.get();
    const enCarrito = items.filter(i => i.id === this.p.id).reduce((s, i) => s + i.qty, 0);
    return Math.max(1, (this.p.stock ?? 99) - enCarrito);
  },
  syncQty() {
    const max = this.maximo();
    this.qty = Math.max(1, Math.min(this.qty, max));
    const out = this.el.querySelector('[data-vqty]');
    if (out) out.textContent = this.qty;
    const menos = this.el.querySelector('[data-vstep="-1"]'), mas = this.el.querySelector('[data-vstep="1"]');
    if (menos) menos.disabled = this.qty <= 1;
    if (mas) mas.disabled = this.qty >= max;
  },
  agregar(ahora) {
    const p = this.p;
    if (!p) return;
    if (p.opcion && !this.op) {
      const aviso = this.el.querySelector('[data-op-aviso]');
      if (aviso) aviso.hidden = false;
      this.el.querySelector('[data-op]')?.focus();
      return;
    }
    Cart.add(p, this.qty, this.op);
    const detalle = this.op ? ` (${p.opcion.nombre.toLowerCase()} ${this.op})` : '';
    if (ahora) {
      this.close(false);
      setTimeout(() => Drawer.open(this.origen), 340);
    } else {
      showToast(`Sumaste ${p.nombre}${detalle} al carrito.`);
      this.syncQty();
    }
  },
  html(p) {
    const fotos = [{ src: p.img, alt: p.alt }, ...(p.galeria || [])];
    const forma = formaDe(p.forma);
    const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
    if (rel.length < 3) rel.push(...Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
    const msg = `Hola Origen Rumi! Quiero consultar por la pieza «${p.nombre}» que vi en la web.`;
    return `<div class="vista">
      <div class="vista__galeria">
        <div class="vista__principal"><img src="${fotos[0].src}" alt="${esc(fotos[0].alt)}" width="1000" height="1000"></div>
        ${fotos.length > 1 ? `<div class="vista__miniaturas">${fotos.map((f, i) => `<button type="button" data-mini="${f.src}" data-alt="${esc(f.alt)}" aria-pressed="${i === 0}" aria-label="Ver foto ${i + 1}"><img src="${f.src}" alt="" width="64" height="64"></button>`).join('')}</div>` : ''}
      </div>
      <div class="vista__info">
        <p class="vista__cat">${esc(catDe(p.cat).nombre)} · ${esc(matDe(p.material).nombre)}</p>
        <h2>${esc(p.nombre)}</h2>
        <p class="vista__sentido">${esc(forma.nombre)}: ${esc(forma.lema.toLowerCase())}</p>
        ${precioHTML(p)}
        <p class="vista__desc">${esc(p.desc)}</p>
        <dl class="vista__datos">${(p.datos || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        ${p.opcion ? `<fieldset class="opciones"><legend>Elegí el ${esc(p.opcion.nombre.toLowerCase())}</legend><div class="opciones__lista">${p.opcion.valores.map(v => `<button type="button" data-op="${esc(v)}" aria-pressed="false">${esc(v)}</button>`).join('')}</div><p class="opciones__aviso" data-op-aviso hidden>Elegí el ${esc(p.opcion.nombre.toLowerCase())} para sumarlo al carrito.</p>${p.opcion.nombre === 'Talle' ? `<a class="opciones__guia" href="#guia" data-ir-guia>¿No sabés tu talle? Usá la guía</a>` : ''}</fieldset>` : ''}
        <div class="vista__compra">
          <div class="stepper"><button type="button" data-vstep="-1" aria-label="Restar uno">${ICO.menos}</button><output data-vqty aria-live="polite">1</output><button type="button" data-vstep="1" aria-label="Sumar uno">${ICO.mas}</button></div>
          <button type="button" class="btn btn--cta" data-vadd>${ICO.carrito} Agregar al carrito</button>
          <button type="button" class="btn btn--linea" data-vahora>Comprar ahora</button>
        </div>
        <p class="vista__nota">Hecha a mano: la textura del martillo cambia apenas de una pieza a otra.</p>
        <a class="link-wsp vista__wsp" href="${waLink(msg)}" target="_blank" rel="noopener">${ICO.wsp} Consultar por esta pieza</a>
        ${rel.length ? `<div class="relacionados"><h3>También te puede interesar</h3><div class="relacionados__lista">${rel.map(r => `<button type="button" data-rel="${r.id}"><img src="${r.img}" alt="" width="200" height="200">${esc(r.nombre)}</button>`).join('')}</div></div>` : ''}
      </div>
    </div>`;
  },
  mostrar(id) {
    const p = getProducto(id);
    if (!p) return;
    this.p = p; this.op = ''; this.qty = 1;
    this.el.querySelector('[data-modal-cuerpo]').innerHTML = this.html(p);
    this.el.setAttribute('aria-label', `Detalle: ${p.nombre}`);
    this.el.scrollTop = 0;
    this.syncQty();
    const guia = this.el.querySelector('[data-ir-guia]');
    if (guia) guia.href = document.getElementById('guia') ? '#guia' : (MODELO === '2' ? 'modelo-2.html#guia' : './#guia');
    if (PAGINA === 'catalogo') { const u = new URL(location.href); u.searchParams.set('producto', id); history.replaceState(null, '', u); }
  },
  open(id, origen) {
    if (!this.el) return;
    this.origen = origen || document.activeElement;
    this.mostrar(id);
    if (!this.el.classList.contains('open')) abrirCapa(this.el, this.bd);
    setTimeout(() => this.el.querySelector('.modal__cerrar')?.focus(), 60);
  },
  close(devolver = true) {
    if (!this.el || !this.el.classList.contains('open')) return;
    if (PAGINA === 'catalogo') { const u = new URL(location.href); u.searchParams.delete('producto'); history.replaceState(null, '', u); }
    cerrarCapa(this.el, this.bd, () => { if (devolver) this.origen?.focus?.(); });
  },
};

function initCardAcciones() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) { Modal.open(quick.dataset.quick, quick); return; }
    const paso = e.target.closest('[data-step]');
    if (paso) {
      const st = paso.closest('[data-stepper]');
      const p = getProducto(st.dataset.stepper);
      const out = st.querySelector('output');
      const n = Math.max(1, Math.min((Number(out.textContent) || 1) + Number(paso.dataset.step), p?.stock ?? 99));
      out.textContent = n;
      st.querySelector('[data-step="-1"]').disabled = n <= 1;
      st.querySelector('[data-step="1"]').disabled = n >= (p?.stock ?? 99);
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      if (p.opcion) { Modal.open(p.id, add); return; }
      const st = add.closest('.prod-actions')?.querySelector('[data-stepper] output');
      const qty = st ? Number(st.textContent) || 1 : 1;
      Cart.add(p, qty);
      showToast(`Sumaste ${p.nombre} al carrito.`);
      add.classList.add('ok');
      setTimeout(() => add.classList.remove('ok'), 900);
      return;
    }
    const ahora = e.target.closest('[data-ahora]');
    if (ahora) {
      const p = getProducto(ahora.dataset.ahora);
      if (!p) return;
      if (p.opcion) { Modal.open(p.id, ahora); return; }
      const st = ahora.closest('.card__info')?.querySelector('[data-stepper] output');
      Cart.add(p, st ? Number(st.textContent) || 1 : 1);
      Drawer.open(ahora);
    }
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

function initConteos() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => { el.textContent = piezas(Tienda.contar({ cat: el.dataset.cuentaCat })); });
  document.querySelectorAll('[data-cuenta-forma]').forEach(el => { el.textContent = piezas(Tienda.contar({ forma: el.dataset.cuentaForma })); });
  document.querySelectorAll('[data-total]').forEach(el => { el.textContent = Tienda.contar({}); });
  const chips = document.querySelector('[data-chips]');
  if (chips) {
    chips.innerHTML = CATEGORIAS.map(c => `<li data-animate="subir" style="opacity:0;transform:translateY(20px)"><a class="chip" href="${CATALOGO_URL}?cat=${c.id}">${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a></li>`).join('');
  }
  document.querySelectorAll('select[data-piezas]').forEach(sel => {
    sel.insertAdjacentHTML('beforeend', Tienda.consultar({ orden: 'nombre', limite: Tienda.TOPE }).items.map(p => `<option value="${p.id}">${esc(p.nombre)}</option>`).join('') + '<option value="otra">Otra pieza</option>');
  });
}
function initPreview() {
  const fichas = document.querySelector('[data-fichas]');
  if (fichas) {
    const n = Number(fichas.dataset.fichas) || 6;
    fichas.innerHTML = Tienda.consultar({ orden: 'destacados', limite: Math.min(n, 8) }).items.map(fichaHTML).join('');
  }
  const mosaico = document.querySelector('[data-mosaico]');
  if (mosaico) {
    const n = Number(mosaico.dataset.mosaico) || 6;
    const items = Tienda.consultar({ orden: 'destacados', limite: Math.min(n, 8) }).items;
    const k = items.findIndex(p => p.ancha);
    if (k > 0) items.unshift(items.splice(k, 1)[0]);
    const mas = mosaico.querySelector('.mosaico__mas');
    mosaico.insertAdjacentHTML('afterbegin', items.map((p, i) => vcardHTML(p, true, i === 0)).join(''));
    if (mas) mosaico.appendChild(mas);
  }
}

function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach(caja => {
    const tabs = [...caja.querySelectorAll('[role="tab"]')];
    const activar = (tab, foco) => {
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (foco) tab.focus();
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => activar(t, false));
      t.addEventListener('keydown', e => {
        let j = null;
        if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') j = 0;
        if (e.key === 'End') j = tabs.length - 1;
        if (j != null) { e.preventDefault(); activar(tabs[j], true); }
      });
    });
    caja._activar = id => { const t = tabs.find(x => x.getAttribute('aria-controls') === id); if (t) activar(t, false); };
  });
}
function irAGuia() {
  if (location.hash !== '#guia') return;
  const guia = document.getElementById('guia');
  if (!guia) return;
  const panel = guia.closest('[role="tabpanel"]');
  const caja = panel?.closest('[data-tabs]');
  if (caja && caja._activar) caja._activar(panel.id);
  const det = guia.closest('details');
  if (det) det.open = true;
  setTimeout(() => guia.scrollIntoView({ block: 'start' }), 60);
}

function initGuia() {
  const g = document.querySelector('[data-guia]');
  if (!g) return;
  const rango = g.querySelector('[data-guia-rango]');
  const salida = g.querySelector('[data-guia-valor]');
  const etq = g.querySelector('[data-guia-etq]');
  const ayuda = g.querySelector('[data-guia-ayuda]');
  const escMin = g.querySelector('[data-escala-min]'), escMax = g.querySelector('[data-escala-max]');
  const talleEl = g.querySelector('[data-guia-talle]');
  const datos = g.querySelector('[data-guia-datos]');
  const aro = g.querySelector('.guia__aro-c');
  const aroTxt = g.querySelector('.guia__aro-txt');
  const acciones = g.querySelector('[data-guia-acciones]');
  const wsp = g.querySelector('[data-guia-wsp]');
  const MODOS = {
    anillo: { etq: 'Diámetro interno de tu anillo', min: 14, max: 23, step: 0.1, valor: 17.2, ayuda: 'Apoyá un anillo que te quede bien y medilo por dentro, de borde a borde, con una regla.' },
    dedo: { etq: 'Contorno de tu dedo', min: 44, max: 72, step: 0.5, valor: 54, ayuda: 'Rodeá el dedo con un hilo o una tira de papel, marcá dónde se junta y medí ese largo con una regla.' },
  };
  let modo = 'anillo';
  const num = (n, d = 1) => n.toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const anillos = ['anillo-banda', 'anillo-turquesa'].map(getProducto).filter(Boolean);
  const pintar = () => {
    const v = Number(rango.value);
    const contorno = modo === 'anillo' ? Math.PI * v : v;
    const diametro = modo === 'anillo' ? v : v / Math.PI;
    const talle = Math.max(5, Math.min(32, Math.round(contorno - 40)));
    salida.textContent = `${num(v)} mm`;
    talleEl.textContent = talle;
    datos.textContent = `Contorno ${num(contorno, 0)} mm · diámetro ${num(diametro)} mm`;
    if (aro) aro.setAttribute('r', String(Math.round(16 + (diametro - 14) * 3.2)));
    if (aroTxt) aroTxt.textContent = talle;
    const disponibles = anillos.filter(p => p.opcion.valores.includes(String(talle)));
    acciones.innerHTML = disponibles.length
      ? disponibles.map(p => `<button type="button" class="guia__sumar" data-guia-sumar="${p.id}" data-talle="${talle}"><img src="${p.img}" alt="" width="36" height="36"><span>Sumar ${esc(p.nombre)} en talle ${talle}</span><b>${formatearPrecio(precioFinal(p))}</b></button>`).join('')
      : `<p class="guia__nota">El talle ${talle} no está en la tienda: escribinos y lo vemos juntos.</p>`;
    if (wsp) wsp.href = waLink(`Hola Origen Rumi! Usé la guía de talles y me dio talle ${talle}. ¿Me ayudan a elegir un anillo?`);
  };
  const ponerModo = m => {
    modo = m;
    const cfg = MODOS[m];
    g.querySelectorAll('[data-modo]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.modo === m)));
    rango.min = cfg.min; rango.max = cfg.max; rango.step = cfg.step; rango.value = cfg.valor;
    etq.textContent = cfg.etq; ayuda.textContent = cfg.ayuda;
    if (escMin) escMin.textContent = `${cfg.min} mm`;
    if (escMax) escMax.textContent = `${cfg.max} mm`;
    pintar();
  };
  g.addEventListener('click', e => {
    const b = e.target.closest('[data-modo]');
    if (b) { ponerModo(b.dataset.modo); return; }
    const s = e.target.closest('[data-guia-sumar]');
    if (s) {
      const p = getProducto(s.dataset.guiaSumar);
      Cart.add(p, 1, s.dataset.talle);
      showToast(`Sumaste ${p.nombre} en talle ${s.dataset.talle} al carrito.`);
    }
  });
  rango.addEventListener('input', pintar);
  ponerModo('anillo');
}

function initFormRef() {
  document.querySelectorAll('[data-form-ref]').forEach(form => {
    const campos = [
      { el: form.querySelector('[name="nombre"]'), ok: v => v.trim().length >= 2, msg: 'Contanos tu nombre (o cómo querés que aparezca).' },
      { el: form.querySelector('[name="pieza"]'), ok: v => !!v, msg: 'Elegí la pieza que compraste.' },
      { el: form.querySelector('[name="comentario"]'), ok: v => v.trim().length >= 10, msg: 'Escribí al menos una frase sobre tu pieza.' },
    ].filter(c => c.el);
    const marcar = (c, mostrar) => {
      const ok = c.ok(c.el.value);
      const err = document.getElementById(c.el.getAttribute('aria-describedby'));
      c.el.setAttribute('aria-invalid', String(!ok && mostrar));
      if (err) { err.textContent = !ok && mostrar ? c.msg : ''; err.hidden = ok || !mostrar; }
      return ok;
    };
    campos.forEach(c => c.el.addEventListener('blur', () => marcar(c, c.el.value !== '')));
    campos.forEach(c => c.el.addEventListener('input', () => { if (c.el.getAttribute('aria-invalid') === 'true') marcar(c, true); }));
    form.addEventListener('submit', e => {
      e.preventDefault();
      const malos = campos.filter(c => !marcar(c, true));
      if (malos.length) { malos[0].el.focus(); return; }
      const btn = form.querySelector('[type="submit"]');
      const txt = btn.innerHTML;
      btn.disabled = true; btn.textContent = 'Enviando…';
      setTimeout(() => {
        btn.disabled = false; btn.innerHTML = txt;
        showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
        form.reset();
        campos.forEach(c => marcar(c, false));
      }, 800);
    });
  });
}

function initCatalogo() {
  const grid = document.querySelector('[data-catalogo]');
  if (!grid) return;
  const form = document.querySelector('[data-filtros]');
  const buscador = document.getElementById('buscar');
  const ordenSel = document.getElementById('orden');
  const contador = document.querySelector('[data-contador]');
  const verMas = document.querySelector('[data-ver-mas]');
  const miga = document.querySelector('[data-miga-cat]');
  const params = new URLSearchParams(location.search);
  const valida = (lista, v) => lista.some(x => x.id === v);
  const multiples = (clave, lista) => (params.get(clave) || '').split(',').filter(v => valida(lista, v));
  const estado = {
    cat: multiples('cat', CATEGORIAS),
    material: multiples('material', MATERIALES),
    forma: multiples('forma', FORMAS),
    precio: valida(PRECIOS, params.get('precio')) ? params.get('precio') : '',
    orden: valida(ORDENES, params.get('orden')) ? params.get('orden') : 'destacados',
    q: (params.get('q') || '').slice(0, 60),
  };
  const GRUPOS = { cat: CATEGORIAS, material: MATERIALES, forma: FORMAS };
  Object.entries(GRUPOS).forEach(([g, lista]) => {
    const cont = form.querySelector(`[data-ops="${g}"]`);
    if (!cont) return;
    cont.innerHTML = lista.map(x => `<label class="opcion"><input type="checkbox" data-f="${g}" value="${x.id}"${estado[g].includes(x.id) ? ' checked' : ''}> ${esc(x.nombre)} <small>${Tienda.contar({ [g]: x.id })}</small></label>`).join('');
  });
  const precioCont = form.querySelector('[data-ops="precio"]');
  if (precioCont) {
    precioCont.innerHTML = [{ id: '', nombre: 'Todos los precios' }, ...PRECIOS].map(x => `<label class="opcion"><input type="radio" name="precio" value="${x.id}"${estado.precio === x.id ? ' checked' : ''}> ${esc(x.nombre)}</label>`).join('');
  }
  if (ordenSel) {
    ordenSel.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === estado.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  }
  if (buscador) buscador.value = estado.q;

  const filtros = () => {
    const f = { cat: estado.cat, material: estado.material, forma: estado.forma };
    const pr = PRECIOS.find(x => x.id === estado.precio);
    if (pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    if (estado.q.trim()) f.q = estado.q.trim();
    return f;
  };
  const syncUrl = () => {
    const u = new URL(location.href);
    ['cat', 'material', 'forma', 'precio', 'orden', 'q', 'buscar'].forEach(k => u.searchParams.delete(k));
    if (estado.cat.length) u.searchParams.set('cat', estado.cat.join(','));
    if (estado.material.length) u.searchParams.set('material', estado.material.join(','));
    if (estado.forma.length) u.searchParams.set('forma', estado.forma.join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    if (estado.q.trim()) u.searchParams.set('q', estado.q.trim());
    history.replaceState(null, '', u);
  };
  let cursor = null, mostrados = 0;
  const pintarCard = p => (MODELO === '2' ? vcardHTML(p) : cardHTML(p));
  function render(reiniciar) {
    const f = filtros();
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const r = Tienda.consultar({ filtros: f, orden: estado.orden, cursor, limite: POR_PAGINA });
    cursor = r.cursor;
    mostrados += r.items.length;
    if (reiniciar && !r.items.length) {
      grid.innerHTML = `<div class="vacio"><h2>No encontramos piezas con esos filtros</h2><p>Probá con otra palabra o sacá algún filtro: el catálogo tiene ${piezas(Tienda.contar({}))}.</p><button type="button" class="btn btn--cta" data-limpiar>Ver todas las piezas</button></div>`;
    } else {
      grid.insertAdjacentHTML('beforeend', r.items.map(pintarCard).join(''));
    }
    const total = f.q ? null : Tienda.contar(f);
    if (contador) contador.textContent = total != null ? `${piezas(total)}${total !== Tienda.contar({}) ? ' con estos filtros' : ''}` : `${piezas(mostrados)}${cursor ? ' o más' : ''} para «${f.q}»`;
    if (verMas) verMas.hidden = !cursor;
    if (miga) {
      const una = estado.cat.length === 1 ? catDe(estado.cat[0]).nombre : '';
      miga.hidden = !una; miga.textContent = una;
    }
    document.querySelectorAll('[data-menu-categorias] a').forEach(a => {
      const id = new URL(a.href).searchParams.get('cat');
      if (estado.cat.length === 1 && id === estado.cat[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  const sincronizarControles = () => {
    form.querySelectorAll('input[data-f]').forEach(i => { i.checked = estado[i.dataset.f].includes(i.value); });
    form.querySelectorAll('input[name="precio"]').forEach(i => { i.checked = i.value === estado.precio; });
    if (buscador) buscador.value = estado.q;
  };
  form.addEventListener('change', e => {
    const t = e.target;
    if (t.matches('input[data-f]')) estado[t.dataset.f] = [...form.querySelectorAll(`input[data-f="${t.dataset.f}"]:checked`)].map(i => i.value);
    if (t.name === 'precio') estado.precio = t.value;
    syncUrl(); render(true);
  });
  form.addEventListener('submit', e => e.preventDefault());
  const limpiar = () => {
    estado.cat = []; estado.material = []; estado.forma = []; estado.precio = ''; estado.q = '';
    sincronizarControles(); syncUrl(); render(true);
  };
  document.addEventListener('click', e => { if (e.target.closest('[data-limpiar]')) limpiar(); });
  if (ordenSel) ordenSel.addEventListener('change', () => { estado.orden = ordenSel.value; syncUrl(); render(true); });
  let t = 0;
  if (buscador) {
    buscador.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { estado.q = buscador.value.slice(0, 60); syncUrl(); render(true); }, 250); });
    buscador.closest('form')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(t); estado.q = buscador.value.slice(0, 60); syncUrl(); render(true); });
  }
  if (verMas) verMas.querySelector('button')?.addEventListener('click', () => render(false));
  render(true);
  if (params.has('buscar') && buscador) setTimeout(() => buscador.focus(), 300);

  const panel = document.querySelector('.filtros');
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  const mq = window.matchMedia('(min-width: 901px)');
  let bd = null;
  const cerrarPanel = () => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open'); bd?.classList.remove('open');
    document.body.classList.remove('no-scroll');
    abrirBtn?.setAttribute('aria-expanded', 'false');
    abrirBtn?.focus();
  };
  if (abrirBtn && panel) {
    bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd);
    abrirBtn.addEventListener('click', () => {
      panel.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll');
      abrirBtn.setAttribute('aria-expanded', 'true');
      panel.querySelector('button, input')?.focus();
    });
    bd.addEventListener('click', cerrarPanel);
    panel.addEventListener('click', e => { if (e.target.closest('[data-cerrar-filtros]')) cerrarPanel(); });
    panel.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarPanel(); else if (panel.classList.contains('open')) atrapar(panel, e); });
  }
  const detalles = [...document.querySelectorAll('.filtro')];
  const ajustarDetalles = () => {
    const comoBarra = MODELO === '2' && mq.matches;
    detalles.forEach(d => { d.open = !comoBarra; });
    if (mq.matches) cerrarPanel();
  };
  ajustarDetalles();
  mq.addEventListener('change', ajustarDetalles);
  if (MODELO === '2') {
    detalles.forEach(d => d.addEventListener('toggle', () => { if (d.open && mq.matches) detalles.forEach(o => { if (o !== d) o.open = false; }); }));
    document.addEventListener('click', e => { if (mq.matches && !e.target.closest('.filtro')) detalles.forEach(d => { d.open = false; }); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && mq.matches) detalles.forEach(d => { d.open = false; }); });
  }
}

function initBuscar() {
  if (PAGINA !== 'catalogo') return;
  document.querySelectorAll('[data-buscar]').forEach(a => a.addEventListener('click', e => {
    const input = document.getElementById('buscar');
    if (!input) return;
    e.preventDefault();
    input.scrollIntoView({ block: 'center' });
    input.focus();
  }));
}
function abrirProductoDeUrl() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) Modal.open(id);
}

initMenuCategorias();
initConteos();
initPreview();
initCatalogo();
initReveals();
initNav();
initModelBarScroll();
initHeroMotion();
initSello();
initParallax();
initLeeScroll();
initTabs();
initGuia();
initFormRef();
initCardAcciones();
Drawer.init();
Modal.init();
initFloats();
updateCartBadge();
initBuscar();
abrirProductoDeUrl();
irAGuia();
window.addEventListener('hashchange', irAGuia);
