document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492914468893';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const OFF = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;

const CATEGORIAS = {
  mesa: 'Mesa y cocina',
  blanco: 'Descanso y blanco',
  deco: 'Deco y regalos',
  campo: 'Campo y cuero'
};

const PRODUCTOS = [
  { id: 'm1', nombre: 'Bowl de cerámica esmaltada', cat: 'mesa', rubro: 'Bazar', precio: 8900, descuento: 0, nuevo: true, stock: 24,
    foto: 'images/p-platos.webp', medida: '16 cm de diámetro', material: 'Cerámica esmaltada',
    desc: 'El bowl blanco que se usa para todo: la ensalada, el desayuno o el cuenco de la mesa. Apilable, esmaltado parejo, sin decoración que pase de moda.' },
  { id: 'm2', nombre: 'Jarro enlozado blanco', cat: 'mesa', rubro: 'Bazar', precio: 6400, descuento: 0, stock: 40,
    foto: 'images/p-jarro.webp', medida: '350 ml', material: 'Chapa enlozada con borde reforzado',
    desc: 'El clásico del bazar y del fogón. Va del desayuno en casa al mate de la mañana afuera sin quejarse, y el borde reforzado aguanta los golpes del viaje.' },
  { id: 'm3', nombre: 'Cafetera italiana 6 pocillos', cat: 'mesa', rubro: 'Bazar', precio: 34500, descuento: 0, stock: 12,
    foto: 'images/p-cafetera.webp', medida: '6 pocillos', material: 'Aluminio con mango termorresistente',
    desc: 'Café de verdad en la hornalla, sin filtros ni cápsulas. La de seis pocillos es la que se lleva la mayoría: alcanza para la mesa del domingo.' },
  { id: 'm4', nombre: 'Juego de 4 platos playos', cat: 'mesa', rubro: 'Bazar', precio: 28900, descuento: 15, stock: 9,
    foto: null, fotoEsperada: 'images/p-platos-playos.webp', medida: '26 cm cada uno', material: 'Gres esmaltado',
    desc: 'Cuatro platos playos de gres que combinan con los bowls y con las jarras. Pensados para usar todos los días, no para guardar en la vitrina.' },
  { id: 'm5', nombre: 'Tabla de algarrobo 40 cm', cat: 'mesa', rubro: 'Bazar', precio: 19800, descuento: 0, stock: 15,
    foto: null, fotoEsperada: 'images/p-tabla.webp', medida: '40 × 22 cm', material: 'Algarrobo macizo con aceite natural',
    desc: 'Tabla maciza de algarrobo con veta a la vista. Sirve para cortar, para llevar la picada a la mesa y para apoyar la olla caliente.' },

  { id: 'b1', nombre: 'Juego de toallas de algodón peinado', cat: 'blanco', rubro: 'Blanco', precio: 31500, descuento: 0, stock: 18,
    foto: 'images/p-toallas.webp', medida: 'Toalla 70 × 140 + toallón', material: 'Algodón peinado 500 g/m²',
    desc: 'Dos piezas de algodón peinado que secan de verdad y no sueltan pelusa a la segunda lavada. El blanco que aguanta el uso diario.' },
  { id: 'b2', nombre: 'Manta de lana tejida', cat: 'blanco', rubro: 'Blanco', precio: 46900, descuento: 0, nuevo: true, stock: 11,
    foto: 'images/p-manta.webp', medida: '130 × 180 cm', material: 'Lana con mezcla de algodón',
    desc: 'La manta que termina siempre en el respaldo del sillón y, cuando arranca el frío, en la carpa. Tejido tupido, tonos crudo y arena.' },
  { id: 'b3', nombre: 'Juego de sábanas 2 plazas', cat: 'blanco', rubro: 'Blanco', precio: 52400, descuento: 10, stock: 14,
    foto: null, fotoEsperada: 'images/p-sabanas.webp', medida: '2 plazas · 200 hilos', material: 'Algodón y poliéster',
    desc: 'Juego completo de dos plazas: ajustable, encimera y dos fundas. Doscientos hilos, que es el punto donde el precio y la duración se cruzan bien.' },
  { id: 'b4', nombre: 'Repasadores de lino x3', cat: 'blanco', rubro: 'Blanco', precio: 12900, descuento: 0, stock: 26,
    foto: null, fotoEsperada: 'images/p-repasadores.webp', medida: '45 × 70 cm cada uno', material: 'Lino con orillo a cuadros',
    desc: 'Tres repasadores de lino con orillo a cuadros. Sirven en la cocina, como mantel corto de la mesa chica o para envolver el pan.' },

  { id: 'd1', nombre: 'Vela aromática en frasco ámbar', cat: 'deco', rubro: 'Regalería', precio: 9800, descuento: 0, stock: 33,
    foto: 'images/p-vela.webp', medida: '220 g · 40 horas', material: 'Cera de soja con mecha de algodón',
    desc: 'Cera de soja en frasco ámbar con tapa. Cuarenta horas de encendido y el frasco queda: mucha gente lo reusa como portalápices o florerito.' },
  { id: 'd2', nombre: 'Canasto de fibra natural', cat: 'deco', rubro: 'Deco', precio: 23600, descuento: 0, stock: 16,
    foto: 'images/p-canastos.webp', medida: '34 × 28 cm', material: 'Fibra natural con forro de algodón',
    desc: 'Canasto tejido con forro interior de algodón. Lo compran para las mantas del living, para la ropa del baño y para ordenar los juguetes.' },
  { id: 'd3', nombre: 'Difusor de varillas 250 ml', cat: 'deco', rubro: 'Regalería', precio: 16900, descuento: 0, stock: 21,
    foto: null, fotoEsperada: 'images/p-difusor.webp', medida: '250 ml · 8 varillas', material: 'Esencia en base alcohólica',
    desc: 'Difusor de 250 ml con ocho varillas de rattan. Dura alrededor de tres meses y es el regalo que se resuelve en dos minutos.' },
  { id: 'd4', nombre: 'Florero de gres', cat: 'deco', rubro: 'Deco', precio: 21400, descuento: 0, stock: 13,
    foto: null, fotoEsperada: 'images/p-florero.webp', medida: '24 cm de alto', material: 'Gres con esmalte mate',
    desc: 'Florero alto de gres con esmalte mate. Queda bien con flores secas, con una rama de olivo o vacío arriba de la mesa.' },

  { id: 'c1', nombre: 'Set matero completo', cat: 'campo', rubro: 'Regalería', precio: 57900, descuento: 0, stock: 10,
    foto: 'images/p-mate.webp', medida: 'Mate + bombilla + termo 1 L', material: 'Mate forrado en cuero y termo de acero',
    desc: 'Mate forrado en cuero, bombilla de acero y termo de un litro. Es el regalo que más sale del local: sirve para estrenar y para quedar bien.' },
  { id: 'c2', nombre: 'Farol a vela', cat: 'campo', rubro: 'Camping', precio: 18300, descuento: 0, stock: 19,
    foto: 'images/p-farol.webp', medida: '26 cm de alto', material: 'Chapa y vidrio con asa rebatible',
    desc: 'Farol de chapa y vidrio con asa rebatible. Se cuelga de la rama o se apoya en la mesa; de día también queda bien en el estante.' },
  { id: 'c3', nombre: 'Bolso de cuero', cat: 'campo', rubro: 'Marroquinería', precio: 124000, descuento: 0, stock: 5,
    foto: 'images/p-bolso.webp', medida: '38 × 30 cm', material: 'Cuero vacuno con costura reforzada',
    desc: 'Cuero vacuno entero, costura reforzada y manija doble. Es de las piezas que se marcan con el uso y quedan mejor con los años.' },
  { id: 'c4', nombre: 'Conservadora 28 L', cat: 'campo', rubro: 'Camping', precio: 67500, descuento: 0, stock: 8,
    foto: null, fotoEsperada: 'images/p-conservadora.webp', medida: '28 litros', material: 'Polipropileno con aislación inyectada',
    desc: 'Veintiocho litros: la medida que entra en el baúl y alcanza para un día de río con cuatro. Tapa con traba y manija rebatible.' },
  { id: 'c5', nombre: 'Silla plegable de lona', cat: 'campo', rubro: 'Camping', precio: 42900, descuento: 0, stock: 22,
    foto: null, fotoEsperada: 'images/p-silla.webp', medida: 'Hasta 110 kg', material: 'Caño reforzado y lona resistente',
    desc: 'Plegable, con caño reforzado y lona que aguanta el sol. Se cierra de un movimiento y entra parada en el baúl.' }
];

