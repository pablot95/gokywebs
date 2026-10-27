const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493884366283';
const MARCA = '+PROBARTE';
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const HOME_URL = MODELO === '2' ? 'modelo-2.html' : './';

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
  { id: 'agua', nombre: 'Kéfir de agua', bajada: 'Liviano y con burbuja', img: 'images/p-kefir-limon.webp',
    base: 'Agua, azúcar y nódulos de kéfir de agua',
    texto: 'Agua, azúcar y nódulos de kéfir, saborizado con fruta. Liviano, ácido y con burbuja fina.' },
  { id: 'leche', nombre: 'Kéfir de leche', bajada: 'Cremoso y ácido', img: 'images/p-kefir-leche.webp',
    base: 'Leche y nódulos de kéfir de leche',
    texto: 'Leche fermentada con nódulos de kéfir: cremoso y ácido, para tomar solo, con fruta o en licuados.' },
  { id: 'kombucha', nombre: 'Kombucha', bajada: 'Té fermentado, burbuja suave', img: 'images/p-kombucha-clasica.webp',
    base: 'Té, azúcar y cultivo madre de kombucha',
    texto: 'Té endulzado y fermentado con su cultivo madre, en versión clásica, con jengibre o con hibisco.' },
  { id: 'combos', nombre: 'Combos', bajada: 'Para probar las tres', img: 'images/p-combo-degustacion.webp',
    base: '',
    texto: 'Botellas surtidas de las tres líneas, para conocerlas o para compartir.' },
];
const SABORES = [
  { id: 'limon', nombre: 'Limón' }, { id: 'frutos-rojos', nombre: 'Frutos rojos' }, { id: 'durazno', nombre: 'Durazno' },
  { id: 'natural', nombre: 'Natural' }, { id: 'clasica', nombre: 'Clásica' }, { id: 'jengibre', nombre: 'Jengibre' },
  { id: 'hibisco', nombre: 'Hibisco' }, { id: 'surtido', nombre: 'Surtido' },
];
const PRECIOS = [
  { id: 'hasta5', nombre: 'Hasta $5.000', min: null, max: 5000 },
  { id: '5a10', nombre: '$5.000 a $10.000', min: 5001, max: 10000 },
  { id: 'mas10', nombre: 'Más de $10.000', min: 10001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  agua: 'kefir de agua tibicos agua', leche: 'kefir de leche lacteo leche yogur', kombucha: 'kombucha te fermentado', combos: 'combo combos pack surtido regalo',
  limon: 'limon citrico', 'frutos-rojos': 'frutos rojos frutilla frutillas arandano arandanos', durazno: 'durazno', natural: 'natural sin sabor',
  clasica: 'clasica te verde original', jengibre: 'jengibre kion', hibisco: 'hibisco rosa de jamaica flor', surtido: 'surtido variado',
};
const tam = (chico, grande) => ({ tipo: 'Tamaño', ops: ['500 ml', '1 L'], precios: [chico, grande] });

const Tienda = crearTienda([
  { id: 'kefir-agua-limon', nombre: 'Kéfir de agua de limón', cat: 'agua', sabor: 'limon', precio: 3500, var: tam(3500, 5900), stock: 24, alta: 20, rango: 1,
    img: 'images/p-kefir-limon.webp', escena: 'images/vertical.webp', notas: 'Ácido y fresco, burbuja fina',
    alt: 'Botella de vidrio con kéfir de agua de limón y burbujas, junto a medio limón', desc: 'Kéfir de agua saborizado con jugo de limón. Liviano, ácido y con burbuja fina: se toma bien frío.' },
  { id: 'kombucha-clasica', nombre: 'Kombucha clásica de té verde', cat: 'kombucha', sabor: 'clasica', precio: 4200, var: tam(4200, 7400), stock: 24, alta: 18, rango: 2,
    img: 'images/p-kombucha-clasica.webp', escena: null, notas: 'Té verde, final seco',
    alt: 'Botella de kombucha dorada con tapa metálica y un vaso servido', desc: 'Té verde endulzado y fermentado con su cultivo madre. Ácida, con burbuja suave y final seco.' },
  { id: 'kefir-leche-natural', nombre: 'Kéfir de leche natural', cat: 'leche', sabor: 'natural', precio: 3900, var: tam(3900, 6900), stock: 20, alta: 19, rango: 3,
    img: 'images/p-kefir-leche.webp', escena: null, notas: 'Cremoso, para tomar o licuar',
    alt: 'Botella de kéfir de leche blanco y cremoso con un vaso servido', desc: 'Leche fermentada con nódulos de kéfir. Cremoso y ácido, como un yogur bebible: solo, con fruta o en licuados.' },
  { id: 'kefir-agua-frutos-rojos', nombre: 'Kéfir de agua de frutos rojos', cat: 'agua', sabor: 'frutos-rojos', precio: 3800, var: tam(3800, 6400), stock: 24, alta: 17, rango: 4,
    img: 'images/p-kefir-frutos-rojos.webp', escena: null, notas: 'Frutado, apenas dulce',
    alt: 'Botella de kéfir de agua rosado con frutillas y arándanos alrededor', desc: 'Kéfir de agua con frutillas y arándanos. Rosado, frutado y apenas dulce.' },
  { id: 'combo-trio', nombre: 'Combo Trío: una de cada', cat: 'combos', sabor: 'surtido', precio: 19900, stock: 10, alta: 21, rango: 5, tag: 'Combo',
    cont: '3 botellas de 1 L', img: 'images/p-combo-trio.webp', escena: 'images/portada-ancha.webp', notas: 'Kombucha, kéfir de agua y de leche',
    alt: 'Tres botellas de 1 litro: kombucha, kéfir de agua y kéfir de leche', desc: 'Una botella de 1 L de cada línea: kombucha clásica, kéfir de agua de limón y kéfir de leche natural. Para conocer las tres bases.' },
  { id: 'kombucha-jengibre', nombre: 'Kombucha de jengibre', cat: 'kombucha', sabor: 'jengibre', precio: 4500, var: tam(4500, 7900), stock: 24, alta: 16, rango: 6,
    img: 'images/p-kombucha-jengibre.webp', escena: null, notas: 'Picante suave, refrescante',
    alt: 'Botella de kombucha de jengibre con raíz de jengibre fresca al lado', desc: 'Kombucha clásica con jengibre fresco. Picante suave y muy refrescante.' },
  { id: 'kefir-agua-durazno', nombre: 'Kéfir de agua de durazno', cat: 'agua', sabor: 'durazno', precio: 3800, var: tam(3800, 6400), stock: 24, alta: 15, rango: 7,
    img: 'images/p-kefir-durazno.webp', escena: null, notas: 'Suave y perfumado',
    alt: 'Botella de kéfir de agua de durazno con duraznos cortados', desc: 'Kéfir de agua con pulpa de durazno. Suave, perfumado y con poca acidez.' },
  { id: 'combo-degustacion', nombre: 'Combo Degustación x4', cat: 'combos', sabor: 'surtido', precio: 15500, stock: 10, alta: 22, rango: 8, tag: 'Combo',
    cont: '4 botellas de 500 ml', img: 'images/p-combo-degustacion.webp', escena: null, notas: 'Cuatro sabores para probar',
    alt: 'Cuatro botellas chicas: kéfir de leche, kombucha, kéfir de agua de limón y de frutos rojos', desc: 'Cuatro botellas de 500 ml: kéfir de leche natural, kombucha clásica, kéfir de agua de limón y kéfir de agua de frutos rojos.' },
  { id: 'kombucha-hibisco', nombre: 'Kombucha de hibisco', cat: 'kombucha', sabor: 'hibisco', precio: 4500, var: tam(4500, 7900), stock: 24, alta: 14, rango: 9,
    img: 'images/p-kombucha-hibisco.webp', escena: null, notas: 'Roja, ácida y floral',
    alt: 'Botella de kombucha roja de hibisco con flores secas de hibisco', desc: 'Kombucha con flor de hibisco. Roja, ácida y frutal, con notas florales.' },

  { id: 'kombucha-maracuya-proxima', nombre: 'Kombucha de maracuyá', cat: 'kombucha', sabor: 'clasica', precio: 4500, var: tam(4500, 7900), stock: 0, alta: 23, visible: false,
    img: 'images/p-kombucha-clasica.webp', escena: null, notas: '', alt: 'Próximo sabor', desc: 'Próximo sabor.' },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.cat, p.sabor, p.desc, p.notas, p.cont, ETIQUETAS[p.cat] || '', ETIQUETAS[p.sabor] || '', ...(p.var?.ops || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), sabor = lista(f.sabor), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sabor.length && !sabor.includes(p.sabor)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.precioMin != null && p.precio < f.precioMin) return false;
    if (f.precioMax != null && p.precio > f.precioMax) return false;
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const texto = indice.get(p.id);
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  }
  function comparador(orden, q) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    const palabras = q ? norm(q).split(/\s+/).filter(Boolean) : [];
    const rel = p => (palabras.every(w => norm(`${p.nombre} ${ETIQUETAS[p.cat] || ''}`).includes(w)) ? 0 : 1);
    switch (orden) {
      case 'precio-asc': return (a, b) => a.precio - b.precio || desempate(a, b);
      case 'precio-desc': return (a, b) => b.precio - a.precio || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (palabras.length ? rel(a) - rel(b) : 0) || (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden, filtros.q));
    let desde = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      desde = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(desde, desde + lim);
    const hayMas = desde + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function facetas(filtros = {}) {
    const sabores = {};
    visibles.forEach(p => {
      if (!coincide(p, filtros)) return;
      sabores[p.sabor] = (sabores[p.sabor] || 0) + 1;
    });
    return { sabores };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, facetas, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const conVar = p => (p.var?.ops || []).length > 1;
const opInicial = p => (conVar(p) ? p.var.ops[0] : '');
const precioDe = (p, op) => {
  if (!p.var?.precios) return p.precio;
  const i = p.var.ops.indexOf(op);
  return p.var.precios[i >= 0 ? i : 0];
};
const lineaTxt = (p, op) => `${p.nombre}${op ? ` (${op})` : ''}`;

const Cart = {
  KEY: 'probarte_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, op = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.op || '') === op);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, op, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, op, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.op || '') === op); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, op) { this.save(this.get().filter(i => !(i.id === id && (i.op || '') === op))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioDe(p, i.op) * i.qty : s; }, 0); },
};

const Favs = {
  KEY: 'probarte_favs',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const set = new Set(this.get());
    const on = !set.has(id);
    if (on) set.add(id); else set.delete(id);
    try { localStorage.setItem(this.KEY, JSON.stringify([...set])); } catch (e) { void e; }
    document.dispatchEvent(new CustomEvent('favs:updated'));
    return on;
  },
};

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  corazon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  botella: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2h4M10.5 2v4.2c0 .6-.3 1.1-.7 1.5C8.6 8.8 8 10.2 8 11.8V20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-8.2c0-1.6-.6-3-1.8-4.1-.4-.4-.7-.9-.7-1.5V2"/><path d="M8 14h8"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

const urlProducto = p => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}`;
const lineaDe = p => nombreDe(CATEGORIAS, p.cat);
function precioHTML(p, op) {
  return `<p class="precio"><span class="precio__final" data-precio-card>${formatearPrecio(precioDe(p, op))}</span>${conVar(p) ? `<span class="precio__tam" data-precio-tam>${esc(op)}</span>` : ''}</p>`;
}
function badgesHTML(p) {
  return `<span class="prod__badges"><span class="etiqueta etiqueta--${p.cat}">${esc(p.tag || lineaDe(p))}</span></span>`;
}
function favHTML(p) {
  const on = Favs.has(p.id);
  return `<button type="button" class="fav" data-fav="${p.id}" aria-pressed="${on}" aria-label="Guardar en favoritos: ${esc(p.nombre)}">${ICON.corazon}</button>`;
}
function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar uno"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar uno"${valor >= max ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}
function tamHTML(p, op) {
  if (!conVar(p)) return `<p class="prod__cont">${ICON.botella}${esc(p.cont || '')}</p>`;
  return `<div class="tam" role="group" aria-label="Tamaño de ${esc(p.nombre)}">${p.var.ops.map(o => `<button type="button" class="tam__op" data-tam="${esc(o)}" aria-pressed="${o === op}">${esc(o)}</button>`).join('')}</div>`;
}

function cardHTML(p) {
  const nombre = esc(p.nombre);
  const op = opInicial(p);
  return `<article class="prod" data-prod="${p.id}" data-op="${esc(op)}">
    <div class="prod__media">
      <a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async"></a>
      ${badgesHTML(p)}${favHTML(p)}
    </div>
    <div class="prod__body">
      <p class="prod__meta">${esc(p.notas)}</p>
      <h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      ${tamHTML(p, op)}
      <div class="prod__compra">
        ${precioHTML(p, op)}
        ${stepperHTML(p.stock)}
        <button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span>${ICON.carritoMas}</button>
      </div>
      <button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>
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
const refrescarTriggers = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

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

