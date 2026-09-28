document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const WSP = '5491166576121';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const wa = txt => 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(txt);

const COLORES = {
  negro: { nombre: 'Negro', hex: '#1E1B19' },
  habano: { nombre: 'Habano', hex: '#5C3A26' },
  suela: { nombre: 'Suela', hex: '#8B5A36' },
  camel: { nombre: 'Camel', hex: '#B98A5E' },
  nude: { nombre: 'Nude', hex: '#E4C3AE' },
  piedra: { nombre: 'Gris piedra', hex: '#A9A39C' },
  hueso: { nombre: 'Blanco hueso', hex: '#EEE7DD' }
};

const FAMILIAS = [
  { id: 'carteras', nombre: 'Carteras', foto: 'modelo-tote.webp' },
  { id: 'rinoneras', nombre: 'Riñoneras y bandoleras', foto: 'modelo-bandolera.webp' },
  { id: 'mochilas', nombre: 'Mochilas', foto: 'modelo-mochila.webp' },
  { id: 'billeteras', nombre: 'Billeteras', foto: 'modelo-billetera.webp' },
  { id: 'cintos', nombre: 'Cintos', foto: 'modelo-cinto.webp' }
];

const MODELOS = [
  { id: 'cartera-mora', nombre: 'Cartera Mora', fam: 'carteras', foto: 'modelo-cartera.webp', alt: 'Cartera de mano color nude con textura croco y cierre dorado', material: 'Eco cuero croco', medidas: '26 × 18 × 11 cm', colores: ['nude', 'negro', 'camel'], bulto: 6 },
  { id: 'tote-alma', nombre: 'Tote Alma', fam: 'carteras', foto: 'modelo-tote.webp', alt: 'Cartera tote de cuero color camel con manijas marrones', material: 'Cuero vacuno', medidas: '38 × 30 × 12 cm', colores: ['camel', 'suela', 'negro'], bulto: 6 },
  { id: 'bolso-nube', nombre: 'Bolso Nube', fam: 'carteras', foto: 'modelo-bolso.webp', alt: 'Bolso de lona gris claro con manijas negras de eco cuero', material: 'Lona y eco cuero', medidas: '30 × 24 × 12 cm', colores: ['piedra', 'hueso'], bulto: 6 },
  { id: 'rinonera-luna', nombre: 'Riñonera Luna', fam: 'rinoneras', foto: 'modelo-bandolera.webp', alt: 'Riñonera negra de eco cuero usada cruzada sobre un traje claro', material: 'Eco cuero', medidas: '30 × 14 × 6 cm', colores: ['negro', 'suela', 'hueso'], bulto: 6 },
  { id: 'bandolera-rio', nombre: 'Bandolera Río', fam: 'rinoneras', foto: 'modelo-cruzada.webp', alt: 'Bandolera de cuero marrón con correa larga sobre fondo blanco', material: 'Cuero vacuno', medidas: '22 × 16 × 7 cm', colores: ['suela', 'habano', 'negro'], bulto: 6 },
  { id: 'mochila-andes', nombre: 'Mochila Andes', fam: 'mochilas', foto: 'modelo-mochila.webp', alt: 'Mochila de cuero habano y lona verde con varios bolsillos y hebillas', material: 'Cuero y lona encerada', medidas: '32 × 44 × 16 cm', colores: ['habano', 'negro'], bulto: 4 },
  { id: 'tarjetero-duo', nombre: 'Tarjetero Duo', fam: 'billeteras', foto: 'modelo-billetera.webp', alt: 'Tarjeteros de cuero color suela sobre fondo beige', material: 'Cuero vacuno', medidas: '10 × 7 cm', colores: ['suela', 'camel', 'negro'], bulto: 12 },
  { id: 'cinto-clasico', nombre: 'Cinto Clásico', fam: 'cintos', foto: 'modelo-cinto.webp', alt: 'Cinto de cuero negro enrollado con hebilla metálica', material: 'Cuero vacuno', medidas: 'Talles 85 a 110', colores: ['negro', 'habano'], bulto: 12 }
];

