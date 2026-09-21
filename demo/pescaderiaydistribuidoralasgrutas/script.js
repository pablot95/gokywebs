document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap !== 'undefined' && typeof Flip !== 'undefined') gsap.registerPlugin(Flip);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const WSP = '5492944814198';

const CATEGORIAS = {
  todos: 'Todo el mostrador',
  pescados: 'Pescados',
  langostinos: 'Langostinos',
  moluscos: 'Pulpo y calamar',
  mariscos: 'Mejillones y ostras',
  listos: 'Listos para cocinar'
};

const PRODUCTOS = [
  { id: 'merluza-filet', nombre: 'Merluza en filet', cat: 'pescados', pres: 'filet', frio: 'fresco', golfo: true,
    precio: 12900, descuento: 0, unidad: 'el kilo', corte: 'Filet sin espinas, porciones de 180 a 220 g', stock: 40,
    desc: 'Merluza del Golfo San Matías fileteada en el día. Sale limpia, sin piel ni espinas, lista para la sartén o el horno.',
    img: 'images/pescados.webp', tags: 'merluza filet pescado blanco' },
  { id: 'salmon-porciones', nombre: 'Salmón rosado en porciones', cat: 'pescados', pres: 'filet', frio: 'fresco',
    precio: 38900, descuento: 0, unidad: 'el kilo', corte: 'Porciones de 200 g, con piel', stock: 25,
    desc: 'Lomo de salmón rosado cortado en porciones parejas, con la piel puesta para que aguante la plancha.',
    img: 'images/salmon.webp', tags: 'salmon rosado lomo porcion' },
  { id: 'lenguado', nombre: 'Lenguado entero', cat: 'pescados', pres: 'entero', frio: 'fresco', golfo: true,
    precio: 18500, descuento: 0, unidad: 'el kilo', corte: 'Entero, eviscerado. Piezas de 400 a 700 g', stock: 18,
    desc: 'Lenguado entero del Golfo, eviscerado y escamado. Si lo querés en filet, lo dejamos listo sin cargo.',
    img: null, tags: 'lenguado entero pescado plano' },
  { id: 'corvina', nombre: 'Corvina rubia entera', cat: 'pescados', pres: 'entero', frio: 'fresco', golfo: true,
    precio: 9800, descuento: 12, unidad: 'el kilo', corte: 'Entera, eviscerada. Piezas de 1,2 a 2 kg', stock: 22,
    desc: 'Corvina rubia de captura local. Se lleva bien con el horno entera, rellena con limón y hierbas.',
    img: null, tags: 'corvina rubia entera pescado' },
  { id: 'abadejo', nombre: 'Abadejo en lomos', cat: 'pescados', pres: 'filet', frio: 'congelado',
    precio: 16400, descuento: 0, unidad: 'el kilo', corte: 'Lomos limpios, envasados de a 1 kg', stock: 30,
    desc: 'Lomos de abadejo congelados a bordo. Carne firme, ideal para guisos, cazuelas y al vapor.',
    img: null, tags: 'abadejo lomo congelado' },
  { id: 'trucha', nombre: 'Trucha patagónica entera', cat: 'pescados', pres: 'entero', frio: 'fresco',
    precio: 14200, descuento: 0, unidad: 'el kilo', corte: 'Entera, eviscerada. Piezas de 800 g a 1,2 kg', stock: 14,
    desc: 'Trucha de criadero patagónico, entera y eviscerada. Andá directo a la parrilla con papel manteca.',
    img: null, tags: 'trucha patagonica entera rio' },

  { id: 'langostino-l1', nombre: 'Langostino entero L1', cat: 'langostinos', pres: 'entero', frio: 'congelado', golfo: true,
    precio: 24500, descuento: 0, unidad: 'el kilo', corte: 'Calibre L1, caja de 2 kg o suelto', stock: 35,
    desc: 'Langostino patagónico entero, calibre L1. Congelado apenas sube a bordo, con la cabeza puesta.',
    img: 'images/langostinos.webp', tags: 'langostino entero l1 patagonico' },
  { id: 'langostino-pelado', nombre: 'Langostino pelado y desvenado', cat: 'langostinos', pres: 'limpio', frio: 'congelado',
    precio: 31900, descuento: 0, unidad: 'el kilo', corte: 'Pelado, sin vena, bolsa de 1 kg', stock: 28,
    desc: 'La cola de langostino lista para usar: pelada, desvenada y separada, sin descongelar de más.',
    img: null, tags: 'langostino pelado desvenado cola' },
  { id: 'camaron', nombre: 'Camarón fresco', cat: 'langostinos', pres: 'limpio', frio: 'fresco', golfo: true,
    precio: 19900, descuento: 0, unidad: 'el kilo', corte: 'Camarón chico, limpio', stock: 16,
    desc: 'Camarón del Golfo, chico y dulce. El que va en la salsa, en la tortilla o arriba de una picada.',
    img: null, tags: 'camaron fresco chico' },

  { id: 'pulpo', nombre: 'Pulpo entero del Golfo', cat: 'moluscos', pres: 'entero', frio: 'fresco', golfo: true,
    precio: 29500, descuento: 0, unidad: 'el kilo', corte: 'Entero, limpio. Piezas de 1 a 2,5 kg', stock: 12,
    desc: 'Pulpo entero ya limpio, listo para la olla. Lo pesamos delante tuyo y te decimos cuánto rinde.',
    img: 'images/pulpo.webp', tags: 'pulpo entero limpio' },
  { id: 'tubo-calamar', nombre: 'Tubo de calamar limpio', cat: 'moluscos', pres: 'limpio', frio: 'congelado', destacado: true,
    precio: 15800, descuento: 0, unidad: 'el kilo', corte: 'Tubo limpio, sin pluma ni piel', stock: 32,
    desc: 'Tubo de calamar limpio y parejo. Se corta en anillas o se rellena entero.',
    img: null, tags: 'calamar tubo limpio' },
  { id: 'anillas', nombre: 'Anillas de calamar', cat: 'moluscos', pres: 'limpio', frio: 'congelado',
    precio: 17200, descuento: 0, unidad: 'el kilo', corte: 'Anillas cortadas, bolsa de 1 kg', stock: 26,
    desc: 'Anillas ya cortadas al mismo grosor, para que salgan todas iguales de la sartén.',
    img: null, tags: 'anillas calamar rabas' },

  { id: 'mejillones', nombre: 'Mejillones limpios', cat: 'mariscos', pres: 'limpio', frio: 'fresco', golfo: true,
    precio: 8900, descuento: 0, unidad: 'el kilo', corte: 'Sin barba, lavados', stock: 30,
    desc: 'Mejillón del Golfo lavado y sin barba. Una olla, un chorro de vino blanco y ya está.',
    img: 'images/mejillones.webp', tags: 'mejillones mejillon limpio valva' },
  { id: 'ostras', nombre: 'Ostras del Golfo', cat: 'mariscos', pres: 'entero', frio: 'fresco', golfo: true, destacado: true,
    precio: 1450, descuento: 0, unidad: 'la unidad', corte: 'Vivas, cerradas. Mínimo 6 unidades', stock: 60,
    desc: 'Ostra del Golfo San Matías, viva y cerrada. Se abre en el momento, con limón y nada más.',
    img: null, tags: 'ostras ostra viva docena' },
  { id: 'almejas', nombre: 'Almejas frescas', cat: 'mariscos', pres: 'entero', frio: 'fresco', golfo: true, destacado: true,
    precio: 11500, descuento: 0, unidad: 'el kilo', corte: 'Vivas, purgadas', stock: 24,
    desc: 'Almeja purgada en agua de mar, sin arena. La base de cualquier cazuela que se precie.',
    img: null, tags: 'almejas almeja purgada' },
  { id: 'vieiras', nombre: 'Vieiras limpias', cat: 'mariscos', pres: 'limpio', frio: 'congelado', destacado: true,
    precio: 27800, descuento: 0, unidad: 'el kilo', corte: 'Callo limpio, sin valva', stock: 15,
    desc: 'Callo de vieira limpio, sin valva ni coral. Treinta segundos de cada lado y listo.',
    img: null, tags: 'vieiras vieira callo scallop' },

  { id: 'milanesas', nombre: 'Milanesas de merluza', cat: 'listos', pres: 'preparado', frio: 'congelado', destacado: true,
    precio: 13900, descuento: 10, unidad: 'la bandeja', corte: 'Bandeja de 6 unidades, rebozadas', stock: 40,
    desc: 'Milanesas de merluza rebozadas en casa, de filet entero. Salen al horno sin descongelar.',
    img: null, tags: 'milanesas milanesa merluza rebozada' },
  { id: 'empanadas', nombre: 'Empanadas de mariscos', cat: 'listos', pres: 'preparado', frio: 'congelado', destacado: true,
    precio: 9600, descuento: 0, unidad: 'la docena', corte: 'Docena congelada, crudas', stock: 36,
    desc: 'Relleno de langostino, calamar y mejillón, en masa criolla. Van del freezer al horno.',
    img: null, tags: 'empanadas empanada mariscos docena' },
  { id: 'paella', nombre: 'Paella marinera para dos', cat: 'listos', pres: 'preparado', frio: 'congelado', destacado: true,
    precio: 22400, descuento: 0, unidad: 'la bandeja', corte: 'Bandeja para 2 porciones', stock: 20,
    desc: 'Arroz, langostinos, mejillones y calamar armados en bandeja. Se termina en 12 minutos.',
    img: null, tags: 'paella marinera arroz bandeja' },
  { id: 'rabas', nombre: 'Rabas rebozadas', cat: 'listos', pres: 'preparado', frio: 'congelado', destacado: true,
    precio: 16900, descuento: 0, unidad: 'el kilo', corte: 'Rebozadas, bolsa de 1 kg', stock: 30,
    desc: 'Anillas rebozadas con nuestra mezcla, listas para freír. Las de la picada de siempre.',
    img: null, tags: 'rabas raba calamar rebozado frito' }
];

