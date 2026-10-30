const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA_NUM = '5492664706562';
let revealsListos = false;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const PLANES = {
  depto: { nombre: 'Plan Depto', dia: 1000 },
  casa: { nombre: 'Plan Casa', dia: 2500 },
  grande: { nombre: 'Plan Casa grande', dia: 4000 }
};

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function pesos(n) {
  return '$' + Number(n).toLocaleString('es-AR');
}

function waLink(msg) {
  return `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`;
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
  const desktopMq = window.matchMedia('(min-width: 861px)');
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'transform,opacity,filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero__credencial'), { y: 46, rotation: 6, scale: 0.92, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0.75);
}

function initPeriodo() {
  const grupos = [...document.querySelectorAll('.periodo')];
  if (!grupos.length) return;
  const pintar = per => {
    document.querySelectorAll('[data-periodo]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.periodo === per)));
    document.querySelectorAll('.plan__monto[data-dia]').forEach(el => {
      const dia = Number(el.dataset.dia);
      el.textContent = pesos(per === 'mes' ? dia * 30 : dia);
      if (!reduceMotion) { el.classList.remove('monto-cambia'); void el.offsetWidth; el.classList.add('monto-cambia'); }
    });
    document.querySelectorAll('[data-unidad]').forEach(el => { el.textContent = per === 'mes' ? 'por mes (30 días)' : 'por día'; });
  };
  grupos.forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('[data-periodo]');
    if (b) pintar(b.dataset.periodo);
  }));
}

function initVerPlan() {
  const tabla = document.querySelector('.tabla-planes');
  const chips = [...document.querySelectorAll('[data-ver]')].filter(b => b.tagName === 'BUTTON');
  if (!tabla || !chips.length) return;
  const cta = document.getElementById('verPlanCta');
  const flecha = cta?.querySelector('svg')?.outerHTML || '';
  chips.forEach(c => c.addEventListener('click', () => {
    tabla.dataset.ver = c.dataset.ver;
    chips.forEach(x => x.setAttribute('aria-pressed', String(x === c)));
    const p = PLANES[c.dataset.ver];
    if (cta && p) {
      cta.href = waLink(`Hola SERVI-HOGAR, me interesa el ${p.nombre} (${pesos(p.dia)} por día). ¿Me cuentan cómo sigo?`);
      cta.innerHTML = `Quiero el ${esc(p.nombre)}${flecha}`;
    }
  }));
}

function initRiel() {
  const vp = document.getElementById('riel');
  if (!vp) return;
  const prev = document.querySelector('[data-riel="prev"]');
  const next = document.querySelector('[data-riel="next"]');
  let pointerId = null;
  let startX = 0;
  let startLeft = 0;
  let moved = false;
  let arrastrando = false;
  let matarClick = false;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    arrastrando = true; moved = false; pointerId = e.pointerId; startX = e.clientX; startLeft = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!arrastrando) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch (err) { /* sin capture igual se arrastra */ }
    }
    if (moved) vp.scrollLeft = startLeft - dx;
  });
  const fin = () => {
    if (!arrastrando) return;
    arrastrando = false;
    try { vp.releasePointerCapture?.(pointerId); } catch (err) { /* ya liberado */ }
    if (moved) { matarClick = true; setTimeout(() => { matarClick = false; }, 60); }
    vp.classList.remove('dragging');
  };
  vp.addEventListener('pointerup', fin);
  vp.addEventListener('pointercancel', fin);
  vp.addEventListener('lostpointercapture', fin);
  vp.addEventListener('click', e => { if (matarClick) { e.preventDefault(); e.stopPropagation(); } }, true);
  const paso = () => (vp.querySelector('.riel__item')?.getBoundingClientRect().width || 320) + 16;
  const mover = dir => vp.scrollBy({ left: dir * paso(), behavior: reduceMotion ? 'auto' : 'smooth' });
  prev?.addEventListener('click', () => mover(-1));
  next?.addEventListener('click', () => mover(1));
  const sync = () => {
    if (prev) prev.disabled = vp.scrollLeft <= 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initVisor() {
  const visor = document.getElementById('visor');
  if (!visor) return;
  const img = document.getElementById('visorImg');
  const tit = document.getElementById('visorTit');
  const srv = document.getElementById('visorSrv');
  let lista = [];
  let idx = 0;
  let origen = null;
  const pintar = () => {
    const b = lista[idx];
    if (!b) return;
    const mini = b.querySelector('img');
    img.width = Number(mini?.getAttribute('width')) || 1000;
    img.height = Number(mini?.getAttribute('height')) || 1000;
    img.src = b.dataset.src;
    img.alt = mini?.alt || '';
    tit.textContent = b.dataset.titulo || '';
    srv.textContent = b.dataset.oficio || '';
  };
  const abrir = b => {
    lista = [...document.querySelectorAll('[data-visor]')].filter(x => x.offsetParent !== null);
    idx = Math.max(0, lista.indexOf(b));
    origen = b;
    pintar();
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    visor.querySelector('.visor__btn--cerrar')?.focus();
  };
  const cerrar = () => {
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    origen?.focus();
  };
  const mover = d => { if (!lista.length) return; idx = (idx + d + lista.length) % lista.length; pintar(); };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-visor]');
    if (b) abrir(b);
  });
  visor.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar]')) { cerrar(); return; }
    const n = e.target.closest('[data-visor-nav]');
    if (n) mover(Number(n.dataset.visorNav));
  });
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'ArrowRight') mover(1);
    else if (e.key === 'ArrowLeft') mover(-1);
    else if (e.key === 'Tab') {
      const focos = [...visor.querySelectorAll('button')];
      const i = focos.indexOf(document.activeElement);
      e.preventDefault();
      focos[(i + (e.shiftKey ? -1 : 1) + focos.length) % focos.length].focus();
    }
  });
}

