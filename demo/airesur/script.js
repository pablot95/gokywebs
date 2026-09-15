const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const lerp = (a, b, t) => a + (b - a) * t;

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
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
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
  const sync = () => {
    if (window.matchMedia('(min-width: 901px)').matches) { nav.removeAttribute('inert'); close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  sync();
  window.addEventListener('resize', sync, { passive: true });
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

const TEMP_MIN = -22;
const TEMP_MAX = 45;
const RAMP = [
  { p: 0, c: [34, 211, 238] },
  { p: 0.38, c: [53, 224, 127] },
  { p: 0.70, c: [255, 197, 61] },
  { p: 1, c: [255, 59, 47] }
];

function rampColor(t) {
  const k = clamp(t, 0, 1);
  for (let i = 1; i < RAMP.length; i++) {
    if (k <= RAMP[i].p || i === RAMP.length - 1) {
      const a = RAMP[i - 1], b = RAMP[i];
      const f = clamp((k - a.p) / (b.p - a.p), 0, 1);
      return `rgb(${Math.round(lerp(a.c[0], b.c[0], f))}, ${Math.round(lerp(a.c[1], b.c[1], f))}, ${Math.round(lerp(a.c[2], b.c[2], f))})`;
    }
  }
  return 'rgb(34, 211, 238)';
}

function initThermalJourney() {
  const sections = [...document.querySelectorAll('[data-temp]')];
  if (!sections.length) return;
  const fill = document.getElementById('thermoFill');
  const fillM = document.getElementById('thermoFillM');
  const value = document.getElementById('thermoValue');
  const valueM = document.getElementById('thermoValueM');
  const label = document.getElementById('thermoLabel');
  const labelM = document.getElementById('thermoLabelM');

  let stops = [];
  let lastHeight = 0;
  const measure = () => {
    lastHeight = document.documentElement.scrollHeight;
    stops = sections.map(el => {
      const r = el.getBoundingClientRect();
      return { top: r.top + window.scrollY, height: Math.max(1, r.height), temp: parseFloat(el.dataset.temp), zone: el.dataset.zone || '' };
    });
  };

  let lastZone = '';
  const paint = () => {
    if (document.documentElement.scrollHeight !== lastHeight) measure();
    if (!stops.length) return;
    const line = window.scrollY + window.innerHeight * 0.45;
    let idx = 0;
    for (let i = 0; i < stops.length; i++) {
      if (line >= stops[i].top) idx = i;
    }
    const cur = stops[idx];
    const next = stops[idx + 1] || cur;
    const within = clamp((line - cur.top) / cur.height, 0, 1);
    const temp = lerp(cur.temp, next.temp, within);
    const t = clamp((temp - TEMP_MIN) / (TEMP_MAX - TEMP_MIN), 0, 1);
    const color = rampColor(t);

    document.documentElement.style.setProperty('--accent', color);
    const pct = (t * 100).toFixed(2) + '%';
    if (fill) fill.style.height = pct;
    if (fillM) fillM.style.width = pct;
    const rounded = Math.round(temp);
    const txt = (rounded < 0 ? '−' : '') + Math.abs(rounded);
    if (value) value.textContent = txt;
    if (valueM) valueM.textContent = txt;
    if (cur.zone !== lastZone) {
      lastZone = cur.zone;
      if (label) label.textContent = cur.zone;
      if (labelM) labelM.textContent = cur.zone;
    }
  };

  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; paint(); });
  };
  const onResize = () => { measure(); paint(); };

  measure();
  paint();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('load', onResize);
}

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  const bg = document.querySelector('.hero-bg img');
  const h1 = document.querySelector('.hero-copy h1');
  const unit = document.querySelector('.hero-unit');
  const seal = document.querySelector('.seal');
  if (bg) tl.fromTo(bg, { scale: 1.09 }, { scale: 1, duration: 1.5, ease: 'power2.out' }, 0);
  if (h1) tl.fromTo(h1, { clipPath: 'inset(0 0 102% 0)', y: 22 }, { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.05 }, 0.12);
  tl.fromTo('.hero-copy .eyebrow', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .7 }, 0.05);
  tl.fromTo('.hero-lead', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .8 }, 0.5);
  tl.fromTo('.hero-cta .btn', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .09 }, 0.62);
  tl.fromTo('.hero-data > div', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .65, stagger: .08 }, 0.74);
  if (unit) tl.fromTo(unit, { x: 54, opacity: 0, scale: .965 }, { x: 0, opacity: 1, scale: 1, duration: 1.25 }, 0.2);
  if (seal) tl.fromTo(seal, { scale: .82, opacity: 0 }, { scale: 1, opacity: 1, duration: .8, ease: 'back.out(1.6)' }, 0.95);
}

