const WSP = '5493644503427';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normal = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const waLink = msg => 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(msg);

const ICONOS = {
  perfume: '<path d="M9.5 6.5h5v2.4a6 6 0 0 1 3 5.2V19a2 2 0 0 1-2 2H8.5a2 2 0 0 1-2-2v-4.9a6 6 0 0 1 3-5.2z"/><path d="M10.5 2.5h3v4h-3z"/><path d="M10 14.5h4"/>',
  regalo: '<rect x="3" y="9" width="18" height="12" rx="1.6"/><path d="M3 13h18M12 9v12"/><path d="M12 9S9.8 5.6 8 5.6A2.2 2.2 0 0 0 8 10z"/><path d="M12 9s2.2-3.4 4-3.4A2.2 2.2 0 0 1 16 10z"/>',
  lentes: '<circle cx="6" cy="14" r="3.4"/><circle cx="18" cy="14" r="3.4"/><path d="M9.4 14c.8-1.2 4.4-1.2 5.2 0"/><path d="M2.6 12.2 4.4 8.2M21.4 12.2 19.6 8.2"/>',
  salud: '<path d="M10.5 3h3v4.5H18v3h-4.5V15h-3v-4.5H6v-3h4.5z"/><path d="M4 19.5h16"/>',
  buscar: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  carrito: '<path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/>',
  filtro: '<path d="M3 5h18M6 12h12M10 19h4"/>',
  cerrar: '<path d="M18 6 6 18M6 6l12 12"/>',
  flechaDer: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  camion: '<path d="M2 6.5h11v10H2z"/><path d="M13 9.5h4.2l3.3 3.2v3.8H13z"/><circle cx="6.5" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
  local: '<path d="M4 9.5V20h16V9.5"/><path d="M3 9.5 5 4h14l2 5.5a3 3 0 0 1-5.4 1.8 3 3 0 0 1-5.2 0A3 3 0 0 1 3 9.5z"/>',
  reloj: '<circle cx="12" cy="12" r="8.6"/><path d="M12 7.2V12l3 1.8"/>',
  chat: '<path d="M21 12a8.4 8.4 0 0 1-8.4 8.4H4l1.5-3.1A8.4 8.4 0 1 1 21 12z"/>',
  frasco: '<path d="M9 2.5h6v3H9z"/><path d="M10 5.5v3.1L7.1 17a2.6 2.6 0 0 0 2.4 3.5h5a2.6 2.6 0 0 0 2.4-3.5L14 8.6V5.5"/><path d="M8.3 14.5h7.4"/>',
  tubo: '<path d="M8 2.5h8l-1 3H9z"/><path d="M9 5.5h6v13a3 3 0 0 1-3 3 3 3 0 0 1-3-3z"/><path d="M9 11h6"/>',
  vela: '<path d="M12 2.6s2.2 2 2.2 3.4a2.2 2.2 0 0 1-4.4 0C9.8 4.6 12 2.6 12 2.6z"/><rect x="7.5" y="9.5" width="9" height="11.5" rx="1.4"/>',
  bolsa: '<path d="M5.5 7.5h13L20 21H4z"/><path d="M8.5 10V6.4a3.5 3.5 0 0 1 7 0V10"/>'
};
const icono = (n, cls) => '<svg class="i ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONOS[n] || '') + '</svg>';

const RUBROS = [
  { id: 'perfumeria', nombre: 'Perfumería', glifo: 'perfume', img: 'images/perfumeria-1x1.webp', bajada: 'Perfumes, cremas, protección solar y cuidado del pelo.' },
  { id: 'regaleria', nombre: 'Regalería', glifo: 'regalo', img: 'images/regaleria-1x1.webp', bajada: 'Velas, difusores y sets armados listos para entregar.' },
  { id: 'accesorios', nombre: 'Accesorios de moda', glifo: 'lentes', img: 'images/accesorios-1x1.webp', bajada: 'Lentes, neceseres, labiales y accesorios para el pelo.' },
  { id: 'ventalibre', nombre: 'Venta libre', glifo: 'salud', img: 'images/ventalibre-1x1.webp', bajada: 'Lo de todos los días, sin receta y con asesoramiento.' }
];

