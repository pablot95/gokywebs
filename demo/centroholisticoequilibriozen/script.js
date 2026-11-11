const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    (document.querySelector('.site-header') || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 769px)');
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
    .from(hero.querySelectorAll('.hero-dato'), { y: 16, opacity: 0, duration: 0.8 }, 0.8)
    .from(hero.querySelectorAll('.marco__l--t, .marco__l--b'), { scaleX: 0, duration: 1.3, ease: 'power3.inOut' }, 0.45)
    .from(hero.querySelectorAll('.marco__l--l, .marco__l--r'), { scaleY: 0, duration: 1.3, ease: 'power3.inOut' }, 0.45)
    .from(hero.querySelectorAll('.marco__d'), { opacity: 0, duration: 0.6, stagger: 0.08 }, 1.25)
    .from(hero.querySelectorAll('.hero-arco, .hero-sello'), { y: 16, scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.12, clearProps: 'transform,opacity' }, 0.7);
}

function initGaleria() {
  const items = [...document.querySelectorAll('.galeria-item')];
  const lb = document.getElementById('lightbox');
  if (!items.length || !lb) return;
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCap');
  const cont = document.getElementById('lightboxCont');
  const btnCerrar = lb.querySelector('.lightbox__cerrar');
  const datos = items.map(b => {
    const im = b.querySelector('img');
    return {
      src: im?.getAttribute('src') || '',
      alt: im?.getAttribute('alt') || '',
      w: im?.getAttribute('width') || '',
      h: im?.getAttribute('height') || '',
      cap: b.querySelector('.galeria-cap')?.textContent.trim() || ''
    };
  });
  let idx = 0;
  let ultimoFoco = null;
  const mostrar = i => {
    idx = (i + datos.length) % datos.length;
    const d = datos[idx];
    img.src = d.src; img.alt = d.alt; img.width = Number(d.w); img.height = Number(d.h);
    cap.textContent = d.cap;
    cont.textContent = `${idx + 1} / ${datos.length}`;
  };
  const abrir = i => {
    ultimoFoco = document.activeElement;
    mostrar(i);
    lb.hidden = false;
    document.body.classList.add('no-scroll');
    btnCerrar?.focus();
  };
  const cerrar = () => {
    lb.hidden = true;
    document.body.classList.remove('no-scroll');
    ultimoFoco?.focus?.();
  };
  items.forEach((b, i) => b.addEventListener('click', () => abrir(i)));
  lb.querySelectorAll('[data-cerrar]').forEach(el => el.addEventListener('click', cerrar));
  lb.querySelector('.lightbox__prev')?.addEventListener('click', () => mostrar(idx - 1));
  lb.querySelector('.lightbox__next')?.addEventListener('click', () => mostrar(idx + 1));
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
    if (e.key === 'ArrowLeft') mostrar(idx - 1);
    if (e.key === 'ArrowRight') mostrar(idx + 1);
    if (e.key === 'Tab') {
      const focos = [...lb.querySelectorAll('button')];
      const primero = focos[0];
      const ultimo = focos[focos.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
      else if (!lb.contains(document.activeElement)) { e.preventDefault(); primero.focus(); }
    }
  });
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null, dx = 0;
  const THRESHOLD = 6;
  const piezas = () => [...vp.querySelectorAll('.g-item')];
  const inicio = () => parseFloat(window.getComputedStyle(vp.firstElementChild).paddingInlineStart) || 0;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId; dx = 0;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el arrastre igual funciona */ }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
      const base = inicio();
      const posiciones = piezas().map(p => p.offsetLeft - base);
      const actual = vp.scrollLeft;
      let destino = posiciones.reduce((a, b) => (Math.abs(b - actual) < Math.abs(a - actual) ? b : a), 0);
      if (Math.abs(dx) > 60) {
        const dir = dx < 0 ? 1 : -1;
        const siguiente = dir > 0 ? posiciones.find(p => p > startScroll + 2) : [...posiciones].reverse().find(p => p < startScroll - 2);
        if (typeof siguiente === 'number') destino = siguiente;
      }
      destino = Math.max(0, Math.min(destino, vp.scrollWidth - vp.clientWidth));
      vp.scrollTo({ left: destino, behavior: reduceMotion ? 'auto' : 'smooth' });
      setTimeout(() => vp.classList.remove('dragging'), 520);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initRail() {
  if (!document.body.classList.contains('m2')) return;
  const vp = document.getElementById('galeriaVp');
  if (!vp) return;
  initRailDrag(vp);
  const prev = document.querySelector('.rail-btn[data-dir="-1"]');
  const next = document.querySelector('.rail-btn[data-dir="1"]');
  const actualizar = () => {
    if (prev) prev.disabled = vp.scrollLeft <= 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  [prev, next].forEach(b => b?.addEventListener('click', () => {
    const dir = Number(b.dataset.dir) || 1;
    vp.scrollBy({ left: dir * Math.max(280, vp.clientWidth * 0.6), behavior: reduceMotion ? 'auto' : 'smooth' });
  }));
  vp.addEventListener('scroll', actualizar, { passive: true });
  window.addEventListener('resize', actualizar, { passive: true });
  actualizar();
}

function initResenas() {
  const form = document.getElementById('resenaForm');
  if (!form) return;
  const nombre = form.querySelector('#rNombre');
  const terapia = form.querySelector('#rTerapia');
  const texto = form.querySelector('#rTexto');
  const grupo = form.querySelector('.estrellas');
  const boton = form.querySelector('.resena-form__enviar');
  const marcar = (campo, errorId, msg) => {
    const p = document.getElementById(errorId);
    if (campo) campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (p) { p.textContent = msg || ''; p.hidden = !msg; }
  };
  const marcarEstrellas = msg => {
    grupo?.classList.toggle('invalido', Boolean(msg));
    const p = document.getElementById('rPuntajeError');
    if (p) { p.textContent = msg || ''; p.hidden = !msg; }
  };
  nombre?.addEventListener('input', () => marcar(nombre, 'rNombreError', ''));
  terapia?.addEventListener('change', () => marcar(terapia, 'rTerapiaError', ''));
  texto?.addEventListener('input', () => marcar(texto, 'rTextoError', ''));
  form.querySelectorAll('input[name="puntaje"]').forEach(r => r.addEventListener('change', () => marcarEstrellas('')));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const errores = [];
    const vNombre = nombre?.value.trim() || '';
    const vTerapia = terapia?.value || '';
    const vTexto = texto?.value.trim() || '';
    const vPuntaje = form.querySelector('input[name="puntaje"]:checked');
    if (vNombre.length < 2) { marcar(nombre, 'rNombreError', 'Escribí tu nombre.'); errores.push(nombre); } else marcar(nombre, 'rNombreError', '');
    if (!vTerapia) { marcar(terapia, 'rTerapiaError', 'Elegí la terapia que hiciste.'); errores.push(terapia); } else marcar(terapia, 'rTerapiaError', '');
    if (!vPuntaje) { marcarEstrellas('Marcá de 1 a 5 estrellas.'); errores.push(form.querySelector('#rP1')); } else marcarEstrellas('');
    if (vTexto.length < 15) { marcar(texto, 'rTextoError', 'Contanos un poco más (al menos 15 caracteres).'); errores.push(texto); } else marcar(texto, 'rTextoError', '');
    if (errores.length) { errores[0]?.focus(); return; }
    const original = boton.textContent;
    boton.disabled = true;
    boton.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      marcarEstrellas('');
      boton.disabled = false;
      boton.textContent = original;
    }, 800);
  });
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = L.latLng(-31.7333, -60.5297);
  const mapa = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, zoomControl: false }).setView(centro, 13);
  L.control.zoom({ position: 'topright', zoomInTitle: 'Acercar', zoomOutTitle: 'Alejar' }).addTo(mapa);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  L.circle(centro, { radius: 2200, color: '#7D5F1A', weight: 1, fillColor: '#C4A04A', fillOpacity: 0.16 }).addTo(mapa);
  L.circleMarker(centro, { radius: 8, color: '#FFFCF5', weight: 2, fillColor: '#A3352B', fillOpacity: 1 })
    .addTo(mapa)
    .bindPopup('Paraná, Entre Ríos<br>Zona de referencia');
  mapa.fitBounds(centro.toBounds(6200));
  window.addEventListener('load', () => mapa.invalidateSize());
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
      }
    });
  });
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

[initModelBarScroll, initNav, initWspFloat, initHeroMotion, initGaleria, initRail, initResenas, initMapa, initLeeScroll, initReveals]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
