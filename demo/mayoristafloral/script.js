document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491141926376';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normaliza = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

const CATEGORIAS = [
  { id: 'pampa',   nombre: 'Pampa y plumas',        img: 'pampa.webp',       nota: 'Cortadera y gramíneas de vara larga' },
  { id: 'follaje', nombre: 'Follaje y preservados', img: 'eucalipto.webp',   nota: 'Eucalipto, hortensia y verdes' },
  { id: 'cardos',  nombre: 'Lavanda y cardos',      img: 'lavanda.webp',     nota: 'Aromáticas y flor de cardo' },
  { id: 'color',   nombre: 'Flores de color',       img: 'siempreviva.webp', nota: 'Siempreviva, helicriso y craspedia' },
  { id: 'espigas', nombre: 'Espigas y silvestres',  img: 'silvestres.webp',  nota: 'Paniculata, avena y surtidos' },
  { id: 'armados', nombre: 'Teñidas y ramos',       img: 'ramos-kraft.webp', nota: 'Teñidas al tono y ramos armados' },
];

const PALETAS = [
  { id: 'neutros',  nombre: 'Neutros' },
  { id: 'calidos',  nombre: 'Cálidos' },
  { id: 'violetas', nombre: 'Violetas' },
  { id: 'blancos',  nombre: 'Blancos' },
];

