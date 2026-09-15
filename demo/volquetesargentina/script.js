const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (p, a, b) => clamp01((p - a) / (b - a));

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
  const header = document.querySelector('.site-header');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (header || document.body).appendChild(bd); }
  const desktop = window.matchMedia('(min-width: 769px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (desktop.matches) nav.removeAttribute('inert'); else nav.setAttribute('inert', '');
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
  const sync = () => { if (desktop.matches || !nav.classList.contains('open')) close(); };
  desktop.addEventListener('change', sync);
  sync();
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  let queued = false;
  const update = () => {
    queued = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? clamp01(window.scrollY / max) : 0})`;
  };
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

const MEDIDAS = {
  '3': {
    ancho: '53%',
    nombre: '3 m³ — para arreglos chicos',
    texto: 'Un baño o una cocina demolidos, cambio de cerámicos, una pared que se tira abajo. Es el que entra en frentes angostos y cuadras con poco lugar para estacionar.',
    frente: '2,60 m de frente',
    dims: '2,60 \u00d7 1,50 \u00d7 0,80 m',
    bolsas: 'unas 70 bolsas de escombro',
    ideal: 'un ambiente demolido'
  },
  '5': {
    ancho: '68%',
    nombre: '5 m³ — el más pedido',
    texto: 'Refacción completa de un departamento o un PH: contrapiso, revoques, cerámicos y carpinterías viejas. Es el que más sale porque cubre casi toda obra de casa.',
    frente: '3,30 m de frente',
    dims: '3,30 \u00d7 1,70 \u00d7 0,95 m',
    bolsas: 'unas 120 bolsas de escombro',
    ideal: 'refacción de PH o departamento'
  },
  '7': {
    ancho: '82%',
    nombre: '7 m³ — para obra grande',
    texto: 'Demolición completa, obra nueva, vaciado de una casa o limpieza de terreno con poda y tierra. Necesita una cuadra donde el camión pueda maniobrar tranquilo.',
    frente: '4,00 m de frente',
    dims: '4,00 \u00d7 1,80 \u00d7 1,10 m',
    bolsas: 'unas 170 bolsas de escombro',
    ideal: 'demolición o limpieza de lote'
  }
};

function initMedidor() {
  const tabs = document.querySelectorAll('.chapa');
  const wrap = document.getElementById('skipWrap');
  const panel = document.getElementById('panel-medida');
  if (!tabs.length || !wrap || !panel) return;
  const nombre = document.getElementById('medidaNombre');
  const texto = document.getElementById('medidaTexto');
  const frente = document.getElementById('datoFrente');
  const bolsas = document.getElementById('datoBolsas');
  const ideal = document.getElementById('datoIdeal');
  const cota = document.getElementById('cotaTxt');
  const cta = document.getElementById('medidaCta');
  const ctaTxt = document.getElementById('medidaCtaTxt');

  const aplicar = key => {
    const d = MEDIDAS[key];
    if (!d) return;
    wrap.style.width = d.ancho;
    nombre.textContent = d.nombre;
    texto.textContent = d.texto;
    frente.textContent = d.dims;
    bolsas.textContent = d.bolsas;
    ideal.textContent = d.ideal;
    cota.textContent = d.frente;
    ctaTxt.textContent = `Pedir el de ${key} m³`;
    cta.href = `https://wa.me/5491171369947?text=${encodeURIComponent(`Hola Volquetes Argentina, quiero un volquete de ${key} m³. Mi dirección es:`)}`;
    panel.setAttribute('aria-labelledby', `tab-${key}`);
    tabs.forEach(t => {
      const on = t.dataset.medida === key;
      t.classList.toggle('is-on', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  };

  tabs.forEach(t => t.addEventListener('click', () => aplicar(t.dataset.medida)));
  aplicar('5');
}

function initCiclo() {
  const stage = document.getElementById('ciclo-stage');
  if (!stage) return;
  const skip = document.getElementById('escenaSkip');
  const fill = document.getElementById('escenaFill');
  const cadena = document.getElementById('escenaCadena');
  const piso = document.getElementById('escenaPiso');
  const nivel = document.getElementById('medidorNivel');
  const num = document.getElementById('medidorNum');
  const sello = document.getElementById('escenaSello');
  const pasos = Array.from(document.querySelectorAll('#cicloPasos .paso'));
  const dots = Array.from(document.querySelectorAll('#cicloRail i'));
  let activo = -1;

  const setEscena = p => {
    const bajada = seg(p, .10, .34);
    const llenado = seg(p, .38, .76);
    const retiro = seg(p, .82, 1);
    if (skip) skip.style.transform = `translateY(${(1 - bajada) * -48 - retiro * 54}%) rotate(${retiro * -6}deg)`;
    if (fill) fill.setAttribute('transform', `translate(0,${215 - 139 * llenado})`);
    if (cadena) cadena.style.opacity = Math.max(1 - seg(p, .22, .34), seg(p, .78, .88));
    if (piso) piso.style.transform = `scaleX(${seg(p, .16, .36)})`;
    if (nivel) nivel.style.height = `${llenado * 100}%`;
    if (num) num.textContent = (llenado * 5).toFixed(1).replace('.', ',');
    if (sello) {
      const on = p > .9;
      sello.style.opacity = on ? 1 : 0;
      sello.style.transform = on ? 'scale(1) rotate(-10deg)' : 'scale(.86) rotate(-14deg)';
    }
    const i = p < .14 ? 0 : p < .38 ? 1 : p < .8 ? 2 : 3;
    if (i !== activo) {
      activo = i;
      pasos.forEach((li, n) => li.classList.toggle('is-on', n === i));
      dots.forEach((d, n) => d.classList.toggle('is-on', n === i));
    }
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    stage.classList.add('is-static');
    setEscena(.62);
    pasos.forEach(li => li.classList.add('is-on'));
    dots.forEach(d => d.classList.add('is-on'));
    return;
  }

  setEscena(0);
  const proxy = { p: 0 };
  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    const t = gsap.to(proxy, {
      p: 1, ease: 'none', onUpdate: () => setEscena(proxy.p),
      scrollTrigger: { trigger: stage, start: 'top top', end: '+=250%', pin: true, scrub: .6, invalidateOnRefresh: true }
    });
    return () => { t.scrollTrigger && t.scrollTrigger.kill(); t.kill(); };
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    requestAnimationFrame(() => ScrollTrigger.refresh());
    const t = gsap.to(proxy, {
      p: 1, ease: 'none', onUpdate: () => setEscena(proxy.p),
      scrollTrigger: { trigger: stage, start: 'top top', end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true }
    });
    return () => { t.scrollTrigger && t.scrollTrigger.kill(); t.kill(); stage.classList.remove('is-sticky-mobile'); };
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    stage.classList.add('is-static');
    setEscena(.62);
    return () => stage.classList.remove('is-static');
  });
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const heroImg = document.querySelector('.hero-foto img');
  if (heroImg) {
    gsap.fromTo(heroImg, { scale: 1.12, yPercent: -4 }, {
      scale: 1, yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: '.hero-banda', start: 'top bottom', end: 'bottom top', scrub: .8 }
    });
  }
  const flotaImg = document.querySelector('.flota-foto img');
  if (flotaImg) {
    gsap.fromTo(flotaImg, { yPercent: -7 }, {
      yPercent: 7, ease: 'none',
      scrollTrigger: { trigger: '.flota-foto', start: 'top bottom', end: 'bottom top', scrub: .8 }
    });
  }
  const halo = document.querySelector('.hero-block');
  if (halo) {
    gsap.to(halo, {
      yPercent: 16, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });
  }
}

