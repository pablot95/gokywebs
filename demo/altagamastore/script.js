const WSP = '5493885779781';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normal = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const waLink = msg => 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(msg);

const ICONOS = {
  smartphone: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M10.5 18.5h3"/>',
  headphones: '<path d="M3 15v-3a9 9 0 0 1 18 0v3"/><path d="M21 16.5a2.5 2.5 0 0 1-2.5 2.5H18a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h.5A2.5 2.5 0 0 1 21 15.5z"/><path d="M3 16.5A2.5 2.5 0 0 0 5.5 19H6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-.5A2.5 2.5 0 0 0 3 15.5z"/>',
  watch: '<circle cx="12" cy="12" r="5.5"/><path d="M9 3.2 9.4 6.6M15 3.2l-.4 3.4M9 20.8l.4-3.4M15 20.8l-.4-3.4"/>',
  laptop: '<rect x="3" y="5" width="18" height="11" rx="1.6"/><path d="M2 19.5h20"/>',
  tablet: '<rect x="4.5" y="2.5" width="15" height="19" rx="2"/><path d="M10.5 18.5h3"/>',
  gamepad: '<path d="M6.5 11h4M8.5 9v4"/><circle cx="16" cy="10.6" r=".9" fill="currentColor" stroke="none"/><circle cx="18.2" cy="13" r=".9" fill="currentColor" stroke="none"/><path d="M8.2 6h7.6a5.5 5.5 0 0 1 5.4 4.5l.7 4.1A2.9 2.9 0 0 1 19 18c-1.4 0-2.1-.8-2.8-1.7l-.7-1H8.5l-.7 1C7.1 17.2 6.4 18 5 18a2.9 2.9 0 0 1-2.9-3.4l.7-4.1A5.5 5.5 0 0 1 8.2 6z"/>',
  battery: '<rect x="2" y="7.5" width="16" height="9" rx="2"/><path d="M21 11v2"/><path d="M5.5 10.5v3M9 10.5v3"/>',
  cable: '<path d="M4 3v4a3 3 0 0 0 3 3h1a3 3 0 0 1 3 3v3a3 3 0 0 0 3 3h1"/><path d="M2.5 3h3M18.5 19h3"/><rect x="12.5" y="2.5" width="7" height="5" rx="1.5"/>',
  shield: '<path d="M12 22s8-3.6 8-10V5.4L12 2.4 4 5.4V12c0 6.4 8 10 8 10z"/><path d="M9.2 12.2 11 14l3.8-3.8"/>',
  buscar: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  carrito: '<path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/>',
  filtro: '<path d="M3 5h18M6 12h12M10 19h4"/>',
  cerrar: '<path d="M18 6 6 18M6 6l12 12"/>',
  flechaDer: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  camion: '<path d="M2 6.5h11v10H2z"/><path d="M13 9.5h4.2l3.3 3.2v3.8H13z"/><circle cx="6.5" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
  mano: '<path d="M8 12.5V5.2a1.6 1.6 0 0 1 3.2 0v6"/><path d="M11.2 11.2V4a1.6 1.6 0 0 1 3.2 0v7.2"/><path d="M14.4 11.6V6.4a1.6 1.6 0 0 1 3.2 0v8.2c0 3.6-2.6 6.4-6 6.4-2.4 0-4.2-1.2-5.2-3.2L4 13.4a1.7 1.7 0 0 1 2.9-1.7z"/>',
  escudo: '<path d="M12 22s8-3.6 8-10V5.4L12 2.4 4 5.4V12c0 6.4 8 10 8 10z"/>'
};
const icono = (n, cls) => '<svg class="i ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONOS[n] || '') + '</svg>';

const FAMILIAS = [
  { id: 'celulares', nombre: 'Celulares', glifo: 'smartphone', img: 'images/prod-smartphone.webp', bajada: 'Gama alta, gama media y equipos de entrada.' },
  { id: 'audio', nombre: 'Audio', glifo: 'headphones', img: 'images/prod-auriculares.webp', bajada: 'In-ear, vincha y parlantes portátiles.' },
  { id: 'relojes', nombre: 'Relojes', glifo: 'watch', img: 'images/prod-smartwatch.webp', bajada: 'Smartwatch y bandas de actividad.' },
  { id: 'compu', nombre: 'Compu y gaming', glifo: 'laptop', img: 'images/prod-notebook.webp', bajada: 'Notebooks, tablets y joysticks.' },
  { id: 'accesorios', nombre: 'Accesorios', glifo: 'battery', img: 'images/prod-powerbank.webp', bajada: 'Carga, cables, fundas y vidrios.' }
];

