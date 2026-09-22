const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493434510002';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const wsp = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

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

/* ===== Datos ===== */
const CATEGORIAS = [
  { id: 'bdsm-cuero', nombre: 'BDSM y cuero', pie: 'Arneses, tiras y accesorios', img: 'images/cuero-textura-negro.webp' },
  { id: 'lenceria', nombre: 'Lencería', pie: 'Talles reales, del 85 al 130', img: 'images/lenceria-bralette-borgona.webp' },
  { id: 'juguetes-bienestar', nombre: 'Juguetes y bienestar', pie: 'Placer y cuidado íntimo', img: 'images/bienestar-velas-aceite.webp' },
];

const TALLES_LENCERIA = [85, 90, 95, 100, 105, 110, 115, 120, 125, 130];
const TALLES_ARNES = ['S', 'M', 'L', 'XL'];

const PRODUCTOS = [
  { id: 'p01', nombre: 'Collar de cuero con argolla', cat: 'bdsm-cuero', material: 'Cuero genuino', tono: 'Marrón', precio: 24000, descuento: 0, talles: [], stock: 8, img: 'images/cuero-correa-hebilla.webp', imgPos: '50% 28%', etiquetas: ['collar', 'cuero', 'argolla', 'bdsm'], desc: 'Collar angosto de cuero genuino con hebilla metálica ajustable y argolla frontal para correa. Cierre regulable para distintos contornos de cuello.' },
  { id: 'p02', nombre: 'Muñequeras de cuero (par)', cat: 'bdsm-cuero', material: 'Cuero genuino', tono: 'Marrón', precio: 19000, descuento: 0, talles: [], stock: 10, img: 'images/cuero-correa-hebilla.webp', imgPos: '50% 72%', etiquetas: ['muñequeras', 'cuero', 'ataduras'], desc: 'Par de muñequeras de cuero forradas por dentro, con hebilla metálica ajustable. Se adaptan a distintos contornos de muñeca.' },
  { id: 'p03', nombre: 'Arnés de cuero minimalista', cat: 'bdsm-cuero', material: 'Cuero sintético', tono: 'Negro', precio: 42000, descuento: 10, talles: ['S', 'M', 'L', 'XL'], stock: 5, img: 'images/cuero-textura-negro.webp', imgPos: '50% 50%', etiquetas: ['arnes', 'cuero', 'negro'], desc: 'Arnés corporal de tiras finas con herrajes metálicos. Diseño minimalista, se ajusta al cuerpo sin marcar de más.' },
  { id: 'p04', nombre: 'Fusta de cuero trenzada', cat: 'bdsm-cuero', material: 'Cuero trenzado', tono: 'Marrón', precio: 17000, descuento: 0, talles: [], stock: 12, img: 'images/cuero-textura-marron.webp', imgPos: '50% 50%', etiquetas: ['fusta', 'cuero', 'trenzada'], desc: 'Fusta de cuero trenzado, mango firme y punta flexible. Largo total 45 cm.' },
  { id: 'p05', nombre: 'Conjunto de encaje rojo y negro', cat: 'lenceria', material: 'Encaje y tul', tono: 'Rojo', precio: 28000, descuento: 0, talles: [85, 90, 95, 100, 105, 110, 115, 120], stock: 6, img: 'images/lenceria-conjunto-encaje-rojo.webp', imgPos: '50% 16%', etiquetas: ['conjunto', 'encaje', 'rojo'], desc: 'Conjunto de corpiño y bombacha en encaje semitransparente, breteles regulables. Disponible en talles reales desde el 85.' },
  { id: 'p06', nombre: 'Bralette de encaje borgoña', cat: 'lenceria', material: 'Encaje', tono: 'Borgoña', precio: 19000, descuento: 15, talles: [85, 90, 95, 100, 105, 110], stock: 9, img: 'images/lenceria-bralette-borgona.webp', imgPos: '50% 45%', etiquetas: ['bralette', 'encaje', 'borgoña'], desc: 'Bralette triangular de encaje sin aros, breteles cruzados regulables y cierre trasero de corchetes.' },
  { id: 'p07', nombre: 'Conjunto talle grande de encaje', cat: 'lenceria', material: 'Encaje', tono: 'Borgoña', precio: 26000, descuento: 0, talles: [110, 115, 120, 125, 130], stock: 7, img: 'images/lenceria-bralette-borgona.webp', imgPos: '50% 55%', etiquetas: ['conjunto', 'talle grande', 'encaje'], desc: 'Conjunto pensado para talles reales grandes, breteles anchos y base de contención firme. Del 110 al 130.' },
  { id: 'p08', nombre: 'Kit de bienestar: velas y aceite de masajes', cat: 'juguetes-bienestar', material: 'Cera de soja', tono: 'Ámbar', precio: 15000, descuento: 0, talles: [], stock: 14, img: 'images/bienestar-velas-aceite.webp', imgPos: '50% 45%', etiquetas: ['velas', 'aceite', 'masajes'], desc: 'Set de dos velas de masaje en cera de soja y aceite corporal a base de almendras, se derrite a baja temperatura.' },
  { id: 'p09', nombre: 'Lubricante íntimo base agua 100ml', cat: 'juguetes-bienestar', material: 'Base acuosa', tono: '—', precio: 6500, descuento: 0, talles: [], stock: 20, img: null, etiquetas: ['lubricante', 'base agua'], desc: 'Lubricante íntimo a base de agua, compatible con preservativo y juguetes de silicona. Sin perfume.' },
  { id: 'p10', nombre: 'Vibrador clásico recargable', cat: 'juguetes-bienestar', material: 'Silicona médica', tono: '—', precio: 23000, descuento: 0, talles: [], stock: 4, img: null, etiquetas: ['vibrador', 'recargable', 'silicona'], desc: 'Vibrador de silicona médica con carga USB y varias intensidades. Sumergible, fácil de higienizar.' },
];