const PRODUCTOS = [
  { id: 'perfume', nombre: 'Perfume floral 100 ml', marca: 'Perfumería', rubro: 'perfumeria', precio: 89000, descuento: 0, stock: 4, orden: 1, glifo: 'perfume', spec: '100 ml', img: 'images/prod-perfume.webp', foto: true, desc: 'Eau de parfum floral, de las fragancias que más se llevan del mostrador. Viene con estuche, así que sale listo para regalar.', specs: ['100 ml', 'Eau de parfum', 'Estuche incluido', 'Se puede probar en el local'] },
  { id: 'crema', nombre: 'Crema facial hidratante 50 ml', marca: 'Dermocosmética', rubro: 'perfumeria', precio: 34500, descuento: 10, stock: 9, orden: 2, glifo: 'tubo', spec: '50 ml', img: 'images/prod-crema.webp', foto: true, desc: 'Hidratación diaria para piel normal a seca, textura liviana y sin perfume. La que más se repone en la góndola de dermocosmética.', specs: ['50 ml', 'Piel normal a seca', 'Sin perfume', 'Uso diario'] },
  { id: 'protector', nombre: 'Protector solar FPS 50+ 200 ml', marca: 'Dermocosmética', rubro: 'perfumeria', precio: 28900, descuento: 0, stock: 12, orden: 3, glifo: 'frasco', spec: 'FPS 50+', img: 'images/prod-protector.webp', foto: true, desc: 'Protección alta para cara y cuerpo, resistente al agua. En Chaco es de las cosas que no pueden faltar en la cartera.', specs: ['FPS 50+', '200 ml', 'Resistente al agua', 'Cara y cuerpo'] },
  { id: 'shampoo', nombre: 'Shampoo y acondicionador', marca: 'Capilar', rubro: 'perfumeria', precio: 24500, descuento: 0, stock: 10, orden: 6, glifo: 'frasco', spec: 'Dúo', img: 'images/prod-shampoo.webp', foto: true, desc: 'El dúo completo para lavado frecuente. Se lleva junto y sale más que comprando cada uno por separado.', specs: ['Shampoo 400 ml', 'Acondicionador 400 ml', 'Uso frecuente', 'Todo tipo de pelo'] },
  { id: 'serum', nombre: 'Sérum y contorno de ojos', marca: 'Dermocosmética', rubro: 'perfumeria', precio: 41900, descuento: 0, stock: 6, orden: 7, glifo: 'tubo', spec: '30 ml', img: 'images/prod-cosmetica.webp', foto: true, desc: 'Sérum con vitamina C más contorno de ojos, el combo que más consultan para empezar una rutina.', specs: ['Sérum 30 ml', 'Contorno 15 ml', 'Con vitamina C', 'Mañana y noche'] },
  { id: 'setderma', nombre: 'Set de dermocosmética', marca: 'Set armado', rubro: 'perfumeria', precio: 62000, descuento: 12, stock: 3, orden: 8, glifo: 'bolsa', spec: '4 piezas', img: 'images/perfumeria-1x1.webp', foto: true, desc: 'Cuatro piezas de rutina facial armadas en el local: limpiador, sérum, crema y protector. Lo entregamos envuelto.', specs: ['4 piezas', 'Armado en el local', 'Envuelto para regalo', 'Se puede cambiar una pieza'] },

  { id: 'setregalo', nombre: 'Set de regalo armado', marca: 'Regalería', rubro: 'regaleria', precio: 47500, descuento: 0, stock: 5, orden: 4, glifo: 'regalo', spec: 'Armado', img: 'images/regaleria-1x1.webp', foto: true, desc: 'Vela, jabón artesanal y bombas de baño en caja con moño. El regalo que se resuelve en dos minutos.', specs: ['Vela de soja', 'Jabón artesanal', 'Bombas de baño', 'Caja con moño incluida'] },
  { id: 'jabon', nombre: 'Jabón líquido de manos 300 ml', marca: 'Regalería', rubro: 'regaleria', precio: 9800, descuento: 0, stock: 18, orden: 10, glifo: 'frasco', spec: '300 ml', img: 'images/prod-jabon.webp', foto: true, desc: 'Jabón líquido con dispenser de vidrio, de los que quedan bien a la vista en el baño.', specs: ['300 ml', 'Dispenser de vidrio', 'Aroma suave', 'Recargable'] },
  { id: 'vela', nombre: 'Vela aromática de soja', marca: 'Regalería', rubro: 'regaleria', precio: 18900, descuento: 0, stock: 11, orden: 13, glifo: 'vela', spec: '40 h', img: null, foto: false, desc: 'Cera de soja en vaso de vidrio, unas 40 horas de encendido. Tenemos varios aromas en el mostrador.', specs: ['Cera de soja', 'Hasta 40 h', 'Vaso de vidrio', 'Varios aromas'] },
  { id: 'difusor', nombre: 'Difusor de ambientes 250 ml', marca: 'Regalería', rubro: 'regaleria', precio: 22500, descuento: 15, stock: 7, orden: 14, glifo: 'frasco', spec: '250 ml', img: null, foto: false, desc: 'Difusor con varillas de rattan, rinde entre dos y tres meses según el ambiente.', specs: ['250 ml', 'Varillas de rattan', 'Rinde 2 a 3 meses', 'Aroma a elección'] },
  { id: 'setbano', nombre: 'Set de baño: sales y esponja', marca: 'Regalería', rubro: 'regaleria', precio: 16900, descuento: 0, stock: 9, orden: 15, glifo: 'bolsa', spec: '3 piezas', img: null, foto: false, desc: 'Sales de baño, esponja natural y jabón en bolsa de tela. Un regalo chico que queda bien.', specs: ['Sales de baño 300 g', 'Esponja natural', 'Jabón en barra', 'Bolsa de tela'] },

  { id: 'lentes', nombre: 'Lentes de sol con filtro UV', marca: 'Accesorios', rubro: 'accesorios', precio: 32000, descuento: 0, stock: 8, orden: 5, glifo: 'lentes', spec: 'UV400', img: 'images/prod-lentes.webp', foto: true, desc: 'Filtro UV400 real, con funda rígida. Tenemos varios modelos para probarse en el mostrador.', specs: ['Filtro UV400', 'Funda rígida incluida', 'Varios modelos', 'Unisex'] },
  { id: 'labiales', nombre: 'Labiales hidratantes x3', marca: 'Accesorios', rubro: 'accesorios', precio: 21500, descuento: 0, stock: 14, orden: 11, glifo: 'tubo', spec: 'x3', img: 'images/prod-labiales.webp', foto: true, desc: 'Tres tonos nude con manteca de karité. Se llevan sueltos o los tres en su cajita.', specs: ['3 tonos nude', 'Con manteca de karité', 'Acabado satinado', 'Cajita incluida'] },
  { id: 'neceser', nombre: 'Neceser con accesorios', marca: 'Accesorios', rubro: 'accesorios', precio: 27900, descuento: 0, stock: 6, orden: 12, glifo: 'bolsa', spec: '5 piezas', img: 'images/accesorios-1x1.webp', foto: true, desc: 'Neceser de cuero ecológico con lentes, scrunchie, pinza y aros adentro. Listo para regalar o para el bolso.', specs: ['Neceser de cuero ecológico', 'Scrunchie de seda', 'Pinza y aros', 'Cierre metálico'] },
  { id: 'pinzas', nombre: 'Set de pinzas y scrunchies', marca: 'Accesorios', rubro: 'accesorios', precio: 8900, descuento: 20, stock: 20, orden: 18, glifo: 'bolsa', spec: '6 piezas', img: null, foto: false, desc: 'Dos pinzas y cuatro scrunchies de tela, en tonos neutros. De lo que más sale por unidad.', specs: ['2 pinzas', '4 scrunchies', 'Tonos neutros', 'Tela suave'] },

  { id: 'botiquin', nombre: 'Botiquín básico armado', marca: 'Venta libre', rubro: 'ventalibre', precio: 38500, descuento: 0, stock: 5, orden: 9, glifo: 'salud', spec: '8 ítems', img: 'images/ventalibre-1x1.webp', foto: true, desc: 'Lo básico para tener en casa: analgésicos, antiácido, gasas, cinta, alcohol en gel y termómetro, en su caja.', specs: ['8 ítems', 'Incluye termómetro', 'Caja organizadora', 'Armado en el local'] },
  { id: 'vitaminas', nombre: 'Vitaminas y suplementos x60', marca: 'Venta libre', rubro: 'ventalibre', precio: 26900, descuento: 0, stock: 13, orden: 16, glifo: 'frasco', spec: 'x60', img: 'images/prod-vitaminas.webp', foto: true, desc: 'Multivitamínico en cápsulas para dos meses de toma diaria. Consultá con el farmacéutico si tomás otra medicación.', specs: ['60 cápsulas', 'Toma diaria', 'Sin azúcar', 'Consultá con el farmacéutico'] },
  { id: 'termometro', nombre: 'Termómetro digital', marca: 'Venta libre', rubro: 'ventalibre', precio: 14500, descuento: 0, stock: 15, orden: 17, glifo: 'salud', spec: '10 seg', img: 'images/prod-termometro.webp', foto: true, desc: 'Lectura en diez segundos, con aviso sonoro y memoria de la última medición. Viene con estuche.', specs: ['Lectura en 10 seg', 'Aviso sonoro', 'Memoria de la última toma', 'Estuche incluido'] },
  { id: 'ibuprofeno', nombre: 'Ibuprofeno 400 mg x20', marca: 'Venta libre', rubro: 'ventalibre', precio: 6800, descuento: 0, stock: 24, orden: 19, glifo: 'salud', spec: '400 mg', img: null, foto: false, desc: 'Analgésico de venta libre en comprimidos recubiertos. Leé el prospecto y consultá con el farmacéutico antes de tomarlo.', specs: ['20 comprimidos', '400 mg', 'Venta libre', 'Leé el prospecto'] },
  { id: 'alcohol', nombre: 'Alcohol en gel 250 ml', marca: 'Venta libre', rubro: 'ventalibre', precio: 5400, descuento: 25, stock: 30, orden: 20, glifo: 'frasco', spec: '250 ml', img: null, foto: false, desc: 'Alcohol en gel con glicerina, en envase con válvula. El que se lleva de a dos para la casa y el auto.', specs: ['250 ml', 'Con glicerina', 'Envase con válvula', 'Uso frecuente'] }
];

