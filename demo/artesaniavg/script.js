const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491158205132';

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
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; el.style.filter = 'none';
  });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

const CATEGORIAS = [
  { id: 'resina', nombre: 'Resina', pie: 'Geodas, posavasos y colgantes', img: 'images/prod-posavasos-resina-1200x1200.webp', alt: 'Posavasos de resina con forma de geoda azul' },
  { id: 'yeso', nombre: 'Yeso cerámico', pie: 'Bandejas, macetas y portavelas', img: 'images/prod-bandeja-yeso-1200x1200.webp', alt: 'Bandejas de yeso cerámico apiladas en tono crudo' },
  { id: 'velas', nombre: 'Velas', pie: 'Cera de soja y esencias', img: 'images/prod-vela-soja-1200x1200.webp', alt: 'Vela de soja artesanal sobre una bandeja de madera' },
  { id: 'jabones', nombre: 'Jabones', pie: 'Saponificados en frío', img: 'images/prod-jabones-1200x1200.webp', alt: 'Jabones artesanales con flores secas' },
  { id: 'kits', nombre: 'Kits y materiales', pie: 'Para seguir en tu casa', img: 'images/mesa-velas-1600x1300.webp', alt: 'Mesa con vasos, mechas y materiales para hacer velas' },
];

const PRODUCTOS = [
  { id: 1, type: 'product', nombre: 'Posavasos geoda (set x2)', categoria: 'resina', precio: 18900, descuento: 15, stock: 6, destacado: true,
    imagen: 'images/prod-posavasos-resina-1200x1200.webp', alt: 'Posavasos de resina con forma de geoda azul y borde dorado',
    variante: { nombre: 'Color', opciones: ['Azul océano', 'Verde jade', 'Arena'] },
    corta: 'Dos posavasos colados en resina con pigmento y pan de oro, pulidos a mano.',
    larga: 'Se cuelan de a dos en el mismo molde, así que el par siempre combina entre sí. Llevan base de corcho para no marcar la mesa y un sellado mate que no se pega con el vaso frío. Miden 10 cm de diámetro.' },
  { id: 2, type: 'product', nombre: 'Bandeja geoda chica', categoria: 'resina', precio: 26500, descuento: 0, stock: 3,
    imagen: 'images/prod-posavasos-resina-1200x1200.webp', alt: 'Bandeja de resina con veta tipo geoda en azul',
    variante: { nombre: 'Color', opciones: ['Azul océano', 'Verde jade'] },
    corta: 'Bandeja de 22 cm con veta de geoda y borde metalizado.',
    larga: 'Pensada para perfumes, joyas o el mate. La veta se dibuja a mano mientras la resina todavía está líquida, así que ninguna sale igual. Se limpia con un paño apenas húmedo, nunca con alcohol.' },
  { id: 3, type: 'product', nombre: 'Colgante de flores preservadas', categoria: 'resina', precio: 9800, descuento: 0, stock: 12, destacado: true,
    imagen: 'images/prod-colgante-resina-1200x1200.webp', alt: 'Colgante de resina transparente con flores preservadas en su interior',
    variante: { nombre: 'Cadena', opciones: ['Plateada 45 cm', 'Dorada 45 cm', 'Sin cadena'] },
    corta: 'Flores secas suspendidas en resina transparente, con cadena de acero.',
    larga: 'Las flores se secan en el taller antes de colarlas, por eso conservan el color. La esfera mide 2,5 cm y la cadena es de acero quirúrgico, así que no se pone verde. Se puede pedir con una flor puntual si tenés una que te importa.' },
  { id: 4, type: 'product', nombre: 'Portavelas hexagonal (set x2)', categoria: 'yeso', precio: 14200, descuento: 0, stock: 8, destacado: true,
    imagen: 'images/prod-portavelas-yeso-1200x1200.webp', alt: 'Portavelas hexagonales de yeso cerámico en gris y blanco',
    variante: { nombre: 'Acabado', opciones: ['Crudo', 'Grafito', 'Uno de cada uno'] },
    corta: 'Dos portavelas geométricos en yeso cerámico sellado.',
    larga: 'El yeso cerámico es más denso que el de obra: aguanta el uso diario sin desgranarse. Vienen sellados para que la cera derretida no manche, y entran velas de té estándar.' },
  { id: 5, type: 'product', nombre: 'Maceta geométrica', categoria: 'yeso', precio: 16800, descuento: 0, stock: 5,
    imagen: 'images/prod-portavelas-yeso-1200x1200.webp', alt: 'Maceta geométrica de yeso cerámico en tono grafito',
    variante: { nombre: 'Acabado', opciones: ['Crudo', 'Grafito'] },
    corta: 'Maceta de 12 cm con base impermeabilizada, para suculentas y cactus.',
    larga: 'Lleva un sellado interior que evita que la humedad de la tierra atraviese el yeso, así que se puede regar sin miedo a que marque el mueble. No trae agujero de drenaje: va con piedritas en el fondo.' },
  { id: 6, type: 'product', nombre: 'Bandeja orgánica de yeso', categoria: 'yeso', precio: 12500, descuento: 10, stock: 7, destacado: true,
    imagen: 'images/prod-bandeja-yeso-1200x1200.webp', alt: 'Bandeja de yeso cerámico de borde orgánico en color crudo',
    variante: { nombre: 'Acabado', opciones: ['Crudo', 'Arena'] },
    corta: 'Borde irregular hecho a mano, ideal para el aparador o la mesa de luz.',
    larga: 'El borde no se corta con molde: se levanta a mano mientras el yeso está tomando, por eso cada bandeja tiene su propio contorno. Mide unos 18 cm y pesa poco más de 300 g.' },
  { id: 7, type: 'product', nombre: 'Plato para joyas', categoria: 'yeso', precio: 7900, descuento: 0, stock: 14,
    imagen: 'images/prod-bandeja-yeso-1200x1200.webp', alt: 'Platito de yeso cerámico para joyas, en tono crudo',
    variante: { nombre: 'Acabado', opciones: ['Crudo', 'Arena', 'Grafito'] },
    corta: 'Platito de 10 cm para anillos, aros y llaves.',
    larga: 'El más pedido para regalar: entra en cualquier mesa de luz y sale a un precio amable. Se puede pedir con una inicial marcada en relieve, avisando al hacer el pedido.' },
  { id: 8, type: 'product', nombre: 'Vela de soja en vaso', categoria: 'velas', precio: 11500, descuento: 0, stock: 10, destacado: true,
    imagen: 'images/prod-vela-soja-1200x1200.webp', alt: 'Vela de soja en vaso de vidrio junto a pétalos secos',
    variante: { nombre: 'Aroma', opciones: ['Lavanda', 'Vainilla', 'Cítrico', 'Sándalo'] },
    corta: '180 g de cera de soja con mecha de algodón. Unas 35 horas de encendido.',
    larga: 'Cera vegetal, sin parafina: quema más lento y no deja hollín. El vaso es de vidrio grueso y se puede reutilizar. La primera vez conviene dejarla encendida hasta que la cera llegue a los bordes, así no se hace un túnel.' },
  { id: 9, type: 'product', nombre: 'Vela en lata de viaje', categoria: 'velas', precio: 6900, descuento: 0, stock: 18, destacado: true,
    imagen: 'images/prod-vela-soja-1200x1200.webp', alt: 'Velas artesanales en lata de aluminio con tapa',
    variante: { nombre: 'Aroma', opciones: ['Lavanda', 'Vainilla', 'Cítrico'] },
    corta: '90 g con tapa, para llevar o para regalar de a varias.',
    larga: 'La versión chica de la vela en vaso, en lata de aluminio con tapa a presión. Es la que más se pide para souvenirs: a partir de 20 unidades se puede personalizar la etiqueta.' },
  { id: 10, type: 'product', nombre: 'Jabón de caléndula y avena', categoria: 'jabones', precio: 4800, descuento: 0, stock: 20, destacado: true,
    imagen: 'images/prod-jabones-1200x1200.webp', alt: 'Jabón artesanal de caléndula y avena con flores secas',
    corta: 'Saponificado en frío, con avena molida y flores de caléndula.',
    larga: 'Curado cuatro semanas antes de salir a la venta: eso es lo que lo deja firme y hace que dure. La avena aporta una exfoliación suave, así que va bien para piel sensible. Pesa 100 g aproximados, cortado a mano.' },
  { id: 11, type: 'product', nombre: 'Jabón de carbón activado', categoria: 'jabones', precio: 4800, descuento: 0, stock: 16,
    imagen: 'images/prod-jabones-1200x1200.webp', alt: 'Jabón artesanal de carbón activado, en color oscuro',
    corta: 'Carbón activado y aceite de coco, para piel mixta.',
    larga: 'El carbón le da el color negro y ayuda a limpiar en profundidad sin resecar. Como todos, va saponificado en frío y curado cuatro semanas. Conviene dejarlo en una jabonera con drenaje para que dure más.' },
  { id: 12, type: 'product', nombre: 'Kit para hacer tus velas', categoria: 'kits', precio: 23900, descuento: 0, stock: 6, destacado: true,
    imagen: 'images/mesa-velas-1600x1300.webp', alt: 'Materiales para hacer velas: vasos, mechas, hilo y cera sobre una mesa',
    corta: 'Cera de soja, mechas, tres vasos, esencias y el instructivo paso a paso.',
    larga: 'Alcanza para tres velas de 180 g. Incluye cera de soja, mechas de algodón con base, tres vasos de vidrio, dos esencias a elección, termómetro de cocina y una guía impresa con las temperaturas de cada paso. Es el mismo material con el que se trabaja en el taller.' },
  { id: 13, type: 'product', nombre: 'Kit iniciación en resina', categoria: 'kits', precio: 31500, descuento: 10, stock: 4,
    imagen: 'images/colado-resina-1600x1300.webp', alt: 'Colado de resina azul en un molde circular con guantes',
    corta: 'Resina bicomponente, pigmentos, moldes de silicona y protección.',
    larga: 'Trae resina epoxi de dos componentes (500 g en total), tres pigmentos, dos moldes de silicona (posavasos y platito), vasos medidores, palitos, guantes y barbijo. La resina se trabaja siempre con ventilación: eso también está explicado en la guía.' },
];

