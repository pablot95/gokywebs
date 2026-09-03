const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493515159142';

const SERVICIOS = [
  { id: 1, folio: '01', img: 'images/certificacion.webp', alt: 'Mano firmando una certificación de ingresos sobre el escritorio', nombre: 'Certificación de ingresos',
    desc: 'Para el crédito, el alquiler o el trámite donde te la pidan. Firmada y con la legalización del Consejo.',
    cad: 'A pedido', tipo: 'evento', perfil: ['dependencia', 'monotributo', 'inscripto', 'certificar'] },
  { id: 2, folio: '02', img: 'images/calculadora.webp', alt: 'Manos calculando sobre papeles de trabajo', nombre: 'Liquidación de Ganancias',
    desc: 'El cálculo anual, las deducciones que te corresponden y la presentación en término.',
    cad: 'Anual', tipo: 'evento', perfil: ['dependencia', 'inscripto', 'empresa', 'impuestos'] },
  { id: 3, folio: '03', img: 'images/liquidaciones.webp', alt: 'Carpetas de documentación y calculadora listas para liquidar', nombre: 'Liquidación de IVA',
    desc: 'Compras, ventas y saldo del período, mes a mes, sin que se te pase la fecha de vencimiento.',
    cad: 'Mensual', tipo: 'mensual', perfil: ['inscripto', 'empresa', 'impuestos'] },
  { id: 4, folio: '04', img: 'images/personal.webp', alt: 'Grupo de empleados de un comercio junto a la computadora', nombre: 'Liquidación de sueldos',
    desc: 'Recibos, cargas sociales y ART de todo el personal, listos para firmar antes de fin de mes.',
    cad: 'Mensual', tipo: 'mensual', perfil: ['empresa', 'sueldos'] },
  { id: 5, folio: '05', img: 'images/tramites.webp', alt: 'Entrega de documentación de alta de personal sobre el escritorio', nombre: 'Altas y bajas de personal',
    desc: 'Alta temprana, baja, cambios de categoría y la comunicación a cada organismo, el mismo día.',
    cad: 'Al momento', tipo: 'evento', perfil: ['empresa', 'sueldos', 'arrancar'] },
  { id: 6, folio: '06', img: 'images/cuaderno.webp', alt: 'Anteojos y cuaderno de anotaciones del estudio', nombre: 'Ingresos Brutos',
    desc: 'Régimen local o convenio multilateral: la declaración provincial presentada y al día.',
    cad: 'Mensual', tipo: 'mensual', perfil: ['monotributo', 'inscripto', 'empresa', 'impuestos'] },
  { id: 7, folio: '07', img: 'images/consulta.webp', alt: 'Primera reunión con un cliente nuevo en el estudio', nombre: 'Inscripciones y altas de CUIT',
    desc: 'Monotributo, responsable inscripto o empleador: te damos de alta y quedás operativo para facturar.',
    cad: 'Una vez', tipo: 'evento', perfil: ['monotributo', 'inscripto', 'empresa', 'arrancar'] },
];

const CADENCIAS = {
  dependencia: [
    { q: 'Liquidación de Ganancias', c: 'Una vez al año' },
    { q: 'Deducciones del período', c: 'Una vez al año' },
    { q: 'Certificación de ingresos', c: 'Cuando la pidas' },
  ],
  monotributo: [
    { q: 'Recategorización', c: 'Dos veces al año' },
    { q: 'Ingresos Brutos', c: 'Todos los meses' },
    { q: 'Certificación de ingresos', c: 'Cuando la pidas' },
  ],
  inscripto: [
    { q: 'Liquidación de IVA', c: 'Todos los meses' },
    { q: 'Ingresos Brutos', c: 'Todos los meses' },
    { q: 'Liquidación de Ganancias', c: 'Una vez al año' },
  ],
  empresa: [
    { q: 'Sueldos y cargas sociales', c: 'Todos los meses' },
    { q: 'Liquidación de IVA', c: 'Todos los meses' },
    { q: 'Ganancias del ejercicio', c: 'Una vez al año' },
  ],
};

const FRASES = {
  dependencia: 'trabajo en relación de dependencia',
  monotributo: 'soy monotributista',
  inscripto: 'soy responsable inscripto',
  empresa: 'tengo una empresa con empleados',
  certificar: 'necesito certificar mis ingresos',
  impuestos: 'quiero ponerme al día con los impuestos',
  sueldos: 'necesito ordenar los sueldos del personal',
  arrancar: 'estoy arrancando de cero',
};

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

/* ---------- servicios ---------- */

