'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

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

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const mq = window.matchMedia('(min-width: 901px)');
  const syncDesktop = () => { if (mq.matches) nav.removeAttribute('inert'); else if (!nav.classList.contains('open')) nav.setAttribute('inert', ''); };
  mq.addEventListener?.('change', syncDesktop);
  syncDesktop();
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!mq.matches) nav.setAttribute('inert', '');
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
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initReveals() {
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

/* ---------- Reservas ---------- */
const HUESPEDES = {
  cabana: ['1', '2', '3', '4', '5', '6'],
  camping: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'más de 10'],
};
const TIPO_LABEL = { cabana: 'una cabaña', camping: 'un lugar en el camping' };

function formatearFecha(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  if (!y || !m || !d) return '';
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}

function validarReserva(datos) {
  if (!datos.llegada || !datos.salida) return 'Elegí las fechas de llegada y salida.';
  if (datos.salida <= datos.llegada) return 'La salida tiene que ser después de la llegada.';
  return '';
}

function componerMensajeReserva(datos) {
  const quien = datos.nombre ? ` Soy ${datos.nombre}.` : '';
  return `¡Hola Sierras del Chapá! Quiero reservar ${TIPO_LABEL[datos.tipo] || 'una estadía'} del ${formatearFecha(datos.llegada)} al ${formatearFecha(datos.salida)} para ${datos.huespedes} ${datos.huespedes === '1' ? 'persona' : 'personas'}.${quien} ¿Tienen disponibilidad?`;
}

function initReservas() {
  const form = document.getElementById('resForm');
  if (!form) return;
  const tipoWrap = document.getElementById('resTipo');
  const pills = $$('.tipo-pill', tipoWrap);
  const selHuespedes = document.getElementById('fHuespedes');
  const llegada = document.getElementById('fLlegada');
  const salida = document.getElementById('fSalida');
  const errorEl = document.getElementById('resError');

  const hoy = new Date();
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  llegada.min = iso(hoy);
  salida.min = iso(hoy);

  const getTipo = () => form.querySelector('input[name="tipo"]:checked')?.value || 'cabana';
  const syncTipo = () => {
    const tipo = getTipo();
    pills.forEach(p => p.classList.toggle('is-active', p.dataset.tipo === tipo));
    form.classList.toggle('tipo-camping', tipo === 'camping');
    const actual = selHuespedes.value;
    selHuespedes.innerHTML = HUESPEDES[tipo].map(n => `<option value="${n}">${n === '1' ? '1 persona' : `${n} personas`}</option>`).join('');
    if (HUESPEDES[tipo].includes(actual)) selHuespedes.value = actual;
  };
  pills.forEach(p => p.querySelector('input')?.addEventListener('change', syncTipo));
  syncTipo();

  llegada.addEventListener('change', () => {
    if (llegada.value) {
      salida.min = llegada.value;
      if (salida.value && salida.value <= llegada.value) salida.value = '';
    }
  });

  $$('[data-reserva-tipo]').forEach(a => {
    a.addEventListener('click', () => {
      const input = form.querySelector(`input[name="tipo"][value="${a.dataset.reservaTipo}"]`);
      if (input) { input.checked = true; syncTipo(); }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const datos = {
      tipo: getTipo(),
      llegada: llegada.value,
      salida: salida.value,
      huespedes: selHuespedes.value,
      nombre: document.getElementById('fNombre').value.trim(),
    };
    const error = validarReserva(datos);
    [llegada, salida].forEach(i => i.classList.remove('invalid'));
    if (error) {
      errorEl.textContent = error;
      errorEl.hidden = false;
      if (!datos.llegada) llegada.classList.add('invalid');
      if (!datos.salida || (datos.llegada && datos.salida <= datos.llegada)) salida.classList.add('invalid');
      return;
    }
    errorEl.hidden = true;
    const url = `https://wa.me/5493764272978?text=${encodeURIComponent(componerMensajeReserva(datos))}`;
    window.open(url, '_blank', 'noopener');
    showToast('¡Listo! Tu pedido de reserva se abre en WhatsApp.');
  });
}

/* ---------- Capítulo "Tu día en el Chapá" ---------- */
function initDia() {
  const seccion = $('.dia');
  const stage = document.getElementById('diaStage');
  const pin = document.getElementById('diaPin');
  const momentos = $$('.momento', stage || undefined);
  if (!seccion || !stage || !pin || !momentos.length) return;

  const setStep = idx => {
    momentos.forEach(m => m.classList.toggle('is-on', +m.dataset.idx === idx));
  };

  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    seccion.classList.add('is-static');
    momentos.forEach(m => m.classList.add('is-on'));
    return;
  }

  const sun = document.getElementById('diaSun');
  const moon = document.getElementById('diaMoon');
  const stars = $('.dia-stars');
  const cielos = ['#bfe0ff', '#8ecdf7', '#ffd9a0', '#0b1d3a'];

  const colocarAstro = (el, t, alturaBase) => {
    const w = pin.clientWidth, h = pin.clientHeight;
    const x = (0.06 + 0.86 * t) * w;
    const y = alturaBase * h - Math.sin(Math.PI * t) * h * 0.30;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const p = self.progress;
        setStep(Math.min(3, Math.floor(p * 4)));
        const pSol = Math.min(1, p / 0.78);
        colocarAstro(sun, pSol, 0.42);
        sun.style.opacity = p < 0.72 ? '1' : String(Math.max(0, 1 - (p - 0.72) / 0.08));
        const pLuna = Math.max(0, (p - 0.76) / 0.24);
        colocarAstro(moon, 0.25 + pLuna * 0.3, 0.4);
        moon.style.opacity = String(Math.min(1, pLuna * 1.6));
        stars.style.opacity = String(Math.max(0, (p - 0.75) / 0.2));
        const tramo = Math.min(2.999, p * 3);
        const i = Math.floor(tramo);
        pin.style.background = gsap.utils.interpolate(cielos[i], cielos[i + 1], tramo - i);
        const oscuro = p > 0.72;
        pin.classList.toggle('is-night', oscuro);
      },
    },
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* ---------- Motion general ---------- */
function initMotion() {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
    return;
  }
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (reduceMotion) return;

  const heroImg = $('.hero-bg img');
  if (heroImg) gsap.fromTo(heroImg, { scale: 1.08 }, { scale: 1, duration: 1.4, ease: 'expo.out' });
  const heroSun = document.getElementById('heroSun');
  if (heroSun) gsap.fromTo(heroSun, { y: 90, opacity: 0 }, { y: 0, opacity: .9, duration: 1.6, ease: 'expo.out', delay: .2 });

  if (typeof ScrollTrigger === 'undefined') return;

  const progress = $('.scroll-progress');
  if (progress) {
    gsap.to(progress, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });
  }
  if (heroImg) {
    gsap.to(heroImg, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 } });
  }
  const seamCarpa = document.getElementById('seamCarpa');
  if (seamCarpa) {
    gsap.fromTo(seamCarpa, { y: 46, rotate: -2 }, {
      y: -28, rotate: 2, ease: 'none',
      scrollTrigger: { trigger: '.servicios', start: 'bottom 95%', end: 'bottom 25%', scrub: .7 },
    });
  }
  const cierreImg = $('.cierre-bg img');
  if (cierreImg) {
    gsap.fromTo(cierreImg, { scale: 1.12 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.cierre', start: 'top bottom', end: 'bottom top', scrub: .8 },
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
}

initNav();
initWspFloat();
initReveals();
initReservas();
initDia();
initMotion();
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
