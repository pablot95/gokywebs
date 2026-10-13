document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const PAGINA = document.body.dataset.pagina || 'home';
const MODELO = document.body.dataset.modelo || '1';
const CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const MUESTRA = 'muestra-halloween-mundo-de-colores.pdf';
const MARCA = 'Mundo de colores';

const CATEGORIAS = [
  { id: 'libros', nombre: 'Libros completos', corto: 'Libro', mini: 'p-libro-portada' },
  { id: 'packs', nombre: 'Packs de 4 páginas', corto: 'Pack', mini: 'p-pack-fantasmitas' },
  { id: 'laminas', nombre: 'Láminas sueltas', corto: 'Lámina', mini: 'p-lam-fantasma-sombrero' },
];

const TEMAS = [
  { id: 'fantasmas', nombre: 'Fantasmitas', dib: 'dib-fantasmas' },
  { id: 'gatos', nombre: 'Gatitos', dib: 'dib-gatitos' },
  { id: 'calabazas', nombre: 'Calabazas', dib: 'dib-calabazas' },
  { id: 'casas', nombre: 'Casas embrujadas', dib: 'dib-casas' },
  { id: 'brujas', nombre: 'Brujitas', dib: 'dib-brujas' },
  { id: 'esqueletos', nombre: 'Esqueletos', dib: 'dib-esqueletos' },
];

const NIVELES = [
  { id: 'simple', nombre: 'Trazo simple' },
  { id: 'detalle', nombre: 'Con más detalle' },
];

const PRECIOS = [
  { id: 'hasta-1000', nombre: 'Hasta $1.000', min: 0, max: 1000 },
  { id: '1000-3000', nombre: '$1.000 a $3.000', min: 1000, max: 3000 },
  { id: 'mas-3000', nombre: 'Más de $3.000', min: 3000, max: Infinity },
];

