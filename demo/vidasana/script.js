const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

const WA = '5493755415089';
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const ICO = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z"/><path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/></svg>'
};

const CATEGORIAS = [
  { id: 'medicina-natural', nombre: 'Medicina natural', img: 'libro-medicina-natural-guia' },
  { id: 'plantas-medicinales', nombre: 'Plantas medicinales', img: 'vidasana-plantas' },
  { id: 'jugos', nombre: 'Jugos y licuados', img: 'libro-jugos-verdes' },
  { id: 'recetas', nombre: 'Recetas saludables', img: 'vidasana-recetas' },
  { id: 'biblias', nombre: 'Biblias y devocionales', img: 'libro-biblia-estudio' },
  { id: 'autoayuda', nombre: 'Autoayuda', img: 'libro-respirar-pausar' }
];

const PRODUCTOS = [
  { id: 'herbario-ilustrado', nombre: 'Herbario ilustrado de plantas medicinales', cat: 'plantas-medicinales', formato: 'Tapa dura', paginas: 288, precio: 32900, descuento: 0, stock: 6, nuevo: false, masVendido: true, img: 'libro-herbario-ilustrado', alt: 'Libro de tapa clara con ilustración botánica sobre una pila de libros de plantas', desc: 'Fichas ilustradas de las plantas medicinales más usadas en casa: cómo reconocerlas, qué parte se usa y cómo se prepara cada infusión o tintura.', tags: ['manzanilla', 'menta', 'cedron', 'herbario', 'ilustrado'] },
  { id: 'plantas-medicinales-argentina', nombre: 'Plantas medicinales de la Argentina', cat: 'plantas-medicinales', formato: 'Tapa blanda', paginas: 256, precio: 27800, descuento: 0, stock: 9, nuevo: false, masVendido: true, img: 'libro-plantas-medicinales-argentina', alt: 'Libro blanco con ilustración de hierbas y flores violetas', desc: 'Un recorrido por las especies nativas y aclimatadas de cada región del país, con usos tradicionales y recomendaciones de recolección.', tags: ['nativas', 'yerba', 'peperina', 'burrito', 'regiones'] },
  { id: 'infusiones-estacion', nombre: 'Infusiones para cada estación', cat: 'plantas-medicinales', formato: 'Tapa blanda', paginas: 176, precio: 17500, descuento: 0, stock: 14, nuevo: false, masVendido: false, img: 'libro-infusiones-estacion', alt: 'Lomo de libro color crema con flores silvestres dibujadas', desc: 'Mezclas de hierbas para el frío, el calor y los cambios de estación, con proporciones, tiempos de reposo y combinaciones con especias.', tags: ['te', 'tisanas', 'hierbas', 'invierno'] },
  { id: 'huerta-aromaticas', nombre: 'Cultivá tu huerta de aromáticas', cat: 'plantas-medicinales', formato: 'Tapa blanda', paginas: 192, precio: 19900, descuento: 15, stock: 8, nuevo: true, masVendido: false, img: 'libro-huerta-aromaticas', alt: 'Libro con tapa de manzanillas, lavanda y romero en un mortero', desc: 'Cómo sembrar, regar y cosechar romero, menta, cedrón, lavanda y otras aromáticas en macetas, balcones o un rincón del patio.', tags: ['huerta', 'cultivo', 'macetas', 'romero', 'lavanda'] },
  { id: 'medicina-natural-guia', nombre: 'Medicina natural: guía práctica para la familia', cat: 'medicina-natural', formato: 'Tapa dura', paginas: 320, precio: 29500, descuento: 0, stock: 7, nuevo: false, masVendido: true, img: 'libro-medicina-natural-guia', alt: 'Libro verde con un mortero de piedra y hierbas en la tapa', desc: 'Una guía de consulta ordenada por temas cotidianos, con preparaciones naturales, cuidados básicos y señales para consultar al médico.', tags: ['familia', 'guia', 'cuidados', 'hogar'] },
  { id: 'botiquin-natural', nombre: 'El botiquín natural de la casa', cat: 'medicina-natural', formato: 'Tapa blanda', paginas: 208, precio: 21900, descuento: 0, stock: 11, nuevo: true, masVendido: false, img: 'libro-botiquin-natural', alt: 'Tapa con hierbas frescas, coliflor y un frasco de aceite esencial', desc: 'Qué tener a mano y cómo preparar ungüentos, aceites y compresas caseras con ingredientes simples y conservación segura.', tags: ['botiquin', 'aceites', 'unguentos', 'compresas'] },
  { id: 'remedios-caseros', nombre: 'Remedios caseros de toda la vida', cat: 'medicina-natural', formato: 'Tapa blanda', paginas: 224, precio: 16900, descuento: 10, stock: 15, nuevo: false, masVendido: true, img: 'libro-remedios-caseros', alt: 'Libro con una cuchara de madera llena de hierbas secas en la tapa', desc: 'Recetas de las abuelas recopiladas y explicadas: caldos, jarabes de miel, vahos y cataplasmas, con el porqué de cada ingrediente.', tags: ['abuela', 'jarabe', 'miel', 'tradicion'] },
  { id: 'hierbas-raices-semillas', nombre: 'Hierbas, raíces y semillas', cat: 'medicina-natural', formato: 'Tapa dura', paginas: 240, precio: 24800, descuento: 0, stock: 5, nuevo: false, masVendido: false, img: 'libro-hierbas-raices-semillas', alt: 'Pila de libros con lomos verdes y crema ilustrados con hojas', desc: 'Jengibre, cúrcuma, lino, chía y otras despensas naturales: propiedades, formas de consumo y recetas para incorporarlas.', tags: ['jengibre', 'curcuma', 'semillas', 'lino', 'chia'] },
  { id: 'jugos-verdes', nombre: 'Jugos verdes para todo el año', cat: 'jugos', formato: 'Tapa blanda', paginas: 160, precio: 15800, descuento: 0, stock: 12, nuevo: false, masVendido: true, img: 'libro-jugos-verdes', alt: 'Libro con un frasco de jugo verde y limas en la tapa', desc: 'Más de 80 combinaciones de hojas, frutas y semillas ordenadas por estación, con cantidades para una persona o para toda la familia.', tags: ['verde', 'espinaca', 'apio', 'manzana'] },
  { id: 'licuados-batidos', nombre: 'Licuados, jugos y batidos naturales', cat: 'jugos', formato: 'Tapa blanda', paginas: 144, precio: 14900, descuento: 10, stock: 10, nuevo: true, masVendido: false, img: 'libro-licuados-batidos', alt: 'Tapa con jugos de naranja y verde, pomelo y frutos rojos', desc: 'Desayunos y meriendas en vaso: licuados con avena, batidos de frutas y jugos exprimidos, sin azúcar agregada.', tags: ['batidos', 'desayuno', 'frutas', 'avena'] },
  { id: 'siete-dias-jugos', nombre: 'Siete días de jugos frescos', cat: 'jugos', formato: 'Tapa blanda', paginas: 128, precio: 13900, descuento: 0, stock: 3, nuevo: false, masVendido: false, img: 'libro-siete-dias-jugos', alt: 'Libro con botellas de jugo naranja, verde y rojo en la tapa', desc: 'Un plan de una semana con lista de compras, preparación del día anterior y jugos para la mañana, el mediodía y la tarde.', tags: ['semana', 'plan', 'compras'] },
  { id: 'cocina-saludable', nombre: 'Cocina saludable de todos los días', cat: 'recetas', formato: 'Tapa dura', paginas: 272, precio: 26900, descuento: 0, stock: 9, nuevo: false, masVendido: true, img: 'libro-cocina-saludable', alt: 'Libro de recetas abierto con fotos de ensaladas y bowls', desc: 'Almuerzos y cenas simples con verduras de estación, legumbres y cereales integrales, pensados para cocinar en menos de 40 minutos.', tags: ['almuerzo', 'cena', 'verduras', 'rapidas'] },
  { id: 'bowls-legumbres', nombre: 'Bowls, ensaladas y legumbres', cat: 'recetas', formato: 'Tapa blanda', paginas: 192, precio: 22500, descuento: 10, stock: 7, nuevo: true, masVendido: false, img: 'libro-bowls-legumbres', alt: 'Tapa con un bowl de garbanzos, palta y rabanitos', desc: 'Garbanzos, lentejas y porotos en bowls completos, ensaladas tibias y aderezos caseros que se guardan toda la semana.', tags: ['garbanzos', 'lentejas', 'ensaladas', 'veggie'] },
  { id: 'sin-harinas-refinadas', nombre: 'Recetas sin harinas refinadas', cat: 'recetas', formato: 'Tapa blanda', paginas: 208, precio: 21900, descuento: 0, stock: 6, nuevo: false, masVendido: false, img: 'libro-sin-harinas-refinadas', alt: 'Libro con un plato de verduras en la tapa apoyado sobre otros libros', desc: 'Tartas, budines y masas con harinas integrales, de legumbres o de frutos secos, con equivalencias para reemplazar en tus recetas.', tags: ['integral', 'budines', 'tartas', 'masas'] },
  { id: 'viandas-semana', nombre: 'Viandas sanas para la semana', cat: 'recetas', formato: 'Tapa blanda', paginas: 176, precio: 18400, descuento: 0, stock: 13, nuevo: false, masVendido: false, img: 'libro-viandas-semana', alt: 'Pila de libros de cocina con un plato de verduras en la tapa', desc: 'Cómo organizar un domingo de cocina para tener viandas de lunes a viernes, con menús, porciones y conservación en heladera.', tags: ['viandas', 'trabajo', 'menu', 'organizacion'] },
  { id: 'panes-integrales', nombre: 'Panes y masas integrales', cat: 'recetas', formato: 'Tapa blanda', paginas: 160, precio: 19500, descuento: 0, stock: 8, nuevo: true, masVendido: false, img: 'libro-panes-integrales', alt: 'Libros de cocina apilados junto a un vaso de licuado verde', desc: 'Panes de molde, de campo y con semillas, masa madre paso a paso y prepizzas integrales para hacer en el horno de casa.', tags: ['pan', 'masa madre', 'semillas', 'horno'] },
  { id: 'alimentacion-consciente', nombre: 'Alimentación consciente', cat: 'recetas', formato: 'Tapa blanda', paginas: 232, precio: 20800, descuento: 0, stock: 10, nuevo: false, masVendido: false, img: 'libro-alimentacion-consciente', alt: 'Libro con un bowl de verduras, garbanzos y palta en la tapa', desc: 'Una mirada amable sobre qué, cómo y cuándo comemos, con recetas base y propuestas para armar el plato de cada día.', tags: ['plato', 'habitos', 'comer', 'consciente'] },
  { id: 'biblia-letra-grande', nombre: 'Biblia Reina-Valera 1960, letra grande', cat: 'biblias', formato: 'Símil cuero', paginas: 1536, precio: 42900, descuento: 0, stock: 6, nuevo: false, masVendido: true, img: 'libro-biblia-letra-grande', alt: 'Biblia de tapa marrón símil cuero con una cruz dorada', desc: 'Texto completo en letra grande para leer con comodidad, con referencias al pie, índice de libros y cinta marcadora.', tags: ['reina valera', 'rvr', 'letra grande', 'cuero'] },
  { id: 'biblia-estudio', nombre: 'Biblia de estudio con notas y mapas', cat: 'biblias', formato: 'Tapa dura', paginas: 2048, precio: 58900, descuento: 0, stock: 4, nuevo: false, masVendido: false, img: 'libro-biblia-estudio', alt: 'Biblia azul con guarda dorada apoyada junto a naranjas', desc: 'Introducción a cada libro, notas al pie, concordancia y mapas a color para estudiar en casa o en grupo.', tags: ['estudio', 'notas', 'mapas', 'concordancia'] },
  { id: 'biblia-bolsillo', nombre: 'Biblia de bolsillo con canto dorado', cat: 'biblias', formato: 'Símil cuero', paginas: 1280, precio: 24900, descuento: 0, stock: 9, nuevo: true, masVendido: false, img: 'libro-biblia-bolsillo', alt: 'Biblia azul con una rama dorada en la tapa y cinta marcadora', desc: 'Formato compacto para llevar en la cartera o la mochila, con canto dorado y cinta marcadora.', tags: ['bolsillo', 'regalo', 'compacta'] },
  { id: 'devocional-365', nombre: 'Devocional de 365 días', cat: 'biblias', formato: 'Tapa dura', paginas: 384, precio: 23900, descuento: 0, stock: 8, nuevo: false, masVendido: false, img: 'libro-devocional-365', alt: 'Libro azul con una hoja dorada en el lomo entre libros ilustrados', desc: 'Una lectura breve para cada día del año, con un versículo, una reflexión y una pregunta para la oración.', tags: ['devocional', 'oracion', 'diario', 'fe'] },
  { id: 'respirar-pausar', nombre: 'Respirar, pausar y seguir', cat: 'autoayuda', formato: 'Tapa blanda', paginas: 168, precio: 17900, descuento: 0, stock: 10, nuevo: false, masVendido: true, img: 'libro-respirar-pausar', alt: 'Libro con un lago entre montañas al amanecer en la tapa', desc: 'Ejercicios de respiración, pausas cortas y rutinas de descanso para bajar el ritmo en días cargados.', tags: ['respiracion', 'estres', 'descanso', 'calma'] },
  { id: 'habitos-sanos', nombre: 'Hábitos sanos que se sostienen', cat: 'autoayuda', formato: 'Tapa blanda', paginas: 208, precio: 19800, descuento: 10, stock: 9, nuevo: false, masVendido: false, img: 'libro-habitos-sanos', alt: 'Tapa con una mujer mirando el amanecer sobre las sierras', desc: 'Cómo empezar de a poco con el movimiento, la alimentación y el descanso, y armar rutinas que duren más allá de la primera semana.', tags: ['habitos', 'rutina', 'movimiento'] },
  { id: 'volver-a-empezar', nombre: 'Volver a empezar: cuaderno guiado', cat: 'autoayuda', formato: 'Cuaderno anillado', paginas: 120, precio: 15500, descuento: 0, stock: 12, nuevo: true, masVendido: false, img: 'libro-volver-a-empezar', alt: 'Cuaderno de tapa kraft atado con hilo y una rama de eucalipto', desc: 'Páginas para escribir metas, gratitud y pequeños logros de cada semana, con preguntas que acompañan sin presionar.', tags: ['cuaderno', 'diario', 'gratitud', 'metas'] }
];

