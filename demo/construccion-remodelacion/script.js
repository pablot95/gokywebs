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
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3600);
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
    Object.assign(bd.style, { position: 'fixed', inset: '0', background: 'rgba(0,0,0,.5)', opacity: '0', visibility: 'hidden', transition: 'opacity .3s, visibility 0s .3s', zIndex: '110' });
    (document.querySelector('.barra') || document.body).appendChild(bd);
  }
  const close = () => {
    nav.classList.remove('open'); nav.setAttribute('inert', '');
    bd.style.opacity = '0'; bd.style.visibility = 'hidden'; bd.style.transition = 'opacity .3s, visibility 0s .3s';
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); nav.removeAttribute('inert');
    bd.style.opacity = '1'; bd.style.visibility = 'visible'; bd.style.transition = 'opacity .3s';
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });

  const sincronizarInert = () => {
    if (window.innerWidth > 768) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  sincronizarInert();
  window.addEventListener('resize', sincronizarInert, { passive: true });
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  const sync = () => btn.classList.toggle('visible', window.scrollY > 600);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

function initFaq() {
  const lista = document.querySelectorAll('.faq-lista details');
  lista.forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) lista.forEach(o => { if (o !== d) o.open = false; });
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  });
}

function initForm() {
  const form = document.getElementById('form');
  if (!form) return;
  const tel = document.getElementById('telefono');
  if (tel && typeof IMask !== 'undefined') {
    IMask(tel, { mask: '+{54} 9 00 0000-0000', lazy: true, placeholderChar: '_' });
  }

  const marcarError = (input, mostrar) => {
    const campo = input.closest('.campo');
    const err = document.getElementById('err-' + input.id);
    campo?.classList.toggle('mal', mostrar);
    input.setAttribute('aria-invalid', String(mostrar));
    if (err) {
      err.hidden = !mostrar;
      if (mostrar) input.setAttribute('aria-describedby', err.id);
      else input.removeAttribute('aria-describedby');
    }
    return !mostrar;
  };

  const validar = () => {
    const nombre = document.getElementById('nombre');
    const telefono = document.getElementById('telefono');
    let ok = true;
    ok = marcarError(nombre, nombre.value.trim().length < 2) && ok;
    ok = marcarError(telefono, telefono.value.replace(/\D/g, '').length < 10) && ok;
    return ok;
  };

  form.querySelectorAll('input').forEach(i => {
    i.addEventListener('input', () => {
      if (i.closest('.campo')?.classList.contains('mal')) validar();
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validar()) {
      form.querySelector('.campo.mal input')?.focus();
      return;
    }
    const btn = document.getElementById('enviar');
    const texto = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = texto;
      form.reset();
      form.querySelectorAll('.campo.mal').forEach(c => c.classList.remove('mal'));
      form.querySelectorAll('.error').forEach(p => { p.hidden = true; });
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
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

function initLineas() {
  const lineas = document.querySelectorAll('.subrayado, .hero-cinta');
  if (!lineas.length) return;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    lineas.forEach(el => el.classList.add('in-linea'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-linea'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
  lineas.forEach(el => io.observe(el));
  window.addEventListener('load', () => lineas.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight) el.classList.add('in-linea');
  }));
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.hero-bloque', { yPercent: 12, opacity: 0, duration: 1.1 }, 0)
    .from('.hero-equipo', { y: 56, opacity: 0, duration: 1.2 }, .25)
    .from('.hero-firma', { opacity: 0, x: 12, duration: .8 }, .65);
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  document.querySelectorAll('.serv-foto img, .op-foto img').forEach(img => {
    gsap.fromTo(img, { yPercent: -4, scale: 1.1 }, {
      yPercent: 4, scale: 1.1, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

function initObra() {
  const stage = document.getElementById('obraStage');
  const escena = document.getElementById('obraEscena');
  if (!stage || !escena) return;

  const pasos = [...document.querySelectorAll('#obraPasos li')];
  const prog = document.getElementById('obraProg');
  const setStep = p => {
    const i = p < .25 ? 0 : p < .5 ? 1 : p < .75 ? 2 : 3;
    pasos.forEach((li, n) => li.classList.toggle('is-on', n === i));
    if (prog) prog.style.width = `${Math.round(Math.min(1, Math.max(0, p)) * 100)}%`;
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    pasos.forEach(li => li.classList.add('is-on'));
    if (prog) prog.style.width = '100%';
    return;
  }

  const anchoBorde = () => Math.max(0, escena.clientWidth - 6);

  const construir = () => gsap.timeline({ defaults: { ease: 'none' } })
    .fromTo('.obra-durante', { scale: 1.08 }, { scale: 1, duration: 4 }, 0)
    .fromTo('.obra-listo', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 2.8 }, .6)
    .fromTo('.obra-borde', { x: 0 }, { x: anchoBorde, duration: 2.8 }, .6)
    .to('.obra-tag-a', { opacity: 0, duration: .3 }, 3)
    .to('.obra-tag-b', { opacity: 1, duration: .3 }, 3.15)
    .to('.obra-borde', { opacity: 0, duration: .3 }, 3.4);

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    const tl = construir();
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: '+=240%', pin: true, scrub: .6,
      animation: tl, invalidateOnRefresh: true,
      onUpdate: self => setStep(self.progress),
    });
    setStep(0);
    return () => { st.kill(); tl.kill(); };
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    const tl = construir();
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: 'bottom bottom', scrub: .6,
      animation: tl, invalidateOnRefresh: true,
      onUpdate: self => setStep(self.progress),
    });
    setStep(0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { st.kill(); tl.kill(); stage.classList.remove('is-sticky-mobile'); };
  });
}

const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();

initNav();
initWspFloat();
initFaq();
initForm();
initReveals();
initLineas();
initHero();
initParallax();
initObra();
