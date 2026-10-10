const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const WSP = '5493541391392';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

const TALLES = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
const TALLE_CM = { 35: 22.5, 36: 23.2, 37: 23.9, 38: 24.5, 39: 25.2, 40: 25.9, 41: 26.5, 42: 27.2, 43: 27.9, 44: 28.5, 45: 29.2 };
const rango = (a, b, sin = []) => TALLES.filter(t => t >= a && t <= b && !sin.includes(t));

const CATEGORIAS = [
  { id: 'urbanas', nombre: 'Urbanas', sub: 'De lunes a lunes', img: 'images/p-skate-negra.webp', alt: 'Zapatillas urbanas negras de gamuza con franja blanca' },
  { id: 'cana-alta', nombre: 'Caña alta', sub: 'Arriba del tobillo', img: 'images/p-alta-negra.webp', alt: 'Zapatillas de caña alta de lona negra sobre una mesa de madera' },
  { id: 'running', nombre: 'Running', sub: 'Para sumar kilómetros', img: 'images/p-runner-gris.webp', alt: 'Zapatillas running gris melange con suela blanca al aire libre' },
  { id: 'botines', nombre: 'Botines', sub: 'Para la cancha y para la calle', img: 'images/p-botin-turquesa.webp', alt: 'Suelas turquesa con tapones de un par de botines de fútbol', subs: [{ id: 'futbol', nombre: 'De fútbol' }, { id: 'calle', nombre: 'Para la calle' }] },
];

const COLORES = {
  negro: { nombre: 'Negro', hex: '#1d2229' },
  blanco: { nombre: 'Blanco', hex: '#f3f3f0' },
  gris: { nombre: 'Gris', hex: '#9aa3ad' },
  azul: { nombre: 'Azul', hex: '#2d4f84' },
  marron: { nombre: 'Marrón', hex: '#8a5a36' },
  rojo: { nombre: 'Rojo', hex: '#a8423f' },
  naranja: { nombre: 'Naranja', hex: '#c97a35' },
  turquesa: { nombre: 'Turquesa', hex: '#57b3a8' },
  amarillo: { nombre: 'Amarillo', hex: '#d6b84a' },
  rosa: { nombre: 'Rosa', hex: '#dfb7bd' },
};

const PRECIOS = [
  { id: 'hasta120', nombre: 'Hasta $120.000', min: 0, max: 120000 },
  { id: '120a160', nombre: '$120.000 a $160.000', min: 120001, max: 160000 },
  { id: 'mas160', nombre: 'Más de $160.000', min: 160001, max: Infinity },
];

