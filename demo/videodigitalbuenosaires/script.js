const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const CAPITULOS = [
  { titulo: 'Retiramos tu material', etiqueta: 'Retiro' },
  { titulo: 'Lo digitalizamos en el estudio', etiqueta: 'Digitalización' },
  { titulo: 'Te lo entregamos en pendrive o por link', etiqueta: 'Entrega' },
];
const ANIO_GRABADO = 1989;
const ANIO_VISTO = new Date().getFullYear();
const FPS = 25;

const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
const tramo = (p, a, b) => clamp01((p - a) / (b - a));
const suave = t => t * t * (3 - 2 * t);
const mezcla = (a, b, t) => a + (b - a) * t;

function formatoTimecode(cuadros) {
  const total = Math.max(0, Math.floor(cuadros));
  const f = total % FPS;
  const s = Math.floor(total / FPS);
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60, f].map(n => String(n).padStart(2, '0')).join(':');
}

const cuadrosDesdeTimecode = tc => {
  const [hh, mm, ss, ff] = String(tc).split(':').map(n => parseInt(n, 10) || 0);
  return ((hh * 3600) + (mm * 60) + ss) * FPS + ff;
};

const anioContador = p => Math.round(mezcla(ANIO_GRABADO, ANIO_VISTO, clamp01(p)));
const digitosTelefono = valor => String(valor ?? '').replace(/\D/g, '');
const telefonoValido = valor => digitosTelefono(valor).length >= 10;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
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

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 961px)');
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

function initTimecodes() {
  const nodos = [...document.querySelectorAll('[data-timecode]')].map(el => ({ el, base: cuadrosDesdeTimecode(el.textContent.trim()) }));
  if (!nodos.length || reduceMotion) return;
  const inicio = window.performance.now();
  window.setInterval(() => {
    if (document.hidden) return;
    const avance = Math.floor(((window.performance.now() - inicio) / 1000) * FPS);
    nodos.forEach(n => { n.el.textContent = formatoTimecode(n.base + avance); });
  }, 1000 / FPS);
}

function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const html = document.documentElement;
  if (typeof gsap === 'undefined' || reduceMotion) { html.classList.add('hero-listo'); return; }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: () => html.classList.add('hero-listo') });
  tl.fromTo('.visor-media', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: 'power3.inOut' }, 0)
    .fromTo('.visor-media img', { scale: 1.12 }, { scale: 1, duration: 2.2 }, 0)
    .fromTo('.hero-titulo', { opacity: 0, y: 30, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 -20% 0)', duration: 1.2 }, 0.2)
    .fromTo(hero.querySelectorAll('.hero-anim'), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09 }, 0.45)
    .fromTo('.pieza-cinta', { opacity: 0, x: -40, rotate: -4 }, { opacity: 1, x: 0, rotate: 0, duration: 1.2 }, 0.9)
    .fromTo('.pieza-diapo', { opacity: 0, y: -30, rotate: 4 }, { opacity: 1, y: 0, rotate: 0, duration: 1.2 }, 1.0)
    .fromTo('.sello-anios', { opacity: 0, scale: 0.92, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 1 }, 1.15);

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const capas = [['.visor', 8], ['.pieza-cinta', 22], ['.pieza-diapo', 16], ['.sello-anios', 12]]
      .map(([sel, prof]) => ({ el: hero.querySelector(sel), prof }))
      .filter(c => c.el);
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      capas.forEach(c => gsap.to(c.el, { x: dx * c.prof, y: dy * c.prof, duration: 1, ease: 'power3.out', overwrite: 'auto' }));
    });
    hero.addEventListener('pointerleave', () => capas.forEach(c => gsap.to(c.el, { x: 0, y: 0, duration: 1.1, ease: 'power3.out', overwrite: 'auto' })));
  }
}

