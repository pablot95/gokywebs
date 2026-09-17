document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CATEGORIAS = [
  { id: 'maquinas', nom: 'Máquinas y atornillado', img: 'images/cat-electricas.webp', etq: 'Eléctricas' },
  { id: 'llaves', nom: 'Llaves y tubos', img: 'images/cat-llaves.webp', etq: 'Ajuste' },
  { id: 'mano', nom: 'Herramientas de mano', img: 'images/cat-mano.webp', etq: 'Banco' },
  { id: 'tornilleria', nom: 'Tornillería y fijaciones', img: 'images/cat-tornilleria.webp', etq: 'Por bulto' },
  { id: 'medicion', nom: 'Medición y protección', img: 'images/cat-medicion.webp', etq: 'Obra' }
];

const PRODUCTOS = [
  {
    id: 'lg-1001', cod: 'LG-1001', nombre: 'Taladro percutor 18V con batería y cargador', cat: 'maquinas',
    uso: 'ambos', precio: 189900, descuento: 10, stock: 6, img: 'images/p-taladro-percutor.webp',
    alt: 'Taladro percutor inalámbrico verde apoyado junto a un balde de pintura',
    desc: 'Percutor de 18V con dos velocidades, mandril de 13 mm y batería de litio de 1,5 Ah. Sirve para madera, metal y pared de ladrillo sin cambiar de máquina.',
    datos: [['Voltaje', '18V litio'], ['Mandril', '13 mm sin llave'], ['Incluye', 'Batería, cargador y maletín']],
    etiquetas: ['taladro', 'percutor', 'inalámbrico', '18v'], destacado: true, nuevo: false
  },
  {
    id: 'lg-1002', cod: 'LG-1002', nombre: 'Atornillador de impacto 18V 1/4"', cat: 'maquinas',
    uso: 'profesional', precio: 214500, descuento: 0, stock: 4, img: 'images/p-atornillador-impacto.webp',
    alt: 'Atornillador de impacto amarillo y negro sobre un banco de trabajo',
    desc: 'Impacto de encastre hexagonal 1/4" para tirafondos largos y bulonería. Torque alto y cuerpo corto para trabajar entre estructuras.',
    datos: [['Voltaje', '18V litio'], ['Encastre', 'Hex 1/4"'], ['Uso', 'Tirafondos y bulones']],
    etiquetas: ['atornillador', 'impacto', 'tirafondo'], destacado: true, nuevo: true
  },
  {
    id: 'lg-1003', cod: 'LG-1003', nombre: 'Atornillador inalámbrico 12V con maletín', cat: 'maquinas',
    uso: 'hogar', precio: 89900, descuento: 15, stock: 11, img: 'images/p-atornillador-12v.webp',
    alt: 'Atornillador inalámbrico 12V atornillando una pieza de madera en una pared',
    desc: 'Liviano, entra en un cajón y alcanza para colgar, armar muebles y ajustar bisagras. Viene con maletín y set de puntas.',
    datos: [['Voltaje', '12V litio'], ['Peso', '1,1 kg'], ['Incluye', 'Maletín y 6 puntas']],
    etiquetas: ['atornillador', 'hogar', '12v', 'liviano'], destacado: true, nuevo: false
  },
  {
    id: 'lg-1004', cod: 'LG-1004', nombre: 'Juego de puntas Torx y hexagonales x 40', cat: 'maquinas',
    uso: 'ambos', precio: 27400, descuento: 0, stock: 18, img: 'images/p-puntas-torx.webp',
    alt: 'Puntas Torx y hexagonales ordenadas en su estuche',
    desc: 'Cuarenta puntas de acero S2 en estuche rígido, con medidas Torx, hexagonales y cuadradas marcadas una por una.',
    datos: [['Piezas', '40 puntas'], ['Acero', 'S2 templado'], ['Encastre', 'Hex 1/4"']],
    etiquetas: ['puntas', 'torx', 'hexagonal', 'bits'], destacado: false, nuevo: false,
    bulto: { u: 10, precio: 232000 }
  },
  {
    id: 'lg-2001', cod: 'LG-2001', nombre: 'Martillo de uña 500 g con cabo de fibra', cat: 'mano',
    uso: 'hogar', precio: 16800, descuento: 0, stock: 24, img: 'images/p-martillo.webp',
    alt: 'Martillo de uña con cabeza de acero apoyado sobre un estuche de herramientas',
    desc: 'Cabeza forjada de 500 g con uña para extraer clavos y cabo de fibra con goma antideslizante.',
    datos: [['Peso', '500 g'], ['Cabo', 'Fibra con goma'], ['Uso', 'Clavado y extracción']],
    etiquetas: ['martillo', 'uña', 'clavos'], destacado: true, nuevo: false,
    bulto: { u: 12, precio: 168000 }
  },
  {
    id: 'lg-2002', cod: 'LG-2002', nombre: 'Destornillador con criquet y 6 puntas', cat: 'mano',
    uso: 'ambos', precio: 23500, descuento: 10, stock: 15, img: 'images/p-destornillador-criquet.webp',
    alt: 'Destornillador con mango rojo y criquet dentro de su estuche',
    desc: 'Mango engomado con criquet reversible y portapuntas magnético. Las seis puntas Phillips y planas viajan en el mismo estuche.',
    datos: [['Mecanismo', 'Criquet reversible'], ['Incluye', '6 puntas'], ['Punta', 'Magnética']],
    etiquetas: ['destornillador', 'criquet', 'puntas'], destacado: true, nuevo: false
  },
  {
    id: 'lg-2003', cod: 'LG-2003', nombre: 'Juego de puntas Phillips x 32 en estuche', cat: 'mano',
    uso: 'ambos', precio: 18900, descuento: 0, stock: 21, img: 'images/p-puntas-ph.webp',
    alt: 'Puntas Phillips de distintas medidas en su soporte',
    desc: 'Set de 32 puntas Phillips PH0 a PH3 con la medida grabada en el cuerpo, para atornillador eléctrico o manual.',
    datos: [['Piezas', '32 puntas'], ['Medidas', 'PH0 a PH3'], ['Largo', '25 y 50 mm']],
    etiquetas: ['puntas', 'phillips', 'ph2', 'bits'], destacado: false, nuevo: false,
    bulto: { u: 12, precio: 192000 }
  },
  {
    id: 'lg-3001', cod: 'LG-3001', nombre: 'Juego de llaves combinadas x 8 (8 a 19 mm)', cat: 'llaves',
    uso: 'profesional', precio: 62000, descuento: 0, stock: 9, img: 'images/p-llaves-combinadas.webp',
    alt: 'Juego de llaves combinadas cromadas sobre una superficie oscura',
    desc: 'Ocho llaves combinadas de cromo vanadio, boca fija y estrella de 12 puntas, con la medida en las dos caras.',
    datos: [['Piezas', '8 llaves'], ['Medidas', '8, 10, 11, 12, 13, 14, 17 y 19 mm'], ['Acero', 'Cromo vanadio']],
    etiquetas: ['llaves', 'combinadas', 'juego', 'cromo vanadio'], destacado: true, nuevo: false
  },
  {
    id: 'lg-3002', cod: 'LG-3002', nombre: 'Llave combinada 17 mm cromo vanadio', cat: 'llaves',
    uso: 'ambos', precio: 9800, descuento: 0, stock: 32, img: 'images/p-llave-17.webp',
    alt: 'Llave combinada de 17 mm con la boca estrella en primer plano',
    desc: 'La medida que más se pide, de reposición. Estrella de 12 puntas y boca fija pulida.',
    datos: [['Medida', '17 mm'], ['Acero', 'Cromo vanadio'], ['Terminación', 'Pulido espejo']],
    etiquetas: ['llave', '17', 'combinada'], destacado: false, nuevo: false,
    bulto: { u: 20, precio: 176000 }
  },
  {
    id: 'lg-3003', cod: 'LG-3003', nombre: 'Llave fija doble boca 14 x 15 mm', cat: 'llaves',
    uso: 'ambos', precio: 8900, descuento: 0, stock: 27, img: 'images/p-llave-boca.webp',
    alt: 'Llaves fijas de doble boca apoyadas sobre una superficie texturada',
    desc: 'Doble boca fija para trabajar donde no entra la estrella, con cuerpo forjado y espesor bajo.',
    datos: [['Medidas', '14 y 15 mm'], ['Tipo', 'Doble boca fija'], ['Acero', 'Cromo vanadio']],
    etiquetas: ['llave', 'fija', 'boca', '14', '15'], destacado: false, nuevo: false,
    bulto: { u: 20, precio: 160000 }
  },
  {
    id: 'lg-3004', cod: 'LG-3004', nombre: 'Juego de tubos 1/2" x 24 piezas', cat: 'llaves',
    uso: 'profesional', precio: 84500, descuento: 12, stock: 7, img: 'images/p-juego-tubos.webp',
    alt: 'Tubos de encastre 1/2 pulgada ordenados en su bandeja',
    desc: 'Veinticuatro tubos de 8 a 32 mm con encastre 1/2", en bandeja con la medida marcada en cada posición.',
    datos: [['Piezas', '24 tubos'], ['Encastre', '1/2"'], ['Rango', '8 a 32 mm']],
    etiquetas: ['tubos', 'sockets', 'juego', 'media pulgada'], destacado: true, nuevo: false
  },
  {
    id: 'lg-3005', cod: 'LG-3005', nombre: 'Criquet reversible 1/2" con mango engomado', cat: 'llaves',
    uso: 'profesional', precio: 36900, descuento: 0, stock: 12, img: 'images/p-criquet.webp',
    alt: 'Criquet reversible de media pulgada con mango engomado',
    desc: 'Criquet de 72 dientes con traba reversible y mango engomado, para trabajar con poco recorrido.',
    datos: [['Encastre', '1/2"'], ['Dientes', '72'], ['Largo', '255 mm']],
    etiquetas: ['criquet', 'ratchet', 'reversible'], destacado: false, nuevo: true
  },
  {
    id: 'lg-4001', cod: 'LG-4001', nombre: 'Bulón cabeza Allen 8 x 50 mm — pack x 25', cat: 'tornilleria',
    uso: 'ambos', precio: 12600, descuento: 0, stock: 40, img: 'images/p-bulon-850.webp',
    alt: 'Bulones de cabeza Allen de 8 por 50 milímetros en su bandeja',
    desc: 'Bulón de acero inoxidable con cabeza cilíndrica Allen, rosca métrica 8 mm y 50 mm de largo. Pack de 25 unidades.',
    datos: [['Medida', 'M8 x 50 mm'], ['Cabeza', 'Cilíndrica Allen'], ['Material', 'Acero inoxidable']],
    etiquetas: ['bulón', 'allen', '8x50', 'tornillo', 'inoxidable'], destacado: false, nuevo: false,
    bulto: { u: 250, precio: 112000 }
  },
  {
    id: 'lg-4002', cod: 'LG-4002', nombre: 'Bulón cabeza Allen 8 x 55 mm — pack x 25', cat: 'tornilleria',
    uso: 'ambos', precio: 13900, descuento: 0, stock: 36, img: 'images/p-bulon-855.webp',
    alt: 'Bulones de cabeza Allen de 8 por 55 milímetros en su bandeja',
    desc: 'La medida larga del mismo bulón, para uniones con arandela y tuerca. Pack de 25 unidades.',
    datos: [['Medida', 'M8 x 55 mm'], ['Cabeza', 'Cilíndrica Allen'], ['Material', 'Acero inoxidable']],
    etiquetas: ['bulón', 'allen', '8x55', 'tornillo', 'inoxidable'], destacado: false, nuevo: false,
    bulto: { u: 250, precio: 124000 }
  },
  {
    id: 'lg-4003', cod: 'LG-4003', nombre: 'Espárrago roscado 8 x 150 mm — pack x 10', cat: 'tornilleria',
    uso: 'profesional', precio: 8400, descuento: 0, stock: 0, img: 'images/p-esparrago.webp',
    alt: 'Espárragos roscados largos apoyados en una bandeja',
    desc: 'Espárrago con rosca métrica corrida de punta a punta, para anclajes y uniones pasantes. Pack de 10 unidades.',
    datos: [['Medida', 'M8 x 150 mm'], ['Rosca', 'Corrida'], ['Material', 'Acero zincado']],
    etiquetas: ['espárrago', 'varilla', 'roscado', 'anclaje'], destacado: false, nuevo: false,
    bulto: { u: 100, precio: 72000 }
  },
  {
    id: 'lg-5001', cod: 'LG-5001', nombre: 'Cinta métrica 5 m con freno y clip', cat: 'medicion',
    uso: 'hogar', precio: 11900, descuento: 20, stock: 29, img: 'images/p-cinta-metrica.webp',
    alt: 'Cinta métrica naranja y negra colgada junto a destornilladores',
    desc: 'Cinco metros de fleje con doble escala, freno lateral y clip de cinturón. Carcasa engomada que aguanta la caída.',
    datos: [['Largo', '5 m'], ['Fleje', '19 mm'], ['Traba', 'Freno lateral']],
    etiquetas: ['cinta', 'métrica', 'medición', '5 metros'], destacado: true, nuevo: false,
    bulto: { u: 12, precio: 114000 }
  },
  {
    id: 'lg-5002', cod: 'LG-5002', nombre: 'Detector de materiales digital', cat: 'medicion',
    uso: 'profesional', precio: 74900, descuento: 0, stock: 5, img: 'images/p-detector.webp',
    alt: 'Detector de materiales amarillo apoyado sobre el piso',
    desc: 'Encuentra madera, metal y cables con tensión antes de perforar. Pantalla con la profundidad y aviso sonoro.',
    datos: [['Detecta', 'Madera, metal y cable vivo'], ['Profundidad', 'Hasta 38 mm'], ['Aviso', 'Sonoro y visual']],
    etiquetas: ['detector', 'materiales', 'cables', 'medición'], destacado: false, nuevo: true
  },
  {
    id: 'lg-5003', cod: 'LG-5003', nombre: 'Guantes de trabajo con puño tejido', cat: 'medicion',
    uso: 'ambos', precio: 6700, descuento: 0, stock: 60, img: 'images/p-guantes.webp',
    alt: 'Mano con guante de trabajo de puño tejido sosteniendo un taladro',
    desc: 'Guante de tejido grueso con puño elástico, para manipular herramienta y perfilería sin lastimarse.',
    datos: [['Talle', 'Único'], ['Puño', 'Elástico tejido'], ['Uso', 'Herramienta y obra']],
    etiquetas: ['guantes', 'protección', 'seguridad'], destacado: false, nuevo: false,
    bulto: { u: 12, precio: 72000 }
  }
];

