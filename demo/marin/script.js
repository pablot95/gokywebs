const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493541212272';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const waLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

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
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')].filter(el => el.getClientRects().length);
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
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    gsap.fromTo(el, { yPercent: -3 }, {
      yPercent: 3,
      ease: 'none',
      scrollTrigger: { trigger: el.closest('.hero') || el, start: 'top top', end: 'bottom top', scrub: true }
    });
  });
}

function trapFoco(cont, e) {
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const i = f.indexOf(document.activeElement);
  if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
  else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
}

function initServicioModal() {
  const modal = document.getElementById('servicioModal');
  const cuerpo = document.getElementById('servicioModalCuerpo');
  if (!modal || !cuerpo) return;
  const panel = modal.querySelector('.modal__panel');
  let ultimo = null;
  const abrir = (id, origen) => {
    const fuente = document.getElementById(`detalle-${id}`);
    if (!fuente) return;
    ultimo = origen || document.activeElement;
    cuerpo.innerHTML = fuente.innerHTML;
    const fotos = cuerpo.querySelector('.detalle__fotos');
    if (fotos?.dataset.f1) {
      const d = fotos.dataset;
      fotos.innerHTML = `<figure class="detalle__f1"><img src="${esc(d.f1)}" alt="${esc(d.a1)}" width="1254" height="1254"></figure><figure class="detalle__f2"><img src="${esc(d.f2)}" alt="${esc(d.a2)}" width="${esc(d.w2)}" height="${esc(d.h2)}"></figure>`;
    }
    const titulo = cuerpo.querySelector('h3')?.textContent || 'Detalle del servicio';
    modal.setAttribute('aria-label', titulo);
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    modal.querySelector('.modal__cerrar')?.focus();
  };
  const cerrar = () => {
    modal.hidden = true;
    cuerpo.innerHTML = '';
    document.body.classList.remove('no-scroll');
    ultimo?.focus?.();
  };
  document.querySelectorAll('[data-servicio]').forEach(b => b.addEventListener('click', () => abrir(b.dataset.servicio, b)));
  modal.querySelectorAll('[data-cerrar]').forEach(el => el.addEventListener('click', cerrar));
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'Tab') trapFoco(panel, e);
  });
}

function initTabs() {
  const lista = document.querySelector('.tabs__lista');
  if (!lista) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const elegir = (tab, foco) => {
    tabs.forEach(t => {
      const activo = t === tab;
      t.setAttribute('aria-selected', String(activo));
      t.tabIndex = activo ? 0 : -1;
      const p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !activo;
    });
    if (foco) tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
    revelarNuevos(document.getElementById(tab.getAttribute('aria-controls')));
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach(t => t.addEventListener('click', () => elegir(t, false)));
  lista.addEventListener('keydown', e => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let n = null;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = tabs.length - 1;
    if (n === null) return;
    e.preventDefault();
    elegir(tabs[n], true);
  });
}