const PRODUCTOS = [
  { id: 1, nombre: 'Cortadera natural', cat: 'pampa', botanico: 'Cortaderia selloana', img: 'pampa.webp', precio: 18900, descuento: 0, atado: 'atado × 10 varas', vara: '90 – 110 cm', varaMax: 110, cosecha: 'Febrero a abril', duracion: '3 años o más', paleta: 'neutros', stock: 40, tags: ['pluma', 'vidriera', 'salon', 'pampa'], desc: 'La pluma grande, en su beige natural. Vara firme y penacho abierto: es la que se usa para vidriera, arco de evento y jarrón de piso.' },
  { id: 2, nombre: 'Cola de conejo', cat: 'pampa', botanico: 'Lagurus ovatus', img: 'f-lagurus.webp', precio: 9800, descuento: 0, atado: 'atado × 50 varas', vara: '40 – 50 cm', varaMax: 50, cosecha: 'Diciembre a enero', duracion: '2 años', paleta: 'calidos', stock: 60, tags: ['pluma', 'lagurus', 'ramo chico'], desc: 'Espiga chica y felpuda, en tono durazno. Rinde muchísimo en ramos chicos y en souvenirs de mesa.' },
  { id: 3, nombre: 'Eucalipto seco', cat: 'follaje', botanico: 'Eucalyptus cinerea', img: 'eucalipto.webp', precio: 8400, descuento: 0, atado: 'atado × 10 varas', vara: '60 – 75 cm', varaMax: 75, cosecha: 'Todo el año', duracion: '1 año', paleta: 'neutros', stock: 55, tags: ['follaje', 'eucalipto', 'verde'], desc: 'Hoja redonda que al secarse pasa a un beige tostado. Es el relleno más pedido: da volumen sin tapar la flor.' },
  { id: 4, nombre: 'Eucalipto preservado', cat: 'follaje', botanico: 'Eucalyptus populus', img: 'f-euca-preservado.webp', precio: 14700, descuento: 10, atado: 'atado × 8 varas', vara: '50 – 65 cm', varaMax: 65, cosecha: 'Todo el año', duracion: '2 años', paleta: 'neutros', stock: 30, tags: ['follaje', 'preservado', 'eucalipto'], desc: 'Preservado en glicerina: la hoja queda flexible y con su gris verdoso. No se quiebra al armar, así que aguanta el traslado.' },
  { id: 5, nombre: 'Hortensia preservada', cat: 'follaje', botanico: 'Hydrangea macrophylla', img: 'f-heli-crema.webp', precio: 16200, descuento: 0, atado: 'atado × 5 varas', vara: '35 – 45 cm', varaMax: 45, cosecha: 'Marzo a mayo', duracion: '2 años', paleta: 'blancos', stock: 18, tags: ['preservado', 'hortensia', 'blanco'], desc: 'Cabeza grande y liviana, en blanco roto. Con cinco varas se llena un centro de mesa entero.' },
  { id: 6, nombre: 'Verdes de temporada', cat: 'follaje', botanico: 'Ruscus + Eucalyptus', img: 'f-euca-cardo.webp', precio: 7200, descuento: 0, atado: 'atado × 12 varas', vara: '55 – 70 cm', varaMax: 70, cosecha: 'Todo el año', duracion: '1 año', paleta: 'neutros', stock: 45, tags: ['follaje', 'verde', 'ruscus'], desc: 'Mezcla de verdes de lo que está cortado en la semana. Es la opción de relleno más económica del catálogo.' },
  { id: 7, nombre: 'Lavanda francesa', cat: 'cardos', botanico: 'Lavandula dentata', img: 'lavanda.webp', precio: 11500, descuento: 0, atado: 'atado × 100 varas', vara: '35 – 45 cm', varaMax: 45, cosecha: 'Noviembre a diciembre', duracion: '2 años', paleta: 'violetas', stock: 35, tags: ['lavanda', 'aromatica', 'violeta'], desc: 'Cien varas atadas con hilo de algodón. Conserva el violeta y el perfume varios meses si no le pega el sol directo.' },
  { id: 8, nombre: 'Cardo violeta', cat: 'cardos', botanico: 'Echinops ritro', img: 'f-statice-violeta.webp', precio: 10900, descuento: 0, atado: 'atado × 10 varas', vara: '60 – 80 cm', varaMax: 80, cosecha: 'Enero a febrero', duracion: '3 años', paleta: 'violetas', stock: 22, tags: ['cardo', 'echinops', 'violeta'], desc: 'Bocha esférica de un violeta metálico, sobre vara alta. Aporta la nota rara en un ramo de puros beiges.' },
  { id: 9, nombre: 'Alcaucil seco', cat: 'cardos', botanico: 'Cynara scolymus', img: 'f-alcaucil.webp', precio: 13400, descuento: 0, atado: 'atado × 6 varas', vara: '50 – 70 cm', varaMax: 70, cosecha: 'Noviembre a enero', duracion: '3 años', paleta: 'neutros', stock: 14, tags: ['alcaucil', 'cardo', 'grande'], desc: 'La cabeza abierta del alcaucil, seca. Es pieza focal: con una sola vara se resuelve el centro de un arreglo.' },
  { id: 10, nombre: 'Siempreviva multicolor', cat: 'color', botanico: 'Helichrysum bracteatum', img: 'siempreviva.webp', precio: 10200, descuento: 0, atado: 'atado × 25 varas', vara: '45 – 60 cm', varaMax: 60, cosecha: 'Diciembre a febrero', duracion: '2 años', paleta: 'calidos', stock: 48, tags: ['siempreviva', 'helicriso', 'color'], desc: 'El atado surtido: amarillo, naranja, fucsia y violeta en la misma proporción. Es el que más se lleva para reventa.' },
  { id: 11, nombre: 'Helicriso naranja', cat: 'color', botanico: 'Helichrysum bracteatum', img: 'f-heli-naranja.webp', precio: 9600, descuento: 0, atado: 'atado × 25 varas', vara: '45 – 60 cm', varaMax: 60, cosecha: 'Diciembre a febrero', duracion: '2 años', paleta: 'calidos', stock: 36, tags: ['helicriso', 'naranja', 'color'], desc: 'Naranja pleno, pétalo firme. Al secarse no pierde saturación, así que la flor sigue leyéndose de lejos.' },
  { id: 12, nombre: 'Helicriso durazno', cat: 'color', botanico: 'Helichrysum bracteatum', img: 'f-heli-durazno.webp', precio: 9600, descuento: 0, atado: 'atado × 25 varas', vara: '45 – 60 cm', varaMax: 60, cosecha: 'Diciembre a febrero', duracion: '2 años', paleta: 'calidos', stock: 33, tags: ['helicriso', 'durazno', 'pastel'], desc: 'El tono medio entre el crema y el naranja. Es el que mejor combina con cortadera natural y lagurus.' },
  { id: 13, nombre: 'Helicriso borgoña', cat: 'color', botanico: 'Helichrysum bracteatum', img: 'f-heli-borgona.webp', precio: 9900, descuento: 15, atado: 'atado × 25 varas', vara: '45 – 60 cm', varaMax: 60, cosecha: 'Diciembre a febrero', duracion: '2 años', paleta: 'calidos', stock: 20, tags: ['helicriso', 'borgona', 'oscuro'], desc: 'Borgoña profundo, casi vino. Es la nota oscura que le da contraste a un ramo claro.' },
  { id: 14, nombre: 'Helicriso salmón', cat: 'color', botanico: 'Helichrysum bracteatum', img: 'f-helicriso-salmon.webp', precio: 9600, descuento: 0, atado: 'atado × 25 varas', vara: '45 – 60 cm', varaMax: 60, cosecha: 'Diciembre a febrero', duracion: '2 años', paleta: 'calidos', stock: 28, tags: ['helicriso', 'salmon', 'pastel'], desc: 'Salmón apagado, con el centro crema. El más pedido para casamientos de paleta neutra.' },
  { id: 15, nombre: 'Mix rojo y amarillo', cat: 'color', botanico: 'Helichrysum + Echinops', img: 'f-helicriso-amarillo.webp', precio: 8900, descuento: 0, atado: 'atado × 20 varas', vara: '40 – 55 cm', varaMax: 55, cosecha: 'Diciembre a febrero', duracion: '2 años', paleta: 'calidos', stock: 26, tags: ['mix', 'rojo', 'amarillo'], desc: 'Atado de contraste fuerte: rojo, amarillo y una bocha de cardo violeta. Sale mucho en locales de barrio.' },
  { id: 16, nombre: 'Craspedia', cat: 'color', botanico: 'Craspedia globosa', img: 'f-craspedia.webp', precio: 12800, descuento: 0, atado: 'atado × 30 varas', vara: '55 – 70 cm', varaMax: 70, cosecha: 'Enero a marzo', duracion: '3 años', paleta: 'calidos', stock: 24, tags: ['craspedia', 'amarillo', 'bolita'], desc: 'Las bolitas amarillas sobre vara pelada. Duran años sin caerse y son la flor seca más resistente al traslado.' },
  { id: 17, nombre: 'Statice rosa', cat: 'color', botanico: 'Limonium sinuatum', img: 'f-statice-rosa.webp', precio: 7900, descuento: 0, atado: 'atado × 20 varas', vara: '45 – 60 cm', varaMax: 60, cosecha: 'Noviembre a febrero', duracion: '2 años', paleta: 'violetas', stock: 42, tags: ['statice', 'limonium', 'rosa'], desc: 'Ramillete rosa fucsia, muy rendidor. Se seca prácticamente solo y aguanta bien la humedad del local.' },
  { id: 18, nombre: 'Silvestres surtidas', cat: 'espigas', botanico: 'Mix de temporada', img: 'silvestres.webp', precio: 8600, descuento: 0, atado: 'atado × 30 varas', vara: '40 – 60 cm', varaMax: 60, cosecha: 'Según cosecha', duracion: '2 años', paleta: 'calidos', stock: 38, tags: ['silvestres', 'mix', 'surtido'], desc: 'Lo que dio el cuadro esa semana: espigas, hojas y flor chica. Cambia con la temporada y nunca sale igual dos veces.' },
  { id: 19, nombre: 'Paniculata blanca', cat: 'espigas', botanico: 'Gypsophila paniculata', img: 'f-paniculata.webp', precio: 9400, descuento: 0, atado: 'atado × 20 varas', vara: '50 – 65 cm', varaMax: 65, cosecha: 'Noviembre a enero', duracion: '2 años', paleta: 'blancos', stock: 50, tags: ['paniculata', 'gypsophila', 'blanco'], desc: 'La nube blanca clásica. Es el relleno que más se vende y el que abarata un ramo grande.' },
  { id: 20, nombre: 'Flor de arroz', cat: 'espigas', botanico: 'Ozothamnus diosmifolius', img: 'f-astilbe-crema.webp', precio: 7400, descuento: 0, atado: 'atado × 30 varas', vara: '45 – 60 cm', varaMax: 60, cosecha: 'Octubre a diciembre', duracion: '2 años', paleta: 'blancos', stock: 44, tags: ['arroz', 'ozothamnus', 'crema'], desc: 'Racimo de botones diminutos color crema. Textura granulada que rompe la lisura del follaje.' },
  { id: 21, nombre: 'Avena y espigas', cat: 'espigas', botanico: 'Avena sativa', img: 'f-cardo-azul.webp', precio: 6800, descuento: 0, atado: 'atado × 40 varas', vara: '55 – 75 cm', varaMax: 75, cosecha: 'Noviembre a enero', duracion: '2 años', paleta: 'neutros', stock: 52, tags: ['avena', 'espiga', 'trigo'], desc: 'Espigas de avena y trigo, en su dorado natural. Cuarenta varas por atado: es el mejor rendimiento del catálogo.' },
  { id: 22, nombre: 'Nube crema', cat: 'espigas', botanico: 'Ozothamnus + Gypsophila', img: 'f-banksia.webp', precio: 7700, descuento: 0, atado: 'atado × 25 varas', vara: '45 – 60 cm', varaMax: 60, cosecha: 'Octubre a diciembre', duracion: '2 años', paleta: 'blancos', stock: 30, tags: ['nube', 'crema', 'relleno'], desc: 'Mezcla de flor chica en crema y blanco tostado. La versión cálida de la paniculata.' },
  { id: 23, nombre: 'Ramo mayorista surtido', cat: 'armados', botanico: 'Mix armado', img: 'ramos-kraft.webp', precio: 24500, descuento: 0, atado: 'caja × 6 ramos', vara: '40 – 55 cm', varaMax: 55, cosecha: 'Según cosecha', duracion: '2 años', paleta: 'calidos', stock: 12, tags: ['ramo', 'armado', 'caja', 'reventa'], desc: 'Seis ramos ya armados y envueltos, listos para poner en el mostrador. Cada ramo lleva flor, espiga y follaje.' },
  { id: 24, nombre: 'Teñidas coral', cat: 'armados', botanico: 'Teñido al tono', img: 'f-coral-tenido.webp', precio: 11900, descuento: 0, atado: 'atado × 20 varas', vara: '45 – 60 cm', varaMax: 60, cosecha: 'Todo el año', duracion: '2 años', paleta: 'calidos', stock: 26, tags: ['tenida', 'coral', 'color'], desc: 'Flor seca teñida por inmersión en coral. Al ser teñida hay stock todo el año, no depende del corte.' },
  { id: 25, nombre: 'Amaranto colgante', cat: 'armados', botanico: 'Amaranthus caudatus', img: 'f-amaranto.webp', precio: 10700, descuento: 0, atado: 'atado × 10 varas', vara: '60 – 80 cm', varaMax: 80, cosecha: 'Febrero a abril', duracion: '2 años', paleta: 'calidos', stock: 16, tags: ['amaranto', 'colgante', 'rojo'], desc: 'Las colas colgantes en rojo tierra. Se usa para dar caída en arreglos altos y en guirnaldas.' },
  { id: 26, nombre: 'Rosas secas crema', cat: 'armados', botanico: 'Rosa spp.', img: 'f-rosas-crema.webp', precio: 15300, descuento: 0, atado: 'atado × 12 varas', vara: '35 – 45 cm', varaMax: 45, cosecha: 'Noviembre a marzo', duracion: '2 años', paleta: 'blancos', stock: 20, tags: ['rosa', 'crema', 'seca'], desc: 'Rosas secadas en capullo cerrado, color crema. Se despachan con el follaje puesto para que no se marque el tallo.' },
  { id: 27, nombre: 'Rosas secas rosadas', cat: 'armados', botanico: 'Rosa spp.', img: 'f-rosas-rosadas.webp', precio: 15300, descuento: 10, atado: 'atado × 12 varas', vara: '35 – 45 cm', varaMax: 45, cosecha: 'Noviembre a marzo', duracion: '2 años', paleta: 'violetas', stock: 18, tags: ['rosa', 'rosada', 'seca'], desc: 'La misma rosa que la crema, cortada en el tono rosa viejo. Es la más pedida para souvenir de casamiento.' },
];

