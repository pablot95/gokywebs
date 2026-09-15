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
const WA = '5491149715028';

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
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
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  const header = document.querySelector('.site-header');
  if (!toggle || !nav || !header) return;
  let bd = header.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; header.appendChild(bd); }
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
  const sync = () => { if (window.innerWidth > 768) { nav.removeAttribute('inert'); } else if (!nav.classList.contains('open')) { nav.setAttribute('inert', ''); } };
  sync();
  window.addEventListener('resize', sync, { passive: true });
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

const ESTADOS = {
  verde: {
    titulo: 'El agua se puso verde en tres días',
    causa: 'El cloro quedó por el piso y el filtro dejó de dar abasto: el alga tomó toda la pileta en menos de una semana.',
    accion: 'Tratamiento de choque, alguicida, cepillado de paredes, barrido de fondo a desagüe y revisión completa del filtrado.',
    tiempo: 'De 24 a 72 horas hasta el agua transparente.',
    ph: '6,8', cloro: '0,2 ppm', estado: 'Con algas',
    color: '#3f7a35', particulas: 0.9,
    wa: 'Hola Piletero S&J! Mi pileta está verde y quiero recuperarla.'
  },
  turbia: {
    titulo: 'Está turbia, como lechosa',
    causa: 'Hay partículas en suspensión que el filtro ya no retiene, casi siempre por carga filtrante gastada o floculación mal hecha.',
    accion: 'Floculante, decantado, barrido a desagüe y control de la carga del filtro: si está apelmazada, va grava nueva.',
    tiempo: 'Una o dos visitas, según el tamaño del vaso.',
    ph: '7,9', cloro: '0,6 ppm', estado: 'Turbia',
    color: '#9db8c9', particulas: 0.45,
    wa: 'Hola Piletero S&J! El agua de mi pileta está turbia y quiero que la vean.'
  },
  sarro: {
    titulo: 'El agua está bien, las paredes no',
    causa: 'Sarro, línea de flotación marcada y pintura descascarada: agua dura y temporadas sin vaciar el vaso.',
    accion: 'Vaciado, hidrolavado, tratamiento del vaso y, si la pintura ya no da, lijado y dos manos nuevas.',
    tiempo: 'De tres a cinco días con la pintura incluida.',
    ph: '7,6', cloro: '1,0 ppm', estado: 'Vaso gastado',
    color: '#7aa8bf', particulas: 0.2,
    wa: 'Hola Piletero S&J! Mi pileta tiene sarro y manchas en las paredes, quiero un presupuesto.'
  },
  ok: {
    titulo: 'Está impecable y quiero que siga así',
    causa: 'El agua equilibrada se mantiene sola si alguien la controla seguido: pH, cloro y filtrado en su punto.',
    accion: 'Abono con visitas programadas: limpieza, control químico y ficha del estado del agua en cada visita.',
    tiempo: 'Arrancamos esta misma semana.',
    ph: '7,4', cloro: '1,2 ppm', estado: 'Equilibrada',
    color: '#38bdf8', particulas: 0,
    wa: 'Hola Piletero S&J! Mi pileta está en buen estado y quiero un abono de mantenimiento.'
  }
};

function initDiagnostico() {
  const chips = [...document.querySelectorAll('.diag-chip')];
  const detalle = document.getElementById('diagDetalle');
  const agua = document.getElementById('vasoAgua');
  const particulas = document.getElementById('vasoParticulas');
  if (!chips.length || !detalle) return;
  const campos = {
    titulo: document.getElementById('diagTitulo'),
    causa: document.getElementById('diagCausa'),
    accion: document.getElementById('diagAccion'),
    tiempo: document.getElementById('diagTiempo'),
    ph: document.getElementById('diagPh'),
    cloro: document.getElementById('diagCloro'),
    estado: document.getElementById('diagEstado'),
    cta: document.getElementById('diagCta')
  };
  const pintar = key => {
    const d = ESTADOS[key];
    if (!d) return;
    if (agua) agua.style.fill = d.color;
    if (particulas) particulas.style.opacity = d.particulas;
    campos.titulo.textContent = d.titulo;
    campos.causa.textContent = d.causa;
    campos.accion.textContent = d.accion;
    campos.tiempo.textContent = d.tiempo;
    campos.ph.textContent = d.ph;
    campos.cloro.textContent = d.cloro;
    campos.estado.textContent = d.estado;
    campos.cta.href = `https://wa.me/${WA}?text=${encodeURIComponent(d.wa)}`;
    if (!reduceMotion) {
      detalle.classList.add('diag-fade');
      requestAnimationFrame(() => requestAnimationFrame(() => detalle.classList.remove('diag-fade')));
    }
  };
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => { c.classList.remove('is-on'); c.setAttribute('aria-pressed', 'false'); });
      chip.classList.add('is-on');
      chip.setAttribute('aria-pressed', 'true');
      pintar(chip.dataset.estado);
    });
  });
  pintar('verde');
}