const PRODUCTOS = [
  { id: 'pc-001', slug: 'low-clasica-blanca', nombre: 'Low clásica blanca', cat: 'urbanas', color: 'blanco', colorNombre: 'Blanco total', precio: 159900, descuento: 0, talles: rango(36, 44), img: 'images/p-low-blanca.webp', alt: 'Zapatillas bajas de cuero blanco sobre una vereda de cemento', desc: 'Cuero liso blanco, suela de goma cosida y plantilla acolchada. La que combina con todo, de lunes a lunes.', tags: ['zapatilla', 'cuero', 'clasica'] },
  { id: 'pc-012', slug: 'runner-negra-tres-tiras', nombre: 'Runner negra tres tiras', cat: 'running', color: 'negro', colorNombre: 'Negro y blanco', precio: 169900, descuento: 0, nuevo: true, talles: rango(38, 45), img: 'images/p-runner-negra.webp', alt: 'Zapatilla running negra de malla con tres tiras blancas', desc: 'Capellada de malla que respira, tres tiras laterales y entresuela blanca con buena amortiguación para caminar o trotar.', tags: ['zapatilla', 'correr', 'malla', 'deportiva'] },
  { id: 'pc-009', slug: 'cana-alta-lona-negra', nombre: 'Caña alta lona negra', cat: 'cana-alta', color: 'negro', colorNombre: 'Negro y crudo', precio: 114900, descuento: 0, talles: rango(35, 45), img: 'images/p-alta-negra.webp', alt: 'Zapatillas de caña alta de lona negra con suela y puntera crudas', desc: 'Lona resistente, ojales metálicos y suela de goma vulcanizada con puntera reforzada. Un clásico que no falla.', tags: ['zapatilla', 'lona', 'botita', 'clasica'] },
  { id: 'pc-017', slug: 'botin-campo-amarillo', nombre: 'Botín de campo amarillo', cat: 'botines', sub: 'futbol', color: 'amarillo', colorNombre: 'Amarillo y blanco', precio: 149900, descuento: 0, nuevo: true, talles: rango(37, 44), img: 'images/p-botin-amarillo.webp', alt: 'Botines de fútbol amarillos y blancos con cordones negros sobre el pasto', desc: 'Tapones para césped natural y capellada sintética con textura para el control de la pelota.', tags: ['futbol', 'cancha', 'tapones', 'cesped'] },
  { id: 'pc-002', slug: 'skate-negra-franja-blanca', nombre: 'Skate negra franja blanca', cat: 'urbanas', color: 'negro', colorNombre: 'Negro y blanco', precio: 119900, descuento: 0, talles: rango(36, 44, [41]), img: 'images/p-skate-negra.webp', alt: 'Zapatillas de skate negras de gamuza con franja lateral blanca', desc: 'Gamuza y lona, suela plana con dibujo waffle y puntera reforzada. Para andar en tabla o para todos los días.', tags: ['zapatilla', 'skate', 'gamuza', 'lona'] },
  { id: 'pc-013', slug: 'runner-tejida-gris', nombre: 'Runner tejida gris', cat: 'running', color: 'gris', colorNombre: 'Gris y negro', precio: 184900, descuento: 0, nuevo: true, talles: rango(39, 44), img: 'images/p-runner-tejida.webp', alt: 'Zapatilla running tejida gris con detalles negros sobre madera', desc: 'Tejido elástico que se adapta al pie, suela de espuma liviana y talón con refuerzo.', tags: ['zapatilla', 'correr', 'tejida', 'deportiva'] },
  { id: 'pc-010', slug: 'cana-alta-naranja-azul', nombre: 'Caña alta naranja y azul', cat: 'cana-alta', color: 'naranja', colorNombre: 'Naranja, azul y blanco', precio: 199900, descuento: 0, nuevo: true, talles: rango(40, 43), img: 'images/p-alta-naranja.webp', alt: 'Zapatilla de caña alta de cuero naranja, azul marino y blanco', desc: 'Cuero en tres colores, caña acolchada y suela de goma. De las que se miran.', tags: ['zapatilla', 'cuero', 'basquet', 'botita'] },
  { id: 'pc-020', slug: 'botineta-gamuza-plataforma', nombre: 'Botineta gamuza con plataforma', cat: 'botines', sub: 'calle', color: 'marron', colorNombre: 'Taupe', precio: 164900, descuento: 0, nuevo: true, talles: rango(35, 40), img: 'images/p-botineta-gamuza.webp', alt: 'Botinetas de gamuza color taupe con taco ancho y plataforma', desc: 'Gamuza suave, cordones encerados, taco ancho y suela dentada que agarra bien en la calle.', tags: ['botineta', 'borcego', 'gamuza', 'taco', 'bota'] },
  { id: 'pc-004', slug: 'low-roja-blanca', nombre: 'Low roja y blanca', cat: 'urbanas', color: 'rojo', colorNombre: 'Rojo, blanco y negro', precio: 179900, descuento: 0, nuevo: true, talles: rango(38, 43), img: 'images/p-low-roja.webp', alt: 'Zapatilla baja de cuero roja, blanca y negra apoyada contra una pared', desc: 'Cuero en tres colores, cordones negros y suela de goma con dibujo de pivote.', tags: ['zapatilla', 'cuero', 'basquet'] },
  { id: 'pc-014', slug: 'runner-gris-perla', nombre: 'Runner gris perla', cat: 'running', color: 'blanco', colorNombre: 'Gris perla', precio: 159900, descuento: 0, talles: rango(36, 42), img: 'images/p-runner-perla.webp', alt: 'Zapatillas running gris perla de malla sobre fondo claro', desc: 'Malla liviana gris perla con suela blanca de espuma. Cómoda para todo el día.', tags: ['zapatilla', 'correr', 'malla', 'deportiva'] },
  { id: 'pc-011', slug: 'cana-alta-lona-azul', nombre: 'Caña alta lona azul', cat: 'cana-alta', color: 'azul', colorNombre: 'Azul marino', precio: 109900, descuento: 0, talles: rango(36, 44), img: 'images/p-alta-azul.webp', alt: 'Zapatillas de caña alta de lona azul marino sobre un banco de madera', desc: 'Lona azul marino, cordones crudos y suela vulcanizada. Para usar con todo.', tags: ['zapatilla', 'lona', 'botita'] },
  { id: 'pc-018', slug: 'botin-turquesa-tapones', nombre: 'Botín turquesa tapones', cat: 'botines', sub: 'futbol', color: 'turquesa', colorNombre: 'Turquesa', precio: 129900, descuento: 0, talles: rango(36, 43), img: 'images/p-botin-turquesa.webp', alt: 'Suelas turquesa con tapones de un par de botines de fútbol', desc: 'Suela con tapones para césped natural y capellada liviana que se ajusta al pie.', tags: ['futbol', 'cancha', 'tapones', 'cesped'] },
  { id: 'pc-006', slug: 'low-azul-francia', nombre: 'Low azul francia', cat: 'urbanas', color: 'azul', colorNombre: 'Azul y blanco', precio: 164900, descuento: 0, nuevo: true, talles: rango(39, 44), img: 'images/p-low-azul.webp', alt: 'Zapatillas bajas azul francia con detalles blancos sobre un muro de cemento', desc: 'Cuero azul francia con detalles blancos y suela de goma color miel.', tags: ['zapatilla', 'cuero', 'clasica'] },
  { id: 'pc-015', slug: 'runner-malla-gris', nombre: 'Runner malla gris', cat: 'running', color: 'gris', colorNombre: 'Gris y blanco', precio: 139900, descuento: 15, talles: rango(37, 44), img: 'images/p-runner-malla.webp', alt: 'Zapatillas running de malla gris con cordones grises sobre fondo blanco', desc: 'Malla gris con cordones a tono y suela blanca flexible. Liviana para entrenar.', tags: ['zapatilla', 'correr', 'malla', 'deportiva', 'gimnasio'] },
  { id: 'pc-003', slug: 'plataforma-blanca-rosa', nombre: 'Plataforma blanca y rosa', cat: 'urbanas', color: 'rosa', colorNombre: 'Blanco y rosa viejo', precio: 169900, descuento: 0, nuevo: true, talles: rango(35, 40), img: 'images/p-plataforma-rosa.webp', alt: 'Zapatillas blancas con paneles rosa viejo y suela alta en una escalera', desc: 'Suela alta, paneles rosa viejo y cordones blancos planos. Suma altura sin perder comodidad.', tags: ['zapatilla', 'plataforma', 'cuero'] },
  { id: 'pc-019', slug: 'botin-negro-sintetico', nombre: 'Botín negro para sintético', cat: 'botines', sub: 'futbol', color: 'negro', colorNombre: 'Negro y blanco', precio: 119900, descuento: 0, talles: rango(38, 45), img: 'images/p-botin-negro.webp', alt: 'Botín de fútbol negro sobre una cancha de césped sintético', desc: 'Multitapón para cancha de sintético o papi fútbol, con capellada de cuero sintético.', tags: ['futbol', 'cancha', 'sintetico', 'papi', 'multitapon', 'futbol 5'] },
  { id: 'pc-007', slug: 'gamuza-caramelo', nombre: 'Gamuza caramelo', cat: 'urbanas', color: 'marron', colorNombre: 'Caramelo y crema', precio: 189900, descuento: 10, talles: rango(37, 42), img: 'images/p-gamuza-caramelo.webp', alt: 'Zapatillas bajas de gamuza caramelo con detalles crema sobre fondo claro', desc: 'Gamuza caramelo con paneles crema y suela de goma. Cálida para el invierno.', tags: ['zapatilla', 'gamuza'] },
  { id: 'pc-016', slug: 'runner-gris-suela-blanca', nombre: 'Runner gris suela blanca', cat: 'running', color: 'gris', colorNombre: 'Gris melange', precio: 149900, descuento: 0, talles: rango(38, 45), img: 'images/p-runner-gris.webp', alt: 'Zapatillas running gris melange con suela blanca ondulada al aire libre', desc: 'Tela gris melange, suela blanca ondulada y plantilla de espuma para caminar mucho.', tags: ['zapatilla', 'correr', 'deportiva', 'caminar'] },
  { id: 'pc-005', slug: 'lona-baja-negra', nombre: 'Lona baja negra', cat: 'urbanas', color: 'negro', colorNombre: 'Negro con ribete rojo', precio: 94900, descuento: 0, talles: rango(35, 44), img: 'images/p-lona-negra.webp', alt: 'Zapatilla baja de lona negra con suela blanca y ribete rojo sobre una caja', desc: 'Lona negra, puntera de goma y ribete rojo en la suela. Liviana y fácil de combinar.', tags: ['zapatilla', 'lona', 'clasica'] },
  { id: 'pc-021', slug: 'bota-corta-gamuza-negra', nombre: 'Bota corta gamuza negra', cat: 'botines', sub: 'calle', color: 'negro', colorNombre: 'Negro', precio: 154900, descuento: 0, talles: rango(36, 41), img: 'images/p-bota-negra.webp', alt: 'Botas cortas de gamuza negra con cordones y suela gruesa', desc: 'Gamuza negra, cordones y suela gruesa de goma. Para los días de frío y lluvia.', tags: ['bota', 'borcego', 'gamuza', 'botita'] },
  { id: 'pc-008', slug: 'lona-baja-gris', nombre: 'Lona baja gris', cat: 'urbanas', color: 'gris', colorNombre: 'Gris topo', precio: 99900, descuento: 0, talles: rango(35, 43), img: 'images/p-lona-gris.webp', alt: 'Zapatillas bajas de lona gris topo con suela blanca contra una pared gastada', desc: 'Lona gris topo, cordones blancos y suela vulcanizada. Básica de todos los días.', tags: ['zapatilla', 'lona', 'clasica'] },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const codigo = p => 'P&C·' + p.id.slice(3);
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const catDe = id => CATEGORIAS.find(c => c.id === id);
const subDe = (cat, id) => catDe(cat)?.subs?.find(s => s.id === id);
const fmtNum = n => String(n).replace('.', ',');
const MAX_PAR = 10;
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };
const cambiarURL = u => { try { window.history.replaceState(null, '', u); return true; } catch { return false; } };

