if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

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
  const header = document.querySelector('.site-header');
  if (!toggle || !nav || !header) return;
  let bd = header.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; header.appendChild(bd); }
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('hero-in')));
  if (reduceMotion || !window.matchMedia('(hover: hover)').matches) return;
  const layers = hero.querySelectorAll('[data-layer]');
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    layers.forEach(el => {
      const f = parseFloat(el.dataset.layer) || 0;
      el.style.translate = `${(-nx * 14 * f).toFixed(1)}px ${(-ny * 10 * f).toFixed(1)}px`;
    });
  });
  hero.addEventListener('pointerleave', () => {
    layers.forEach(el => { el.style.translate = '0px 0px'; });
  });
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

function initCounters() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  const animate = el => {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (reduceMotion) { el.textContent = target.toLocaleString('es-AR'); return; }
    const t0 = performance.now();
    const dur = 1300;
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('es-AR');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!('IntersectionObserver' in window)) { nums.forEach(el => animate(el)); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); }
    });
  }, { threshold: 0.6 });
  nums.forEach(el => io.observe(el));
}

function setPuestaStatic() {
  const section = document.getElementById('puesta');
  if (!section) return;
  section.classList.add('is-static');
  const rpm = document.getElementById('rpmNum');
  if (rpm) rpm.textContent = (1480).toLocaleString('es-AR');
  const estado = document.getElementById('estadoLabel');
  if (estado) { estado.textContent = 'Equipo operativo'; estado.classList.add('is-ok'); }
  const run = document.getElementById('lampRun');
  if (run) run.classList.add('is-on');
  const diag = document.getElementById('lampDiag');
  if (diag) diag.classList.remove('is-on');
  document.querySelectorAll('#bancoCheck li').forEach(li => li.classList.add('done'));
  document.querySelectorAll('.p-step').forEach(s => s.classList.add('is-active'));
}

function initPuesta() {
  const section = document.getElementById('puesta');
  if (!section) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') { setPuestaStatic(); return; }

  const needle = document.getElementById('gaugeNeedle');
  const rpm = document.getElementById('rpmNum');
  const estado = document.getElementById('estadoLabel');
  const sello = document.getElementById('selloOk');
  const lampFalla = document.getElementById('lampFalla');
  const lampDiag = document.getElementById('lampDiag');
  const lampRun = document.getElementById('lampRun');
  const checks = Array.from(document.querySelectorAll('#bancoCheck li'));
  const steps = Array.from(document.querySelectorAll('.p-step'));
  const rpmState = { v: 0 };

  const updateState = p => {
    const idx = p < 0.18 ? 0 : p < 0.45 ? 1 : p < 0.72 ? 2 : 3;
    steps.forEach((s, i) => s.classList.toggle('is-active', i <= idx));
    checks[0]?.classList.toggle('done', p > 0.24);
    checks[1]?.classList.toggle('done', p > 0.36);
    checks[2]?.classList.toggle('done', p > 0.54);
    checks[3]?.classList.toggle('done', p > 0.66);
    lampFalla?.classList.toggle('is-on', p < 0.7);
    lampDiag?.classList.toggle('is-on', p > 0.2 && p < 0.72);
    lampRun?.classList.toggle('is-on', p >= 0.74);
    if (estado) {
      const ok = p > 0.8;
      estado.classList.toggle('is-ok', ok);
      const label = ok ? 'Equipo operativo' : p > 0.2 ? 'Intervención en curso' : 'Falla detectada';
      if (estado.textContent !== label) estado.textContent = label;
    }
    sello?.classList.toggle('is-on', p > 0.88);
  };

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    gsap.set(needle, { rotation: -115, transformOrigin: '110px 128px' });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=230%',
        pin: '.puesta-pin',
        scrub: 0.6,
        onUpdate: self => updateState(self.progress),
      },
    });
    tl.to(needle, { rotation: -98, duration: 0.08, ease: 'power1.inOut' }, 0.22)
      .to(needle, { rotation: -112, duration: 0.08, ease: 'power1.inOut' }, 0.32)
      .to(needle, { rotation: 64, duration: 0.26, ease: 'power2.inOut' }, 0.7)
      .to(rpmState, {
        v: 1480, duration: 0.26, ease: 'power2.out',
        onUpdate: () => { if (rpm) rpm.textContent = Math.round(rpmState.v).toLocaleString('es-AR'); },
      }, 0.7);
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      updateState(0);
      if (rpm) rpm.textContent = '0';
      gsap.set(needle, { rotation: -115 });
    };
  });

  mm.add('(max-width: 1080px), (prefers-reduced-motion: reduce)', () => {
    setPuestaStatic();
    return () => {
      section.classList.remove('is-static');
      const diag = document.getElementById('lampDiag');
      if (diag) diag.classList.remove('is-on');
    };
  });
}

function initOversized() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const word = document.getElementById('oversizedWord');
  if (!word) return;
  gsap.fromTo(word, { xPercent: 6 }, {
    xPercent: -16,
    ease: 'none',
    scrollTrigger: { trigger: '.obras', start: 'top bottom', end: 'bottom top', scrub: 0.8 },
  });
}

function initFaq() {
  document.querySelectorAll('.faq-list details').forEach(d => {
    d.addEventListener('toggle', () => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  });
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const map = L.map(el, { scrollWheelZoom: false, zoomControl: true });
  map.setView([-34.6037, -58.3816], 9);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 18,
  }).addTo(map);
  L.circle([-34.6037, -58.3816], {
    radius: 38000, color: '#2F7BFF', weight: 1.5, fillColor: '#2F7BFF', fillOpacity: 0.07,
  }).addTo(map);
  L.circleMarker([-34.6037, -58.3816], {
    radius: 9, color: '#1E5FBF', weight: 3, fillColor: '#2F7BFF', fillOpacity: 1,
  }).addTo(map).bindPopup('Indumec · Buenos Aires y GBA');
}

function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      const empty = !field.value.trim();
      field.classList.toggle('error', empty);
      if (empty) valid = false;
    });
    if (!valid) { showToast('Completá los campos marcados para que podamos llamarte.'); return; }
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
  form.querySelectorAll('input, textarea').forEach(f => {
    f.addEventListener('input', () => f.classList.remove('error'));
  });
}

initNav();
initWspFloat();
initProgress();
initHero();
initReveals();
initCounters();
initPuesta();
initOversized();
initFaq();
initMapa();
initForm();
