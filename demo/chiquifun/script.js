document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491126282907';
const ENVIO_GRATIS_DESDE = 250000;
const POR_PAGINA = 12;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const wa = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const redondear = n => Math.round(n / 100) * 100;

const MULT = { auto: 1, suv: 1.14, pickup: 1.22 };
const TIPO_LABEL = { auto: 'Auto', suv: 'SUV', pickup: 'Camioneta' };

const IMG_DIM = {
  'apoyacervicales-ergonomicos_1x1': [1254, 1254],
  'butacas-con-apoyacervicales_4x5': [1122, 1402],
  'cobertor-de-auto-premium_1x1': [1254, 1254],
  'fundas-delanteras-a-medida_1x1': [1254, 1254],
  'fundas-traseras-a-medida_1x1': [1254, 1254],
  'instalacion-de-funda-a-medida_9x16': [941, 1672],
  'interior-automotriz-premium_2.8x1': [1920, 686],
  'piso-termoformado-de-baul_1x1': [1254, 1254],
  'piso-termoformado-delantero_1x1': [1254, 1254],
  'taller-de-personalizacion-automotriz_5x3': [1619, 971],
  'p-funda-butaca-delantera': [700, 700],
  'p-funda-butaca-trasera': [700, 700],
  'p-funda-confort': [622, 622],
  'p-piso-detalle': [800, 800],
  'p-cobertor-detalle': [700, 700],
  'p-cervical-detalle': [600, 600],
  'p-cervical-sport': [620, 620],
  'p-combo-mesa': [750, 411],
  'p-combo-taller': [648, 500],
  'cut-cobertor': [1254, 800],
  'cut-piso': [677, 621],
};
const dim = k => IMG_DIM[k] || [700, 700];
const attrDim = k => { const [w, h] = dim(k); return `width="${w}" height="${h}"`; };

const VEHICULOS = {
  'Chevrolet': { 'Onix': 'auto', 'Cruze': 'auto', 'Prisma': 'auto', 'Tracker': 'suv', 'Spin': 'suv', 'S10': 'pickup' },
  'Citroën': { 'C3': 'auto', 'C4 Cactus': 'suv', 'Berlingo': 'pickup' },
  'Fiat': { 'Cronos': 'auto', 'Argo': 'auto', 'Mobi': 'auto', 'Pulse': 'suv', 'Toro': 'pickup', 'Fiorino': 'pickup' },
  'Ford': { 'Ka': 'auto', 'Focus': 'auto', 'EcoSport': 'suv', 'Territory': 'suv', 'Ranger': 'pickup' },
  'Honda': { 'City': 'auto', 'Civic': 'auto', 'HR-V': 'suv', 'WR-V': 'suv' },
  'Jeep': { 'Renegade': 'suv', 'Compass': 'suv' },
  'Nissan': { 'Versa': 'auto', 'Kicks': 'suv', 'Frontier': 'pickup' },
  'Peugeot': { '208': 'auto', '308': 'auto', '2008': 'suv', 'Partner': 'pickup' },
  'Renault': { 'Sandero': 'auto', 'Logan': 'auto', 'Kwid': 'auto', 'Duster': 'suv', 'Kangoo': 'pickup', 'Alaskan': 'pickup' },
  'Toyota': { 'Etios': 'auto', 'Yaris': 'auto', 'Corolla': 'auto', 'Corolla Cross': 'suv', 'SW4': 'suv', 'Hilux': 'pickup' },
  'Volkswagen': { 'Gol Trend': 'auto', 'Polo': 'auto', 'Virtus': 'auto', 'T-Cross': 'suv', 'Taos': 'suv', 'Amarok': 'pickup' },
  'Otra marca': { 'Auto chico o mediano': 'auto', 'SUV': 'suv', 'Camioneta o utilitario': 'pickup' },
};

const COSTURAS = [
  { id: 'Rojo', hex: '#e22400' },
  { id: 'Gris', hex: '#8b8b93' },
  { id: 'Negro', hex: '#1a1a1a' },
  { id: 'Amarillo', hex: '#f5ec00' },
];

const CATEGORIAS = [
  { id: 'fundas', nombre: 'Fundas a medida', bajada: 'Tipo tapizado', img: 'fundas-delanteras-a-medida_1x1' },
  { id: 'pisos', nombre: 'Pisos termoformados', bajada: 'Bandeja rígida', img: 'piso-termoformado-delantero_1x1' },
  { id: 'cobertores', nombre: 'Cobertores', bajada: 'Exterior e interior', img: 'cobertor-de-auto-premium_1x1' },
  { id: 'cervicales', nombre: 'Apoya cervicales', bajada: 'Ergonómicos', img: 'p-cervical-detalle' },
  { id: 'combos', nombre: 'Combos', bajada: 'Todo el interior', img: 'p-combo-mesa' },
];