PRODUCTOS.forEach((p, i) => {
  p.orden = i;
  p._h = norm([p.nombre, catDe(p.cat)?.nombre, subDe(p.cat, p.sub)?.nombre, p.colorNombre, COLORES[p.color]?.nombre, p.desc, (p.tags || []).join(' '), codigo(p)].join(' '));
});

const Cart = {
  KEY: 'pcsneakers_cart',
  ultimo: '',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { guardar(this.KEY, items); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, talle, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.talle === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? MAX_PAR);
    else items.push({ id: producto.id, talle, qty: Math.min(qty, producto.stock ?? MAX_PAR) });
    this.ultimo = producto.id + '-' + talle;
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.talle === talle); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? MAX_PAR)); this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && i.talle === talle))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  limpiarInvalidos() {
    const items = this.get(); const ok = items.filter(i => getProducto(i.id)?.talles.includes(i.talle));
    if (ok.length !== items.length) this.save(ok);
  },
};

const Favs = {
  KEY: 'pcsneakers_wishlist',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const l = this.get(); const i = l.indexOf(id);
    if (i >= 0) l.splice(i, 1); else l.push(id);
    guardar(this.KEY, l);
    return i < 0;
  },
};

const estado = { q: '', cat: '', sub: '', talle: 0, colores: new Set(), precio: '', orden: 'destacados', favs: false, visibles: 16 };

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

const ICONO_CORAZON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>';
const ICONO_FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const ICONO_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
const ICONO_TACHO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';
const ICONO_WSP = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';

function precioHTML(p) {
  const f = precioFinal(p);
  if (p.descuento > 0) return `<p class="precio"><span class="precio__final">${formatearPrecio(f)}</span><s>${formatearPrecio(p.precio)}</s><span class="precio__off">-${p.descuento}%</span></p>`;
  return `<p class="precio"><span class="precio__final">${formatearPrecio(f)}</span></p>`;
}