const CICLO_META = [
  'Vaciado con bomba propia',
  'Hidrolavado de paredes y piso',
  'Dos manos de pintura para piletas',
  'Grava nueva y llenado',
  'Química equilibrada, pileta entregada'
];

function initCiclo() {
  const stage = document.getElementById('cicloStage');
  const svg = document.getElementById('cicloSvg');
  const lista = document.getElementById('cicloPasos');
  if (!stage || !svg || !lista) return;
  const pasos = [...lista.children];
  const metaNum = document.getElementById('cicloMetaNum');
  const metaTxt = document.getElementById('cicloMetaTxt');
  let actual = -1;
  const setStep = progreso => {
    const i = Math.max(0, Math.min(4, Math.floor(progreso * 5.0001)));
    if (i === actual) return;
    actual = i;
    pasos.forEach((li, n) => li.classList.toggle('is-on', n === i));
    if (metaNum) metaNum.textContent = String(i + 1).padStart(2, '0');
    if (metaTxt) metaTxt.textContent = CICLO_META[i];
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    svg.classList.add('is-final');
    stage.classList.add('is-static');
    lista.classList.add('is-static');
    pasos.forEach(li => li.classList.add('is-on'));
    return;
  }

  const build = () => {
    const tl = gsap.timeline();
    tl.to('#cicloAgua', { y: 215, duration: 1, ease: 'none' }, 0)
      .to('#cicloChorro', { opacity: 1, duration: .12 }, 1)
      .fromTo('#cicloChorro', { x: 0 }, { x: 296, duration: .92, ease: 'none' }, 1)
      .to('#cicloSuciedad', { opacity: 0, duration: .85, ease: 'none' }, 1.05)
      .to('#cicloChorro', { opacity: 0, duration: .12 }, 1.88)
      .to('#cicloPintura', { strokeDashoffset: 0, duration: .95, ease: 'none' }, 2)
      .to('#cicloGrava', { y: 0, duration: .5, ease: 'power1.out' }, 3)
      .to('#cicloAgua', { y: 0, duration: .6, ease: 'none' }, 3.4)
      .fromTo('#cicloTurbidez', { opacity: 0 }, { opacity: .5, duration: .6, ease: 'none' }, 3.4)
      .to('#cicloTurbidez', { opacity: 0, duration: .75, ease: 'none' }, 4)
      .to('#cicloBrillo', { opacity: 1, duration: .6 }, 4.3)
      .set('#cicloBrillo', { opacity: 1 }, 5);
    return tl;
  };

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: reduce)', () => {
    svg.classList.add('is-final');
    lista.classList.add('is-static');
    pasos.forEach(li => li.classList.add('is-on'));
  });

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    setStep(0);
    ScrollTrigger.create({
      animation: build(),
      trigger: stage,
      start: 'top top',
      end: '+=260%',
      pin: true,
      scrub: .6,
      invalidateOnRefresh: true,
      onUpdate: self => setStep(self.progress)
    });
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    actual = -1;
    setStep(0);
    ScrollTrigger.create({
      animation: build(),
      trigger: stage,
      start: 'top top',
      end: 'bottom bottom',
      scrub: .6,
      invalidateOnRefresh: true,
      onUpdate: self => setStep(self.progress)
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => stage.classList.remove('is-sticky-mobile');
  });
}

