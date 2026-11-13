const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const POR_PAGINA = 16;
const TOPE_LINEA = 10;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const HOME_URL = MODELO === '2' ? 'modelo-2.html' : './';
document.documentElement.classList.add('js');

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const WSP = '5491125913216';
const MARCA = 'Ariifloral';
const CATEGORIAS = [
  { id: 'ramos', nombre: 'Ramos', singular: 'Ramo', titulo: 'Ramos de flores', bajada: 'Rosas y girasoles envueltos en papel kraft', img: 'images/p-rosas-rojas.webp' },
  { id: 'floreros', nombre: 'En florero', singular: 'En florero', titulo: 'Arreglos en florero', bajada: 'Tulipanes, liliums, gerberas e hortensias', img: 'images/p-tulipanes-rosas.webp' },
  { id: 'centros', nombre: 'Centros de mesa', singular: 'Centro de mesa', titulo: 'Centros de mesa', bajada: 'Bajos y alargados, para eventos y cenas', img: 'images/p-centro-rosas.webp' },
  { id: 'box', nombre: 'Box y plantas', singular: 'Box y plantas', titulo: 'Box y plantas', bajada: 'Rosas en caja y orquídeas en maceta', img: 'images/p-box-rosas-blancas.webp' },
];
const OCASIONES = [
  { id: 'cumple', nombre: 'Cumpleaños', titulo: 'Para un cumpleaños', texto: 'Color y alegría para que ese día llegue algo distinto a la puerta.', puntos: ['Colores vivos: girasoles y gerberas', 'Clásicos que siempre quedan bien: tulipanes y liliums', 'Para la mesa del festejo: un centro de mesa'] },
  { id: 'amor', nombre: 'Amor y aniversario', titulo: 'Amor y aniversario', texto: 'Rosas rojas o rosa antiguo, tulipanes y el box de rosas blancas: los que lo dicen todo.', puntos: ['El clásico: rosas rojas en kraft', 'Más suave: rosas rosa antiguo', 'Para sorprender: el box de rosas blancas'] },
  { id: 'nacimiento', nombre: 'Nacimientos', titulo: 'Para un nacimiento', texto: 'Tonos suaves para darle la bienvenida al bebé y saludar a la familia.', puntos: ['Hortensias rosas o celestes', 'Tulipanes en florero', 'La orquídea, una planta que queda en casa'] },
  { id: 'gracias', nombre: 'Agradecimiento', titulo: 'Para decir gracias', texto: 'A una amiga, a una docente, a un equipo o a quien te dio una mano.', puntos: ['Girasoles o gerberas para alegrar', 'Liliums para un gesto elegante', 'La orquídea, para que lo recuerde'] },
  { id: 'condolencias', nombre: 'Condolencias', titulo: 'Condolencias', texto: 'Blancos y verdes, sobrios y serenos, para acompañar en un momento difícil.', puntos: ['Liliums blancos en florero', 'Rosas blancas en box', 'Centro en blancos o la orquídea'] },
  { id: 'mesa', nombre: 'Eventos y mesa', titulo: 'Eventos y mesa', texto: 'Para decorar un cumpleaños, un casamiento, un bautismo o una cena en casa.', puntos: ['Centros bajos que no tapan la vista', 'En rosas o en blancos', 'Escribinos la cantidad de mesas'] },
];
const COLORES = [
  { id: 'rojos', nombre: 'Rojos' },
  { id: 'rosas', nombre: 'Rosas' },
  { id: 'blancos', nombre: 'Blancos' },
  { id: 'amarillos', nombre: 'Amarillos' },
  { id: 'azules', nombre: 'Azules' },
  { id: 'mix', nombre: 'Multicolor' },
];
const PRECIOS = [
  { id: 'hasta45', nombre: 'Hasta $45.000', min: 0, max: 45000 },
  { id: '45a60', nombre: '$45.000 a $60.000', min: 45000, max: 60000 },
  { id: 'mas60', nombre: 'Más de $60.000', min: 60000, max: null },
];