const PRODUCTOS = [
  { id: 'ip15pm', nombre: 'iPhone 15 Pro Max 256 GB', marca: 'Apple', familia: 'celulares', precio: 2149000, descuento: 0, stock: 3, orden: 1, glifo: 'smartphone', spec: '256 GB', img: 'images/prod-smartphone.webp', foto: true, conector: 'usb-c', entrega: 'ambos', desc: 'Titanio, pantalla de 6,7", chip A17 Pro y cámara de 48 MP. Liberado de fábrica, con caja cerrada y garantía escrita.', specs: ['Pantalla 6,7" Super Retina XDR', 'Chip A17 Pro', 'Cámara 48 MP + teleobjetivo 5x', 'Carga USB-C'] },
  { id: 's25u', nombre: 'Samsung Galaxy S25 Ultra 512 GB', marca: 'Samsung', familia: 'celulares', precio: 2489000, descuento: 0, stock: 2, orden: 2, glifo: 'smartphone', spec: '512 GB', img: 'images/prod-galaxy.webp', foto: true, conector: 'usb-c', entrega: 'ambos', desc: 'El tope de línea de Samsung: pantalla de 6,9", S Pen incluido y cámara de 200 MP. Caja cerrada, liberado y con garantía escrita.', specs: ['Pantalla 6,9" QHD+ 120 Hz', 'S Pen incluido', 'Cámara 200 MP', '12 GB de RAM'] },
  { id: 'ip13', nombre: 'iPhone 13 128 GB', marca: 'Apple', familia: 'celulares', precio: 1129000, descuento: 0, stock: 4, orden: 6, glifo: 'smartphone', spec: '128 GB', img: null, foto: false, conector: 'lightning', entrega: 'ambos', desc: 'El iPhone que mejor relación precio-uso tiene hoy: pantalla de 6,1", doble cámara y batería para todo el día. Liberado, con caja y garantía escrita.', specs: ['Pantalla 6,1" Super Retina XDR', 'Chip A15 Bionic', 'Doble cámara de 12 MP', 'Carga Lightning'] },
  { id: 'a55', nombre: 'Samsung Galaxy A55 256 GB', marca: 'Samsung', familia: 'celulares', precio: 749000, descuento: 12, stock: 6, orden: 7, glifo: 'smartphone', spec: '256 GB', img: null, foto: false, conector: 'usb-c', entrega: 'ambos', desc: 'Gama media con cuerpo de metal, pantalla de 120 Hz y batería de 5.000 mAh. El que más sale del mostrador.', specs: ['Pantalla 6,6" Super AMOLED 120 Hz', '8 GB de RAM', 'Batería 5.000 mAh', 'Resistente al agua IP67'] },
  { id: 'rn13p', nombre: 'Xiaomi Redmi Note 13 Pro 256 GB', marca: 'Xiaomi', familia: 'celulares', precio: 529000, descuento: 10, stock: 8, orden: 8, glifo: 'smartphone', spec: '256 GB', img: null, foto: false, conector: 'usb-c', entrega: 'ambos', desc: 'Cámara de 200 MP y carga de 67 W en un equipo de gama media. Viene con funda y vidrio puestos desde el local.', specs: ['Pantalla 6,67" AMOLED 120 Hz', 'Cámara 200 MP', 'Carga rápida 67 W', '8 GB de RAM'] },
  { id: 'g84', nombre: 'Motorola Moto G84 256 GB', marca: 'Motorola', familia: 'celulares', precio: 459000, descuento: 0, stock: 5, orden: 9, glifo: 'smartphone', spec: '256 GB', img: null, foto: false, conector: 'usb-c', entrega: 'ambos', desc: 'Liviano, con pantalla pOLED y batería que aguanta dos días de uso normal. Android limpio, sin apps de más.', specs: ['Pantalla 6,5" pOLED 120 Hz', 'Batería 5.000 mAh', '8 GB de RAM', 'Android sin capas'] },

  { id: 'appro2', nombre: 'Apple AirPods Pro 2', marca: 'Apple', familia: 'audio', precio: 429000, descuento: 0, stock: 5, orden: 3, glifo: 'headphones', spec: 'ANC', img: 'images/prod-earbuds.webp', foto: true, conector: 'usb-c', entrega: 'ambos', desc: 'Cancelación activa de ruido, modo ambiente y estuche con carga USB-C. Se prueban en el local antes de llevártelos.', specs: ['Cancelación activa de ruido', 'Audio espacial', 'Estuche con carga USB-C', 'Hasta 6 h por carga'] },
  { id: 'jbl770', nombre: 'JBL Tune 770NC', marca: 'JBL', familia: 'audio', precio: 219000, descuento: 15, stock: 7, orden: 4, glifo: 'headphones', spec: '70 h', img: 'images/prod-auriculares.webp', foto: true, conector: 'usb-c', entrega: 'ambos', desc: 'Auriculares de vincha con cancelación de ruido y 70 horas de batería. Se pliegan y entran en cualquier mochila.', specs: ['Cancelación adaptativa', 'Hasta 70 h de batería', 'Bluetooth 5.3 multipunto', 'Plegables'] },
  { id: 'emb3', nombre: 'Marshall Emberton III', marca: 'Marshall', familia: 'audio', precio: 389000, descuento: 0, stock: 3, orden: 5, glifo: 'headphones', spec: 'IP67', img: 'images/prod-parlante.webp', foto: true, conector: 'usb-c', entrega: 'ambos', desc: 'Parlante portátil con sonido de 360°, resistente al agua y 32 horas de reproducción. El clásico que nunca falla.', specs: ['Sonido 360°', 'Resistente al agua IP67', 'Hasta 32 h de batería', 'Carga USB-C'] },
  { id: 'rbuds6', nombre: 'Xiaomi Redmi Buds 6', marca: 'Xiaomi', familia: 'audio', precio: 69900, descuento: 0, stock: 12, orden: 14, glifo: 'headphones', spec: '42 h', img: null, foto: false, conector: 'usb-c', entrega: 'ambos', desc: 'In-ear con cancelación de ruido a precio de accesorio. Los que más se llevan junto con un equipo nuevo.', specs: ['Cancelación de ruido 49 dB', 'Hasta 42 h con el estuche', 'Bluetooth 5.4', 'Resistentes al sudor'] },

  { id: 'awse', nombre: 'Apple Watch SE 44 mm', marca: 'Apple', familia: 'relojes', paraMarcas: ['Apple'], precio: 549000, descuento: 0, stock: 4, orden: 10, glifo: 'watch', spec: '44 mm', img: 'images/prod-smartwatch.webp', foto: true, conector: 'usb-c', entrega: 'ambos', desc: 'El Apple Watch que más se vende: notificaciones, actividad, detección de caídas y batería de un día completo.', specs: ['Pantalla Retina 44 mm', 'Detección de caídas', 'Resistente al agua 50 m', 'Batería de 18 h'] },
  { id: 'gw7', nombre: 'Samsung Galaxy Watch7 44 mm', marca: 'Samsung', familia: 'relojes', paraMarcas: ['Samsung', 'Xiaomi', 'Motorola'], precio: 619000, descuento: 0, stock: 3, orden: 15, glifo: 'watch', spec: '44 mm', img: null, foto: false, conector: 'usb-c', entrega: 'ambos', desc: 'Medición de sueño, ritmo cardíaco y composición corporal. Se sincroniza con cualquier Android en dos toques.', specs: ['Pantalla AMOLED 44 mm', 'Sensor BioActive', 'GPS de doble frecuencia', 'Carga inalámbrica'] },

  { id: 'mba', nombre: 'Apple MacBook Air M2 13"', marca: 'Apple', familia: 'compu', precio: 2890000, descuento: 0, stock: 2, orden: 11, glifo: 'laptop', spec: '256 GB', img: 'images/prod-notebook.webp', foto: true, conector: 'usb-c', entrega: 'ambos', desc: 'Chip M2, 8 GB de memoria unificada y 18 horas de batería en 1,24 kg. Para estudiar, trabajar y editar sin ruido de ventilador.', specs: ['Chip Apple M2', '8 GB de memoria unificada', 'SSD de 256 GB', 'Hasta 18 h de batería'] },
  { id: 'ipad10', nombre: 'Apple iPad 10ma gen 64 GB', marca: 'Apple', familia: 'compu', precio: 899000, descuento: 0, stock: 4, orden: 12, glifo: 'tablet', spec: '64 GB', img: 'images/prod-tablet.webp', foto: true, conector: 'usb-c', entrega: 'ambos', desc: 'Pantalla de 10,9", carga USB-C y compatibilidad con Apple Pencil. La tablet que sirve para estudiar y para mirar series.', specs: ['Pantalla Liquid Retina 10,9"', 'Chip A14 Bionic', 'Compatible con Apple Pencil', 'Carga USB-C'] },
  { id: 'dualsense', nombre: 'Joystick DualSense PS5', marca: 'Sony', familia: 'compu', precio: 159000, descuento: 0, stock: 9, orden: 13, glifo: 'gamepad', spec: 'PS5', img: 'images/prod-joystick.webp', foto: true, conector: 'usb-c', entrega: 'ambos', desc: 'Gatillos adaptativos, vibración háptica y micrófono incorporado. Original Sony, con garantía escrita.', specs: ['Gatillos adaptativos', 'Vibración háptica', 'Micrófono incorporado', 'Carga USB-C'] },
  { id: 'taba9', nombre: 'Samsung Galaxy Tab A9+ 128 GB', marca: 'Samsung', familia: 'compu', precio: 649000, descuento: 0, stock: 3, orden: 18, glifo: 'tablet', spec: '128 GB', img: null, foto: false, conector: 'usb-c', entrega: 'ambos', desc: 'Pantalla de 11" a 90 Hz y cuatro parlantes con Dolby Atmos. La opción Android para la casa.', specs: ['Pantalla 11" a 90 Hz', '4 parlantes Dolby Atmos', '8 GB de RAM', 'Batería 7.040 mAh'] },

  { id: 'pb20', nombre: 'Power bank 20.000 mAh 22,5 W', marca: 'Xiaomi', familia: 'accesorios', precio: 89900, descuento: 0, stock: 14, orden: 16, glifo: 'battery', spec: '20.000', img: 'images/prod-powerbank.webp', foto: true, conector: 'universal', entrega: 'ambos', desc: 'Carga un celular tres veces y tiene salida rápida de 22,5 W. Entra en cualquier mochila.', specs: ['20.000 mAh reales', 'Salida rápida 22,5 W', 'Dos salidas USB + USB-C', 'Carga la notebook chica'] },
  { id: 'kitcarga', nombre: 'Kit de carga completo 33 W', marca: 'AltaGama', familia: 'accesorios', precio: 74900, descuento: 0, stock: 11, orden: 17, glifo: 'cable', spec: '33 W', img: 'images/accesorios-1x1.webp', foto: true, conector: 'usb-c', entrega: 'ambos', desc: 'Cargador de pared de 33 W, cable USB-C reforzado de 1 m y base de carga inalámbrica. Todo lo que necesita un equipo nuevo, junto.', specs: ['Cargador de pared 33 W', 'Cable USB-C trenzado 1 m', 'Base inalámbrica 15 W', 'Garantía de 6 meses'] },
  { id: 'cablelight', nombre: 'Cable USB-C a Lightning 1 m', marca: 'AltaGama', familia: 'accesorios', precio: 24900, descuento: 0, stock: 20, orden: 19, glifo: 'cable', spec: '1 m', img: null, foto: false, conector: 'lightning', entrega: 'ambos', desc: 'Cable trenzado certificado para carga rápida de iPhone 14 para atrás. Aguanta el tirón de la mochila.', specs: ['Certificado para carga rápida', 'Trenzado de nylon', '1 metro', 'Garantía de 6 meses'] },
  { id: 'vidrio9h', nombre: 'Vidrio templado 9H a medida', marca: 'AltaGama', familia: 'accesorios', precio: 18900, descuento: 20, stock: 25, orden: 20, glifo: 'shield', spec: '9H', img: null, foto: false, conector: 'universal', entrega: 'ambos', desc: 'Lo cortamos y lo colocamos para tu modelo en el momento, sin burbujas. Si sale mal, lo hacemos de nuevo.', specs: ['Dureza 9H', 'Colocación incluida', 'Para cualquier modelo', 'Borde reforzado'] },
  { id: 'fundaanti', nombre: 'Funda antigolpe reforzada', marca: 'AltaGama', familia: 'accesorios', precio: 22900, descuento: 0, stock: 18, orden: 21, glifo: 'shield', spec: 'MIL-STD', img: null, foto: false, conector: 'universal', entrega: 'ambos', desc: 'Esquinas reforzadas y borde alto para proteger la pantalla. La tenemos para los modelos que más se venden.', specs: ['Esquinas reforzadas', 'Borde alto sobre la pantalla', 'Agarre antideslizante', 'Para los modelos más vendidos'] }
];

