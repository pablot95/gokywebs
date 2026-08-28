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
const hasST = typeof ScrollTrigger !== 'undefined';
const WSP = '5491168486863';

if (hasGsap && hasST) gsap.registerPlugin(ScrollTrigger);
if (!hasGsap) {
  document.querySelectorAll('[data-animate], [data-hero]').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none';
  });
}
if (hasST) window.addEventListener('load', () => ScrollTrigger.refresh());

const CATEGORIAS = [
  { id: 'sellado', nombre: 'Sellado TCG', img: 'boosterbox.webp', pie: 'Sobres, cajas y displays' },
  { id: 'cartas', nombre: 'Cartas sueltas', img: 'carta-magnetico.webp', pie: 'Protegidas y listas para vitrina' },
  { id: 'accesorios', nombre: 'Accesorios', img: 'deckbox.webp', pie: 'Protectores, deck box y dados' },
  { id: 'coleccionables', nombre: 'Coleccionables', img: 'vitrina-tienda.webp', pie: 'Figuras y model kits' }
];

const PRODUCTOS = [
  {
    id: 'p1', nombre: 'Sobre suelto · Surging Sparks', categoria: 'sellado', precio: 11900, descuento: 0, stock: 40,
    destacado: false, nuevo: false, img: 'pack-sobres-x3.webp',
    variantes: null,
    corta: 'Un sobre sellado de 10 cartas, sin abrir ni pesar.',
    larga: 'El sobre individual de Scarlet & Violet — Surging Sparks, tal como sale de la caja. Diez cartas por sobre. No los pesamos, no los elegimos y no los devolvemos a la caja: salen del display en el momento.',
    detalles: ['10 cartas por sobre', 'Sellado de fábrica', 'Sale de display abierto al momento', 'Idioma inglés']
  },
  {
    id: 'p2', nombre: 'Pack de 3 sobres', categoria: 'sellado', precio: 33900, descuento: 5, stock: 18,
    destacado: false, nuevo: false, img: 'pack-sobres.webp',
    variantes: null,
    corta: 'Tres sobres sellados, la forma más común de arrancar.',
    larga: 'Tres sobres del mismo set, sellados. Es el pack que más se lleva el que quiere probar suerte sin ir a la caja entera.',
    detalles: ['3 sobres de 10 cartas', 'Sellados de fábrica', '30 cartas en total', 'Idioma inglés']
  },
  {
    id: 'p3', nombre: 'Booster Box · 36 sobres', categoria: 'sellado', precio: 349000, descuento: 0, stock: 4,
    destacado: true, nuevo: false, img: 'boosterbox.webp',
    variantes: null,
    corta: 'La caja completa, precintada. 36 sobres sin abrir.',
    larga: 'La booster box entera de Surging Sparks, con el precinto de fábrica intacto. Treinta y seis sobres, 360 cartas. Es la forma más segura de conseguir las raras del set y la que mejor relación precio por sobre tiene.',
    detalles: ['36 sobres de 10 cartas', 'Precinto de fábrica sin abrir', '360 cartas en total', 'Se envía con protección extra']
  },
  {
    id: 'p4', nombre: 'Media caja · 18 sobres', categoria: 'sellado', precio: 179000, descuento: 0, stock: 6,
    destacado: false, nuevo: false, img: 'boosterbox-par.webp',
    variantes: null,
    corta: 'La mitad de una caja, para el que no quiere ir a la entera.',
    larga: 'Dieciocho sobres del mismo display, entregados sueltos. Sirve para abrir en vivo sin comprometer el presupuesto de una caja completa.',
    detalles: ['18 sobres de 10 cartas', 'Del mismo display', '180 cartas en total', 'Idioma inglés']
  },
  {
    id: 'p5', nombre: 'Display sellado x2', categoria: 'sellado', precio: 680000, descuento: 0, stock: 2,
    destacado: false, nuevo: false, img: 'display-x2.webp',
    variantes: null,
    corta: 'Dos booster box precintadas, para revender o guardar.',
    larga: 'Dos displays completos, los dos con precinto de fábrica. Es lo que compra el que revende o el que guarda sellado esperando que suba.',
    detalles: ['2 booster box de 36 sobres', 'Precinto intacto en las dos', '720 cartas en total', 'Envío coordinado aparte']
  },
  {
    id: 'p6', nombre: 'Combo 3 booster box', categoria: 'sellado', precio: 990000, descuento: 8, stock: 1,
    destacado: true, nuevo: false, img: 'boxes-piramide.webp',
    variantes: null,
    corta: 'Tres cajas selladas con descuento por volumen.',
    larga: 'Tres booster box del mismo set. Es el único combo con descuento por cantidad que tenemos armado y sale una sola vez por reposición.',
    detalles: ['3 booster box de 36 sobres', '1.080 cartas en total', 'Precinto de fábrica', 'Última unidad de esta reposición']
  },

  {
    id: 'p7', nombre: 'Carta suelta en magnético', categoria: 'cartas', precio: 34900, descuento: 0, stock: 3,
    destacado: true, nuevo: false, img: 'carta-magnetico.webp',
    variantes: { label: 'Formato', opciones: ['Magnético 35 pt', 'Magnético 55 pt'] },
    corta: 'Una carta ya montada en su magnético, lista para vitrina.',
    larga: 'Carta suelta montada en holder magnético con protección UV. Se entrega ya cerrada, así que no la toca nadie desde que sale de la manga. La carta puntual se acuerda por WhatsApp antes de cerrar el pedido.',
    detalles: ['Holder magnético con cierre', 'Protección UV', 'Se entrega ya montada', 'La carta se acuerda antes de comprar']
  },
  {
    id: 'p8', nombre: 'Lote de 5 cartas protegidas', categoria: 'cartas', precio: 79000, descuento: 0, stock: 5,
    destacado: false, nuevo: false, img: 'lote-protegidas.webp',
    variantes: null,
    corta: 'Cinco cartas seleccionadas, cada una en su holder.',
    larga: 'Un lote de cinco cartas, cada una en su holder rígido. Se arma según lo que haya en stock y se muestra por foto antes de despachar.',
    detalles: ['5 cartas en holder rígido', 'Se muestra por foto antes de enviar', 'Armado según stock', 'Envío con protección extra']
  },
  {
    id: 'p9', nombre: 'Cartas sueltas Yu-Gi-Oh', categoria: 'cartas', precio: 18500, descuento: 0, stock: 12,
    destacado: false, nuevo: false, img: 'cartas-yugioh.webp',
    variantes: { label: 'Estado', opciones: ['Near Mint', 'Lightly Played'] },
    corta: 'Cartas sueltas de Yu-Gi-Oh, en manga y toploader.',
    larga: 'Cartas sueltas de Yu-Gi-Oh en manga y toploader. Publicamos el estado real de cada una y mandamos foto del frente y del dorso antes de cerrar.',
    detalles: ['En manga y toploader', 'Estado declarado por carta', 'Foto de frente y dorso', 'Consultá disponibilidad puntual']
  },
  {
    id: 'p10', nombre: 'Carta enmarcada para display', categoria: 'cartas', precio: 42000, descuento: 0, stock: 4,
    destacado: false, nuevo: true, img: 'marco-display.webp',
    variantes: null,
    corta: 'Marco de pared con la carta ya montada adentro.',
    larga: 'Marco negro de pared con la carta montada y sellada adentro. Queda para colgar directo. La carta se elige antes de armarlo.',
    detalles: ['Marco negro para pared', 'Vidrio con filtro UV', 'Se arma con la carta que elijas', 'Incluye colgador']
  },

  {
    id: 'p11', nombre: 'Deck box premium', categoria: 'accesorios', precio: 16900, descuento: 0, stock: 20,
    destacado: true, nuevo: false, img: 'deckbox.webp',
    variantes: { label: 'Color', opciones: ['Negro', 'Rojo', 'Azul'] },
    corta: 'Porta mazo rígido con cierre magnético, entran 100 cartas.',
    larga: 'Deck box rígido con cierre magnético y interior de microfibra. Entran cien cartas enfundadas sin forzar. Es el que usamos nosotros.',
    detalles: ['Hasta 100 cartas enfundadas', 'Cierre magnético', 'Interior de microfibra', 'Tres colores']
  },
  {
    id: 'p12', nombre: 'Protectores x100 · 66×91 mm', categoria: 'accesorios', precio: 12500, descuento: 0, stock: 35,
    destacado: true, nuevo: false, img: 'protectores.webp',
    variantes: { label: 'Terminación', opciones: ['Mate', 'Brillante'] },
    corta: 'Cien mangas estándar, medida oficial de TCG.',
    larga: 'Cien protectores de 66×91 mm, la medida estándar para Pokémon, Magic y Yu-Gi-Oh. Mate para jugar, brillante para vitrina.',
    detalles: ['100 unidades', '66 × 91 mm', 'Libres de ácido', 'Mate o brillante']
  },
  {
    id: 'p13', nombre: 'Set de dados poliédricos', categoria: 'accesorios', precio: 9800, descuento: 0, stock: 25,
    destacado: false, nuevo: false, img: 'dados.webp',
    variantes: { label: 'Color', opciones: ['Violeta', 'Negro', 'Translúcido'] },
    corta: 'Siete dados en resina, con números en dorado.',
    larga: 'Set de siete dados poliédricos en resina, con los números pintados en dorado. Sirven para contadores de daño y para mesa de rol.',
    detalles: ['7 dados: d4 a d20', 'Resina con números dorados', 'Vienen en bolsita', 'Tres colores']
  },
  {
    id: 'p14', nombre: 'Cuadro triple para cartas', categoria: 'accesorios', precio: 58000, descuento: 0, stock: 3,
    destacado: false, nuevo: false, img: 'cartas-enmarcadas.webp',
    variantes: null,
    corta: 'Tres marcos negros a juego, para armar una pared.',
    larga: 'Set de tres marcos negros del mismo alto, pensados para colgar en línea. Cada uno lleva una carta con su protección. Se venden vacíos o con las cartas ya montadas.',
    detalles: ['3 marcos negros iguales', 'Para carta estándar', 'Se cuelgan en línea', 'Se pueden pedir con carta incluida']
  },

  {
    id: 'p15', nombre: 'Figura articulada 20 cm', categoria: 'coleccionables', precio: 89000, descuento: 0, stock: 6,
    destacado: true, nuevo: false, img: 'figura-anime.webp',
    variantes: null,
    corta: 'Figura articulada en caja, con accesorios intercambiables.',
    larga: 'Figura articulada de 20 cm en caja original, con manos y accesorios intercambiables. Llega sellada y se puede revisar en la entrega.',
    detalles: ['Alto 20 cm', 'Caja original sellada', 'Manos y accesorios intercambiables', 'Base incluida']
  },
  {
    id: 'p16', nombre: 'Model kit escala 1/144', categoria: 'coleccionables', precio: 74500, descuento: 10, stock: 8,
    destacado: true, nuevo: false, img: 'gunpla.webp',
    variantes: null,
    corta: 'Kit para armar sin pegamento, escala 1/144.',
    larga: 'Model kit escala 1/144 para armar sin pegamento ni pintura. Las piezas salen del marco a mano o con cortadora. Ideal para arrancar en el hobby.',
    detalles: ['Escala 1/144', 'No necesita pegamento', 'Manual incluido', 'Caja sellada']
  },
  {
    id: 'p17', nombre: 'Lote de 6 figuras chicas', categoria: 'coleccionables', precio: 52000, descuento: 0, stock: 4,
    destacado: false, nuevo: false, img: 'figuras-lote.webp',
    variantes: null,
    corta: 'Seis figuras de 8 a 12 cm, surtidas.',
    larga: 'Lote de seis figuras chicas surtidas, entre 8 y 12 cm. Se arma según lo que haya y se manda la foto exacta del lote antes de cerrar el pedido.',
    detalles: ['6 figuras de 8 a 12 cm', 'Surtido según stock', 'Foto del lote antes de enviar', 'Sin caja individual']
  },
  {
    id: 'p18', nombre: 'Figura de vitrina 25 cm', categoria: 'coleccionables', precio: 128000, descuento: 0, stock: 2,
    destacado: true, nuevo: true, img: 'figura-vitrina.webp',
    variantes: null,
    corta: 'Figura grande de exhibición, con base y caja.',
    larga: 'Figura de exhibición de 25 cm con base propia y caja con ventana. Es de las piezas más grandes que tenemos y entra por encargo, así que hay pocas unidades.',
    detalles: ['Alto 25 cm con base', 'Caja con ventana', 'Pieza de exhibición', 'Pocas unidades por reposición']
  }
];

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const precioAR = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const catDe = id => CATEGORIAS.find(c => c.id === id);
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const varKey = v => v ? norm(v).replace(/[^a-z0-9]+/g, '-') : '_';