const OCASIONES = [
  { id: 'cumple', label: 'Un cumpleaños', rubros: ['regaleria', 'accesorios'], nota: 'Algo lindo y a la vista, que se abra en el momento.' },
  { id: 'madre', label: 'Día de la Madre', rubros: ['perfumeria', 'regaleria'], nota: 'Perfumería y regalería, que es lo que más sale esa semana.' },
  { id: 'gracias', label: 'Un agradecimiento', rubros: ['regaleria', 'perfumeria'], nota: 'Un detalle prolijo, sin que parezca de compromiso.' },
  { id: 'mimo', label: 'Para mimarse', rubros: ['perfumeria', 'accesorios'], nota: 'Para llevarse algo propio, sin excusa.' }
];

const FAQ = [
  ['¿Hacen envíos?', 'Sí. Enviamos dentro de Resistencia y alrededores, y coordinamos el horario por WhatsApp antes de salir. También podés retirar el pedido en el local sin costo.'],
  ['¿Puedo comprar medicamentos con receta?', 'Por la web vendemos solamente productos de venta libre, perfumería, regalería y accesorios. Si necesitás algo con receta, escribinos por WhatsApp y lo vemos con el farmacéutico.'],
  ['¿Arman el regalo para entregar?', 'Sí, y sin costo. Envolvemos la caja, ponemos moño y sumamos una tarjeta con el mensaje que nos pases cuando confirmás el pedido.'],
  ['¿Cómo sé si hay stock?', 'Lo que ves en la tienda es lo que tenemos en el mostrador. Igual, al confirmar el pedido te avisamos por WhatsApp antes de prepararlo.'],
  ['¿Puedo cambiar un producto?', 'Perfumería, regalería y accesorios se cambian dentro de los 15 días con el ticket y el producto sin abrir. Los productos de venta libre no tienen cambio.']
];