/* ===== Cart canónico ===== */
const Cart = {
  KEY: 'sadosextoy_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, talle, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.talle === (talle || null));
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, talle: talle || null, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && i.talle === (talle || null)))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

/* ===== Render de producto ===== */
function medioHTML(p) {
  if (!p.img) return placaHTML(p);
  return `<img src="${p.img}" alt="${esc(p.nombre)}" width="1200" height="1500" style="object-position:${p.imgPos || '50% 50%'}" loading="lazy" decoding="async">`;
}
function placaHTML(p) {
  return `<div class="prod__placa"><b>${esc(p.nombre)}</b><span>Foto próximamente</span></div>`;
}

function cardHTML(p) {
  const final = precioFinal(p);
  const badges = [];
  if (p.descuento > 0) badges.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.stock <= 5) badges.push(`<span class="badge badge--ink">Quedan ${p.stock}</span>`);
  const talles = p.talles.length ? `<p class="prod__talles">Talles ${p.talles[0]} a ${p.talles[p.talles.length - 1]}</p>` : '';

  return `<article class="prod" data-id="${p.id}" data-animate style="opacity:0;transform:translateY(24px)">
    <div style="position:relative">
      ${badges.length ? `<div class="prod__badges">${badges.join('')}</div>` : ''}
      <button type="button" class="prod__foto" data-ver="${p.id}" aria-label="Ver ${esc(p.nombre)}">
        ${medioHTML(p)}
        <span class="prod__ver">Ver la ficha</span>
      </button>
    </div>
    <div class="prod__body">
      <span class="prod__cat">${esc(CATEGORIAS.find(c => c.id === p.cat)?.nombre || '')}</span>
      <h3 class="prod__nom">${esc(p.nombre)}</h3>
      <div class="prod__precios">
        <span class="prod__precio${p.descuento > 0 ? ' prod__precio--off' : ''}">${formatearPrecio(final)}</span>
        ${p.descuento > 0 ? `<s class="prod__antes">${formatearPrecio(p.precio)}</s>` : ''}
      </div>
      ${talles}
      <div class="prod__actions">
        ${p.talles.length
          ? `<button type="button" class="prod-add" data-ver="${p.id}">Elegir talle</button>`
          : `<span class="stepper"><button type="button" data-step="-1" data-id="${p.id}" aria-label="Quitar uno">−</button><span data-qty="${p.id}">1</span><button type="button" data-step="1" data-id="${p.id}" aria-label="Sumar uno">+</button></span>
             <button type="button" class="prod-add" data-add-directo="${p.id}">Agregar</button>`}
      </div>
    </div>
  </article>`;
}