const ZONAS = [
  { id: 'lasgrutas', nombre: 'Las Grutas', dias: [2, 4, 6], costo: 2500, minimo: 15000, frio: 'Caja con hielo, el mismo día' },
  { id: 'sao', nombre: 'San Antonio Oeste', dias: [2, 5], costo: 3500, minimo: 20000, frio: 'Caja con hielo, el mismo día' },
  { id: 'doradas', nombre: 'Playas Doradas / San Antonio Este', dias: [5], costo: 5200, minimo: 25000, frio: 'Caja con hielo y gel' },
  { id: 'sierra', nombre: 'Sierra Grande', dias: [5], costo: 6800, minimo: 30000, frio: 'Caja con hielo y gel' },
  { id: 'viedma', nombre: 'Viedma y Carmen de Patagones', dias: [3], costo: 8200, minimo: 40000, frio: 'Caja térmica con gel' },
  { id: 'bariloche', nombre: 'San Carlos de Bariloche', dias: [3], costo: 9800, minimo: 45000, frio: 'Caja térmica, llega al día siguiente' }
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const Cart = {
  KEY: 'lasgrutas_cart',
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
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

/* ---------- cards ---------- */
function mediaHTML(p) {
  if (p.img) {
    return `<img src="${p.img}" width="1100" height="1100" alt="${esc(p.nombre)}">`;
  }
  const especie = p.nombre.split(' ')[0];
  return `<span class="card__slot" aria-hidden="true">
      <span class="card__slotword">${esc(especie)}</span>
      <span class="card__slotcat">${esc(CATEGORIAS[p.cat])}</span>
    </span>`;
}

function cardHTML(p, clase, simple) {
  const fin = precioFinal(p);
  const badge = p.descuento > 0
    ? `<span class="card__badge card__badge--off">-${p.descuento}%</span>`
    : (p.golfo ? '<span class="card__badge">Del Golfo</span>' : `<span class="card__badge">${p.frio === 'fresco' ? 'Fresco del día' : 'Congelado'}</span>`);
  return `<article class="card ${clase || ''}" data-id="${p.id}">
    <div class="card__media">${badge}${mediaHTML(p)}</div>
    <div class="card__body">
      <h3 class="card__nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="card__corte">${esc(p.corte)}</p>
      <p class="card__precio"><b>${formatearPrecio(fin)}</b>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}<span class="card__unidad">${esc(p.unidad)}</span></p>
      <div class="card__acciones">
        ${simple ? '' : `<span class="stepper" data-step="${p.id}">
          <button type="button" data-menos aria-label="Quitar uno">−</button>
          <span data-qty>1</span>
          <button type="button" data-mas aria-label="Sumar uno">+</button>
        </span>`}
        <button type="button" class="btn btn--solid prod-add" data-add="${p.id}">Agregar</button>
      </div>
    </div>
  </article>`;
}

/* ---------- catálogo + momento propio (reorden con Flip) ---------- */
const grid = document.getElementById('catalogoGrid');
const estado = { cat: 'todos', pres: [], frio: [], max: 40000, q: '', orden: 'destacados', mostrados: 16 };
let cards = [];
let idsPrev = [];
let flipActual = null;
let reasiento = null;
let revealsListos = false;

function listaFiltrada() {
  const q = normalizar(estado.q).split(/\s+/).filter(Boolean);
  let lista = PRODUCTOS.filter(p => {
    if (estado.cat !== 'todos' && p.cat !== estado.cat) return false;
    if (estado.pres.length && !estado.pres.includes(p.pres)) return false;
    if (estado.frio.length && !estado.frio.includes(p.frio)) return false;
    if (precioFinal(p) > estado.max) return false;
    if (q.length) {
      const heno = normalizar([p.nombre, p.corte, p.desc, p.tags, CATEGORIAS[p.cat]].join(' '));
      if (!q.every(t => heno.includes(t))) return false;
    }
    return true;
  });
  if (estado.orden === 'precio-asc') lista.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estado.orden === 'precio-desc') lista.sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (estado.orden === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else lista.sort((a, b) => ((b.img ? 2 : 0) + (b.destacado ? 1 : 0)) - ((a.img ? 2 : 0) + (a.destacado ? 1 : 0)));
  return lista;
}

function asentar(ids) {
  cards.forEach(c => {
    const on = ids.includes(c.dataset.id);
    if (typeof gsap !== 'undefined') gsap.killTweensOf(c);
    ['opacity', 'transform', 'position', 'left', 'top', 'width', 'height', 'margin'].forEach(pr => c.style.removeProperty(pr));
    c.style.display = on ? '' : 'none';
    c.classList.toggle('card--star', on && ids[0] === c.dataset.id);
  });
}

function datoVivo(lista) {
  const cortes = document.getElementById('datoCortes');
  const desde = document.getElementById('datoDesde');
  const contador = document.getElementById('contador');
  if (contador) contador.textContent = lista.length;
  if (cortes) cortes.textContent = lista.length;
  if (desde) {
    const min = lista.length ? Math.min(...lista.map(precioFinal)) : 0;
    desde.textContent = lista.length ? formatearPrecio(min) : '—';
  }
}

function aplicar(animar = true) {
  if (!grid) return;
  const lista = listaFiltrada();
  const visibles = lista.slice(0, estado.mostrados);
  const ids = visibles.map(p => p.id);

  const vacio = document.getElementById('vacio');
  if (vacio) vacio.hidden = lista.length > 0;
  const verMas = document.getElementById('verMas');
  if (verMas) verMas.hidden = lista.length <= estado.mostrados;

  const puedeFlip = animar && !reduceMotion && typeof Flip !== 'undefined' && typeof gsap !== 'undefined';
  if (flipActual) { flipActual.kill(); flipActual = null; }
  clearTimeout(reasiento);

  let snapshot = null;
  if (puedeFlip) { asentar(idsPrev); snapshot = Flip.getState(cards); }

  visibles.forEach(p => {
    const c = cards.find(x => x.dataset.id === p.id);
    if (c) grid.appendChild(c);
  });
  asentar(ids);
  idsPrev = ids;
  datoVivo(lista);

  if (puedeFlip && snapshot) {
    const cerrar = () => { asentar(ids); if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };
    flipActual = Flip.from(snapshot, { duration: .55, ease: 'power2.inOut', stagger: .02, onComplete: cerrar });
    reasiento = setTimeout(() => { cerrar(); setTimeout(cerrar, 1300); }, 900);
  } else if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
  revelarNuevos(grid);
}

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach(el => el.classList.add('in'));
}

function initCatalogo() {
  if (!grid) return;
  grid.innerHTML = PRODUCTOS.map(p => cardHTML(p)).join('');
  cards = [...grid.children];

  document.querySelectorAll('.especie').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.especie').forEach(b => b.classList.toggle('is-on', b === btn));
      estado.cat = btn.dataset.cat;
      estado.mostrados = 16;
      aplicar();
    });
  });

  document.querySelectorAll('input[data-f="pres"]').forEach(i => i.addEventListener('change', () => {
    estado.pres = [...document.querySelectorAll('input[data-f="pres"]:checked')].map(x => x.value);
    estado.mostrados = 16; aplicar();
  }));
  document.querySelectorAll('input[data-f="frio"]').forEach(i => i.addEventListener('change', () => {
    estado.frio = [...document.querySelectorAll('input[data-f="frio"]:checked')].map(x => x.value);
    estado.mostrados = 16; aplicar();
  }));

  const rango = document.getElementById('precioMax');
  const precioVal = document.getElementById('precioVal');
  rango?.addEventListener('input', () => {
    estado.max = Number(rango.value);
    if (precioVal) precioVal.textContent = formatearPrecio(estado.max);
    estado.mostrados = 16; aplicar();
  });

  document.getElementById('orden')?.addEventListener('change', e => { estado.orden = e.target.value; aplicar(); });
  document.getElementById('verMas')?.addEventListener('click', () => { estado.mostrados += 16; aplicar(); });
  document.getElementById('limpiarFiltros')?.addEventListener('click', limpiarTodo);
  document.getElementById('vacioReset')?.addEventListener('click', limpiarTodo);

  const sync = (input) => input?.addEventListener('input', () => {
    estado.q = input.value; estado.mostrados = 16; aplicar();
    ['headerSearch', 'heroSearch'].forEach(id => {
      const otro = document.getElementById(id);
      if (otro && otro !== input) otro.value = input.value;
    });
  });
  sync(document.getElementById('headerSearch'));
  sync(document.getElementById('heroSearch'));
  ['headerSearchForm', 'heroSearchForm'].forEach(id => {
    document.getElementById(id)?.addEventListener('submit', e => {
      e.preventDefault();
      document.getElementById('mostrador')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  document.querySelectorAll('[data-cat-link]').forEach(a => a.addEventListener('click', () => {
    const chip = document.querySelector(`.especie[data-cat="${a.dataset.catLink}"]`);
    if (chip) chip.click();
    document.getElementById('mostrador')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }));

  const toggle = document.getElementById('filtrosToggle');
  const filtros = document.getElementById('filtros');
  const cerrarF = document.getElementById('filtrosClose');
  toggle?.addEventListener('click', () => {
    const abierto = filtros.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(abierto));
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
  cerrarF?.addEventListener('click', () => {
    filtros.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false'); toggle?.focus();
  });

  aplicar(false);
}

function limpiarTodo() {
  estado.cat = 'todos'; estado.pres = []; estado.frio = []; estado.max = 40000; estado.q = ''; estado.orden = 'destacados'; estado.mostrados = 16;
  document.querySelectorAll('.especie').forEach(b => b.classList.toggle('is-on', b.dataset.cat === 'todos'));
  document.querySelectorAll('input[data-f="pres"], input[data-f="frio"]').forEach(i => { i.checked = false; });
  const rango = document.getElementById('precioMax');
  if (rango) rango.value = 40000;
  const precioVal = document.getElementById('precioVal');
  if (precioVal) precioVal.textContent = formatearPrecio(40000);
  const orden = document.getElementById('orden');
  if (orden) orden.value = 'destacados';
  ['headerSearch', 'heroSearch'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  aplicar();
}

/* ---------- rail ---------- */
function initRail() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  const destacados = PRODUCTOS.filter(p => p.destacado).slice(0, 6);
  track.innerHTML = destacados.map(p => cardHTML(p, 'rail-card', true)).join('');
  track.setAttribute('data-animate-stagger', '');
  [...track.children].forEach(c => {
    c.setAttribute('data-animate', '');
    c.style.opacity = '0';
    c.style.transform = 'translateY(26px)';
  });

  const vp = document.getElementById('railVp');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!vp) return;

  const syncFlechas = () => {
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 16;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: 'smooth' }));
  vp.addEventListener('scroll', syncFlechas, { passive: true });
  window.addEventListener('resize', syncFlechas, { passive: true });
  syncFlechas();

  let down = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startScroll = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    if (moved) { vp.scrollLeft = startScroll - dx; e.preventDefault(); }
  });
  const end = () => {
    if (!down) return;
    down = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      setTimeout(() => vp.classList.remove('dragging'), 0);
    }
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
}