const PRODUCTOS = [
  {
    id: 'funda-cuero-juego', nombre: 'Funda Línea Cuero Premium — Juego completo', cat: 'fundas',
    precio: 528000, descuento: 0, stock: 14, destacado: true, badge: 'Más vendido', costura: true,
    img: 'fundas-delanteras-a-medida_1x1',
    imgs: ['fundas-delanteras-a-medida_1x1', 'fundas-traseras-a-medida_1x1', 'p-funda-butaca-delantera'],
    desc: 'Butacas delanteras y banqueta trasera en cuero ecológico de 1,2 mm, con panel central matelaseado y vivo de color. Cortada con el molde exacto de tu modelo: calza tensada, sin arrugas ni gomas a la vista.',
    specs: ['Cuero ecológico de 1,2 mm tratado contra rayos UV', 'Panel matelaseado con relleno de 8 mm', 'Aberturas para airbags laterales y apoyabrazos', 'Se limpia con paño húmedo, no destiñe'],
  },
  {
    id: 'funda-cuero-del', nombre: 'Funda Línea Cuero Premium — Butacas delanteras', cat: 'fundas',
    precio: 349000, descuento: 0, stock: 22, destacado: false, badge: '', costura: true,
    img: 'p-funda-butaca-delantera',
    imgs: ['p-funda-butaca-delantera', 'fundas-delanteras-a-medida_1x1'],
    desc: 'Solo las dos butacas de adelante, en el mismo cuero ecológico de la línea Premium. Ideal si atrás casi no viaja nadie y querés renovar lo que se ve todos los días.',
    specs: ['Incluye funda de apoyacabezas', 'Compatible con butacas con regulación eléctrica', 'Aberturas para airbags laterales', 'Colocación en 40 minutos'],
  },
  {
    id: 'funda-rombo-juego', nombre: 'Funda Línea Rombo Sport — Juego completo', cat: 'fundas',
    precio: 482000, descuento: 0, stock: 11, destacado: false, badge: '', costura: true,
    img: 'butacas-con-apoyacervicales_4x5',
    imgs: ['butacas-con-apoyacervicales_4x5', 'p-funda-confort', 'fundas-traseras-a-medida_1x1'],
    desc: 'La versión deportiva: rombo matelaseado en el panel central, laterales perforados y doble costura al tono. Juego completo, delanteras y traseras.',
    specs: ['Rombo matelaseado cosido punto por punto', 'Laterales perforados que ventilan en verano', 'Doble costura reforzada en zonas de roce', 'Incluye fundas de apoyacabezas'],
  },
  {
    id: 'funda-rombo-tra', nombre: 'Funda Línea Rombo Sport — Asiento trasero', cat: 'fundas',
    precio: 268000, descuento: 0, stock: 18, destacado: false, badge: '', costura: true,
    img: 'fundas-traseras-a-medida_1x1',
    imgs: ['fundas-traseras-a-medida_1x1', 'p-funda-butaca-trasera'],
    desc: 'Banqueta trasera completa, con respaldo rebatible 60/40 respetado y pasajes para los cinturones. La parte que más sufre con chicos y mascotas.',
    specs: ['Respeta el rebatible 60/40', 'Pasajes para cinturones y anclajes ISOFIX', 'Base antideslizante con tanza de ajuste', 'Se saca para lavar en 5 minutos'],
  },
  {
    id: 'funda-confort', nombre: 'Funda Línea Confort Perforada — Juego completo', cat: 'fundas',
    precio: 415000, descuento: 10, stock: 9, destacado: true, badge: '', costura: true,
    img: 'p-funda-confort',
    imgs: ['p-funda-confort', 'butacas-con-apoyacervicales_4x5'],
    desc: 'Cuero perforado en toda la superficie de contacto: transpira mucho más que el liso y no quema al sol. La opción que más eligen los que hacen ruta.',
    specs: ['Perforado total en asiento y respaldo', 'Relleno de 6 mm, más blando que la línea Premium', 'Aberturas para airbags laterales', 'Apto para butacas con calefacción'],
  },
  {
    id: 'piso-delantero', nombre: 'Piso termoformado delantero (par)', cat: 'pisos',
    precio: 124000, descuento: 0, stock: 30, destacado: false, badge: '', costura: false,
    img: 'piso-termoformado-delantero_1x1',
    imgs: ['piso-termoformado-delantero_1x1', 'p-piso-detalle'],
    desc: 'Bandeja rígida termoformada con el contorno exacto del piso de tu modelo. Borde alto que contiene el agua, la tierra y lo que se te vuelque adentro.',
    specs: ['Termoformado en TPE, no se agrieta con el frío', 'Borde perimetral de 4 cm', 'Encastra en los anclajes originales', 'Se enjuaga con manguera'],
  },
  {
    id: 'piso-baul', nombre: 'Piso termoformado de baúl', cat: 'pisos',
    precio: 138000, descuento: 0, stock: 21, destacado: false, badge: '', costura: false,
    img: 'piso-termoformado-de-baul_1x1',
    imgs: ['piso-termoformado-de-baul_1x1'],
    desc: 'Cubre todo el baúl de pared a pared, con borde levantado. Pensado para el que carga herramienta, changuito, bolsos de gimnasio o al perro.',
    specs: ['Cubre piso y arranque de los laterales', 'Borde de 5 cm que contiene líquidos', 'Superficie antideslizante', 'Se saca de una pieza'],
  },
  {
    id: 'piso-kit', nombre: 'Kit completo de pisos termoformados', cat: 'pisos',
    precio: 289000, descuento: 8, stock: 12, destacado: true, badge: '', costura: false,
    img: 'p-piso-detalle',
    imgs: ['p-piso-detalle', 'piso-termoformado-delantero_1x1', 'piso-termoformado-de-baul_1x1'],
    desc: 'Delanteros, traseros y baúl en un solo pedido. Todo el piso del auto cubierto con la misma bandeja rígida y el mismo dibujo.',
    specs: ['5 piezas: 2 delanteras, 2 traseras y baúl', 'Mismo molde que los originales de fábrica', 'Encastra en los anclajes del vehículo', 'Ahorro del 8% contra comprarlos sueltos'],
  },
  {
    id: 'cobertor-auto', nombre: 'Cobertor exterior Premium — Auto', cat: 'cobertores',
    precio: 186000, descuento: 0, stock: 16, destacado: true, badge: '', costura: false,
    img: 'cobertor-de-auto-premium_1x1',
    imgs: ['cobertor-de-auto-premium_1x1', 'p-cobertor-detalle'],
    desc: 'Cobertor exterior para autos chicos y medianos, con vivo reflectivo y forro interior que no raya la pintura. Elástico en los bordes para que no se vuele.',
    specs: ['Tela tricapa impermeable y respirable', 'Forro interior de microfibra', 'Elástico perimetral y correa de sujeción', 'Bolsa de guardado incluida'],
  },
  {
    id: 'cobertor-suv', nombre: 'Cobertor exterior Premium — SUV y camioneta', cat: 'cobertores',
    precio: 224000, descuento: 0, stock: 13, destacado: false, badge: '', costura: false,
    img: 'p-cobertor-detalle',
    imgs: ['p-cobertor-detalle', 'cobertor-de-auto-premium_1x1'],
    desc: 'El mismo cobertor tricapa en talle grande, con bolsillos para los espejos y refuerzo en el techo. Para SUV, camionetas y utilitarios.',
    specs: ['Bolsillos moldeados para espejos', 'Refuerzo extra en techo y capot', 'Elástico perimetral y correa de sujeción', 'Bolsa de guardado incluida'],
  },
  {
    id: 'cervical-par', nombre: 'Apoya cervical ergonómico (par)', cat: 'cervicales',
    precio: 46000, descuento: 0, stock: 40, destacado: true, badge: '', costura: true, universal: true,
    img: 'p-cervical-detalle',
    imgs: ['p-cervical-detalle', 'apoyacervicales-ergonomicos_1x1'],
    desc: 'Par de apoya cervicales con memory foam y funda de cuero perforado. Se ajustan con elástico a cualquier apoyacabezas, sin herramientas.',
    specs: ['Memory foam de alta densidad', 'Funda de cuero perforado desmontable', 'Elástico regulable, entra en cualquier butaca', 'Vienen de a dos'],
  },
  {
    id: 'cervical-lumbar', nombre: 'Combo apoya cervical + apoya lumbar', cat: 'cervicales',
    precio: 78000, descuento: 0, stock: 24, destacado: false, badge: '', costura: true, universal: true,
    img: 'apoyacervicales-ergonomicos_1x1',
    imgs: ['apoyacervicales-ergonomicos_1x1', 'p-cervical-sport'],
    desc: 'Para el que maneja muchas horas: el cervical más el apoyo lumbar que sostiene la curva de la espalda. Los dos con la misma terminación de tu funda.',
    specs: ['Cervical + lumbar del mismo cuero', 'Memory foam de alta densidad', 'Correas de ajuste al respaldo', 'Se puede pedir al tono de la funda'],
  },
  {
    id: 'cervical-rombo', nombre: 'Apoya cervical Línea Rombo Sport (par)', cat: 'cervicales',
    precio: 52000, descuento: 0, stock: 28, destacado: false, badge: '', costura: true, universal: true,
    img: 'p-cervical-sport',
    imgs: ['p-cervical-sport', 'butacas-con-apoyacervicales_4x5'],
    desc: 'La versión con rombo matelaseado, para que combine con la funda Línea Rombo Sport. Mismo relleno, misma costura.',
    specs: ['Rombo matelaseado al tono de la funda', 'Memory foam de alta densidad', 'Elástico regulable', 'Vienen de a dos'],
  },
  {
    id: 'combo-auto-nuevo', nombre: 'Combo Auto Nuevo — Fundas + pisos delanteros', cat: 'combos',
    precio: 735000, descuento: 12, stock: 8, destacado: true, badge: 'Combo', costura: true,
    img: 'p-combo-mesa',
    imgs: ['p-combo-mesa', 'fundas-delanteras-a-medida_1x1', 'piso-termoformado-delantero_1x1'],
    desc: 'Lo que pide el que acaba de comprar el auto: juego completo de fundas Línea Cuero Premium más el par de pisos termoformados delanteros. Todo cortado para el mismo modelo.',
    specs: ['Juego completo de fundas Línea Cuero Premium', 'Par de pisos termoformados delanteros', 'Colocación de las dos cosas en una sola visita', '12% de ahorro contra comprarlo suelto'],
  },
  {
    id: 'combo-taller', nombre: 'Combo Taller Completo — Todo el interior', cat: 'combos',
    precio: 986000, descuento: 15, stock: 5, destacado: false, badge: 'Combo', costura: true,
    img: 'p-combo-taller',
    imgs: ['p-combo-taller', 'interior-automotriz-premium_2.8x1', 'p-combo-mesa'],
    desc: 'El auto entero en un solo pedido: fundas completas, kit de pisos, cobertor exterior y el par de apoya cervicales. Entrás con el auto de fábrica y salís con otro.',
    specs: ['Fundas Línea Cuero Premium, juego completo', 'Kit completo de pisos termoformados', 'Cobertor exterior Premium del talle de tu auto', 'Par de apoya cervicales ergonómicos'],
  },
];