const TALLERES = [
  { id: 1, type: 'course', nombre: 'Taller de resina desde cero', categoria: 'resina', precio: 34000, descuento: 0, destacado: true,
    nivel: 'Inicial', modalidad: 'Presencial', duracion: '1 encuentro de 3 h', clases: 1, cupo: 'Grupo de hasta 6 personas',
    imagen: 'images/artesana-taller-1600x1300.webp', alt: 'Dos personas trabajando juntas en el taller de artesanías',
    corta: 'Salís con dos piezas terminadas y sabiendo medir, pigmentar y desmoldar.',
    larga: 'Un encuentro para perderle el miedo a la resina. Trabajamos con resina epoxi de dos componentes: cómo se mide, por qué la proporción no se puede "ojímetro", cómo se pigmenta sin que queden burbujas y cuánto hay que esperar antes de desmoldar.',
    resultados: ['Medir y mezclar resina en la proporción correcta', 'Pigmentar y hacer la veta tipo geoda', 'Desmoldar, lijar y sellar sin arruinar la pieza'],
    incluye: ['Todos los materiales', 'Delantal y protección', 'Las dos piezas que hagas', 'Guía impresa para seguir en casa'],
    modulos: [
      { t: 'Seguridad y preparación', c: ['Ventilación, guantes y qué NO hacer', 'Los dos componentes y por qué la balanza manda'] },
      { t: 'Colado y color', c: ['Pigmentos, tintas y pan de oro', 'La veta de geoda paso a paso'] },
      { t: 'Terminación', c: ['Desmolde y lijado progresivo', 'Sellado mate o brillante'] },
    ] },
  { id: 2, type: 'course', nombre: 'Resina avanzada: geodas y bandejas', categoria: 'resina', precio: 52000, descuento: 0,
    nivel: 'Intermedio', modalidad: 'Presencial', duracion: '2 encuentros de 3 h', clases: 2, cupo: 'Grupo de hasta 5 personas',
    imagen: 'images/prod-posavasos-resina-1200x1200.webp', alt: 'Pieza de resina tipo geoda terminada con detalle dorado',
    corta: 'Piezas grandes, capas y bordes metalizados. Requiere haber trabajado resina antes.',
    larga: 'Para quien ya coló alguna pieza chica y quiere pasar a formatos grandes, donde la resina se comporta distinto: más calor, más tiempo de trabajo y más chances de que algo salga mal. Dos encuentros, con una semana de curado entre medio.',
    resultados: ['Trabajar en capas sin que se marquen las uniones', 'Bordes metalizados y pan de oro', 'Resolver burbujas, cráteres y curados desparejos'],
    incluye: ['Materiales de los dos encuentros', 'Molde de bandeja para llevarte', 'Una bandeja grande terminada'],
    modulos: [
      { t: 'Encuentro 1 — la base', c: ['Cálculo de volumen para piezas grandes', 'Primera capa y color de fondo'] },
      { t: 'Encuentro 2 — la geoda', c: ['Capas de veta y cristales', 'Borde metalizado y terminación'] },
    ] },
  { id: 3, type: 'course', nombre: 'Taller de velas de soja', categoria: 'velas', precio: 28000, descuento: 0, destacado: true,
    nivel: 'Inicial', modalidad: 'Presencial', duracion: '1 encuentro de 2,5 h', clases: 1, cupo: 'Grupo de hasta 8 personas',
    imagen: 'images/taller-manos-1600x1300.webp', alt: 'Manos trabajando sobre la mesa del taller con materiales y herramientas',
    corta: 'Te llevás tres velas hechas por vos y la receta para repetirlas.',
    larga: 'La cera de soja parece simple hasta que se agrieta o el aroma no se siente. En este encuentro trabajamos las temperaturas —que es donde se define casi todo— y armamos tres velas en vaso con aromas a elección.',
    resultados: ['Elegir mecha según el diámetro del vaso', 'Las tres temperaturas que definen el resultado', 'Dosificar esencias sin que la vela largue aceite'],
    incluye: ['Cera, mechas, vasos y esencias', 'Las tres velas que hagas', 'Ficha con temperaturas y proporciones'],
    modulos: [
      { t: 'La cera', c: ['Soja, parafina y mezclas: qué cambia', 'Punto de fusión y punto de perfumado'] },
      { t: 'Armado', c: ['Centrado de mecha', 'Colado y enfriado lento'] },
    ] },
  { id: 4, type: 'course', nombre: 'Velas: aromas y capas', categoria: 'velas', precio: 24000, descuento: 15,
    nivel: 'Intermedio', modalidad: 'Online en vivo', duracion: '2 encuentros de 2 h', clases: 2, cupo: 'Grupo de hasta 12 personas',
    imagen: 'images/prod-vela-soja-1200x1200.webp', alt: 'Vela de soja artesanal terminada junto a pétalos secos',
    corta: 'Por videollamada, con lista de materiales enviada antes de empezar.',
    larga: 'Dos encuentros en vivo para armar combinaciones de aroma propias y trabajar velas de capas y de colores. Se hace desde tu casa, con la cocina como mesa de trabajo; la lista de materiales se manda una semana antes.',
    resultados: ['Construir un aroma con notas de salida, cuerpo y fondo', 'Velas de dos y tres capas sin que se separen', 'Calcular costos para vender'],
    incluye: ['Dos encuentros en vivo', 'Lista de materiales y dónde conseguirlos', 'Grabación por 30 días'],
    modulos: [
      { t: 'Encuentro 1 — el aroma', c: ['Familias olfativas', 'Mezclas propias y cómo registrarlas'] },
      { t: 'Encuentro 2 — las capas', c: ['Temperaturas por capa', 'Costos y precio de venta'] },
    ] },
  { id: 5, type: 'course', nombre: 'Yeso cerámico desde cero', categoria: 'yeso', precio: 30000, descuento: 0,
    nivel: 'Inicial', modalidad: 'Presencial', duracion: '1 encuentro de 3 h', clases: 1, cupo: 'Grupo de hasta 6 personas',
    imagen: 'images/prod-portavelas-yeso-1200x1200.webp', alt: 'Piezas hexagonales de yeso cerámico terminadas',
    corta: 'Mezcla, colado y sellado. Salís con un portavelas y una bandeja.',
    larga: 'El yeso cerámico fragua en minutos, así que todo el trabajo está en llegar preparado. Vemos la proporción de agua, cómo evitar burbujas golpeando el molde y qué sellado usar según si la pieza va a tocar agua o no.',
    resultados: ['Proporción agua/yeso y tiempos de fragüe', 'Colar sin burbujas ni rebabas', 'Sellar e impermeabilizar según el uso'],
    incluye: ['Yeso, moldes y pigmentos', 'Las piezas que hagas', 'Ficha de proporciones'],
    modulos: [
      { t: 'La mezcla', c: ['Yeso cerámico vs. yeso de obra', 'Proporción, temperatura y tiempo'] },
      { t: 'Colado y terminación', c: ['Moldes de silicona: cuidado y vida útil', 'Lijado, pigmentado y sellado'] },
    ] },
  { id: 6, type: 'course', nombre: 'Jabones artesanales en frío', categoria: 'jabones', precio: 19500, descuento: 0,
    nivel: 'Inicial', modalidad: 'Online a tu ritmo', duracion: '6 clases grabadas', clases: 6, cupo: 'Sin límite de cupo',
    imagen: 'images/prod-jabones-1200x1200.webp', alt: 'Jabones artesanales cortados a mano con flores secas',
    corta: 'Seis clases grabadas, con la parte de seguridad explicada en serio.',
    larga: 'El método en frío usa soda cáustica, así que la mitad del curso es aprender a manejarla sin riesgo. Después vienen las recetas: aceites, arcillas, botánicos y el corte. Se ve a tu ritmo, con acceso mientras la plataforma esté activa.',
    resultados: ['Manejar soda cáustica con seguridad', 'Calcular una receta propia con calculadora de saponificación', 'Curar, cortar y conservar'],
    incluye: ['6 clases grabadas', 'Planilla de cálculo de recetas', 'Lista de proveedores'],
    modulos: [
      { t: 'Seguridad primero', c: ['Soda cáustica: equipo y protocolo', 'Qué hacer si algo sale mal'] },
      { t: 'La receta', c: ['Aceites y sus propiedades', 'Índice de saponificación sin miedo'] },
      { t: 'Terminación', c: ['Arcillas, botánicos y aromas', 'Corte, curado y conservación'] },
    ] },
];