function initServicios() {
  const cont = document.getElementById('serv-lista');
  if (!cont) return;
  cont.innerHTML = SERVICIOS.map(s => `<li class="serv" data-animate="renglon" style="opacity:0">
    <div class="serv-in">
      <img class="serv-thumb" src="${s.img}" alt="${esc(s.alt)}" width="1200" height="1200" decoding="async">
      <span class="serv-folio">${esc(s.folio)}</span>
      <div class="serv-txt">
        <h3 class="serv-nombre">${esc(s.nombre)}</h3>
        <p class="serv-desc">${esc(s.desc)}</p>
      </div>
      <span class="serv-tag" data-cad="${s.tipo === 'mensual' ? 'mensual' : 'evento'}">${esc(s.cad)}</span>
    </div>
  </li>`).join('');
}

/* ---------- el tablero (bloque interactivo) ---------- */

function puntaje(servicio, sel) {
  return (servicio.perfil.includes(sel.situacion) ? 2 : 0) + (servicio.perfil.includes(sel.necesidad) ? 3 : 0);
}

function razonDe(servicio, sel) {
  const situ = servicio.perfil.includes(sel.situacion);
  const nece = servicio.perfil.includes(sel.necesidad);
  if (situ && nece) return 'Por tu situación y por lo que necesitás resolver.';
  if (nece) return 'Por lo que necesitás resolver ahora.';
  if (situ) return 'Por tu situación frente al fisco.';
  return 'Suele ir junto con los dos anteriores.';
}