const WSP = '5491138997582';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const nombreCat = id => CATEGORIAS.find(c => c.id === id)?.nom ?? '';
const usoTexto = u => u === 'hogar' ? 'Uso hogareño' : u === 'profesional' ? 'Uso profesional' : 'Hogar y obra';

const Cart = {
  KEY: 'lginsumos_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, bulto = false) {
    const items = this.get();
    const tope = bulto ? 99 : (producto.stock ?? 99);
    const existing = items.find(i => i.id === producto.id && !!i.bulto === !!bulto);
    if (existing) existing.qty = Math.min(existing.qty + qty, tope);
    else items.push({ id: producto.id, bulto: !!bulto, qty: Math.min(qty, tope) });
    this.save(items);
  },
  setQty(id, bulto, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && !!i.bulto === !!bulto);
    if (!it) return;
    const p = getProducto(id);
    const tope = bulto ? 99 : (p?.stock ?? 99);
    it.qty = Math.max(1, Math.min(qty, tope));
    this.save(items);
  },
  remove(id, bulto) { this.save(this.get().filter(i => !(i.id === id && !!i.bulto === !!bulto))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  precioLinea(i) {
    const p = getProducto(i.id);
    if (!p) return 0;
    return i.bulto ? (p.bulto?.precio ?? precioFinal(p)) : precioFinal(p);
  },
  total() { return this.get().reduce((s, i) => s + this.precioLinea(i) * i.qty, 0); },
  totalBultos() { return this.get().filter(i => i.bulto).reduce((s, i) => s + this.precioLinea(i) * i.qty, 0); }
};

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(msg) + '</span>';
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

/* ---------- estado del catálogo ---------- */
const estado = { q: '', cat: 'todas', uso: 'todos', precio: 'todos', stock: false, bulto: false, orden: 'relevancia', pagina: 1 };
const PAGE = 16;
let revealsListos = false;

function cardHTML(p, contexto) {
  const final = precioFinal(p);
  const sinStock = p.stock <= 0;
  const flags = [];
  if (p.descuento > 0) flags.push('<span class="flag flag--off">-' + p.descuento + '%</span>');
  if (p.nuevo) flags.push('<span class="flag flag--nuevo">Nuevo</span>');
  if (!sinStock && p.stock <= 6) flags.push('<span class="flag flag--ultimas">Últimas ' + p.stock + '</span>');
  return '<article class="prod-card' + (sinStock ? ' prod-card--sinstock' : '') + '" data-id="' + p.id + '" data-animate style="opacity:0;transform:translateY(26px)">' +
    '<div class="prod-media">' +
      '<img src="' + p.img + '" width="1200" height="900" alt="' + esc(p.alt) + '" decoding="async">' +
      '<span class="prod-cod">' + esc(p.cod) + '</span>' +
      (flags.length ? '<div class="prod-flags">' + flags.join('') + '</div>' : '') +
      '<button type="button" class="prod-vista" data-vista="' + p.id + '">Vista rápida</button>' +
    '</div>' +
    '<div class="prod-body">' +
      '<p class="prod-uso">' + usoTexto(p.uso) + '</p>' +
      '<h3 class="prod-nom">' + esc(p.nombre) + '</h3>' +
      '<div class="prod-precios">' +
        '<span class="prod-precio' + (p.descuento > 0 ? ' prod-precio--off' : '') + '">' + formatearPrecio(final) + '</span>' +
        (p.descuento > 0 ? '<s class="prod-tachado">' + formatearPrecio(p.precio) + '</s>' : '') +
      '</div>' +
      (p.bulto ? '<p class="prod-bulto">Bulto x ' + p.bulto.u + ': ' + formatearPrecio(p.bulto.precio) + '</p>' : '') +
      '<div class="prod-actions">' +
        stepperHTML(p.id, contexto) +
        '<button type="button" class="prod-add" data-add="' + p.id + '"' + (sinStock ? ' disabled' : '') + '>' + (sinStock ? 'Sin stock' : '<span class="add-largo">Agregar al carrito</span><span class="add-corto">Agregar</span>') + '</button>' +
      '</div>' +
      (sinStock ? '' : '<button type="button" class="prod-comprar" data-comprar="' + p.id + '">Comprar ahora</button>') +
    '</div>' +
  '</article>';
}

function stepperHTML(id, contexto) {
  const ref = (contexto || 'cat') + '-' + id;
  return '<div class="stepper" data-stepper="' + ref + '">' +
    '<button type="button" data-paso="-1" aria-label="Quitar uno">−</button>' +
    '<input type="number" value="1" min="1" max="99" inputmode="numeric" aria-label="Cantidad" id="qty-' + ref + '">' +
    '<button type="button" data-paso="1" aria-label="Sumar uno">+</button>' +
  '</div>';
}

function qtyDe(el) {
  const st = el.closest('.prod-card, .mayor-fila, .mv')?.querySelector('.stepper input');
  const n = parseInt(st?.value ?? '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function initCategorias() {
  const cont = document.getElementById('catGrid');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(c => {
    const n = PRODUCTOS.filter(p => p.cat === c.id).length;
    return '<button type="button" class="cat-card" data-cat="' + c.id + '" data-animate style="opacity:0;transform:translateY(28px)">' +
      '<span class="etq cat-etq"><span class="etq-txt">' + esc(c.etq) + '</span></span>' +
      '<span class="cat-media"><img src="' + c.img + '" width="1000" height="1000" alt="' + esc(c.nom) + '" decoding="async"></span>' +
      '<span class="cat-body">' +
        '<span><span class="cat-nom">' + esc(c.nom) + '</span><br><span class="cat-n">' + n + ' artículos</span></span>' +
        '<span class="cat-flecha"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
      '</span>' +
    '</button>';
  }).join('');
  cont.querySelectorAll('[data-cat]').forEach(b => b.addEventListener('click', () => {
    estado.cat = b.dataset.cat; estado.q = ''; estado.pagina = 1;
    const input = document.getElementById('q'); if (input) input.value = '';
    sincronizarChips(); render();
    document.getElementById('tienda')?.scrollIntoView({ block: 'start' });
  }));

  const foot = document.getElementById('footerCats');
  if (foot) {
    foot.innerHTML = CATEGORIAS.map(c => '<li><a href="#tienda" data-cat-link="' + c.id + '">' + esc(c.nom) + '</a></li>').join('');
    foot.querySelectorAll('[data-cat-link]').forEach(a => a.addEventListener('click', () => {
      estado.cat = a.dataset.catLink; estado.pagina = 1; sincronizarChips(); render();
    }));
  }
}

function initRail() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  const dest = PRODUCTOS.filter(p => p.destacado).slice(0, 8);
  track.innerHTML = dest.map(p => cardHTML(p, 'rail')).join('');
  initRailDrag();
}

function initRailDrag() {
  const vp = document.getElementById('railVp');
  const track = document.getElementById('railTrack');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!vp || !track) return;

  let down = false, moved = false, startX = 0, startScroll = 0, pointerId = null;

  const sincronizarFlechas = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };

  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
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
      vp.classList.remove('dragging');
      const kill = e => { e.stopPropagation(); e.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 60);
    }
    moved = false;
    sincronizarFlechas();
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('scroll', sincronizarFlechas, { passive: true });

  const paso = () => Math.max(220, Math.round(vp.clientWidth * 0.8));
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: 'smooth' }));
  sincronizarFlechas();
  window.addEventListener('resize', sincronizarFlechas, { passive: true });
}