/* ===== Catálogo: filtros + búsqueda ===== */
const estado = { q: '', pagina: 1 };

function leerFiltros(grupo) {
  return [...document.querySelectorAll(`input[data-f="${grupo}"]:checked`)].map(i => i.value);
}

function filtrar() {
  const q = normalizar(estado.q).split(/\s+/).filter(Boolean);
  const cats = leerFiltros('cat');
  const talles = leerFiltros('talle');
  const precios = leerFiltros('precio');

  return PRODUCTOS.filter(p => {
    if (cats.length && !cats.includes(p.cat)) return false;
    if (talles.length && !talles.some(t => p.talles.map(String).includes(t))) return false;
    if (precios.length) {
      const v = precioFinal(p);
      const ok = precios.some(r => (r === 'bajo' && v < 15000) || (r === 'medio' && v >= 15000 && v <= 28000) || (r === 'alto' && v > 28000));
      if (!ok) return false;
    }
    if (q.length) {
      const texto = normalizar([p.nombre, p.material, p.tono, p.desc, p.etiquetas.join(' '), CATEGORIAS.find(c => c.id === p.cat)?.nombre].join(' '));
      if (!q.every(t => texto.includes(t))) return false;
    }
    return true;
  });
}

function renderCatalogo() {
  const grid = document.getElementById('catalogo');
  if (!grid) return;
  const lista = filtrar();

  if (!lista.length) {
    grid.innerHTML = `<div class="vacio"><h3>No encontramos nada con esos filtros</h3><p>Probá con otras palabras o limpiá los filtros.</p><button type="button" class="btn btn--linea btn--sm" id="vacio-limpiar" style="margin-top:1rem"><span>Limpiar filtros</span></button></div>`;
    document.getElementById('vacio-limpiar')?.addEventListener('click', limpiarFiltros);
  } else {
    grid.innerHTML = lista.map(cardHTML).join('');
  }

  const cont = document.getElementById('contador');
  if (cont) cont.innerHTML = `<b>${lista.length}</b> ${lista.length === 1 ? 'producto' : 'productos'}`;

  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function limpiarFiltros() {
  document.querySelectorAll('input[data-f]').forEach(i => { i.checked = false; });
  document.querySelectorAll('[data-cat-chip]').forEach(c => c.setAttribute('aria-pressed', 'false'));
  const q = document.getElementById('q');
  if (q) q.value = '';
  estado.q = '';
  renderCatalogo();
}

function initFiltrosTalle() {
  document.querySelectorAll('[data-filtros-talles]').forEach(cont => {
    const todos = [...TALLES_LENCERIA, ...TALLES_ARNES].map(String);
    cont.innerHTML = todos.map(t => `<label class="filtro-op filtro-op--talle"><input type="checkbox" data-f="talle" value="${t}"> ${t}</label>`).join('');
    cont.querySelectorAll('input[data-f="talle"]').forEach(inp => inp.addEventListener('change', renderCatalogo));
  });
}

function initBuscadorFiltros() {
  document.querySelectorAll('.buscador').forEach(form => {
    form.addEventListener('submit', e => { e.preventDefault(); const q = form.querySelector('input[type="search"]'); estado.q = q ? q.value : ''; renderCatalogo(); });
    form.querySelector('input[type="search"]')?.addEventListener('input', e => { estado.q = e.target.value; renderCatalogo(); });
  });
  document.querySelectorAll('input[data-f="cat"], input[data-f="precio"]').forEach(i => i.addEventListener('change', renderCatalogo));
  document.querySelectorAll('[data-limpiar-filtros]').forEach(b => b.addEventListener('click', limpiarFiltros));

  document.querySelectorAll('[data-filtros-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = document.querySelector(btn.dataset.filtrosToggle);
      if (!panel) return;
      const abierto = panel.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(abierto));
      document.body.classList.toggle('no-scroll', abierto);
    });
  });
  document.querySelectorAll('[data-filtros-cerrar]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.filtros')?.classList.remove('open');
      document.body.classList.remove('no-scroll');
      document.querySelector('[data-filtros-toggle]')?.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ===== Momento propio: categorías con reorden Flip ===== */
