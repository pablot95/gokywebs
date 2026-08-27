document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493585732384';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none';
  });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3600);
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
    const header = document.querySelector('.masthead');
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 12;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
      target.setAttribute('tabindex', '-1');
      setTimeout(() => target.focus({ preventScroll: true }), reduceMotion ? 0 : 520);
    });
  });
}

const SECCIONES = [
  { id: 'portada', num: '01', name: 'Portada', ink: false },
  { id: 'materias', num: '02', name: 'Materias', ink: false },
  { id: 'caratula', num: '03', name: 'Tu caso', ink: true },
  { id: 'trabajo', num: '04', name: 'Trámite', ink: false },
  { id: 'estudio', num: '05', name: 'Patrocinio', ink: false },
  { id: 'constancias', num: '06', name: 'Constancias', ink: false },
  { id: 'preguntas', num: '07', name: 'Preguntas', ink: false },
  { id: 'contacto', num: '08', name: 'Escrito', ink: true }
];

function initFolio() {
  const rail = document.getElementById('folioRail');
  const num = document.getElementById('folioNum');
  const name = document.getElementById('folioName');
  const fill = document.getElementById('folioFill');
  const bar = document.querySelector('#scrollBar i');
  if (!rail || !num || !name) return;

  let actual = '';
  const setFolio = sec => {
    if (actual === sec.id) return;
    actual = sec.id;
    num.textContent = sec.num;
    name.textContent = sec.name;
    rail.classList.toggle('on-ink', sec.ink);
  };

  const nodos = SECCIONES.map(s => ({ sec: s, el: document.getElementById(s.id) })).filter(n => n.el);

  const progreso = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (bar) bar.style.width = (p * 100).toFixed(2) + '%';
    if (fill) fill.style.height = (p * 100).toFixed(2) + '%';
  };

  const marcar = () => {
    const centro = window.innerHeight * 0.5;
    let elegido = nodos[0];
    nodos.forEach(n => {
      const r = n.el.getBoundingClientRect();
      if (r.top <= centro && r.bottom > centro) elegido = n;
      else if (r.top <= centro) elegido = n;
    });
    if (elegido) setFolio(elegido.sec);
  };

  let queued = false;
  const tick = () => { queued = false; progreso(); marcar(); };
  const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(tick); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('load', tick);
  tick();
}

function initMaterias() {
  const items = [...document.querySelectorAll('.materia')];
  const shots = [...document.querySelectorAll('.mat-shot')];
  const tag = document.getElementById('matTag');
  if (!items.length || !shots.length) return;

  let actual = '';
  const activar = li => {
    const key = li.dataset.materia;
    if (key === actual) return;
    actual = key;
    items.forEach(i => i.classList.toggle('is-active', i === li));
    shots.forEach(s => s.classList.toggle('is-on', s.dataset.shot === key));
    if (tag) {
      const folio = li.querySelector('.materia-folio')?.textContent?.trim() || '';
      const titulo = li.querySelector('h3')?.textContent?.trim() || '';
      tag.textContent = `${folio} — ${titulo}`;
    }
  };

  let queued = false;
  const tick = () => {
    queued = false;
    const centro = window.innerHeight * 0.55;
    let elegido = items[0];
    items.forEach(li => {
      const r = li.getBoundingClientRect();
      if (r.top <= centro) elegido = li;
    });
    if (elegido) activar(elegido);
  };
  const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(tick); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  tick();
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const capas = [
    { sel: '.hero-media img', mov: 4 },
    { sel: '.trabajo-media img', mov: 5 },
    { sel: '.cierre-bg img', mov: 6 }
  ];
  capas.forEach(({ sel, mov }) => {
    document.querySelectorAll(sel).forEach(img => {
      gsap.fromTo(img,
        { yPercent: -mov, scale: 1.14 },
        {
          yPercent: mov, scale: 1.14, ease: 'none',
          scrollTrigger: { trigger: img.closest('figure, div') || img, start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true }
        }
      );
    });
  });
}

const MATERIAS_QUIZ = {
  penal: {
    titulo: 'Derecho Penal',
    texto: 'Lo tuyo entra por el fuero penal. Antes de declarar o de firmar cualquier acta conviene que veamos qué dice la causa.'
  },
  societario: {
    titulo: 'Derecho Societario',
    texto: 'Es un tema societario. Se resuelve mucho mejor con el estatuto y las actas en la mano que discutiéndolo después en el juzgado.'
  },
  sucesiones: {
    titulo: 'Sucesiones',
    texto: 'Es una sucesión. El primer paso no es judicial: es juntar partidas, títulos y datos de los herederos en el orden correcto.'
  },
  laboral: {
    titulo: 'Derecho Laboral',
    texto: 'Es derecho laboral. Lo primero es mirar los recibos y las fechas, porque los plazos para reclamar corren aunque uno no lo sepa.'
  }
};
const URGENCIA_QUIZ = {
  hoy: ' Como es de esta semana, escribime cuanto antes: puede haber un plazo corriendo.',
  mes: ' Todavía estás a tiempo de ordenarlo sin apuro.',
  viejo: ' Aunque venga de antes, casi siempre queda algo por hacer: hay que mirar los plazos.'
};
const ESTADO_QUIZ = {
  causa: ' Con el número de expediente puedo revisar en qué instancia está antes de la primera charla.',
  no: ' Al no haber nada iniciado, se puede elegir bien por dónde empezar.',
  papel: ' Mandame una foto del papel y te digo qué es y qué plazo te da.'
};