const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const nombreCat = id => getCategoria(id)?.nombre || '';

const Auto = {
  KEY: 'chiquifun_auto',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || null; } catch { return null; } },
  set(v) { localStorage.setItem(this.KEY, JSON.stringify(v)); document.dispatchEvent(new CustomEvent('auto:updated')); },
  clear() { localStorage.removeItem(this.KEY); document.dispatchEvent(new CustomEvent('auto:updated')); },
  texto() { const a = this.get(); return a ? `${a.marca} ${a.modelo} ${a.anio}` : ''; },
};

const precioVehiculo = p => {
  const a = Auto.get();
  if (!a || p.universal) return p.precio;
  return redondear(p.precio * (MULT[a.tipo] || 1));
};
const precioFinal = p => {
  const base = precioVehiculo(p);
  return p.descuento > 0 ? redondear(base * (1 - p.descuento / 100)) : base;
};

const Cart = {
  KEY: 'chiquifun_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, variante = null) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.variante === variante);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, variante, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, variante, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.variante === variante);
    if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99));
    this.save(items);
  },
  remove(id, variante) { this.save(this.get().filter(i => !(i.id === id && i.variante === variante))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const Wish = {
  KEY: 'chiquifun_wishlist',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const l = this.get();
    const i = l.indexOf(id);
    if (i > -1) l.splice(i, 1); else l.push(id);
    localStorage.setItem(this.KEY, JSON.stringify(l));
    return i === -1;
  },
};

const Vistos = {
  KEY: 'chiquifun_vistos',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  push(id) {
    const l = this.get().filter(x => x !== id);
    l.unshift(id);
    localStorage.setItem(this.KEY, JSON.stringify(l.slice(0, 8)));
  },
};

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap !== 'undefined' && typeof Flip !== 'undefined') gsap.registerPlugin(Flip);
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
  document.querySelectorAll('[data-hero]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  document.getElementById('mesa')?.classList.add('is-static');
}
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

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

const ICO_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
const ICO_CORAZON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linejoin="round"><path d="M12 20s-7.2-4.4-9.1-8.6C1.4 8 3.2 4.6 6.6 4.2c2-.25 3.8.7 5.4 2.8 1.6-2.1 3.4-3.05 5.4-2.8 3.4.4 5.2 3.8 3.7 7.2C19.2 15.6 12 20 12 20z"/></svg>';
const ICO_CARRITO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';

function bloqueCompat(p) {
  const a = Auto.get();
  if (p.universal) return `<span class="card-compat">${ICO_CHECK}Entra en cualquier butaca</span>`;
  if (!a) return '';
  return `<span class="card-compat">${ICO_CHECK}Cortado para tu ${esc(a.modelo)} ${esc(a.anio)}</span>`;
}

function bloquePrecio(p, clase = 'card-precio') {
  const a = Auto.get();
  const final = precioFinal(p);
  const desde = (!a && !p.universal) ? '<span class="card-desde">desde</span>' : '';
  const tachado = p.descuento > 0 ? `<s>${formatearPrecio(precioVehiculo(p))}</s>` : '';
  return `<div class="${clase}">${desde}<b>${formatearPrecio(final)}</b>${tachado}</div>`;
}