const PRODUCTOS = [
  { id: 'libro-halloween', nombre: 'Libro de Halloween para colorear', cat: 'libros', temas: ['fantasmas', 'gatos', 'calabazas', 'casas', 'brujas', 'esqueletos'], nivel: ['simple', 'detalle'], precio: 6900, descuento: 0, paginas: 25, img: 'p-libro-portada', galeria: ['p-libro-portada', 'libro-abierto', 'hojas-mesa', 'pack-imprimible', 'descarga-notebook'], principal: true, desc: '25 páginas llenas de fantasmitas, gatos con sombrero, brujitas y casas embrujadas para pintar en familia. Un solo PDF, listo para imprimir en casa las veces que quieras.', tags: ['halloween', 'libro', 'completo'] },
  { id: 'pack-fantasmitas', nombre: 'Pack Fantasmitas', cat: 'packs', temas: ['fantasmas', 'casas', 'calabazas'], nivel: ['simple'], precio: 1900, descuento: 0, paginas: 4, img: 'p-pack-fantasmitas', galeria: ['p-pack-fantasmitas', 'dib-fantasma-sombrero'], destacado: 1, desc: 'Cuatro páginas con fantasmas simpáticos: con sombrero de bruja, con balde de caramelos y paseando frente a la casona.', tags: ['fantasma', 'fantasmita', 'halloween'] },
  { id: 'pack-gatitos', nombre: 'Pack Gatitos con sombrero', cat: 'packs', temas: ['gatos', 'calabazas'], nivel: ['simple'], precio: 1900, descuento: 0, paginas: 4, img: 'p-pack-gatitos', galeria: ['p-pack-gatitos', 'dib-gatitos'], destacado: 7, desc: 'Cuatro gatitos brujos sobre calabazas, cercas de madera y lunas finitas.', tags: ['gato', 'gatito', 'bruja', 'sombrero'] },
  { id: 'pack-calabazas', nombre: 'Pack Calabazas sonrientes', cat: 'packs', temas: ['calabazas', 'gatos'], nivel: ['detalle'], precio: 1900, descuento: 20, paginas: 4, img: 'p-pack-calabazas', galeria: ['p-pack-calabazas', 'dib-calabazas'], destacado: 3, desc: 'Torres de calabazas, hojas de otoño y caras para pintar de naranja o del color que quieran.', tags: ['calabaza', 'zapallo', 'otoño'] },
  { id: 'pack-casas', nombre: 'Pack Casas embrujadas', cat: 'packs', temas: ['casas', 'calabazas'], nivel: ['detalle'], precio: 1900, descuento: 0, paginas: 4, img: 'p-pack-casas', galeria: ['p-pack-casas', 'dib-casas'], desc: 'Casonas con torres, caminos con calabazas y árboles sin hojas bajo la luna llena.', tags: ['casa', 'castillo', 'embrujada'] },
  { id: 'pack-brujitas', nombre: 'Pack Brujitas y escobas', cat: 'packs', temas: ['brujas', 'gatos'], nivel: ['detalle'], precio: 1900, descuento: 0, paginas: 4, img: 'p-pack-brujitas', galeria: ['p-pack-brujitas', 'dib-brujas'], destacado: 5, desc: 'Brujitas volando en escoba, calderos que burbujean y los gatos que las acompañan.', tags: ['bruja', 'brujita', 'escoba', 'caldero'] },
  { id: 'pack-esqueletos', nombre: 'Pack Esqueletos bailarines', cat: 'packs', temas: ['esqueletos', 'gatos', 'calabazas'], nivel: ['simple'], precio: 1900, descuento: 0, paginas: 4, img: 'p-pack-esqueletos', galeria: ['p-pack-esqueletos', 'dib-esqueletos'], destacado: 8, desc: 'Esqueletos que saludan, bailan y se hacen amigos de un gatito.', tags: ['esqueleto', 'calavera', 'huesos'] },
  { id: 'lam-fantasmita-gato', nombre: 'Fantasmita y gato negro', cat: 'laminas', temas: ['fantasmas', 'gatos', 'calabazas'], nivel: ['simple'], precio: 700, descuento: 0, paginas: 1, img: 'p-lam-fantasmita-gato', galeria: ['p-lam-fantasmita-gato'], destacado: 2, desc: 'Un fantasmita con sombrero de bruja sentado sobre una calabaza, con su amigo el gato negro.', tags: ['fantasma', 'gato'] },
  { id: 'lam-torre-calabazas', nombre: 'Torre de calabazas con gatito', cat: 'laminas', temas: ['calabazas', 'gatos'], nivel: ['detalle'], precio: 900, descuento: 0, paginas: 1, img: 'p-lam-torre-calabazas', galeria: ['p-lam-torre-calabazas'], desc: 'Tres calabazas apiladas con sombrero de bruja y un gatito que espía desde atrás.', tags: ['calabaza', 'gato', 'torre'] },
  { id: 'lam-fantasma-farol', nombre: 'Fantasma con farol', cat: 'laminas', temas: ['fantasmas', 'calabazas'], nivel: ['detalle'], precio: 900, descuento: 0, paginas: 1, img: 'p-lam-fantasma-farol', galeria: ['p-lam-fantasma-farol'], destacado: 4, desc: 'Un fantasma con sombrero que sale a pasear con su farol entre calabazas y murciélagos.', tags: ['fantasma', 'farol'] },
  { id: 'lam-fantasma-sombrero', nombre: 'Fantasmita con sombrero de bruja', cat: 'laminas', temas: ['fantasmas', 'calabazas'], nivel: ['simple'], precio: 700, descuento: 0, paginas: 1, img: 'p-lam-fantasma-sombrero', galeria: ['p-lam-fantasma-sombrero', 'dib-fantasma-sombrero'], desc: 'Trazo grueso y espacios grandes: ideal para los más chiquitos que recién empiezan a pintar.', tags: ['fantasma', 'sombrero'] },
  { id: 'lam-casona', nombre: 'Casona embrujada', cat: 'laminas', temas: ['casas', 'calabazas'], nivel: ['simple'], precio: 700, descuento: 0, paginas: 1, img: 'p-lam-casona', galeria: ['p-lam-casona'], destacado: 6, desc: 'Una casona con torres, un camino que serpentea y calabazas que vigilan la entrada.', tags: ['casa', 'castillo'] },
  { id: 'lam-fantasma-caramelos', nombre: 'Fantasmita con balde de caramelos', cat: 'laminas', temas: ['fantasmas', 'calabazas'], nivel: ['simple'], precio: 700, descuento: 0, paginas: 1, img: 'p-lam-fantasma-caramelos', galeria: ['p-lam-fantasma-caramelos'], desc: 'Un fantasmita que salió a pedir dulces con su balde de calabaza bien lleno.', tags: ['fantasma', 'caramelos', 'dulces'] },
  { id: 'lam-caldero', nombre: 'Caldero mágico', cat: 'laminas', temas: ['brujas', 'gatos', 'fantasmas'], nivel: ['detalle'], precio: 900, descuento: 0, paginas: 1, img: 'p-lam-caldero', galeria: ['p-lam-caldero', 'dib-caldero'], desc: 'Un caldero que burbujea, un gatito curioso y un fantasma que se asoma por el costado.', tags: ['caldero', 'bruja', 'pocion'] },
  { id: 'lam-fantasma-dulces', nombre: 'Fantasma entre golosinas', cat: 'laminas', temas: ['fantasmas'], nivel: ['simple'], precio: 700, descuento: 0, paginas: 1, img: 'p-lam-fantasma-dulces', galeria: ['p-lam-fantasma-dulces'], desc: 'Un fantasma rodeado de caramelos, estrellas y murciélagos para llenar de colores.', tags: ['fantasma', 'golosinas', 'caramelos'] },
  { id: 'lam-calabazas-luna', nombre: 'Calabazas bajo la luna', cat: 'laminas', temas: ['calabazas', 'gatos'], nivel: ['detalle'], precio: 900, descuento: 0, paginas: 1, img: 'p-lam-calabazas-luna', galeria: ['p-lam-calabazas-luna'], desc: 'Calabazas sonrientes, hojas enruladas y una luna enorme detrás.', tags: ['calabaza', 'luna'] },
  { id: 'lam-gatito-cerca', nombre: 'Gatito brujo en la cerca', cat: 'laminas', temas: ['gatos', 'calabazas'], nivel: ['simple'], precio: 700, descuento: 0, paginas: 1, img: 'p-lam-gatito-cerca', galeria: ['p-lam-gatito-cerca'], desc: 'Un gatito con sombrero de bruja que se asoma sobre una calabaza junto a la cerca.', tags: ['gato', 'sombrero', 'cerca'] },
  { id: 'lam-gatito-dormido', nombre: 'Gatito frente a la casona', cat: 'laminas', temas: ['gatos', 'casas'], nivel: ['detalle'], precio: 900, descuento: 0, paginas: 1, img: 'p-lam-gatito-dormido', galeria: ['p-lam-gatito-dormido'], desc: 'Un gato enorme y sonriente descansa frente a la casona embrujada.', tags: ['gato', 'casa'] },
];

const BASE = location.pathname.includes('/producto/') ? '../' : '';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const getTema = id => TEMAS.find(t => t.id === id);
const MAX_DIGITAL = 1;

