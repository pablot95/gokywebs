const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA = '5491154681135';

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const ASESORIAS = [
  { id: 'consulta-online', linea: 'particulares', nombre: 'Consulta jurídica por videollamada', detalle: 'Contás tu situación y te vas con los pasos a seguir y la documentación que vas a necesitar.', meta: '45 minutos · por videollamada', precio: 45000 },
  { id: 'consulta-sede', linea: 'particulares', nombre: 'Consulta en el estudio', detalle: 'Para revisar papeles juntos, en la sede de Córdoba o de Buenos Aires que te quede más cerca.', meta: '60 minutos · en la sede que elijas', precio: 55000 },
  { id: 'estrategia', linea: 'abogados', nombre: 'Consultoría de estrategia de caso', detalle: 'Repasamos hechos, prueba y camino procesal con otra mirada, antes de presentar o de ir a audiencia.', meta: '60 minutos · videollamada o sede', precio: 80000 },
  { id: 'revision', linea: 'abogados', nombre: 'Revisión de escrito', detalle: 'Demanda, contestación o recurso: te devolvemos observaciones y sugerencias puntuales sobre el texto.', meta: 'Devolución por escrito', precio: 70000 },
  { id: 'perfilacion', linea: 'pericial', nombre: 'Consulta pericial en perfilación criminal', detalle: 'Evaluamos si la causa necesita un informe de perfilación y qué alcance tendría.', meta: '60 minutos · videollamada o sede', precio: 95000 },
  { id: 'sectas', linea: 'pericial', nombre: 'Consulta pericial sobre sectas', detalle: 'Para causas con indicios de captación o manipulación grupal: qué se puede peritar y cómo.', meta: '60 minutos · videollamada o sede', precio: 95000 }
];

const LINEA_NOMBRE = { particulares: 'Particulares', abogados: 'Abogados', pericial: 'Pericial' };

const LINEAS = {
  servicios: {
    titulo: 'Servicios jurídicos',
    para: 'Para particulares y empresas',
    intro: 'Escuchamos el caso, lo ordenamos y te decimos qué camino conviene: negociar, reclamar o defenderte. Cada tema lo toma la socia con la especialidad que corresponde.',
    items: ['Consulta y diagnóstico del caso', 'Redacción y revisión de contratos, acuerdos y cartas documento', 'Representación en juicio en Córdoba, Buenos Aires y ante la justicia federal', 'Seguimiento del expediente con avisos claros en cada etapa'],
    tener: ['DNI', 'Contratos, notificaciones o cartas documento que tengas', 'Fechas importantes: cuándo pasó y cuándo te notificaron'],
    filtro: 'particulares'
  },
  consultorias: {
    titulo: 'Consultorías para abogados',
    para: 'Para colegas que necesitan otra mirada',
    intro: 'Especialidades poco frecuentes al servicio de tu caso, con reserva profesional y facilidades de pago.',
    items: ['Estrategia de caso: hechos, prueba y camino procesal', 'Revisión de demandas, contestaciones y recursos', 'Segunda opinión antes de una audiencia o un acuerdo', 'Derivación al cuerpo pericial cuando la causa lo pide'],
    tener: ['Copia del escrito o de las piezas del expediente', 'Fecha de vencimiento o de audiencia', 'Qué querés resolver con la consulta'],
    filtro: 'abogados'
  },
  pericial: {
    titulo: 'Asistencia pericial',
    para: 'Cuerpo pericial propio',
    intro: 'El único cuerpo pericial del valle de Punilla, especialista en perfilación criminal y con certificación internacional en introducción a las sectas.',
    items: ['Perfilación criminal', 'Análisis de casos vinculados a sectas', 'Informes periciales de parte', 'Consultor técnico para abogados en la causa'],
    tener: ['Carátula y número de expediente, si ya hay causa', 'Qué tiene que responder el informe', 'Plazos del juzgado'],
    filtro: 'pericial'
  }
};

