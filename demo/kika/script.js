const WSP = '5492993244018';
const ENVIO_GRATIS_DESDE = 45000;
const PASO_VER_MAS = 8;

const CATEGORIAS = [
  { id: 'todo', nombre: 'Todo' },
  { id: 'facial', nombre: 'Facial' },
  { id: 'ampollas', nombre: 'Ampollas y activos' },
  { id: 'corporal', nombre: 'Corporal' },
  { id: 'accesorios', nombre: 'Accesorios' },
];

const LINEAS = { clinica: 'Línea Clínica', botanica: 'Línea Botánica', salon: 'Línea Salón' };

const PRODUCTOS = [
  {
    id: 'serum-ha', nombre: 'Sérum Ácido Hialurónico 2%', linea: 'clinica', categoria: 'facial',
    medida: '30 ml', precio: 18900, descuento: 0, destacado: true, badge: 'top', stock: 24,
    img: 'recorte-serum.webp', alt: 'Sérum de ácido hialurónico con gotero de vidrio',
    activo: 'Ácido hialurónico', concentracion: '2%', ph: '5,5',
    desc: 'Combina bajo y alto peso molecular: uno hidrata en profundidad y el otro forma película en superficie. Es el sérum que más se repone en salón, base de casi cualquier protocolo.',
  },
  {
    id: 'locion-botanica', nombre: 'Loción Corporal Botánica', linea: 'botanica', categoria: 'corporal',
    medida: '500 ml', precio: 17400, descuento: 0, destacado: false, badge: '', stock: 26,
    img: 'recorte-botella-verde.webp', alt: 'Dispensador verde de loción corporal botánica',
    activo: 'Caléndula + avena coloidal', concentracion: '8%', ph: '5,5',
    desc: 'Loción de absorción rápida para cerrar el masaje corporal sin dejar la camilla resbalosa. Perfume muy tenue, apta para pieles reactivas.',
  },
  {
    id: 'ampollas-vitc', nombre: 'Ampollas Vitamina C 15%', linea: 'clinica', categoria: 'ampollas',
    medida: 'caja x 10', precio: 27500, descuento: 15, destacado: true, badge: '', stock: 18,
    img: 'prod-ampollas.webp', alt: 'Ampollas de vitamina C sobre bandeja de tratamiento',
    activo: 'Ácido ascórbico', concentracion: '15%', ph: '3,2',
    desc: 'Monodosis de vidrio ámbar: cada ampolla se abre en el momento, sin oxidación previa. Para protocolos de luminosidad y manchas, siempre con fotoprotección posterior.',
  },
  {
    id: 'cepillo-silicona', nombre: 'Cepillo Facial de Silicona', linea: 'salon', categoria: 'accesorios',
    medida: 'unidad', precio: 9800, descuento: 0, destacado: false, badge: '', stock: 40,
    img: 'prod-cepillo.webp', alt: 'Cepillo facial de silicona azul',
    activo: 'Silicona grado médico', concentracion: '—', ph: '—',
    desc: 'Cerdas de silicona que se esterilizan sin deformarse, a diferencia de las de nylon. Para la limpieza previa y para vender en mostrador como home care.',
  },
  {
    id: 'crema-ceramidas', nombre: 'Crema Reparadora con Ceramidas', linea: 'clinica', categoria: 'facial',
    medida: '50 ml', precio: 22400, descuento: 0, destacado: true, badge: '', stock: 21,
    img: 'prod-crema.webp', alt: 'Tarro abierto de crema reparadora',
    activo: 'Ceramidas NP + colesterol', concentracion: '3%', ph: '5,0',
    desc: 'Restaura la barrera cutánea después de peeling, dermaplaning o cualquier procedimiento que deje la piel sensibilizada. Textura densa que no deja película grasa.',
  },
  {
    id: 'agua-micelar', nombre: 'Agua Micelar Calmante', linea: 'salon', categoria: 'facial',
    medida: '250 ml', precio: 11900, descuento: 0, destacado: false, badge: '', stock: 35,
    img: 'prod-frasco.webp', alt: 'Frasco de agua micelar calmante',
    activo: 'Agua de hamamelis', concentracion: '—', ph: '5,5',
    desc: 'Desmaquillante sin enjuague para el primer paso o para retirar producto entre etapas. Sin alcohol ni perfume, tolerada por piel con rosácea.',
  },
  {
    id: 'limpiador-enzimatico', nombre: 'Limpiador Enzimático Neutro', linea: 'salon', categoria: 'facial',
    medida: '200 ml', precio: 14500, descuento: 0, destacado: true, badge: '', stock: 32,
    img: 'prod-limpiador.webp', alt: 'Dispensador blanco de limpiador enzimático',
    activo: 'Enzimas de papaya', concentracion: '—', ph: '5,5',
    desc: 'Primer paso de todo protocolo: arrastra maquillaje y sebo sin alterar el pH. Al ser enzimático se puede usar en pieles reactivas donde el gel salicílico irrita.',
  },
  {
    id: 'ampolla-flash', nombre: 'Ampollas Flash Efecto Tensor', linea: 'clinica', categoria: 'ampollas',
    medida: 'caja x 5', precio: 16200, descuento: 0, destacado: false, badge: 'nuevo', stock: 14,
    img: 'prod-ampolla-verde.webp', alt: 'Ampolla de tratamiento flash con efecto tensor',
    activo: 'Péptidos + extracto de algas', concentracion: '4%', ph: '5,2',
    desc: 'Efecto tensor inmediato de unas horas: es la ampolla de antes del evento. Se aplica sobre piel limpia y se sella con la crema del protocolo.',
  },
  {
    id: 'tonico-niacinamida', nombre: 'Tónico Niacinamida 5%', linea: 'clinica', categoria: 'facial',
    medida: '200 ml', precio: 12800, descuento: 0, destacado: true, badge: 'nuevo', stock: 27,
    img: 'prod-tonico.webp', alt: 'Botella de tónico con niacinamida',
    activo: 'Niacinamida', concentracion: '5%', ph: '5,8',
    desc: 'Regula sebo y afina el poro sin resecar. Se aplica después de la limpieza y antes del sérum; en pieles mixtas mejora mucho la tolerancia del resto del protocolo.',
  },
  {
    id: 'aceite-corporal', nombre: 'Aceite Corporal Relajante', linea: 'botanica', categoria: 'corporal',
    medida: '250 ml', precio: 15600, descuento: 0, destacado: false, badge: '', stock: 20,
    img: 'prod-aceite.webp', alt: 'Dispensador de aceite corporal con tapa dorada',
    activo: 'Almendras dulces + lavanda', concentracion: '—', ph: '—',
    desc: 'Base de almendras con deslizamiento largo: no hay que recargar producto a mitad del masaje. Aroma a lavanda suave, sin alcohol.',
  },
  {
    id: 'aceite-rosa-mosqueta', nombre: 'Aceite Facial Rosa Mosqueta', linea: 'botanica', categoria: 'facial',
    medida: '30 ml', precio: 16900, descuento: 0, destacado: true, badge: '', stock: 15,
    img: 'prod-gotero-oro.webp', alt: 'Frasco con gotero dorado de aceite facial',
    activo: 'Rosa mosqueta primera prensada', concentracion: '100%', ph: '—',
    desc: 'Prensado en frío, sin diluir. Se usa en masaje de cierre o mezclado con la crema para pieles secas y cicatrices recientes. Envase ámbar para que no se oxide.',
  },
  {
    id: 'duo-salon', nombre: 'Duo Salón: Gel + Loción 500 ml', linea: 'salon', categoria: 'corporal',
    medida: '2 x 500 ml', precio: 43600, descuento: 20, destacado: false, badge: '', stock: 12,
    img: 'recorte-botellas.webp', alt: 'Pack de gel de limpieza y loción corporal de 500 ml',
    activo: 'Salicílico + caléndula', concentracion: '—', ph: '—',
    desc: 'Los dos formatos de 500 ml que más rotan, en un solo pedido y con precio de pack. Pensado para reposición mensual del salón.',
  },
  {
    id: 'balsamo-karite', nombre: 'Bálsamo Corporal Karité', linea: 'botanica', categoria: 'corporal',
    medida: '250 ml', precio: 19700, descuento: 10, destacado: true, badge: '', stock: 19,
    img: 'recorte-tarro.webp', alt: 'Tarro azul de bálsamo corporal de karité',
    activo: 'Manteca de karité', concentracion: '15%', ph: '—',
    desc: 'Bálsamo denso para masaje corporal y zonas de piel muy seca: codos, talones, post-depilación. Rinde muchísimo, un tarro cubre varias sesiones.',
  },
  {
    id: 'gel-limpieza-500', nombre: 'Gel de Limpieza Profunda', linea: 'salon', categoria: 'facial',
    medida: '500 ml', precio: 21300, descuento: 0, destacado: true, badge: '', stock: 22,
    img: 'recorte-botella-azul.webp', alt: 'Dispensador azul de gel de limpieza profunda',
    activo: 'Ácido salicílico', concentracion: '0,5%', ph: '4,5',
    desc: 'Formato grande para piel grasa y con tendencia acneica. El salicílico entra al folículo y desobstruye antes de la extracción.',
  },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const imgSrc = p => `images/${p.img}`;

/* Búsqueda + filtros + orden, sin tocar el DOM. 'sugerido' conserva el orden del
   array: el catálogo NO repite la misma selección ni el mismo orden que la vidriera
   de destacados de arriba. */
function filtrarProductos(lista, { q = '', cat = 'todo', linea = 'todo', orden = 'sugerido' } = {}) {
  const terminos = norm(q).trim() ? norm(q).trim().split(/\s+/) : [];
  let out = lista.filter(p => {
    if (cat !== 'todo' && p.categoria !== cat) return false;
    if (linea !== 'todo' && p.linea !== linea) return false;
    if (!terminos.length) return true;
    const blob = norm(`${p.nombre} ${p.medida} ${LINEAS[p.linea] || ''} ${p.categoria} ${p.activo} ${p.desc}`);
    return terminos.every(t => blob.includes(t));
  });
  if (orden === 'precio-asc') out = [...out].sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (orden === 'precio-desc') out = [...out].sort((a, b) => precioFinal(b) - precioFinal(a));
  return out;
}

function calcularTotal(items, catalogo = PRODUCTOS) {
  return items.reduce((s, i) => {
    const p = catalogo.find(x => x.id === i.id);
    return p ? s + precioFinal(p) * i.qty : s;
  }, 0);
}

const faltaParaEnvioGratis = total => Math.max(0, ENVIO_GRATIS_DESDE - total);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PRODUCTOS, CATEGORIAS, LINEAS, ENVIO_GRATIS_DESDE, PASO_VER_MAS,
    esc, norm, formatearPrecio, precioFinal, getProducto,
    filtrarProductos, calcularTotal, faltaParaEnvioGratis,
  };
}