function cardHTML(p, variante = 'grid') {
  const rail = variante === 'rail';
  const anim = rail ? 'data-animate="der" style="opacity:0;transform:translateX(64px)"' : 'data-animate="subir" style="opacity:0;transform:translateY(48px)"';
  const sel = estado.talle && p.talles.includes(estado.talle) ? estado.talle : 0;
  const badge = p.descuento > 0 ? `<span class="badge badge--off">-${p.descuento}%</span>` : p.nuevo ? '<span class="badge badge--nuevo">Nuevo</span>' : '';
  return `${rail ? '<div class="rail-item">' : ''}<article class="card" ${anim} data-id="${p.id}">
    <div class="card__media">
      <button class="card__foto" type="button" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}"><img src="${p.img}" alt="${esc(p.alt)}" width="1000" height="1000"></button>
      ${badge}
      <button class="card__fav" type="button" data-fav="${p.id}" aria-pressed="${Favs.has(p.id)}" aria-label="Guardar ${esc(p.nombre)} en favoritos"><span>${ICONO_CORAZON}</span></button>
    </div>
    <div class="card__etiqueta">
      <p class="card__meta"><span>${esc(codigo(p))}</span><span class="barcode" aria-hidden="true"></span></p>
      <h3 class="card__nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="card__color">${esc(p.colorNombre)} · ${p.talles.length} talles</p>
      ${precioHTML(p)}
      <div class="prod-actions">
        <select class="talle-sel" aria-label="Talle de ${esc(p.nombre)}"><option value="">Talle</option>${p.talles.map(t => `<option value="${t}"${t === sel ? ' selected' : ''}>${t}</option>`).join('')}</select>
        <button class="btn btn--cta prod-add" type="button" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito"><span class="l-largo">Agregar al carrito</span><span class="l-corto">Agregar</span></button>
      </div>
      <button class="prod-buy" type="button" data-buy="${p.id}">Comprar ahora ${ICONO_FLECHA}</button>
    </div>
  </article>${rail ? '</div>' : ''}`;
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

const refreshST = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function renderCats() {
  const g = document.getElementById('cats-grid');
  if (!g) return;
  g.innerHTML = CATEGORIAS.map(c => {
    const n = PRODUCTOS.filter(p => p.cat === c.id).length;
    return `<div class="cat-tile-wrap" data-animate="subir" style="opacity:0;transform:translateY(48px)">
      <button type="button" class="cat-tile" data-ir-cat="${c.id}" aria-label="Ver ${esc(c.nombre)}: ${n} modelos">
        <span class="cat-tile__foto"><img src="${c.img}" alt="${esc(c.alt)}" width="1000" height="1000"></span>
        <span class="cat-tile__count">${n} modelos</span>
        <span class="cat-tile__info"><span class="cat-tile__nombre">${esc(c.nombre)}</span><span class="cat-tile__sub">${esc(c.sub)}</span></span>
      </button>
    </div>`;
  }).join('');
}

function renderRail() {
  const track = document.getElementById('rail-track');
  if (!track) return;
  track.innerHTML = PRODUCTOS.filter(p => p.nuevo).slice(0, 8).map(p => cardHTML(p, 'rail')).join('');
}

function initRail() {
  const rail = document.querySelector('[data-rail]');
  if (!rail) return;
  const vp = rail.querySelector('.rail-vp');
  const track = rail.querySelector('.rail-track');
  const sec = rail.closest('section');
  const prev = sec?.querySelector('[data-rail-prev]');
  const next = sec?.querySelector('[data-rail-next]');
  if (!vp || !track) return;
  const paso = () => {
    const c = track.firstElementChild;
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 16;
    return ((c?.getBoundingClientRect().width) || 260) + gap;
  };
  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();

  let down = false, moved = false, startX = 0, startLeft = 0, pointerId = 0;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    if (e.target.closest('select')) return;
    down = true; moved = false; startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { moved = true; }
    }
    if (moved) { vp.scrollLeft = startLeft - dx; e.preventDefault(); }
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch { down = false; }
    if (moved) setTimeout(() => { vp.classList.remove('dragging'); }, 0);
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('click', e => {
    if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
  }, true);
}

function filtrar() {
  const terms = norm(estado.q).trim().split(/\s+/).filter(Boolean);
  const favs = estado.favs ? Favs.get() : null;
  const rangoP = PRECIOS.find(x => x.id === estado.precio);
  const lista = PRODUCTOS.filter(p => {
    if (estado.cat && p.cat !== estado.cat) return false;
    if (estado.sub && p.sub !== estado.sub) return false;
    if (estado.talle && !p.talles.includes(estado.talle)) return false;
    if (estado.colores.size && !estado.colores.has(p.color)) return false;
    if (rangoP) { const f = precioFinal(p); if (f < rangoP.min || f > rangoP.max) return false; }
    if (favs && !favs.includes(p.id)) return false;
    if (terms.length && !terms.every(t => p._h.includes(t))) return false;
    return true;
  });
  const o = estado.orden;
  if (o === 'menor') lista.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (o === 'mayor') lista.sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (o === 'nuevos') lista.sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0) || a.orden - b.orden);
  else lista.sort((a, b) => a.orden - b.orden);
  return lista;
}

function renderFiltros() {
  const box = document.getElementById('filtros-body');
  if (!box) return;
  const nCat = id => PRODUCTOS.filter(p => p.cat === id).length;
  const nSub = (c, s) => PRODUCTOS.filter(p => p.cat === c && p.sub === s).length;
  const coloresUsados = Object.keys(COLORES).filter(c => PRODUCTOS.some(p => p.color === c));
  box.innerHTML = `
    <div class="filtro-grupo">
      <p class="filtro-grupo__t">Línea</p>
      <div class="filtro-lista">
        <button type="button" class="filtro-opcion" data-f="cat" data-v="" aria-pressed="true">Todas <small>${PRODUCTOS.length}</small></button>
        ${CATEGORIAS.map(c => `<button type="button" class="filtro-opcion" data-f="cat" data-v="${c.id}" aria-pressed="false">${esc(c.nombre)} <small>${nCat(c.id)}</small></button>${c.subs ? `<div class="filtro-sub" data-sub-de="${c.id}" hidden>${c.subs.map(s => `<button type="button" class="filtro-opcion" data-f="sub" data-v="${s.id}" aria-pressed="false">${esc(s.nombre)} <small>${nSub(c.id, s.id)}</small></button>`).join('')}</div>` : ''}`).join('')}
      </div>
    </div>
    <div class="filtro-grupo">
      <p class="filtro-grupo__t">Talle</p>
      <div class="filtro-talles">${TALLES.map(t => `<button type="button" class="talle-btn" data-f="talle" data-v="${t}" aria-pressed="false" aria-label="Talle ${t}">${t}</button>`).join('')}</div>
    </div>
    <div class="filtro-grupo">
      <p class="filtro-grupo__t">Color</p>
      <div class="filtro-colores">${coloresUsados.map(c => `<button type="button" class="color-btn" data-f="color" data-v="${c}" aria-pressed="false" aria-label="${COLORES[c].nombre}" title="${COLORES[c].nombre}"><span style="--sw:${COLORES[c].hex}"></span></button>`).join('')}</div>
    </div>
    <div class="filtro-grupo">
      <p class="filtro-grupo__t">Precio</p>
      <div class="filtro-lista">${PRECIOS.map(r => `<button type="button" class="filtro-opcion" data-f="precio" data-v="${r.id}" aria-pressed="false">${esc(r.nombre)}</button>`).join('')}</div>
    </div>`;
}

