const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491133452186';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

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

function initProgress() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  let queued = false;
  const update = () => {
    queued = false;
    const alto = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${alto > 0 ? Math.min(100, (window.scrollY / alto) * 100) : 0}%`;
  };
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

const DIAG_COLORES = {
  azul: {
    nivel: 'ok',
    estado: 'Combustión correcta',
    titulo: 'La llama azul es la que buscamos',
    texto: 'Azul, corta y pareja: el artefacto está quemando bien y la mezcla de aire y gas está en su punto. Lo que corresponde es mantenerla así.',
    cta: 'Coordinar la revisión anual',
    accion: 'la revisión anual'
  },
  amarilla: {
    nivel: 'medio',
    estado: 'Combustión incompleta',
    titulo: 'Amarilla quiere decir que algo se está tapando',
    texto: 'La llama se pone amarilla cuando le falta aire o el quemador está sucio. En ese estado el artefacto puede empezar a generar monóxido de carbono, que no se ve ni se huele.',
    cta: 'Pedir una revisión',
    accion: 'una revisión'
  },
  naranja: {
    nivel: 'alto',
    estado: 'Apagalo y ventilá',
    titulo: 'Naranja y con hollín: no lo uses hasta que lo vea alguien',
    texto: 'El hollín y la llama anaranjada son señal de una combustión mala y sostenida. Cerrá el artefacto, ventilá el ambiente y no lo vuelvas a encender hasta que lo revise un matriculado.',
    cta: 'Avisar ahora',
    accion: 'una visita urgente'
  }
};

const DIAG_ARTEFACTOS = {
  cocina: {
    nombre: 'la cocina',
    etiqueta: 'una cocina',
    ok: 'Service preventivo de la cocina: control de llama en cada hornalla, estado de inyectores y prueba de pérdidas en la conexión.',
    medio: 'Limpieza y regulación de quemadores e inyectores, más control de la ventilación del ambiente donde está la cocina.',
    alto: 'Revisión urgente de la cocina: quemadores, inyectores, conexión flexible y ventilación del ambiente.'
  },
  calefon: {
    nombre: 'el calefón',
    etiqueta: 'un calefón',
    ok: 'Service preventivo del calefón: control de piloto, quemador, tiraje y estado del conducto de evacuación.',
    medio: 'Destapado del quemador y del piloto, y control del conducto de evacuación y de la ventilación reglamentaria del ambiente.',
    alto: 'Revisión urgente del calefón: conducto de evacuación, tiraje y ventilación. Es el artefacto donde una mala combustión más rápido se vuelve peligrosa.'
  },
  termotanque: {
    nombre: 'el termotanque',
    etiqueta: 'un termotanque',
    ok: 'Service preventivo del termotanque: piloto, termostato, quemador y estado de la salida de gases.',
    medio: 'Limpieza del quemador y del piloto, control del termostato y verificación de la salida de gases y la ventilación.',
    alto: 'Revisión urgente del termotanque: salida de gases, ventilación del ambiente y estado general del quemador.'
  },
  estufa: {
    nombre: 'la estufa o caldera',
    etiqueta: 'una estufa o caldera',
    ok: 'Service preventivo antes del invierno: quemador, tiro balanceado, purgado de radiadores y prueba de pérdidas.',
    medio: 'Limpieza del quemador y control del tiro balanceado o del conducto, más revisión de pérdidas en la instalación.',
    alto: 'Revisión urgente de la estufa o caldera: conducto de evacuación, tiro balanceado y ventilación del ambiente.'
  }
};

function initDiagnostico() {
  const panel = document.getElementById('diagResultado');
  const llama = document.getElementById('llamaDiag');
  const gColor = document.getElementById('chipsColor');
  const gArt = document.getElementById('chipsArtefacto');
  if (!panel || !llama || !gColor || !gArt) return;

  const elEstado = document.getElementById('diagEstado');
  const elTitulo = document.getElementById('diagTitulo');
  const elTexto = document.getElementById('diagTexto');
  const elServicio = document.getElementById('diagServicio');
  const elWsp = document.getElementById('diagWsp');
  const elWspTxt = document.getElementById('diagWspTxt');

  let color = 'azul';
  let artefacto = 'cocina';

  const pintar = (animar) => {
    const c = DIAG_COLORES[color];
    const a = DIAG_ARTEFACTOS[artefacto];
    if (!c || !a) return;
    llama.dataset.estado = color;
    panel.dataset.nivel = c.nivel;
    elEstado.textContent = c.estado;
    elTitulo.textContent = c.titulo;
    elTexto.textContent = c.texto;
    elServicio.textContent = a[c.nivel] || '';
    elWspTxt.textContent = c.cta;
    const msg = `Hola, te escribo desde la web. Tengo ${a.etiqueta} y la llama se ve ${color === 'azul' ? 'azul y pareja' : color === 'amarilla' ? 'amarilla' : 'anaranjada, con hollín'}. Quería coordinar ${c.accion}.`;
    elWsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
    if (animar && !reduceMotion) {
      panel.classList.remove('diag-swap');
      void panel.offsetWidth;
      panel.classList.add('diag-swap');
    }
  };

  const marcar = (grupo, btn) => {
    grupo.querySelectorAll('.chip').forEach(c => {
      const on = c === btn;
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  };

  gColor.addEventListener('click', e => {
    const btn = e.target.closest('.chip');
    if (!btn || !btn.dataset.color) return;
    color = btn.dataset.color;
    marcar(gColor, btn);
    pintar(true);
  });
  gArt.addEventListener('click', e => {
    const btn = e.target.closest('.chip');
    if (!btn || !btn.dataset.artefacto) return;
    artefacto = btn.dataset.artefacto;
    marcar(gArt, btn);
    pintar(true);
  });

  pintar(false);
}

function initProceso() {
  const stage = document.getElementById('procStage');
  if (!stage) return;
  const pasos = [...stage.querySelectorAll('.proc-paso')];
  const fotos = [...stage.querySelectorAll('.proc-img')];
  const marca = document.getElementById('procPaso');
  if (!pasos.length || !fotos.length) return;

  let actual = -1;
  const setPaso = i => {
    if (i === actual || i < 0) return;
    actual = i;
    pasos.forEach((p, n) => p.classList.toggle('is-on', n === i));
    fotos.forEach((f, n) => f.classList.toggle('is-on', n === i));
    if (marca) marca.textContent = String(i + 1).padStart(2, '0');
  };

  let ultimo = 0;
  const calcular = () => {
    ultimo = Date.now();
    const centro = window.innerHeight * 0.55;
    let mejor = 0;
    let dist = Infinity;
    pasos.forEach((p, i) => {
      const r = p.getBoundingClientRect();
      const d = Math.abs((r.top + r.height / 2) - centro);
      if (d < dist) { dist = d; mejor = i; }
    });
    setPaso(mejor);
  };
  const queue = () => { if (Date.now() - ultimo >= 70) calcular(); };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  window.addEventListener('load', queue);
  setPaso(0);
  queue();
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
      }
    });
  });
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const capas = [
    { sel: '.hero-campo', y: 46 },
    { sel: '.hero-llama', y: 26 }
  ];
  capas.forEach(({ sel, y }) => {
    const el = document.querySelector(sel);
    if (!el) return;
    gsap.to(el, {
      y, ease: 'none', force3D: true,
      scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: .8, invalidateOnRefresh: true }
    });
  });
  [['.mat-foto img', 1.14], ['.hero-foto img', 1.08]].forEach(([sel, desde]) => {
    const foto = document.querySelector(sel);
    if (!foto) return;
    gsap.fromTo(foto, { scale: desde }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: foto, start: 'top bottom', end: 'bottom top', scrub: 1, invalidateOnRefresh: true }
    });
  });
}

function initMapa() {
  const cont = document.getElementById('mapa');
  if (!cont || typeof L === 'undefined') return;
  const centro = [-34.6037, -58.3816];
  const mapa = L.map(cont, { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView(centro, 12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap'
  }).addTo(mapa);
  L.circle(centro, {
    radius: 8200, color: '#2563EB', weight: 2, fillColor: '#2563EB', fillOpacity: .1
  }).addTo(mapa);
  L.circleMarker(centro, {
    radius: 9, color: '#000000', weight: 3, fillColor: '#2563EB', fillOpacity: 1
  }).addTo(mapa).bindPopup('Trabajo en toda la Ciudad de Buenos Aires');
  setTimeout(() => mapa.invalidateSize(), 350);
}

const GKY_SLUG_ACENTOS = { "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "ñ": "n", "ü": "u" };
function gkySlugify(s) {
  return String(s || "").toLowerCase()
    .replace(/[áéíóúñü]/g, c => GKY_SLUG_ACENTOS[c] || c)
    .replace(/[^a-z0-9]/g, "");
}

function initFeedbackFloat() {
  const GKY_FEEDBACK_WHATSAPP = "5491125068578";
  const btn = document.getElementById('feedback-float');
  const backdrop = document.getElementById('feedback-modal-backdrop');
  const closeBtn = document.getElementById('feedback-modal-close');
  const coloresEl = document.getElementById('feedback-colores');
  const contenidoEl = document.getElementById('feedback-contenido');
  const otrosEl = document.getElementById('feedback-otros');
  const submitBtn = document.getElementById('feedback-submit');
  if (!btn || !backdrop) return;

  const open = () => {
    backdrop.hidden = false;
    window.lenis?.stop();
    document.body.classList.add('no-scroll');
    coloresEl?.focus();
  };
  const close = () => {
    backdrop.hidden = true;
    window.lenis?.start();
    document.body.classList.remove('no-scroll');
    btn.focus();
  };
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

  submitBtn.addEventListener('click', () => {
    const colores = coloresEl.value.trim();
    const contenido = contenidoEl.value.trim();
    const otros = otrosEl.value.trim();
    if (!colores && !contenido && !otros) { coloresEl.focus(); return; }

    const slugUrl = (location.pathname.match(/\/demo\/([^/]+)/) || [])[1] || document.title;
    const slug = gkySlugify(slugUrl);
    const negocio = (document.title.split(/\s[—|]\s|\s-\s/)[0] || document.title || '').trim();
    const lineas = [
      `Devolución de la demo${negocio ? ' — ' + negocio : ''}`,
      colores ? `Colores: ${colores}` : null,
      contenido ? `Contenido: ${contenido}` : null,
      otros ? `Otros: ${otros}` : null,
      location.href
    ].filter(Boolean);

    window.open(`https://wa.me/${GKY_FEEDBACK_WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
    window.__gkySendResena?.({ slug, negocio, colores, contenido, otros, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la devolución en Firestore:', err));

    if (typeof showToast === 'function') showToast('¡Gracias por tu devolución!'); else window.alert('¡Gracias por tu devolución!');
    close();
    coloresEl.value = ''; contenidoEl.value = ''; otrosEl.value = '';
  });
}

function initAnio() {
  const el = document.getElementById('anio');
  if (el) el.textContent = new Date().getFullYear();
}

initDiagnostico();
initProceso();
initReveals();
initNav();
initWspFloat();
initProgress();
initLeeScroll();
initParallax();
initMapa();
initFeedbackFloat();
initAnio();
