const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let revealsListos = false;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const WSP = '5491126046102';
const TRAMITES = {
  "rehabilitacion": {
    "chip": "Me cortaron el gas",
    "tag": "Rehabilitación del servicio",
    "que": "La distribuidora cortó el suministro por una pérdida o por una instalación fuera de norma.",
    "pasos": [
      "Revisamos la instalación y reparamos lo que motivó el corte.",
      "Hacemos la prueba de hermeticidad.",
      "Presentamos la documentación y pedimos la inspección para rehabilitar el servicio."
    ],
    "tener": [
      "La notificación que dejó la distribuidora",
      "Tu número de cliente de Metrogas (está en la factura)",
      "Fotos de los artefactos y de la llave de paso"
    ],
    "foto": "cano-gas-llave",
    "alt": "Cañería de gas amarilla con llave de paso sobre una pared"
  },
  "nueva": {
    "chip": "Conexión nueva",
    "tag": "Alta de instalación",
    "que": "Una casa, un departamento o un local que va a tener gas natural por primera vez.",
    "pasos": [
      "Consultamos la factibilidad del servicio en tu dirección.",
      "Hacemos los planos y la instalación.",
      "Gestionamos las inspecciones hasta la habilitación."
    ],
    "tener": [
      "La dirección exacta del inmueble",
      "Un plano o croquis, si lo tenés",
      "Qué artefactos vas a conectar"
    ],
    "foto": "anafe",
    "alt": "Anafe a gas de cuatro hornallas en una mesada clara"
  },
  "artefactos": {
    "chip": "Sumar o cambiar artefactos",
    "tag": "Modificación de la instalación",
    "que": "Agregar un calefón, una estufa o una cocina, o mover una instalación que ya existe.",
    "pasos": [
      "Vemos si la instalación actual soporta el consumo nuevo.",
      "Adecuamos cañerías y ventilaciones.",
      "Actualizamos los planos y la habilitación ante Metrogas."
    ],
    "tener": [
      "Marca y modelo del artefacto nuevo",
      "Fotos del lugar donde va a ir",
      "Tu número de cliente de Metrogas"
    ],
    "foto": "calefon",
    "alt": "Calefón blanco instalado en la pared con sus conexiones de gas y agua"
  },
  "regularizar": {
    "chip": "Regularizar una instalación",
    "tag": "Planos y regularización",
    "que": "Una instalación hecha sin planos aprobados o con cambios que nunca se presentaron.",
    "pasos": [
      "Relevamos la instalación tal como está hoy.",
      "Adecuamos lo que no cumple la norma.",
      "Hacemos los planos y la presentamos para regularizarla."
    ],
    "tener": [
      "Planos anteriores, si existen",
      "Tu número de cliente de Metrogas",
      "Fotos de los artefactos instalados"
    ],
    "foto": "herramientas",
    "alt": "Llaves de caño, pinza y conexiones de bronce sobre una mesa de trabajo"
  }
};

const wa = txt => `https://wa.me/${WSP}?text=${encodeURIComponent(txt)}`;
const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

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
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 961px)');
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

function initReveals() {
  revealsListos = true;
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

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const imgs = hero.querySelectorAll('[data-hero-img]');
  if (imgs.length) tl.from(imgs, { scale: 1.1, duration: 1.8, stagger: 0.08, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-badge, .mitad__rotulo'), { scale: 0.94, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7);
}

function initRedes() {
  const llave = document.querySelector('.llave');
  if (!llave) return;
  const tabs = [...llave.querySelectorAll('[role="tab"]')];
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    llave.dataset.red = tab.dataset.red;
    if (foco) tab.focus();
    revelarNuevos(document.getElementById(tab.getAttribute('aria-controls')));
    refrescar();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const paso = e.key === 'ArrowRight' ? 1 : tabs.length - 1;
      activar(tabs[(i + paso) % tabs.length], true);
    });
  });
  document.querySelectorAll('a[data-red]').forEach(a => {
    a.addEventListener('click', () => {
      const t = tabs.find(x => x.dataset.red === a.dataset.red);
      if (t) activar(t);
    });
  });
}

function initGuia() {
  const res = document.getElementById('guiaResultado');
  if (!res) return;
  const foto = document.getElementById('guiaFoto');
  const tag = document.querySelector('#guiaTag span');
  const titulo = document.getElementById('guiaTitulo');
  const que = document.getElementById('guiaQue');
  const pasos = document.getElementById('guiaPasos');
  const tener = document.getElementById('guiaTener');
  const link = document.getElementById('guiaWsp');
  const loc = document.getElementById('guiaLocalidad');
  const check = '<svg class="ico" aria-hidden="true"><use href="#i-check"></use></svg>';
  let actual = 'rehabilitacion';

  const mensaje = () => {
    const t = TRAMITES[actual];
    const tipo = document.querySelector('input[name="inmueble"]:checked')?.value || 'Casa';
    const lugar = (loc?.value || '').trim();
    let txt = `Hola Deltagas & agua, necesito ayuda con un trámite en Metrogas.\nSituación: ${t.chip}\nInmueble: ${tipo}`;
    if (lugar) txt += `\nLocalidad: ${lugar}`;
    link.href = wa(txt);
  };

  const pintar = key => {
    const t = TRAMITES[key];
    if (!t) return;
    actual = key;
    tag.textContent = t.tag;
    titulo.textContent = t.chip;
    que.textContent = t.que;
    pasos.innerHTML = t.pasos.map(p => `<li>${esc(p)}</li>`).join('');
    tener.innerHTML = t.tener.map(p => `<li>${check}<span>${esc(p)}</span></li>`).join('');
    foto.src = `images/${t.foto}-640.webp`;
    foto.alt = t.alt;
    if (!reduceMotion) {
      res.classList.remove('cambio');
      void res.offsetWidth;
      res.classList.add('cambio');
    }
    mensaje();
    refrescar();
  };

  document.querySelectorAll('input[name="tramite"]').forEach(r => r.addEventListener('change', () => pintar(r.value)));
  document.querySelectorAll('input[name="inmueble"]').forEach(r => r.addEventListener('change', mensaje));
  loc?.addEventListener('input', mensaje);
  link.addEventListener('click', () => showToast('Abrimos WhatsApp con tu consulta lista para enviar.'));
  const marcado = document.querySelector('input[name="tramite"]:checked');
  if (marcado && marcado.value !== actual) pintar(marcado.value);
  else mensaje();
}

function initFaq() {
  document.querySelectorAll('.faq__item').forEach(d => d.addEventListener('toggle', refrescar));
}

initRedes();
initGuia();
initFaq();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