const Cart = {
  KEY: 'farmaciamarkonich_cart',
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
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); }
};

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(msg) + '</span>';
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

let revealsListos = false;
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  revealsListos = true;
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => { el.style.transitionDelay = Math.min(i * 0.09, 0.63) + 's'; });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) { items.forEach(el => el.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); } });
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
    if (!pending) { window.removeEventListener('scroll', queueSweep); window.removeEventListener('resize', queueSweep); }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = Math.min(i * 0.05, 0.4) + 's';
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  const header = document.querySelector('.site-header');
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 981px)');
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

const Tienda = { visibles: 16, orden: 'destacados', q: '', rubros: new Set(), precioMax: 100000, soloOferta: false };

function productosFiltrados() {
  let lista = PRODUCTOS.slice();
  if (Tienda.rubros.size) lista = lista.filter(p => Tienda.rubros.has(p.rubro));
  if (Tienda.soloOferta) lista = lista.filter(p => p.descuento > 0);
  lista = lista.filter(p => precioFinal(p) <= Tienda.precioMax);
  const q = normal(Tienda.q).trim();
  if (q) {
    const palabras = q.split(/\s+/);
    lista = lista.filter(p => {
      const heno = normal([p.nombre, p.marca, p.rubro, p.spec, p.desc, (p.specs || []).join(' ')].join(' '));
      return palabras.every(w => heno.includes(w));
    });
  }
  if (Tienda.orden === 'menor') lista.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (Tienda.orden === 'mayor') lista.sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (Tienda.orden === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else lista.sort((a, b) => a.orden - b.orden);
  return lista;
}

function mediaProducto(p, clase) {
  if (p.foto && p.img) {
    return '<span class="prod-media ' + (clase || '') + '"><img src="' + p.img + '" alt="' + esc(p.nombre) + '" width="800" height="800"></span>';
  }
  return '<span class="prod-media prod-media--placa ' + (clase || '') + '">' +
    '<span class="placa-glifo">' + icono(p.glifo) + '</span>' +
    '<b class="placa-spec">' + esc(p.spec) + '</b></span>';
}

function cardProducto(p) {
  const fin = precioFinal(p);
  const precio = p.descuento > 0
    ? '<span class="prod-final">' + formatearPrecio(fin) + '</span><s>' + formatearPrecio(p.precio) + '</s>'
    : '<span class="prod-final">' + formatearPrecio(fin) + '</span>';
  return '<article class="prod" data-id="' + p.id + '" data-animate style="opacity:0;transform:translateY(18px)">' +
    '<button type="button" class="prod-abrir" data-ver="' + p.id + '" aria-label="Ver ' + esc(p.nombre) + '">' +
      mediaProducto(p) +
      (p.descuento > 0 ? '<span class="prod-badge">-' + p.descuento + '%</span>' : '') +
      '<span class="prod-ver">Ver el detalle</span>' +
    '</button>' +
    '<div class="prod-body">' +
      '<span class="prod-marca">' + esc(p.marca) + '</span>' +
      '<h3 class="prod-nombre">' + esc(p.nombre) + '</h3>' +
      '<p class="prod-precio">' + precio + '</p>' +
    '</div>' +
    '<div class="prod-actions">' +
      '<span class="stepper"><button type="button" data-step="-1" aria-label="Quitar uno">−</button><output data-qty>1</output><button type="button" data-step="1" aria-label="Sumar uno">+</button></span>' +
      '<button type="button" class="btn btn--cta prod-add" data-add="' + p.id + '">Sumar<span class="lbl-largo"> al carrito</span></button>' +
    '</div>' +
  '</article>';
}

function renderTienda() {
  const grid = document.getElementById('tiendaGrid');
  if (!grid) return;
  const lista = productosFiltrados();
  const trozo = lista.slice(0, Tienda.visibles);
  grid.innerHTML = trozo.map(cardProducto).join('');
  const cuenta = document.getElementById('tiendaCuenta');
  if (cuenta) cuenta.textContent = lista.length === 1 ? '1 producto' : lista.length + ' productos';
  const vacio = document.getElementById('tiendaVacio');
  if (vacio) vacio.hidden = lista.length > 0;
  const mas = document.getElementById('tiendaMas');
  if (mas) mas.hidden = lista.length <= Tienda.visibles;
  grid.querySelectorAll('[data-add]').forEach(b => b.addEventListener('click', () => {
    const card = b.closest('.prod');
    const qty = parseInt(card?.querySelector('[data-qty]')?.textContent || '1', 10);
    const p = getProducto(b.dataset.add);
    if (!p) return;
    Cart.add(p, qty);
    showToast(p.nombre + ' está en el carrito');
  }));
  grid.querySelectorAll('[data-ver]').forEach(b => b.addEventListener('click', () => abrirVista(b.dataset.ver)));
  grid.querySelectorAll('.stepper').forEach(st => {
    const out = st.querySelector('[data-qty]');
    st.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => {
      out.textContent = Math.max(1, Math.min(20, parseInt(out.textContent, 10) + parseInt(b.dataset.step, 10)));
    }));
  });
  revelarNuevos(grid);
  sincronizarRubros();
  refrescar();
}