function initCategoriaChips() {
  const chips = document.querySelectorAll('[data-cat-chip]');
  if (!chips.length) return;
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const activo = chip.getAttribute('aria-pressed') === 'true';
      chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
      const casillero = document.querySelector(`input[data-f="cat"][value="${chip.dataset.catChip}"]`);
      document.querySelectorAll('input[data-f="cat"]').forEach(i => { i.checked = false; });
      if (!activo && casillero) { casillero.checked = true; chip.setAttribute('aria-pressed', 'true'); }

      const grid = document.getElementById('catalogo');
      const puedeFlip = grid && typeof gsap !== 'undefined' && typeof Flip !== 'undefined' && !reduceMotion;
      const flipState = puedeFlip ? Flip.getState(grid.children) : null;
      renderCatalogo();
      if (puedeFlip && flipState) {
        Flip.from(flipState, { duration: .55, ease: 'power2.inOut', stagger: .02, absolute: true,
          onEnter: els => gsap.fromTo(els, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .35 }),
          onLeave: els => gsap.to(els, { opacity: 0, duration: .2 }) });
      }
      document.getElementById('tienda')?.scrollIntoView({ block: 'start' });
    });
  });

  document.querySelectorAll('[data-cat-link]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector(`[data-cat-chip="${link.dataset.catLink}"]`)?.click();
    });
  });
}

/* ===== Componente funcional: guía de talles ===== */
function initTallesGuia() {
  const form = document.getElementById('talles-guia-form');
  const input = document.getElementById('talle-medida');
  const resultado = document.getElementById('talles-guia-resultado');
  if (!form || !input || !resultado) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const medida = Number(input.value);
    if (!medida || medida < 60 || medida > 160) {
      resultado.innerHTML = '<span>Ingresá tu contorno de busto en cm (entre 60 y 160).</span>';
      return;
    }
    const talle = TALLES_LENCERIA.reduce((prev, curr) => Math.abs(curr - medida) < Math.abs(prev - medida) ? curr : prev);
    const disponibles = PRODUCTOS.filter(p => p.cat === 'lenceria' && p.talles.includes(talle));
    resultado.innerHTML = `Tu talle es <b>${talle}</b> · ${disponibles.length} ${disponibles.length === 1 ? 'producto disponible' : 'productos disponibles'}`;

    document.querySelectorAll('input[data-f="cat"]').forEach(i => { i.checked = i.value === 'lenceria'; });
    document.querySelectorAll('input[data-f="talle"]').forEach(i => { i.checked = i.value === String(talle); });
    document.querySelectorAll('[data-cat-chip]').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.catChip === 'lenceria')));
    renderCatalogo();
    document.getElementById('tienda')?.scrollIntoView({ block: 'start' });
  });
}

/* ===== Vista rápida (modal) ===== */
let ultimoFoco = null;

