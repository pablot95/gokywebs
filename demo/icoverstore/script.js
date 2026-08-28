const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  if (typeof window.Flip !== 'undefined') gsap.registerPlugin(window.Flip);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const sinAcentos = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const MODELOS = ['iPhone 11', 'iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone 15', 'iPhone 16'];
const TODOS = MODELOS.slice();

const CATEGORIAS = [
  { id: 'diseno', nombre: 'Con diseño', img: 'images/real-fundas-lunares-1200x1600.webp', alt: 'Fundas a lunares en varios colores, etiquetadas por modelo de iPhone' },
  { id: 'animal', nombre: 'Animal print', img: 'images/real-fundas-animal-1200x1600.webp', alt: 'Dos fundas con estampado de leopardo en negro y caramelo' },
  { id: 'lisas', nombre: 'Lisas y transparentes', img: 'images/acc-funda-silicona-1200x1200.webp', alt: 'Funda de silicona naranja para iPhone vista desde atrás' },
  { id: 'accesorios', nombre: 'Accesorios', img: 'images/acc-cable-trenzado-1200x1200.webp', alt: 'Cable trenzado enrollado sobre fondo claro' }
];

const PRODUCTOS = [
  { id: 'rayas', nombre: 'Funda Rayas Blanco y Negro', cat: 'diseno', precio: 15900, descuento: 0, patron: 'rayas', base: '#F2EDE4', motivo: '#262626', fotoReal: 'images/real-funda-rayas-1200x1600.webp', modelos: ['iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone 15', 'iPhone 16'], destacado: true, nuevo: false, tags: 'rayas blanco negro clasica pintada', desc: 'Rayas pintadas a mano en blanco roto y negro, sobre base rígida con borde de silicona. Es de las que más salen porque combina con todo.' },
  { id: 'estrellas', nombre: 'Funda Estrellas', cat: 'diseno', precio: 16900, descuento: 0, patron: 'estrellas', base: '#23212A', motivo: '#FFFFFF', fotoReal: 'images/real-funda-estrellas-1200x1600.webp', modelos: TODOS, destacado: true, nuevo: true, tags: 'estrellas negro blanco noche y2k', desc: 'Estrellas blancas de distintos tamaños sobre negro. El borde es de silicona flexible y la parte de atrás rígida, así no se deforma.' },
  { id: 'leopardo-negro', nombre: 'Funda Leopardo Negro', cat: 'animal', precio: 17900, descuento: 15, patron: 'leopardo', base: '#E8DED2', motivo: '#2A2320', fotoReal: 'images/real-fundas-animal-1200x1600.webp', modelos: ['iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone 15', 'iPhone 16'], destacado: true, nuevo: false, tags: 'animal print leopardo negro beige', desc: 'Animal print en tonos beige y negro. Tiene el borde levantado sobre la cámara, así el vidrio no toca la mesa.' },
  { id: 'leopardo-caramelo', nombre: 'Funda Leopardo Caramelo', cat: 'animal', precio: 17900, descuento: 0, patron: 'leopardo', base: '#E8A45C', motivo: '#4A2A16', fotoReal: 'images/real-fundas-animal-1200x1600.webp', modelos: ['iPhone 13', 'iPhone 14', 'iPhone 15', 'iPhone 16'], destacado: true, nuevo: false, tags: 'animal print leopardo caramelo naranja marron', desc: 'La misma base del leopardo negro pero en caramelo y marrón. Se ve bastante más cálida en persona que en la foto.' },
  { id: 'lunares-rosa', nombre: 'Funda Lunares Rosa', cat: 'diseno', precio: 14900, descuento: 0, patron: 'lunares', base: '#F3C6D2', motivo: '#2B2426', fotoReal: 'images/real-fundas-lunares-1200x1600.webp', modelos: TODOS, destacado: true, nuevo: false, tags: 'lunares puntos rosa pastel', desc: 'Rosa empolvado con lunares negros chiquitos. Silicona suave por dentro y por fuera, de las más livianas que tenemos.' },
  { id: 'lunares-menta', nombre: 'Funda Lunares Menta', cat: 'diseno', precio: 14900, descuento: 0, patron: 'lunares', base: '#BEDCCB', motivo: '#2B2426', fotoReal: 'images/real-fundas-lunares-1200x1600.webp', modelos: ['iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone 15'], destacado: false, nuevo: false, tags: 'lunares puntos menta verde pastel', desc: 'Verde menta con lunares negros. Es la que menos se ensucia de la línea pastel, por si te da miedo el color claro.' },
  { id: 'lunares-naranja', nombre: 'Funda Lunares Naranja', cat: 'diseno', precio: 14900, descuento: 0, patron: 'lunares', base: '#E8734A', motivo: '#2B2426', fotoReal: 'images/real-fundas-lunares-1200x1600.webp', modelos: ['iPhone 13', 'iPhone 14', 'iPhone 15', 'iPhone 16'], destacado: true, nuevo: false, tags: 'lunares puntos naranja coral', desc: 'Naranja coral con lunares negros. Es la que más se lleva la gente que quiere algo con color pero sin dibujo.' },
  { id: 'lunares-crema', nombre: 'Funda Lunares Crema', cat: 'diseno', precio: 14900, descuento: 0, patron: 'lunares', base: '#EDE2CE', motivo: '#2B2426', fotoReal: 'images/real-fundas-lunares-1200x1600.webp', modelos: ['iPhone 11', 'iPhone 12', 'iPhone 13', 'iPhone 14'], destacado: false, nuevo: false, tags: 'lunares puntos crema beige neutro', desc: 'Crema con lunares negros, la versión más neutra de la línea. Va bien con cualquier color de teléfono.' },
  { id: 'cebra', nombre: 'Funda Cebra', cat: 'animal', precio: 16900, descuento: 0, patron: 'cebra', base: '#F6F2F1', motivo: '#201C1C', fotoReal: null, modelos: ['iPhone 13', 'iPhone 14', 'iPhone 15', 'iPhone 16'], destacado: false, nuevo: true, tags: 'animal print cebra blanco negro', desc: 'Rayas de cebra en blanco y negro. Recién llegada, por ahora solo la traigo de iPhone 13 para arriba.' },
  { id: 'corazones', nombre: 'Funda Corazones', cat: 'diseno', precio: 15900, descuento: 0, patron: 'corazones', base: '#E9A0B4', motivo: '#FFFFFF', fotoReal: null, modelos: TODOS, destacado: true, nuevo: true, tags: 'corazones rosa amor san valentin', desc: 'Corazones blancos sobre rosa. Es la que más regalan, así que suele volar rápido cuando llega.' },
  { id: 'cuadrille', nombre: 'Funda Cuadrillé', cat: 'diseno', precio: 15900, descuento: 20, patron: 'cuadrille', base: '#F0D9DE', motivo: '#7C2438', fotoReal: null, modelos: ['iPhone 12', 'iPhone 13', 'iPhone 14'], destacado: false, nuevo: false, tags: 'cuadrille cuadros vichy rosa bordo', desc: 'Cuadrillé rosa y bordó, estilo vichy. Me quedan las últimas de estos modelos, por eso está con descuento.' },
  { id: 'lisa-bordo', nombre: 'Funda Lisa Bordó', cat: 'lisas', precio: 12900, descuento: 0, patron: 'liso', base: '#6E1A2C', motivo: '#6E1A2C', fotoReal: null, modelos: TODOS, destacado: false, nuevo: false, tags: 'lisa bordo vino silicona basica', desc: 'Silicona lisa en bordó, con interior de microfibra. La opción de siempre cuando no querés dibujo.' },
  { id: 'lisa-rosa', nombre: 'Funda Lisa Rosa Bebé', cat: 'lisas', precio: 12900, descuento: 0, patron: 'liso', base: '#F6CBD6', motivo: '#F6CBD6', fotoReal: null, modelos: TODOS, destacado: false, nuevo: false, tags: 'lisa rosa bebe silicona basica pastel', desc: 'Silicona lisa en rosa bebé, interior de microfibra. Tacto suave y sin brillo.' },
  { id: 'transparente', nombre: 'Funda Transparente Reforzada', cat: 'lisas', precio: 13900, descuento: 0, patron: 'transparente', base: '#F4F1F2', motivo: '#F4F1F2', fotoReal: 'images/acc-funda-transparente-1200x1200.webp', modelos: TODOS, destacado: true, nuevo: false, tags: 'transparente cristal reforzada esquinas antigolpes', desc: 'Transparente con esquinas reforzadas y tratamiento antiamarillo. Es la que recomiendo si querés que se vea el color del teléfono.' },

  { id: 'cargador-20w', nombre: 'Cargador 20W USB-C', cat: 'accesorios', precio: 24900, descuento: 0, patron: null, base: null, motivo: null, img: 'images/acc-cargador-cable-1200x1200.webp', alt: 'Cargador blanco de pared con cable conectado', fotoReal: null, modelos: TODOS, destacado: false, nuevo: false, tags: 'cargador 20w usb-c carga rapida ficha', desc: 'Cargador de pared de 20W con salida USB-C. Es el que hace falta para que la carga rápida funcione de verdad.' },
  { id: 'cable-lightning', nombre: 'Cable Lightning 1 metro', cat: 'accesorios', precio: 11900, descuento: 0, patron: null, base: null, motivo: null, img: 'images/acc-cable-lightning-1200x1200.webp', alt: 'Cable Lightning blanco conectado a un iPhone con funda transparente', fotoReal: null, modelos: TODOS, destacado: false, nuevo: false, tags: 'cable lightning 1 metro blanco carga', desc: 'Cable Lightning de un metro, con malla reforzada en las dos puntas. Entra con funda puesta, incluso las gruesas.' },
  { id: 'cable-trenzado', nombre: 'Cable trenzado USB-C 2 metros', cat: 'accesorios', precio: 15900, descuento: 15, patron: null, base: null, motivo: null, img: 'images/acc-cable-trenzado-1200x1200.webp', alt: 'Cable trenzado enrollado sobre una superficie clara', fotoReal: null, modelos: TODOS, destacado: false, nuevo: true, tags: 'cable trenzado usb-c 2 metros largo', desc: 'Dos metros de cable trenzado, para cargar desde la cama sin quedar corto. Aguanta bastante más que el de plástico.' },
  { id: 'auriculares', nombre: 'Auriculares con cable Lightning', cat: 'accesorios', precio: 18900, descuento: 0, patron: null, base: null, motivo: null, img: 'images/acc-auriculares-1200x1200.webp', alt: 'Auriculares blancos con cable enrollados sobre fondo claro', fotoReal: null, modelos: TODOS, destacado: false, nuevo: false, tags: 'auriculares cable lightning manos libres microfono', desc: 'Auriculares con ficha Lightning, con control de volumen y micrófono. Para los iPhone que ya no traen la salida de 3.5.' },
  { id: 'funda-airpods', nombre: 'Funda para AirPods', cat: 'accesorios', precio: 13900, descuento: 0, patron: null, base: null, motivo: null, img: 'images/acc-airpods-1200x1200.webp', alt: 'Estuche de AirPods abierto sobre una superficie gris', fotoReal: null, modelos: TODOS, destacado: false, nuevo: true, tags: 'funda airpods estuche silicona mosqueton', desc: 'Funda de silicona para el estuche de los AirPods, con mosquetón para colgarla. Viene en varios colores, consultame cuál hay.' },
  { id: 'malla-watch', nombre: 'Malla de silicona para Apple Watch', cat: 'accesorios', precio: 12900, descuento: 0, patron: null, base: null, motivo: null, img: 'images/acc-smartwatch-1200x1200.webp', alt: 'Reloj inteligente con malla de silicona rosa', fotoReal: null, modelos: TODOS, destacado: false, nuevo: false, tags: 'malla correa apple watch silicona rosa', desc: 'Malla de silicona suave para Apple Watch, en rosa. Decime la medida de tu caja y te confirmo si la tengo.' }
];

