const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA_NUM = '5491126109620';
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

function refrescar() {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
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
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img] img');
  if (img) tl.from(img, { scale: 1.08, filter: 'brightness(0.5) saturate(0.75)', duration: 1.8, clearProps: 'filter,transform' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-marcas'), { y: 16, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.8)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.65);
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
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')].filter(el => el.getClientRects().length);
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
}

const HORARIO = { 0: null, 1: [8, 18], 2: [8, 18], 3: [8, 18], 4: [8, 18], 5: [8, 18], 6: [8, 13] };
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

function ahoraArgentina() {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' });
  const p = {};
  f.formatToParts(new Date()).forEach(x => { p[x.type] = x.value; });
  const idx = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[p.weekday] ?? new Date().getDay();
  return { dia: idx, min: (parseInt(p.hour, 10) % 24) * 60 + parseInt(p.minute, 10) };
}

function estadoTaller(t) {
  const h = HORARIO[t.dia];
  if (h && t.min >= h[0] * 60 && t.min < h[1] * 60) {
    return { abierto: true, txt: 'Abierto ahora', prox: `Atendemos hasta las ${h[1]} h.` };
  }
  for (let k = 0; k < 8; k++) {
    const d = (t.dia + k) % 7;
    const hh = HORARIO[d];
    if (!hh) continue;
    if (k === 0 && t.min >= hh[0] * 60) continue;
    const cuando = k === 0 ? 'hoy' : k === 1 ? 'mañana' : `el ${DIAS[d]}`;
    return { abierto: false, txt: 'Ahora está cerrado', prox: `Abre ${cuando} a las ${hh[0]} h.` };
  }
  return { abierto: false, txt: 'Ahora está cerrado', prox: '' };
}

function initHorario() {
  const estados = document.querySelectorAll('[data-estado]');
  if (!estados.length) return;
  const pintar = () => {
    const t = ahoraArgentina();
    const e = estadoTaller(t);
    estados.forEach(el => {
      el.textContent = e.txt;
      el.parentElement?.classList.toggle('abierto', e.abierto);
    });
    document.querySelectorAll('[data-proximo]').forEach(el => { if (e.prox) el.textContent = e.prox; });
    const clave = t.dia === 0 ? 'do' : t.dia === 6 ? 'sa' : 'lv';
    document.querySelectorAll('.hor-fila[data-dia]').forEach(f => f.classList.toggle('hoy', f.dataset.dia === clave));
  };
  pintar();
  setInterval(pintar, 60000);
}

function initGaleria() {
  const visor = document.getElementById('visor');
  const fuente = document.getElementById('galData');
  if (!visor || !fuente) return;
  let datos = [];
  try { datos = JSON.parse(fuente.textContent); } catch (e) { datos = []; }
  if (!datos.length) return;
  const caja = visor.querySelector('.visor-caja');
  const vImg = document.getElementById('visorImg');
  const vCat = document.getElementById('visorCat');
  const vTit = document.getElementById('visorTit');
  const vDesc = document.getElementById('visorDesc');
  const vCta = document.getElementById('visorCta');
  const vCuenta = document.getElementById('visorCuenta');
  const tiles = [...document.querySelectorAll('.gal-btn[data-idx]')];
  let lista = [];
  let pos = 0;
  let ultimoFoco = null;

  const visibles = () => tiles.filter(b => !b.closest('li')?.hidden).map(b => Number(b.dataset.idx));
  const pintar = () => {
    const d = datos[lista[pos]];
    if (!d) return;
    vImg.src = d.src;
    vImg.alt = d.alt;
    vCat.textContent = d.cat;
    vTit.textContent = d.tit;
    vDesc.textContent = d.desc;
    vCta.href = d.wa;
    vCuenta.textContent = `${pos + 1} / ${lista.length}`;
  };
  const abrir = i => {
    lista = visibles();
    pos = Math.max(0, lista.indexOf(i));
    pintar();
    ultimoFoco = document.activeElement;
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => visor.classList.add('abierto'));
    visor.querySelector('.visor-cerrar')?.focus();
  };
  const cerrar = () => {
    visor.classList.remove('abierto');
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    ultimoFoco?.focus?.();
  };
  const mover = paso => {
    if (!lista.length) return;
    pos = (pos + paso + lista.length) % lista.length;
    pintar();
  };
  tiles.forEach(b => b.addEventListener('click', () => abrir(Number(b.dataset.idx))));
  visor.querySelectorAll('[data-cerrar]').forEach(b => b.addEventListener('click', cerrar));
  document.getElementById('visorPrev')?.addEventListener('click', () => mover(-1));
  document.getElementById('visorNext')?.addEventListener('click', () => mover(1));
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
    if (e.key === 'ArrowLeft') mover(-1);
    if (e.key === 'ArrowRight') mover(1);
    if (e.key === 'Tab' && caja) {
      const f = [...caja.querySelectorAll('a[href], button:not([disabled])')].filter(el => el.getClientRects().length);
      if (!f.length) return;
      const primero = f[0];
      const ultimo = f[f.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
  });

  const chips = [...document.querySelectorAll('.chip[data-filtro]')];
  const grid = document.getElementById('galGrid');
  if (chips.length && grid) {
    chips.forEach(chip => chip.addEventListener('click', () => {
      const f = chip.dataset.filtro;
      chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
      grid.querySelectorAll('.gal-item').forEach(li => { li.hidden = f !== 'todos' && li.dataset.cat !== f; });
      refrescar();
      revelarNuevos(grid);
    }));
  }
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
      try { vp.setPointerCapture?.(pointerId); } catch (err) { /* sin capture igual arrastra */ }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { /* ya liberado */ }
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
  const vp = document.getElementById('railVp');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  initRailDrag(vp);
  const paso = () => {
    const li = track?.querySelector('li');
    return li ? li.getBoundingClientRect().width + 16 : vp.clientWidth * 0.8;
  };
  const estado = () => {
    if (!prev || !next || !track) return;
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2 && vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', estado, { passive: true });
  window.addEventListener('resize', estado, { passive: true });
  estado();
}

function initTabs() {
  const lista = document.querySelector('.tab-lista');
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
    refrescar();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => elegir(t, false));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); elegir(tabs[j], true); }
    });
  });
}