/* ---------- acciones de producto ---------- */
function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const span = step.querySelector('[data-qty]');
      let q = Number(span.textContent) || 1;
      if (e.target.closest('[data-mas]')) q++;
      if (e.target.closest('[data-menos]')) q = Math.max(1, q - 1);
      span.textContent = q;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const cont = add.closest('.card, .modal__panel');
      const qty = Number(cont?.querySelector('[data-qty]')?.textContent) || 1;
      Cart.add(p, qty);
      showToast(`${p.nombre} va al pedido`);
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const qty = Number(comprar.closest('.modal__panel')?.querySelector('[data-qty]')?.textContent) || 1;
      Cart.add(p, qty);
      cerrarQuick();
      abrirDrawer();
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) abrirQuick(quick.dataset.quick);
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const quick = e.target.closest?.('[data-quick]');
    if (quick) { e.preventDefault(); abrirQuick(quick.dataset.quick); }
  });
}

/* ---------- vista rápida ---------- */
const modal = document.getElementById('quickModal');
let ultimoFoco = null;

function abrirQuick(id) {
  const p = getProducto(id);
  if (!p || !modal) return;
  ultimoFoco = document.activeElement;
  const fin = precioFinal(p);
  const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  document.getElementById('quickContent').innerHTML = `
    <div class="quick__media">${mediaHTML(p)}</div>
    <div class="quick__info">
      <p class="eyebrow">${esc(CATEGORIAS[p.cat])}</p>
      <h2 id="quickTit">${esc(p.nombre)}</h2>
      <p class="quick__precio"><b>${formatearPrecio(fin)}</b>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}<span class="card__unidad">${esc(p.unidad)}</span></p>
      <p class="quick__desc">${esc(p.desc)}</p>
      <ul class="quick__datos">
        <li><span>Presentación</span><strong>${esc(p.corte)}</strong></li>
        <li><span>Cómo viaja</span><strong>${p.frio === 'fresco' ? 'Fresco del día, en hielo' : 'Congelado, cadena de frío'}</strong></li>
        <li><span>Origen</span><strong>${p.golfo ? 'Golfo San Matías' : 'Proveedor seleccionado'}</strong></li>
      </ul>
      <div class="quick__acciones">
        <span class="stepper" data-step="${p.id}">
          <button type="button" data-menos aria-label="Quitar uno">−</button>
          <span data-qty>1</span>
          <button type="button" data-mas aria-label="Sumar uno">+</button>
        </span>
        <button type="button" class="btn btn--line" data-add="${p.id}">Agregar</button>
        <button type="button" class="btn btn--solid" data-comprar="${p.id}">Comprar ahora</button>
      </div>
      ${rel.length ? `<div class="quick__rel"><h4>También del mostrador</h4><div class="quick__rel-grid">
        ${rel.map(r => `<button type="button" class="quick__rel-item" data-quick="${r.id}">
          <span class="card__media">${mediaHTML(r)}</span>
          <span>${esc(r.nombre)}</span>
        </button>`).join('')}
      </div></div>` : ''}
    </div>`;
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  modal.querySelector('#quickClose')?.focus();
}

