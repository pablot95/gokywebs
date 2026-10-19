const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const WSP = '5491144071077';
const wspLink = txt => `https://wa.me/${WSP}?text=${encodeURIComponent(txt)}`;
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
  const desktopMq = window.matchMedia('(min-width: 900px)');
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
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-badge, .sello'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  const img = document.querySelector('.hero [data-hero-img]');
  const foto = img?.closest('.hero__foto');
  if (!img || !foto) return;
  ScrollTrigger.create({
    trigger: foto,
    start: 'top top',
    end: 'bottom top',
    onUpdate: self => { img.style.translate = `0 ${(self.progress * 6).toFixed(2)}%`; }
  });
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
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')].filter(el => !el.hidden);
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
}

function initGaleria() {
  const lista = document.getElementById('galeria');
  const chips = [...document.querySelectorAll('.filtros .chip')];
  if (!lista || !chips.length) return;
  const items = [...lista.querySelectorAll('.g-item')];
  chips.forEach(chip => chip.addEventListener('click', () => {
    const f = chip.dataset.filtro;
    chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
    items.forEach(li => { li.hidden = f !== 'todos' && li.dataset.cat !== f; });
    lista.classList.toggle('is-filtrada', f !== 'todos');
    if (lista.classList.contains('galeria--rail')) {
      lista.scrollLeft = 0;
      lista.dispatchEvent(new Event('scroll'));
    }
    revelarNuevos(lista);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

function initRail() {
  const vp = document.querySelector('.galeria--rail');
  if (!vp) return;
  const visibles = () => [...vp.querySelectorAll('.g-item:not([hidden])')];
  const posiciones = () => {
    const pad = parseFloat(getComputedStyle(vp).scrollPaddingLeft) || 0;
    const max = vp.scrollWidth - vp.clientWidth;
    return visibles().map(li => Math.max(0, Math.min(li.offsetLeft - pad, max)));
  };
  const hacia = dir => {
    const x = vp.scrollLeft;
    const pos = posiciones();
    if (dir > 0) return pos.find(p => p > x + 4) ?? pos[pos.length - 1] ?? 0;
    return [...pos].reverse().find(p => p < x - 4) ?? 0;
  };

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
    if (!moved) { moved = true; vp.classList.add('dragging'); vp.setPointerCapture?.(pointerId); }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      vp.releasePointerCapture?.(pointerId);
      const dx = e ? e.clientX - startX : 0;
      const x = vp.scrollLeft;
      const pos = posiciones();
      let destino;
      if (Math.abs(dx) > 60) destino = dx < 0 ? (pos.find(p => p >= x - 4) ?? pos[pos.length - 1]) : ([...pos].reverse().find(p => p <= x + 4) ?? 0);
      else destino = pos.reduce((a, b) => (Math.abs(b - x) < Math.abs(a - x) ? b : a), pos[0] ?? 0);
      vp.scrollTo({ left: destino, behavior: reduceMotion ? 'auto' : 'smooth' });
      setTimeout(() => vp.classList.remove('dragging'), 520);
      const kill = ev => { ev.stopImmediatePropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());

  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const estado = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 4;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 4;
  };
  prev?.addEventListener('click', () => vp.scrollTo({ left: hacia(-1), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollTo({ left: hacia(1), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', estado, { passive: true });
  window.addEventListener('resize', estado, { passive: true });
  estado();
}

function initVisor() {
  const visor = document.getElementById('visor');
  const lista = document.getElementById('galeria');
  if (!visor || !lista) return;
  const img = document.getElementById('visorImg');
  const rot = document.getElementById('visorRot');
  const txt = document.getElementById('visorTxt');
  const num = document.getElementById('visorNum');
  const wsp = document.getElementById('visorWsp');
  const prev = document.getElementById('visorPrev');
  const next = document.getElementById('visorNext');
  const cerrar = document.getElementById('visorCerrar');
  let visibles = [];
  let actual = 0;
  let origen = null;

  const mostrar = i => {
    if (!visibles.length) return;
    actual = (i + visibles.length) % visibles.length;
    const li = visibles[actual];
    const foto = li.querySelector('img');
    const caption = li.querySelector('.g-txt')?.textContent.trim() || '';
    img.src = li.dataset.full || foto?.src || '';
    img.width = Number(li.dataset.w) || foto?.width || 1;
    img.height = Number(li.dataset.h) || foto?.height || 1;
    img.alt = foto?.alt || caption;
    rot.textContent = li.querySelector('.g-rot')?.textContent.trim() || '';
    txt.textContent = caption;
    num.textContent = `${actual + 1} / ${visibles.length}`;
    wsp.href = wspLink(`Hola LRT Electricidad, vi en la web el trabajo «${caption}» y quiero consultar por algo así.`);
    const solo = visibles.length < 2;
    prev.hidden = solo;
    next.hidden = solo;
  };
  lista.addEventListener('click', e => {
    const btn = e.target.closest('.g-btn');
    if (!btn) return;
    visibles = [...lista.querySelectorAll('.g-item:not([hidden])')];
    origen = btn;
    mostrar(Math.max(0, visibles.indexOf(btn.closest('.g-item'))));
    if (typeof visor.showModal === 'function') visor.showModal(); else visor.setAttribute('open', '');
    document.body.classList.add('no-scroll');
    cerrar.focus();
  });
  prev.addEventListener('click', () => mostrar(actual - 1));
  next.addEventListener('click', () => mostrar(actual + 1));
  cerrar.addEventListener('click', () => visor.close());
  visor.addEventListener('click', e => { if (e.target === visor) visor.close(); });
  visor.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') mostrar(actual - 1);
    if (e.key === 'ArrowRight') mostrar(actual + 1);
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
    if (Math.abs(dx) > 50) mostrar(actual + (dx < 0 ? 1 : -1));
  });
}

function initConsulta() {
  const form = document.getElementById('consulta');
  if (!form) return;
  const texto = document.getElementById('consultaTexto');
  const enviar = document.getElementById('consultaEnviar');
  const NECESIDAD = {
    cortocircuito: 'me salta la térmica o tengo un cortocircuito.',
    medidor: 'necesito instalar o cambiar el medidor.',
    lineas: 'necesito líneas nuevas o recablear la casa.',
    tablero: 'necesito un tablero nuevo o renovar el que tengo.',
    otra: 'tengo una consulta de electricidad.'
  };
  const CUANDO = {
    ya: 'Lo necesito lo antes posible.',
    semana: 'Lo necesito esta semana.',
    'sin-apuro': 'No tengo apuro.'
  };
  const frase = s => {
    const t = s.replace(/\s+/g, ' ').trim();
    if (!t) return '';
    const cap = t.charAt(0).toUpperCase() + t.slice(1);
    return /[.!?]$/.test(cap) ? cap : `${cap}.`;
  };
  const elegido = nombre => form.querySelector(`input[name="${nombre}"]:checked`)?.value || '';
  const escrito = nombre => form.querySelector(`input[name="${nombre}"]`)?.value || '';
  const armar = () => {
    const partes = [`Hola LRT Electricidad, ${NECESIDAD[elegido('necesidad')] || 'quiero pedir un presupuesto.'}`];
    const cuando = CUANDO[elegido('cuando')];
    if (cuando) partes.push(cuando);
    const barrio = escrito('barrio').replace(/\s+/g, ' ').trim();
    if (barrio) partes.push(`Estoy en ${barrio}.`);
    const detalle = frase(escrito('detalle'));
    if (detalle) partes.push(detalle);
    const msg = partes.join(' ');
    texto.textContent = msg;
    enviar.href = wspLink(msg);
  };
  form.addEventListener('input', armar);
  form.addEventListener('change', armar);
  form.querySelectorAll('input[type="text"]').forEach(inp => inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); armar(); enviar.click(); }
  }));
  enviar.addEventListener('click', () => showToast('Te llevo a WhatsApp con el mensaje listo.'));
  armar();
}

[initHeroMotion, initReveals, initNav, initWspFloat, initModelBarScroll, initParallax, initGaleria, initRail, initVisor, initConsulta].forEach(fn => {
  try { fn(); } catch (e) { console.error(e); }
});