const Capas = {
  abiertas: [],
  abrir(capa) { this.abiertas.push(capa); document.body.classList.add('no-scroll'); },
  cerrar(capa) { this.abiertas = this.abiertas.filter(c => c !== capa); if (!this.abiertas.length && !document.querySelector('.main-nav.open')) document.body.classList.remove('no-scroll'); },
};
function enfocables(cont) {
  return [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(el => el.getClientRects().length);
}
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = enfocables(cont);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 981px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!Capas.abiertas.length) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button.nav-cats__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  nav.addEventListener('click', e => { if (e.target.closest('.nav-cats__panel a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initCatsMenu() {
  const params = new URLSearchParams(location.search);
  const catActual = PAGINA === 'catalogo' ? params.get('cat') : null;
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 981px)');
  document.querySelectorAll('[data-nav-cats]').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    const panel = box.querySelector('.nav-cats__panel');
    if (!btn || !panel) return;
    const fac = Tienda.facetas({});
    panel.innerHTML = '<div class="cats-lista">' + CATEGORIAS.map(c => `
      <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
        <img src="${c.img}" alt="" width="56" height="56" decoding="async">
        <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
        <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
      </a>`).join('') + '</div>'
      + `<div class="cats-sabores"><p class="cats-sabores__tit">Por sabor</p>${SABORES.filter(s => fac.sabores[s.id]).map(s => `<a href="${CATALOGO_URL}?sabor=${s.id}">${esc(s.nombre)}</a>`).join('')}</div>`
      + `<div class="cats-pie"><a class="cats-talleres" href="${HOME_URL}#talleres">Talleres de microbiota</a><a class="cats-todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a></div>`;
    let timer = 0, porHover = 0;
    const abrir = () => { clearTimeout(timer); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(timer); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      if (box.classList.contains('open') && Date.now() - porHover > 500) cerrar(); else abrir();
    });
    box.addEventListener('mouseenter', () => { if (hoverMq.matches && !box.classList.contains('open')) { porHover = Date.now(); abrir(); } });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 140); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
  });
}