const getProducto = id => PRODUCTOS.find(p => p.id === id);
const catNombre = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';

function fundaHTML(p) {
  if (p.img) return `<img src="${p.img}" alt="${esc(p.alt || p.nombre)}" width="1200" height="1200" decoding="async">`;
  return `<span class="funda" data-patron="${p.patron}" style="--base:${p.base};--motivo:${p.motivo}"><span class="funda-camara" aria-hidden="true"><i></i><i></i><i></i></span></span>`;
}

const Cart = {
  KEY: 'icoverstore_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, modelo, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.modelo === modelo);
    if (existing) existing.qty = Math.min(existing.qty + qty, 20);
    else items.push({ id: producto.id, modelo, qty: Math.min(qty, 20) });
    this.save(items);
  },
  setQty(id, modelo, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.modelo === modelo);
    if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 20));
    this.save(items);
  },
  remove(id, modelo) { this.save(this.get().filter(i => !(i.id === id && i.modelo === modelo))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); }
};

const MODELO_KEY = 'icoverstore_modelo';
let modeloGlobal = '';
try { modeloGlobal = localStorage.getItem(MODELO_KEY) || ''; } catch { modeloGlobal = ''; }
if (modeloGlobal && !MODELOS.includes(modeloGlobal)) modeloGlobal = '';

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n;
    b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