const BUNDLES = [
  { id: 1, titulo: 'Taller de velas + kit para seguir en casa', courseIds: [3], productLines: [{ id: 12, qty: 1 }], precioBundle: 46700,
    texto: 'Venís al taller, te llevás tus tres velas y el kit para hacer otras tres el fin de semana.' },
  { id: 2, titulo: 'Taller de resina + kit de iniciación', courseIds: [1], productLines: [{ id: 13, qty: 1 }], precioBundle: 55900,
    texto: 'La técnica en el taller y los materiales para practicarla mientras la tenés fresca.' },
];

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const fmt = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = it => (it.descuento > 0 ? Math.round(it.precio * (1 - it.descuento / 100)) : it.precio);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getTaller = id => TALLERES.find(c => c.id === id);
const getItem = (type, id) => (type === 'course' ? getTaller(id) : getProducto(id));
const catNombre = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
const TODOS = () => [...PRODUCTOS, ...TALLERES];

const Cart = {
  KEY: 'artesaniavg_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(type, id, variantKey = null, qty = 1) {
    const items = this.get();
    const key = type === 'course' ? `course:${id}` : `product:${id}:${variantKey || 'unica'}`;
    const it = getItem(type, id);
    if (!it) return;
    const existing = items.find(i => i.key === key);
    if (type === 'course') {
      if (existing) return false;
      items.push({ key, type, id, variantKey: null, qty: 1 });
    } else if (existing) {
      existing.qty = Math.min(existing.qty + qty, it.stock ?? 99);
    } else {
      items.push({ key, type, id, variantKey, qty: Math.min(qty, it.stock ?? 99) });
    }
    this.save(items);
    return true;
  },
  setQty(key, qty) {
    const items = this.get();
    const line = items.find(i => i.key === key);
    if (!line || line.type === 'course') return;
    const p = getProducto(line.id);
    line.qty = Math.max(1, Math.min(qty, p?.stock ?? 99));
    this.save(items);
  },
  remove(key) { this.save(this.get().filter(i => i.key !== key)); },
  clear() { this.save([]); },
  lineas() { return this.get().filter(i => getItem(i.type, i.id)); },
  count() { return this.lineas().reduce((s, i) => s + i.qty, 0); },
  subtotal(type) {
    return this.lineas().filter(i => !type || i.type === type)
      .reduce((s, i) => { const it = getItem(i.type, i.id); return it ? s + precioFinal(it) * i.qty : s; }, 0);
  },
  total() { return this.subtotal(null); },
};

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    wrap.setAttribute('aria-live', 'polite');
    document.body.appendChild(wrap);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3400);
}