function initBuscadorHeader() {
  const btn = document.querySelector('[data-abrir-busqueda]');
  const form = document.querySelector('.header-search[hidden], .header-search.es-plegable');
  if (!btn || !form) return;
  form.classList.add('es-plegable');
  const input = form.querySelector('input');
  const cerrar = () => { form.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => {
    const abrir = form.hidden;
    form.hidden = !abrir;
    btn.setAttribute('aria-expanded', String(abrir));
    if (abrir) setTimeout(() => input?.focus(), 30);
  });
  form.addEventListener('keydown', e => { if (e.key === 'Escape') { cerrar(); btn.focus(); } });
  form.querySelector('[data-cerrar-busqueda]')?.addEventListener('click', () => { cerrar(); btn.focus(); });
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  hero.querySelectorAll('[data-hero-img]').forEach(img => tl.from(img, { scale: 1.09, duration: 1.8, clearProps: 'transform' }, 0));
  tl.from(hero.querySelectorAll('.hero-foto'), { y: 40, opacity: 0, duration: 1.2, stagger: 0.12, clearProps: 'transform,opacity' }, 0.05)
    .from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.12)
    .from(hero.querySelectorAll('h1'), { y: 44, opacity: 0, duration: 1.1 }, 0.22)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.42)
    .from(hero.querySelectorAll('.hero-ctas > *'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56)
    .from(hero.querySelectorAll('.hero-firma, .ficha__fila'), { y: 16, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, opacity: 0, duration: 1, ease: 'back.out(1.6)', clearProps: 'transform,opacity' }, 0.85);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    ScrollTrigger.create({
      trigger: el.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { el.style.translate = `0 ${(-3 + 6 * s.progress).toFixed(2)}%`; },
    });
  });
}

