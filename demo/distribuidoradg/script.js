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
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const WSP = '5491166576121';
const RE_TILDES = new RegExp('[\\u0300-\\u036f]', 'g');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(RE_TILDES, '');
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

const MATERIALES = { cuero: 'Cuero vacuno', eco: 'Eco cuero', lona: 'Lona' };

const MODELOS = [
  {
    id: 'cartera-mora', nombre: 'Cartera Mora', fam: 'carteras', foto: 'modelo-cartera.webp',
    alt: 'Cartera de mano color nude con textura croco y cierre dorado',
    material: 'Eco cuero croco', mat: 'eco', medidas: '26 × 18 × 11 cm', colores: ['nude', 'negro', 'camel'],
    uso: 'De mano o cruzada', cierre: 'Broche metálico', bulto: 6, rota: 3,
    desc: 'La cartera estructurada que más sale en los locales de centro. Correa larga desmontable incluida.'
  },
  {
    id: 'tote-alma', nombre: 'Tote Alma', fam: 'carteras', foto: 'modelo-tote.webp',
    alt: 'Cartera tote de cuero color camel con manijas marrones',
    material: 'Cuero vacuno', mat: 'cuero', medidas: '38 × 30 × 12 cm', colores: ['camel', 'suela', 'negro'],
    uso: 'Al hombro', cierre: 'Imán', bulto: 6, rota: 3,
    desc: 'Tote grande para el día: entra una notebook de 14". Forro de tela con bolsillo interno con cierre.'
  },
  {
    id: 'bolso-nube', nombre: 'Bolso Nube', fam: 'carteras', foto: 'modelo-bolso.webp',
    alt: 'Bolso de lona gris claro con manijas negras de eco cuero',
    material: 'Lona y eco cuero', mat: 'lona', medidas: '30 × 24 × 12 cm', colores: ['piedra', 'hueso'],
    uso: 'De mano o cruzado', cierre: 'Cierre', bulto: 6, rota: 2,
    desc: 'Lona texturada con manijas y detalles de eco cuero. Liviano, para primavera y verano.'
  },
  {
    id: 'mochila-andes', nombre: 'Mochila Andes', fam: 'mochilas', foto: 'modelo-mochila.webp',
    alt: 'Mochila de cuero habano y lona verde con varios bolsillos y hebillas',
    material: 'Cuero y lona encerada', mat: 'cuero', medidas: '32 × 44 × 16 cm', colores: ['habano', 'negro'],
    uso: 'Espalda', cierre: 'Hebillas y tanza', bulto: 4, rota: 1,
    desc: 'Mochila de viaje con bolsillos laterales y frontal. Para locales de camping y outdoor.'
  },
  {
    id: 'rinonera-luna', nombre: 'Riñonera Luna', fam: 'rinoneras', foto: 'modelo-bandolera.webp',
    alt: 'Riñonera negra de eco cuero usada cruzada sobre un traje claro',
    material: 'Eco cuero', mat: 'eco', medidas: '30 × 14 × 6 cm', colores: ['negro', 'suela', 'hueso'],
    uso: 'Cintura o cruzada', cierre: 'Cierre', bulto: 6, rota: 3,
    desc: 'Se usa a la cintura o cruzada al pecho. Correa regulable con hebilla de enganche rápido.'
  },
  {
    id: 'bandolera-rio', nombre: 'Bandolera Río', fam: 'rinoneras', foto: 'modelo-cruzada.webp',
    alt: 'Bandolera de cuero marrón con correa larga sobre fondo blanco',
    material: 'Cuero vacuno', mat: 'cuero', medidas: '22 × 16 × 7 cm', colores: ['suela', 'habano', 'negro'],
    uso: 'Cruzada', cierre: 'Cierre', bulto: 6, rota: 2,
    desc: 'Bandolera chica de cuero, con bolsillo trasero para el celular. Unisex.'
  },
  {
    id: 'tarjetero-duo', nombre: 'Tarjetero Duo', fam: 'billeteras', foto: 'modelo-billetera.webp',
    alt: 'Tarjeteros de cuero color suela sobre fondo beige',
    material: 'Cuero vacuno', mat: 'cuero', medidas: '10 × 7 cm', colores: ['suela', 'camel', 'negro'],
    uso: 'Bolsillo', cierre: 'Sin cierre', bulto: 12, rota: 2,
    desc: 'Tarjetero plegable con cuatro ranuras y bolsillo para billetes. Buen producto de mostrador.'
  },
  {
    id: 'cinto-clasico', nombre: 'Cinto Clásico', fam: 'cintos', foto: 'modelo-cinto.webp',
    alt: 'Cinto de cuero negro enrollado con hebilla metálica',
    material: 'Cuero vacuno', mat: 'cuero', medidas: '3,5 cm de ancho', colores: ['negro', 'habano'],
    uso: 'Talles 85 a 110', cierre: 'Hebilla metálica', bulto: 12, rota: 2,
    desc: 'Cinto de vestir de una sola pieza, con hebilla de metal cepillado. Talles surtidos por bulto.'
  }
];

