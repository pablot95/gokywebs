const WHATSAPP_NUMBER = '5491155124922';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const clamp01 = n => Math.min(1, Math.max(0, n));

const GKY_SLUG_ACENTOS = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u' };
function gkySlugify(s) {
  return String(s || '').toLowerCase()
    .replace(/[áéíóúñü]/g, c => GKY_SLUG_ACENTOS[c] || c)
    .replace(/[^a-z0-9]/g, '');
}

const PALETAS = [
  { nombre: 'Original', vars: { '--color-bg': '#F9FAFB', '--color-bg-alt': '#EEF1FD', '--color-text': '#111834', '--color-text-muted': '#4B5270', '--color-primary': '#243BEB', '--color-secondary': '#16A34A', '--color-cta': '#243BEB', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Verde', vars: { '--color-bg': '#F7FAF8', '--color-bg-alt': '#E6F2EA', '--color-text': '#0E2217', '--color-text-muted': '#43564A', '--color-primary': '#137036', '--color-secondary': '#243BEB', '--color-cta': '#137036', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Cálida', vars: { '--color-bg': '#FBF8F3', '--color-bg-alt': '#F3EADF', '--color-text': '#2A1C12', '--color-text-muted': '#67533F', '--color-primary': '#B03F17', '--color-secondary': '#2F7D5B', '--color-cta': '#B03F17', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Institucional', vars: { '--color-bg': '#F8FAFC', '--color-bg-alt': '#E9EFF6', '--color-text': '#0B1B33', '--color-text-muted': '#475569', '--color-primary': '#1D4E89', '--color-secondary': '#C27C0E', '--color-cta': '#1D4E89', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Suave', vars: { '--color-bg': '#FAF9FC', '--color-bg-alt': '#EFECF8', '--color-text': '#221E35', '--color-text-muted': '#5A5572', '--color-primary': '#5641C4', '--color-secondary': '#0F8F80', '--color-cta': '#5641C4', '--color-cta-text': '#FFFFFF' } },
];

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; el.style.filter = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  window.setTimeout(() => { toast.classList.add('hiding'); window.setTimeout(() => toast.remove(), 220); }, 3200);
}

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => {
    a.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(a.dataset.wspMsg)}`;
  });
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
  const root = document.documentElement;
  const scene = document.getElementById('heroScene');
  if (!scene || typeof gsap === 'undefined' || reduceMotion) { root.classList.remove('js-anim'); return; }
  const campo = scene.querySelector('.scene-field');
  const foto = scene.querySelector('.scene-photo');
  const fotoImg = foto?.querySelector('img');
  const vale = scene.querySelector('.vale-hero');
  const carnet = scene.querySelector('.carnet');
  const sello = scene.querySelector('.sello-hero');

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo('.hero-eyebrow', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .7 }, 0)
    .fromTo('.hero-title', { opacity: 0, y: 28, clipPath: 'inset(0% 0% 100% 0%)' }, { opacity: 1, y: 0, clipPath: 'inset(0% 0% -14% 0%)', duration: 1.15, clearProps: 'clipPath' }, .1)
    .fromTo('.hero-lead', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .9 }, .35)
    .fromTo('.hero-ctas .btn', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .8, stagger: .12 }, .5)
    .fromTo('.hero-sede', { opacity: 0 }, { opacity: 1, duration: .8 }, .75)
    .fromTo(campo, { opacity: 0, scale: .92 }, { opacity: 1, scale: 1, duration: 1.1 }, .1)
    .fromTo(foto, { opacity: 0, clipPath: 'inset(12% 12% 12% 12% round 20px)' }, { opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 1.2, clearProps: 'clipPath' }, .2)
    .fromTo(fotoImg, { scale: 1.1 }, { scale: 1, duration: 1.5, clearProps: 'transform' }, .2)
    .fromTo(vale, { opacity: 0, y: 50, rotation: 18 }, { opacity: 1, y: 0, rotation: 6, duration: 1 }, .55)
    .fromTo(carnet, { opacity: 0, y: 90, rotation: -16 }, { opacity: 1, y: 0, rotation: -5, duration: 1.1 }, .65)
    .fromTo(sello, { opacity: 0, scale: 1.7, rotation: 40, filter: 'blur(6px)' }, { opacity: .94, scale: 1, rotation: 14, filter: 'blur(0px)', duration: .5, ease: 'power4.in' }, 1.1)
    .to(sello, { scale: .94, duration: .12, yoyo: true, repeat: 1, ease: 'power1.out' }, 1.6);
  root.classList.remove('js-anim');

  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  let capas = null;
  const armar = () => {
    if (capas) return capas;
    capas = [[campo, 6], [foto, 12], [vale, 18], [carnet, 24], [sello, 30]]
      .filter(([el]) => el)
      .map(([el, f]) => ({ f, x: gsap.quickTo(el, 'x', { duration: .9, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: .9, ease: 'power3.out' }) }));
    return capas;
  };
  scene.addEventListener('pointermove', e => {
    if (tl.progress() < 1) return;
    const r = scene.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - .5;
    const ny = (e.clientY - r.top) / r.height - .5;
    armar().forEach(c => { c.x(nx * c.f); c.y(ny * c.f); });
  });
  scene.addEventListener('pointerenter', () => {
    if (tl.progress() === 1 && sello) gsap.to(sello, { rotation: 3, duration: .6, ease: 'power3.out' });
  });
  scene.addEventListener('pointerleave', () => {
    if (tl.progress() < 1) return;
    armar().forEach(c => { c.x(0); c.y(0); });
    if (sello) gsap.to(sello, { rotation: 14, duration: .6, ease: 'power3.out' });
  });
}

function initServiciosPreview() {
  const lista = document.getElementById('serviciosLista');
  const prev = document.getElementById('serviciosPreview');
  if (!lista || !prev || typeof gsap === 'undefined' || reduceMotion) return;
  const mq = window.matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)');
  const imgs = [...prev.querySelectorAll('img')];
  gsap.set(prev, { xPercent: -50, yPercent: -50, scale: .85, autoAlpha: 0 });
  const xTo = gsap.quickTo(prev, 'x', { duration: .6, ease: 'power3.out' });
  const yTo = gsap.quickTo(prev, 'y', { duration: .6, ease: 'power3.out' });
  const offset = () => -Math.min(200, window.innerWidth * .15);
  let visible = false;
  const ocultar = () => {
    if (!visible) return;
    visible = false;
    gsap.to(prev, { autoAlpha: 0, scale: .85, duration: .3, ease: 'power2.out', overwrite: 'auto' });
  };
  lista.addEventListener('pointermove', e => {
    if (!mq.matches || !visible) return;
    xTo(e.clientX + offset());
    yTo(e.clientY);
  });
  lista.querySelectorAll('.servicio-link').forEach(link => {
    link.addEventListener('pointerenter', e => {
      if (!mq.matches) return;
      const i = Number(link.dataset.preview);
      imgs.forEach((img, k) => img.classList.toggle('is-on', k === i));
      if (!visible) {
        xTo(e.clientX + offset(), e.clientX + offset());
        yTo(e.clientY, e.clientY);
        visible = true;
      }
      gsap.to(prev, { autoAlpha: 1, scale: 1, rotation: i % 2 ? 3 : -3, duration: .45, ease: 'power3.out', overwrite: 'auto' });
    });
  });
  lista.addEventListener('pointerleave', ocultar);
  window.addEventListener('scroll', ocultar, { passive: true });
}

function initMomentos() {
  const sec = document.getElementById('momentos');
  if (!sec) return;
  const fotos = [...sec.querySelectorAll('.momento-foto')];
  const textos = [...sec.querySelectorAll('.momento-texto')];
  const sellos = [...sec.querySelectorAll('.momento-sello')];
  const marcas = [...sec.querySelectorAll('.momento-marca')];
  const folio = document.getElementById('momentoFolio');
  const N = Math.min(textos.length, 4);
  if (!N) return;
  let actual = -1;

  const activar = i => {
    if (i === actual) return;
    actual = i;
    fotos.forEach((f, k) => f.classList.toggle('is-on', k === i));
    textos.forEach((t, k) => t.classList.toggle('is-on', k === i));
    sellos.forEach((s, k) => {
      s.classList.remove('is-on');
      if (k === i) { void s.getBoundingClientRect(); s.classList.add('is-on'); }
    });
    marcas.forEach((m, k) => {
      m.classList.toggle('is-on', k === i);
      if (k === i) m.setAttribute('aria-current', 'step'); else m.removeAttribute('aria-current');
    });
    if (folio) folio.textContent = String(i + 1).padStart(2, '0');
  };

  const progreso = () => {
    const total = sec.offsetHeight - window.innerHeight;
    return total > 0 ? clamp01(-sec.getBoundingClientRect().top / total) : 0;
  };

  const pintar = () => {
    const p = progreso();
    const i = Math.min(N - 1, Math.floor(p * N * 0.9999));
    activar(i);
    const local = clamp01(p * N - i);
    if (!reduceMotion) fotos[i]?.style.setProperty('--zoom', (1.08 - local * 0.08).toFixed(4));
    marcas.forEach((m, k) => m.style.setProperty('--fill', k < i ? '1' : k === i ? local.toFixed(3) : '0'));
  };

  let pendiente = false;
  const pedir = () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(() => { pendiente = false; pintar(); });
  };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', pintar);

  marcas.forEach(m => m.addEventListener('click', () => {
    const k = Number(m.dataset.ir);
    const total = sec.offsetHeight - window.innerHeight;
    const top = sec.getBoundingClientRect().top + window.scrollY + total * ((k + 0.5) / N);
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }));

  pintar();
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
  const selloSocios = document.querySelector('.sello-socios');
  if (selloSocios) {
    gsap.fromTo(selloSocios, { y: 40, rotation: -22 }, {
      y: -30, rotation: -4, ease: 'none',
      scrollTrigger: { trigger: '.socios', start: 'top bottom', end: 'bottom top', scrub: .6 },
    });
  }
  const selloCierre = document.getElementById('selloCierre');
  if (selloCierre) {
    gsap.fromTo(selloCierre, { rotation: -28 }, {
      rotation: -6, ease: 'none',
      scrollTrigger: { trigger: '.cierre', start: 'top bottom', end: 'bottom 40%', scrub: .6 },
    });
  }
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const coords = [-34.4961022, -58.5210479];
  const crear = () => {
    const mapa = L.map(el, { scrollWheelZoom: false }).setView(coords, 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    const pin = L.divIcon({ className: 'mapa-pin', html: '<span></span>', iconSize: [34, 44], iconAnchor: [17, 42] });
    L.marker(coords, { icon: pin, title: 'Sede central de la Mutual DICOM', alt: 'Sede central de la Mutual DICOM' }).addTo(mapa);
  };
  if (!('IntersectionObserver' in window)) { crear(); return; }
  const io = new IntersectionObserver(entries => {
    if (entries.some(en => en.isIntersecting)) { io.disconnect(); crear(); }
  }, { rootMargin: '400px 0px' });
  io.observe(el);
}

function initForm() {
  const form = document.getElementById('formConsulta');
  if (!form) return;
  const tel = form.querySelector('#f-tel');
  const mask = tel && typeof IMask !== 'undefined' ? IMask(tel, { mask: /^[0-9 -]{0,15}$/ }) : null;
  const campos = [
    { el: form.querySelector('#f-nombre'), err: form.querySelector('#e-nombre'), ok: v => v.trim().length >= 3 },
    { el: tel, err: form.querySelector('#e-tel'), ok: v => v.replace(/\D/g, '').length >= 10 },
    { el: form.querySelector('#f-tema'), err: form.querySelector('#e-tema'), ok: v => v !== '' },
  ].filter(c => c.el);
  const validar = c => {
    const ok = c.ok(c.el.value);
    c.el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (c.err) c.err.hidden = ok;
    return ok;
  };
  campos.forEach(c => {
    c.el.addEventListener('blur', () => { if (c.el.value) validar(c); });
    c.el.addEventListener('input', () => { if (c.el.getAttribute('aria-invalid') === 'true') validar(c); });
    c.el.addEventListener('change', () => { if (c.el.getAttribute('aria-invalid') === 'true') validar(c); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const resultados = campos.map(validar);
    if (resultados.includes(false)) {
      campos.find(c => c.el.getAttribute('aria-invalid') === 'true')?.el.focus();
      return;
    }
    const btn = form.querySelector('.form-enviar');
    const texto = btn?.textContent;
    if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }
    window.setTimeout(() => {
      if (btn) { btn.disabled = false; btn.textContent = texto; }
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      mask?.updateValue();
      campos.forEach(c => { c.el.removeAttribute('aria-invalid'); if (c.err) c.err.hidden = true; });
    }, 800);
  });
}

function initColorSwitch() {
  const btn = document.getElementById('color-switch');
  const backdrop = document.getElementById('palette-panel-backdrop');
  const closeBtn = document.getElementById('palette-panel-close');
  const grid = document.getElementById('palette-grid');
  if (!btn || !backdrop || !grid || !PALETAS?.length) return;
  const KEY = 'asociacionmutualdelpersonaldeldicom_paleta';

  const aplicar = (paleta, guardar = true) => {
    const root = document.documentElement.style;
    Object.entries(paleta.vars).forEach(([prop, val]) => root.setProperty(prop, val));
    grid.querySelectorAll('.paleta-swatch').forEach(sw => sw.classList.toggle('activa', sw.dataset.nombre === paleta.nombre));
    if (guardar) { try { localStorage.setItem(KEY, JSON.stringify(paleta)); } catch { return; } }
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
    window.__gkySendPaleta?.({ slug: gkySlugify(slugUrl), negocio, paletaNombre: elegida.nombre, paletaVars: elegida.vars, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la paleta en Firestore:', err));
    window.setTimeout(() => {
      sendBtn.disabled = false; sendBtn.textContent = 'Enviar estos colores';
      if (typeof showToast === 'function') showToast('¡Listo! Le avisamos a Gokywebs.'); else window.alert('¡Listo! Le avisamos a Gokywebs.');
    }, 700);
  });
}

initWspLinks();
initNav();
initWspFloat();
initHero();
initServiciosPreview();
initMomentos();
initLeeScroll();
initParallax();
initMapa();
initForm();
initColorSwitch();
initReveals();
