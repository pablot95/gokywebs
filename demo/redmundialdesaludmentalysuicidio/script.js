document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

if (hasGsap) {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; el.style.filter = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3600);
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  const bd = document.querySelector('.nav-backdrop');
  const close = () => {
    nav.classList.remove('open'); bd?.classList.remove('open'); nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd?.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd?.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const mq = window.matchMedia('(min-width: 769px)');
  const sync = () => { if (mq.matches) { nav.removeAttribute('inert'); close(); } else if (!nav.classList.contains('open')) { nav.setAttribute('inert', ''); } };
  mq.addEventListener('change', sync);
  sync();
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

const NODES = [
  [112, 262], [128, 196], [168, 146], [228, 112], [300, 98], [376, 104], [440, 132],
  [486, 180], [500, 242], [478, 296], [432, 326], [386, 338], [352, 378], [330, 428],
  [286, 404], [246, 368], [196, 352], [148, 318],
  [232, 192], [306, 172], [372, 206], [272, 254], [350, 262], [206, 278], [410, 282]
];
const SEED = 21;
const NS = 'http://www.w3.org/2000/svg';

function buildNet(svg, decorative) {
  if (!svg) return null;
  const edges = [];
  for (let i = 0; i < NODES.length; i++) {
    for (let j = i + 1; j < NODES.length; j++) {
      const d = Math.hypot(NODES[i][0] - NODES[j][0], NODES[i][1] - NODES[j][1]);
      if (d < 108) edges.push({ i, j, d });
    }
  }
  const distToSeed = NODES.map(p => Math.hypot(p[0] - NODES[SEED][0], p[1] - NODES[SEED][1]));
  const maxDist = Math.max(...distToSeed);

  const gEdges = document.createElementNS(NS, 'g');
  const gNodes = document.createElementNS(NS, 'g');
  svg.append(gEdges, gNodes);

  const edgeEls = edges.map(e => {
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('class', 'edge');
    line.setAttribute('x1', NODES[e.i][0]); line.setAttribute('y1', NODES[e.i][1]);
    line.setAttribute('x2', NODES[e.j][0]); line.setAttribute('y2', NODES[e.j][1]);
    gEdges.appendChild(line);
    const len = Math.ceil(e.d) + 1;
    line.setAttribute('stroke-dasharray', len);
    return { el: line, len, order: (distToSeed[e.i] + distToSeed[e.j]) / (2 * maxDist) };
  });

  const nodeEls = NODES.map((p, idx) => {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', idx === SEED ? 'node n-seed' : 'node');
    const off = document.createElementNS(NS, 'circle');
    off.setAttribute('class', 'n-off'); off.setAttribute('cx', p[0]); off.setAttribute('cy', p[1]); off.setAttribute('r', 4.2);
    const on = document.createElementNS(NS, 'circle');
    on.setAttribute('class', 'n-on'); on.setAttribute('cx', p[0]); on.setAttribute('cy', p[1]); on.setAttribute('r', idx === SEED ? 8 : 6.4);
    g.append(off, on);
    gNodes.appendChild(g);
    return { el: on, order: distToSeed[idx] / maxDist, idx };
  });

  if (decorative) svg.classList.add('net-deco');
  return { edgeEls, nodeEls };
}

function initChapter() {
  const stage = document.getElementById('red');
  const svg = stage?.querySelector('.net');
  if (!svg) return;
  const net = buildNet(svg, false);
  const steps = Array.from(stage.querySelectorAll('.step'));
  const counter = document.getElementById('netCount');
  if (!net || !hasGsap || reduceMotion) return;

  stage.classList.add('is-chapter');
  const TOTAL = 4;
  const nodes = net.nodeEls.filter(n => n.idx !== SEED).sort((a, b) => a.order - b.order);
  const seed = net.nodeEls.find(n => n.idx === SEED);
  const edges = net.edgeEls.slice().sort((a, b) => a.order - b.order);

  const setStep = p => {
    const i = Math.min(steps.length - 1, Math.max(0, Math.floor(p * steps.length)));
    steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
    if (counter) {
      const t = p * TOTAL;
      const lit = 1 + nodes.filter(n => t >= 1 + n.order * 1.9 + 0.45).length;
      counter.textContent = lit;
    }
  };

  const buildTimeline = trigger => {
    gsap.set(net.nodeEls.map(n => n.el), { opacity: 0, scale: 0.35 });
    gsap.set(net.edgeEls.map(e => e.el), { strokeDashoffset: i => net.edgeEls[i].len, opacity: 0 });
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, scrollTrigger: trigger });
    tl.to(seed.el, { opacity: 1, scale: 1, duration: 0.6 }, 0.1);
    nodes.forEach(n => { tl.to(n.el, { opacity: 1, scale: 1, duration: 0.5 }, 1 + n.order * 1.9); });
    edges.forEach(e => { tl.to(e.el, { strokeDashoffset: 0, opacity: 0.55, duration: 0.6 }, 1.35 + e.order * 1.9); });
    tl.to({}, { duration: 0.2 }, TOTAL - 0.2);
    return tl;
  };

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px)', () => {
    const tl = buildTimeline({
      trigger: stage, start: 'top top', end: '+=260%', pin: true, scrub: 0.6,
      invalidateOnRefresh: true, onUpdate: self => setStep(self.progress)
    });
    setStep(0);
    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  });

  mm.add('(max-width: 1080px)', () => {
    stage.classList.add('is-sticky-mobile');
    requestAnimationFrame(() => ScrollTrigger.refresh());
    const tl = buildTimeline({
      trigger: stage, start: 'top top', end: 'bottom bottom', scrub: 0.6,
      invalidateOnRefresh: true, onUpdate: self => setStep(self.progress)
    });
    setStep(0);
    return () => {
      stage.classList.remove('is-sticky-mobile');
      tl.scrollTrigger?.kill(); tl.kill();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
  });
}