function modeloParaAgregar(p) {
  if (modeloGlobal && p.modelos.includes(modeloGlobal)) return modeloGlobal;
  return p.modelos[p.modelos.length - 1];
}

function agregar(p, modelo, qty = 1, abrir = false) {
  Cart.add(p, modelo, qty);
  if (abrir) abrirDrawer();
  else showToast(`${p.nombre} (${modelo}) al carrito`);
}

/* ============ CATEGORIAS ============ */
function initCategorias() {
  const cont = document.getElementById('catGrid');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(c => `
    <a class="cat" href="#tienda" data-cat="${c.id}" data-animate="up" style="transform:translateY(22px);opacity:0">
      <img src="${c.img}" alt="${esc(c.alt)}" width="1200" height="1600" decoding="async">
      <span class="cat-txt">
        <span class="cat-nombre">${esc(c.nombre)}</span>
        <span class="cat-flecha" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
      </span>
    </a>`).join('');
  cont.querySelectorAll('.cat').forEach(a => {
    a.addEventListener('click', () => { filtros.cat = a.dataset.cat; sincronizarChips(); aplicarFiltros(); });
  });
}

/* ============ TARJETA ============ */
function cardHTML(p, animar = true) {
  const fin = precioFinal(p);
  const compat = modeloGlobal && !p.modelos.includes(modeloGlobal);
  const badges = [
    p.nuevo ? '<span class="badge badge-nuevo">Nuevo</span>' : '',
    p.descuento > 0 ? `<span class="badge badge-off">-${p.descuento}%</span>` : ''
  ].join('');
  const acciones = compat
    ? `<p class="prod-sin">Sin stock para ${esc(modeloGlobal)}</p>`
    : `<div class="prod-actions">
         <div class="stepper" data-stepper>
           <button type="button" data-menos aria-label="Restar uno">−</button>
           <span data-qty>1</span>
           <button type="button" data-mas aria-label="Sumar uno">+</button>
         </div>
         <button type="button" class="prod-add" data-add>Agregar</button>
       </div>`;
  return `
    <article class="prod" data-id="${p.id}"${animar ? ' data-animate="up" style="transform:translateY(24px);opacity:0"' : ''}>
      <div class="prod-media">
        ${badges ? `<div class="prod-badges">${badges}</div>` : ''}
        ${fundaHTML(p)}
        <button type="button" class="prod-ver" data-ver>Ver detalle</button>
      </div>
      <span class="prod-cat">${esc(catNombre(p.cat))}</span>
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      <p class="prod-precio"><b>${formatearPrecio(fin)}</b>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>
      <p class="prod-modelos">${p.cat === 'accesorios' ? 'Para todos los modelos' : `${p.modelos.length} modelos disponibles`}</p>
      ${acciones}
    </article>`;
}