const Cart = {
  KEY: 'mundodecolores_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { void 0; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, MAX_DIGITAL);
    else items.push({ id: producto.id, qty: Math.min(qty, MAX_DIGITAL) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, MAX_DIGITAL)); this.save(items);
  },
  has(id) { return this.get().some(i => i.id === id); },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const LIMITE_SERVIDOR = 100;
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function coincide(p, f) {
  if (p.visible === false) return false;
  if (f.destacado && !p.destacado) return false;
  if (f.cat?.length && !f.cat.includes(p.cat)) return false;
  if (f.tema?.length && !f.tema.some(t => p.temas.includes(t))) return false;
  if (f.nivel?.length && !f.nivel.some(n => p.nivel.includes(n))) return false;
  if (f.precio?.length) {
    const v = precioFinal(p);
    if (!f.precio.some(id => { const r = PRECIOS.find(x => x.id === id); return r && v >= r.min && v < r.max; })) return false;
  }
  if (f.q) {
    const texto = normalizar([p.nombre, getCategoria(p.cat)?.nombre, p.desc, ...p.temas, ...p.temas.map(t => getTema(t)?.nombre), ...(p.tags || [])].join(' '));
    if (!normalizar(f.q).split(/\s+/).filter(Boolean).every(w => texto.includes(w))) return false;
  }
  return true;
}

const ORDENES = {
  destacados: (a, b) => (b.p.principal ? 1 : 0) - (a.p.principal ? 1 : 0) || (a.p.destacado || 99) - (b.p.destacado || 99) || a.i - b.i,
  'precio-asc': (a, b) => precioFinal(a.p) - precioFinal(b.p) || a.i - b.i,
  'precio-desc': (a, b) => precioFinal(b.p) - precioFinal(a.p) || a.i - b.i,
  nombre: (a, b) => a.p.nombre.localeCompare(b.p.nombre, 'es') || a.i - b.i,
};

function consultarProductos({ filtros = {}, orden = 'destacados', cursor = null, limite = LIMITE_SERVIDOR } = {}) {
  const tope = Math.min(Math.max(1, Math.floor(limite) || LIMITE_SERVIDOR), LIMITE_SERVIDOR);
  const lista = PRODUCTOS.map((p, i) => ({ p, i })).filter(x => coincide(x.p, filtros)).sort(ORDENES[orden] || ORDENES.destacados).map(x => x.p);
  const desde = cursor ? lista.findIndex(p => p.id === cursor) + 1 : 0;
  const items = desde > 0 || !cursor ? lista.slice(desde, desde + tope) : [];
  const siguiente = items.length && desde + tope < lista.length ? items[items.length - 1].id : null;
  return Promise.resolve({ items, siguiente, total: lista.length });
}

const ANIM = {
  subir: 'data-animate="subir" style="opacity:0;transform:translateY(48px)"',
  der: 'data-animate="der" style="opacity:0;transform:translateX(64px)"',
};

const ICON_CARRITO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const ICON_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
const ICON_DESCARGA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>';

const tipoCorto = p => p.cat === 'laminas' ? 'Lámina' : `${getCategoria(p.cat)?.corto} · ${p.paginas} págs`;
const nivelTxt = p => p.nivel.length > 1 ? 'Trazo simple y detallado' : (NIVELES.find(n => n.id === p.nivel[0])?.nombre || '');
const metaTxt = p => `PDF · ${p.paginas} ${p.paginas === 1 ? 'página' : 'páginas'} · ${nivelTxt(p)}`;
const imgSrc = n => `${BASE}images/${n}.webp`;

function precioHTML(p) {
  return p.descuento > 0
    ? `<span class="precio precio--final">${formatearPrecio(precioFinal(p))}</span><s class="precio--antes">${formatearPrecio(p.precio)}</s>`
    : `<span class="precio">${formatearPrecio(p.precio)}</span>`;
}

const badgeHTML = p => p.descuento > 0 ? `<span class="badge-off">-${Math.round(p.descuento)}%</span>` : '';

function cardHTML(p, animar = true) {
  if (MODELO === '2') {
    return `<article class="vprod" data-id="${esc(p.id)}" ${animar ? ANIM.subir : ''}>
      <button type="button" class="vprod__media" data-quick="${esc(p.id)}" aria-label="Ver detalle: ${esc(p.nombre)}"><span class="recorte"><img src="${imgSrc(p.img)}" alt="${esc(p.nombre)}" width="560" height="700"></span></button>
      ${badgeHTML(p)}
      <div class="vprod__info">
        <p class="vprod__tipo">${esc(tipoCorto(p))}</p>
        <h3 class="vprod__nombre">${esc(p.nombre)}</h3>
        <div class="vprod__fila">
          <p class="vprod__precio">${formatearPrecio(precioFinal(p))}${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>
          <button type="button" class="vprod__add" data-add="${esc(p.id)}"><span class="add-ico">${ICON_CARRITO}</span><span class="add-txt">Agregar</span></button>
        </div>
      </div>
    </article>`;
  }
  return `<article class="prod" data-id="${esc(p.id)}" ${animar ? ANIM.subir : ''}>
    <button type="button" class="prod__media" data-quick="${esc(p.id)}" aria-label="Ver detalle: ${esc(p.nombre)}">
      <span class="recorte"><img src="${imgSrc(p.img)}" alt="${esc(p.nombre)}" width="560" height="700"></span>
      <span class="prod__chip prod__chip--${esc(p.cat)}">${esc(tipoCorto(p))}</span>
      ${badgeHTML(p)}
    </button>
    <div class="prod__info">
      <h3 class="prod__nombre"><button type="button" data-quick="${esc(p.id)}">${esc(p.nombre)}</button></h3>
      <p class="prod__meta">${esc(metaTxt(p))}</p>
      <div class="prod__fila">
        <p>${precioHTML(p)}</p>
        <button type="button" class="btn btn--cta prod-add" data-add="${esc(p.id)}"><span class="add-ico">${ICON_CARRITO}</span><span class="add-txt">Agregar<span class="add-extra"> al carrito</span></span></button>
      </div>
      <button type="button" class="prod-buy" data-buy="${esc(p.id)}">Comprar ahora</button>
    </div>
  </article>`;
}

const cantidadPor = (campo, id) => PRODUCTOS.filter(p => p.visible !== false && (campo === 'cat' ? p.cat === id : p[campo === 'tema' ? 'temas' : campo].includes(id))).length;
const cantidadPrecio = r => PRODUCTOS.filter(p => p.visible !== false && precioFinal(p) >= r.min && precioFinal(p) < r.max).length;

