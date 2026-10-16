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

const WA = '5491151339301';

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
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
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
  const panel = hero.querySelector('.hero-panel');
  if (panel) tl.from(panel, { y: 28, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.05);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const img = document.querySelector('.hero-media--full img');
  if (!img) return;
  gsap.to(img, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.hero-full', start: 'top top', end: 'bottom top', scrub: true } });
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

const HORARIO = { 0: null, 1: [8, 18], 2: [8, 18], 3: [8, 18], 4: [8, 18], 5: [8, 18], 6: [8, 13] };
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

function ahoraBA() {
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const valor = t => partes.find(p => p.type === t)?.value;
    const d = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[valor('weekday')];
    const h = Number(valor('hour')) % 24;
    const m = Number(valor('minute'));
    if (d === undefined || Number.isNaN(h)) throw new Error('fecha');
    return { d, t: h + m / 60 };
  } catch {
    const n = new Date();
    return { d: n.getDay(), t: n.getHours() + n.getMinutes() / 60 };
  }
}

function initHorarios() {
  const estados = document.querySelectorAll('[data-estado]');
  const filas = document.querySelectorAll('[data-dia]');
  if (!estados.length && !filas.length) return;
  const { d, t } = ahoraBA();
  const hoy = HORARIO[d];
  const abierto = !!hoy && t >= hoy[0] && t < hoy[1];
  let texto;
  if (abierto) {
    texto = `Abierto ahora · hasta las ${hoy[1]} h`;
  } else if (hoy && t < hoy[0]) {
    texto = `Cerrado ahora · abrimos hoy a las ${hoy[0]} h`;
  } else {
    let dia = d;
    let k = 0;
    do { dia = (dia + 1) % 7; k++; } while (!HORARIO[dia] && k < 7);
    texto = `Cerrado ahora · abrimos ${k === 1 ? 'mañana' : 'el ' + DIAS[dia]} a las ${HORARIO[dia][0]} h`;
  }
  estados.forEach(el => {
    el.classList.toggle('is-abierto', abierto);
    const span = el.querySelector('[data-estado-texto]');
    if (span) span.textContent = texto;
  });
  filas.forEach(f => f.classList.toggle('is-hoy', Number(f.dataset.dia) === d));
}

function initComparador() {
  document.querySelectorAll('.comparador').forEach(comp => {
    const range = comp.querySelector('.comp-range');
    let tocado = false;
    const poner = v => {
      const p = Math.max(0, Math.min(100, v));
      comp.style.setProperty('--pos', `${p}%`);
      if (range) range.value = String(Math.round(p));
    };
    range?.addEventListener('input', () => { tocado = true; poner(Number(range.value)); });
    let arrastrando = false;
    let decidido = false;
    let x0 = 0;
    let y0 = 0;
    let id = 0;
    const capturar = (soltar = false) => {
      try {
        if (soltar) comp.releasePointerCapture(id);
        else comp.setPointerCapture(id);
        return true;
      } catch {
        return false;
      }
    };
    const desdeX = x => {
      const r = comp.getBoundingClientRect();
      return ((x - r.left) / r.width) * 100;
    };
    comp.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      arrastrando = true;
      decidido = e.pointerType === 'mouse';
      x0 = e.clientX; y0 = e.clientY; id = e.pointerId;
      if (decidido) {
        tocado = true;
        poner(desdeX(e.clientX));
        capturar();
      }
    });
    comp.addEventListener('pointermove', e => {
      if (!arrastrando) return;
      if (!decidido) {
        const dx = Math.abs(e.clientX - x0);
        const dy = Math.abs(e.clientY - y0);
        if (dx < 6 && dy < 6) return;
        if (dy > dx) { arrastrando = false; return; }
        decidido = true;
        capturar();
      }
      tocado = true;
      poner(desdeX(e.clientX));
    });
    const soltar = () => {
      arrastrando = false;
      capturar(true);
    };
    comp.addEventListener('pointerup', soltar);
    comp.addEventListener('pointercancel', soltar);
    comp.addEventListener('click', () => range?.focus({ preventScroll: true }));

    if (reduceMotion || !('IntersectionObserver' in window)) return;
    poner(86);
    const io = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      if (tocado) return;
      const t0 = window.performance.now();
      const dur = 1600;
      const paso = now => {
        if (tocado) return;
        const p = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(1 - p, 4);
        poner(86 - 36 * e);
        if (p < 1) requestAnimationFrame(paso);
      };
      setTimeout(() => requestAnimationFrame(paso), 450);
    }, { threshold: 0.45 });
    io.observe(comp);
  });
}