function syncUI() {
  document.querySelectorAll('[data-f]').forEach(b => {
    const f = b.dataset.f, v = b.dataset.v;
    let on = false;
    if (f === 'cat') on = estado.cat === v;
    else if (f === 'sub') on = estado.sub === v;
    else if (f === 'talle') on = estado.talle === Number(v);
    else if (f === 'color') on = estado.colores.has(v);
    else if (f === 'precio') on = estado.precio === v;
    b.setAttribute('aria-pressed', String(on));
  });
  document.querySelectorAll('[data-sub-de]').forEach(s => { s.hidden = s.dataset.subDe !== estado.cat; });
  document.querySelectorAll('[data-ir-talle]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.irTalle) === estado.talle)));
  document.querySelectorAll('[data-q]').forEach(i => { if (i.value !== estado.q) i.value = estado.q; });
  const orden = document.getElementById('orden');
  if (orden) orden.value = estado.orden;
  const nFav = Favs.get().length;
  document.querySelectorAll('[data-favs]').forEach(b => b.setAttribute('aria-pressed', String(estado.favs)));
  document.querySelectorAll('[data-favs-n]').forEach(s => { s.textContent = nFav; });

  const chips = [];
  if (estado.q) chips.push(['q', '', `“${estado.q}”`]);
  if (estado.cat) chips.push(['cat', '', catDe(estado.cat)?.nombre]);
  if (estado.sub) chips.push(['sub', '', subDe(estado.cat, estado.sub)?.nombre]);
  if (estado.talle) chips.push(['talle', '', `Talle ${estado.talle}`]);
  estado.colores.forEach(c => chips.push(['color', c, COLORES[c]?.nombre]));
  if (estado.precio) chips.push(['precio', '', PRECIOS.find(r => r.id === estado.precio)?.nombre]);
  if (estado.favs) chips.push(['favs', '', 'Favoritos']);
  const box = document.getElementById('chips-activos');
  if (box) {
    box.hidden = !chips.length;
    box.innerHTML = chips.map(([k, v, t]) => `<button type="button" class="chip-activo" data-quitar="${k}" data-v="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)} ${ICONO_X}</button>`).join('');
  }
  const nFiltros = chips.filter(c => c[0] !== 'q').length;
  document.querySelectorAll('[data-filtros-n]').forEach(b => { b.textContent = nFiltros; b.hidden = !nFiltros; });
}

function renderCatalogo(append = false) {
  const grid = document.getElementById('catalogo-grid');
  if (!grid) return;
  const lista = filtrar();
  const total = lista.length;
  const etiqueta = total === 1 ? '1 modelo' : `${total} modelos`;
  const count = document.getElementById('catalogo-count');
  if (count) count.textContent = estado.talle ? `${etiqueta} en talle ${estado.talle}` : etiqueta;
  document.querySelectorAll('[data-count-n]').forEach(s => { s.textContent = total; });
  const vacio = document.getElementById('catalogo-vacio');
  const mas = document.getElementById('ver-mas');
  const info = document.getElementById('ver-mas-info');
  if (!total) {
    grid.innerHTML = '';
    if (vacio) vacio.hidden = false;
    if (mas) mas.hidden = true;
    const vw = document.getElementById('vacio-wsp');
    if (vw) vw.href = wspLink(estado.talle ? `Hola! Busco zapatillas en talle ${estado.talle} y no encontré en la web. ¿Tienen algo?` : 'Hola! Quería consultar si tienen un modelo en mi talle.');
    refreshST();
    return;
  }
  if (vacio) vacio.hidden = true;
  const hasta = Math.min(estado.visibles, total);
  if (append) {
    const ya = grid.children.length;
    grid.insertAdjacentHTML('beforeend', lista.slice(ya, hasta).map(p => cardHTML(p)).join(''));
  } else {
    grid.innerHTML = lista.slice(0, hasta).map(p => cardHTML(p)).join('');
  }
  if (mas) mas.hidden = total <= hasta;
  if (info) info.textContent = `Mostrando ${hasta} de ${total}`;
  revelarNuevos(grid);
  refreshST();
}

function aplicar() {
  estado.visibles = 16;
  syncUI();
  renderCatalogo();
}

function limpiar() {
  Object.assign(estado, { q: '', cat: '', sub: '', talle: 0, precio: '', favs: false });
  estado.colores.clear();
  aplicar();
}

function quitarFiltro(k, v) {
  if (k === 'q') estado.q = '';
  else if (k === 'cat') { estado.cat = ''; estado.sub = ''; }
  else if (k === 'sub') estado.sub = '';
  else if (k === 'talle') estado.talle = 0;
  else if (k === 'color') estado.colores.delete(v);
  else if (k === 'precio') estado.precio = '';
  else if (k === 'favs') estado.favs = false;
  aplicar();
}

function onFiltro(btn) {
  const f = btn.dataset.f, v = btn.dataset.v;
  if (f === 'cat') { estado.cat = estado.cat === v ? '' : v; estado.sub = ''; }
  else if (f === 'sub') estado.sub = estado.sub === v ? '' : v;
  else if (f === 'talle') { const t = Number(v); estado.talle = estado.talle === t ? 0 : t; }
  else if (f === 'color') { if (estado.colores.has(v)) estado.colores.delete(v); else estado.colores.add(v); }
  else if (f === 'precio') estado.precio = estado.precio === v ? '' : v;
  aplicar();
}

function irA(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}
const irATienda = () => irA('tienda');

const overlays = [];
function pushOverlay(o) { overlays.push(o); document.body.classList.add('no-scroll'); }
function popOverlay(o) {
  const i = overlays.indexOf(o);
  if (i >= 0) overlays.splice(i, 1);
  if (!overlays.length) document.body.classList.remove('no-scroll');
}
function trapFocus(panel, e) {
  const f = [...panel.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  else if (!panel.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
}
document.addEventListener('keydown', e => {
  const top = overlays[overlays.length - 1];
  if (!top) return;
  if (e.key === 'Escape') { e.preventDefault(); top.close(); }
  else if (e.key === 'Tab') trapFocus(top.panel, e);
});

const qv = { p: null, talle: 0, qty: 1, opener: null };
const qvOverlay = { panel: null, close: () => closeQuick() };

function renderQuick() {
  const p = qv.p;
  const foto = document.getElementById('qv-foto');
  const info = document.getElementById('qv-info');
  if (!p || !foto || !info) return;
  foto.innerHTML = `<img src="${p.img}" alt="${esc(p.alt)}" width="1000" height="1000">`;
  const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  info.innerHTML = `
    <p class="qv__codigo"><span>${esc(codigo(p))}</span><span class="barcode" aria-hidden="true"></span><span>${esc(catDe(p.cat)?.nombre)}${p.sub ? ' · ' + esc(subDe(p.cat, p.sub)?.nombre) : ''}</span></p>
    <h2 class="qv__nombre">${esc(p.nombre)}</h2>
    <p class="qv__color">${esc(p.colorNombre)}</p>
    ${precioHTML(p)}
    <div>
      <p class="qv__talles-t"><span>Elegí tu talle</span><a href="#talles" data-qv-guia>¿Cuál es mi talle?</a></p>
      <div class="qv__talles" role="group" aria-label="Talles disponibles">${TALLES.map(t => {
        const ok = p.talles.includes(t);
        return `<button type="button" class="talle-btn" data-qv-talle="${t}" aria-pressed="${t === qv.talle}"${ok ? '' : ' disabled'} aria-label="Talle ${t}${ok ? '' : ', sin stock'}">${t}</button>`;
      }).join('')}</div>
    </div>
    <div class="qv__compra">
      <div class="stepper"><button type="button" data-qv-qty="-1" aria-label="Restar un par">−</button><output id="qv-qty">${qv.qty}</output><button type="button" data-qv-qty="1" aria-label="Sumar un par">+</button></div>
      <button class="btn btn--cta" type="button" data-qv-add>Agregar al carrito</button>
      <button class="btn btn--linea" type="button" data-qv-buy>Comprar ahora</button>
    </div>
    <p class="qv__desc">${esc(p.desc)}</p>
    <a class="qv__wsp" id="qv-wsp" href="${wspQuick()}" target="_blank" rel="noopener">${ICONO_WSP} Consultar este modelo por WhatsApp</a>
    ${rel.length ? `<div class="qv__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" data-quick="${r.id}"><span class="mini"><img src="${r.img}" alt="" width="1000" height="1000"></span>${esc(r.nombre)}<span class="mono">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>` : ''}`;
}

function wspQuick() {
  const p = qv.p;
  return wspLink(`Hola! Quería consultar por la ${p.nombre} (${codigo(p)})${qv.talle ? ' en talle ' + qv.talle : ''}.`);
}

function syncQuick() {
  document.querySelectorAll('[data-qv-talle]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.qvTalle) === qv.talle)));
  const out = document.getElementById('qv-qty');
  if (out) out.textContent = qv.qty;
  const w = document.getElementById('qv-wsp');
  if (w && qv.p) w.href = wspQuick();
}

function openQuick(id, opener, talle = 0) {
  const p = getProducto(id);
  const el = document.getElementById('qv');
  if (!p || !el) return;
  const primera = el.hidden;
  qv.p = p;
  qv.qty = 1;
  qv.talle = (talle && p.talles.includes(talle)) ? talle : (estado.talle && p.talles.includes(estado.talle) ? estado.talle : 0);
  if (primera) qv.opener = opener || document.activeElement;
  renderQuick();
  el.querySelector('.qv__panel').scrollTop = 0;
  if (primera) {
    el.hidden = false;
    void el.offsetWidth;
    el.classList.add('open');
    qvOverlay.panel = el.querySelector('.qv__panel');
    pushOverlay(qvOverlay);
  }
  el.querySelector('.qv__cerrar')?.focus();
  cambiarURL(`${location.pathname}?producto=${p.slug}`);
  const ld = document.getElementById('ld-producto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, sku: codigo(p), description: p.desc,
    image: new URL(p.img, location.href).href, color: p.colorNombre, category: catDe(p.cat)?.nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: 'https://schema.org/InStock', url: location.href },
  });
}

function closeQuick(devolverFoco = true) {
  const el = document.getElementById('qv');
  if (!el || el.hidden) return;
  el.classList.remove('open');
  popOverlay(qvOverlay);
  setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, 360);
  cambiarURL(location.pathname);
  if (devolverFoco && qv.opener?.isConnected) qv.opener.focus({ preventScroll: true });
}

function qvAgregar(comprar) {
  const p = qv.p;
  if (!p) return;
  if (!qv.talle) {
    showToast('Elegí tu talle para sumarla al carrito');
    document.querySelector('[data-qv-talle]:not([disabled])')?.focus();
    return;
  }
  Cart.add(p, qv.talle, qv.qty);
  if (comprar) { closeQuick(false); openCart(qv.opener); }
  else showToast(`Sumaste ${p.nombre} talle ${qv.talle} al carrito`);
}

const cartOverlay = { panel: null, close: () => closeCart() };
let cartOpener = null;

function lineaHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  const key = i.id + '-' + i.talle;
  return `<div class="linea-cart${key === Cart.ultimo ? ' entra' : ''}" data-linea="${key}">
    <div class="linea-cart__foto"><img src="${p.img}" alt="" width="1000" height="1000"></div>
    <div>
      <p class="linea-cart__nombre">${esc(p.nombre)}</p>
      <p class="linea-cart__meta">Talle ${i.talle} · ${esc(codigo(p))}</p>
      <div class="stepper"><button type="button" data-cq="-1" data-id="${i.id}" data-t="${i.talle}" aria-label="Restar un par de ${esc(p.nombre)}">−</button><output>${i.qty}</output><button type="button" data-cq="1" data-id="${i.id}" data-t="${i.talle}" aria-label="Sumar un par de ${esc(p.nombre)}">+</button></div>
    </div>
    <div class="linea-cart__der">
      <p class="linea-cart__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
      <button class="linea-cart__quitar" type="button" data-cq-quitar data-id="${i.id}" data-t="${i.talle}" aria-label="Quitar ${esc(p.nombre)} talle ${i.talle}">${ICONO_TACHO}</button>
    </div>
  </div>`;
}

