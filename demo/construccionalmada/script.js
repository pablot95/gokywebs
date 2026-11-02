const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491139215651';
const MARCA = 'Construcción Almada';

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
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1081px)');
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
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.collage-side'), { y: 40, opacity: 0, duration: 1.2, stagger: 0.12, clearProps: 'transform,opacity' }, 0.35)
    .from(hero.querySelectorAll('.h1-marca'), { backgroundSize: '0% 3px', duration: 1.1, ease: 'power3.inOut', clearProps: 'backgroundSize' }, 0.7)
    .from(hero.querySelectorAll('.hero-badge'), { scale: 0.92, y: 24, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.8);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const capa = document.querySelector('.hero .parallax');
  if (!capa) return;
  gsap.to(capa, {
    yPercent: 4, ease: 'none',
    scrollTrigger: { trigger: capa.closest('.hero-foto'), start: 'top top', end: 'bottom top', scrub: true }
  });
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

function initVisor() {
  const visor = document.getElementById('visor');
  const tiles = [...document.querySelectorAll('[data-visor]')];
  if (!visor || !tiles.length) return;
  const img = document.getElementById('visorImg');
  const cap = document.getElementById('visorCap');
  const btnCerrar = document.getElementById('visorCerrar');
  const btnPrev = document.getElementById('visorPrev');
  const btnNext = document.getElementById('visorNext');
  let actual = 0;
  let origen = null;
  const mostrar = i => {
    actual = (i + tiles.length) % tiles.length;
    const t = tiles[actual];
    const foto = t.querySelector('img');
    img.src = t.dataset.full;
    img.alt = foto?.alt || '';
    img.width = foto?.width || 1200;
    img.height = foto?.height || 1200;
    cap.textContent = `${t.dataset.cap} · imagen ilustrativa · ${actual + 1} de ${tiles.length}`;
  };
  const abrir = i => {
    origen = document.activeElement;
    mostrar(i);
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => visor.classList.add('abierto'));
    btnCerrar.focus();
  };
  const cerrar = () => {
    visor.classList.remove('abierto');
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    origen?.focus();
  };
  tiles.forEach((t, i) => t.addEventListener('click', () => abrir(i)));
  btnCerrar.addEventListener('click', cerrar);
  btnPrev.addEventListener('click', () => mostrar(actual - 1));
  btnNext.addEventListener('click', () => mostrar(actual + 1));
  visor.addEventListener('click', e => { if (e.target === visor) cerrar(); });
  visor.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else if (e.key === 'ArrowLeft') mostrar(actual - 1);
    else if (e.key === 'ArrowRight') mostrar(actual + 1);
    else if (e.key === 'Tab') {
      const focos = [btnCerrar, btnPrev, btnNext];
      const i = focos.indexOf(document.activeElement);
      e.preventDefault();
      focos[(i + (e.shiftKey ? -1 : 1) + focos.length) % focos.length].focus();
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

function initRail() {
  const vp = document.getElementById('railOficios');
  if (!vp) return;
  initRailDrag(vp);
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail="prev"]');
  const next = document.querySelector('[data-rail="next"]');
  const items = [...track.children];
  const inicio = () => parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
  const ir = dir => {
    const base = vp.getBoundingClientRect().left + inicio();
    const posiciones = items.map(it => it.getBoundingClientRect().left - base + vp.scrollLeft);
    const actual = vp.scrollLeft;
    let destino;
    if (dir > 0) destino = posiciones.find(p => p > actual + 4);
    else destino = [...posiciones].reverse().find(p => p < actual - 4);
    if (destino === undefined) destino = dir > 0 ? vp.scrollWidth : 0;
    vp.scrollTo({ left: destino, behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  const estado = () => {
    if (prev) prev.disabled = vp.scrollLeft <= 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => ir(-1));
  next?.addEventListener('click', () => ir(1));
  vp.addEventListener('scroll', estado, { passive: true });
  vp.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); ir(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); ir(-1); }
  });
  window.addEventListener('resize', estado, { passive: true });
  estado();
}

function initTabs() {
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  if (!tabs.length) return;
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (foco) tab.focus();
    revelarNuevos(document.getElementById(tab.getAttribute('aria-controls')));
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t, false));
    t.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        activar(tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length], true);
      }
    });
  });
}