function cerrarQuick() {
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('no-scroll');
  ultimoFoco?.focus();
}

function initQuick() {
  if (!modal) return;
  document.getElementById('quickClose')?.addEventListener('click', cerrarQuick);
  modal.querySelector('[data-close-modal]')?.addEventListener('click', cerrarQuick);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) cerrarQuick();
    if (e.key === 'Tab' && !modal.hidden) trapFocus(e, modal.querySelector('.modal__panel'));
  });
}

function trapFocus(e, cont) {
  if (!cont) return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/* ---------- carrito ---------- */
const drawer = document.getElementById('cartDrawer');
const backdrop = document.getElementById('drawerBackdrop');
let focoDrawer = null;

function abrirDrawer() {
  if (!drawer) return;
  focoDrawer = document.activeElement;
  drawer.hidden = false; backdrop.hidden = false;
  requestAnimationFrame(() => { drawer.classList.add('open'); backdrop.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('drawerClose')?.focus();
}
function cerrarDrawer() {
  if (!drawer || drawer.hidden) return;
  drawer.classList.remove('open'); backdrop.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { drawer.hidden = true; backdrop.hidden = true; }, 380);
  focoDrawer?.focus();
}

function pintarCarrito() {
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  if (!body || !foot) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="drawer__vacio">
      <p>Todavía no sumaste nada del mostrador.</p>
      <a class="btn btn--solid" href="#mostrador" data-cerrar-drawer>Ver el mostrador</a>
    </div>`;
    foot.innerHTML = '';
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<div class="linea">
      <span class="linea__media">${mediaHTML(p)}</span>
      <span>
        <span class="linea__nombre">${esc(p.nombre)}</span>
        <span class="linea__meta">${esc(p.unidad)}</span>
        <span class="stepper" data-linea="${p.id}">
          <button type="button" data-lmenos aria-label="Quitar uno">−</button>
          <span>${i.qty}</span>
          <button type="button" data-lmas aria-label="Sumar uno">+</button>
        </span>
      </span>
      <span>
        <span class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</span><br>
        <button type="button" class="linea__quitar" data-quitar="${p.id}">Quitar</button>
      </span>
    </div>`;
  }).join('');
  foot.innerHTML = `<p class="drawer__total"><span>Total del pedido</span><strong>${formatearPrecio(Cart.total())}</strong></p>
    <button type="button" class="btn btn--solid btn--block" id="finalizar">Finalizar compra</button>
    <a class="btn btn--line btn--block" href="#envios" data-cerrar-drawer>Calcular el envío</a>`;
}

