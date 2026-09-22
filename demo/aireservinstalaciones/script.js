const WHATSAPP_NUMBER = '5491125825314';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const waLink = lines => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;

/* ===== Datos: categorias, marcas, tipos de equipo, repuestos ===== */
const CATEGORIAS = [
  { id: 'compresores', label: 'Compresores' },
  { id: 'motores', label: 'Motores y turbinas' },
  { id: 'capacitores', label: 'Capacitores y arranque' },
  { id: 'filtros', label: 'Filtros' },
  { id: 'controles', label: 'Controles y placas' },
  { id: 'gas', label: 'Gas y válvulas' },
  { id: 'caneria', label: 'Cañería y accesorios' },
];

const MARCAS = ['Samsung', 'LG', 'Surrey', 'BGH', 'Carrier', 'Daikin', 'Midea', 'Hitachi', 'Universal'];

const TIPOS_EQUIPO = [
  { id: 'split', label: 'Split' },
  { id: 'multisplit', label: 'Multisplit' },
  { id: 'cassette', label: 'Cassette y conductos' },
  { id: 'portatil', label: 'Portátil y de ventana' },
  { id: 'camara', label: 'Cámara frigorífica' },
];

const PRODUCTOS = [
  { id: 'p1', nombre: 'Compresor rotativo 12.000 BTU', categoria: 'compresores', marcas: ['Samsung'], tipos: ['split'], precio: 215000, descuento: 0 },
  { id: 'p2', nombre: 'Compresor rotativo 18.000 BTU', categoria: 'compresores', marcas: ['LG'], tipos: ['split', 'multisplit'], precio: 268000, descuento: 0 },
  { id: 'p3', nombre: 'Compresor scroll para cámara frigorífica', categoria: 'compresores', marcas: ['Universal'], tipos: ['camara'], precio: 410000, descuento: 10 },
  { id: 'p4', nombre: 'Compresor rotativo 24.000 BTU', categoria: 'compresores', marcas: ['Daikin'], tipos: ['split', 'cassette'], precio: 324000, descuento: 0 },
  { id: 'p5', nombre: 'Compresor para equipo portátil', categoria: 'compresores', marcas: ['Universal'], tipos: ['portatil'], precio: 189000, descuento: 0 },
  { id: 'p6', nombre: 'Motor de turbina interior', categoria: 'motores', marcas: ['Samsung'], tipos: ['split'], precio: 52000, descuento: 0 },
  { id: 'p7', nombre: 'Motor de ventilador exterior', categoria: 'motores', marcas: ['LG'], tipos: ['split', 'multisplit'], precio: 61500, descuento: 0 },
  { id: 'p8', nombre: 'Motor axial para condensadora', categoria: 'motores', marcas: ['Surrey'], tipos: ['split'], precio: 58000, descuento: 0 },
  { id: 'p9', nombre: 'Turbina completa con carcasa', categoria: 'motores', marcas: ['BGH'], tipos: ['split', 'portatil'], precio: 47500, descuento: 15 },
  { id: 'p10', nombre: 'Motoventilador para cámara frigorífica', categoria: 'motores', marcas: ['Universal'], tipos: ['camara'], precio: 89000, descuento: 0 },
  { id: 'p11', nombre: 'Capacitor de arranque 35uF', categoria: 'capacitores', marcas: ['Universal'], tipos: ['split', 'multisplit', 'cassette'], precio: 9800, descuento: 0 },
  { id: 'p12', nombre: 'Capacitor de arranque 45uF', categoria: 'capacitores', marcas: ['Universal'], tipos: ['split', 'cassette'], precio: 11200, descuento: 0 },
  { id: 'p13', nombre: 'Capacitor doble 40+5uF', categoria: 'capacitores', marcas: ['Universal'], tipos: ['split'], precio: 13500, descuento: 0 },
  { id: 'p14', nombre: 'Relé de arranque', categoria: 'capacitores', marcas: ['Carrier'], tipos: ['split', 'portatil'], precio: 8600, descuento: 0 },
  { id: 'p15', nombre: 'Protector térmico de compresor', categoria: 'capacitores', marcas: ['Universal'], tipos: ['split', 'camara'], precio: 10400, descuento: 0 },
  { id: 'p16', nombre: 'Filtro de aire lavable estándar', categoria: 'filtros', marcas: ['Samsung'], tipos: ['split'], precio: 7200, descuento: 0 },
  { id: 'p17', nombre: 'Filtro de aire lavable estándar', categoria: 'filtros', marcas: ['LG'], tipos: ['split'], precio: 7200, descuento: 0 },
  { id: 'p18', nombre: 'Filtro de carbón activado', categoria: 'filtros', marcas: ['Daikin'], tipos: ['split', 'multisplit'], precio: 12900, descuento: 0 },
  { id: 'p19', nombre: 'Filtro deshidratador de línea', categoria: 'filtros', marcas: ['Universal'], tipos: ['split', 'cassette', 'camara'], precio: 9600, descuento: 0 },
  { id: 'p20', nombre: 'Kit de filtros para conductos', categoria: 'filtros', marcas: ['Midea'], tipos: ['cassette'], precio: 16400, descuento: 0 },
  { id: 'p21', nombre: 'Control remoto universal', categoria: 'controles', marcas: ['Universal'], tipos: ['split', 'multisplit', 'portatil'], precio: 8400, descuento: 0 },
  { id: 'p22', nombre: 'Control remoto original', categoria: 'controles', marcas: ['Samsung'], tipos: ['split'], precio: 11900, descuento: 0 },
  { id: 'p23', nombre: 'Control remoto original', categoria: 'controles', marcas: ['LG'], tipos: ['split'], precio: 11900, descuento: 0 },
  { id: 'p24', nombre: 'Placa electrónica de control interior', categoria: 'controles', marcas: ['Hitachi'], tipos: ['split'], precio: 72000, descuento: 0 },
  { id: 'p25', nombre: 'Placa electrónica inverter exterior', categoria: 'controles', marcas: ['Daikin'], tipos: ['split', 'multisplit'], precio: 84500, descuento: 12 },
  { id: 'p26', nombre: 'Termostato digital para cámara frigorífica', categoria: 'controles', marcas: ['Universal'], tipos: ['camara'], precio: 38900, descuento: 0 },
  { id: 'p27', nombre: 'Carga de gas R410A (por kilo)', categoria: 'gas', marcas: ['Universal'], tipos: ['split', 'multisplit', 'cassette'], precio: 28500, descuento: 0 },
  { id: 'p28', nombre: 'Carga de gas R22 (por kilo)', categoria: 'gas', marcas: ['Universal'], tipos: ['split'], precio: 24900, descuento: 0 },
  { id: 'p29', nombre: 'Válvula de expansión termostática', categoria: 'gas', marcas: ['Carrier'], tipos: ['cassette', 'camara'], precio: 46000, descuento: 0 },
  { id: 'p30', nombre: 'Válvula de servicio 3/8', categoria: 'gas', marcas: ['Universal'], tipos: ['split', 'multisplit'], precio: 14200, descuento: 0 },
  { id: 'p31', nombre: 'Kit de cañería de cobre (4 metros)', categoria: 'caneria', marcas: ['Universal'], tipos: ['split'], precio: 32000, descuento: 0 },
  { id: 'p32', nombre: 'Aislante térmico para cañería (rollo)', categoria: 'caneria', marcas: ['Universal'], tipos: ['split', 'multisplit', 'cassette'], precio: 9400, descuento: 0 },
  { id: 'p33', nombre: 'Soporte de pared para condensadora', categoria: 'caneria', marcas: ['Universal'], tipos: ['split'], precio: 18600, descuento: 0 },
  { id: 'p34', nombre: 'Manguera de drenaje (5 metros)', categoria: 'caneria', marcas: ['Universal'], tipos: ['split', 'portatil'], precio: 6500, descuento: 0 },
];