const DESTACADOS = ['m1', 'b2', 'd1', 'c1', 'c3', 'm3'];
const ESCENA_PIEZAS = ['m5', 'm2', 'm1', 'b4'];
const ESCENA_PUNTOS = [[17, 25], [27, 45], [50, 64], [19, 84]];

/* ============================ CARRITO ============================ */
const Cart = {
  KEY: 'todocampo_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch {} document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    if (!producto) return;
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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

/* ============================ PIEZAS DE UI ============================ */
function fotoHTML(p, lazy) {
  if (p.foto) return `<img src="${p.foto}" alt="${esc(p.nombre)}" width="1200" height="1200"${lazy ? ' loading="lazy"' : ''}>`;
  return `<span class="placa" data-foto-esperada="${esc(p.fotoEsperada || '')}"><span aria-hidden="true">${esc(p.nombre.trim().charAt(0))}</span></span>`;
}

function preciosHTML(p) {
  if (p.descuento > 0) {
    return `<div class="prod__precios"><span class="prod__precio prod__precio--off">${formatearPrecio(precioFinal(p))}</span><s>${formatearPrecio(p.precio)}</s></div>`;
  }
  return `<div class="prod__precios"><span class="prod__precio">${formatearPrecio(p.precio)}</span></div>`;
}

function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.nuevo) b.push('<span class="badge badge--nuevo">Nuevo</span>');
  if (p.stock <= 6) b.push('<span class="badge">Últimas unidades</span>');
  return b.length ? `<div class="prod__badges">${b.join('')}</div>` : '';
}