const Cart = {
  KEY: 'shinystore_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(id, variante, qty = 1) {
    const p = getProducto(id);
    if (!p) return;
    const key = `${id}:${varKey(variante)}`;
    const items = this.get();
    const ex = items.find(l => l.key === key);
    if (ex) ex.qty = Math.min(ex.qty + qty, p.stock ?? 99);
    else items.push({ key, id, variante: variante || null, qty: Math.min(qty, p.stock ?? 99) });
    this.save(items);
  },
  setQty(key, qty) {
    const items = this.get();
    const l = items.find(x => x.key === key);
    if (!l) return;
    const p = getProducto(l.id);
    l.qty = Math.max(1, Math.min(qty, p?.stock ?? 99));
    this.save(items);
  },
  remove(key) { this.save(this.get().filter(l => l.key !== key)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, l) => s + l.qty, 0); },
  lineas() {
    return this.get().map(l => {
      const p = getProducto(l.id);
      return p ? { ...l, prod: p, unit: precioFinal(p), sub: precioFinal(p) * l.qty } : null;
    }).filter(Boolean);
  },
  total() { return this.lineas().reduce((s, l) => s + l.sub, 0); }
};

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    wrap.setAttribute('aria-live', 'polite');
    document.body.appendChild(wrap);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3400);
}

const FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>';
let revealsListos = false;

function cardHTML(p) {
  const fin = precioFinal(p);
  const agotado = p.stock <= 0;
  const badges = [];
  if (p.nuevo) badges.push('<span class="tag tag-nuevo">Nuevo</span>');
  if (p.descuento > 0) badges.push(`<span class="tag tag-off">-${p.descuento}%</span>`);
  const ultimas = p.stock > 0 && p.stock <= 3 ? `<span class="tag tag-ultimas">${p.stock} en stock</span>` : '';
  const precio = p.descuento > 0
    ? `${precioAR(fin)} <s>${precioAR(p.precio)}</s>`
    : precioAR(fin);
  return `<li class="card" data-animate="up" style="transform:translateY(18px);opacity:0">
    <button type="button" class="card-media" data-open="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      <img src="images/${p.img}" alt="${esc(p.nombre)}" width="1200" height="1200" decoding="async">
      <span class="card-badges">${badges.join('')}</span>
      ${ultimas}
    </button>
    <div class="card-body">
      <p class="card-cat">${esc(catDe(p.categoria)?.nombre || '')}</p>
      <h3 class="card-nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="card-meta">${esc(p.corta)}</p>
      <p class="card-precio">${precio}</p>
      <div class="card-actions">
        <div class="stepper" data-stepper="${p.id}">
          <button type="button" data-step="-1" aria-label="Quitar uno" disabled>−</button>
          <span data-qty>1</span>
          <button type="button" data-step="1" aria-label="Agregar uno">+</button>
        </div>
        <button type="button" class="card-add" data-add="${p.id}"${agotado ? ' disabled' : ''}>${agotado ? 'Sin stock' : 'Agregar'}</button>
      </div>
    </div>
  </li>`;
}

