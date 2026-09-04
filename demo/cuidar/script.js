document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491167134135';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const PLANES = [
  {
    id: 'acompanamiento',
    nombre: 'Acompañamiento por horas',
    resumen: 'Alguien que llega, sostiene la rutina del día y se queda las horas que hagan falta.',
    incluye: [
      'Compañía, conversación y juegos de mesa',
      'Rutina sostenida: comidas a horario y siesta',
      'Paseos por el barrio y salidas cortas',
      'Recordatorio de la medicación del turno',
    ],
    regimen: ['3 a 6 horas por día', 'Los días que elijas', 'Mañana o tarde'],
    perfil: { ayuda: ['autonomo'], cuando: ['horas', 'jornada'] },
  },
  {
    id: 'asistido',
    nombre: 'Cuidado asistido',
    resumen: 'Para cuando ya no alcanza con la compañía y hace falta ayuda con el cuerpo.',
    incluye: [
      'Higiene, baño asistido y cambio de ropa',
      'Traslados y movilidad dentro de la casa',
      'Medicación en horario y control de presión',
      'Comidas preparadas y acompañadas',
    ],
    regimen: ['6 a 8 horas por día', 'De lunes a lunes si hace falta', 'Libreta del día'],
    perfil: { ayuda: ['asistido'], cuando: ['horas', 'jornada'] },
  },
  {
    id: 'nocturno',
    nombre: 'Cuidado nocturno',
    resumen: 'Un cuidador que se queda a dormir para que la familia descanse de verdad.',
    incluye: [
      'Cuidador en la casa durante toda la noche',
      'Acompañamiento en los despertares y al baño',
      'Medicación de la noche y de la madrugada',
      'Parte escrito de cómo pasó la noche',
    ],
    regimen: ['De 20 a 8', 'Noches sueltas o toda la semana', 'Fines de semana incluidos'],
    perfil: { ayuda: ['autonomo', 'asistido'], cuando: ['noche'] },
  },
  {
    id: 'integral',
    nombre: 'Cuidado integral 24 horas',
    resumen: 'Cobertura continua con turnos rotativos, para cuadros que no pueden quedar solos.',
    incluye: [
      'Cuidadores en turnos rotativos, las 24 horas',
      'Cambios de posición y prevención de escaras',
      'Higiene completa en cama y cuidado de la piel',
      'Registro diario que la familia puede leer',
    ],
    regimen: ['24 horas', 'Turnos rotativos', 'Coordinadora asignada'],
    perfil: { ayuda: ['cama'], cuando: ['horas', 'jornada', 'noche'] },
  },
];

const SELECCION = { quien: 'madre-padre', ayuda: 'autonomo', cuando: 'horas' };
const ETIQUETAS = {
  quien: { 'madre-padre': 'tu mamá o tu papá', abuelo: 'un abuelo o abuela', mismo: 'vos' },
  quienWsp: { 'madre-padre': 'mi mamá o mi papá', abuelo: 'un abuelo/a', mismo: 'mí' },
  ayuda: { autonomo: 'se maneja bastante solo', asistido: 'necesita ayuda para casi todo', cama: 'está en cama' },
  ayudaYo: { autonomo: 'me manejo bastante solo', asistido: 'necesito ayuda para casi todo', cama: 'estoy en cama' },
  cuando: { horas: 'unas horas por día', jornada: 'jornada completa', noche: 'noches o 24 horas' },
};

function elegirPlan() {
  const puntuar = p => {
    let s = 0;
    if (p.perfil.ayuda.includes(SELECCION.ayuda)) s += 3;
    if (p.perfil.cuando.includes(SELECCION.cuando)) s += 2;
    return s;
  };
  return PLANES.map((p, i) => ({ p, s: puntuar(p), i })).sort((a, b) => b.s - a.s || a.i - b.i)[0].p;
}

