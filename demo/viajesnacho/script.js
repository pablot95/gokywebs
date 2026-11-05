document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7)
    .from(hero.querySelectorAll('.horario-barra'), { y: 24, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const foto = document.querySelector('.viaje-foto > img');
  if (foto) {
    gsap.fromTo(foto, { yPercent: -9 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: foto.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  }
  const fondo = document.querySelector('.hero-fondo img');
  if (fondo) {
    gsap.fromTo(fondo, { yPercent: -3 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: fondo.closest('.hero'), start: 'top top', end: 'bottom top', scrub: true } });
  }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; }
  const header = document.querySelector('.site-header');
  (header || document.body).appendChild(bd);
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

function initVisor() {
  const visor = document.getElementById('visor');
  const botones = [...document.querySelectorAll('.dest-btn')];
  const ficha = document.getElementById('fichaDestino');
  if (!visor || !botones.length || !ficha) return;
  const fotos = [...visor.querySelectorAll('img[data-foto]')];
  const zonaV = document.getElementById('visorZona');
  const nombreV = document.getElementById('visorNombre');
  const zonaF = document.getElementById('fichaZona');
  const nombreF = document.getElementById('fichaNombre');
  const descF = document.getElementById('fichaDesc');
  const wsp = document.getElementById('fichaWsp');
  const wspTxt = document.getElementById('fichaBtn');
  let timer = 0;

  const elegir = btn => {
    if (btn.getAttribute('aria-pressed') === 'true') return;
    const id = btn.dataset.dest;
    const nombre = btn.querySelector('.dest-nombre')?.textContent || '';
    botones.forEach(b => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
    fotos.forEach(f => f.classList.toggle('is-on', f.dataset.foto === id));
    const aplicar = () => {
      if (zonaV) zonaV.textContent = btn.dataset.zona || '';
      if (nombreV) nombreV.textContent = nombre;
      if (zonaF) zonaF.textContent = btn.dataset.zona || '';
      if (nombreF) nombreF.textContent = nombre;
      if (descF) descF.textContent = btn.dataset.desc || '';
      if (wsp && btn.dataset.wsp) wsp.href = btn.dataset.wsp;
      if (wspTxt) wspTxt.textContent = `Consultar por ${nombre}`;
      visor.classList.remove('cambiando');
      ficha.classList.remove('cambiando');
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    };
    if (reduceMotion) { aplicar(); return; }
    clearTimeout(timer);
    visor.classList.add('cambiando');
    ficha.classList.add('cambiando');
    timer = setTimeout(aplicar, 240);
    if (window.matchMedia('(max-width: 760px)').matches) {
      const r = visor.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) visor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  botones.forEach(b => b.addEventListener('click', () => elegir(b)));
}

function initRail() {
  const vp = document.querySelector('.rail-vp');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('.rail-flecha[data-dir="-1"]');
  const next = document.querySelector('.rail-flecha[data-dir="1"]');
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

  const estado = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const paso = () => {
    const card = track?.querySelector('.dest-card');
    const gap = track ? parseFloat(window.getComputedStyle(track).columnGap) || 0 : 0;
    return card ? card.getBoundingClientRect().width + gap : vp.clientWidth * 0.8;
  };
  [prev, next].forEach(b => b?.addEventListener('click', () => {
    vp.scrollBy({ left: paso() * Number(b.dataset.dir), behavior: reduceMotion ? 'auto' : 'smooth' });
  }));
  vp.addEventListener('scroll', estado, { passive: true });
  window.addEventListener('resize', estado, { passive: true });
  estado();
}

function initEstado() {
  const items = document.querySelectorAll('[data-estado]');
  if (!items.length) return;
  const horaJujuy = () => {
    try {
      return Number(new Intl.DateTimeFormat('es-AR', { hour: 'numeric', hourCycle: 'h23', timeZone: 'America/Argentina/Jujuy' }).format(new Date()));
    } catch (err) {
      void err;
      return new Date().getHours();
    }
  };
  const pintar = () => {
    const hora = horaJujuy();
    const abierto = hora >= 8 && hora < 20;
    items.forEach(el => {
      el.dataset.abierto = abierto ? 'si' : 'no';
      const txt = el.querySelector('.hb-estado-txt');
      if (txt) txt.textContent = abierto ? 'Ahora estamos atendiendo' : 'Fuera de horario: te respondemos desde las 8';
    });
  };
  pintar();
  window.setInterval(pintar, 60000);
}

function initFicha() {
  const ficha = document.querySelector('.hero-m2 .horario-barra');
  const hero = document.querySelector('.hero-m2');
  if (!ficha || !hero) return;
  const medir = () => hero.style.setProperty('--ficha-h', `${Math.round(ficha.getBoundingClientRect().height)}px`);
  medir();
  window.addEventListener('resize', medir, { passive: true });
}

function initFaq() {
  document.querySelectorAll('.faq details').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const tel = form.querySelector('input[name="telefono"]');
  let mask = null;
  if (tel && typeof IMask !== 'undefined') {
    mask = IMask(tel, { mask: [
      { mask: '+{54} 9 (000) 000-0000' },
      { mask: '+{54} 9 (00) 0000-0000' },
      { mask: '+{54} 9 (0000) 00-0000' }
    ] });
  }
  const marcar = (input, msg) => {
    const campo = input.closest('.campo');
    if (!campo) return;
    let err = campo.querySelector('.campo-error');
    if (msg) {
      campo.setAttribute('data-error', '');
      input.setAttribute('aria-invalid', 'true');
      if (!err) {
        err = document.createElement('span');
        err.className = 'campo-error';
        err.id = `${input.name}-error`;
        campo.appendChild(err);
      }
      err.textContent = msg;
      input.setAttribute('aria-describedby', err.id);
    } else {
      campo.removeAttribute('data-error');
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
      err?.remove();
    }
  };
  const validar = () => {
    let ok = true;
    const nombre = form.elements.nombre;
    const digitos = mask ? mask.unmaskedValue.length : tel.value.replace(/\D/g, '').length;
    if (nombre.value.trim().length < 2) { marcar(nombre, 'Contanos cómo te llamás.'); ok = false; } else marcar(nombre);
    if (digitos < 12) { marcar(tel, 'Revisá el número: lo usamos para escribirte.'); ok = false; } else marcar(tel);
    return ok;
  };
  form.querySelectorAll('input').forEach(i => i.addEventListener('input', () => { if (i.closest('[data-error]')) validar(); }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validar()) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    const label = btn.querySelector('span');
    const original = label.textContent;
    btn.disabled = true;
    label.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      label.textContent = original;
      form.reset();
      mask?.updateValue();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

initVisor();
initRail();
initEstado();
initFicha();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initParallax();
initFaq();
initForm();
