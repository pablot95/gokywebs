const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WHATSAPP_NUMBER = '5491171407463';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
const wspHref = msg => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

const GKY_SLUG_ACENTOS = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u' };
function gkySlugify(s) {
  return String(s || '').toLowerCase()
    .replace(/[áéíóúñü]/g, c => GKY_SLUG_ACENTOS[c] || c)
    .replace(/[^a-z0-9]/g, '');
}

const PALETAS = [
  { nombre: 'Original', vars: { '--color-bg': '#FFFFFF', '--color-bg-alt': '#F3F5F9', '--color-text': '#0E1726', '--color-text-muted': '#475467', '--color-primary': '#2563EB', '--color-secondary': '#C9C9C9', '--color-cta': '#2563EB', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Cálida', vars: { '--color-bg': '#FFFFFF', '--color-bg-alt': '#F4F4F5', '--color-text': '#18181B', '--color-text-muted': '#52525B', '--color-primary': '#C2410C', '--color-secondary': '#D4D4D8', '--color-cta': '#C2410C', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Fría', vars: { '--color-bg': '#FBFCFC', '--color-bg-alt': '#EDF2F1', '--color-text': '#0F201D', '--color-text-muted': '#4A5B57', '--color-primary': '#0F766E', '--color-secondary': '#C3CDCA', '--color-cta': '#0F766E', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Contraste', vars: { '--color-bg': '#FFFFFF', '--color-bg-alt': '#F1F3F7', '--color-text': '#05070D', '--color-text-muted': '#3D4452', '--color-primary': '#1D4ED8', '--color-secondary': '#9CA3AF', '--color-cta': '#1D4ED8', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Suave', vars: { '--color-bg': '#FAFBFD', '--color-bg-alt': '#EEF2F8', '--color-text': '#1F2A3D', '--color-text-muted': '#55627A', '--color-primary': '#3564C8', '--color-secondary': '#D5DAE3', '--color-cta': '#3564C8', '--color-cta-text': '#FFFFFF' } },
];

const DIAS_SEMANA = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function estadoAtencion(fecha = new Date()) {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(fecha);
  const dato = tipo => partes.find(p => p.type === tipo)?.value;
  const dia = DIAS_SEMANA[dato('weekday')] ?? fecha.getDay();
  const minutos = Number(dato('hour')) * 60 + Number(dato('minute'));
  const habil = dia >= 1 && dia <= 6;
  const abierto = habil && minutos >= 7 * 60 && minutos < 18 * 60;
  let texto;
  if (abierto) texto = 'Abierto ahora · <b>hasta las 18 hs</b>';
  else if (habil && minutos < 7 * 60) texto = 'Cerrado · <b>abrimos hoy a las 7</b>';
  else if (dia === 6 || dia === 0) texto = 'Cerrado · <b>abrimos el lunes a las 7</b>';
  else texto = 'Cerrado · <b>abrimos mañana a las 7</b>';
  return { dia, abierto, texto };
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

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => { a.href = wspHref(a.dataset.wspMsg); });
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initReveals() {
  const items = [...document.querySelectorAll('[data-animate]')].filter(el => !el.closest('.hero'));
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
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const items = [...hero.querySelectorAll('[data-animate]')];
  const mostrar = () => items.forEach(el => el.classList.add('in'));
  if (reduceMotion) { mostrar(); return; }
  const orden = ['.hero-foto', '.hero-hoja .eyebrow', '.hero-title', '.hero-lead', '.hero-ctas', '.hero-horario', '.ficha'];
  orden.forEach((sel, i) => {
    const el = hero.querySelector(sel);
    if (el) el.style.transitionDelay = `${(0.06 + i * 0.1).toFixed(2)}s`;
  });
  setTimeout(mostrar, 60);
  window.addEventListener('load', mostrar);
}

function initHeroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const capas = [[hero.querySelector('.ficha-cuerpo'), 10], [hero.querySelector('.hero-marca'), -6]].filter(([el]) => el);
  let tx = 0;
  let ty = 0;
  let pedido = false;
  const pintar = () => {
    pedido = false;
    capas.forEach(([el, d]) => { el.style.transform = `translate3d(${(tx * d).toFixed(2)}px, ${(ty * d).toFixed(2)}px, 0)`; });
  };
  const pedir = () => { if (!pedido) { pedido = true; requestAnimationFrame(pintar); } };
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width - .5;
    ty = (e.clientY - r.top) / r.height - .5;
    pedir();
  });
  hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; pedir(); });
}

function initEstadoVivo() {
  const els = document.querySelectorAll('[data-estado-vivo]');
  const filas = document.querySelectorAll('.horario-tabla tr[data-dia]');
  if (!els.length && !filas.length) return;
  const actualizar = () => {
    const estado = estadoAtencion();
    els.forEach(el => {
      el.classList.toggle('is-abierto', estado.abierto);
      const txt = el.querySelector('.estado-vivo-txt');
      if (txt) txt.innerHTML = estado.texto;
    });
    filas.forEach(tr => tr.classList.toggle('is-hoy', Number(tr.dataset.dia) === estado.dia));
  };
  actualizar();
  window.setInterval(actualizar, 60000);
}

