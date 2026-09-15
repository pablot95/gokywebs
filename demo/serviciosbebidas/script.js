const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491161219590';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

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
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}

const CATEGORIAS = [
  { id: 'espumantes', nombre: 'Espumantes', bajada: 'Para el brindis', img: 'images/espumantes-premium.webp' },
  { id: 'vinos', nombre: 'Vinos', bajada: 'Tinto, blanco y rosé', img: 'images/seleccion-vinos.webp' },
  { id: 'cervezas', nombre: 'Cervezas y latas', bajada: 'Frías, por pack', img: 'images/cervezas-y-latas.webp' },
  { id: 'mixers', nombre: 'Mixers y sin alcohol', bajada: 'Tónicas, aguas y jugos', img: 'images/mixers-sin-alcohol.webp' },
  { id: 'cocteleria', nombre: 'Coctelería', bajada: 'Kits y cristalería', img: 'images/kit-cocteleria.webp' },
  { id: 'gifts', nombre: 'Gift boxes', bajada: 'Para regalar', img: 'images/gift-box-bebidas.webp' }
];

const PRODUCTOS = [
  { id: 'esp-extra-brut-6', nombre: 'Espumante Extra Brut x6', cat: 'espumantes', precio: 38400, descuento: 0, img: 'images/prod-espumante-frapera.webp', destacado: false, tags: ['brindis', 'seco', 'pack'], desc: 'Seis botellas de 750 ml de método charmat, seco y con burbuja fina. El espumante que ponemos en casi todos los brindis: entra bien con cualquier comida y no empalaga.' },
  { id: 'esp-rose-6', nombre: 'Espumante Rosé x6', cat: 'espumantes', precio: 41900, descuento: 0, img: 'images/prod-copas-espumante.webp', destacado: false, tags: ['rosé', 'brindis', 'pack'], desc: 'Rosado, frutado y bajo en dulzor. Es el que más se pide en casamientos de tarde porque se ve bien en la copa y se toma fresco.' },
  { id: 'champ-nature', nombre: 'Champagne Nature 750 ml', cat: 'espumantes', precio: 28500, descuento: 0, img: 'images/espumantes-premium.webp', destacado: false, tags: ['nature', 'premium', 'botella'], desc: 'Método tradicional, sin azúcar agregada. Para la mesa principal o para un brindis chico donde la botella se mira tanto como se toma.' },
  { id: 'pack-brindis-12', nombre: 'Pack Brindis x12 con copas', cat: 'espumantes', precio: 74900, descuento: 10, img: 'images/prod-espumante-frapera.webp', destacado: true, tags: ['brindis', 'combo', 'copas'], desc: 'Doce botellas de espumante extra brut más 24 copas de vidrio en préstamo. Llega frío en frapera y retiramos todo al día siguiente.' },

  { id: 'malbec-6', nombre: 'Malbec Reserva x6', cat: 'vinos', precio: 46800, descuento: 0, img: 'images/prod-vinos-trio.webp', destacado: true, tags: ['tinto', 'malbec', 'pack'], desc: 'Seis botellas de Malbec de guarda media, con paso por roble. El tinto que funciona con asado, tabla de fiambres y comida de salón.' },
  { id: 'sauvignon-6', nombre: 'Sauvignon Blanc x6', cat: 'vinos', precio: 39500, descuento: 0, img: 'images/seleccion-vinos.webp', destacado: false, tags: ['blanco', 'fresco', 'pack'], desc: 'Blanco cítrico y liviano, ideal para servir bien frío en eventos de día. Va perfecto con entradas frías y pescado.' },
  { id: 'rose-malbec-6', nombre: 'Rosé de Malbec x6', cat: 'vinos', precio: 37200, descuento: 0, img: 'images/prod-vino-rosado.webp', destacado: true, tags: ['rosé', 'fresco', 'pack'], desc: 'Rosado seco de Malbec, color pálido y final limpio. Es el comodín: gusta al que toma tinto y al que toma blanco.' },
  { id: 'caja-degustacion-9', nombre: 'Caja Degustación x9', cat: 'vinos', precio: 63900, descuento: 12, img: 'images/seleccion-vinos.webp', destacado: false, tags: ['combo', 'regalo', 'variado'], desc: 'Tres tintos, tres blancos y tres rosados en una caja armada. Sirve para probar antes de decidir la carta del evento.' },

  { id: 'artesanal-12', nombre: 'Cerveza Artesanal x12', cat: 'cervezas', precio: 24600, descuento: 0, img: 'images/prod-latas.webp', destacado: true, tags: ['artesanal', 'ipa', 'pack'], desc: 'Doce latas de 473 ml, mitad rubia y mitad IPA. Vienen frías y se mantienen así en la frapera durante todo el evento.' },
  { id: 'latas-premium-24', nombre: 'Latas Premium x24', cat: 'cervezas', precio: 43900, descuento: 0, img: 'images/cervezas-y-latas.webp', destacado: false, tags: ['lata', 'pack grande', 'rubia'], desc: 'Cajón de 24 latas de cerveza premium importada. Es la unidad con la que trabajamos en eventos de más de 80 personas.' },
  { id: 'rubia-24', nombre: 'Cerveza Rubia x24', cat: 'cervezas', precio: 32400, descuento: 0, img: 'images/prod-latas.webp', destacado: false, tags: ['rubia', 'clásica', 'pack grande'], desc: 'La rubia clásica de siempre, en cajón de 24. La que nunca sobra y la que todo el mundo toma sin preguntar.' },
  { id: 'seltzer-12', nombre: 'Hard Seltzer x12', cat: 'cervezas', precio: 28900, descuento: 15, img: 'images/prod-latas.webp', destacado: false, tags: ['seltzer', 'liviano', 'pack'], desc: 'Doce latas de seltzer con alcohol, sabores pomelo y frutos rojos. Liviano, bajo en calorías y muy pedido en eventos de verano.' },

  { id: 'tonica-12', nombre: 'Agua Tónica Premium x12', cat: 'mixers', precio: 18700, descuento: 0, img: 'images/prod-mixers-botellas.webp', destacado: true, tags: ['tónica', 'mixer', 'gin'], desc: 'Doce botellas de vidrio de 200 ml. Burbuja firme y amargor justo: es la tónica que usamos en la barra de gin.' },
  { id: 'gaseosas-vidrio-12', nombre: 'Gaseosas Línea Vidrio x12', cat: 'mixers', precio: 16400, descuento: 0, img: 'images/mixers-sin-alcohol.webp', destacado: false, tags: ['gaseosa', 'vidrio', 'mixer'], desc: 'Cola, lima-limón y pomelo en botella de vidrio. En la mesa se ven mejor que el plástico y enfrían más rápido.' },
  { id: 'mocktails-6', nombre: 'Mocktails Listos x6', cat: 'mixers', precio: 21900, descuento: 0, img: 'images/prod-mixers-vasos.webp', destacado: false, tags: ['sin alcohol', 'coctel', 'listo'], desc: 'Seis botellas de trago sin alcohol listo para servir con hielo. Para que quien no toma tenga algo mejor que una gaseosa.' },
  { id: 'saborizada-12', nombre: 'Agua Saborizada x12', cat: 'mixers', precio: 14800, descuento: 0, img: 'images/mixers-sin-alcohol.webp', destacado: false, tags: ['agua', 'sin alcohol', 'pack'], desc: 'Doce botellas de agua saborizada sin azúcar, pomelo y naranja. Se agotan siempre en eventos de día.' },
  { id: 'jugos-6', nombre: 'Jugos Naturales x6', cat: 'mixers', precio: 17600, descuento: 0, img: 'images/prod-mixers-botellas.webp', destacado: false, tags: ['jugo', 'sin alcohol', 'natural'], desc: 'Seis botellas de un litro de jugo exprimido sin azúcar agregada: naranja, pomelo y manzana. Llegan refrigerados.' },
  { id: 'agua-mineral-12', nombre: 'Agua Mineral x12', cat: 'mixers', precio: 11900, descuento: 0, img: 'images/prod-mixers-vasos.webp', destacado: false, tags: ['agua', 'sin gas', 'pack'], desc: 'Doce botellas de 1,5 litros, con y sin gas. La base de cualquier barra: siempre se calcula una por cada cuatro invitados.' },

  { id: 'kit-cocteleria', nombre: 'Kit Coctelería Premium', cat: 'cocteleria', precio: 89000, descuento: 0, img: 'images/kit-cocteleria.webp', destacado: true, tags: ['kit', 'shaker', 'regalo'], desc: 'Coctelera, jigger, cuchara mezcladora, colador y tabla de mármol, más gin y tónicas para arrancar. Viene en caja de regalo.' },
  { id: 'gin-tonicas', nombre: 'Gin London Dry + 4 tónicas', cat: 'cocteleria', precio: 54700, descuento: 0, img: 'images/prod-gin-shaker.webp', destacado: true, tags: ['gin', 'combo', 'tónica'], desc: 'Botella de gin London Dry de 750 ml con cuatro tónicas premium y botánicos para la copa. Alcanza para unos ocho gin tonics.' },
  { id: 'kit-gt-12', nombre: 'Kit Gin Tonic para 12', cat: 'cocteleria', precio: 67500, descuento: 10, img: 'images/prod-gin-tonic.webp', destacado: false, tags: ['gin', 'evento', 'combo'], desc: 'Dos botellas de gin, doce tónicas, copas balón y pomelo cortado del día. Llega listo para armar la estación de gin del evento.' },
  { id: 'cristaleria-12', nombre: 'Set de Cristalería x12', cat: 'cocteleria', precio: 42300, descuento: 0, img: 'images/prod-copas-espumante.webp', destacado: false, tags: ['copas', 'cristal', 'set'], desc: 'Doce copas de cristal: seis flautas y seis balón. Se venden o se alquilan para el evento; consultá por el alquiler.' },

  { id: 'gift-ejecutiva', nombre: 'Gift Box Ejecutiva', cat: 'gifts', precio: 96000, descuento: 0, img: 'images/gift-box-bebidas.webp', destacado: true, tags: ['regalo', 'corporativo', 'premium'], desc: 'Espumante, gin, tónicas, coctelera y cristalería en caja negra con moño. La que más se regala a clientes en fin de año.' },
  { id: 'gift-brindis', nombre: 'Gift Box Brindis', cat: 'gifts', precio: 72500, descuento: 0, img: 'images/prod-caja-envio.webp', destacado: false, tags: ['regalo', 'espumante', 'caja'], desc: 'Dos espumantes, copas de vidrio y snacks salados. Sale con tarjeta escrita a mano y entrega coordinada por horario.' },
  { id: 'gift-corporativa-10', nombre: 'Caja Corporativa x10 unidades', cat: 'gifts', precio: 198000, descuento: 0, img: 'images/prod-caja-envio.webp', destacado: false, tags: ['corporativo', 'volumen', 'regalo'], desc: 'Diez gift boxes armadas con tu logo en la tarjeta y despacho a diez direcciones distintas. Nosotros nos ocupamos de la logística.' },
  { id: 'gift-sin-alcohol', nombre: 'Gift Box Sin Alcohol', cat: 'gifts', precio: 58900, descuento: 10, img: 'images/prod-mixers-vasos.webp', destacado: false, tags: ['sin alcohol', 'regalo', 'mocktail'], desc: 'Mocktails listos, tónicas, jugos exprimidos y vasos de cristal. Para regalar sin asumir que la otra persona toma.' }
];