function sincronizarRubros() {
  document.querySelectorAll('[data-rubro]').forEach(el => {
    const activo = Tienda.rubros.has(el.dataset.rubro);
    el.classList.toggle('activo', activo);
    if (el.hasAttribute('role') || el.classList.contains('pestana')) el.setAttribute('aria-selected', activo ? 'true' : 'false');
  });
  const todos = document.querySelector('[data-rubro-todos]');
  todos?.classList.toggle('activo', Tienda.rubros.size === 0);
  todos?.setAttribute('aria-selected', Tienda.rubros.size === 0 ? 'true' : 'false');
  const limpiar = document.getElementById('tiendaLimpiar');
  if (limpiar) limpiar.hidden = !(Tienda.rubros.size || Tienda.soloOferta || Tienda.q || Tienda.precioMax < 100000);
}

function aplicarRubro(id, irAlCatalogo) {
  Tienda.rubros = id ? new Set([id]) : new Set();
  Tienda.visibles = 16;
  Tienda.q = '';
  const bs = document.getElementById('tiendaBuscar');
  if (bs) bs.value = '';
  renderTienda();
  if (irAlCatalogo) document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function pintarPrecio() {
  const el = document.getElementById('filtroPrecio');
  const out = document.getElementById('filtroPrecioValor');
  if (!el || !out) return;
  const v = parseInt(el.value, 10);
  out.textContent = v >= parseInt(el.max, 10) ? 'Sin tope' : 'Hasta ' + formatearPrecio(v);
}

function initRubros() {
  document.querySelectorAll('[data-rubros]').forEach(cont => {
    const modo = cont.dataset.rubros;
    if (modo === 'pestana') {
      cont.innerHTML = '<button type="button" class="pestana" data-rubro-todos role="tab" aria-selected="true">Todo</button>' +
        RUBROS.map(r => '<button type="button" class="pestana" data-rubro="' + r.id + '" role="tab" aria-selected="false">' + esc(r.nombre) + '</button>').join('');
    } else {
      cont.innerHTML = RUBROS.map(r => (
        '<button type="button" class="rubro" data-rubro="' + r.id + '" data-animate style="opacity:0;transform:translateY(18px)">' +
          '<span class="rubro-media"><img src="' + r.img + '" alt="' + esc(r.nombre) + ' en Farmacia Markonich" width="600" height="600"></span>' +
          '<span class="rubro-txt"><b>' + esc(r.nombre) + '</b><em>' + esc(r.bajada) + '</em></span>' +
          '<span class="rubro-link">Ver ' + esc(r.nombre.toLowerCase()) + ' ' + icono('flechaDer') + '</span>' +
        '</button>'
      )).join('');
    }
    cont.querySelectorAll('[data-rubro]').forEach(b => b.addEventListener('click', () => aplicarRubro(b.dataset.rubro, modo !== 'pestana')));
    cont.querySelector('[data-rubro-todos]')?.addEventListener('click', () => aplicarRubro(null, false));
  });
}

function initTienda() {
  const grid = document.getElementById('tiendaGrid');
  if (!grid) return;

  const caja = document.getElementById('filtroRubros');
  if (caja) caja.innerHTML = RUBROS.map(r => (
    '<label class="check"><input type="checkbox" data-filtro-rubro value="' + r.id + '"><span>' + esc(r.nombre) + '</span><em>' + PRODUCTOS.filter(p => p.rubro === r.id).length + '</em></label>'
  )).join('');

  document.querySelectorAll('[data-filtro-rubro]').forEach(i => i.addEventListener('change', () => {
    i.checked ? Tienda.rubros.add(i.value) : Tienda.rubros.delete(i.value);
    Tienda.visibles = 16; renderTienda();
  }));

  const oferta = document.getElementById('filtroOferta');
  oferta?.addEventListener('change', () => { Tienda.soloOferta = oferta.checked; Tienda.visibles = 16; renderTienda(); });

  const precio = document.getElementById('filtroPrecio');
  precio?.addEventListener('input', () => { Tienda.precioMax = parseInt(precio.value, 10); pintarPrecio(); Tienda.visibles = 16; renderTienda(); });
  pintarPrecio();

  const buscar = document.getElementById('tiendaBuscar');
  let t = null;
  buscar?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { Tienda.q = buscar.value; Tienda.visibles = 16; renderTienda(); }, 180);
  });

  const orden = document.getElementById('tiendaOrden');
  orden?.addEventListener('change', () => { Tienda.orden = orden.value; renderTienda(); });

  document.getElementById('tiendaMas')?.addEventListener('click', () => { Tienda.visibles += 16; renderTienda(); });
  document.getElementById('tiendaLimpiar')?.addEventListener('click', limpiarFiltros);
  document.getElementById('tiendaVaciarBtn')?.addEventListener('click', limpiarFiltros);

  const toggleFiltros = document.getElementById('filtrosToggle');
  const panelFiltros = document.getElementById('filtrosPanel');
  toggleFiltros?.addEventListener('click', () => {
    const abierto = panelFiltros.classList.toggle('open');
    toggleFiltros.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    refrescar();
  });

  renderTienda();
}

function limpiarFiltros() {
  Tienda.rubros.clear(); Tienda.soloOferta = false; Tienda.q = ''; Tienda.visibles = 16; Tienda.precioMax = 100000;
  document.querySelectorAll('[data-filtro-rubro]').forEach(i => { i.checked = false; });
  const of = document.getElementById('filtroOferta'); if (of) of.checked = false;
  const pr = document.getElementById('filtroPrecio'); if (pr) { pr.value = pr.max; pintarPrecio(); }
  const bs = document.getElementById('tiendaBuscar'); if (bs) bs.value = '';
  renderTienda();
}

