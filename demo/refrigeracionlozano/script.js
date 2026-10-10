document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493516763737';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const ICONO_FRIO = '<path d="M2 12h20M12 2v20m8-6-4-4 4-4M4 8l4 4-4 4M16 4l-4 4-4-4m0 16 4-4 4 4"/>';
const ICONO_CALOR = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>';

const TEMPORADAS = {
  primavera: {
    nota: 'Primavera: el service, antes del calor',
    cta: 'Pedir el service de primavera',
    msg: 'Hola Refrigeración Lozano, quiero pedir el service de primavera para mi aire acondicionado.',
    modo: 'Frío', icono: ICONO_FRIO, desde: 30, temp: 24
  },
  verano: {
    nota: 'Verano: si no enfría, lo revisamos',
    cta: 'Pedir una revisión de verano',
    msg: 'Hola Refrigeración Lozano, mi aire acondicionado necesita una revisión. ¿Pueden venir a verlo?',
    modo: 'Frío', icono: ICONO_FRIO, desde: 32, temp: 24
  },
  otono: {
    nota: 'Otoño: la limpieza después del verano',
    cta: 'Pedir la limpieza de otoño',
    msg: 'Hola Refrigeración Lozano, quiero pedir la limpieza o la desinstalación de mi aire acondicionado.',
    modo: 'Frío', icono: ICONO_FRIO, desde: 27, temp: 24
  },
  invierno: {
    nota: 'Invierno: frío/calor revisado',
    cta: 'Pedir la revisión de invierno',
    msg: 'Hola Refrigeración Lozano, quiero pedir una revisión de invierno para mi aire acondicionado.',
    modo: 'Calor', icono: ICONO_CALOR, desde: 15, temp: 22
  }
};

const SINTOMAS = {
  'no-enfria': {
    codigo: 'No enfría', servicio: 'Reparación y cargas de gas', foto: 'reparacion',
    alt: 'Técnico midiendo con un multímetro las conexiones de la unidad interior abierta',
    revisa: ['Filtros y serpentina', 'Carga de gas y posibles pérdidas', 'Capacitor, forzador y placa'],
    frase: eq => `Mi aire ${eq} no enfría.`, pedido: 'revisarlo'
  },
  gotea: {
    codigo: 'Gotea agua', servicio: 'Mantenimiento y limpieza', foto: 'limpieza',
    alt: 'Técnico rociando con limpiador el filtro de un split desarmado sobre la mesa de trabajo',
    revisa: ['Desagote y bandeja', 'Nivel de la unidad interior', 'Filtros y serpentina'],
    frase: eq => `Mi aire ${eq} gotea agua adentro.`, pedido: 'revisarlo'
  },
  ruido: {
    codigo: 'Ruido', servicio: 'Mantenimiento y reparación', foto: 'limpieza',
    alt: 'Técnico rociando con limpiador el filtro de un split desarmado sobre la mesa de trabajo',
    revisa: ['Turbina y forzador', 'Amure de las dos unidades', 'Gomas y tornillería'],
    frase: eq => `Mi aire ${eq} hace ruido o vibra.`, pedido: 'revisarlo'
  },
  olor: {
    codigo: 'Olor feo', servicio: 'Limpieza e hidrolavado', foto: 'limpieza',
    alt: 'Técnico rociando con limpiador el filtro de un split desarmado sobre la mesa de trabajo',
    revisa: ['Turbina y serpentina', 'Bandeja y desagote', 'Filtros'],
    frase: eq => `Mi aire ${eq} larga olor feo.`, pedido: 'limpiarlo'
  },
  'se-corta': {
    codigo: 'Se corta', servicio: 'Electricidad y placas', foto: 'reparacion',
    alt: 'Técnico midiendo con un multímetro las conexiones de la unidad interior abierta',
    revisa: ['Alimentación, térmica y conexiones', 'Placa electrónica', 'Sensores y comunicación entre unidades'],
    frase: eq => `Mi aire ${eq} no prende o se corta.`, pedido: 'revisarlo'
  },
  error: {
    codigo: 'Error en display', servicio: 'Inverter y placas electrónicas', foto: 'inverter',
    alt: 'Técnico midiendo la placa electrónica de una unidad exterior inverter',
    revisa: ['Lectura del código de error', 'Placas de la unidad interior y exterior', 'Sensores de temperatura'],
    frase: eq => `Mi aire ${eq} tira un error en el display.`, pedido: 'revisarlo'
  },
  instalar: {
    codigo: 'Instalación', servicio: 'Instalación', foto: 'instalacion',
    alt: 'Técnico subido a una escalera amurando la unidad interior de un split nuevo',
    revisa: ['Lugar de las dos unidades', 'Recorrido de la cañería y el desagote', 'Línea eléctrica para el equipo'],
    frase: eq => `Quiero instalar un aire ${eq}.`, pedido: 'ver el lugar'
  },
  mudanza: {
    codigo: 'Mudanza', servicio: 'Desinstalación y reinstalación', foto: 'instalacion',
    alt: 'Técnico subido a una escalera amurando la unidad interior de un split nuevo',
    revisa: ['Gas recuperado en la unidad exterior', 'Desarme sin dañar los caños', 'Instalación en el lugar nuevo'],
    frase: eq => `Necesito sacar o mover mi aire ${eq}.`, pedido: 'sacarlo'
  }
};

const EQUIPOS = { split: 'split', inverter: 'inverter', nose: 'acondicionado' };
const FRANJAS = { manana: ' a la mañana', tarde: ' a la tarde', cualquiera: '' };
const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