const getProducto = id => PRODUCTOS.find(p => p.id === id);
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const nombreCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';

const Cart = {
  KEY: 'serviciosbebidas_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, 99);
    else items.push({ id: producto.id, qty: Math.min(qty, 99) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 99)); this.save(items);
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
  if (!revealsListos) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  const header = document.querySelector('.site-header');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (header || document.body).appendChild(bd); }
  const desktop = window.matchMedia('(min-width: 769px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (desktop.matches) nav.removeAttribute('inert'); else nav.setAttribute('inert', '');
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
  const sync = () => { if (desktop.matches || !nav.classList.contains('open')) close(); };
  desktop.addEventListener('change', sync);
  sync();
}

function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  let queued = false;
  const update = () => {
    queued = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? clamp01(window.scrollY / max) : 0})`;
  };
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

const ICO_MENOS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 12h14"/></svg>';
const ICO_MAS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const ICO_CARRO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';

function cardHTML(p, animar) {
  const pf = precioFinal(p);
  const style = animar ? ' data-animate style="transform:translateY(34px) scale(.96);opacity:0"' : '';
  return `<article class="prod-card" data-id="${p.id}"${style}>
    <div class="prod-media">
      <img src="${p.img}" alt="${esc(p.nombre)}" width="900" height="900" loading="lazy">
      <span class="prod-tag">${esc(nombreCat(p.cat))}</span>
      ${p.descuento > 0 ? `<span class="prod-off">-${p.descuento}%</span>` : ''}
      <span class="prod-ver">Ver detalle</span>
    </div>
    <div class="prod-body">
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      <div class="prod-precios">
        <span class="prod-precio">${formatearPrecio(pf)}</span>
        ${p.descuento > 0 ? `<s class="prod-antes">${formatearPrecio(p.precio)}</s>` : ''}
      </div>
      <div class="prod-acciones">
        <div class="stepper" data-stepper>
          <button type="button" data-step="-1" aria-label="Quitar una unidad">${ICO_MENOS}</button>
          <span data-qty>1</span>
          <button type="button" data-step="1" aria-label="Sumar una unidad">${ICO_MAS}</button>
        </div>
        <button type="button" class="btn-add" data-add="${p.id}">${ICO_CARRO}<span>Agregar</span></button>
      </div>
    </div>
  </article>`;
}

function filtrarProductos(fuente, estado) {
  const q = normalizar(estado.q).split(/\s+/).filter(Boolean);
  const lista = fuente.filter(p => {
    if (estado.cat !== 'all' && p.cat !== estado.cat) return false;
    if (!q.length) return true;
    const heno = normalizar([p.nombre, nombreCat(p.cat), p.desc, (p.tags || []).join(' ')].join(' '));
    return q.every(t => heno.includes(t));
  });
  if (estado.orden === 'precio-asc') lista.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estado.orden === 'precio-desc') lista.sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (estado.orden === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else lista.sort((a, b) => (b.destacado === true) - (a.destacado === true) || b.descuento - a.descuento);
  return lista;
}

function initCatalogo() {
  const grid = document.getElementById('prodGrid');
  const chips = document.getElementById('chips');
  const buscador = document.getElementById('buscador');
  const buscadorClear = document.getElementById('buscadorClear');
  const orden = document.getElementById('orden');
  const resultados = document.getElementById('resultados');
  const limpiar = document.getElementById('limpiar');
  const verMas = document.getElementById('verMas');
  const vacio = document.getElementById('vacio');
  if (!grid) return;

  const estado = { cat: 'all', q: '', orden: 'destacados', visibles: 16 };

  chips.innerHTML = [{ id: 'all', nombre: 'Todo' }, ...CATEGORIAS]
    .map(c => `<button type="button" class="chip${c.id === 'all' ? ' is-on' : ''}" data-cat="${c.id}">${esc(c.nombre)}</button>`).join('');

  const pintar = () => {
    const lista = filtrarProductos(PRODUCTOS, estado);
    const mostrar = lista.slice(0, estado.visibles);
    grid.innerHTML = mostrar.map(p => cardHTML(p, true)).join('');
    resultados.textContent = lista.length === 1 ? '1 producto' : `${lista.length} productos`;
    vacio.hidden = lista.length > 0;
    grid.hidden = lista.length === 0;
    verMas.hidden = lista.length <= estado.visibles;
    limpiar.hidden = estado.cat === 'all' && !estado.q && estado.orden === 'destacados';
    buscadorClear.hidden = !estado.q;
    chips.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-on', c.dataset.cat === estado.cat));
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  chips.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    estado.cat = chip.dataset.cat; estado.visibles = 16; pintar();
  });
  let debounce;
  buscador.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { estado.q = buscador.value.trim(); estado.visibles = 16; pintar(); }, 180);
  });
  buscadorClear.addEventListener('click', () => { buscador.value = ''; estado.q = ''; estado.visibles = 16; pintar(); buscador.focus(); });
  orden.addEventListener('change', () => { estado.orden = orden.value; estado.visibles = 16; pintar(); });
  verMas.addEventListener('click', () => { estado.visibles += 16; pintar(); });
  const reset = () => {
    estado.cat = 'all'; estado.q = ''; estado.orden = 'destacados'; estado.visibles = 16;
    buscador.value = ''; orden.value = 'destacados'; pintar();
  };
  limpiar.addEventListener('click', reset);
  document.getElementById('vacioReset').addEventListener('click', reset);

  window.filtrarPorCategoria = cat => {
    estado.cat = cat; estado.q = ''; buscador.value = ''; estado.visibles = 16; pintar();
    document.getElementById('tienda').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  pintar();
}

function initRail() {
  const track = document.getElementById('railTrack');
  const vp = document.getElementById('railVp');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!track || !vp) return;

  const destacados = PRODUCTOS.filter(p => p.destacado).slice(0, 8);
  track.innerHTML = destacados.map(p => cardHTML(p, true)).join('');
  revelarNuevos(track);

  const paso = () => vp.clientWidth * 0.72;
  const sincroFlechas = () => {
    const pad = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    const inicio = Math.max(pad, track.firstElementChild ? track.firstElementChild.offsetLeft : 0);
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 12;
    if (next) next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: 'smooth' }));
  vp.addEventListener('scroll', sincroFlechas, { passive: true });
  window.addEventListener('resize', sincroFlechas, { passive: true });
  sincroFlechas();

  let down = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
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
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 60);
    }
    moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);

  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const enBorde = (e.deltaY < 0 && vp.scrollLeft <= 0) || (e.deltaY > 0 && vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 1);
    if (enBorde) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });
}

function initCategorias() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map(c => `<a class="cat-card" href="#tienda" data-cat="${c.id}" data-animate style="transform:translateY(30px);opacity:0">
    <img src="${c.img}" alt="${esc(c.nombre)}" width="900" height="900" loading="lazy">
    <span class="cat-info"><span class="cat-txt"><span class="cat-nom">${esc(c.nombre)}</span><span>${esc(c.bajada)}</span></span>
      <span class="cat-flecha"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
    </span>
  </a>`).join('');
  grid.addEventListener('click', e => {
    const card = e.target.closest('.cat-card');
    if (!card) return;
    e.preventDefault();
    window.filtrarPorCategoria?.(card.dataset.cat);
  });
}

function qtyDe(scope) {
  const span = scope?.querySelector('[data-qty]');
  return span ? Math.max(1, parseInt(span.textContent, 10) || 1) : 1;
}

function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const span = step.parentElement.querySelector('[data-qty]');
      const d = Number(step.dataset.step);
      const linea = step.closest('[data-line]');
      if (linea) { Cart.setQty(linea.dataset.line, (parseInt(span.textContent, 10) || 1) + d); return; }
      span.textContent = Math.max(1, Math.min(99, (parseInt(span.textContent, 10) || 1) + d));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const qty = qtyDe(add.closest('.prod-acciones, .modal-acciones'));
      Cart.add(p, qty);
      showToast(`${p.nombre} en el carrito. ¡Que empiece el brindis!`);
      return;
    }
    const comprar = e.target.closest('[data-buy]');
    if (comprar) {
      const p = getProducto(comprar.dataset.buy);
      if (!p) return;
      Cart.add(p, qtyDe(comprar.closest('.modal-acciones')));
      abrirDrawer();
      return;
    }
    const del = e.target.closest('[data-del]');
    if (del) { Cart.remove(del.dataset.del); return; }
    const card = e.target.closest('.prod-card');
    if (card && !e.target.closest('button')) abrirModal(card.dataset.id);
    const sug = e.target.closest('[data-sug]');
    if (sug) abrirModal(sug.dataset.sug);
  });
}

let ultimoFoco = null;
function trapFoco(cont, e) {
  const focusables = cont.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const primero = focusables[0], ultimo = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function abrirDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  ultimoFoco = document.activeElement;
  bd.hidden = false; drawer.hidden = false;
  requestAnimationFrame(() => { bd.classList.add('open'); drawer.classList.add('open'); });
  document.body.classList.add('no-scroll', 'overlay-open');
  renderDrawer();
  document.getElementById('drawerClose').focus();
}
function cerrarDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  drawer.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll', 'overlay-open');
  setTimeout(() => { drawer.hidden = true; bd.hidden = true; }, 340);
  ultimoFoco?.focus();
}

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="cart-vacio"><p>🥂</p><h3>Tu carrito está vacío</h3><span>Todavía no elegiste nada para el brindis.</span><button type="button" class="btn btn-line" data-cerrar-drawer>Ver la tienda</button></div>`;
    foot.hidden = true;
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<div class="cart-item" data-line="${p.id}">
      <img src="${p.img}" alt="${esc(p.nombre)}" width="900" height="900" loading="lazy">
      <div>
        <h4>${esc(p.nombre)}</h4>
        <p class="ci-precio">${formatearPrecio(precioFinal(p))}</p>
        <div class="stepper">
          <button type="button" data-step="-1" aria-label="Quitar una unidad">${ICO_MENOS}</button>
          <span data-qty>${i.qty}</span>
          <button type="button" data-step="1" aria-label="Sumar una unidad">${ICO_MAS}</button>
        </div>
      </div>
      <button type="button" class="ci-del" data-del="${p.id}" aria-label="Quitar ${esc(p.nombre)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/></svg>
      </button>
    </div>`;
  }).join('');
  foot.hidden = false;
  document.getElementById('drawerTotal').textContent = formatearPrecio(Cart.total());
  const detalle = items.map(i => { const p = getProducto(i.id); return p ? `• ${p.nombre} x${i.qty}` : ''; }).filter(Boolean).join('\n');
  document.getElementById('drawerWsp').href = `https://wa.me/${WSP}?text=${encodeURIComponent(`Hola Servicios Bebidas, quiero pedir:\n${detalle}\n\nTotal: ${formatearPrecio(Cart.total())}`)}`;
}