const SEDES = [
  { id: 'villagiardino', nombre: 'Villa Giardino', zona: 'Valle de Punilla', lat: -30.9617, lng: -64.4972 },
  { id: 'cruzdeleje', nombre: 'Cruz del Eje', zona: 'Noroeste cordobés', lat: -30.7263, lng: -64.8087 },
  { id: 'cordoba', nombre: 'Córdoba Capital', zona: 'Ciudad de Córdoba', lat: -31.4167, lng: -64.1833 },
  { id: 'caba', nombre: 'CABA', zona: 'Ciudad de Buenos Aires', lat: -34.6037, lng: -58.3816 },
  { id: 'pba', nombre: 'Provincia de Buenos Aires', zona: 'Localidad a confirmar', lat: null, lng: null }
];
const PBA_BOUNDS = [[-40.8, -63.4], [-33.3, -56.7]];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => ASESORIAS.find(p => p.id === id);
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const Cart = {
  KEY: 'galzerano_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin almacenamiento */ } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 9);
    else items.push({ id: producto.id, qty: Math.min(qty, producto.stock ?? 9) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 9)); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
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

function trapFocus(container, e) {
  if (e.key !== 'Tab') return;
  const f = [...container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0]; const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
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

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  if (reduceMotion || typeof gsap === 'undefined') { hero.classList.add('is-lit'); return; }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.08, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(8px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7)
    .call(() => hero.classList.add('is-lit'), null, 0.75);
  const par = hero.querySelector('.hero__parallax');
  if (par && typeof ScrollTrigger !== 'undefined') {
    gsap.to(par, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 961px)');
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

let filtroActual = 'todas';
function fichaHTML(p) {
  const n = ASESORIAS.indexOf(p) + 1;
  return `<article class="ficha" data-animate="subir" style="opacity:0;transform:translateY(32px)">
    <div class="ficha__top"><span class="ficha__num">N.º ${String(n).padStart(2, '0')}</span><span class="ficha__tag ficha__tag--${p.linea}">${LINEA_NOMBRE[p.linea]}</span></div>
    <h3 class="ficha__title">${esc(p.nombre)}</h3>
    <p class="ficha__desc">${esc(p.detalle)}</p>
    <p class="ficha__meta">${esc(p.meta)}</p>
    <div class="ficha__foot"><span class="ficha__price">${formatearPrecio(precioFinal(p))}</span><button type="button" class="btn btn--primary btn--small btn--add" data-add="${p.id}">Agregar</button></div>
  </article>`;
}

function syncBotonesAgregar() {
  const enCarrito = new Set(Cart.get().map(i => i.id));
  document.querySelectorAll('[data-add]').forEach(b => {
    const esta = enCarrito.has(b.dataset.add);
    b.classList.toggle('is-added', esta);
    b.textContent = esta ? 'En el carrito' : 'Agregar';
    b.setAttribute('aria-label', esta ? `${getProducto(b.dataset.add)?.nombre ?? ''}: ya está en el carrito, abrirlo` : `Agregar ${getProducto(b.dataset.add)?.nombre ?? ''} al carrito`);
  });
}

function renderAsesorias() {
  const cont = document.getElementById('asesLista');
  if (!cont) return;
  const lista = filtroActual === 'todas' ? ASESORIAS : ASESORIAS.filter(p => p.linea === filtroActual);
  cont.innerHTML = lista.map(fichaHTML).join('');
  syncBotonesAgregar();
  revelarNuevos(cont);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function setFiltro(f) {
  filtroActual = f;
  document.querySelectorAll('[data-filtro]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filtro === f)));
  renderAsesorias();
}

function initAsesorias() {
  const cont = document.getElementById('asesLista');
  if (!cont) return;
  document.querySelectorAll('[data-filtro]').forEach(b => b.addEventListener('click', () => setFiltro(b.dataset.filtro)));
  cont.addEventListener('click', e => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    const p = getProducto(b.dataset.add);
    if (!p) return;
    if (b.classList.contains('is-added')) { openCartDrawer(); return; }
    Cart.add(p);
    showToast(`Agregaste «${p.nombre}» al carrito`);
  });
  renderAsesorias();
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

const drawer = document.getElementById('cartDrawer');
const drawerBd = document.getElementById('drawerBackdrop');
let drawerLastFocus = null;
let drawerTimer = 0;

function mostrarVista(v) {
  if (!drawer) return;
  drawer.querySelectorAll('[data-view]').forEach(el => { el.hidden = el.dataset.view !== v; });
  const orden = ['carrito', 'datos', 'listo'];
  drawer.querySelectorAll('[data-paso]').forEach(li => {
    const i = orden.indexOf(li.dataset.paso);
    li.classList.toggle('is-on', i <= orden.indexOf(v));
    if (li.dataset.paso === v) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
  });
  const title = drawer.querySelector('.drawer__title');
  if (title) title.textContent = v === 'carrito' ? 'Tu carrito' : v === 'datos' ? 'Datos y pago' : 'Pedido confirmado';
  drawer.querySelector('[data-view="' + v + '"] .drawer__scroll')?.scrollTo(0, 0);
}

function openCartDrawer() {
  if (!drawer || !drawerBd) return;
  clearTimeout(drawerTimer);
  drawerLastFocus = document.activeElement;
  renderCart();
  mostrarVista('carrito');
  drawer.hidden = false; drawerBd.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => { drawer.classList.add('open'); drawerBd.classList.add('open'); }));
  drawer.querySelector('.drawer__close')?.focus();
}

function closeCartDrawer() {
  if (!drawer || drawer.hidden) return;
  drawer.classList.remove('open'); drawerBd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  drawerTimer = setTimeout(() => { drawer.hidden = true; drawerBd.hidden = true; }, reduceMotion ? 0 : 380);
  drawerLastFocus?.focus?.();
}

function renderCart() {
  const ul = document.getElementById('cartItems');
  const empty = document.getElementById('cartEmpty');
  const total = document.getElementById('cartTotal');
  const next = document.getElementById('toDatos');
  if (!ul) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  ul.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    return `<li class="cart-item">
      <div class="cart-item__info"><span class="cart-item__tag">${LINEA_NOMBRE[p.linea]}</span><p class="cart-item__name">${esc(p.nombre)}</p><p class="cart-item__meta">${esc(p.meta)}</p></div>
      <div class="cart-item__row">
        <div class="qty" role="group" aria-label="Cantidad de ${esc(p.nombre)}">
          <button type="button" data-qty="-1" data-id="${p.id}" aria-label="Restar una"${i.qty <= 1 ? ' disabled' : ''}>−</button>
          <span aria-live="polite">${i.qty}</span>
          <button type="button" data-qty="1" data-id="${p.id}" aria-label="Sumar una"${i.qty >= 9 ? ' disabled' : ''}>+</button>
        </div>
        <span class="cart-item__price">${formatearPrecio(precioFinal(p) * i.qty)}</span>
        <button type="button" class="cart-item__del" data-del="${p.id}" aria-label="Quitar ${esc(p.nombre)}">Quitar</button>
      </div>
    </li>`;
  }).join('');
  if (empty) empty.hidden = items.length > 0;
  if (total) total.textContent = formatearPrecio(Cart.total());
  if (next) next.disabled = items.length === 0;
}

function initCart() {
  document.querySelectorAll('[data-cart-open]').forEach(b => b.addEventListener('click', openCartDrawer));
  document.getElementById('cart-float')?.addEventListener('click', openCartDrawer);
  document.addEventListener('cart:updated', () => { updateCartBadge(); syncBotonesAgregar(); if (drawer && !drawer.hidden) renderCart(); });
  updateCartBadge();
  if (!drawer) return;
  drawer.querySelectorAll('[data-drawer-close]').forEach(b => b.addEventListener('click', closeCartDrawer));
  drawerBd?.addEventListener('click', closeCartDrawer);
  drawer.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeCartDrawer(); return; }
    trapFocus(drawer, e);
  });
  drawer.querySelector('#cartItems')?.addEventListener('click', e => {
    const q = e.target.closest('[data-qty]');
    if (q) { const it = Cart.get().find(i => i.id === q.dataset.id); if (it) Cart.setQty(it.id, it.qty + Number(q.dataset.qty)); return; }
    const d = e.target.closest('[data-del]');
    if (d) { Cart.remove(d.dataset.del); showToast('Quitamos la asesoría del carrito'); }
  });
  drawer.querySelector('[data-ir-asesorias]')?.addEventListener('click', () => {
    closeCartDrawer();
    document.getElementById('asesorias')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });
  document.getElementById('toDatos')?.addEventListener('click', () => {
    if (!Cart.count()) return;
    mostrarVista('datos');
    document.getElementById('kNombre')?.focus();
  });
  document.getElementById('backCarrito')?.addEventListener('click', () => { mostrarVista('carrito'); document.getElementById('toDatos')?.focus(); });
}

