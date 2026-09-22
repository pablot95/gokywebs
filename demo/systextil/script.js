document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491150107918';
const MINIMO_PRENDAS = 15;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const OFF = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;

const CATEGORIAS = {
  corseteria: 'Corsetería',
  conjuntos: 'Conjuntos de encaje',
  pijamas: 'Pijamas y batas',
  accesorios: 'Accesorios'
};

const PRODUCTOS = [
  { id: 'c1', nombre: 'Corsé nude con ballenas', cat: 'corseteria', marca: 'Rosa Nude', precio: 22900, descuento: 0, nuevo: true, stock: 30, foto: 'images/corset.webp' },
  { id: 'c2', nombre: 'Corsé negro strapless', cat: 'corseteria', marca: 'Noir Line', precio: 24500, descuento: 0, stock: 24, foto: null, placa: 'C' },
  { id: 'c3', nombre: 'Body modelador con breteles', cat: 'corseteria', marca: 'Bellezza', precio: 18900, descuento: 10, stock: 28, foto: null, placa: 'B' },
  { id: 'c4', nombre: 'Faja short reductora', cat: 'corseteria', marca: 'Bellezza', precio: 15400, descuento: 0, stock: 40, foto: null, placa: 'F' },
  { id: 'c5', nombre: 'Corsé bordado rojo', cat: 'corseteria', marca: 'Rosa Nude', precio: 23800, descuento: 0, stock: 18, foto: null, placa: 'C' },

  { id: 'j1', nombre: 'Conjunto de encaje esmeralda', cat: 'conjuntos', marca: 'Encaje Sur', precio: 16900, descuento: 0, nuevo: true, stock: 26, foto: 'images/setverde.webp' },
  { id: 'j2', nombre: 'Conjunto de encaje negro clásico', cat: 'conjuntos', marca: 'Noir Line', precio: 17800, descuento: 0, stock: 32, foto: 'images/vertical.webp' },
  { id: 'j3', nombre: 'Conjunto de encaje rosa palo', cat: 'conjuntos', marca: 'Rosa Nude', precio: 16400, descuento: 0, stock: 22, foto: null, placa: 'J' },
  { id: 'j4', nombre: 'Bralette + culotte de algodón', cat: 'conjuntos', marca: 'Bellezza', precio: 12900, descuento: 0, stock: 35, foto: null, placa: 'B' },
  { id: 'j5', nombre: 'Conjunto push-up animal print', cat: 'conjuntos', marca: 'Encaje Sur', precio: 18200, descuento: 15, stock: 14, foto: null, placa: 'J' },
  { id: 'j6', nombre: 'Conjunto de encaje blanco novia', cat: 'conjuntos', marca: 'Rosa Nude', precio: 19200, descuento: 0, stock: 12, foto: null, placa: 'J' },

  { id: 'p1', nombre: 'Pijama de satén floral', cat: 'pijamas', marca: 'Bellezza', precio: 19800, descuento: 0, nuevo: true, stock: 20, foto: 'images/pijama.webp' },
  { id: 'p2', nombre: 'Bata de satén lisa', cat: 'pijamas', marca: 'Bellezza', precio: 17500, descuento: 0, stock: 25, foto: null, placa: 'B' },
  { id: 'p3', nombre: 'Pijama short + musculosa', cat: 'pijamas', marca: 'Rosa Nude', precio: 13900, descuento: 0, stock: 38, foto: null, placa: 'P' },
  { id: 'p4', nombre: 'Camisón de encaje', cat: 'pijamas', marca: 'Encaje Sur', precio: 14800, descuento: 0, stock: 22, foto: null, placa: 'C' },
  { id: 'p5', nombre: 'Set de pijama térmico', cat: 'pijamas', marca: 'Bellezza', precio: 16800, descuento: 0, stock: 30, foto: null, placa: 'P' },

  { id: 'a1', nombre: 'Pack de accesorios: medias, antifaz y vincha', cat: 'accesorios', marca: 'Rosa Nude', precio: 9800, descuento: 0, nuevo: true, stock: 45, foto: 'images/surtido.webp' },
  { id: 'a2', nombre: 'Portaligas de encaje', cat: 'accesorios', marca: 'Noir Line', precio: 7400, descuento: 0, stock: 33, foto: null, placa: 'A' },
  { id: 'a3', nombre: 'Medias de red', cat: 'accesorios', marca: 'Noir Line', precio: 5200, descuento: 0, stock: 50, foto: null, placa: 'M' },
  { id: 'a4', nombre: 'Antifaz de satén', cat: 'accesorios', marca: 'Rosa Nude', precio: 4100, descuento: 0, stock: 42, foto: null, placa: 'A' },
  { id: 'a5', nombre: 'Set de 3 bombachas de algodón', cat: 'accesorios', marca: 'Bellezza', precio: 8900, descuento: 20, stock: 36, foto: null, placa: 'S' }
];

