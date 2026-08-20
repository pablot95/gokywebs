const WHATSAPP_NUMBER = '5491144773971';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const wspUrl = msg => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
const mensajeProducto = p => `Hola body woman massage, quiero consultar por ${p.nombre}. ¿Me pasás precio y disponibilidad?`;

const PRODUCTOS = [
  {
    id: 'konjac-pura',
    categoria: 'Cuidado facial',
    nombre: 'Esponja Konjac Pura',
    badge: 'Piel sensible y normal',
    origen: 'Hecho en Japón',
    imgCard: 'images/esponja-konjac-pura-1200x1200.webp',
    galeria: ['images/esponja-konjac-pura-1200x1200.webp', 'images/esponjas-konjac-trio-1200x1200.webp'],
    descCorta: 'Fibra de raíz de konjac 100% natural. Limpieza diaria suave que no irrita ni reseca.',
    descLarga: 'Se hidrata con agua tibia y se usa sola, sin jabón, aunque también potencia tu limpiador habitual. Su textura suave exfolia sin arrastrar la piel — apta para uso diario, incluso en piel sensible. Es 100% biodegradable: se compone en semanas, no en siglos.',
    beneficios: ['Limpieza suave para uso diario', 'pH neutro, no reseca', '100% biodegradable', 'Rinde 2 a 3 meses con cuidado'],
  },
  {
    id: 'konjac-arcilla-verde',
    categoria: 'Cuidado facial',
    nombre: 'Esponja Konjac Arcilla Verde',
    badge: 'Piel mixta y grasa',
    origen: 'Hecho en Japón',
    imgCard: 'images/esponja-arcilla-verde-hero-1200x1600.webp',
    galeria: ['images/esponja-arcilla-verde-hero-1200x1600.webp'],
    descCorta: 'La misma fibra konjac, enriquecida con arcilla verde. Efecto purificante para piel con brillo.',
    descLarga: 'La arcilla verde suma poder absorbente a la limpieza suave de la fibra konjac: ayuda a matificar y despejar los poros sin resecar de más. Ideal para arrancar o cerrar el día en pieles mixtas a grasas. Mismo uso que la versión pura: con agua tibia, sin necesidad de jabón.',
    beneficios: ['Efecto matificante', 'Arcilla verde natural', 'Apta para uso diario', '100% biodegradable'],
  },
  {
    id: 'acido-tanico',
    categoria: 'Metal y herramientas',
    nombre: 'Ácido Tánico Convertidor de Óxido',
    badge: 'Metal y herramientas',
    origen: 'Hecho en Japón',
    imgCard: 'images/acido-tanico-frasco-1200x1200.webp',
    galeria: ['images/acido-tanico-frasco-1200x1200.webp', 'images/acido-tanico-set-1600x1300.webp', 'images/acido-tanico-aplicacion-1200x1200.webp'],
    descCorta: 'Transforma el óxido en una capa estable lista para pintar. Sin lijar hasta metal blanco.',
    descLarga: 'El ácido tánico reacciona con el óxido de hierro y lo convierte en un compuesto estable que sirve de base para pintar — el paso que se salta el lijado interminable. Sirve en rejas, herramientas, chapa y cualquier superficie ferrosa con óxido superficial a moderado. Se aplica con pincel o rodillo y se deja actuar antes de pintar.',
    beneficios: ['Frena el avance del óxido', 'Base lista para pintar', 'Se aplica con pincel o rodillo', 'Rinde varias superficies'],
  },
];

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 861px)');
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

function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;
  const items = ['Fibra 100% natural', 'Biodegradable', 'Importado de Japón', 'Curado a mano', 'Sin químicos agresivos'];
  const leaf = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 4 13V7a1 1 0 0 1 1-1h1a7 7 0 0 1 7 7v1a7 7 0 0 1-2 5z"/><path d="M12 12c0-4 2-6 6-8"/></svg>';
  const html = items.map(t => `<span class="marquee-item">${leaf}${esc(t)}</span>`).join('');
  track.innerHTML = html + html;
}