function initDrawer() {
  if (!drawer) return;
  document.getElementById('cartBtn')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  backdrop?.addEventListener('click', cerrarDrawer);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !drawer.hidden) cerrarDrawer();
    if (e.key === 'Tab' && !drawer.hidden) trapFocus(e, drawer);
  });
  drawer.addEventListener('click', e => {
    const linea = e.target.closest('[data-linea]');
    if (linea) {
      const id = linea.dataset.linea;
      const actual = Cart.get().find(i => i.id === id)?.qty || 1;
      if (e.target.closest('[data-lmas]')) Cart.setQty(id, actual + 1);
      if (e.target.closest('[data-lmenos]')) { if (actual <= 1) Cart.remove(id); else Cart.setQty(id, actual - 1); }
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) Cart.remove(quitar.dataset.quitar);
    if (e.target.closest('#finalizar')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
    if (e.target.closest('[data-cerrar-drawer]')) cerrarDrawer();
  });
  document.addEventListener('cart:updated', pintarCarrito);
  pintarCarrito();
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

/* ---------- componente funcional: reparto por zona ---------- */
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function proximoReparto(dias) {
  const hoy = new Date();
  const desde = hoy.getHours() < 10 ? 0 : 1;
  for (let i = desde; i < 15; i++) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + i);
    if (dias.includes(d.getDay())) return d;
  }
  return null;
}