function abrirModal(id) {
  const p = getProducto(id);
  if (!p) return;
  const modal = document.getElementById('modal');
  const bd = document.getElementById('modalBackdrop');
  const body = document.getElementById('modalBody');
  const pf = precioFinal(p);
  const sug = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  body.innerHTML = `<div class="modal-grid">
    <div class="modal-media"><img src="${p.img}" alt="${esc(p.nombre)}" width="900" height="900"></div>
    <div class="modal-info">
      <p class="prod-cat">${esc(nombreCat(p.cat))}</p>
      <h3 class="modal-nombre">${esc(p.nombre)}</h3>
      <div class="modal-precios">
        <span class="prod-precio">${formatearPrecio(pf)}</span>
        ${p.descuento > 0 ? `<s class="prod-antes">${formatearPrecio(p.precio)}</s><span class="prod-off" style="position:static">-${p.descuento}%</span>` : ''}
      </div>
      <p class="modal-desc">${esc(p.desc)}</p>
      <div class="modal-tags">${(p.tags || []).map(t => `<span>${esc(t)}</span>`).join('')}</div>
      <div class="modal-acciones">
        <div class="stepper" data-stepper>
          <button type="button" data-step="-1" aria-label="Quitar una unidad">${ICO_MENOS}</button>
          <span data-qty>1</span>
          <button type="button" data-step="1" aria-label="Sumar una unidad">${ICO_MAS}</button>
        </div>
        <button type="button" class="btn-add" data-add="${p.id}">${ICO_CARRO}<span>Agregar al carrito</span></button>
        <button type="button" class="btn btn-line" data-buy="${p.id}">Comprar ahora</button>
      </div>
    </div>
  </div>
  ${sug.length ? `<div class="modal-sug"><h4>También te puede interesar</h4><div class="sug-grid">${sug.map(s => `<button type="button" class="sug-card" data-sug="${s.id}">
    <img src="${s.img}" alt="" width="900" height="900" loading="lazy">
    <span><b>${esc(s.nombre)}</b><span>${formatearPrecio(precioFinal(s))}</span></span>
  </button>`).join('')}</div></div>` : ''}`;
  document.getElementById('modalTitle').textContent = p.nombre;
  ultimoFoco = ultimoFoco || document.activeElement;
  bd.hidden = false; modal.hidden = false;
  requestAnimationFrame(() => { bd.classList.add('open'); modal.classList.add('open'); });
  document.body.classList.add('no-scroll', 'overlay-open');
  document.getElementById('modalClose').focus();
}
function cerrarModal() {
  const modal = document.getElementById('modal');
  const bd = document.getElementById('modalBackdrop');
  modal.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll', 'overlay-open');
  setTimeout(() => { modal.hidden = true; bd.hidden = true; }, 340);
  ultimoFoco?.focus(); ultimoFoco = null;
}