function initTabs() {
  const lista = document.querySelector('.tabs__lista');
  if (!lista) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const activar = (t, foco) => {
    tabs.forEach(x => {
      const on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(x.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (foco) t.focus();
    refrescar();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); activar(tabs[j], true); }
    });
  });
}

function initGuia() {
  const sec = document.getElementById('guia');
  if (!sec) return;
  const n = document.getElementById('cuentaN');
  const txt = document.getElementById('cuentaTxt');
  const ofs = document.getElementById('cuentaOficios');
  const det = document.getElementById('cuentaDetalle');
  const plan = document.getElementById('cuentaPlan');
  const cta = document.getElementById('guiaWsp');
  let casa = sec.querySelector('[data-casa][aria-pressed="true"]')?.dataset.casa || 'casa';

  const pintar = () => {
    sec.querySelectorAll('[data-casa]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.casa === casa)));
    const marcadas = [...sec.querySelectorAll('.necesidad[aria-pressed="true"]')];
    const oficios = [...new Set(marcadas.map(b => b.dataset.oficio))];
    const k = oficios.length;
    n.textContent = String(k);
    txt.textContent = k === 1 ? 'oficio' : 'oficios distintos';
    ofs.innerHTML = oficios.map(o => `<li>${esc(o)}</li>`).join('');
    if (!k) det.textContent = 'Marcá lo que necesita tu casa.';
    else if (k === 1) det.textContent = '1 llamado, 1 visita y 1 presupuesto. Y la próxima vez, otra vez a buscar.';
    else det.textContent = `${k} llamados, ${k} visitas y ${k} presupuestos, cada uno con su horario.`;
    const p = PLANES[casa] || PLANES.casa;
    plan.innerHTML = `Plan sugerido: <strong>${esc(p.nombre)}</strong> · ${pesos(p.dia)} por día`;
    const lineas = [`Hola SERVI-HOGAR, me interesa el ${p.nombre} (${pesos(p.dia)} por día).`];
    if (marcadas.length) {
      lineas.push('En mi casa hoy hace falta:');
      marcadas.forEach(b => lineas.push(`- ${b.textContent.trim()}`));
    }
    lineas.push('¿Me cuentan cómo sigo?');
    cta.href = waLink(lineas.join('\n'));
  };

  sec.addEventListener('click', e => {
    const c = e.target.closest('[data-casa]');
    if (c) { casa = c.dataset.casa; pintar(); return; }
    const b = e.target.closest('.necesidad');
    if (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
      pintar();
    }
  });
  cta.addEventListener('click', () => {
    if (!sec.querySelector('.necesidad[aria-pressed="true"]')) showToast('Te armamos el mensaje con tu plan; podés sumar qué hace falta en tu casa.');
  });
  pintar();
}

function initLectura() {
  const p = document.querySelector('[data-lectura]');
  if (!p) return;
  const ws = [...p.querySelectorAll('.w')];
  if (reduceMotion) { ws.forEach(w => w.classList.add('on')); return; }
  let frame = 0;
  const update = () => {
    frame = 0;
    const r = p.getBoundingClientRect();
    const vh = window.innerHeight;
    const prog = Math.min(1, Math.max(0, (vh * 0.86 - r.top) / (vh * 0.5)));
    const hasta = Math.round(prog * ws.length);
    ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  window.addEventListener('resize', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  update();
}

function initFaq() {
  document.querySelectorAll('.faq').forEach(d => d.addEventListener('toggle', refrescar));
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

initModelBarScroll();
initNav();
initWspFloat();
initHeroMotion();
initPeriodo();
initVerPlan();
initRiel();
initVisor();
initTabs();
initGuia();
initLectura();
initFaq();
initReveals();