function badgeDe(p) {
  if (p.descuento > 0) return `<span class="card-badge es-off">-${p.descuento}%</span>`;
  if (p.badge) return `<span class="card-badge">${esc(p.badge)}</span>`;
  if (p.stock <= 8) return `<span class="card-badge">Últimas ${p.stock}</span>`;
  return '';
}

function cardHTML(p) {
  return `<li class="pieza" data-cat="${p.cat}" data-id="${p.id}">
    <article class="card">
      <div class="card-media">
        ${badgeDe(p)}
        <button type="button" class="card-fav${Wish.has(p.id) ? ' is-on' : ''}" data-fav="${p.id}" aria-label="Guardar ${esc(p.nombre)} en favoritos">${ICO_CORAZON}</button>
        <img src="images/${p.img}.webp" alt="${esc(p.nombre)}" ${attrDim(p.img)} loading="lazy">
        <button type="button" class="card-ver" data-abrir="${p.id}">Ver detalle y variantes</button>
      </div>
      <div class="card-cuerpo">
        <span class="card-cat">${esc(nombreCat(p.cat))}</span>
        <button type="button" class="card-nombre" data-abrir="${p.id}">${esc(p.nombre)}</button>
        ${bloqueCompat(p)}
        ${bloquePrecio(p)}
        <div class="card-acciones">
          <div class="stepper" data-stepper="${p.id}">
            <button type="button" data-paso="-1" aria-label="Restar cantidad">−</button>
            <span data-qty="1">1</span>
            <button type="button" data-paso="1" aria-label="Sumar cantidad">+</button>
          </div>
          <button type="button" class="card-add" data-add="${p.id}">Agregar</button>
        </div>
      </div>
    </article>
  </li>`;
}

let revelarNuevos = () => {};

function renderDestacados() {
  const grid = document.getElementById('gridDestacados');
  if (!grid) return;
  grid.innerHTML = PRODUCTOS.filter(p => p.destacado).map(p => {
    const li = cardHTML(p);
    return li.replace('<li class="pieza"', '<li class="pieza" data-animate="up" style="opacity:0;transform:translateY(34px)"');
  }).join('');
  revelarNuevos(grid);
}

function renderRail() {
  const rail = document.getElementById('railCategorias');
  if (!rail) return;
  rail.innerHTML = CATEGORIAS.map((c, i) => {
    const n = PRODUCTOS.filter(p => p.cat === c.id).length;
    return `<li><a class="rail-card" href="#catalogo" data-cat-link="${c.id}">
      <span class="rail-num">0${i + 1}</span>
      <img src="images/${c.img}.webp" alt="${esc(c.nombre)}" ${attrDim(c.img)} loading="lazy">
      <span class="rail-info"><b>${esc(c.nombre)}</b><span>${esc(c.bajada)} · ${n} ${n === 1 ? 'producto' : 'productos'}</span></span>
    </a></li>`;
  }).join('');
}

const estado = { cat: 'todos', q: '', orden: 'destacados', visibles: POR_PAGINA };

function filtrados() {
  const q = normalizar(estado.q).trim();
  let lista = PRODUCTOS.filter(p => {
    if (estado.cat !== 'todos' && p.cat !== estado.cat) return false;
    if (!q) return true;
    const heno = normalizar(`${p.nombre} ${nombreCat(p.cat)} ${p.desc} ${p.specs.join(' ')}`);
    return q.split(/\s+/).every(t => heno.includes(t));
  });
  if (estado.orden === 'precio-asc') lista = lista.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estado.orden === 'precio-desc') lista = lista.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (estado.orden === 'nombre') lista = lista.slice().sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else lista = lista.slice().sort((a, b) => (b.destacado === true) - (a.destacado === true));
  return lista;
}

function renderCatalogo(conFlip = false) {
  const grid = document.getElementById('gridCatalogo');
  const vacio = document.getElementById('vacioCatalogo');
  const btnMas = document.getElementById('btnVerMas');
  const res = document.getElementById('resultados');
  if (!grid) return;

  const lista = filtrados();
  const mostrar = lista.slice(0, estado.visibles);
  const usaFlip = conFlip && typeof Flip !== 'undefined' && typeof gsap !== 'undefined' && !reduceMotion;
  const state = usaFlip ? Flip.getState(grid.querySelectorAll('.pieza')) : null;

  grid.innerHTML = mostrar.map(cardHTML).join('');
  vacio.hidden = lista.length > 0;
  grid.hidden = lista.length === 0;
  btnMas.hidden = lista.length <= estado.visibles;
  res.textContent = lista.length === 0 ? '' : `${lista.length} ${lista.length === 1 ? 'producto' : 'productos'}${estado.cat !== 'todos' ? ' en ' + nombreCat(estado.cat) : ''}${estado.q ? ` para “${estado.q}”` : ''}`;

  if (usaFlip && state) {
    Flip.from(state, {
      duration: 0.5, ease: 'power2.out', stagger: 0.012, absolute: true,
      onEnter: els => gsap.fromTo(els, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.03 }),
      onLeave: els => gsap.to(els, { opacity: 0, duration: 0.2 }),
    });
  } else if (typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.fromTo(grid.querySelectorAll('.pieza'), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.035, ease: 'power2.out' });
  }
  if (typeof ScrollTrigger !== 'undefined') setTimeout(() => ScrollTrigger.refresh(), 560);
}

function initChips() {
  const cont = document.getElementById('chipsCategoria');
  if (!cont) return;
  cont.innerHTML = `<button type="button" class="chip is-on" data-chip="todos" aria-pressed="true">Todos <b>${PRODUCTOS.length}</b></button>` +
    CATEGORIAS.map(c => {
      const n = PRODUCTOS.filter(p => p.cat === c.id).length;
      return `<button type="button" class="chip" data-chip="${c.id}" aria-pressed="false">${esc(c.nombre)} <b>${n}</b></button>`;
    }).join('');
}