function filtrados() {
  const q = normalizar(estado.q).split(/\s+/).filter(Boolean);
  let lista = PRODUCTOS.filter(p => {
    if (estado.cat !== 'todas' && p.cat !== estado.cat) return false;
    if (estado.uso !== 'todos' && p.uso !== estado.uso && p.uso !== 'ambos') return false;
    if (estado.stock && p.stock <= 0) return false;
    if (estado.bulto && !p.bulto) return false;
    if (estado.precio !== 'todos') {
      const [min, max] = estado.precio.split('-').map(Number);
      const f = precioFinal(p);
      if (f < min || f > max) return false;
    }
    if (q.length) {
      const heno = normalizar([p.nombre, p.cod, nombreCat(p.cat), usoTexto(p.uso), p.desc, (p.etiquetas || []).join(' ')].join(' '));
      if (!q.every(t => heno.includes(t))) return false;
    }
    return true;
  });
  if (estado.orden === 'precio-asc') lista.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estado.orden === 'precio-desc') lista.sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (estado.orden === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else lista.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
  return lista;
}

function render() {
  const grid = document.getElementById('catalogoGrid');
  const vacio = document.getElementById('vacio');
  const res = document.getElementById('resultados');
  const verMas = document.getElementById('verMas');
  if (!grid) return;
  const lista = filtrados();
  const visibles = lista.slice(0, PAGE * estado.pagina);

  grid.innerHTML = visibles.map(p => cardHTML(p, 'cat')).join('');
  grid.hidden = lista.length === 0;
  if (vacio) vacio.hidden = lista.length > 0;
  if (res) res.textContent = lista.length === 1 ? '1 artículo' : lista.length + ' artículos';
  if (verMas) {
    verMas.hidden = visibles.length >= lista.length;
    verMas.parentElement.hidden = visibles.length >= lista.length;
  }

  const n = [estado.cat !== 'todas', estado.uso !== 'todos', estado.precio !== 'todos', estado.stock, estado.bulto].filter(Boolean).length;
  const chipN = document.getElementById('filtrosN');
  if (chipN) { chipN.textContent = n; chipN.hidden = n === 0; }

  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = Math.min(i * 0.05, 0.4) + 's';
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function sincronizarChips() {
  document.querySelectorAll('#chipsCat .chip').forEach(c => c.classList.toggle('is-on', c.dataset.catChip === estado.cat));
  document.querySelectorAll('#chipsUso .chip').forEach(c => c.classList.toggle('is-on', c.dataset.uso === estado.uso));
  document.querySelectorAll('#chipsPrecio .chip').forEach(c => c.classList.toggle('is-on', c.dataset.precio === estado.precio));
  const s = document.getElementById('soloStock'); if (s) s.checked = estado.stock;
  const b = document.getElementById('soloBulto'); if (b) b.checked = estado.bulto;
  const o = document.getElementById('orden'); if (o) o.value = estado.orden;
}

function initFiltros() {
  const chipsCat = document.getElementById('chipsCat');
  if (chipsCat) {
    chipsCat.innerHTML = '<button type="button" class="chip is-on" data-cat-chip="todas">Todas</button>' +
      CATEGORIAS.map(c => '<button type="button" class="chip" data-cat-chip="' + c.id + '">' + esc(c.nom) + '</button>').join('');
  }
  document.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    if (chip.dataset.catChip) estado.cat = chip.dataset.catChip;
    else if (chip.dataset.uso) estado.uso = chip.dataset.uso;
    else if (chip.dataset.precio) estado.precio = chip.dataset.precio;
    else return;
    estado.pagina = 1; sincronizarChips(); render();
  });

  document.getElementById('soloStock')?.addEventListener('change', e => { estado.stock = e.target.checked; estado.pagina = 1; render(); });
  document.getElementById('soloBulto')?.addEventListener('change', e => { estado.bulto = e.target.checked; estado.pagina = 1; render(); });
  document.getElementById('orden')?.addEventListener('change', e => { estado.orden = e.target.value; estado.pagina = 1; render(); });
  document.getElementById('verMas')?.addEventListener('click', () => { estado.pagina++; render(); });

  document.getElementById('limpiarFiltros')?.addEventListener('click', () => {
    Object.assign(estado, { q: '', cat: 'todas', uso: 'todos', precio: 'todos', stock: false, bulto: false, orden: 'relevancia', pagina: 1 });
    const q = document.getElementById('q'); if (q) q.value = '';
    sincronizarChips(); render();
    showToast('Listo, catálogo completo otra vez');
  });
  document.getElementById('vaciarBusqueda')?.addEventListener('click', () => {
    Object.assign(estado, { q: '', cat: 'todas', uso: 'todos', precio: 'todos', stock: false, bulto: false, pagina: 1 });
    const q = document.getElementById('q'); if (q) q.value = '';
    sincronizarChips(); render();
  });

  const buscar = (valor, foco) => {
    estado.q = valor; estado.pagina = 1;
    const q = document.getElementById('q'); if (q) q.value = valor;
    sincronizarChips(); render();
    if (foco) document.getElementById('tienda')?.scrollIntoView({ block: 'start' });
  };
  document.getElementById('formBuscador')?.addEventListener('submit', e => {
    e.preventDefault();
    buscar(document.getElementById('q').value.trim(), false);
  });
  document.getElementById('q')?.addEventListener('input', e => { estado.q = e.target.value.trim(); estado.pagina = 1; render(); });
  document.getElementById('formBuscadorHead')?.addEventListener('submit', e => {
    e.preventDefault();
    buscar(document.getElementById('qHead').value.trim(), true);
  });

  const toggle = document.getElementById('filtrosToggle');
  const panel = document.getElementById('filtrosPanel');
  toggle?.addEventListener('click', () => {
    const abierto = panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });

  document.querySelectorAll('[data-uso]').forEach(el => {
    if (el.classList.contains('chip')) return;
    el.addEventListener('click', () => {
      estado.uso = el.dataset.uso; estado.cat = 'todas'; estado.q = ''; estado.pagina = 1;
      sincronizarChips(); render();
    });
  });
}

