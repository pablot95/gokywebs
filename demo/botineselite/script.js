document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const IMG = {
  naranja: 'images/botin-elite-naranja.webp',
  turquesa: 'images/botin-turquesa-estudio.webp',
  amarillo: 'images/botin-amarillo-detalle.webp',
  rosa: 'images/botin-rosa-pelota.webp',
  suela: 'images/botin-suela-verde.webp',
  negro: 'images/botin-negro-amarillo.webp',
  blanco: 'images/botin-blanco-pelota.webp',
  azul: 'images/accion-botin-azul.webp',
  manos: 'images/manos-botin-usado.webp',
  cordones: 'images/atando-cordones.webp'
};

const TALLES = [38, 39, 40, 41, 42, 43, 44, 45, 46];

const PRODUCTOS = [
  { id: 'mercurial-vapor-elite-fg', marca: 'Nike', modelo: 'Mercurial Vapor 17 Elite FG', caracter: 'velocidad', terreno: 'FG', peso: 186, precio: 519000, descuento: 0, badge: 'Nuevo', img: IMG.rosa, talles: [39, 40, 41, 42, 43, 44], horma: 'Angosta', descripcion: 'La punta de lanza de la línea de velocidad: capellada ultrafina, placa de fibra de carbono y taco cónico para arrancar y frenar en dos pasos. Pensado para el que gana por afuera.' },
  { id: 'mercurial-superfly-academy-fg', marca: 'Nike', modelo: 'Mercurial Superfly 11 Academy FG', caracter: 'velocidad', terreno: 'FG', peso: 199, precio: 289000, descuento: 15, badge: '', img: IMG.blanco, talles: [38, 39, 40, 41, 42, 43, 44, 45], horma: 'Regular', descripcion: 'Caña media que sostiene el tobillo sin quitar movilidad. La misma geometría de tapones de la gama alta, en una capellada más resistente para entrenar toda la semana.' },
  { id: 'x-crazyfast-league-fg', marca: 'adidas', modelo: 'X Crazyfast League FG', caracter: 'velocidad', terreno: 'FG', peso: 193, precio: 246000, descuento: 0, badge: '', img: IMG.turquesa, talles: [39, 40, 41, 42, 43, 44, 45], horma: 'Angosta', descripcion: 'La línea más liviana de adidas en versión de club: upper sintético termosellado, sin costuras en la zona de contacto y placa dividida que empuja hacia adelante.' },
  { id: 'ultra-match-fg-ag', marca: 'Puma', modelo: 'Ultra Match FG/AG', caracter: 'velocidad', terreno: 'MG', peso: 205, precio: 168000, descuento: 20, badge: '', img: IMG.azul, talles: [38, 39, 40, 41, 42, 43, 44], horma: 'Regular', descripcion: 'Sirve tanto en natural como en sintético, así que es el botín de quien juega la liga el sábado y el fútbol de los martes en la misma semana.' },
  { id: 'furon-dispatch-fg', marca: 'New Balance', modelo: 'Furon v7 Dispatch FG', caracter: 'velocidad', terreno: 'FG', peso: 196, precio: 189000, descuento: 0, badge: '', img: IMG.suela, talles: [40, 41, 42, 43, 44, 45], horma: 'Angosta', descripcion: 'Poca capellada, mucho tacto: la propuesta de New Balance para delanteros que buscan el pique corto y el remate de primera.' },
  { id: 'velocita-elite-fg', marca: 'Umbro', modelo: 'Velocita VI Elite FG', caracter: 'velocidad', terreno: 'FG', peso: 191, precio: 224000, descuento: 10, badge: '', img: IMG.negro, talles: [39, 40, 41, 42, 43, 44], horma: 'Regular', descripcion: 'Una alternativa liviana sin pagar precio de marca top. Placa con tapones mixtos que agarra bien en canchas de pasto firme.' },

  { id: 'phantom-gx-elite-fg', marca: 'Nike', modelo: 'Phantom GX II Elite FG', caracter: 'control', terreno: 'FG', peso: 212, precio: 498000, descuento: 0, badge: 'Nuevo', img: IMG.blanco, talles: [39, 40, 41, 42, 43, 44, 45], horma: 'Regular', descripcion: 'Toda la capellada trabajada con textura para que la pelota se pegue al pie. El botín del que baja de espaldas, gira y encara.' },
  { id: 'phantom-academy-ag', marca: 'Nike', modelo: 'Phantom GX Academy AG', caracter: 'control', terreno: 'AG', peso: 218, precio: 232000, descuento: 0, badge: '', img: IMG.amarillo, talles: [38, 39, 40, 41, 42, 43, 44, 45, 46], horma: 'Regular', descripcion: 'Versión para sintético: más tapones y más cortos, para repartir el impacto en canchas duras y cuidar la rodilla.' },
  { id: 'predator-league-fg', marca: 'adidas', modelo: 'Predator League FG', caracter: 'control', terreno: 'FG', peso: 215, precio: 268000, descuento: 12, badge: '', img: IMG.turquesa, talles: [39, 40, 41, 42, 43, 44, 45], horma: 'Regular', descripcion: 'Las gomas del empeine son marca registrada: agarran la pelota en el pase largo y en el centro con comba. El clásico del volante que arma.' },
  { id: 'future-play-fg-ag', marca: 'Puma', modelo: 'Future Play FG/AG', caracter: 'control', terreno: 'MG', peso: 224, precio: 139000, descuento: 0, badge: '', img: IMG.negro, talles: [38, 39, 40, 41, 42, 43, 44], horma: 'Ancha', descripcion: 'Entrada de gama con la horma más cómoda de la línea Future. Buena opción para el que recién arranca o necesita un segundo par.' },
  { id: 'rebula-cup-fg', marca: 'Mizuno', modelo: 'Rebula Cup Select FG', caracter: 'control', terreno: 'FG', peso: 220, precio: 276000, descuento: 0, badge: '', img: IMG.suela, talles: [40, 41, 42, 43, 44, 45], horma: 'Ancha', descripcion: 'Mizuno hace hormas anchas de verdad. Si otros botines te aprietan de costado, este es el que hay que probar primero.' },
  { id: 'tekela-league-ag', marca: 'Nike', modelo: 'Tekela V League AG', caracter: 'control', terreno: 'AG', peso: 226, precio: 158000, descuento: 18, badge: '', img: IMG.azul, talles: [38, 39, 40, 41, 42, 43, 44, 45], horma: 'Regular', descripcion: 'Hecho para el sintético del barrio: suela reforzada, más tapones y una capellada que aguanta el roce de la alfombra.' },

  { id: 'tiempo-legend-elite-fg', marca: 'Nike', modelo: 'Tiempo Legend 11 Elite FG', caracter: 'toque', terreno: 'FG', peso: 214, precio: 512000, descuento: 0, badge: '', img: IMG.amarillo, talles: [39, 40, 41, 42, 43, 44, 45], horma: 'Regular', descripcion: 'Cuero de canguro tratado: se amolda al pie en dos entrenamientos y no vuelve atrás. El botín de los que juegan con la cabeza levantada.' },
  { id: 'tiempo-academy-fg', marca: 'Nike', modelo: 'Tiempo Legend Academy FG', caracter: 'toque', terreno: 'FG', peso: 228, precio: 214000, descuento: 0, badge: '', img: IMG.blanco, talles: [38, 39, 40, 41, 42, 43, 44, 45, 46], horma: 'Regular', descripcion: 'La comodidad de la línea Tiempo en cuero sintético. Para el que prioriza que no le lastime el pie por sobre el peso.' },
  { id: 'copa-pure-league-fg', marca: 'adidas', modelo: 'Copa Pure II League FG', caracter: 'toque', terreno: 'FG', peso: 231, precio: 259000, descuento: 0, badge: '', img: IMG.manos, talles: [39, 40, 41, 42, 43, 44, 45, 46], horma: 'Ancha', descripcion: 'Sin cordones a la vista y con la lengüeta plegada: contacto limpio y una horma generosa que perdona el pie ancho.' },
  { id: 'morelia-neo-pro-fg', marca: 'Mizuno', modelo: 'Morelia Neo IV Pro FG', caracter: 'toque', terreno: 'FG', peso: 208, precio: 341000, descuento: 8, badge: '', img: IMG.negro, talles: [40, 41, 42, 43, 44, 45], horma: 'Angosta', descripcion: 'El botín de culto japonés: cuero finísimo, casi sin capas entre el pie y la pelota. Liviano para lo que es un botín de cuero.' },
  { id: 'king-match-fg', marca: 'Puma', modelo: 'King Match FG/AG', caracter: 'toque', terreno: 'MG', peso: 236, precio: 129000, descuento: 25, badge: '', img: IMG.cordones, talles: [38, 39, 40, 41, 42, 43, 44], horma: 'Regular', descripcion: 'El King de siempre en versión accesible. Silueta clásica, cuero sintético blando y suela mixta que anda en las dos canchas.' },
  { id: '442-pro-fg', marca: 'New Balance', modelo: '442 v2 Pro FG', caracter: 'toque', terreno: 'FG', peso: 233, precio: 236000, descuento: 0, badge: '', img: IMG.turquesa, talles: [40, 41, 42, 43, 44, 45, 46], horma: 'Ancha', descripcion: 'Cuero de verdad en un botín de silueta sobria, sin nada de plástico decorativo. Muy elegido por defensores y volantes centrales.' },

  { id: 'predator-elite-fg', marca: 'adidas', modelo: 'Predator Elite FG', caracter: 'potencia', terreno: 'FG', peso: 227, precio: 534000, descuento: 0, badge: 'Nuevo', img: IMG.suela, talles: [39, 40, 41, 42, 43, 44, 45], horma: 'Regular', descripcion: 'La zona de golpeo con nervaduras es lo que distingue a la línea: le pegás de afuera del área y la pelota sale con rosca sola.' },
  { id: 'predator-club-mg', marca: 'adidas', modelo: 'Predator Club MG', caracter: 'potencia', terreno: 'MG', peso: 239, precio: 118000, descuento: 0, badge: '', img: IMG.azul, talles: [38, 39, 40, 41, 42, 43, 44, 45, 46], horma: 'Regular', descripcion: 'La puerta de entrada a la línea Predator, con suela multiterreno. El primer botín serio para el que juega todos los fines de semana.' },
  { id: 'future-ultimate-fg', marca: 'Puma', modelo: 'Future 8 Ultimate FG/AG', caracter: 'potencia', terreno: 'MG', peso: 221, precio: 468000, descuento: 10, badge: '', img: IMG.rosa, talles: [39, 40, 41, 42, 43, 44], horma: 'Regular', descripcion: 'Malla adaptativa que se ajusta al pie durante el partido y suela mixta pensada para el que alterna cancha natural y sintética.' },
  { id: 'monarcida-neo-fg', marca: 'Mizuno', modelo: 'Monarcida Neo III Select FG', caracter: 'potencia', terreno: 'FG', peso: 234, precio: 149000, descuento: 0, badge: '', img: IMG.blanco, talles: [40, 41, 42, 43, 44, 45], horma: 'Ancha', descripcion: 'Robusto, con refuerzo en la puntera. Elegido por los que juegan en canchas duras y castigan mucho el botín.' },
  { id: 'tempo-dispatch-sg', marca: 'New Balance', modelo: 'Tekela Dispatch SG', caracter: 'potencia', terreno: 'SG', peso: 241, precio: 198000, descuento: 0, badge: '', img: IMG.suela, talles: [41, 42, 43, 44, 45, 46], horma: 'Regular', descripcion: 'Tapones largos de aluminio para cancha blanda o embarrada. En invierno, la diferencia entre agarrar el pasto o irse de costado.' },
  { id: 'tocco-pro-sg', marca: 'Umbro', modelo: 'Tocco IV Pro SG', caracter: 'potencia', terreno: 'SG', peso: 238, precio: 172000, descuento: 15, badge: '', img: IMG.amarillo, talles: [40, 41, 42, 43, 44, 45], horma: 'Ancha', descripcion: 'Pensado para canchas pesadas: suela con tapones desmontables y capellada tratada para que el barro no la endurezca.' }
];