const NOVEDADES = ['huerta-aromaticas', 'botiquin-natural', 'licuados-batidos', 'bowls-legumbres', 'panes-integrales', 'biblia-bolsillo', 'volver-a-empezar', 'habitos-sanos'];

const TEMAS = [
  { id: 'plantas', n: '01', titulo: 'Plantas y remedios caseros', img: 'vidasana-plantas', alt: 'Pila de libros de plantas medicinales junto a manzanilla seca y una maceta de melisa', texto: 'Herbarios ilustrados, guías de infusiones y libros de medicina natural para tener a mano en la cocina o en la biblioteca de casa.', cats: ['plantas-medicinales', 'medicina-natural'] },
  { id: 'cocina', n: '02', titulo: 'Cocina sana, jugos y licuados', img: 'vidasana-recetas', alt: 'Libro de recetas abierto junto a un licuado verde, frutas y verduras', texto: 'Recetas de todos los días, viandas, panes integrales y jugos frescos, con ingredientes fáciles de conseguir.', cats: ['recetas', 'jugos'] },
  { id: 'fe', n: '03', titulo: 'Fe, ánimo y lectura tranquila', img: 'vidasana-lectura', alt: 'Biblia azul sobre una pila de libros junto a una taza de té y una vela', texto: 'Biblias en distintos formatos, devocionales y libros para ordenar los días y bajar el ritmo.', cats: ['biblias', 'autoayuda'] }
];