function setError(input, errEl, malo) {
  if (!input) return;
  input.setAttribute('aria-invalid', String(malo));
  if (errEl) { errEl.hidden = !malo; if (malo) input.setAttribute('aria-describedby', errEl.id); else input.removeAttribute('aria-describedby'); }
}

function initCheckout() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;
  const tel = document.getElementById('kTel');
  let mask = null;
  if (tel && typeof IMask !== 'undefined') mask = IMask(tel, { mask: '+{54} 9 00 0000-0000' });
  const sedeCampo = document.getElementById('kSedeCampo');
  form.querySelectorAll('input[name="modalidad"]').forEach(r => r.addEventListener('change', () => {
    if (sedeCampo) sedeCampo.hidden = form.modalidad.value !== 'En una sede';
  }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = document.getElementById('kNombre');
    const mail = document.getElementById('kMail');
    const digitos = mask ? mask.unmaskedValue : (tel?.value || '').replace(/\D/g, '');
    const nombreMalo = !nombre.value.trim() || nombre.value.trim().length < 3;
    const telMalo = digitos.length < (mask ? 12 : 10);
    const mailMalo = !!mail.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value.trim());
    setError(nombre, document.getElementById('kNombreErr'), nombreMalo);
    setError(tel, document.getElementById('kTelErr'), telMalo);
    setError(mail, document.getElementById('kMailErr'), mailMalo);
    if (nombreMalo || telMalo || mailMalo) { (nombreMalo ? nombre : telMalo ? tel : mail).focus(); return; }
    const btn = document.getElementById('confirmarPedido');
    btn.disabled = true; btn.textContent = 'Confirmando…';
    setTimeout(() => {
      btn.disabled = false; btn.textContent = 'Confirmar pedido';
      const datos = {
        nombre: nombre.value.trim(),
        modalidad: form.modalidad.value === 'En una sede' ? `En la sede de ${form.sede.value}` : 'Videollamada',
        tema: form.tema.value.trim(),
        pago: form.pago.value
      };
      mostrarListo(datos);
      Cart.clear();
      form.reset();
      mask?.updateValue();
      if (sedeCampo) sedeCampo.hidden = true;
    }, 800);
  });
}

