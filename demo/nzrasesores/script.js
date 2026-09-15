document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3600);
}

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
  const mq = window.matchMedia('(min-width: 769px)');
  const sync = () => { if (mq.matches) { nav.removeAttribute('inert'); close(); } else if (!nav.classList.contains('open')) nav.setAttribute('inert', ''); };
  mq.addEventListener('change', sync);
  sync();
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

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-block', { xPercent: 12, opacity: 0, duration: 1.1 }, 0)
    .from('.hero-pulse', { opacity: 0, x: 60, duration: 1.1 }, 0.3)
    .from('.hero-piece', { y: 54, opacity: 0, duration: 1.15 }, 0.25)
    .from('.tag-quote', { y: -18, opacity: 0, duration: 0.75 }, 0.7);
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const foto = document.querySelector('.comparar-media img');
  if (foto) {
    gsap.fromTo(foto, { yPercent: -4, scale: 1.07 }, {
      yPercent: 4, scale: 1.07, ease: 'none',
      scrollTrigger: { trigger: '.comparar-media', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }
  gsap.utils.toArray('.ben-check').forEach((ico, i) => {
    gsap.from(ico, {
      scale: 0.84, rotate: -8, opacity: 0, duration: 0.6, delay: (i % 3) * 0.08, ease: 'back.out(1.6)',
      scrollTrigger: { trigger: ico.closest('.ben-card'), start: 'top 88%' }
    });
  });
  // Los números de "qué mirar" traen su subrayado: se dibuja al entrar en pantalla.
  gsap.utils.toArray('.comparar-num').forEach(num => {
    ScrollTrigger.create({
      trigger: num,
      start: 'top 88%',
      once: true,
      onEnter: () => num.classList.add('sub-in')
    });
  });
  gsap.from('.seam-cut', {
    y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.seam-cut', start: 'top 92%' }
  });
  gsap.utils.toArray('.testi').forEach((t, i) => {
    gsap.from(t, {
      x: i % 2 === 0 ? -26 : 26, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: t, start: 'top 88%' }
    });
  });
}

/* Formulario de contacto en etapa demo: no postea a ningún lado.
   Valida, simula el envío y avisa por toast. */
function initForm() {
  const form = document.getElementById('contactoForm');
  if (!form) return;
  const nombre = document.getElementById('cf-nombre');
  const tel = document.getElementById('cf-tel');
  const errNombre = document.getElementById('err-nombre');
  const errTel = document.getElementById('err-tel');
  const btn = document.getElementById('cfSubmit');

  const validar = () => {
    let ok = true;
    if (nombre.value.trim().length < 2) {
      nombre.classList.add('error'); errNombre.classList.add('visible'); ok = false;
    } else {
      nombre.classList.remove('error'); errNombre.classList.remove('visible');
    }
    const digitos = tel.value.replace(/\D/g, '');
    if (digitos.length < 7 || digitos.length > 15) {
      tel.classList.add('error'); errTel.classList.add('visible'); ok = false;
    } else {
      tel.classList.remove('error'); errTel.classList.remove('visible');
    }
    return ok;
  };

  [nombre, tel].forEach(el => el.addEventListener('input', () => {
    if (el.classList.contains('error')) validar();
  }));

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validar()) {
      showToast('Revisá los datos marcados en rojo');
      (nombre.classList.contains('error') ? nombre : tel).focus();
      return;
    }
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Pedir mi asesoría';
    }, 800);
  });
}

/* La letra chica: el capítulo pin+scrub. El resaltador va marcando una cláusula
   por paso y, al costado, aparece su traducción en castellano llano. El paso 1
   no marca nada (es la presentación), así que hay 5 pasos para 4 cláusulas. */
function initLetraChica() {
  const stage = document.getElementById('lcStage');
  const doc = document.getElementById('lcDoc');
  const pasos = document.getElementById('lcPasos');
  if (!stage || !doc || !pasos) return;

  const clausulas = Array.from(doc.querySelectorAll('.lc-clausulas li'));
  const highlights = clausulas.map(li => li.querySelector('.lc-hl'));
  const items = Array.from(pasos.children);

  const setStep = progress => {
    const i = Math.min(items.length - 1, Math.max(0, Math.floor(progress * items.length)));
    items.forEach((li, n) => li.classList.toggle('is-on', n === i));
    // El paso 0 presenta; del 1 en adelante cada paso enciende su cláusula.
    clausulas.forEach((li, n) => li.classList.toggle('is-on', n === i - 1));
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    stage.classList.add('is-static');
    items.forEach(li => li.classList.add('is-on'));
    clausulas.forEach(li => li.classList.add('is-on'));
    return;
  }

  const construir = tl => {
    gsap.set(highlights, { scaleX: 0 });
    // Cada resaltador se dibuja dentro de la franja de su paso.
    highlights.forEach((hl, n) => {
      const t = (n + 1) / items.length;
      tl.to(hl, { scaleX: 1, duration: 0.16, ease: 'power2.out' }, t);
    });
    tl.to({}, { duration: 0.08 });
  };

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: '+=260%',
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: self => setStep(self.progress)
      }
    });
    construir(tl);
    setStep(0);
    return () => { gsap.set(highlights, { clearProps: 'all' }); };
  });

  mm.add('(max-width: 1080px)', () => {
    stage.classList.add('is-sticky-mobile');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: self => setStep(self.progress)
      }
    });
    construir(tl);
    setStep(0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      stage.classList.remove('is-sticky-mobile');
      gsap.set(highlights, { clearProps: 'all' });
    };
  });
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}

document.documentElement.classList.add('js-ready');
requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add('hero-in')));
initNav();
initWspFloat();
initReveals();
initHero();
initParallax();
initForm();
initLetraChica();
const anioEl = document.getElementById('anio');
if (anioEl) anioEl.textContent = new Date().getFullYear();

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
