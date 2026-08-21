const WHATSAPP_NUMBER = '5492996038524';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

const ICON_BED = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 18v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6"/><path d="M2 18h20M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"/></svg>';
const ICON_BATH = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-2.5 1V12"/><path d="M4 12h18v2a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6z"/><line x1="4" y1="20" x2="4" y2="22"/><line x1="18" y1="20" x2="18" y2="22"/></svg>';

const GALERIA_COMPARTIDA = [
  'images/living-sofa-crema-1600x1300.webp',
  'images/cocina-equipada-mesa-1600x1300.webp',
  'images/dormitorio-moderno-1200x1600.webp',
  'images/dormitorio-ropero-1200x1600.webp',
  'images/comedor-mesa-madera-1600x1300.webp',
  'images/parrilla-detalle-1000x1000.webp',
];

const CASAS = [
  {
    id: 1, nombre: 'Casa 1', capacidad: 4, dormitorios: 2, banos: 1,
    descripcion: 'Pensada para equipos chicos o visitas puntuales, con todo el equipamiento del complejo en un formato más compacto.',
    portada: 'images/casa-exterior-verde-1600x1300.webp',
  },
  {
    id: 2, nombre: 'Casa 2', capacidad: 6, dormitorios: 3, banos: 2,
    descripcion: 'El punto medio del complejo: espacio de sobra para un equipo de trabajo completo, con las mismas comodidades que las demás casas.',
    portada: 'images/complejo-casas-gemelas-1920x1080.webp',
  },
  {
    id: 3, nombre: 'Casa 3', capacidad: 8, dormitorios: 4, banos: 2,
    descripcion: 'La casa más grande del complejo, pensada para equipos numerosos que necesitan quedarse varios días sin resignar comodidad.',
    portada: 'images/comedor-mesa-madera-1600x1300.webp',
  },
];

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => {
    a.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(a.dataset.wspMsg)}`;
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
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

function initAntiCopy() {
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
      e.preventDefault();
    }
  });
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      if (!el.dataset.delay) el.style.transitionDelay = `${Math.min(i * 0.1, 0.7)}s`;
    });
  });
  items.forEach(el => {
    if (el.dataset.delay) el.style.transitionDelay = `${el.dataset.delay}s`;
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

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  if (!wsp) return;
  const sync = () => wsp.classList.toggle('visible', window.scrollY > 600);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

function initMagnetic() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * .2, y: (e.clientY - r.top - r.height / 2) * .32, duration: .3 });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: .45, ease: 'elastic.out(1, .55)' }));
  });
}

function initContador() {
  const el = document.querySelector('[data-counter]');
  if (!el) return;
  const end = parseFloat(el.dataset.counter);
  if (reduceMotion || typeof gsap === 'undefined') { el.textContent = end; return; }
  const obj = { v: 0 };
  const tween = {
    v: end, duration: 1.4, ease: 'power1.out', snap: { v: 1 },
    onUpdate: () => { el.textContent = Math.round(obj.v); },
  };
  if (typeof ScrollTrigger !== 'undefined') tween.scrollTrigger = { trigger: el, start: 'top 90%', once: true };
  gsap.to(obj, tween);
}

let modalLastFocus = null;

function renderGallery(gallery, nombre) {
  const main = document.getElementById('modalMainImg');
  main.src = gallery[0];
  main.alt = nombre;
  const thumbs = document.getElementById('modalThumbs');
  thumbs.innerHTML = gallery.map((src, i) =>
    `<button type="button" class="${i === 0 ? 'is-active' : ''}" data-i="${i}" aria-label="Foto ${i + 1}"><img src="${src}" alt="" loading="lazy"></button>`
  ).join('');
  thumbs.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = Number(btn.dataset.i);
      main.src = gallery[i];
      thumbs.querySelectorAll('button').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });
}

function openModal(id) {
  const casa = CASAS.find(c => c.id === id);
  if (!casa) return;
  document.getElementById('modalTag').textContent = `Hasta ${casa.capacidad} personas`;
  document.getElementById('modalCasaTitulo').textContent = casa.nombre;
  document.getElementById('modalDatos').innerHTML =
    `<span>${ICON_BED}${casa.dormitorios} dormitorios</span><span>${ICON_BATH}${casa.banos} baños</span>`;
  document.getElementById('modalDescripcion').textContent = casa.descripcion;
  const wsp = document.getElementById('modalWsp');
  wsp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola Lucero Lucero, quiero consultar disponibilidad para ${casa.nombre} (hasta ${casa.capacidad} personas).`)}`;
  renderGallery([casa.portada, ...GALERIA_COMPARTIDA], casa.nombre);

  modalLastFocus = document.activeElement;
  const modal = document.getElementById('modalCasa');
  const backdrop = document.getElementById('modalBackdrop');
  modal.removeAttribute('inert');
  modal.classList.add('open');
  backdrop.classList.add('open');
  document.body.classList.add('no-scroll');
  document.getElementById('modalClose').focus();
}

function closeModal() {
  const modal = document.getElementById('modalCasa');
  const backdrop = document.getElementById('modalBackdrop');
  if (!modal.classList.contains('open')) return;
  modal.classList.remove('open');
  backdrop.classList.remove('open');
  modal.setAttribute('inert', '');
  document.body.classList.remove('no-scroll');
  modalLastFocus?.focus();
}

function initModal() {
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalBackdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    const modal = document.getElementById('modalCasa');
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key !== 'Tab') return;
    const focusables = modal.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

function renderCasas() {
  const grid = document.getElementById('casasGrid');
  if (!grid) return;
  grid.innerHTML = CASAS.map((c, i) => `
    <article class="casa-card" data-id="${c.id}" data-animate="scale" data-delay="${(i * .12).toFixed(2)}" style="transform:translateY(30px) scale(.97);opacity:0" tabindex="0" role="button" aria-haspopup="dialog" aria-label="Ver ${esc(c.nombre)}">
      <div class="casa-media">
        <img src="${c.portada}" width="1600" height="1300" alt="${esc(c.nombre)}, hasta ${c.capacidad} personas" loading="lazy">
        <span class="casa-tag">Hasta ${c.capacidad} personas</span>
      </div>
      <div class="casa-body">
        <h3>${esc(c.nombre)}</h3>
        <div class="casa-datos">
          <span>${ICON_BED}${c.dormitorios} dormitorios</span>
          <span>${ICON_BATH}${c.banos} baños</span>
        </div>
        <p>${esc(c.descripcion)}</p>
        <span class="casa-cta">Ver esta casa →</span>
      </div>
    </article>
  `).join('');
  grid.querySelectorAll('.casa-card').forEach(card => {
    const id = Number(card.dataset.id);
    card.addEventListener('click', () => openModal(id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(id); } });
  });
}

function initRecorrido() {
  const stage = document.getElementById('recorridoStage');
  const pasos = Array.from(document.querySelectorAll('#recorridoPasos .paso'));
  const imgs = Array.from(document.querySelectorAll('#recorridoVisual .rec-img'));
  if (!stage || !pasos.length || !imgs.length) return;

  function setStep(progress) {
    const idx = Math.min(pasos.length - 1, Math.floor(progress * pasos.length));
    pasos.forEach((p, i) => p.classList.toggle('is-on', i === idx));
    imgs.forEach((img, i) => img.classList.toggle('is-active', i === idx));
  }

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    setStep(0);
    return;
  }

  ScrollTrigger.matchMedia({
    '(min-width: 1081px) and (prefers-reduced-motion: no-preference)': () => {
      const st = ScrollTrigger.create({
        trigger: stage, start: 'top top', end: '+=200%', pin: true, scrub: .6,
        anticipatePin: 1, onUpdate: self => setStep(self.progress), invalidateOnRefresh: true,
      });
      return () => st.kill();
    },
    '(max-width: 1080px) and (prefers-reduced-motion: no-preference)': () => {
      stage.classList.add('is-sticky-mobile');
      const st = ScrollTrigger.create({
        trigger: stage, start: 'top top', end: 'bottom bottom', scrub: .6,
        onUpdate: self => setStep(self.progress), invalidateOnRefresh: true,
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => { stage.classList.remove('is-sticky-mobile'); st.kill(); };
    },
    '(prefers-reduced-motion: reduce)': () => { setStep(0); },
  });
}

function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

renderCasas();
initWspLinks();
initNav();
initAntiCopy();
initModal();
initRecorrido();
initReveals();
initFloats();
initMagnetic();
initContador();
initFooterYear();