function initTablero() {
  const cont = document.getElementById('tetoca');
  const out = document.getElementById('tetoca-out');
  const panel = document.getElementById('panel-lista');
  const cta = document.getElementById('tetoca-cta');
  if (!cont || !out || !panel) return;
  const sel = { situacion: 'dependencia', necesidad: 'certificar' };

  const pintar = () => {
    const filas = CADENCIAS[sel.situacion] || [];
    panel.innerHTML = filas.map(f => `<li><b>${esc(f.q)}</b><span>${esc(f.c)}</span></li>`).join('');

    const elegidos = [...SERVICIOS]
      .map(s => ({ s, n: puntaje(s, sel) }))
      .sort((a, b) => b.n - a.n || a.s.id - b.s.id)
      .slice(0, 3);

    const previos = new Map([...out.querySelectorAll('[data-res-id]')].map(el => [el.dataset.resId, el.getBoundingClientRect()]));
    out.innerHTML = elegidos.map(({ s }) => `<article class="res" data-res-id="${s.id}">
      <span class="res-media"><img src="${s.img}" alt="${esc(s.alt)}" width="1200" height="1200" decoding="async"></span>
      <p class="res-folio">${esc(s.folio)}</p>
      <h3>${esc(s.nombre)}</h3>
      <p class="res-desc">${esc(s.desc)}</p>
      <p class="res-por">${esc(razonDe(s, sel))}</p>
    </article>`).join('');

    if (cta) {
      const texto = `Hola, ${FRASES[sel.situacion]} y ${FRASES[sel.necesidad]}. Vi la web y quiero consultar.`;
      cta.href = `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;
    }

    if (reduceMotion) return;
    out.querySelectorAll('[data-res-id]').forEach(el => {
      const antes = previos.get(el.dataset.resId);
      if (!antes) {
        el.animate([{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }],
          { duration: 220, easing: 'cubic-bezier(0.23,1,0.32,1)' });
        return;
      }
      const ahora = el.getBoundingClientRect();
      const dx = antes.left - ahora.left, dy = antes.top - ahora.top;
      if (!dx && !dy) return;
      el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
        { duration: 260, easing: 'cubic-bezier(0.23,1,0.32,1)' });
    });
  };

  cont.querySelectorAll('.bi-chip').forEach(chip => chip.addEventListener('click', () => {
    const q = chip.closest('.bi-q');
    const key = q.dataset.key;
    if (sel[key] === chip.dataset.val) return;
    q.querySelectorAll('.bi-chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
    chip.setAttribute('aria-pressed', 'true');
    sel[key] = chip.dataset.val;
    pintar();
  }));

  pintar();
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

/* ---------- nav ---------- */

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.masthead');
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
  const sync = () => btn.classList.toggle('visible', window.scrollY > 600);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

/* ---------- devolución de demo ---------- */

const GKY_SLUG_ACENTOS = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u' };
function gkySlugify(s) {
  return String(s || '').toLowerCase()
    .replace(/[áéíóúñü]/g, c => GKY_SLUG_ACENTOS[c] || c)
    .replace(/[^a-z0-9]/g, '');
}

function initFeedbackFloat() {
  const GKY_FEEDBACK_WHATSAPP = '5491125068578';
  const btn = document.getElementById('feedback-float');
  const backdrop = document.getElementById('feedback-modal-backdrop');
  const closeBtn = document.getElementById('feedback-modal-close');
  const starsWrap = document.getElementById('feedback-stars');
  const coloresEl = document.getElementById('feedback-colores');
  const contenidoEl = document.getElementById('feedback-contenido');
  const otrosEl = document.getElementById('feedback-otros');
  const submitBtn = document.getElementById('feedback-submit');
  if (!btn || !backdrop) return;

  const stars = [...starsWrap.querySelectorAll('.feedback-star')];
  let rating = 0;
  const paintStars = n => stars.forEach((s, i) => {
    s.classList.toggle('active', i < n);
    s.setAttribute('aria-pressed', i < n ? 'true' : 'false');
  });
  stars.forEach((s, i) => {
    s.addEventListener('click', () => { rating = i + 1; paintStars(rating); });
    s.addEventListener('mouseenter', () => paintStars(i + 1));
  });
  starsWrap.addEventListener('mouseleave', () => paintStars(rating));

  const open = () => {
    backdrop.hidden = false;
    document.body.classList.add('no-scroll');
    (stars[0] || coloresEl)?.focus();
  };
  const close = () => {
    backdrop.hidden = true;
    document.body.classList.remove('no-scroll');
    btn.focus();
  };
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

  submitBtn.addEventListener('click', () => {
    const colores = coloresEl.value.trim();
    const contenido = contenidoEl.value.trim();
    const otros = otrosEl.value.trim();
    if (!rating && !colores && !contenido && !otros) { coloresEl.focus(); return; }

    const slugUrl = (location.pathname.match(/\/demo\/([^/]+)/) || [])[1] || document.title;
    const slug = gkySlugify(slugUrl);
    const negocio = (document.title.split(/\s[—|]\s|\s-\s/)[0] || document.title || '').trim();
    const estrellas = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) + ` (${rating}/5)` : 'Sin calificar';
    const lineas = [
      `Devolución de la demo${negocio ? ' — ' + negocio : ''}`,
      `Calificación: ${estrellas}`,
      colores ? `Colores: ${colores}` : null,
      contenido ? `Contenido: ${contenido}` : null,
      otros ? `Otros: ${otros}` : null,
      location.href,
    ].filter(Boolean);

    window.open(`https://wa.me/${GKY_FEEDBACK_WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
    window.__gkySendResena?.({ slug, negocio, rating: rating || null, colores, contenido, otros, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la devolución en Firestore:', err));

    if (typeof showToast === 'function') showToast('¡Gracias por tu devolución!'); else window.alert('¡Gracias por tu devolución!');
    close();
    rating = 0; paintStars(0); coloresEl.value = ''; contenidoEl.value = ''; otrosEl.value = '';
  });

  if (reduceMotion) return;
  let hideTimer = null;
  window.addEventListener('scroll', () => {
    btn.classList.add('is-hidden');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => btn.classList.remove('is-hidden'), 550);
  }, { passive: true });
}

/* ---------- reveals y movimiento ---------- */

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.11, 0.66)}s`;
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

function initLectura() {
  const el = document.querySelector('[data-lee]');
  if (!el) return;
  const palabras = el.textContent.trim().split(/\s+/);
  el.innerHTML = palabras.map(p => `<span class="w">${esc(p)}</span>`).join(' ');
  const spans = [...el.querySelectorAll('.w')];
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    spans.forEach(s => s.classList.add('on'));
    return;
  }
  ScrollTrigger.create({
    trigger: el,
    start: 'top 80%',
    end: 'bottom 48%',
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: self => {
      const corte = Math.round(self.progress * spans.length);
      spans.forEach((s, i) => s.classList.toggle('on', i < corte));
    },
  });
}

function initParallaxWordmark() {
  const el = document.querySelector('.wordmark-cruce');
  if (!el || reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.fromTo(el, { yPercent: 12 }, {
    yPercent: -12, ease: 'none',
    scrollTrigger: { trigger: '.estudio', start: 'top bottom', end: 'bottom top', scrub: .6, invalidateOnRefresh: true },
  });
}

function initHero() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const foto = document.querySelector('.hero-foto img');
  if (foto) gsap.fromTo(foto, { scale: 1.08 }, { scale: 1, duration: 1.2, ease: 'power2.out' });
}

/* ---------- arranque ---------- */

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

initServicios();
initTablero();
initReveals();
initNav();
initWspFloat();
initLectura();
initParallaxWordmark();
initHero();
initFeedbackFloat();

const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();
