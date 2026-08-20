const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WHATSAPP_NUMBER = '5492996824862';
const WSP_MESSAGES = {
  general: 'Hola, quiero hacer una consulta en Elite Gestión Vehicular.',
};

function buildWspHref(lines) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

function wireWspLinks() {
  document.querySelectorAll('.wsp-link[data-wsp]').forEach(a => {
    const key = a.dataset.wsp;
    if (key === 'vehiculo') {
      const nombre = a.dataset.vehiculo || 'este vehículo';
      a.href = buildWspHref([`Hola, quiero consultar por el ${nombre} publicado en la web.`]);
      return;
    }
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

function initLlave() {
  document.querySelectorAll('.llave-stage').forEach(stage => {
    const pasos = [...stage.querySelectorAll('.llave-paso')];
    const keySvg = stage.querySelector('.llave-svg');
    if (!pasos.length) return;

    const setActive = el => pasos.forEach(p => p.classList.toggle('is-active', p === el));

    let queued = false;
    const sweep = () => {
      queued = false;
      const centerY = window.innerHeight / 2;
      let closest = pasos[0], closestDist = Infinity;
      pasos.forEach(p => {
        const r = p.getBoundingClientRect();
        const dist = Math.abs((r.top + r.bottom) / 2 - centerY);
        if (dist < closestDist) { closestDist = dist; closest = p; }
      });
      setActive(closest);

      if (keySvg && !reduceMotion) {
        const stageRect = stage.getBoundingClientRect();
        const total = stageRect.height - window.innerHeight;
        const progress = total > 0 ? Math.min(1, Math.max(0, -stageRect.top / total)) : 0;
        keySvg.style.transform = `rotate(${progress * 540}deg)`;
      }
    };
    const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
    window.addEventListener('scroll', queueSweep, { passive: true });
    window.addEventListener('resize', queueSweep, { passive: true });
    sweep();
  });
}

function initMap() {
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;
  const coords = [-38.9516, -68.0591];
  const map = L.map(el, { scrollWheelZoom: false }).setView(coords, 12);
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
  initLlave();
  initReveals();
  initMap();
  initFooterYear();
});

window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
});