function desdeDe(cat) {
  const p = Tienda.consultar({ filtros: { cat }, orden: 'precio-asc', limite: 1 }).items[0];
  return p ? p.precio : 0;
}
function initHome() {
  if (PAGINA !== 'home') return;
  const previa = document.getElementById('previaGrid');
  if (previa) {
    previa.innerHTML = Tienda.consultar({ orden: 'destacados', limite: 8 }).items
      .map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p)}</li>`).join('');
  }
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.catN });
    el.textContent = `${n} ${n === 1 ? 'opción' : 'opciones'}`;
  });
  document.querySelectorAll('[data-desde]').forEach(el => {
    el.textContent = `desde ${formatearPrecio(desdeDe(el.dataset.desde))}`;
  });
}

function filaCartaHTML(p) {
  const nombre = esc(p.nombre);
  const botones = conVar(p)
    ? p.var.ops.map((o, i) => `<button type="button" class="carta__add" data-add="${p.id}" data-op="${esc(o)}" aria-label="Agregar ${nombre} de ${esc(o)} al pedido"><span>${esc(o)}</span><b>${formatearPrecio(p.var.precios[i])}</b>${ICON.mas}</button>`).join('')
    : `<button type="button" class="carta__add carta__add--combo" data-add="${p.id}" aria-label="Agregar ${nombre} al pedido"><span>${esc(p.cont)}</span><b>${formatearPrecio(p.precio)}</b>${ICON.mas}</button>`;
  return `<li class="carta__fila" data-animate="subir" style="opacity:0;transform:translateY(32px)">
    <a class="carta__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="" width="200" height="200" decoding="async"></a>
    <div class="carta__info">
      <h3><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      <p>${esc(p.notas)}</p>
    </div>
    <div class="carta__botones">${botones}</div>
  </li>`;
}
function initCarta() {
  const box = document.getElementById('carta');
  if (!box) return;
  const tabs = [...box.querySelectorAll('[role="tab"]')];
  const lista = document.getElementById('cartaLista');
  const texto = document.getElementById('cartaTexto');
  const ver = document.getElementById('cartaVer');
  if (!tabs.length || !lista) return;
  const mostrar = (id, foco) => {
    const c = CATEGORIAS.find(x => x.id === id) || CATEGORIAS[0];
    tabs.forEach(t => {
      const on = t.dataset.cat === c.id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on) { lista.setAttribute('aria-labelledby', t.id); if (foco) t.focus(); }
    });
    if (texto) texto.textContent = c.texto;
    if (ver) { ver.href = `${CATALOGO_URL}?cat=${c.id}`; ver.querySelector('span').textContent = `Ver ${c.nombre.toLowerCase()} en el catálogo`; }
    lista.innerHTML = Tienda.consultar({ filtros: { cat: c.id }, orden: 'destacados', limite: 12 }).items.map(filaCartaHTML).join('');
    revelarNuevos(lista);
    refrescarTriggers();
  };
  box.addEventListener('click', e => {
    const t = e.target.closest('[role="tab"]');
    if (t) mostrar(t.dataset.cat);
  });
  box.querySelector('[role="tablist"]')?.addEventListener('keydown', e => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let j = null;
    if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = tabs.length - 1;
    if (j === null) return;
    e.preventDefault();
    mostrar(tabs[j].dataset.cat, true);
  });
  mostrar(tabs[0].dataset.cat);
}

function renderPedido() {
  const box = document.getElementById('pedido');
  if (!box) return;
  const items = document.getElementById('pedidoItems');
  const pie = document.getElementById('pedidoPie');
  const lineas = Cart.get().filter(i => getProducto(i.id));
  if (!lineas.length) {
    items.innerHTML = `<p class="pedido__vacio">${ICON.botella}<span>Tocá un tamaño en la carta y la botella aparece acá.</span></p>`;
    pie.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(i => {
    const p = getProducto(i.id);
    return `<li class="pedido__linea" data-linea="${p.id}" data-linea-op="${esc(i.op || '')}">
      <span class="pedido__cant">${i.qty}×</span>
      <span class="pedido__nombre">${esc(lineaTxt(p, i.op))}</span>
      <span class="pedido__precio">${formatearPrecio(precioDe(p, i.op) * i.qty)}</span>
      <span class="pedido__ctrl"><button type="button" data-menos aria-label="Restar uno de ${esc(p.nombre)}">${ICON.menos}</button><button type="button" data-mas aria-label="Sumar uno de ${esc(p.nombre)}">${ICON.mas}</button></span>
    </li>`;
  }).join('')}</ul>`;
  pie.hidden = false;
  document.getElementById('pedidoTotal').textContent = formatearPrecio(Cart.total());
  const wsp = document.getElementById('pedidoWsp');
  if (wsp) wsp.href = wspHref(textoPedido(lineas));
}
function initPedido() {
  const box = document.getElementById('pedido');
  if (!box) return;
  box.addEventListener('click', e => {
    const linea = e.target.closest('[data-linea]');
    if (linea) {
      const id = linea.dataset.linea, op = linea.dataset.lineaOp || '';
      const it = Cart.get().find(i => i.id === id && (i.op || '') === op);
      if (!it) return;
      if (e.target.closest('[data-mas]')) Cart.setQty(id, op, it.qty + 1);
      else if (e.target.closest('[data-menos]')) { if (it.qty <= 1) Cart.remove(id, op); else Cart.setQty(id, op, it.qty - 1); }
      return;
    }
    if (e.target.closest('[data-pedido-finalizar]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', renderPedido);
  renderPedido();
}

const TALLERES = [
  { id: 'microbiota', nombre: 'Microbiota y alimentación' },
  { id: 'kefir', nombre: 'Kéfir de agua y de leche en casa' },
  { id: 'kombucha', nombre: 'Kombucha desde cero' },
];
function initTalleres() {
  const form = document.getElementById('tallerForm');
  if (!form) return;
  const sel = document.getElementById('tallerSel');
  const personas = document.getElementById('tallerPersonas');
  const nombre = document.getElementById('tallerNombre');
  const vista = document.getElementById('tallerVista');
  const wsp = document.getElementById('tallerWsp');
  const pintar = () => {
    const t = TALLERES.find(x => x.id === sel.value) || TALLERES[0];
    const n = Number(personas.textContent) || 1;
    const cuando = form.querySelector('[name="taller-cuando"]:checked')?.value || 'me da igual el día';
    const quien = nombre.value.trim().slice(0, 40);
    const msg = `Hola ${MARCA}!${quien ? ` Soy ${quien}.` : ''} Quiero anotarme al taller «${t.nombre}». ${n === 1 ? 'Voy solo/a' : `Somos ${n} personas`} y ${cuando === 'me da igual el día' ? 'me da igual el día' : `prefiero ${cuando}`}. ¿Cuándo es la próxima fecha y cuánto sale?`;
    vista.textContent = msg;
    wsp.href = wspHref(msg);
    document.querySelectorAll('[data-taller-card]').forEach(c => c.classList.toggle('is-elegido', c.dataset.tallerCard === t.id));
  };
  form.addEventListener('click', e => {
    const b = e.target.closest('[data-personas]');
    if (!b) return;
    let n = Number(personas.textContent) || 1;
    n = Math.min(Math.max(n + Number(b.dataset.personas), 1), 12);
    personas.textContent = n;
    form.querySelector('[data-personas="-1"]').disabled = n <= 1;
    form.querySelector('[data-personas="1"]').disabled = n >= 12;
    pintar();
  });
  form.addEventListener('input', pintar);
  form.addEventListener('change', pintar);
  form.addEventListener('submit', e => e.preventDefault());
  document.querySelectorAll('[data-anotarme]').forEach(b => b.addEventListener('click', () => {
    sel.value = b.dataset.anotarme;
    pintar();
    form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    setTimeout(() => sel.focus({ preventScroll: true }), reduceMotion ? 0 : 450);
  }));
  pintar();
}

const PUBLICACIONES = {
  microbiota: {
    tag: 'Microbiota', titulo: '¿Qué es la microbiota?',
    texto: [
      'Es el conjunto de microorganismos (bacterias, levaduras y otros) que viven en nuestro cuerpo, sobre todo en el intestino. Cada persona tiene la suya, y va cambiando con lo que comemos, cómo descansamos, la actividad física y los medicamentos.',
      'Los alimentos fermentados, como el kéfir y la kombucha, aportan microorganismos vivos y forman parte de muchas cocinas tradicionales. Sumarlos es una opción más dentro de una alimentación variada, con frutas, verduras, legumbres y cereales.',
      'Si tenés una condición de salud o estás en tratamiento, consultá con tu médico o nutricionista antes de incorporar algo nuevo.',
    ],
  },
  diferencias: {
    tag: 'Fermentos', titulo: 'Kéfir de agua, kéfir de leche y kombucha: en qué se diferencian',
    texto: [
      'El kéfir de agua se hace con nódulos (unos gránulos translúcidos) que fermentan agua con azúcar. Queda liviano, ácido y con burbujas, y se saboriza con fruta.',
      'El kéfir de leche usa otros nódulos, que fermentan la leche. Queda cremoso y ácido, parecido a un yogur bebible.',
      'La kombucha es té endulzado fermentado por un cultivo de bacterias y levaduras, el «scoby». Tiene un sabor ácido, burbuja suave y admite especias como el jengibre o flores como el hibisco.',
    ],
  },
  conservar: {
    tag: 'En casa', titulo: 'Cómo conservar tus fermentos',
    texto: [
      'Guardalos siempre en la heladera y con la botella bien cerrada. El frío frena la fermentación y mantiene el sabor.',
      'Como siguen vivos, pueden juntar gas: abrí la botella despacio y sobre la pileta, sobre todo el kéfir de agua y la kombucha.',
      'El kéfir de leche puede separarse un poco: agitalo suave antes de servir. Y respetá la fecha que trae cada etiqueta.',
    ],
  },
  salud: {
    tag: 'Próximamente', titulo: 'Microbiota y distintas condiciones de salud',
    texto: [
      'Estamos preparando una serie de publicaciones sobre microbiota y distintas condiciones de salud, contadas en lenguaje simple y con las fuentes a la vista.',
      'Si querés que te avisemos cuando salga cada una, escribinos por WhatsApp y te sumamos a la lista.',
    ],
  },
};
let pubOpener = null;
function abrirPub(id, opener) {
  const modal = document.getElementById('pubModal');
  const pub = PUBLICACIONES[id];
  if (!modal || !pub) return;
  pubOpener = opener || document.activeElement;
  document.getElementById('pubContent').innerHTML = `
    <p class="eyebrow">${esc(pub.tag)}</p>
    <h2>${esc(pub.titulo)}</h2>
    ${pub.texto.map(t => `<p>${esc(t)}</p>`).join('')}
    <p class="pub__aviso">Información general: no reemplaza la consulta con un profesional de la salud.</p>
    <a class="btn btn--line" href="${wspHref(`Hola ${MARCA}! Leí «${pub.titulo}» y tengo una consulta.`)}" target="_blank" rel="noopener">${ICON.wsp}Consultanos por WhatsApp</a>`;
  modal.hidden = false;
  Capas.abrir(modal);
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
  setTimeout(() => modal.querySelector('.pub__close')?.focus(), 60);
}
function cerrarPub() {
  const modal = document.getElementById('pubModal');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 320);
  Capas.cerrar(modal);
  pubOpener?.focus?.();
}
function initPublicaciones() {
  const modal = document.getElementById('pubModal');
  if (!modal) return;
  document.querySelectorAll('[data-pub]').forEach(b => b.addEventListener('click', () => abrirPub(b.dataset.pub, b)));
  modal.addEventListener('click', e => { if (e.target.closest('[data-cerrar-pub]')) cerrarPub(); });
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarPub(); }
    atraparFoco(modal, e);
  });
}