/* ---------- pedido por mayor ---------- */
function initMayor() {
  const cont = document.getElementById('mayorLista');
  if (!cont) return;
  const conBulto = PRODUCTOS.filter(p => p.bulto);
  cont.insertAdjacentHTML('beforeend', conBulto.map(p =>
    '<div class="mayor-fila mayor-fila--item" role="row" data-id="' + p.id + '" data-animate style="opacity:0;transform:translateY(18px)">' +
      '<span class="mayor-art" role="cell">' +
        '<img src="' + p.img + '" width="1200" height="900" alt="' + esc(p.alt) + '" decoding="async">' +
        '<span class="mayor-art-txt"><span class="mayor-art-nom">' + esc(p.nombre) + '</span><span class="mayor-art-cod">' + esc(p.cod) + '</span></span>' +
      '</span>' +
      '<span class="mayor-u" role="cell">x ' + p.bulto.u + ' u.</span>' +
      '<span class="mayor-p" role="cell">' + formatearPrecio(p.bulto.precio) + '<small>' + formatearPrecio(p.bulto.precio / p.bulto.u) + ' por unidad</small></span>' +
      '<span class="mayor-acc" role="cell">' +
        '<span class="stepper" data-stepper="may-' + p.id + '">' +
          '<button type="button" data-paso="-1" aria-label="Quitar un bulto">−</button>' +
          '<input type="number" value="1" min="1" max="99" inputmode="numeric" aria-label="Cantidad de bultos" id="qty-may-' + p.id + '">' +
          '<button type="button" data-paso="1" aria-label="Sumar un bulto">+</button>' +
        '</span>' +
        '<button type="button" class="mayor-sumar" data-bulto="' + p.id + '">Sumar bulto</button>' +
      '</span>' +
    '</div>'
  ).join(''));

  cont.addEventListener('click', e => {
    const btn = e.target.closest('[data-bulto]');
    if (!btn) return;
    const p = getProducto(btn.dataset.bulto);
    if (!p) return;
    const fila = btn.closest('.mayor-fila');
    const n = parseInt(fila?.querySelector('.stepper input')?.value ?? '1', 10) || 1;
    Cart.add(p, n, true);
    showToast(n + (n === 1 ? ' bulto' : ' bultos') + ' de ' + p.nombre.split('—')[0].trim() + ' al pedido');
  });

  document.getElementById('mayorVerCarrito')?.addEventListener('click', abrirDrawer);
  renderMayorPanel();
}