let revealsListos = false;

function initReveals() {
  revealsListos = true;
  const items = [...document.querySelectorAll('[data-animate]')].filter(el => !el.closest('.hero'));
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.1, 0.6)}s`;
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

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.06, 0.4)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const mostrarTodo = () => hero.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  if (typeof gsap === 'undefined' || reduceMotion) { mostrarTodo(); return; }
  const revelar = (sel, ms) => setTimeout(() => {
    hero.querySelectorAll(sel).forEach(el => el.classList.add('in'));
  }, ms);
  revelar('.escena-foto', 120);
  revelar('.hero-copy .eyebrow', 260);
  revelar('.hero-copy h1', 380);
  revelar('.escena-mini', 520);
  revelar('.hero-sub', 600);
  revelar('.hero-cta [data-animate]', 740);
  revelar('.sello-hero', 860);
  revelar('.hero-datos', 940);
  setTimeout(mostrarTodo, 2600);
}

function tarjetaProducto(p, ctx = 'grid') {
  const final = precioFinal(p);
  const tieneDesc = p.descuento > 0;
  return `
  <article class="card card-prod" data-animate style="opacity:0;transform:translateY(22px)" data-tipo="product" data-id="${p.id}">
    <button type="button" class="card-media" data-ver="product:${p.id}" aria-label="Ver ${esc(p.nombre)}">
      <img src="${p.imagen}" width="1200" height="1200" alt="${esc(p.alt)}" decoding="async">
      ${tieneDesc ? `<span class="badge-desc">-${p.descuento}%</span>` : ''}
      <span class="badge-tipo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M20 7 12 3 4 7v10l8 4 8-4z" stroke-linejoin="round"/><path d="m4 7 8 4 8-4M12 11v10"/></svg>Pieza</span>
    </button>
    <div class="card-body">
      <span class="card-cat">${esc(catNombre(p.categoria))}</span>
      <h3 class="card-tit"><button type="button" data-ver="product:${p.id}">${esc(p.nombre)}</button></h3>
      <p class="card-precio">
        <b>${fmt(final)}</b>
        ${tieneDesc ? `<s>${fmt(p.precio)}</s>` : ''}
      </p>
      <div class="prod-actions">
        <div class="stepper" data-stepper>
          <button type="button" class="step-menos" aria-label="Quitar uno">−</button>
          <input type="text" inputmode="numeric" value="1" aria-label="Cantidad" data-qty>
          <button type="button" class="step-mas" aria-label="Sumar uno">+</button>
        </div>
        <button type="button" class="btn btn-primary prod-add" data-add="product:${p.id}">Agregar</button>
      </div>
      ${ctx === 'grid' ? `<button type="button" class="card-link" data-ver="product:${p.id}">Ver detalle</button>` : ''}
    </div>
  </article>`;
}

function tarjetaTaller(c) {
  const final = precioFinal(c);
  const tieneDesc = c.descuento > 0;
  return `
  <article class="card card-curso" data-animate style="opacity:0;transform:translateY(22px)" data-tipo="course" data-id="${c.id}">
    <button type="button" class="card-media" data-ver="course:${c.id}" aria-label="Ver ${esc(c.nombre)}">
      <img src="${c.imagen}" width="1200" height="1200" alt="${esc(c.alt)}" decoding="async">
      ${tieneDesc ? `<span class="badge-desc">-${c.descuento}%</span>` : ''}
      <span class="badge-tipo badge-curso"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 6.5 12 3l9 3.5-9 3.5z" stroke-linejoin="round"/><path d="M6 9v5.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V9" stroke-linecap="round"/></svg>Taller</span>
    </button>
    <div class="card-body">
      <span class="card-cat">${esc(catNombre(c.categoria))} · ${esc(c.modalidad)}</span>
      <h3 class="card-tit"><button type="button" data-ver="course:${c.id}">${esc(c.nombre)}</button></h3>
      <ul class="curso-meta">
        <li>${esc(c.nivel)}</li>
        <li>${esc(c.duracion)}</li>
      </ul>
      <p class="card-precio">
        <b>${fmt(final)}</b>
        ${tieneDesc ? `<s>${fmt(c.precio)}</s>` : ''}
      </p>
      <div class="prod-actions prod-actions-curso">
        <button type="button" class="btn btn-secundario prod-add" data-add="course:${c.id}">Reservar lugar</button>
      </div>
      <button type="button" class="card-link" data-ver="course:${c.id}">Ver el programa</button>
    </div>
  </article>`;
}

function initCategorias() {
  const cont = document.getElementById('matGrid');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map((c, i) => {
    const nProd = PRODUCTOS.filter(p => p.categoria === c.id).length;
    const nCur = TALLERES.filter(t => t.categoria === c.id).length;
    const pie = nCur > 0 ? `${nProd} piezas · ${nCur} taller${nCur > 1 ? 'es' : ''}` : `${nProd} piezas`;
    return `
    <button type="button" class="mat-card" data-ir-cat="${c.id}" data-animate style="opacity:0;transform:translateY(24px)">
      <span class="mat-num" aria-hidden="true">0${i + 1}</span>
      <span class="mat-media"><img src="${c.img}" width="1200" height="1200" alt="${esc(c.alt)}" decoding="async"></span>
      <span class="mat-txt">
        <b>${esc(c.nombre)}</b>
        <span class="mat-pie">${esc(c.pie)}</span>
        <span class="mat-cuenta">${pie}</span>
      </span>
    </button>`;
  }).join('');
}

function initRail() {
  const track = document.getElementById('railTrack');
  const vp = document.getElementById('railVp');
  if (!track || !vp) return;
  const orden = [1, 6, 8, 10, 3, 4, 12, 9];
  const curados = orden.map(id => getProducto(id)).filter(Boolean);
  track.innerHTML = curados.map(p => tarjetaProducto(p, 'rail')).join('');

  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    if (max <= 1) return;
    const atStart = vp.scrollLeft <= 0, atEnd = vp.scrollLeft >= max - 1;
    if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });

  initRailDrag(vp);

  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const paso = () => vp.clientWidth * 0.8;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: 'smooth' }));
  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

const estado = { tipo: 'all', cat: 'all', q: '', extra: {}, visibles: 16 };
const PASO_CATALOGO = 16;

function intercalar(lista) {
  const grupos = new Map();
  lista.forEach(i => {
    const k = `${i.type}:${i.categoria}`;
    if (!grupos.has(k)) grupos.set(k, []);
    grupos.get(k).push(i);
  });
  const colas = [...grupos.values()];
  const salida = [];
  let quedan = true;
  while (quedan) {
    quedan = false;
    colas.forEach(c => { if (c.length) { salida.push(c.shift()); quedan = true; } });
  }
  return salida;
}

function filtrados() {
  let base = estado.tipo === 'product' ? intercalar(PRODUCTOS)
    : estado.tipo === 'course' ? intercalar(TALLERES)
      : intercalar(TODOS());
  if (estado.cat !== 'all') base = base.filter(i => i.categoria === estado.cat);
  if (estado.extra.modalidad) base = base.filter(i => i.type !== 'course' || i.modalidad === estado.extra.modalidad);
  if (estado.extra.nivel) base = base.filter(i => i.type !== 'course' || i.nivel === estado.extra.nivel);
  if (estado.extra.stock === 'si') base = base.filter(i => i.type !== 'product' || (i.stock ?? 0) > 0);
  const q = normalizar(estado.q).trim();
  if (q) {
    const term = q.split(/\s+/);
    base = base.filter(i => {
      const heno = normalizar([i.nombre, catNombre(i.categoria), i.corta, i.modalidad, i.nivel,
        i.variante?.opciones?.join(' ')].filter(Boolean).join(' '));
      return term.every(t => heno.includes(t));
    });
  }
  return base;
}

function renderCatalogo() {
  const grid = document.getElementById('grid');
  const vacio = document.getElementById('vacio');
  const verMas = document.getElementById('verMas');
  const res = document.getElementById('resultados');
  const limpiar = document.getElementById('limpiar');
  if (!grid) return;

  const lista = filtrados();
  const mostrar = lista.slice(0, estado.visibles);
  grid.innerHTML = mostrar.map(i => (i.type === 'course' ? tarjetaTaller(i) : tarjetaProducto(i))).join('');

  const hayFiltro = estado.cat !== 'all' || estado.q.trim() !== '' || Object.keys(estado.extra).length > 0;
  if (vacio) vacio.hidden = lista.length !== 0;
  if (res) res.textContent = `${lista.length} ${lista.length === 1 ? 'resultado' : 'resultados'}`;
  if (limpiar) limpiar.hidden = !hayFiltro;
  if (verMas) verMas.hidden = lista.length <= estado.visibles;

  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function renderChips() {
  const cont = document.getElementById('chipsCat');
  if (!cont) return;
  const disponibles = CATEGORIAS.filter(c => {
    if (estado.tipo === 'course') return TALLERES.some(t => t.categoria === c.id);
    if (estado.tipo === 'product') return PRODUCTOS.some(p => p.categoria === c.id);
    return true;
  });
  cont.innerHTML = [{ id: 'all', nombre: 'Todos los materiales' }, ...disponibles].map(c =>
    `<button type="button" class="chip${estado.cat === c.id ? ' is-on' : ''}" data-cat="${c.id}" aria-pressed="${estado.cat === c.id}">${esc(c.nombre)}</button>`).join('');
}

function renderFiltrosExtra() {
  const cont = document.getElementById('filtrosExtra');
  if (!cont) return;
  if (estado.tipo === 'course') {
    const modalidades = [...new Set(TALLERES.map(t => t.modalidad))];
    const niveles = [...new Set(TALLERES.map(t => t.nivel))];
    cont.innerHTML = `
      <label class="sel"><span>Modalidad</span>
        <select data-extra="modalidad"><option value="">Todas</option>${modalidades.map(m => `<option${estado.extra.modalidad === m ? ' selected' : ''}>${esc(m)}</option>`).join('')}</select>
      </label>
      <label class="sel"><span>Nivel</span>
        <select data-extra="nivel"><option value="">Todos</option>${niveles.map(n => `<option${estado.extra.nivel === n ? ' selected' : ''}>${esc(n)}</option>`).join('')}</select>
      </label>`;
  } else if (estado.tipo === 'product') {
    cont.innerHTML = `
      <label class="sel"><span>Disponibilidad</span>
        <select data-extra="stock"><option value="">Todas</option><option value="si"${estado.extra.stock === 'si' ? ' selected' : ''}>Solo con stock</option></select>
      </label>`;
  } else {
    cont.innerHTML = '';
  }
}

function setTipo(tipo) {
  estado.tipo = tipo;
  estado.extra = {};
  estado.visibles = PASO_CATALOGO;
  const chipsValidos = CATEGORIAS.filter(c => tipo === 'all' || (tipo === 'course'
    ? TALLERES.some(t => t.categoria === c.id) : PRODUCTOS.some(p => p.categoria === c.id))).map(c => c.id);
  if (estado.cat !== 'all' && !chipsValidos.includes(estado.cat)) estado.cat = 'all';
  document.querySelectorAll('.tab').forEach(t => {
    const on = t.dataset.tipo === tipo;
    t.classList.toggle('is-on', on);
    t.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  const grid = document.getElementById('grid');
  const tabOn = document.querySelector('.tab.is-on');
  if (grid && tabOn) grid.setAttribute('aria-labelledby', tabOn.id);
  renderChips();
  renderFiltrosExtra();
  renderCatalogo();
}

function initCatalogo() {
  renderChips();
  renderFiltrosExtra();
  renderCatalogo();

  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => setTipo(t.dataset.tipo)));

  document.getElementById('chipsCat')?.addEventListener('click', e => {
    const chip = e.target.closest('[data-cat]');
    if (!chip) return;
    estado.cat = chip.dataset.cat;
    estado.visibles = PASO_CATALOGO;
    renderChips();
    renderCatalogo();
  });

  document.getElementById('filtrosExtra')?.addEventListener('change', e => {
    const sel = e.target.closest('[data-extra]');
    if (!sel) return;
    if (sel.value) estado.extra[sel.dataset.extra] = sel.value;
    else delete estado.extra[sel.dataset.extra];
    estado.visibles = PASO_CATALOGO;
    renderCatalogo();
  });

  const q = document.getElementById('q');
  let deb;
  q?.addEventListener('input', () => {
    clearTimeout(deb);
    deb = setTimeout(() => { estado.q = q.value; estado.visibles = PASO_CATALOGO; renderCatalogo(); }, 180);
  });

  const limpiarTodo = () => {
    estado.cat = 'all'; estado.q = ''; estado.extra = {}; estado.visibles = PASO_CATALOGO;
    if (q) q.value = '';
    renderChips(); renderFiltrosExtra(); renderCatalogo();
  };
  document.getElementById('limpiar')?.addEventListener('click', limpiarTodo);
  document.getElementById('vacioLimpiar')?.addEventListener('click', limpiarTodo);

  document.getElementById('verMas')?.addEventListener('click', () => {
    estado.visibles += PASO_CATALOGO;
    renderCatalogo();
  });

  document.getElementById('buscarToggle')?.addEventListener('click', () => {
    document.getElementById('tienda')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => document.getElementById('q')?.focus(), 500);
  });
}

function initCombos() {
  const cont = document.getElementById('comboGrid');
  if (!cont) return;
  cont.innerHTML = BUNDLES.map(b => {
    const cursos = b.courseIds.map(id => getTaller(id)).filter(Boolean);
    const prods = b.productLines.map(l => ({ p: getProducto(l.id), qty: l.qty })).filter(x => x.p);
    const suelto = cursos.reduce((s, c) => s + precioFinal(c), 0)
      + prods.reduce((s, x) => s + precioFinal(x.p) * x.qty, 0);
    const ahorro = suelto - b.precioBundle;
    const piezas = [...cursos.map(c => ({ nombre: c.nombre, img: c.imagen, alt: c.alt, tag: 'Taller' })),
      ...prods.map(x => ({ nombre: x.p.nombre, img: x.p.imagen, alt: x.p.alt, tag: 'Kit' }))];
    return `
    <article class="combo" data-animate style="opacity:0;transform:translateY(24px)">
      <div class="combo-imgs">
        ${piezas.map(p => `<figure><img src="${p.img}" width="1200" height="1200" alt="${esc(p.alt)}" decoding="async"><figcaption>${esc(p.tag)}</figcaption></figure>`).join('<span class="combo-mas" aria-hidden="true">+</span>')}
      </div>
      <div class="combo-txt">
        <h3>${esc(b.titulo)}</h3>
        <p>${esc(b.texto)}</p>
        <ul class="combo-lista">${piezas.map(p => `<li>${esc(p.nombre)}</li>`).join('')}</ul>
        <p class="combo-precio">
          <b>${fmt(b.precioBundle)}</b>
          <s>${fmt(suelto)}</s>
          <span class="combo-ahorro">Ahorrás ${fmt(ahorro)}</span>
        </p>
        <button type="button" class="btn btn-primary" data-combo="${b.id}">Agregar el combo</button>
      </div>
    </article>`;
  }).join('');

  cont.addEventListener('click', e => {
    const btn = e.target.closest('[data-combo]');
    if (!btn) return;
    const b = BUNDLES.find(x => x.id === Number(btn.dataset.combo));
    if (!b) return;
    b.courseIds.forEach(id => Cart.add('course', id));
    b.productLines.forEach(l => {
      const p = getProducto(l.id);
      Cart.add('product', l.id, p?.variante ? p.variante.opciones[0] : null, l.qty);
    });
    showToast('Combo agregado. Está en tu pedido.');
    abrirDrawer();
  });
}

let ultimoFoco = null;

function trapFoco(cont, e) {
  const focusables = cont.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const primero = focusables[0];
  const ultimo = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function abrirDrawer() {
  const d = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!d || !bd) return;
  ultimoFoco = document.activeElement;
  renderDrawer();
  d.hidden = false; bd.hidden = false;
  requestAnimationFrame(() => { d.classList.add('open'); bd.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('drawerClose')?.focus();
}

function cerrarDrawer() {
  const d = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!d || !bd) return;
  d.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { d.hidden = true; bd.hidden = true; }, 320);
  ultimoFoco?.focus();
}

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const pie = document.getElementById('drawerPie');
  if (!body || !pie) return;
  const lineas = Cart.lineas();

  if (!lineas.length) {
    body.innerHTML = `
      <div class="drawer-vacio">
        <span class="vacio-sello" aria-hidden="true">VG</span>
        <p><b>Tu pedido está vacío.</b><br>Elegí una pieza o reservá un taller y aparece acá.</p>
        <button type="button" class="btn btn-ghost" data-cerrar-drawer>Ver la tienda</button>
      </div>`;
    pie.innerHTML = '';
    return;
  }

  const cursos = lineas.filter(l => l.type === 'course');
  const prods = lineas.filter(l => l.type === 'product');

  const lineaHtml = l => {
    const it = getItem(l.type, l.id);
    const final = precioFinal(it);
    return `
    <li class="dl">
      <img src="${it.imagen}" width="1200" height="1200" alt="" aria-hidden="true" decoding="async">
      <div class="dl-txt">
        <b>${esc(it.nombre)}</b>
        ${l.variantKey ? `<span class="dl-var">${esc(it.variante?.nombre || 'Opción')}: ${esc(l.variantKey)}</span>` : ''}
        ${l.type === 'course' ? `<span class="dl-var">${esc(it.modalidad)} · ${esc(it.duracion)}</span>` : ''}
        <span class="dl-precio">${fmt(final * l.qty)}</span>
      </div>
      <div class="dl-acc">
        ${l.type === 'product' ? `
        <div class="stepper stepper-mini" data-stepper-linea="${esc(l.key)}">
          <button type="button" class="step-menos" aria-label="Quitar uno">−</button>
          <input type="text" inputmode="numeric" value="${l.qty}" aria-label="Cantidad" data-qty>
          <button type="button" class="step-mas" aria-label="Sumar uno">+</button>
        </div>` : ''}
        <button type="button" class="dl-quitar" data-quitar="${esc(l.key)}" aria-label="Quitar ${esc(it.nombre)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </li>`;
  };

  body.innerHTML = `
    ${cursos.length ? `<section class="dgrupo"><h3>Talleres <span>coordinamos fecha por WhatsApp</span></h3><ul>${cursos.map(lineaHtml).join('')}</ul></section>` : ''}
    ${prods.length ? `<section class="dgrupo"><h3>Piezas <span>con entrega o retiro</span></h3><ul>${prods.map(lineaHtml).join('')}</ul></section>` : ''}`;

  const subCursos = Cart.subtotal('course');
  const subProds = Cart.subtotal('product');
  pie.innerHTML = `
    <dl class="totales">
      ${cursos.length ? `<div><dt>Talleres</dt><dd>${fmt(subCursos)}</dd></div>` : ''}
      ${prods.length ? `<div><dt>Piezas</dt><dd>${fmt(subProds)}</dd></div>` : ''}
      <div class="total"><dt>Total</dt><dd>${fmt(Cart.total())}</dd></div>
    </dl>
    <p class="drawer-nota">${cursos.length && prods.length
    ? 'Te confirmamos la fecha del taller y coordinamos la entrega de las piezas por WhatsApp.'
    : cursos.length ? 'Te escribimos para confirmar la fecha y el lugar del taller.'
      : 'Coordinamos envío o retiro por WhatsApp una vez confirmado el pedido.'}</p>
    <button type="button" class="btn btn-primary btn-full" id="cerrarPedido">Enviar el pedido por WhatsApp</button>
    <button type="button" class="link-vaciar" id="vaciarCarrito">Vaciar el pedido</button>`;
}

