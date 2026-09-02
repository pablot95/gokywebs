const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; el.style.filter = 'none';
  });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    wrap.setAttribute('aria-live', 'polite');
    document.body.appendChild(wrap);
  }
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
  const header = document.querySelector('.site-header');
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (header || document.body).appendChild(bd); }
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

function initReveals() {
  const items = [...document.querySelectorAll('[data-animate]')].filter(el => !el.closest('.hero'));
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
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const mostrarTodo = () => hero.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  if (typeof gsap === 'undefined' || reduceMotion) { mostrarTodo(); return; }

  const revelar = (sel, ms) => setTimeout(() => {
    hero.querySelectorAll(sel).forEach(el => el.classList.add('in'));
  }, ms);
  revelar('.wordmark', 100);
  revelar('.hero-media', 280);
  revelar('.wordmark-rope', 440);
  revelar('.hero-copy .cota', 560);
  revelar('.hero-claim', 680);
  revelar('.hero-sub', 860);
  revelar('.hero-cta [data-animate]', 1000);
  revelar('.hero-datos', 1180);
  setTimeout(mostrarTodo, 2600);
}

function initParallax() {
  const fondo = document.querySelector('.cierre-bg');
  if (!fondo || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  gsap.fromTo(fondo, { yPercent: -6 }, {
    yPercent: 6, ease: 'none',
    scrollTrigger: { trigger: '.cierre', start: 'top bottom', end: 'bottom top', scrub: .6 },
  });
}

function initVida() {
  const nudo = document.getElementById('vidaNudo');
  const cota = document.getElementById('vidaCota');
  if (!nudo || !cota) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    const alto = document.documentElement.scrollHeight - window.innerHeight;
    const p = alto > 0 ? Math.min(1, Math.max(0, window.scrollY / alto)) : 0;
    nudo.style.transform = `translateY(${p * (window.innerHeight - 90) + 45}px)`;
    cota.textContent = `+${Math.round(42 - p * 42)}`;
  };
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  update();
}

function initDescenso() {
  const stage = document.getElementById('descensoStage');
  const edificio = document.getElementById('edificio');
  const nueva = document.getElementById('fachadaNueva');
  const borde = document.getElementById('bordePintura');
  const cuerda = document.getElementById('cuerda');
  const operario = document.getElementById('operario');
  const pasos = document.querySelectorAll('#descensoPasos li');
  if (!stage || !edificio || !nueva || !pasos.length) return;

  const setPaso = progreso => {
    const i = Math.min(pasos.length - 1, Math.floor(progreso * pasos.length));
    pasos.forEach((li, n) => li.classList.toggle('is-on', n === i));
  };

  const finalizar = () => {
    nueva.style.clipPath = 'inset(0 0 0 0)';
    if (cuerda) cuerda.style.transform = 'scaleY(.92)';
    const alto = edificio.getBoundingClientRect().height || 400;
    if (operario) operario.style.transform = `translateY(${alto - 34}px)`;
    if (borde) borde.style.transform = `translateY(${alto - 3}px)`;
    pasos.forEach(li => li.classList.add('is-on'));
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    finalizar();
    return;
  }

  const construirTimeline = trigger => {
    const tl = gsap.timeline({ scrollTrigger: trigger });
    tl.fromTo(nueva, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', ease: 'none' }, 0)
      .fromTo(cuerda, { scaleY: 0 }, { scaleY: .94, ease: 'none' }, 0)
      .fromTo(operario, { y: -8 }, { y: () => (edificio.getBoundingClientRect().height || 400) - 40, ease: 'none' }, 0)
      .fromTo(borde, { y: 0 }, { y: () => (edificio.getBoundingClientRect().height || 400) - 3, ease: 'none' }, 0);
    return tl;
  };

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    const tl = construirTimeline({
      trigger: stage, start: 'top top', end: '+=220%',
      pin: true, scrub: .6, invalidateOnRefresh: true,
      onUpdate: self => setPaso(self.progress),
    });
    setPaso(0);
    return () => tl.scrollTrigger?.kill();
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    const tl = construirTimeline({
      trigger: stage, start: 'top top', end: 'bottom bottom',
      scrub: .6, invalidateOnRefresh: true,
      onUpdate: self => setPaso(self.progress),
    });
    setPaso(0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { tl.scrollTrigger?.kill(); stage.classList.remove('is-sticky-mobile'); };
  });

  mm.add('(prefers-reduced-motion: reduce)', () => { finalizar(); });
}