function initHeroParallax() {
  if (typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const bg = document.querySelector('.hero-bg img');
  const unit = document.querySelector('.hero-unit');
  if (bg) gsap.to(bg, { yPercent: 9, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 } });
  if (unit) gsap.to(unit, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 } });
}

function initStage() {
  const stage = document.getElementById('stage');
  if (!stage) return;
  const steps = [...stage.querySelectorAll('.stage-steps li')];
  const imgs = [...stage.querySelectorAll('.stage-img')];
  const hud = document.getElementById('stageHud');
  if (!steps.length) return;
  const labels = steps.map(li => li.querySelector('h3')?.textContent || '');

  if (typeof ScrollTrigger === 'undefined' || reduceMotion) {
    stage.classList.add('no-st');
    steps.forEach(li => li.classList.add('is-on'));
    return;
  }

  let cur = -1;
  const setStep = p => {
    const i = clamp(Math.floor(p * steps.length), 0, steps.length - 1);
    if (i === cur) return;
    cur = i;
    steps.forEach((li, k) => li.classList.toggle('is-on', k === i));
    imgs.forEach((im, k) => im.classList.toggle('is-on', k === i));
    if (hud) hud.textContent = labels[i];
  };
  setStep(0);
  ScrollTrigger.create({
    trigger: stage,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: self => setStep(self.progress)
  });
}

function initRailDrag() {
  const rail = document.getElementById('rail');
  if (!rail) return;
  let down = false, startX = 0, startLeft = 0, moved = 0;
  rail.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    down = true; moved = 0;
    startX = e.clientX; startLeft = rail.scrollLeft;
    rail.classList.add('is-drag');
  });
  rail.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > moved) moved = Math.abs(dx);
    rail.scrollLeft = startLeft - dx;
  });
  const end = () => { if (!down) return; down = false; rail.classList.remove('is-drag'); };
  rail.addEventListener('pointerup', end);
  rail.addEventListener('pointercancel', end);
  rail.addEventListener('pointerleave', end);
  rail.addEventListener('click', e => {
    if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
    moved = 0;
  }, true);
  rail.addEventListener('keydown', e => {
    const step = rail.clientWidth * .8;
    if (e.key === 'ArrowRight') { e.preventDefault(); rail.scrollBy({ left: step, behavior: 'smooth' }); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); rail.scrollBy({ left: -step, behavior: 'smooth' }); }
  });
}

function initCounters() {
  const nodes = document.querySelectorAll('[data-count]');
  if (!nodes.length) return;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    nodes.forEach(n => { n.textContent = Number(n.dataset.count).toLocaleString('es-AR'); });
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const node = entry.target;
      io.unobserve(node);
      const target = Number(node.dataset.count) || 0;
      const dur = 1300;
      let t0 = null;
      const tick = now => {
        if (t0 === null) t0 = now;
        const p = clamp((now - t0) / dur, 0, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        node.textContent = Math.round(target * eased).toLocaleString('es-AR');
        if (p < 1) requestAnimationFrame(tick);
      };
      node.textContent = '0';
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  nodes.forEach(n => io.observe(n));
}

function initMarquee() {
  const row = document.getElementById('marqueeRow');
  if (!row) return;
  row.innerHTML += row.innerHTML;
}

function initMap() {
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;
  const map = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView([-34.6037, -58.3816], 10);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19
  }).addTo(map);
  const icon = L.divIcon({ className: 'zona-pin', html: '<span></span>', iconSize: [14, 14], iconAnchor: [7, 7] });
  L.marker([-34.6037, -58.3816], { icon, title: 'Zona de cobertura AIRESUR' }).addTo(map);
  L.circle([-34.6037, -58.3816], { radius: 32000, color: '#22D3EE', weight: 1, opacity: .5, fillColor: '#22D3EE', fillOpacity: .07 }).addTo(map);
}

function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const setError = (input, msg) => {
    const field = input.closest('.field');
    field?.classList.toggle('invalid', Boolean(msg));
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    const slot = form.querySelector(`[data-err-for="${input.id}"]`);
    if (slot) slot.textContent = msg || '';
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = form.elements.nombre;
    const tel = form.elements.tel;
    let ok = true;
    if (String(nombre.value).trim().length < 2) { setError(nombre, 'Escribí tu nombre.'); ok = false; } else setError(nombre, '');
    const digits = String(tel.value).replace(/\D/g, '');
    if (digits.length < 8) { setError(tel, 'Dejanos un teléfono de al menos 8 dígitos.'); ok = false; } else setError(tel, '');
    if (!ok) { form.querySelector('.field.invalid input')?.focus(); return; }
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = original;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = String(new Date().getFullYear());
}

initNav();
initReveals();
initWspFloat();
initThermalJourney();
initHero();
initHeroParallax();
initStage();
initRailDrag();
initCounters();
initMarquee();
initForm();
initYear();
window.addEventListener('load', initMap);
