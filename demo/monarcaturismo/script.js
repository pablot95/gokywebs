const WHATSAPP_NUMBER = '5491134075479';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const wspHref = texto => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
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

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => { a.href = wspHref(a.dataset.wspMsg); });
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initCartel() {
  const items = [...document.querySelectorAll('.cartel__item')];
  if (items.length < 2 || reduceMotion) return;
  let i = 0;
  window.setInterval(() => {
    if (document.hidden) return;
    const actual = items[i];
    i = (i + 1) % items.length;
    const sig = items[i];
    actual.classList.remove('is-on');
    actual.classList.add('is-off');
    sig.classList.remove('is-off');
    sig.classList.add('is-on');
    setTimeout(() => actual.classList.remove('is-off'), 700);
  }, 2600);
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.cartel'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.talon'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const media = document.querySelector('.hero-media');
  const pic = media?.querySelector('picture');
  if (!pic) return;
  gsap.fromTo(pic, { yPercent: -3 }, {
    yPercent: 3,
    ease: 'none',
    scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true },
  });
}

function initContador() {
  const el = document.querySelector('[data-contar]');
  if (!el || reduceMotion || !('IntersectionObserver' in window)) return;
  const fin = parseInt(el.dataset.contar, 10) || 0;
  const io = new IntersectionObserver(entries => {
    if (!entries.some(en => en.isIntersecting)) return;
    io.disconnect();
    const t0 = window.performance.now();
    const dur = 1400;
    const paso = t => {
      const p = Math.min(Math.max((t - t0) / dur, 0), 1);
      el.textContent = String(Math.round(fin * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(paso);
    };
    el.textContent = '0';
    requestAnimationFrame(paso);
  }, { threshold: 0.4 });
  io.observe(el);
}

function initConsulta() {
  const form = document.getElementById('form-consulta');
  if (!form) return;
  const destino = form.querySelector('#c-destino');
  const salida = form.querySelector('#c-salida');
  const fecha = form.querySelector('#c-fecha');
  const pasajeros = form.querySelector('#c-pasajeros');
  const nombre = form.querySelector('#c-nombre');
  const error = form.querySelector('#c-destino-error');
  const labelDestino = form.querySelector('[data-label-destino]');
  const enviar = form.querySelector('[type="submit"]');
  if (!destino || !salida || !fecha || !pasajeros || !nombre || !enviar) return;
  const res = campo => form.querySelector(`[data-res="${campo}"]`);
  const ruta = campo => form.querySelector(`[data-ruta="${campo}"]`);
  const TIPOS = {
    Turismo: { label: 'Destino', ph: 'Ej.: Bariloche, Salta o Córdoba', dato: 'Destino' },
    'Costa Atlántica': { label: '¿A qué ciudad de la costa?', ph: 'Ej.: Mar del Plata o Pinamar', dato: 'Destino' },
    Cancha: { label: '¿Qué partido?', ph: 'Ej.: el partido del domingo', dato: 'Partido' },
    Recital: { label: '¿Qué show?', ph: 'Ej.: el recital del sábado', dato: 'Show' },
  };
  const hoy = new Date();
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  fecha.min = iso(hoy);
  const fechaTexto = v => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return '';
    const [y, m, d] = v.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  };
  const tipoActual = () => form.querySelector('input[name="tipo"]:checked')?.value || 'Turismo';
  const limitar = v => Math.min(60, Math.max(1, Math.round(Number(v)) || 1));
  const poner = (el, texto) => { if (el) el.textContent = texto; };

  const actualizar = () => {
    const tipo = tipoActual();
    const cfg = TIPOS[tipo] || TIPOS.Turismo;
    poner(labelDestino, cfg.label);
    destino.placeholder = cfg.ph;
    const dest = destino.value.trim();
    const sal = salida.value.trim();
    poner(res('tipo'), tipo);
    poner(res('destino'), dest || 'A definir');
    poner(res('salida'), sal || 'A definir');
    poner(res('fecha'), fechaTexto(fecha.value) || 'A definir');
    poner(res('pasajeros'), pasajeros.value === '' ? 'A definir' : String(limitar(pasajeros.value)));
    poner(ruta('salida'), sal || 'Tu salida');
    poner(ruta('destino'), dest || 'Tu destino');
  };

  form.addEventListener('input', actualizar);
  form.addEventListener('change', actualizar);
  form.querySelectorAll('[data-paso]').forEach(b => b.addEventListener('click', () => {
    pasajeros.value = String(limitar((parseInt(pasajeros.value, 10) || 0) + Number(b.dataset.paso)));
    actualizar();
  }));
  pasajeros.addEventListener('blur', () => { pasajeros.value = String(limitar(pasajeros.value)); actualizar(); });
  destino.addEventListener('input', () => {
    if (destino.getAttribute('aria-invalid') === 'true' && destino.value.trim()) {
      destino.setAttribute('aria-invalid', 'false');
      if (error) error.hidden = true;
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const dest = destino.value.trim();
    if (!dest) {
      destino.setAttribute('aria-invalid', 'true');
      if (error) error.hidden = false;
      destino.focus();
      destino.scrollIntoView({ block: 'center' });
      return;
    }
    pasajeros.value = String(limitar(pasajeros.value));
    const tipo = tipoActual();
    const cfg = TIPOS[tipo] || TIPOS.Turismo;
    const lineas = [
      'Hola Monarca Turismo, quiero consultar por un viaje en el micro.',
      '',
      `• Tipo de viaje: ${tipo}`,
      `• ${cfg.dato}: ${dest}`,
      `• Salida desde: ${salida.value.trim() || 'a definir'}`,
      `• Fecha: ${fechaTexto(fecha.value) || 'a definir'}`,
      `• Pasajeros: ${pasajeros.value}`,
    ];
    if (nombre.value.trim()) lineas.push('', `Me llamo ${nombre.value.trim()}.`);
    const a = document.createElement('a');
    a.href = wspHref(lineas.join('\n'));
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Te abrimos WhatsApp con la consulta lista para enviar.');
    const txt = enviar.querySelector('span');
    const original = txt ? txt.textContent : '';
    enviar.disabled = true;
    poner(txt, 'Abriendo WhatsApp…');
    setTimeout(() => { enviar.disabled = false; poner(txt, original); }, 1600);
  });

  actualizar();
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

initModelBarScroll();
initNav();
initWspLinks();
initWspFloat();
initCartel();
initConsulta();
initHeroMotion();
initParallax();
initContador();
initReveals();