const ORDENES = [
  { id: 'destacados', nombre: 'Más pedidos' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];
const GRUPOS_ZONA = [
  { id: 'caba', nombre: 'CABA' },
  { id: 'norte', nombre: 'Zona norte' },
  { id: 'sur', nombre: 'Zona sur' },
];
const ZONAS = [
  { id: 'caba', nombre: 'CABA', grupo: 'caba', lat: -34.6118, lng: -58.4173, radio: 9500, lugares: ['Capital Federal', 'Capital', 'Ciudad de Buenos Aires', 'Agronomía', 'Almagro', 'Balvanera', 'Barracas', 'Belgrano', 'Boedo', 'Caballito', 'Chacarita', 'Coghlan', 'Colegiales', 'Constitución', 'Flores', 'Floresta', 'La Boca', 'La Paternal', 'Liniers', 'Mataderos', 'Microcentro', 'Monte Castro', 'Montserrat', 'Nueva Pompeya', 'Núñez', 'Once', 'Palermo', 'Parque Avellaneda', 'Parque Chacabuco', 'Parque Chas', 'Parque Patricios', 'Puerto Madero', 'Recoleta', 'Retiro', 'Saavedra', 'San Cristóbal', 'San Nicolás', 'San Telmo', 'Vélez Sarsfield', 'Versalles', 'Villa Crespo', 'Villa del Parque', 'Villa Devoto', 'Villa General Mitre', 'Villa Lugano', 'Villa Luro', 'Villa Ortúzar', 'Villa Pueyrredón', 'Villa Real', 'Villa Riachuelo', 'Villa Santa Rita', 'Villa Soldati', 'Villa Urquiza'] },
  { id: 'vicente-lopez', nombre: 'Vicente López', grupo: 'norte', lat: -34.5267, lng: -58.4790, lugares: ['Olivos', 'Florida', 'Munro', 'La Lucila', 'Villa Martelli', 'Carapachay'] },
  { id: 'san-isidro', nombre: 'San Isidro', grupo: 'norte', lat: -34.4708, lng: -58.5287, lugares: ['Martínez', 'Acassuso', 'Beccar', 'Boulogne', 'Villa Adelina'] },
  { id: 'san-fernando', nombre: 'San Fernando', grupo: 'norte', lat: -34.4417, lng: -58.5600, lugares: ['Victoria', 'Virreyes'] },
  { id: 'tigre', nombre: 'Tigre', grupo: 'norte', lat: -34.4260, lng: -58.5796, lugares: ['Don Torcuato', 'General Pacheco', 'Benavídez', 'Nordelta', 'El Talar'] },
  { id: 'san-martin', nombre: 'San Martín', grupo: 'norte', lat: -34.5750, lng: -58.5370, lugares: ['Villa Ballester', 'San Andrés', 'José León Suárez', 'Villa Maipú'] },
  { id: 'avellaneda', nombre: 'Avellaneda', grupo: 'sur', lat: -34.6620, lng: -58.3650, lugares: ['Wilde', 'Sarandí', 'Dock Sud', 'Villa Domínico', 'Piñeyro'] },
  { id: 'lanus', nombre: 'Lanús', grupo: 'sur', lat: -34.7000, lng: -58.3920, lugares: ['Remedios de Escalada', 'Monte Chingolo', 'Valentín Alsina', 'Gerli', 'Lanús Este', 'Lanús Oeste'] },
  { id: 'lomas-de-zamora', nombre: 'Lomas de Zamora', grupo: 'sur', lat: -34.7600, lng: -58.4060, lugares: ['Banfield', 'Temperley', 'Turdera', 'Llavallol'] },
  { id: 'quilmes', nombre: 'Quilmes', grupo: 'sur', lat: -34.7240, lng: -58.2540, lugares: ['Bernal', 'Don Bosco', 'Ezpeleta', 'Quilmes Oeste'] },
  { id: 'almirante-brown', nombre: 'Almirante Brown', grupo: 'sur', lat: -34.8000, lng: -58.3900, lugares: ['Adrogué', 'Burzaco', 'José Mármol', 'Rafael Calzada', 'Longchamps', 'Claypole'] },
  { id: 'esteban-echeverria', nombre: 'Esteban Echeverría', grupo: 'sur', lat: -34.8170, lng: -58.4690, lugares: ['Monte Grande', 'Luis Guillón', 'El Jagüel', '9 de Abril'] },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const enRango = (p, id) => {
  const r = PRECIOS.find(x => x.id === id);
  const v = precioFinal(p);
  return !!r && v >= r.min && (r.max == null || v < r.max);
};
const normalizar = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const Tienda = {
  counts: {},
  async consultar({ filtros = {}, orden = 'destacados', cursor, limite = 16, scope = PAGINA === 'home' ? 'home' : 'catalog' } = {}) {
    const params = new URLSearchParams({ scope, order: orden, limit: limite });
    if (cursor) params.set('cursor', cursor);
    for (const [k,v] of Object.entries(filtros)) if (v && String(v)) params.set(k,String(v));
    const response = await fetch('catalogo.php?' + params);
    if (!response.ok) throw new Error('No se pudo cargar el catálogo');
    const page = await response.json();
    let edits = {};
    try { edits = JSON.parse(localStorage.getItem('ariifloral_precios_demo')) || {}; } catch {}
    for (const product of page.items) {
      if (Number.isSafeInteger(edits[product.id]) && edits[product.id] > 0) product.precio = edits[product.id];
      cacheProductos.set(product.id,product);
    }
    return page;
  },
  contar(filtros) {
    const [pair] = Object.entries(filtros);
    return pair ? Number(this.counts[pair[0]]?.[pair[1]] || 0) : Number(this.counts.total || 0);
  }
};
function buscarZona(texto) {
  const q = normalizar(texto).replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (q.length < 3) return null;
  const candidatos = [];
  ZONAS.forEach(z => {
    [z.nombre, ...z.lugares].forEach(l => candidatos.push({ zona: z, lugar: l, n: normalizar(l).replace(/[^a-z0-9 ]+/g, ' ').trim() }));
  });
  const exacto = candidatos.find(c => c.n === q);
  if (exacto) return { zona: exacto.zona, lugar: exacto.lugar };
  const empieza = candidatos.find(c => c.n.startsWith(q));
  if (empieza) return { zona: empieza.zona, lugar: empieza.lugar };
  const contiene = candidatos.find(c => q.length >= 4 && (` ${c.n}`).includes(` ${q}`));
  return contiene ? { zona: contiene.zona, lugar: contiene.lugar } : null;
}

const Entrega = {
  KEY: 'ariifloral_entrega',
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      const zona = ZONAS.find(z => z.id === v?.zona);
      return { zona: zona ? zona.id : '', lugar: zona && typeof v.lugar === 'string' ? v.lugar.slice(0, 60) : '', mensaje: typeof v?.mensaje === 'string' ? v.mensaje.slice(0, 200) : '' };
    } catch { return { zona: '', lugar: '', mensaje: '' }; }
  },
  set(cambios) {
    const v = { ...this.get(), ...cambios };
    try { localStorage.setItem(this.KEY, JSON.stringify(v)); } catch (err) { void err; }
    document.dispatchEvent(new CustomEvent('entrega:updated'));
    return v;
  },
  texto() {
    const v = this.get();
    const z = ZONAS.find(x => x.id === v.zona);
    if (!z) return '';
    const grupo = nombreDe(GRUPOS_ZONA, z.grupo);
    if (z.grupo === 'caba') return v.lugar && v.lugar !== z.nombre ? `${v.lugar} (CABA)` : 'CABA';
    return v.lugar && v.lugar !== z.nombre ? `${v.lugar} (${z.nombre}, ${grupo.toLowerCase()})` : `${z.nombre} (${grupo.toLowerCase()})`;
  },
};

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const getProducto = id => cacheProductos.get(id);
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