function marcarChip(cat) {
  document.querySelectorAll('.chip').forEach(b => {
    const on = b.dataset.chip === cat;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

function initCatalogoUI() {
  const buscar = document.getElementById('inputBuscar');
  const orden = document.getElementById('selOrden');
  const limpiar = document.getElementById('btnLimpiar');
  const btnMas = document.getElementById('btnVerMas');
  const toggle = document.getElementById('filtrosToggle');
  const panel = document.getElementById('filtrosPanel');
  const vacioBtn = document.getElementById('btnVacioLimpiar');

  let t;
  buscar?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { estado.q = buscar.value; estado.visibles = POR_PAGINA; renderCatalogo(true); }, 180);
  });
  orden?.addEventListener('change', () => { estado.orden = orden.value; estado.visibles = POR_PAGINA; renderCatalogo(true); });
  document.getElementById('chipsCategoria')?.addEventListener('click', e => {
    const b = e.target.closest('.chip');
    if (!b) return;
    estado.cat = b.dataset.chip; estado.visibles = POR_PAGINA;
    marcarChip(estado.cat); renderCatalogo(true);
  });
  const reset = () => {
    estado.cat = 'todos'; estado.q = ''; estado.orden = 'destacados'; estado.visibles = POR_PAGINA;
    if (buscar) buscar.value = ''; if (orden) orden.value = 'destacados';
    marcarChip('todos'); renderCatalogo(true);
  };
  limpiar?.addEventListener('click', reset);
  vacioBtn?.addEventListener('click', reset);
  btnMas?.addEventListener('click', () => { estado.visibles += POR_PAGINA; renderCatalogo(true); });
  toggle?.addEventListener('click', () => {
    const abierto = panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  });

  document.addEventListener('click', e => {
    const link = e.target.closest('[data-cat-link]');
    if (!link) return;
    estado.cat = link.dataset.catLink; estado.q = ''; estado.visibles = POR_PAGINA;
    if (buscar) buscar.value = '';
    marcarChip(estado.cat); renderCatalogo(true);
  });
}

function qtyDe(el) {
  const sp = el.closest('.card-cuerpo, .modal-info')?.querySelector('[data-qty]');
  return sp ? Number(sp.dataset.qty) : 1;
}

function initAccionesProducto() {
  document.addEventListener('click', e => {
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const sp = paso.closest('.stepper').querySelector('[data-qty]');
      const nuevo = Math.max(1, Math.min(99, Number(sp.dataset.qty) + Number(paso.dataset.paso)));
      sp.dataset.qty = nuevo; sp.textContent = nuevo;
      return;
    }
    const fav = e.target.closest('[data-fav]');
    if (fav) {
      const on = Wish.toggle(fav.dataset.fav);
      document.querySelectorAll(`[data-fav="${fav.dataset.fav}"]`).forEach(b => b.classList.toggle('is-on', on));
      showToast(on ? 'Guardado en favoritos.' : 'Lo sacamos de favoritos.');
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const variante = p.costura ? (add.dataset.variante || 'Rojo') : null;
      Cart.add(p, qtyDe(add), variante);
      showToast('Agregado al carrito. Seguí mirando.');
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const variante = p.costura ? (comprar.dataset.variante || 'Rojo') : null;
      Cart.add(p, qtyDe(comprar), variante);
      cerrarModal();
      abrirDrawer();
      return;
    }
    const abrir = e.target.closest('[data-abrir]');
    if (abrir) { abrirModal(abrir.dataset.abrir); }
  });
}

/* ---------- MODAL ---------- */
let modalFoco = null;
let modalVariante = 'Rojo';

function modalHTML(p) {
  const imgs = p.imgs && p.imgs.length ? p.imgs : [p.img];
  const vistos = Vistos.get().filter(id => id !== p.id).map(getProducto).filter(Boolean).slice(0, 3);
  const variantes = p.costura ? `<div class="variantes">
      <span>Color de costura</span>
      <div class="var-lista" id="varLista">
        ${COSTURAS.map(c => `<button type="button" class="var-btn${c.id === modalVariante ? ' is-on' : ''}" data-var="${c.id}"><i style="background:${c.hex}"></i>${c.id}</button>`).join('')}
      </div>
    </div>` : '';
  const compat = p.universal
    ? `<p class="modal-compat">${ICO_CHECK}Entra en cualquier butaca, no depende del modelo</p>`
    : (Auto.get()
      ? `<p class="modal-compat">${ICO_CHECK}Cortado con el molde de tu ${esc(Auto.texto())}</p>`
      : `<p class="modal-compat">${ICO_CHECK}Elegí tu auto arriba para ver el precio exacto</p>`);

  return `<div class="modal-galeria">
      <div class="modal-foto"><img id="modalFoto" src="images/${imgs[0]}.webp" alt="${esc(p.nombre)}" ${attrDim(imgs[0])}></div>
      ${imgs.length > 1 ? `<div class="modal-thumbs">${imgs.map((im, i) => `<button type="button" class="${i === 0 ? 'is-on' : ''}" data-thumb="${im}" aria-label="Ver imagen ${i + 1}"><img src="images/${im}.webp" alt="" ${attrDim(im)} loading="lazy"></button>`).join('')}</div>` : ''}
    </div>
    <div class="modal-info">
      <span class="card-cat">${esc(nombreCat(p.cat))}</span>
      <h3 id="modalTitulo">${esc(p.nombre)}</h3>
      ${bloquePrecio(p, 'modal-precio')}
      ${compat}
      <p class="modal-desc">${esc(p.desc)}</p>
      <ul class="modal-specs">${p.specs.map(s => `<li>${ICO_CHECK}<span>${esc(s)}</span></li>`).join('')}</ul>
      ${variantes}
      <div class="modal-acciones">
        <div class="stepper">
          <button type="button" data-paso="-1" aria-label="Restar cantidad">−</button>
          <span data-qty="1">1</span>
          <button type="button" data-paso="1" aria-label="Sumar cantidad">+</button>
        </div>
        <button type="button" class="btn btn-linea" data-add="${p.id}" id="modalAdd">Agregar al carrito</button>
        <button type="button" class="btn btn-cta" data-comprar="${p.id}" id="modalComprar">Comprar ahora</button>
      </div>
    </div>
    ${vistos.length ? `<div class="modal-vistos"><span>Vistos recientemente</span><div class="vistos-lista">
      ${vistos.map(v => `<button type="button" class="visto" data-abrir="${v.id}"><img src="images/${v.img}.webp" alt="" ${attrDim(v.img)} loading="lazy"><b>${esc(v.nombre)}</b></button>`).join('')}
    </div></div>` : ''}`;
}