function initPedido() {
  const form = document.getElementById('pedidoForm');
  if (!form) return;
  const $ = id => document.getElementById(id);
  const enviar = $('pedidoEnviar');
  const campo = n => form.querySelector(`[name="${n}"]`);
  const OTRA = 'Otra localidad del camino';
  const TIPOS = {
    'Encomienda o paquete': { tamano: true, ph: 'Ej.: una caja de 40 × 30 cm con ropa' },
    'Trámite': { tamano: false, ph: 'Ej.: retirar un certificado en una oficina del centro' },
    'Pago': { tamano: false, ph: 'Ej.: pagar la factura de la luz' },
    'Retiro de compra': { tamano: true, ph: 'Ej.: un pedido ya pagado en un local del centro' },
    'Carga': { tamano: true, ph: 'Ej.: 6 bultos de mercadería para un comercio' }
  };
  const hoy = new Date();
  const dd = n => String(n).padStart(2, '0');
  $('rFecha').textContent = `Hoy, ${dd(hoy.getDate())}/${dd(hoy.getMonth() + 1)}`;
  campo('fecha').min = `${hoy.getFullYear()}-${dd(hoy.getMonth() + 1)}-${dd(hoy.getDate())}`;
  const elegido = n => form.querySelector(`input[name="${n}"]:checked`)?.value || '';
  const valor = n => (campo(n)?.value || '').trim();
  const lugar = n => {
    const v = valor(n);
    return v === OTRA ? (valor('otra') || 'otra localidad') : v;
  };
  const cuando = () => {
    const c = elegido('cuando');
    if (c !== 'Elijo el día') return c;
    const f = valor('fecha');
    if (!f) return 'Día a definir';
    const [a, m, d] = f.split('-');
    return `El ${d}/${m}/${a}`;
  };
  const mensaje = () => {
    const tipo = elegido('tipo');
    const desde = lugar('desde');
    const hasta = lugar('hasta');
    const lineas = ['Hola marín, quiero pedir un retiro.', `Servicio: ${tipo}`];
    lineas.push(desde === hasta ? `Recorrido: dentro de ${desde}` : `Recorrido: de ${desde} a ${hasta}`);
    if (TIPOS[tipo]?.tamano) lineas.push(`Tamaño: ${elegido('tamano')}`);
    lineas.push(`Detalle: ${valor('detalle') || 'te cuento por acá'}`);
    lineas.push(`Para cuándo: ${cuando()}`);
    return lineas.join('\n');
  };
  const pintar = () => {
    const tipo = elegido('tipo');
    const conTamano = !!TIPOS[tipo]?.tamano;
    const hayOtra = valor('desde') === OTRA || valor('hasta') === OTRA;
    $('otraWrap').hidden = !hayOtra;
    $('tamanoWrap').hidden = !conTamano;
    $('rTamanoFila').hidden = !conTamano;
    $('fechaWrap').hidden = elegido('cuando') !== 'Elijo el día';
    campo('detalle').placeholder = TIPOS[tipo]?.ph || '';
    const desde = lugar('desde');
    const hasta = lugar('hasta');
    $('rDesde').textContent = desde;
    $('rHasta').textContent = hasta;
    $('rTramo').textContent = desde === hasta ? `dentro de ${desde}` : 'puerta a puerta';
    $('rTipo').textContent = tipo;
    $('rTamano').textContent = elegido('tamano');
    $('rDetalle').textContent = valor('detalle') || 'Lo cuento por WhatsApp';
    $('rCuando').textContent = cuando();
    enviar.href = waLink(mensaje());
  };
  const marcar = (input, errId, mal) => {
    const err = $(errId);
    if (mal) { input.setAttribute('aria-invalid', 'true'); err.hidden = false; }
    else { input.removeAttribute('aria-invalid'); err.hidden = true; }
  };
  form.addEventListener('input', e => {
    if (e.target.name === 'otra' && e.target.value.trim()) marcar(e.target, 'otraError', false);
    if (e.target.name === 'fecha' && e.target.value) marcar(e.target, 'fechaError', false);
    pintar();
  });
  form.addEventListener('change', pintar);
  $('pedidoSwap')?.addEventListener('click', e => {
    const d = campo('desde').value;
    campo('desde').value = campo('hasta').value;
    campo('hasta').value = d;
    e.currentTarget.classList.toggle('girar');
    pintar();
  });
  enviar.addEventListener('click', e => {
    const otra = campo('otra');
    const fecha = campo('fecha');
    if (!$('otraWrap').hidden && !otra.value.trim()) {
      e.preventDefault();
      marcar(otra, 'otraError', true);
      otra.focus();
      showToast('Contanos qué localidad es y armamos el mensaje');
      return;
    }
    if (!$('fechaWrap').hidden && !fecha.value) {
      e.preventDefault();
      marcar(fecha, 'fechaError', true);
      fecha.focus();
      showToast('Elegí el día del retiro');
      return;
    }
    enviar.href = waLink(mensaje());
    showToast('Abrimos WhatsApp con tu pedido listo');
  });
  pintar();
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const base = [-31.2448363, -64.4607123];
  const cba = [-31.4167, -64.1833];
  const mapa = L.map(el, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  const pin = cls => L.divIcon({ className: `pin ${cls}`, html: '<span></span>', iconSize: [34, 34], iconAnchor: [17, 34], tooltipAnchor: [0, -34] });
  L.polyline([base, cba], { color: '#3E7A22', weight: 3, dashArray: '8 10', opacity: .85 }).addTo(mapa);
  L.marker(base, { icon: pin(''), keyboard: false, title: 'marín · Japón 1081, Cosquín' }).addTo(mapa)
    .bindTooltip('Cosquín · Japón 1081', { permanent: true, direction: 'top', className: 'etiqueta' });
  L.marker(cba, { icon: pin('pin--b'), keyboard: false, title: 'Córdoba capital' }).addTo(mapa)
    .bindTooltip('Córdoba capital', { permanent: true, direction: 'top', className: 'etiqueta' });
  const encuadrar = () => {
    const ancho = document.body.classList.contains('m2') && window.innerWidth > 860;
    mapa.fitBounds(L.latLngBounds([base, cba]), { paddingTopLeft: [60, 84], paddingBottomRight: ancho ? [60, 190] : [60, 36], animate: false });
  };
  encuadrar();
  window.addEventListener('load', () => { mapa.invalidateSize(); encuadrar(); });
}

function initFaq() {
  document.querySelectorAll('.faq__item').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
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

[initServicioModal, initTabs, initPedido, initMapa, initFaq, initHeroMotion, initParallax, initReveals, initNav, initWspFloat, initModelBarScroll]
  .forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