/* ============================ RAIL DE DESTACADOS ============================ */
function renderRail() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  track.innerHTML = DESTACADOS.map((id, i) => {
    const p = getProducto(id);
    if (!p) return '';
    return `<article class="rail-card cascada" style="--i:${i}">
      <button type="button" class="rail-card__foto" data-abrir="${p.id}" aria-label="Ver ${esc(p.nombre)}">${fotoHTML(p, false)}</button>
      <div class="rail-card__cuerpo">
        <span class="rail-card__rubro">${esc(CATEGORIAS[p.cat])}</span>
        <span class="rail-card__nombre">${esc(p.nombre)}</span>
        <span class="rail-card__precio">${formatearPrecio(precioFinal(p))}</span>
      </div>
    </article>`;
  }).join('');
}

function initRailDrag() {
  const vp = document.getElementById('railVp');
  const track = document.getElementById('railTrack');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!vp || !track) return;

  let down = false, moved = false, startX = 0, startScroll = 0, pointerId = null;

  const end = () => {
    if (!down) return;
    down = false;
    if (pointerId !== null) { try { vp.releasePointerCapture?.(pointerId); } catch {} }
    pointerId = null;
    if (moved) { vp.classList.remove('dragging'); setTimeout(() => { moved = false; }, 0); }
  };

  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    down = true; moved = false; startX = e.clientX; startScroll = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) { moved = true; vp.classList.add('dragging'); try { vp.setPointerCapture?.(pointerId); } catch {} }
    vp.scrollLeft = startScroll - dx;
  });
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);

  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const paso = () => (vp.querySelector('.rail-card')?.getBoundingClientRect().width || 280) + 16;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

/* ============================ CATÁLOGO ============================ */
const estado = { q: '', cats: [], rubros: [], precios: [], orden: 'destacados', visibles: 16 };
const PASO_CATALOGO = 16;

function filtrados() {
  const q = normalizar(estado.q).split(/\s+/).filter(Boolean);
  let lista = PRODUCTOS.filter(p => {
    if (estado.cats.length && !estado.cats.includes(p.cat)) return false;
    if (estado.rubros.length && !estado.rubros.includes(p.rubro)) return false;
    if (estado.precios.length) {
      const v = precioFinal(p);
      const entra = estado.precios.some(r => { const [a, b] = r.split('-').map(Number); return v >= a && v <= b; });
      if (!entra) return false;
    }
    if (q.length) {
      const texto = normalizar([p.nombre, p.rubro, CATEGORIAS[p.cat], p.desc, p.material, p.medida].join(' '));
      if (!q.every(t => texto.includes(t))) return false;
    }
    return true;
  });
  if (estado.orden === 'precio-asc') lista.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estado.orden === 'precio-desc') lista.sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (estado.orden === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return lista;
}

function renderCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  const vacio = document.getElementById('sinResultados');
  const verMas = document.getElementById('verMas');
  const contador = document.getElementById('contador');
  if (!grid) return;

  const lista = filtrados();
  if (contador) contador.textContent = lista.length;
  const muestra = lista.slice(0, estado.visibles);

  grid.innerHTML = muestra.map((p, i) => `<div class="prod cascada" style="--i:${i % PASO_CATALOGO}" data-id="${p.id}">
      <button type="button" class="prod__foto" data-abrir="${p.id}" aria-label="Ver ${esc(p.nombre)}">
        ${fotoHTML(p, i > 5)}${badgesHTML(p)}
        <span class="prod__lupa">Ver detalle</span>
      </button>
      <div class="prod__cuerpo">
        <span class="prod__rubro">${esc(p.rubro)}</span>
        <h3 class="prod__nombre">${esc(p.nombre)}</h3>
        ${preciosHTML(p)}
        <div class="prod__actions prod-actions">
          <span class="stepper">
            <button type="button" data-step="-1" data-id="${p.id}" aria-label="Quitar uno">&minus;</button>
            <output data-qty="${p.id}">1</output>
            <button type="button" data-step="1" data-id="${p.id}" aria-label="Sumar uno">+</button>
          </span>
          <button type="button" class="btn btn-cta btn-sm prod-add" data-add="${p.id}">Agregar al carrito</button>
        </div>
      </div>
    </div>`).join('');

  if (vacio) vacio.hidden = lista.length !== 0;
  grid.hidden = lista.length === 0;
  if (verMas) verMas.closest('.vermas-wrap').hidden = lista.length <= estado.visibles;
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function leerFiltros() {
  const val = g => [...document.querySelectorAll(`input[data-f="${g}"]:checked`)].map(i => i.value);
  estado.cats = val('cat'); estado.rubros = val('rubro'); estado.precios = val('precio');
  estado.visibles = PASO_CATALOGO;
  renderCatalogo();
}

function filtrarPorCategoria(cat) {
  document.querySelectorAll('input[data-f]').forEach(i => { i.checked = false; });
  const chk = document.querySelector(`input[data-f="cat"][value="${cat}"]`);
  if (chk) chk.checked = true;
  const buscador = document.getElementById('buscador');
  if (buscador) buscador.value = '';
  estado.q = '';
  leerFiltros();
  const destino = document.getElementById('tienda');
  if (destino) {
    const y = destino.getBoundingClientRect().top + window.scrollY - OFF() - 8;
    window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  showToast(`Filtrado por ${CATEGORIAS[cat]}`);
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;

  document.querySelectorAll('input[data-f]').forEach(i => i.addEventListener('change', leerFiltros));

  const buscador = document.getElementById('buscador');
  const form = document.getElementById('buscadorForm');
  let t;
  buscador?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { estado.q = buscador.value; estado.visibles = PASO_CATALOGO; renderCatalogo(); }, 180);
  });
  form?.addEventListener('submit', e => {
    e.preventDefault();
    estado.q = buscador?.value || ''; estado.visibles = PASO_CATALOGO; renderCatalogo();
    buscador?.blur();
  });

  document.getElementById('orden')?.addEventListener('change', e => { estado.orden = e.target.value; renderCatalogo(); });
  document.getElementById('verMas')?.addEventListener('click', () => { estado.visibles += PASO_CATALOGO; renderCatalogo(); });
  document.getElementById('limpiarFiltros')?.addEventListener('click', () => {
    document.querySelectorAll('input[data-f]').forEach(i => { i.checked = false; });
    if (buscador) buscador.value = '';
    estado.q = ''; leerFiltros();
    showToast('Listo, mostramos todo de nuevo');
  });
  document.getElementById('verTodoVacio')?.addEventListener('click', () => {
    document.querySelectorAll('input[data-f]').forEach(i => { i.checked = false; });
    if (buscador) buscador.value = '';
    estado.q = ''; leerFiltros();
  });

  const toggle = document.getElementById('filtrosToggle');
  const panel = document.getElementById('filtros');
  toggle?.addEventListener('click', () => {
    const abierto = panel.classList.toggle('abierto');
    toggle.setAttribute('aria-expanded', String(abierto));
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });

  document.getElementById('btnBuscarHeader')?.addEventListener('click', () => {
    const destino = document.getElementById('tienda');
    if (!destino) return;
    const y = destino.getBoundingClientRect().top + window.scrollY - OFF() - 8;
    window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(() => document.getElementById('buscador')?.focus(), reduceMotion ? 0 : 600);
  });

  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const out = document.querySelector(`output[data-qty="${step.dataset.id}"]`);
      if (out) {
        const p = getProducto(step.dataset.id);
        const n = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(step.dataset.step), p?.stock ?? 99));
        out.textContent = n;
      }
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      const out = document.querySelector(`output[data-qty="${add.dataset.add}"]`);
      const qty = out ? (parseInt(out.textContent, 10) || 1) : 1;
      Cart.add(p, qty);
      showToast(`${p.nombre} va al carrito`);
      return;
    }
    const abrir = e.target.closest('[data-abrir]');
    if (abrir) { abrirModal(abrir.dataset.abrir); return; }
    const cat = e.target.closest('[data-cat]');
    if (cat && cat.dataset.cat && CATEGORIAS[cat.dataset.cat]) { filtrarPorCategoria(cat.dataset.cat); }
  });

  renderCatalogo();
}