function conectarCard(card) {
  const p = getProducto(card.dataset.id);
  if (!p) return;
  let qty = 1;
  const qtyEl = card.querySelector('[data-qty]');
  card.querySelector('[data-menos]')?.addEventListener('click', () => { qty = Math.max(1, qty - 1); qtyEl.textContent = qty; });
  card.querySelector('[data-mas]')?.addEventListener('click', () => { qty = Math.min(20, qty + 1); qtyEl.textContent = qty; });
  card.querySelector('[data-add]')?.addEventListener('click', () => agregar(p, modeloParaAgregar(p), qty));
  card.querySelector('[data-ver]')?.addEventListener('click', () => abrirModal(p.id));
  card.querySelector('.prod-media')?.addEventListener('click', e => {
    if (e.target.closest('[data-ver]')) return;
    abrirModal(p.id);
  });
}

/* ============ RAIL DE DESTACADOS ============ */
function initRail() {
  const track = document.getElementById('railTrack');
  const vp = document.getElementById('railVp');
  if (!track || !vp) return;
  const destacados = PRODUCTOS.filter(p => p.destacado).slice(0, 8);
  track.innerHTML = destacados.map(p => cardHTML(p)).join('');
  track.querySelectorAll('.prod').forEach(conectarCard);

  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const paso = () => track.querySelector('.prod')?.getBoundingClientRect().width + 14 || 240;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: 'smooth' }));

  const sincFlechas = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', sincFlechas, { passive: true });
  window.addEventListener('resize', sincFlechas, { passive: true });
  sincFlechas();

  initRailDrag(vp);
  initRailWheel(vp);
}

function initRailDrag(vp) {
  let down = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    down = true; moved = false; startX = e.clientX; startScroll = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    vp.scrollLeft = startScroll - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      const matar = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', matar, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', matar, { capture: true }), 0);
    }
    vp.classList.remove('dragging');
    moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
}

function initRailWheel(vp) {
  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    const alFinal = e.deltaY > 0 && vp.scrollLeft >= max - 1;
    const alInicio = e.deltaY < 0 && vp.scrollLeft <= 1;
    if (alFinal || alInicio) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });
}

/* ============ CATALOGO ============ */
const PASO = 16;
const filtros = { q: '', cat: '', modelo: '', extra: new Set() };
let visibles = PASO;
let revealsListos = false;

function productosFiltrados() {
  const q = sinAcentos(filtros.q).trim();
  return PRODUCTOS.filter(p => {
    if (filtros.cat && p.cat !== filtros.cat) return false;
    if (filtros.modelo && !p.modelos.includes(filtros.modelo)) return false;
    if (filtros.extra.has('oferta') && !(p.descuento > 0)) return false;
    if (filtros.extra.has('nuevo') && !p.nuevo) return false;
    if (q) {
      const heno = sinAcentos([p.nombre, catNombre(p.cat), p.tags, p.desc, p.modelos.join(' ')].join(' '));
      if (!q.split(/\s+/).every(t => heno.includes(t))) return false;
    }
    return true;
  });
}

let cardsRender = [];

function renderCatalogoBase() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  grid.innerHTML = PRODUCTOS.map(p => cardHTML(p)).join('');
  cardsRender = Array.from(grid.querySelectorAll('.prod'));
  cardsRender.forEach(conectarCard);
}