function initQuiz() {
  const steps = [...document.querySelectorAll('.quiz-step')];
  const chips = [...document.querySelectorAll('.chip')];
  const campos = [...document.querySelectorAll('#quizCaratula dd[data-field]')];
  const sello = document.getElementById('quizSello');
  const out = document.getElementById('quizOut');
  const outTitle = document.getElementById('quizOutTitle');
  const outText = document.getElementById('quizOutText');
  const outCta = document.getElementById('quizOutCta');
  const reset = document.getElementById('quizReset');
  if (!steps.length || !chips.length) return;

  const respuestas = [null, null, null];
  const etiquetas = [null, null, null];

  const mostrarPaso = i => {
    steps.forEach(s => s.classList.toggle('is-on', Number(s.dataset.step) === i));
  };

  const escribir = (campo, texto) => {
    campo.classList.add('is-set');
    if (reduceMotion) { campo.textContent = texto; return; }
    campo.textContent = '';
    let n = 0;
    const paso = () => {
      n++;
      campo.textContent = texto.slice(0, n);
      if (n < texto.length) setTimeout(paso, 22);
    };
    paso();
  };

  const volar = (chip, destino) => {
    if (reduceMotion || !destino) return;
    const a = chip.getBoundingClientRect();
    const b = destino.getBoundingClientRect();
    const ghost = chip.cloneNode(true);
    ghost.classList.add('is-flying');
    ghost.classList.remove('is-picked');
    ghost.style.left = a.left + 'px';
    ghost.style.top = a.top + 'px';
    ghost.style.width = a.width + 'px';
    ghost.style.height = a.height + 'px';
    document.body.appendChild(ghost);
    requestAnimationFrame(() => {
      ghost.style.transform = `translate(${(b.left + 4) - a.left}px, ${(b.top - 2) - a.top}px) scale(.6)`;
      ghost.style.opacity = '0';
    });
    setTimeout(() => ghost.remove(), 720);
  };

  const resolver = () => {
    const m = MATERIAS_QUIZ[respuestas[0]];
    if (!m) return;
    const texto = m.texto + (URGENCIA_QUIZ[respuestas[1]] || '') + (ESTADO_QUIZ[respuestas[2]] || '');
    if (outTitle) outTitle.textContent = m.titulo;
    if (outText) outText.textContent = texto;
    if (outCta) {
      const msg = `Hola Sofía, te escribo desde la web.\nMateria: ${etiquetas[0]}. Antigüedad: ${etiquetas[1]}. Estado: ${etiquetas[2]}.\nTe cuento: `;
      outCta.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
    }
    if (out) out.hidden = false;
    if (reset) reset.hidden = false;
    setTimeout(() => sello?.classList.add('is-on'), 260);
    steps.forEach(s => s.classList.remove('is-on'));
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = Number(chip.dataset.q);
      respuestas[q] = chip.dataset.value;
      etiquetas[q] = chip.dataset.label;
      chip.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('is-picked'));
      chip.classList.add('is-picked');
      const campo = campos[q];
      volar(chip, campo);
      if (campo) setTimeout(() => escribir(campo, chip.dataset.label), reduceMotion ? 0 : 380);
      const siguiente = q + 1;
      setTimeout(() => {
        if (siguiente < steps.length) mostrarPaso(siguiente);
        else resolver();
      }, reduceMotion ? 0 : 520);
    });
  });

  reset?.addEventListener('click', () => {
    respuestas.fill(null); etiquetas.fill(null);
    chips.forEach(c => c.classList.remove('is-picked'));
    campos.forEach(c => { c.textContent = '—'; c.classList.remove('is-set'); });
    sello?.classList.remove('is-on');
    if (out) out.hidden = true;
    reset.hidden = true;
    mostrarPaso(0);
    document.getElementById('caratula')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
}

function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const btn = document.getElementById('formSubmit');
  const reglas = [
    { input: 'f-nombre', error: 'err-nombre', test: v => v.trim().length >= 2, msg: 'Poné tu nombre para saber cómo llamarte.' },
    { input: 'f-tel', error: 'err-tel', test: v => v.replace(/\D/g, '').length >= 8, msg: 'Necesito un teléfono con característica para devolverte el mensaje.' },
    { input: 'f-msg', error: 'err-msg', test: v => v.trim().length >= 10, msg: 'Contame en una línea qué te pasó, aunque sea muy corto.' }
  ];

  reglas.forEach(r => {
    const el = document.getElementById(r.input);
    el?.addEventListener('input', () => {
      if (!el.closest('.campo').classList.contains('has-error')) return;
      if (r.test(el.value)) {
        el.closest('.campo').classList.remove('has-error');
        el.removeAttribute('aria-invalid');
        document.getElementById(r.error).textContent = '';
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    let primero = null;
    reglas.forEach(r => {
      const el = document.getElementById(r.input);
      const box = el.closest('.campo');
      const err = document.getElementById(r.error);
      if (!r.test(el.value)) {
        ok = false;
        box.classList.add('has-error');
        el.setAttribute('aria-invalid', 'true');
        err.textContent = r.msg;
        if (!primero) primero = el;
      } else {
        box.classList.remove('has-error');
        el.removeAttribute('aria-invalid');
        err.textContent = '';
      }
    });
    if (!ok) { primero?.focus(); return; }
    const texto = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = texto;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

initNav();
initAnchors();
initFolio();
initMaterias();
initQuiz();
initForm();
initParallax();
initWspFloat();
initYear();
initReveals();