const Cart = {
  KEY: 'ariifloral_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    if (!producto) return 0;
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    const existing = items.find(i => i.id === producto.id);
    const antes = existing ? existing.qty : 0;
    if (existing) existing.qty = Math.min(existing.qty + n, TOPE_LINEA);
    else items.push({ id: producto.id, qty: n });
    this.save(items);
    return (existing ? existing.qty : n) - antes;
  },
  setQty(id, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id);
    if (!it) return;
    it.qty = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  sync() {
    const crudo = this.get();
    const limpias = [];
    let changed = false;
    crudo.forEach(i => {
      const p = i && getProducto(i.id);
      if (!p) { changed = true; return; }
      const qty = Math.max(1, Math.min(parseInt(i.qty, 10) || 1, TOPE_LINEA));
      const previa = limpias.find(x => x.id === p.id);
      if (previa) { previa.qty = Math.min(previa.qty + qty, TOPE_LINEA); changed = true; return; }
      if (qty !== i.qty || Object.keys(i).length !== 2) changed = true;
      limpias.push({ id: p.id, qty });
    });
    if (changed) this.save(limpias);
  },
};

function textoPedido(items = Cart.get()) {
  let total = 0;
  const lineas = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const sub = precioFinal(p) * i.qty;
    total += sub;
    return `• ${i.qty} × ${p.nombre} — ${formatearPrecio(sub)}`;
  }).filter(Boolean);
  const e = Entrega.get();
  const extra = [];
  const zona = Entrega.texto();
  if (zona) extra.push(`Entrega en: ${zona}`);
  if (e.mensaje.trim()) extra.push(`Mensaje para acompañar: «${e.mensaje.trim()}»`);
  return `¡Hola Ariifloral! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(total)}${extra.length ? `\n${extra.join('\n')}` : ''}\n¿Cómo seguimos?`;
}