const VIDRIERA = ['tote-alma', 'cartera-mora', 'rinonera-luna', 'bandolera-rio', 'tarjetero-duo'];
const FAM_LABEL = Object.fromEntries(FAMILIAS.map(f => [f.id, f.nombre]));
const getModelo = id => MODELOS.find(m => m.id === id);

let famActiva = 'todas';
let colorActivo = '';
let matActivo = '';
let busqueda = '';
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
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

/* ---------- lista de pedido (una línea por modelo + color, en bultos) ---------- */
const Cart = {
  KEY: 'distribuidoradg_lista',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin storage */ } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(modelo, color, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === modelo.id && i.color === color);
    if (existing) existing.qty = Math.min(existing.qty + qty, 99);
    else items.push({ id: modelo.id, color, qty: Math.min(qty, 99) });
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
const swatch = (c, activo, attr) => '<button type="button" class="sw' + (activo ? ' is-on' : '') + '" ' + attr + '="' + c + '" aria-label="' + esc(COLORES[c].nombre) + '" aria-pressed="' + (activo ? 'true' : 'false') + '"><i style="--c:' + COLORES[c].hex + '"></i></button>';
const dot = c => '<span class="dot" style="--c:' + COLORES[c].hex + '" title="' + esc(COLORES[c].nombre) + '"></span>';