const CARACTERES = [
  { id: 'velocidad', nombre: 'Velocidad', num: '01', desc: 'Livianos, capellada fina y taco cónico. Para el que gana el pique.', img: IMG.rosa, alt: 'Botín rosa de fútbol apoyado sobre una pelota en el césped' },
  { id: 'control', nombre: 'Control', num: '02', desc: 'Textura en el empeine para que la pelota se quede pegada al pie.', img: IMG.blanco, alt: 'Botín blanco de fútbol apoyado sobre una pelota' },
  { id: 'potencia', nombre: 'Potencia', num: '03', desc: 'Zona de golpeo reforzada y suela firme para pegarle de lejos.', img: IMG.suela, alt: 'Par de botines mostrando la suela y los tapones' },
  { id: 'toque', nombre: 'Toque', num: '04', desc: 'Cuero que se amolda al pie. Comodidad antes que gramos.', img: IMG.amarillo, alt: 'Detalle del empeine de un botín amarillo y blanco' }
];

const ESCENA = [
  { caracter: 'velocidad', kicker: 'Carácter 01', titulo: 'Arrancás y no te alcanzan', desc: 'Menos de 200 gramos, capellada casi transparente y tapones cónicos que sueltan rápido el pasto. Es el botín del extremo y del delantero que vive del pique corto.', gramos: 186, img: IMG.rosa, alt: 'Botín rosa de fútbol apoyado sobre una pelota en el césped', prod: 'mercurial-vapor-elite-fg' },
  { caracter: 'control', kicker: 'Carácter 02', titulo: 'La bajás y ya la tenés dominada', desc: 'Toda la superficie de contacto trabajada con relieve para frenar la pelota en el primer toque. El botín del volante que recibe de espaldas y gira.', gramos: 212, img: IMG.blanco, alt: 'Botín blanco de fútbol apoyado sobre una pelota', prod: 'phantom-gx-elite-fg' },
  { caracter: 'potencia', kicker: 'Carácter 03', titulo: 'Le pegás de afuera del área', desc: 'Nervaduras en la zona de golpeo y una placa más rígida que devuelve la energía del impacto. Pensado para el remate y el pase largo cruzado.', gramos: 227, img: IMG.suela, alt: 'Par de botines mostrando la suela y los tapones', prod: 'predator-elite-fg' },
  { caracter: 'toque', kicker: 'Carácter 04', titulo: 'Cuero que se amolda a tu pie', desc: 'Se estira donde tu pie lo necesita y ahí se queda. Más gramos, sí, pero noventa minutos sin una sola molestia y contacto limpio con la pelota.', gramos: 214, img: IMG.amarillo, alt: 'Detalle del empeine de un botín amarillo y blanco', prod: 'tiempo-legend-elite-fg' }
];

