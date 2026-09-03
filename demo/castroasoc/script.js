document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492236033606';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const SERVICIOS = [
  { uf: 'UF 01', frente: 'Consorcios', nombre: 'Liquidación de expensas', desc: 'Cierre mensual con detalle por unidad, prorrateo, comprobantes adjuntos y saldo de cada propietario.', perfil: ['consorcio', 'propietario', 'expensas'], incluye: ['Cierre en fecha fija todos los meses', 'Detalle por unidad y por rubro de gasto', 'Comprobantes escaneados adjuntos', 'Estado de deuda actualizado'] },
  { uf: 'UF 02', frente: 'Consorcios', nombre: 'Asambleas y libro de actas', desc: 'Convocatoria, orden del día, conducción de la asamblea y redacción del acta en el libro rubricado.', perfil: ['consorcio', 'propietario'], incluye: ['Convocatoria y orden del día', 'Conducción de la asamblea', 'Acta redactada y firmada', 'Seguimiento de lo resuelto'] },
  { uf: 'UF 03', frente: 'Consorcios', nombre: 'Personal del edificio', desc: 'Sueldos del encargado, cargas sociales, ART, libro de sueldos y todo lo que pide el convenio.', perfil: ['consorcio', 'sueldos'], incluye: ['Liquidación de sueldos y aguinaldo', 'Cargas sociales y ART', 'Libro de sueldos al día', 'Altas, bajas y licencias'] },
  { uf: 'UF 04', frente: 'Consorcios', nombre: 'Obras y proveedores', desc: 'Pedido de presupuestos, comparativa para la asamblea, contratación y seguimiento de la obra.', perfil: ['consorcio', 'propietario'], incluye: ['Tres presupuestos comparados', 'Contratación y anticipos', 'Seguimiento y certificación de avance', 'Rendición de la obra al cierre'] },
  { uf: 'UF 05', frente: 'Contable', nombre: 'Monotributo e Ingresos Brutos', desc: 'Alta, recategorización, pagos mensuales y Ingresos Brutos provincial o Convenio Multilateral.', perfil: ['monotributo', 'empresa', 'afip'], incluye: ['Alta y recategorización', 'Vencimientos avisados antes', 'Ingresos Brutos y Convenio Multilateral', 'Constancias cuando las necesites'] },
  { uf: 'UF 06', frente: 'Contable', nombre: 'IVA y Ganancias', desc: 'Libros de IVA compras y ventas, declaraciones juradas mensuales y la anual de Ganancias.', perfil: ['empresa', 'afip'], incluye: ['Libro de IVA compras y ventas', 'Declaraciones juradas mensuales', 'Ganancias y Bienes Personales', 'Respuesta a intimaciones'] },
  { uf: 'UF 07', frente: 'Contable', nombre: 'Balances y estados contables', desc: 'Cierre de ejercicio, estados contables firmados y presentación donde corresponda.', perfil: ['empresa', 'cierre'], incluye: ['Cierre de ejercicio', 'Estados contables firmados', 'Legalización profesional', 'Informe para el banco si hace falta'] },
  { uf: 'UF 08', frente: 'Contable', nombre: 'Sueldos y libro de sueldos', desc: 'Liquidación del personal de tu comercio o empresa, cargas sociales y libro rubricado.', perfil: ['empresa', 'sueldos'], incluye: ['Recibos y liquidación mensual', 'F.931 y cargas sociales', 'Libro de sueldos rubricado', 'Altas, bajas y vacaciones'] },
];

const QUIEN = { consorcio: 'un consorcio', propietario: 'un propietario', empresa: 'una empresa o comercio', monotributo: 'un monotributista' };
const URGE = { expensas: 'liquidar expensas', afip: 'impuestos y AFIP', sueldos: 'sueldos y cargas', cierre: 'balance o cierre' };

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