const SVG = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICO = {
  mas: SVG('<path d="M12 5l0 14"/><path d="M5 12l14 0"/>'),
  menos: SVG('<path d="M5 12l14 0"/>'),
  x: SVG('<path d="M18 6l-12 12"/><path d="M6 6l12 12"/>'),
  check: SVG('<path d="M5 12l5 5l10 -10"/>'),
  planta: SVG('<path d="M7 15h10v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z"/><path d="M12 9a6 6 0 0 0 -6 -6h-3v2a6 6 0 0 0 6 6h3"/><path d="M12 11a6 6 0 0 1 6 -6h3v1a6 6 0 0 1 -6 6h-3"/><path d="M12 15l0 -6"/>'),
  pin: SVG('<path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"/>'),
  camion: SVG('<path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5"/>'),
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: SVG('<path d="M5 12l14 0"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/>'),
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const els = [...cont.querySelectorAll(ENFOCABLES)].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!els.length) return;
  const primero = els[0], ultimo = els[els.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
const capas = [];
function abrirCapa(el, { alCerrar, previo = document.activeElement } = {}) {
  el.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('open')));
  const onKey = e => {
    if (capas[capas.length - 1]?.el !== el) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrarCapa(el); }
    else atraparFoco(el, e);
  };
  document.addEventListener('keydown', onKey);
  capas.push({ el, previo, onKey, alCerrar });
}
function cerrarCapa(el, { devolverFoco = true } = {}) {
  const i = capas.findIndex(c => c.el === el);
  if (i < 0) return null;
  const [capa] = capas.splice(i, 1);
  document.removeEventListener('keydown', capa.onKey);
  el.classList.remove('open');
  setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, reduceMotion ? 0 : 400);
  if (!capas.length && !document.getElementById('mainNav')?.classList.contains('open') && !document.getElementById('filtros')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  capa.alCerrar?.();
  if (devolverFoco && capa.previo && document.contains(capa.previo)) capa.previo.focus({ preventScroll: true });
  return capa;
}
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1025px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!capas.length) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button:not(.nav-close)')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } else if (nav.classList.contains('open')) atraparFoco(nav, e); });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuCategorias() {
  const params = new URLSearchParams(location.search);
  const cat = (params.get('cat') || '').split(',').filter(id => CATEGORIAS.some(c => c.id === id));
  const otros = ['ocasion', 'color', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><span class="cats-menu__foto"><img src="${esc(c.img)}" alt="" width="880" height="1100"></span><span><b>${esc(c.titulo)}</b><small>${plural(Tienda.contar({ cat: c.id }), 'arreglo', 'arreglos')}</small></span></a></li>`;
    }).join('');
  });
  const desktop = window.matchMedia('(min-width: 1025px)');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  document.querySelectorAll('.nav-cats').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    let t = 0, porHover = false;
    const abrir = () => { clearTimeout(t); box.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); porHover = false; box.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      if (!box.classList.contains('is-open')) { abrir(); porHover = false; }
      else if (porHover) porHover = false;
      else cerrar();
    });
    box.addEventListener('mouseenter', () => { if (hover.matches && !box.classList.contains('is-open')) { abrir(); porHover = true; } else clearTimeout(t); });
    box.addEventListener('mouseleave', () => { if (hover.matches) t = setTimeout(cerrar, 120); });
    box.addEventListener('focusout', e => { if (desktop.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (!box.contains(e.target) && desktop.matches) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('is-open')) { cerrar(); btn.focus(); } });
  });
}

const stepperHTML = (n = 1, cls = '') => `<div class="stepper${cls}" data-stepper><button type="button" data-paso="-1" aria-label="Restar uno">${ICO.menos}</button><output data-qty>${n}</output><button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;
const precioHTML = p => {
  const fin = precioFinal(p);
  if (p.descuento > 0) return `<p class="precio precio--oferta"><span class="precio__v">${formatearPrecio(fin)}</span><s>${formatearPrecio(p.precio)}</s><span class="precio__etq">-${p.descuento}%</span></p>`;
  return `<p class="precio"><span class="precio__v">${formatearPrecio(fin)}</span></p>`;
};
const ocasionesDe = (p, n = 2) => (p.ocasiones || []).slice(0, n).map(o => nombreDe(OCASIONES, o)).join(' · ');

const ANIMS = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(28px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(40px)"',
  fila: ' data-animate="subir" style="opacity:0;transform:translateY(18px)"',
  no: '',
};
function cardHTML(p, { anim = 'subir', grande = false } = {}) {
  const a = ANIMS[anim] ?? ANIMS.subir;
  return `<article class="prod${grande ? ' prod--grande' : ''}" data-id="${esc(p.id)}"${a}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img)}" alt="${esc(p.alt)}" width="880" height="1100" decoding="async"><span class="prod__mirar" aria-hidden="true">Ver detalle</span></button><span class="prod__etq">${esc(catDe(p.cat).singular)}</span></div>
  <div class="prod__info" data-cant>
    <p class="prod__det">${esc(ocasionesDe(p))}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    ${grande ? `<p class="prod__gancho">${esc(p.gancho)}</p><p class="prod__desc">${esc(p.desc)}</p>` : ''}
    <p class="prod__pres">${esc(p.pres)}</p>
    ${precioHTML(p)}
    <div class="prod-actions">${stepperHTML(1, ' stepper--card')}<button type="button" class="btn btn--cta btn--sm prod-add" data-agregar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button></div>
    <button type="button" class="prod__comprar" data-comprar="${esc(p.id)}">Comprar ahora ${ICO.flecha}</button>
  </div>
</article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-abrir-carrito][aria-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'arreglo', 'arreglos')}, ${formatearPrecio(Cart.total())}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const id = esc(p.id);
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <span class="linea__foto"><img src="${esc(p.img)}" alt="" width="880" height="1100"></span>
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">${esc(p.pres)}</p>
    <div class="linea__fila">
      <div class="stepper"><button type="button" data-linea-paso="-1" data-k="${id}" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-k="${id}" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= TOPE_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
    </div>
  </div>
  <button type="button" class="linea__quitar" data-quitar="${id}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button>
</li>`;
}

function opcionesZona(sel) {
  return `<option value="">Elegí tu zona</option>${GRUPOS_ZONA.map(g => `<optgroup label="${esc(g.nombre)}">${ZONAS.filter(z => z.grupo === g.id).map(z => `<option value="${esc(z.id)}"${z.id === sel ? ' selected' : ''}>${esc(z.nombre)}</option>`).join('')}</optgroup>`).join('')}`;
}

function initDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  const lista = drawer.querySelector('[data-drawer-lista]');
  const vacio = drawer.querySelector('[data-drawer-vacio]');
  const foot = drawer.querySelector('[data-drawer-foot]');
  const total = drawer.querySelector('[data-drawer-total]');
  const cuenta = drawer.querySelector('[data-drawer-cuenta]');
  const wsp = drawer.querySelector('[data-drawer-wsp]');
  const zona = drawer.querySelector('#entregaZona');
  const mensaje = drawer.querySelector('#entregaMensaje');
  const lugar = drawer.querySelector('[data-entrega-lugar]');
  const pintarEntrega = () => {
    const e = Entrega.get();
    if (zona) { zona.innerHTML = opcionesZona(e.zona); zona.value = e.zona; }
    if (mensaje && document.activeElement !== mensaje) mensaje.value = e.mensaje;
    if (lugar) { const t = Entrega.texto(); lugar.textContent = t ? `Entrega en ${t}` : 'Si no ves tu zona, consultanos por WhatsApp.'; }
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  const pintar = () => {
    const items = Cart.get();
    const n = Cart.count();
    cuenta.textContent = n ? plural(n, 'arreglo', 'arreglos') : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    drawer.querySelector('.drawer__cuerpo').hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    total.textContent = formatearPrecio(Cart.total());
    pintarEntrega();
  };
  zona?.addEventListener('change', () => { const z = ZONAS.find(x => x.id === zona.value); Entrega.set({ zona: z ? z.id : '', lugar: z ? z.nombre : '' }); });
  let tm = 0;
  mensaje?.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(() => Entrega.set({ mensaje: mensaje.value.slice(0, 200) }), 200); });
  mensaje?.addEventListener('change', () => { clearTimeout(tm); Entrega.set({ mensaje: mensaje.value.slice(0, 200) }); });
  wsp?.addEventListener('click', () => { if (mensaje) { clearTimeout(tm); Entrega.set({ mensaje: mensaje.value.slice(0, 200) }); wsp.href = wspHref(textoPedido()); } });
  lista.addEventListener('click', e => {
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const k = paso.dataset.k;
      const it = Cart.get().find(x => x.id === k);
      if (it) Cart.setQty(k, it.qty + Number(paso.dataset.lineaPaso));
      [...lista.querySelectorAll(`[data-linea-paso="${paso.dataset.lineaPaso}"]`)].find(b => b.dataset.k === k && !b.disabled)?.focus();
      return;
    }
    const q = e.target.closest('[data-quitar]');
    if (!q) return;
    const p = getProducto(q.dataset.quitar);
    Cart.remove(q.dataset.quitar);
    if (p) showToast(`Sacaste «${p.nombre}» del carrito`);
    drawer.querySelector('.drawer__head button')?.focus();
  });
  drawer.addEventListener('click', e => { if (e.target.closest('[data-drawer-cerrar]')) cerrarCapa(drawer, { devolverFoco: !e.target.closest('a') }); });
  document.addEventListener('cart:updated', pintar);
  document.addEventListener('entrega:updated', pintarEntrega);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito(b)));
  pintar();
}