let setActual = [];
function initRegalo() {
  const ocasiones = document.getElementById('regaloOcasiones');
  const presupuesto = document.getElementById('regaloPresupuesto');
  const salida = document.getElementById('regaloSalida');
  if (!ocasiones || !presupuesto || !salida) return;

  ocasiones.innerHTML = OCASIONES.map((o, i) => (
    '<button type="button" class="ocasion' + (i === 0 ? ' activo' : '') + '" data-ocasion="' + o.id + '">' + esc(o.label) + '</button>'
  )).join('');

  const armar = () => {
    const id = ocasiones.querySelector('.ocasion.activo')?.dataset.ocasion || OCASIONES[0].id;
    const oc = OCASIONES.find(o => o.id === id);
    const tope = parseInt(presupuesto.value, 10);
    const salidaPres = document.getElementById('regaloPresupuestoValor');
    if (salidaPres) salidaPres.textContent = formatearPrecio(tope);
    if (!oc) return;

    const candidatos = PRODUCTOS
      .filter(p => oc.rubros.includes(p.rubro) && p.stock > 0)
      .sort((a, b) => precioFinal(b) - precioFinal(a));
    const barato = candidatos.length ? Math.min(...candidatos.map(precioFinal)) : 0;
    let set = [];
    let resto = tope;
    for (let n = 3; n >= 1 && !set.length; n--) {
      const intento = [];
      let r = tope;
      for (let slot = 0; slot < n; slot++) {
        const cupo = r - (n - 1 - slot) * barato;
        const elegido = candidatos.find(p => !intento.includes(p) && precioFinal(p) <= cupo);
        if (!elegido) { intento.length = 0; break; }
        intento.push(elegido);
        r -= precioFinal(elegido);
      }
      if (intento.length === n) { set = intento; resto = r; }
    }
    for (let i = 0; i < set.length; i++) {
      const disponible = resto + precioFinal(set[i]);
      const mejor = candidatos.find(p => !set.includes(p) && precioFinal(p) <= disponible && precioFinal(p) > precioFinal(set[i]));
      if (mejor) { resto = disponible - precioFinal(mejor); set[i] = mejor; }
    }
    setActual = set;
    const total = set.reduce((s, p) => s + precioFinal(p), 0);

    if (!set.length) {
      const masBarato = candidatos[candidatos.length - 1];
      salida.innerHTML = '<p class="regalo-linea">Con ' + formatearPrecio(tope) + ' todavía no llegamos a un set de ' + esc(oc.label.toLowerCase()) +
        '. Lo más accesible del rubro es <b>' + esc(masBarato?.nombre || '') + '</b> a <b>' + formatearPrecio(precioFinal(masBarato || { precio: 0, descuento: 0 })) + '</b>.</p>' +
        '<div class="regalo-acciones"><a class="btn btn--linea" href="' + waLink('Hola Farmacia Markonich! Quiero armar un regalo para ' + oc.label.toLowerCase() + ' con un presupuesto de ' + formatearPrecio(tope) + '.') + '" target="_blank" rel="noopener">Consultar por WhatsApp</a></div>';
      refrescar();
      return;
    }

    salida.innerHTML =
      '<p class="regalo-nota">' + esc(oc.nota) + '</p>' +
      '<ul class="regalo-lista">' + set.map(p => (
        '<li class="regalo-item">' + mediaProducto(p, 'prod-media--mini') +
        '<span class="regalo-item-txt"><b>' + esc(p.nombre) + '</b><em>' + esc(p.marca) + '</em></span>' +
        '<span class="regalo-item-precio">' + formatearPrecio(precioFinal(p)) + '</span></li>'
      )).join('') + '</ul>' +
      '<div class="regalo-total">' +
        '<span><em>Total del set</em><b data-regalo-total>' + formatearPrecio(total) + '</b></span>' +
        '<span><em>Te quedan</em><b data-regalo-resto>' + formatearPrecio(resto) + '</b></span>' +
      '</div>' +
      '<div class="regalo-acciones">' +
        '<button type="button" class="btn btn--cta" id="regaloAdd">Sumar el set al carrito</button>' +
        '<a class="btn btn--linea" href="' + waLink('Hola Farmacia Markonich! Quiero este regalo para ' + oc.label.toLowerCase() + ': ' + set.map(p => p.nombre).join(', ') + '. Total ' + formatearPrecio(total) + '.') + '" target="_blank" rel="noopener">Pedirlo por WhatsApp</a>' +
      '</div>';

    document.getElementById('regaloAdd')?.addEventListener('click', () => {
      setActual.forEach(p => Cart.add(p, 1));
      showToast('Sumamos ' + setActual.length + ' productos al carrito');
    });
    refrescar();
  };

  ocasiones.querySelectorAll('[data-ocasion]').forEach(b => b.addEventListener('click', () => {
    ocasiones.querySelectorAll('.ocasion').forEach(x => x.classList.remove('activo'));
    b.classList.add('activo');
    armar();
  }));
  presupuesto.addEventListener('input', armar);
  armar();
}