if (typeof document !== 'undefined') {

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = typeof gsap !== 'undefined';
const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';
const hasFlip = typeof Flip !== 'undefined';

if (hasGsap && hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);
if (hasGsap && hasFlip) gsap.registerPlugin(Flip);
if (!hasGsap) {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
}
if (hasScrollTrigger) window.addEventListener('load', () => ScrollTrigger.refresh());

const Cart = {
  KEY: 'kika_cart',
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
  total() { return calcularTotal(this.get()); },
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

function badgeHTML(p) {
  const out = [];
  if (p.descuento > 0) out.push(`<span class="badge badge-desc">-${p.descuento}%</span>`);
  if (p.badge === 'nuevo') out.push('<span class="badge badge-nuevo">Nuevo</span>');
  if (p.badge === 'top') out.push('<span class="badge badge-top">Más pedido</span>');
  return out.length ? `<span class="prod-badges">${out.join('')}</span>` : '';
}

function precioHTML(p) {
  return p.descuento > 0
    ? `<b>${formatearPrecio(precioFinal(p))}</b><s>${formatearPrecio(p.precio)}</s>`
    : `<b>${formatearPrecio(p.precio)}</b>`;
}

function cardHTML(p) {
  return `
  <article class="prod-card" data-flip-id="${esc(p.id)}">
    <div class="prod-media">
      ${badgeHTML(p)}
      <img src="${esc(imgSrc(p))}" alt="${esc(p.alt)}" width="400" height="400" loading="lazy" decoding="async">
      <p class="prod-ficha"><span>${esc(p.activo)}</span><b>${esc(p.concentracion)}</b></p>
    </div>
    <div class="prod-body">
      <p class="prod-linea">${esc(LINEAS[p.linea] || '')}</p>
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      <p class="prod-medida">${esc(p.medida)}</p>
      <p class="prod-precio">${precioHTML(p)}</p>
      <div class="prod-acciones">
        <div class="stepper" role="group" aria-label="Cantidad de ${esc(p.nombre)}">
          <button type="button" data-qty="-1" data-id="${esc(p.id)}" aria-label="Restar uno">−</button>
          <span data-qty-val="${esc(p.id)}">1</span>
          <button type="button" data-qty="1" data-id="${esc(p.id)}" aria-label="Sumar uno">+</button>
        </div>
        <button type="button" class="prod-add" data-add="${esc(p.id)}">Agregar</button>
      </div>
    </div>
    <button type="button" class="prod-ver" data-ver="${esc(p.id)}"><span>Ver ${esc(p.nombre)}</span></button>
  </article>`;
}

function qtyDe(id) {
  const el = document.querySelector(`[data-qty-val="${CSS.escape(id)}"]`);
  return el ? Math.max(1, parseInt(el.textContent, 10) || 1) : 1;
}

/* ---------- Destacados: vidriera arrastrable ---------- */

function renderDestacados() {
  const rail = document.getElementById('railDestacados');
  if (!rail) return;
  rail.innerHTML = PRODUCTOS.filter(p => p.destacado).slice(0, 8).map(cardHTML).join('');
}

function initRailDrag(rail) {
  if (!rail) return;
  let abajo = false, movido = false, xInicial = 0, scrollInicial = 0;
  rail.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    abajo = true; movido = false;
    xInicial = e.clientX; scrollInicial = rail.scrollLeft;
  });
  rail.addEventListener('pointermove', e => {
    if (!abajo) return;
    const delta = e.clientX - xInicial;
    if (!movido && Math.abs(delta) > 6) { movido = true; rail.classList.add('dragging'); rail.setPointerCapture(e.pointerId); }
    if (movido) { e.preventDefault(); rail.scrollLeft = scrollInicial - delta; }
  });
  const soltar = () => {
    abajo = false;
    if (movido) setTimeout(() => rail.classList.remove('dragging'), 0);
  };
  rail.addEventListener('pointerup', soltar);
  rail.addEventListener('pointercancel', soltar);
  rail.addEventListener('pointerleave', soltar);
  rail.addEventListener('click', e => { if (movido) { e.preventDefault(); e.stopPropagation(); movido = false; } }, true);
}

