const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const WSP = '5491168327416';
let revealsListos = false;

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

const FOTOS = [
  { src: 'images/pintor-interior.webp', w: 941, h: 1672, cap: 'Pintura interior · Paredes', alt: 'Pintor con overol blanco pasando el rodillo sobre una pared de un ambiente vacío' },
  { src: 'images/casa-frente.webp', w: 1672, h: 941, cap: 'Pintura exterior · Frente de casa', alt: 'Frente de una casa de dos plantas pintado de blanco con portón gris oscuro' },
  { src: 'images/living-terminado.webp', w: 1254, h: 1254, cap: 'Pintura interior · Living', alt: 'Living luminoso con paredes en tono crema recién pintadas' },
  { src: 'images/pintor-aberturas.webp', w: 1254, h: 1254, cap: 'Pintura exterior · Aberturas', alt: 'Pintor pintando con pincel el marco blanco de una puerta de entrada' },
  { src: 'images/rodillo-exterior.webp', w: 1254, h: 1254, cap: 'Pintura exterior · Revestimiento', alt: 'Rodillo cargado de pintura cubriendo una pared exterior texturada' },
  { src: 'images/altura-silleta.webp', w: 1254, h: 1254, cap: 'Trabajo en altura · Fachada', alt: 'Dos pintores con arnés pintando la fachada de un edificio desde un balancín colgante' },
  { src: 'images/edificio-fachada.webp', w: 1254, h: 1254, cap: 'Trabajo en altura · Edificio', alt: 'Edificio de departamentos de cuatro pisos con la fachada pintada en blanco y gris' },
  { src: 'images/impermeabilizacion-terraza.webp', w: 1254, h: 1254, cap: 'Impermeabilización · Terraza', alt: 'Hombre aplicando membrana líquida gris con rodillo sobre una terraza' }
];

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
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1024px)');
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .fromTo(hero.querySelectorAll('.acento'), { backgroundSize: '0% .3em' }, { backgroundSize: '100% .3em', duration: 1.1, ease: 'power2.inOut', clearProps: 'backgroundSize' }, 0.7)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-badge, .hero__cinta'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7);
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

function initFiltros() {
  const grid = document.getElementById('galeriaGrid');
  const botones = document.querySelectorAll('[data-filtro]');
  if (!grid || !botones.length) return;
  botones.forEach(b => b.addEventListener('click', () => {
    const f = b.dataset.filtro;
    botones.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    grid.querySelectorAll('.galeria__item').forEach(li => { li.hidden = f !== 'todos' && li.dataset.cat !== f; });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

function initVisor() {
  const visor = document.getElementById('visor');
  const triggers = document.querySelectorAll('[data-visor]');
  if (!visor || !triggers.length) return;
  const img = document.getElementById('visorImg');
  const cap = document.getElementById('visorCap');
  const num = document.getElementById('visorNum');
  const prev = document.getElementById('visorPrev');
  const next = document.getElementById('visorNext');
  const cerrar = document.getElementById('visorCerrar');
  const todas = FOTOS.map((_, i) => i);
  let lista = todas;
  let pos = 0;
  let origen = null;

  const visibles = () => {
    const grid = document.getElementById('galeriaGrid');
    if (!grid) return todas;
    return [...grid.querySelectorAll('.galeria__item:not([hidden]) [data-visor]')].map(b => Number(b.dataset.visor));
  };
  const mostrar = p => {
    pos = (p + lista.length) % lista.length;
    const f = FOTOS[lista[pos]];
    if (!f) return;
    img.src = f.src;
    img.width = f.w;
    img.height = f.h;
    img.alt = f.alt;
    cap.textContent = f.cap;
    num.textContent = `${pos + 1} / ${lista.length}`;
  };
  const abrir = (i, btn) => {
    lista = visibles();
    if (!lista.includes(i)) lista = todas;
    origen = btn;
    mostrar(lista.indexOf(i));
    if (typeof visor.showModal === 'function') visor.showModal(); else visor.setAttribute('open', '');
    document.body.classList.add('no-scroll');
    cerrar.focus();
  };
  triggers.forEach(btn => btn.addEventListener('click', () => abrir(Number(btn.dataset.visor) || 0, btn)));
  prev.addEventListener('click', () => mostrar(pos - 1));
  next.addEventListener('click', () => mostrar(pos + 1));
  cerrar.addEventListener('click', () => visor.close());
  visor.addEventListener('click', e => { if (e.target === visor) visor.close(); });
  visor.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') mostrar(pos - 1);
    if (e.key === 'ArrowRight') mostrar(pos + 1);
  });
  visor.addEventListener('close', () => {
    document.body.classList.remove('no-scroll');
    origen?.focus();
  });
  let x0 = null;
  img.addEventListener('pointerdown', e => { x0 = e.clientX; });
  img.addEventListener('pointerup', e => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) mostrar(pos + (dx < 0 ? 1 : -1));
  });
}

function initTabs() {
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  if (!tabs.length) return;
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !on;
      if (on && !reduceMotion) {
        panel.classList.remove('entra');
        void panel.offsetWidth;
        panel.classList.add('entra');
      }
    });
    if (foco) tab.focus();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabs.length - 1;
      if (j === null) return;
      e.preventDefault();
      activar(tabs[j], true);
    });
  });
}

function initPresupuesto() {
  const form = document.getElementById('presuForm');
  const msg = document.getElementById('presuMensaje');
  const enviar = document.getElementById('presuEnviar');
  if (!form || !msg || !enviar) return;
  const err = document.getElementById('presuTrabajoError');
  const trabajos = [...form.querySelectorAll('input[data-f="trabajo"]')];
  const valor = id => (form.querySelector(`#${id}`)?.value || '').trim().replace(/[.\s]+$/, '');
  const unir = arr => (arr.length < 2 ? arr.join('') : `${arr.slice(0, -1).join(', ')} y ${arr[arr.length - 1]}`);
  const armar = () => {
    const elegidos = trabajos.filter(i => i.checked).map(i => i.value);
    const lugar = form.querySelector('input[name="lugar"]:checked')?.value || '';
    const tam = valor('presuTam');
    const zona = valor('presuZona');
    const nombre = valor('presuNombre');
    let t = nombre ? `Hola, soy ${nombre}.` : 'Hola.';
    t += ' Quiero pedir un presupuesto sin cargo';
    if (elegidos.length) t += ` para ${unir(elegidos)}`;
    if (lugar) t += ` en ${lugar}`;
    t += '.';
    if (tam) t += ` Tamaño aproximado: ${tam}.`;
    if (zona) t += ` Zona: ${zona}.`;
    t += ' Les mando fotos por acá.';
    msg.textContent = t;
    enviar.href = `https://wa.me/${WSP}?text=${encodeURIComponent(t)}`;
    if (elegidos.length && err) err.hidden = true;
    return elegidos.length > 0;
  };
  form.addEventListener('input', armar);
  form.addEventListener('change', armar);
  enviar.addEventListener('click', e => {
    if (armar()) return;
    e.preventDefault();
    if (err) err.hidden = false;
    trabajos[0]?.focus();
    showToast('Elegí al menos un trabajo y te armamos el mensaje.');
  });
  armar();
}

function initFaq() {
  document.querySelectorAll('.faq details').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

[initHeroMotion, initReveals, initNav, initWspFloat, initModelBarScroll, initFiltros, initVisor, initTabs, initPresupuesto, initFaq].forEach(fn => {
  try { fn(); } catch (e) { console.error(e); }
});