const ICONOS_CATEGORIA = {
  compresores: '<rect x="6" y="4" width="12" height="16" rx="3"/><line x1="6" y1="9" x2="18" y2="9"/><line x1="6" y1="14" x2="18" y2="14"/>',
  motores: '<circle cx="12" cy="12" r="1.8"/><path d="M12 10c0-3 2-5 5-5"/><path d="M14 12c3 0 5 2 5 5"/><path d="M12 14c0 3-2 5-5 5"/><path d="M10 12c-3 0-5-2-5-5"/>',
  capacitores: '<line x1="4" y1="12" x2="9" y2="12"/><line x1="9" y1="5" x2="9" y2="19"/><line x1="15" y1="5" x2="15" y2="19"/><line x1="15" y1="12" x2="20" y2="12"/>',
  filtros: '<path d="M4 5h16l-6 8v6l-4 2v-8z"/>',
  controles: '<rect x="8" y="3" width="8" height="18" rx="2.5"/><circle cx="12" cy="7.5" r="1.1" fill="currentColor" stroke="none"/><line x1="10" y1="12" x2="14" y2="12"/><line x1="10" y1="15.5" x2="14" y2="15.5"/>',
  gas: '<path d="M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11z"/>',
  caneria: '<path d="M5 5v7a4 4 0 0 0 4 4h10"/><circle cx="5" cy="5" r="1.5" fill="currentColor" stroke="none"/><circle cx="19" cy="16" r="1.5" fill="currentColor" stroke="none"/>',
};

