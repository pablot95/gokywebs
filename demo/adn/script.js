const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* ===== Toast (snippet canónico §2) ===== */
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

/* ===== Anti-copia ===== */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

/* ===== Reveals al scroll (snippets_canonicos_demos §7) ===== */
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  if (typeof gsap === 'undefined' || reduceMotion) {
    items.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
    return;
  }
  const presets = {
    up:    { y: 0, opacity: 1, duration: .9 },
    left:  { x: 0, opacity: 1, duration: .9 },
    scale: { scale: 1, y: 0, opacity: 1, duration: 1 },
    clip:  { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 1.1 },
  };
  items.forEach(el => {
    gsap.to(el, {
      ...presets[el.dataset.animate || 'up'],
      ease: 'expo.out',
      delay: parseFloat(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
}

/* ===== Nav — header "minimal editorial": drawer en TODOS los anchos, sin barra desktop ===== */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    (document.querySelector('.site-header') || document.body).appendChild(bd);
  }
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
}

/* ===== WhatsApp flotante — visible tras ~500px de scroll ===== */
function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  const sync = () => btn.classList.toggle('visible', window.scrollY > 500);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

/* ===== Manifesto: texto que se lee con el scroll (una vez por demo) ===== */
function initManifestoRead() {
  const el = document.querySelector('[data-scroll-read]');
  const section = document.querySelector('.manifesto');
  if (!el || !section) return;
  const words = el.textContent.trim().split(' ');
  el.innerHTML = words.map(w => `<span class="is-unread">${w}</span>`).join(' ');
  const spans = el.querySelectorAll('span');

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    spans.forEach(s => s.classList.add('is-read'));
    return;
  }
  ScrollTrigger.create({
    trigger: section, start: 'top 75%', end: 'bottom 60%', scrub: .3,
    onUpdate: self => {
      const n = Math.round(self.progress * spans.length);
      spans.forEach((s, i) => s.classList.toggle('is-read', i < n));
    }
  });
}

/* ===== Momento firma: "De la fibra a la pieza" — grilla tipo tufting que se llena con el scroll ===== */
function initTuftGrid() {
  const grid = document.getElementById('tuft-grid');
  const section = document.querySelector('.tuft-section');
  if (!grid || !section) return;

  // El grid ahora vive sobre fondo claro (var(--color-bg)) — ningún tono del swatch
  // puede acercarse al crema del fondo o la celda se vuelve invisible ahí adentro.
  const COLORS = ['#C1392B', '#C1392B', '#241E1B', '#A9762F', '#7A2E22', '#3A302A'];
  const COLS = 10, ROWS = 6;
  const cells = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'tuft-cell';
      cell.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      grid.appendChild(cell);
      cells.push(cell);
    }
  }

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    cells.forEach(c => { c.style.opacity = 1; c.style.transform = 'scale(1)'; });
    return;
  }

  // Orden boustrofedon: fila par de izquierda a derecha, impar al revés —
  // así es como se mueve de verdad una pistola de tufting sobre el bastidor.
  const order = [];
  for (let r = 0; r < ROWS; r++) {
    const row = cells.slice(r * COLS, r * COLS + COLS);
    if (r % 2 === 1) row.reverse();
    order.push(...row);
  }

  const labels = document.querySelectorAll('[data-tuft-label]');
  const updateLabels = (progress) => {
    const step = Math.min(labels.length - 1, Math.floor(progress * labels.length));
    labels.forEach((label, i) => label.classList.toggle('is-active', i <= step));
  };

  function buildTimeline() {
    const tl = gsap.timeline();
    order.forEach((cell, i) => {
      tl.to(cell, { opacity: 1, scale: 1, duration: .6, ease: 'back.out(2)' }, i * (1 / order.length));
    });
    return tl;
  }

  ScrollTrigger.matchMedia({
    '(min-width: 1024px)': () => {
      const tl = buildTimeline();
      const st = ScrollTrigger.create({
        trigger: section, start: 'top top', end: '+=180%', pin: true, scrub: .6,
        animation: tl, onUpdate: self => updateLabels(self.progress)
      });
      return () => st.kill();
    },
    '(max-width: 1023px)': () => {
      section.classList.add('is-sticky-mobile');
      requestAnimationFrame(() => ScrollTrigger.refresh());
      const tl = buildTimeline();
      const st = ScrollTrigger.create({
        trigger: section, start: 'top top', end: 'bottom bottom', scrub: .6,
        animation: tl, invalidateOnRefresh: true, onUpdate: self => updateLabels(self.progress)
      });
      return () => { st.kill(); section.classList.remove('is-sticky-mobile'); };
    }
  });
}

/* ===== Cómo es cursar — sticky chapters (sin pin, IntersectionObserver) ===== */
function initChapters() {
  const caps = document.querySelectorAll('.chapter');
  if (!caps.length) return;
  const numEl = document.querySelector('[data-cap-num]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      caps.forEach(c => c.classList.remove('is-active'));
      entry.target.classList.add('is-active');
      if (numEl) numEl.textContent = '0' + entry.target.dataset.cap;
    });
  }, { threshold: .5 });
  caps.forEach(c => io.observe(c));
}

/* ===== Botón magnético (CTA final) ===== */
function initMagnetic() {
  if (reduceMotion || typeof gsap === 'undefined' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .25, duration: .3 });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: .45, ease: 'elastic.out(1, .55)' }));
  });
}

/* ===== Botón de reseña flotante (snippets_canonicos_demos §9) ===== */
const GKY_SLUG_ACENTOS = { "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "ñ": "n", "ü": "u" };
function gkySlugify(s) {
  return String(s || "").toLowerCase()
    .replace(/[áéíóúñü]/g, c => GKY_SLUG_ACENTOS[c] || c)
    .replace(/[^a-z0-9]/g, "");
}

function initFeedbackFloat() {
  const GKY_FEEDBACK_WHATSAPP = "5491125068578"; // Pablo/Gokywebs — NUNCA el WhatsApp del negocio del demo
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
    // "★"/"☆" (U+2605/2606), no el emoji "⭐" (U+2B50): el emoji llegaba
    // roto (mojibake) por WhatsApp en pruebas reales — estos dos son texto
    // Unicode viejo, mucho más compatible, y son los mismos que ya usa el
    // admin para pintar la calificación.
    const estrellas = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) + ` (${rating}/5)` : 'Sin calificar';
    const lineas = [
      `Devolución de la demo${negocio ? ' — ' + negocio : ''}`,
      `Calificación: ${estrellas}`,
      colores ? `Colores: ${colores}` : null,
      contenido ? `Contenido: ${contenido}` : null,
      otros ? `Otros: ${otros}` : null,
      location.href
    ].filter(Boolean);

    window.open(`https://wa.me/${GKY_FEEDBACK_WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
    window.__gkySendResena?.({ slug, negocio, rating: rating || null, colores, contenido, otros, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la devolución en Firestore:', err));

    if (typeof showToast === 'function') showToast('¡Gracias por tu devolución!'); else alert('¡Gracias por tu devolución!');
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

/* ===== Init ===== */
initNav();
initWspFloat();
initManifestoRead();
initTuftGrid();
initChapters();
initReveals();
initMagnetic();
initFeedbackFloat();
document.body.classList.remove('js-pending');
