if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; el.style.filter = 'none'; });
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
function initDevToolsGuard() {
  let overlay = null;
  let open = false;
  window.setInterval(() => {
    const isOpen = window.outerWidth - window.innerWidth > 200 || window.outerHeight - window.innerHeight > 200;
    if (isOpen === open) return;
    open = isOpen;
    if (open) {
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'devtools-overlay';
        overlay.innerHTML = '<p>Contenido protegido.</p>';
        document.body.appendChild(overlay);
      }
      overlay.classList.add('visible');
    } else if (overlay) {
      overlay.classList.remove('visible');
    }
  }, 800);
}

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
      el.style.translate = `${(-nx * 13 * f).toFixed(1)}px ${(-ny * 9 * f).toFixed(1)}px`;
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

const clamp01 = v => Math.max(0, Math.min(1, v));
const fadeIn = (p, a, b) => clamp01((p - a) / (b - a));
const fadeOut = (p, a, b) => 1 - fadeIn(p, a, b);

function formatHora(min) {
  const paso = Math.round(min / 5) * 5;
  const h = Math.floor(paso / 60);
  const m = paso % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function setDiaStatic() {
  const section = document.getElementById('dia');
  if (!section) return;
  section.classList.add('is-static');
  const hora = document.getElementById('diaHora');
  if (hora) hora.textContent = '17:30';
  const sol = document.getElementById('astroSol');
  if (sol) { sol.style.left = '72%'; sol.style.top = '50%'; }
  document.querySelectorAll('.momento').forEach(m => m.classList.add('is-active'));
}

function initDia() {
  const section = document.getElementById('dia');
  if (!section) return;
  const escena = section.querySelector('.dia-escena');
  const estrellas = document.getElementById('estrellas');
  if (estrellas && !estrellas.children.length) {
    for (let i = 0; i < 16; i++) {
      const s = document.createElement('span');
      s.style.left = `${(Math.random() * 96 + 2).toFixed(1)}%`;
      s.style.top = `${(Math.random() * 82 + 4).toFixed(1)}%`;
      s.style.animationDelay = `${(Math.random() * 2.4).toFixed(2)}s`;
      estrellas.appendChild(s);
    }
  }
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') { setDiaStatic(); return; }

  const capas = {
    alba: section.querySelector('.cielo-alba'),
    dia: section.querySelector('.cielo-dia'),
    tarde: section.querySelector('.cielo-tarde'),
    noche: section.querySelector('.cielo-noche'),
  };
  const sol = document.getElementById('astroSol');
  const luna = document.getElementById('astroLuna');
  const ventana = document.getElementById('ventanaCabana');
  const fogata = document.getElementById('fogata');
  const hora = document.getElementById('diaHora');
  const momentos = Array.from(section.querySelectorAll('.momento'));

  const updateDia = p => {
    if (capas.alba) capas.alba.style.opacity = p < 0.18 ? 1 : fadeOut(p, 0.18, 0.3);
    if (capas.dia) capas.dia.style.opacity = Math.min(fadeIn(p, 0.18, 0.3), fadeOut(p, 0.5, 0.62));
    if (capas.tarde) capas.tarde.style.opacity = Math.min(fadeIn(p, 0.5, 0.62), fadeOut(p, 0.78, 0.9));
    if (capas.noche) capas.noche.style.opacity = fadeIn(p, 0.78, 0.9);
    if (sol && escena) {
      const t = clamp01(p / 0.82);
      const w = escena.offsetWidth;
      const h = escena.offsetHeight;
      const x = 0.05 * w + 0.82 * w * t - 26;
      const y = 0.68 * h - Math.sin(Math.PI * t) * 0.52 * h - 26;
      gsap.set(sol, { x, y, opacity: p > 0.86 ? fadeOut(p, 0.86, 0.94) : 1 });
    }
    if (luna) luna.style.opacity = fadeIn(p, 0.84, 0.95);
    if (estrellas) estrellas.style.opacity = fadeIn(p, 0.82, 0.96);
    if (ventana) ventana.style.opacity = p > 0.8 ? 1 : 0;
    fogata?.classList.toggle('on', p > 0.86);
    if (hora) hora.textContent = formatHora(390 + (1290 - 390) * p);
    const idx = p < 0.16 ? 0 : p < 0.42 ? 1 : p < 0.62 ? 2 : p < 0.82 ? 3 : 4;
    momentos.forEach((m, i) => m.classList.toggle('is-active', i <= idx));
  };

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1021px) and (prefers-reduced-motion: no-preference)', () => {
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=240%',
      pin: '.dia-pin',
      scrub: 0.6,
      onUpdate: self => updateDia(self.progress),
      onRefresh: self => updateDia(self.progress),
    });
    updateDia(0);
    return () => {
      st.kill();
    };
  });

  mm.add('(max-width: 1020px), (prefers-reduced-motion: reduce)', () => {
    setDiaStatic();
    return () => {
      section.classList.remove('is-static');
      const sol2 = document.getElementById('astroSol');
      if (sol2) { sol2.style.left = ''; sol2.style.top = ''; }
    };
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
  map.setView([-31.4203, -60.3328], 11);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 18,
  }).addTo(map);
  L.circleMarker([-31.4203, -60.3328], {
    radius: 9, color: '#1F3B29', weight: 3, fillColor: '#C8801F', fillOpacity: 1,
  }).addTo(map).bindPopup('Cabañas Don Juvenal · Santa Rosa de Calchines');
}