const RANGOS = [
  { id: 'r1', label: 'Hasta $150.000', min: 0, max: 150000 },
  { id: 'r2', label: '$150.000 a $280.000', min: 150000, max: 280000 },
  { id: 'r3', label: '$280.000 a $450.000', min: 280000, max: 450000 },
  { id: 'r4', label: 'Más de $450.000', min: 450000, max: Infinity }
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const nombreCaracter = id => (CARACTERES.find(c => c.id === id) || {}).nombre || id;

const Cart = {
  KEY: 'botineselite_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, talle, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.talle === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, 9);
    else items.push({ id: producto.id, talle, qty: Math.min(qty, 9) });
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.talle === talle);
    if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 9));
    this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && i.talle === talle))); },
  clear() { this.save([]); },
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
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.06, 0.4)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
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
  syncInert();
}

function cardHTML(p, extraClase) {
  const final = precioFinal(p);
  const talles = p.talles.map(t => `<option value="${t}"${t === 42 && p.talles.includes(42) ? ' selected' : ''}>Talle ${t}</option>`).join('');
  const badge = p.descuento > 0
    ? `<span class="badge badge-off">-${p.descuento}%</span>`
    : (p.badge ? `<span class="badge badge-nuevo">${esc(p.badge)}</span>` : '<span></span>');
  return `
    <article class="prod ${extraClase || ''}" data-id="${esc(p.id)}" data-animate style="opacity:0;transform:translateY(30px)">
      <div class="prod-media">
        <img src="${p.img}" alt="${esc(p.marca)} ${esc(p.modelo)}" width="1200" height="1200" decoding="async">
        <div class="prod-badges">${badge}<span class="badge badge-terreno">${esc(p.terreno)}</span></div>
        <button type="button" class="prod-quick" data-quick="${esc(p.id)}">Vista rápida</button>
      </div>
      <div class="prod-body">
        <p class="prod-marca">${esc(p.marca)}</p>
        <h3 class="prod-nombre">${esc(p.modelo)}</h3>
        <div class="prod-meta"><span>${esc(nombreCaracter(p.caracter))}</span><span>${p.peso} g</span></div>
        <div class="prod-precio">
          ${p.descuento > 0
            ? `<strong class="off">${formatearPrecio(final)}</strong><s>${formatearPrecio(p.precio)}</s>`
            : `<strong>${formatearPrecio(final)}</strong>`}
        </div>
        <div class="prod-actions">
          <label class="sr-only" for="talle-${esc(p.id)}${extraClase ? '-rail' : ''}">Talle de ${esc(p.modelo)}</label>
          <select class="talle-select" id="talle-${esc(p.id)}${extraClase ? '-rail' : ''}" data-talle-de="${esc(p.id)}">${talles}</select>
          <button type="button" class="prod-add" data-add="${esc(p.id)}">Agregar<span class="add-larga"> al carrito</span></button>
        </div>
      </div>
    </article>`;
}

