document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491158296005';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normaliza = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

const RUBROS = [
  { id: 'marcadores', nombre: 'Marcadores',          img: 'k-10.webp',        nota: 'Escolares y doble punta' },
  { id: 'gel',        nombre: 'Gel y resaltadores',  img: 'k-05.webp',        nota: 'Glitter, neón y pastel' },
  { id: 'escritura',  nombre: 'Escritura',           img: 'k-01.webp',        nota: 'Bolígrafos y gel por pote' },
  { id: 'arte',       nombre: 'Arte y dibujo',       img: 'p-lapices.webp',   nota: 'Lápices, pinceles y color' },
  { id: 'papeleria',  nombre: 'Papelería y oficina', img: 'p-carpetas.webp',  nota: 'Carpetas, cuadernos y broches' },
];

const MARCAS = ['Kiruki', 'Pizzini', 'Rexon', 'OXO', 'Muresco'];

const PRODUCTOS = [
  { id: 1,  cod: '470310', nombre: 'Marcadores Neon-Paw x 6', marca: 'Kiruki', rubro: 'marcadores', img: 'k-03.webp', precio: 5480, descuento: 0, unidad: 'Caja x 12 estuches', bulto: '12 estuches', stock: 40, perfil: ['libreria', 'escuela', 'clases'], desc: 'Estuche de 6 marcadores escolares en colores neón, con diseño de patitas. Es el que se lleva la librería para la góndola de vuelta a clases.' },
  { id: 2,  cod: '470311', nombre: 'Marcadores Pastel-Paw x 6', marca: 'Kiruki', rubro: 'marcadores', img: 'k-04.webp', precio: 5480, descuento: 0, unidad: 'Caja x 12 estuches', bulto: '12 estuches', stock: 38, perfil: ['libreria', 'regaleria', 'clases'], desc: 'El mismo estuche de 6 en la línea pastel. Sale mucho junto al neón: el que compra uno suele llevar los dos.' },
  { id: 3,  cod: '470320', nombre: 'Marcadores Paw-Paw x 10', marca: 'Kiruki', rubro: 'marcadores', img: 'k-10.webp', precio: 8150, descuento: 0, unidad: 'Caja x 6 estuches', bulto: '6 estuches', stock: 30, perfil: ['libreria', 'escuela', 'clases'], desc: 'Estuche de 10 colores clásicos. El punto medio entre el de 6 y el de 20: es el más pedido de la línea.' },
  { id: 4,  cod: '470322', nombre: 'Marcadores Paw-Paw x 20', marca: 'Kiruki', rubro: 'marcadores', img: 'k-12.webp', precio: 14900, descuento: 10, unidad: 'Caja x 6 estuches', bulto: '6 estuches', stock: 22, perfil: ['escuela', 'regaleria', 'clases'], desc: 'Estuche grande de 20 colores con manija. Es regalo y es útil escolar a la vez, así que rota en los dos mostradores.' },
  { id: 5,  cod: '470340', nombre: 'Marcadores Acrylic Classic doble punta x 4', marca: 'Kiruki', rubro: 'marcadores', img: 'k-13.webp', precio: 11200, descuento: 0, unidad: 'Caja x 6 estuches', bulto: '6 estuches', stock: 18, perfil: ['regaleria', 'reposicion'], desc: 'Pintura acrílica en marcador, doble punta, colores clásicos. Escribe sobre vidrio, madera y tela; es el que compra el que hace manualidades.' },
  { id: 6,  cod: '470341', nombre: 'Marcadores Acrylic Pastel doble punta x 4', marca: 'Kiruki', rubro: 'marcadores', img: 'k-14.webp', precio: 11200, descuento: 0, unidad: 'Caja x 6 estuches', bulto: '6 estuches', stock: 16, perfil: ['regaleria', 'reposicion'], desc: 'La misma pintura acrílica en gama pastel. Se vende para lettering, souvenirs y decoración de macetas o frascos.' },
  { id: 7,  cod: '470342', nombre: 'Marcadores Acrylic Vivid doble punta x 4', marca: 'Kiruki', rubro: 'marcadores', img: 'k-15.webp', precio: 11200, descuento: 0, unidad: 'Caja x 6 estuches', bulto: '6 estuches', stock: 15, perfil: ['regaleria', 'finde'], desc: 'Gama vívida de la línea acrílica. Los tres estuches se exhiben juntos y se venden como set.' },

  { id: 8,  cod: '470210', nombre: 'Lapiceras gel Gelly Glitter x 6', marca: 'Kiruki', rubro: 'gel', img: 'k-05.webp', precio: 4920, descuento: 0, unidad: 'Caja x 12 estuches', bulto: '12 estuches', stock: 45, perfil: ['libreria', 'kiosco', 'clases'], desc: 'Gel con glitter, 6 colores. Producto de impulso puro: se pone en el mostrador y se vende solo.' },
  { id: 9,  cod: '470211', nombre: 'Lapiceras gel Gelly Frutal x 6', marca: 'Kiruki', rubro: 'gel', img: 'k-07.webp', precio: 4640, descuento: 0, unidad: 'Caja x 12 estuches', bulto: '12 estuches', stock: 44, perfil: ['kiosco', 'libreria', 'reposicion'], desc: 'Gel clásico en 6 colores, línea frutal. Es el más barato de la familia y el que más unidades mueve.' },
  { id: 10, cod: '470212', nombre: 'Lapiceras gel Gelly Neón x 6', marca: 'Kiruki', rubro: 'gel', img: 'k-08.webp', precio: 4640, descuento: 0, unidad: 'Caja x 12 estuches', bulto: '12 estuches', stock: 42, perfil: ['kiosco', 'libreria', 'reposicion'], desc: 'La versión neón del Gelly. Conviene tener las dos: el chico que entra elige por color, no por marca.' },
  { id: 11, cod: '470230', nombre: 'Resaltadores Pastel Love x 4', marca: 'Kiruki', rubro: 'gel', img: 'k-09.webp', precio: 3870, descuento: 0, unidad: 'Caja x 12 estuches', bulto: '12 estuches', stock: 50, perfil: ['libreria', 'escuela', 'reposicion'], desc: 'Resaltadores pastel de 4 colores. Es el útil que más repite el secundario y el que menos queda parado en la góndola.' },
  { id: 12, cod: '470231', nombre: 'Resaltadores Paw-Paw Warm Pastel x 4', marca: 'Kiruki', rubro: 'gel', img: 'k-11.webp', precio: 3640, descuento: 0, unidad: 'Caja x 12 estuches', bulto: '12 estuches', stock: 48, perfil: ['libreria', 'escuela', 'reposicion'], desc: 'Gama cálida del resaltador pastel. Se pide junto al Pastel Love para tener las dos paletas en el exhibidor.' },

  { id: 13, cod: '470100', nombre: 'Bolígrafos Kiruki pastel — pote x 24', marca: 'Kiruki', rubro: 'escritura', img: 'k-01.webp', precio: 19680, descuento: 0, unidad: 'Pote x 24 unidades', bulto: '24 unidades', stock: 26, perfil: ['kiosco', 'libreria', 'reposicion'], desc: 'Pote de mostrador con 24 bolígrafos de cuerpo pastel y estampado. Viene listo para poner al lado de la caja.' },
  { id: 14, cod: '470120', nombre: 'Gel Yummy Yummy perfumadas x 20', marca: 'Kiruki', rubro: 'escritura', img: 'k-06.webp', precio: 13450, descuento: 15, unidad: 'Caja x 6 estuches', bulto: '6 estuches', stock: 20, perfil: ['kiosco', 'regaleria', 'clases'], desc: 'Veinte lapiceras gel con aroma y glitter en estuche de regalo. Es el estuche que se lleva de cumpleaños.' },
  { id: 15, cod: '470160', nombre: 'Marcadores al agua surtidos x 12', marca: 'Kiruki', rubro: 'escritura', img: 'k-16.webp', precio: 9980, descuento: 0, unidad: 'Caja x 12 estuches', bulto: '12 estuches', stock: 28, perfil: ['escuela', 'libreria', 'clases'], desc: 'Marcadores al agua sueltos, surtidos por color. Es la reposición del jardín y del primario, donde se pierden de a uno.' },

  { id: 16, cod: '206083', nombre: 'Lápices de color Pizzini Polycolor x 12', marca: 'Pizzini', rubro: 'arte', img: 'p-lapices.webp', precio: 18328, descuento: 0, unidad: 'Lata x 12 colores', bulto: 'Unidad', stock: 24, perfil: ['escuela', 'libreria', 'clases'], desc: 'Lápices de color en lata, mina blanda y colores plenos. La lata es lo que lo separa del estuche de cartón: aguanta la mochila todo el año.' },
  { id: 17, cod: '259500', nombre: 'Pinceles Rexon redondos N° 1', marca: 'Rexon', rubro: 'arte', img: 'p-pinceles.webp', precio: 2734, descuento: 0, unidad: 'Docena', bulto: '12 unidades', stock: 60, perfil: ['escuela', 'regaleria', 'reposicion'], desc: 'Pincel redondo de pelo chato N° 1, por docena. Es el que piden por lista escolar y el que más se repone en marzo.' },

  { id: 18, cod: '160303', nombre: 'Carpeta Rexon PVC 3x40 color', marca: 'Rexon', rubro: 'papeleria', img: 'p-carpetas.webp', precio: 2890, descuento: 0, unidad: 'Unidad', bulto: '12 unidades', stock: 55, perfil: ['libreria', 'escuela', 'clases'], desc: 'Carpeta de PVC con tres ganchos y capacidad para 40 folios. Se vende todo el año, no solo en marzo.' },
  { id: 19, cod: '805016', nombre: 'Cartulina mágica A4 x 5 hojas', marca: 'Muresco', rubro: 'papeleria', img: 'editorial-papel.webp', precio: 1270, descuento: 0, unidad: 'Paquete x 5 hojas', bulto: '20 paquetes', stock: 70, perfil: ['escuela', 'regaleria', 'reposicion'], desc: 'Cinco hojas A4 de cartulina metalizada surtida. Producto de bajo precio y alta rotación para trabajos prácticos.' },
  { id: 20, cod: '208211', nombre: 'Cuaderno fantasía 15x21 tapa semirrígida', marca: 'Pizzini', rubro: 'papeleria', img: 'p-cuadernos.webp', precio: 2300, descuento: 0, unidad: 'Unidad', bulto: '10 unidades', stock: 65, perfil: ['libreria', 'escuela', 'clases'], desc: 'Cuaderno chico de tapa semirrígida con diseños surtidos. Entra en la lista escolar y también se lleva suelto.' },
  { id: 21, cod: '380122', nombre: 'Abrochadora OXO mediana 24/6', marca: 'OXO', rubro: 'papeleria', img: 'p-oficina.webp', precio: 3209, descuento: 10, unidad: 'Unidad', bulto: '12 unidades', stock: 34, perfil: ['libreria', 'kiosco', 'finde'], desc: 'Abrochadora de mesa 24/6 con cuerpo metálico. Es la de oficina de todos los días, la que se rompe y se repone.' },
  { id: 22, cod: '801502', nombre: 'Set de geometría 20 cm x 3 piezas', marca: 'Pizzini', rubro: 'papeleria', img: 'p-geometria.webp', precio: 1378, descuento: 0, unidad: 'Set x 3 piezas', bulto: '12 sets', stock: 58, perfil: ['escuela', 'libreria', 'clases'], desc: 'Regla de 20 cm, escuadra y transportador en un set. Es pedido fijo de lista escolar de primaria y secundaria.' },
];