function mostrarListo(d) {
  const cont = document.getElementById('pedidoListo');
  if (!cont) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  const total = Cart.total();
  const nro = 'GZ-' + String(Date.now()).slice(-4);
  const lineas = items.map(i => { const p = getProducto(i.id); return `• ${p.nombre} × ${i.qty} — ${formatearPrecio(precioFinal(p) * i.qty)}`; });
  const pagoTxt = d.pago === 'transferencia' ? 'transferencia o depósito' : 'Mercado Pago';
  const msg = [`Hola, hice el pedido ${nro} en la web del estudio:`, ...lineas, `Total: ${formatearPrecio(total)}`, `Pago: ${pagoTxt}`, `Modalidad: ${d.modalidad}`, `Nombre: ${d.nombre}`]
    .concat(d.tema ? [`Tema: ${d.tema}`] : [])
    .concat(d.pago === 'transferencia' ? ['Te mando el comprobante de la transferencia.'] : ['Quiero coordinar el día de la consulta.'])
    .join('\n');
  const resumen = items.map(i => { const p = getProducto(i.id); return `<li><span>${esc(p.nombre)}${i.qty > 1 ? ' × ' + i.qty : ''}</span><strong>${formatearPrecio(precioFinal(p) * i.qty)}</strong></li>`; }).join('');
  const pagoHTML = d.pago === 'transferencia'
    ? `<div class="listo__cuenta">
        <p class="listo__h">Datos para transferir</p>
        <dl>
          <div><dt>Titular</dt><dd>Estudio Galzerano &amp; Asociados</dd></div>
          <div><dt>Alias</dt><dd>Lo carga el estudio desde su panel</dd></div>
          <div><dt>CBU</dt><dd>Lo carga el estudio desde su panel</dd></div>
          <div><dt>Importe</dt><dd>${formatearPrecio(total)}</dd></div>
        </dl>
      </div>
      <a class="btn btn--primary btn--block" href="${waLink(msg)}" target="_blank" rel="noopener">Enviar el comprobante por WhatsApp</a>`
    : `<button type="button" class="btn btn--primary btn--block" data-pagar-mp>Pagar ${formatearPrecio(total)} con Mercado Pago</button>
      <a class="btn btn--ghost btn--block" href="${waLink(msg)}" target="_blank" rel="noopener">Coordinar el día por WhatsApp</a>`;
  cont.innerHTML = `<div class="listo">
      <span class="listo__ok" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg></span>
      <p class="listo__nro">Pedido ${nro}</p>
      <p class="listo__titulo">¡Gracias, ${esc(d.nombre.split(' ')[0])}! ${items.reduce((s, i) => s + i.qty, 0) > 1 ? 'Tus asesorías quedaron reservadas.' : 'Tu asesoría quedó reservada.'}</p>
      <p class="listo__txt">Modalidad: ${esc(d.modalidad)}. Cuando recibamos el pago te escribimos para fijar el día.</p>
      <ul class="listo__items">${resumen}<li class="listo__total"><span>Total</span><strong>${formatearPrecio(total)}</strong></li></ul>
      ${pagoHTML}
    </div>`;
  cont.querySelector('[data-pagar-mp]')?.addEventListener('click', () => showToast('El cobro con Mercado Pago se activa al pasar la web a producción.'));
  mostrarVista('listo');
  cont.querySelector('.listo__titulo')?.setAttribute('tabindex', '-1');
  cont.querySelector('.listo__titulo')?.focus();
}