function renderPlan(conSwap) {
  const cont = document.getElementById('plan');
  if (!cont) return;
  const plan = elegirPlan();
  const enPrimera = SELECCION.quien === 'mismo';
  const paraQuien = enPrimera ? 'Para vos' : 'Para ' + ETIQUETAS.quien[SELECCION.quien];
  const situacion = (enPrimera ? ETIQUETAS.ayudaYo : ETIQUETAS.ayuda)[SELECCION.ayuda];
  const momento = ETIQUETAS.cuando[SELECCION.cuando];
  const msg = 'Hola Cuidar+, entré por la web y armé el cuidado. ' +
    (enPrimera
      ? 'Es para mí: ' + situacion + ' y lo necesito ' + momento + '.'
      : 'Es para ' + ETIQUETAS.quienWsp[SELECCION.quien] + ', que ' + situacion + ', y lo necesito ' + momento + '.') +
    ' Me sugirió el plan "' + plan.nombre + '". ¿Podemos coordinar una visita?';

  const pintar = () => {
    cont.innerHTML =
      '<span class="plan-kicker">' + esc(paraQuien) + '</span>' +
      '<h3>' + esc(plan.nombre) + '</h3>' +
      '<p class="plan-por">Elegido por lo que nos contaste: ' + esc(situacion) + ' · ' + esc(momento) + '</p>' +
      '<ul class="plan-incluye">' + plan.incluye.map(i =>
        '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7"/></svg><span>' + esc(i) + '</span></li>'
      ).join('') + '</ul>' +
      '<div class="plan-regimen">' + plan.regimen.map(r => '<span class="plan-tag">' + esc(r) + '</span>').join('') + '</div>' +
      '<div class="plan-cta">' +
        '<a class="btn btn--cta" href="https://wa.me/' + WSP + '?text=' + encodeURIComponent(msg) + '" target="_blank" rel="noopener">' +
          '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>' +
          'Pedir este cuidado' +
        '</a>' +
        '<a class="btn btn--linea" href="#servicios">Ver qué incluye cada uno</a>' +
      '</div>';
    cont.classList.remove('is-swapping');
  };

  if (conSwap && !reduceMotion) {
    cont.classList.add('is-swapping');
    setTimeout(pintar, 170);
  } else {
    pintar();
  }
}

function initArmar() {
  renderPlan(false);
  document.querySelectorAll('.chips[data-grupo]').forEach(grupo => {
    grupo.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      grupo.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'));
      SELECCION[grupo.dataset.grupo] = chip.dataset.valor;
      renderPlan(true);
    });
  });
}

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(msg) + '</span>';
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

/* ------------------------------------------------------------- reveals --- */
function initReveals() {
  const items = document.querySelectorAll('[data-animate], [data-draw]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = Math.min(i * 0.11, 0.66) + 's';
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

/* ----------------------------------------------------------------- nav --- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div'); bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 861px)');
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

/* ------------------------------------------------------ WhatsApp flotante --- */
function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  const sync = () => btn.classList.toggle('visible', window.scrollY > 600);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

/* ------------------------------------------- la luz que avanza con el scroll --- */
function initLuz() {
  const luz = document.querySelector('.luz');
  if (!luz || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  gsap.timeline({
    scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: .8, invalidateOnRefresh: true },
  })
    .to(luz, { backgroundColor: '#FAF3E4', ease: 'none' })
    .to(luz, { backgroundColor: '#F4E7D2', ease: 'none' });
}

/* ----------------------------------------------------------------- hero --- */
function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const capas = ['.hero-sello', '.hero-nota'];
  if (!document.querySelector('.hero-sello')) return;
  const tl = gsap.timeline();
  tl.from('.hero-sello', { scale: .72, rotate: -14, opacity: 0, duration: .9, ease: 'back.out(1.5)' }, .55)
    .from('.hero-nota', { y: 22, opacity: 0, duration: .8, ease: 'expo.out' }, .72);
  const limpiar = () => {
    if (tl.progress() < 1) tl.progress(1);
    tl.kill();
    gsap.set(capas, { clearProps: 'all' });
  };
  tl.eventCallback('onComplete', limpiar);
  setTimeout(limpiar, 2400);

  if (matchMedia('(hover: hover) and (pointer: fine)').matches && typeof ScrollTrigger !== 'undefined') {
    gsap.to('.hero-sello', { yPercent: -14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 } });
    gsap.to('.hero-nota', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 } });
  }
}