/* ---------- Catálogo ---------- */

const estadoCat = { q: '', cat: 'todo', linea: 'todo', orden: 'sugerido', visibles: PASO_VER_MAS };

const productosFiltrados = () => filtrarProductos(PRODUCTOS, estadoCat);

function renderCatalogo(animar = true) {
  const grid = document.getElementById('prodGrid');
  const vacio = document.getElementById('shopVacio');
  const count = document.getElementById('shopCount');
  const btnMas = document.getElementById('btnVerMas');
  if (!grid) return;

  const lista = productosFiltrados();
  const mostrados = lista.slice(0, estadoCat.visibles);
  const estadoFlip = (hasFlip && animar && !reduceMotion && grid.children.length) ? Flip.getState('[data-flip-id]') : null;

  grid.innerHTML = mostrados.map(cardHTML).join('');
  if (count) count.textContent = lista.length === 1 ? '1 producto' : `${lista.length} productos`;
  if (vacio) vacio.hidden = lista.length > 0;
  if (btnMas) btnMas.hidden = estadoCat.visibles >= lista.length;

  if (estadoFlip) {
    Flip.from(estadoFlip, {
      duration: 0.55, ease: 'power2.inOut', absolute: true,
      onEnter: els => gsap.fromTo(els, { opacity: 0, scale: .92 }, { opacity: 1, scale: 1, duration: .4, stagger: .04 }),
      onLeave: els => gsap.to(els, { opacity: 0, scale: .92, duration: .25 }),
    });
  } else if (animar && hasGsap && !reduceMotion) {
    gsap.fromTo(grid.querySelectorAll('.prod-card'),
      { opacity: 0, y: 34 },
      { opacity: 1, y: 0, duration: .6, stagger: .05, ease: 'power2.out', clearProps: 'opacity,transform' });
  }
  if (hasScrollTrigger) ScrollTrigger.refresh();
}