function renderMenus() {
  const params = new URLSearchParams(location.search);
  const catActual = PAGINA === 'catalogo' ? (params.get('cat') || '') : '';
  const temaActual = PAGINA === 'catalogo' ? (params.get('tema') || '') : '';
  document.querySelectorAll('[data-cat-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => `<li><a href="${CATALOGO}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
      <span class="cat-menu__img"><img src="${imgSrc(c.mini)}" alt="" width="92" height="115" loading="lazy"></span>
      <span class="cat-menu__nombre">${esc(c.nombre)}</span>
      <span class="cat-menu__n">${cantidadPor('cat', c.id)}</span></a></li>`).join('');
  });
  document.querySelectorAll('[data-tema-menu]').forEach(ul => {
    ul.innerHTML = TEMAS.map(t => `<li><a href="${CATALOGO}?tema=${t.id}"${temaActual === t.id ? ' aria-current="page"' : ''}>${esc(t.nombre)}<span>${cantidadPor('tema', t.id)}</span></a></li>`).join('');
  });
  document.querySelectorAll('[data-cat-links]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => `<li><a href="${CATALOGO}?cat=${c.id}">${esc(c.nombre)}</a></li>`).join('')
      + `<li><a href="${CATALOGO}">Todo el catálogo</a></li>`;
  });
  document.querySelectorAll('[data-tema-n]').forEach(el => {
    const n = cantidadPor('tema', el.dataset.temaN);
    el.textContent = el.hasAttribute('data-solo-n') ? String(n) : `${n} ${n === 1 ? 'diseño' : 'diseños'}`;
  });
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (p) el.textContent = formatearPrecio(precioFinal(p));
  });
}

async function renderPreview() {
  const cont = document.querySelector('[data-preview]');
  if (!cont) return;
  const { items } = await consultarProductos({ filtros: { destacado: true }, limite: 8 });
  cont.innerHTML = items.map(p => cardHTML(p)).join('');
}

const Catalogo = {
  estado: { cat: [], tema: [], nivel: [], precio: [], q: '', orden: 'destacados' },
  buffer: [], siguiente: null, total: 0, mostrar: 16, PASO: 16, pintados: 0,
};
const FACETAS = {
  cat: () => CATEGORIAS,
  tema: () => TEMAS,
  nivel: () => NIVELES,
  precio: () => PRECIOS,
};

function leerURLCatalogo() {
  const p = new URLSearchParams(location.search);
  const lista = (k, validos) => (p.get(k) || '').split(',').map(s => s.trim()).filter(v => validos.includes(v));
  const e = Catalogo.estado;
  Object.keys(FACETAS).forEach(k => { e[k] = lista(k, FACETAS[k]().map(x => x.id)); });
  e.q = (p.get('q') || '').slice(0, 60);
  e.orden = Object.keys(ORDENES).includes(p.get('orden')) ? p.get('orden') : 'destacados';
}

function escribirURLCatalogo() {
  const e = Catalogo.estado;
  const p = new URLSearchParams();
  Object.keys(FACETAS).forEach(k => { if (e[k].length) p.set(k, e[k].join(',')); });
  if (e.q) p.set('q', e.q);
  if (e.orden !== 'destacados') p.set('orden', e.orden);
  const prod = new URLSearchParams(location.search).get('producto');
  if (prod) p.set('producto', prod);
  const qs = p.toString();
  window.history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
}

const filtrosActivos = () => { const e = Catalogo.estado; return e.cat.length + e.tema.length + e.nivel.length + e.precio.length; };

function renderFiltros() {
  document.querySelectorAll('[data-filtros-grupo]').forEach(cont => {
    const f = cont.dataset.filtrosGrupo;
    const opciones = FACETAS[f]?.() || [];
    cont.innerHTML = opciones.map(o => `<label class="check"><input type="checkbox" data-f="${f}" value="${esc(o.id)}"><span>${esc(o.nombre)}</span><small>${f === 'precio' ? cantidadPrecio(o) : cantidadPor(f, o.id)}</small></label>`).join('');
  });
  const tabs = document.querySelector('[data-formato-tabs]');
  if (tabs) {
    tabs.innerHTML = `<button type="button" data-tab-cat="" aria-pressed="false">Todo</button>`
      + CATEGORIAS.map(c => `<button type="button" data-tab-cat="${c.id}" aria-pressed="false">${esc(c.nombre)}</button>`).join('');
  }
  const chips = document.querySelector('[data-tema-chips]');
  if (chips) {
    chips.innerHTML = TEMAS.map(t => `<button type="button" data-chip-tema="${t.id}" aria-pressed="false">${esc(t.nombre)}</button>`).join('');
  }
}

function sincronizarControles() {
  const e = Catalogo.estado;
  document.querySelectorAll('input[data-f]').forEach(inp => { inp.checked = (e[inp.dataset.f] || []).includes(inp.value); });
  const buscar = document.getElementById('buscar');
  if (buscar && buscar.value !== e.q) buscar.value = e.q;
  const orden = document.getElementById('orden');
  if (orden) orden.value = e.orden;
  const n = filtrosActivos();
  const badge = document.getElementById('filtrosN');
  if (badge) badge.textContent = n ? `(${n})` : '';
  document.querySelectorAll('[data-tab-cat]').forEach(b => {
    const id = b.dataset.tabCat;
    b.setAttribute('aria-pressed', String(id ? e.cat.length === 1 && e.cat[0] === id : e.cat.length === 0));
  });
  document.querySelectorAll('[data-chip-tema]').forEach(b => b.setAttribute('aria-pressed', String(e.tema.includes(b.dataset.chipTema))));

  const unaCat = e.cat.length === 1 && !e.tema.length ? getCategoria(e.cat[0]) : null;
  const unTema = e.tema.length === 1 && !e.cat.length ? getTema(e.tema[0]) : null;
  const nombre = unaCat ? unaCat.nombre : unTema ? `Para colorear: ${unTema.nombre}` : 'Catálogo completo';
  const titulo = document.getElementById('catTitulo');
  if (titulo) titulo.textContent = nombre;
  const miga = document.getElementById('migaCat');
  if (miga) {
    const t = unaCat?.nombre || unTema?.nombre || '';
    miga.hidden = !t;
    miga.textContent = t;
  }
  document.title = `${unaCat ? unaCat.nombre : unTema ? unTema.nombre : 'Catálogo'} — ${MARCA}`;
  document.querySelectorAll('[data-cat-menu] a').forEach(a => {
    const id = new URL(a.href, location.href).searchParams.get('cat');
    if (unaCat && id === unaCat.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  document.querySelectorAll('[data-tema-menu] a').forEach(a => {
    const id = new URL(a.href, location.href).searchParams.get('tema');
    if (unTema && id === unTema.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });

  const chipsAct = document.getElementById('chipsActivos');
  if (chipsAct) {
    const items = [
      ...e.cat.map(id => ({ f: 'cat', v: id, t: getCategoria(id)?.nombre })),
      ...e.tema.map(id => ({ f: 'tema', v: id, t: getTema(id)?.nombre })),
      ...e.nivel.map(id => ({ f: 'nivel', v: id, t: NIVELES.find(x => x.id === id)?.nombre })),
      ...e.precio.map(id => ({ f: 'precio', v: id, t: PRECIOS.find(x => x.id === id)?.nombre })),
      ...(e.q ? [{ f: 'q', v: e.q, t: `«${e.q}»` }] : []),
    ];
    chipsAct.innerHTML = items.map(c => `<button type="button" class="chip" data-quitar="${c.f}" data-valor="${esc(c.v)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICON_X}</button>`).join('');
  }
  const limpiar = document.getElementById('limpiar');
  if (limpiar) limpiar.hidden = !(filtrosActivos() || e.q);
}