const PRECIOS = [
  { id: 'hasta-18000', nombre: 'Hasta $18.000', min: 0, max: 18000 },
  { id: '18000-25000', nombre: '$18.000 a $25.000', min: 18000, max: 25000 },
  { id: 'mas-25000', nombre: 'Más de $25.000', min: 25000, max: Infinity }
];

const BASE = location.pathname.includes('/producto/') ? '../' : '';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const catNombre = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
const cuantos = id => PRODUCTOS.filter(p => p.cat === id).length;
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const Cart = {
  KEY: 'vidasana_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { } document.dispatchEvent(new CustomEvent('cart:updated')); },
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
  syncStock(productos) {
    const items = this.get(); let changed = false;
    const filtered = items.filter(i => {
      const p = productos.find(x => x.id === i.id);
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

function badgesHTML(p) {
  let b = '';
  if (p.descuento > 0) b += `<span class="badge badge--off">-${p.descuento}%</span>`;
  if (p.nuevo) b += '<span class="badge badge--nuevo">Nuevo</span>';
  if (p.stock <= 3) b += '<span class="badge badge--poco">Últimas unidades</span>';
  return b ? `<span class="prod-badges">${b}</span>` : '';
}
function precioHTML(p) {
  const off = p.descuento > 0;
  return `<div class="price${off ? ' is-off' : ''}"><strong>${formatearPrecio(precioFinal(p))}</strong>${off ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</div>`;
}
function stepperHTML() {
  return `<div class="stepper"><button type="button" data-step="-1" aria-label="Restar uno">${ICO.minus}</button><output>1</output><button type="button" data-step="1" aria-label="Sumar uno">${ICO.plus}</button></div>`;
}
function cardHTML(p, animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : '';
  return `<article class="prod-card"${anim}>
    <button class="prod-media" type="button" data-quick="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}">${badgesHTML(p)}<img src="images/${p.img}.webp" alt="${esc(p.alt)}" width="600" height="750"></button>
    <div class="prod-body">
      <span class="prod-cat">${esc(catNombre(p.cat))}</span>
      <h3 class="prod-title"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="prod-meta">${esc(p.formato)} · ${p.paginas.toLocaleString('es-AR')} págs.</p>
      ${precioHTML(p)}
      <div class="prod-actions">${stepperHTML()}<button class="btn btn-cta prod-add" type="button" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">Agregar<span class="add-extra"> al carrito</span></button></div>
      <button class="prod-buy" type="button" data-buy="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}
function railCardHTML(p) {
  return `<li class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)"><article class="rail-card">
    <button class="prod-media" type="button" data-quick="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}">${badgesHTML(p)}<img src="images/${p.img}.webp" alt="${esc(p.alt)}" width="600" height="750" draggable="false"></button>
    <div class="rail-card__body"><span class="prod-cat">${esc(catNombre(p.cat))}</span><h3 class="rail-card__title">${esc(p.nombre)}</h3>
    <div class="rail-card__row">${precioHTML(p)}<button class="btn btn-cta rail-add" type="button" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">Agregar</button></div></div>
  </article></li>`;
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
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    gsap.fromTo(el, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
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

function trapFocus(panel, e) {
  if (e.key !== 'Tab') return;
  const f = [...panel.querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
function abrirCapa(panel, backdrop) {
  panel.hidden = false;
  void panel.offsetWidth;
  panel.classList.add('open');
  backdrop?.classList.add('open');
  document.body.classList.add('no-scroll');
}
function cerrarCapa(panel, backdrop) {
  panel.classList.remove('open');
  backdrop?.classList.remove('open');
  setTimeout(() => { if (!panel.classList.contains('open')) panel.hidden = true; }, 400);
  if (!document.querySelector('.cart-drawer.open, .quick-modal.open, .filtros.open, .main-nav.open')) document.body.classList.remove('no-scroll');
}

let cartOpener = null;
function renderCart() {
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  if (!body) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  if (!items.length) {
    const volver = PAGINA === 'catalogo'
      ? '<button type="button" class="btn btn-cta" data-close-cart>Volver al catálogo</button>'
      : `<a class="btn btn-cta" href="${CATALOGO_URL}">Volver al catálogo</a>`;
    body.innerHTML = `<div class="cart-empty">${ICO.book}<h3>Tu carrito está vacío</h3><p>Todavía no sumaste libros. Hay herbarios, recetas y Biblias esperándote.</p>${volver}</div>`;
    if (foot) foot.hidden = true;
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    return `<div class="cart-line">
      <img src="images/${p.img}.webp" alt="" width="64" height="80">
      <div><h3>${esc(p.nombre)}</h3><div class="price"><strong>${formatearPrecio(precioFinal(p) * i.qty)}</strong></div>
        <div class="stepper"><button type="button" data-line-step="-1" data-id="${p.id}" aria-label="Restar uno">${ICO.minus}</button><output>${i.qty}</output><button type="button" data-line-step="1" data-id="${p.id}" aria-label="Sumar uno">${ICO.plus}</button></div></div>
      <button type="button" class="cart-remove" data-line-remove="${p.id}" aria-label="Quitar ${esc(p.nombre)} del carrito">${ICO.trash}</button>
    </div>`;
  }).join('');
  if (foot) foot.hidden = false;
  const total = document.getElementById('cartTotal');
  if (total) total.textContent = formatearPrecio(Cart.total());
}
function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  cartOpener = document.activeElement;
  renderCart();
  abrirCapa(drawer, document.getElementById('cartBackdrop'));
  setTimeout(() => drawer.querySelector('.drawer-close')?.focus(), 60);
}
function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer || !drawer.classList.contains('open')) return;
  cerrarCapa(drawer, document.getElementById('cartBackdrop'));
  cartOpener?.focus?.();
}
function initCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  document.getElementById('cartBackdrop')?.addEventListener('click', closeCartDrawer);
  drawer.addEventListener('keydown', e => { if (e.key === 'Escape') closeCartDrawer(); trapFocus(drawer, e); });
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-close-cart]')) { closeCartDrawer(); return; }
    const step = e.target.closest('[data-line-step]');
    if (step) { const it = Cart.get().find(i => i.id === step.dataset.id); if (it) Cart.setQty(it.id, it.qty + Number(step.dataset.lineStep)); return; }
    const rm = e.target.closest('[data-line-remove]');
    if (rm) { Cart.remove(rm.dataset.lineRemove); showToast('Quitamos el libro del carrito.'); }
  });
  document.getElementById('cartCheckout')?.addEventListener('click', () => {
    const btn = document.getElementById('cartCheckout');
    btn.disabled = true;
    setTimeout(() => { btn.disabled = false; showToast('¡Genial! El pago online se activa al pasar la web a producción.'); }, 500);
  });
  document.addEventListener('cart:updated', () => { if (drawer.classList.contains('open')) renderCart(); });
}

let quickOpener = null;
function openQuick(id) {
  const p = getProducto(id);
  const modal = document.getElementById('quickModal');
  if (!p || !modal) return;
  if (!modal.classList.contains('open')) quickOpener = document.activeElement;
  const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  const wa = `https://wa.me/${WA}?text=${encodeURIComponent(`Hola Vida Sana, quiero consultar por el libro «${p.nombre}».`)}`;
  const stock = p.stock <= 3 ? `Quedan ${p.stock} ejemplares` : 'Disponible';
  modal.querySelector('[data-quick-body]').innerHTML = `
    <div class="quick-grid">
      <div class="quick-img"><img src="images/${p.img}.webp" alt="${esc(p.alt)}" width="600" height="750"></div>
      <div class="quick-info">
        <span class="prod-cat">${esc(catNombre(p.cat))}</span>
        <h2>${esc(p.nombre)}</h2>
        <p class="prod-meta">${esc(p.formato)} · ${p.paginas.toLocaleString('es-AR')} páginas</p>
        ${precioHTML(p)}
        <p class="quick-desc">${esc(p.desc)}</p>
        <p class="quick-stock">${stock}</p>
        <div class="quick-buy">${stepperHTML()}<button class="btn btn-cta" type="button" data-add="${p.id}">Agregar al carrito</button><button class="btn btn-ghost" type="button" data-buy="${p.id}">Comprar ahora</button></div>
        <a class="sec-link" href="${wa}" target="_blank" rel="noopener">Consultar por este libro ${ICO.arrow}</a>
      </div>
    </div>
    ${rel.length ? `<div class="quick-rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" data-quick="${r.id}"><img src="images/${r.img}.webp" alt="" width="600" height="750"><span>${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
  let ld = document.getElementById('ldProducto');
  if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ldProducto'; document.head.appendChild(ld); }
  ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(`images/${p.img}.webp`, location.href).href, description: p.desc, category: catNombre(p.cat), offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: 'https://schema.org/InStock' } });
  if (!modal.classList.contains('open')) abrirCapa(modal, document.getElementById('quickBackdrop'));
  modal.scrollTop = 0;
  setTimeout(() => modal.querySelector('.modal-close')?.focus(), 60);
}
function closeQuick() {
  const modal = document.getElementById('quickModal');
  if (!modal || !modal.classList.contains('open')) return;
  cerrarCapa(modal, document.getElementById('quickBackdrop'));
  if (PAGINA === 'catalogo') { const u = new URL(location.href); if (u.searchParams.has('producto')) { u.searchParams.delete('producto'); history.replaceState(null, '', u); } }
  quickOpener?.focus?.();
}
function initQuick() {
  const modal = document.getElementById('quickModal');
  if (!modal) return;
  document.getElementById('quickBackdrop')?.addEventListener('click', closeQuick);
  modal.addEventListener('keydown', e => { if (e.key === 'Escape') closeQuick(); trapFocus(modal, e); });
  modal.addEventListener('click', e => { if (e.target.closest('[data-close-quick]')) closeQuick(); });
}

function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const out = step.parentElement.querySelector('output');
      const box = step.closest('.prod-card, .quick-buy');
      const id = box?.querySelector('[data-add]')?.dataset.add;
      const max = getProducto(id)?.stock ?? 99;
      out.textContent = Math.max(1, Math.min(max, Number(out.textContent) + Number(step.dataset.step)));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add); if (!p) return;
      const out = add.parentElement.querySelector('.stepper output');
      const qty = out ? Number(out.textContent) || 1 : 1;
      Cart.add(p, qty);
      if (out) out.textContent = '1';
      showToast(`Sumaste «${p.nombre}» al carrito.`);
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const p = getProducto(buy.dataset.buy); if (!p) return;
      const out = buy.closest('.prod-card, .quick-buy')?.querySelector('.stepper output');
      Cart.add(p, out ? Number(out.textContent) || 1 : 1);
      if (out) out.textContent = '1';
      closeQuick();
      setTimeout(openCartDrawer, document.getElementById('quickModal')?.hidden === false ? 120 : 0);
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) { openQuick(quick.dataset.quick); return; }
    if (e.target.closest('[data-open-cart]')) openCartDrawer();
  });
}