function abrirModal(id) {
  const p = getProducto(id);
  const back = document.getElementById('modal-backdrop');
  if (!p || !back) return;
  ultimoFoco = document.activeElement;
  const final = precioFinal(p);
  const relacionados = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);

  back.querySelector('.modal__grid').innerHTML = `
    <div class="modal__foto">${medioHTML(p)}</div>
    <div class="modal__info">
      <span class="modal__cat">${esc(CATEGORIAS.find(c => c.id === p.cat)?.nombre || '')}</span>
      <h2 id="modal-titulo-txt">${esc(p.nombre)}</h2>
      <div class="modal__precio">
        <b>${formatearPrecio(final)}</b>
        ${p.descuento > 0 ? `<s class="prod__antes">${formatearPrecio(p.precio)}</s><span class="badge badge--off">-${p.descuento}%</span>` : ''}
      </div>
      <p>${esc(p.desc)}</p>
      ${p.talles.length ? `<div class="modal__talles">
        <span>Elegí tu talle</span>
        <div class="modal__talles-fila" data-talles-modal="${p.id}">
          ${p.talles.map((t, i) => `<button type="button" class="talle-chip" data-talle-modal="${t}" aria-pressed="${i === 0}">${t}</button>`).join('')}
        </div>
      </div>` : ''}
      <dl class="modal__ficha">
        <div><dt>Material</dt><dd>${esc(p.material)}</dd></div>
        ${p.tono && p.tono !== '—' ? `<div><dt>Color</dt><dd>${esc(p.tono)}</dd></div>` : ''}
        <div><dt>Stock</dt><dd>${p.stock} ${p.stock === 1 ? 'unidad' : 'unidades'}</dd></div>
      </dl>
      <div class="modal__acc">
        <button type="button" class="btn btn--cta" data-modal-add="${p.id}"><span>Agregar al carrito</span></button>
        <a class="btn btn--linea" href="${wsp(`Hola, me interesa ${p.nombre} (${formatearPrecio(final)}). ¿Está disponible?`)}" target="_blank" rel="noopener"><span>Consultar</span></a>
      </div>
      ${relacionados.length ? `<div class="modal__tambien">
        <p>También te puede interesar</p>
        <div class="modal__mini">
          ${relacionados.map(r => `<button type="button" class="mini" data-ver="${r.id}"><span class="mini__foto">${medioHTML(r)}</span><span>${esc(r.nombre)}</span></button>`).join('')}
        </div>
      </div>` : ''}
    </div>`;

  const talleRow = back.querySelector(`[data-talles-modal="${p.id}"]`);
  let talleElegido = p.talles[0] ?? null;
  talleRow?.addEventListener('click', e => {
    const btn = e.target.closest('[data-talle-modal]');
    if (!btn) return;
    talleElegido = btn.dataset.talleModal;
    talleRow.querySelectorAll('.talle-chip').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
  });
  back.querySelector('[data-modal-add]')?.addEventListener('click', () => {
    Cart.add(p, talleElegido, 1);
    showToast(`${p.nombre}${talleElegido ? ` (talle ${talleElegido})` : ''} está en el carrito`);
  });

  back.hidden = false;
  requestAnimationFrame(() => back.classList.add('open'));
  document.body.classList.add('no-scroll');
  back.querySelector('.modal__cerrar')?.focus();
}

function cerrarModal() {
  const back = document.getElementById('modal-backdrop');
  if (!back) return;
  back.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { back.hidden = true; }, 260);
  ultimoFoco?.focus();
}

function initModal() {
  const back = document.getElementById('modal-backdrop');
  if (!back) return;
  document.addEventListener('click', e => {
    const verBtn = e.target.closest('[data-ver]');
    if (verBtn) { abrirModal(verBtn.dataset.ver); return; }
    if (e.target.closest('.modal__cerrar') || e.target === back) cerrarModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !back.hidden) cerrarModal(); });
}

/* ===== Drawer del carrito ===== */
function abrirDrawer() {
  const back = document.getElementById('drawer-backdrop');
  const drawer = document.getElementById('drawer');
  if (!drawer || !back) return;
  ultimoFoco = document.activeElement;
  drawer.removeAttribute('inert');
  back.classList.add('open');
  drawer.classList.add('open');
  document.body.classList.add('no-scroll');
  drawer.querySelector('button')?.focus();
}
function cerrarDrawer() {
  const back = document.getElementById('drawer-backdrop');
  const drawer = document.getElementById('drawer');
  if (!drawer || !back) return;
  back.classList.remove('open');
  drawer.classList.remove('open');
  drawer.setAttribute('inert', '');
  document.body.classList.remove('no-scroll');
  ultimoFoco?.focus();
}