function mensajeWsp() {
  const lineas = Cart.lineas();
  const cursos = lineas.filter(l => l.type === 'course');
  const prods = lineas.filter(l => l.type === 'product');
  let txt = 'Hola Artesanía VG, quiero hacer este pedido:\n';
  if (cursos.length) {
    txt += '\nTALLERES\n';
    cursos.forEach(l => {
      const c = getTaller(l.id);
      txt += `• ${c.nombre} (${c.modalidad}) — ${fmt(precioFinal(c))}\n`;
    });
  }
  if (prods.length) {
    txt += '\nPIEZAS\n';
    prods.forEach(l => {
      const p = getProducto(l.id);
      const v = l.variantKey && l.variantKey !== 'unica' ? ` [${l.variantKey}]` : '';
      txt += `• ${p.nombre}${v} x${l.qty} — ${fmt(precioFinal(p) * l.qty)}\n`;
    });
  }
  txt += `\nTotal: ${fmt(Cart.total())}`;
  if (prods.length) txt += '\n\nNecesito coordinar el envío.';
  return txt;
}

function initDrawer() {
  document.getElementById('cartBtn')?.addEventListener('click', abrirDrawer);
  document.getElementById('cartFloat')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarDrawer);

  const d = document.getElementById('cartDrawer');
  d?.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); document.getElementById('tienda')?.scrollIntoView({ behavior: 'smooth' }); return; }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) { Cart.remove(quitar.dataset.quitar); renderDrawer(); return; }
    const step = e.target.closest('[data-stepper-linea] button');
    if (step) {
      const wrap = step.closest('[data-stepper-linea]');
      const input = wrap.querySelector('[data-qty]');
      const actual = parseInt(input.value, 10) || 1;
      Cart.setQty(wrap.dataset.stepperLinea, step.classList.contains('step-mas') ? actual + 1 : actual - 1);
      renderDrawer();
      return;
    }
    if (e.target.closest('#vaciarCarrito')) { Cart.clear(); renderDrawer(); return; }
    if (e.target.closest('#cerrarPedido')) {
      if (!Cart.lineas().length) return;
      window.open(`https://wa.me/${WSP}?text=${encodeURIComponent(mensajeWsp())}`, '_blank', 'noopener');
      showToast('Te llevamos a WhatsApp con el pedido armado.');
    }
  });

  document.addEventListener('keydown', e => {
    if (!d || d.hidden) return;
    if (e.key === 'Escape') cerrarDrawer();
    if (e.key === 'Tab') trapFoco(d, e);
  });

  document.addEventListener('cart:updated', () => { if (d && !d.hidden) renderDrawer(); });
}

