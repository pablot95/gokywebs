const WHATSAPP_NUMBER = '5493804358295';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const DURACIONES = {
  'Taichi para principiantes': '60 minutos',
  'Taichi continuo': '60 minutos',
  'Taichi individual': '45 minutos',
  'Masaje descontracturante': '50 minutos',
  'Masaje relajante': '50 minutos',
  'Masaje de pies': '30 minutos',
};

function waHref(lines) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

function initRecorrido() {
  const caps = document.querySelectorAll('.chapter');
  if (!caps.length) return;
  const niveles = document.querySelectorAll('.nivel');
  const fotos = document.querySelectorAll('.chapters-foto img');
  const setActive = cap => {
    niveles.forEach(n => n.classList.toggle('is-active', n.dataset.nivel === cap));
    fotos.forEach(f => f.classList.toggle('is-on', f.dataset.capFoto === cap));
    caps.forEach(c => c.classList.toggle('is-active', c.dataset.cap === cap));
  };
  if (!('IntersectionObserver' in window)) { setActive(caps[0].dataset.cap); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.dataset.cap); });
  }, { threshold: .55 });
  caps.forEach(c => io.observe(c));
}

function initRail() {
  const vp = document.getElementById('serviciosRail');
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
      moved = true; vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sigue sin capture */ }
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

function initServicioLinks() {
  document.querySelectorAll('[data-wa-servicio]').forEach(a => {
    const card = a.closest('.servicio-card');
    if (!card) return;
    const servicio = card.dataset.servicio;
    const duracion = card.dataset.duracion;
    a.href = waHref([`Hola AIRE! Quiero consultar por ${servicio} (${duracion}).`]);
    a.target = '_blank'; a.rel = 'noopener noreferrer';
  });
}

function initTurnos() {
  const select = document.getElementById('turnoServicio');
  const btn = document.getElementById('turnoWaBtn');
  const chips = document.querySelectorAll('#franjaChips .chip');
  if (!select || !btn) return;
  let franja = null;

  chips.forEach(chip => {
    chip.setAttribute('aria-pressed', 'false');
    chip.addEventListener('click', () => {
      const isOn = chip.getAttribute('aria-pressed') === 'true';
      chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
      franja = isOn ? null : chip.dataset.franja;
      if (!isOn) chip.setAttribute('aria-pressed', 'true');
      updateLink();
    });
  });

  const updateLink = () => {
    const servicio = select.value;
    const duracion = DURACIONES[servicio] || '';
    const lines = [`Hola AIRE! Quiero reservar un turno para ${servicio} (${duracion}).`];
    if (franja) lines.push(`Mi franja horaria preferida es la ${franja.toLowerCase()}.`);
    btn.href = waHref(lines);
  };
  select.addEventListener('change', updateLink);
  updateLink();
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const map = L.map(el, { scrollWheelZoom: false }).setView([-29.4131, -66.8558], 14);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap, © CARTO', maxZoom: 19,
  }).addTo(map);
  L.marker([-29.4131, -66.8558]).addTo(map);
}

function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

initReveals();
initNav();
initWspFloat();
initRecorrido();
initRail();
initServicioLinks();
initTurnos();
initMapa();
initFooterYear();