function abrirModal(id) {
  const p = getProducto(id);
  const modal = document.getElementById('modalProducto');
  const cuerpo = document.getElementById('modalCuerpo');
  if (!p || !modal || !cuerpo) return;
  modalVariante = 'Rojo';
  cuerpo.innerHTML = modalHTML(p);
  cuerpo.querySelectorAll('[data-add],[data-comprar]').forEach(b => b.dataset.variante = modalVariante);
  modalFoco = document.activeElement;
  modal.classList.add('open');
  modal.removeAttribute('inert');
  document.body.classList.add('no-scroll');
  Vistos.push(p.id);
  modal.querySelector('.modal-caja').scrollTop = 0;
  document.getElementById('modalClose')?.focus();
}

function cerrarModal() {
  const modal = document.getElementById('modalProducto');
  if (!modal || !modal.classList.contains('open')) return;
  modal.classList.remove('open');
  modal.setAttribute('inert', '');
  if (!document.getElementById('cartDrawer').classList.contains('open')) document.body.classList.remove('no-scroll');
  modalFoco?.focus();
}

function initModal() {
  const modal = document.getElementById('modalProducto');
  if (!modal) return;
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  modal.addEventListener('click', e => { if (e.target === modal) cerrarModal(); });
  modal.addEventListener('click', e => {
    const th = e.target.closest('[data-thumb]');
    if (th) {
      const foto = document.getElementById('modalFoto');
      if (foto) foto.src = `images/${th.dataset.thumb}.webp`;
      modal.querySelectorAll('[data-thumb]').forEach(b => b.classList.toggle('is-on', b === th));
      return;
    }
    const v = e.target.closest('[data-var]');
    if (v) {
      modalVariante = v.dataset.var;
      modal.querySelectorAll('[data-var]').forEach(b => b.classList.toggle('is-on', b === v));
      modal.querySelectorAll('[data-add],[data-comprar]').forEach(b => b.dataset.variante = modalVariante);
    }
  });
}

/* ---------- DRAWER ---------- */
function abrirDrawer() {
  const d = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  d.classList.add('open'); bd.classList.add('open');
  d.removeAttribute('inert');
  document.body.classList.add('no-scroll');
  document.getElementById('cartClose')?.focus();
}
function cerrarDrawer() {
  const d = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  d.classList.remove('open'); bd.classList.remove('open');
  d.setAttribute('inert', '');
  if (!document.getElementById('modalProducto').classList.contains('open')) document.body.classList.remove('no-scroll');
  document.getElementById('cartBtn')?.focus();
}

