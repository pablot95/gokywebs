const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491144445228';

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
const wa = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

function horaArgentina() {
  let ar;
  try { ar = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' })); } catch (e) { ar = new Date(); }
  return isNaN(ar) ? new Date() : ar;
}

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

function initReveals() {
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

function initSalidas() {
  const salidas = document.querySelectorAll('[data-fecha]');
  if (!salidas.length) return;
  const hoy = horaArgentina();
  const hoyClave = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  salidas.forEach(s => {
    if (s.dataset.fecha >= hoyClave) return;
    s.classList.remove('is-abierta');
    s.classList.add('is-realizada');
    const estado = s.querySelector('[data-estado]');
    if (estado) estado.textContent = 'Realizada';
    const label = s.querySelector('.boleto-hero__label');
    if (label) label.textContent = 'Última salida';
    const accion = s.querySelector('[data-accion]');
    if (accion && !accion.classList.contains('btn--linea')) {
      const destino = s.querySelector('.boleto__destino')?.textContent.trim() || 'esa salida';
      accion.textContent = 'Pedí la próxima fecha';
      accion.href = wa(`Hola Alon, ¿cuándo es la próxima salida a ${destino}?`);
      accion.classList.remove('btn--cta');
      accion.classList.add('btn--linea');
    }
  });
}

function initReloj() {
  const reloj = document.getElementById('reloj');
  if (!reloj) return;
  const pintar = () => {
    const ar = horaArgentina();
    reloj.textContent = `${String(ar.getHours()).padStart(2, '0')}:${String(ar.getMinutes()).padStart(2, '0')}`;
  };
  pintar();
  setInterval(pintar, 30000);
}

function initPasaje() {
  const form = document.getElementById('pasaje');
  if (!form) return;
  const mes = form.elements.mes;
  const pax = form.elements.pax;
  const grupo = form.elements.grupo;
  const destino = form.elements.destino;
  const nombre = form.elements.nombre;
  const error = document.getElementById('pNombreError');
  const EJEMPLOS = {
    'Jardín': ['Ej.: Jardín N° 905 de Quilmes', 'Ej.: una granja educativa'],
    'Primaria': ['Ej.: 4° grado de la Escuela N° 12', 'Ej.: el Planetario o Temaikèn'],
    'Egresados': ['Ej.: 6° año del colegio', 'Ej.: el destino que tienen en mente'],
    'Escapada o grupo': ['Ej.: grupo de amigos o del club', 'Ej.: termas, una fiesta o un paseo'],
    'Chárter o micro': ['Ej.: club, empresa o institución', 'Ej.: traslado a un evento o una gira']
  };

  if (mes && mes.options.length < 2) {
    const base = horaArgentina();
    for (let i = 0; i < 14; i++) {
      const d = new Date(base.getFullYear(), base.getMonth() + i, 1);
      const txt = d.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }).replace(' de ', ' ');
      const op = document.createElement('option');
      op.value = op.textContent = txt.charAt(0).toUpperCase() + txt.slice(1);
      mes.appendChild(op);
    }
  }

  const tipo = () => form.querySelector('input[name="tipo"]:checked')?.value || 'Jardín';
  const val = el => (el?.value || '').trim();
  const cantidad = () => {
    const n = parseInt(pax?.value, 10);
    return Number.isFinite(n) ? Math.min(300, Math.max(1, n)) : 1;
  };
  const datos = () => ({
    nombre: val(nombre) || '—',
    tipo: tipo(),
    pax: String(cantidad()),
    mes: val(mes) || 'A definir',
    destino: val(destino) || 'A definir'
  });
  const pintar = () => {
    const d = datos();
    form.querySelectorAll('[data-p]').forEach(el => { el.textContent = d[el.dataset.p] ?? ''; });
    const ej = EJEMPLOS[d.tipo] || EJEMPLOS['Jardín'];
    if (grupo) grupo.placeholder = ej[0];
    if (destino) destino.placeholder = ej[1];
  };
  const mostrarError = si => {
    if (!nombre) return;
    if (si) { nombre.setAttribute('aria-invalid', 'true'); error?.removeAttribute('hidden'); }
    else { nombre.removeAttribute('aria-invalid'); error?.setAttribute('hidden', ''); }
  };

  form.querySelectorAll('[data-pax]').forEach(b => b.addEventListener('click', () => {
    pax.value = String(Math.min(300, Math.max(1, cantidad() + Number(b.dataset.pax))));
    pintar();
  }));
  pax?.addEventListener('blur', () => { pax.value = String(cantidad()); pintar(); });
  form.addEventListener('input', e => {
    if (e.target === nombre && val(nombre)) mostrarError(false);
    pintar();
  });
  form.addEventListener('change', pintar);
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!val(nombre)) {
      mostrarError(true);
      nombre.focus();
      showToast('Dejanos tu nombre para armar el mensaje');
      return;
    }
    const d = datos();
    const msg = [
      'Hola Alon, quiero pedir un presupuesto.',
      `Viaje: ${d.tipo}`,
      `Escuela o grupo: ${val(grupo) || 'a definir'}`,
      `Pasajeros: ${d.pax}`,
      `Destino o idea: ${val(destino) || 'a definir'}`,
      `Para cuándo: ${d.mes}`,
      `Mi nombre: ${val(nombre)}`
    ].join('\n');
    window.open(wa(msg), '_blank', 'noopener');
    showToast('Abrimos WhatsApp con tu pasaje armado');
  });
  pintar();
}