function renderCart() {
  const body = document.getElementById('cart-body');
  const pie = document.getElementById('cart-pie');
  if (!body) return;
  const items = Cart.get();
  const activo = document.activeElement;
  const foco = activo?.dataset?.cq ? `[data-cq="${activo.dataset.cq}"][data-id="${activo.dataset.id}"][data-t="${activo.dataset.t}"]` : '';
  body.innerHTML = items.length ? items.map(lineaHTML).join('') : `<div class="drawer__vacio">
      <span class="barcode" aria-hidden="true"></span>
      <h3>La caja está vacía</h3>
      <p>Elegí un modelo, tu talle, y sumalo acá.</p>
      <button class="btn btn--cta" type="button" data-cart-ver>Ver zapatillas</button>
    </div>`;
  Cart.ultimo = '';
  if (pie) pie.hidden = !items.length;
  const n = Cart.count();
  document.querySelectorAll('[data-cart-n]').forEach(s => { s.textContent = n === 1 ? '1 par' : `${n} pares`; });
  const tot = document.getElementById('cart-total');
  if (tot) tot.textContent = formatearPrecio(Cart.total());
  if (foco) body.querySelector(foco)?.focus();
}

function openCart(opener) {
  const d = document.getElementById('drawer');
  if (!d) return;
  renderCart();
  if (!d.hidden && d.classList.contains('open')) return;
  cartOpener = opener || document.activeElement;
  d.hidden = false;
  void d.offsetWidth;
  d.classList.add('open');
  cartOverlay.panel = d.querySelector('.drawer__panel');
  pushOverlay(cartOverlay);
  d.querySelector('.drawer__cerrar')?.focus();
}