const QV = { p: null, op: '', foto: 0, opener: null };
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const relFinal = rel.length >= 2 ? rel : Tienda.consultar({ filtros: { excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const fotos = [{ src: p.img, alt: p.alt }];
  if (p.escena) fotos.push({ src: p.escena, alt: `Otra vista: ${p.alt}` });
  const msg = `Hola ${MARCA}! Quiero consultar por ${lineaTxt(p, QV.op)}.`;
  const on = Favs.has(p.id);
  const alta = fotos[QV.foto].src.includes('vertical') || fotos[QV.foto].src.includes('ancha');
  const ficha = [
    cat?.base ? ['Base', cat.base] : null,
    p.cont ? ['Trae', p.cont] : null,
    ['Sabor', nombreDe(SABORES, p.sabor)],
    ['Conservación', 'En heladera, con la botella bien cerrada'],
  ].filter(Boolean);
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal${alta ? ' qv__principal--alta' : ''}"><img src="${fotos[QV.foto].src}" alt="${esc(fotos[QV.foto].alt)}" width="800" height="800"></div>
        ${fotos.length > 1 ? `<div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver otra foto' : 'Ver la foto del producto'}"><img src="${f.src}" alt="" width="72" height="72"></button>`).join('')}</div>` : ''}
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(cat?.nombre || '')}</p>
        <h2>${esc(p.nombre)}</h2>
        <p class="precio"><span class="precio__final" id="qvPrecio">${formatearPrecio(precioDe(p, QV.op))}</span>${conVar(p) ? `<span class="precio__tam" id="qvTam">${esc(QV.op)}</span>` : ''}</p>
        <p class="qv__desc">${esc(p.desc)}</p>
        <dl class="qv__ficha">${ficha.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        ${conVar(p) ? `<div>
          <p class="f-grupo__titulo">Tamaño</p>
          <div class="qv__ops" role="group" aria-label="Elegí el tamaño">${p.var.ops.map((o, i) => `<button type="button" class="qv__op" data-qv-op="${esc(o)}" aria-pressed="${QV.op === o}"><span>${esc(o)}</span><small>${formatearPrecio(p.var.precios[i])}</small></button>`).join('')}</div>
        </div>` : ''}
        <div class="qv__compra">
          ${stepperHTML(p.stock)}
          <button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
        </div>
        <div class="qv__extra">
          <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a>
          <button type="button" class="qv__fav" data-fav="${p.id}" aria-pressed="${on}">${ICON.corazon}<span>${on ? 'En tus favoritos' : 'Guardar en favoritos'}</span></button>
        </div>
        ${relFinal.length ? `<div class="qv__rel"><h3>También te puede gustar</h3><ul>${relFinal.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.img}" alt="" width="400" height="400"></span><span>${esc(r.nombre)}</span><span class="precio__final">${formatearPrecio(r.precio)}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, category: cat?.nombre, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioDe(p, QV.op), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function abrirQV(id, opener, op = '') {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p; QV.op = p.var?.ops?.includes(op) ? op : opInicial(p); QV.foto = 0;
  if (!yaAbierto) QV.opener = opener || document.activeElement;
  renderQV();
  modal.querySelector('.qv__panel')?.scrollTo(0, 0);
  if (!yaAbierto) {
    modal.hidden = false;
    Capas.abrir(modal);
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.set('producto', p.id); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
}
function cerrarQV() {
  const modal = document.getElementById('quickView');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 320);
  Capas.cerrar(modal);
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  QV.opener?.focus?.();
}
function initQV() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) { QV.foto = Number(foto.dataset.qvFoto); renderQV(); return; }
    const o = e.target.closest('[data-qv-op]');
    if (o) {
      QV.op = o.dataset.qvOp;
      modal.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b === o)));
      document.getElementById('qvPrecio').textContent = formatearPrecio(precioDe(QV.p, QV.op));
      const t = document.getElementById('qvTam'); if (t) t.textContent = QV.op;
      const wsp = modal.querySelector('.qv__wsp');
      if (wsp) wsp.href = wspHref(`Hola ${MARCA}! Quiero consultar por ${lineaTxt(QV.p, QV.op)}.`);
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty, conVar(p) ? QV.op : '');
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${lineaTxt(p, QV.op)} al carrito.`);
    }
  });
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarQV(); }
    atraparFoco(modal, e);
  });
}

function textoPedido(lineas) {
  return [`Hola ${MARCA}! Quiero hacer este pedido:`, ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${i.qty} × ${lineaTxt(p, i.op)}: ${formatearPrecio(precioDe(p, i.op) * i.qty)}`;
  }), `Total: ${formatearPrecio(Cart.total())}`].join('\n');
}
function lineaHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  const op = i.op || '';
  return `<li class="linea" data-linea="${p.id}" data-linea-op="${esc(op)}">
    <img src="${p.img}" alt="" width="72" height="72">
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta">${op ? `${esc(op)} · ` : p.cont ? `${esc(p.cont)} · ` : ''}${formatearPrecio(precioDe(p, op))} c/u</p>
      ${stepperHTML(p.stock, i.qty)}
    </div>
    <div class="linea__lado"><span>${formatearPrecio(precioDe(p, op) * i.qty)}</span><button type="button" class="linea__quitar" data-quitar>Quitar</button></div>
  </li>`;
}
function renderCarrito() {
  const items = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!items || !foot) return;
  const lineas = Cart.get().filter(i => getProducto(i.id));
  if (!lineas.length) {
    items.innerHTML = `<div class="drawer__vacio">${ICON.botella}<p>Tu carrito está vacío. Hay kéfir y kombucha esperando en la heladera.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver a la tienda ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  document.getElementById('cartTotal').textContent = formatearPrecio(Cart.total());
  const wsp = document.getElementById('cartWsp');
  if (wsp) wsp.href = wspHref(textoPedido(lineas));
}
let cartOpener = null;
function abrirCarrito() {
  const d = document.getElementById('cartDrawer');
  if (!d || !d.hidden) return;
  cartOpener = document.activeElement;
  renderCarrito();
  d.hidden = false;
  Capas.abrir(d);
  requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('open')));
  setTimeout(() => d.querySelector('.drawer__head .icon-btn')?.focus(), 60);
}
function cerrarCarrito() {
  const d = document.getElementById('cartDrawer');
  if (!d || d.hidden) return;
  d.classList.remove('open');
  setTimeout(() => { d.hidden = true; }, reduceMotion ? 0 : 380);
  Capas.cerrar(d);
  cartOpener?.focus?.();
}
function initCarrito() {
  const d = document.getElementById('cartDrawer');
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', abrirCarrito));
  if (!d) return;
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-carrito]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea, op = linea.dataset.lineaOp || '';
    const it = Cart.get().find(i => i.id === id && (i.op || '') === op);
    if (e.target.closest('[data-quitar]')) { Cart.remove(id, op); return; }
    if (it && e.target.closest('[data-mas]')) Cart.setQty(id, op, it.qty + 1);
    if (it && e.target.closest('[data-menos]')) Cart.setQty(id, op, it.qty - 1);
  });
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarCarrito(); }
    atraparFoco(d, e);
  });
  document.getElementById('checkoutBtn')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderCarrito(); });
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
    cart?.classList.toggle('visible', scrolled || (Cart.count() > 0 && window.scrollY > 160));
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

function syncFavs() {
  const favs = Favs.get();
  document.querySelectorAll('[data-fav]').forEach(b => {
    const on = favs.includes(b.dataset.fav);
    b.setAttribute('aria-pressed', String(on));
    const t = b.querySelector('span');
    if (t) t.textContent = on ? 'En tus favoritos' : 'Guardar en favoritos';
  });
  document.querySelectorAll('[data-favs-n]').forEach(el => { el.textContent = favs.length; el.hidden = !favs.length; });
}

function initAcciones() {
  document.addEventListener('click', e => {
    const fav = e.target.closest('[data-fav]');
    if (fav) {
      const p = getProducto(fav.dataset.fav);
      if (!p) return;
      const on = Favs.toggle(p.id);
      fav.classList.remove('pop'); void fav.offsetWidth; fav.classList.add('pop');
      showToast(on ? `Guardaste ${p.nombre} en favoritos.` : `Sacaste ${p.nombre} de favoritos.`);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv && !e.target.closest('.qv')) { e.preventDefault(); abrirQV(qv.dataset.qv, qv, qv.closest('[data-op]')?.dataset.op || ''); return; }
    const tamOp = e.target.closest('[data-tam]');
    if (tamOp) {
      const card = tamOp.closest('[data-prod]');
      const p = card && getProducto(card.dataset.prod);
      if (!p) return;
      card.dataset.op = tamOp.dataset.tam;
      card.querySelectorAll('[data-tam]').forEach(b => b.setAttribute('aria-pressed', String(b === tamOp)));
      const precio = card.querySelector('[data-precio-card]'); if (precio) precio.textContent = formatearPrecio(precioDe(p, card.dataset.op));
      const t = card.querySelector('[data-precio-tam]'); if (t) t.textContent = card.dataset.op;
      return;
    }
    const st = e.target.closest('[data-stepper]');
    if (st && !e.target.closest('[data-linea]')) {
      const out = st.querySelector('output');
      const max = Number(st.dataset.max) || 99;
      let v = Number(out.textContent) || 1;
      if (e.target.closest('[data-mas]')) v = Math.min(v + 1, max);
      else if (e.target.closest('[data-menos]')) v = Math.max(v - 1, 1);
      else return;
      out.textContent = v;
      st.querySelector('[data-menos]').disabled = v <= 1;
      st.querySelector('[data-mas]').disabled = v >= max;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const card = add.closest('[data-prod]');
      const op = conVar(p) ? (add.dataset.op || card?.dataset.op || opInicial(p)) : '';
      const qty = Number(card?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, op);
      showToast(`Sumaste ${qty > 1 ? `${qty} × ` : ''}${lineaTxt(p, op)} al carrito.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const card = comprar.closest('[data-prod]');
      const op = conVar(p) ? (card?.dataset.op || opInicial(p)) : '';
      const qty = Number(card?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, op);
      abrirCarrito();
    }
  });
}