const EQUIPOS = {
  apple: { label: 'Apple', modelos: [
    { id: 'ip16', label: 'iPhone 16 / 16 Plus', conector: 'usb-c' },
    { id: 'ip15', label: 'iPhone 15 / 15 Pro', conector: 'usb-c' },
    { id: 'ip14', label: 'iPhone 14 / 13', conector: 'lightning' },
    { id: 'ip12', label: 'iPhone 12 / 11', conector: 'lightning', viejo: true }
  ] },
  samsung: { label: 'Samsung', modelos: [
    { id: 's25', label: 'Galaxy S25 / S25 Ultra', conector: 'usb-c' },
    { id: 's23', label: 'Galaxy S23 / S24', conector: 'usb-c' },
    { id: 'a55', label: 'Galaxy A55 / A35', conector: 'usb-c' },
    { id: 'a16', label: 'Galaxy A16 / A06', conector: 'usb-c', viejo: true }
  ] },
  xiaomi: { label: 'Xiaomi', modelos: [
    { id: 'x14', label: 'Xiaomi 14 / 13', conector: 'usb-c' },
    { id: 'rn14', label: 'Redmi Note 14 / 13', conector: 'usb-c' },
    { id: 'rn11', label: 'Redmi Note 12 / 11', conector: 'usb-c', viejo: true },
    { id: 'poco', label: 'Poco X6 / X5', conector: 'usb-c' }
  ] },
  motorola: { label: 'Motorola', modelos: [
    { id: 'edge50', label: 'Edge 50 / 40', conector: 'usb-c' },
    { id: 'g84', label: 'Moto G84 / G73', conector: 'usb-c' },
    { id: 'g54', label: 'Moto G54 / G24', conector: 'usb-c' },
    { id: 'e14', label: 'Moto E14 / E13', conector: 'usb-c', viejo: true }
  ] }
};