/* ------------------------------------------------------------- parallax --- */
function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  if (!matchMedia('(min-width: 861px)').matches) return;
  document.querySelectorAll('.editorial-media img, .proceso-media img').forEach(img => {
    gsap.fromTo(img, { yPercent: -4 }, {
      yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: img.closest('figure'), start: 'top bottom', end: 'bottom top', scrub: .6, invalidateOnRefresh: true },
    });
  });
}

/* ------------------------------------------ texto que se lee con el scroll --- */
function initLeeScroll() {
  const els = document.querySelectorAll('[data-lee]');
  if (!els.length) return;
  els.forEach(el => {
    const palabras = el.textContent.trim().split(/\s+/);
    if (palabras.length < 2) return;
    el.textContent = '';
    palabras.forEach((palabra, i) => {
      const s = document.createElement('span');
      s.className = 'lee-w';
      s.textContent = palabra;
      el.appendChild(s);
      if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    document.querySelectorAll('.lee-w').forEach(w => w.classList.add('on'));
    return;
  }
  els.forEach(el => {
    const ws = el.querySelectorAll('.lee-w');
    if (!ws.length) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: .4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

/* ------------------------------------------------------------ contadores --- */
function initContadores() {
  const els = document.querySelectorAll('[data-counter]');
  if (!els.length) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  els.forEach(el => {
    const end = parseFloat(el.dataset.counter);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: end, duration: 1.6, ease: 'power1.out', snap: { v: 1 },
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => { el.textContent = obj.v.toLocaleString('es-AR'); },
    });
  });
}

/* --------------------------------------------------- devolución de demo --- */
const GKY_SLUG_ACENTOS = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u' };
function gkySlugify(s) {
  return String(s || '').toLowerCase()
    .replace(/[áéíóúñü]/g, c => GKY_SLUG_ACENTOS[c] || c)
    .replace(/[^a-z0-9]/g, '');
}

function initFeedbackFloat() {
  const GKY_FEEDBACK_WHATSAPP = '5491125068578';
  const btn = document.getElementById('feedback-float');
  const backdrop = document.getElementById('feedback-modal-backdrop');
  const closeBtn = document.getElementById('feedback-modal-close');
  const coloresEl = document.getElementById('feedback-colores');
  const contenidoEl = document.getElementById('feedback-contenido');
  const otrosEl = document.getElementById('feedback-otros');
  const submitBtn = document.getElementById('feedback-submit');
  if (!btn || !backdrop) return;

  const open = () => {
    backdrop.hidden = false;
    document.body.classList.add('no-scroll');
    coloresEl?.focus();
  };
  const close = () => {
    backdrop.hidden = true;
    document.body.classList.remove('no-scroll');
    btn.focus();
  };
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

  submitBtn.addEventListener('click', () => {
    const colores = coloresEl.value.trim();
    const contenido = contenidoEl.value.trim();
    const otros = otrosEl.value.trim();
    if (!colores && !contenido && !otros) { coloresEl.focus(); return; }

    const slugUrl = (location.pathname.match(/\/demo\/([^/]+)/) || [])[1] || document.title;
    const slug = gkySlugify(slugUrl);
    const negocio = (document.title.split(/\s[—|]\s|\s-\s/)[0] || document.title || '').trim();
    const lineas = [
      'Devolución de la demo' + (negocio ? ' — ' + negocio : ''),
      colores ? 'Colores: ' + colores : null,
      contenido ? 'Contenido: ' + contenido : null,
      otros ? 'Otros: ' + otros : null,
      location.href,
    ].filter(Boolean);

    window.open('https://wa.me/' + GKY_FEEDBACK_WHATSAPP + '?text=' + encodeURIComponent(lineas.join('\n')), '_blank', 'noopener');
    window.__gkySendResena?.({ slug, negocio, colores, contenido, otros, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la devolución en Firestore:', err));

    if (typeof showToast === 'function') showToast('¡Gracias por tu devolución!'); else window.alert('¡Gracias por tu devolución!');
    close();
    coloresEl.value = ''; contenidoEl.value = ''; otrosEl.value = '';
  });
}

/* ------------------------------------------------------------- arranque --- */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; el.style.filter = 'none'; });
}

initArmar();
initReveals();
initNav();
initWspFloat();
initLuz();
initHero();
initParallax();
initLeeScroll();
initContadores();
initFeedbackFloat();

const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