function syncModelosLink() {
  const otro = document.querySelector('.gw-modelos__btn:not([aria-current])');
  if (!otro || PAGINA !== 'catalogo') return;
  otro.href = `${MODELO === '2' ? 'catalogo.html' : 'catalogo-2.html'}${location.search}`;
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const valido = (v, arr) => (arr.some(x => (x.id ?? x) === v) ? v : '');
  const multi = (clave, arr) => (params.get(clave) || '').split(',').filter(v => arr.some(x => (x.id ?? x) === v));
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS), sabor: multi('sabor', SABORES),
    precio: valido(params.get('precio'), PRECIOS), fav: params.get('fav') === '1',
    orden: valido(params.get('orden'), ORDENES) || 'destacados', q: (params.get('q') || '').trim().slice(0, 60),
  };
  const compatibles = () => {
    const ok = Tienda.facetas(e.cat ? { cat: e.cat } : {}).sabores;
    e.sabor = e.sabor.filter(s => ok[s]);
  };
  compatibles();

  const form = document.getElementById('filtros');
  const cuerpo = document.getElementById('filtrosBody');
  const buscar = document.getElementById('buscar');
  const orden = document.getElementById('orden');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const verMas = document.getElementById('verMas');
  const vacio = document.getElementById('vacio');
  const vacioTxt = document.getElementById('vacioTxt');
  const activos = document.getElementById('activos');
  const nBadge = document.querySelector('[data-filtros-n]');
  const chips = document.getElementById('chipsCat');
  let cursor = null, mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.sabor.length) f.sabor = e.sabor;
    if (e.fav) f.ids = Favs.get();
    const r = PRECIOS.find(x => x.id === e.precio);
    if (r) { f.precioMin = r.min; f.precioMax = r.max; }
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (tipo, nombre, valor, etiqueta, marcado, n, grupo) => `<label class="f-op"><input type="${tipo}" name="${nombre}" value="${valor}" data-f="${grupo}"${marcado ? ' checked' : ''}><span>${etiqueta}</span>${n != null ? `<small>${n}</small>` : ''}</label>`;
  function pintarFiltros() {
    const fac = Tienda.facetas(e.cat ? { cat: e.cat } : {});
    const grupos = [];
    grupos.push(`<fieldset class="f-grupo"><legend>Línea</legend>
      ${opcion('radio', 'cat', '', 'Toda la tienda', !e.cat, Tienda.contar({}), 'cat')}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }), 'cat')).join('')}</fieldset>`);
    const sabores = SABORES.filter(s => fac.sabores[s.id]);
    if (sabores.length > 1) grupos.push(`<fieldset class="f-grupo"><legend>Sabor</legend>
      ${sabores.map(s => opcion('checkbox', `sabor-${s.id}`, s.id, esc(s.nombre), e.sabor.includes(s.id), fac.sabores[s.id], 'sabor')).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Precio</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio, null, 'precio')}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id, null, 'precio')).join('')}
      <p class="f-nota">Precio de la botella más chica o del combo.</p></fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Mostrar</legend>
      ${opcion('checkbox', 'fav', '1', 'Mis favoritos', e.fav, Favs.get().length, 'fav')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const sabor = !cat && e.sabor.length === 1 ? SABORES.find(s => s.id === e.sabor[0]) : null;
    const titulo = cat ? cat.nombre : sabor ? `Sabor ${sabor.nombre.toLowerCase()}` : e.fav ? 'Tus favoritos' : 'Toda la tienda';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : e.fav ? 'Lo que guardaste con el corazón, para decidir con calma.' : 'Kéfir de agua, kéfir de leche, kombucha y combos. Elegís el tamaño y lo sumás al carrito.';
    document.title = `${titulo} — ${MARCA}`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) {
      const nombre = cat ? cat.nombre : sabor ? sabor.nombre : '';
      miga.hidden = !nombre; if (migaSep) migaSep.hidden = !nombre;
      miga.textContent = nombre;
      miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : sabor ? `${CATALOGO_URL}?sabor=${sabor.id}` : CATALOGO_URL;
    }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.querySelectorAll('.main-nav > a').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id && id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`)].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.sabor.forEach(v => quitar.push(['sabor', v, nombreDe(SABORES, v)]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.fav) quitar.push(['fav', '1', 'Mis favoritos']);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'sabor', 'precio', 'fav', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.sabor.length) u.searchParams.set('sabor', e.sabor.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.fav) u.searchParams.set('fav', '1');
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  function pintar(reiniciar) {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; total = Tienda.contar(filtros()); }
    const res = Tienda.consultar({ filtros: filtros(), orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p)}</li>`).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    contador.textContent = `${total} ${total === 1 ? 'producto' : 'productos'}`;
    vacio.hidden = total > 0;
    grid.hidden = total === 0;
    if (vacioTxt) vacioTxt.textContent = e.fav && !Favs.get().length
      ? 'Todavía no guardaste favoritos. Tocá el corazón de una botella y aparece acá.'
      : 'No encontramos bebidas con esos filtros. Probá con otra palabra o sacá algún filtro.';
    verMas.hidden = !cursor;
    mostrando.hidden = total === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    revelarNuevos(grid);
    refrescarTriggers();
  }
  function aplicar() {
    compatibles();
    pintarFiltros();
    pintarCabecera();
    pintarActivos();
    syncURL();
    pintar(true);
  }

  orden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${o.nombre}</option>`).join('');
  buscar.value = e.q;
  aplicar();

  form.addEventListener('change', ev => {
    const inp = ev.target;
    const grupo = inp.dataset.f;
    if (!grupo) return;
    if (grupo === 'cat') { e.cat = inp.value; }
    else if (grupo === 'precio') e.precio = inp.value;
    else if (grupo === 'fav') e.fav = inp.checked;
    else {
      const set = new Set(e[grupo]);
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
      e[grupo] = [...set];
    }
    aplicar();
  });
  form.addEventListener('submit', ev => ev.preventDefault());
  let t = 0;
  const leerBusqueda = v => { e.q = v.trim().slice(0, 60); aplicar(); };
  buscar.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => leerBusqueda(buscar.value), 250); });
  buscar.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); leerBusqueda(buscar.value); });
  document.querySelectorAll('.header-search').forEach(f => f.addEventListener('submit', ev => {
    ev.preventDefault();
    const v = f.querySelector('input')?.value || '';
    buscar.value = v;
    leerBusqueda(v);
    if (f.classList.contains('es-plegable')) {
      f.hidden = true;
      document.querySelector('[data-abrir-busqueda]')?.setAttribute('aria-expanded', 'false');
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.sabor = []; e.precio = ''; e.fav = false; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'fav') e.fav = false;
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat]');
    if (!a) return;
    ev.preventDefault();
    e.cat = a.dataset.chipCat;
    aplicar();
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('.cats-item, .cats-sabores a, .cats-todo, .main-nav > a, a[data-ir-catalogo], .footer__col a');
    if (!a) return;
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL) || u.hash) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.sabor = (u.searchParams.get('sabor') || '').split(',').filter(v => SABORES.some(x => x.id === v));
    e.orden = valido(u.searchParams.get('orden'), ORDENES) || 'destacados';
    orden.value = e.orden;
    e.precio = ''; e.fav = u.searchParams.get('fav') === '1'; e.q = ''; buscar.value = '';
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
  document.addEventListener('favs:updated', () => {
    pintarFiltros();
    if (e.fav) aplicar();
  });

  initFiltrosDrawer(form);
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirQV(prod), 80);
  if (location.hash === '#buscar') setTimeout(() => buscar.focus({ preventScroll: false }), 60);
}

