const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
const tramo = (p, a, b) => clamp01((p - a) / (b - a));
const suave = t => t * t * (3 - 2 * t);
const mezcla = (a, b, t) => a + (b - a) * t;

const GKY_SLUG_ACENTOS = { "á":"a","é":"e","í":"i","ó":"o","ú":"u","ñ":"n","ü":"u" };
function gkySlugify(s) {
  return String(s || "").toLowerCase()
    .replace(/[áéíóúñü]/g, c => GKY_SLUG_ACENTOS[c] || c)
    .replace(/[^a-z0-9]/g, "");
}

const PALETAS = [
  { nombre: 'Original', vars: { '--color-bg': '#F8F1EA', '--color-bg-alt': '#560914', '--color-text': '#17132B', '--color-text-muted': '#5B5569', '--color-primary': '#0000FF', '--color-secondary': '#FF00FF', '--color-cta': '#0000FF', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Terciopelo', vars: { '--color-bg': '#F7EFE6', '--color-bg-alt': '#3F0B18', '--color-text': '#221416', '--color-text-muted': '#65575A', '--color-primary': '#9A1B33', '--color-secondary': '#F07AA8', '--color-cta': '#9A1B33', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Estreno', vars: { '--color-bg': '#F2F3F8', '--color-bg-alt': '#0F1A40', '--color-text': '#10132A', '--color-text-muted': '#535A72', '--color-primary': '#2B3BD4', '--color-secondary': '#5CB6F2', '--color-cta': '#2B3BD4', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Contraste', vars: { '--color-bg': '#FFFCF7', '--color-bg-alt': '#16030A', '--color-text': '#0B0B0F', '--color-text-muted': '#55525C', '--color-primary': '#0000EE', '--color-secondary': '#FF3D9A', '--color-cta': '#D6001C', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Suave', vars: { '--color-bg': '#F6F1EF', '--color-bg-alt': '#3E313A', '--color-text': '#2A2229', '--color-text-muted': '#675D65', '--color-primary': '#6A4A8A', '--color-secondary': '#D38FAE', '--color-cta': '#6A4A8A', '--color-cta-text': '#FFFFFF' } },
];

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; el.style.filter = 'none'; });
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1025px)');
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

function initHero() {
  const els = [...document.querySelectorAll('[data-hero]')];
  if (!els.length) return;
  els.forEach(el => { el.style.animation = 'none'; });
  if (typeof gsap === 'undefined' || reduceMotion) {
    els.forEach(el => { el.style.opacity = '1'; });
    return;
  }
  const q = nombre => document.querySelector(`[data-hero="${nombre}"]`);
  const cta = q('cta');
  const libro = q('libro');
  gsap.set(cta, { opacity: 1 });
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo('.hero-foco', { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4 }, 0)
    .fromTo(q('eyebrow'), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .9 }, .1)
    .fromTo(q('title'), { opacity: 0, y: 24, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, clearProps: 'filter' }, .2)
    .fromTo(q('lead'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, .45)
    .fromTo(cta.children, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .9, stagger: .14 }, .62)
    .fromTo(q('note'), { opacity: 0 }, { opacity: 1, duration: .8 }, .95)
    .fromTo(libro, { opacity: 0, y: 70, rotate: -14 }, { opacity: 1, y: 0, rotate: -5, duration: 1.4 }, .3)
    .fromTo(libro.querySelector('.libro-cinta'), { rotate: 18 }, { rotate: 0, duration: 2.2, ease: 'elastic.out(1, .35)' }, .9)
    .fromTo(q('nota'), { opacity: 0, x: -40, rotate: -4 }, { opacity: 1, x: 0, rotate: 4, duration: 1.1 }, .75)
    .fromTo(q('sello'), { opacity: 0, scale: .92 }, { opacity: 1, scale: 1, duration: 1 }, .95)
    .fromTo(q('marca'), { opacity: 0, y: 40, clipPath: 'inset(100% 0 0 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1.4 }, .5);
}

function initFoco() {
  const hero = document.querySelector('.hero');
  const foco = hero?.querySelector('.hero-foco');
  const escena = hero?.querySelector('.hero-escena');
  if (!hero || !foco || !escena || reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const BASE_X = 74, BASE_Y = 44;
  let tx = BASE_X, ty = BASE_Y, cx = BASE_X, cy = BASE_Y, raf = 0;
  const loop = () => {
    cx += (tx - cx) * .08;
    cy += (ty - cy) * .08;
    foco.style.setProperty('--fx', `${cx.toFixed(2)}%`);
    foco.style.setProperty('--fy', `${cy.toFixed(2)}%`);
    escena.style.setProperty('--px', ((cx - BASE_X) / 50).toFixed(3));
    escena.style.setProperty('--py', ((cy - BASE_Y) / 50).toFixed(3));
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > .05 ? requestAnimationFrame(loop) : 0;
  };
  const pedir = () => { if (!raf) raf = requestAnimationFrame(loop); };
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width) * 100;
    ty = ((e.clientY - r.top) / r.height) * 100;
    pedir();
  });
  hero.addEventListener('pointerleave', () => { tx = BASE_X; ty = BASE_Y; pedir(); });
}