function initContadores() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  if (reduceMotion || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      const meta = Number(el.dataset.count) || 0;
      const suf = el.dataset.suffix || '';
      const dur = 1100;
      let t0 = null;
      const tick = now => {
        if (t0 === null) t0 = now;
        const k = clamp01((now - t0) / dur);
        el.textContent = Math.round(meta * (1 - Math.pow(1 - k, 3))) + suf;
        if (k < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0' + suf;
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  nums.forEach(n => io.observe(n));
}

function initForm() {
  const form = document.getElementById('contactoForm');
  if (!form) return;
  const btn = document.getElementById('formBtn');
  const setError = (input, msg) => {
    const span = form.querySelector(`[data-error-for="${input.id}"]`);
    if (span) span.textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (msg) input.setAttribute('aria-describedby', `err-${input.id}`);
  };
  form.querySelectorAll('input').forEach(i => i.addEventListener('input', () => setError(i, '')));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = form.querySelector('#f-nombre');
    const tel = form.querySelector('#f-tel');
    const zona = form.querySelector('#f-zona');
    let ok = true;
    if (nombre.value.trim().length < 2) { setError(nombre, 'Escribí tu nombre'); ok = false; }
    const soloNums = tel.value.replace(/\D/g, '');
    if (soloNums.length < 8) { setError(tel, 'Dejanos un WhatsApp con característica'); ok = false; }
    if (zona.value.trim().length < 3) { setError(zona, 'Decinos el barrio o la dirección'); ok = false; }
    if (!ok) { form.querySelector('[aria-invalid="true"]')?.focus(); return; }

    const txt = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = txt;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 850);
  });
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = [-34.62, -58.44];
  const map = L.map(el, { scrollWheelZoom: false, zoomControl: true }).setView(centro, 10);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 18
  }).addTo(map);
  L.circle(centro, { radius: 27000, color: '#2563eb', weight: 2, fillColor: '#2563eb', fillOpacity: .1 }).addTo(map);
  L.circleMarker([-34.6037, -58.3816], { radius: 8, color: '#ffffff', weight: 3, fillColor: '#2563eb', fillOpacity: 1 }).addTo(map);
}

function initAnio() {
  const el = document.getElementById('anio');
  if (el) el.textContent = new Date().getFullYear();
}

initReveals();
initNav();
initWspFloat();
initScrollProgress();
initMedidor();
initCiclo();
initParallax();
initContadores();
initForm();
initMapa();
initAnio();

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
document.querySelectorAll('.faq details').forEach(d => {
  d.addEventListener('toggle', () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); });
});
