const WA_NUMERO = '5491128071955';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const HISTORIAS = [
  {
    img: 'images/abuela-sillon.webp',
    vertical: true,
    alt: 'Señora mayor sonriendo con una taza en su sillón, junto a la ventana',
    titulo: 'Mañana de sol',
    texto: 'Una taza caliente, la ventana abierta y alguien que pregunta cómo dormiste.',
    video: ''
  },
  {
    img: 'images/abuelo-lectura.webp',
    alt: 'Señor mayor leyendo un libro en su sillón',
    titulo: 'Tarde de lectura',
    texto: 'Un libro, el sillón de siempre y tiempo sin apuro.',
    video: ''
  },
  {
    img: 'images/merienda-en-casa.webp',
    alt: 'Pareja de abuelos sonriendo en la mesa con té y galletitas',
    titulo: 'La merienda de los dos',
    texto: 'En su mesa, con su vajilla y a su hora. En casa, como les gusta.',
    video: ''
  }
];
const DURACION_HISTORIA = 6500;

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
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.75);
}

function initMarcaParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const marca = document.querySelector('.hero__marca');
  const hero = document.querySelector('.hero');
  if (!marca || !hero) return;
  gsap.to(marca, { yPercent: 22, rotate: 5, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
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

function crearVisor(root, { modal }) {
  const marco = root.querySelector('.historia__marco');
  const barras = root.querySelector('.historia__barras');
  const media = root.querySelector('.historia__media');
  const titulo = root.querySelector('.historia__titulo');
  const texto = root.querySelector('.historia__texto');
  const pausaBtn = root.querySelector('.historia__pausa');
  const inicio = root.querySelector('.historia__inicio');
  if (!marco || !barras || !media) return null;

  barras.innerHTML = HISTORIAS.map(() => '<span><i></i></span>').join('');
  const fills = [...barras.querySelectorAll('i')];
  let idx = 0;
  let transcurrido = 0;
  let ultimo = 0;
  let pausado = false;
  let activo = false;
  let raf = 0;
  let duracion = DURACION_HISTORIA;
  let video = null;

  const pintarBarras = () => {
    fills.forEach((f, j) => { f.style.transform = `scaleX(${j < idx ? 1 : 0})`; });
  };
  const setPausa = valor => {
    pausado = valor;
    root.classList.toggle('is-paused', pausado);
    if (video) { if (pausado) video.pause(); else video.play().catch(() => {}); }
    if (pausaBtn) {
      pausaBtn.setAttribute('aria-label', pausado ? 'Reproducir' : 'Pausar');
      pausaBtn.querySelector('use')?.setAttribute('href', pausado ? '#i-play' : '#i-pausa');
    }
  };
  const tick = ahora => {
    raf = 0;
    if (!activo) return;
    if (!pausado) transcurrido += ahora - ultimo;
    ultimo = ahora;
    const p = Math.min(transcurrido / duracion, 1);
    if (fills[idx]) fills[idx].style.transform = `scaleX(${p})`;
    if (p >= 1) { siguiente(); return; }
    raf = requestAnimationFrame(tick);
  };
  const arrancarReloj = () => {
    if (raf) window.cancelAnimationFrame(raf);
    ultimo = window.performance.now();
    raf = requestAnimationFrame(tick);
  };
  const mostrar = i => {
    idx = Math.max(0, Math.min(i, HISTORIAS.length - 1));
    const h = HISTORIAS[idx];
    transcurrido = 0;
    duracion = DURACION_HISTORIA;
    video = null;
    const bg = `<img class="historia__bg" src="${esc(h.img)}" alt="" aria-hidden="true">`;
    if (h.video) {
      media.innerHTML = `${bg}<video src="${esc(h.video)}" muted playsinline autoplay preload="auto"></video>`;
      video = media.querySelector('video');
      video.addEventListener('loadedmetadata', () => { if (video.duration && isFinite(video.duration)) duracion = video.duration * 1000; });
    } else {
      media.innerHTML = `${bg}<img class="historia__img${h.vertical ? ' es-vertical' : ''}${reduceMotion || !activo ? '' : ' kb'}" src="${esc(h.img)}" alt="${esc(h.alt)}">`;
    }
    if (titulo) titulo.textContent = h.titulo;
    if (texto) texto.textContent = h.texto;
    root.dispatchEvent(new CustomEvent('historia:cambio', { detail: idx }));
    pintarBarras();
    setPausa(false);
    if (activo) arrancarReloj();
  };
  const terminar = () => {
    activo = false;
    if (raf) window.cancelAnimationFrame(raf);
    raf = 0;
    if (inicio) {
      inicio.hidden = false;
      const lbl = inicio.querySelector('.historia__inicio-texto');
      if (lbl) lbl.textContent = 'Ver de nuevo';
    }
  };
  const siguiente = () => {
    if (idx < HISTORIAS.length - 1) { mostrar(idx + 1); return; }
    if (fills[idx]) fills[idx].style.transform = 'scaleX(1)';
    if (modal) cerrar(); else terminar();
  };
  const anterior = () => { mostrar(idx > 0 ? idx - 1 : 0); };
  const reproducir = i => {
    activo = true;
    if (inicio) inicio.hidden = true;
    mostrar(i);
    arrancarReloj();
  };

  let volverA = null;
  const alTeclado = e => {
    if (root.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else if (e.key === 'ArrowRight') siguiente();
    else if (e.key === 'ArrowLeft') anterior();
    else if (e.key === 'Tab') {
      const foco = [...root.querySelectorAll('button:not([hidden])')].filter(b => b.offsetParent);
      if (!foco.length) return;
      const primero = foco[0], ultimoF = foco[foco.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimoF.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimoF) { e.preventDefault(); primero.focus(); }
    }
  };
  const abrir = i => {
    volverA = document.activeElement;
    root.hidden = false;
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', alTeclado);
    reproducir(i);
    (root.querySelector('.historia__pausa') || marco).focus();
  };
  function cerrar() {
    activo = false;
    if (raf) window.cancelAnimationFrame(raf);
    raf = 0;
    if (video) video.pause();
    if (!modal) return;
    root.hidden = true;
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', alTeclado);
    volverA?.focus?.();
  }

  root.querySelector('.historia__zona--next')?.addEventListener('click', () => { if (activo) siguiente(); });
  root.querySelector('.historia__zona--prev')?.addEventListener('click', () => { if (activo) anterior(); });
  pausaBtn?.addEventListener('click', () => { if (activo) setPausa(!pausado); });
  root.querySelectorAll('[data-cerrar]').forEach(b => b.addEventListener('click', cerrar));
  inicio?.addEventListener('click', () => reproducir(0));
  document.addEventListener('visibilitychange', () => { if (document.hidden && activo) setPausa(true); });

  mostrar(0);
  return { abrir, reproducir, cerrar, estaActivo: () => activo, pausar: () => { if (activo) setPausa(true); } };
}

function initHistorias() {
  const modalEl = document.getElementById('historia');
  if (modalEl) {
    const visor = crearVisor(modalEl, { modal: true });
    document.querySelectorAll('[data-historia]').forEach(btn => {
      btn.addEventListener('click', () => visor?.abrir(Number(btn.dataset.historia) || 0));
    });
  }
  const inline = document.getElementById('historia-inline');
  if (!inline) return;
  const visor = crearVisor(inline, { modal: false });
  if (!visor) return;
  const lista = [...document.querySelectorAll('[data-historia-inline]')];
  const marcar = i => lista.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
  lista.forEach(btn => btn.addEventListener('click', () => {
    const i = Number(btn.dataset.historiaInline) || 0;
    visor.reproducir(i);
    marcar(i);
  }));
  inline.addEventListener('historia:cambio', e => marcar(e.detail));
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      entries.forEach(entry => { if (!entry.isIntersecting) visor.pausar(); });
    }, { threshold: 0.2 }).observe(inline);
  }
}