async function cargarCatalogo(reiniciar = true) {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const e = Catalogo.estado;
  const filtros = { cat: e.cat, tema: e.tema, nivel: e.nivel, precio: e.precio, q: e.q };
  if (reiniciar) {
    Catalogo.mostrar = Catalogo.PASO;
    Catalogo.pintados = 0;
    const r = await consultarProductos({ filtros, orden: e.orden, limite: LIMITE_SERVIDOR });
    Catalogo.buffer = r.items; Catalogo.siguiente = r.siguiente; Catalogo.total = r.total;
    grid.innerHTML = '';
  }
  while (Catalogo.buffer.length < Catalogo.mostrar && Catalogo.siguiente) {
    const r = await consultarProductos({ filtros, orden: e.orden, cursor: Catalogo.siguiente, limite: LIMITE_SERVIDOR });
    Catalogo.buffer.push(...r.items); Catalogo.siguiente = r.siguiente;
  }
  const nuevos = Catalogo.buffer.slice(Catalogo.pintados, Catalogo.mostrar);
  grid.insertAdjacentHTML('beforeend', nuevos.map(p => cardHTML(p)).join(''));
  Catalogo.pintados += nuevos.length;

  const contador = document.getElementById('contador');
  if (contador) contador.textContent = `${Catalogo.total} ${Catalogo.total === 1 ? 'producto' : 'productos'}`;
  const vacio = document.getElementById('catVacio');
  if (vacio) vacio.hidden = Catalogo.total > 0;
  const mas = document.getElementById('verMas');
  if (mas) {
    const resto = Math.max(0, Catalogo.total - Catalogo.pintados);
    mas.hidden = resto === 0;
    mas.textContent = `Ver más (${resto})`;
  }
  document.querySelectorAll('[data-ver-resultados]').forEach(b => { b.textContent = Catalogo.total ? `Ver ${Catalogo.total} ${Catalogo.total === 1 ? 'resultado' : 'resultados'}` : 'Sin resultados'; });
  syncBotones();
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function aplicarCambioCatalogo() {
  escribirURLCatalogo();
  sincronizarControles();
  cargarCatalogo(true);
}

async function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  renderFiltros();
  leerURLCatalogo();
  sincronizarControles();
  await cargarCatalogo(true);

  document.getElementById('filtros')?.addEventListener('change', ev => {
    const inp = ev.target.closest('input[data-f]');
    if (!inp) return;
    const lista = Catalogo.estado[inp.dataset.f];
    const i = lista.indexOf(inp.value);
    if (inp.checked && i < 0) lista.push(inp.value);
    if (!inp.checked && i >= 0) lista.splice(i, 1);
    aplicarCambioCatalogo();
  });
  const buscar = document.getElementById('buscar');
  let t = 0;
  buscar?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { Catalogo.estado.q = buscar.value.trim().slice(0, 60); aplicarCambioCatalogo(); }, 220);
  });
  document.querySelector('[data-buscador]')?.addEventListener('submit', ev => {
    ev.preventDefault();
    clearTimeout(t);
    Catalogo.estado.q = (buscar?.value || '').trim().slice(0, 60);
    aplicarCambioCatalogo();
  });
  document.getElementById('orden')?.addEventListener('change', ev => { Catalogo.estado.orden = ev.target.value; aplicarCambioCatalogo(); });
  document.getElementById('verMas')?.addEventListener('click', () => { Catalogo.mostrar += Catalogo.PASO; cargarCatalogo(false); });
  const limpiarTodo = () => { const e = Catalogo.estado; e.cat = []; e.tema = []; e.nivel = []; e.precio = []; e.q = ''; aplicarCambioCatalogo(); };
  document.getElementById('limpiar')?.addEventListener('click', limpiarTodo);
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', limpiarTodo));
  document.getElementById('chipsActivos')?.addEventListener('click', ev => {
    const b = ev.target.closest('[data-quitar]');
    if (!b) return;
    const f = b.dataset.quitar;
    if (f === 'q') Catalogo.estado.q = '';
    else Catalogo.estado[f] = Catalogo.estado[f].filter(v => v !== b.dataset.valor);
    aplicarCambioCatalogo();
  });
  document.querySelector('[data-formato-tabs]')?.addEventListener('click', ev => {
    const b = ev.target.closest('[data-tab-cat]');
    if (!b) return;
    Catalogo.estado.cat = b.dataset.tabCat ? [b.dataset.tabCat] : [];
    aplicarCambioCatalogo();
  });
  document.querySelector('[data-tema-chips]')?.addEventListener('click', ev => {
    const b = ev.target.closest('[data-chip-tema]');
    if (!b) return;
    const lista = Catalogo.estado.tema;
    const i = lista.indexOf(b.dataset.chipTema);
    if (i >= 0) lista.splice(i, 1); else lista.push(b.dataset.chipTema);
    aplicarCambioCatalogo();
  });
  initFiltrosDrawer();
}