function closeCart(devolverFoco = true) {
  const d = document.getElementById('drawer');
  if (!d || d.hidden) return;
  d.classList.remove('open');
  popOverlay(cartOverlay);
  setTimeout(() => { if (!d.classList.contains('open')) d.hidden = true; }, 400);
  if (devolverFoco && cartOpener?.isConnected) cartOpener.focus({ preventScroll: true });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', () => {
  updateCartBadge();
  const d = document.getElementById('drawer');
  if (d && !d.hidden) renderCart();
});

const filtrosOverlay = { panel: null, close: () => closeFiltros() };
let filtrosOpener = null;
function openFiltros(btn) {
  const f = document.getElementById('filtros');
  const bd = document.querySelector('.filtros-backdrop');
  if (!f) return;
  filtrosOpener = btn;
  f.classList.add('open');
  bd?.classList.add('open');
  btn?.setAttribute('aria-expanded', 'true');
  filtrosOverlay.panel = f;
  pushOverlay(filtrosOverlay);
  f.querySelector('.filtros__cerrar')?.focus();
}
function closeFiltros() {
  const f = document.getElementById('filtros');
  if (!f || !f.classList.contains('open')) return;
  f.classList.remove('open');
  document.querySelector('.filtros-backdrop')?.classList.remove('open');
  filtrosOpener?.setAttribute('aria-expanded', 'false');
  popOverlay(filtrosOverlay);
  filtrosOpener?.focus({ preventScroll: true });
}

function addDesdeCard(btn, comprar) {
  const p = getProducto(comprar ? btn.dataset.buy : btn.dataset.add);
  if (!p) return;
  const card = btn.closest('.card');
  const sel = card?.querySelector('.talle-sel');
  const t = Number(sel?.value || 0);
  if (!t) {
    if (sel) { sel.classList.remove('falta'); void sel.offsetWidth; sel.classList.add('falta'); sel.focus(); }
    showToast('Elegí tu talle para sumarla al carrito');
    return;
  }
  Cart.add(p, t, 1);
  if (comprar) openCart(btn);
  else showToast(`Sumaste ${p.nombre} talle ${t} al carrito`);
}

function toggleFav(id) {
  const on = Favs.toggle(id);
  document.querySelectorAll(`[data-fav="${id}"]`).forEach(b => b.setAttribute('aria-pressed', String(on)));
  const p = getProducto(id);
  showToast(on ? `Guardaste ${p?.nombre} en favoritos` : 'La sacaste de favoritos');
  if (estado.favs) aplicar(); else syncUI();
}

let qTimer = 0;
document.addEventListener('input', e => {
  const t = e.target;
  if (t.matches('[data-q]')) {
    estado.q = t.value;
    clearTimeout(qTimer);
    qTimer = setTimeout(aplicar, 160);
  }
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'orden') { estado.orden = t.value; aplicar(); }
  if (t.classList.contains('talle-sel')) t.classList.remove('falta');
});
document.addEventListener('submit', e => {
  const f = e.target.closest('[data-form-buscar]');
  if (!f) return;
  e.preventDefault();
  const i = f.querySelector('[data-q]');
  if (i) estado.q = i.value;
  clearTimeout(qTimer);
  aplicar();
  i?.blur();
  irATienda();
});