function initConsulta() {
  const form = document.getElementById('consulta');
  const enviar = document.getElementById('consulta-enviar');
  if (!form || !enviar) return;
  const limpiar = v => String(v || '').trim().replace(/[.\s]+$/, '');
  const valor = nombre => limpiar(form.querySelector(`input[name="${nombre}"]:checked, input[name="${nombre}"]:not([type="radio"])`)?.value);
  const armar = () => {
    const servicio = valor('servicio');
    const paciente = valor('paciente');
    const zona = valor('zona');
    const cuando = valor('cuando');
    let msg = `Hola Green Nursing! Quiero consultar por ${servicio || 'sus servicios'}.`;
    if (paciente) msg += `\nEs para: ${paciente}.`;
    if (zona) msg += `\nZona: ${zona}.`;
    if (cuando) msg += `\nLo necesito: ${cuando}.`;
    enviar.href = `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(msg)}`;
    return servicio;
  };
  form.addEventListener('input', armar);
  form.addEventListener('change', () => { armar(); form.classList.remove('falta'); });
  enviar.addEventListener('click', e => {
    if (!armar()) {
      e.preventDefault();
      form.classList.add('falta');
      showToast('Elegí qué necesitás y te respondemos más rápido.');
      form.querySelector('input[name="servicio"]')?.focus();
      return;
    }
    showToast('Abrimos WhatsApp con tu consulta lista.');
  });
  armar();
}

initHistorias();
initConsulta();
initReveals();
initHeroMotion();
initMarcaParallax();
initNav();
initWspFloat();
initModelBarScroll();