function cuerpoModalProducto(p) {
  const final = precioFinal(p);
  const rel = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 3);
  const taller = TALLERES.find(t => t.categoria === p.categoria);
  return `
  <div class="mdl-grid">
    <figure class="mdl-media"><img src="${p.imagen}" width="1200" height="1200" alt="${esc(p.alt)}" decoding="async"></figure>
    <div class="mdl-info">
      <span class="badge-tipo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M20 7 12 3 4 7v10l8 4 8-4z" stroke-linejoin="round"/><path d="m4 7 8 4 8-4M12 11v10"/></svg>Pieza</span>
      <h2>${esc(p.nombre)}</h2>
      <p class="mdl-cat">${esc(catNombre(p.categoria))}</p>
      <p class="mdl-precio"><b>${fmt(final)}</b>${p.descuento > 0 ? `<s>${fmt(p.precio)}</s><span class="badge-desc">-${p.descuento}%</span>` : ''}</p>
      <p class="mdl-desc">${esc(p.larga)}</p>
      ${p.variante ? `
      <div class="mdl-var">
        <span class="mdl-lbl">${esc(p.variante.nombre)}</span>
        <div class="var-chips" id="varChips">
          ${p.variante.opciones.map((o, i) => `<button type="button" class="chip${i === 0 ? ' is-on' : ''}" data-var="${esc(o)}" aria-pressed="${i === 0}">${esc(o)}</button>`).join('')}
        </div>
      </div>` : ''}
      <p class="mdl-stock">${p.stock > 0 ? `${p.stock} disponibles` : 'Sin stock — se hace a pedido'}</p>
      <div class="mdl-acciones">
        <div class="stepper" data-stepper>
          <button type="button" class="step-menos" aria-label="Quitar uno">−</button>
          <input type="text" inputmode="numeric" value="1" aria-label="Cantidad" data-qty>
          <button type="button" class="step-mas" aria-label="Sumar uno">+</button>
        </div>
        <button type="button" class="btn btn-primary" data-add-modal="product:${p.id}">Agregar al pedido</button>
        <button type="button" class="btn btn-secundario" data-comprar-modal="product:${p.id}">Comprar ahora</button>
      </div>
      ${taller ? `
      <aside class="mdl-cross">
        <p><b>¿Y si la hacés vos?</b> ${esc(taller.nombre)} enseña justamente esta técnica.</p>
        <button type="button" class="card-link" data-ver="course:${taller.id}">Ver el taller</button>
      </aside>` : ''}
    </div>
  </div>
  ${rel.length ? `<section class="mdl-rel"><h3>También en ${esc(catNombre(p.categoria))}</h3>
    <div class="rel-grid">${rel.map(r => `
      <button type="button" class="rel-card" data-ver="product:${r.id}">
        <img src="${r.imagen}" width="1200" height="1200" alt="${esc(r.alt)}" decoding="async">
        <span>${esc(r.nombre)}</span><b>${fmt(precioFinal(r))}</b>
      </button>`).join('')}</div></section>` : ''}`;
}