function initCategorias() {
  const cont = document.getElementById('catGrid');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(c => {
    const n = PRODUCTOS.filter(p => p.categoria === c.id).length;
    return `<li data-animate="up" style="transform:translateY(20px);opacity:0">
      <a class="cat-card" href="#tienda" data-cat="${c.id}">
        <img src="images/${c.img}" alt="${esc(c.nombre)}" width="1200" height="1200" decoding="async">
        <span class="cat-info">
          <span class="cat-nombre">${esc(c.nombre)}</span>
          <span class="cat-n">${n} ${n === 1 ? 'producto' : 'productos'} · ${esc(c.pie)}</span>
        </span>
        <span class="cat-flecha">${FLECHA}</span>
      </a>
    </li>`;
  }).join('');
}

function initRail() {
  const track = document.getElementById('railTrack');
  const vp = document.getElementById('railVp');
  if (!track || !vp) return;
  track.innerHTML = PRODUCTOS.filter(p => p.destacado).map(cardHTML).join('');

  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const stepSize = () => {
    const card = track.querySelector('.card');
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 16;
    return card ? card.getBoundingClientRect().width + gap : vp.clientWidth * .8;
  };
  const sync = () => {
    if (prev) prev.disabled = vp.scrollLeft <= 8;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const behavior = reduceMotion ? 'auto' : 'smooth';
  prev?.addEventListener('click', () => vp.scrollBy({ left: -stepSize(), behavior }));
  next?.addEventListener('click', () => vp.scrollBy({ left: stepSize(), behavior }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('load', sync);
  sync();

  let down = false, moved = false, justDragged = false, startX = 0, startScroll = 0, pointerId = null;
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
      justDragged = true;
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      setTimeout(() => { justDragged = false; }, 60);
    }
    vp.classList.remove('dragging');
    moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('click', e => { if (justDragged) { e.preventDefault(); e.stopPropagation(); } }, true);
}

const estado = { q: '', categorias: [], disp: [], precioMax: null, visibles: 16 };
const PRECIO_TOPE = Math.max(...PRODUCTOS.map(precioFinal));

function filtrados() {
  const q = norm(estado.q).trim();
  return PRODUCTOS.filter(p => {
    if (estado.categorias.length && !estado.categorias.includes(p.categoria)) return false;
    if (estado.disp.includes('disponible') && p.stock <= 0) return false;
    if (estado.disp.includes('oferta') && !(p.descuento > 0)) return false;
    if (estado.precioMax != null && precioFinal(p) > estado.precioMax) return false;
    if (q) {
      const heno = norm([p.nombre, p.corta, p.larga, catDe(p.categoria)?.nombre,
        p.variantes?.opciones?.join(' '), p.detalles?.join(' ')].filter(Boolean).join(' '));
      if (!q.split(/\s+/).every(w => heno.includes(w))) return false;
    }
    return true;
  });
}

function renderCatalogo() {
  const cont = document.getElementById('catalogo');
  const vacio = document.getElementById('vacio');
  const verMas = document.getElementById('verMas');
  const res = document.getElementById('resultados');
  if (!cont) return;

  const lista = filtrados();
  const mostrar = lista.slice(0, estado.visibles);
  cont.innerHTML = mostrar.map(cardHTML).join('');
  cont.hidden = lista.length === 0;
  if (vacio) vacio.hidden = lista.length !== 0;
  if (verMas) verMas.hidden = lista.length <= estado.visibles;
  if (res) {
    res.textContent = lista.length === 0
      ? 'Sin resultados'
      : `${lista.length} ${lista.length === 1 ? 'producto' : 'productos'}${lista.length > mostrar.length ? ` · mostrando ${mostrar.length}` : ''}`;
  }

  const fn = document.getElementById('filtrosN');
  const activos = estado.categorias.length + estado.disp.length + (estado.precioMax != null ? 1 : 0);
  if (fn) { fn.textContent = activos; fn.hidden = activos === 0; }

  revelarNuevos(cont);
  if (hasST) requestAnimationFrame(() => ScrollTrigger.refresh());
}

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function initFiltros() {
  const chipsCat = document.getElementById('chipsCategoria');
  const chipsDisp = document.getElementById('chipsDisp');
  const rango = document.getElementById('precioMax');
  const precioVal = document.getElementById('precioVal');

  chipsCat.innerHTML = CATEGORIAS.map(c => `<button type="button" class="chip" data-f="categorias" data-v="${c.id}">${esc(c.nombre)}</button>`).join('');
  chipsDisp.innerHTML = '<button type="button" class="chip" data-f="disp" data-v="disponible">Con stock</button><button type="button" class="chip" data-f="disp" data-v="oferta">En oferta</button>';

  rango.max = PRECIO_TOPE;
  rango.value = PRECIO_TOPE;
  rango.step = 1000;
  precioVal.textContent = precioAR(PRECIO_TOPE);

  document.getElementById('filtrosPanel').addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const arr = estado[chip.dataset.f];
    const i = arr.indexOf(chip.dataset.v);
    if (i >= 0) arr.splice(i, 1); else arr.push(chip.dataset.v);
    chip.classList.toggle('is-on', i < 0);
    estado.visibles = 16;
    renderCatalogo();
  });

  rango.addEventListener('input', () => {
    const v = +rango.value;
    estado.precioMax = v >= PRECIO_TOPE ? null : v;
    precioVal.textContent = precioAR(v);
    estado.visibles = 16;
    renderCatalogo();
  });

  const toggle = document.getElementById('filtrosToggle');
  const panel = document.getElementById('filtrosPanel');
  toggle.addEventListener('click', () => {
    const abierto = !panel.hidden;
    panel.hidden = abierto;
    toggle.setAttribute('aria-expanded', String(!abierto));
    if (hasST) requestAnimationFrame(() => ScrollTrigger.refresh());
  });

  const limpiar = () => {
    estado.categorias = []; estado.disp = []; estado.precioMax = null; estado.q = ''; estado.visibles = 16;
    document.querySelectorAll('#filtrosPanel .chip').forEach(c => c.classList.remove('is-on'));
    rango.value = PRECIO_TOPE;
    precioVal.textContent = precioAR(PRECIO_TOPE);
    const q = document.getElementById('q');
    q.value = '';
    document.getElementById('qClear').hidden = true;
    renderCatalogo();
  };
  document.getElementById('fpLimpiar').addEventListener('click', limpiar);
  document.getElementById('vacioLimpiar').addEventListener('click', limpiar);

  const q = document.getElementById('q');
  const qClear = document.getElementById('qClear');
  let t;
  q.addEventListener('input', () => {
    qClear.hidden = !q.value;
    clearTimeout(t);
    t = setTimeout(() => { estado.q = q.value; estado.visibles = 16; renderCatalogo(); }, 180);
  });
  qClear.addEventListener('click', () => { q.value = ''; qClear.hidden = true; estado.q = ''; estado.visibles = 16; renderCatalogo(); q.focus(); });

  document.getElementById('buscarToggle').addEventListener('click', () => {
    document.getElementById('tienda').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(() => q.focus(), reduceMotion ? 0 : 600);
  });

  document.getElementById('verMas').addEventListener('click', () => {
    estado.visibles += 16;
    renderCatalogo();
  });
}