function initCalc() {
  const select = document.getElementById('calcZona');
  if (!select) return;
  const dia = document.getElementById('calcDia');
  const costo = document.getElementById('calcCosto');
  const min = document.getElementById('calcMin');
  const frio = document.getElementById('calcFrio');
  const est = document.getElementById('calcEstado');
  const wsp = document.getElementById('calcWsp');

  const pintar = () => {
    const z = ZONAS.find(x => x.id === select.value) || ZONAS[0];
    const fecha = proximoReparto(z.dias);
    const texto = fecha ? `${DIAS[fecha.getDay()]} ${fecha.getDate()} de ${MESES[fecha.getMonth()]}` : 'a coordinar';
    dia.textContent = texto;
    costo.textContent = formatearPrecio(z.costo);
    min.textContent = formatearPrecio(z.minimo);
    frio.textContent = z.frio;

    const total = Cart.total();
    if (!total) {
      est.textContent = 'Tu pedido está vacío: sumá productos del mostrador y te decimos si llegás al mínimo.';
      est.classList.remove('is-ok');
    } else if (total < z.minimo) {
      est.textContent = `Llevás ${formatearPrecio(total)}. Te faltan ${formatearPrecio(z.minimo - total)} para el mínimo de ${z.nombre}.`;
      est.classList.remove('is-ok');
    } else {
      est.textContent = `Llevás ${formatearPrecio(total)}. Ya entrás en el reparto del ${texto} a ${z.nombre}.`;
      est.classList.add('is-ok');
    }
    const msg = `Hola, quiero un pedido para ${z.nombre}. Reparto del ${texto}. ${total ? 'Mi pedido va en ' + formatearPrecio(total) + '.' : 'Todavía estoy armando el pedido.'}`;
    wsp.setAttribute('href', `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`);
  };

  select.addEventListener('change', pintar);
  document.addEventListener('cart:updated', pintar);
  pintar();
}