function initEscena() {
  const escena = document.getElementById('escena');
  if (!escena) return;
  const foto = document.getElementById('escenaFoto');
  const marco = document.getElementById('escenaMarco');
  const lista = document.getElementById('escenaLista');
  const nombre = document.getElementById('escenaRubro');
  const cuenta = document.getElementById('escenaCuenta');
  const cta = document.getElementById('escenaCta');
  const OFF = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;

  lista.innerHTML = RUBROS.map((r, i) => (
    '<li class="escena-estante' + (i === 0 ? ' activo' : '') + '" data-estante="' + r.id + '"><span></span>' + esc(r.nombre) + '</li>'
  )).join('');

  let indice = -1;
  const pintar = p => {
    const recorridoFoto = Math.max(0, foto.offsetHeight - marco.clientHeight);
    foto.style.transform = 'translate3d(0,' + (-recorridoFoto * p).toFixed(1) + 'px,0)';
    const i = Math.min(RUBROS.length - 1, Math.floor(p * RUBROS.length));
    if (i !== indice) {
      indice = i;
      const r = RUBROS[i];
      lista.querySelectorAll('.escena-estante').forEach((el, k) => el.classList.toggle('activo', k === i));
      if (nombre) nombre.textContent = r.nombre;
      if (cuenta) cuenta.textContent = PRODUCTOS.filter(x => x.rubro === r.id).length;
      if (cta) {
        cta.textContent = 'Ver ' + r.nombre.toLowerCase() + ' en la tienda';
        cta.dataset.rubroIr = r.id;
      }
    }
  };

  if (reduceMotion) pintar(0.99);
  else {
    let ticking = false;
    const tick = () => {
      ticking = false;
      const r = escena.getBoundingClientRect();
      const sticky = escena.querySelector('.escena-sticky');
      const recorrido = escena.offsetHeight - (sticky ? sticky.offsetHeight : window.innerHeight - OFF());
      if (recorrido <= 0) { pintar(0.99); return; }
      pintar(Math.min(0.999, Math.max(0, (OFF() - r.top) / recorrido)));
    };
    const pedir = () => { if (!ticking) { ticking = true; requestAnimationFrame(tick); } };
    window.addEventListener('scroll', pedir, { passive: true });
    window.addEventListener('resize', pedir, { passive: true });
    pintar(0);
    requestAnimationFrame(tick);
  }

  cta?.addEventListener('click', () => aplicarRubro(cta.dataset.rubroIr, true));
  lista.querySelectorAll('[data-estante]').forEach(li => li.addEventListener('click', () => aplicarRubro(li.dataset.estante, true)));
}

function initFaq() {
  const cont = document.getElementById('faqLista');
  if (!cont) return;
  cont.innerHTML = FAQ.map((f, i) => (
    '<details class="faq-item" data-animate style="opacity:0;transform:translateY(16px)"' + (i === 0 ? ' open' : '') + '>' +
      '<summary>' + esc(f[0]) + '<span class="faq-mas" aria-hidden="true"></span></summary>' +
      '<div class="faq-cuerpo"><p>' + esc(f[1]) + '</p></div>' +
    '</details>'
  )).join('');
  cont.querySelectorAll('details').forEach(d => d.addEventListener('toggle', refrescar));
}

let focoPrev = null;
function initVista() {
  const modal = document.getElementById('vistaModal');
  if (!modal) return;
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('[data-cerrar-vista]')) cerrarVista(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) cerrarVista();
    if (e.key === 'Tab' && !modal.hidden) atraparFoco(e, modal);
  });
}

function abrirVista(id) {
  const p = getProducto(id);
  const modal = document.getElementById('vistaModal');
  const cuerpo = document.getElementById('vistaCuerpo');
  if (!p || !modal || !cuerpo) return;
  focoPrev = document.activeElement;
  const fin = precioFinal(p);
  const relacionados = PRODUCTOS.filter(x => x.rubro === p.rubro && x.id !== p.id).slice(0, 3);
  cuerpo.innerHTML =
    '<div class="vista-media">' + mediaProducto(p, 'prod-media--grande') + (p.descuento > 0 ? '<span class="prod-badge">-' + p.descuento + '%</span>' : '') + '</div>' +
    '<div class="vista-info">' +
      '<span class="prod-marca">' + esc(p.marca) + '</span>' +
      '<h3>' + esc(p.nombre) + '</h3>' +
      '<p class="prod-precio prod-precio--grande">' + (p.descuento > 0 ? '<span class="prod-final">' + formatearPrecio(fin) + '</span><s>' + formatearPrecio(p.precio) + '</s>' : '<span class="prod-final">' + formatearPrecio(fin) + '</span>') + '</p>' +
      '<p class="vista-desc">' + esc(p.desc) + '</p>' +
      '<ul class="vista-specs">' + (p.specs || []).map(s => '<li>' + icono('check') + esc(s) + '</li>').join('') + '</ul>' +
      '<p class="vista-entrega">' + icono('camion') + 'Envío en Resistencia o retiro en el local · Quedan ' + p.stock + ' en stock</p>' +
      '<div class="vista-acciones">' +
        '<span class="stepper"><button type="button" data-step="-1" aria-label="Quitar uno">−</button><output data-qty>1</output><button type="button" data-step="1" aria-label="Sumar uno">+</button></span>' +
        '<button type="button" class="btn btn--cta" data-vista-add>Sumar al carrito</button>' +
        '<button type="button" class="btn btn--linea" data-vista-comprar>Comprar ahora</button>' +
      '</div>' +
      (relacionados.length ? '<div class="vista-rel"><h4>Del mismo mostrador</h4><div class="vista-rel-lista">' + relacionados.map(r =>
        '<button type="button" class="vista-rel-item" data-ver="' + r.id + '">' + mediaProducto(r, 'prod-media--mini') + '<span><b>' + esc(r.nombre) + '</b><em>' + formatearPrecio(precioFinal(r)) + '</em></span></button>'
      ).join('') + '</div></div>' : '') +
    '</div>';

  const out = cuerpo.querySelector('[data-qty]');
  cuerpo.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => {
    out.textContent = Math.max(1, Math.min(20, parseInt(out.textContent, 10) + parseInt(b.dataset.step, 10)));
  }));
  cuerpo.querySelector('[data-vista-add]')?.addEventListener('click', () => {
    Cart.add(p, parseInt(out.textContent, 10));
    showToast(p.nombre + ' está en el carrito');
  });
  cuerpo.querySelector('[data-vista-comprar]')?.addEventListener('click', () => {
    Cart.add(p, parseInt(out.textContent, 10));
    cerrarVista();
    abrirCarrito();
  });
  cuerpo.querySelectorAll('[data-ver]').forEach(b => b.addEventListener('click', () => abrirVista(b.dataset.ver)));

  modal.hidden = false;
  document.body.classList.add('no-scroll');
  modal.querySelector('[data-cerrar-vista]')?.focus();
}