function initAtajos() {
  document.addEventListener('click', e => {
    const link = e.target.closest('[data-cat]');
    if (!link) return;
    e.preventDefault();
    const cat = link.dataset.cat;
    estado.categorias = [cat];
    estado.visibles = 16;
    document.querySelectorAll('#filtrosPanel .chip[data-f="categorias"]').forEach(c => {
      c.classList.toggle('is-on', c.dataset.v === cat);
    });
    renderCatalogo();
    document.getElementById('tienda').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

function initCards() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const wrap = step.closest('[data-stepper]');
      const span = wrap.querySelector('[data-qty]');
      const max = getProducto(wrap.dataset.stepper)?.stock ?? 99;
      let n = parseInt(span.textContent, 10) + parseInt(step.dataset.step, 10);
      n = Math.max(1, Math.min(n, max));
      span.textContent = n;
      wrap.querySelector('[data-step="-1"]').disabled = n <= 1;
      wrap.querySelector('[data-step="1"]').disabled = n >= max;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      const cont = add.closest('.card, .mg');
      const qtyEl = cont?.querySelector('[data-qty]');
      const varSel = cont?.querySelector('.chip.is-on[data-variante]');
      Cart.add(add.dataset.add, varSel?.dataset.variante || (p?.variantes ? p.variantes.opciones[0] : null), qtyEl ? parseInt(qtyEl.textContent, 10) : 1);
      showToast('¡Agregado! Tu carrito te espera.');
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const p = getProducto(buy.dataset.buy);
      const cont = buy.closest('.mg');
      const qtyEl = cont?.querySelector('[data-qty]');
      const varSel = cont?.querySelector('.chip.is-on[data-variante]');
      Cart.add(buy.dataset.buy, varSel?.dataset.variante || (p?.variantes ? p.variantes.opciones[0] : null), qtyEl ? parseInt(qtyEl.textContent, 10) : 1);
      cerrarModal();
      abrirDrawer();
      return;
    }
    const open = e.target.closest('[data-open]');
    if (open) abrirModal(open.dataset.open);
  });
}

let ultimoFoco = null;
const modal = document.getElementById('modal');
const modalBackdrop = document.getElementById('modalBackdrop');

