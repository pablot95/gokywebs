document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const WSP = '5491134045968';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none';
  });
}

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => {
    a.href = 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(a.dataset.wspMsg);
  });
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
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); }
  });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-media img', { scale: 1.1, duration: 1.35, ease: 'power2.out' }, 0)
    .from('.hero-eyebrow', { y: 16, opacity: 0, duration: .7 }, .12)
    .from('.hero-wordmark', { clipPath: 'inset(0 0 105% 0)', y: 18, duration: 1, ease: 'power4.out' }, .18)
    .from('.hero-rule', { scaleX: 0, transformOrigin: 'left center', duration: .8 }, .55)
    .from('.hero-title', { y: 28, opacity: 0, duration: .9 }, .6)
    .from('.hero-sub', { y: 20, opacity: 0, duration: .8 }, .74)
    .from('.hero-ctas .btn', { y: 18, opacity: 0, duration: .7, stagger: .09 }, .86)
    .from('.hero-datos', { y: 14, opacity: 0, duration: .7 }, 1)
    .from('.hero-tag', { y: 14, opacity: 0, duration: .7 }, 1.05);
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

function initProceso() {
  const stage = document.getElementById('procesoStage');
  const seccion = document.getElementById('proceso');
  if (!stage || !seccion) return;
  const capas = [1, 2, 3, 4].map(n => stage.querySelector('.capa-' + n));
  const pasos = Array.from(stage.querySelectorAll('.paso'));
  const scan = document.getElementById('procesoEscaner');
  const mano = document.getElementById('procesoManometro');
  const aguja = mano ? mano.querySelector('.aguja') : null;
  const presion = document.getElementById('procesoPresion');
  const etiqueta = document.getElementById('procesoEtiqueta');
  const NOMBRES = ['Desagües y pendientes', 'Agua fría y caliente', 'Colector con llaves', 'Terminado'];

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    seccion.classList.add('is-static');
    pasos.forEach(p => p.classList.add('is-on'));
    return;
  }

  let actual = -1;
  const setPaso = i => {
    if (i === actual) return;
    actual = i;
    pasos.forEach((p, n) => p.classList.toggle('is-on', n === i));
    if (etiqueta) etiqueta.textContent = NOMBRES[i];
  };
  const cortes = [0.5, 1.75, 3.0];
  const pasoDe = t => (t < cortes[0] ? 0 : t < cortes[1] ? 1 : t < cortes[2] ? 2 : 3);

  const medidor = { v: 0 };
  const TOTAL = 3.8;

  gsap.set(scan, { opacity: 0, top: '0%' });
  gsap.set(mano, { opacity: 0 });
  if (aguja) gsap.set(aguja, { svgOrigin: '50 50', rotation: -118 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: 'top 58%',
      end: 'bottom 88%',
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: self => setPaso(pasoDe(self.progress * TOTAL))
    }
  });

  [0, 1.25, 2.5].forEach((pos, k) => {
    tl.fromTo(capas[k + 1], { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', ease: 'none', duration: 1 }, pos)
      .set(scan, { opacity: 1 }, pos)
      .fromTo(scan, { top: '0%' }, { top: '100%', ease: 'none', duration: 1 }, pos)
      .set(scan, { opacity: 0 }, pos + 1);
  });

  tl.to(mano, { opacity: 1, duration: .3 }, 2.35)
    .to(medidor, {
      v: 4, duration: 1, ease: 'none',
      onUpdate: () => { if (presion) presion.textContent = medidor.v.toFixed(1).replace('.', ','); }
    }, 2.5);
  if (aguja) tl.to(aguja, { rotation: 30, duration: 1, ease: 'none' }, 2.5);
  tl.to({}, { duration: .3 }, 3.5);

  setPaso(0);
}

function initRail() {
  const vp = document.getElementById('railVp');
  const track = document.getElementById('railTrack');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!vp || !track) return;

  const paso = () => {
    const card = track.querySelector('.obra');
    if (!card) return vp.clientWidth * .8;
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 16;
    return card.getBoundingClientRect().width + gap;
  };
  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();

  let down = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
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
    sync();
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !reduceMotion) {
    gsap.from(track.querySelectorAll('.obra'), {
      x: 48, opacity: 0, duration: .85, ease: 'power3.out', stagger: .09,
      scrollTrigger: { trigger: vp, start: 'top 82%' }
    });
  }
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = [-34.6037, -58.3816];
  const mapa = L.map(el, { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView(centro, 10);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19
  }).addTo(mapa);
  L.circle(centro, {
    radius: 26000,
    color: '#2E7D32', weight: 2, fillColor: '#81C784', fillOpacity: .18
  }).addTo(mapa);
  L.circleMarker(centro, {
    radius: 8, color: '#ffffff', weight: 3, fillColor: '#2E7D32', fillOpacity: 1
  }).addTo(mapa).bindPopup('Trabajo en CABA y Gran Buenos Aires');
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initAnio() {
  const el = document.getElementById('anio');
  if (el) el.textContent = new Date().getFullYear();
}

initWspLinks();
initNav();
initHero();
initProceso();
initRail();
initMapa();
initReveals();
initWspFloat();
initAnio();

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