function initOverlays() {
  document.getElementById('cartBtn').addEventListener('click', abrirDrawer);
  document.getElementById('cart-float').addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose').addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop').addEventListener('click', cerrarDrawer);
  document.getElementById('modalClose').addEventListener('click', cerrarModal);
  document.getElementById('modalBackdrop').addEventListener('click', cerrarModal);
  document.addEventListener('click', e => { if (e.target.closest('[data-cerrar-drawer]')) cerrarDrawer(); });
  document.getElementById('checkout').addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('keydown', e => {
    const modal = document.getElementById('modal');
    const drawer = document.getElementById('drawer');
    if (e.key === 'Escape') {
      if (!modal.hidden) cerrarModal();
      else if (!drawer.hidden) cerrarDrawer();
    }
    if (e.key === 'Tab') {
      if (!modal.hidden) trapFoco(modal, e);
      else if (!drawer.hidden) trapFoco(drawer, e);
    }
  });
  document.addEventListener('cart:updated', () => { if (!document.getElementById('drawer').hidden) renderDrawer(); });
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

function initServicios() {
  const stage = document.getElementById('servStage');
  if (!stage) return;
  const pasos = Array.from(document.querySelectorAll('#servPasos .serv-paso'));
  const fotos = Array.from(document.querySelectorAll('.serv-fotos img'));
  const halo = document.getElementById('servHalo');
  const num = document.getElementById('servNum');
  const HALOS = [
    'radial-gradient(45% 45% at 30% 40%,rgba(223,2,227,.55),transparent 70%)',
    'radial-gradient(45% 45% at 70% 35%,rgba(160,47,192,.55),transparent 70%)',
    'radial-gradient(45% 45% at 35% 65%,rgba(95,107,176,.55),transparent 70%)',
    'radial-gradient(45% 45% at 68% 60%,rgba(1,157,178,.6),transparent 70%)'
  ];
  let activo = -1;
  const setPaso = i => {
    if (i === activo) return;
    activo = i;
    pasos.forEach((el, n) => el.classList.toggle('is-on', n === i));
    fotos.forEach((el, n) => el.classList.toggle('is-on', n === i));
    if (halo) halo.style.background = HALOS[i];
    if (num) num.textContent = String(i + 1).padStart(2, '0');
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    stage.classList.add('is-static');
    pasos.forEach(el => el.classList.add('is-on'));
    fotos.forEach((el, n) => el.classList.toggle('is-on', n === 0));
    return;
  }

  setPaso(0);
  ScrollTrigger.create({
    trigger: stage, start: 'top top', end: 'bottom bottom', invalidateOnRefresh: true,
    onUpdate: self => setPaso(Math.min(pasos.length - 1, Math.floor(self.progress * pasos.length)))
  });
}

