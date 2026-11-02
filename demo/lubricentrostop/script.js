const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493413596267';

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

const HORARIO = { 0: null, 1: [8, 19], 2: [8, 19], 3: [8, 19], 4: [8, 19], 5: [8, 19], 6: [9, 14] };
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const ACEITES = {
  mineral: { nombre: 'Mineral', km: 5000 },
  semi: { nombre: 'Semisintético', km: 7500 },
  sintetico: { nombre: 'Sintético', km: 10000 },
  nose: { nombre: 'A confirmar', km: 0 }
};

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

function waLink(msg) {
  return `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
}

function ahoraAR() {
  const d = new Date(Date.now() - 3 * 3600 * 1000);
  return { dia: d.getUTCDay(), h: d.getUTCHours() + d.getUTCMinutes() / 60, fecha: d };
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 961px)');
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

let revealsListos = false;
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-dato'), { y: 24, scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7);
  const raya = hero.querySelector('.hero-raya');
  if (raya) tl.from(raya, { scaleX: 0, duration: 1.3, ease: 'power3.out', clearProps: 'transform' }, 0.55);
  if (img && typeof ScrollTrigger !== 'undefined') {
    gsap.to(img, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
}

function initCatFade() {
  const cajas = [...document.querySelectorAll('.cat-foto[data-fade]')];
  if (!cajas.length || reduceMotion) return;
  const visibles = new Set();
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) visibles.add(en.target); else visibles.delete(en.target); });
    }, { threshold: 0.2 });
    cajas.forEach(c => io.observe(c));
  } else {
    cajas.forEach(c => visibles.add(c));
  }
  let paso = 0;
  window.setInterval(() => {
    const caja = cajas[paso % cajas.length];
    paso++;
    if (visibles.has(caja) && !document.hidden) caja.classList.toggle('swap');
  }, 1800);
}

function textoEstado() {
  const { dia, h } = ahoraAR();
  const hoy = HORARIO[dia];
  if (hoy && h >= hoy[0] && h < hoy[1]) return { abierto: true, largo: `Abierto ahora · cierra a las ${hoy[1]}`, corto: `Abierto hasta las ${hoy[1]}` };
  if (hoy && h < hoy[0]) return { abierto: false, largo: `Cerrado · abre hoy a las ${hoy[0]}`, corto: `Abre hoy a las ${hoy[0]}` };
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    const hs = HORARIO[d];
    if (!hs) continue;
    const cuando = k === 1 ? 'mañana' : `el ${DIAS[d]}`;
    return { abierto: false, largo: `Cerrado · abre ${cuando} a las ${hs[0]}`, corto: `Abre ${cuando} a las ${hs[0]}` };
  }
  return { abierto: false, largo: 'Lunes a sábado', corto: 'Lunes a sábado' };
}

function initEstado() {
  const pintar = () => {
    const e = textoEstado();
    document.querySelectorAll('[data-estado]').forEach(el => { el.textContent = e.largo; el.classList.toggle('is-open', e.abierto); });
    document.querySelectorAll('[data-estado-corto]').forEach(el => { el.textContent = e.corto; });
    const { dia } = ahoraAR();
    document.querySelectorAll('.semana li').forEach(li => li.classList.toggle('hoy', li.dataset.dia === String(dia)));
  };
  pintar();
  window.setInterval(pintar, 60000);
}

function initOblea() {
  const form = document.getElementById('obleaForm');
  const oblea = document.getElementById('oblea');
  if (!form || !oblea) return;
  const inAuto = document.getElementById('oAuto');
  const inKm = document.getElementById('oKm');
  const inAire = document.getElementById('oAire');
  const err = document.getElementById('oKmError');
  const cta = document.getElementById('oWsp');
  const out = k => oblea.querySelector(`[data-o="${k}"]`);
  const fmt = n => n.toLocaleString('es-AR');

  const leerKm = () => {
    const n = parseInt((inKm.value || '').replace(/\D/g, ''), 10);
    return Number.isFinite(n) ? n : null;
  };
  const fechaProxima = () => {
    const d = new Date(ahoraAR().fecha.getTime());
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() + 6);
    return `${MESES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
  };

  let ultimo = '';
  const pintar = () => {
    const km = leerKm();
    const tipo = form.querySelector('input[name="aceite"]:checked')?.value || 'semi';
    const aceite = ACEITES[tipo];
    const auto = inAuto.value.trim();
    const proximo = km !== null && aceite.km ? km + aceite.km : null;
    out('km').textContent = proximo ? `${fmt(proximo)} km` : (tipo === 'nose' && km !== null ? 'Lo vemos' : '—');
    out('fecha').textContent = fechaProxima();
    out('aceite').textContent = aceite.nombre;
    out('auto').textContent = auto || '—';
    out('pie').textContent = tipo === 'nose'
      ? 'Traé el manual o pasanos el motor y te decimos qué aceite le va.'
      : 'Lo que llegue primero: los kilómetros o la fecha.';
    const lineas = [
      'Hola Lubricentro Stop! Quiero pedir un turno para el cambio de aceite.',
      `Auto: ${auto || 'te lo paso por acá'}`,
      `Kilómetros de hoy: ${km !== null ? fmt(km) : 'a confirmar'}`,
      `Aceite: ${tipo === 'nose' ? 'no sé cuál usa' : aceite.nombre.toLowerCase()}`,
      `Filtro de aire: ${inAire.checked ? 'sí, sumarlo' : 'no por ahora'}`
    ];
    if (proximo) lineas.push(`Próximo cambio estimado: ${fmt(proximo)} km o ${fechaProxima()}`);
    lineas.push('¿Qué día y horario tienen?');
    cta.href = waLink(lineas.join('\n'));
    const firma = `${proximo}|${tipo}`;
    if (firma !== ultimo && km !== null) {
      ultimo = firma;
      oblea.classList.remove('is-sellada');
      void oblea.offsetWidth;
      oblea.classList.add('is-sellada');
    }
  };

  inKm.addEventListener('input', () => {
    const km = leerKm();
    if (km !== null) {
      inKm.value = fmt(Math.min(km, 999999));
      inKm.removeAttribute('aria-invalid');
      err.hidden = true;
    }
    pintar();
  });
  inAuto.addEventListener('input', pintar);
  inAire.addEventListener('change', pintar);
  form.querySelectorAll('input[name="aceite"]').forEach(r => r.addEventListener('change', pintar));
  cta.addEventListener('click', e => {
    if (leerKm() === null) {
      e.preventDefault();
      inKm.setAttribute('aria-invalid', 'true');
      err.hidden = false;
      inKm.focus();
      showToast('Falta un dato: los kilómetros que marca el tablero.');
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      return;
    }
    showToast('Te llevamos a WhatsApp con la oblea lista para pedir el turno.');
  });
  pintar();
}

function initTabs() {
  const lista = document.querySelector('[role="tablist"]');
  if (!lista) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const elegir = (tab, foco) => {
    tabs.forEach(t => {
      const sel = t === tab;
      t.setAttribute('aria-selected', String(sel));
      t.tabIndex = sel ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !sel;
    });
    if (foco) tab.focus();
    revelarNuevos(document.getElementById(tab.getAttribute('aria-controls')));
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => elegir(t, false));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); elegir(tabs[j], true); }
    });
  });
}

function initDudas() {
  document.querySelectorAll('details.duda').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

initModelBarScroll();
initEstado();
initOblea();
initTabs();
initReveals();
initNav();
initWspFloat();
initHeroMotion();
initCatFade();
initDudas();