/* ---------- colecciones ---------- */
function initColecciones() {
  const cont = document.getElementById('colGrid');
  if (!cont) return;
  cont.innerHTML = FAMILIAS.map(f => {
    const n = MODELOS.filter(m => m.fam === f.id).length;
    return '<button type="button" class="col-card" data-fam="' + f.id + '" data-animate="up" style="transform:translateY(24px);opacity:0">' +
      '<span class="col-foto"><img src="images/' + f.foto + '" width="1200" height="1500" alt="' + esc(f.nombre) + '"></span>' +
      '<span class="col-nombre">' + esc(f.nombre) + '<span class="col-n">' + n + (n === 1 ? ' modelo' : ' modelos') + '</span></span>' +
      '</button>';
  }).join('');
  cont.addEventListener('click', e => {
    const b = e.target.closest('.col-card');
    if (!b) return;
    famActiva = b.dataset.fam;
    pintarFiltros();
    renderGrid();
    document.getElementById('catalogo')?.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

/* ---------- vidriera ---------- */
function initVidriera() {
  const cont = document.getElementById('mosaico');
  if (!cont) return;
  cont.innerHTML = VIDRIERA.map(id => {
    const m = getModelo(id);
    if (!m) return '';
    return '<button type="button" class="tile" data-id="' + m.id + '">' +
      '<span class="tile-foto"><img src="images/' + m.foto + '" width="1200" height="1500" alt="' + esc(m.alt) + '"></span>' +
      '<span class="tile-nombre">' + esc(m.nombre) + '</span>' +
      '<span class="tile-meta">' + esc(m.material) + ' · ' + m.colores.length + ' colores · bulto x' + m.bulto + '</span>' +
      '</button>';
  }).join('');
  cont.addEventListener('click', e => {
    const t = e.target.closest('.tile');
    if (t) abrirModal(t.dataset.id);
  });
}

/* ---------- momento propio: comparador ---------- */
const FILAS = [
  ['Familia', m => FAM_LABEL[m.fam]],
  ['Material', m => m.material],
  ['Medidas', m => m.medidas],
  ['Colores', m => m.colores.map(c => COLORES[c].nombre).join(', ')],
  ['Uso', m => m.uso],
  ['Cierre', m => m.cierre],
  ['Bulto', m => m.bulto + ' unidades']
];

function initComparador() {
  const selA = document.getElementById('cmpSelA');
  const selB = document.getElementById('cmpSelB');
  if (!selA || !selB) return;
  const opciones = MODELOS.map(m => '<option value="' + m.id + '">' + esc(m.nombre) + '</option>').join('');
  selA.innerHTML = opciones;
  selB.innerHTML = opciones;
  selA.value = 'cartera-mora';
  selB.value = 'tote-alma';

  const fotoA = document.getElementById('cmpFotoA');
  const fotoB = document.getElementById('cmpFotoB');
  const tabla = document.getElementById('cmpTabla');
  const dif = document.getElementById('cmpDif');
  const sumA = document.getElementById('cmpSumarA');
  const sumB = document.getElementById('cmpSumarB');

  const ponerFoto = (cont, m) => {
    const actual = cont.querySelector('img');
    if (actual && actual.getAttribute('src') === 'images/' + m.foto) return;
    cont.classList.add('cambia');
    setTimeout(() => {
      cont.innerHTML = '<img src="images/' + m.foto + '" width="1200" height="1500" alt="' + esc(m.alt) + '">';
      cont.classList.remove('cambia');
    }, actual && !reduceMotion ? 180 : 0);
  };

  const pintar = () => {
    const a = getModelo(selA.value);
    const b = getModelo(selB.value);
    if (!a || !b) return;
    ponerFoto(fotoA, a);
    ponerFoto(fotoB, b);
    const distintas = [];
    tabla.innerHTML = FILAS.map(([nombre, get]) => {
      const va = get(a), vb = get(b);
      const distinta = va !== vb;
      if (distinta) distintas.push(nombre.toLowerCase());
      const celdaA = nombre === 'Colores' ? '<span class="dots">' + a.colores.map(dot).join('') + '</span> ' + a.colores.length : esc(va);
      const celdaB = nombre === 'Colores' ? b.colores.length + ' <span class="dots">' + b.colores.map(dot).join('') + '</span>' : esc(vb);
      return '<div class="cmp-fila' + (distinta ? ' distinta' : '') + '"><dt>' + nombre + '</dt><dd class="a">' + celdaA + '</dd><dd class="b">' + celdaB + '</dd></div>';
    }).join('');
    dif.innerHTML = distintas.length
      ? 'Difieren en <b>' + distintas.length + ' de ' + FILAS.length + '</b>: ' + esc(distintas.join(', ')) + '.'
      : 'Son el mismo modelo.';
    sumA.textContent = 'Sumar ' + a.nombre;
    sumB.textContent = 'Sumar ' + b.nombre;
  };

  selA.addEventListener('change', () => {
    if (selA.value === selB.value) selB.value = MODELOS.find(m => m.id !== selA.value).id;
    pintar();
  });
  selB.addEventListener('change', () => {
    if (selA.value === selB.value) selA.value = MODELOS.find(m => m.id !== selB.value).id;
    pintar();
  });
  const sumar = sel => {
    const m = getModelo(sel.value);
    if (!m) return;
    Cart.add(m, m.colores[0], 1);
    showToast(m.nombre + ' · ' + COLORES[m.colores[0]].nombre + ' · 1 bulto a la lista');
  };
  sumA.addEventListener('click', () => sumar(selA));
  sumB.addEventListener('click', () => sumar(selB));
  pintar();
}

/* ---------- componente funcional: armá tu surtido ---------- */
function armarSurtido(U, fams, modo) {
  const pool = MODELOS.filter(m => fams.includes(m.fam))
    .slice().sort((a, b) => (modo === 'rota' ? b.rota - a.rota : 0));
  if (!pool.length) return { lineas: [], unidades: 0 };
  const turnos = [];
  if (modo === 'rota') {
    const maxRota = Math.max(...pool.map(m => m.rota));
    for (let r = maxRota; r >= 1; r--) pool.forEach(m => { if (m.rota >= r) turnos.push(m); });
  } else {
    pool.forEach(m => turnos.push(m));
  }
  const bultos = new Map();
  let total = 0, i = 0, fallidos = 0;
  while (fallidos < turnos.length) {
    const m = turnos[i % turnos.length];
    i++;
    if (total + m.bulto > U) { fallidos++; continue; }
    fallidos = 0;
    bultos.set(m.id, (bultos.get(m.id) || 0) + 1);
    total += m.bulto;
  }
  const lineas = [];
  bultos.forEach((b, id) => {
    const m = getModelo(id);
    const cols = modo === 'rota' ? [m.colores[0]] : m.colores;
    const porColor = new Map();
    for (let k = 0; k < b; k++) { const c = cols[k % cols.length]; porColor.set(c, (porColor.get(c) || 0) + 1); }
    porColor.forEach((q, c) => lineas.push({ id, color: c, qty: q }));
  });
  return { lineas, unidades: total };
}

function initSurtido() {
  const form = document.getElementById('surtidoForm');
  if (!form) return;
  const rango = document.getElementById('surUnidades');
  const salida = document.getElementById('surUnidadesOut');
  const famCont = document.getElementById('surFamilias');
  const resumen = document.getElementById('surResumen');
  const lista = document.getElementById('surLista');
  const linkWsp = document.getElementById('surWsp');
  const modos = [...form.querySelectorAll('.modo-btn')];

  let fams = FAMILIAS.map(f => f.id);
  let modo = 'rota';
  let actual = { lineas: [], unidades: 0 };

  famCont.innerHTML = FAMILIAS.map(f => '<button type="button" class="fam-chip is-on" data-fam="' + f.id + '" aria-pressed="true">' + esc(f.nombre) + '</button>').join('');

  const pintar = () => {
    const U = parseInt(rango.value, 10);
    salida.innerHTML = '<strong>' + U + '</strong> u.';
    actual = armarSurtido(U, fams, modo);
    const modelos = new Set(actual.lineas.map(l => l.id)).size;
    const colores = new Set(actual.lineas.map(l => l.color)).size;
    if (!actual.lineas.length) {
      resumen.innerHTML = 'Elegí al menos una familia para armar el surtido.';
      lista.innerHTML = '';
      linkWsp.setAttribute('href', wa('Hola Distribuidora DG, quiero armar un surtido por mayor.'));
      return;
    }
    resumen.innerHTML = '<b>' + actual.unidades + ' unidades</b> en ' + modelos + (modelos === 1 ? ' modelo' : ' modelos') + ' y ' + colores + (colores === 1 ? ' color' : ' colores') +
      (actual.unidades < U ? ' · el resto no completa un bulto cerrado' : '');
    lista.innerHTML = actual.lineas.map(l => {
      const m = getModelo(l.id);
      return '<li><span class="s-modelo">' + dot(l.color) + '<span>' + esc(m.nombre) + ' · ' + esc(COLORES[l.color].nombre) + '</span></span><span class="s-cant">' + bultosTxt(l.qty, m) + '</span></li>';
    }).join('');
    const msg = 'Hola Distribuidora DG, armé este surtido de ' + actual.unidades + ' unidades en la web:\n' +
      actual.lineas.map(l => { const m = getModelo(l.id); return '• ' + m.nombre + ' · ' + COLORES[l.color].nombre + ' · ' + bultosTxt(l.qty, m); }).join('\n') +
      '\n¿Me pasás la cotización?';
    linkWsp.setAttribute('href', wa(msg));
  };

  rango.addEventListener('input', pintar);
  famCont.addEventListener('click', e => {
    const b = e.target.closest('.fam-chip');
    if (!b) return;
    const id = b.dataset.fam;
    fams = fams.includes(id) ? fams.filter(x => x !== id) : fams.concat(id);
    b.classList.toggle('is-on', fams.includes(id));
    b.setAttribute('aria-pressed', fams.includes(id) ? 'true' : 'false');
    pintar();
  });
  modos.forEach(b => b.addEventListener('click', () => {
    modo = b.dataset.modo;
    modos.forEach(x => x.classList.toggle('is-on', x === b));
    pintar();
  }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!actual.lineas.length) { showToast('Elegí al menos una familia'); return; }
    actual.lineas.forEach(l => { const m = getModelo(l.id); if (m) Cart.add(m, l.color, l.qty); });
    showToast('Surtido de ' + actual.unidades + ' unidades en la lista');
    abrirDrawer();
  });
  pintar();
}

/* ---------- catálogo ---------- */
const colorCard = new Map(MODELOS.map(m => [m.id, m.colores[0]]));
const qtyCard = new Map(MODELOS.map(m => [m.id, 1]));

function visibles() {
  const q = norm(busqueda.trim());
  return MODELOS.filter(m => {
    if (famActiva !== 'todas' && m.fam !== famActiva) return false;
    if (colorActivo && !m.colores.includes(colorActivo)) return false;
    if (matActivo && m.mat !== matActivo) return false;
    if (!q) return true;
    return norm([m.nombre, FAM_LABEL[m.fam], m.material, m.uso, m.desc].concat(m.colores.map(c => COLORES[c].nombre)).join(' ')).includes(q);
  });
}

function pintarFiltros() {
  const chips = document.getElementById('chipsCat');
  if (chips) {
    const todas = [{ id: 'todas', nombre: 'Todo' }].concat(FAMILIAS);
    chips.innerHTML = todas.map(f => '<button type="button" class="chip' + (f.id === famActiva ? ' is-on' : '') + '" data-fam="' + f.id + '" aria-pressed="' + (f.id === famActiva) + '">' + esc(f.nombre) + '</button>').join('');
  }
  const sw = document.getElementById('swatchesFiltro');
  if (sw) sw.innerHTML = Object.keys(COLORES).map(c => swatch(c, c === colorActivo, 'data-filtro-color')).join('');
  const sel = document.getElementById('filtroMaterial');
  if (sel && !sel.options.length) {
    sel.innerHTML = '<option value="">Todos</option>' + Object.entries(MATERIALES).map(([k, v]) => {
      const n = MODELOS.filter(m => m.mat === k).length;
      return '<option value="' + k + '">' + esc(v) + ' (' + n + ')</option>';
    }).join('');
  }
  if (sel) sel.value = matActivo;
}

function tarjeta(m) {
  const c = colorCard.get(m.id);
  return '<article class="prod pre" data-id="' + m.id + '">' +
    '<button type="button" class="prod-foto" data-ver="' + m.id + '" aria-label="Ver ' + esc(m.nombre) + '">' +
    '<img src="images/' + m.foto + '" width="1200" height="1500" alt="' + esc(m.alt) + '">' +
    '<span class="prod-bulto">Bulto x' + m.bulto + '</span></button>' +
    '<h3 class="prod-nombre">' + esc(m.nombre) + '</h3>' +
    '<p class="prod-meta">' + esc(m.material) + ' · ' + esc(m.medidas) + '</p>' +
    '<div class="swatches" role="group" aria-label="Color de ' + esc(m.nombre) + '">' + m.colores.map(col => swatch(col, col === c, 'data-color-' + m.id)).join('') + '</div>' +
    '<p class="prod-meta" data-color-nombre="' + m.id + '">' + esc(COLORES[c].nombre) + '</p>' +
    '<div class="prod-actions">' +
    '<div class="stepper"><button type="button" class="stepper-btn" data-menos="' + m.id + '" aria-label="Un bulto menos">−</button>' +
    '<span class="stepper-n" data-n="' + m.id + '">' + qtyCard.get(m.id) + '</span>' +
    '<button type="button" class="stepper-btn" data-mas="' + m.id + '" aria-label="Un bulto más">+</button></div>' +
    '<button type="button" class="prod-add" data-add="' + m.id + '">Agregar a la lista</button>' +
    '</div></article>';
}

function renderGrid() {
  const grid = document.getElementById('gridProd');
  const vacio = document.getElementById('vacio');
  const conteo = document.getElementById('conteo');
  if (!grid) return;
  const lista = visibles();
  grid.innerHTML = lista.map(tarjeta).join('');
  if (vacio) vacio.hidden = lista.length > 0;
  if (conteo) {
    const partes = [];
    if (famActiva !== 'todas') partes.push(FAM_LABEL[famActiva].toLowerCase());
    if (colorActivo) partes.push('en ' + COLORES[colorActivo].nombre.toLowerCase());
    if (matActivo) partes.push('de ' + MATERIALES[matActivo].toLowerCase());
    if (busqueda.trim()) partes.push('para «' + busqueda.trim() + '»');
    conteo.textContent = lista.length + (lista.length === 1 ? ' modelo' : ' modelos') + (partes.length ? ' · ' + partes.join(' · ') : '');
  }
  revelarProductos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function revelarProductos(grid) {
  const cards = [...grid.children];
  const soltar = () => cards.forEach((c, i) => setTimeout(() => { c.classList.add('revela'); c.classList.remove('pre'); }, reduceMotion ? 0 : Math.min(i * 90, 540)));
  if (reduceMotion || grid.getBoundingClientRect().top < window.innerHeight * 0.95) { soltar(); return; }
  let hecho = false;
  const una = () => { if (hecho) return; hecho = true; soltar(); window.removeEventListener('scroll', mirar); window.removeEventListener('resize', mirar); };
  function mirar() { const r = grid.getBoundingClientRect(); if (r.bottom > 0 && r.top < window.innerHeight * 0.95) una(); }
  window.addEventListener('scroll', mirar, { passive: true });
  window.addEventListener('resize', mirar, { passive: true });
  setTimeout(una, 4000);
}

function initCatalogo() {
  pintarFiltros();
  renderGrid();

  document.getElementById('chipsCat')?.addEventListener('click', e => {
    const c = e.target.closest('.chip');
    if (!c) return;
    famActiva = c.dataset.fam;
    pintarFiltros(); renderGrid();
  });
  document.getElementById('swatchesFiltro')?.addEventListener('click', e => {
    const s = e.target.closest('[data-filtro-color]');
    if (!s) return;
    const c = s.getAttribute('data-filtro-color');
    colorActivo = colorActivo === c ? '' : c;
    pintarFiltros(); renderGrid();
  });
  document.getElementById('filtroMaterial')?.addEventListener('change', e => {
    matActivo = e.target.value;
    renderGrid();
  });
  const buscar = document.getElementById('buscar');
  buscar?.addEventListener('input', () => { busqueda = buscar.value; renderGrid(); });
  document.getElementById('limpiar')?.addEventListener('click', () => {
    famActiva = 'todas'; colorActivo = ''; matActivo = ''; busqueda = '';
    if (buscar) buscar.value = '';
    pintarFiltros(); renderGrid();
  });

  const grid = document.getElementById('gridProd');
  grid?.addEventListener('click', e => {
    const ver = e.target.closest('[data-ver]');
    if (ver) { abrirModal(ver.dataset.ver); return; }
    const sw = e.target.closest('.sw');
    if (sw) {
      const attr = [...sw.attributes].find(a => a.name.startsWith('data-color-'));
      if (!attr) return;
      const id = attr.name.replace('data-color-', '');
      colorCard.set(id, attr.value);
      const card = grid.querySelector('.prod[data-id="' + id + '"]');
      card?.querySelectorAll('.sw').forEach(b => {
        const on = b.getAttribute(attr.name) === attr.value;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      const nom = grid.querySelector('[data-color-nombre="' + id + '"]');
      if (nom) nom.textContent = COLORES[attr.value].nombre;
      return;
    }
    const mas = e.target.closest('[data-mas]');
    const menos = e.target.closest('[data-menos]');
    if (mas || menos) {
      const id = (mas || menos).dataset.mas || (mas || menos).dataset.menos;
      const n = Math.max(1, Math.min(99, qtyCard.get(id) + (mas ? 1 : -1)));
      qtyCard.set(id, n);
      const span = grid.querySelector('[data-n="' + id + '"]');
      if (span) span.textContent = n;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const m = getModelo(add.dataset.add);
      if (!m) return;
      const c = colorCard.get(m.id);
      const n = qtyCard.get(m.id);
      Cart.add(m, c, n);
      qtyCard.set(m.id, 1);
      const span = grid.querySelector('[data-n="' + m.id + '"]');
      if (span) span.textContent = '1';
      showToast(m.nombre + ' · ' + COLORES[c].nombre + ' · ' + bultosTxt(n, m));
    }
  });
}

/* ---------- instagram ---------- */
function initIg() {
  const cont = document.getElementById('igGrid');
  if (!cont) return;
  const fotos = ['modelo-bandolera.webp', 'modelo-cartera.webp', 'deposito.webp', 'modelo-cruzada.webp'];
  cont.innerHTML = fotos.map(f => {
    const m = MODELOS.find(x => x.foto === f);
    const alt = m ? m.alt : 'Exhibidor con carteras colgadas en un local';
    return '<div class="ig-tile"><img src="images/' + f + '" width="1200" height="1500" alt="' + esc(alt) + '"></div>';
  }).join('');
}

/* ---------- modal ---------- */
let modalModelo = null, modalColor = '', modalQty = 1;

function pintarModal() {
  const m = modalModelo;
  if (!m) return;
  document.getElementById('modalColorNombre').textContent = COLORES[modalColor].nombre;
  document.getElementById('modalSwatches').innerHTML = m.colores.map(c => swatch(c, c === modalColor, 'data-modal-color')).join('');
  document.getElementById('modalQty').textContent = modalQty;
  document.getElementById('modalUnid').textContent = modalQty + (modalQty === 1 ? ' bulto' : ' bultos') + ' = ' + (modalQty * m.bulto) + ' unidades en ' + COLORES[modalColor].nombre.toLowerCase() + '.';
}

function abrirModal(id) {
  const m = getModelo(id);
  const back = document.getElementById('modal');
  if (!m || !back) return;
  modalModelo = m; modalColor = colorCard.get(m.id) || m.colores[0]; modalQty = 1;
  document.getElementById('modalFoto').innerHTML = '<img src="images/' + m.foto + '" width="1200" height="1500" alt="' + esc(m.alt) + '">';
  document.getElementById('modalFam').textContent = FAM_LABEL[m.fam];
  document.getElementById('modalTitulo').textContent = m.nombre;
  document.getElementById('modalDesc').textContent = m.desc;
  document.getElementById('modalSpecs').innerHTML = FILAS.filter(f => f[0] !== 'Familia' && f[0] !== 'Colores')
    .map(([n, get]) => '<div><dt>' + n + '</dt><dd>' + esc(get(m)) + '</dd></div>').join('');
  const rel = MODELOS.filter(x => x.fam === m.fam && x.id !== m.id).concat(MODELOS.filter(x => x.fam !== m.fam)).slice(0, 3);
  document.getElementById('modalRel').innerHTML = '<p class="rel-titulo">También te puede servir</p><div class="rel-lista">' +
    rel.map(x => '<button type="button" class="rel-card" data-rel="' + x.id + '"><span class="rel-foto"><img src="images/' + x.foto + '" width="600" height="750" alt="' + esc(x.alt) + '"></span><span>' + esc(x.nombre) + '</span></button>').join('') + '</div>';
  pintarModal();
  ultimoFoco = document.activeElement;
  back.hidden = false;
  document.body.classList.add('no-scroll');
  document.getElementById('modalClose')?.focus();
}

function cerrarModal() {
  const back = document.getElementById('modal');
  if (!back || back.hidden) return;
  back.hidden = true;
  if (document.getElementById('drawer')?.hidden !== false) document.body.classList.remove('no-scroll');
  ultimoFoco?.focus();
}

function trapFoco(cont, e) {
  const foco = cont.querySelectorAll('a[href], button:not([disabled]), select');
  if (!foco.length) return;
  const primero = foco[0], ultimo = foco[foco.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function initModal() {
  const back = document.getElementById('modal');
  if (!back) return;
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  back.addEventListener('click', e => {
    if (e.target === back) { cerrarModal(); return; }
    const sw = e.target.closest('[data-modal-color]');
    if (sw) { modalColor = sw.getAttribute('data-modal-color'); pintarModal(); return; }
    const r = e.target.closest('[data-rel]');
    if (r) abrirModal(r.dataset.rel);
  });
  document.getElementById('modalMas')?.addEventListener('click', () => { modalQty = Math.min(99, modalQty + 1); pintarModal(); });
  document.getElementById('modalMenos')?.addEventListener('click', () => { modalQty = Math.max(1, modalQty - 1); pintarModal(); });
  document.getElementById('modalAgregar')?.addEventListener('click', () => {
    if (!modalModelo) return;
    Cart.add(modalModelo, modalColor, modalQty);
    showToast(modalModelo.nombre + ' · ' + COLORES[modalColor].nombre + ' · ' + bultosTxt(modalQty, modalModelo));
    cerrarModal();
  });
  document.addEventListener('keydown', e => {
    if (back.hidden) return;
    if (e.key === 'Escape') { cerrarModal(); return; }
    if (e.key === 'Tab') trapFoco(back, e);
  });
}

/* ---------- lista de pedido (drawer) ---------- */
function mensajeLista() {
  const items = Cart.get();
  return 'Hola Distribuidora DG, quiero cotizar este pedido:\n' +
    items.map(i => { const m = getModelo(i.id); return m ? '• ' + m.nombre + ' · ' + COLORES[i.color].nombre + ' · ' + bultosTxt(i.qty, m) : ''; }).filter(Boolean).join('\n') +
    '\nTotal: ' + Cart.count() + ' bultos, ' + Cart.unidades() + ' unidades.';
}

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const pie = document.getElementById('drawerPie');
  if (!body || !pie) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = '<div class="drawer-vacio"><p>La lista está vacía. Sumá modelos desde el catálogo o armá un surtido.</p><a class="btn btn-linea" href="#catalogo" data-cerrar>Ir al catálogo</a></div>';
    pie.innerHTML = '';
    return;
  }
  body.innerHTML = items.map(i => {
    const m = getModelo(i.id);
    if (!m) return '';
    return '<div class="linea">' +
      '<span class="linea-foto"><img src="images/' + m.foto + '" width="200" height="250" alt="' + esc(m.alt) + '"></span>' +
      '<span><span class="linea-nombre">' + esc(m.nombre) + '</span>' +
      '<span class="linea-det">' + dot(i.color) + esc(COLORES[i.color].nombre) + ' · ' + bultosTxt(i.qty, m) + '</span></span>' +
      '<button type="button" class="linea-quitar" data-quitar="' + m.id + '" data-quitar-color="' + i.color + '">Quitar</button>' +
      '</div>';
  }).join('');
  pie.innerHTML = '<div class="drawer-total"><span>' + Cart.count() + ' bultos</span><b>' + Cart.unidades() + ' u.</b></div>' +
    '<a class="btn btn-cta btn-block" id="pedirCotizacion" href="' + wa(mensajeLista()) + '" target="_blank" rel="noopener">Pedir cotización por WhatsApp</a>' +
    '<button type="button" class="btn btn-linea btn-block" id="vaciarLista">Vaciar la lista</button>' +
    '<p class="drawer-nota">Los precios por mayor y la compra mínima te los confirmamos al cotizar.</p>';
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
  if (document.getElementById('modal')?.hidden !== false) document.body.classList.remove('no-scroll');
  ultimoFoco?.focus();
}

function initDrawer() {
  const d = document.getElementById('drawer');
  if (!d) return;
  document.getElementById('listaBtn')?.addEventListener('click', abrirDrawer);
  document.getElementById('lista-float')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarDrawer);
  d.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) { Cart.remove(q.dataset.quitar, q.dataset.quitarColor); return; }
    if (e.target.closest('#vaciarLista')) { Cart.clear(); return; }
    if (e.target.closest('[data-cerrar]')) cerrarDrawer();
  });
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderDrawer(); });
  document.addEventListener('keydown', e => {
    if (d.hidden) return;
    if (e.key === 'Escape') { cerrarDrawer(); return; }
    if (e.key === 'Tab') trapFoco(d, e);
  });
}