function cuerpoModalTaller(c) {
  const final = precioFinal(c);
  const KIT_POR_MATERIAL = { velas: 12, resina: 13 };
  const kit = getProducto(KIT_POR_MATERIAL[c.categoria]);
  return `
  <div class="mdl-grid">
    <figure class="mdl-media"><img src="${c.imagen}" width="1200" height="1200" alt="${esc(c.alt)}" decoding="async"></figure>
    <div class="mdl-info">
      <span class="badge-tipo badge-curso"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 6.5 12 3l9 3.5-9 3.5z" stroke-linejoin="round"/><path d="M6 9v5.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V9" stroke-linecap="round"/></svg>Taller</span>
      <h2>${esc(c.nombre)}</h2>
      <p class="mdl-cat">${esc(catNombre(c.categoria))} · ${esc(c.nivel)}</p>
      <p class="mdl-precio"><b>${fmt(final)}</b>${c.descuento > 0 ? `<s>${fmt(c.precio)}</s><span class="badge-desc">-${c.descuento}%</span>` : ''}</p>
      <ul class="mdl-datos">
        <li><span>Modalidad</span><b>${esc(c.modalidad)}</b></li>
        <li><span>Duración</span><b>${esc(c.duracion)}</b></li>
        <li><span>Nivel</span><b>${esc(c.nivel)}</b></li>
        <li><span>Cupo</span><b>${esc(c.cupo)}</b></li>
      </ul>
      <p class="mdl-desc">${esc(c.larga)}</p>
      <div class="mdl-acciones">
        <button type="button" class="btn btn-primary" data-add-modal="course:${c.id}">Reservar mi lugar</button>
      </div>
      ${kit ? `
      <aside class="mdl-cross">
        <p><b>Para seguir en casa:</b> ${esc(kit.nombre)}, ${fmt(precioFinal(kit))}.</p>
        <button type="button" class="card-link" data-ver="product:${kit.id}">Ver el kit</button>
      </aside>` : ''}
    </div>
  </div>
  <section class="mdl-programa">
    <h3>Qué vas a saber hacer al terminar</h3>
    <ul class="mdl-result">${c.resultados.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
    <h3>El programa</h3>
    <div class="prog">
      ${c.modulos.map((m, i) => `
      <details${i === 0 ? ' open' : ''}>
        <summary><span class="prog-n">0${i + 1}</span>${esc(m.t)}</summary>
        <ul>${m.c.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      </details>`).join('')}
    </div>
    <h3>Qué incluye</h3>
    <ul class="mdl-incluye">${c.incluye.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
  </section>`;
}

function abrirModal(type, id) {
  const it = getItem(type, id);
  const modal = document.getElementById('quickModal');
  const bd = document.getElementById('modalBackdrop');
  const body = document.getElementById('modalBody');
  if (!it || !modal || !bd || !body) return;
  if (modal.hidden) ultimoFoco = document.activeElement;
  body.innerHTML = type === 'course' ? cuerpoModalTaller(it) : cuerpoModalProducto(it);
  modal.setAttribute('aria-label', it.nombre);
  body.scrollTop = 0;
  modal.hidden = false; bd.hidden = false;
  requestAnimationFrame(() => { modal.classList.add('open'); bd.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('modalClose')?.focus();
}

function cerrarModal() {
  const modal = document.getElementById('quickModal');
  const bd = document.getElementById('modalBackdrop');
  if (!modal || !bd) return;
  modal.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { modal.hidden = true; bd.hidden = true; }, 300);
  ultimoFoco?.focus();
}

function leerStepper(scope) {
  const input = scope?.querySelector('[data-stepper] [data-qty]');
  return Math.max(1, parseInt(input?.value, 10) || 1);
}

function initModal() {
  const modal = document.getElementById('quickModal');
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  document.getElementById('modalBackdrop')?.addEventListener('click', cerrarModal);
  document.addEventListener('keydown', e => {
    if (!modal || modal.hidden) return;
    if (e.key === 'Escape') cerrarModal();
    if (e.key === 'Tab') trapFoco(modal, e);
  });

  modal?.addEventListener('click', e => {
    const chip = e.target.closest('#varChips [data-var]');
    if (chip) {
      modal.querySelectorAll('#varChips .chip').forEach(c => { c.classList.remove('is-on'); c.setAttribute('aria-pressed', 'false'); });
      chip.classList.add('is-on'); chip.setAttribute('aria-pressed', 'true');
      return;
    }
    const step = e.target.closest('[data-stepper] button');
    if (step) { pasoStepper(step); return; }
    const ver = e.target.closest('[data-ver]');
    if (ver) {
      const [t, i] = ver.dataset.ver.split(':');
      abrirModal(t, Number(i));
      return;
    }
    const add = e.target.closest('[data-add-modal], [data-comprar-modal]');
    if (!add) return;
    const comprar = add.hasAttribute('data-comprar-modal');
    const [t, i] = (add.dataset.addModal || add.dataset.comprarModal).split(':');
    const variante = modal.querySelector('#varChips .chip.is-on')?.dataset.var || null;
    const qty = t === 'course' ? 1 : leerStepper(modal);
    const ok = Cart.add(t, Number(i), variante, qty);
    if (t === 'course' && ok === false) { showToast('Ese taller ya está en tu pedido.'); return; }
    if (comprar) { cerrarModal(); setTimeout(abrirDrawer, 200); }
    else showToast(t === 'course' ? '¡Lugar reservado! Está en tu pedido.' : '¡Agregado! Ya está en tu pedido.');
  });
}

function pasoStepper(btn) {
  const wrap = btn.closest('[data-stepper]');
  const input = wrap?.querySelector('[data-qty]');
  if (!input) return;
  const actual = parseInt(input.value, 10) || 1;
  input.value = Math.max(1, btn.classList.contains('step-mas') ? actual + 1 : actual - 1);
}

function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('.card [data-stepper] button');
    if (step) { pasoStepper(step); return; }

    const add = e.target.closest('[data-add]');
    if (add) {
      const [t, i] = add.dataset.add.split(':');
      const card = add.closest('.card');
      const qty = t === 'course' ? 1 : leerStepper(card);
      const p = t === 'product' ? getProducto(Number(i)) : null;
      const variante = p?.variante ? p.variante.opciones[0] : null;
      const ok = Cart.add(t, Number(i), variante, qty);
      if (t === 'course' && ok === false) { showToast('Ese taller ya está en tu pedido.'); return; }
      showToast(t === 'course' ? '¡Lugar reservado! Está en tu pedido.' : '¡Agregado! Ya está en tu pedido.');
      return;
    }

    const ver = e.target.closest('[data-ver]');
    if (ver && !e.target.closest('#quickModal')) {
      const [t, i] = ver.dataset.ver.split(':');
      abrirModal(t, Number(i));
      return;
    }

    const irCat = e.target.closest('[data-ir-cat]');
    if (irCat) {
      e.preventDefault();
      const cat = irCat.dataset.irCat;
      setTipo('all');
      estado.cat = cat;
      estado.visibles = PASO_CATALOGO;
      renderChips();
      renderCatalogo();
      document.getElementById('tienda')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const irTab = e.target.closest('[data-ir-tab]');
    if (irTab) {
      setTipo(irTab.dataset.irTab);
      setTimeout(() => document.getElementById('tienda')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
    }
  });
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
  const cart = document.getElementById('cartFloat');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  sync();
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  const header = document.querySelector('.site-header');
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 861px)');
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
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); }
  });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMateria() {
  const stage = document.getElementById('materiaStage');
  const capas = [...document.querySelectorAll('.molde .capa')];
  const pasos = [...document.querySelectorAll('#materiaPasos li')];
  const num = document.getElementById('moldeNum');
  const molde = document.getElementById('molde');
  if (!stage || !capas.length || !pasos.length) return;

  const FORMAS = [
    '58% 42% 46% 54% / 46% 40% 60% 54%',
    '42% 58% 62% 38% / 55% 45% 55% 45%',
    '50% 50% 40% 60% / 38% 58% 42% 62%',
    '60% 40% 55% 45% / 50% 55% 45% 50%',
  ];

  const setPaso = progreso => {
    const i = Math.min(pasos.length - 1, Math.floor(progreso * pasos.length));
    pasos.forEach((li, n) => li.classList.toggle('is-on', n === i));
    capas.forEach((c, n) => c.classList.toggle('is-on', n === i));
    if (num) num.textContent = `0${i + 1}`;
    if (molde) molde.style.borderRadius = FORMAS[i];
    stage.dataset.mat = String(i);
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    setPaso(0);
    if (reduceMotion) pasos.forEach(li => li.classList.add('is-on'));
    return;
  }

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: '+=240%',
      pin: true, scrub: .6, invalidateOnRefresh: true,
      onUpdate: self => setPaso(self.progress),
    });
    setPaso(0);
    return () => st.kill();
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: 'bottom bottom',
      scrub: .6, invalidateOnRefresh: true,
      onUpdate: self => setPaso(self.progress),
    });
    setPaso(0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { st.kill(); stage.classList.remove('is-sticky-mobile'); };
  });
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

function initFaq() {
  const items = document.querySelectorAll('.faq details');
  items.forEach(d => {
    d.addEventListener('toggle', () => {
      if (!d.open) return;
      items.forEach(o => { if (o !== d) o.open = false; });
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  });
}

function initAnio() {
  const el = document.getElementById('anio');
  if (el) el.textContent = new Date().getFullYear();
}

initCategorias();
initRail();
initCatalogo();
initCombos();
initReveals();
initHero();
initMateria();
initLeeScroll();
initAcciones();
initModal();
initDrawer();
initFloats();
initNav();
initFaq();
initAnio();
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
