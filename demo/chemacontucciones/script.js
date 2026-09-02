const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- nav overlay ---------- */

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let ultimoFoco = null;
  const close = () => {
    nav.classList.remove('open');
    nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    ultimoFoco?.focus();
  };
  const open = () => {
    ultimoFoco = document.activeElement;
    nav.classList.add('open');
    nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    closeBtn?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { close(); return; }
    if (e.key !== 'Tab' || !nav.classList.contains('open')) return;
    const foco = nav.querySelectorAll('a[href], button:not([disabled])');
    if (!foco.length) return;
    const primero = foco[0];
    const ultimo = foco[foco.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
}

/* ---------- WhatsApp flotante ---------- */

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  const sync = () => btn.classList.toggle('visible', window.scrollY > 600);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

/* ---------- tablero de oficios (momento firma) ---------- */

function initTablero() {
  const filas = [...document.querySelectorAll('.of')];
  if (!filas.length) return;

  const puntero = window.matchMedia('(hover: hover) and (pointer: fine)');
  let manoAlzada = false;   // el cursor esta sobre una fila: manda el hover

  const soloUna = fila => filas.forEach(f => f.classList.toggle('is-on', f === fila));

  // La fila mas cercana al centro de la pantalla queda encendida. Corre SIEMPRE,
  // tambien en desktop: quien scrollea sin mover el mouse igual ve el tablero vivo.
  const porCercania = () => {
    if (manoAlzada) return;
    const centro = window.innerHeight / 2;
    let mejor = null;
    let menor = Infinity;
    filas.forEach(f => {
      const r = f.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const d = Math.abs((r.top + r.bottom) / 2 - centro);
      if (d < menor) { menor = d; mejor = f; }
    });
    if (mejor) soloUna(mejor);
  };

  // Con mouse, tocar una fila la impone por encima de la cercania.
  filas.forEach(fila => {
    fila.addEventListener('pointerenter', () => {
      if (!puntero.matches) return;
      manoAlzada = true;
      soloUna(fila);
    });
    fila.addEventListener('pointerleave', () => {
      if (!puntero.matches) return;
      manoAlzada = false;
      porCercania();
    });
    fila.addEventListener('focusin', () => soloUna(fila));
  });

  let pedido = false;
  const agendar = () => {
    if (pedido) return;
    pedido = true;
    setTimeout(() => { pedido = false; porCercania(); }, 90);
  };
  window.addEventListener('scroll', agendar, { passive: true });
  window.addEventListener('resize', agendar, { passive: true });

  // ScrollTrigger como driver primario cuando esta disponible: es mas fino que
  // el listener y no depende de que el evento scroll llegue. El listener queda
  // igual como respaldo si el CDN no carga.
  const seccion = document.getElementById('oficios');
  if (typeof ScrollTrigger !== 'undefined' && seccion) {
    ScrollTrigger.create({
      trigger: seccion, start: 'top bottom', end: 'bottom top',
      invalidateOnRefresh: true,
      onUpdate: porCercania,
    });
  }

  porCercania();
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
  const fondo = document.querySelector('.hero-fondo img');
  if (fondo) gsap.fromTo(fondo, { scale: 1.1 }, { scale: 1, duration: 1.6, ease: 'power2.out' });
  if (typeof ScrollTrigger === 'undefined' || !fondo) return;
  gsap.to(fondo, {
    yPercent: 8, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 },
  });
}

/* ---------- SEO estructurado ---------- */

function initJsonLd() {
  const base = location.href.split('#')[0].split('?')[0];
  const servicios = [...document.querySelectorAll('.of')].map(of => ({
    '@type': 'Service',
    name: of.querySelector('.of-nom')?.textContent || '',
    description: of.querySelector('.of-desc')?.textContent || '',
    provider: { '@id': base + '#negocio' },
    areaServed: { '@type': 'AdministrativeArea', name: 'Gran Buenos Aires' },
  }));
  const faqs = [...document.querySelectorAll('.preg-lista details')].map(d => ({
    '@type': 'Question',
    name: d.querySelector('summary')?.textContent || '',
    acceptedAnswer: { '@type': 'Answer', text: d.querySelector('p')?.textContent || '' },
  }));
  const grafo = [
    {
      '@type': 'GeneralContractor',
      '@id': base + '#negocio',
      name: 'Chema Construcciones',
      description: 'Servicios generales de obra: plomería, electricidad, durlock, albañilería y pintura.',
      telephone: '+54 9 11 5021-3057',
      image: base + 'images/equipo-en-obra-1800x1200.webp',
      priceRange: '$$',
      address: { '@type': 'PostalAddress', addressCountry: 'AR', addressRegion: 'Buenos Aires' },
      areaServed: { '@type': 'AdministrativeArea', name: 'Gran Buenos Aires' },
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
initTablero();
initLeeScroll();
initHero();
initJsonLd();

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