function initConsulta() {
  const box = document.getElementById('consultaForm');
  if (!box) return;
  const chips = [...box.querySelectorAll('.chip--tipo')];
  const grupo = box.querySelector('.chips--tipo');
  const marca = document.getElementById('cMarca');
  const modelo = document.getElementById('cModelo');
  const falla = document.getElementById('cFalla');
  const nombre = document.getElementById('cNombre');
  const preview = document.getElementById('cPreview');
  const enviar = document.getElementById('cEnviar');
  const error = document.getElementById('errTipo');
  let tipo = null;

  const limpio = el => (el?.value || '').trim().replace(/\s+/g, ' ');
  const texto = () => {
    const n = limpio(nombre);
    const lineas = [n ? `¡Hola ELECTRITRUCK! Soy ${n}.` : '¡Hola ELECTRITRUCK!'];
    lineas.push(tipo ? `Quiero consultar por ${tipo.dataset.frase}.` : 'Quiero consultar por la instalación eléctrica de mi camión.');
    const unidad = [limpio(marca), limpio(modelo)].filter(Boolean).join(' ');
    if (unidad) lineas.push(`Unidad: ${unidad}.`);
    const f = limpio(falla);
    if (f) lineas.push(`Lo que pasa: ${f}`);
    return lineas.join('\n');
  };
  const actualizar = () => {
    const t = texto();
    if (preview) preview.textContent = t;
    if (enviar) enviar.href = `https://wa.me/${WA_NUM}?text=${encodeURIComponent(t)}`;
  };
  chips.forEach(chip => chip.addEventListener('click', () => {
    tipo = tipo === chip ? null : chip;
    chips.forEach(c => c.setAttribute('aria-pressed', String(c === tipo)));
    if (tipo) { if (error) error.hidden = true; grupo?.classList.remove('con-error'); }
    actualizar();
  }));
  [marca, modelo, falla, nombre].forEach(el => {
    el?.addEventListener('input', actualizar);
    el?.addEventListener('change', actualizar);
  });
  enviar?.addEventListener('click', e => {
    if (!tipo) {
      e.preventDefault();
      if (error) error.hidden = false;
      grupo?.classList.add('con-error');
      chips[0]?.focus();
      showToast('Elegí qué trabajo necesitás y armamos el mensaje.');
      return;
    }
    showToast('Abrimos WhatsApp con tu consulta lista para enviar.');
  });
  actualizar();
}

function initFaq() {
  document.querySelectorAll('.faq-item').forEach(d => d.addEventListener('toggle', refrescar));
}

initHorario();
initGaleria();
initTabs();
initRail();
initConsulta();
initFaq();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