const Cart = {
  KEY: 'altagamastore_cart',
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
    parent.querySelectorAll('[data-animate]').forEach((el, i) => { el.style.transitionDelay = Math.min(i * 0.08, 0.56) + 's'; });
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

function initFamilias() {
  document.querySelectorAll('[data-familias]').forEach(cont => {
    const modo = cont.dataset.familias;
    cont.innerHTML = FAMILIAS.map(f => (
      '<button type="button" class="fam fam--' + modo + '" data-familia="' + f.id + '" data-animate style="opacity:0;transform:translateY(22px)">' +
        '<span class="fam-media"><img src="' + f.img + '" alt="' + esc(f.nombre) + ' en AltaGama Store" width="600" height="600"></span>' +
        '<span class="fam-txt"><b>' + esc(f.nombre) + '</b>' + (modo === 'tarjeta' ? '<em>' + esc(f.bajada) + '</em>' : '') + '</span>' +
        (modo === 'tarjeta' ? '<span class="fam-link">Ver ' + esc(f.nombre.toLowerCase()) + ' ' + icono('flechaDer') + '</span>' : '') +
      '</button>'
    )).join('');
    cont.querySelectorAll('[data-familia]').forEach(b => b.addEventListener('click', () => {
      aplicarFamilia(b.dataset.familia);
    }));
  });
}

const Catalogo = {
  visibles: 16,
  orden: 'destacados',
  q: '',
  familias: new Set(),
  marcas: new Set(),
  precioMax: 3000000,
  soloOferta: false,
  compat: null
};

function productosFiltrados() {
  let lista = PRODUCTOS.slice();
  if (Catalogo.compat) lista = lista.filter(p => Catalogo.compat.includes(p.id));
  if (Catalogo.familias.size) lista = lista.filter(p => Catalogo.familias.has(p.familia));
  if (Catalogo.marcas.size) lista = lista.filter(p => Catalogo.marcas.has(p.marca));
  if (Catalogo.soloOferta) lista = lista.filter(p => p.descuento > 0);
  lista = lista.filter(p => precioFinal(p) <= Catalogo.precioMax);
  const q = normal(Catalogo.q).trim();
  if (q) {
    const palabras = q.split(/\s+/);
    lista = lista.filter(p => {
      const heno = normal([p.nombre, p.marca, p.familia, p.spec, p.desc, (p.specs || []).join(' ')].join(' '));
      return palabras.every(w => heno.includes(w));
    });
  }
  if (Catalogo.orden === 'menor') lista.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (Catalogo.orden === 'mayor') lista.sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (Catalogo.orden === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else lista.sort((a, b) => a.orden - b.orden);
  return lista;
}

function mediaProducto(p, clase) {
  if (p.foto && p.img) {
    return '<span class="prod-media ' + (clase || '') + '"><img src="' + p.img + '" alt="' + esc(p.nombre) + '" width="800" height="800"></span>';
  }
  return '<span class="prod-media prod-media--placa ' + (clase || '') + '">' +
    '<span class="placa-glifo">' + icono(p.glifo) + '</span>' +
    '<b class="placa-spec">' + esc(p.spec) + '</b>' +
    '<em class="placa-marca">' + esc(p.marca) + '</em></span>';
}

function cardProducto(p) {
  const fin = precioFinal(p);
  const precio = p.descuento > 0
    ? '<span class="prod-final">' + formatearPrecio(fin) + '</span><s>' + formatearPrecio(p.precio) + '</s>'
    : '<span class="prod-final">' + formatearPrecio(fin) + '</span>';
  return '<article class="prod" data-id="' + p.id + '" data-animate style="opacity:0;transform:translateY(26px)">' +
    '<button type="button" class="prod-abrir" data-ver="' + p.id + '" aria-label="Ver ' + esc(p.nombre) + '">' +
      mediaProducto(p) +
      (p.descuento > 0 ? '<span class="prod-badge">-' + p.descuento + '%</span>' : '') +
      (p.stock <= 3 ? '<span class="prod-badge prod-badge--stock">Quedan ' + p.stock + '</span>' : '') +
      '<span class="prod-ver">Vista rápida</span>' +
    '</button>' +
    '<div class="prod-body">' +
      '<span class="prod-marca">' + esc(p.marca) + '</span>' +
      '<h3 class="prod-nombre">' + esc(p.nombre) + '</h3>' +
      '<p class="prod-precio">' + precio + '</p>' +
      '<span class="prod-entrega">' + icono('camion') + 'Envío o entrega en mano</span>' +
    '</div>' +
    '<div class="prod-actions">' +
      '<span class="stepper"><button type="button" data-step="-1" aria-label="Quitar uno">−</button><output data-qty>1</output><button type="button" data-step="1" aria-label="Sumar uno">+</button></span>' +
      '<button type="button" class="btn btn--cta prod-add" data-add="' + p.id + '">Agregar<span class="lbl-largo"> al carrito</span></button>' +
    '</div>' +
  '</article>';
}

function renderCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const lista = productosFiltrados();
  const trozo = lista.slice(0, Catalogo.visibles);
  const vacio = document.getElementById('catalogoVacio');
  const cuenta = document.getElementById('catalogoCuenta');
  const mas = document.getElementById('catalogoMas');
  grid.innerHTML = trozo.map(cardProducto).join('');
  if (cuenta) cuenta.textContent = lista.length === 1 ? '1 producto' : lista.length + ' productos';
  if (vacio) vacio.hidden = lista.length > 0;
  if (mas) mas.hidden = lista.length <= Catalogo.visibles;
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
      const n = Math.max(1, Math.min(20, parseInt(out.textContent, 10) + parseInt(b.dataset.step, 10)));
      out.textContent = n;
    }));
  });
  revelarNuevos(grid);
  refrescar();
}