/* ---------- banner del modelo 2 ---------- */
function initBanner() {
  const mensajes = document.querySelectorAll('.mensaje');
  const pips = document.querySelectorAll('.hero-banner__pips button');
  if (mensajes.length < 2) return;
  let i = 0;
  const mostrar = n => {
    i = n;
    mensajes.forEach((m, k) => m.classList.toggle('is-on', k === n));
    pips.forEach((p, k) => p.setAttribute('aria-current', String(k === n)));
  };
  pips.forEach((p, k) => p.addEventListener('click', () => mostrar(k)));
  mostrar(0);
  if (reduceMotion) return;
  setInterval(() => mostrar((i + 1) % mensajes.length), 5200);
}

/* ---------- newsletter ---------- */
function initNews() {
  const form = document.getElementById('newsForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const txt = btn.textContent;
    btn.disabled = true; btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false; btn.textContent = txt; form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

/* ---------- nav ---------- */
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
  let intentos = 0;
  const tick = setInterval(() => { sweep(); if (++intentos >= 12) clearInterval(tick); }, 500);
}

/* ---------- flotantes ---------- */
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

/* ---------- hero ---------- */
function initHero() {
  const foto = document.querySelector('.hero__media img, .hero-banner__media img');
  if (foto && typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.to(foto, { scale: 1, duration: 1.4, ease: 'power2.out' });
  } else if (foto) {
    foto.style.transform = 'none';
  }
}

/* ---------- arranque ---------- */
initCatalogo();
initRail();
initBanner();
initNews();
initReveals();
initNav();
initQuick();
initDrawer();
initAcciones();
initCalc();
initFloats();
initHero();
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
const anio = document.getElementById('year');
if (anio) anio.textContent = new Date().getFullYear();