const MODELO = {
  casamiento: { espumante: 1.55, vino: 1.2, cerveza: .75, sin: .95 },
  corporativo: { espumante: 1.1, vino: 1.0, cerveza: .7, sin: 1.35 },
  cumple: { espumante: .8, vino: .85, cerveza: 1.45, sin: 1.0 }
};
const FAMILIAS = [
  { key: 'espumante', nombre: 'Espumante', color: '#df02e3', ml: 750, unidad: 'botellas' },
  { key: 'vino', nombre: 'Vino', color: '#a02fc0', ml: 750, unidad: 'botellas' },
  { key: 'cerveza', nombre: 'Cerveza', color: '#5f6bb0', ml: 473, unidad: 'latas' },
  { key: 'sin', nombre: 'Gaseosas, aguas y jugos', color: '#019db2', ml: 1500, unidad: 'botellas de 1,5 L' }
];
const BASE = { espumante: .07, vino: .21, cerveza: .30, sin: .42 };

function calcularBarra(invitados, horas, tipo, alcohol) {
  const unidades = Math.round(invitados * (1 + horas * 0.85));
  const mlTotal = unidades * 250;
  const factores = MODELO[tipo] || MODELO.casamiento;
  const shares = {};
  if (alcohol === 'no') {
    FAMILIAS.forEach(f => { shares[f.key] = f.key === 'sin' ? 1 : 0; });
  } else {
    let suma = 0;
    FAMILIAS.forEach(f => { shares[f.key] = BASE[f.key] * factores[f.key]; suma += shares[f.key]; });
    FAMILIAS.forEach(f => { shares[f.key] = shares[f.key] / suma; });
  }
  const filas = FAMILIAS
    .map(f => ({ ...f, share: shares[f.key], cant: Math.ceil((mlTotal * shares[f.key]) / f.ml) }))
    .filter(f => f.cant > 0);
  return {
    unidades, mlTotal, litros: Math.round(mlTotal / 1000), filas,
    hielo: Math.ceil(invitados / 4), vasos: Math.ceil(invitados * 1.6)
  };
}