function initEstado() {
  const campos = document.querySelectorAll('[data-estado], [data-estado-dot], [data-estado-chip]');
  if (!campos.length) return;
  const formato = new Intl.DateTimeFormat('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const pintar = () => {
    const partes = formato.formatToParts(new Date());
    const h = Number(partes.find(p => p.type === 'hour')?.value ?? 0) % 24;
    const m = Number(partes.find(p => p.type === 'minute')?.value ?? 0);
    const minutos = h * 60 + m;
    const abierto = minutos >= 9 * 60 && minutos < 18 * 60;
    document.querySelectorAll('[data-estado]').forEach(el => { el.textContent = abierto ? 'Ahora en horario' : 'Respuesta desde las 9:00'; });
    document.querySelectorAll('[data-estado-dot]').forEach(el => el.classList.toggle('is-off', !abierto));
    document.querySelectorAll('[data-estado-chip]').forEach(el => {
      el.textContent = abierto ? 'Ahora en horario' : 'Ahora fuera de horario';
      el.classList.toggle('is-off', !abierto);
    });
  };
  pintar();
  window.setInterval(pintar, 60000);
}

function initDual() {
  const sec = document.querySelector('.dual');
  if (!sec) return;
  const escena = sec.querySelector('.dual-escena');
  const copyA = sec.querySelector('[data-copy-a]');
  const copyB = sec.querySelector('[data-copy-b]');
  const fondoA = sec.querySelector('[data-fondo-a]');
  const fondoB = sec.querySelector('[data-fondo-b]');
  const hora = sec.querySelector('[data-hora]');
  if (!escena || !copyA || !copyB) return;
  if (reduceMotion) {
    sec.classList.add('is-static');
    if (hora) hora.textContent = '07:10';
    return;
  }
  const INICIO = 23 * 60 + 40;
  const FIN = 31 * 60 + 10;
  let ultimaHora = '';
  const progreso = () => {
    const r = sec.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    return total > 0 ? clamp01(-r.top / total) : 0;
  };
  const pintar = p => {
    escena.style.setProperty('--w', mezcla(108, -8, suave(tramo(p, .04, .7))).toFixed(2));

    const saleA = suave(tramo(p, .08, .28));
    copyA.style.transform = `translateX(${mezcla(0, -70, saleA).toFixed(1)}px)`;
    copyA.style.opacity = (1 - saleA).toFixed(3);
    copyA.style.pointerEvents = saleA > .85 ? 'none' : 'auto';
    if (fondoA) fondoA.style.transform = `scale(${mezcla(1, 1.07, p).toFixed(4)})`;

    const entraB = suave(tramo(p, .46, .68));
    copyB.style.transform = `translateY(${mezcla(40, 0, entraB).toFixed(1)}px)`;
    copyB.style.opacity = entraB.toFixed(3);
    copyB.style.pointerEvents = entraB < .15 ? 'none' : 'auto';
    if (fondoB) fondoB.style.transform = `scale(${mezcla(1.09, 1, suave(tramo(p, .18, .9))).toFixed(4)})`;

    if (hora) {
      const minutos = Math.round(mezcla(INICIO, FIN, suave(tramo(p, .1, .7))) / 5) * 5;
      const texto = `${String(Math.floor(minutos / 60) % 24).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`;
      if (texto !== ultimaHora) { hora.textContent = texto; ultimaHora = texto; }
    }
  };
  let pedido = false;
  const calcular = () => { pedido = false; pintar(progreso()); };
  const pedir = () => { if (!pedido) { pedido = true; requestAnimationFrame(calcular); } };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', calcular);
  calcular();
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
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: .4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  document.querySelectorAll('[data-parallax]').forEach(img => {
    const sec = img.closest('section');
    if (!sec) return;
    gsap.fromTo(img, { yPercent: -6 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

function initTilt() {
  if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('[data-tilt]').forEach(libro => {
    const zona = libro.parentElement;
    if (!zona) return;
    zona.addEventListener('pointermove', e => {
      const r = zona.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      libro.style.transform = `perspective(900px) rotateY(${(x * 16).toFixed(2)}deg) rotateX(${(-y * 12).toFixed(2)}deg) rotate(3deg)`;
    });
    zona.addEventListener('pointerleave', () => { libro.style.transform = ''; });
  });
}

function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const tel = form.querySelector('#f-tel');
  let mask = null;
  if (tel && typeof IMask !== 'undefined') {
    mask = IMask(tel, { mask: [
      { mask: '+{54} 9 (00) 0000-0000' },
      { mask: '+{54} 9 (000) 000-0000' },
      { mask: '+{54} 9 (0000) 00-0000' },
    ] });
  }
  const digitosTel = () => (mask ? mask.unmaskedValue : (tel?.value || '').replace(/\D/g, '')).replace(/^549?/, '');
  const campos = [
    { el: form.querySelector('#f-nombre'), ok: v => v.trim().length >= 2 },
    { el: tel, ok: () => digitosTel().length >= 10 },
    { el: form.querySelector('#f-motivo'), ok: v => v !== '' },
    { el: form.querySelector('#f-mensaje'), ok: v => v.trim().length >= 10 },
  ].filter(c => c.el);
  const errorDe = el => document.getElementById(el.getAttribute('aria-describedby') || '');
  const validar = c => {
    const ok = c.ok(c.el.value);
    c.el.setAttribute('aria-invalid', String(!ok));
    const err = errorDe(c.el);
    if (err) err.hidden = ok;
    return ok;
  };
  campos.forEach(c => {
    c.el.addEventListener('blur', () => { if (c.el.value) validar(c); });
    c.el.addEventListener('input', () => { if (c.el.getAttribute('aria-invalid') === 'true') validar(c); });
    c.el.addEventListener('change', () => { if (c.el.getAttribute('aria-invalid') === 'true') validar(c); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const invalidos = campos.filter(c => !validar(c));
    if (invalidos.length) {
      invalidos[0].el.focus();
      invalidos[0].el.scrollIntoView({ block: 'center' });
      return;
    }
    const btn = form.querySelector('.form-submit');
    const textoOriginal = btn.textContent.trim();
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      mask?.updateValue();
      campos.forEach(c => {
        c.el.setAttribute('aria-invalid', 'false');
        const err = errorDe(c.el);
        if (err) err.hidden = true;
      });
      btn.disabled = false;
      btn.textContent = textoOriginal;
    }, 800);
  });
}

function initColorSwitch() {
  const btn = document.getElementById('color-switch');
  const backdrop = document.getElementById('palette-panel-backdrop');
  const closeBtn = document.getElementById('palette-panel-close');
  const grid = document.getElementById('palette-grid');
  if (!btn || !backdrop || !grid || !PALETAS?.length) return;
  const KEY = 'brikleysramirez_paleta';

  const aplicar = (paleta, guardar = true) => {
    const root = document.documentElement.style;
    Object.entries(paleta.vars).forEach(([prop, val]) => root.setProperty(prop, val));
    grid.querySelectorAll('.paleta-swatch').forEach(sw => sw.classList.toggle('activa', sw.dataset.nombre === paleta.nombre));
    if (guardar) { try { localStorage.setItem(KEY, JSON.stringify(paleta)); } catch { return; } }
  };

  grid.innerHTML = PALETAS.map(p => `
    <button type="button" class="paleta-swatch" data-nombre="${esc(p.nombre)}" aria-label="Paleta ${esc(p.nombre)}"
      style="--sw-bg:${p.vars['--color-bg']};--sw-primary:${p.vars['--color-primary']};--sw-cta:${p.vars['--color-secondary']}">
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
    window.__gkySendPaleta?.({ slug: gkySlugify(slugUrl), negocio, paletaNombre: elegida.nombre, paletaVars: elegida.vars, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la paleta en Firestore:', err));
    setTimeout(() => {
      sendBtn.disabled = false; sendBtn.textContent = 'Enviar estos colores';
      if (typeof showToast === 'function') showToast('¡Listo! Le avisamos a Gokywebs.'); else window.alert('¡Listo! Le avisamos a Gokywebs.');
    }, 700);
  });
}

function initDetalles() {
  document.querySelectorAll('details').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

initHero();
initFoco();
initEstado();
initDual();
initLeeScroll();
initParallax();
initTilt();
initForm();
initDetalles();
initReveals();
initNav();
initWspFloat();
initColorSwitch();