const OFICIOS = [
  ['demolicion', 'Demolición y retiro', 'Sacamos lo viejo y dejamos el lugar listo para empezar.'],
  ['hormigon', 'Hormigón', 'Bases, columnas, losas y contrapisos.'],
  ['albanileria', 'Albañilería', 'Paredes, carpetas y arreglos de mampostería.'],
  ['techos', 'Techos', 'Cubiertas, membranas y aislación.'],
  ['sanitaria', 'Instalación sanitaria', 'Agua fría y caliente, desagües y conexiones.'],
  ['electricidad', 'Electricidad', 'Cableado, bocas, tablero y artefactos.'],
  ['revoques', 'Revoques y Durlock', 'Revoques, cielorrasos y tabiques de placa.'],
  ['pisos', 'Pisos y revestimientos', 'Porcelanato, cerámica y revestimientos de baño y cocina.'],
  ['aberturas', 'Aberturas', 'Colocación de puertas y ventanas.'],
  ['pintura', 'Pintura', 'Interior, exterior y terminaciones finales.']
];
const TRABAJOS = {
  casa: ['Casa nueva', ['hormigon', 'albanileria', 'techos', 'sanitaria', 'electricidad', 'revoques', 'pisos', 'aberturas', 'pintura']],
  ampliacion: ['Ampliación', ['demolicion', 'hormigon', 'albanileria', 'techos', 'sanitaria', 'electricidad', 'revoques', 'pisos', 'aberturas', 'pintura']],
  bano: ['Baño', ['demolicion', 'albanileria', 'sanitaria', 'electricidad', 'revoques', 'pisos', 'pintura']],
  cocina: ['Cocina', ['demolicion', 'albanileria', 'sanitaria', 'electricidad', 'revoques', 'pisos', 'pintura']],
  pisos: ['Pisos', ['demolicion', 'hormigon', 'pisos']],
  techo: ['Techo', ['demolicion', 'techos']],
  pintura: ['Pintura y terminaciones', ['revoques', 'pintura']]
};

const unir = xs => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}`);

let guiaPintar = null;

function initGuia() {
  const root = document.getElementById('guia');
  if (!root) return;
  const $ = id => document.getElementById(id);
  const chips = [...root.querySelectorAll('input[data-f="trabajo"]')];
  const lista = $('gLista');
  const n = $('gN');
  const ntxt = $('gNtxt');
  const msg = $('gMsg');
  const wsp = $('gWsp');
  const zona = $('gZona');
  const cuando = $('gCuando');
  const err = $('gError');
  const elegidos = () => chips.filter(c => c.checked).map(c => c.value);
  const oficiosDe = ids => OFICIOS.filter(([k]) => ids.some(t => TRABAJOS[t][1].includes(k)));
  const mensaje = (ids, ofs) => {
    let txt = `Hola ${MARCA}, quiero pedir un presupuesto.\n\n`;
    if (ids.length) {
      txt += `Quiero hacer: ${unir(ids.map(t => TRABAJOS[t][0].toLowerCase()))}.\n`;
      txt += `Oficios que entrarían: ${ofs.map(o => o[1]).join(', ')}.\n`;
    }
    const z = zona.value.trim();
    if (z) txt += `Zona: ${z}.\n`;
    txt += `Para cuándo: ${cuando.value}.\n\n¿Cuándo podrían venir a ver la obra?`;
    return txt;
  };
  const pintar = animar => {
    const ids = elegidos();
    const ofs = oficiosDe(ids);
    n.textContent = ofs.length;
    ntxt.textContent = ofs.length === 1 ? 'oficio' : 'oficios';
    if (animar !== 'texto') {
      lista.innerHTML = ofs.length
        ? ofs.map(o => `<li data-animate="izq" style="opacity:0;transform:translateX(-24px)"><strong>${esc(o[1])}</strong><span>${esc(o[2])}</span></li>`).join('')
        : '<li class="guia-vacia">Marcá al menos un trabajo para ver quiénes entran.</li>';
      if (animar) revelarNuevos(lista);
    }
    msg.textContent = mensaje(ids, ofs);
    wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg.textContent)}`;
    if (ids.length) err.hidden = true;
    if (typeof ScrollTrigger !== 'undefined' && animar === true) ScrollTrigger.refresh();
  };
  chips.forEach(c => c.addEventListener('change', () => pintar(true)));
  zona.addEventListener('input', () => pintar('texto'));
  cuando.addEventListener('change', () => pintar('texto'));
  wsp.addEventListener('click', e => {
    if (!elegidos().length) {
      e.preventDefault();
      err.hidden = false;
      chips[0]?.focus();
      showToast('Marcá qué querés hacer y armamos el mensaje.');
      return;
    }
    showToast('Abrimos WhatsApp con tu obra, oficio por oficio.');
  });
  guiaPintar = pintar;
  pintar(false);
}

function initPresets() {
  document.querySelectorAll('[data-preset]').forEach(a => a.addEventListener('click', () => {
    const ids = a.dataset.preset.split(',');
    const chips = document.querySelectorAll('#guia input[data-f="trabajo"]');
    if (!chips.length) return;
    chips.forEach(c => { c.checked = ids.includes(c.value); });
    guiaPintar?.(true);
  }));
}

initTabs();
initGuia();
initPresets();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initParallax();
initVisor();
initRail();