function initBarra() {
  const inv = document.getElementById('invitados');
  const hrs = document.getElementById('horas');
  if (!inv || !hrs) return;
  const invVal = document.getElementById('invitadosVal');
  const hrsVal = document.getElementById('horasVal');
  const viz = document.getElementById('barraViz');
  const lista = document.getElementById('barraLista');
  const totalEl = document.getElementById('barraTotal');
  const litrosEl = document.getElementById('barraLitros');
  const cta = document.getElementById('barraCta');
  const estado = { tipo: 'casamiento', alcohol: 'si' };

  const SLOTS = 48;
  viz.innerHTML = Array.from({ length: SLOTS }, () => '<i></i>').join('');
  const celdas = Array.from(viz.children);

  const calcular = () => {
    const invitados = Number(inv.value);
    const horas = Number(hrs.value);
    const { unidades, litros, filas, hielo, vasos } = calcularBarra(invitados, horas, estado.tipo, estado.alcohol);

    invVal.textContent = invitados;
    hrsVal.textContent = `${horas} h`;
    totalEl.textContent = unidades.toLocaleString('es-AR');
    litrosEl.textContent = litros.toLocaleString('es-AR');

    lista.innerHTML = filas.map(f => `<li><span class="punto" style="background:${f.color}"></span>${esc(f.nombre)}<b class="qty">${f.cant} ${esc(f.unidad)}</b></li>`).join('')
      + `<li><span class="punto" style="background:var(--color-line)"></span>Hielo<b class="qty">${hielo} kg</b></li>`
      + `<li><span class="punto" style="background:var(--color-line)"></span>Copas y vasos<b class="qty">${vasos}</b></li>`;

    const reparto = [];
    filas.forEach((f, i) => {
      const n = i === filas.length - 1 ? SLOTS - reparto.length : Math.round(f.share * SLOTS);
      for (let k = 0; k < n; k++) reparto.push(f.color);
    });
    while (reparto.length < SLOTS) reparto.push(filas[filas.length - 1].color);
    celdas.forEach((c, i) => {
      const color = reparto[i] || 'var(--color-line)';
      if (c.dataset.color === color) return;
      c.dataset.color = color;
      const d = reduceMotion ? 0 : Math.min(i * 8, 340);
      setTimeout(() => { c.style.background = color; }, d);
    });

    const detalle = filas.map(f => `• ${f.nombre}: ${f.cant} ${f.unidad}`).join('\n');
    const tipoTxt = { casamiento: 'un casamiento', corporativo: 'un evento corporativo', cumple: 'un cumpleaños' }[estado.tipo];
    cta.href = `https://wa.me/${WSP}?text=${encodeURIComponent(
      `Hola Servicios Bebidas, armé la barra en la web para ${tipoTxt}:\n\n` +
      `Invitados: ${invitados}\nDuración: ${horas} horas\nBebida: ${estado.alcohol === 'si' ? 'con alcohol' : 'sin alcohol'}\n\n` +
      `${detalle}\n• Hielo: ${hielo} kg\n• Copas y vasos: ${vasos}\n\n¿Me pasan la cotización?`
    )}`;
  };

  inv.addEventListener('input', calcular);
  hrs.addEventListener('input', calcular);
  document.querySelectorAll('[data-tipo]').forEach(b => b.addEventListener('click', () => {
    estado.tipo = b.dataset.tipo;
    document.querySelectorAll('[data-tipo]').forEach(x => x.classList.toggle('is-on', x === b));
    calcular();
  }));
  document.querySelectorAll('[data-alcohol]').forEach(b => b.addEventListener('click', () => {
    estado.alcohol = b.dataset.alcohol;
    document.querySelectorAll('[data-alcohol]').forEach(x => x.classList.toggle('is-on', x === b));
    calcular();
  }));
  calcular();
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const heroImg = document.querySelector('.hero-foto img');
  if (heroImg) {
    gsap.fromTo(heroImg, { scale: 1.1 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 }
    });
  }
  const luz = document.querySelector('.hero-luz');
  if (luz) {
    gsap.to(luz, { yPercent: 22, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
  }
}

function initAnio() {
  const el = document.getElementById('anio');
  if (el) el.textContent = new Date().getFullYear();
}

function initSEO() {
  const base = 'https://serviciosbebidas.com.ar/';
  const graph = PRODUCTOS.map(p => ({
    '@type': 'Product',
    name: p.nombre,
    image: base + p.img,
    description: p.desc,
    category: nombreCat(p.cat),
    brand: { '@type': 'Brand', name: 'Servicios Bebidas' },
    offers: {
      '@type': 'Offer',
      price: precioFinal(p),
      priceCurrency: 'ARS',
      availability: 'https://schema.org/InStock',
      url: base + '#tienda'
    }
  }));
  const tag = document.createElement('script');
  tag.type = 'application/ld+json';
  tag.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  document.head.appendChild(tag);
}

initCategorias();
initRail();
initCatalogo();
initReveals();
initNav();
initScrollProgress();
initAcciones();
initOverlays();
initFloats();
initServicios();
initBarra();
initParallax();
initAnio();
initSEO();
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