/* ============================ VISTA RÁPIDA ============================ */
let ultimoFoco = null;

function abrirModal(id) {
  const p = getProducto(id);
  const modal = document.getElementById('modal');
  const caja = document.getElementById('modalCaja');
  const bd = document.getElementById('modalBackdrop');
  if (!p || !modal || !caja) return;

  const relacionados = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  caja.innerHTML = `
    <button type="button" class="modal__cerrar" id="modalCerrar" aria-label="Cerrar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    <div class="modal__grid">
      <div class="modal__foto">${fotoHTML(p, false)}${badgesHTML(p)}</div>
      <div class="modal__cuerpo">
        <span class="prod__rubro">${esc(CATEGORIAS[p.cat])} · ${esc(p.rubro)}</span>
        <h3>${esc(p.nombre)}</h3>
        <div class="modal__precios">
          <span class="modal__precio">${formatearPrecio(precioFinal(p))}</span>
          ${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s><span class="badge badge--off">-${p.descuento}%</span>` : ''}
        </div>
        <p class="modal__desc">${esc(p.desc)}</p>
        <ul class="modal__ficha">
          <li><span>Medida</span><b>${esc(p.medida)}</b></li>
          <li><span>Material</span><b>${esc(p.material)}</b></li>
          <li><span>En el local</span><b>${p.stock} unidades</b></li>
        </ul>
        <div class="modal__actions">
          <span class="stepper">
            <button type="button" data-step="-1" data-id="${p.id}" aria-label="Quitar uno">&minus;</button>
            <output data-qty="${p.id}">1</output>
            <button type="button" data-step="1" data-id="${p.id}" aria-label="Sumar uno">+</button>
          </span>
          <button type="button" class="btn btn-cta btn-sm" data-add="${p.id}">Agregar al carrito</button>
          <button type="button" class="btn btn-ghost btn-sm" id="modalComprar">Comprar ahora</button>
        </div>
      </div>
    </div>
    ${relacionados.length ? `<div class="modal__relacionados">
      <h4>También te puede interesar</h4>
      <div class="rel-grid">${relacionados.map(r => `<button type="button" class="rel-card" data-abrir="${r.id}">
        <span class="rel-card__foto">${fotoHTML(r, true)}</span>
        <b>${esc(r.nombre)}</b><span>${formatearPrecio(precioFinal(r))}</span>
      </button>`).join('')}</div>
    </div>` : ''}`;

  ultimoFoco = document.activeElement;
  modal.classList.add('abierto'); bd?.classList.add('abierto');
  modal.removeAttribute('inert');
  document.body.classList.add('no-scroll');
  document.getElementById('modalCerrar')?.focus();

  document.getElementById('modalCerrar')?.addEventListener('click', cerrarModal);
  document.getElementById('modalComprar')?.addEventListener('click', () => {
    const out = caja.querySelector(`output[data-qty="${p.id}"]`);
    Cart.add(p, out ? (parseInt(out.textContent, 10) || 1) : 1);
    cerrarModal();
    abrirDrawer();
  });
}

function cerrarModal() {
  const modal = document.getElementById('modal');
  const bd = document.getElementById('modalBackdrop');
  if (!modal || !modal.classList.contains('abierto')) return;
  modal.classList.remove('abierto'); bd?.classList.remove('abierto');
  modal.setAttribute('inert', '');
  if (!document.getElementById('drawer')?.classList.contains('abierto')) document.body.classList.remove('no-scroll');
  ultimoFoco?.focus?.();
}

/* ============================ DRAWER ============================ */
function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  const total = document.getElementById('drawerTotal');
  if (!body) return;
  const items = Cart.get();

  if (!items.length) {
    body.innerHTML = `<div class="carrito-vacio">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.3"/><circle cx="17.5" cy="20" r="1.3"/></svg>
      <p>Todavía no pusiste nada adentro. Arrancá por el catálogo: en el estante hay de todo.</p>
      <button type="button" class="btn btn-ghost btn-sm" id="drawerAlCatalogo" style="margin-top:1rem">Ir al catálogo</button>
    </div>`;
    if (foot) foot.hidden = true;
    document.getElementById('drawerAlCatalogo')?.addEventListener('click', () => {
      cerrarDrawer();
      const destino = document.getElementById('tienda');
      if (destino) window.scrollTo({ top: destino.getBoundingClientRect().top + window.scrollY - OFF() - 8, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    return;
  }

  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<div class="linea">
      <span class="linea__foto">${fotoHTML(p, true)}</span>
      <div class="linea__txt">
        <b>${esc(p.nombre)}</b>
        <span>${formatearPrecio(precioFinal(p))} c/u · ${formatearPrecio(precioFinal(p) * i.qty)}</span>
        <span class="stepper">
          <button type="button" data-linea="-1" data-id="${p.id}" aria-label="Quitar uno de ${esc(p.nombre)}">&minus;</button>
          <output>${i.qty}</output>
          <button type="button" data-linea="1" data-id="${p.id}" aria-label="Sumar uno de ${esc(p.nombre)}">+</button>
        </span>
      </div>
      <button type="button" class="linea__quitar" data-quitar="${p.id}" aria-label="Quitar ${esc(p.nombre)} del carrito">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13"/></svg>
      </button>
    </div>`;
  }).join('');
  if (foot) foot.hidden = false;
  if (total) total.textContent = formatearPrecio(Cart.total());
}