function cardTemplate(p) {
  return `
  <article class="product-card" data-animate style="opacity:0;transform:translateY(32px)" data-id="${p.id}">
    <div class="product-media">
      <span class="product-badge">${esc(p.badge)}</span>
      <div class="product-origin"><span>${esc(p.origen)}</span></div>
      <img src="${p.imgCard}" width="1200" height="1200" alt="${esc(p.nombre)}" loading="lazy">
    </div>
    <div class="product-body">
      <span class="product-cat">${esc(p.categoria)}</span>
      <h3>${esc(p.nombre)}</h3>
      <p class="product-desc">${esc(p.descCorta)}</p>
      <div class="product-actions">
        <button type="button" class="btn btn--ghost" data-open-modal="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
        <a class="btn btn--cta" href="${wspUrl(mensajeProducto(p))}" target="_blank" rel="noopener">Consultar</a>
      </div>
    </div>
  </article>`;
}

function initCatalogAndModal() {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;
  grid.innerHTML = PRODUCTOS.map(cardTemplate).join('');

  const backdrop = document.getElementById('modalBackdrop');
  const cardEl = document.getElementById('modalCard');
  const imgEl = document.getElementById('modalImg');
  const catEl = document.getElementById('modalCat');
  const titleEl = document.getElementById('modalTitle');
  const descEl = document.getElementById('modalDesc');
  const benefEl = document.getElementById('modalBenefits');
  const wspEl = document.getElementById('modalWsp');
  const closeBtn = document.getElementById('modalClose');
  if (!backdrop) return;
  let lastFocused = null;

  function onKeydown(e) {
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'Tab') {
      const focusables = Array.from(cardEl.querySelectorAll('a,button')).filter(el => el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function openModal(id) {
    const p = PRODUCTOS.find(x => x.id === id);
    if (!p) return;
    lastFocused = document.activeElement;
    catEl.textContent = p.categoria;
    titleEl.textContent = p.nombre;
    descEl.textContent = p.descLarga;
    benefEl.innerHTML = p.beneficios.map(b => `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg><span>${esc(b)}</span></li>`).join('');
    imgEl.src = p.galeria[0];
    imgEl.alt = p.nombre;
    wspEl.href = wspUrl(mensajeProducto(p));
    document.body.classList.add('modal-open', 'no-scroll');
    window.lenis?.stop();
    backdrop.classList.add('open');
    closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.classList.remove('modal-open', 'no-scroll');
    window.lenis?.start();
    document.removeEventListener('keydown', onKeydown);
    lastFocused?.focus();
  }

  grid.addEventListener('click', e => {
    const btn = e.target.closest('[data-open-modal]');
    if (btn) openModal(btn.dataset.openModal);
  });
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
}

function initChapters() {
  const grid = document.querySelector('.chapters-grid');
  const steps = document.querySelectorAll('.chapter-step');
  const images = document.querySelectorAll('.chapters-visual img');
  if (!grid || !steps.length) return;

  const activate = i => {
    steps.forEach(s => s.classList.toggle('is-active', s.dataset.step === i));
    images.forEach(img => img.classList.toggle('is-on', img.dataset.step === i));
  };

  const setupDesktop = () => {
    if (!('IntersectionObserver' in window)) return () => {};
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) activate(entry.target.dataset.step); });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    steps.forEach(s => io.observe(s));
    return () => io.disconnect();
  };

  const setupMobile = () => {
    const n = steps.length;
    let queued = false;
    const update = () => {
      queued = false;
      const r = grid.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      activate(String(Math.min(n - 1, Math.floor(progress * n))));
    };
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  };

  const mq = window.matchMedia('(max-width: 900px)');
  let cleanup = () => {};
  const apply = () => { cleanup(); cleanup = mq.matches ? setupMobile() : setupDesktop(); };
  mq.addEventListener('change', apply);
  apply();
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const blob = document.querySelector('.hero-blob');
  const heroImg = document.querySelector('.hero-media img');
  if (blob) {
    gsap.to(blob, { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 } });
  }
  if (heroImg) {
    gsap.to(heroImg, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 } });
  }
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

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  initNav();
  initWspFloat();
  initMarquee();
  initCatalogAndModal();
  initChapters();
  initParallax();
  initReveals();
});