function initVisor() {
  const visor = document.getElementById('visor');
  const botones = [...document.querySelectorAll('[data-visor]')];
  if (!visor || !botones.length) return;
  const img = visor.querySelector('.visor-img');
  const titulo = visor.querySelector('.visor-titulo');
  const num = visor.querySelector('.visor-n');
  const wa = visor.querySelector('.visor-wa');
  const cerrarBtn = visor.querySelector('.visor-cerrar');
  let actual = 0;
  let origen = null;
  const mostrar = i => {
    actual = (i + botones.length) % botones.length;
    const b = botones[actual];
    const src = b.querySelector('img');
    if (!src) return;
    img.src = src.getAttribute('src');
    img.alt = src.alt;
    img.width = src.width;
    img.height = src.height;
    if (titulo) titulo.textContent = b.dataset.titulo || '';
    if (num) num.textContent = `${actual + 1} / ${botones.length}`;
    if (wa) wa.href = `https://wa.me/${WA}?text=${encodeURIComponent(`Hola LxF Parquet! Vi el trabajo «${b.dataset.titulo || 'de la galería'}» en la web y quiero algo así para mi piso.`)}`;
  };
  const abrir = i => {
    origen = document.activeElement;
    mostrar(i);
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => visor.classList.add('is-open'));
    cerrarBtn?.focus();
  };
  const cerrar = () => {
    visor.classList.remove('is-open');
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    origen?.focus?.();
  };
  botones.forEach((b, i) => b.addEventListener('click', () => abrir(i)));
  visor.querySelectorAll('[data-visor-cerrar]').forEach(el => el.addEventListener('click', cerrar));
  visor.querySelector('.visor-prev')?.addEventListener('click', () => mostrar(actual - 1));
  visor.querySelector('.visor-next')?.addEventListener('click', () => mostrar(actual + 1));
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else if (e.key === 'ArrowLeft') mostrar(actual - 1);
    else if (e.key === 'ArrowRight') mostrar(actual + 1);
    else if (e.key === 'Tab') {
      const foco = [...visor.querySelectorAll('a[href], button')].filter(el => el.offsetParent !== null);
      if (!foco.length) return;
      const primero = foco[0];
      const ultimo = foco[foco.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
  });
}

function initForm() {
  const form = document.getElementById('formPresu');
  if (!form) return;
  const requeridos = [...form.querySelectorAll('[required]')];
  const marcar = (campo, mal) => {
    campo.setAttribute('aria-invalid', mal ? 'true' : 'false');
    const err = document.getElementById(campo.getAttribute('aria-describedby') || '');
    if (err) err.hidden = !mal;
  };
  requeridos.forEach(c => c.addEventListener('input', () => { if (c.value.trim()) marcar(c, false); }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const malos = requeridos.filter(c => !c.value.trim());
    requeridos.forEach(c => marcar(c, malos.includes(c)));
    if (malos.length) {
      malos[0].focus();
      showToast('Nos falta un dato para poder responderte.');
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    const txt = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = txt;
      form.reset();
      requeridos.forEach(c => c.removeAttribute('aria-invalid'));
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

initModelBarScroll();
initWspFloat();
initNav();
initHorarios();
initComparador();
initVisor();
initForm();
initHeroMotion();
initParallax();
initReveals();
