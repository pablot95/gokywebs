const WHATSAPP_NUMBER = '5492974570348';
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
  const coords = [-45.8632024, -67.4752615];
  const map = L.map('map', { scrollWheelZoom: false }).setView(coords, 13);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19,
  }).addTo(map);
  const icon = L.divIcon({ className: 'map-marker', html: '<span></span>', iconSize: [22, 22] });
  L.marker(coords, { icon }).addTo(map).bindPopup('Centro Médico Terapéutico Dr. René Favaloro<br>Comodoro Rivadavia, Chubut');
}

function initChapters() {
  const caps = document.querySelectorAll('.chapter');
  const visual = document.getElementById('chaptersVisual');
  const progressBar = document.getElementById('chaptersProgressBar');
  if (!caps.length || !visual) return;
  const total = caps.length;
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const capId = entry.target.dataset.cap;
    caps.forEach(c => c.classList.toggle('is-active', c === entry.target));
    visual.querySelectorAll('img').forEach(img => img.classList.toggle('is-active', img.dataset.cap === capId));
    if (progressBar) progressBar.style.width = `${((Number(capId) + 1) / total) * 100}%`;
  }), { threshold: .55 });
  caps.forEach(c => io.observe(c));
}

document.addEventListener('DOMContentLoaded', () => {
  initWhatsAppLinks();
  initWspFloat();
  initNav();
  initMagnetic();
  initReveals();
  initMapa();
  initChapters();
});