function abrirDrawer() {
  const d = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!d) return;
  ultimoFoco = document.activeElement;
  d.classList.add('abierto'); bd?.classList.add('abierto');
  d.removeAttribute('inert');
  document.body.classList.add('no-scroll');
  document.getElementById('drawerCerrar')?.focus();
}
function cerrarDrawer() {
  const d = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!d || !d.classList.contains('abierto')) return;
  d.classList.remove('abierto'); bd?.classList.remove('abierto');
  d.setAttribute('inert', '');
  if (!document.getElementById('modal')?.classList.contains('abierto')) document.body.classList.remove('no-scroll');
  ultimoFoco?.focus?.();
}

function initDrawer() {
  document.getElementById('btnCarritoHeader')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerCerrar')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarDrawer);
  document.getElementById('modalBackdrop')?.addEventListener('click', cerrarModal);
  document.getElementById('finalizar')?.addEventListener('click', () => {
    const items = Cart.get();
    if (!items.length) return;
    const lineas = items.map(item => {
      const p = getProducto(item.id);
      return p ? `• ${item.qty}x ${p.nombre} — ${formatearPrecio(precioFinal(p) * item.qty)}` : '';
    }).filter(Boolean);
    const mensaje = [
      'Hola Todo Campo, quiero consultar por este pedido:',
      '',
      ...lineas,
      '',
      `Total estimado: ${formatearPrecio(Cart.total())}`
    ].join('\n');
    window.open(`https://wa.me/${WSP}?text=${encodeURIComponent(mensaje)}`, '_blank', 'noopener');
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (document.getElementById('modal')?.classList.contains('abierto')) cerrarModal();
    else if (document.getElementById('drawer')?.classList.contains('abierto')) cerrarDrawer();
  });

  document.addEventListener('click', e => {
    const linea = e.target.closest('[data-linea]');
    if (linea) {
      const actual = Cart.get().find(i => i.id === linea.dataset.id)?.qty || 1;
      const nueva = actual + Number(linea.dataset.linea);
      if (nueva < 1) Cart.remove(linea.dataset.id); else Cart.setQty(linea.dataset.id, nueva);
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) Cart.remove(quitar.dataset.quitar);
  });

  document.addEventListener('cart:updated', renderDrawer);
  renderDrawer();
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

/* ============================ COMPONENTE: LA LISTA DEL FINDE ============================ */
function armarLista(personas, noches, fuego) {
  const piezas = [];
  const push = (id, qty, nota) => { const p = getProducto(id); if (p && qty > 0) piezas.push({ p, qty, nota }); };

  push('m2', personas, 'uno por persona');
  push('m1', personas, 'uno por persona');
  push('c5', personas, 'una por persona');
  push('c1', 1, 'para la ronda');
  push('c4', personas >= 6 ? 2 : 1, personas >= 6 ? 'dos: con seis no entra todo en una' : null);
  push('c2', noches >= 2 ? 2 : 1, noches >= 2 ? 'dos: uno para la mesa y otro para la carpa' : null);
  if (noches >= 2) push('b2', personas, 'porque a la segunda noche refresca');
  if (fuego) {
    push('m5', 1, 'para llevar la picada al fuego');
    push('b4', 1, 'para el mango caliente y las manos');
  }
  return piezas;
}

function initListaFinde() {
  const cont = document.getElementById('listaFinde');
  if (!cont) return;
  const lista = document.getElementById('lfPiezas');
  const totalEl = document.getElementById('lfTotal');
  const tituloEl = document.getElementById('lfTitulo');
  const subEl = document.getElementById('lfSub');
  const btnAdd = document.getElementById('lfAdd');
  const btnWsp = document.getElementById('lfWsp');
  let actual = [];

  const leer = n => Number(cont.querySelector(`input[name="lf-${n}"]:checked`)?.value ?? 0);

  const pintar = () => {
    const personas = leer('personas') || 4;
    const noches = leer('noches');
    const fuego = leer('fuego') === 1;
    actual = armarLista(personas, noches, fuego);

    const total = actual.reduce((s, x) => s + precioFinal(x.p) * x.qty, 0);
    const unidades = actual.reduce((s, x) => s + x.qty, 0);

    const cuando = noches === 0 ? 'por el día' : noches === 1 ? 'con una noche afuera' : 'con dos noches o más';
    tituloEl.textContent = `Salida de ${personas} ${cuando}`;
    subEl.textContent = `${actual.length} piezas del local · ${unidades} unidades${fuego ? ' · con fuego' : ''}`;

    lista.innerHTML = actual.map(x => `<li class="lf-pieza">
      <span class="lf-pieza__q">${x.qty}×</span>
      <span class="lf-pieza__n">${esc(x.p.nombre)}${x.nota ? `<em>${esc(x.nota)}</em>` : ''}</span>
      <span class="lf-pieza__p">${formatearPrecio(precioFinal(x.p) * x.qty)}</span>
    </li>`).join('');
    totalEl.textContent = formatearPrecio(total);

    const detalle = actual.map(x => `${x.qty}x ${x.p.nombre}`).join(', ');
    btnWsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(`Hola Todo Campo! Armé la lista del finde para ${personas} ${cuando}: ${detalle}. Total estimado ${formatearPrecio(total)}. ¿Tienen todo?`)}`;
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };

  cont.querySelectorAll('input[type="radio"]').forEach(i => i.addEventListener('change', pintar));
  btnAdd?.addEventListener('click', () => {
    actual.forEach(x => Cart.add(x.p, x.qty));
    showToast(`Sumamos ${actual.length} piezas al carrito`);
    abrirDrawer();
  });
  pintar();
}

/* ============================ MOMENTO PROPIO: LO QUE HAY EN ESTA MESA ============================ */
function initEscena() {
  const escena = document.getElementById('escena');
  if (!escena) return;
  const sticky = escena.querySelector('.escena-sticky');
  const fichas = document.getElementById('escenaFichas');
  const totalEl = document.getElementById('escenaTotal');
  const numEl = document.getElementById('escenaNum');
  const velo = document.getElementById('escenaVelo');
  const puntos = [...escena.querySelectorAll('.punto')];
  const piezas = ESCENA_PIEZAS.map(getProducto).filter(Boolean);
  if (!sticky || !fichas || !piezas.length) return;

  fichas.innerHTML = piezas.map((p, i) => `<li class="ficha" data-ficha="${i}">
    <span class="ficha__n">0${i + 1}</span>
    <span class="ficha__txt"><b>${esc(p.nombre)}</b><span>${formatearPrecio(precioFinal(p))}</span></span>
    <button type="button" class="btn btn-ghost btn-sm" data-add="${p.id}">Sumar</button>
  </li>`).join('');

  const items = [...fichas.querySelectorAll('.ficha')];
  const TOTAL = piezas.length;
  const TRAMO = 1 / TOTAL;
  let ultimo = -1;

  const aplicar = activo => {
    if (activo === ultimo) return;
    ultimo = activo;
    puntos.forEach((pt, i) => { pt.classList.toggle('on', i <= activo); pt.classList.toggle('actual', i === activo); });
    items.forEach((el, i) => { el.classList.toggle('on', i <= activo); el.classList.toggle('actual', i === activo); });
    const acumulado = piezas.slice(0, activo + 1).reduce((s, p) => s + precioFinal(p), 0);
    if (totalEl) totalEl.textContent = formatearPrecio(acumulado);
    if (numEl) numEl.innerHTML = `0${activo + 1}<small>/0${TOTAL}</small>`;
    const foco = ESCENA_PUNTOS[activo];
    if (velo && foco) velo.style.background = `radial-gradient(circle at ${foco[0]}% ${foco[1]}%, rgba(255,233,204,0) 0%, rgba(20,17,13,.08) 30%, rgba(20,17,13,.46) 100%)`;
  };

  const medir = () => {
    const recorrido = escena.offsetHeight - sticky.offsetHeight;
    if (recorrido <= 0) { aplicar(TOTAL - 1); return; }
    const p = Math.min(1, Math.max(0, (OFF() - escena.getBoundingClientRect().top) / recorrido));
    aplicar(Math.min(TOTAL - 1, Math.floor(p / TRAMO)));
  };

  const onScroll = () => medir();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('load', medir);
  medir();

  document.getElementById('escenaAddTodo')?.addEventListener('click', () => {
    piezas.forEach(p => Cart.add(p, 1));
    showToast('La mesa entera va al carrito');
    abrirDrawer();
  });
}

/* ============================ NAV ============================ */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div'); bd.className = 'nav-backdrop';
    (document.querySelector('.site-header') || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 881px)');
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

/* ============================ REVEALS ============================ */
function initReveals() {
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

/* ============================ HERO ============================ */
function initHero() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  const fondo = document.querySelector('.hero-full__media img');
  if (fondo) tl.fromTo(fondo, { scale: 1.07 }, { scale: 1, duration: 1.4 }, 0);
  const foto = document.querySelector('.hero-split__media .foto');
  if (foto) tl.fromTo(foto, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.1 }, 0);
  const sello = document.querySelector('.hero-full__sello, .hero-split__sello');
  if (sello) tl.fromTo(sello, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .8 }, .15);
  const h1 = document.querySelector('h1');
  if (h1) tl.fromTo(h1, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .9 }, .28);
  const kicker = document.querySelector('.hero-kicker');
  if (kicker) tl.fromTo(kicker, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .8 }, .4);
  const ctas = document.querySelectorAll('.hero-ctas > *');
  if (ctas.length) tl.fromTo(ctas, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .09 }, .5);
}

/* ============================ ARRANQUE ============================ */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('cart:updated', updateCartBadge);

initNav();
renderRail();
initRailDrag();
initCatalogo();
initDrawer();
initFloats();
initListaFinde();
initEscena();
initHero();
updateCartBadge();
initReveals();