/* ---------- flotantes ---------- */
function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const lista = document.getElementById('lista-float');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    lista?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  sync();
}

/* ---------- reveals ---------- */
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => { el.style.transitionDelay = Math.min(i * 0.12, 0.72) + 's'; });
  });
  document.querySelectorAll('[data-animate][data-delay]').forEach(el => { el.style.transitionDelay = parseFloat(el.dataset.delay) + 's'; });
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
  let intentos = 0;
  const reloj = setInterval(() => { sweep(); if (++intentos > 12) clearInterval(reloj); }, 500);
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
    (document.querySelector('.site-header') || document.body).appendChild(bd);
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
  window.addEventListener('resize', syncInert, { passive: true });
  syncInert();
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
    MODELOS.forEach(m => {
      data['@graph'].push({
        '@type': 'Product',
        name: m.nombre,
        image: 'https://gokywebs.com/demo/distribuidoradg/images/' + m.foto,
        description: m.desc,
        category: FAM_LABEL[m.fam],
        material: m.material,
        color: m.colores.map(c => COLORES[c].nombre).join(', ')
      });
    });
    el.textContent = JSON.stringify(data);
  } catch { /* el negocio estático queda igual */ }
}

initColecciones();
initVidriera();
initCatalogo();
initIg();
initReveals();
initComparador();
initSurtido();
initModal();
initDrawer();
initFloats();
initNav();
initAnio();
initLd();
updateCartBadge();
