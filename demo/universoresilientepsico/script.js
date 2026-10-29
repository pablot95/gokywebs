const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA = '5491134554400';
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  const aros = hero.querySelectorAll('.orbita__aro');
  if (aros.length) tl.from(aros, { scale: 0.92, opacity: 0, duration: 1.6, stagger: 0.12, clearProps: 'transform,opacity' }, 0.15);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-tags li'), { y: 12, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75)
    .from(hero.querySelectorAll('.sello, .tag-foto, .orbita__chip'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7);
}

function initLeeScroll() {
  const els = document.querySelectorAll('[data-lee]');
  if (!els.length) return;
  els.forEach(el => {
    const palabras = el.textContent.trim().split(/\s+/);
    if (palabras.length < 2) return;
    el.textContent = '';
    palabras.forEach((palabra, i) => {
      const s = document.createElement('span');
      s.className = 'lee-w';
      s.textContent = palabra;
      el.appendChild(s);
      if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    document.querySelectorAll('.lee-w').forEach(w => w.classList.add('on'));
    return;
  }
  els.forEach(el => {
    const ws = el.querySelectorAll('.lee-w');
    if (!ws.length) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: 0.4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

function initMapa() {
  document.querySelectorAll('[data-mapa]').forEach(el => {
    if (typeof L === 'undefined') { el.closest('[data-mapa-box]')?.setAttribute('data-sin-mapa', ''); return; }
    try {
      const centro = L.latLng(-34.6037, -58.3816);
      const correr = el.hasAttribute('data-mapa-corrido');
      const mapa = L.map(el, { scrollWheelZoom: false, attributionControl: true, zoomControl: false });
      L.control.zoom({ position: correr && window.innerWidth >= 960 ? 'topright' : 'topleft' }).addTo(mapa);
      mapa.setView(centro, 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
      L.circle(centro, { radius: 1300, color: '#2A8A94', weight: 1, fillColor: '#2A8A94', fillOpacity: 0.12 }).addTo(mapa);
      L.circleMarker(centro, { radius: 8, color: '#FFFFFF', weight: 2, fillColor: '#14313A', fillOpacity: 1 }).addTo(mapa).bindTooltip('Consultorio · dirección a confirmar');
      const ajustar = () => {
        mapa.invalidateSize();
        mapa.setView(centro, 13, { animate: false });
        if (correr && window.innerWidth >= 960) mapa.panBy([-Math.round(el.clientWidth * 0.18), 0], { animate: false });
      };
      window.addEventListener('load', ajustar);
      if ('ResizeObserver' in window) new window.ResizeObserver(ajustar).observe(el);
    } catch (err) {
      void err;
    }
  });
}

function initTurno() {
  const form = document.getElementById('turnoForm');
  if (!form) return;
  const preview = document.getElementById('turnoPreview');
  const nombre = document.getElementById('tNombre');
  const nombreErr = document.getElementById('tNombreErr');
  const modErr = document.getElementById('tModErr');
  const modalidad = { presencial: 'una consulta presencial', online: 'una consulta online' };
  const primera = { si: 'Sería mi primera consulta.', no: 'Ya hice consultas antes.' };
  const franja = { manana: 'Me queda mejor por la mañana.', tarde: 'Me queda mejor por la tarde.', noche: 'Me queda mejor a la noche.', igual: 'Tengo horarios flexibles.' };
  const armar = () => {
    const fd = new FormData(form);
    const n = String(fd.get('nombre') || '').trim();
    const m = fd.get('modalidad');
    const p = fd.get('primera');
    const f = fd.get('franja');
    const extra = String(fd.get('mensaje') || '').trim();
    const partes = [`Hola${n ? `, soy ${n}.` : '.'} Quería pedir un turno para ${modalidad[m] || 'una consulta'}.`];
    if (primera[p]) partes.push(primera[p]);
    if (franja[f]) partes.push(franja[f]);
    if (extra) partes.push(extra);
    return partes.join(' ');
  };
  const pintar = () => { if (preview) preview.textContent = armar(); };
  form.addEventListener('input', pintar);
  form.addEventListener('change', () => {
    pintar();
    if (form.querySelector('input[name="modalidad"]:checked')) modErr.textContent = '';
  });
  nombre.addEventListener('input', () => {
    if (nombre.value.trim().length >= 2) { nombre.removeAttribute('aria-invalid'); nombreErr.textContent = ''; }
  });
  pintar();
  form.addEventListener('submit', e => {
    e.preventDefault();
    let primero = null;
    if (!form.querySelector('input[name="modalidad"]:checked')) {
      modErr.textContent = 'Elegí si preferís el encuentro presencial u online.';
      primero = primero || form.querySelector('input[name="modalidad"]');
    } else modErr.textContent = '';
    if (nombre.value.trim().length < 2) {
      nombre.setAttribute('aria-invalid', 'true');
      nombreErr.textContent = 'Contame tu nombre para saber a quién respondo.';
      primero = primero || nombre;
    } else { nombre.removeAttribute('aria-invalid'); nombreErr.textContent = ''; }
    if (primero) { primero.focus(); return; }
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(armar())}`, '_blank', 'noopener');
    showToast('Se abrió WhatsApp con tu mensaje: solo falta enviarlo.');
  });
}

function initVisor() {
  const visor = document.getElementById('visor');
  const items = [...document.querySelectorAll('[data-visor]')];
  if (!visor || !items.length) return;
  const img = document.getElementById('visorImg');
  const txt = document.getElementById('visorTxt');
  const cont = document.getElementById('visorCont');
  const cerrarBtn = visor.querySelector('.visor__cerrar');
  let i = 0;
  let ultimo = null;
  const mostrar = k => {
    i = (k + items.length) % items.length;
    const it = items[i];
    img.src = it.dataset.src;
    img.alt = it.querySelector('img')?.alt || '';
    txt.textContent = it.dataset.txt || '';
    cont.textContent = `${i + 1} / ${items.length}`;
  };
  const abrir = k => {
    ultimo = document.activeElement;
    mostrar(k);
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    cerrarBtn.focus();
  };
  const cerrar = () => {
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    ultimo?.focus();
  };
  items.forEach((it, k) => it.addEventListener('click', () => abrir(k)));
  visor.querySelectorAll('[data-cerrar]').forEach(b => b.addEventListener('click', cerrar));
  visor.querySelector('.visor__prev')?.addEventListener('click', () => mostrar(i - 1));
  visor.querySelector('.visor__next')?.addEventListener('click', () => mostrar(i + 1));
  visor.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
    if (e.key === 'ArrowRight') { mostrar(i + 1); return; }
    if (e.key === 'ArrowLeft') { mostrar(i - 1); return; }
    if (e.key === 'Tab') {
      const f = [...visor.querySelectorAll('button')];
      const a = f[0];
      const z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
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
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
      const track = vp.firstElementChild;
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      const destino = [...track.children].reduce((best, it) => {
        const left = it.offsetLeft - inicio;
        return Math.abs(left - vp.scrollLeft) < Math.abs(best - vp.scrollLeft) ? left : best;
      }, 0);
      vp.scrollTo({ left: Math.max(0, Math.min(destino, vp.scrollWidth - vp.clientWidth)), behavior: reduceMotion ? 'auto' : 'smooth' });
      setTimeout(() => vp.classList.remove('dragging'), 480);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initRail() {
  const vp = document.querySelector('.rail-vp');
  if (!vp) return;
  initRailDrag(vp);
  const track = vp.firstElementChild;
  const prev = document.querySelector('[data-rail="prev"]');
  const next = document.querySelector('[data-rail="next"]');
  const paso = () => {
    const it = track.children[0];
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 16;
    return it ? it.getBoundingClientRect().width + gap : 320;
  };
  const sync = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

initNav();
initWspFloat();
initModelBarScroll();
initMapa();
initTurno();
initVisor();
initRail();
initReveals();
initHeroMotion();
initLeeScroll();