function renderMayorPanel() {
  const ul = document.getElementById('mayorResumen');
  const tot = document.getElementById('mayorTotal');
  const wsp = document.getElementById('mayorWsp');
  if (!ul || !tot) return;
  const lineas = Cart.get().filter(i => i.bulto);
  if (!lineas.length) {
    ul.innerHTML = '<li class="mayor-vacio">Todavía no sumaste bultos.</li>';
  } else {
    ul.innerHTML = lineas.map(i => {
      const p = getProducto(i.id);
      if (!p) return '';
      return '<li><span>' + esc(p.cod) + ' · ' + i.qty + ' x ' + p.bulto.u + ' u.</span><strong>' + formatearPrecio(Cart.precioLinea(i) * i.qty) + '</strong></li>';
    }).join('');
  }
  const total = Cart.totalBultos();
  const previo = tot.dataset.valor;
  tot.textContent = formatearPrecio(total);
  tot.dataset.valor = String(total);
  if (previo !== undefined && previo !== String(total)) {
    const cont = tot.closest('.mayor-total');
    cont?.classList.remove('bump'); void cont?.offsetWidth; cont?.classList.add('bump');
  }
  if (wsp) {
    const detalle = lineas.map(i => {
      const p = getProducto(i.id);
      return p ? '- ' + p.cod + ' ' + p.nombre + ' (' + i.qty + ' bulto/s de ' + p.bulto.u + ')' : '';
    }).filter(Boolean).join('\n');
    const texto = lineas.length
      ? 'Hola LG INSUMOS, quiero un presupuesto por mayor:\n' + detalle + '\nTotal estimado: ' + formatearPrecio(total)
      : 'Hola LG INSUMOS, quiero un presupuesto por mayor';
    wsp.href = 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(texto);
  }
}