function initHeroScene() {
  buildNet(document.querySelector('.hero-net'), true);
  if (!hasGsap || reduceMotion) return;
  const lines = document.querySelectorAll('.hero-title .line > span');
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  gsap.set('.scene-frame img', { scale: 1.09 });
  tl.from('.hero-eyebrow', { opacity: 0, y: 16, duration: 0.7 }, 0.05)
    .from(lines, { yPercent: 112, duration: 1.05, stagger: 0.11 }, 0.1)
    .from('.hero-lead', { opacity: 0, y: 22, duration: 0.9 }, 0.55)
    .from('.hero-cta .btn', { opacity: 0, y: 18, duration: 0.7, stagger: 0.1 }, 0.72)
    .from('.hero-note', { opacity: 0, y: 14, duration: 0.7 }, 0.9)
    .from('.scene-frame', { opacity: 0, clipPath: 'inset(100% 0 0 0)', duration: 1.15, ease: 'expo.out' }, 0.2)
    .to('.scene-frame img', { scale: 1, duration: 1.4, ease: 'power2.out' }, 0.2)
    .from('.scene-block', { opacity: 0, scaleY: 0.4, transformOrigin: 'top center', duration: 0.9 }, 0.45)
    .from('.scene-cut', { opacity: 0, x: -36, rotate: -4, duration: 1, ease: 'expo.out' }, 0.6)
    .from('.scene-tag', { opacity: 0, y: 12, duration: 0.6 }, 0.95);
}

function initParallax() {
  if (!hasGsap || reduceMotion) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
    gsap.to('.quienes-media img', { yPercent: -5, ease: 'none', scrollTrigger: { trigger: '.quienes-media', start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
    gsap.to('.prop-band img', { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '.prop-band', start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
    gsap.to('.dest-cut', { y: -18, ease: 'none', scrollTrigger: { trigger: '.dest-head', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
    gsap.to('.hero-net', { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 } });
  });
}

function initCounters() {
  const els = document.querySelectorAll('.count');
  if (!els.length) return;
  const run = el => {
    const target = Number(el.dataset.count || 0);
    const prefix = el.dataset.prefix || '';
    if (reduceMotion || !hasGsap) { el.textContent = prefix + target.toLocaleString('es-AR'); return; }
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 1.8, ease: 'power2.out',
      onUpdate: () => { el.textContent = prefix + Math.round(obj.v).toLocaleString('es-AR'); }
    });
  };
  if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.4 });
  els.forEach(el => io.observe(el));
}

function initAccordion() {
  const items = document.querySelectorAll('.acc-item');
  items.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) items.forEach(other => { if (other !== item) other.open = false; });
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  });
}

function initForm() {
  const form = document.getElementById('formContacto');
  if (!form) return;
  const rules = [
    { id: 'f-nombre', err: 'e-nombre', test: v => v.trim().length >= 3, msg: 'Escribinos tu nombre completo.' },
    { id: 'f-inst', err: 'e-inst', test: v => v.trim().length >= 2, msg: 'Contanos de qué institución nos escribís.' },
    { id: 'f-tel', err: 'e-tel', test: v => v.replace(/\D/g, '').length >= 8, msg: 'Necesitamos un teléfono para responderte.' }
  ];
  const tel = document.getElementById('f-tel');
  tel?.addEventListener('input', () => {
    const d = tel.value.replace(/\D/g, '').slice(0, 12);
    if (d.length <= 2) tel.value = d;
    else if (d.length <= 6) tel.value = `${d.slice(0, 2)} ${d.slice(2)}`;
    else tel.value = `${d.slice(0, 2)} ${d.slice(2, 6)}-${d.slice(6)}`;
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    rules.forEach(r => {
      const input = document.getElementById(r.id);
      const errEl = document.getElementById(r.err);
      const valid = r.test(input?.value || '');
      input?.closest('.field')?.classList.toggle('invalid', !valid);
      input?.setAttribute('aria-invalid', valid ? 'false' : 'true');
      if (errEl) errEl.textContent = valid ? '' : r.msg;
      if (!valid && ok) { input?.focus(); ok = false; }
    });
    if (!ok) return;
    const btn = form.querySelector('button[type="submit"]');
    const label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false; btn.textContent = label;
      form.reset();
      form.querySelectorAll('.field').forEach(f => f.classList.remove('invalid'));
      form.querySelectorAll('.err').forEach(f => (f.textContent = ''));
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const map = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView([-34.6417, -58.5617], 14);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19
  }).addTo(map);
  L.circleMarker([-34.6417, -58.5617], {
    radius: 11, color: '#F5C518', weight: 3, fillColor: '#3E8FE0', fillOpacity: 0.85
  }).addTo(map).bindPopup('Red Mundial de Salud Mental y Suicidio · Ramos Mejía');
}

function init() {
  document.getElementById('year').textContent = new Date().getFullYear();
  initNav();
  initReveals();
  initWspFloat();
  initHeroScene();
  initChapter();
  initParallax();
  initCounters();
  initAccordion();
  initForm();
  initMapa();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