function aplicarFiltros(conFlip = true) {
  const grid = document.getElementById('catalogoGrid');
  const vacio = document.getElementById('vacio');
  const res = document.getElementById('resultados');
  const verMas = document.getElementById('verMas');
  if (!grid || !cardsRender.length) return;

  const lista = productosFiltrados();
  const mostrar = new Set(lista.slice(0, visibles).map(p => p.id));
  const usarFlip = conFlip && !reduceMotion && typeof window.Flip !== 'undefined';
  const estado = usarFlip ? window.Flip.getState(cardsRender) : null;

  lista.forEach(p => {
    const card = cardsRender.find(c => c.dataset.id === p.id);
    if (card) grid.appendChild(card);
  });
  cardsRender.forEach(c => { c.hidden = !mostrar.has(c.dataset.id); });

  if (estado) {
    window.Flip.from(estado, {
      duration: .6, ease: 'power2.inOut', absolute: true, stagger: .012,
      onEnter: els => gsap.fromTo(els, { opacity: 0, scale: .88 }, { opacity: 1, scale: 1, duration: .45, ease: 'power2.out' }),
      onLeave: els => gsap.to(els, { opacity: 0, scale: .88, duration: .3, ease: 'power2.in' })
    });
  } else {
    revelarNuevos(grid);
  }

  if (vacio) vacio.hidden = lista.length !== 0;
  if (res) {
    const partes = [];
    if (filtros.cat) partes.push(catNombre(filtros.cat));
    if (filtros.modelo) partes.push(`compatibles con ${filtros.modelo}`);
    if (filtros.q) partes.push(`“${filtros.q}”`);
    res.textContent = `${lista.length} ${lista.length === 1 ? 'producto' : 'productos'}${partes.length ? ' · ' + partes.join(' · ') : ''}`;
  }
  if (verMas) verMas.hidden = lista.length <= visibles;
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function revelarNuevos(cont) {
  if (!revealsListos) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    if (el.hidden) return;
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function sincronizarChips() {
  document.querySelectorAll('#chipsCat .chip').forEach(c => {
    const on = c.dataset.cat === filtros.cat;
    c.classList.toggle('is-on', on);
    c.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  document.querySelectorAll('#chipsExtra .chip').forEach(c => {
    const on = filtros.extra.has(c.dataset.extra);
    c.classList.toggle('is-on', on);
    c.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  document.querySelectorAll('#filtroModelos .chip-modelo').forEach(c => {
    const on = c.dataset.modelo === filtros.modelo;
    c.classList.toggle('is-on', on);
    c.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

function initCatalogo() {
  const chipsCat = document.getElementById('chipsCat');
  if (chipsCat) {
    chipsCat.innerHTML = `<button type="button" class="chip is-on" data-cat="" aria-pressed="true">Todo</button>` +
      CATEGORIAS.map(c => `<button type="button" class="chip" data-cat="${c.id}" aria-pressed="false">${esc(c.nombre)}</button>`).join('');
    chipsCat.addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      filtros.cat = b.dataset.cat; visibles = PASO; sincronizarChips(); aplicarFiltros();
    });
  }
  const fm = document.getElementById('filtroModelos');
  if (fm) {
    fm.innerHTML = MODELOS.map(m => `<button type="button" class="chip-modelo" data-modelo="${m}" aria-pressed="false">${m.replace('iPhone ', '')}</button>`).join('');
    fm.addEventListener('click', e => {
      const b = e.target.closest('.chip-modelo'); if (!b) return;
      filtros.modelo = filtros.modelo === b.dataset.modelo ? '' : b.dataset.modelo;
      setModeloGlobal(filtros.modelo, false);
      visibles = PASO; sincronizarChips(); aplicarFiltros();
    });
  }
  document.getElementById('chipsExtra')?.addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    const k = b.dataset.extra;
    if (filtros.extra.has(k)) filtros.extra.delete(k); else filtros.extra.add(k);
    visibles = PASO; sincronizarChips(); aplicarFiltros();
  });

  const buscar = document.getElementById('buscar');
  let t;
  buscar?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { filtros.q = buscar.value; visibles = PASO; aplicarFiltros(); }, 180);
  });
  document.getElementById('buscarToggle')?.addEventListener('click', () => {
    document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(() => buscar?.focus(), reduceMotion ? 0 : 600);
  });

  const toggle = document.getElementById('filtrosToggle');
  const panel = document.getElementById('filtrosPanel');
  toggle?.addEventListener('click', () => {
    const abierto = panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });

  const limpiar = () => {
    filtros.q = ''; filtros.cat = ''; filtros.modelo = ''; filtros.extra.clear();
    if (buscar) buscar.value = '';
    setModeloGlobal('', false);
    visibles = PASO; sincronizarChips(); aplicarFiltros();
  };
  document.getElementById('limpiarFiltros')?.addEventListener('click', limpiar);
  document.getElementById('vacioLimpiar')?.addEventListener('click', limpiar);

  document.getElementById('verMas')?.addEventListener('click', () => {
    visibles += PASO;
    aplicarFiltros();
  });

  if (modeloGlobal) filtros.modelo = modeloGlobal;
  renderCatalogoBase();
  sincronizarChips();
  aplicarFiltros(false);
}

/* ============ MODELO GLOBAL ============ */
function pintarChipsModelo(cont, activo) {
  cont.innerHTML = MODELOS.map(m => `<button type="button" class="chip-modelo${m === activo ? ' is-on' : ''}" data-modelo="${m}" aria-pressed="${m === activo}">${m.replace('iPhone ', '')}</button>`).join('');
}

function setModeloGlobal(m, refiltrar = true) {
  modeloGlobal = m;
  try { m ? localStorage.setItem(MODELO_KEY, m) : localStorage.removeItem(MODELO_KEY); } catch { /* sin storage seguimos igual */ }
  document.querySelectorAll('#heroModelos .chip-modelo, #probModelos .chip-modelo').forEach(c => {
    const on = c.dataset.modelo === m;
    c.classList.toggle('is-on', on);
    c.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  if (refiltrar) {
    filtros.modelo = m;
    visibles = PASO;
    sincronizarChips();
    aplicarFiltros();
  }
}

function initModeloGlobal() {
  const hero = document.getElementById('heroModelos');
  if (!hero) return;
  pintarChipsModelo(hero, modeloGlobal);
  hero.addEventListener('click', e => {
    const b = e.target.closest('.chip-modelo'); if (!b) return;
    const m = b.dataset.modelo === modeloGlobal ? '' : b.dataset.modelo;
    setModeloGlobal(m);
    if (m) showToast(`Listo: te mostramos lo que entra en tu ${m}`);
  });
}

/* ============ PROBADOR ============ */
function initProbador() {
  const tel = document.getElementById('probTel');
  const funda = document.getElementById('probFunda');
  const pie = document.getElementById('probPie');
  const contModelos = document.getElementById('probModelos');
  const contDisenos = document.getElementById('probDisenos');
  const resumen = document.getElementById('probResumen');
  const add = document.getElementById('probAdd');
  if (!tel || !funda || !contDisenos) return;

  const disenos = PRODUCTOS.filter(p => !p.img && p.patron !== 'transparente');
  let sel = disenos.find(d => d.id === 'lunares-rosa') || disenos[0];
  let modelo = modeloGlobal && sel.modelos.includes(modeloGlobal) ? modeloGlobal : 'iPhone 14';

  contDisenos.innerHTML = disenos.map(d => `
    <button type="button" class="prob-diseno" data-id="${d.id}" aria-label="Probar ${esc(d.nombre)}" aria-pressed="false">
      <span class="funda" data-patron="${d.patron}" style="--base:${d.base};--motivo:${d.motivo}"></span>
    </button>`).join('');
  pintarChipsModelo(contModelos, modelo);

  function pintar(anim) {
    funda.dataset.patron = sel.patron;
    funda.style.setProperty('--base', sel.base);
    funda.style.setProperty('--motivo', sel.motivo);
    tel.dataset.modelo = modelo;
    pie.innerHTML = `${esc(sel.nombre.replace('Funda ', ''))} <span aria-hidden="true">·</span> ${esc(modelo)}`;
    const hay = sel.modelos.includes(modelo);
    resumen.innerHTML = hay
      ? `<b>${esc(sel.nombre)}</b> para <b>${esc(modelo)}</b> — ${formatearPrecio(precioFinal(sel))}`
      : `<b>${esc(sel.nombre)}</b> todavía no la tengo para <b>${esc(modelo)}</b>. Escribime y la consigo.`;
    if (add) {
      add.disabled = !hay;
      add.textContent = hay ? 'Agregar al carrito' : 'No disponible para ese modelo';
    }
    contDisenos.querySelectorAll('.prob-diseno').forEach(b => {
      const on = b.dataset.id === sel.id;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    contModelos.querySelectorAll('.chip-modelo').forEach(b => {
      const on = b.dataset.modelo === modelo;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (anim && !reduceMotion && typeof gsap !== 'undefined') {
      gsap.fromTo(funda, { scale: .93, opacity: .4 }, { scale: 1, opacity: 1, duration: .55, ease: 'back.out(1.7)' });
    }
  }

  contDisenos.addEventListener('click', e => {
    const b = e.target.closest('.prob-diseno'); if (!b) return;
    sel = getProducto(b.dataset.id) || sel;
    pintar(true);
  });
  contModelos.addEventListener('click', e => {
    const b = e.target.closest('.chip-modelo'); if (!b) return;
    modelo = b.dataset.modelo;
    setModeloGlobal(modelo);
    pintar(true);
  });
  add?.addEventListener('click', () => agregar(sel, modelo, 1, true));

  pintar(false);
}

/* ============ MODAL ============ */
let ultimoFoco = null;

function abrirModal(id) {
  const p = getProducto(id);
  const modal = document.getElementById('modal');
  const bd = document.getElementById('modalBackdrop');
  const inner = document.getElementById('modalInner');
  if (!p || !modal || !inner) return;
  ultimoFoco = document.activeElement;

  const fin = precioFinal(p);
  const modeloIni = modeloParaAgregar(p);
  const otros = PRODUCTOS.filter(o => o.cat === p.cat && o.id !== p.id).slice(0, 3);

  inner.innerHTML = `
    <div class="modal-media">
      <div class="modal-tile">${fundaHTML(p)}</div>
      ${p.fotoReal ? `<figure class="modal-real"><img src="${p.fotoReal}" alt="Foto real de ${esc(p.nombre)}" width="1200" height="1600" decoding="async"></figure><span class="modal-real-tag">Foto real del stock</span>` : ''}
    </div>
    <div class="modal-txt">
      <span class="modal-cat">${esc(catNombre(p.cat))}</span>
      <h2 class="modal-nombre">${esc(p.nombre)}</h2>
      <p class="modal-precio"><b>${formatearPrecio(fin)}</b>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s><span class="badge badge-off">-${p.descuento}%</span>` : ''}</p>
      <p class="modal-desc">${esc(p.desc)}</p>
      <div class="modal-campo">
        <span class="filtro-label">${p.cat === 'accesorios' ? 'Compatible con' : 'Elegí tu modelo'}</span>
        <div class="chips-modelo" id="modalModelos" role="group" aria-label="Modelo de iPhone"></div>
      </div>
      <div class="modal-campo">
        <span class="filtro-label">Cantidad</span>
        <div class="stepper" style="width:fit-content">
          <button type="button" id="modalMenos" aria-label="Restar uno">−</button>
          <span id="modalQty">1</span>
          <button type="button" id="modalMas" aria-label="Sumar uno">+</button>
        </div>
      </div>
      <div class="modal-acciones">
        <button type="button" class="btn btn-primary" id="modalAdd">Agregar al carrito</button>
        <button type="button" class="btn btn-quiet" id="modalComprar">Comprar ahora</button>
      </div>
    </div>
    ${otros.length ? `<div class="modal-otros">
      <p class="modal-otros-titulo">También te puede interesar</p>
      <div class="modal-otros-grid">
        ${otros.map(o => `<button type="button" class="otro" data-otro="${o.id}"><span class="otro-tile">${fundaHTML(o)}</span><span>${esc(o.nombre)}</span></button>`).join('')}
      </div>
    </div>` : ''}`;

  const cm = inner.querySelector('#modalModelos');
  let modeloSel = modeloIni;
  cm.innerHTML = p.modelos.map(m => `<button type="button" class="chip-modelo${m === modeloSel ? ' is-on' : ''}" data-modelo="${m}" aria-pressed="${m === modeloSel}">${m.replace('iPhone ', '')}</button>`).join('');
  cm.addEventListener('click', e => {
    const b = e.target.closest('.chip-modelo'); if (!b) return;
    modeloSel = b.dataset.modelo;
    cm.querySelectorAll('.chip-modelo').forEach(c => {
      const on = c.dataset.modelo === modeloSel;
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  });

  let q = 1;
  const qEl = inner.querySelector('#modalQty');
  inner.querySelector('#modalMenos').addEventListener('click', () => { q = Math.max(1, q - 1); qEl.textContent = q; });
  inner.querySelector('#modalMas').addEventListener('click', () => { q = Math.min(20, q + 1); qEl.textContent = q; });
  inner.querySelector('#modalAdd').addEventListener('click', () => agregar(p, modeloSel, q));
  inner.querySelector('#modalComprar').addEventListener('click', () => { cerrarModal(); agregar(p, modeloSel, q, true); });
  inner.querySelectorAll('[data-otro]').forEach(b => b.addEventListener('click', () => { cerrarModal(); abrirModal(b.dataset.otro); }));

  modal.setAttribute('aria-label', p.nombre);
  modal.hidden = false; bd.hidden = false;
  requestAnimationFrame(() => { modal.classList.add('open'); bd.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('modalClose')?.focus();
}

function cerrarModal() {
  const modal = document.getElementById('modal');
  const bd = document.getElementById('modalBackdrop');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open'); bd.classList.remove('open');
  setTimeout(() => { modal.hidden = true; bd.hidden = true; }, 300);
  if (!document.getElementById('drawer')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  ultimoFoco?.focus?.();
}

/* ============ DRAWER ============ */
function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const pie = document.getElementById('drawerPie');
  if (!body || !pie) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `
      <div class="cart-vacio">
        <span class="cart-vacio-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg></span>
        <p>Todavía no elegiste nada. Empezá por los diseños que más se llevan.</p>
        <button type="button" class="btn btn-quiet btn-sm" id="drawerSeguir">Ver los más elegidos</button>
      </div>`;
    pie.innerHTML = '';
    body.querySelector('#drawerSeguir')?.addEventListener('click', () => {
      cerrarDrawer();
      document.getElementById('elegidos')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<div class="cart-linea" data-id="${p.id}" data-modelo="${esc(i.modelo)}">
      <span class="cart-linea-media">${fundaHTML(p)}</span>
      <div>
        <p class="cart-linea-nombre">${esc(p.nombre)}</p>
        <p class="cart-linea-meta">${esc(i.modelo)}</p>
        <p class="cart-linea-precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
        <button type="button" class="cart-linea-quitar" data-quitar>Quitar</button>
      </div>
      <div class="stepper">
        <button type="button" data-menos aria-label="Restar uno">−</button>
        <span>${i.qty}</span>
        <button type="button" data-mas aria-label="Sumar uno">+</button>
      </div>
    </div>`;
  }).join('');
  body.querySelectorAll('.cart-linea').forEach(l => {
    const id = l.dataset.id, mod = l.dataset.modelo;
    const actual = Cart.get().find(i => i.id === id && i.modelo === mod)?.qty || 1;
    l.querySelector('[data-menos]').addEventListener('click', () => Cart.setQty(id, mod, actual - 1));
    l.querySelector('[data-mas]').addEventListener('click', () => Cart.setQty(id, mod, actual + 1));
    l.querySelector('[data-quitar]').addEventListener('click', () => Cart.remove(id, mod));
  });
  pie.innerHTML = `
    <div class="cart-total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></div>
    <button type="button" class="btn btn-primary btn-block" id="finalizar">Finalizar compra</button>`;
  pie.querySelector('#finalizar').addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
}

function abrirDrawer() {
  const d = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!d) return;
  ultimoFoco = document.activeElement;
  renderDrawer();
  d.hidden = false; bd.hidden = false;
  requestAnimationFrame(() => { d.classList.add('open'); bd.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('drawerClose')?.focus();
}

function cerrarDrawer() {
  const d = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!d || d.hidden) return;
  d.classList.remove('open'); bd.classList.remove('open');
  setTimeout(() => { d.hidden = true; bd.hidden = true; }, 400);
  if (document.getElementById('modal')?.hidden !== false) document.body.classList.remove('no-scroll');
  ultimoFoco?.focus?.();
}

function initOverlays() {
  document.getElementById('cartHeader')?.addEventListener('click', abrirDrawer);
  document.getElementById('cart-float')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarDrawer);
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  document.getElementById('modalBackdrop')?.addEventListener('click', cerrarModal);
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (document.getElementById('modal')?.hidden === false) cerrarModal();
    else if (document.getElementById('drawer')?.hidden === false) cerrarDrawer();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const abierto = document.getElementById('modal')?.hidden === false ? document.getElementById('modal')
      : document.getElementById('drawer')?.hidden === false ? document.getElementById('drawer') : null;
    if (!abierto) return;
    const foco = abierto.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])');
    if (!foco.length) return;
    const primero = foco[0], ultimo = foco[foco.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
  document.addEventListener('cart:updated', () => {
    if (document.getElementById('drawer')?.hidden === false) renderDrawer();
  });
}

/* ============ FLOTANTES ============ */
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

/* ============ MOVIMIENTO ============ */
function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const sello = document.querySelector('.hero-sello');
  const etiq = document.querySelector('.hero-etiqueta');
  const tl = gsap.timeline({ delay: .25 });
  if (sello) tl.from(sello, { scale: .8, opacity: 0, rotate: -12, duration: .9, ease: 'back.out(1.6)' }, 0);
  if (etiq) tl.from(etiq, { y: -14, opacity: 0, duration: .7, ease: 'power3.out' }, .3);
  if (typeof ScrollTrigger !== 'undefined') {
    const img = document.querySelector('.hero-tile img');
    if (img) {
      gsap.fromTo(img, { scale: 1.09 }, { scale: 1, duration: 1.5, ease: 'power2.out' });
      gsap.to(img, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 } });
    }
    const fig = document.querySelector('.nosotros-fig img');
    if (fig) gsap.fromTo(fig, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.nosotros-fig', start: 'top bottom', end: 'bottom top', scrub: .6 } });
  }
}

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
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
  window.addEventListener('resize', syncInert, { passive: true });
  syncInert();
}

function initAnio() {
  const el = document.getElementById('anio');
  if (el) el.textContent = new Date().getFullYear();
}

initCategorias();
initRail();
initModeloGlobal();
initProbador();
initCatalogo();
initReveals();
initOverlays();
initNav();
initFloats();
initHero();
initAnio();
updateCartBadge();