function initHorario() {
  const estado = document.getElementById('estado');
  const txt = document.getElementById('estadoTxt');
  if (!estado || !txt) return;
  const HORARIO = { 0: null, 1: [9, 18], 2: [9, 18], 3: [9, 18], 4: [9, 18], 5: [9, 18], 6: [9, 13] };
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const pintar = () => {
    const ar = horaArgentina();
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
  const puntos = [
    { pos: [-34.7584, -58.2743], nombre: 'Jumbo Calchaquí', zona: 'Quilmes Oeste', n: 1, clase: '' },
    { pos: [-34.7790, -58.2634], nombre: 'Cruce Varela', zona: 'Florencio Varela', n: 2, clase: ' pin--rojo' }
  ];
  const mapa = L.map(el, { center: [-34.7687, -58.2689], zoom: 13, scrollWheelZoom: false, zoomControl: false });
  L.control.zoom({ position: 'topright' }).addTo(mapa);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  puntos.forEach(p => {
    const icono = L.divIcon({ className: `pin${p.clase}`, html: `<span><b>${p.n}</b></span>`, iconSize: [30, 30], iconAnchor: [15, 30] });
    L.marker(p.pos, { icon: icono, keyboard: false, title: `Punto de encuentro: ${p.nombre}` })
      .bindTooltip(`${p.nombre} · ${p.zona}`, { direction: 'top', offset: [0, -30] })
      .addTo(mapa);
  });
  const limites = L.latLngBounds(puntos.map(p => p.pos));
  const encuadrar = () => {
    const m2 = document.body.classList.contains('m2');
    const ancho = window.innerWidth > 900;
    const panel = m2 ? (el.parentElement.querySelector('.info__texto')?.offsetHeight || 0) : 0;
    const pad = !m2 ? { padding: [36, 36] } : ancho
      ? { paddingTopLeft: [420, 60], paddingBottomRight: [380, 60] }
      : { paddingTopLeft: [36, 36], paddingBottomRight: [36, panel + 40] };
    mapa.invalidateSize();
    mapa.fitBounds(limites, { ...pad, maxZoom: 13, animate: false });
  };
  encuadrar();
  window.addEventListener('load', encuadrar);
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 901px)');
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

[initSalidas, initReloj, initPasaje, initHorario, initMapa, initHeroMotion, initReveals, initNav, initWspFloat, initModelBarScroll]
  .forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