function initReserva() {
  const form = document.getElementById('reservaForm');
  if (!form || typeof ReservaCore === 'undefined') return;
  const cabana = document.getElementById('r-cabana');
  const llegada = document.getElementById('r-llegada');
  const salida = document.getElementById('r-salida');
  const huespedes = document.getElementById('r-huespedes');
  const resumen = document.getElementById('resumenReserva');
  const menos = document.getElementById('menosHuespedes');
  const mas = document.getElementById('masHuespedes');

  const hoy = new Date();
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  llegada.min = iso(hoy);
  salida.min = iso(hoy);

  const datos = () => ({
    cabana: cabana.value,
    llegada: llegada.value,
    salida: salida.value,
    huespedes: parseInt(huespedes.value, 10) || 1,
    extras: Array.from(form.querySelectorAll('.extra-chip input:checked')).map(c => c.value),
  });

  const actualizar = () => {
    if (llegada.value) salida.min = llegada.value;
    const r = ReservaCore.armarResumen(datos());
    resumen.innerHTML = r ? `Tu estadía: <strong>${esc(r)}</strong>` : 'Elegí cabaña y fechas para ver el resumen.';
  };

  menos.addEventListener('click', () => { huespedes.value = Math.max(1, (parseInt(huespedes.value, 10) || 1) - 1); actualizar(); });
  mas.addEventListener('click', () => { huespedes.value = Math.min(8, (parseInt(huespedes.value, 10) || 1) + 1); actualizar(); });
  form.addEventListener('change', actualizar);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = datos();
    const noches = ReservaCore.calcNoches(d.llegada, d.salida);
    let valid = true;
    cabana.classList.toggle('error', !d.cabana);
    llegada.classList.toggle('error', !d.llegada);
    salida.classList.toggle('error', !d.salida || noches <= 0);
    if (!d.cabana || !d.llegada || !d.salida) valid = false;
    if (noches <= 0 && d.llegada && d.salida) {
      showToast('La salida tiene que ser después de la llegada.');
      return;
    }
    if (!valid) {
      showToast('Completá cabaña y fechas para armar la consulta.');
      return;
    }
    const msg = ReservaCore.armarMensajeReserva(d);
    window.open(`https://wa.me/5493404415605?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });

  form.querySelectorAll('select, input').forEach(f => {
    f.addEventListener('input', () => f.classList.remove('error'));
  });

  actualizar();
}

initDevToolsGuard();
initNav();
initWspFloat();
initHero();
initReveals();
initDia();
initFaq();
initMapa();
initReserva();