function talleElegido(scope, id) {
  const sel = scope.querySelector(`[data-talle-de="${id}"]`);
  return sel ? Number(sel.value) : Number(getProducto(id)?.talles[0]);
}

function agregarAlCarrito(id, talle, qty = 1) {
  const p = getProducto(id);
  if (!p) return;
  const t = talle || p.talles[0];
  Cart.add(p, t, qty);
  showToast(`${p.modelo} · talle ${t} agregado`);
}

function initCategorias() {
  const cont = document.getElementById('caracteres-grid');
  if (!cont) return;
  cont.innerHTML = CARACTERES.map(c => `
    <button type="button" class="caracter-card" data-caracter="${esc(c.id)}" data-animate style="opacity:0;transform:translateY(34px)">
      <img src="${c.img}" alt="${esc(c.alt)}" width="1200" height="1600" decoding="async">
      <span class="caracter-body">
        <span class="caracter-num">${esc(c.num)}</span>
        <span>
          <span class="caracter-nombre">${esc(c.nombre)}</span>
          <span class="caracter-desc">${esc(c.desc)}</span>
          <span class="caracter-link">Ver botines
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
        </span>
      </span>
    </button>`).join('');
  cont.querySelectorAll('[data-caracter]').forEach(btn => {
    btn.addEventListener('click', () => {
      filtros.caracter = new Set([btn.dataset.caracter]);
      filtros.talle = new Set(); filtros.terreno = new Set(); filtros.marca = new Set(); filtros.precio = new Set();
      document.getElementById('buscador').value = '';
      sincronizarChips();
      aplicarFiltros();
      document.getElementById('tienda').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
}

function initRail() {
  const track = document.getElementById('rail-track');
  const vp = document.getElementById('rail-vp');
  if (!track || !vp) return;
  const destacados = ['mercurial-vapor-elite-fg', 'phantom-gx-elite-fg', 'predator-elite-fg', 'tiempo-legend-elite-fg', 'ultra-match-fg-ag', 'morelia-neo-pro-fg', 'king-match-fg', 'x-crazyfast-league-fg'];
  track.innerHTML = destacados.map(id => { const p = getProducto(id); return p ? cardHTML(p, 'rail-card') : ''; }).join('');

  const prev = document.getElementById('rail-prev');
  const next = document.getElementById('rail-next');
  const syncArrows = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const paso = () => (track.querySelector('.rail-card')?.getBoundingClientRect().width || 260) + 16;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', syncArrows, { passive: true });
  window.addEventListener('resize', syncArrows, { passive: true });
  syncArrows();

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
      setTimeout(() => vp.classList.remove('dragging'), 0);
    }
    syncArrows();
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
}

const filtros = { talle: new Set(), caracter: new Set(), terreno: new Set(), marca: new Set(), precio: new Set() };
let visibles = 16;

function chipsHTML(grupo, valores, etiquetas) {
  return valores.map(v => `<button type="button" class="chip" data-grupo="${grupo}" data-valor="${esc(v)}">${esc(etiquetas ? etiquetas[v] || v : v)}</button>`).join('');
}

function sincronizarChips() {
  document.querySelectorAll('.chip').forEach(chip => {
    const set = filtros[chip.dataset.grupo];
    chip.classList.toggle('activo', !!set && set.has(chip.dataset.valor));
  });
  const total = Object.values(filtros).reduce((s, set) => s + set.size, 0);
  const badge = document.getElementById('filtros-activos');
  if (badge) { badge.textContent = total; badge.hidden = total === 0; }
}

function productosFiltrados() {
  const q = normalizar(document.getElementById('buscador')?.value || '').split(/\s+/).filter(Boolean);
  return PRODUCTOS.filter(p => {
    if (filtros.talle.size && !p.talles.some(t => filtros.talle.has(String(t)))) return false;
    if (filtros.caracter.size && !filtros.caracter.has(p.caracter)) return false;
    if (filtros.terreno.size && !filtros.terreno.has(p.terreno)) return false;
    if (filtros.marca.size && !filtros.marca.has(p.marca)) return false;
    if (filtros.precio.size) {
      const f = precioFinal(p);
      const ok = [...filtros.precio].some(id => { const r = RANGOS.find(x => x.id === id); return r && f >= r.min && f < r.max; });
      if (!ok) return false;
    }
    if (q.length) {
      const heno = normalizar([p.marca, p.modelo, p.terreno, nombreCaracter(p.caracter), p.horma, p.descripcion].join(' '));
      if (!q.every(w => heno.includes(w))) return false;
    }
    return true;
  });
}

function aplicarFiltros(reset = true) {
  if (reset) visibles = 16;
  const grid = document.getElementById('catalogo-grid');
  const vacio = document.getElementById('sin-resultados');
  const verMas = document.getElementById('ver-mas');
  const count = document.getElementById('resultados-count');
  if (!grid) return;
  const lista = productosFiltrados();
  const mostrar = lista.slice(0, visibles);
  grid.innerHTML = mostrar.map(p => cardHTML(p)).join('');
  if (vacio) vacio.hidden = lista.length !== 0;
  if (verMas) verMas.hidden = lista.length <= visibles;
  if (count) count.textContent = lista.length === 1 ? '1 botín' : `${lista.length} botines`;
  sincronizarChips();
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function initCatalogo() {
  const grid = document.getElementById('catalogo-grid');
  if (!grid) return;

  document.getElementById('filtro-talle').innerHTML = chipsHTML('talle', TALLES.map(String));
  document.getElementById('filtro-caracter').innerHTML = CARACTERES.map(c => `<button type="button" class="chip" data-grupo="caracter" data-valor="${esc(c.id)}">${esc(c.nombre)}</button>`).join('');
  document.getElementById('filtro-terreno').innerHTML = chipsHTML('terreno', ['FG', 'AG', 'SG', 'MG'], { FG: 'FG · Natural', AG: 'AG · Sintético', SG: 'SG · Blando', MG: 'MG · Mixto' });
  document.getElementById('filtro-marca').innerHTML = chipsHTML('marca', [...new Set(PRODUCTOS.map(p => p.marca))]);
  document.getElementById('filtro-precio').innerHTML = RANGOS.map(r => `<button type="button" class="chip" data-grupo="precio" data-valor="${r.id}">${esc(r.label)}</button>`).join('');

  document.querySelectorAll('.filtros-panel .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const set = filtros[chip.dataset.grupo];
      if (!set) return;
      if (set.has(chip.dataset.valor)) set.delete(chip.dataset.valor); else set.add(chip.dataset.valor);
      aplicarFiltros();
    });
  });

  const toggle = document.getElementById('filtros-toggle');
  const panel = document.getElementById('filtros-panel');
  const setPanel = abierto => {
    panel.style.display = abierto ? '' : 'none';
    toggle.setAttribute('aria-expanded', String(abierto));
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  let abierto = window.innerWidth > 900;
  setPanel(abierto);
  toggle.addEventListener('click', () => { abierto = !abierto; setPanel(abierto); });

  const limpiar = () => {
    Object.values(filtros).forEach(set => set.clear());
    document.getElementById('buscador').value = '';
    aplicarFiltros();
  };
  document.getElementById('limpiar-filtros').addEventListener('click', limpiar);
  document.getElementById('sin-resultados-reset').addEventListener('click', limpiar);

  let t = null;
  document.getElementById('buscador').addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => aplicarFiltros(), 180);
  });

  document.getElementById('ver-mas').addEventListener('click', () => {
    visibles += 16;
    aplicarFiltros(false);
  });

  aplicarFiltros();
}