const DESTACADOS = [1, 16, 7, 13, 19, 23, 4, 26];

const HERBARIO = [
  { folio: '01', cat: 'pampa',   prod: 1,  comun: 'Cortadera',        familia: 'Poaceae',        nota: 'Se corta con el penacho recién abierto y se seca colgada, nunca prensada. Si se corta más tarde, la pluma suelta pelusa al moverla.' },
  { folio: '02', cat: 'follaje', prod: 3,  comun: 'Eucalipto cinerea',familia: 'Myrtaceae',      nota: 'La rama se cuelga en manojos de diez, en sombra y con corriente de aire. El verde vira a beige tostado y ahí queda estable.' },
  { folio: '03', cat: 'cardos',  prod: 7,  comun: 'Lavanda francesa', familia: 'Lamiaceae',      nota: 'Se corta a la mañana, antes de que abra toda la espiga: así conserva el violeta. Cien varas por atado, hilo de algodón.' },
  { folio: '04', cat: 'color',   prod: 10, comun: 'Siempreviva',      familia: 'Asteraceae',     nota: 'Es la más noble del cuadro: se seca sola, no pierde color y aguanta el traslado. Por eso es la base de casi todos los ramos armados.' },
  { folio: '05', cat: 'espigas', prod: 19, comun: 'Paniculata',       familia: 'Caryophyllaceae',nota: 'Se seca de pie, en balde sin agua, para que la nube no se aplaste. Es el relleno que más rota en el año.' },
  { folio: '06', cat: 'armados', prod: 26, comun: 'Rosa seca',        familia: 'Rosaceae',       nota: 'Se corta en capullo cerrado y se seca cabeza abajo. Se despacha con el follaje puesto para que el tallo no se marque en la caja.' },
];