function initFiltrosDrawer(form) {
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  if (!form || !abrirBtn) return;
  const mq = window.matchMedia('(max-width: 1024px)');
  let bd = document.querySelector('.filtros-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); }
  const esDrawer = () => MODELO === '2' || mq.matches;
  const modo = () => {
    const d = esDrawer();
    form.classList.toggle('es-drawer', d);
    if (d) { form.setAttribute('role', 'dialog'); form.setAttribute('aria-modal', 'true'); if (!form.classList.contains('open')) form.setAttribute('inert', ''); }
    else { form.removeAttribute('role'); form.removeAttribute('aria-modal'); form.removeAttribute('inert'); cerrar(); }
  };
  const abrir = () => {
    form.classList.add('open'); bd.classList.add('open'); form.removeAttribute('inert');
    abrirBtn.setAttribute('aria-expanded', 'true'); Capas.abrir(form);
    setTimeout(() => form.querySelector('.filtros__cerrar')?.focus(), 60);
  };
  function cerrar() {
    if (!form.classList.contains('open')) return;
    form.classList.remove('open'); bd.classList.remove('open');
    if (esDrawer()) form.setAttribute('inert', '');
    abrirBtn.setAttribute('aria-expanded', 'false'); Capas.cerrar(form);
    abrirBtn.focus();
  }
  abrirBtn.addEventListener('click', abrir);
  bd.addEventListener('click', cerrar);
  form.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrar));
  form.addEventListener('keydown', ev => {
    if (!form.classList.contains('open')) return;
    if (ev.key === 'Escape') cerrar();
    atraparFoco(form, ev);
  });
  mq.addEventListener('change', modo);
  modo();
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

document.addEventListener('cart:updated', updateCartBadge);
document.addEventListener('favs:updated', syncFavs);

[initCatsMenu, initHome, initCarta, initPedido, initTalleres, initPublicaciones, initCatalogo, initReveals, initNav, initBuscadorHeader,
  initHeroMotion, initParallax, initQV, initCarrito, initAcciones, initFloats, initModelBarScroll, syncModelosLink, updateCartBadge, syncFavs]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