function initLineaModal() {
  const modal = document.getElementById('lineaModal');
  const body = document.getElementById('lineaModalBody');
  if (!modal || !body) return;
  let last = null;
  const close = () => {
    modal.classList.remove('open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 300);
    last?.focus?.();
  };
  const open = (key, trigger) => {
    const l = LINEAS[key];
    if (!l) return;
    last = trigger;
    body.innerHTML = `<p class="modal__para">${esc(l.para)}</p>
      <h3 class="modal__titulo">${esc(l.titulo)}</h3>
      <p class="modal__intro">${esc(l.intro)}</p>
      <div class="modal__cols">
        <div><p class="modal__h">Qué hacemos</p><ul>${l.items.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>
        <div><p class="modal__h">Qué conviene tener a mano</p><ul>${l.tener.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>
      </div>
      <div class="modal__acciones">
        <button type="button" class="btn btn--primary" data-ver-filtro="${l.filtro}">Ver asesorías de esta línea</button>
        <a class="btn btn--ghost" href="${waLink(`Hola, quiero consultar por ${l.titulo.toLowerCase()}.`)}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
      </div>`;
    modal.setAttribute('aria-label', l.titulo);
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
    modal.querySelector('.modal__close')?.focus();
  };
  document.querySelectorAll('[data-linea]').forEach(b => b.addEventListener('click', () => open(b.dataset.linea, b)));
  modal.querySelectorAll('[data-modal-close]').forEach(b => b.addEventListener('click', close));
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { close(); return; }
    trapFocus(modal, e);
  });
  body.addEventListener('click', e => {
    const b = e.target.closest('[data-ver-filtro]');
    if (!b) return;
    last = null;
    close();
    setFiltro(b.dataset.verFiltro);
    document.getElementById('asesorias')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

function initSedes() {
  const botones = document.querySelectorAll('[data-sede]');
  if (!botones.length) return;
  const el = document.getElementById('mapaSedes');
  let map = null;
  let etiquetaPba = null;
  const markers = {};
  if (el && typeof L !== 'undefined') {
    map = L.map(el, { scrollWheelZoom: false, attributionControl: true });
    map.setView([-33, -61.5], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 17, attribution: '&copy; OpenStreetMap' }).addTo(map);
    const icon = L.divIcon({ className: 'pin', html: '<span></span>', iconSize: [22, 22], iconAnchor: [11, 11] });
    SEDES.forEach(s => {
      if (s.lat == null) return;
      markers[s.id] = L.marker([s.lat, s.lng], { icon, title: s.nombre, keyboard: false }).addTo(map)
        .bindTooltip(`${s.nombre} · ${s.zona}`, { direction: 'top', offset: [0, -12] });
      markers[s.id].on('click', () => elegir(s.id, false));
    });
    const inicio = L.latLngBounds(SEDES.filter(s => s.lat != null).map(s => [s.lat, s.lng])).extend(PBA_BOUNDS[0]);
    map.fitBounds(inicio, { padding: [24, 24] });
    etiquetaPba = L.tooltip({ permanent: true, direction: 'center', className: 'pba-label' }).setLatLng([-36.6, -60.2]).setContent('Provincia de Buenos Aires · localidad a confirmar');
  }
  const elegir = (id, mover = true) => {
    const s = SEDES.find(x => x.id === id);
    if (!s) return;
    botones.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.sede === id)));
    if (!map) return;
    Object.entries(markers).forEach(([k, m]) => m.getElement()?.classList.toggle('is-on', k === id));
    if (etiquetaPba) { if (id === 'pba') map.openTooltip(etiquetaPba); else map.closeTooltip(etiquetaPba); }
    if (!mover) { markers[id]?.openTooltip(); return; }
    if (s.lat != null) {
      map.flyTo([s.lat, s.lng], 10, { duration: reduceMotion ? 0 : 1.1 });
      setTimeout(() => markers[id]?.openTooltip(), reduceMotion ? 0 : 1150);
    } else {
      map.flyToBounds(PBA_BOUNDS, { duration: reduceMotion ? 0 : 1.1 });
    }
  };
  botones.forEach(b => b.addEventListener('click', () => elegir(b.dataset.sede)));
  if (map) {
    const wrap = el.closest('[data-animate]');
    const ajustar = () => map.invalidateSize();
    window.addEventListener('load', ajustar);
    if (wrap) wrap.addEventListener('transitionend', ajustar, { once: true });
  }
}

function initConsultaForm() {
  const form = document.getElementById('consultaForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = document.getElementById('cNombre');
    const malo = nombre.value.trim().length < 3;
    setError(nombre, document.getElementById('cNombreErr'), malo);
    if (malo) { nombre.focus(); return; }
    const msj = form.mensaje.value.trim();
    const texto = [`Hola, soy ${nombre.value.trim()} (${form.perfil.value}).`, `Tema: ${form.tema.value}.`, `Prefiero: ${form.sede.value}.`]
      .concat(msj ? [msj] : []).join('\n');
    window.open(waLink(texto), '_blank', 'noopener');
    showToast('Abrimos WhatsApp con tu consulta lista para enviar.');
    form.reset();
  });
}

function initFaq() {
  document.querySelectorAll('.faq__item').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

initAsesorias();
initReveals();
initNav();
initHeroMotion();
initModelBarScroll();
initFloats();
initCart();
initCheckout();
initLineaModal();
initSedes();
initConsultaForm();
initFaq();