function initServPreview() {
  const wrap = document.getElementById('servPreview');
  const img = document.getElementById('servPreviewImg');
  const rows = [...document.querySelectorAll('.serv-row')];
  if (!wrap || !img || !rows.length || reduceMotion || typeof gsap === 'undefined') return;
  if (!window.matchMedia('(hover: hover) and (min-width: 1025px)').matches) return;
  gsap.set(wrap, { xPercent: -50, yPercent: -50, scale: .92, x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const xTo = gsap.quickTo(wrap, 'x', { duration: .55, ease: 'power3' });
  const yTo = gsap.quickTo(wrap, 'y', { duration: .55, ease: 'power3' });
  window.addEventListener('mousemove', e => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const src = row.dataset.img;
      if (src && img.getAttribute('src') !== src) img.setAttribute('src', src);
      gsap.to(wrap, { opacity: 1, scale: 1, duration: .35, ease: 'power2.out' });
    });
    row.addEventListener('mouseleave', () => {
      gsap.to(wrap, { opacity: 0, scale: .92, duration: .28, ease: 'power2.in' });
    });
  });
}

function initCounters() {
  const nums = [...document.querySelectorAll('[data-count]')];
  if (!nums.length) return;
  const run = el => {
    const end = parseInt(el.dataset.count, 10) || 0;
    const pre = el.dataset.prefix || '';
    const suf = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = pre + end.toLocaleString('es-AR') + suf; return; }
    const dur = 1500;
    const t0 = Date.now();
    const step = () => {
      const p = Math.min(1, (Date.now() - t0) / dur);
      const v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = pre + v.toLocaleString('es-AR') + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); } });
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
  nums.forEach(n => io.observe(n));
}

function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const nombre = form.querySelector('#cf-nombre');
  const tel = form.querySelector('#cf-tel');
  const errNombre = form.querySelector('#err-nombre');
  const errTel = form.querySelector('#err-tel');
  const boton = form.querySelector('#cfSubmit');

  tel.addEventListener('input', () => {
    const d = tel.value.replace(/\D/g, '').slice(0, 10);
    let out = d;
    if (d.length > 6) out = `${d.slice(0, 2)} ${d.slice(2, 6)}-${d.slice(6)}`;
    else if (d.length > 2) out = `${d.slice(0, 2)} ${d.slice(2)}`;
    tel.value = out;
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    errNombre.textContent = '';
    errTel.textContent = '';
    nombre.classList.remove('invalid');
    tel.classList.remove('invalid');
    if (nombre.value.trim().length < 2) {
      errNombre.textContent = 'Decinos cómo te llamás.';
      nombre.classList.add('invalid');
      nombre.setAttribute('aria-invalid', 'true');
      ok = false;
    } else nombre.removeAttribute('aria-invalid');
    if (tel.value.replace(/\D/g, '').length < 8) {
      errTel.textContent = 'Necesitamos un teléfono para responderte.';
      tel.classList.add('invalid');
      tel.setAttribute('aria-invalid', 'true');
      ok = false;
    } else tel.removeAttribute('aria-invalid');
    if (!ok) { (nombre.classList.contains('invalid') ? nombre : tel).focus(); return; }
    const txt = boton.textContent;
    boton.disabled = true;
    boton.textContent = 'Enviando…';
    setTimeout(() => {
      boton.disabled = false;
      boton.textContent = txt;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initHero() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const cutout = document.querySelector('.hero-cutout');
  const stamp = document.querySelector('.hero-stamp');
  if (cutout) {
    gsap.fromTo(cutout, { y: 46, opacity: 0, scale: .96 }, { y: 0, opacity: 1, scale: 1, duration: 1.15, delay: .35, ease: 'power3.out' });
  }
  if (stamp) {
    gsap.fromTo(stamp, { scale: .4, opacity: 0, rotate: -40 }, { scale: 1, opacity: 1, rotate: -9, duration: .9, delay: .95, ease: 'back.out(1.7)' });
  }
  if (typeof ScrollTrigger === 'undefined') return;
  const foto = document.querySelector('.hero-photo img');
  if (foto && window.matchMedia('(min-width: 769px)').matches) {
    gsap.fromTo(foto, { scale: 1.12 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.hero-band', start: 'top bottom', end: 'bottom top', scrub: .8 }
    });
  }
  const zonaFoto = document.querySelector('.zona-foto img');
  if (zonaFoto) {
    gsap.fromTo(zonaFoto, { yPercent: -5 }, {
      yPercent: 5, ease: 'none',
      scrollTrigger: { trigger: '.zona-foto', start: 'top bottom', end: 'bottom top', scrub: .7 }
    });
  }
}

function initYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

initNav();
initReveals();
initWspFloat();
initDiagnostico();
initCiclo();
initServPreview();
initCounters();
initForm();
initHero();
initYear();