function cerrarVista() {
  const modal = document.getElementById('vistaModal');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('no-scroll');
  focoPrev?.focus?.();
}

function atraparFoco(e, cont) {
  const focos = cont.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

let carritoFocoPrev = null;
function abrirCarrito() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  carritoFocoPrev = document.activeElement;
  renderCarrito();
  drawer.hidden = false;
  document.body.classList.add('no-scroll');
  drawer.querySelector('[data-cerrar-carrito]')?.focus();
}
function cerrarCarrito() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer || drawer.hidden) return;
  drawer.hidden = true;
  document.body.classList.remove('no-scroll');
  carritoFocoPrev?.focus?.();
}

function renderCarrito() {
  const lista = document.getElementById('cartLista');
  if (!lista) return;
  const items = Cart.get();
  lista.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return '<li class="cart-item">' + mediaProducto(p, 'prod-media--mini') +
      '<div class="cart-item-txt"><b>' + esc(p.nombre) + '</b><em>' + formatearPrecio(precioFinal(p)) + '</em>' +
      '<span class="stepper stepper--mini"><button type="button" data-cart-step="-1" data-id="' + p.id + '" aria-label="Quitar uno">−</button><output>' + i.qty + '</output><button type="button" data-cart-step="1" data-id="' + p.id + '" aria-label="Sumar uno">+</button></span></div>' +
      '<button type="button" class="cart-quitar" data-cart-del="' + p.id + '" aria-label="Sacar ' + esc(p.nombre) + ' del carrito">' + icono('cerrar') + '</button></li>';
  }).join('');
  const vacio = document.getElementById('cartVacio');
  if (vacio) vacio.hidden = items.length > 0;
  const pie = document.getElementById('cartPie');
  if (pie) pie.hidden = items.length === 0;
  const total = document.getElementById('cartTotal');
  if (total) total.textContent = formatearPrecio(Cart.total());
  lista.querySelectorAll('[data-cart-step]').forEach(b => b.addEventListener('click', () => {
    const it = Cart.get().find(x => x.id === b.dataset.id);
    const nueva = (it?.qty || 1) + parseInt(b.dataset.cartStep, 10);
    if (nueva < 1) Cart.remove(b.dataset.id); else Cart.setQty(b.dataset.id, nueva);
    renderCarrito();
  }));
  lista.querySelectorAll('[data-cart-del]').forEach(b => b.addEventListener('click', () => { Cart.remove(b.dataset.cartDel); renderCarrito(); }));
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function initCarrito() {
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', abrirCarrito));
  const drawer = document.getElementById('cartDrawer');
  drawer?.addEventListener('click', e => { if (e.target === drawer || e.target.closest('[data-cerrar-carrito]')) cerrarCarrito(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer && !drawer.hidden) cerrarCarrito();
    if (e.key === 'Tab' && drawer && !drawer.hidden) atraparFoco(e, drawer);
  });
  document.getElementById('cartFinalizar')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.getElementById('cartSeguir')?.addEventListener('click', () => {
    cerrarCarrito();
    document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); renderCarrito(); });
  updateCartBadge();
  renderCarrito();
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

function initMovimiento() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-regla]').forEach(el => {
    gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 94%' } });
  });
  const frase = document.querySelector('[data-leer]');
  if (frase) {
    const palabras = frase.textContent.trim().split(/\s+/);
    frase.innerHTML = palabras.map(w => '<span class="pal">' + esc(w) + '</span>').join(' ');
    gsap.to(frase.querySelectorAll('.pal'), {
      color: 'var(--color-ink)', stagger: 0.08, ease: 'none',
      scrollTrigger: { trigger: frase, start: 'top 82%', end: 'bottom 58%', scrub: true }
    });
  }
  const fondo = document.querySelector('[data-hero-fondo]');
  if (fondo) gsap.fromTo(fondo, { scale: 1.06 }, { scale: 1, duration: 1.6, ease: 'power2.out' });
}

function initAnio() {
  document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = new Date().getFullYear(); });
}

document.addEventListener('DOMContentLoaded', () => {
  initRubros();
  initTienda();
  initRegalo();
  initEscena();
  initFaq();
  initVista();
  initCarrito();
  initReveals();
  initNav();
  initFloats();
  initMovimiento();
  initAnio();
});