let cartFocusPrev = null;

function renderCarrito() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-foot');
  if (!body || !foot) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `
      <div class="cart-vacio">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5"/><circle cx="17.5" cy="20" r="1.5"/></svg>
        <h3>Todavía no elegiste ningún botín</h3>
        <p>Mirá los más elegidos o filtrá por tu talle en la tienda.</p>
      </div>`;
    foot.innerHTML = `<button type="button" class="btn btn-dark" data-cerrar-drawer>Ver la tienda</button>`;
    foot.querySelector('[data-cerrar-drawer]').addEventListener('click', () => {
      cerrarDrawer();
      document.getElementById('tienda').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `
      <div class="cart-item">
        <div class="cart-item-img"><img src="${p.img}" alt="${esc(p.modelo)}" width="150" height="150"></div>
        <div>
          <h3 class="cart-item-nombre">${esc(p.modelo)}</h3>
          <p class="cart-item-meta">${esc(p.marca)} · Talle ${i.talle} · ${esc(p.terreno)}</p>
          <p class="cart-item-precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
          <button type="button" class="cart-remove" data-remove="${esc(i.id)}" data-talle="${i.talle}">Quitar</button>
        </div>
        <div class="stepper">
          <button type="button" data-menos="${esc(i.id)}" data-talle="${i.talle}" aria-label="Restar una unidad">−</button>
          <span>${i.qty}</span>
          <button type="button" data-mas="${esc(i.id)}" data-talle="${i.talle}" aria-label="Sumar una unidad">+</button>
        </div>
      </div>`;
  }).join('');
  foot.innerHTML = `
    <div class="cart-total"><span>Total</span><strong>${formatearPrecio(Cart.total())}</strong></div>
    <button type="button" class="btn btn-primary" id="finalizar">Finalizar compra</button>
    <p class="drawer-nota">El pago online se activa al pasar la web a producción.</p>`;
  body.querySelectorAll('[data-mas]').forEach(b => b.addEventListener('click', () => {
    const it = Cart.get().find(i => i.id === b.dataset.mas && i.talle === Number(b.dataset.talle));
    if (it) Cart.setQty(it.id, it.talle, it.qty + 1);
  }));
  body.querySelectorAll('[data-menos]').forEach(b => b.addEventListener('click', () => {
    const it = Cart.get().find(i => i.id === b.dataset.menos && i.talle === Number(b.dataset.talle));
    if (it && it.qty > 1) Cart.setQty(it.id, it.talle, it.qty - 1);
    else if (it) Cart.remove(it.id, it.talle);
  }));
  body.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => Cart.remove(b.dataset.remove, Number(b.dataset.talle))));
  document.getElementById('finalizar').addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
}

function abrirDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  cartFocusPrev = document.activeElement;
  bd.hidden = false; drawer.hidden = false;
  setTimeout(() => { bd.classList.add('open'); drawer.classList.add('open'); }, 16);
  document.body.classList.add('no-scroll');
  document.getElementById('drawer-close').focus();
}

function cerrarDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  drawer.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { drawer.hidden = true; bd.hidden = true; }, 380);
  cartFocusPrev?.focus?.();
}

function initCarrito() {
  renderCarrito();
  document.addEventListener('cart:updated', renderCarrito);
  document.getElementById('header-cart').addEventListener('click', abrirDrawer);
  document.getElementById('drawer-close').addEventListener('click', cerrarDrawer);
  document.getElementById('drawer-backdrop').addEventListener('click', cerrarDrawer);
  document.addEventListener('keydown', e => {
    const drawer = document.getElementById('drawer');
    if (e.key === 'Escape' && !drawer.hidden) cerrarDrawer();
    if (e.key === 'Tab' && !drawer.hidden) trapFocus(e, drawer);
  });
}

function trapFocus(e, cont) {
  const focusables = cont.querySelectorAll('a[href], button:not([disabled]), select, input, [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

let modalFocusPrev = null;

function abrirModal(id) {
  const p = getProducto(id);
  if (!p) return;
  const modal = document.getElementById('modal');
  const bd = document.getElementById('modal-backdrop');
  const body = document.getElementById('modal-body');
  const galeria = [p.img, ...PRODUCTOS.filter(x => x.caracter === p.caracter && x.img !== p.img).map(x => x.img).filter((v, i, a) => a.indexOf(v) === i).slice(0, 2)];
  const relacionados = PRODUCTOS.filter(x => x.caracter === p.caracter && x.id !== p.id).slice(0, 3);
  const final = precioFinal(p);
  modalFocusPrev = document.activeElement;

  body.innerHTML = `
    <div class="modal-grid">
      <div class="modal-galeria">
        <div class="modal-galeria-main"><img id="modal-img" src="${galeria[0]}" alt="${esc(p.marca)} ${esc(p.modelo)}" width="1200" height="1200"></div>
        <div class="modal-thumbs">
          ${galeria.map((src, i) => `<button type="button" class="modal-thumb${i === 0 ? ' activo' : ''}" data-src="${src}" aria-label="Ver imagen ${i + 1}"><img src="${src}" alt="" width="120" height="120"></button>`).join('')}
        </div>
      </div>
      <div class="modal-info">
        <p class="modal-marca">${esc(p.marca)}</p>
        <h3 id="modal-title">${esc(p.modelo)}</h3>
        <div class="modal-precio">
          ${p.descuento > 0
            ? `<strong class="off">${formatearPrecio(final)}</strong><s>${formatearPrecio(p.precio)}</s><span class="badge badge-off">-${p.descuento}%</span>`
            : `<strong>${formatearPrecio(final)}</strong>`}
        </div>
        <p>${esc(p.descripcion)}</p>
        <dl class="modal-ficha">
          <div><dt>Terreno</dt><dd>${esc(p.terreno)}</dd></div>
          <div><dt>Peso</dt><dd>${p.peso} g</dd></div>
          <div><dt>Carácter</dt><dd>${esc(nombreCaracter(p.caracter))}</dd></div>
          <div><dt>Horma</dt><dd>${esc(p.horma)}</dd></div>
        </dl>
        <p class="modal-marca">Elegí tu talle</p>
        <div class="modal-talles" id="modal-talles" role="group" aria-label="Talles disponibles">
          ${p.talles.map((t, i) => `<button type="button" class="talle-btn${(t === 42 || (i === 0 && !p.talles.includes(42))) ? ' activo' : ''}" data-talle="${t}">${t}</button>`).join('')}
        </div>
        <div class="modal-acciones">
          <div class="stepper">
            <button type="button" id="modal-menos" aria-label="Restar una unidad">−</button>
            <span id="modal-qty">1</span>
            <button type="button" id="modal-mas" aria-label="Sumar una unidad">+</button>
          </div>
          <button type="button" class="btn btn-dark" id="modal-add">Agregar al carrito</button>
          <button type="button" class="btn btn-primary" id="modal-buy">Comprar ahora</button>
        </div>
      </div>
      <div class="modal-relacionados">
        <h4>También te puede interesar</h4>
        <div class="modal-rel-grid">
          ${relacionados.map(r => `
            <button type="button" class="modal-rel" data-quick="${esc(r.id)}">
              <span class="modal-rel-img"><img src="${r.img}" alt="" width="120" height="120"></span>
              <p><strong>${esc(r.modelo)}</strong>${formatearPrecio(precioFinal(r))}</p>
            </button>`).join('')}
        </div>
      </div>
    </div>`;

  bd.hidden = false; modal.hidden = false;
  setTimeout(() => { bd.classList.add('open'); modal.classList.add('open'); }, 16);
  document.body.classList.add('no-scroll');
  document.getElementById('modal-close').focus();

  let qty = 1;
  const qtyEl = document.getElementById('modal-qty');
  document.getElementById('modal-mas').addEventListener('click', () => { qty = Math.min(qty + 1, 9); qtyEl.textContent = qty; });
  document.getElementById('modal-menos').addEventListener('click', () => { qty = Math.max(qty - 1, 1); qtyEl.textContent = qty; });

  const tallesCont = document.getElementById('modal-talles');
  tallesCont.querySelectorAll('.talle-btn').forEach(b => {
    b.addEventListener('click', () => {
      tallesCont.querySelectorAll('.talle-btn').forEach(x => x.classList.remove('activo'));
      b.classList.add('activo');
    });
  });
  const talleActual = () => Number(tallesCont.querySelector('.talle-btn.activo')?.dataset.talle || p.talles[0]);

  document.getElementById('modal-add').addEventListener('click', () => agregarAlCarrito(p.id, talleActual(), qty));
  document.getElementById('modal-buy').addEventListener('click', () => {
    agregarAlCarrito(p.id, talleActual(), qty);
    cerrarModal();
    abrirDrawer();
  });
  body.querySelectorAll('.modal-thumb').forEach(b => {
    b.addEventListener('click', () => {
      body.querySelectorAll('.modal-thumb').forEach(x => x.classList.remove('activo'));
      b.classList.add('activo');
      document.getElementById('modal-img').src = b.dataset.src;
    });
  });
  body.querySelectorAll('.modal-rel').forEach(b => b.addEventListener('click', () => abrirModal(b.dataset.quick)));
}

function cerrarModal() {
  const modal = document.getElementById('modal');
  const bd = document.getElementById('modal-backdrop');
  modal.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { modal.hidden = true; bd.hidden = true; }, 300);
  modalFocusPrev?.focus?.();
}

function initModal() {
  document.getElementById('modal-close').addEventListener('click', cerrarModal);
  document.getElementById('modal-backdrop').addEventListener('click', cerrarModal);
  document.addEventListener('keydown', e => {
    const modal = document.getElementById('modal');
    if (e.key === 'Escape' && !modal.hidden) cerrarModal();
    if (e.key === 'Tab' && !modal.hidden) trapFocus(e, modal);
  });
  const slug = new URLSearchParams(location.search).get('producto');
  if (slug && getProducto(slug)) abrirModal(slug);
}

function initAcciones() {
  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) {
      const id = add.dataset.add;
      const scope = add.closest('.prod') || document;
      agregarAlCarrito(id, talleElegido(scope, id));
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick && !quick.classList.contains('modal-rel')) abrirModal(quick.dataset.quick);
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
  cart?.addEventListener('click', abrirDrawer);
  sync();
}

