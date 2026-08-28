const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491140733259';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

function initHeroEscena() {
  const arco = document.querySelector('.arco-linea');
  const sello = document.querySelector('.hero-sello');
  if (typeof gsap === 'undefined' || reduceMotion) {
    if (arco) arco.style.strokeDashoffset = 0;
    return;
  }
  const tl = gsap.timeline({ delay: .25 });
  if (arco) tl.to(arco, { strokeDashoffset: 0, duration: 1.9, ease: 'power2.inOut' }, 0);
  if (sello) tl.from(sello, { scale: .82, opacity: 0, duration: 1, ease: 'power3.out' }, .35);
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const mini = document.querySelector('.hero-mini');
  if (mini) {
    gsap.to(mini, {
      yPercent: -14, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 }
    });
  }
  document.querySelectorAll('.sobre-fig img, .honestidad-fig img').forEach(img => {
    gsap.fromTo(img, { yPercent: -4 }, {
      yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: .7 }
    });
  });
}

const PREGUNTAS = [
  {
    txt: '¿Cómo llegás hoy?',
    ops: [
      { k: 'cansada', label: 'Cansada', carta: 'Cansancio' },
      { k: 'duda', label: 'Con una duda', carta: 'Una duda' },
      { k: 'cerrar', label: 'Con algo que cerrar', carta: 'Un cierre' }
    ]
  },
  {
    txt: '¿Qué necesitás encontrar?',
    ops: [
      { k: 'calma', label: 'Calma', carta: 'Calma' },
      { k: 'claridad', label: 'Claridad', carta: 'Claridad' },
      { k: 'decision', label: 'Una decisión', carta: 'Una decisión' }
    ]
  },
  {
    txt: '¿Dónde nos encontramos?',
    ops: [
      { k: 'nordelta', label: 'En Nordelta', carta: 'En Nordelta' },
      { k: 'online', label: 'Online', carta: 'Online' }
    ]
  }
];

const SERVICIOS = {
  tarot: {
    nombre: 'una lectura de tarot',
    titulo: 'Lectura de tarot',
    por: 'Traés una pregunta concreta y lo que necesitás es verla clara. Eso es una tirada: salís con un panorama del momento y con algo para hacer, no con un misterio nuevo.'
  },
  runas: {
    nombre: 'una lectura de runas',
    titulo: 'Lectura de runas',
    por: 'Hay una decisión sobre la mesa. Las runas son más cortas y más directas que el tarot, y cuando hay que decidir eso es justo lo que sirve.'
  },
  reiki: {
    nombre: 'una sesión de Reiki',
    titulo: 'Reiki',
    por: 'Llegás cansada y lo que buscás es calma: ahí el Reiki hace más que cualquier lectura. Bajamos las revoluciones primero y, si después queda una pregunta, la miramos.'
  },
  flores: {
    nombre: 'Flores de Bach',
    titulo: 'Flores de Bach',
    por: 'Con lo que elegiste, empezaría por una fórmula personalizada: acompaña el día a día durante semanas, no solamente el rato de la sesión.'
  },
  limpieza: {
    nombre: 'una limpieza energética',
    titulo: 'Limpieza energética',
    por: 'Lo que traés es algo para cerrar. Antes de leer nada, sacaría el peso de esa etapa: después se piensa mucho mejor.'
  }
};

const RECO = {
  'cansada|calma': 'reiki',
  'cansada|claridad': 'flores',
  'cansada|decision': 'flores',
  'duda|calma': 'flores',
  'duda|claridad': 'tarot',
  'duda|decision': 'runas',
  'cerrar|calma': 'limpieza',
  'cerrar|claridad': 'tarot',
  'cerrar|decision': 'limpieza'
};

function initTirada() {
  const cartas = Array.from(document.querySelectorAll('#cartas .carta'));
  const preguntaBox = document.getElementById('pregunta');
  const preguntaTxt = document.getElementById('preguntaTxt');
  const opciones = document.getElementById('opciones');
  const lectura = document.getElementById('lectura');
  const lecturaTitulo = document.getElementById('lecturaTitulo');
  const lecturaPor = document.getElementById('lecturaPor');
  const lecturaWsp = document.getElementById('lecturaWsp');
  const reiniciar = document.getElementById('reiniciar');
  if (!cartas.length || !preguntaTxt || !opciones || !lectura) return;

  let paso = 0;
  const elegidas = [];

  function pintarPregunta() {
    const p = PREGUNTAS[paso];
    preguntaTxt.textContent = p.txt;
    opciones.innerHTML = '';
    p.ops.forEach(op => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'opcion';
      b.textContent = op.label;
      b.addEventListener('click', () => responder(op));
      opciones.appendChild(b);
    });
  }

  function responder(op) {
    elegidas[paso] = op;
    const carta = cartas[paso];
    const valor = carta?.querySelector('.carta-valor');
    if (valor) valor.textContent = op.carta;
    carta?.classList.add('abierta');
    paso++;
    if (paso < PREGUNTAS.length) {
      pintarPregunta();
    } else {
      cerrarTirada();
    }
  }

  function cerrarTirada() {
    const clave = `${elegidas[0].k}|${elegidas[1].k}`;
    const serv = SERVICIOS[RECO[clave]] || SERVICIOS.tarot;
    const online = elegidas[2].k === 'online';
    lecturaTitulo.textContent = serv.titulo;
    lecturaPor.textContent = `${serv.por} ${online ? 'Lo hacemos por videollamada, desde donde estés.' : 'Nos vemos en Nordelta, con día y horario acordados.'}`;
    const msg = `Hola Alejandra! Hice la tirada en tu web y salió: ${elegidas[0].carta} · ${elegidas[1].carta} · ${elegidas[2].carta}. Me sugirió empezar por ${serv.nombre}. ¿Coordinamos?`;
    lecturaWsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
    preguntaBox.hidden = true;
    lectura.hidden = false;
    lecturaTitulo.setAttribute('tabindex', '-1');
    lecturaTitulo.focus({ preventScroll: true });
  }

  reiniciar?.addEventListener('click', () => {
    paso = 0;
    elegidas.length = 0;
    cartas.forEach(c => {
      c.classList.remove('abierta');
      const v = c.querySelector('.carta-valor');
      if (v) v.textContent = '—';
    });
    lectura.hidden = true;
    preguntaBox.hidden = false;
    pintarPregunta();
    opciones.querySelector('.opcion')?.focus({ preventScroll: true });
  });

  lecturaWsp?.addEventListener('click', () => showToast('Te abrimos WhatsApp con tu tirada cargada.'));

  pintarPregunta();
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
  window.addEventListener('resize', syncInert, { passive: true });
  syncInert();
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initAnio() {
  const el = document.getElementById('anio');
  if (el) el.textContent = new Date().getFullYear();
}

initTirada();
initHeroEscena();
initParallax();
initReveals();
initNav();
initWspFloat();
initAnio();