function initCapitulos() {
  const sec = document.querySelector('.capitulos');
  if (!sec) return;
  const textos = [...sec.querySelectorAll('.texto')];
  const shots = [...sec.querySelectorAll('.shot')];
  const marcas = [...sec.querySelectorAll('.marca')];
  const numEl = document.getElementById('capNum');
  const labelEl = document.getElementById('capDatoLabel');
  const valorEl = document.getElementById('capDatoValor');
  if (!textos.length) return;
  const N = Math.min(textos.length, 4);
  let actual = -1;

  const activar = i => {
    if (i === actual) return;
    const primera = actual === -1;
    actual = i;
    textos.forEach((t, n) => t.classList.toggle('is-on', n === i));
    shots.forEach((s, n) => s.classList.toggle('is-on', n === i));
    marcas.forEach((m, n) => {
      m.classList.toggle('is-on', n === i);
      m.classList.toggle('is-pasada', n < i);
      m.setAttribute('aria-pressed', String(n === i));
    });
    if (numEl) numEl.textContent = String(i + 1).padStart(2, '0');
    const t = textos[i];
    if (labelEl) labelEl.textContent = t.dataset.label || '';
    if (valorEl) {
      valorEl.textContent = t.dataset.valor || '';
      if (!primera && !reduceMotion) {
        valorEl.classList.remove('cambia');
        void valorEl.offsetWidth;
        valorEl.classList.add('cambia');
      }
    }
  };

  if (reduceMotion) {
    activar(0);
    return;
  }

  const progreso = () => {
    const r = sec.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    return total > 0 ? clamp01(-r.top / total) : 0;
  };

  const calcular = () => {
    const p = progreso();
    const i = Math.min(N - 1, Math.floor(p * N * 0.9999));
    activar(i);
    const local = clamp01(p * N - i);
    const img = shots[i]?.querySelector('img');
    if (img) img.style.transform = `scale(${(1.07 - local * 0.07).toFixed(4)})`;
  };

  marcas.forEach((m, n) => m.addEventListener('click', () => {
    const top = window.scrollY + sec.getBoundingClientRect().top;
    const total = sec.offsetHeight - window.innerHeight;
    window.scrollTo({ top: Math.round(top + total * ((n + 0.5) / N)), behavior: 'smooth' });
  }));

  let pedido = false;
  const pedir = () => {
    if (pedido) return;
    pedido = true;
    requestAnimationFrame(() => { pedido = false; calcular(); });
  };
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

function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const tel = form.querySelector('#f-tel');
  const mask = window.IMask && tel ? window.IMask(tel, {
    mask: [
      { mask: '+{54} 9 (00) 0000-0000' },
      { mask: '+{54} 9 (000) 000-0000' },
      { mask: '+{54} 9 (0000) 00-0000' },
    ],
  }) : null;

  const campos = [
    { el: form.querySelector('#f-nombre'), ok: v => v.trim().length >= 2 },
    { el: tel, ok: v => { const d = (mask ? mask.unmaskedValue : v).replace(/\D/g, ''); return mask ? d.length >= 12 : d.length >= 10; } },
    { el: form.querySelector('#f-unidades'), ok: v => v !== '' },
    { el: form.querySelector('#f-servicio'), ok: v => v !== '' },
    { el: form.querySelector('#f-msg'), ok: v => v.trim().length >= 10 },
  ].filter(c => c.el);

  const marcar = (c, valido) => {
    c.el.setAttribute('aria-invalid', valido ? 'false' : 'true');
    const err = document.getElementById(`${c.el.id}-error`);
    if (err) err.hidden = valido;
  };

  campos.forEach(c => {
    c.el.addEventListener('blur', () => { if (c.el.value) marcar(c, c.ok(c.el.value)); });
    c.el.addEventListener('input', () => { if (c.el.getAttribute('aria-invalid') === 'true' && c.ok(c.el.value)) marcar(c, true); });
    c.el.addEventListener('change', () => { if (c.el.getAttribute('aria-invalid') === 'true' && c.ok(c.el.value)) marcar(c, true); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let primero = null;
    campos.forEach(c => {
      const valido = c.ok(c.el.value);
      marcar(c, valido);
      if (!valido && !primero) primero = c.el;
    });
    if (primero) {
      primero.focus();
      primero.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      return;
    }
    const btn = form.querySelector('.form-submit');
    const texto = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = texto;
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      mask?.updateValue();
      campos.forEach(c => c.el.removeAttribute('aria-invalid'));
    }, 800);
  });
}

function initColorSwitch() {
  const btn = document.getElementById('color-switch');
  const backdrop = document.getElementById('palette-panel-backdrop');
  const closeBtn = document.getElementById('palette-panel-close');
  const grid = document.getElementById('palette-grid');
  if (!btn || !backdrop || !grid || !PALETAS?.length) return;
  const KEY = 'bernalfleetconsulting_paleta';

  const aplicar = (paleta, guardar = true) => {
    const root = document.documentElement.style;
    Object.entries(paleta.vars).forEach(([prop, val]) => root.setProperty(prop, val));
    grid.querySelectorAll('.paleta-swatch').forEach(sw => sw.classList.toggle('activa', sw.dataset.nombre === paleta.nombre));
    if (guardar) { try { localStorage.setItem(KEY, JSON.stringify(paleta)); } catch { grid.dataset.sinGuardar = '1'; } }
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
    setTimeout(() => {
      sendBtn.disabled = false; sendBtn.textContent = 'Enviar estos colores';
      showToast('¡Listo! Le avisamos a Gokywebs.');
    }, 700);
  });
}

initWspLinks();
initNav();
initWspFloat();
initEstadoVivo();
initHero();
initHeroParallax();
initCapitulos();
initReveals();
initLeeScroll();
initForm();
initColorSwitch();