const DESTACADOS = [3, 11, 8, 16, 4, 20, 13, 17];

const NEGOCIOS = { libreria: 'la librería', kiosco: 'el kiosco', escuela: 'la escuela', regaleria: 'la regalería' };
const MOMENTOS = { clases: 'vuelta a clases', reposicion: 'reposición del mes', finde: 'fin de año' };

const Cart = {
  KEY: 'distribuidoralionel_cart',
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
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.35)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function cardHTML(p) {
  const rub = RUBROS.find(r => r.id === p.rubro)?.nombre || '';
  const fin = precioFinal(p);
  const precios = p.descuento > 0
    ? `<span class="art-precio art-precio-off">${formatearPrecio(fin)}</span><s>${formatearPrecio(p.precio)}</s>`
    : `<span class="art-precio">${formatearPrecio(fin)}</span>`;
  return `
  <article class="art" data-id="${p.id}" data-qty="1" data-animate="up" style="transform:translateY(30px);opacity:0">
    <div class="art-media">
      <img src="images/${esc(p.img)}" width="800" height="1000" alt="${esc(p.nombre)}">
      <span class="cod art-cod">${esc(p.cod)}</span>
      ${p.descuento > 0 ? `<span class="art-badge">-${p.descuento}%</span>` : ''}
      <button type="button" class="art-ver" data-ver="${p.id}">Ver ficha</button>
    </div>
    <div class="art-body">
      <span class="art-rub">${esc(rub)}</span>
      <h3 class="art-nom">${esc(p.nombre)}</h3>
      <span class="art-marca">${esc(p.marca)}</span>
      <span class="art-uni">${esc(p.unidad)}</span>
      <div class="art-precios">${precios}</div>
      <div class="art-actions">
        <div class="stepper">
          <button type="button" data-step="-1" aria-label="Quitar una unidad de ${esc(p.nombre)}">−</button>
          <output data-out>1</output>
          <button type="button" data-step="1" aria-label="Sumar una unidad de ${esc(p.nombre)}">+</button>
        </div>
        <button type="button" class="art-add" data-add="${p.id}">Agregar</button>
      </div>
      <button type="button" class="art-buy" data-buy="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}

function bindCardEvents(cont) {
  if (!cont) return;
  cont.addEventListener('click', e => {
    const card = e.target.closest('.art');
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

function initRubros() {
  const grid = document.getElementById('rubros-grid');
  if (!grid) return;
  grid.innerHTML = RUBROS.map((r, i) => {
    const n = PRODUCTOS.filter(p => p.rubro === r.id).length;
    return `
    <button type="button" class="rub-card" data-rubro="${r.id}" data-animate="up" style="transform:translateY(26px);opacity:0">
      <div class="rub-media"><img src="images/${esc(r.img)}" width="800" height="800" alt="${esc(r.nombre)}"></div>
      <div class="rub-body">
        <span class="cod rub-n">Rubro ${String(i + 1).padStart(2, '0')}</span>
        <h3>${esc(r.nombre)}</h3>
        <p>${esc(r.nota)} · ${n} art.</p>
      </div>
    </button>`;
  }).join('');
  grid.addEventListener('click', e => {
    const btn = e.target.closest('[data-rubro]');
    if (btn) irAlCatalogo(btn.dataset.rubro);
  });
}

function initRail() {
  const track = document.getElementById('rail-track');
  const vp = document.getElementById('rail-vp');
  if (!track || !vp) return;
  track.innerHTML = DESTACADOS.map(id => getProducto(id)).filter(Boolean).map(p => cardHTML(p)).join('');
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

const estado = { q: '', rubro: 'all', marca: 'all', orden: 'rel', visibles: 16 };
const PASO = 16;

function filtrados() {
  const base = normaliza(estado.q).trim();
  const terms = base ? base.split(/\s+/) : [];
  let out = PRODUCTOS.filter(p => {
    if (estado.rubro !== 'all' && p.rubro !== estado.rubro) return false;
    if (estado.marca !== 'all' && p.marca !== estado.marca) return false;
    if (!terms.length) return true;
    const rub = RUBROS.find(r => r.id === p.rubro)?.nombre || '';
    const heno = normaliza([p.nombre, p.marca, rub, p.cod, p.unidad, p.desc].join(' '));
    return terms.every(t => heno.includes(t));
  });
  if (estado.orden === 'asc') out = out.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estado.orden === 'desc') out = out.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (estado.orden === 'cod') out = out.slice().sort((a, b) => a.cod.localeCompare(b.cod));
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
  grid.innerHTML = res.slice(0, estado.visibles).map(p => cardHTML(p)).join('');
  grid.hidden = res.length === 0;
  if (vacio) vacio.hidden = res.length !== 0;
  if (vermas) vermas.hidden = res.length <= estado.visibles;
  if (count) count.textContent = `${res.length} ${res.length === 1 ? 'artículo' : 'artículos'}`;

  const activos = (estado.rubro !== 'all' ? 1 : 0) + (estado.marca !== 'all' ? 1 : 0) + (estado.q.trim() ? 1 : 0);
  if (limpiar) limpiar.hidden = activos === 0;
  if (filN) { filN.hidden = activos === 0; filN.textContent = activos; }

  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function initCatalogo() {
  const grid = document.getElementById('cat-grid');
  const chips = document.getElementById('chips');
  const chipsMarca = document.getElementById('chips-marca');
  const q = document.getElementById('q');
  const qTop = document.getElementById('q-top');
  const orden = document.getElementById('orden');
  const vermas = document.getElementById('vermas');
  const limpiar = document.getElementById('limpiar');
  const vacioLimpiar = document.getElementById('vacio-limpiar');
  const det = document.getElementById('filtros-mas');
  if (!grid) return;

  if (chips) {
    chips.innerHTML = [{ id: 'all', nombre: 'Todos los rubros' }, ...RUBROS]
      .map(r => `<button type="button" class="chip" data-chip="${r.id}" aria-pressed="${r.id === 'all'}">${esc(r.nombre)}</button>`).join('');
    chips.addEventListener('click', e => {
      const b = e.target.closest('[data-chip]');
      if (!b) return;
      estado.rubro = b.dataset.chip; estado.visibles = PASO;
      chips.querySelectorAll('[data-chip]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      pintarCatalogo();
    });
  }
  if (chipsMarca) {
    chipsMarca.innerHTML = ['all', ...MARCAS]
      .map(m => `<button type="button" class="chip" data-marca="${m}" aria-pressed="${m === 'all'}">${m === 'all' ? 'Todas' : esc(m)}</button>`).join('');
    chipsMarca.addEventListener('click', e => {
      const b = e.target.closest('[data-marca]');
      if (!b) return;
      estado.marca = b.dataset.marca; estado.visibles = PASO;
      chipsMarca.querySelectorAll('[data-marca]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      pintarCatalogo();
    });
  }
  const sincronizarBusqueda = (valor, otro) => {
    estado.q = valor; estado.visibles = PASO;
    if (otro && otro.value !== valor) otro.value = valor;
    pintarCatalogo();
  };
  q?.addEventListener('input', () => sincronizarBusqueda(q.value, qTop));
  qTop?.addEventListener('input', () => {
    sincronizarBusqueda(qTop.value, q);
    if (qTop.value.trim()) document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
  orden?.addEventListener('change', () => { estado.orden = orden.value; estado.visibles = PASO; pintarCatalogo(); });
  vermas?.addEventListener('click', () => { estado.visibles += PASO; pintarCatalogo(); });

  const reset = () => {
    estado.q = ''; estado.rubro = 'all'; estado.marca = 'all'; estado.orden = 'rel'; estado.visibles = PASO;
    if (q) q.value = '';
    if (qTop) qTop.value = '';
    if (orden) orden.value = 'rel';
    chips?.querySelectorAll('[data-chip]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.chip === 'all')));
    chipsMarca?.querySelectorAll('[data-marca]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.marca === 'all')));
    pintarCatalogo();
  };
  limpiar?.addEventListener('click', reset);
  vacioLimpiar?.addEventListener('click', reset);

  if (det && window.matchMedia('(min-width: 861px)').matches) det.open = true;

  bindCardEvents(grid);
  pintarCatalogo();
}

function irAlCatalogo(rubroId) {
  const chips = document.getElementById('chips');
  estado.rubro = rubroId || 'all';
  estado.visibles = PASO;
  chips?.querySelectorAll('[data-chip]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.chip === estado.rubro)));
  pintarCatalogo();
  document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function initPedido() {
  const cont = document.getElementById('pedido');
  const lista = document.getElementById('ped-lista');
  const titulo = document.getElementById('ped-titulo');
  const ver = document.getElementById('ped-ver');
  if (!cont || !lista) return;
  const sel = {};

  const puntaje = p => Object.values(sel).reduce((s, v) => s + (p.perfil.includes(v) ? 1 : 0), 0);
  const porque = p => {
    const tags = Object.values(sel).filter(v => p.perfil.includes(v));
    if (!tags.length) return 'De los que más rotan en cualquier mostrador';
    return 'Elegido por: ' + tags.map(t => NEGOCIOS[t] || MOMENTOS[t]).join(' + ');
  };

  const render = () => {
    const elegidos = PRODUCTOS
      .map(p => ({ p, n: puntaje(p) }))
      .sort((a, b) => b.n - a.n || a.p.id - b.p.id)
      .slice(0, 3);

    const previos = new Map([...lista.querySelectorAll('[data-ped-id]')]
      .map(el => [el.dataset.pedId, el.getBoundingClientRect()]));

    lista.innerHTML = elegidos.map(({ p }) => `
      <div class="ped-i" data-ped-id="${p.id}">
        <span class="ped-i-media"><img src="images/${esc(p.img)}" width="800" height="1000" alt="${esc(p.nombre)}"></span>
        <div>
          <p class="ped-i-nom">${esc(p.nombre)}</p>
          <p class="ped-i-por">${esc(porque(p))}</p>
        </div>
        <div class="ped-i-right">
          <span class="ped-i-precio">${formatearPrecio(precioFinal(p))}</span>
          <button type="button" class="ped-add" data-ped-add="${p.id}">Agregar al pedido</button>
        </div>
      </div>`).join('');

    const neg = sel.negocio ? NEGOCIOS[sel.negocio] : null;
    const mom = sel.momento ? MOMENTOS[sel.momento] : null;
    if (titulo) {
      titulo.textContent = !neg && !mom
        ? 'Lo que más se lleva, en general'
        : `Para ${neg || 'tu negocio'}${mom ? ', en ' + mom : ''}`;
    }
    if (ver) {
      const rub = RUBROS.find(r => r.id === elegidos[0]?.p.rubro);
      const nRub = rub ? PRODUCTOS.filter(x => x.rubro === rub.id).length : 0;
      ver.textContent = rub ? `Ver los ${nRub} artículos de ${rub.nombre}` : 'Ver la lista completa';
      ver.dataset.rubro = rub?.id || 'all';
    }

    if (reduceMotion) return;
    lista.querySelectorAll('[data-ped-id]').forEach(el => {
      const antes = previos.get(el.dataset.pedId);
      if (!antes) {
        el.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
          { duration: 220, easing: 'cubic-bezier(0.23,1,0.32,1)' });
        return;
      }
      const ahora = el.getBoundingClientRect();
      const dy = antes.top - ahora.top;
      if (!dy) return;
      el.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }],
        { duration: 260, easing: 'cubic-bezier(0.23,1,0.32,1)' });
    });
  };

  cont.querySelectorAll('.ped-chip').forEach(chip => chip.addEventListener('click', () => {
    const q = chip.closest('.ped-q');
    const key = q.dataset.key;
    const ya = sel[key] === chip.dataset.val;
    q.querySelectorAll('.ped-chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
    if (ya) delete sel[key];
    else { sel[key] = chip.dataset.val; chip.setAttribute('aria-pressed', 'true'); }
    render();
  }));

  lista.addEventListener('click', e => {
    const b = e.target.closest('[data-ped-add]');
    if (!b) return;
    const p = getProducto(Number(b.dataset.pedAdd));
    if (!p) return;
    Cart.add(p, 1);
    showToast(`${p.nombre} sumado al pedido`);
  });

  ver?.addEventListener('click', e => { e.preventDefault(); irAlCatalogo(ver.dataset.rubro); });
  render();
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
      <span class="cod">COD 000</span>
      <h3>Todavía no cargaste ningún artículo</h3>
      <p>Entrá por rubro o mirá lo que se repite en cada pedido.</p>
      <button type="button" class="btn btn-cta" data-cerrar-drawer>Ver la lista</button>
    </div>`;
    if (foot) foot.hidden = true;
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<div class="ci" data-ci="${p.id}">
      <div class="ci-media"><img src="images/${esc(p.img)}" width="800" height="1000" alt="${esc(p.nombre)}"></div>
      <div>
        <h3 class="ci-nom">${esc(p.nombre)}</h3>
        <p class="ci-uni">${esc(p.cod)} · ${esc(p.unidad)}</p>
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
      return p ? `• ${p.cod} — ${i.qty} × ${p.nombre} (${p.unidad}) — ${formatearPrecio(precioFinal(p) * i.qty)}` : '';
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
    const f = [...drawer.querySelectorAll('button, a[href], input, select, textarea')].filter(x => x.offsetParent !== null);
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
  const rub = RUBROS.find(r => r.id === p.rubro)?.nombre || '';
  const fin = precioFinal(p);
  const precios = p.descuento > 0
    ? `<span class="modal-precio art-precio-off">${formatearPrecio(fin)}</span><s>${formatearPrecio(p.precio)}</s><span class="modal-badge">-${p.descuento}%</span>`
    : `<span class="modal-precio">${formatearPrecio(fin)}</span>`;
  const rel = PRODUCTOS.filter(x => x.rubro === p.rubro && x.id !== p.id).slice(0, 3);
  cont.innerHTML = `
    <div class="modal-media"><img src="images/${esc(p.img)}" width="800" height="1000" alt="${esc(p.nombre)}"></div>
    <div class="modal-body" data-qty="1">
      <p class="eyebrow">${esc(rub)}</p>
      <h3 id="modal-nombre">${esc(p.nombre)}</h3>
      <p class="modal-marca">${esc(p.marca)} · COD ${esc(p.cod)}</p>
      <p class="modal-desc">${esc(p.desc)}</p>
      <dl class="modal-dl">
        <div><dt>Unidad de venta</dt><dd>${esc(p.unidad)}</dd></div>
        <div><dt>Bulto cerrado</dt><dd>${esc(p.bulto)}</dd></div>
        <div><dt>Código</dt><dd>${esc(p.cod)}</dd></div>
        <div><dt>Marca</dt><dd>${esc(p.marca)}</dd></div>
      </dl>
      <div class="modal-precios">${precios}</div>
      <div class="modal-acts">
        <div class="stepper">
          <button type="button" data-mstep="-1" aria-label="Quitar una unidad">−</button>
          <output data-mout>1</output>
          <button type="button" data-mstep="1" aria-label="Sumar una unidad">+</button>
        </div>
        <button type="button" class="btn btn-cta" data-madd="${p.id}">Agregar al pedido</button>
        <button type="button" class="btn btn-ghost" data-mbuy="${p.id}">Comprar ahora</button>
      </div>
      ${rel.length ? `<div class="modal-rel">
        <h4>Del mismo rubro</h4>
        <div class="rel-list">${rel.map(r => `<button type="button" class="rel-i" data-rel="${r.id}">
          <span class="rel-media"><img src="images/${esc(r.img)}" width="800" height="1000" alt="${esc(r.nombre)}"></span>
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
  bd.addEventListener('click', e => {
    if (e.target === bd) { cerrarModal(); return; }
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
    const header = document.querySelector('.top');
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
  tl.from('.hero-in > *', { y: 24, opacity: 0, duration: .85, stagger: .085 })
    .from('.hero-media img', { scale: 1.09, duration: 1.5, ease: 'power2.out' }, 0)
    .from('.cod-seam', { y: 12, opacity: 0, duration: .6 }, .8);

  const limpiarHero = () => {
    if (tl.progress() < 1) tl.progress(1);
    tl.kill();
    gsap.set(['.hero-in > *', '.hero-media img', '.cod-seam'], { clearProps: 'all' });
  };
  tl.eventCallback('onComplete', limpiarHero);
  setTimeout(limpiarHero, 2400);
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
    '@id': 'https://gokywebs.com/demo/distribuidoralionel/#negocio',
    name: 'Distribuidora Lionel',
    description: 'Distribuidora mayorista de artículos de librería: marcadores, gel, resaltadores, lápices, pinceles, carpetas y oficina.',
    telephone: '+5491158296005',
    email: 'hola@distribuidoralionel.com',
    priceRange: '$$',
    areaServed: { '@type': 'Country', name: 'Argentina' },
    address: { '@type': 'PostalAddress', addressCountry: 'AR' },
    image: 'https://gokywebs.com/demo/distribuidoralionel/images/hero-pared.webp',
  }];
  PRODUCTOS.forEach(p => graph.push({
    '@type': 'Product',
    name: p.nombre,
    sku: p.cod,
    description: p.desc,
    category: RUBROS.find(r => r.id === p.rubro)?.nombre || '',
    image: `https://gokywebs.com/demo/distribuidoralionel/images/${p.img}`,
    brand: { '@type': 'Brand', name: p.marca },
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

initRubros();
initRail();
initCatalogo();
initPedido();
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