function initVideo() {
  const pantalla = document.querySelector('.pantalla');
  const botones = [...document.querySelectorAll('.capitulo')];
  const posters = [...document.querySelectorAll('.pantalla-poster')];
  const play = document.getElementById('videoPlay');
  const completo = document.getElementById('videoCompleto');
  const num = document.querySelector('[data-parte-num]');
  const titulo = document.querySelector('[data-parte-titulo]');
  const marca = document.querySelector('[data-video-tc]');
  if (!pantalla || !botones.length) return;
  let actual = 0;
  const activar = i => {
    const cap = CAPITULOS[i];
    if (!cap) return;
    actual = i;
    botones.forEach((b, n) => { b.classList.toggle('is-on', n === i); b.setAttribute('aria-pressed', String(n === i)); });
    posters.forEach((p, n) => p.classList.toggle('is-on', n === i));
    if (num) num.textContent = String(i + 1);
    if (titulo) titulo.textContent = cap.titulo;
    if (marca) marca.textContent = `CAP ${String(i + 1).padStart(2, '0')}`;
    play?.setAttribute('aria-label', `Reproducir la parte ${i + 1} del video: ${cap.etiqueta}`);
  };
  botones.forEach((b, n) => b.addEventListener('click', () => activar(n)));
  play?.addEventListener('click', () => showToast(`Acá se reproduce la parte ${actual + 1} del video que nos mandaste por WhatsApp: lo cargamos al pasar la web a producción.`));
  completo?.addEventListener('click', () => showToast('Acá va el video completo que nos mandaste por WhatsApp: lo cargamos al pasar la web a producción.'));
  activar(0);
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

function initMundos() {
  const sec = document.getElementById('antes-despues');
  const escena = document.getElementById('mundosEscena');
  if (!sec || !escena) return;
  const copyA = escena.querySelector('.mundo-copy-a');
  const copyB = escena.querySelector('.mundo-copy-b');
  const textoA = copyA?.querySelector('.container');
  const textoB = copyB?.querySelector('.container');
  const fondoA = escena.querySelector('.mundo-a .mundo-fondo');
  const fondoB = escena.querySelector('.mundo-b .mundo-fondo');
  const etiqueta = escena.querySelector('[data-contador-etq]');
  const anio = escena.querySelector('[data-contador-anio]');
  const tc = escena.querySelector('[data-contador-tc]');
  if (!copyA || !copyB || !textoA || !textoB || !fondoA || !fondoB) return;
  let ultimo = '';
  const pintarContador = t => {
    const valor = anioContador(t);
    const texto = t < 0.5 ? 'Grabado en' : 'Visto en';
    if (tc) tc.textContent = formatoTimecode(t * 18 * 60 * FPS);
    const clave = texto + valor;
    if (clave === ultimo) return;
    ultimo = clave;
    if (etiqueta) etiqueta.textContent = texto;
    if (anio) anio.textContent = String(valor);
  };
  if (reduceMotion) {
    sec.classList.add('is-estatico');
    pintarContador(0);
    return;
  }
  const pintar = p => {
    escena.style.setProperty('--w', mezcla(108, -8, suave(tramo(p, 0.04, 0.7))).toFixed(2));
    const saleA = suave(tramo(p, 0.08, 0.28));
    textoA.style.transform = `translateX(${mezcla(0, -70, saleA).toFixed(1)}px)`;
    textoA.style.opacity = (1 - saleA).toFixed(3);
    copyA.style.pointerEvents = saleA > 0.85 ? 'none' : 'auto';
    fondoA.style.transform = `scale(${mezcla(1, 1.07, suave(tramo(p, 0, 1))).toFixed(4)})`;
    const entraB = suave(tramo(p, 0.46, 0.68));
    textoB.style.transform = `translateX(${mezcla(70, 0, entraB).toFixed(1)}px)`;
    textoB.style.opacity = entraB.toFixed(3);
    copyB.style.pointerEvents = entraB < 0.15 ? 'none' : 'auto';
    fondoB.style.transform = `scale(${mezcla(1.09, 1, suave(tramo(p, 0.18, 0.9))).toFixed(4)})`;
    pintarContador(tramo(p, 0.04, 0.7));
  };
  const progreso = () => {
    const r = sec.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    return total > 0 ? clamp01(-r.top / total) : 0;
  };
  let pedido = false;
  const pedir = () => {
    if (pedido) return;
    pedido = true;
    requestAnimationFrame(() => { pedido = false; pintar(progreso()); });
  };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', () => pintar(progreso()));
  pintar(progreso());
}

function initForm() {
  const form = document.getElementById('formContacto');
  if (!form) return;
  const tel = document.getElementById('fTel');
  let mascara = null;
  if (tel && typeof window.IMask !== 'undefined') {
    mascara = window.IMask(tel, { mask: [{ mask: '+{54} 9 (00) 0000-0000' }, { mask: '+{54} 9 (000) 000-0000' }, { mask: '+{54} 9 (0000) 00-0000' }] });
  }
  const reglas = [
    { el: document.getElementById('fNombre'), ok: el => el.value.trim().length >= 2 },
    { el: tel, ok: el => telefonoValido(mascara ? mascara.unmaskedValue : el.value) },
    { el: document.getElementById('fFormato'), ok: el => el.value !== '' },
  ].filter(r => r.el);
  const marcar = (r, valido) => {
    r.el.setAttribute('aria-invalid', String(!valido));
    const error = document.getElementById(`${r.el.id}-error`);
    if (error) error.hidden = valido;
  };
  reglas.forEach(r => {
    r.el.addEventListener('blur', () => { if (r.el.value) marcar(r, r.ok(r.el)); });
    r.el.addEventListener('input', () => { if (r.el.getAttribute('aria-invalid') === 'true') marcar(r, r.ok(r.el)); });
    r.el.addEventListener('change', () => { if (r.el.getAttribute('aria-invalid') === 'true') marcar(r, r.ok(r.el)); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    let primero = null;
    reglas.forEach(r => {
      const valido = r.ok(r.el);
      marcar(r, valido);
      if (!valido && !primero) primero = r.el;
    });
    if (primero) {
      primero.focus({ preventScroll: true });
      primero.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      return;
    }
    const boton = document.getElementById('fEnviar');
    const texto = boton.textContent;
    boton.disabled = true;
    boton.textContent = 'Enviando…';
    window.setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      mascara?.updateValue();
      reglas.forEach(r => marcar(r, true));
      boton.disabled = false;
      boton.textContent = texto;
    }, 800);
  });
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const estudio = document.querySelector('.estudio-media img');
  if (estudio) {
    gsap.fromTo(estudio, { yPercent: -3.5 }, { yPercent: 3.5, ease: 'none', scrollTrigger: { trigger: '.estudio-media', start: 'top bottom', end: 'bottom top', scrub: true } });
  }
}

const PALETAS = [
  { nombre: 'Original', vars: { '--color-bg': '#F9FAFB', '--color-bg-alt': '#EEF0F6', '--color-text': '#0A0A1A', '--color-text-muted': '#4A4B5E', '--color-primary': '#0000FF', '--color-secondary': '#FF00FF', '--color-cta': '#0000FF', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Ámbar', vars: { '--color-bg': '#FAF7F2', '--color-bg-alt': '#F1EADF', '--color-text': '#1A140E', '--color-text-muted': '#5E5347', '--color-primary': '#9A3412', '--color-secondary': '#F59E0B', '--color-cta': '#9A3412', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Esmeralda', vars: { '--color-bg': '#F6FAF8', '--color-bg-alt': '#E5EFEA', '--color-text': '#08170F', '--color-text-muted': '#44574D', '--color-primary': '#047857', '--color-secondary': '#34D399', '--color-cta': '#047857', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Grafito', vars: { '--color-bg': '#F7F7F8', '--color-bg-alt': '#E9E9EC', '--color-text': '#101014', '--color-text-muted': '#4E4E58', '--color-primary': '#3730A3', '--color-secondary': '#A5B4FC', '--color-cta': '#101014', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Burdeos', vars: { '--color-bg': '#FBF7F8', '--color-bg-alt': '#F3E7EB', '--color-text': '#1C0A11', '--color-text-muted': '#5E4650', '--color-primary': '#9F1239', '--color-secondary': '#FB7185', '--color-cta': '#9F1239', '--color-cta-text': '#FFFFFF' } },
];

function initColorSwitch() {
  const btn = document.getElementById('color-switch');
  const backdrop = document.getElementById('palette-panel-backdrop');
  const closeBtn = document.getElementById('palette-panel-close');
  const grid = document.getElementById('palette-grid');
  if (!btn || !backdrop || !grid || !PALETAS?.length) return;
  const KEY = 'videodigital_paleta';

  const aplicar = (paleta, guardar = true) => {
    const root = document.documentElement.style;
    Object.entries(paleta.vars).forEach(([prop, val]) => root.setProperty(prop, val));
    grid.querySelectorAll('.paleta-swatch').forEach(sw => sw.classList.toggle('activa', sw.dataset.nombre === paleta.nombre));
    if (guardar) { try { localStorage.setItem(KEY, JSON.stringify(paleta)); } catch (err) { void err; } }
  };

  grid.innerHTML = PALETAS.map(p => `
    <button type="button" class="paleta-swatch" data-nombre="${esc(p.nombre)}" aria-label="Paleta ${esc(p.nombre)}"
      style="--sw-bg:${p.vars['--color-bg']};--sw-primary:${p.vars['--color-primary']};--sw-cta:${p.vars['--color-cta']}">
      <span class="paleta-swatch-dots" aria-hidden="true"></span>
      <span class="paleta-swatch-label">${esc(p.nombre)}</span>
    </button>`).join('');
  grid.querySelectorAll('.paleta-swatch').forEach(sw => {
    sw.addEventListener('click', () => aplicar(PALETAS.find(p => p.nombre === sw.dataset.nombre)));
  });

  const open = () => { backdrop.hidden = false; window.lenis?.stop(); document.body.classList.add('no-scroll'); };
  const close = () => { backdrop.hidden = true; window.lenis?.start(); document.body.classList.remove('no-scroll'); btn.focus(); };
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

  const guardada = (() => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } })();
  const activa = PALETAS.find(p => p.nombre === guardada?.nombre) || PALETAS[0];
  grid.querySelectorAll('.paleta-swatch').forEach(sw => sw.classList.toggle('activa', sw.dataset.nombre === activa.nombre));

  const sendBtn = document.getElementById('palette-send');
  sendBtn?.addEventListener('click', () => {
    const elegida = PALETAS.find(p => p.nombre === grid.querySelector('.paleta-swatch.activa')?.dataset.nombre) || activa;
    sendBtn.disabled = true; sendBtn.textContent = 'Enviando…';
    const slugUrl = (location.pathname.match(/\/demo\/([^/]+)/) || [])[1] || document.title;
    const negocio = (document.title.split(/\s[—|]\s|\s-\s/)[0] || document.title || '').trim();
    window.__gkySendPaleta?.({ slug: window.gkySlugify(slugUrl), negocio, paletaNombre: elegida.nombre, paletaVars: elegida.vars, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la paleta en Firestore:', err));
    window.setTimeout(() => {
      sendBtn.disabled = false; sendBtn.textContent = 'Enviar estos colores';
      if (typeof showToast === 'function') showToast('¡Listo! Le avisamos a Gokywebs.'); else window.alert('¡Listo! Le avisamos a Gokywebs.');
    }, 700);
  });
}

initReveals();
initNav();
initWspFloat();
initTimecodes();
initHero();
initVideo();
initLeeScroll();
initMundos();
initForm();
initParallax();
initColorSwitch();