const overlays = new Set();
function bloquearScroll(nombre, si) {
  if (si) overlays.add(nombre); else overlays.delete(nombre);
  document.body.classList.toggle('no-scroll', overlays.size > 0);
}

function atraparFoco(cont, ev) {
  if (ev.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length && !el.closest('[hidden]'));
  if (!f.length) return;
  const primero = f[0]; const ultimo = f[f.length - 1];
  if (ev.shiftKey && document.activeElement === primero) { ev.preventDefault(); ultimo.focus(); }
  else if (!ev.shiftKey && document.activeElement === ultimo) { ev.preventDefault(); primero.focus(); }
}

function initFiltrosDrawer() {
  const slot = document.getElementById('filtrosSlot');
  if (!slot) return;
  const abrirBtns = document.querySelectorAll('[data-abrir-filtros]');
  const esDrawer = () => slot.classList.contains('filtros-slot--drawer') || window.matchMedia('(max-width: 1023px)').matches;
  let bd = document.querySelector('.filtros-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); }
  let ultimo = null;
  const abrir = trigger => {
    ultimo = trigger || document.activeElement;
    slot.classList.add('open'); bd.classList.add('open');
    abrirBtns.forEach(b => b.setAttribute('aria-expanded', 'true'));
    slot.setAttribute('role', 'dialog'); slot.setAttribute('aria-modal', 'true');
    bloquearScroll('filtros', true);
    slot.querySelector('.cerrar-x')?.focus();
  };
  const cerrar = () => {
    if (!slot.classList.contains('open')) return;
    slot.classList.remove('open'); bd.classList.remove('open');
    abrirBtns.forEach(b => b.setAttribute('aria-expanded', 'false'));
    slot.removeAttribute('role'); slot.removeAttribute('aria-modal');
    bloquearScroll('filtros', false);
    ultimo?.focus?.();
  };
  abrirBtns.forEach(b => b.addEventListener('click', () => abrir(b)));
  slot.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrar));
  bd.addEventListener('click', cerrar);
  slot.addEventListener('keydown', ev => { if (slot.classList.contains('open')) atraparFoco(slot, ev); });
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && slot.classList.contains('open')) cerrar(); });
  window.matchMedia('(max-width: 1023px)').addEventListener('change', () => { if (!esDrawer()) cerrar(); });
}

function syncBotones() {
  const ids = new Set(Cart.get().map(i => i.id));
  document.querySelectorAll('[data-add]').forEach(b => {
    const p = getProducto(b.dataset.add);
    if (!p) return;
    const dentro = ids.has(p.id);
    const txt = b.querySelector('.add-txt');
    if (!b.dataset.txt) b.dataset.txt = txt ? txt.innerHTML : b.textContent.trim();
    if (txt) txt.innerHTML = dentro ? 'En el carrito' : b.dataset.txt;
    else b.textContent = dentro ? 'En el carrito' : b.dataset.txt;
    const ico = b.querySelector('.add-ico');
    if (ico) ico.innerHTML = dentro ? ICON_CHECK : ICON_CARRITO;
    b.classList.toggle('en-carrito', dentro);
    b.setAttribute('aria-label', `${dentro ? 'En el carrito' : 'Agregar al carrito'}: ${p.nombre}`);
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

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

let focoCarrito = null;
function renderCarrito() {
  const lista = document.getElementById('carritoLista');
  if (!lista) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  lista.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    return `<li class="linea">
      <span class="linea__img"><img src="${imgSrc(p.img)}" alt="" width="136" height="170"></span>
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__meta">${esc(tipoCorto(p))} · PDF</p><p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p></div>
      <button type="button" class="linea__quitar" data-quitar-item="${esc(p.id)}" aria-label="Quitar ${esc(p.nombre)} del carrito">${ICON_X}</button>
    </li>`;
  }).join('');
  lista.hidden = !items.length;
  const vacio = document.getElementById('carritoVacio');
  if (vacio) vacio.hidden = items.length > 0;
  const pie = document.getElementById('carritoPie');
  if (pie) pie.hidden = !items.length;
  const total = document.getElementById('carritoTotal');
  if (total) total.textContent = formatearPrecio(Cart.total());
}

function abrirCarrito(trigger) {
  const d = document.getElementById('carrito');
  if (!d) return;
  const desdeQuick = !!trigger?.closest?.('#quick');
  focoCarrito = desdeQuick ? focoQuick : (trigger || document.activeElement);
  if (!document.getElementById('quick')?.hidden) cerrarQuick(false);
  renderCarrito();
  d.hidden = false;
  void d.offsetWidth;
  d.classList.add('abierto');
  bloquearScroll('carrito', true);
  d.querySelector('.cerrar-x')?.focus();
}

function cerrarCarrito() {
  const d = document.getElementById('carrito');
  if (!d || d.hidden) return;
  d.classList.remove('abierto');
  bloquearScroll('carrito', false);
  const fin = () => { if (!d.classList.contains('abierto')) d.hidden = true; };
  d.querySelector('.drawer__panel')?.addEventListener('transitionend', fin, { once: true });
  setTimeout(fin, 450);
  focoCarrito?.focus?.();
}

function initCarrito() {
  const d = document.getElementById('carrito');
  if (!d) return;
  d.querySelectorAll('[data-cerrar-carrito]').forEach(b => b.addEventListener('click', cerrarCarrito));
  d.addEventListener('keydown', ev => atraparFoco(d, ev));
  document.getElementById('carritoLista')?.addEventListener('click', ev => {
    const b = ev.target.closest('[data-quitar-item]');
    if (!b) return;
    const p = getProducto(b.dataset.quitarItem);
    Cart.remove(b.dataset.quitarItem);
    renderCarrito();
    if (p) showToast(`Sacamos «${p.nombre}» del carrito`);
    (d.querySelector('.linea__quitar') || d.querySelector('.cerrar-x'))?.focus();
  });
  document.getElementById('finalizar')?.addEventListener('click', ev => {
    const b = ev.currentTarget;
    b.disabled = true;
    const txt = b.textContent;
    b.textContent = 'Preparando tu compra…';
    setTimeout(() => { b.disabled = false; b.textContent = txt; showToast('¡Genial! El pago online se activa al pasar la web a producción.'); }, 700);
  });
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderCarrito(); });
}