function renderChips() {
  const cont = document.getElementById('chipsCategoria');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(c =>
    `<button type="button" class="chip${c.id === estadoCat.cat ? ' is-active' : ''}" data-cat="${esc(c.id)}" aria-pressed="${c.id === estadoCat.cat}">${esc(c.nombre)}</button>`
  ).join('');
}

function initCatalogo() {
  renderChips();
  renderCatalogo(false);

  document.getElementById('chipsCategoria')?.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    estadoCat.cat = chip.dataset.cat;
    estadoCat.visibles = PASO_VER_MAS;
    renderChips();
    renderCatalogo();
  });

  const buscador = document.getElementById('buscador');
  buscador?.addEventListener('input', () => {
    estadoCat.q = buscador.value;
    estadoCat.visibles = PASO_VER_MAS;
    renderCatalogo();
  });

  document.getElementById('filtroLinea')?.addEventListener('change', e => {
    estadoCat.linea = e.target.value; estadoCat.visibles = PASO_VER_MAS; renderCatalogo();
  });
  document.getElementById('filtroOrden')?.addEventListener('change', e => {
    estadoCat.orden = e.target.value; renderCatalogo();
  });

  document.getElementById('btnVerMas')?.addEventListener('click', () => {
    estadoCat.visibles += PASO_VER_MAS;
    renderCatalogo();
  });

  const limpiar = () => {
    estadoCat.q = ''; estadoCat.cat = 'todo'; estadoCat.linea = 'todo'; estadoCat.orden = 'sugerido'; estadoCat.visibles = PASO_VER_MAS;
    if (buscador) buscador.value = '';
    const fl = document.getElementById('filtroLinea'); if (fl) fl.value = 'todo';
    const fo = document.getElementById('filtroOrden'); if (fo) fo.value = 'sugerido';
    renderChips(); renderCatalogo();
  };
  document.getElementById('btnLimpiar')?.addEventListener('click', limpiar);
  document.getElementById('btnVaciarBusqueda')?.addEventListener('click', limpiar);

  const toggle = document.getElementById('filtrosToggle');
  const panel = document.getElementById('filtrosPanel');
  toggle?.addEventListener('click', () => {
    const abierto = panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(abierto));
    if (hasScrollTrigger) ScrollTrigger.refresh();
  });

  document.querySelectorAll('.linea-card').forEach(card => {
    card.addEventListener('click', () => {
      estadoCat.linea = card.dataset.linea;
      estadoCat.cat = 'todo';
      estadoCat.visibles = PASO_VER_MAS;
      const fl = document.getElementById('filtroLinea'); if (fl) fl.value = estadoCat.linea;
      renderChips();
      renderCatalogo();
      document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

/* ---------- Acciones de producto ---------- */

function initAccionesProducto() {
  document.addEventListener('click', e => {
    const stepBtn = e.target.closest('[data-qty]');
    if (stepBtn) {
      const span = document.querySelector(`[data-qty-val="${CSS.escape(stepBtn.dataset.id)}"]`);
      if (span) {
        const p = getProducto(stepBtn.dataset.id);
        const actual = parseInt(span.textContent, 10) || 1;
        span.textContent = Math.max(1, Math.min(actual + Number(stepBtn.dataset.qty), p?.stock ?? 99));
      }
      return;
    }

    const addBtn = e.target.closest('[data-add]');
    if (addBtn) {
      const p = getProducto(addBtn.dataset.add);
      if (!p) return;
      Cart.add(p, qtyDe(p.id));
      showToast('¡Agregado! Tu pedido te espera arriba.');
      return;
    }

    const verBtn = e.target.closest('[data-ver]');
    if (verBtn) { abrirModalProducto(verBtn.dataset.ver); return; }

    const packBtn = e.target.closest('[data-add-pack]');
    if (packBtn) {
      const pack = packBtn.dataset.addPack;
      if (pack === 'duo-salon') {
        Cart.add(getProducto('duo-salon'), 1);
      } else if (pack === 'arranque') {
        Cart.add(getProducto('ampollas-vitc'), 1);
        Cart.add(getProducto('serum-ha'), 1);
      }
      showToast('¡Pack agregado! Ya está en tu pedido.');
      abrirDrawer();
    }
  });
}

/* ---------- Modal de producto ---------- */

const modalProducto = document.getElementById('modalProducto');
const modalBackdrop = document.getElementById('modalBackdrop');
let modalRetorno = null;
let modalProductoId = null;

function abrirModalProducto(id) {
  const p = getProducto(id);
  if (!p || !modalProducto) return;
  modalProductoId = id;

  const img = document.getElementById('modalImg');
  img.src = imgSrc(p); img.alt = p.alt;
  document.getElementById('modalLinea').textContent = `${LINEAS[p.linea] || ''} · ${p.medida}`;
  document.getElementById('modalNombre').textContent = p.nombre;
  document.getElementById('modalPrecio').innerHTML = precioHTML(p);
  document.getElementById('modalDesc').textContent = p.desc;
  document.getElementById('modalQty').textContent = '1';

  document.getElementById('modalFicha').innerHTML = `
    <i>Ficha técnica</i>
    <p class="ficha-fila"><span>Activo principal</span><b>${esc(p.activo)}</b></p>
    <p class="ficha-fila"><span>Concentración</span><b>${esc(p.concentracion)}</b></p>
    <p class="ficha-fila"><span>pH de la fórmula</span><b>${esc(p.ph)}</b></p>
    <p class="ficha-fila"><span>Presentación</span><b>${esc(p.medida)}</b></p>`;

  const relacionados = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 3);
  const cont = document.getElementById('modalRelacionados');
  cont.innerHTML = relacionados.length
    ? `<p>También te puede servir</p><div class="rel-grid">${relacionados.map(r => `
        <button type="button" class="rel-card" data-ver="${esc(r.id)}">
          <span><img src="${esc(imgSrc(r))}" alt="" width="120" height="120" loading="lazy" decoding="async"></span>
          <b>${esc(r.nombre)}</b>
        </button>`).join('')}</div>`
    : '';

  modalRetorno = document.activeElement;
  modalProducto.classList.add('open');
  modalBackdrop.classList.add('open');
  modalProducto.removeAttribute('inert');
  document.body.classList.add('no-scroll');
  document.getElementById('modalClose').focus();
}

function cerrarModalProducto() {
  if (!modalProducto) return;
  modalProducto.classList.remove('open');
  modalBackdrop.classList.remove('open');
  modalProducto.setAttribute('inert', '');
  document.body.classList.remove('no-scroll');
  modalRetorno?.focus?.();
}

function initModalProducto() {
  if (!modalProducto) return;
  document.getElementById('modalClose')?.addEventListener('click', cerrarModalProducto);
  modalBackdrop?.addEventListener('click', cerrarModalProducto);

  modalProducto.querySelectorAll('[data-modal-qty]').forEach(btn => {
    btn.addEventListener('click', () => {
      const span = document.getElementById('modalQty');
      const p = getProducto(modalProductoId);
      const actual = parseInt(span.textContent, 10) || 1;
      span.textContent = Math.max(1, Math.min(actual + Number(btn.dataset.modalQty), p?.stock ?? 99));
    });
  });

  document.getElementById('modalAgregar')?.addEventListener('click', () => {
    const p = getProducto(modalProductoId);
    if (!p) return;
    Cart.add(p, parseInt(document.getElementById('modalQty').textContent, 10) || 1);
    showToast('¡Agregado! Tu pedido te espera arriba.');
  });

  document.getElementById('modalComprar')?.addEventListener('click', () => {
    const p = getProducto(modalProductoId);
    if (!p) return;
    Cart.add(p, parseInt(document.getElementById('modalQty').textContent, 10) || 1);
    cerrarModalProducto();
    abrirDrawer();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalProducto.classList.contains('open')) cerrarModalProducto();
    if (e.key === 'Tab' && modalProducto.classList.contains('open')) atraparFoco(e, modalProducto);
  });
}

function atraparFoco(e, cont) {
  const f = Array.from(cont.querySelectorAll('button, a[href], input, select, [tabindex]:not([tabindex="-1"])')).filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/* ---------- Drawer del carrito ---------- */

const drawer = document.getElementById('cartDrawer');
const drawerBackdrop = document.getElementById('drawerBackdrop');
let drawerRetorno = null;

function abrirDrawer() {
  if (!drawer) return;
  drawerRetorno = document.activeElement;
  drawer.classList.add('open');
  drawerBackdrop.classList.add('open');
  drawer.removeAttribute('inert');
  document.body.classList.add('no-scroll');
  document.getElementById('cartClose')?.focus();
  if (hasGsap && !reduceMotion) {
    gsap.fromTo(drawer.querySelectorAll('.cart-item'), { opacity: 0, x: 22 }, { opacity: 1, x: 0, duration: .4, stagger: .05, ease: 'power2.out' });
  }
}

function cerrarDrawer() {
  if (!drawer) return;
  drawer.classList.remove('open');
  drawerBackdrop.classList.remove('open');
  drawer.setAttribute('inert', '');
  document.body.classList.remove('no-scroll');
  drawerRetorno?.focus?.();
}

function renderCarrito() {
  const items = Cart.get();
  const cont = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const badges = document.querySelectorAll('[data-cart-count]');
  const total = Cart.total();

  badges.forEach(b => { b.textContent = Cart.count(); });
  if (totalEl) totalEl.textContent = formatearPrecio(total);

  if (cont) {
    cont.innerHTML = items.length ? items.map(i => {
      const p = getProducto(i.id);
      if (!p) return '';
      return `
      <div class="cart-item">
        <div class="cart-item-media"><img src="${esc(imgSrc(p))}" alt="" width="64" height="64" loading="lazy" decoding="async"></div>
        <div class="cart-item-info">
          <b>${esc(p.nombre)}</b>
          <span>${esc(p.medida)} · ${formatearPrecio(precioFinal(p))}</span>
        </div>
        <div class="cart-item-acc">
          <div class="stepper" role="group" aria-label="Cantidad de ${esc(p.nombre)}">
            <button type="button" data-cart-qty="-1" data-id="${esc(p.id)}" aria-label="Restar uno">−</button>
            <span>${i.qty}</span>
            <button type="button" data-cart-qty="1" data-id="${esc(p.id)}" aria-label="Sumar uno">+</button>
          </div>
          <button type="button" class="cart-quitar" data-cart-remove="${esc(p.id)}">Quitar</button>
        </div>
      </div>`;
    }).join('') : `
      <div class="cart-vacio">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>
        <b>Todavía no cargaste nada</b>
        <p>Armá tu reposición desde el catálogo y te lo dejamos listo para despachar.</p>
      </div>`;
  }

  const barra = document.getElementById('envioBarra');
  const texto = document.getElementById('envioTexto');
  const prog = document.getElementById('envioProgreso');
  if (barra && texto && prog) {
    barra.hidden = items.length === 0;
    const falta = ENVIO_GRATIS_DESDE - total;
    texto.innerHTML = falta > 0
      ? `Te faltan <b>${formatearPrecio(falta)}</b> para el envío bonificado`
      : '<b>¡Tenés envío bonificado! 🎉</b>';
    prog.style.width = Math.min(100, (total / ENVIO_GRATIS_DESDE) * 100) + '%';
  }

  const wsp = document.getElementById('cartWsp');
  if (wsp) {
    const lineas = items.map(i => {
      const p = getProducto(i.id);
      return p ? `${p.nombre} (${p.medida}) x${i.qty}` : '';
    }).filter(Boolean).join('\n');
    const mensaje = items.length
      ? `¡Hola kika! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(total)}`
      : '¡Hola kika! Quiero hacer un pedido.';
    wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(mensaje)}`;
  }
}

function initCarrito() {
  document.getElementById('btnCarrito')?.addEventListener('click', abrirDrawer);
  document.getElementById('cartClose')?.addEventListener('click', cerrarDrawer);
  drawerBackdrop?.addEventListener('click', cerrarDrawer);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer?.classList.contains('open')) cerrarDrawer();
    if (e.key === 'Tab' && drawer?.classList.contains('open')) atraparFoco(e, drawer);
  });

  document.addEventListener('click', e => {
    const qtyBtn = e.target.closest('[data-cart-qty]');
    if (qtyBtn) {
      const items = Cart.get();
      const it = items.find(i => i.id === qtyBtn.dataset.id);
      if (it) Cart.setQty(it.id, it.qty + Number(qtyBtn.dataset.cartQty));
      return;
    }
    const rmBtn = e.target.closest('[data-cart-remove]');
    if (rmBtn) { Cart.remove(rmBtn.dataset.cartRemove); showToast('Lo sacamos del pedido.'); }
  });

  document.getElementById('btnFinalizar')?.addEventListener('click', () => {
    if (!Cart.count()) { showToast('Tu pedido todavía está vacío.'); return; }
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });

  document.addEventListener('cart:updated', () => {
    renderCarrito();
    document.querySelectorAll('[data-cart-count]').forEach(b => {
      b.classList.remove('bump');
      void b.offsetWidth;
      b.classList.add('bump');
    });
  });

  renderCarrito();
}

/* ---------- Login (demo) ---------- */

const modalLogin = document.getElementById('modalLogin');
const loginBackdrop = document.getElementById('loginBackdrop');
let loginRetorno = null;

function initLogin() {
  if (!modalLogin) return;
  const abrir = () => {
    loginRetorno = document.activeElement;
    modalLogin.classList.add('open');
    loginBackdrop.classList.add('open');
    modalLogin.removeAttribute('inert');
    document.body.classList.add('no-scroll');
    document.getElementById('loginClose')?.focus();
  };
  const cerrar = () => {
    modalLogin.classList.remove('open');
    loginBackdrop.classList.remove('open');
    modalLogin.setAttribute('inert', '');
    document.body.classList.remove('no-scroll');
    loginRetorno?.focus?.();
  };
  document.getElementById('btnCuenta')?.addEventListener('click', abrir);
  document.getElementById('loginClose')?.addEventListener('click', cerrar);
  loginBackdrop?.addEventListener('click', cerrar);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalLogin.classList.contains('open')) cerrar();
    if (e.key === 'Tab' && modalLogin.classList.contains('open')) atraparFoco(e, modalLogin);
  });
  document.getElementById('loginForm')?.addEventListener('submit', e => {
    e.preventDefault();
    cerrar();
    showToast('Las cuentas profesionales se activan al pasar la web a producción.');
  });
}

/* ---------- Tira de beneficios ---------- */

function initTira() {
  const track = document.getElementById('tiraTrack');
  if (!track) return;
  const items = [
    'Reposición en 24/48 h en Neuquén capital',
    'Envíos a toda la Patagonia',
    'Precio de lista profesional',
    'Sin mínimo de compra online',
    'Asesoramiento técnico por WhatsApp',
  ];
  const bloque = items.map(t => `<span class="tira-item">${esc(t)}</span>`).join('');
  track.innerHTML = bloque + bloque;
}

/* ---------- LA FIRMA: de la fórmula a la piel ---------- */

function initFormula() {
  const stage = document.getElementById('formula');
  const gota = document.getElementById('gotaActivo');
  const halo = document.getElementById('haloActivo');
  const frasco = document.getElementById('pielFrasco');
  const pct = document.getElementById('pielPct');
  const pasos = Array.from(document.querySelectorAll('#formulaPasos .paso'));
  const capas = ['capa0', 'capa1', 'capa2', 'capa3'].map(id => document.getElementById(id));
  if (!stage || !gota || !pasos.length) return;

  const PARADAS = [104, 190, 292, 404];
  let actual = -1;

  const setPaso = progreso => {
    const i = Math.min(pasos.length - 1, Math.max(0, Math.floor(progreso * pasos.length)));
    if (i !== actual) {
      actual = i;
      pasos.forEach((p, k) => p.classList.toggle('is-on', k === i));
      capas.forEach((c, k) => { if (c) c.style.opacity = k <= i ? '1' : '.55'; });
    }
    if (pct) pct.textContent = Math.round(progreso * 100) + '%';
  };

  if (!hasGsap || !hasScrollTrigger || reduceMotion) {
    setPaso(0.99);
    if (gota) gota.setAttribute('transform', `translate(160 ${PARADAS[3]})`);
    if (halo) halo.setAttribute('transform', `translate(160 ${PARADAS[3]})`);
    return;
  }

  const construir = trigger => {
    gsap.set(gota, { attr: { transform: 'translate(160 40)' } });
    gsap.set(halo, { attr: { transform: 'translate(160 40)' }, opacity: 0 });
    gsap.set(frasco, { rotation: 0, transformOrigin: '50% 90%' });
    capas.forEach((c, k) => { if (c) c.style.opacity = k === 0 ? '1' : '.55'; });

    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: trigger });
    tl.to(frasco, { rotation: -9, duration: .35, ease: 'power2.out' }, 0);
    PARADAS.forEach((y, i) => {
      tl.to(gota, { attr: { transform: `translate(160 ${y})` }, duration: 1 }, i);
      tl.to(halo, { attr: { transform: `translate(160 ${y})` }, duration: 1 }, i);
    });
    tl.to(halo, { opacity: 1, duration: .5 }, 2.6);
    tl.to(halo, { opacity: .35, duration: .5 }, 3.4);
    return tl;
  };

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    const tl = construir({
      trigger: stage, start: 'top top', end: '+=240%', pin: true, scrub: .6,
      invalidateOnRefresh: true, onUpdate: self => setPaso(self.progress),
    });
    actual = -1; setPaso(0);
    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    requestAnimationFrame(() => ScrollTrigger.refresh());
    const tl = construir({
      trigger: stage, start: 'top top', end: 'bottom bottom', scrub: .6,
      invalidateOnRefresh: true, onUpdate: self => setPaso(self.progress),
    });
    actual = -1; setPaso(0);
    return () => {
      stage.classList.remove('is-sticky-mobile');
      tl.scrollTrigger?.kill(); tl.kill();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    setPaso(0.99);
    gota.setAttribute('transform', `translate(160 ${PARADAS[3]})`);
    halo.setAttribute('transform', `translate(160 ${PARADAS[3]})`);
  });
}

/* ---------- Hero ---------- */

function initHero() {
  if (!hasGsap || reduceMotion) return;
  const lineas = document.querySelectorAll('.hero-title .line > span');
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-eyebrow', { opacity: 0, y: 14, duration: .7 }, .05)
    .from(lineas, { yPercent: 112, duration: 1.05, stagger: .1 }, .1)
    .from('.hero-lead', { opacity: 0, y: 20, duration: .85 }, .5)
    .from('.hero-cta .btn', { opacity: 0, y: 16, duration: .7, stagger: .09 }, .65)
    .from('.hero-datos li', { opacity: 0, y: 14, duration: .6, stagger: .08 }, .8)
    .from('.escena-bloque', { scale: .88, opacity: 0, duration: 1, ease: 'power2.out' }, .15)
    .from('.escena-serum', { y: 56, opacity: 0, rotation: 4, duration: 1.1, ease: 'back.out(1.15)' }, .35)
    .from('.escena-ampolla', { y: 30, opacity: 0, duration: .8 }, .75)
    .from('.escena-sello', { scale: .4, opacity: 0, rotation: -30, transformOrigin: 'center', duration: .7, ease: 'back.out(1.8)' }, .85)
    .from('.ficha-flotante', { x: -22, opacity: 0, duration: .7 }, .95);
}

function initParallax() {
  if (!hasGsap || !hasScrollTrigger || reduceMotion) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
    gsap.to('.escena-serum', { y: 26, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 } });
    gsap.to('.quienes-media img', { yPercent: -5, ease: 'none', scrollTrigger: { trigger: '.quienes-media', start: 'top bottom', end: 'bottom top', scrub: .5 } });
    gsap.to('.cierre-bg', { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.cierre', start: 'top bottom', end: 'bottom top', scrub: .6 } });
  });
}

/* ---------- Nav mobile ---------- */

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  const mq = window.matchMedia('(max-width: 768px)');
  const sync = () => { if (!mq.matches) { nav.classList.remove('open'); bd.classList.remove('open'); nav.removeAttribute('inert'); document.body.classList.remove('no-scroll'); } else close(); };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  mq.addEventListener('change', sync);
  sync();
}

/* ---------- Reveals ---------- */

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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function init() {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  initNav();
  initReveals();
  initWspFloat();
  initHero();
  initTira();
  renderDestacados();
  initRailDrag(document.getElementById('railDestacados'));
  initCatalogo();
  initAccionesProducto();
  initModalProducto();
  initCarrito();
  initLogin();
  initFormula();
  initParallax();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

}