const catLabel = id => CATEGORIAS.find(c => c.id === id)?.label || id;

/* ===== Toast ===== */
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

/* ===== Anti-copia ===== */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

/* ===== Nav mobile ===== */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
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

/* ===== WhatsApp flotante ===== */
function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  const sync = () => btn.classList.toggle('visible', window.scrollY > 500);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

/* ===== Reveals ===== */
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.1, 0.6)}s`; });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
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

/* ===== Filtro de repuestos (estado compartido con el buscador de compatibilidad) ===== */
const filtroState = { cat: new Set(), marca: new Set(), precio: new Set(), tipoCompat: null, marcaCompat: null, q: '', orden: 'destacados' };
let visibleCount = 16;

function dentroDeBanda(precio, banda) {
  const [min, max] = banda.split('-').map(Number);
  return precio >= min && precio <= max;
}

function productosFiltrados() {
  let out = PRODUCTOS.filter(p =>
    (!filtroState.cat.size || filtroState.cat.has(p.categoria)) &&
    (!filtroState.marca.size || p.marcas.some(m => filtroState.marca.has(m))) &&
    (!filtroState.precio.size || [...filtroState.precio].some(b => dentroDeBanda(precioFinal(p), b))) &&
    (!filtroState.tipoCompat || p.tipos.includes(filtroState.tipoCompat)) &&
    (!filtroState.marcaCompat || p.marcas.includes(filtroState.marcaCompat) || p.marcas.includes('Universal')) &&
    (!filtroState.q || p.nombre.toLowerCase().includes(filtroState.q) || catLabel(p.categoria).toLowerCase().includes(filtroState.q) || p.marcas.some(m => m.toLowerCase().includes(filtroState.q)))
  );
  if (filtroState.orden === 'precio-asc') out = out.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (filtroState.orden === 'precio-desc') out = out.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (filtroState.orden === 'nombre') out = out.slice().sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return out;
}

function productoCardHTML(p) {
  const antes = p.descuento > 0 ? `<span class="producto-precio-antes">${formatearPrecio(p.precio)}</span>` : '';
  const oferta = p.descuento > 0 ? `<span class="producto-oferta">-${p.descuento}%</span>` : '';
  const marcas = p.marcas.join(' · ');
  const mensaje = waLink([`Hola, quiero consultar por este repuesto:`, `${p.nombre} (${marcas}).`, `Precio en la web: ${formatearPrecio(precioFinal(p))}.`]);
  return `<article class="producto-card">
    <div class="producto-icono-wrap">${oferta}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS_CATEGORIA[p.categoria] || ''}</svg></div>
    <p class="producto-cat">${esc(catLabel(p.categoria))}</p>
    <h3>${esc(p.nombre)}</h3>
    <p class="producto-marcas">${esc(marcas)}</p>
    <div class="producto-precio-row"><span class="producto-precio">${formatearPrecio(precioFinal(p))}</span>${antes}</div>
    <a class="btn btn-dark producto-cta" href="${mensaje}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
  </article>`;
}

function aplicarFiltros({ resetCount = false } = {}) {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  if (resetCount) visibleCount = 16;
  const filtrados = productosFiltrados();
  const contador = document.getElementById('contador');
  if (contador) contador.textContent = filtrados.length;
  const sinResultados = document.getElementById('sinResultados');
  const verMasWrap = document.querySelector('.vermas-wrap');
  if (!filtrados.length) {
    grid.innerHTML = '';
    if (sinResultados) sinResultados.hidden = false;
    if (verMasWrap) verMasWrap.hidden = true;
    return;
  }
  if (sinResultados) sinResultados.hidden = true;
  grid.innerHTML = filtrados.slice(0, visibleCount).map(productoCardHTML).join('');
  if (verMasWrap) verMasWrap.hidden = filtrados.length <= visibleCount;
}

function syncFiltrosUI() {
  document.querySelectorAll('[data-f]').forEach(input => {
    const grupo = input.dataset.f;
    const set = filtroState[grupo];
    input.checked = !!set && set.has(input.value);
  });
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;

  document.querySelectorAll('[data-f]').forEach(input => {
    input.addEventListener('change', () => {
      const grupo = input.dataset.f;
      if (!filtroState[grupo]) return;
      if (input.checked) filtroState[grupo].add(input.value); else filtroState[grupo].delete(input.value);
      aplicarFiltros({ resetCount: true });
    });
  });

  document.getElementById('limpiarFiltros')?.addEventListener('click', () => {
    filtroState.cat.clear(); filtroState.marca.clear(); filtroState.precio.clear();
    filtroState.tipoCompat = null; filtroState.marcaCompat = null;
    syncFiltrosUI();
    document.querySelectorAll('.compat-chip[aria-pressed="true"]').forEach(c => c.setAttribute('aria-pressed', 'false'));
    aplicarFiltros({ resetCount: true });
  });

  const buscadorForm = document.getElementById('buscadorForm');
  buscadorForm?.addEventListener('submit', e => {
    e.preventDefault();
    filtroState.q = (document.getElementById('buscador')?.value || '').trim().toLowerCase();
    aplicarFiltros({ resetCount: true });
  });

  document.getElementById('orden')?.addEventListener('change', e => {
    filtroState.orden = e.target.value;
    aplicarFiltros({ resetCount: true });
  });

  document.getElementById('verMas')?.addEventListener('click', () => { visibleCount += 16; aplicarFiltros(); });
  document.getElementById('verTodoVacio')?.addEventListener('click', () => {
    filtroState.cat.clear(); filtroState.marca.clear(); filtroState.precio.clear();
    filtroState.tipoCompat = null; filtroState.marcaCompat = null; filtroState.q = '';
    const b = document.getElementById('buscador'); if (b) b.value = '';
    syncFiltrosUI();
    document.querySelectorAll('.compat-chip[aria-pressed="true"]').forEach(c => c.setAttribute('aria-pressed', 'false'));
    aplicarFiltros({ resetCount: true });
  });

  const filtrosToggle = document.getElementById('filtrosToggle');
  const filtros = document.getElementById('filtros');
  filtrosToggle?.addEventListener('click', () => {
    const open = filtros.classList.toggle('open');
    filtrosToggle.setAttribute('aria-expanded', String(open));
  });

  aplicarFiltros();
}

/* ===== Buscador de la cabecera / hero: atajo al catalogo ===== */
function initBuscadoresRapidos() {
  document.querySelectorAll('[data-buscador-rapido]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input');
      const val = (input?.value || '').trim();
      filtroState.q = val.toLowerCase();
      const buscadorCatalogo = document.getElementById('buscador');
      if (buscadorCatalogo) buscadorCatalogo.value = val;
      aplicarFiltros({ resetCount: true });
      document.getElementById('repuestos')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

/* ===== Componente funcional: buscador por compatibilidad ===== */
function initCompat() {
  const wrap = document.querySelector('.compat');
  if (!wrap) return;
  const chipsTipo = wrap.querySelectorAll('[data-compat-tipo]');
  const chipsMarca = wrap.querySelectorAll('[data-compat-marca]');
  const numEl = document.getElementById('compatNum');
  const subEl = document.getElementById('compatSub');
  const btnVer = document.getElementById('compatVer');
  const btnWsp = document.getElementById('compatWsp');
  let tipo = null, marca = null;

  const actualizar = () => {
    const filtrados = PRODUCTOS.filter(p =>
      (!tipo || p.tipos.includes(tipo)) &&
      (!marca || p.marcas.includes(marca) || p.marcas.includes('Universal'))
    );
    const n = filtrados.length;
    if (numEl) numEl.textContent = n;
    const tipoLabel = tipo ? TIPOS_EQUIPO.find(t => t.id === tipo)?.label : 'cualquier equipo';
    const marcaLabel = marca || 'todas las marcas';
    if (subEl) subEl.textContent = `Para ${tipoLabel}, ${marcaLabel}`;
    if (n > 0) {
      btnVer.hidden = false;
      btnWsp.hidden = true;
    } else {
      btnVer.hidden = true;
      btnWsp.hidden = false;
      btnWsp.href = waLink([`Hola, buscaba repuestos para un equipo ${tipoLabel}${marca ? ', marca ' + marca : ''} y no lo encontré en la web.`, `¿Me ayudan a confirmar si lo tienen?`]);
    }
  };

  chipsTipo.forEach(chip => chip.addEventListener('click', () => {
    const activo = chip.getAttribute('aria-pressed') === 'true';
    chipsTipo.forEach(c => c.setAttribute('aria-pressed', 'false'));
    if (!activo) { chip.setAttribute('aria-pressed', 'true'); tipo = chip.dataset.compatTipo; } else { tipo = null; }
    actualizar();
  }));
  chipsMarca.forEach(chip => chip.addEventListener('click', () => {
    const activo = chip.getAttribute('aria-pressed') === 'true';
    chipsMarca.forEach(c => c.setAttribute('aria-pressed', 'false'));
    if (!activo) { chip.setAttribute('aria-pressed', 'true'); marca = chip.dataset.compatMarca; } else { marca = null; }
    actualizar();
  }));

  btnVer?.addEventListener('click', () => {
    filtroState.tipoCompat = tipo;
    filtroState.marcaCompat = marca;
    aplicarFiltros({ resetCount: true });
    document.getElementById('repuestos')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });

  actualizar();
}

/* ===== Rail de destacados (Modelo B) — receta endurecida ===== */
function initRail() {
  const vp = document.getElementById('railVp');
  const track = document.getElementById('railTrack');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!vp || !track) return;

  const idsDestacados = ['p3', 'p9', 'p25', 'p6', 'p16', 'p21', 'p27', 'p31', 'p13', 'p24'];
  const destacados = idsDestacados.map(id => PRODUCTOS.find(p => p.id === id)).filter(Boolean);
  track.innerHTML = destacados.map(productoCardHTML).join('');

  const paso = () => (track.querySelector('.producto-card')?.getBoundingClientRect().width || 240) + 24;
  const inicio = () => parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
  const syncBtns = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= inicio() + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', syncBtns, { passive: true });
  window.addEventListener('resize', syncBtns);

  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    dragging = true; moved = false; startX = e.clientX; startScroll = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true; vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    if (moved) vp.scrollLeft = startScroll - dx;
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
    setTimeout(() => { vp.classList.remove('dragging'); moved = false; }, 0);
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', () => { if (dragging) end(); });

  syncBtns();
}

/* ===== Momento propio: dos mundos con linea que barre ===== */
function initMundos() {
  const wrap = document.querySelector('.mundos-wrap');
  const sticky = document.querySelector('.mundos-sticky');
  const fotoB = document.querySelector('.mundos-foto-b');
  const linea = document.querySelector('.mundos-linea');
  const needle = document.getElementById('mundosNeedle');
  const temp = document.getElementById('mundosTemp');
  const progress = document.querySelector('.mundos-progress i');
  const labelA = document.querySelector('.mundos-label.is-a');
  const labelB = document.querySelector('.mundos-label.is-b');
  if (!wrap || !sticky || !fotoB) return;

  const OFF = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  let ticking = false;

  const update = () => {
    ticking = false;
    const rect = wrap.getBoundingClientRect();
    const total = wrap.offsetHeight - sticky.offsetHeight;
    let p = total > 0 ? (OFF - rect.top) / total : 0;
    p = Math.max(0, Math.min(1, p));
    const pct = (p * 100).toFixed(1);
    fotoB.style.clipPath = `inset(0 ${(100 - pct)}% 0 0)`;
    if (linea) linea.style.left = pct + '%';
    if (progress) progress.style.width = pct + '%';
    if (needle) needle.style.transform = `rotate(${(-58 + p * 116).toFixed(1)}deg)`;
    if (temp) temp.textContent = Math.round(34 - p * 13) + '°';
    if (labelA) labelA.style.opacity = String((1 - p * 0.55).toFixed(2));
    if (labelB) labelB.style.opacity = String((0.45 + p * 0.55).toFixed(2));
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', update);
  update();
}

/* ===== Mapa de zona ===== */
function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const map = L.map(el, { zoomControl: false, scrollWheelZoom: false, attributionControl: true }).setView([-34.6037, -58.4416], 10.3);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19,
  }).addTo(map);
  const icon = L.divIcon({
    className: '', html: '<div style="width:16px;height:16px;border-radius:50%;background:#2563EB;border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.35)"></div>',
    iconSize: [16, 16], iconAnchor: [8, 8],
  });
  L.marker([-34.6037, -58.4416], { icon }).addTo(map);
}

/* ===== Footer / varios ===== */
function initVarios() {
  const anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', () => {
  initCatalogo();
  initRail();
  initBuscadoresRapidos();
  initCompat();
  initReveals();
  initNav();
  initWspFloat();
  initMundos();
  initMapa();
  initVarios();

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
});
