const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491168862313';

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

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

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
      scrollTrigger: { trigger: el.closest('.hero__foto') || el, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
}

function initGaleria() {
  const lista = document.getElementById('obras');
  if (!lista) return;
  const items = [...lista.querySelectorAll('.obra')];
  const filtros = document.querySelectorAll('.filtro');
  filtros.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filtro;
    filtros.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    items.forEach(it => { it.hidden = f !== 'todos' && it.dataset.cat !== f; });
    if (lista.scrollLeft) lista.scrollLeft = 0;
    revelarNuevos(lista);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));

  const visor = document.getElementById('visor');
  if (!visor) return;
  const img = document.getElementById('visorImg');
  const pie = document.getElementById('visorPie');
  const botones = [...visor.querySelectorAll('button')];
  let actual = 0;
  let ultimoFoco = null;
  const visibles = () => items.filter(it => !it.hidden);
  const mostrar = i => {
    const vis = visibles();
    if (!vis.length) return;
    actual = (i + vis.length) % vis.length;
    const it = vis[actual];
    const mini = it.querySelector('img');
    img.src = it.querySelector('.obra__btn')?.dataset.grande || mini?.src || '';
    img.alt = mini?.alt || '';
    img.setAttribute('width', mini?.getAttribute('width') || '640');
    img.setAttribute('height', mini?.getAttribute('height') || '640');
    const cat = it.querySelector('.obra__cat')?.textContent || '';
    const txt = it.querySelector('.obra__txt')?.textContent || '';
    pie.textContent = `${cat} · ${txt} (${actual + 1}/${vis.length})`;
  };
  const abrir = i => {
    ultimoFoco = document.activeElement;
    mostrar(i);
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    visor.querySelector('.visor__btn--cerrar')?.focus();
  };
  const cerrar = () => {
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    ultimoFoco?.focus?.();
  };
  items.forEach(it => it.querySelector('.obra__btn')?.addEventListener('click', e => {
    if (lista.dataset.arrastrado) { e.preventDefault(); return; }
    abrir(visibles().indexOf(it));
  }));
  visor.querySelectorAll('[data-cerrar]').forEach(el => el.addEventListener('click', cerrar));
  visor.querySelector('.visor__btn--prev')?.addEventListener('click', () => mostrar(actual - 1));
  visor.querySelector('.visor__btn--next')?.addEventListener('click', () => mostrar(actual + 1));
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'ArrowRight') mostrar(actual + 1);
    else if (e.key === 'ArrowLeft') mostrar(actual - 1);
    else if (e.key === 'Tab') {
      const i = botones.indexOf(document.activeElement);
      e.preventDefault();
      botones[(i + (e.shiftKey ? -1 : 1) + botones.length) % botones.length].focus();
    }
  });
}

