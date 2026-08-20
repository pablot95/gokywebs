const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WHATSAPP_NUMBER = '5491126700921';
const WSP_MESSAGES = {
  general: 'Hola, quiero hacer una consulta sobre un proyecto de piscina.',
};

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function buildWspHref(lines) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

function wireWspLinks() {
  document.querySelectorAll('.wsp-link[data-wsp]').forEach(a => {
    const key = a.dataset.wsp;
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
  document.querySelectorAll('.hscroll').forEach(vp => {
    initRailDrag(vp);
    initRailWheel(vp);
  });
}

function initCorte() {
  document.querySelectorAll('.corte-stage').forEach(stage => {
    const pasos = [...stage.querySelectorAll('.corte-paso')];
    const visual = stage.querySelector('.corte-visual');
    if (!pasos.length || !visual) return;
    const orden = ['terreno', 'hormigon', 'piscina', 'baldoson'];
    const capas = [...visual.querySelectorAll('.corte-capa')];
    const cotas = [...visual.querySelectorAll('.corte-cota span')];

    function setActive(capaKey) {
      const idx = orden.indexOf(capaKey);
      pasos.forEach(p => p.classList.toggle('is-active', p.dataset.capa === capaKey));
      capas.forEach(c => c.classList.toggle('is-on', orden.indexOf(c.dataset.capa) <= idx));
      cotas.forEach(c => c.classList.toggle('is-on', orden.indexOf(c.dataset.capa) <= idx));
    }

    if (reduceMotion) {
      setActive('baldoson');
      return;
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.dataset.capa);
        });
      }, { threshold: 0, rootMargin: '-35% 0px -35% 0px' });
      pasos.forEach(p => io.observe(p));
    }

    let queued = false;
    const centerSweep = () => {
      queued = false;
      const centerY = window.innerHeight / 2;
      let closest = pasos[0], closestDist = Infinity;
      pasos.forEach(p => {
        const r = p.getBoundingClientRect();
        const dist = Math.abs((r.top + r.bottom) / 2 - centerY);
        if (dist < closestDist) { closestDist = dist; closest = p; }
      });
      setActive(closest.dataset.capa);
    };
    const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(centerSweep); } };
    window.addEventListener('scroll', queueSweep, { passive: true });
    window.addEventListener('resize', queueSweep, { passive: true });
    centerSweep();
  });
}

function initMap() {
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;
  const coords = [-34.6037, -58.3816];
  const map = L.map(el, { scrollWheelZoom: false }).setView(coords, 11);
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

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const submitBtn = document.getElementById('formSubmit');

  const rules = {
    nombre: v => v.trim().length > 0,
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    telefono: v => v.trim().length >= 6,
    mensaje: v => v.trim().length > 0,
  };

  function setFieldError(name, hasError) {
    const input = form.elements[name === 'nombre' ? 'name' : name === 'telefono' ? 'tel' : name === 'mensaje' ? 'message' : name];
    const fieldId = { nombre: 'fieldNombre', email: 'fieldEmail', telefono: 'fieldTelefono', mensaje: 'fieldMensaje' }[name];
    const field = document.getElementById(fieldId);
    const errorEl = field?.querySelector('.error-msg');
    if (!input || !field) return;
    field.dataset.invalid = String(hasError);
    input.setAttribute('aria-invalid', String(hasError));
    if (errorEl) errorEl.hidden = !hasError;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    let firstInvalid = null;
    Object.entries(rules).forEach(([name, test]) => {
      const inputName = name === 'nombre' ? 'name' : name === 'telefono' ? 'tel' : name === 'mensaje' ? 'message' : name;
      const value = form.elements[inputName]?.value || '';
      const invalid = !test(value);
      setFieldError(name, invalid);
      if (invalid && !firstInvalid) firstInvalid = form.elements[inputName];
    });

    if (firstInvalid) {
      firstInvalid.focus();
      firstInvalid.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      return;
    }

    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Enviando…';
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'Enviar consulta';
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      Object.keys(rules).forEach(name => setFieldError(name, false));
    }, 800);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  wireWspLinks();
  initNav();
  initAntiCopia();
  initRails();
  initCorte();
  initContactForm();
  initReveals();
  initMap();
  initFooterYear();
});

window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
});