function modalHTML(p) {
  const fin = precioFinal(p);
  const precio = p.descuento > 0
    ? `${precioAR(fin)} <s>${precioAR(p.precio)}</s> <span class="tag tag-off">-${p.descuento}%</span>`
    : precioAR(fin);
  const vars = p.variantes ? `
    <p class="mg-var-label">${esc(p.variantes.label)}</p>
    <div class="mg-vars">${p.variantes.opciones.map((o, i) => `<button type="button" class="chip${i === 0 ? ' is-on' : ''}" data-variante="${esc(o)}">${esc(o)}</button>`).join('')}</div>` : '';
  const rel = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 3);
  return `<div class="mg">
    <div class="mg-media"><img src="images/${p.img}" alt="${esc(p.nombre)}" width="1200" height="1200"></div>
    <div class="mg-info">
      <p class="mg-cat">${esc(catDe(p.categoria)?.nombre || '')}</p>
      <h2 class="mg-titulo">${esc(p.nombre)}</h2>
      <p class="mg-desc">${esc(p.larga)}</p>
      <p class="mg-precio">${precio}</p>
      <div class="mg-datos">
        <span class="mg-dato">${p.stock > 0 ? `${p.stock} disponibles` : 'Sin stock'}</span>
        <span class="mg-dato">Envío a todo el país</span>
      </div>
      ${vars}
      <p class="mg-h">Qué incluye</p>
      <ul class="mg-lista">${p.detalles.map(d => `<li>${esc(d)}</li>`).join('')}</ul>
      <div class="stepper" data-stepper="${p.id}">
        <button type="button" data-step="-1" aria-label="Quitar uno" disabled>−</button>
        <span data-qty>1</span>
        <button type="button" data-step="1" aria-label="Agregar uno">+</button>
      </div>
      <div class="mg-acciones">
        <button type="button" class="btn btn-ghost" data-add="${p.id}"${p.stock <= 0 ? ' disabled' : ''}><span class="btn-t">Agregar al carrito</span></button>
        <button type="button" class="btn btn-cta" data-buy="${p.id}"${p.stock <= 0 ? ' disabled' : ''}><span class="btn-t">Comprar ahora</span></button>
      </div>
    </div>
  </div>
  ${rel.length ? `<div class="mg-relacionados">
    <p class="mg-h mg-h-top">De la misma categoría</p>
    <div class="mg-rel-grid">${rel.map(r => `<button type="button" class="mg-rel" data-open="${r.id}">
      <img src="images/${r.img}" alt="" width="1200" height="1200">
      <span class="mg-rel-nombre">${esc(r.nombre)}</span>
      <span class="mg-rel-precio">${precioAR(precioFinal(r))}</span>
    </button>`).join('')}</div>
  </div>` : ''}`;
}

