const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
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
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
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
  const sync = () => btn.classList.toggle('visible', window.scrollY > 600);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

function initProgressBar() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, h.scrollTop / max) : 0) + ')';
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

function initHero() {
  const word = document.getElementById('heroWord');
  const arc = document.getElementById('arcDraw');
  const cardAm = document.getElementById('heroCardAm');
  const cardPm = document.getElementById('heroCardPm');
  const scrollCue = document.getElementById('scrollCue');
  scrollCue?.addEventListener('click', () => {
    document.getElementById('ritmo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });
  if (reduceMotion) {
    [word, arc, cardAm, cardPm].forEach(el => el?.classList.add('in'));
    return;
  }
  requestAnimationFrame(() => {
    setTimeout(() => word?.classList.add('in'), 80);
    setTimeout(() => arc?.classList.add('in'), 260);
    setTimeout(() => cardAm?.classList.add('in'), 480);
    setTimeout(() => cardPm?.classList.add('in'), 640);
  });
}

function initStickyChapter(pasosId, frameId) {
  const container = document.getElementById(pasosId);
  const frame = document.getElementById(frameId);
  if (!container || !frame) return;
  const pasos = container.querySelectorAll('.paso');
  const layers = frame.querySelectorAll('.visual-layer');
  if (!pasos.length || !('IntersectionObserver' in window) || reduceMotion) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const step = entry.target.dataset.step;
      pasos.forEach(p => p.classList.toggle('is-on', p === entry.target));
      layers.forEach(l => l.classList.toggle('is-on', l.dataset.step === step));
    });
  }, { threshold: 0, rootMargin: '-45% 0px -45% 0px' });
  pasos.forEach(p => io.observe(p));
}

function initArcoPuente() {
  const puente = document.getElementById('arcoPuente');
  const linea = document.getElementById('arcoLinea');
  const marcador = document.getElementById('arcoMarcador');
  if (!puente || !linea || !marcador) return;
  const sol = marcador.querySelector('.marcador-sol');
  const luna = marcador.querySelector('.marcador-luna');
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    linea.classList.add('in');
    marcador.style.left = '50%';
    if (sol) sol.style.opacity = '.6';
    if (luna) luna.style.opacity = '.6';
    return;
  }
  ScrollTrigger.create({
    trigger: puente, start: 'top bottom', end: 'bottom top', scrub: .6,
    onUpdate(self) {
      const p = self.progress;
      linea.style.strokeDashoffset = String(2000 - 2000 * p);
      marcador.style.left = (4 + p * 92) + '%';
      if (sol) sol.style.opacity = String(1 - p);
      if (luna) luna.style.opacity = String(p);
    }
  });
}

function initConsultivo() {
  const widget = document.getElementById('consultivoWidget');
  if (!widget) return;
  const pregunta = document.getElementById('consultivoPregunta');
  const resultado = document.getElementById('consultivoResultado');
  const REC = {
    am: { titulo: 'Circadia AM — Day | Focus', texto: 'Arrancá el día con foco sostenido y energía pareja.', msg: 'Hola! Hice el quiz de Circadia y me recomendó AM (Day | Focus). Quiero pedirlo', clase: 'am' },
    pm: { titulo: 'Circadia PM — Night | Recovery', texto: 'Cerrá el día con un descanso que se nota al día siguiente.', msg: 'Hola! Hice el quiz de Circadia y me recomendó PM (Night | Recovery). Quiero pedirlo', clase: 'pm' },
    pack: { titulo: 'Ritual completo — AM + PM', texto: 'Circadia AM de día, Circadia PM de noche: un sistema para las 24 horas.', msg: 'Hola! Hice el quiz de Circadia y me recomendó el Pack Día + Noche (AM + PM). Quiero pedirlo', clase: 'pack' },
  };
  function mostrarResultado(rec) {
    resultado.textContent = '';
    const eyebrow = document.createElement('p');
    eyebrow.className = 'consultivo-eyebrow';
    eyebrow.textContent = 'Para vos';
    const h3 = document.createElement('h3');
    h3.textContent = rec.titulo;
    const p = document.createElement('p');
    p.textContent = rec.texto;
    const cta = document.createElement('a');
    cta.className = 'btn btn-' + (rec.clase === 'pack' ? 'cta' : rec.clase);
    cta.href = 'https://wa.me/5493515126666?text=' + encodeURIComponent(rec.msg);
    cta.target = '_blank';
    cta.rel = 'noopener';
    cta.textContent = 'Pedir por WhatsApp';
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'consultivo-retry';
    retry.textContent = 'Volver a elegir';
    retry.addEventListener('click', () => { resultado.hidden = true; pregunta.hidden = false; });
    resultado.append(eyebrow, h3, p, cta, retry);
    pregunta.hidden = true;
    resultado.hidden = false;
  }
  widget.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const rec = REC[chip.dataset.rec];
      if (rec) mostrarResultado(rec);
    });
  });
}

function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;
  track.insertAdjacentHTML('beforeend', track.innerHTML);
}

function initMagnetic() {
  if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('.btn-cta, .btn-am, .btn-pm').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * .16}px, ${y * .32}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

function initGlowFollow() {
  if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('.consultivo-widget').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });
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

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHero();
  initProgressBar();
  initMarquee();
  initConsultivo();
  initStickyChapter('pasosAm', 'visualFrameAm');
  initStickyChapter('pasosPm', 'visualFramePm');
  initArcoPuente();
  initMagnetic();
  initGlowFollow();
  initWspFloat();
  initReveals();
});

window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
});