function initCatsMenu() {
  const params = new URLSearchParams(location.search);
  const activa = PAGINA === 'catalogo' ? params.get('cat') : null;
  document.querySelectorAll('[data-cats-menu]').forEach(menu => {
    const toggle = menu.querySelector('.cats-toggle');
    const panel = menu.querySelector('.cats-panel');
    if (!toggle || !panel) return;
    panel.innerHTML = CATEGORIAS.map(c => `<a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${activa === c.id ? ' aria-current="true"' : ''}><img src="images/${c.img}.webp" alt="" width="44" height="55" loading="lazy"><span>${esc(c.nombre)}<small>${cuantos(c.id)} libros</small></span></a>`).join('')
      + `<a class="cats-all" href="${CATALOGO_URL}">Ver todo el catálogo ${ICO.arrow}</a>`;
    const desktop = window.matchMedia('(min-width: 901px)');
    let timer = 0;
    const abrir = () => { clearTimeout(timer); panel.hidden = false; toggle.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(timer); panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
    menu.addEventListener('mouseenter', () => { if (desktop.matches) abrir(); });
    menu.addEventListener('mouseleave', () => { if (desktop.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 120); } });
    menu.addEventListener('focusout', e => { if (desktop.matches && !menu.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (desktop.matches && !menu.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { cerrar(); toggle.focus(); } });
    desktop.addEventListener('change', cerrar);
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 901px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!document.querySelector('.cart-drawer.open, .quick-modal.open, .filtros.open')) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, .cats-toggle')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  nav.addEventListener('click', e => { if (e.target.closest('.cats-item, .cats-all')) close(); });
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

function initHeroTicker() {
  const t = document.querySelector('[data-ticker]');
  if (!t) return;
  const msgs = [...t.querySelectorAll('.hero-ticker__msg')];
  const dots = [...t.querySelectorAll('.hero-ticker__dot')];
  let i = 0; let timer = 0;
  const ir = n => {
    i = (n + msgs.length) % msgs.length;
    msgs.forEach((m, k) => { const on = k === i; m.classList.toggle('is-on', on); m.tabIndex = on ? 0 : -1; m.setAttribute('aria-hidden', on ? 'false' : 'true'); });
    dots.forEach((d, k) => { d.classList.toggle('is-on', k === i); d.classList.toggle('is-done', k < i); d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
    clearTimeout(timer);
    if (!reduceMotion) timer = setTimeout(() => ir(i + 1), 5000);
  };
  dots.forEach((d, k) => d.addEventListener('click', () => ir(k)));
  ir(0);
}

function initCirculos() {
  const cont = document.querySelector('[data-circulos]');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map((c, k) => `<a class="circulo" href="${CATALOGO_URL}?cat=${c.id}" data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)">
    <span class="circulo__img"><img src="images/${c.img}.webp" alt="" width="600" height="600"></span>
    <span><span class="circulo__folio">N.º 0${k + 1}</span><strong>${esc(c.nombre)}</strong><small>${cuantos(c.id)} libros</small></span>
  </a>`).join('');
}

function initRail() {
  const vp = document.querySelector('[data-rail-vp]');
  const track = document.querySelector('[data-rail-track]');
  if (!vp || !track) return;
  track.innerHTML = PRODUCTOS.filter(p => p.masVendido).slice(0, 8).map(railCardHTML).join('');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.querySelector('.rail-item')?.getBoundingClientRect().width || 260) + 20;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  const flechas = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();

  let down = false, moved = false, startX = 0, startLeft = 0, pointerId = 0;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { }
    }
    if (moved) vp.scrollLeft = startLeft - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch { }
    vp.classList.remove('dragging');
    if (moved) {
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 60);
    }
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', end);
}

function initPreview() {
  const cont = document.querySelector('[data-preview]');
  if (!cont) return;
  cont.innerHTML = NOVEDADES.map(getProducto).filter(Boolean).map(p => cardHTML(p)).join('');
}

function temaHTML(t) {
  return `<div class="tema-panel__img"><img src="images/${t.img}.webp" alt="${esc(t.alt)}" width="1200" height="1200"></div>
    <div><span class="etiqueta"><b>N.º ${t.n}</b> Tema</span><h3 style="margin-top:12px">${esc(t.titulo)}</h3><p>${esc(t.texto)}</p>
    <div class="tema-cats">${t.cats.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c}">${esc(catNombre(c))} · ${cuantos(c)}</a>`).join('')}</div>
    <a class="btn btn-cta" href="${CATALOGO_URL}?cat=${t.cats[0]}">Ver ${esc(catNombre(t.cats[0]).toLowerCase())} ${ICO.arrow}</a></div>`;
}
function initTemas() {
  const panel = document.getElementById('temaPanel');
  const tabs = [...document.querySelectorAll('[data-tema]')];
  if (!panel || !tabs.length) return;
  const ir = (id, foco) => {
    const t = TEMAS.find(x => x.id === id) || TEMAS[0];
    tabs.forEach(b => { const on = b.dataset.tema === t.id; b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; if (on && foco) b.focus(); });
    panel.setAttribute('aria-labelledby', `tab-${t.id}`);
    panel.innerHTML = temaHTML(t);
    panel.classList.remove('is-entering'); void panel.offsetWidth; panel.classList.add('is-entering');
    refrescar();
  };
  tabs.forEach((b, k) => {
    b.addEventListener('click', () => ir(b.dataset.tema));
    b.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
      ir(tabs[(k + d + tabs.length) % tabs.length].dataset.tema, true);
    });
  });
  panel.innerHTML = temaHTML(TEMAS[0]);
}

function initCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const POR_PAGINA = 16;
  const params = new URLSearchParams(location.search);
  const lista = v => (v || '').split(',').map(s => s.trim()).filter(Boolean);
  const FORMATOS = [...new Set(PRODUCTOS.map(p => p.formato))];
  const st = {
    q: params.get('q') || '',
    cats: new Set(lista(params.get('cat')).filter(id => CATEGORIAS.some(c => c.id === id))),
    precios: new Set(lista(params.get('precio')).filter(id => PRECIOS.some(r => r.id === id))),
    formatos: new Set(lista(params.get('formato')).filter(f => FORMATOS.includes(f))),
    oferta: params.get('oferta') === '1',
    nuevo: params.get('nuevo') === '1',
    orden: ['relevancia', 'precio-asc', 'precio-desc', 'nombre'].includes(params.get('orden')) ? params.get('orden') : 'relevancia',
    visibles: POR_PAGINA
  };

  const qInput = document.getElementById('cq');
  const orden = document.querySelector('[data-orden]');
  const count = document.querySelector('[data-cat-count]');
  const activos = document.querySelector('[data-activos]');
  const vacio = document.querySelector('[data-vacio]');
  const masWrap = document.querySelector('[data-mas-wrap]');
  const masInfo = document.querySelector('[data-mas-info]');
  const masBtn = document.querySelector('[data-mas]');
  const miga = document.querySelector('[data-miga-cat]');
  const titulo = document.getElementById('t-catalogo');

  const checkHTML = (grupo, val, label, n) => `<label class="check"><input type="checkbox" data-f="${grupo}" value="${esc(val)}"><span>${esc(label)}</span>${n !== undefined ? `<small>${n}</small>` : ''}</label>`;
  const fill = (grupo, html) => { const el = document.querySelector(`[data-f-list="${grupo}"]`); if (el) el.innerHTML = html; };
  fill('cat', CATEGORIAS.map(c => checkHTML('cat', c.id, c.nombre, cuantos(c.id))).join(''));
  fill('precio', PRECIOS.map(r => checkHTML('precio', r.id, r.nombre, PRODUCTOS.filter(p => precioFinal(p) >= r.min && precioFinal(p) < r.max).length)).join(''));
  fill('formato', FORMATOS.map(f => checkHTML('formato', f, f, PRODUCTOS.filter(p => p.formato === f).length)).join(''));

  const syncControles = () => {
    document.querySelectorAll('input[data-f="cat"]').forEach(i => { i.checked = st.cats.has(i.value); });
    document.querySelectorAll('input[data-f="precio"]').forEach(i => { i.checked = st.precios.has(i.value); });
    document.querySelectorAll('input[data-f="formato"]').forEach(i => { i.checked = st.formatos.has(i.value); });
    const of = document.querySelector('input[data-f="oferta"]'); if (of) of.checked = st.oferta;
    const nv = document.querySelector('input[data-f="nuevo"]'); if (nv) nv.checked = st.nuevo;
    if (qInput) qInput.value = st.q;
    if (orden) orden.value = st.orden;
  };

  const filtrar = () => {
    const palabras = norm(st.q).split(/\s+/).filter(Boolean);
    let res = PRODUCTOS.filter(p => {
      if (st.cats.size && !st.cats.has(p.cat)) return false;
      if (st.formatos.size && !st.formatos.has(p.formato)) return false;
      if (st.precios.size && ![...st.precios].some(id => { const r = PRECIOS.find(x => x.id === id); return r && precioFinal(p) >= r.min && precioFinal(p) < r.max; })) return false;
      if (st.oferta && !(p.descuento > 0)) return false;
      if (st.nuevo && !p.nuevo) return false;
      if (palabras.length) {
        const texto = norm([p.nombre, catNombre(p.cat), p.formato, p.desc, ...(p.tags || [])].join(' '));
        if (!palabras.every(w => texto.includes(w))) return false;
      }
      return true;
    });
    if (st.orden === 'precio-asc') res = res.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
    else if (st.orden === 'precio-desc') res = res.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
    else if (st.orden === 'nombre') res = res.slice().sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    else res = res.slice().sort((a, b) => Number(b.masVendido) - Number(a.masVendido));
    return res;
  };

  const syncURL = () => {
    const u = new URL(location.href);
    ['q', 'cat', 'precio', 'formato', 'oferta', 'nuevo', 'orden'].forEach(k => u.searchParams.delete(k));
    if (st.q) u.searchParams.set('q', st.q);
    if (st.cats.size) u.searchParams.set('cat', [...st.cats].join(','));
    if (st.precios.size) u.searchParams.set('precio', [...st.precios].join(','));
    if (st.formatos.size) u.searchParams.set('formato', [...st.formatos].join(','));
    if (st.oferta) u.searchParams.set('oferta', '1');
    if (st.nuevo) u.searchParams.set('nuevo', '1');
    if (st.orden !== 'relevancia') u.searchParams.set('orden', st.orden);
    history.replaceState(null, '', u);
  };

  const chipsActivos = () => {
    const chips = [];
    if (st.q) chips.push(['q', st.q, `«${st.q}»`]);
    st.cats.forEach(id => chips.push(['cat', id, catNombre(id)]));
    st.precios.forEach(id => chips.push(['precio', id, PRECIOS.find(r => r.id === id)?.nombre || id]));
    st.formatos.forEach(f => chips.push(['formato', f, f]));
    if (st.oferta) chips.push(['oferta', '1', 'Con descuento']);
    if (st.nuevo) chips.push(['nuevo', '1', 'Novedades']);
    activos.innerHTML = chips.map(([g, v, l]) => `<button type="button" class="chip-activo" data-quitar="${g}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(l)}">${esc(l)} ${ICO.close}</button>`).join('');
  };

  const migas = () => {
    const unica = st.cats.size === 1 ? [...st.cats][0] : null;
    if (miga) { miga.hidden = !unica; miga.textContent = unica ? catNombre(unica) : ''; }
    if (titulo) titulo.textContent = unica ? catNombre(unica) : 'Catálogo de libros';
    document.querySelectorAll('.cats-item').forEach(a => { const id = new URL(a.href).searchParams.get('cat'); if (id === unica) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  };

  let resultado = [];
  const pintar = (append = false) => {
    const desde = append ? grid.querySelectorAll('.prod-card').length : 0;
    const tramo = resultado.slice(desde, st.visibles);
    if (append) grid.insertAdjacentHTML('beforeend', tramo.map(p => cardHTML(p)).join(''));
    else grid.innerHTML = tramo.map(p => cardHTML(p)).join('');
    revelarNuevos(grid);
    const mostrados = Math.min(st.visibles, resultado.length);
    count.textContent = resultado.length ? `Mostrando ${mostrados} de ${resultado.length} ${resultado.length === 1 ? 'libro' : 'libros'}` : 'Sin resultados';
    vacio.hidden = resultado.length > 0;
    grid.hidden = resultado.length === 0;
    const quedan = resultado.length - mostrados;
    masWrap.hidden = quedan <= 0;
    if (masInfo) masInfo.textContent = `Viste ${mostrados} de ${resultado.length}`;
    const verRes = document.querySelector('.filtros__ver');
    if (verRes) verRes.textContent = resultado.length ? `Ver ${resultado.length} ${resultado.length === 1 ? 'libro' : 'libros'}` : 'Ver resultados';
    refrescar();
  };

  const aplicar = () => {
    st.visibles = POR_PAGINA;
    resultado = filtrar();
    syncControles(); chipsActivos(); migas(); syncURL();
    pintar(false);
  };

  document.querySelector('.filtros')?.addEventListener('change', e => {
    const i = e.target.closest('input[data-f]');
    if (!i) return;
    const g = i.dataset.f;
    if (g === 'oferta') st.oferta = i.checked;
    else if (g === 'nuevo') st.nuevo = i.checked;
    else { const set = g === 'cat' ? st.cats : g === 'precio' ? st.precios : st.formatos; i.checked ? set.add(i.value) : set.delete(i.value); }
    aplicar();
  });
  let tq = 0;
  qInput?.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { st.q = qInput.value.trim(); aplicar(); }, 220); });
  document.querySelector('[data-cat-search]')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tq); st.q = qInput.value.trim(); aplicar(); });
  orden?.addEventListener('change', () => { st.orden = orden.value; aplicar(); });
  const limpiar = () => { st.q = ''; st.cats.clear(); st.precios.clear(); st.formatos.clear(); st.oferta = false; st.nuevo = false; aplicar(); };
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', e => {
    const b = e.target.closest('[data-quitar]'); if (!b) return;
    const g = b.dataset.quitar, v = b.dataset.valor;
    if (g === 'q') st.q = ''; else if (g === 'cat') st.cats.delete(v); else if (g === 'precio') st.precios.delete(v); else if (g === 'formato') st.formatos.delete(v); else if (g === 'oferta') st.oferta = false; else if (g === 'nuevo') st.nuevo = false;
    aplicar();
  });
  masBtn?.addEventListener('click', () => { st.visibles += POR_PAGINA; pintar(true); });

  const filtros = document.getElementById('filtros');
  const abrirF = document.querySelector('[data-open-filtros]');
  let fbd = null;
  const cerrarFiltros = () => {
    if (!filtros?.classList.contains('open')) return;
    filtros.classList.remove('open'); fbd?.classList.remove('open');
    abrirF?.setAttribute('aria-expanded', 'false');
    if (!document.querySelector('.cart-drawer.open, .quick-modal.open, .main-nav.open')) document.body.classList.remove('no-scroll');
    abrirF?.focus();
  };
  if (filtros && abrirF) {
    fbd = document.createElement('div'); fbd.className = 'filtros-backdrop'; document.body.appendChild(fbd);
    abrirF.addEventListener('click', () => {
      filtros.classList.add('open'); fbd.classList.add('open'); abrirF.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
      setTimeout(() => filtros.querySelector('.filtros__cerrar')?.focus(), 60);
    });
    fbd.addEventListener('click', cerrarFiltros);
    filtros.querySelectorAll('[data-close-filtros]').forEach(b => b.addEventListener('click', cerrarFiltros));
    filtros.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarFiltros(); if (filtros.classList.contains('open')) trapFocus(filtros, e); });
  }

  resultado = filtrar();
  syncControles(); chipsActivos(); migas();
  pintar(false);
  if (params.has('q') && !st.q) setTimeout(() => qInput?.focus(), 300);
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => openQuick(prod), 350);
}

initCirculos();
initRail();
initPreview();
initTemas();
initCatalogo();
initReveals();
initNav();
initCatsMenu();
initAcciones();
initCartDrawer();
initQuick();
initWspFloat();
initFloats();
updateCartBadge();
initHeroTicker();
initModelBarScroll();
initHeroMotion();
initParallax();