function renderCarrito() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-total');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="carrito-vacio">
      <h3>Todavía no elegiste nada</h3>
      <p>Recorré el catálogo y sumá lo que te interese.</p>
      <button type="button" class="btn btn--linea btn--sm" data-cerrar-drawer><span>Ver el catálogo</span></button>
    </div>`;
  } else {
    body.innerHTML = items.map(i => {
      const p = getProducto(i.id);
      if (!p) return '';
      return `<div class="linea">
        <span class="linea__foto">${medioHTML(p)}</span>
        <span>
          <span class="linea__nom">${esc(p.nombre)}</span>
          <span class="linea__precio">${i.talle ? `Talle ${i.talle} · ` : ''}${i.qty} × ${formatearPrecio(precioFinal(p))}</span>
        </span>
        <button type="button" class="linea__quitar" data-quitar-id="${p.id}" data-quitar-talle="${i.talle ?? ''}" aria-label="Quitar ${esc(p.nombre)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>`;
    }).join('');
  }
  if (foot) foot.textContent = formatearPrecio(Cart.total());
  const finalizar = document.getElementById('finalizar');
  if (finalizar) finalizar.disabled = !items.length;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function initCarrito() {
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', abrirDrawer));
  document.getElementById('drawer-cerrar')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click', cerrarDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.getElementById('drawer')?.classList.contains('open')) cerrarDrawer(); });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-drawer]')) cerrarDrawer();
    const quitar = e.target.closest('[data-quitar-id]');
    if (quitar) Cart.remove(quitar.dataset.quitarId, quitar.dataset.quitarTalle || null);
  });
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const span = document.querySelector(`[data-qty="${step.dataset.id}"]`);
      if (!span) return;
      const val = Math.max(1, Number(span.textContent) + Number(step.dataset.step));
      span.textContent = String(val);
    }
    const addDirecto = e.target.closest('[data-add-directo]');
    if (addDirecto) {
      const p = getProducto(addDirecto.dataset.addDirecto);
      const span = document.querySelector(`[data-qty="${p.id}"]`);
      const qty = span ? Number(span.textContent) : 1;
      Cart.add(p, null, qty);
      showToast(`${p.nombre} está en el carrito`);
    }
  });
  document.getElementById('finalizar')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', () => { renderCarrito(); updateCartBadge(); });
  renderCarrito();
  updateCartBadge();
}

/* ===== Flotantes ===== */
function initFloats() {
  const wspBtn = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wspBtn?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', abrirDrawer);
  sync();
}

/* ===== Nav mobile ===== */
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
  const syncInert = () => { if (desktopMq.matches) nav.removeAttribute('inert'); else if (!nav.classList.contains('open')) nav.setAttribute('inert', ''); };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

/* ===== Reveals ===== */
let revealsListos = false;
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  revealsListos = true;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.08, 0.5)}s`; });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) { items.forEach(el => el.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); } });
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
    if (!pending) { window.removeEventListener('scroll', queueSweep); window.removeEventListener('resize', queueSweep); }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}
function revelarNuevos(cont) {
  if (!revealsListos) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.3)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

/* ===== Movimiento ===== */
function initMovimiento() {
  if (typeof gsap === 'undefined') { document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; }); return; }
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof Flip !== 'undefined') gsap.registerPlugin(Flip);
  if (reduceMotion) return;
  const heroImg = document.querySelector('.hero-pantalla__foto img');
  if (heroImg) gsap.fromTo(heroImg, { scale: 1.07 }, { scale: 1, duration: 1.4, ease: 'power2.out' });
  window.addEventListener('load', () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); });
}

function initNewsletter() {
  const form = document.getElementById('form-newsletter');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.reset();
    showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const anio = document.getElementById('anio');
  if (anio) anio.textContent = String(new Date().getFullYear());
  initNav();
  initFiltrosTalle();
  initBuscadorFiltros();
  initCategoriaChips();
  initTallesGuia();
  initNewsletter();
  renderCatalogo();
  initModal();
  initCarrito();
  initFloats();
  initMovimiento();
  initReveals();
});
