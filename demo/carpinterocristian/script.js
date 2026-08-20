const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WHATSAPP_NUMBER = '5493813583970';
const WSP_MESSAGES = {
  general: 'Hola Cristian, quiero hacer una consulta sobre un mueble a medida.',
  cocina: 'Hola Cristian, quiero pedir un presupuesto para una cocina de melamina a medida.',
  placard: 'Hola Cristian, quiero pedir un presupuesto para un placar a medida.',
};

function buildWspHref(lines) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

function wireWspLinks() {
  document.querySelectorAll('.wsp-link[data-wsp]').forEach(a => {
    const key = a.dataset.wsp;
    if (key === 'melamina') return;
    a.href = buildWspHref([WSP_MESSAGES[key] || WSP_MESSAGES.general]);
  });
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}

function initReveals() {
  if (typeof gsap === 'undefined') return;
  const els = document.querySelectorAll('[data-animate]');
  if (reduceMotion) {
    els.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  const presets = {
    up: { y: 0, x: 0, opacity: 1, duration: .9 },
    scale: { scale: 1, y: 0, opacity: 1, duration: 1 },
  };
  els.forEach(el => {
    const type = el.dataset.animate || 'up';
    gsap.to(el, {
      ...(presets[type] || presets.up),
      ease: 'expo.out',
      delay: parseFloat(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
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

function initAntiCopia() {
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
      e.preventDefault();
    }
  });
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initRailWheel(vp) {
  if (!vp) return;
  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    if (max <= 1) return;
    const atStart = vp.scrollLeft <= 0, atEnd = vp.scrollLeft >= max - 1;
    if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });
}

function initRails() {
  ['chipRail', 'ideasRail'].forEach(id => {
    const vp = document.getElementById(id);
    initRailDrag(vp);
    initRailWheel(vp);
  });
}

function initMelamina() {
  const stage = document.getElementById('mueble');
  const nombreEl = document.getElementById('melaminaNombre');
  const ctaEl = document.getElementById('melaminaCta');
  const rail = document.getElementById('chipRail');
  const track = rail?.querySelector('.chip-rail-track');
  const chips = track ? [...track.querySelectorAll('.chip-btn')] : [];
  if (!stage || !chips.length) return;

  function select(chip, opts) {
    const animate = opts && 'scroll' in opts ? opts.scroll : true;
    const color = chip.dataset.color;
    const nombre = chip.dataset.nombre;
    stage.style.setProperty('--mueble-color', color);
    chips.forEach(c => c.classList.toggle('is-active', c === chip));
    if (ctaEl) ctaEl.href = buildWspHref([`Hola Cristian, quiero pedir un presupuesto en color ${nombre} para mi cocina o placar.`]);
    if (!animate) { nombreEl.textContent = nombre; return; }
    nombreEl.style.transition = 'opacity .2s';
    nombreEl.style.opacity = 0;
    setTimeout(() => { nombreEl.textContent = nombre; nombreEl.style.opacity = 1; }, 200);
    chip.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
  }

  chips.forEach(chip => chip.addEventListener('click', () => select(chip, { scroll: true })));
  select(chips[0], { scroll: false });

  document.getElementById('chipPrev')?.addEventListener('click', () => rail.scrollBy({ left: -180, behavior: reduceMotion ? 'auto' : 'smooth' }));
  document.getElementById('chipNext')?.addEventListener('click', () => rail.scrollBy({ left: 180, behavior: reduceMotion ? 'auto' : 'smooth' }));
}

function initMap() {
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;
  const coords = [-26.78, -65.24];
  const map = L.map(el, { scrollWheelZoom: false }).setView(coords, 14);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19,
  }).addTo(map);
  const icon = L.divIcon({ className: 'map-pin', html: '<span></span>', iconSize: [20, 20], iconAnchor: [10, 10] });
  L.marker(coords, { icon }).addTo(map);
}

function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', () => {
  wireWspLinks();
  initNav();
  initAntiCopia();
  initRails();
  initMelamina();
  initReveals();
  initMap();
  initFooterYear();
});

window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
});