const Cart = {
  KEY: 'mayoristafloral_cart',
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
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

let revealsListos = false;
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

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.35)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function cardHTML(p) {
  const cat = CATEGORIAS.find(c => c.id === p.cat)?.nombre || '';
  const fin = precioFinal(p);
  const n = String(p.id).padStart(2, '0');
  const precios = p.descuento > 0
    ? `<span class="prod-precio prod-precio-off">${formatearPrecio(fin)}</span><s>${formatearPrecio(p.precio)}</s>`
    : `<span class="prod-precio">${formatearPrecio(fin)}</span>`;
  return `
  <article class="prod-card" data-id="${p.id}" data-qty="1" data-animate="up" style="transform:translateY(34px);opacity:0">
    <div class="prod-media">
      <img src="images/${esc(p.img)}" width="640" height="800" alt="${esc(p.nombre)}, flor seca en atado">
      <span class="prod-n">Nº ${n}</span>
      ${p.descuento > 0 ? `<span class="prod-badge">-${p.descuento}%</span>` : ''}
      <button type="button" class="prod-ver" data-ver="${p.id}">Ver ficha</button>
    </div>
    <div class="prod-body">
      <span class="prod-cat">${esc(cat)}</span>
      <h3 class="prod-nom">${esc(p.nombre)}</h3>
      <span class="prod-bot">${esc(p.botanico)}</span>
      <span class="prod-unidad">${esc(p.atado)} · vara ${esc(p.vara)}</span>
      <div class="prod-precios">${precios}</div>
      <div class="prod-actions">
        <div class="stepper">
          <button type="button" data-step="-1" aria-label="Quitar una unidad de ${esc(p.nombre)}">−</button>
          <output data-out>1</output>
          <button type="button" data-step="1" aria-label="Sumar una unidad de ${esc(p.nombre)}">+</button>
        </div>
        <button type="button" class="prod-add" data-add="${p.id}">Agregar</button>
      </div>
      <button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}

function bindCardEvents(cont) {
  if (!cont) return;
  cont.addEventListener('click', e => {
    const card = e.target.closest('.prod-card');
    const step = e.target.closest('[data-step]');
    if (step && card) {
      const p = getProducto(Number(card.dataset.id));
      const max = p?.stock ?? 99;
      const q = Math.max(1, Math.min(Number(card.dataset.qty || 1) + Number(step.dataset.step), max));
      card.dataset.qty = q;
      const out = card.querySelector('[data-out]');
      if (out) out.textContent = q;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add && card) {
      const p = getProducto(Number(add.dataset.add));
      if (!p) return;
      Cart.add(p, Number(card.dataset.qty || 1));
      showToast('¡Agregado! Tu pedido te espera');
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy && card) {
      const p = getProducto(Number(buy.dataset.buy));
      if (!p) return;
      Cart.add(p, Number(card.dataset.qty || 1));
      abrirDrawer();
      return;
    }
    const ver = e.target.closest('[data-ver]');
    if (ver) { abrirModal(Number(ver.dataset.ver), ver); return; }
    if (card && !e.target.closest('button')) abrirModal(Number(card.dataset.id), card);
  });
}

function initCategorias() {
  const grid = document.getElementById('cats-grid');
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map((c, i) => {
    const n = PRODUCTOS.filter(p => p.cat === c.id).length;
    return `
    <button type="button" class="cat-card" data-cat="${c.id}" data-animate="up" style="transform:translateY(30px);opacity:0">
      <div class="cat-media"><img src="images/${esc(c.img)}" width="640" height="512" alt="${esc(c.nombre)}"></div>
      <span class="cat-n">Nº ${String(i + 1).padStart(2, '0')}</span>
      <div class="cat-body">
        <h3>${esc(c.nombre)}</h3>
        <p>${esc(c.nota)} · ${n} ${n === 1 ? 'atado' : 'atados'}</p>
      </div>
      <span class="cat-go" aria-hidden="true">→</span>
    </button>`;
  }).join('');
  grid.addEventListener('click', e => {
    const btn = e.target.closest('[data-cat]');
    if (btn) irAlCatalogo(btn.dataset.cat);
  });
}

function initRail() {
  const track = document.getElementById('rail-track');
  const vp = document.getElementById('rail-vp');
  if (!track || !vp) return;
  const sel = DESTACADOS.map(id => getProducto(id)).filter(Boolean);
  track.innerHTML = sel.map(p => cardHTML(p)).join('');
  bindCardEvents(track);

  const prev = document.getElementById('rail-prev');
  const next = document.getElementById('rail-next');
  const sync = () => {
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const paso = () => Math.max(220, vp.clientWidth * 0.62);
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();

  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    if (max <= 1) return;
    const atStart = vp.scrollLeft <= 0, atEnd = vp.scrollLeft >= max - 1;
    if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });

  let down = false, moved = false, startX = 0, startLeft = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    down = true; moved = false; startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId;
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
    vp.scrollLeft = startLeft - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 60);
    }
    moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
}

const estado = { q: '', cat: 'all', paleta: 'all', orden: 'rel', visibles: 16 };
const PASO = 16;

function filtrados() {
  const q = normaliza(estado.q).trim();
  const terms = q ? q.split(/\s+/) : [];
  let out = PRODUCTOS.filter(p => {
    if (estado.cat !== 'all' && p.cat !== estado.cat) return false;
    if (estado.paleta !== 'all' && p.paleta !== estado.paleta) return false;
    if (!terms.length) return true;
    const catNom = CATEGORIAS.find(c => c.id === p.cat)?.nombre || '';
    const heno = normaliza([p.nombre, p.botanico, catNom, p.atado, p.paleta, p.tags.join(' ')].join(' '));
    return terms.every(t => heno.includes(t));
  });
  if (estado.orden === 'asc') out = out.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estado.orden === 'desc') out = out.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (estado.orden === 'vara') out = out.slice().sort((a, b) => b.varaMax - a.varaMax);
  return out;
}

function pintarCatalogo() {
  const grid = document.getElementById('cat-grid');
  const vacio = document.getElementById('vacio');
  const vermas = document.getElementById('vermas');
  const count = document.getElementById('cat-count');
  const limpiar = document.getElementById('limpiar');
  const filN = document.getElementById('fil-n');
  if (!grid) return;

  const res = filtrados();
  const slice = res.slice(0, estado.visibles);
  grid.innerHTML = slice.map(p => cardHTML(p)).join('');
  grid.hidden = res.length === 0;
  if (vacio) vacio.hidden = res.length !== 0;
  if (vermas) vermas.hidden = res.length <= estado.visibles;
  if (count) count.textContent = `${res.length} ${res.length === 1 ? 'atado' : 'atados'}`;

  const activos = (estado.cat !== 'all' ? 1 : 0) + (estado.paleta !== 'all' ? 1 : 0) + (estado.q.trim() ? 1 : 0);
  if (limpiar) limpiar.hidden = activos === 0;
  if (filN) { filN.hidden = activos === 0; filN.textContent = activos; }

  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function initCatalogo() {
  const grid = document.getElementById('cat-grid');
  const chips = document.getElementById('chips');
  const chipsPal = document.getElementById('chips-paleta');
  const q = document.getElementById('q');
  const orden = document.getElementById('orden');
  const vermas = document.getElementById('vermas');
  const limpiar = document.getElementById('limpiar');
  const vacioLimpiar = document.getElementById('vacio-limpiar');
  const det = document.getElementById('filtros-mas');
  if (!grid) return;

  if (chips) {
    chips.innerHTML = [{ id: 'all', nombre: 'Todas las familias' }, ...CATEGORIAS]
      .map(c => `<button type="button" class="chip" data-chip="${c.id}" aria-pressed="${c.id === 'all'}">${esc(c.nombre)}</button>`).join('');
    chips.addEventListener('click', e => {
      const b = e.target.closest('[data-chip]');
      if (!b) return;
      estado.cat = b.dataset.chip; estado.visibles = PASO;
      chips.querySelectorAll('[data-chip]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      pintarCatalogo();
    });
  }
  if (chipsPal) {
    chipsPal.innerHTML = [{ id: 'all', nombre: 'Toda la paleta' }, ...PALETAS]
      .map(c => `<button type="button" class="chip" data-pal="${c.id}" aria-pressed="${c.id === 'all'}">${esc(c.nombre)}</button>`).join('');
    chipsPal.addEventListener('click', e => {
      const b = e.target.closest('[data-pal]');
      if (!b) return;
      estado.paleta = b.dataset.pal; estado.visibles = PASO;
      chipsPal.querySelectorAll('[data-pal]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      pintarCatalogo();
    });
  }
  q?.addEventListener('input', () => { estado.q = q.value; estado.visibles = PASO; pintarCatalogo(); });
  orden?.addEventListener('change', () => { estado.orden = orden.value; estado.visibles = PASO; pintarCatalogo(); });
  vermas?.addEventListener('click', () => { estado.visibles += PASO; pintarCatalogo(); });

  const reset = () => {
    estado.q = ''; estado.cat = 'all'; estado.paleta = 'all'; estado.orden = 'rel'; estado.visibles = PASO;
    if (q) q.value = '';
    if (orden) orden.value = 'rel';
    chips?.querySelectorAll('[data-chip]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.chip === 'all')));
    chipsPal?.querySelectorAll('[data-pal]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.pal === 'all')));
    pintarCatalogo();
  };
  limpiar?.addEventListener('click', reset);
  vacioLimpiar?.addEventListener('click', reset);

  if (det && window.matchMedia('(min-width: 861px)').matches) det.open = true;

  bindCardEvents(grid);
  pintarCatalogo();
}

function irAlCatalogo(catId) {
  const chips = document.getElementById('chips');
  estado.cat = catId || 'all';
  estado.visibles = PASO;
  chips?.querySelectorAll('[data-chip]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.chip === estado.cat)));
  pintarCatalogo();
  document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function initHerbario() {
  const index = document.getElementById('herb-index');
  const img = document.getElementById('herb-img');
  if (!index || !img) return;

  index.innerHTML = HERBARIO.map((h, i) => {
    const p = getProducto(h.prod);
    return `<li><button type="button" class="herb-folio" data-folio="${i}" aria-pressed="${i === 0}">
      <span class="folio">Nº ${h.folio}</span>
      <span><span class="herb-folio-n">${esc(h.comun)}</span><br><span class="herb-folio-bot">${esc(p?.botanico || '')}</span></span>
      <span class="herb-folio-arrow" aria-hidden="true">→</span>
    </button></li>`;
  }).join('');

  const el = {
    folio: document.getElementById('herb-plate-folio'),
    comun: document.getElementById('herb-comun'),
    bot: document.getElementById('herb-bot'),
    fam: document.getElementById('herb-fam'),
    vara: document.getElementById('herb-vara'),
    atado: document.getElementById('herb-atado'),
    cosecha: document.getElementById('herb-cosecha'),
    dur: document.getElementById('herb-dur'),
    nota: document.getElementById('herb-nota'),
    precio: document.getElementById('herb-precio'),
    add: document.getElementById('herb-add'),
    ver: document.getElementById('herb-ver'),
  };
  let actual = 0;

  const pintar = (i) => {
    const h = HERBARIO[i];
    const p = getProducto(h.prod);
    if (!h || !p) return;
    actual = i;
    index.querySelectorAll('[data-folio]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.folio) === i)));
    el.folio.textContent = `Nº ${h.folio}`;
    el.comun.textContent = h.comun;
    el.bot.textContent = p.botanico;
    el.fam.textContent = h.familia;
    el.vara.textContent = p.vara;
    el.atado.textContent = p.atado.replace('atado × ', '').replace('caja × ', '');
    el.cosecha.textContent = h.cosecha || p.cosecha;
    el.dur.textContent = p.duracion;
    el.nota.textContent = h.nota;
    el.precio.innerHTML = `${formatearPrecio(precioFinal(p))} <span>el ${p.atado.startsWith('caja') ? 'pack' : 'atado'}</span>`;
    const n = PRODUCTOS.filter(x => x.cat === h.cat).length;
    el.ver.textContent = `Ver los ${n} ${n === 1 ? 'atado' : 'atados'} de esta familia`;

    const nuevoSrc = `images/${p.img}`;
    if (img.getAttribute('src') === nuevoSrc) return;
    const pre = new Image();
    pre.src = nuevoSrc;
    const paint = () => {
      img.src = nuevoSrc;
      img.alt = `${p.nombre}, flor seca en atado`;
      if (!reduceMotion) img.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
    };
    if (pre.complete) paint(); else { pre.onload = paint; pre.onerror = paint; }
  };

  index.addEventListener('click', e => {
    const b = e.target.closest('[data-folio]');
    if (b) pintar(Number(b.dataset.folio));
  });
  el.add?.addEventListener('click', () => {
    const p = getProducto(HERBARIO[actual].prod);
    if (!p) return;
    Cart.add(p, 1);
    showToast(`${p.nombre} sumado al pedido`);
  });
  el.ver?.addEventListener('click', e => {
    e.preventDefault();
    irAlCatalogo(HERBARIO[actual].cat);
  });
  pintar(0);
}

let drawerAbierto = false, focoPrevio = null;
function pintarDrawer() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-foot');
  const total = document.getElementById('drawer-total');
  const wsp = document.getElementById('drawer-wsp');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="carro-vacio">
      <span class="folio">Nº 000</span>
      <h3>Todavía no elegiste ningún atado</h3>
      <p>Arrancá por las familias o mirá los que más salen del secadero.</p>
      <button type="button" class="btn btn-cta" data-cerrar-drawer>Ver el catálogo</button>
    </div>`;
    if (foot) foot.hidden = true;
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<div class="ci" data-ci="${p.id}">
      <div class="ci-media"><img src="images/${esc(p.img)}" width="640" height="800" alt="${esc(p.nombre)}"></div>
      <div>
        <h3 class="ci-nom">${esc(p.nombre)}</h3>
        <p class="ci-uni">${esc(p.atado)}</p>
        <div class="stepper">
          <button type="button" data-ci-step="-1" aria-label="Quitar una unidad de ${esc(p.nombre)}">−</button>
          <output>${i.qty}</output>
          <button type="button" data-ci-step="1" aria-label="Sumar una unidad de ${esc(p.nombre)}">+</button>
        </div>
      </div>
      <div class="ci-right">
        <span class="ci-precio">${formatearPrecio(precioFinal(p) * i.qty)}</span>
        <button type="button" class="ci-del" data-ci-del>Quitar</button>
      </div>
    </div>`;
  }).join('');
  if (foot) foot.hidden = false;
  if (total) total.textContent = formatearPrecio(Cart.total());
  if (wsp) {
    const lineas = items.map(i => {
      const p = getProducto(i.id);
      return p ? `• ${i.qty} × ${p.nombre} (${p.atado}) — ${formatearPrecio(precioFinal(p) * i.qty)}` : '';
    }).filter(Boolean);
    const msg = ['Hola! Quiero hacer este pedido por mayor:', ...lineas, `Total estimado: ${formatearPrecio(Cart.total())}`].join('\n');
    wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
  }
}

function abrirDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!drawer || drawerAbierto) return;
  focoPrevio = document.activeElement;
  drawer.hidden = false; if (bd) bd.hidden = false;
  requestAnimationFrame(() => drawer.classList.add('open'));
  document.body.classList.add('no-scroll');
  drawerAbierto = true;
  pintarDrawer();
  document.getElementById('drawer-close')?.focus();
}
function cerrarDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!drawer || !drawerAbierto) return;
  drawer.classList.remove('open');
  document.body.classList.remove('no-scroll');
  drawerAbierto = false;
  const fin = () => { drawer.hidden = true; if (bd) bd.hidden = true; };
  if (reduceMotion) fin(); else setTimeout(fin, 360);
  focoPrevio?.focus?.();
}

function initDrawer() {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  document.getElementById('cart-header')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawer-close')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click', cerrarDrawer);
  drawer.addEventListener('click', e => {
    const ci = e.target.closest('[data-ci]');
    const step = e.target.closest('[data-ci-step]');
    if (step && ci) {
      const id = Number(ci.dataset.ci);
      const actual = Cart.get().find(i => i.id === id)?.qty || 1;
      const siguiente = actual + Number(step.dataset.ciStep);
      if (siguiente < 1) Cart.remove(id); else Cart.setQty(id, siguiente);
      return;
    }
    if (e.target.closest('[data-ci-del]') && ci) { Cart.remove(Number(ci.dataset.ci)); return; }
    if (e.target.closest('[data-cerrar-drawer]')) {
      cerrarDrawer();
      document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });
  document.getElementById('checkout')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  drawer.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = [...drawer.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(x => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  document.addEventListener('cart:updated', () => { if (drawerAbierto) pintarDrawer(); });
}

let modalAbierto = false, focoModal = null;
function abrirModal(id, trigger) {
  const bd = document.getElementById('modal-backdrop');
  const cont = document.getElementById('modal-in');
  const p = getProducto(id);
  if (!bd || !cont || !p) return;
  focoModal = trigger || document.activeElement;
  const cat = CATEGORIAS.find(c => c.id === p.cat)?.nombre || '';
  const fin = precioFinal(p);
  const precios = p.descuento > 0
    ? `<span class="modal-precio prod-precio-off">${formatearPrecio(fin)}</span><s>${formatearPrecio(p.precio)}</s><span class="modal-badge">-${p.descuento}%</span>`
    : `<span class="modal-precio">${formatearPrecio(fin)}</span>`;
  const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  cont.innerHTML = `
    <div class="modal-media"><img src="images/${esc(p.img)}" width="640" height="800" alt="${esc(p.nombre)}, flor seca en atado"></div>
    <div class="modal-body" data-qty="1">
      <p class="eyebrow">${esc(cat)}</p>
      <h3 id="modal-nombre">${esc(p.nombre)}</h3>
      <p class="modal-bot"><i>${esc(p.botanico)}</i></p>
      <p class="modal-desc">${esc(p.desc)}</p>
      <dl class="modal-dl">
        <div><dt>Unidad de venta</dt><dd>${esc(p.atado)}</dd></div>
        <div><dt>Largo de vara</dt><dd>${esc(p.vara)}</dd></div>
        <div><dt>Ventana de cosecha</dt><dd>${esc(p.cosecha)}</dd></div>
        <div><dt>Duración en seco</dt><dd>${esc(p.duracion)}</dd></div>
      </dl>
      <div class="modal-precios">${precios}</div>
      <div class="modal-acts">
        <div class="stepper">
          <button type="button" data-mstep="-1" aria-label="Quitar una unidad">−</button>
          <output data-mout>1</output>
          <button type="button" data-mstep="1" aria-label="Sumar una unidad">+</button>
        </div>
        <button type="button" class="btn btn-cta" data-madd="${p.id}">Agregar al carrito</button>
        <button type="button" class="btn btn-ghost" data-mbuy="${p.id}">Comprar ahora</button>
      </div>
      ${rel.length ? `<div class="modal-rel">
        <h4>También te puede interesar</h4>
        <div class="rel-list">${rel.map(r => `<button type="button" class="rel-i" data-rel="${r.id}">
          <span class="rel-media"><img src="images/${esc(r.img)}" width="640" height="800" alt="${esc(r.nombre)}"></span>
          <span>${esc(r.nombre)}</span>
        </button>`).join('')}</div>
      </div>` : ''}
    </div>`;
  bd.hidden = false;
  document.body.classList.add('no-scroll');
  modalAbierto = true;
  document.getElementById('modal-close')?.focus();
}
function cerrarModal() {
  const bd = document.getElementById('modal-backdrop');
  if (!bd || !modalAbierto) return;
  bd.hidden = true;
  document.body.classList.remove('no-scroll');
  modalAbierto = false;
  focoModal?.focus?.();
}

function initModal() {
  const bd = document.getElementById('modal-backdrop');
  if (!bd) return;
  document.getElementById('modal-close')?.addEventListener('click', cerrarModal);
  bd.addEventListener('click', e => { if (e.target === bd) cerrarModal(); });
  bd.addEventListener('click', e => {
    const body = bd.querySelector('.modal-body');
    const step = e.target.closest('[data-mstep]');
    if (step && body) {
      const id = Number(bd.querySelector('[data-madd]')?.dataset.madd);
      const max = getProducto(id)?.stock ?? 99;
      const q = Math.max(1, Math.min(Number(body.dataset.qty || 1) + Number(step.dataset.mstep), max));
      body.dataset.qty = q;
      const out = bd.querySelector('[data-mout]');
      if (out) out.textContent = q;
      return;
    }
    const add = e.target.closest('[data-madd]');
    if (add && body) {
      const p = getProducto(Number(add.dataset.madd));
      if (!p) return;
      Cart.add(p, Number(body.dataset.qty || 1));
      showToast('¡Agregado! Tu pedido te espera');
      return;
    }
    const buy = e.target.closest('[data-mbuy]');
    if (buy && body) {
      const p = getProducto(Number(buy.dataset.mbuy));
      if (!p) return;
      Cart.add(p, Number(body.dataset.qty || 1));
      cerrarModal();
      abrirDrawer();
      return;
    }
    const r = e.target.closest('[data-rel]');
    if (r) abrirModal(Number(r.dataset.rel), r);
  });
  bd.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = [...bd.querySelectorAll('button, a[href], input, select, textarea')].filter(x => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
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
    const header = document.querySelector('.mast');
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 769px)');
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
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
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
  cart?.addEventListener('click', abrirDrawer);
  sync();
}

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.hero-copy > *', { y: 26, opacity: 0, duration: .9, stagger: .09 })
    .from('[data-hero="a"]', { y: 40, rotate: -5, opacity: 0, duration: 1.15 }, .18)
    .from('[data-hero="b"]', { y: 34, x: -18, rotate: 11, opacity: 0, duration: 1 }, .48)
    .from('[data-hero="c"]', { y: -26, x: 18, rotate: -12, opacity: 0, duration: 1 }, .62)
    .from('[data-hero="sello"]', { scale: .92, opacity: 0, duration: .8 }, .82)
    .from('.tag-seam', { y: 14, opacity: 0, duration: .7 }, .95);

  const limpiarHero = () => {
    if (tl.progress() < 1) tl.progress(1);
    tl.kill();
    gsap.set(['.hero-copy > *', '[data-hero]', '.tag-seam'], { clearProps: 'all' });
  };
  tl.eventCallback('onComplete', limpiarHero);
  setTimeout(limpiarHero, 2600);

  if (typeof ScrollTrigger === 'undefined') return;
  gsap.utils.toArray('.plate-b, .plate-c').forEach((el, i) => {
    gsap.to(el, {
      yPercent: i === 0 ? 8 : -8, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 },
    });
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

function initJsonLd() {
  const graph = [{
    '@type': 'LocalBusiness',
    '@id': 'https://gokywebs.com/demo/mayoristafloral/#negocio',
    name: 'MayoristaFloral',
    description: 'Productores de flores secas. Venta por mayor de atados de cortadera, lavanda, helicriso, paniculata y eucalipto.',
    telephone: '+5491141926376',
    email: 'hola@mayoristafloral.com',
    priceRange: '$$',
    areaServed: { '@type': 'Country', name: 'Argentina' },
    address: { '@type': 'PostalAddress', addressCountry: 'AR' },
    image: 'https://gokywebs.com/demo/mayoristafloral/images/hero-vidriera.webp',
  }];
  PRODUCTOS.forEach(p => graph.push({
    '@type': 'Product',
    name: p.nombre,
    alternateName: p.botanico,
    description: p.desc,
    category: CATEGORIAS.find(c => c.id === p.cat)?.nombre || '',
    image: `https://gokywebs.com/demo/mayoristafloral/images/${p.img}`,
    brand: { '@type': 'Brand', name: 'MayoristaFloral' },
    offers: {
      '@type': 'Offer',
      price: precioFinal(p),
      priceCurrency: 'ARS',
      availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }));
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  document.head.appendChild(s);
}