let focoQuick = null;
function quickHTML(p) {
  const g = p.galeria?.length ? p.galeria : [p.img];
  const rel = PRODUCTOS.filter(x => x.id !== p.id && x.visible !== false && (x.cat === p.cat || p.cat === 'libros') && (p.cat !== 'libros' || x.cat === 'packs')).slice(0, 3);
  return `<div class="qv__galeria">
      <div class="qv__principal"><img src="${imgSrc(g[0])}" alt="${esc(p.nombre)}" width="560" height="700" data-qv-img></div>
      ${g.length > 1 ? `<div class="qv__thumbs" role="group" aria-label="Fotos de ${esc(p.nombre)}">${g.map((s, i) => `<button type="button" aria-pressed="${i === 0}" data-qv-thumb="${esc(s)}" aria-label="Ver foto ${i + 1} de ${g.length}"><img src="${imgSrc(s)}" alt="" width="128" height="128"></button>`).join('')}</div>` : ''}
    </div>
    <div class="qv__info">
      <span class="prod__chip qv__chip prod__chip--${esc(p.cat)}">${esc(tipoCorto(p))}</span>
      <h2>${esc(p.nombre)}</h2>
      <p class="qv__meta">${esc(metaTxt(p))}</p>
      <div class="qv__temas">${p.temas.map(t => `<a href="${CATALOGO}?tema=${t}">${esc(getTema(t)?.nombre)}</a>`).join('')}</div>
      <p class="qv__desc">${esc(p.desc)}</p>
      <p class="qv__precio"><span class="precio-grande">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s><span class="badge-off">-${Math.round(p.descuento)}%</span>` : ''}</p>
      <div class="qv__botones">
        <button type="button" class="btn btn--line" data-add="${esc(p.id)}"><span class="add-ico">${ICON_CARRITO}</span><span class="add-txt">Agregar al carrito</span></button>
        <button type="button" class="btn btn--cta" data-buy="${esc(p.id)}">Comprar ahora</button>
      </div>
      <p class="nota-digital">${ICON_DESCARGA}Producto digital: con el pago aprobado, se habilita la descarga del PDF.</p>
      ${p.cat === 'libros' ? `<a class="btn-link" href="${BASE}${MUESTRA}" download>${ICON_DESCARGA}Bajar 2 páginas gratis</a>` : ''}
      ${rel.length ? `<div class="qv__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" data-quick="${esc(r.id)}"><span class="recorte"><img src="${imgSrc(r.img)}" alt="" width="280" height="350"></span><span>${esc(r.nombre)}</span></button></li>`).join('')}</ul></div>` : ''}
    </div>`;
}

function abrirQuick(id, trigger) {
  const p = getProducto(id);
  const m = document.getElementById('quick');
  const body = document.getElementById('quickBody');
  if (!p || !m || !body) return;
  if (m.hidden) focoQuick = trigger || document.activeElement;
  body.innerHTML = quickHTML(p);
  m.hidden = false;
  bloquearScroll('quick', true);
  const caja = m.querySelector('.modal__caja');
  if (caja) caja.scrollTop = 0;
  syncBotones();
  m.querySelector('.modal__cerrar')?.focus();
  const u = new URL(location.href);
  u.searchParams.set('producto', p.id);
  window.history.replaceState(null, '', u.pathname + u.search + u.hash);
}

function cerrarQuick(devolverFoco = true) {
  const m = document.getElementById('quick');
  if (!m || m.hidden) return;
  m.hidden = true;
  bloquearScroll('quick', false);
  const u = new URL(location.href);
  u.searchParams.delete('producto');
  window.history.replaceState(null, '', u.pathname + u.search + u.hash);
  if (devolverFoco) focoQuick?.focus?.();
}