function renderCarrito() {
  const cont = document.getElementById('drawerItems');
  const badge = document.getElementById('cartBadge');
  const totalEl = document.getElementById('cartTotal');
  const pie = document.getElementById('drawerPie');
  const barra = document.getElementById('envioBarra');
  const texto = document.getElementById('envioTexto');
  const prog = document.getElementById('envioProgreso');
  const dAuto = document.getElementById('drawerAuto');
  if (!cont) return;

  const items = Cart.get();
  const total = Cart.total();
  badge.textContent = Cart.count();
  totalEl.textContent = formatearPrecio(total);
  dAuto.textContent = Auto.get() ? `Precios para tu ${Auto.texto()}` : '';

  if (!items.length) {
    cont.innerHTML = `<div class="carrito-vacio">${ICO_CARRITO}<h3>Tu carrito está vacío</h3><p>Elegí tu auto y agregá la primera pieza. Te la cortamos con el molde de tu modelo.</p></div>`;
    pie.hidden = true; barra.hidden = true;
    return;
  }
  pie.hidden = false; barra.hidden = false;

  cont.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<div class="linea">
      <div class="linea-media"><img src="images/${p.img}.webp" alt="" ${attrDim(p.img)} loading="lazy"></div>
      <div>
        <p class="linea-nombre">${esc(p.nombre)}</p>
        ${i.variante ? `<p class="linea-var">Costura ${esc(i.variante)}</p>` : ''}
        <p class="linea-precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
      </div>
      <div class="linea-acciones">
        <div class="stepper">
          <button type="button" data-linea-menos data-id="${p.id}" data-var="${esc(i.variante ?? '')}" aria-label="Restar">−</button>
          <span>${i.qty}</span>
          <button type="button" data-linea-mas data-id="${p.id}" data-var="${esc(i.variante ?? '')}" aria-label="Sumar">+</button>
        </div>
        <button type="button" class="linea-quitar" data-linea-quitar data-id="${p.id}" data-var="${esc(i.variante ?? '')}">Quitar</button>
      </div>
    </div>`;
  }).join('');

  const falta = ENVIO_GRATIS_DESDE - total;
  if (falta > 0) {
    barra.classList.remove('is-full');
    texto.textContent = `Te faltan ${formatearPrecio(falta)} para el envío bonificado.`;
    prog.style.width = `${Math.min(100, (total / ENVIO_GRATIS_DESDE) * 100)}%`;
  } else {
    barra.classList.add('is-full');
    texto.textContent = '¡Tenés el envío bonificado!';
    prog.style.width = '100%';
  }

  const lineas = items.map(i => { const p = getProducto(i.id); return p ? `${i.qty}x ${p.nombre}${i.variante ? ` (costura ${i.variante})` : ''}` : ''; }).filter(Boolean).join('\n');
  const auto = Auto.get() ? `\nMi auto: ${Auto.texto()}` : '';
  document.getElementById('drawerWsp').href = wa(`Hola ChiquiFun! Quiero hacer este pedido:\n${lineas}${auto}\nTotal: ${formatearPrecio(total)}`);
}

function initDrawer() {
  document.getElementById('cartBtn')?.addEventListener('click', abrirDrawer);
  document.getElementById('cartClose')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarDrawer);
  document.getElementById('btnCheckout')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.getElementById('drawerItems')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-linea-menos],[data-linea-mas],[data-linea-quitar]');
    if (!btn) return;
    const id = btn.dataset.id;
    const variante = btn.dataset.var === '' ? null : btn.dataset.var;
    const actual = Cart.get().find(i => i.id === id && i.variante === variante)?.qty || 1;
    if (btn.hasAttribute('data-linea-quitar')) Cart.remove(id, variante);
    else if (btn.hasAttribute('data-linea-mas')) Cart.setQty(id, variante, actual + 1);
    else if (actual <= 1) Cart.remove(id, variante);
    else Cart.setQty(id, variante, actual - 1);
  });
  document.addEventListener('cart:updated', () => {
    renderCarrito();
    const badge = document.getElementById('cartBadge');
    badge.classList.remove('bump');
    void badge.offsetWidth;
    if (!reduceMotion) badge.classList.add('bump');
  });
  renderCarrito();
}

/* ---------- SELECTOR DE VEHICULO ---------- */
function initSelector() {
  const marca = document.getElementById('selMarca');
  const modelo = document.getElementById('selModelo');
  const anio = document.getElementById('selAnio');
  const form = document.getElementById('selectorAuto');
  const chip = document.getElementById('autoChip');
  const chipTexto = document.getElementById('autoChipTexto');
  const nota = document.getElementById('selectorNota');
  if (!marca || !form) return;

  marca.innerHTML = '<option value="">Elegí la marca</option>' + Object.keys(VEHICULOS).map(m => `<option value="${esc(m)}">${esc(m)}</option>`).join('');
  const anios = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', 'Anterior a 2010'];

  const llenarModelos = m => {
    const mods = VEHICULOS[m] || {};
    modelo.innerHTML = '<option value="">Elegí el modelo</option>' + Object.keys(mods).map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('');
    modelo.disabled = !m;
    anio.innerHTML = '<option value="">Año</option>' + anios.map(a => `<option value="${a}">${a}</option>`).join('');
    anio.disabled = true;
  };
  llenarModelos('');

  marca.addEventListener('change', () => { llenarModelos(marca.value); });
  modelo.addEventListener('change', () => { anio.disabled = !modelo.value; });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!marca.value || !modelo.value || !anio.value) {
      showToast('Completá marca, modelo y año para ver tu precio.');
      return;
    }
    Auto.set({ marca: marca.value, modelo: modelo.value, anio: anio.value, tipo: VEHICULOS[marca.value][modelo.value] });
    showToast(`Listo: precios para tu ${marca.value} ${modelo.value} ${anio.value}.`);
  });

  chip?.addEventListener('click', () => {
    if (Auto.get()) {
      Auto.clear();
      marca.value = ''; llenarModelos('');
      showToast('Sacamos el auto. Volvés a ver precios desde.');
    }
    document.querySelector('.hero')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => marca.focus(), reduceMotion ? 0 : 600);
  });

  const pintar = () => {
    const a = Auto.get();
    if (a) {
      chip.classList.add('is-set');
      chipTexto.textContent = `${a.modelo} ${a.anio}`;
      chip.setAttribute('aria-label', `Vehículo elegido: ${Auto.texto()}. Tocá para cambiarlo.`);
      form.classList.add('is-set');
      nota.innerHTML = `Precios cortados para tu <b>${esc(Auto.texto())}</b> (${TIPO_LABEL[a.tipo]}). Tocá el chip del menú para cambiarlo.`;
      marca.value = a.marca; llenarModelos(a.marca); modelo.value = a.modelo; anio.disabled = false; anio.value = a.anio;
    } else {
      chip.classList.remove('is-set');
      chipTexto.textContent = 'Elegí tu auto';
      chip.setAttribute('aria-label', 'Elegir vehículo');
      form.classList.remove('is-set');
      nota.innerHTML = 'Sin auto elegido ves precios <b>desde</b>. Con el auto, el precio final de cada pieza.';
    }
    renderDestacados();
    renderCatalogo(false);
    renderCarrito();
  };
  document.addEventListener('auto:updated', pintar);
  pintar();
}

/* ---------- RAIL ARRASTRABLE ---------- */
function initRailDrag() {
  const wrap = document.querySelector('.rail-wrap');
  if (!wrap) return;
  let down = false, movido = false, x0 = 0, s0 = 0;
  wrap.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    down = true; movido = false; x0 = e.clientX; s0 = wrap.scrollLeft;
    wrap.classList.add('is-drag');
  });
  wrap.addEventListener('pointermove', e => {
    if (!down) return;
    const d = e.clientX - x0;
    if (Math.abs(d) > 6) movido = true;
    if (movido) { wrap.scrollLeft = s0 - d; e.preventDefault(); }
  });
  const soltar = () => { down = false; wrap.classList.remove('is-drag'); setTimeout(() => { movido = false; }, 30); };
  wrap.addEventListener('pointerup', soltar);
  wrap.addEventListener('pointerleave', soltar);
  wrap.addEventListener('click', e => { if (movido) { e.preventDefault(); e.stopPropagation(); } }, true);
}

/* ---------- NAV / REVEALS / UI ---------- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  const host = document.querySelector('.site-header');
  if (!toggle || !nav || !host) return;
  let bd = host.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; host.appendChild(bd); }
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
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
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (nav.classList.contains('open')) { close(); toggle.focus(); return; }
    if (document.getElementById('modalProducto').classList.contains('open')) { cerrarModal(); return; }
    if (document.getElementById('cartDrawer').classList.contains('open')) cerrarDrawer();
  });
}

function initReveals() {
  const stagger = root => {
    const padres = root.matches?.('[data-animate-stagger]') ? [root] : Array.from(root.querySelectorAll('[data-animate-stagger]'));
    padres.forEach(parent => {
      parent.querySelectorAll('[data-animate]').forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
      });
    });
  };
  const pendientes = root => Array.from((root || document).querySelectorAll('[data-animate]')).filter(el => !el.classList.contains('in'));

  stagger(document);

  if (!('IntersectionObserver' in window) || reduceMotion) {
    pendientes().forEach(el => el.classList.add('in'));
    revelarNuevos = root => pendientes(root).forEach(el => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  pendientes().forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    pendientes().forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
    });
  };
  const queueSweep = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(sweep);
    setTimeout(sweep, 260);
  };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });

  revelarNuevos = root => {
    stagger(root);
    const nuevos = pendientes(root);
    if (!nuevos.length) return;
    nuevos.forEach(el => io.observe(el));
    queueSweep();
  };
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? `${Math.min(100, (window.scrollY / h) * 100)}%` : '0%';
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

/* ---------- HERO ---------- */
function initHero() {
  const items = document.querySelectorAll('[data-hero]');
  if (typeof gsap === 'undefined' || !items.length) return;
  if (reduceMotion) { gsap.set(items, { opacity: 1 }); return; }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo('.hero-fondo img', { scale: 1.1 }, { scale: 1, duration: 1.5, ease: 'power2.out' }, 0)
    .fromTo('[data-hero="1"]', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .7 }, .1)
    .fromTo('[data-hero="2"]', { opacity: 0, y: 34, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power4.out' }, .2)
    .fromTo('[data-hero="3"]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .8 }, .45)
    .fromTo('[data-hero="4"]', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: .85 }, .58)
    .fromTo('[data-hero="5"]', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .7 }, .74)
    .fromTo('[data-hero="e1"]', { opacity: 0, x: 70, rotation: 3, scale: .96 }, { opacity: 1, x: 0, rotation: 0, scale: 1, duration: 1.2, ease: 'power4.out' }, .3)
    .fromTo('[data-hero="e2"]', { opacity: 0, scale: .5, rotation: -60 }, { opacity: 1, scale: 1, rotation: -9, duration: .85, ease: 'back.out(1.7)' }, .85)
    .fromTo('[data-hero="e3"]', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .7 }, .95)
    .fromTo('[data-hero="e4"]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .7 }, 1);

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.to('.hero-fondo img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 } });
    gsap.to('.hero-cobertor', { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 } });
  }
}

/* ---------- MESA DE CORTE ---------- */
function initMesa() {
  const mesa = document.getElementById('mesa');
  const escena = document.getElementById('escenaMesa');
  const pasos = Array.from(document.querySelectorAll('#mesaPasos li'));
  const cifra = document.getElementById('mesaCifra');
  const unidad = document.getElementById('mesaUnidad');
  if (!mesa || !escena || !pasos.length) return;

  const dots = document.createElement('div');
  dots.className = 'mesa-dots';
  dots.setAttribute('aria-hidden', 'true');
  dots.innerHTML = pasos.map((_, i) => `<b class="${i === 0 ? 'is-on' : ''}"></b>`).join('');
  mesa.querySelector('.mesa-grid').insertBefore(dots, document.getElementById('mesaPasos'));

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') { mesa.classList.add('is-static'); return; }

  const maskCorte = document.getElementById('maskCorte');
  const maskCose = document.getElementById('maskCose');
  const largo = el => { try { return el.getTotalLength() || 1200; } catch { return 1200; } };
  const lCorte = largo(maskCorte);
  const lCose = largo(maskCose);

  const CORTES = [0, 0.26, 0.5, 0.76];
  const DATOS = [['90+', 'moldes en el taller'], ['580×820', 'mm de molde'], [null, 'puntadas'], ['0', 'arrugas']];

  const setStep = p => {
    let idx = 0;
    for (let i = 0; i < CORTES.length; i++) if (p >= CORTES[i]) idx = i;
    pasos.forEach((li, i) => li.classList.toggle('is-on', i === idx));
    dots.querySelectorAll('b').forEach((b, i) => b.classList.toggle('is-on', i === idx));
    if (idx === 2) {
      const t = Math.min(1, Math.max(0, (p - 0.5) / 0.26));
      cifra.textContent = Math.round(t * 1240).toLocaleString('es-AR');
      unidad.textContent = 'puntadas';
    } else {
      cifra.textContent = DATOS[idx][0];
      unidad.textContent = DATOS[idx][1];
    }
  };

  const armar = scrollTrigger => {
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger });
    tl.set(maskCorte, { strokeDasharray: lCorte, strokeDashoffset: lCorte }, 0)
      .set(maskCose, { strokeDasharray: lCose, strokeDashoffset: lCose }, 0)
      .set('#maskQuilt', { attr: { y: 394, height: 0 } }, 0)
      .set('.sobrante', { opacity: 1, y: 0, rotation: 0, transformOrigin: '50% 50%' }, 0)
      .set('.panel', { opacity: 0 }, 0)
      .set('.plantilla', { opacity: 0 }, 0)
      .set('.pespunte', { opacity: 0 }, 0)
      .set('.cotas', { opacity: 0 }, 0)
      .set('.mesa-foto', { opacity: 0 }, 0)
      .set('.molde', { opacity: 1 }, 0)
      .to('.cotas', { opacity: 1, duration: 0.08 }, 0.04)
      .to('.plantilla', { opacity: 1, duration: 0.03 }, 0.06)
      .to(maskCorte, { strokeDashoffset: 0, duration: 0.2 }, 0.06)
      .to('.panel', { opacity: 1, duration: 0.06 }, 0.28)
      .to('.sobrante', { opacity: 0, y: 34, rotation: 3.5, duration: 0.16 }, 0.3)
      .to('.plantilla', { opacity: 0.35, duration: 0.08 }, 0.34)
      .to('.pespunte', { opacity: 1, duration: 0.03 }, 0.5)
      .to(maskCose, { strokeDashoffset: 0, duration: 0.2 }, 0.5)
      .to('#maskQuilt', { attr: { y: 16, height: 378 }, duration: 0.16 }, 0.6)
      .to('.cotas', { opacity: 0.25, duration: 0.08 }, 0.72)
      .to('.molde', { opacity: 0, duration: 0.12 }, 0.8)
      .to('.mesa-foto', { opacity: 1, duration: 0.14 }, 0.8);
    return tl;
  };

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: reduce)', () => {
    mesa.classList.add('is-static');
    pasos.forEach(li => li.classList.add('is-on'));
    return () => mesa.classList.remove('is-static');
  });

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    armar({ trigger: mesa, start: 'top top', end: '+=240%', pin: true, scrub: 0.6, invalidateOnRefresh: true, onUpdate: self => setStep(self.progress) });
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    mesa.classList.add('is-sticky-mobile');
    requestAnimationFrame(() => ScrollTrigger.refresh());
    armar({ trigger: mesa, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true, onUpdate: self => setStep(self.progress) });
    return () => mesa.classList.remove('is-sticky-mobile');
  });
}

function initFocusTrap() {
  document.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const abierto = document.querySelector('.modal.open') || document.querySelector('.cart-drawer.open') || document.querySelector('.main-nav.open');
    if (!abierto) return;
    const foco = Array.from(abierto.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'))
      .filter(el => el.offsetParent !== null);
    if (!foco.length) return;
    const primero = foco[0], ultimo = foco[foco.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
}

function initAnio() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

document.documentElement.classList.add('js-ready');
initNav();
initChips();
renderRail();
initRailDrag();
initCatalogoUI();
initAccionesProducto();
initModal();
initDrawer();
initSelector();
initProgress();
initWspFloat();
initReveals();
initMesa();
initFocusTrap();
initAnio();

const fuentesListas = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
Promise.race([fuentesListas, new Promise(r => setTimeout(r, 900))]).then(() => {
  initHero();
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
});