const GKY_SLUG_ACENTOS = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u' };
function gkySlugify(s) {
  return String(s || '').toLowerCase()
    .replace(/[áéíóúñü]/g, c => GKY_SLUG_ACENTOS[c] || c)
    .replace(/[^a-z0-9]/g, '');
}

function initFeedbackFloat() {
  const GKY_FEEDBACK_WHATSAPP = '5491125068578';
  const btn = document.getElementById('feedback-float');
  const backdrop = document.getElementById('feedback-modal-backdrop');
  const closeBtn = document.getElementById('feedback-modal-close');
  const starsWrap = document.getElementById('feedback-stars');
  const coloresEl = document.getElementById('feedback-colores');
  const contenidoEl = document.getElementById('feedback-contenido');
  const otrosEl = document.getElementById('feedback-otros');
  const submitBtn = document.getElementById('feedback-submit');
  if (!btn || !backdrop) return;

  const stars = [...starsWrap.querySelectorAll('.feedback-star')];
  let rating = 0;
  const paintStars = (n) => stars.forEach((s, i) => {
    s.classList.toggle('active', i < n);
    s.setAttribute('aria-pressed', i < n ? 'true' : 'false');
  });
  stars.forEach((s, i) => {
    s.addEventListener('click', () => { rating = i + 1; paintStars(rating); });
    s.addEventListener('mouseenter', () => paintStars(i + 1));
  });
  starsWrap.addEventListener('mouseleave', () => paintStars(rating));

  const open = () => {
    backdrop.hidden = false;
    document.body.classList.add('no-scroll');
    (stars[0] || coloresEl)?.focus();
  };
  const close = () => {
    backdrop.hidden = true;
    document.body.classList.remove('no-scroll');
    btn.focus();
  };
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

  submitBtn.addEventListener('click', () => {
    const colores = coloresEl.value.trim();
    const contenido = contenidoEl.value.trim();
    const otros = otrosEl.value.trim();
    if (!rating && !colores && !contenido && !otros) { coloresEl.focus(); return; }

    const slugUrl = (location.pathname.match(/\/demo\/([^/]+)/) || [])[1] || document.title;
    const slug = gkySlugify(slugUrl);
    const negocio = (document.title.split(/\s[—|]\s|\s-\s/)[0] || document.title || '').trim();
    const estrellas = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) + ` (${rating}/5)` : 'Sin calificar';
    const lineas = [
      `Devolución de la demo${negocio ? ' — ' + negocio : ''}`,
      `Calificación: ${estrellas}`,
      colores ? `Colores: ${colores}` : null,
      contenido ? `Contenido: ${contenido}` : null,
      otros ? `Otros: ${otros}` : null,
      location.href,
    ].filter(Boolean);

    window.open(`https://wa.me/${GKY_FEEDBACK_WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
    window.__gkySendResena?.({ slug, negocio, rating: rating || null, colores, contenido, otros, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la devolución en Firestore:', err));

    if (typeof showToast === 'function') showToast('¡Gracias por tu devolución!'); else window.alert('¡Gracias por tu devolución!');
    close();
    rating = 0; paintStars(0); coloresEl.value = ''; contenidoEl.value = ''; otrosEl.value = '';
  });

  if (reduceMotion) return;
  let hideTimer = null;
  window.addEventListener('scroll', () => {
    btn.classList.add('is-hidden');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => btn.classList.remove('is-hidden'), 550);
  }, { passive: true });
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none';
  });
}

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (modalAbierto) { cerrarModal(); return; }
  if (drawerAbierto) cerrarDrawer();
});

const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();

initCategorias();
initRail();
initCatalogo();
initHerbario();
initReveals();
initNav();
initDrawer();
initModal();
initFloats();
initHero();
initLeeScroll();
initJsonLd();
initFeedbackFloat();
updateCartBadge();

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