/* ---------- carrito: drawer ---------- */
let ultimoFoco = null;

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const total = document.getElementById('drawerTotal');
  const wsp = document.getElementById('drawerWsp');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = '<div class="carrito-vacio"><span class="hex-dot" aria-hidden="true"></span>' +
      '<p>Tu pedido está vacío. Arrancá por el catálogo o sumá un bulto desde «Por mayor».</p>' +
      '<button type="button" class="btn btn--cta" data-cerrar-drawer>Ver el catálogo</button></div>';
  } else {
    body.innerHTML = items.map(i => {
      const p = getProducto(i.id);
      if (!p) return '';
      const unit = Cart.precioLinea(i);
      return '<div class="ci" data-linea="' + p.id + '" data-bulto="' + (i.bulto ? '1' : '0') + '">' +
        '<img src="' + p.img + '" width="1200" height="900" alt="' + esc(p.alt) + '" decoding="async">' +
        '<div><p class="ci-nom">' + esc(p.nombre) + '</p>' +
        '<p class="ci-cod">' + esc(p.cod) + '</p>' +
        '<p class="ci-tipo">' + (i.bulto ? 'Bulto x ' + p.bulto.u + ' u.' : 'Por unidad') + '</p>' +
        '<div class="ci-bajo"><span class="stepper">' +
          '<button type="button" data-linea-paso="-1" aria-label="Quitar uno">−</button>' +
          '<input type="number" value="' + i.qty + '" min="1" max="99" inputmode="numeric" aria-label="Cantidad">' +
          '<button type="button" data-linea-paso="1" aria-label="Sumar uno">+</button>' +
        '</span><span class="ci-precio">' + formatearPrecio(unit * i.qty) + '</span></div></div>' +
        '<button type="button" class="ci-quitar" data-quitar aria-label="Quitar ' + esc(p.nombre) + ' del pedido">' +
          '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</button>' +
      '</div>';
    }).join('');
  }
  if (total) total.textContent = formatearPrecio(Cart.total());
  if (wsp) {
    const detalle = items.map(i => {
      const p = getProducto(i.id);
      return p ? '- ' + p.cod + ' ' + p.nombre + (i.bulto ? ' (bulto x ' + p.bulto.u + ')' : '') + ' x ' + i.qty : '';
    }).filter(Boolean).join('\n');
    const texto = items.length
      ? 'Hola LG INSUMOS, quiero confirmar este pedido:\n' + detalle + '\nTotal: ' + formatearPrecio(Cart.total())
      : 'Hola LG INSUMOS, quiero confirmar un pedido';
    wsp.href = 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(texto);
  }
}

function abrirDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || !bd) return;
  ultimoFoco = document.activeElement;
  drawer.hidden = false; bd.hidden = false;
  requestAnimationFrame(() => { drawer.classList.add('open'); bd.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('drawerClose')?.focus();
}

function cerrarDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || !bd || drawer.hidden) return;
  drawer.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { drawer.hidden = true; bd.hidden = true; }, 380);
  ultimoFoco?.focus();
}