let revealsListos = false;
function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.09, 0.6)}s`;
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

function initServicios() {
  const lista = document.getElementById('serv-lista');
  if (!lista) return;
  lista.innerHTML = SERVICIOS.map(s => `
    <li class="serv-i" id="serv-${s.uf.replace(/\s/g, '').toLowerCase()}" data-animate="up" style="transform:translateY(22px);opacity:0">
      <span class="uf">${esc(s.uf)}</span>
      <div>
        <h3>${esc(s.nombre)}</h3>
        <p>${esc(s.desc)}</p>
      </div>
      <span class="serv-frente">${esc(s.frente)}</span>
    </li>`).join('');
}

function initConsulta() {
  const cont = document.getElementById('consulta');
  const ufEl = document.getElementById('cons-uf');
  const tituloEl = document.getElementById('cons-titulo');
  const porEl = document.getElementById('cons-por');
  const incluyeEl = document.getElementById('cons-incluye');
  const wspEl = document.getElementById('cons-wsp');
  const verEl = document.getElementById('cons-ver');
  if (!cont || !incluyeEl) return;
  const sel = {};

  const puntaje = s => Object.values(sel).reduce((n, v) => n + (s.perfil.includes(v) ? 1 : 0), 0);

  const render = () => {
    const mejor = SERVICIOS
      .map(s => ({ s, n: puntaje(s) }))
      .sort((a, b) => b.n - a.n)[0].s;

    const anterior = incluyeEl.dataset.uf;
    ufEl.textContent = mejor.uf;
    tituloEl.textContent = mejor.nombre;

    const quien = sel.quien ? QUIEN[sel.quien] : null;
    const urge = sel.urge ? URGE[sel.urge] : null;
    porEl.textContent = quien && urge ? `Para ${quien} que necesita ${urge}`
      : quien ? `Para ${quien}`
      : urge ? `Para resolver ${urge}`
      : 'Lo que más nos piden, en general';

    incluyeEl.innerHTML = mejor.incluye.map(i => `<li>${esc(i)}</li>`).join('');
    incluyeEl.dataset.uf = mejor.uf;

    const msg = [
      `Hola! Quiero consultar por ${mejor.nombre} (${mejor.uf}).`,
      quien ? `Soy ${quien}.` : null,
      urge ? `Lo que necesito resolver: ${urge}.` : null,
    ].filter(Boolean).join('\n');
    wspEl.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
    verEl.dataset.target = 'serv-' + mejor.uf.replace(/\s/g, '').toLowerCase();

    if (reduceMotion || anterior === mejor.uf) return;
    [tituloEl, porEl, incluyeEl].forEach(el => el.animate(
      [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
      { duration: 220, easing: 'cubic-bezier(0.23,1,0.32,1)' }
    ));
  };

  cont.querySelectorAll('.cons-chip').forEach(chip => chip.addEventListener('click', () => {
    const q = chip.closest('.cons-q');
    const key = q.dataset.key;
    const ya = sel[key] === chip.dataset.val;
    q.querySelectorAll('.cons-chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
    if (ya) delete sel[key];
    else { sel[key] = chip.dataset.val; chip.setAttribute('aria-pressed', 'true'); }
    render();
  }));

  verEl?.addEventListener('click', e => {
    e.preventDefault();
    const t = document.getElementById(verEl.dataset.target);
    if (!t) return;
    t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    t.animate([{ backgroundColor: 'rgba(0,0,255,.08)' }, { backgroundColor: 'transparent' }], { duration: 1200, easing: 'ease-out' });
  });

  render();
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
    const header = document.querySelector('.top');
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

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.hero-copy > *', { y: 24, opacity: 0, duration: .9, stagger: .09 })
    .from('.hero-media > img', { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'power3.out' }, .15)
    .from('[data-hero="uf"]', { y: 22, opacity: 0, duration: .8 }, .7)
    .from('.uf-seam', { y: 12, opacity: 0, duration: .6 }, .85);

  const limpiarHero = () => {
    if (tl.progress() < 1) tl.progress(1);
    tl.kill();
    gsap.set(['.hero-copy > *', '.hero-media > img', '[data-hero="uf"]', '.uf-seam'], { clearProps: 'all' });
  };
  tl.eventCallback('onComplete', limpiarHero);
  setTimeout(limpiarHero, 2500);
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

function initJsonLd() {
  const graph = [{
    '@type': 'AccountingService',
    '@id': 'https://gokywebs.com/demo/castroasoc/#negocio',
    name: 'CASTRO&ASOC',
    description: 'Administración de consorcios y estudio contable-impositivo en Mar del Plata: liquidación de expensas, asambleas, sueldos, AFIP, Ingresos Brutos y balances.',
    telephone: '+5492236033606',
    email: 'hola@castroasoc.com',
    areaServed: { '@type': 'City', name: 'Mar del Plata' },
    address: { '@type': 'PostalAddress', addressLocality: 'Mar del Plata', addressRegion: 'Buenos Aires', addressCountry: 'AR' },
    image: 'https://gokywebs.com/demo/castroasoc/images/hero-fachada.webp',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios',
      itemListElement: SERVICIOS.map(s => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.nombre, description: s.desc, category: s.frente },
      })),
    },
  }];
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  document.head.appendChild(s);
}

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
  const paintStars = (n) => stars.forEach((s, i) => {
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
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

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

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none';
  });
}

const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();

initServicios();
initConsulta();
initReveals();
initNav();
initWspFloat();
initHero();
initLeeScroll();
initJsonLd();
initFeedbackFloat();

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