const TEXTURAS = {
  1: {
    titulo: 'Texturado grueso',
    desc: 'Grano marcado, de mucho cuerpo. Disimula fisuras finas y revoques con historia, y aguanta el frente norte sin decolorarse.',
    dato: 'Ideal para: frentes de edificio y medianeras a la vista',
    cap: 'Grano 1,5 mm',
  },
  2: {
    titulo: 'Texturado fino',
    desc: 'Terminación pareja, casi lisa, con la resistencia del revestimiento plástico. El clásico de contrafrentes y patios internos.',
    dato: 'Ideal para: contrafrentes, patios y muros protegidos',
    cap: 'Grano 0,8 mm',
  },
  3: {
    titulo: 'Frente liso',
    desc: 'Acrílico exterior sobre revoque sano: color plano, sin relieve. Es la opción cuando el frente ya está bien y solo hay que renovarlo.',
    dato: 'Ideal para: frentes en buen estado y renovación de color',
    cap: 'Acrílico exterior',
  },
  4: {
    titulo: 'Interior satinado',
    desc: 'Látex satinado lavable para palieres, halls y departamentos. Se limpia con un trapo húmedo y no devuelve brillo de más.',
    dato: 'Ideal para: palieres, escaleras, departamentos y oficinas',
    cap: 'Látex satinado',
  },
};

function initTexturas() {
  const chips = document.querySelectorAll('.tex-chip');
  const layers = document.querySelectorAll('.tex-layer');
  const titulo = document.getElementById('texTitulo');
  const desc = document.getElementById('texDesc');
  const dato = document.getElementById('texDato');
  const cap = document.getElementById('texCap');
  if (!chips.length || !layers.length) return;

  const elegir = clave => {
    const data = TEXTURAS[clave];
    if (!data) return;
    chips.forEach(c => {
      const activo = c.dataset.tex === clave;
      c.classList.toggle('is-on', activo);
      c.setAttribute('aria-selected', activo ? 'true' : 'false');
    });
    layers.forEach(l => l.classList.toggle('is-on', l.dataset.tex === clave));
    if (titulo) titulo.textContent = data.titulo;
    if (desc) desc.textContent = data.desc;
    if (dato) dato.textContent = data.dato;
    if (cap) cap.textContent = data.cap;
  };

  chips.forEach(chip => chip.addEventListener('click', () => elegir(chip.dataset.tex)));
}

function initContadores() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    nums.forEach(n => { n.textContent = n.dataset.count + (n.dataset.suf || ''); });
    return;
  }
  nums.forEach(n => {
    const objetivo = parseInt(n.dataset.count, 10) || 0;
    const suf = n.dataset.suf || '';
    const estado = { v: 0 };
    gsap.to(estado, {
      v: objetivo, duration: 1.6, ease: 'power2.out',
      scrollTrigger: { trigger: n, start: 'top 88%', once: true },
      onUpdate: () => { n.textContent = Math.round(estado.v) + suf; },
      onComplete: () => { n.textContent = objetivo + suf; },
    });
  });
}

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

function initFaq() {
  const items = document.querySelectorAll('.faq details');
  if (!items.length) return;
  items.forEach(d => {
    d.addEventListener('toggle', () => {
      if (!d.open) return;
      items.forEach(otro => { if (otro !== d) otro.open = false; });
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  });
}

function initForm() {
  const form = document.getElementById('formPresupuesto');
  if (!form) return;
  const btn = document.getElementById('btnEnviar');

  const marcarError = (input, msj) => {
    const campo = input.closest('.campo');
    const salida = form.querySelector(`[data-error-for="${input.id}"]`);
    campo?.classList.toggle('invalido', Boolean(msj));
    input.setAttribute('aria-invalid', msj ? 'true' : 'false');
    if (salida) salida.textContent = msj || '';
  };

  const telInput = document.getElementById('f-tel');
  telInput?.addEventListener('input', () => {
    const limpio = telInput.value.replace(/[^\d\s+()-]/g, '');
    if (limpio !== telInput.value) telInput.value = limpio;
    marcarError(telInput, '');
  });
  document.getElementById('f-nombre')?.addEventListener('input', e => marcarError(e.target, ''));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = document.getElementById('f-nombre');
    const tel = document.getElementById('f-tel');
    let ok = true;

    if (!nombre.value.trim() || nombre.value.trim().length < 2) {
      marcarError(nombre, 'Decinos cómo te llamás.'); ok = false;
    } else marcarError(nombre, '');

    const digitos = (tel.value.match(/\d/g) || []).length;
    if (digitos < 8) {
      marcarError(tel, 'Necesitamos un teléfono para responderte.'); ok = false;
    } else marcarError(tel, '');

    if (!ok) {
      form.querySelector('.campo.invalido input')?.focus();
      return;
    }

    const textoOriginal = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = textoOriginal;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initAnio() {
  const el = document.getElementById('anio');
  if (el) el.textContent = new Date().getFullYear();
}

initTexturas();
initDescenso();
initReveals();
initHero();
initParallax();
initVida();
initContadores();
initLeeScroll();
initFaq();
initForm();
initNav();
initWspFloat();
initAnio();
