const WHATSAPP_NUMBER = '5491130121110';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none';
  });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

function initWhatsAppLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => {
    a.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(a.dataset.wspMsg)}`);
  });
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
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
}

function initMagnetic() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || typeof gsap === 'undefined') return;
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * .2, y: (e.clientY - r.top - r.height / 2) * .3, duration: .3 });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: .45, ease: 'elastic.out(1, .55)' }));
  });
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (typeof gsap === 'undefined' || reduceMotion) {
    items.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
    return;
  }
  const presets = {
    up: { y: 0, opacity: 1, duration: .9 },
    scale: { scale: 1, y: 0, opacity: 1, duration: 1 },
    clip: { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 1.1 },
  };
  items.forEach(el => {
    gsap.to(el, {
      ...presets[el.dataset.animate || 'up'],
      ease: 'expo.out',
      delay: parseFloat(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

function initMapa() {
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;
  const coords = [-34.5874482, -58.3853395];
  const map = L.map('map', { scrollWheelZoom: false }).setView(coords, 15);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19,
  }).addTo(map);
  const icon = L.divIcon({
    className: 'map-marker',
    html: '<span></span>',
    iconSize: [22, 22],
  });
  L.marker(coords, { icon }).addTo(map).bindPopup('Cerrajería Ítalo<br>Rodríguez Peña 2069, Recoleta');
}

function initProcesoChapter() {
  const stage = document.getElementById('procesoStage');
  const grid = document.getElementById('procesoGrid');
  const visual = document.getElementById('procesoVisual');
  const pasos = document.querySelectorAll('#procesoPasos li');
  if (!stage || !grid || !visual || !pasos.length) return;

  const radarPing = document.getElementById('radarPing');
  const ruta = document.getElementById('rutaPunteada');
  const shackle = document.getElementById('candadoShackle');
  const glow = visual.querySelector('.candado-glow');

  const setStep = progress => {
    const idx = Math.min(pasos.length - 1, Math.floor(progress * pasos.length));
    pasos.forEach(li => li.classList.toggle('is-on', Number(li.dataset.paso) === idx));
  };

  if (typeof gsap === 'undefined') { setStep(0); return; }

  if (reduceMotion) {
    if (ruta) { ruta.style.strokeDashoffset = 0; ruta.style.opacity = 1; }
    if (shackle) shackle.style.transform = 'rotate(-55deg)';
    if (glow) glow.classList.add('is-lit');
    pasos.forEach((li, i) => li.classList.toggle('is-on', i === pasos.length - 1));
    return;
  }

  const buildTimeline = () => {
    const tl = gsap.timeline({ paused: true });
    if (radarPing) tl.fromTo(radarPing, { scale: .3, opacity: .8 }, { scale: 1.9, opacity: 0, ease: 'none', duration: .6 }, .1);
    if (ruta) tl.to(ruta, { strokeDashoffset: 0, opacity: 1, ease: 'none', duration: .7 }, 1.05);
    if (shackle) tl.to(shackle, { rotate: -55, ease: 'none', duration: .8 }, 1.95);
    if (glow) tl.call(() => glow.classList.add('is-lit'), null, 1.95).call(() => glow.classList.remove('is-lit'), null, 0);
    return tl;
  };

  ScrollTrigger.matchMedia({
    '(min-width: 1081px)': () => {
      const tl = buildTimeline();
      const st = ScrollTrigger.create({
        trigger: stage, start: 'top top', end: '+=220%', pin: true, scrub: .6,
        anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: self => { tl.progress(self.progress); setStep(self.progress); },
      });
      return () => st.kill();
    },
    '(max-width: 1080px) and (prefers-reduced-motion: no-preference)': () => {
      stage.classList.add('is-sticky-mobile');
      let inner = grid.querySelector('.sticky-inner');
      if (!inner) {
        inner = document.createElement('div');
        inner.className = 'sticky-inner';
        inner.appendChild(visual);
        inner.appendChild(document.getElementById('procesoPasos'));
        grid.appendChild(inner);
      }
      requestAnimationFrame(() => ScrollTrigger.refresh());
      const tl = buildTimeline();
      const st = ScrollTrigger.create({
        trigger: grid, start: 'top top', end: 'bottom bottom', scrub: .6,
        invalidateOnRefresh: true,
        onUpdate: self => { tl.progress(self.progress); setStep(self.progress); },
      });
      return () => { st.kill(); stage.classList.remove('is-sticky-mobile'); };
    },
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initWhatsAppLinks();
  initWspFloat();
  initNav();
  initMagnetic();
  initReveals();
  initMapa();
  initProcesoChapter();
});