function aplicarFamilia(id) {
  Catalogo.compat = null;
  Catalogo.q = '';
  Catalogo.familias = new Set([id]);
  Catalogo.visibles = 16;
  document.querySelectorAll('[data-filtro-familia]').forEach(i => { i.checked = i.value === id; });
  const buscador = document.getElementById('catalogoBuscar');
  if (buscador) buscador.value = '';
  sincronizarChips();
  renderCatalogo();
  document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function sincronizarChips() {
  const cont = document.getElementById('catalogoActivos');
  if (!cont) return;
  const chips = [];
  if (Catalogo.compat) chips.push(['compat', 'Compatibles con tu equipo']);
  Catalogo.familias.forEach(f => chips.push(['familia:' + f, FAMILIAS.find(x => x.id === f)?.nombre || f]));
  Catalogo.marcas.forEach(m => chips.push(['marca:' + m, m]));
  if (Catalogo.soloOferta) chips.push(['oferta', 'En oferta']);
  if (Catalogo.precioMax < 3000000) chips.push(['precio', 'Hasta ' + formatearPrecio(Catalogo.precioMax)]);
  cont.innerHTML = chips.map(c => '<button type="button" class="chip-activo" data-quitar="' + c[0] + '">' + esc(c[1]) + ' ' + icono('cerrar') + '</button>').join('');
  cont.hidden = !chips.length;
  const limpiar = document.getElementById('catalogoLimpiar');
  if (limpiar) limpiar.hidden = !chips.length;
  cont.querySelectorAll('[data-quitar]').forEach(b => b.addEventListener('click', () => {
    const v = b.dataset.quitar;
    if (v === 'compat') Catalogo.compat = null;
    else if (v === 'oferta') { Catalogo.soloOferta = false; const el = document.getElementById('filtroOferta'); if (el) el.checked = false; }
    else if (v === 'precio') { Catalogo.precioMax = 3000000; const el = document.getElementById('filtroPrecio'); if (el) { el.value = el.max; pintarPrecio(); } }
    else if (v.startsWith('familia:')) { Catalogo.familias.delete(v.slice(8)); document.querySelectorAll('[data-filtro-familia]').forEach(i => { if (i.value === v.slice(8)) i.checked = false; }); }
    else if (v.startsWith('marca:')) { Catalogo.marcas.delete(v.slice(6)); document.querySelectorAll('[data-filtro-marca]').forEach(i => { if (i.value === v.slice(6)) i.checked = false; }); }
    Catalogo.visibles = 16;
    sincronizarChips();
    renderCatalogo();
  }));
}

function pintarPrecio() {
  const el = document.getElementById('filtroPrecio');
  const out = document.getElementById('filtroPrecioValor');
  if (!el || !out) return;
  const v = parseInt(el.value, 10);
  out.textContent = v >= parseInt(el.max, 10) ? 'Sin tope' : 'Hasta ' + formatearPrecio(v);
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;

  const cajaFamilias = document.getElementById('filtroFamilias');
  if (cajaFamilias) cajaFamilias.innerHTML = FAMILIAS.map(f => (
    '<label class="check"><input type="checkbox" data-filtro-familia value="' + f.id + '"><span>' + esc(f.nombre) + '</span><em>' + PRODUCTOS.filter(p => p.familia === f.id).length + '</em></label>'
  )).join('');

  const marcas = [...new Set(PRODUCTOS.map(p => p.marca))].sort((a, b) => a.localeCompare(b, 'es'));
  const cajaMarcas = document.getElementById('filtroMarcas');
  if (cajaMarcas) cajaMarcas.innerHTML = marcas.map(m => (
    '<label class="check"><input type="checkbox" data-filtro-marca value="' + esc(m) + '"><span>' + esc(m) + '</span><em>' + PRODUCTOS.filter(p => p.marca === m).length + '</em></label>'
  )).join('');

  document.querySelectorAll('[data-filtro-familia]').forEach(i => i.addEventListener('change', () => {
    i.checked ? Catalogo.familias.add(i.value) : Catalogo.familias.delete(i.value);
    Catalogo.visibles = 16; sincronizarChips(); renderCatalogo();
  }));
  document.querySelectorAll('[data-filtro-marca]').forEach(i => i.addEventListener('change', () => {
    i.checked ? Catalogo.marcas.add(i.value) : Catalogo.marcas.delete(i.value);
    Catalogo.visibles = 16; sincronizarChips(); renderCatalogo();
  }));

  const oferta = document.getElementById('filtroOferta');
  oferta?.addEventListener('change', () => { Catalogo.soloOferta = oferta.checked; Catalogo.visibles = 16; sincronizarChips(); renderCatalogo(); });

  const precio = document.getElementById('filtroPrecio');
  precio?.addEventListener('input', () => { Catalogo.precioMax = parseInt(precio.value, 10); pintarPrecio(); Catalogo.visibles = 16; sincronizarChips(); renderCatalogo(); });
  pintarPrecio();

  const buscar = document.getElementById('catalogoBuscar');
  let t = null;
  buscar?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { Catalogo.q = buscar.value; Catalogo.compat = null; Catalogo.visibles = 16; sincronizarChips(); renderCatalogo(); }, 180);
  });

  const orden = document.getElementById('catalogoOrden');
  orden?.addEventListener('change', () => { Catalogo.orden = orden.value; renderCatalogo(); });

  document.getElementById('catalogoMas')?.addEventListener('click', () => { Catalogo.visibles += 16; renderCatalogo(); });

  document.getElementById('catalogoLimpiar')?.addEventListener('click', limpiarFiltros);
  document.getElementById('catalogoVaciarBtn')?.addEventListener('click', limpiarFiltros);

  const toggleFiltros = document.getElementById('filtrosToggle');
  const panelFiltros = document.getElementById('filtrosPanel');
  toggleFiltros?.addEventListener('click', () => {
    const abierto = panelFiltros.classList.toggle('open');
    toggleFiltros.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    refrescar();
  });

  sincronizarChips();
  renderCatalogo();
}