function initDrawer() {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  document.getElementById('cartHead')?.addEventListener('click', abrirDrawer);
  document.getElementById('cart-float')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarDrawer);

  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); document.getElementById('tienda')?.scrollIntoView({ block: 'start' }); return; }
    const linea = e.target.closest('.ci');
    if (!linea) return;
    const id = linea.dataset.linea;
    const bulto = linea.dataset.bulto === '1';
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const actual = Cart.get().find(i => i.id === id && !!i.bulto === bulto)?.qty ?? 1;
      const nueva = actual + parseInt(paso.dataset.lineaPaso, 10);
      if (nueva < 1) Cart.remove(id, bulto); else Cart.setQty(id, bulto, nueva);
      return;
    }
    if (e.target.closest('[data-quitar]')) { Cart.remove(id, bulto); showToast('Artículo quitado del pedido'); }
  });
  drawer.addEventListener('change', e => {
    const input = e.target.closest('.ci input');
    if (!input) return;
    const linea = input.closest('.ci');
    Cart.setQty(linea.dataset.linea, linea.dataset.bulto === '1', parseInt(input.value, 10) || 1);
  });

  document.getElementById('finalizar')?.addEventListener('click', () => {
    if (!Cart.count()) { showToast('Sumá algún artículo antes de finalizar'); return; }
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!document.getElementById('drawer')?.hidden) cerrarDrawer();
  });
  drawer.addEventListener('keydown', e => trapFoco(e, drawer));
}

/* ---------- vista rápida ---------- */
function abrirModal(id) {
  const p = getProducto(id);
  const modal = document.getElementById('modal');
  const bd = document.getElementById('modalBackdrop');
  const inner = document.getElementById('modalIn');
  if (!p || !modal || !bd || !inner) return;
  ultimoFoco = document.activeElement;
  const final = precioFinal(p);
  const rel = PRODUCTOS.filter(o => o.cat === p.cat && o.id !== p.id).slice(0, 3);
  inner.innerHTML = '<div class="mv">' +
    '<div class="mv-media">' +
      '<img src="' + p.img + '" width="1200" height="900" alt="' + esc(p.alt) + '" decoding="async">' +
      '<button type="button" class="mv-cerrar" data-cerrar-modal aria-label="Cerrar la ficha">' +
        '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
      '</button>' +
    '</div>' +
    '<div class="mv-body">' +
      '<p class="mv-cod">' + esc(p.cod) + ' · ' + esc(nombreCat(p.cat)) + ' · ' + usoTexto(p.uso) + '</p>' +
      '<h3>' + esc(p.nombre) + '</h3>' +
      '<p class="mv-desc">' + esc(p.desc) + '</p>' +
      '<ul class="mv-datos">' + (p.datos || []).map(d => '<li><strong>' + esc(d[0]) + '</strong><span>' + esc(d[1]) + '</span></li>').join('') +
        '<li><strong>Disponibilidad</strong><span>' + (p.stock > 0 ? p.stock + ' en mostrador' : 'Sin stock, se repone a pedido') + '</span></li>' +
        (p.bulto ? '<li><strong>Bulto</strong><span>' + p.bulto.u + ' unidades · ' + formatearPrecio(p.bulto.precio) + '</span></li>' : '') +
      '</ul>' +
      '<div class="mv-precios">' +
        '<span class="mv-precio">' + formatearPrecio(final) + '</span>' +
        (p.descuento > 0 ? '<s class="prod-tachado">' + formatearPrecio(p.precio) + '</s><span class="flag flag--off">-' + p.descuento + '%</span>' : '') +
      '</div>' +
      '<div class="prod-actions mv-acc">' +
        stepperHTML(p.id, 'mv') +
        '<button type="button" class="btn btn--cta" data-add="' + p.id + '"' + (p.stock <= 0 ? ' disabled' : '') + '>' + (p.stock > 0 ? 'Agregar al carrito' : 'Sin stock') + '</button>' +
        (p.stock > 0 ? '<button type="button" class="btn btn--ghost" data-comprar="' + p.id + '">Comprar ahora</button>' : '') +
      '</div>' +
      '<a class="mv-consulta" href="https://wa.me/' + WSP + '?text=' + encodeURIComponent('Hola LG INSUMOS, quiero consultar por ' + p.cod + ' ' + p.nombre) + '" target="_blank" rel="noopener">Consultar este artículo por WhatsApp</a>' +
    '</div>' +
    (rel.length ? '<div class="mv-rel"><p class="mv-rel-t">También te puede servir</p><div class="mv-rel-grid">' +
      rel.map(o => '<button type="button" class="mv-rel-card" data-vista="' + o.id + '">' +
        '<img src="' + o.img + '" width="1200" height="900" alt="' + esc(o.alt) + '" decoding="async">' +
        '<span><span class="mv-rel-nom">' + esc(o.nombre.split('—')[0].trim()) + '</span><br><span class="mv-rel-pre">' + formatearPrecio(precioFinal(o)) + '</span></span>' +
      '</button>').join('') + '</div></div>' : '') +
  '</div>';
  const titulo = document.getElementById('modalTitulo');
  if (titulo) titulo.textContent = p.nombre;
  modal.hidden = false; bd.hidden = false;
  requestAnimationFrame(() => { modal.classList.add('open'); bd.classList.add('open'); });
  document.body.classList.add('no-scroll');
  inner.querySelector('[data-cerrar-modal]')?.focus();
}

function cerrarModal() {
  const modal = document.getElementById('modal');
  const bd = document.getElementById('modalBackdrop');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { modal.hidden = true; bd.hidden = true; }, 380);
  ultimoFoco?.focus();
}

function initModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  document.getElementById('modalBackdrop')?.addEventListener('click', cerrarModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) cerrarModal();
    if (e.target.closest('[data-cerrar-modal]')) cerrarModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) cerrarModal(); });
  modal.addEventListener('keydown', e => trapFoco(e, modal));
}