const getModelo = id => MODELOS.find(m => m.id === id);
const colorCard = new Map(MODELOS.map(m => [m.id, m.colores[0]]));
let famActiva = 'todas';
let ultimoFoco = null;

/* ---------- toast ---------- */
function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(msg) + '</span>';
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 2600);
}

/* ---------- pedido: una línea por modelo + color, en bultos ---------- */
const Cart = {
  KEY: 'distribuidoradgv2_pedido',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin storage */ } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(id, color) {
    const items = this.get();
    const existing = items.find(i => i.id === id && i.color === color);
    if (existing) existing.qty = Math.min(existing.qty + 1, 99);
    else items.push({ id, color, qty: 1 });
    this.save(items);
  },
  setQty(id, color, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.color === color);
    if (!it) return;
    if (qty < 1) { this.remove(id, color); return; }
    it.qty = Math.min(qty, 99);
    this.save(items);
  },
  remove(id, color) { this.save(this.get().filter(i => !(i.id === id && i.color === color))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  unidades() { return this.get().reduce((s, i) => { const m = getModelo(i.id); return m ? s + i.qty * m.bulto : s; }, 0); }
};

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

const bultosTxt = (qty, m) => qty + (qty === 1 ? ' bulto' : ' bultos') + ' (' + (qty * m.bulto) + ' u.)';

/* ---------- categorías ---------- */
function initCategorias() {
  const cont = document.getElementById('catGrid');
  if (!cont) return;
  cont.innerHTML = FAMILIAS.map(f => {
    const n = MODELOS.filter(m => m.fam === f.id).length;
    return '<button type="button" class="cat-card" data-fam="' + f.id + '">' +
      '<span class="cat-foto"><img src="images/' + f.foto + '" width="1200" height="1500" alt="" loading="lazy"></span>' +
      '<span class="cat-nombre">' + esc(f.nombre) + '</span>' +
      '<span class="cat-n">' + n + (n === 1 ? ' modelo' : ' modelos') + '</span>' +
      '</button>';
  }).join('');
  cont.addEventListener('click', e => {
    const b = e.target.closest('.cat-card');
    if (!b) return;
    famActiva = b.dataset.fam;
    pintarChips(); renderGrid();
    document.getElementById('catalogo')?.scrollIntoView({ block: 'start' });
  });
}

/* ---------- catálogo ---------- */
function pintarChips() {
  const chips = document.getElementById('chipsCat');
  if (!chips) return;
  chips.innerHTML = [{ id: 'todas', nombre: 'Todo' }].concat(FAMILIAS)
    .map(f => '<button type="button" class="chip' + (f.id === famActiva ? ' is-on' : '') + '" data-fam="' + f.id + '" aria-pressed="' + (f.id === famActiva) + '">' + esc(f.nombre) + '</button>').join('');
}

function tarjeta(m) {
  const c = colorCard.get(m.id);
  return '<article class="prod" data-id="' + m.id + '">' +
    '<div class="prod-foto"><img src="images/' + m.foto + '" width="1200" height="1500" alt="' + esc(m.alt) + '" loading="lazy"></div>' +
    '<h3 class="prod-nombre">' + esc(m.nombre) + '</h3>' +
    '<p class="prod-meta">' + esc(m.material) + ' · ' + esc(m.medidas) + '</p>' +
    '<p class="prod-bulto">Bulto de ' + m.bulto + ' unidades</p>' +
    '<div class="prod-color"><span class="prod-color-label">Color: <b data-color-nombre>' + esc(COLORES[c].nombre) + '</b></span>' +
    '<div class="swatches" role="group" aria-label="Color de ' + esc(m.nombre) + '">' +
    m.colores.map(col => '<button type="button" class="sw' + (col === c ? ' is-on' : '') + '" data-color="' + col + '" aria-label="' + esc(COLORES[col].nombre) + '" aria-pressed="' + (col === c) + '"><i style="--c:' + COLORES[col].hex + '"></i></button>').join('') +
    '</div></div>' +
    '<button type="button" class="btn btn-cta btn-block" data-add>Agregar al pedido</button>' +
    '</article>';
}

function renderGrid() {
  const grid = document.getElementById('gridProd');
  if (!grid) return;
  grid.innerHTML = MODELOS.filter(m => famActiva === 'todas' || m.fam === famActiva).map(tarjeta).join('');
}

function initCatalogo() {
  pintarChips();
  renderGrid();
  document.getElementById('chipsCat')?.addEventListener('click', e => {
    const c = e.target.closest('.chip');
    if (!c) return;
    famActiva = c.dataset.fam;
    pintarChips(); renderGrid();
  });
  document.getElementById('gridProd')?.addEventListener('click', e => {
    const card = e.target.closest('.prod');
    if (!card) return;
    const m = getModelo(card.dataset.id);
    if (!m) return;
    const sw = e.target.closest('.sw');
    if (sw) {
      colorCard.set(m.id, sw.dataset.color);
      card.querySelectorAll('.sw').forEach(b => {
        const on = b === sw;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      card.querySelector('[data-color-nombre]').textContent = COLORES[sw.dataset.color].nombre;
      return;
    }
    if (e.target.closest('[data-add]')) {
      const c = colorCard.get(m.id);
      Cart.add(m.id, c);
      showToast(m.nombre + ' · ' + COLORES[c].nombre + ' agregado al pedido');
    }
  });
}

/* ---------- mi pedido (drawer) ---------- */
function mensajePedido() {
  const items = Cart.get();
  return 'Hola Distribuidora DG, quiero cotizar este pedido:\n' +
    items.map(i => { const m = getModelo(i.id); return m ? '• ' + m.nombre + ' · ' + COLORES[i.color].nombre + ' · ' + bultosTxt(i.qty, m) : ''; }).filter(Boolean).join('\n') +
    '\nTotal: ' + Cart.count() + ' bultos, ' + Cart.unidades() + ' unidades.';
}

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const pie = document.getElementById('drawerPie');
  if (!body || !pie) return;
  const items = Cart.get().filter(i => getModelo(i.id) && COLORES[i.color]);
  if (!items.length) {
    body.innerHTML = '<div class="drawer-vacio"><p>Todavía no agregaste nada.</p><a class="btn btn-linea" href="#catalogo" data-cerrar>Ver el catálogo</a></div>';
    pie.innerHTML = '';
    return;
  }
  body.innerHTML = items.map(i => {
    const m = getModelo(i.id);
    return '<div class="linea">' +
      '<span class="linea-foto"><img src="images/' + m.foto + '" width="200" height="250" alt="' + esc(m.alt) + '"></span>' +
      '<span class="linea-info"><span class="linea-nombre">' + esc(m.nombre) + '</span>' +
      '<span class="linea-det">' + esc(COLORES[i.color].nombre) + ' · ' + (i.qty * m.bulto) + ' u.</span>' +
      '<span class="stepper">' +
      '<button type="button" class="stepper-btn" data-menos data-id="' + m.id + '" data-color="' + i.color + '" aria-label="Un bulto menos de ' + esc(m.nombre) + '">−</button>' +
      '<span class="stepper-n">' + i.qty + (i.qty === 1 ? ' bulto' : ' bultos') + '</span>' +
      '<button type="button" class="stepper-btn" data-mas data-id="' + m.id + '" data-color="' + i.color + '" aria-label="Un bulto más de ' + esc(m.nombre) + '">+</button>' +
      '</span></span>' +
      '<button type="button" class="linea-quitar" data-quitar data-id="' + m.id + '" data-color="' + i.color + '">Quitar</button>' +
      '</div>';
  }).join('');
  pie.innerHTML = '<div class="drawer-total"><span>' + Cart.count() + ' bultos</span><b>' + Cart.unidades() + ' unidades</b></div>' +
    '<a class="btn btn-wsp btn-block" href="' + wa(mensajePedido()) + '" target="_blank" rel="noopener">Enviar pedido por WhatsApp</a>' +
    '<p class="drawer-nota">Te respondemos con precios por mayor y disponibilidad. <button type="button" class="vaciar" data-vaciar>Vaciar pedido</button></p>';
}

function abrirDrawer() {
  const d = document.getElementById('drawer');
  const b = document.getElementById('drawerBackdrop');
  if (!d || !b) return;
  renderDrawer();
  ultimoFoco = document.activeElement;
  d.hidden = false; b.hidden = false;
  document.body.classList.add('no-scroll');
  document.getElementById('drawerClose')?.focus();
}

function cerrarDrawer() {
  const d = document.getElementById('drawer');
  const b = document.getElementById('drawerBackdrop');
  if (!d || d.hidden) return;
  d.hidden = true; b.hidden = true;
  document.body.classList.remove('no-scroll');
  ultimoFoco?.focus();
}

function initDrawer() {
  const d = document.getElementById('drawer');
  if (!d) return;
  document.getElementById('listaBtn')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarDrawer);
  d.addEventListener('click', e => {
    const btn = e.target.closest('[data-id]');
    if (btn) {
      const it = Cart.get().find(i => i.id === btn.dataset.id && i.color === btn.dataset.color);
      if (btn.hasAttribute('data-quitar')) Cart.remove(btn.dataset.id, btn.dataset.color);
      else if (it && btn.hasAttribute('data-mas')) Cart.setQty(it.id, it.color, it.qty + 1);
      else if (it && btn.hasAttribute('data-menos')) Cart.setQty(it.id, it.color, it.qty - 1);
      return;
    }
    if (e.target.closest('[data-vaciar]')) { Cart.clear(); return; }
    if (e.target.closest('[data-cerrar]')) cerrarDrawer();
  });
  document.addEventListener('cart:updated', () => {
    if (d.hidden) return;
    const foco = document.activeElement;
    const clave = foco?.dataset?.id ? '[data-id="' + foco.dataset.id + '"][data-color="' + foco.dataset.color + '"]' + (foco.hasAttribute('data-mas') ? '[data-mas]' : foco.hasAttribute('data-menos') ? '[data-menos]' : '') : '';
    renderDrawer();
    const nuevo = clave ? d.querySelector(clave) : null;
    (nuevo || document.getElementById('drawerClose'))?.focus();
  });
  document.addEventListener('keydown', e => {
    if (d.hidden) return;
    if (e.key === 'Escape') { cerrarDrawer(); return; }
    if (e.key !== 'Tab') return;
    const foco = d.querySelectorAll('a[href], button:not([disabled])');
    if (!foco.length) return;
    const primero = foco[0], ultimo = foco[foco.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
}

/* ---------- whatsapp flotante ---------- */
function initWspFloat() {
  const wsp = document.getElementById('wsp-float');
  if (!wsp) return;
  const sync = () => wsp.classList.toggle('visible', window.scrollY > 400);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

function initAnio() {
  const el = document.getElementById('anio');
  if (el) el.textContent = new Date().getFullYear();
}

function initLd() {
  const el = document.getElementById('ldGraph');
  if (!el) return;
  try {
    const data = JSON.parse(el.textContent);
    const famNombre = Object.fromEntries(FAMILIAS.map(f => [f.id, f.nombre]));
    MODELOS.forEach(m => {
      data['@graph'].push({
        '@type': 'Product',
        name: m.nombre,
        image: 'https://gokywebs.com/demo/distribuidoradgv2/images/' + m.foto,
        category: famNombre[m.fam],
        material: m.material,
        color: m.colores.map(c => COLORES[c].nombre).join(', ')
      });
    });
    el.textContent = JSON.stringify(data);
  } catch { /* el negocio estático queda igual */ }
}

initCategorias();
initCatalogo();
initDrawer();
initWspFloat();
initAnio();
initLd();
updateCartBadge();
