document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
const WSP = '5492976231188';

if (hasGsap) gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
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
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

function trapFoco(panel, e) {
  const focusables = panel.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
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

const FILAS = 7;
const COLUMNAS = 4;
const ACENTOS = { azul: [4, 8, 12, 21, 25], verde: [6, 15, 18, 27] };

function construirFachada() {
  const gris = document.getElementById('fachadaGris');
  const pintada = document.getElementById('fachadaPintada');
  if (!gris || !pintada) return;
  const total = FILAS * COLUMNAS;
  let hGris = '', hPintada = '';
  for (let i = 0; i < total; i++) {
    hGris += '<span class="panel"></span>';
    if (ACENTOS.azul.includes(i)) {
      hPintada += '<span class="panel solido" style="--panel:#0A1478"></span>';
    } else if (ACENTOS.verde.includes(i)) {
      hPintada += '<span class="panel solido" style="--panel:#16A34A"></span>';
    } else {
      hPintada += '<span class="panel" style="--panel:#F2F4F7;--vidrio:#AEB9C9"></span>';
    }
  }
  gris.innerHTML = hGris;
  pintada.innerHTML = hPintada;
}

function initCapitulo() {
  const cap = document.getElementById('descenso');
  const fachada = document.getElementById('fachada');
  const pintada = document.getElementById('fachadaPintada');
  const operario = document.getElementById('capOperario');
  const vida = document.getElementById('capVidaPath');
  const nivel = document.getElementById('capNivel');
  const pasos = Array.from(cap?.querySelectorAll('.paso') || []);
  if (!cap || !fachada || !pintada || !operario || !pasos.length || !hasGsap || reduceMotion) return;

  cap.classList.add('is-cap');
  const TOTAL = pasos.length;
  let current = -1;
  let nivelActual = -1;

  const setStep = p => {
    const i = Math.min(TOTAL - 1, Math.max(0, Math.floor(p * TOTAL)));
    if (i !== current) {
      current = i;
      pasos.forEach((s, k) => s.classList.toggle('is-on', k === i));
    }
    if (nivel) {
      const piso = Math.min(FILAS, Math.max(1, FILAS - Math.round(p * (FILAS - 1))));
      if (piso !== nivelActual) {
        nivelActual = piso;
        nivel.textContent = 'Piso ' + String(piso).padStart(2, '0');
      }
    }
  };

  const construir = trigger => {
    const recorrido = () => Math.max(0, fachada.offsetHeight - operario.offsetHeight);
    gsap.set(pintada, { clipPath: 'inset(0 0 100% 0)' });
    gsap.set(operario, { y: 0 });
    let largo = 0;
    if (vida) {
      largo = vida.getTotalLength();
      gsap.set(vida, { strokeDasharray: largo, strokeDashoffset: largo });
    }

    const tl = gsap.timeline({ scrollTrigger: trigger });
    if (vida) tl.to(vida, { strokeDashoffset: 0, duration: 3.3, ease: 'none' }, .25);
    tl.to(operario, { y: recorrido, duration: 3.2, ease: 'none' }, .7)
      .to(pintada, { clipPath: 'inset(0 0 0% 0)', duration: 3.2, ease: 'none' }, .7);
    tl.to({}, { duration: .3 }, TOTAL - .3);
    return tl;
  };

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px)', () => {
    const tl = construir({
      trigger: cap, start: 'top top', end: '+=300%', pin: true, scrub: .6,
      invalidateOnRefresh: true, onUpdate: self => setStep(self.progress)
    });
    current = -1; nivelActual = -1; setStep(0);
    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  });

  mm.add('(max-width: 1080px)', () => {
    cap.classList.add('is-sticky-mobile');
    requestAnimationFrame(() => ScrollTrigger.refresh());
    const tl = construir({
      trigger: cap, start: 'top top', end: 'bottom bottom', scrub: .6,
      invalidateOnRefresh: true, onUpdate: self => setStep(self.progress)
    });
    current = -1; nivelActual = -1; setStep(0);
    return () => {
      cap.classList.remove('is-sticky-mobile');
      tl.scrollTrigger?.kill(); tl.kill();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
  });
}

function initHero() {
  if (!hasGsap || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-ficha', { opacity: 0, y: 14, duration: .7 }, .05)
    .from('.hero-title .line-inner', { yPercent: 118, duration: 1.1, stagger: .1 }, .1)
    .from('.hero-lead', { opacity: 0, y: 20, duration: .85 }, .58)
    .from('.hero-cta .btn', { opacity: 0, y: 16, duration: .7, stagger: .08 }, .74)
    .from('.hero-facts li', { opacity: 0, x: -20, duration: .65, stagger: .09 }, .9)
    .from('.hero-vida', { scaleY: 0, transformOrigin: 'top center', duration: 1.1, ease: 'power2.inOut' }, .3)
    .from('.hero-operario', { opacity: 0, y: -70, duration: 1.25, ease: 'expo.out' }, .5)
    .from('.hero-mosqueton', { opacity: 0, scale: .6, duration: .55 }, 1.05)
    .from('.sello', { opacity: 0, scale: .9, duration: .75 }, 1.1);

  gsap.to('.hero-operario', {
    y: 44, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5 }
  });
}