function initRail() {
  const rail = document.querySelector('body.m2 .obras');
  if (!rail) return;
  const paso = () => (rail.querySelector('.obra:not([hidden])')?.getBoundingClientRect().width || 300) + 16;
  document.querySelectorAll('[data-riel]').forEach(b => b.addEventListener('click', () => {
    rail.scrollBy({ left: (b.dataset.riel === 'next' ? 1 : -1) * paso(), behavior: reduceMotion ? 'auto' : 'smooth' });
  }));
  let abajo = false;
  let movido = false;
  let inicioX = 0;
  let inicioScroll = 0;
  rail.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    abajo = true;
    movido = false;
    inicioX = e.clientX;
    inicioScroll = rail.scrollLeft;
  });
  window.addEventListener('pointermove', e => {
    if (!abajo) return;
    const dx = e.clientX - inicioX;
    if (!movido && Math.abs(dx) > 6) { movido = true; rail.classList.add('dragging'); rail.dataset.arrastrado = '1'; }
    if (movido) rail.scrollLeft = inicioScroll - dx;
  });
  window.addEventListener('pointerup', e => {
    if (!abajo) return;
    abajo = false;
    if (!movido) return;
    const dx = e.clientX - inicioX;
    const base = rail.getBoundingClientRect().left;
    const posiciones = [...rail.querySelectorAll('.obra:not([hidden])')].map(c => rail.scrollLeft + c.getBoundingClientRect().left - base);
    let destino = null;
    if (dx < -60) destino = posiciones.find(p => p > inicioScroll + 4);
    else if (dx > 60) destino = [...posiciones].reverse().find(p => p < inicioScroll - 4);
    if (destino == null) destino = posiciones.reduce((a, p) => (Math.abs(p - rail.scrollLeft) < Math.abs(a - rail.scrollLeft) ? p : a), posiciones[0] || 0);
    rail.scrollTo({ left: destino, behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(() => { delete rail.dataset.arrastrado; }, 80);
    setTimeout(() => rail.classList.remove('dragging'), 520);
  });
}

function initPresupuesto() {
  const form = document.getElementById('rotulo');
  if (!form) return;
  const salida = document.getElementById('mensajeTexto');
  const carga = form.elements.carga;
  const fecha = form.elements.fecha;
  const ejemplos = { Flete: 'Ej.: heladera y lavarropas', Mudanza: 'Ej.: departamento de 2 ambientes', Reparto: 'Ej.: 12 cajas para 3 comercios' };
  const hoy = new Date();
  if (fecha) fecha.min = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  const valor = n => (form.elements[n]?.value || '').trim();
  const elegido = n => form.querySelector(`input[name="${n}"]:checked`)?.value || '';
  const fmtFecha = v => {
    if (!v) return 'a definir';
    const [a, m, d] = v.split('-');
    return `${d}/${m}/${a}`;
  };
  const mensaje = () => [
    'Hola Deloflet, quiero pedir un presupuesto.',
    `Servicio: ${elegido('servicio') || 'Flete'}`,
    `Desde: ${valor('desde') || '—'}`,
    `Hasta: ${valor('hasta') || '—'}`,
    `Qué hay que llevar: ${valor('carga') || 'te cuento por acá'}`,
    `Fecha: ${fmtFecha(valor('fecha'))}`,
    `Peón: ${(elegido('peon') || 'A definir').toLowerCase()}`
  ].join('\n');
  const pintar = () => {
    if (salida) salida.textContent = mensaje();
    if (carga) carga.placeholder = ejemplos[elegido('servicio')] || ejemplos.Mudanza;
  };
  const mostrarError = (input, si) => {
    const err = document.getElementById(input.getAttribute('aria-describedby'));
    if (si) { input.setAttribute('aria-invalid', 'true'); err?.removeAttribute('hidden'); }
    else { input.removeAttribute('aria-invalid'); err?.setAttribute('hidden', ''); }
  };
  form.addEventListener('input', e => {
    if (e.target.matches('[aria-invalid="true"]') && e.target.value.trim()) mostrarError(e.target, false);
    pintar();
  });
  form.addEventListener('change', pintar);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const faltan = ['desde', 'hasta'].map(n => form.elements[n]).filter(i => i && !i.value.trim());
    ['desde', 'hasta'].forEach(n => form.elements[n] && mostrarError(form.elements[n], faltan.includes(form.elements[n])));
    if (faltan.length) {
      faltan[0].focus();
      showToast('Completá desde dónde y hasta dónde va la carga');
      return;
    }
    window.open(`https://wa.me/${WSP}?text=${encodeURIComponent(mensaje())}`, '_blank', 'noopener');
    showToast('Abrimos WhatsApp con tu pedido armado');
  });
  document.querySelectorAll('[data-servicio]').forEach(a => a.addEventListener('click', () => {
    const r = form.querySelector(`input[name="servicio"][value="${a.dataset.servicio}"]`);
    if (r) { r.checked = true; pintar(); }
  }));
  pintar();
}

function initHorario() {
  const estado = document.getElementById('estado');
  const txt = document.getElementById('estadoTxt');
  if (!estado || !txt) return;
  const HORARIO = { 0: null, 1: [8, 18], 2: [8, 18], 3: [8, 18], 4: [8, 18], 5: [8, 18], 6: [8, 13] };
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const pintar = () => {
    let ar;
    try { ar = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' })); } catch (e) { ar = new Date(); }
    if (isNaN(ar)) ar = new Date();
    const d = ar.getDay();
    const h = ar.getHours() + ar.getMinutes() / 60;
    const hoy = HORARIO[d];
    document.querySelectorAll('[data-dias]').forEach(f => f.classList.toggle('is-hoy', f.dataset.dias.split(',').includes(String(d))));
    if (hoy && h >= hoy[0] && h < hoy[1]) {
      estado.classList.add('is-abierto');
      txt.textContent = `Abierto ahora · hasta las ${hoy[1]} h`;
      return;
    }
    estado.classList.remove('is-abierto');
    if (hoy && h < hoy[0]) { txt.textContent = `Cerrado ahora · abre hoy a las ${hoy[0]} h`; return; }
    for (let i = 1; i <= 7; i++) {
      const dd = (d + i) % 7;
      if (HORARIO[dd]) {
        txt.textContent = `Cerrado ahora · abre ${i === 1 ? 'mañana' : 'el ' + DIAS[dd]} a las ${HORARIO[dd][0]} h`;
        return;
      }
    }
  };
  pintar();
  setInterval(pintar, 60000);
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = [-34.6037, -58.3816];
  const mapa = L.map(el, { center: centro, zoom: 11, scrollWheelZoom: false });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  const icono = L.divIcon({ className: 'pin', html: '<span></span>', iconSize: [34, 34], iconAnchor: [17, 34] });
  L.marker(centro, { icon: icono, keyboard: false, title: 'Deloflet · Buenos Aires' }).addTo(mapa);
  const correr = () => {
    if (!document.body.classList.contains('m2') || window.innerWidth <= 860) return;
    mapa.setView(centro, 11, { animate: false });
    mapa.panBy([-Math.min(260, window.innerWidth * 0.18), 0], { animate: false });
  };
  correr();
  window.addEventListener('load', () => { mapa.invalidateSize(); correr(); });
}

function initFaq() {
  document.querySelectorAll('.faq details').forEach(d => d.addEventListener('toggle', () => {
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

[initGaleria, initRail, initPresupuesto, initHorario, initMapa, initFaq, initHeroMotion, initParallax, initReveals, initNav, initWspFloat, initModelBarScroll]
  .forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
