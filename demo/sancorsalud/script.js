document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491180245226';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const OFF = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;

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

/* ============================ COMPONENTE FUNCIONAL: ELEGÍ LO TUYO ============================ */
const BENEFICIOS = {
  familia:    { label: 'Familia y línea GEN', titulo: 'Línea GEN, de 18 a 45 años', texto: 'Un plan pensado para tu franja etaria, con la cobertura completa de Sancor Salud para todo tu grupo familiar.' },
  deportes:   { label: 'Deportes', titulo: 'Reintegro por actividad física', texto: 'Devolución por la cuota del gimnasio, clases o la actividad que hagas, presentando factura.' },
  viajes:     { label: 'Viajes', titulo: 'Asistencia al viajero, incluye Europa', texto: 'Cobertura para cuando salís del país, con Europa adentro del beneficio.' },
  mascotas:   { label: 'Mascotas', titulo: 'Reintegro en veterinaria', texto: 'Parte de lo que gastás en consultas y cuidados de tu mascota también se reintegra.' },
  psicologia: { label: 'Psicología', titulo: 'Psicología y psiquiatría sin coseguros', texto: 'Las consultas de salud mental no tienen coseguro adicional.' },
  estetica:   { label: 'Estética', titulo: 'Reintegro en cirugías estéticas de baja complejidad', texto: 'Una parte de estas intervenciones también cuenta con reintegro.' },
  sonrisa:    { label: 'Sonrisa', titulo: 'Ortodoncia y placa antibruxismo al 100%', texto: 'Cobertura completa en estos dos tratamientos odontológicos.' }
};

function initElegi(root) {
  const cont = root.querySelector('.elegi');
  if (!cont) return;
  const chips = [...cont.querySelectorAll('input[data-f="elegi"]')];
  const piezas = cont.querySelector('.beneficio-piezas');
  const nEl = cont.querySelector('#elegiN') || cont.querySelector('.elegi__contador b');
  const btnWsp = cont.querySelector('#elegiWsp');

  const pintar = () => {
    const elegidos = chips.filter(c => c.checked).map(c => c.value);
    if (nEl) nEl.textContent = elegidos.length;

    if (!elegidos.length) {
      piezas.innerHTML = '<p class="elegi__vacio">Elegí al menos uno para ver los beneficios.</p>';
    } else {
      piezas.innerHTML = elegidos.map(v => {
        const b = BENEFICIOS[v]; if (!b) return '';
        return `<div class="beneficio-pieza">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
          <span><b>${esc(b.titulo)}</b><span>${esc(b.texto)}</span></span>
        </div>`;
      }).join('');
    }

    const nombres = elegidos.map(v => BENEFICIOS[v]?.label).filter(Boolean);
    const msg = nombres.length
      ? `Hola! Quiero armar mi plan de Sancor Salud con estos beneficios: ${nombres.join(', ')}. ¿Me contás cómo sigo?`
      : 'Hola, quiero asesorarme sobre Sancor Salud.';
    if (btnWsp) btnWsp.dataset.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
  };

  chips.forEach(c => c.addEventListener('change', pintar));
  btnWsp?.addEventListener('click', () => {
    window.open(btnWsp.dataset.href || `https://wa.me/${WSP}`, '_blank', 'noopener');
  });
  pintar();
}

/* ============================ MOMENTO PROPIO: CAPÍTULOS ============================ */
function initCapitulos(root) {
  const cap = root.querySelector('.capitulos');
  if (!cap) return;
  const sticky = cap.querySelector('.capitulos-sticky');
  const fotos = [...cap.querySelectorAll('.cap-foto')];
  const textos = [...cap.querySelectorAll('.cap-texto')];
  const dots = [...cap.querySelectorAll('.cap-dot')];
  const numEl = cap.querySelector('.cap-visual__num');
  const wspBtn = cap.querySelector('.cap-cta a, #capWsp');
  const TOTAL = fotos.length || 1;
  let ultimo = -1;

  const mensajes = [
    'Hola! Quiero saber más sobre la red de prestadores de Sancor Salud.',
    'Hola! Quiero saber más sobre la atención médica online 24 horas de Sancor Salud.',
    'Hola! Quiero saber más sobre el reintegro por actividad física de Sancor Salud.',
    'Hola! Quiero saber más sobre la cobertura de ortodoncia al 100% de Sancor Salud.'
  ];

  const aplicar = i => {
    if (i === ultimo) return;
    ultimo = i;
    fotos.forEach((f, idx) => f.classList.toggle('on', idx === i));
    textos.forEach((t, idx) => t.classList.toggle('on', idx === i));
    dots.forEach((d, idx) => d.classList.toggle('on', idx <= i));
    if (numEl) numEl.innerHTML = `0${i + 1}<small>/0${TOTAL}</small>`;
    if (wspBtn) wspBtn.href = `https://wa.me/${WSP}?text=${encodeURIComponent(mensajes[i] || mensajes[0])}`;
  };

  const medir = () => {
    const recorrido = cap.offsetHeight - sticky.offsetHeight;
    if (recorrido <= 0) { aplicar(TOTAL - 1); return; }
    const p = Math.min(1, Math.max(0, (OFF() - cap.getBoundingClientRect().top) / recorrido));
    aplicar(Math.min(TOTAL - 1, Math.floor(p * TOTAL)));
  };

  window.addEventListener('scroll', medir, { passive: true });
  window.addEventListener('resize', medir, { passive: true });
  window.addEventListener('load', medir);
  medir();
}

/* ============================ TABS (Modelo 2: beneficios por categoría) ============================ */
function initTabs(root) {
  const nav = root.querySelector('.tabs-nav');
  if (!nav) return;
  const btns = [...nav.querySelectorAll('.tab-btn')];
  const panels = btns.map(b => document.getElementById(b.getAttribute('aria-controls')));

  const activar = i => {
    btns.forEach((b, idx) => {
      const on = idx === i;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p, idx) => { if (p) p.hidden = idx !== i; });
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };

  btns.forEach((b, i) => {
    b.addEventListener('click', () => activar(i));
    b.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); const n = (i + 1) % btns.length; btns[n].focus(); activar(n); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); const n = (i - 1 + btns.length) % btns.length; btns[n].focus(); activar(n); }
    });
  });
}

/* ============================ NAV MOBILE ============================ */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div'); bd.className = 'nav-backdrop';
    (document.querySelector('.site-header') || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 881px)');
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

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const sync = () => wsp?.classList.toggle('visible', window.scrollY > 500);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

/* ============================ REVEALS ============================ */
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

/* ============================ HERO ============================ */
/* Solo la foto de fondo/ancha (decorativo): el texto del hero usa el mismo
   sistema de reveals que el resto del sitio (initReveals), con su red de
   seguridad — nunca depender solo del ticker de GSAP para contenido crítico. */
function initHero() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const fondo = document.querySelector('.hero-fondo__media img');
  if (fondo) gsap.fromTo(fondo, { scale: 1.06 }, { scale: 1, duration: 1.4, ease: 'power3.out' });
  const fotoAncha = document.querySelector('.hero-foto img');
  if (fotoAncha) gsap.fromTo(fotoAncha, { scale: 1.08 }, { scale: 1, duration: 1.3, ease: 'power3.out' });
}

/* ============================ ARRANQUE ============================ */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

initNav();
initElegi(document);
initCapitulos(document);
initTabs(document);
initFloats();
initHero();
initReveals();
