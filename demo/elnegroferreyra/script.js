const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492665037253';

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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

function wspLink(msg) {
  return `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
}

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
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 901px)');
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

function initModelBarScroll() {
  const bar = document.querySelector('.gw-modelos');
  if (!bar) return;
  let showTimer = 0;
  let frame = 0;
  const update = () => {
    frame = 0;
    if (window.scrollY <= 8) {
      bar.classList.remove('gw-modelos--scrolling');
      return;
    }
    bar.classList.add('gw-modelos--scrolling');
    clearTimeout(showTimer);
    showTimer = setTimeout(() => bar.classList.remove('gw-modelos--scrolling'), 120);
  };
  window.addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
}

function initTabs() {
  const cont = document.querySelector('[data-tabs]');
  if (!cont) return;
  const tabs = [...cont.querySelectorAll('[role="tab"]')];
  const activar = tab => {
    tabs.forEach(t => {
      const sel = t === tab;
      t.setAttribute('aria-selected', sel ? 'true' : 'false');
      t.tabIndex = sel ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !sel;
      if (sel) revelarNuevos(panel);
    });
    if (window.matchMedia('(max-width: 900px)').matches) tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activar(tab));
    tab.addEventListener('keydown', e => {
      const mapa = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(e.key in mapa)) return;
      e.preventDefault();
      const j = (mapa[e.key] + tabs.length) % tabs.length;
      activar(tabs[j]);
      tabs[j].focus();
    });
  });
}

function initLee() {
  const el = document.querySelector('[data-lee]');
  if (!el) return;
  const palabras = el.textContent.trim().split(/\s+/);
  el.innerHTML = palabras.map(p => `<span class="lee-p">${esc(p)}</span>`).join(' ');
  if (reduceMotion || typeof ScrollTrigger === 'undefined') { el.classList.add('lee-listo'); return; }
  const spans = [...el.querySelectorAll('.lee-p')];
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    end: 'bottom 50%',
    scrub: true,
    onUpdate(self) {
      const n = Math.round(self.progress * spans.length);
      spans.forEach((s, i) => s.classList.toggle('on', i < n));
    }
  });
}

function initDossier() {
  document.querySelectorAll('[data-dossier]').forEach(b => b.addEventListener('click', () => window.print()));
}

function initVisor() {
  const visor = document.getElementById('visor');
  const items = [...document.querySelectorAll('[data-visor]')];
  if (!visor || !items.length) return;
  const img = visor.querySelector('.visor-img');
  const cap = visor.querySelector('.visor-cap');
  const cont = visor.querySelector('.visor-cont');
  const cerrarBtn = visor.querySelector('.visor-cerrar');
  let actual = 0;
  let ultimo = null;
  const mostrar = n => {
    actual = (n + items.length) % items.length;
    const it = items[actual];
    const alt = it.querySelector('img')?.alt || '';
    img.src = it.dataset.full;
    img.alt = alt;
    cap.textContent = `${alt} · Imagen ilustrativa`;
    cont.textContent = `${actual + 1} / ${items.length}`;
  };
  const abrir = n => {
    ultimo = items[n];
    mostrar(n);
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    void visor.offsetWidth;
    visor.classList.add('abierto');
    cerrarBtn.focus();
  };
  const cerrar = () => {
    visor.classList.remove('abierto');
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    ultimo?.focus();
  };
  items.forEach((it, n) => it.addEventListener('click', () => abrir(n)));
  visor.querySelectorAll('[data-visor-cerrar]').forEach(b => b.addEventListener('click', cerrar));
  visor.querySelector('[data-visor-prev]')?.addEventListener('click', () => mostrar(actual - 1));
  visor.querySelector('[data-visor-next]')?.addEventListener('click', () => mostrar(actual + 1));
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') { cerrar(); return; }
    if (e.key === 'ArrowLeft') mostrar(actual - 1);
    if (e.key === 'ArrowRight') mostrar(actual + 1);
    if (e.key === 'Tab') {
      const foco = [...visor.querySelectorAll('button:not([tabindex="-1"])')];
      const i = foco.indexOf(document.activeElement);
      e.preventDefault();
      const j = e.shiftKey ? (i <= 0 ? foco.length - 1 : i - 1) : (i === foco.length - 1 ? 0 : i + 1);
      foco[j]?.focus();
    }
  });
}

function initRail() {
  const vp = document.querySelector('[data-rail]');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  let down = false;
  let moved = false;
  let startX = 0;
  let startLeft = 0;
  let pointerId = 0;
  let frenarClick = false;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el arrastre igual funciona */ }
    }
    vp.scrollLeft = startLeft - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
    if (moved) { frenarClick = true; setTimeout(() => { frenarClick = false; }, 0); }
    vp.classList.remove('dragging');
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('click', e => { if (frenarClick) { e.preventDefault(); e.stopPropagation(); } }, true);
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 16;
  const estado = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', estado, { passive: true });
  window.addEventListener('resize', estado, { passive: true });
  estado();
}

function fechaLarga(valor) {
  const [y, m, d] = valor.split('-').map(Number);
  if (!y || !m || !d) return '';
  const txt = new Date(y, m - 1, d).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}

function hoyIso() {
  const h = new Date();
  return `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, '0')}-${String(h.getDate()).padStart(2, '0')}`;
}

function initConsulta() {
  const box = document.querySelector('[data-consulta]');
  const cta = document.querySelector('[data-consulta-cta]');
  if (!box || !cta) return;
  const fecha = box.querySelector('#c-fecha');
  const sinFecha = box.querySelector('#c-sin-fecha');
  const errFecha = box.querySelector('#c-fecha-error');
  const lugar = box.querySelector('#c-lugar');
  const publico = box.querySelector('#c-publico');
  const quien = box.querySelector('#c-quien');
  const minimo = hoyIso();
  fecha.min = minimo;
  const elegido = name => box.querySelector(`input[name="${name}"]:checked`)?.value || '';
  const poner = (k, v, vacio) => {
    const el = document.querySelector(`[data-p="${k}"]`);
    if (!el) return;
    el.textContent = v || vacio;
    el.classList.toggle('vacio', !v);
  };
  const pintar = () => {
    fecha.disabled = sinFecha.checked;
    let fechaTxt = '';
    const pasada = !sinFecha.checked && fecha.value && fecha.value < minimo;
    fecha.setAttribute('aria-invalid', pasada ? 'true' : 'false');
    errFecha.hidden = !pasada;
    if (!sinFecha.checked && fecha.value && !pasada) fechaTxt = fechaLarga(fecha.value);
    const tipo = elegido('tipo');
    const espacio = elegido('espacio');
    const sonido = elegido('sonido');
    const lugarTxt = [lugar.value.trim(), espacio].filter(Boolean).join(' · ');
    const quienTxt = quien.value.trim();
    poner('tipo', tipo, 'A definir');
    poner('fecha', fechaTxt, 'A definir');
    poner('lugar', lugarTxt, 'A definir');
    poner('sonido', sonido, 'A confirmar');
    poner('publico', publico.value, 'A definir');
    poner('quien', quienTxt, '—');
    const lineas = [
      'Hola, quiero consultar por el show de El Negro Ferreyra.',
      `- Evento: ${tipo || 'A definir'}`,
      `- Fecha: ${fechaTxt || 'A definir'}`,
      `- Lugar: ${lugarTxt || 'A definir'}`,
      `- Sonido: ${sonido || 'A confirmar'}`,
      `- Público estimado: ${publico.value || 'A definir'}`
    ];
    if (quienTxt) lineas.push(`- Consulta de: ${quienTxt}`);
    cta.href = wspLink(lineas.join('\n'));
  };
  box.addEventListener('input', pintar);
  box.addEventListener('change', pintar);
  cta.addEventListener('click', () => showToast('Abrimos WhatsApp con tu consulta lista para enviar.'));
  pintar();
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desde = (sel, vars, pos) => {
    const els = hero.querySelectorAll(sel);
    if (els.length) tl.from(els, vars, pos);
  };
  desde('[data-hero-img]', { scale: 1.1, duration: 1.8, clearProps: 'scale' }, 0);
  desde('.cartel-nombre', { y: 30, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.05);
  desde('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.15);
  desde('h1', { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.25);
  desde('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.45);
  desde('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  desde('.cartel li', { y: 14, opacity: 0, duration: 0.7, stagger: 0.06, clearProps: 'transform,opacity' }, 0.75);
}

let revealsListos = false;
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
}

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const entrar = (el, n) => {
    const d = Math.min(n * 0.1, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  };
  const io = new IntersectionObserver(entries => {
    let n = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) { entrar(entry.target, n++); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    let n = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { entrar(el, n++); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  requestAnimationFrame(() => requestAnimationFrame(queueSweep));
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

initConsulta();
initReveals();
initTabs();
initLee();
initRail();
initVisor();
initDossier();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