function initModelBarScroll() {
  const bar = document.querySelector('.gw-modelos');
  if (!bar) return;
  let showTimer = 0;
  let frame = 0;
  const update = () => {
    frame = 0;
    if (window.scrollY <= 8) {
      bar.classList.remove('gw-modelos--scrolling');
      return;
    }
    bar.classList.add('gw-modelos--scrolling');
    clearTimeout(showTimer);
    showTimer = setTimeout(() => bar.classList.remove('gw-modelos--scrolling'), 120);
  };
  window.addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
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
  const desktopMq = window.matchMedia('(min-width: 900px)');
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function estacionActual(d = new Date()) {
  const m = d.getMonth();
  if (m >= 8 && m <= 10) return 'primavera';
  if (m === 11 || m <= 1) return 'verano';
  if (m >= 2 && m <= 4) return 'otono';
  return 'invierno';
}

function initTemporada() {
  const key = estacionActual();
  const t = TEMPORADAS[key];
  document.querySelectorAll('.estacion').forEach(li => li.classList.toggle('is-now', li.dataset.estacion === key));
  document.querySelectorAll('[data-temporada-nota]').forEach(el => { el.textContent = t.nota; });
  document.querySelectorAll('[data-temporada-cta]').forEach(a => {
    a.href = wspHref(t.msg);
    const label = a.querySelector('[data-temporada-label]');
    if (label) label.textContent = t.cta;
  });
  document.querySelectorAll('.sello .display-modo').forEach(el => {
    const svg = el.querySelector('svg');
    if (svg) svg.innerHTML = t.icono;
    el.lastChild.textContent = t.modo;
  });
  return t;
}

function initDisplayTemp(t) {
  const el = document.querySelector('[data-temp]');
  if (!el || !t) return;
  el.textContent = t.temp;
  if (reduceMotion || typeof gsap === 'undefined') return;
  const v = { n: t.desde };
  el.textContent = t.desde;
  gsap.to(v, {
    n: t.temp, duration: 1.7, delay: 0.9, ease: 'power2.out',
    onUpdate: () => { el.textContent = Math.round(v.n); }
  });
}

function initTabs() {
  const list = document.querySelector('.tabs');
  if (!list) return;
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const select = (tab, focus) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !on;
      panel.classList.remove('is-entering');
      if (on && !reduceMotion) {
        void panel.offsetWidth;
        panel.classList.add('is-entering');
      }
    });
    if (focus) tab.focus();
    const left = tab.offsetLeft - parseFloat(window.getComputedStyle(list).paddingLeft || '0');
    if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: Math.max(0, left), behavior: reduceMotion ? 'auto' : 'smooth' });
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t, false));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); select(tabs[j], true); }
    });
  });
}

function initDiagnostico() {
  const form = document.getElementById('diagForm');
  if (!form) return;
  const codigo = document.getElementById('diagCodigo');
  const servicio = document.getElementById('diagServicio');
  const foto = document.getElementById('diagFoto');
  const revisa = document.getElementById('diagRevisa');
  const mensaje = document.getElementById('diagMensaje');
  const cta = document.getElementById('diagCta');
  const zona = form.querySelector('input[name="zona"]');
  let actual = null;

  const valor = name => form.querySelector(`input[name="${name}"]:checked`)?.value;

  const armar = () => {
    const key = valor('sintoma') || 'no-enfria';
    const s = SINTOMAS[key];
    if (!s) return;
    const eq = EQUIPOS[valor('equipo')] || 'acondicionado';
    const franja = FRANJAS[valor('franja')] ?? '';
    const lugar = (zona?.value || '').trim().replace(/\s+/g, ' ').slice(0, 60);
    const texto = `Hola Refrigeración Lozano. ${s.frase(eq)}${lugar ? ` Estoy en ${lugar}.` : ''} ¿Podrían venir${franja} a ${s.pedido}?`;

    if (key !== actual) {
      actual = key;
      codigo.textContent = s.codigo;
      servicio.textContent = s.servicio;
      foto.src = `images/${s.foto}-600.webp`;
      foto.alt = s.alt;
      revisa.innerHTML = s.revisa.map(r => `<li>${CHECK}<span>${r}</span></li>`).join('');
      if (!reduceMotion && codigo.animate) {
        codigo.animate([{ opacity: 0, transform: 'translateY(8px)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 420, easing: 'cubic-bezier(0.2, 0.9, 0.25, 1)' });
        revisa.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(0.2, 0.9, 0.25, 1)' });
      }
    }
    mensaje.textContent = texto;
    cta.href = wspHref(texto);
  };

  form.addEventListener('change', armar);
  zona?.addEventListener('input', armar);
  armar();
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const entrar = (el, n) => {
    const d = Math.min(n * 0.1, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  };
  const io = new IntersectionObserver(entries => {
    let n = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) { entrar(entry.target, n++); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    let n = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { entrar(el, n++); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  requestAnimationFrame(() => requestAnimationFrame(queueSweep));
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-marca, .hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const hero = document.querySelector('.hero--split');
  const img = hero?.querySelector('[data-hero-img]');
  if (!img) return;
  gsap.fromTo(img, { yPercent: -3 }, {
    yPercent: 3, ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
  });
}

function initDetails() {
  document.querySelectorAll('details').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

initModelBarScroll();
initNav();
initWspFloat();
const temporadaActual = initTemporada();
initDisplayTemp(temporadaActual);
initTabs();
initDiagnostico();
initReveals();
initHeroMotion();
initParallax();
initDetails();