function avisoSumado(p, n) {
  if (n) showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» al carrito`);
  else showToast(`Ya tenés ${TOPE_LINEA} de «${p.nombre}» en el carrito`);
}
function bump(el) {
  if (!el || reduceMotion) return;
  el.classList.remove('sumado'); void el.offsetWidth; el.classList.add('sumado');
}
const cantDe = el => {
  const out = el.closest('[data-cant]')?.querySelector('[data-qty]');
  const n = Math.max(1, Math.min(parseInt(out?.textContent, 10) || 1, TOPE_LINEA));
  if (out) out.textContent = '1';
  return n;
};

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('#quickView')) return;
    const paso = e.target.closest('[data-cant] [data-paso]');
    if (paso) {
      const out = paso.closest('[data-stepper]').querySelector('[data-qty]');
      out.textContent = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso), TOPE_LINEA));
      return;
    }
    const ag = e.target.closest('[data-agregar]');
    if (ag) {
      const p = getProducto(ag.dataset.agregar);
      if (!p) return;
      avisoSumado(p, Cart.add(p, cantDe(ag)));
      bump(ag);
      return;
    }
    const cm = e.target.closest('[data-comprar]');
    if (cm) {
      const p = getProducto(cm.dataset.comprar);
      if (!p) return;
      Cart.add(p, cantDe(cm));
      window.abrirCarrito?.(cm);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      e.preventDefault();
      abrirVistaRapida(qv.dataset.qv, { previo: qv });
    }
  });
}

let qvEstado = null;
async function relacionados(p) {
  const oc = (p.ocasiones || [])[0];
  let rel = oc ? (await Tienda.consultar({ filtros: { ocasion: oc, excluir: [p.id] }, limite: 3 })).items : [];
  if (rel.length < 3) rel = rel.concat((await Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length })).items);
  if (rel.length < 3) rel = rel.concat((await Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length })).items);
  return { rel, titulo: oc ? `También para ${nombreDe(OCASIONES, oc).toLowerCase()}` : 'También te puede gustar' };
}
async function qvHTML(p) {
  const { rel, titulo } = await relacionados(p);
  const c = catDe(p.cat);
  return `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media">
    <figure class="qv__foto"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="880" height="1100"></figure>
    <p class="qv__nota-foto">${ICO.planta}<span>Imagen ilustrativa y precio de muestra: te confirmamos flores y colores de la temporada por WhatsApp.</span></p>
  </div>
  <div class="qv__info" data-cant>
    <p class="qv__cat">${esc(c.titulo)}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="qv__gancho">${esc(p.gancho)}</p>
    ${precioHTML(p)}
    <ul class="qv__ocasiones" aria-label="Ocasiones">${(p.ocasiones || []).map(o => `<li><a href="${CATALOGO_URL}?ocasion=${esc(o)}">${esc(nombreDe(OCASIONES, o))}</a></li>`).join('')}</ul>
    <div class="qv__acciones">${stepperHTML(1)}<button type="button" class="btn btn--cta prod-add" data-qv-agregar>${ICO.carrito}<span>Agregar al carrito</span></button></div>
    <button type="button" class="btn btn--ghost btn--block" data-qv-comprar>Comprar ahora ${ICO.flecha}</button>
    <p class="qv__desc">${esc(p.desc)}</p>
    <dl class="qv__ficha">${(p.ficha || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <a class="qv__wsp" href="${esc(wspHref(`¡Hola Ariifloral! Quería consultar por: ${p.nombre}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por este arreglo</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>${esc(titulo)}</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><span class="qv__rel-foto"><img src="${esc(r.img)}" alt="" width="880" height="1100"></span><span class="qv__rel-n">${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
}
async function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id) || (await Tienda.consultar({filtros:{ids:[id]},limite:1,scope:"lookup"})).items[0];
  if (!modal || !p) return;
  qvEstado = { id: p.id };
  modal.querySelector('[data-qv-body]').innerHTML = await qvHTML(p);
  modal.querySelector('.qv__panel').scrollTop = 0;
  modal.setAttribute('aria-label', `Detalle: ${p.nombre}`);
  ponerJsonLdProducto(p);
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { previo, alCerrar: () => setParam('producto', null) });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  setParam('producto', p.id);
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const cont = modal.querySelector('.qv__grid');
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const out = cont.querySelector('[data-qty]');
      out.textContent = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso), TOPE_LINEA));
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const n = Cart.add(p, cantDe(cont.querySelector('[data-cant]')));
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else { avisoSumado(p, n); bump(agregar); }
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, category: catDe(p.cat).titulo,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: MARCA } },
  });
}

function setParam(k, v) {
  try {
    const u = new URL(location.href);
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
    else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
    window.history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? `?${u.searchParams.toString().replace(/%2C/g, ',')}` : '') + u.hash);
  } catch (err) { void err; }
}

async function initRail() {
  const cont = document.querySelector('[data-rail]');
  if (!cont) return;
  cont.innerHTML = (await Tienda.consultar({ limite: 8 })).items.map(p => cardHTML(p, { anim: 'der' })).join('');
}
async function initMosaico() {
  const cont = document.querySelector('[data-mosaico]');
  if (!cont) return;
  const items = (await Tienda.consultar({ limite: 6 })).items;
  const total = Tienda.contar({});
  cont.innerHTML = items.map((p, i) => cardHTML(p, { anim: 'subir', grande: i === 0 })).join('')
    + `<a class="mosaico__todo" href="${CATALOGO_URL}"${ANIMS.subir}><span class="mosaico__n">${total}</span><span class="mosaico__t">arreglos en el catálogo</span><span class="mosaico__ir">Ver todos ${ICO.flecha}</span></a>`;
}
function initCategoriasCuenta() {
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    el.textContent = plural(Tienda.contar({ cat: el.dataset.catN }), 'arreglo', 'arreglos');
  });
  document.querySelectorAll('[data-total-n]').forEach(el => { el.textContent = String(Tienda.contar({})); });
  document.querySelectorAll('[data-ocasion-n]').forEach(el => { el.textContent = plural(Tienda.contar({ ocasion: el.dataset.ocasionN }), 'arreglo', 'arreglos'); });
}