document.addEventListener('click', e => {
  const t = e.target;
  if (!(t instanceof window.Element)) return;
  const q = t.closest('[data-quick]');
  if (q) {
    e.preventDefault();
    const tv = Number(q.closest('.card')?.querySelector('.talle-sel')?.value || 0);
    openQuick(q.dataset.quick, q, tv);
    return;
  }
  const add = t.closest('[data-add]'); if (add) { addDesdeCard(add, false); return; }
  const buy = t.closest('[data-buy]'); if (buy) { addDesdeCard(buy, true); return; }
  const fav = t.closest('[data-fav]'); if (fav) { toggleFav(fav.dataset.fav); return; }
  const f = t.closest('[data-f]'); if (f) { onFiltro(f); return; }
  const ic = t.closest('[data-ir-cat]');
  if (ic) { e.preventDefault(); estado.cat = ic.dataset.irCat; estado.sub = ''; aplicar(); irATienda(); return; }
  const it = t.closest('[data-ir-talle]');
  if (it) { const n = Number(it.dataset.irTalle); estado.talle = estado.talle === n ? 0 : n; aplicar(); if (estado.talle) irATienda(); return; }
  if (t.closest('[data-ir-buscar]')) { irATienda(); document.querySelector('[data-q]')?.focus({ preventScroll: true }); return; }
  const oc = t.closest('[data-open-cart]'); if (oc) { openCart(oc); return; }
  if (t.closest('[data-limpiar]')) { limpiar(); return; }
  const qu = t.closest('[data-quitar]'); if (qu) { quitarFiltro(qu.dataset.quitar, qu.dataset.v); return; }
  if (t.closest('[data-favs]')) { estado.favs = !estado.favs; aplicar(); return; }
  if (t.closest('[data-ver-mas]')) { estado.visibles += 16; renderCatalogo(true); return; }
  const fa = t.closest('[data-filtros-abrir]'); if (fa) { openFiltros(fa); return; }
  if (t.closest('[data-filtros-cerrar]')) { closeFiltros(); return; }
  if (t.closest('[data-checkout]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
  if (t.closest('[data-cart-cerrar]')) { closeCart(); return; }
  if (t.closest('[data-cart-ver]')) { closeCart(false); irATienda(); return; }
  const cq = t.closest('[data-cq]');
  if (cq) { const id = cq.dataset.id, ta = Number(cq.dataset.t); const i = Cart.get().find(x => x.id === id && x.talle === ta); if (i) Cart.setQty(id, ta, i.qty + Number(cq.dataset.cq)); return; }
  const cr = t.closest('[data-cq-quitar]'); if (cr) { Cart.remove(cr.dataset.id, Number(cr.dataset.t)); return; }
  if (t.closest('[data-qv-cerrar]')) { closeQuick(); return; }
  const qt = t.closest('[data-qv-talle]'); if (qt) { qv.talle = Number(qt.dataset.qvTalle); syncQuick(); return; }
  const qq = t.closest('[data-qv-qty]'); if (qq) { qv.qty = Math.max(1, Math.min(MAX_PAR, qv.qty + Number(qq.dataset.qvQty))); syncQuick(); return; }
  if (t.closest('[data-qv-add]')) { qvAgregar(false); return; }
  if (t.closest('[data-qv-buy]')) { qvAgregar(true); return; }
  if (t.closest('[data-qv-guia]')) { e.preventDefault(); closeQuick(false); irA('talles'); return; }
  const a = t.closest('a[href^="#"]');
  if (a) {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    if (id === 'top') { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); return; }
    if (document.getElementById(id)) { e.preventDefault(); irA(id); }
  }
});

function talleDesdeCm(cm) {
  for (const t of TALLES) if (TALLE_CM[t] >= cm - 0.05) return t;
  return 45;
}

function initGuia() {
  const r = document.getElementById('cm');
  if (!r) return;
  const out = document.getElementById('cm-out');
  const ar = document.getElementById('talle-ar');
  const eq = document.getElementById('talle-eq');
  const regla = document.getElementById('regla');
  const ver = document.getElementById('talle-ver');
  if (regla) regla.innerHTML = TALLES.map(t => `<span data-t="${t}">${t}</span>`).join('');
  const upd = () => {
    const cm = Math.round(parseFloat(r.value) * 10) / 10;
    if (out) out.textContent = cm.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' cm';
    const t = talleDesdeCm(cm);
    if (ar) ar.textContent = t;
    if (eq) eq.textContent = `EU ${t + 1} · US ${fmtNum(t - 32)} hombre · ${fmtNum(t - 30.5)} mujer (aprox.)`;
    regla?.querySelectorAll('span').forEach(s => s.classList.toggle('on', Number(s.dataset.t) === t));
    const n = PRODUCTOS.filter(p => p.talles.includes(t)).length;
    if (ver) {
      ver.dataset.t = t;
      ver.textContent = n ? `Ver los ${n} modelos en talle ${t}` : `Preguntar por el talle ${t}`;
    }
    r.style.setProperty('--p', `${((cm - 22) / 8) * 100}%`);
  };
  r.addEventListener('input', upd);
  document.querySelectorAll('[data-cm]').forEach(b => b.addEventListener('click', () => {
    const v = Math.min(30, Math.max(22, parseFloat(r.value) + parseFloat(b.dataset.cm)));
    r.value = v.toFixed(1);
    upd();
  }));
  ver?.addEventListener('click', () => {
    const t = Number(ver.dataset.t);
    if (!PRODUCTOS.some(p => p.talles.includes(t))) { window.open(wspLink(`Hola! Busco zapatillas en talle ${t}. ¿Tienen algo?`), '_blank', 'noopener'); return; }
    estado.talle = t;
    aplicar();
    irATienda();
  });
  upd();
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1081px)');
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
  cart?.addEventListener('click', () => openCart(cart));
  sync();
}

function initHeaderH() {
  const h = document.querySelector('.site-header');
  if (!h) return;
  const set = () => document.documentElement.style.setProperty('--header-h', `${Math.round(h.getBoundingClientRect().height)}px`);
  set();
  if ('ResizeObserver' in window) new window.ResizeObserver(set).observe(h);
  else window.addEventListener('resize', set, { passive: true });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  const foto = hero.querySelector('.hero-foto');
  if (foto) tl.from(foto, { clipPath: 'inset(0 0 100% 0)', duration: 1.3, clearProps: 'clipPath' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45);
  const talles = hero.querySelectorAll('.selector-talle__label, .talles-grid .talle-btn');
  if (talles.length) tl.from(talles, { y: 16, opacity: 0, duration: 0.7, stagger: 0.03, clearProps: 'transform,opacity' }, 0.5);
  tl.from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, y: 20, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const hero = document.querySelector('.hero--foto');
  const img = hero?.querySelector('[data-hero-img]');
  if (img) gsap.to(img, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
}

function abrirDesdeURL() {
  const slug = new URLSearchParams(location.search).get('producto');
  if (!slug) return;
  const p = PRODUCTOS.find(x => x.slug === slug);
  if (p) openQuick(p.id, null);
}

Cart.limpiarInvalidos();
renderCats();
renderRail();
renderFiltros();
renderCatalogo();
initGuia();
syncUI();
initReveals();
initNav();
initModelBarScroll();
initFloats();
initRail();
initHeaderH();
initHeroMotion();
initParallax();
updateCartBadge();
abrirDesdeURL();