function initEscena() {
  const escena = document.getElementById('escena');
  const shots = document.getElementById('escena-shots');
  const textos = document.getElementById('escena-textos');
  const indice = document.getElementById('escena-indice');
  const gramosEl = document.getElementById('escena-gramos');
  if (!escena || !shots || !textos || !indice) return;

  shots.innerHTML = ESCENA.map((e, i) => `
    <div class="escena-shot${i === 0 ? ' activo' : ''}" data-i="${i}">
      <img src="${e.img}" alt="${esc(e.alt)}" width="1200" height="1500" decoding="async">
    </div>`).join('');

  textos.innerHTML = ESCENA.map((e, i) => {
    const p = getProducto(e.prod);
    if (!p) return '';
    return `
    <div class="escena-texto${i === 0 ? ' activo' : ''}" data-i="${i}">
      <p class="escena-kicker">${esc(e.kicker)}</p>
      <h3 class="escena-titulo">${esc(e.titulo)}</h3>
      <p class="escena-desc">${esc(e.desc)}</p>
      <div class="escena-prod">
        <span class="escena-prod-img"><img src="${p.img}" alt="" width="150" height="150"></span>
        <span class="escena-prod-info">
          <span class="escena-prod-nombre">${esc(p.modelo)}</span>
          <span class="escena-prod-precio">${formatearPrecio(precioFinal(p))}</span>
        </span>
        <button type="button" class="escena-add" data-add="${esc(p.id)}">Agregar</button>
      </div>
    </div>`;
  }).join('');

  indice.innerHTML = ESCENA.map((e, i) => `<li${i === 0 ? ' class="activo"' : ''}><button type="button" data-ir="${i}">${esc(e.caracter)}</button></li>`).join('');

  const shotEls = [...shots.querySelectorAll('.escena-shot')];
  const textoEls = [...textos.querySelectorAll('.escena-texto')];
  const liEls = [...indice.querySelectorAll('li')];
  let actual = 0;

  const setActivo = i => {
    if (i === actual) return;
    actual = i;
    shotEls.forEach((el, n) => el.classList.toggle('activo', n === i));
    textoEls.forEach((el, n) => el.classList.toggle('activo', n === i));
    liEls.forEach((el, n) => el.classList.toggle('activo', n === i));
  };

  const onScroll = () => {
    const r = escena.getBoundingClientRect();
    const recorrido = r.height - window.innerHeight;
    if (recorrido <= 0) return;
    const p = Math.min(Math.max(-r.top / recorrido, 0), 1);
    const idx = Math.min(Math.floor(p * ESCENA.length), ESCENA.length - 1);
    setActivo(idx);
    if (gramosEl) {
      const pos = Math.min(Math.max(p * (ESCENA.length - 1), 0), ESCENA.length - 1);
      const a = Math.floor(pos), b = Math.min(a + 1, ESCENA.length - 1), t = pos - a;
      gramosEl.textContent = Math.round(ESCENA[a].gramos + (ESCENA[b].gramos - ESCENA[a].gramos) * t);
    }
  };

  indice.querySelectorAll('[data-ir]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = Number(btn.dataset.ir);
      const r = escena.getBoundingClientRect();
      const arriba = r.top + window.scrollY;
      const recorrido = r.height - window.innerHeight;
      const destino = arriba + (recorrido * ((i + 0.4) / ESCENA.length));
      window.scrollTo({ top: destino, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
}

function initHero() {
  const gramos = document.getElementById('hero-gramos');
  if (gramos && !reduceMotion) {
    const destino = 186;
    let n = 240;
    const paso = () => {
      n -= Math.max(1, Math.round((n - destino) / 6));
      if (n <= destino) { gramos.textContent = destino; return; }
      gramos.textContent = n;
      requestAnimationFrame(paso);
    };
    setTimeout(paso, 500);
  }

  if (typeof gsap === 'undefined' || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-shot', { scale: 1.08, opacity: 0, duration: 1.2 })
    .from('.hero-number', { opacity: 0, scale: .94, duration: 1.1 }, 0.1)
    .from('.hero-copy .eyebrow', { y: 18, opacity: 0, duration: .7 }, 0.15)
    .from('.hero-title', { y: 32, opacity: 0, duration: .9 }, 0.25)
    .from('.hero-lead', { y: 24, opacity: 0, duration: .8 }, 0.4)
    .from('.hero-cta .btn', { y: 20, opacity: 0, duration: .7, stagger: .1 }, 0.5)
    .from('.hero-facts > div', { y: 16, opacity: 0, duration: .6, stagger: .08 }, 0.62)
    .from('.hero-spec', { x: -20, opacity: 0, duration: .7 }, 0.7)
    .from('.hero-stamp', { y: 20, opacity: 0, duration: .7 }, 0.8);
}

function initTextoLee() {
  const el = document.getElementById('lead-read');
  if (!el || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const palabras = el.textContent.trim().split(/\s+/);
  el.innerHTML = palabras.map(w => `<span class="palabra">${esc(w)}</span>`).join(' ');
  gsap.fromTo(el.querySelectorAll('.palabra'),
    { color: 'rgba(92,98,112,.35)' },
    {
      color: 'var(--color-text)', stagger: .08, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 55%', scrub: true }
    });
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  gsap.to('.hero-number', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.oficio-media img', { yPercent: -5, ease: 'none', scrollTrigger: { trigger: '.oficio-media', start: 'top bottom', end: 'bottom top', scrub: true } });
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });

initCategorias();
initRail();
initCatalogo();
initEscena();
initReveals();
initNav();
initCarrito();
initModal();
initAcciones();
initFloats();
initHero();
initTextoLee();
initParallax();
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