function miniHTML(p) {
  return `<li class="mini"${ANIMS.fila}>
    <button type="button" class="mini__foto" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="" width="880" height="1100"></button>
    <div class="mini__txt"><p class="mini__k">${esc(catDe(p.cat).singular)}</p><h4>${esc(p.nombre)}</h4>${precioHTML(p)}</div>
    <button type="button" class="btn btn--cta btn--sm mini__add" data-agregar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button>
  </li>`;
}
function initOcasiones() {
  const box = document.querySelector('[data-ocasiones]');
  if (!box) return;
  const tabs = [...box.querySelectorAll('[data-ocasion]')];
  const panel = box.querySelector('[data-ocasion-panel]');
  let actual = tabs.find(t => t.getAttribute('aria-selected') === 'true')?.dataset.ocasion || tabs[0]?.dataset.ocasion;
  const pintar = async () => {
    const o = OCASIONES.find(x => x.id === actual);
    if (!o) return;
    tabs.forEach(b => { const on = b.dataset.ocasion === actual; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    const prods = (await Tienda.consultar({ filtros: { ocasion: o.id }, limite: 4 })).items;
    if (o.id !== actual) return;
    const total = Tienda.contar({ ocasion: o.id });
    panel.setAttribute('aria-labelledby', `tab-${o.id}`);
    panel.innerHTML = `<div class="oc-ficha"${ANIMS.fila}>
      <p class="oc-ficha__k">${ICO.planta}Para regalar</p>
      <h3>${esc(o.titulo)}</h3>
      <p class="oc-ficha__t">${esc(o.texto)}</p>
      <ul class="oc-ficha__puntos">${o.puntos.map(x => `<li>${ICO.check}<span>${esc(x)}</span></li>`).join('')}</ul>
    </div>
    <ul class="oc-prods">${prods.map(miniHTML).join('')}</ul>
    <a class="link-flecha oc-mas" href="${CATALOGO_URL}?ocasion=${esc(o.id)}"><span>Ver ${total === 1 ? 'el arreglo' : `los ${total} arreglos`} para ${esc(o.nombre.toLowerCase())}</span> ${ICO.flecha}</a>`;
    revelarNuevos(panel);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  box.addEventListener('click', e => {
    const t = e.target.closest('[data-ocasion]');
    if (!t || t.dataset.ocasion === actual) return;
    actual = t.dataset.ocasion;
    pintar();
  });
  box.addEventListener('keydown', e => {
    const t = e.target.closest('[data-ocasion]');
    if (!t) return;
    const k = tabs.indexOf(t);
    let n = -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (k + 1) % tabs.length;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (k - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = tabs.length - 1;
    if (n < 0) return;
    e.preventDefault();
    actual = tabs[n].dataset.ocasion;
    pintar();
    tabs[n].focus();
  });
  pintar();
}

function initPrecios() {
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (p) el.textContent = formatearPrecio(precioFinal(p));
  });
}

function initCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const verMas = document.getElementById('verMas');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const vacio = document.getElementById('vacio');
  const activos = document.getElementById('filtrosActivos');
  const panel = document.getElementById('filtros');
  const inputQ = document.getElementById('q');
  const selOrden = document.getElementById('orden');
  const titulo = document.getElementById('catTitulo');
  const miga = document.getElementById('migaCat');
  const migaSep = document.querySelector('[data-miga-sep]');
  const params = new URLSearchParams(location.search);
  const GRUPOS = { cat: CATEGORIAS, ocasion: OCASIONES, color: COLORES, precio: PRECIOS };
  const valida = (arr, lista) => [...new Set((arr || '').toLowerCase().split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    ocasion: valida(params.get('ocasion'), OCASIONES),
    color: valida(params.get('color'), COLORES),
    precio: valida(params.get('precio'), PRECIOS),
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;
  const filtros = (sin = '') => {
    const f = {};
    Object.keys(GRUPOS).forEach(k => { if (sin !== k && e[k].length) f[k] = e[k]; });
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (grupo, item, marcado, n) => (grupo === 'cat' && MODELO === '2'
    ? `<label class="op-linea${n ? '' : ' is-cero'}"><input type="checkbox" data-f="cat" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`
    : `<label class="opcion${n ? '' : ' is-cero'}"><input type="checkbox" data-f="${grupo}" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`);
  function pintarFiltros() {
    Object.keys(GRUPOS).forEach(k => {
      const box = document.querySelector(`[data-f-${k}]`);
      if (!box) return;
      box.innerHTML = GRUPOS[k].map(it => opcion(k, it, e[k].includes(it.id), Tienda.contar({ [k]: it.id }))).join('');
    });
  }
  function tituloActual() {
    const solo = k => e[k].length === 1 && Object.keys(GRUPOS).every(g => g === k || !e[g].length);
    if (solo('cat')) return CATEGORIAS.find(x => x.id === e.cat[0])?.titulo || '';
    if (solo('ocasion')) return OCASIONES.find(x => x.id === e.ocasion[0])?.titulo || '';
    if (solo('color')) return e.color[0] === 'mix' ? 'Arreglos multicolor' : `Flores en tonos ${(COLORES.find(x => x.id === e.color[0])?.nombre || '').toLowerCase()}`;
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...Object.keys(GRUPOS).flatMap(k => e[k].map(id => ({ k, id, t: nombreDe(GRUPOS[k], id) }))),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + (MODELO === '2' && k === 'cat' ? 0 : e[k].length), 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Todo el catálogo';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Catálogo'} — ${MARCA}, arreglos florales`;
    document.querySelectorAll('[data-cats-menu] a').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (e.cat.length === 1 && e.cat[0] === id && t && Object.keys(GRUPOS).every(g => g === 'cat' || !e[g].length)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  function sincronizarUrl() {
    Object.keys(GRUPOS).forEach(k => setParam(k, e[k]));
    setParam('q', e.q);
    setParam('orden', e.orden === 'destacados' ? '' : e.orden);
  }
  let revision = 0;
  async function render(reiniciar = true) {
    const turno = ++revision;
    verMas.disabled = true;
    const f = filtros();
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = await Tienda.consultar({ filtros: f, orden: e.orden, cursor, limite: POR_PAGINA });
    if (turno !== revision) return;
    verMas.disabled = false;
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, { anim: 'subir' })).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = res.total;
    contador.innerHTML = `${total} <small>${total === 1 ? 'arreglo' : 'arreglos'}${e.q ? ` para «${esc(e.q)}»` : ''}</small>`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.hidden = mostrados === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    document.querySelectorAll('[data-ver-n]').forEach(el => { el.textContent = `${total}`; });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  function aplicar() { pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true); }
  document.addEventListener('change', ev => {
    const inp = ev.target.closest('[data-f]');
    if (!inp) return;
    const g = inp.dataset.f;
    e[g] = [...document.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
    aplicar();
  });
  let tq = 0;
  inputQ.value = e.q;
  const buscar = () => { e.q = inputQ.value.trim().slice(0, 60); pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true); };
  inputQ.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(buscar, 220); });
  inputQ.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); buscar(); inputQ.blur(); });
  selOrden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  selOrden.addEventListener('change', () => { e.orden = selOrden.value; sincronizarUrl(); render(true); });
  const limpiar = () => { Object.keys(GRUPOS).forEach(k => { e[k] = []; }); e.q = ''; inputQ.value = ''; aplicar(); };
  document.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const qf = ev.target.closest('[data-quitar-f]');
    if (qf) {
      const k = qf.dataset.quitarF, v = qf.dataset.v;
      if (GRUPOS[k]) e[k] = e[k].filter(x => x !== v);
      else { e.q = ''; inputQ.value = ''; }
      aplicar();
    }
  });
  verMas.addEventListener('click', () => render(false));
  const bd = document.querySelector('.filtros-backdrop');
  const mq = window.matchMedia('(max-width: 1024px)');
  const syncPanel = () => { if (mq.matches && !panel.classList.contains('open')) panel.setAttribute('inert', ''); else panel.removeAttribute('inert'); if (!mq.matches) { panel.classList.remove('open'); bd?.classList.remove('open'); } };
  const abrirPanel = () => { panel.classList.add('open'); bd?.classList.add('open'); document.body.classList.add('no-scroll'); panel.removeAttribute('inert'); panel.querySelector('button, input')?.focus(); };
  const cerrarPanel = () => { panel.classList.remove('open'); bd?.classList.remove('open'); if (!capas.length) document.body.classList.remove('no-scroll'); syncPanel(); };
  mq.addEventListener('change', syncPanel);
  syncPanel();
  if (mq.matches) panel.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  document.querySelectorAll('[data-abrir-filtros]').forEach(b => b.addEventListener('click', abrirPanel));
  document.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => { cerrarPanel(); document.querySelector('[data-abrir-filtros]')?.focus(); }));
  bd?.addEventListener('click', cerrarPanel);
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && panel.classList.contains('open')) cerrarPanel(); else if (panel.classList.contains('open')) atraparFoco(panel, ev); });
  pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true);
  if (params.get('buscar') === '1') { setParam('buscar', null); setTimeout(() => inputQ.focus(), 120); }
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initRails() {
  document.querySelectorAll('[data-rail-vp]').forEach(vp => {
    initRailDrag(vp);
    const sec = vp.closest('section');
    const prev = sec?.querySelector('[data-rail-prev]');
    const next = sec?.querySelector('[data-rail-next]');
    const track = vp.querySelector('.rail-track');
    if (!prev || !next || !track) return;
    const paso = () => {
      const card = track.firstElementChild;
      const gap = parseFloat(window.getComputedStyle(track).columnGap) || 20;
      const w = card ? card.getBoundingClientRect().width + gap : vp.clientWidth * 0.8;
      return w * Math.max(1, Math.floor(vp.clientWidth / w) - 1);
    };
    const sync = () => {
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      prev.disabled = vp.scrollLeft <= inicio + 2;
      next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    prev.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  });
}
function initProductoUrl() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id) setTimeout(() => abrirVistaRapida(id), 80);

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

function initModelBarScroll() {
  const bar = document.querySelector('.gw-modelos');
  if (!bar) return;
  let showTimer = 0;
  let frame = 0;
  const update = () => {
    frame = 0;
    if (window.scrollY <= 8) {
      bar.classList.remove('gw-modelos--scrolling');
      return;
    }
    bar.classList.add('gw-modelos--scrolling');
    clearTimeout(showTimer);
    showTimer = setTimeout(() => bar.classList.remove('gw-modelos--scrolling'), 120);
  };
  window.addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
}

let revealsListos = false;
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
}

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const entrar = (el, n) => {
    const d = Math.min(n * 0.1, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  };
  const io = new IntersectionObserver(entries => {
    let n = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) { entrar(entry.target, n++); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    let n = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { entrar(el, n++); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  requestAnimationFrame(() => requestAnimationFrame(queueSweep));
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

const COLOR_ZONA = { caba: '#23365C', norte: '#2A6B63', sur: '#8A6440' };

function initZonas() {
  const box = document.querySelector('[data-zonas]');
  if (!box) return;
  const form = box.querySelector('[data-zona-form]');
  const input = form?.querySelector('input');
  const res = box.querySelector('[data-zona-res]');
  const lista = box.querySelector('datalist');
  const mapaEl = box.querySelector('[data-mapa]');
  if (!form || !input || !res) return;
  if (lista) lista.innerHTML = ZONAS.flatMap(z => [z.nombre, ...z.lugares]).map(l => `<option value="${esc(l)}"></option>`).join('');
  let mapa = null, pin = null;

  const volar = (z, animar = true) => {
    if (!mapa || !z || typeof L === 'undefined') return;
    if (pin) pin.remove();
    pin = L.circleMarker([z.lat, z.lng], { radius: 9, color: '#FFFFFF', weight: 3, fillColor: COLOR_ZONA[z.grupo], fillOpacity: 1 }).addTo(mapa);
    pin.bindTooltip(z.nombre, { permanent: true, direction: 'top', offset: [0, -10], className: 'mapa-tip' });
    mapa.flyTo([z.lat, z.lng], z.grupo === 'caba' ? 11 : 12, { animate: animar && !reduceMotion, duration: 0.9 });
  };
  const crearMapa = () => {
    if (mapa || !mapaEl || typeof L === 'undefined') return;
    mapa = L.map(mapaEl, { scrollWheelZoom: false, zoomSnap: 0.5 }).setView([-34.62, -58.45], 10);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 18 }).addTo(mapa);
    ZONAS.forEach(z => {
      L.circle([z.lat, z.lng], { radius: z.radio || 3800, color: COLOR_ZONA[z.grupo], weight: 1, fillColor: COLOR_ZONA[z.grupo], fillOpacity: 0.16 }).addTo(mapa).bindTooltip(z.nombre, { className: 'mapa-tip' });
    });
    mapa.fitBounds(L.latLngBounds(ZONAS.map(z => [z.lat, z.lng])).pad(0.12));
    const e = Entrega.get();
    const z = ZONAS.find(x => x.id === e.zona);
    if (z) volar(z, false);
  };
  if (mapaEl) {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(ent => { if (ent.some(x => x.isIntersecting)) { io.disconnect(); crearMapa(); } }, { rootMargin: '400px 0px' });
      io.observe(mapaEl);
    } else crearMapa();
  }

  const marcar = id => box.querySelectorAll('[data-zona-elegir]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.zonaElegir === id)));
  const mostrar = (r, texto) => {
    res.hidden = false;
    if (!r) {
      if (pin) { pin.remove(); pin = null; }
      if (normalizar(texto).replace(/[^a-z0-9]+/g, '').length < 3) {
        res.className = 'zona-res zona-res--no';
        res.innerHTML = '<p class="zona-res__t">Escribí un poco más</p><p>Con 3 letras o más del barrio o la localidad ya te podemos decir.</p>';
        marcar('');
        return;
      }
      res.className = 'zona-res zona-res--no';
      res.innerHTML = `<p class="zona-res__t">No encontramos «${esc(texto)}» en la lista</p><p>Puede que lleguemos igual: escribinos y te confirmamos.</p><div class="zona-res__acc"><a class="btn btn--wsp btn--sm" href="${esc(wspHref(`¡Hola Ariifloral! ¿Hacen entregas en ${texto}?`))}" target="_blank" rel="noopener">${ICO.wsp}Consultar por WhatsApp</a></div>`;
      marcar('');
      return;
    }
    Entrega.set({ zona: r.zona.id, lugar: r.lugar });
    const donde = Entrega.texto();
    res.className = 'zona-res';
    res.innerHTML = `<p class="zona-res__t">${ICO.check}<span>Sí, entregamos en ${esc(donde)}</span></p><p>Quedó anotada para tu pedido: la vas a ver en el carrito y en el mensaje de WhatsApp.</p><div class="zona-res__acc"><a class="btn btn--cta btn--sm" href="${CATALOGO_URL}">Elegir un arreglo ${ICO.flecha}</a><a class="btn btn--ghost btn--sm" href="${esc(wspHref(`¡Hola Ariifloral! Quiero hacer un pedido con entrega en ${donde}.`))}" target="_blank" rel="noopener">${ICO.wsp}Pedir por WhatsApp</a></div>`;
    marcar(r.zona.id);
    if (mapa) volar(r.zona); else crearMapa();
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    const t = input.value.trim().slice(0, 60);
    if (!t) { input.focus(); return; }
    mostrar(buscarZona(t), t);
  });
  input.addEventListener('change', () => {
    const r = buscarZona(input.value);
    if (r && normalizar(r.lugar) === normalizar(input.value.trim())) mostrar(r, input.value.trim());
  });
  box.addEventListener('click', e => {
    const b = e.target.closest('[data-zona-elegir]');
    if (!b) return;
    const z = ZONAS.find(x => x.id === b.dataset.zonaElegir);
    if (!z) return;
    input.value = z.nombre;
    mostrar({ zona: z, lugar: z.nombre }, z.nombre);
  });
  marcar(Entrega.get().zona);
  document.addEventListener('entrega:updated', () => marcar(Entrega.get().zona));
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  if (reduceMotion || typeof gsap === 'undefined') { hero.classList.add('is-listo'); return; }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: () => hero.classList.add('is-listo') });
  const desdeA = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desdeA('.hero1__bruma', { opacity: 0, scale: 0.86, transformOrigin: '50% 50%', duration: 1.8, clearProps: 'transform,opacity' }, 0);
  desdeA('.hero1__kraft', { opacity: 0, x: -26, y: 18, duration: 1.4, clearProps: 'transform,opacity' }, 0.12);
  desdeA('.hero1__foto', { y: 36, opacity: 0, duration: 1.3, clearProps: 'transform,opacity' }, 0.05);
  desdeA('[data-hero-img]', { scale: 1.09, duration: 1.8 }, 0);
  desdeA('.hero2__foto', { clipPath: 'inset(100% 0 0 0)', duration: 1.5, ease: 'power3.inOut', clearProps: 'clipPath' }, 0);
  desdeA('.hero1__segunda', { y: 46, opacity: 0, rotation: -12, duration: 1.3, clearProps: 'transform,opacity' }, 0.5);
  desdeA('.ola', { yPercent: 40, opacity: 0, duration: 1.6, clearProps: 'transform,opacity' }, 0.2);
  desdeA('.hero-eyebrow', { y: 14, opacity: 0, duration: 0.9 }, 0.1);
  desdeA('h1', { y: 26, opacity: 0, clipPath: 'inset(100% 0 0 0)', duration: 1.2, clearProps: 'clipPath,transform,opacity' }, 0.2);
  desdeA('.hero__subrayado', { scaleX: 0, transformOrigin: '0 50%', duration: 1, ease: 'power3.out', clearProps: 'transform' }, 0.55);
  desdeA('.hero-lead', { y: 20, opacity: 0, duration: 1 }, 0.4);
  desdeA('.hero-ctas .btn', { y: 16, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55);
  desdeA('.hero__datos li', { y: 12, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.72);
  desdeA('.hero__tarjeta', { rotation: 16, opacity: 0, transformOrigin: '50% 0%', duration: 1.6, ease: 'elastic.out(1, 0.45)', clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax-hero]').forEach(el => {
    gsap.to(el, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
  });
  document.querySelectorAll('[data-parallax]').forEach(el => {
    gsap.fromTo(el, { yPercent: 5 }, { yPercent: -5, ease: 'none', scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

async function iniciarTienda() {
  const response = await fetch('catalogo.php?counts=1');
  if (!response.ok) throw new Error('Catálogo no disponible');
  Tienda.counts = await response.json();
  const ids = [...new Set([...Cart.get().map(i=>i.id), ...Array.from(document.querySelectorAll('[data-precio-de]'), el=>el.dataset.precioDe)])];
  if (ids.length) await Tienda.consultar({scope:'lookup', filtros:{ids},limite:100});
  for (const fn of [initPrecios, initRail, initMosaico, initCategoriasCuenta, initMenuCategorias, initCatalogo, initOcasiones, initZonas, initReveals, initHeroMotion, initParallax, initRails, initNav, initDrawer, initVistaRapida, initCompras, initFloats, initModelBarScroll, initProductoUrl]) await fn();
  Cart.sync();
  updateCartBadge();
}
iniciarTienda().catch(error => {console.error(error); document.querySelector('main')?.insertAdjacentHTML('afterbegin','<p role="alert">No pudimos cargar la tienda. Volvé a intentar o consultanos por WhatsApp.</p>');});
