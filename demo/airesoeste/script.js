const WSP = '5491134933178';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(msg) + '</span>';
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3600);
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
    const header = document.querySelector('.barra');
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

/* ---------- WhatsApp flotante ---------- */

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  const sync = () => btn.classList.toggle('visible', window.scrollY > 600);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

/* ---------- formulario de contacto ---------- */

function initForm() {
  const form = document.getElementById('contForm');
  if (!form) return;
  const campos = [
    { input: document.getElementById('cNombre'), err: document.getElementById('errNombre') },
    { input: document.getElementById('cTel'), err: document.getElementById('errTel') },
  ];

  const validar = ({ input, err }) => {
    const ok = input.value.trim().length >= 2;
    input.setAttribute('aria-invalid', String(!ok));
    if (err) { err.hidden = ok; input.setAttribute('aria-describedby', err.id); }
    return ok;
  };

  campos.forEach(({ input, err }) => {
    input.addEventListener('blur', () => validar({ input, err }));
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') validar({ input, err });
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const validos = campos.map(validar);
    if (validos.includes(false)) {
      const primero = campos.find((c, i) => !validos[i]);
      primero?.input.focus();
      showToast('Nos falta tu nombre y un teléfono para poder contestarte.');
      return;
    }
    const nombre = document.getElementById('cNombre').value.trim();
    const tel = document.getElementById('cTel').value.trim();
    const servicio = document.getElementById('cServicio').value;
    const mensaje = document.getElementById('cMensaje').value.trim();
    const texto = 'Hola Aires Oeste, soy ' + nombre + '. Necesito: ' + servicio + '.'
      + (mensaje ? ' ' + mensaje : '')
      + ' Mi teléfono es ' + tel + '.';
    window.open('https://wa.me/' + WSP + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
    showToast('Te abrimos WhatsApp con el mensaje listo para enviar.');
  });
}

/* ---------- texto que se lee con el scroll ---------- */

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

/* ---------- capítulo: de 34° a 22° ---------- */

const GRADO_INICIO = 34;
const GRADO_FIN = 22;
const CALOR = [138, 75, 31];
const FRIO = [10, 30, 51];

function gradosPintar(p) {
  const escena = document.getElementById('gradosEsc');
  const num = document.getElementById('gradosNum');
  const copo = document.getElementById('copoG');
  const pasos = document.querySelectorAll('#gradosPasos li');
  if (!escena) return;
  const mezcla = CALOR.map((v, i) => Math.round(v + (FRIO[i] - v) * p));
  escena.style.backgroundColor = 'rgb(' + mezcla.join(',') + ')';
  if (num) num.textContent = String(Math.round(GRADO_INICIO - (GRADO_INICIO - GRADO_FIN) * p));
  if (copo) copo.style.transform = 'rotate(' + (p * 120).toFixed(1) + 'deg) scale(' + (0.72 + p * 0.28).toFixed(3) + ')';
  const activo = Math.min(pasos.length - 1, Math.floor(p * pasos.length + 0.001));
  pasos.forEach((li, i) => li.classList.toggle('is-on', i === activo));
}

function initGrados() {
  const seccion = document.getElementById('grados');
  const escena = document.getElementById('gradosEsc');
  const copo = document.getElementById('copoG');
  if (!seccion || !escena) return;
  if (copo) copo.style.transformOrigin = '100px 100px';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    gradosPintar(1);
    return;
  }
  seccion.classList.add('grados-scroll');
  escena.style.position = 'sticky';
  escena.style.top = '0';
  gradosPintar(0);
  ScrollTrigger.create({
    trigger: seccion, start: 'top top', end: 'bottom bottom',
    scrub: .5, invalidateOnRefresh: true,
    onUpdate: self => gradosPintar(self.progress),
  });
}

/* ---------- reveals ---------- */

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = Math.min(i * 0.09, 0.63) + 's';
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

/* ---------- hero ---------- */

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const logo = document.querySelector('.marca-logo');
  if (logo) gsap.fromTo(logo, { rotation: -14, scale: .86 }, { rotation: 0, scale: 1, duration: 1.1, ease: 'back.out(1.6)' });
  if (typeof ScrollTrigger === 'undefined') return;
  const mosaico = document.querySelectorAll('.hm img');
  mosaico.forEach((img, i) => {
    gsap.to(img, {
      yPercent: i % 2 === 0 ? -5 : 5, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 },
    });
  });
}

/* ---------- SEO estructurado ---------- */

function initJsonLd() {
  const base = location.href.split('#')[0].split('?')[0];
  const servicios = [...document.querySelectorAll('.serv')].map(s => ({
    '@type': 'Service',
    name: s.querySelector('h3')?.textContent || '',
    description: s.querySelector('p')?.textContent || '',
    provider: { '@id': base + '#negocio' },
    areaServed: { '@type': 'AdministrativeArea', name: 'Zona Oeste, Gran Buenos Aires' },
  }));
  const faqs = [...document.querySelectorAll('.zona-faq details')].map(d => ({
    '@type': 'Question',
    name: d.querySelector('summary')?.textContent || '',
    acceptedAnswer: { '@type': 'Answer', text: d.querySelector('p')?.textContent || '' },
  }));
  const grafo = [
    {
      '@type': 'HVACBusiness',
      '@id': base + '#negocio',
      name: 'Aires Oeste',
      alternateName: 'Aires Oeste Climatización',
      description: 'Instalación, service y reparación de aire acondicionado e instalaciones eléctricas con matrícula en la zona oeste del Gran Buenos Aires.',
      telephone: '+54 9 11 3493-3178',
      image: base + 'images/logo-aires-oeste-660.webp',
      logo: base + 'images/logo-aires-oeste-660.webp',
      priceRange: '$$',
      address: { '@type': 'PostalAddress', addressCountry: 'AR', addressRegion: 'Buenos Aires' },
      areaServed: { '@type': 'AdministrativeArea', name: 'Zona Oeste, Gran Buenos Aires' },
    },
    { '@type': 'FAQPage', mainEntity: faqs },
  ].concat(servicios);
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': grafo });
  document.head.appendChild(s);
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
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
}

document.getElementById('anio').textContent = new Date().getFullYear();

initReveals();
initNav();
initWspFloat();
initForm();
initLeeScroll();
initGrados();
initHero();
initJsonLd();

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
