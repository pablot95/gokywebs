const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA_NUMERO = '5491131044085';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const clamp01 = v => Math.max(0, Math.min(1, v));

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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 981px)');
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

function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const sync = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

let revealsListos = false;
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
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('.hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.recorrido li'), { x: -18, opacity: 0, duration: 0.9, stagger: 0.1, clearProps: 'transform,opacity' }, 0.75);
}

function initEscena() {
  const track = document.querySelector('[data-escena]');
  if (!track) return;
  const escena = track.closest('.escena');
  const stage = track.querySelector('.escena-stage');
  const copyA = stage?.querySelector('[data-copy-a]');
  if (!stage || !copyA) return;
  if (reduceMotion) { escena.classList.add('is-static'); return; }
  const mq = window.matchMedia('(max-width: 860px)');
  const suave = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  let frame = 0;
  const angulo = () => {
    const h = stage.clientHeight || 1;
    stage.style.setProperty('--ang', `${Math.atan2(120, h)}rad`);
  };
  const pintar = p => {
    const w = 108 - 116 * suave(clamp01((p - 0.05) / 0.75));
    stage.style.setProperty('--w', w.toFixed(2));
    const a = clamp01((w - (mq.matches ? 46 : 44)) / 12);
    copyA.style.opacity = a.toFixed(3);
    copyA.style.pointerEvents = a < 0.15 ? 'none' : '';
    stage.classList.toggle('is-fuera', w > 104 || w < -4);
  };
  const update = () => {
    frame = 0;
    const r = track.getBoundingClientRect();
    const total = r.height - stage.offsetHeight;
    const top = parseFloat(getComputedStyle(stage).top) || 0;
    pintar(total > 0 ? clamp01((top - r.top) / total) : 0);
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  window.addEventListener('resize', () => { angulo(); update(); }, { passive: true });
  angulo();
  update();
}

function initCoordina() {
  const form = document.getElementById('viajeForm');
  if (!form) return;
  const $ = id => document.getElementById(id);
  const campos = { evento: $('f-evento'), fecha: $('f-fecha'), hora: $('f-hora'), salida: $('f-salida'), nombre: $('f-nombre'), iv: $('f-iv') };
  const out = $('paxOut');
  const menos = $('paxMenos');
  const mas = $('paxMas');
  const pase = document.querySelector('.pase');
  const vuelta = pase?.querySelector('[data-tramo-vuelta]');
  const MIN = 1;
  const MAX = 50;
  let pax = 2;

  const hoy = new Date();
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  if (campos.fecha) campos.fecha.min = iso(hoy);

  const fechaLarga = v => {
    if (!v) return '';
    const [y, m, d] = v.split('-').map(Number);
    if (!y || !m || !d) return '';
    const txt = new Date(y, m - 1, d).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    return txt.charAt(0).toUpperCase() + txt.slice(1);
  };
  const paxTxt = n => `${n} ${n === 1 ? 'pasajero' : 'pasajeros'}`;

  const vacios = { evento: 'Contanos a dónde van', fecha: 'Elegí el día', salida: 'Desde dónde salen' };
  const pintarPase = () => {
    if (!pase) return;
    const valores = {
      evento: campos.evento?.value.trim(),
      fecha: [fechaLarga(campos.fecha?.value), campos.hora?.value ? `${campos.hora.value} h aprox.` : ''].filter(Boolean).join(' · '),
      salida: campos.salida?.value.trim(),
    };
    Object.entries(valores).forEach(([k, v]) => {
      const dd = pase.querySelector(`[data-pase="${k}"]`);
      if (!dd) return;
      dd.textContent = v || vacios[k];
      dd.classList.toggle('vacio', !v);
    });
    const dp = pase.querySelector('[data-pase="pasajeros"]');
    if (dp) dp.textContent = paxTxt(pax);
    const iv = campos.iv?.checked;
    vuelta?.classList.toggle('off', !iv);
    const nota = pase.querySelector('[data-pase="nota"]');
    if (nota) nota.textContent = iv ? 'Lo confirmamos por WhatsApp con el horario y el precio.' : 'Un solo tramo: en el mensaje nos contás si es la ida o la vuelta.';
  };

  const pintarPax = () => {
    if (out) out.textContent = String(pax);
    if (menos) menos.disabled = pax <= MIN;
    if (mas) mas.disabled = pax >= MAX;
    pintarPase();
  };
  menos?.addEventListener('click', () => { pax = Math.max(MIN, pax - 1); pintarPax(); });
  mas?.addEventListener('click', () => { pax = Math.min(MAX, pax + 1); pintarPax(); });

  const requeridos = [
    [campos.evento, 'Contanos qué evento es o a dónde van.'],
    [campos.fecha, 'Elegí la fecha del viaje.'],
    [campos.salida, 'Decinos desde qué barrio o dirección salen.'],
  ];
  const marcar = (input, msg) => {
    const err = document.getElementById(`${input.id}-err`);
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      if (err) { err.textContent = msg; err.hidden = false; }
    } else {
      input.removeAttribute('aria-invalid');
      if (err) { err.textContent = ''; err.hidden = true; }
    }
  };

  form.addEventListener('input', e => {
    if (e.target.getAttribute('aria-invalid') === 'true' && e.target.value.trim()) marcar(e.target, '');
    pintarPase();
  });
  form.addEventListener('change', pintarPase);

  form.addEventListener('submit', e => {
    e.preventDefault();
    let primero = null;
    requeridos.forEach(([input, msg]) => {
      if (!input) return;
      const ok = input.value.trim() !== '' && (input.type !== 'date' || input.value >= input.min);
      marcar(input, ok ? '' : (input.type === 'date' && input.value ? 'Elegí una fecha de hoy en adelante.' : msg));
      if (!ok && !primero) primero = input;
    });
    if (primero) {
      primero.focus();
      showToast('Nos faltan un par de datos del viaje para armar la consulta.');
      return;
    }
    const lineas = [
      '¡Hola Avánti! Quiero coordinar un traslado.',
      `• Evento o destino: ${campos.evento.value.trim()}`,
      `• Fecha: ${fechaLarga(campos.fecha.value)}${campos.hora?.value ? ` · ${campos.hora.value} h aprox.` : ''}`,
      `• Salida desde: ${campos.salida.value.trim()}`,
      `• Pasajeros: ${pax}`,
      `• Tramo: ${campos.iv?.checked ? 'ida y vuelta' : 'un solo tramo (te cuento cuál)'}`,
    ];
    const nombre = campos.nombre?.value.trim();
    if (nombre) lineas.push(`Soy ${nombre}.`);
    const url = `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(lineas.join('\n'))}`;
    const btn = form.querySelector('button[type="submit"]');
    const label = btn?.querySelector('span');
    const original = label?.textContent;
    if (btn) btn.disabled = true;
    if (label) label.textContent = 'Abriendo WhatsApp…';
    setTimeout(() => {
      window.open(url, '_blank', 'noopener');
      if (btn) btn.disabled = false;
      if (label) label.textContent = original;
      showToast('Listo: te abrimos WhatsApp con la consulta armada.');
    }, 600);
  });

  pintarPax();
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

initNav();
initHeader();
initEscena();
initCoordina();
initReveals();
initHeroMotion();
initWspFloat();
initModelBarScroll();
