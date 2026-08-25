const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
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
  const sync = () => btn.classList.toggle('visible', window.scrollY > 600);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

function initHero() {
  const lines = document.querySelectorAll('.reveal-line');
  if (!lines.length) return;
  if (reduceMotion) {
    lines.forEach(l => l.classList.add('in'));
    return;
  }
  requestAnimationFrame(() => {
    lines.forEach((l, i) => setTimeout(() => l.classList.add('in'), 150 + i * 140));
  });
}

function initProceso() {
  const pasosWrap = document.getElementById('procesoPasos');
  if (!pasosWrap) return;
  const pasos = pasosWrap.querySelectorAll('.paso');
  const obstruccion = document.getElementById('obstruccion');
  const camara = document.getElementById('camara');
  const chorro = document.getElementById('chorro');
  const particulas = document.getElementById('particulas');
  const flujo = document.getElementById('flujo');
  const setStep = step => pasos.forEach(p => p.classList.toggle('is-on', Number(p.dataset.step) === step));

  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    setStep(0);
    return;
  }

  ScrollTrigger.create({
    trigger: pasosWrap, start: 'top top+=120', end: 'bottom bottom', scrub: .6,
    onUpdate(self) {
      const p = self.progress;
      const step = Math.min(3, Math.floor(p * 4));
      setStep(step);
      const q = (p * 4) % 1;
      let obstruccionOp = 1, camaraOp = 0, chorroOp = 0, particulasOp = 0, flujoOp = 0, camaraX = 40;
      if (step === 1) {
        camaraOp = 1; camaraX = 40 + q * 190;
      } else if (step === 2) {
        obstruccionOp = 1 - q; camaraOp = Math.max(0, 1 - q * 1.4); camaraX = 230;
        chorroOp = 1; particulasOp = 1;
      } else if (step === 3) {
        obstruccionOp = 0; camaraOp = 0;
        chorroOp = Math.max(0, 1 - q); particulasOp = Math.max(0, 1 - q); flujoOp = q;
      }
      obstruccion.style.opacity = String(obstruccionOp);
      camara.style.opacity = String(camaraOp);
      camara.setAttribute('transform', `translate(${camaraX},120)`);
      chorro.style.opacity = String(chorroOp);
      particulas.style.opacity = String(particulasOp);
      flujo.style.opacity = String(flujoOp);
    }
  });
}

function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;
  track.insertAdjacentHTML('beforeend', track.innerHTML);
}

function initMapa() {
  const el = document.getElementById('zonaMapa');
  if (!el || typeof L === 'undefined') return;
  const map = L.map(el, { scrollWheelZoom: false }).setView([-34.6037, -58.3816], 10);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19, subdomains: 'abcd'
  }).addTo(map);
  L.circle([-34.6037, -58.3816], { radius: 28000, color: '#FF0000', weight: 1.5, fillColor: '#FF0000', fillOpacity: .08 }).addTo(map);
  L.marker([-34.6037, -58.3816]).addTo(map).bindPopup('Zona de cobertura: CABA y AMBA');
}

function initMagnetic() {
  if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('.btn-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * .15}px, ${y * .3}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

function initGlowFollow() {
  if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('.rubro-chip').forEach(chip => {
    chip.addEventListener('mousemove', e => {
      const r = chip.getBoundingClientRect();
      chip.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100) + '%');
      chip.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.1, 0.6)}s`;
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
  initNav();
  initHero();
  initMarquee();
  initProceso();
  initMapa();
  initMagnetic();
  initGlowFollow();
  initWspFloat();
  initReveals();
});

window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
});
