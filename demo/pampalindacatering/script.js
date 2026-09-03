const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const MOMENTOS = [
  { hora: '19:30', rotulo: 'Recepción' },
  { hora: '21:00', rotulo: 'Entrada' },
  { hora: '22:15', rotulo: 'Principal' },
  { hora: '00:30', rotulo: 'Pizza party' },
  { hora: '02:00', rotulo: 'Mesa dulce' },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(msg) + '</span>';
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

/* ---------- reveals ---------- */

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = Math.min(i * 0.12, 0.72) + 's';
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

/* ---------- hero ---------- */

function initHero() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const foto = document.querySelector('.hero-foto img');
  if (!foto) return;
  gsap.fromTo(foto, { scale: 1.1 }, { scale: 1, duration: 1.6, ease: 'power2.out' });
  gsap.to(foto, {
    yPercent: 6, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 },
  });
}

/* ---------- momento firma: el itinerario ---------- */

function pintarTicks() {
  const g = document.getElementById('dialTicks');
  if (!g) return;
  const cx = 110, cy = 110, r1 = 92, corto = 80, largo = 72;
  let html = '';
  for (let i = 0; i < 12; i++) {
    const ang = (i * 30 - 90) * Math.PI / 180;
    const mayor = i % 3 === 0;
    const rin = mayor ? largo : corto;
    html += '<line class="' + (mayor ? 'mayor' : '') + '"' +
      ' x1="' + (cx + Math.cos(ang) * rin).toFixed(1) + '" y1="' + (cy + Math.sin(ang) * rin).toFixed(1) + '"' +
      ' x2="' + (cx + Math.cos(ang) * r1).toFixed(1) + '" y2="' + (cy + Math.sin(ang) * r1).toFixed(1) + '"></line>';
  }
  g.innerHTML = html;
}

function initItinerario() {
  const stage = document.getElementById('itinStage');
  const pasos = [...document.querySelectorAll('#itinPasos .paso')];
  const aguja = document.getElementById('dialAguja');
  const arco = document.getElementById('dialArco');
  const horaEl = document.getElementById('dialHora');
  const rotEl = document.getElementById('dialRotulo');
  if (!stage || !pasos.length) return;

  pintarTicks();

  const C = 2 * Math.PI * 92;
  if (arco) { arco.style.strokeDasharray = C.toFixed(1); arco.style.strokeDashoffset = C.toFixed(1); }

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    stage.classList.add('is-estatico');
    pasos.forEach(p => p.classList.add('is-on'));
    if (arco) arco.style.strokeDashoffset = '0';
    if (aguja) aguja.style.transform = 'rotate(150deg)';
    const ultimo = MOMENTOS[MOMENTOS.length - 1];
    if (horaEl) horaEl.textContent = ultimo.hora;
    if (rotEl) rotEl.textContent = ultimo.rotulo;
    return;
  }

  let actual = -1;
  const setPaso = p => {
    const idx = Math.min(Math.floor(p * MOMENTOS.length), MOMENTOS.length - 1);
    if (idx !== actual) {
      actual = idx;
      pasos.forEach((el, i) => el.classList.toggle('is-on', i === idx));
      if (horaEl) horaEl.textContent = MOMENTOS[idx].hora;
      if (rotEl) rotEl.textContent = MOMENTOS[idx].rotulo;
    }
    if (aguja) aguja.style.transform = 'rotate(' + (-150 + p * 300).toFixed(1) + 'deg)';
    if (arco) arco.style.strokeDashoffset = (C * (1 - p)).toFixed(1);
  };

  ScrollTrigger.create({
    trigger: stage,
    start: 'top top',
    end: 'bottom bottom',
    scrub: .5,
    invalidateOnRefresh: true,
    onUpdate: self => setPaso(self.progress),
  });

  setPaso(0);
}

/* ---------- rail de montajes ---------- */

function initRail() {
  const vp = document.getElementById('railVp');
  const track = document.getElementById('railTrack');
  if (!vp || !track) return;

  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const paso = () => vp.clientWidth * 0.7;
  const syncArrows = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: 'smooth' }));
  vp.addEventListener('scroll', syncArrows, { passive: true });
  window.addEventListener('resize', syncArrows, { passive: true });
  syncArrows();

  let down = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.button !== undefined && e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startScroll = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    vp.scrollLeft = startScroll - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      setTimeout(() => vp.classList.remove('dragging'), 0);
    }
    pointerId = null;
    syncArrows();
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    const enBorde = (e.deltaY < 0 && vp.scrollLeft <= 0) || (e.deltaY > 0 && vp.scrollLeft >= max - 1);
    if (enBorde) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });
}

/* ---------- el wordmark gigante de la costura ---------- */

function initMarcaGigante() {
  const el = document.getElementById('marcaGigante');
  if (!el || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  gsap.fromTo(el, { xPercent: -56 }, {
    xPercent: -44, ease: 'none',
    scrollTrigger: { trigger: '.montaje', start: 'top bottom', end: 'bottom top', scrub: .8 },
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

/* ---------- WhatsApp flotante ---------- */

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  if (reduceMotion) { btn.classList.add('visible'); return; }
  const sync = () => btn.classList.toggle('visible', window.scrollY > 600);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

/* ---------- botón de reseña ---------- */

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
    window.lenis?.stop();
    document.body.classList.add('no-scroll');
    (stars[0] || coloresEl)?.focus();
  };
  const close = () => {
    backdrop.hidden = true;
    window.lenis?.start();
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

/* ---------- SEO estructurado ---------- */

function initJsonLd() {
  const base = location.href.split('#')[0].split('?')[0];
  const faqs = [...document.querySelectorAll('.preg-lista details')].map(d => ({
    '@type': 'Question',
    name: d.querySelector('summary')?.textContent.trim() || '',
    acceptedAnswer: { '@type': 'Answer', text: d.querySelector('p')?.textContent.trim() || '' },
  })).filter(q => q.name && q.acceptedAnswer.text);

  const grafo = [
    {
      '@type': 'LocalBusiness',
      '@id': base + '#negocio',
      name: 'Pampa Linda Catering',
      description: 'Catering para eventos corporativos, sociales y pizza party en CABA y Gran Buenos Aires. Producción propia, personal y montaje incluidos.',
      telephone: '+54 9 11 6943-5824',
      image: base + 'images/hero-evento-1920x1080.webp',
      priceRange: '$$',
      address: { '@type': 'PostalAddress', addressCountry: 'AR', addressRegion: 'Buenos Aires' },
      areaServed: 'CABA y Gran Buenos Aires',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Servicios de catering',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Catering corporativo' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Catering social' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pizza party' } },
        ],
      },
    },
  ];
  if (faqs.length) grafo.push({ '@type': 'FAQPage', mainEntity: faqs });

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
initHero();
initItinerario();
initRail();
initMarcaGigante();
initLeeScroll();
initWspFloat();
initFeedbackFloat();
initJsonLd();

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