function limpiarFiltros() {
  Catalogo.familias.clear(); Catalogo.marcas.clear();
  Catalogo.soloOferta = false; Catalogo.q = ''; Catalogo.compat = null; Catalogo.visibles = 16;
  Catalogo.precioMax = 3000000;
  document.querySelectorAll('[data-filtro-familia],[data-filtro-marca]').forEach(i => { i.checked = false; });
  const of = document.getElementById('filtroOferta'); if (of) of.checked = false;
  const pr = document.getElementById('filtroPrecio'); if (pr) { pr.value = pr.max; pintarPrecio(); }
  const bs = document.getElementById('catalogoBuscar'); if (bs) bs.value = '';
  sincronizarChips();
  renderCatalogo();
}

function initCompat() {
  const marca = document.getElementById('compatMarca');
  const modelo = document.getElementById('compatModelo');
  const salida = document.getElementById('compatSalida');
  if (!marca || !modelo || !salida) return;

  marca.innerHTML = '<option value="">Elegí la marca</option>' + Object.keys(EQUIPOS).map(k => '<option value="' + k + '">' + esc(EQUIPOS[k].label) + '</option>').join('');

  const resetModelos = () => {
    const m = EQUIPOS[marca.value];
    modelo.disabled = !m;
    modelo.innerHTML = m
      ? '<option value="">Elegí el modelo</option>' + m.modelos.map(x => '<option value="' + x.id + '">' + esc(x.label) + '</option>').join('')
      : '<option value="">Elegí primero la marca</option>';
  };

  const pintar = () => {
    const fam = EQUIPOS[marca.value];
    const mod = fam?.modelos.find(x => x.id === modelo.value);
    if (!fam || !mod) { salida.innerHTML = ''; salida.hidden = true; refrescar(); return; }

    const compatibles = PRODUCTOS.filter(p => {
      if (p.familia === 'accesorios') return p.conector === 'universal' || p.conector === mod.conector;
      if (p.familia === 'audio') return true;
      if (p.familia === 'relojes') return (p.paraMarcas || []).includes(fam.label);
      return false;
    });
    const carga = PRODUCTOS.find(p => p.familia === 'accesorios' && p.conector === mod.conector);
    const reloj = PRODUCTOS.find(p => p.familia === 'relojes' && (p.paraMarcas || []).includes(fam.label));
    const upgrades = mod.viejo ? PRODUCTOS.filter(p => p.familia === 'celulares' && p.marca === fam.label).slice(0, 2) : [];
    const conectorTxt = mod.conector === 'usb-c' ? 'USB-C' : 'Lightning';
    const pick = (p, rotulo) => p
      ? '<button type="button" class="compat-pick" data-pick="' + p.id + '">' +
          '<span class="compat-pick-k">' + rotulo + '</span>' +
          '<b>' + esc(p.nombre) + '</b>' +
          '<em>' + formatearPrecio(precioFinal(p)) + ' · Sumar al carrito</em>' +
        '</button>'
      : '';

    salida.hidden = false;
    salida.innerHTML =
      '<div class="compat-dato">' +
        '<span class="compat-dato-k">Tu ' + esc(mod.label) + ' carga por</span>' +
        '<b class="compat-dato-v">' + conectorTxt + '</b>' +
      '</div>' +
      '<div class="compat-picks">' + pick(carga, 'La carga que le va') + pick(reloj, 'El reloj que se le sincroniza') + '</div>' +
      '<p class="compat-linea">En total hay <b>' + compatibles.length + '</b> productos de la tienda que le sirven a ese equipo.</p>' +
      (upgrades.length
        ? '<p class="compat-linea compat-linea--alt">Ese modelo ya tiene unos años. Si querés cambiarlo, en ' + esc(fam.label) + ' tenemos ' +
          upgrades.map(u => '<b>' + esc(u.nombre.replace(/ \d+ GB$/, '')) + '</b>').join(' y ') + '.</p>'
        : '') +
      '<div class="compat-acciones">' +
        '<button type="button" class="btn btn--cta" id="compatVer">Ver los ' + compatibles.length + ' compatibles</button>' +
        '<a class="btn btn--fantasma" href="' + waLink('Hola AltaGama! Tengo un ' + mod.label + '. Quiero saber qué le sirve.') + '" target="_blank" rel="noopener">Consultar por WhatsApp</a>' +
      '</div>';

    salida.querySelectorAll('[data-pick]').forEach(b => b.addEventListener('click', () => {
      const p = getProducto(b.dataset.pick);
      if (!p) return;
      Cart.add(p, 1);
      showToast(p.nombre + ' está en el carrito');
    }));

    document.getElementById('compatVer')?.addEventListener('click', () => {
      Catalogo.compat = compatibles.map(p => p.id);
      Catalogo.familias.clear(); Catalogo.marcas.clear(); Catalogo.q = '';
      Catalogo.soloOferta = false; Catalogo.visibles = 16;
      document.querySelectorAll('[data-filtro-familia],[data-filtro-marca]').forEach(i => { i.checked = false; });
      const bs = document.getElementById('catalogoBuscar'); if (bs) bs.value = '';
      sincronizarChips();
      renderCatalogo();
      document.getElementById('catalogoGrid')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
    refrescar();
  };

  marca.addEventListener('change', () => { resetModelos(); pintar(); });
  modelo.addEventListener('change', pintar);
  resetModelos();
}

let escenaFocoPrev = null;
function initEscena() {
  const escena = document.getElementById('escena');
  if (!escena) return;
  const foto = document.getElementById('escenaFoto');
  const num = document.getElementById('escenaNum');
  const ficha = document.getElementById('escenaFicha');
  const barra = document.getElementById('escenaBarra');
  const total = PRODUCTOS.length;
  const destacado = getProducto('s25u');
  const OFF = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;

  const anchoMin = () => window.innerWidth <= 720 ? 64 : 32;
  const ratioIni = 9 / 16;
  const ratioFin = () => window.innerWidth <= 720 ? 3 / 4 : 16 / 10;

  const pintar = p => {
    const w = anchoMin() + (100 - anchoMin()) * p;
    foto.style.width = w.toFixed(2) + '%';
    foto.style.aspectRatio = (ratioIni + (ratioFin() - ratioIni) * p).toFixed(4);
    foto.style.borderRadius = (20 - 20 * p).toFixed(1) + 'px';
    if (num) num.textContent = String(Math.max(1, Math.round(1 + (total - 1) * p))).padStart(2, '0');
    if (barra) barra.style.transform = 'scaleX(' + Math.max(0.02, p).toFixed(3) + ')';
    escena.classList.toggle('escena--final', p > 0.82);
  };

  if (reduceMotion) { pintar(1); }
  else {
    let ticking = false;
    const tick = () => {
      ticking = false;
      const r = escena.getBoundingClientRect();
      const recorrido = escena.offsetHeight - (window.innerHeight - OFF());
      if (recorrido <= 0) { pintar(1); return; }
      const p = Math.min(1, Math.max(0, (OFF() - r.top) / recorrido));
      pintar(p);
    };
    const pedir = () => { if (!ticking) { ticking = true; requestAnimationFrame(tick); } };
    window.addEventListener('scroll', pedir, { passive: true });
    window.addEventListener('resize', pedir, { passive: true });
    pintar(0);
    requestAnimationFrame(tick);
  }

  if (ficha && destacado) {
    ficha.querySelector('[data-escena-precio]') && (ficha.querySelector('[data-escena-precio]').textContent = formatearPrecio(precioFinal(destacado)));
    ficha.querySelector('[data-escena-add]')?.addEventListener('click', () => {
      Cart.add(destacado, 1);
      showToast(destacado.nombre + ' está en el carrito');
    });
    ficha.querySelector('[data-escena-todo]')?.addEventListener('click', () => {
      limpiarFiltros();
      document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }
}

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
  escenaFocoPrev = document.activeElement;
  const fin = precioFinal(p);
  const relacionados = PRODUCTOS.filter(x => x.familia === p.familia && x.id !== p.id).slice(0, 3);
  cuerpo.innerHTML =
    '<div class="vista-media">' + mediaProducto(p, 'prod-media--grande') + (p.descuento > 0 ? '<span class="prod-badge">-' + p.descuento + '%</span>' : '') + '</div>' +
    '<div class="vista-info">' +
      '<span class="prod-marca">' + esc(p.marca) + '</span>' +
      '<h3>' + esc(p.nombre) + '</h3>' +
      '<p class="prod-precio prod-precio--grande">' + (p.descuento > 0 ? '<span class="prod-final">' + formatearPrecio(fin) + '</span><s>' + formatearPrecio(p.precio) + '</s>' : '<span class="prod-final">' + formatearPrecio(fin) + '</span>') + '</p>' +
      '<p class="vista-desc">' + esc(p.desc) + '</p>' +
      '<ul class="vista-specs">' + (p.specs || []).map(s => '<li>' + icono('check') + esc(s) + '</li>').join('') + '</ul>' +
      '<p class="vista-entrega">' + icono('camion') + 'Envío a todo el país o entrega en mano en Jujuy · Quedan ' + p.stock + ' en stock</p>' +
      '<div class="vista-acciones">' +
        '<span class="stepper"><button type="button" data-step="-1" aria-label="Quitar uno">−</button><output data-qty>1</output><button type="button" data-step="1" aria-label="Sumar uno">+</button></span>' +
        '<button type="button" class="btn btn--cta" data-vista-add>Agregar al carrito</button>' +
        '<button type="button" class="btn btn--linea" data-vista-comprar>Comprar ahora</button>' +
      '</div>' +
      (relacionados.length ? '<div class="vista-rel"><h4>También te puede interesar</h4><div class="vista-rel-lista">' + relacionados.map(r =>
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
  escenaFocoPrev?.focus?.();
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
  const vacio = document.getElementById('cartVacio');
  const pie = document.getElementById('cartPie');
  const total = document.getElementById('cartTotal');
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
  if (vacio) vacio.hidden = items.length > 0;
  if (pie) pie.hidden = items.length === 0;
  if (total) total.textContent = formatearPrecio(Cart.total());
  lista.querySelectorAll('[data-cart-step]').forEach(b => b.addEventListener('click', () => {
    const it = Cart.get().find(x => x.id === b.dataset.id);
    Cart.setQty(b.dataset.id, (it?.qty || 1) + parseInt(b.dataset.cartStep, 10));
    if ((it?.qty || 1) + parseInt(b.dataset.cartStep, 10) < 1) Cart.remove(b.dataset.id);
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

function initBuscadorHero() {
  const form = document.getElementById('heroBuscar');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    limpiarFiltros();
    Catalogo.q = input.value;
    const bs = document.getElementById('catalogoBuscar');
    if (bs) bs.value = input.value;
    sincronizarChips();
    renderCatalogo();
    document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
  form.querySelectorAll('[data-sugerencia]').forEach(b => b.addEventListener('click', () => {
    const input = form.querySelector('input');
    input.value = b.dataset.sugerencia;
    form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', { cancelable: true }));
  }));
}

function initHeroMovimiento() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const fondo = document.querySelector('[data-hero-fondo]');
  if (fondo) {
    gsap.fromTo(fondo, { scale: 1.08 }, { scale: 1, duration: 1.4, ease: 'power2.out' });
    gsap.to(fondo, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: fondo.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
  }
  document.querySelectorAll('[data-filo]').forEach(el => {
    gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' } });
  });
}

function initAnio() {
  document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = new Date().getFullYear(); });
}

document.addEventListener('DOMContentLoaded', () => {
  initFamilias();
  initCatalogo();
  initCompat();
  initEscena();
  initVista();
  initCarrito();
  initReveals();
  initNav();
  initFloats();
  initBuscadorHero();
  initHeroMovimiento();
  initAnio();
});
