const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const WSP = '5492302665865';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));

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
  const desktopMq = window.matchMedia('(min-width: 981px)');
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

function initReveals() {
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
    .from(hero.querySelectorAll('.hero-diagonales path'), { opacity: 0, duration: 1.1, stagger: 0.12, clearProps: 'opacity' }, 0.5)
    .from(hero.querySelectorAll('.sello, .hero-badge, .hero-ficha'), { y: 24, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
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

function initEtapas() {
  const stage = document.querySelector('.etapas-stage');
  if (!stage) return;
  const textos = [...stage.querySelectorAll('.etapa-texto')];
  const fotos = [...stage.querySelectorAll('.etapa-foto')];
  const marcas = [...stage.querySelectorAll('.etapa-marca')];
  const contador = stage.querySelector('.etapa-contador-num');
  const N = Math.min(textos.length, 4);
  if (!N) return;
  let actual = -1;
  let frame = 0;
  const activar = i => {
    if (i === actual) return;
    actual = i;
    textos.forEach((t, k) => { t.classList.toggle('is-on', k === i); t.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
    fotos.forEach((f, k) => f.classList.toggle('is-on', k === i));
    marcas.forEach((m, k) => {
      m.classList.toggle('is-on', k === i);
      m.classList.toggle('is-done', k < i);
      if (k === i) m.setAttribute('aria-current', 'step'); else m.removeAttribute('aria-current');
    });
    if (contador) contador.textContent = String(i + 1).padStart(2, '0');
  };
  const progreso = () => {
    const total = Math.max(1, stage.offsetHeight - window.innerHeight);
    return { total, p: Math.min(1, Math.max(0, -stage.getBoundingClientRect().top / total)) };
  };
  const update = () => {
    frame = 0;
    const { p } = progreso();
    const i = Math.min(N - 1, Math.floor(p * N * 0.9999));
    activar(i);
    const local = Math.min(1, Math.max(0, p * N - i));
    stage.style.setProperty('--local', reduceMotion ? '1' : local.toFixed(3));
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(update); };
  marcas.forEach((m, k) => m.addEventListener('click', () => {
    const { total } = progreso();
    const destino = stage.getBoundingClientRect().top + window.scrollY + total * ((k + 0.5) / N);
    window.scrollTo({ top: destino, behavior: reduceMotion ? 'auto' : 'smooth' });
  }));
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  update();
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
  document.querySelectorAll('[data-rail]').forEach(rail => {
    const vp = rail.querySelector('.rail-vp');
    const track = rail.querySelector('.rail-track');
    if (!vp || !track) return;
    initRailDrag(vp);
    const prev = document.querySelector(`[data-rail-prev="${rail.id}"]`);
    const next = document.querySelector(`[data-rail-next="${rail.id}"]`);
    const items = [...track.querySelectorAll('.rail-item')];
    const mover = dir => {
      const x = vp.scrollLeft;
      const base = vp.getBoundingClientRect().left - x + (parseFloat(getComputedStyle(track).paddingInlineStart) || 0);
      const pos = items.map(it => Math.round(it.getBoundingClientRect().left - base));
      let destino = dir > 0 ? pos.find(p => p > x + 4) : [...pos].reverse().find(p => p < x - 4);
      if (destino === undefined) destino = dir > 0 ? vp.scrollWidth : 0;
      vp.scrollTo({ left: destino, behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    prev?.addEventListener('click', () => mover(-1));
    next?.addEventListener('click', () => mover(1));
    const sync = () => {
      if (prev) prev.disabled = vp.scrollLeft <= 2;
      if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    vp.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  });
}

function initForm() {
  const form = document.getElementById('formObra');
  if (!form) return;
  const nombre = form.querySelector('#f-nombre');
  const errTipo = document.getElementById('error-tipo');
  const errNombre = document.getElementById('error-nombre');
  const btn = form.querySelector('button[type="submit"]');
  const label = btn?.querySelector('span');
  form.addEventListener('change', e => { if (e.target.name === 'tipo' && errTipo) errTipo.hidden = true; });
  nombre?.addEventListener('input', () => {
    if (nombre.value.trim()) { nombre.removeAttribute('aria-invalid'); if (errNombre) errNombre.hidden = true; }
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const tipo = form.querySelector('input[name="tipo"]:checked')?.value || '';
    const n = nombre?.value.trim() || '';
    if (!tipo && errTipo) errTipo.hidden = false;
    if (!n) { nombre?.setAttribute('aria-invalid', 'true'); if (errNombre) errNombre.hidden = false; }
    if (!tipo || !n) {
      (tipo ? nombre : form.querySelector('input[name="tipo"]'))?.focus();
      showToast('Nos faltan un par de datos para armar tu consulta.');
      return;
    }
    const etapa = form.querySelector('#f-etapa')?.value || '';
    const zona = form.querySelector('#f-zona')?.value.trim() || '';
    const mensaje = form.querySelector('#f-mensaje')?.value.trim() || '';
    const lineas = [`Hola Juva, soy ${n}.`, `Quiero consultar por: ${tipo}.`, `En qué punto está: ${etapa}.`];
    if (zona) lineas.push(`Zona de la obra: ${zona}.`);
    if (mensaje) lineas.push(mensaje);
    const url = `https://wa.me/${WSP}?text=${encodeURIComponent(lineas.join('\n'))}`;
    const texto = label?.textContent || '';
    if (btn) btn.disabled = true;
    if (label) label.textContent = 'Armando tu mensaje…';
    setTimeout(() => {
      if (btn) btn.disabled = false;
      if (label) label.textContent = texto;
      window.open(url, '_blank', 'noopener');
      showToast('Listo: te abrimos WhatsApp con tu consulta armada.');
    }, 600);
  });
}

initNav();
initWspFloat();
initModelBarScroll();
initEtapas();
initRail();
initForm();
initReveals();
initHeroMotion();