function trapFoco(e, cont) {
  if (e.key !== 'Tab') return;
  const foco = cont.querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])');
  if (!foco.length) return;
  const primero = foco[0], ultimo = foco[foco.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

/* ---------- acciones globales de producto ---------- */
function initAcciones() {
  document.addEventListener('click', e => {
    const paso = e.target.closest('.stepper [data-paso]');
    if (paso) {
      const input = paso.parentElement.querySelector('input');
      const n = (parseInt(input.value, 10) || 1) + parseInt(paso.dataset.paso, 10);
      input.value = Math.max(1, Math.min(99, n));
      return;
    }
    const vista = e.target.closest('[data-vista]');
    if (vista) { abrirModal(vista.dataset.vista); return; }
    const add = e.target.closest('[data-add]');
    if (add && !add.disabled) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      Cart.add(p, qtyDe(add));
      showToast('Sumado al pedido: ' + p.nombre.split('—')[0].trim());
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      Cart.add(p, qtyDe(comprar));
      cerrarModal();
      setTimeout(abrirDrawer, 120);
      return;
    }
    const abrir = e.target.closest('[data-abrir]');
    if (abrir) { e.preventDefault(); abrirModal(abrir.dataset.abrir); }
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

/* ---------- nav ---------- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.querySelector('.masthead').appendChild(bd); }
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

/* ---------- reveals ---------- */
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

/* ---------- hero: avisos que rotan ---------- */
function initAvisos() {
  const avisos = [...document.querySelectorAll('.hero-aviso')];
  if (avisos.length < 2 || reduceMotion) return;
  let i = 0;
  window.setInterval(() => {
    avisos[i].classList.remove('is-on');
    i = (i + 1) % avisos.length;
    avisos[i].classList.add('is-on');
  }, 3400);
}

/* ---------- sección firma: dos mundos y una línea que barre ---------- */
function initFirma() {
  const seccion = document.getElementById('firma');
  const escena = document.getElementById('firmaEscena');
  const visual = document.getElementById('firmaVisual');
  const mundoA = document.getElementById('mundoA');
  const mundoB = document.getElementById('mundoB');
  const dato = document.getElementById('firmaDato');
  if (!seccion || !escena || !visual || !mundoA || !mundoB || !dato) return;
  if (reduceMotion) {
    const pa = getProducto('lg-1003'), pb = getProducto('lg-1001');
    dato.textContent = 'Atornillador 12V ' + formatearPrecio(precioFinal(pa)) + ' · Taladro 18V ' + formatearPrecio(precioFinal(pb));
    return;
  }

  const pa = getProducto('lg-1003');
  const pb = getProducto('lg-1001');
  const precioA = precioFinal(pa);
  const precioB = precioFinal(pb);
  let raf = false;

  const pintar = () => {
    raf = false;
    const r = seccion.getBoundingClientRect();
    const recorrido = seccion.offsetHeight - window.innerHeight;
    const p = recorrido > 0 ? Math.min(1, Math.max(0, -r.top / recorrido)) : 0;
    const w = Math.min(1, Math.max(0, (p - 0.18) / 0.58));
    visual.style.setProperty('--wipe', (100 - w * 100).toFixed(2) + '%');
    const enB = w >= 0.5;
    mundoA.classList.toggle('is-off', enB);
    mundoA.classList.toggle('is-on', !enB);
    mundoB.classList.toggle('is-on', enB);
    mundoB.classList.toggle('is-off', !enB);
    const precio = Math.round(precioA + (precioB - precioA) * w);
    dato.textContent = (enB ? 'Taladro percutor 18V · ' : 'Atornillador 12V · ') + formatearPrecio(precio);
  };
  const pedir = () => { if (!raf) { raf = true; requestAnimationFrame(pintar); } };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  pintar();
}

/* ---------- texto que se lee con el scroll ---------- */
function initLee() {
  const el = document.querySelector('[data-lee]');
  if (!el) return;
  const palabras = el.textContent.trim().split(/\s+/);
  el.innerHTML = palabras.map(w => '<span data-w>' + esc(w) + '</span>').join(' ');
  if (reduceMotion) { el.querySelectorAll('[data-w]').forEach(s => s.classList.add('on')); return; }
  const spans = [...el.querySelectorAll('[data-w]')];
  let raf = false;
  const pintar = () => {
    raf = false;
    const r = el.getBoundingClientRect();
    const alto = window.innerHeight;
    const p = Math.min(1, Math.max(0, (alto * 0.82 - r.top) / (alto * 0.45)));
    const n = Math.round(p * spans.length);
    spans.forEach((s, i) => s.classList.toggle('on', i < n));
  };
  const pedir = () => { if (!raf) { raf = true; requestAnimationFrame(pintar); } };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  pintar();
}

/* ---------- newsletter ---------- */
function initNews() {
  const form = document.getElementById('formNews');
  if (!form) return;
  const input = document.getElementById('mail');
  const err = document.getElementById('mailErr');
  const btn = document.getElementById('newsBtn');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const valor = input.value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (err) err.hidden = ok;
    if (!ok) { input.focus(); return; }
    const texto = btn.textContent;
    btn.disabled = true; btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false; btn.textContent = texto;
      form.reset(); input.setAttribute('aria-invalid', 'false');
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

/* ---------- movimiento con GSAP ---------- */
function initGsap() {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
    return;
  }
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (reduceMotion) return;

  const foto = document.querySelector('.hero-foto img');
  if (foto) gsap.fromTo(foto, { scale: 1.09 }, { scale: 1, duration: 1.4, ease: 'power2.out' });
  const bloque = document.querySelector('.hero-block');
  if (bloque) gsap.fromTo(bloque, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power3.out' });
  const etq = document.querySelector('.etq--cruce');
  if (etq) gsap.fromTo(etq, { y: 24, rotate: -3, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: .8, delay: .5, ease: 'back.out(1.6)' });

  if (typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.cat-media img').forEach(img => {
    gsap.fromTo(img, { yPercent: -4 }, {
      yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: img.closest('.cat-card'), start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
  const hex = document.querySelector('.hex-out');
  if (hex) gsap.to(hex, { rotate: 22, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  document.querySelectorAll('.tape').forEach(t => {
    gsap.to(t, { backgroundPositionX: '240px', ease: 'none', scrollTrigger: { trigger: t, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* ---------- arranque ---------- */
const elAnio = document.getElementById('anio');
if (elAnio) elAnio.textContent = new Date().getFullYear();

initCategorias();
initRail();
initFiltros();
render();
initMayor();
initReveals();
initNav();
initDrawer();
initModal();
initAcciones();
initFloats();
initAvisos();
initFirma();
initLee();
initNews();
initGsap();

document.addEventListener('cart:updated', () => { updateCartBadge(); renderDrawer(); renderMayorPanel(); });
updateCartBadge();
renderDrawer();