let lbIndice = 0;
let lbObras = [];
let lbUltimoFoco = null;

function pintarLightbox() {
  const obra = lbObras[lbIndice];
  if (!obra) return;
  const img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCap');
  const original = obra.querySelector('img');
  img.src = obra.dataset.full || original?.src || '';
  img.alt = original?.alt || '';
  cap.textContent = `${obra.dataset.cap || ''} · ${lbIndice + 1} de ${lbObras.length}`;
}

function initObras() {
  const grid = document.getElementById('obrasGrid');
  const lb = document.getElementById('lightbox');
  const backdrop = document.getElementById('lbBackdrop');
  if (!grid || !lb) return;
  lbObras = Array.from(grid.querySelectorAll('.obra'));

  const abrir = i => {
    lbIndice = i;
    lbUltimoFoco = document.activeElement;
    pintarLightbox();
    lb.removeAttribute('inert');
    lb.setAttribute('aria-hidden', 'false');
    lb.classList.add('open');
    backdrop?.classList.add('open');
    document.body.classList.add('no-scroll');
    document.getElementById('lbClose')?.focus();
  };
  const cerrar = () => {
    lb.classList.remove('open');
    backdrop?.classList.remove('open');
    lb.setAttribute('inert', '');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    lbUltimoFoco?.focus();
  };
  const mover = d => { lbIndice = (lbIndice + d + lbObras.length) % lbObras.length; pintarLightbox(); };

  lbObras.forEach((obra, i) => obra.addEventListener('click', () => abrir(i)));
  document.getElementById('lbClose')?.addEventListener('click', cerrar);
  document.getElementById('lbPrev')?.addEventListener('click', () => mover(-1));
  document.getElementById('lbNext')?.addEventListener('click', () => mover(1));
  backdrop?.addEventListener('click', cerrar);

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') { cerrar(); return; }
    if (e.key === 'ArrowLeft') { mover(-1); return; }
    if (e.key === 'ArrowRight') { mover(1); return; }
    if (e.key === 'Tab') trapFoco(lb, e);
  });
}

function initForm() {
  const form = document.getElementById('formPresupuesto');
  if (!form) return;
  const reglas = [
    { id: 'f-nombre', err: 'e-nombre', test: v => v.trim().length >= 3, msg: 'Escribinos tu nombre.' },
    { id: 'f-tel', err: 'e-tel', test: v => v.replace(/\D/g, '').length >= 8, msg: 'Dejanos un teléfono para contestarte.' },
    { id: 'f-trabajo', err: 'e-trabajo', test: v => v !== '', msg: 'Elegí qué necesitás.' }
  ];

  const validarCampo = regla => {
    const campo = document.getElementById(regla.id);
    const error = document.getElementById(regla.err);
    if (!campo) return true;
    const ok = regla.test(campo.value);
    campo.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (error) error.textContent = ok ? '' : regla.msg;
    return ok;
  };

  reglas.forEach(regla => {
    const campo = document.getElementById(regla.id);
    campo?.addEventListener('blur', () => validarCampo(regla));
    campo?.addEventListener('input', () => {
      if (campo.getAttribute('aria-invalid') === 'true') validarCampo(regla);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const resultados = reglas.map(validarCampo);
    if (resultados.includes(false)) {
      showToast('Faltan datos para armar el mensaje');
      document.getElementById(reglas[resultados.indexOf(false)].id)?.focus();
      return;
    }
    const nombre = document.getElementById('f-nombre').value.trim();
    const tel = document.getElementById('f-tel').value.trim();
    const trabajo = document.getElementById('f-trabajo').value;
    const detalle = document.getElementById('f-detalle').value.trim();
    const texto = `Hola! Soy ${nombre} y quiero un presupuesto.\n\nQué necesito: ${trabajo}\nMi teléfono: ${tel}` + (detalle ? `\n\nDetalle: ${detalle}` : '');
    window.open(`https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
    showToast('Abrimos WhatsApp con tu mensaje');
  });
}

function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = String(new Date().getFullYear());
}

construirFachada();
initNav();
initReveals();
initWspFloat();
initCapitulo();
initHero();
initObras();
initForm();
initFooterYear();