function abrirModal(id) {
  const p = getProducto(id);
  if (!p) return;
  ultimoFoco = document.activeElement;
  document.getElementById('modalBody').innerHTML = modalHTML(p);
  modal.setAttribute('aria-label', p.nombre);
  modalBackdrop.hidden = false;
  modal.hidden = false;
  requestAnimationFrame(() => { modalBackdrop.classList.add('open'); modal.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('modalClose').focus();
}

function cerrarModal() {
  if (modal.hidden) return;
  modal.classList.remove('open');
  modalBackdrop.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { modal.hidden = true; modalBackdrop.hidden = true; }, 300);
  ultimoFoco?.focus();
}

function initModal() {
  document.getElementById('modalClose').addEventListener('click', cerrarModal);
  modalBackdrop.addEventListener('click', cerrarModal);
  modal.addEventListener('click', e => {
    const chip = e.target.closest('[data-variante]');
    if (chip) {
      chip.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('is-on'));
      chip.classList.add('is-on');
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) cerrarModal();
    if (e.key === 'Tab' && !modal.hidden) {
      const f = modal.querySelectorAll('button:not(:disabled), a[href], input, [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

const drawer = document.getElementById('drawer');
const drawerBackdrop = document.getElementById('drawerBackdrop');

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  const lineas = Cart.lineas();

  if (!lineas.length) {
    body.innerHTML = `<div class="dvacio">
      <span class="dvacio-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg></span>
      <h3>Tu carrito está vacío</h3>
      <p>Agregá un sobre, una caja o una figura y volvé por acá.</p>
    </div>`;
    foot.hidden = true;
    return;
  }

  body.innerHTML = lineas.map(l => `<div class="dlinea">
    <img src="images/${l.prod.img}" alt="" width="1200" height="1200">
    <div>
      <p class="dl-nombre">${esc(l.prod.nombre)}</p>
      ${l.variante ? `<p class="dl-var">${esc(l.variante)}</p>` : ''}
      <p class="dl-precio">${precioAR(l.sub)}</p>
    </div>
    <div class="dl-acciones">
      <div class="stepper">
        <button type="button" data-dqty="${l.key}" data-d="-1" aria-label="Quitar uno">−</button>
        <span>${l.qty}</span>
        <button type="button" data-dqty="${l.key}" data-d="1" aria-label="Agregar uno">+</button>
      </div>
      <button type="button" class="dl-quitar" data-drem="${l.key}">Quitar</button>
    </div>
  </div>`).join('');

  const total = Cart.total();
  document.getElementById('dTotales').innerHTML = `
    <div><dt>Subtotal</dt><dd>${precioAR(total)}</dd></div>
    <div><dt>Envío</dt><dd>Se coordina por WhatsApp</dd></div>
    <div class="dtotal"><dt>Total</dt><dd>${precioAR(total)}</dd></div>`;

  const texto = ['Hola ShinyStore, quiero hacer este pedido:', '']
    .concat(lineas.map(l => `- ${l.prod.nombre}${l.variante ? ` (${l.variante})` : ''} x${l.qty} - ${precioAR(l.sub)}`))
    .concat(['', `Total: ${precioAR(total)}`]).join('\n');
  document.getElementById('drawerWsp').href = `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;

  foot.hidden = false;
}

function abrirDrawer() {
  renderDrawer();
  drawerBackdrop.hidden = false;
  drawer.hidden = false;
  requestAnimationFrame(() => { drawerBackdrop.classList.add('open'); drawer.classList.add('open'); });
  document.body.classList.add('no-scroll');
  ultimoFoco = document.activeElement;
  document.getElementById('drawerClose').focus();
}

function cerrarDrawer() {
  if (drawer.hidden) return;
  drawer.classList.remove('open');
  drawerBackdrop.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { drawer.hidden = true; drawerBackdrop.hidden = true; }, 380);
  ultimoFoco?.focus();
}

function initDrawer() {
  document.getElementById('cartHeader').addEventListener('click', abrirDrawer);
  document.getElementById('cart-float').addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose').addEventListener('click', cerrarDrawer);
  drawerBackdrop.addEventListener('click', cerrarDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) cerrarDrawer(); });

  drawer.addEventListener('click', e => {
    const q = e.target.closest('[data-dqty]');
    if (q) {
      const linea = Cart.get().find(x => x.key === q.dataset.dqty);
      if (!linea) return;
      const nueva = linea.qty + parseInt(q.dataset.d, 10);
      if (nueva < 1) Cart.remove(q.dataset.dqty);
      else Cart.setQty(q.dataset.dqty, nueva);
      return;
    }
    const rem = e.target.closest('[data-drem]');
    if (rem) Cart.remove(rem.dataset.drem);
  });

  document.getElementById('finalizar').addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
    cerrarDrawer();
  });

  document.addEventListener('cart:updated', () => { if (!drawer.hidden) renderDrawer(); });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n;
    b.hidden = n === 0;
    b.classList.remove('bump');
    void b.offsetWidth;
    if (n) b.classList.add('bump');
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  const header = document.querySelector('.barra');
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 861px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); }
  });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initHero() {
  const items = document.querySelectorAll('[data-hero]');
  if (!items.length) return;
  if (!hasGsap || reduceMotion) {
    items.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-fondo img', { scale: 1.12, duration: 1.6, ease: 'power2.out' }, 0)
    .to('[data-hero="1"]', { opacity: 1, y: 0, duration: .6 }, .1)
    .to('[data-hero="2"]', { opacity: 1, y: 0, duration: .85 }, .16)
    .to('[data-hero="3"]', { opacity: 1, y: 0, duration: .8 }, .34)
    .to('[data-hero="4"]', { opacity: 1, y: 0, duration: .7 }, .46)
    .to('[data-hero="5"]', { opacity: 1, y: 0, duration: .7 }, .56)
    .to('[data-hero="6"]', { opacity: 1, y: 0, rotate: -5, duration: .95, ease: 'back.out(1.4)' }, .3)
    .to('[data-hero="7"]', { opacity: 1, y: 0, duration: .65, ease: 'back.out(1.6)' }, .72)
    .fromTo('[data-hero="8"]', { scale: 0, rotate: -60 }, { opacity: 1, scale: 1, rotate: 0, duration: .8, ease: 'back.out(2.6)' }, .8);

  if (hasST) {
    gsap.to('.hero-fondo img', {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5, invalidateOnRefresh: true }
    });
  }
}

function sobreEstatico() {
  document.querySelectorAll('#sobreSvg .carta').forEach(c => { c.style.opacity = 1; });
  const tapa = document.getElementById('sobreTapa');
  const sobre = document.getElementById('sobreGrupo');
  if (tapa) tapa.style.opacity = 0;
  if (sobre) sobre.style.opacity = 0;
  document.querySelectorAll('#destellosSvg path').forEach(d => { d.style.opacity = 1; });
  const rara = document.querySelector('.rara-brillo');
  if (rara) rara.style.opacity = 1;
  document.getElementById('pasosSobre')?.classList.add('is-static');
}

function sobreTl(tl) {
  const cartas = gsap.utils.toArray('#sobreSvg .carta');
  const angulos = [-26, -13, 0, 13, 26];
  const desplX = [-118, -60, 0, 60, 118];
  const desplY = [24, 4, -6, 4, 24];

  tl.fromTo('#sobreGrupo', { scale: .9, transformOrigin: '50% 50%' }, { scale: 1, duration: .8, ease: 'power2.out' }, 0)
    .fromTo('.sobre-brillo', { opacity: 0 }, { opacity: .16, duration: .5 }, .4)

    .to('#sobreTapa', { y: -54, rotate: -12, transformOrigin: '0% 100%', duration: .9, ease: 'power2.inOut' }, 1)
    .to('.tapa-dientes', { opacity: 0, duration: .3 }, 1.5)
    .to('.sobre-brillo', { opacity: .3, duration: .5 }, 1.2)

    .to(cartas, { opacity: 1, duration: .3, stagger: .07 }, 2)
    .to(cartas, { y: -46, duration: .8, stagger: .07, ease: 'power2.out' }, 2)
    .to('#sobreGrupo', { y: 44, opacity: .35, duration: .8, ease: 'power2.in' }, 2.3)
    .to('#sobreTapa', { opacity: 0, duration: .4 }, 2.3);

  cartas.forEach((c, i) => {
    tl.to(c, {
      x: desplX[i], y: -46 + desplY[i], rotate: angulos[i],
      transformOrigin: '50% 100%', duration: .9, ease: 'power3.out'
    }, 3 + i * 0.06);
  });

  tl.to('#destellosSvg path', { opacity: 1, duration: .4, stagger: .12 }, 3.4)
    .to('#cartaRara', { scale: 1.22, y: -104, transformOrigin: '50% 100%', duration: .9, ease: 'back.out(1.5)' }, 4)
    .fromTo('.rara-brillo', { opacity: 0, scale: .3, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: .7, ease: 'back.out(2.4)' }, 4.3)
    .to('.rara-in', { opacity: .85, duration: .6, yoyo: true, repeat: 1 }, 4.4);
  return tl;
}

function initSobre() {
  const stage = document.getElementById('stage');
  const pasos = document.getElementById('pasosSobre');
  if (!stage || !pasos) return;
  const items = [...pasos.querySelectorAll('.paso-sobre')];
  if (!hasGsap || !hasST) { sobreEstatico(); items.forEach(p => p.classList.add('is-on')); return; }

  const hudNow = document.getElementById('hudNow');
  const hudFill = document.getElementById('hudFill');
  const hudLabel = document.getElementById('hudLabel');

  const setStep = p => {
    const i = Math.max(0, Math.min(items.length - 1, Math.floor(p * items.length)));
    items.forEach((el, k) => el.classList.toggle('is-on', k === i));
    if (hudNow) hudNow.textContent = String(i + 1).padStart(2, '0');
    if (hudFill) hudFill.style.transform = `scaleX(${Math.max(0, Math.min(1, p)).toFixed(3)})`;
    if (hudLabel) hudLabel.textContent = items[i]?.querySelector('h3')?.textContent || '';
  };

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: reduce)', () => {
    sobreEstatico();
    items.forEach(p => p.classList.add('is-on'));
  });

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, start: 'top top', end: '+=260%',
        pin: true, scrub: .6, invalidateOnRefresh: true,
        onUpdate: self => setStep(self.progress)
      }
    });
    sobreTl(tl);
    setStep(0);
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    requestAnimationFrame(() => ScrollTrigger.refresh());
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, start: 'top top', end: 'bottom bottom',
        scrub: .6, invalidateOnRefresh: true,
        onUpdate: self => setStep(self.progress)
      }
    });
    sobreTl(tl);
    setStep(0);
    return () => stage.classList.remove('is-sticky-mobile');
  });
}

function initParallax() {
  if (!hasGsap || !hasST || reduceMotion) return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const f = parseFloat(el.dataset.parallax) || 0;
    gsap.fromTo(el, { y: -f * 150 }, {
      y: f * 150, ease: 'none',
      scrollTrigger: { trigger: el.closest('.banda-fig') || el, start: 'top bottom', end: 'bottom top', scrub: .6, invalidateOnRefresh: true }
    });
  });
}

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

function initSchema() {
  const base = 'https://gokywebs.com/demo/shinystore/';
  const graph = [
    {
      '@type': 'Store', '@id': base + '#store', name: 'ShinyStore',
      description: 'Tienda de cartas TCG selladas, cartas sueltas protegidas, accesorios y juguetes coleccionables.',
      url: base, telephone: '+' + WSP, email: 'hola@shinystore.com', priceRange: '$$',
      image: base + 'images/logo.webp',
      address: { '@type': 'PostalAddress', addressLocality: 'Ciudad Autónoma de Buenos Aires', addressCountry: 'AR' }
    },
    ...PRODUCTOS.map(p => ({
      '@type': 'Product', name: p.nombre, description: p.corta,
      image: base + 'images/' + p.img, category: catDe(p.categoria)?.nombre,
      brand: { '@type': 'Brand', name: 'ShinyStore' },
      offers: {
        '@type': 'Offer', price: precioFinal(p), priceCurrency: 'ARS',
        availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: { '@id': base + '#store' }
      }
    }))
  ];
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  document.head.appendChild(s);
}

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

initCategorias();
initRail();
initFiltros();
renderCatalogo();
initAtajos();
initCards();
initModal();
initDrawer();
initReveals();
initParallax();
initNav();
initHero();
initSobre();
initFloats();
initSchema();

document.addEventListener('cart:updated', updateCartBadge);
updateCartBadge();