const DESTACADOS = ['j1', 'c1', 'p1', 'j2', 'a1', 'c3'];
const ESCENA_PIEZAS = ['c1', 'j1', 'j2', 'p1', 'a1'];

/* ============================ CARRITO ============================ */
const Cart = {
  KEY: 'systextil_cart',
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
  return `<span class="placa-generica"><span aria-hidden="true">${esc(p.placa || p.nombre.charAt(0))}</span></span>`;
}
function preciosHTML(p) {
  if (p.descuento > 0) return `<div class="prod__precios"><span class="prod__precio prod__precio--off">${formatearPrecio(precioFinal(p))}</span><s>${formatearPrecio(p.precio)}</s></div>`;
  return `<div class="prod__precios"><span class="prod__precio">${formatearPrecio(p.precio)}</span></div>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.nuevo) b.push('<span class="badge badge--nuevo">Nuevo</span>');
  return b.length ? `<div class="prod__badges">${b.join('')}</div>` : '';
}

/* ============================ MOSAICO ============================ */
function renderMosaico() {
  const grid = document.getElementById('mosaicoGrid');
  if (!grid) return;
  const ids = ['j2', 'c2', 'j3', 'p2', 'a2', 'c4'];
  grid.innerHTML = ids.map((id, i) => {
    const p = getProducto(id); if (!p) return '';
    const grande = i === 0 ? ' mosaico-item--grande' : '';
    return `<button type="button" class="mosaico-item${grande} cascada" style="--i:${i}" data-abrir="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      ${fotoHTML(p, i > 1)}
      <span class="placa-precio">${formatearPrecio(precioFinal(p))}<small>${esc(CATEGORIAS[p.cat])}</small></span>
    </button>`;
  }).join('');
}

/* ============================ RAIL ============================ */
function renderRail() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  track.innerHTML = DESTACADOS.map((id, i) => {
    const p = getProducto(id); if (!p) return '';
    return `<article class="rail-card cascada" style="--i:${i}">
      <button type="button" class="rail-card__foto" data-abrir="${p.id}" aria-label="Ver ${esc(p.nombre)}">${fotoHTML(p, false)}</button>
      <div class="rail-card__cuerpo">
        <span class="rail-card__marca">${esc(p.marca)}</span>
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
  vp.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') return; down = true; moved = false; startX = e.clientX; startScroll = vp.scrollLeft; pointerId = e.pointerId; });
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
  const paso = () => (vp.querySelector('.rail-card')?.getBoundingClientRect().width || 220) + 16;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

/* ============================ CATÁLOGO ============================ */
const estado = { q: '', cats: [], marcas: [], precios: [], orden: 'destacados', visibles: 16 };
const PASO_CATALOGO = 16;

function filtrados() {
  const q = normalizar(estado.q).split(/\s+/).filter(Boolean);
  let lista = PRODUCTOS.filter(p => {
    if (estado.cats.length && !estado.cats.includes(p.cat)) return false;
    if (estado.marcas.length && !estado.marcas.includes(p.marca)) return false;
    if (estado.precios.length) {
      const v = precioFinal(p);
      const entra = estado.precios.some(r => { const [a, b] = r.split('-').map(Number); return v >= a && v <= b; });
      if (!entra) return false;
    }
    if (q.length) {
      const texto = normalizar([p.nombre, p.marca, CATEGORIAS[p.cat]].join(' '));
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
      </button>
      <div class="prod__cuerpo">
        <span class="prod__marca">${esc(p.marca)}</span>
        <h3 class="prod__nombre">${esc(p.nombre)}</h3>
        ${preciosHTML(p)}
        <div class="prod__actions">
          <span class="stepper">
            <button type="button" data-step="-1" data-id="${p.id}" aria-label="Quitar uno">&minus;</button>
            <output data-qty="${p.id}">1</output>
            <button type="button" data-step="1" data-id="${p.id}" aria-label="Sumar uno">+</button>
          </span>
          <button type="button" class="btn btn-cta btn-sm prod-add" data-add="${p.id}">Agregar</button>
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
  estado.cats = val('cat'); estado.marcas = val('marca'); estado.precios = val('precio');
  estado.visibles = PASO_CATALOGO;
  renderCatalogo();
}

function sincronizarBuscadores(valor) {
  ['buscador', 'buscadorHeader', 'buscadorHero'].forEach(id => {
    const el = document.getElementById(id);
    if (el && el.value !== valor) el.value = valor;
  });
}

function buscarYRenderizar(valor) {
  estado.q = valor; estado.visibles = PASO_CATALOGO;
  sincronizarBuscadores(valor);
  renderCatalogo();
}

function filtrarPorCategoria(cat) {
  document.querySelectorAll('input[data-f]').forEach(i => { i.checked = false; });
  const chk = document.querySelector(`input[data-f="cat"][value="${cat}"]`);
  if (chk) chk.checked = true;
  buscarYRenderizar('');
  leerFiltros();
  const destino = document.getElementById('tienda');
  if (destino) window.scrollTo({ top: destino.getBoundingClientRect().top + window.scrollY - OFF() - 8, behavior: reduceMotion ? 'auto' : 'smooth' });
  showToast(`Filtrado por ${CATEGORIAS[cat]}`);
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;

  document.querySelectorAll('input[data-f="cat"], input[data-f="marca"], input[data-f="precio"]').forEach(i => i.addEventListener('change', leerFiltros));

  const forms = [
    ['buscadorForm', 'buscador'],
    ['buscadorFormHeader', 'buscadorHeader'],
    ['buscadorFormHero', 'buscadorHero']
  ];
  let t;
  forms.forEach(([formId, inputId]) => {
    const form = document.getElementById(formId);
    const input = document.getElementById(inputId);
    if (!form || !input) return;
    input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => buscarYRenderizar(input.value), 180); });
    form.addEventListener('submit', e => { e.preventDefault(); buscarYRenderizar(input.value); input.blur(); scrollToTienda(); });
  });

  function scrollToTienda() {
    const destino = document.getElementById('tienda');
    if (destino) window.scrollTo({ top: destino.getBoundingClientRect().top + window.scrollY - OFF() - 8, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  document.getElementById('orden')?.addEventListener('change', e => { estado.orden = e.target.value; renderCatalogo(); });
  document.getElementById('verMas')?.addEventListener('click', () => { estado.visibles += PASO_CATALOGO; renderCatalogo(); });
  document.getElementById('limpiarFiltros')?.addEventListener('click', () => {
    document.querySelectorAll('input[data-f]').forEach(i => { i.checked = false; });
    buscarYRenderizar(''); leerFiltros();
    showToast('Listo, mostramos todo de nuevo');
  });
  document.getElementById('verTodoVacio')?.addEventListener('click', () => {
    document.querySelectorAll('input[data-f]').forEach(i => { i.checked = false; });
    buscarYRenderizar(''); leerFiltros();
  });

  const toggle = document.getElementById('filtrosToggle');
  const panel = document.getElementById('filtros');
  toggle?.addEventListener('click', () => {
    const abierto = panel.classList.toggle('abierto');
    toggle.setAttribute('aria-expanded', String(abierto));
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });

  document.getElementById('btnBuscarHeader')?.addEventListener('click', () => {
    scrollToTienda();
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
    if (cat && cat.dataset.cat && CATEGORIAS[cat.dataset.cat]) filtrarPorCategoria(cat.dataset.cat);
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
        <span class="prod__marca">${esc(CATEGORIAS[p.cat])} · ${esc(p.marca)}</span>
        <h3>${esc(p.nombre)}</h3>
        <div class="modal__precios">
          <span class="modal__precio">${formatearPrecio(precioFinal(p))}</span>
          ${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s><span class="badge badge--off">-${p.descuento}%</span>` : ''}
        </div>
        <p class="modal__desc">Pieza de nuestro surtido mayorista ${esc(p.marca)}. Consultanos variantes de talle y color disponibles para tu pedido.</p>
        <ul class="modal__ficha">
          <li><span>Categoría</span><b>${esc(CATEGORIAS[p.cat])}</b></li>
          <li><span>Marca</span><b>${esc(p.marca)}</b></li>
          <li><span>Disponible</span><b>${p.stock} unidades</b></li>
        </ul>
        <div class="modal__actions">
          <span class="stepper">
            <button type="button" data-step="-1" data-id="${p.id}" aria-label="Quitar uno">&minus;</button>
            <output data-qty="${p.id}">1</output>
            <button type="button" data-step="1" data-id="${p.id}" aria-label="Sumar uno">+</button>
          </span>
          <button type="button" class="btn btn-cta btn-sm" data-add="${p.id}">Agregar al carrito</button>
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
  const minimoEl = document.getElementById('drawerMinimo');
  if (!body) return;
  const items = Cart.get();
  const prendas = Cart.count();

  if (minimoEl) {
    minimoEl.innerHTML = prendas >= MINIMO_PRENDAS
      ? `✓ Llegaste al mínimo mayorista (<strong>${prendas}/${MINIMO_PRENDAS}</strong> prendas)`
      : `Te faltan <strong>${MINIMO_PRENDAS - prendas} prendas</strong> para el mínimo mayorista (${prendas}/${MINIMO_PRENDAS})`;
  }

  if (!items.length) {
    body.innerHTML = `<div class="carrito-vacio">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.3"/><circle cx="17.5" cy="20" r="1.3"/></svg>
      <p>Todavía no armaste tu pedido. Recordá que el mínimo mayorista es de ${MINIMO_PRENDAS} prendas.</p>
      <button type="button" class="btn btn-ghost btn-sm boton-margen-top" id="drawerAlCatalogo">Ir al catálogo</button>
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
    const p = getProducto(i.id); if (!p) return '';
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
  document.getElementById('finalizar')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));

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

/* ============================ COMPONENTE FUNCIONAL: ARMÁ TU SURTIDO ============================ */
function initSurtido(root) {
  const cont = root.querySelector('.surtido');
  if (!cont) return;
  const chips = [...cont.querySelectorAll('input[data-f="surtido-cat"]')];
  const qtyOut = cont.querySelector('#surtidoQty');
  const btnMenos = cont.querySelector('#surtidoMenos');
  const btnMas = cont.querySelector('#surtidoMas');
  const totalPrendasEl = cont.querySelector('#surtidoTotalPrendas');
  const barraEl = cont.querySelector('#surtidoBarra');
  const notaEl = cont.querySelector('#surtidoNota');
  const piezasEl = cont.querySelector('#surtidoPiezas');
  const totalPrecioEl = cont.querySelector('#surtidoTotalPrecio');
  const btnAdd = cont.querySelector('#surtidoAdd');
  const btnWsp = cont.querySelector('#surtidoWsp');
  let actual = [];

  const armar = () => {
    const cats = chips.filter(c => c.checked).map(c => c.value);
    const porCategoria = parseInt(qtyOut.textContent, 10) || 1;
    actual = [];
    cats.forEach(cat => {
      const disponibles = PRODUCTOS.filter(p => p.cat === cat);
      for (let i = 0; i < porCategoria && disponibles.length; i++) {
        actual.push(disponibles[i % disponibles.length]);
      }
    });

    const totalPrendas = actual.length;
    const totalPrecio = actual.reduce((s, p) => s + precioFinal(p), 0);

    totalPrendasEl.textContent = `${totalPrendas} prenda${totalPrendas === 1 ? '' : 's'}`;
    barraEl.style.width = Math.min(100, (totalPrendas / MINIMO_PRENDAS) * 100) + '%';
    totalPrecioEl.textContent = formatearPrecio(totalPrecio);

    if (!cats.length) notaEl.innerHTML = 'Elegí al menos una categoría para empezar.';
    else if (totalPrendas >= MINIMO_PRENDAS) notaEl.innerHTML = `<strong>¡Llegaste al mínimo mayorista!</strong> (${totalPrendas}/${MINIMO_PRENDAS})`;
    else notaEl.innerHTML = `Te faltan <strong>${MINIMO_PRENDAS - totalPrendas}</strong> prendas para el mínimo (${totalPrendas}/${MINIMO_PRENDAS}). Sumá otra categoría o más cantidad.`;

    piezasEl.innerHTML = actual.map(p => `<div class="surtido-pieza">
        <span class="surtido-pieza__foto">${fotoHTML(p, true)}</span>
        <span class="surtido-pieza__txt"><b>${esc(p.nombre)}</b><span>${esc(p.marca)}</span></span>
        <span class="surtido-pieza__p">${formatearPrecio(precioFinal(p))}</span>
      </div>`).join('') || '<p class="elegi__vacio">Sin piezas todavía.</p>';

    const detalle = actual.map(p => p.nombre).join(', ');
    const msg = actual.length
      ? `Hola! Quiero armar un pedido mayorista con este surtido: ${detalle}. Total estimado ${formatearPrecio(totalPrecio)}. ¿Me confirmás disponibilidad?`
      : 'Hola, quiero hacer un pedido mayorista.';
    btnWsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
  };

  chips.forEach(c => c.addEventListener('change', armar));
  btnMenos?.addEventListener('click', () => { qtyOut.textContent = Math.max(1, (parseInt(qtyOut.textContent, 10) || 1) - 1); armar(); });
  btnMas?.addEventListener('click', () => { qtyOut.textContent = Math.min(10, (parseInt(qtyOut.textContent, 10) || 1) + 1); armar(); });
  btnAdd?.addEventListener('click', () => {
    if (!actual.length) { showToast('Elegí al menos una categoría primero'); return; }
    actual.forEach(p => Cart.add(p, 1));
    showToast(`Sumamos ${actual.length} prendas al carrito`);
    abrirDrawer();
  });

  armar();
}

/* ============================ MOMENTO PROPIO: ASÍ SE ARMA EL PEDIDO MÍNIMO ============================ */
function initEscena() {
  const escena = document.getElementById('escenaScroll') || document.getElementById('escena');
  if (!escena || !escena.classList.contains('escena')) return;
  const sticky = escena.querySelector('.escena-sticky');
  const fotos = [...escena.querySelectorAll('.escena-foto')];
  const fichas = [...escena.querySelectorAll('.escena-ficha')];
  const numEl = escena.querySelector('.escena-num');
  const badgeEl = escena.querySelector('.escena-badge');
  const meterNum = escena.querySelector('#escenaMeterNum');
  const meterBarra = escena.querySelector('#escenaMeterBarra');
  const wspBtn = escena.querySelector('#escenaWsp');
  const piezas = ESCENA_PIEZAS.map(getProducto).filter(Boolean);
  const CHECKPOINTS = [3, 6, 9, 12, 15];
  const TOTAL = piezas.length;
  if (!sticky || !TOTAL) return;
  let ultimo = -1;

  const aplicar = i => {
    if (i === ultimo) return;
    ultimo = i;
    fotos.forEach((f, idx) => f.classList.toggle('on', idx === i));
    fichas.forEach((f, idx) => { f.classList.toggle('on', idx <= i); f.classList.toggle('actual', idx === i); });
    const acumulado = CHECKPOINTS[i];
    if (numEl) numEl.innerHTML = `${String(acumulado).padStart(2, '0')}<small>/${MINIMO_PRENDAS}</small>`;
    if (meterNum) meterNum.textContent = `${acumulado} / ${MINIMO_PRENDAS}`;
    if (meterBarra) meterBarra.style.width = Math.min(100, (acumulado / MINIMO_PRENDAS) * 100) + '%';
    const alMinimo = acumulado >= MINIMO_PRENDAS;
    if (badgeEl) badgeEl.textContent = alMinimo ? '¡Mínimo alcanzado!' : 'Sumando';
    if (wspBtn) {
      const detalle = piezas.slice(0, i + 1).map(p => p.nombre).join(', ');
      wspBtn.href = `https://wa.me/${WSP}?text=${encodeURIComponent(`Hola! Quiero pedir este surtido: ${detalle}. ¿Está disponible?`)}`;
    }
  };

  const medir = () => {
    const recorrido = escena.offsetHeight - sticky.offsetHeight;
    if (recorrido <= 0) { aplicar(TOTAL - 1); return; }
    const p = Math.min(1, Math.max(0, (OFF() - escena.getBoundingClientRect().top) / recorrido));
    aplicar(Math.min(TOTAL - 1, Math.floor(p * TOTAL)));
  };

  window.addEventListener('scroll', medir, { passive: true });
  window.addEventListener('resize', medir, { passive: true });
  window.addEventListener('load', medir);
  medir();
}

/* ============================ NAV ============================ */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
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
    parent.querySelectorAll('[data-animate]').forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.1, 0.6)}s`; });
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

/* ============================ HERO (solo la foto, decorativo) ============================ */
function initHero() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const fondo = document.querySelector('.hero-full__media img');
  if (fondo) gsap.fromTo(fondo, { scale: 1.06 }, { scale: 1, duration: 1.3, ease: 'power3.out' });
}

/* ============================ ARRANQUE ============================ */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('cart:updated', updateCartBadge);

initNav();
renderMosaico();
renderRail();
initRailDrag();
initCatalogo();
initDrawer();
initFloats();
initSurtido(document);
initEscena();
initHero();
updateCartBadge();
initReveals();