function initQuick() {
  const m = document.getElementById('quick');
  if (!m) return;
  m.querySelectorAll('[data-cerrar-quick]').forEach(b => b.addEventListener('click', () => cerrarQuick()));
  m.addEventListener('keydown', ev => atraparFoco(m, ev));
  m.addEventListener('click', ev => {
    const b = ev.target.closest('[data-qv-thumb]');
    if (!b) return;
    const img = m.querySelector('[data-qv-img]');
    if (img) img.src = imgSrc(b.dataset.qvThumb);
    m.querySelectorAll('[data-qv-thumb]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  });
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirQuick(id, null);
}

function initDelegacion() {
  document.addEventListener('click', ev => {
    const add = ev.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      if (Cart.has(p.id)) { abrirCarrito(add); return; }
      Cart.add(p);
      showToast(`«${p.nombre}» se sumó al carrito`);
      return;
    }
    const buy = ev.target.closest('[data-buy]');
    if (buy) {
      const p = getProducto(buy.dataset.buy);
      if (!p) return;
      if (!Cart.has(p.id)) Cart.add(p);
      abrirCarrito(buy);
      return;
    }
    const quick = ev.target.closest('[data-quick]');
    if (quick) { abrirQuick(quick.dataset.quick, quick); return; }
    const open = ev.target.closest('[data-open-cart]');
    if (open) abrirCarrito(open);
  });
  document.addEventListener('keydown', ev => {
    if (ev.key !== 'Escape') return;
    if (!document.getElementById('quick')?.hidden) { cerrarQuick(); return; }
    if (!document.getElementById('carrito')?.hidden) cerrarCarrito();
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); syncBotones(); });
  window.addEventListener('storage', ev => { if (ev.key === Cart.KEY) { updateCartBadge(); syncBotones(); renderCarrito(); } });
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
  cart?.addEventListener('click', () => abrirCarrito(cart));
  sync();
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
    toggle.setAttribute('aria-expanded', 'false'); bloquearScroll('nav', false);
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); bloquearScroll('nav', true);
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

function initCatsMenu() {
  document.querySelectorAll('[data-nav-cats]').forEach(w => {
    const btn = w.querySelector('.nav-cats__btn');
    const panel = w.querySelector('.nav-cats__panel');
    if (!btn || !panel) return;
    const desk = window.matchMedia('(min-width: 1024px)');
    const hover = window.matchMedia('(hover: hover)');
    let t = 0;
    const abrir = () => { clearTimeout(t); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      if (desk.matches && hover.matches) { abrir(); return; }
      if (panel.hidden) abrir(); else cerrar();
    });
    w.addEventListener('mouseenter', () => { if (desk.matches && hover.matches) abrir(); });
    w.addEventListener('mouseleave', () => { if (desk.matches && hover.matches) { clearTimeout(t); t = setTimeout(cerrar, 140); } });
    w.addEventListener('focusout', ev => { if (desk.matches && !w.contains(ev.relatedTarget)) cerrar(); });
    document.addEventListener('click', ev => { if (desk.matches && !w.contains(ev.target)) cerrar(); });
    document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && !panel.hidden && desk.matches) { cerrar(); btn.focus(); } });
    desk.addEventListener('change', cerrar);
  });
}

function initBuscarPop() {
  const btn = document.querySelector('[data-buscar-toggle]');
  const pop = document.getElementById('buscarPop');
  if (!btn) return;
  const cerrar = () => { if (!pop || pop.hidden) return; pop.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => {
    const buscar = document.getElementById('buscar');
    if (buscar) { buscar.focus({ preventScroll: true }); buscar.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' }); return; }
    if (!pop) return;
    const abrir = pop.hidden;
    pop.hidden = !abrir;
    btn.setAttribute('aria-expanded', String(abrir));
    if (abrir) pop.querySelector('input')?.focus();
  });
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && pop && !pop.hidden) { cerrar(); btn.focus(); } });
  document.addEventListener('click', ev => { if (pop && !pop.hidden && !pop.contains(ev.target) && !btn.contains(ev.target)) cerrar(); });
}

function initFichaGaleria() {
  const g = document.querySelector('[data-galeria]');
  if (!g) return;
  const img = g.querySelector('[data-galeria-img]');
  g.querySelectorAll('[data-src]').forEach(b => b.addEventListener('click', () => {
    if (!img || b.getAttribute('aria-pressed') === 'true') return;
    g.querySelectorAll('[data-src]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    img.src = b.dataset.src;
    img.alt = b.dataset.alt || '';
  }));
}

function initRailDrag() {
  document.querySelectorAll('.rail').forEach(rail => {
    const vp = rail.querySelector('.rail-vp');
    const track = rail.querySelector('.rail-track');
    if (!vp || !track) return;
    const seccion = rail.closest('section') || rail.parentElement;
    const prev = seccion.querySelector('[data-rail-prev]');
    const next = seccion.querySelector('[data-rail-next]');
    let pointerId = null; let startX = 0; let startLeft = 0; let moved = false;
    vp.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      pointerId = e.pointerId; startX = e.clientX; startLeft = vp.scrollLeft; moved = false;
    });
    vp.addEventListener('pointermove', e => {
      if (pointerId === null || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) < 6) return;
      if (!moved) {
        moved = true;
        vp.classList.add('dragging');
        try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
      }
      vp.scrollLeft = startLeft - dx;
    });
    const end = () => {
      if (pointerId === null) return;
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
      pointerId = null;
      if (moved) {
        const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
        vp.addEventListener('click', kill, { capture: true, once: true });
        setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 60);
      }
      vp.classList.remove('dragging');
    };
    vp.addEventListener('pointerup', end);
    vp.addEventListener('pointercancel', end);
    vp.addEventListener('lostpointercapture', () => vp.classList.remove('dragging'));
    const paso = () => (track.querySelector('.pagina')?.getBoundingClientRect().width || 240) + 20;
    const syncArrows = () => {
      if (prev) prev.disabled = vp.scrollLeft <= 2;
      if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', syncArrows, { passive: true });
    window.addEventListener('resize', syncArrows, { passive: true });
    syncArrows();
  });
}

function initFaq() {
  document.querySelectorAll('details').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
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
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn, [data-hero-extra]'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
  const trazo = hero.querySelector('.trazo__svg path');
  if (trazo) tl.fromTo(trazo, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out', clearProps: 'strokeDasharray,strokeDashoffset' }, 0.95);
}

(async function iniciar() {
  initModelBarScroll();
  initHeroMotion();
  renderMenus();
  initNav();
  initCatsMenu();
  initBuscarPop();
  initDelegacion();
  initCarrito();
  initFloats();
  initFichaGaleria();
  initRailDrag();
  initFaq();
  updateCartBadge();
  await renderPreview();
  await initCatalogo();
  syncBotones();
  initReveals();
  initQuick();
})();
