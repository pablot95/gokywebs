const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA = '5491165561769';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const ICO_CHECK = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

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

function initScrollbarVar() {
  const set = () => document.documentElement.style.setProperty('--sbw', `${Math.max(0, window.innerWidth - document.documentElement.clientWidth)}px`);
  set();
  window.addEventListener('resize', set, { passive: true });
}

function initFloats() {
  const stack = document.getElementById('floats');
  if (!stack) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) stack.classList.add('visible'); else stack.classList.remove('visible');
  }, { passive: true });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 900px)');
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
  const paso = (sel, vars, pos) => {
    const els = hero.querySelectorAll(sel);
    if (els.length) tl.from(els, vars, pos);
  };
  paso('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  paso('.hero-card', { y: 24, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0);
  paso('.hero-marca', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.15);
  paso('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero-badge, .estado--hero', { y: 16, scale: 0.94, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  const media = document.querySelector('.hero-full .hero-media');
  if (!media) return;
  gsap.to(media, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.hero-full', start: 'top top', end: 'bottom top', scrub: true } });
}

function estadoAhora() {
  const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const valor = t => partes.find(p => p.type === t)?.value;
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(valor('weekday'));
  const min = parseInt(valor('hour'), 10) * 60 + parseInt(valor('minute'), 10);
  const atiendeHoy = dia >= 1 && dia <= 6;
  if (atiendeHoy && min >= 420 && min < 1290) return { abierto: true, texto: 'Atendiendo ahora · hasta las 21:30' };
  if (atiendeHoy && min < 420) return { abierto: false, texto: 'Abrimos hoy a las 07:00' };
  return { abierto: false, texto: dia === 6 ? 'Abrimos el lunes a las 07:00' : 'Abrimos mañana a las 07:00' };
}

function initEstado() {
  const els = document.querySelectorAll('[data-estado]');
  if (!els.length) return;
  const pintar = () => {
    let e;
    try { e = estadoAhora(); } catch { return; }
    els.forEach(el => {
      el.textContent = e.texto;
      el.closest('.estado')?.classList.toggle('is-open', e.abierto);
    });
  };
  pintar();
  window.setInterval(pintar, 60000);
}

function initTabs() {
  const list = document.querySelector('[role="tablist"]');
  if (!list) return;
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !on;
      if (on && !reduceMotion) { panel.classList.remove('enfoca'); void panel.offsetWidth; panel.classList.add('enfoca'); }
    });
    if (foco) tab.focus();
    if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: Math.max(0, tab.offsetLeft - 16), behavior: reduceMotion ? 'auto' : 'smooth' });
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); activar(tabs[j], true); }
    });
  });
  document.querySelectorAll('[data-tab]').forEach(a => a.addEventListener('click', e => {
    const tab = document.getElementById(`tab-${a.dataset.tab}`);
    if (!tab) return;
    e.preventDefault();
    activar(tab);
    document.getElementById('servicios')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }));
}

const normalizar = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

function initCobertura() {
  const form = document.getElementById('cobForm');
  const input = document.getElementById('cobQ');
  const msg = document.getElementById('cobMsg');
  const cta = document.getElementById('cobCta');
  if (!form || !input || !msg || !cta) return;
  const lugares = [];
  document.querySelectorAll('.partidos [data-partido]').forEach(li => {
    const partido = li.dataset.partido;
    lugares.push({ nombre: partido, partido, el: li });
    (li.querySelector('span')?.textContent || '').split('·').forEach(t => {
      const nombre = t.trim();
      if (nombre && nombre !== partido) lugares.push({ nombre, partido, el: li });
    });
  });
  document.querySelectorAll('.barrios li').forEach(li => lugares.push({ nombre: li.textContent.trim(), partido: 'CABA', el: li }));
  ['CABA', 'Capital Federal', 'Capital', 'Ciudad de Buenos Aires'].forEach(nombre => lugares.push({ nombre, partido: 'CABA', el: null, ciudad: true }));
  lugares.forEach(l => { l.n = normalizar(l.nombre); });

  const inicial = msg.innerHTML;
  const hrefInicial = cta.getAttribute('href');
  const icoPin = msg.querySelector('svg')?.outerHTML || '';
  let marcados = [];
  const marcar = els => {
    marcados.forEach(e => e.classList.remove('match'));
    marcados = els.filter(Boolean);
    marcados.forEach(e => e.classList.add('match'));
  };
  const linkWa = texto => `https://wa.me/${WA}?text=${encodeURIComponent(texto)}`;

  const buscar = () => {
    const q = normalizar(input.value);
    if (q.length < 3) {
      msg.className = 'cob-msg';
      msg.innerHTML = inicial;
      cta.setAttribute('href', hrefInicial);
      marcar([]);
      return;
    }
    const hallado = lugares.find(l => l.n === q)
      || lugares.find(l => l.n.startsWith(q))
      || lugares.find(l => l.n.split(' ').some(p => p.startsWith(q)))
      || lugares.find(l => l.n.length >= 4 && q.includes(l.n));
    if (hallado) {
      const donde = hallado.ciudad ? 'la Ciudad de Buenos Aires'
        : hallado.partido === 'CABA' ? `${hallado.nombre}, CABA`
        : hallado.nombre === hallado.partido ? `${hallado.nombre}, Zona Norte`
        : `${hallado.nombre}, ${hallado.partido}`;
      msg.className = 'cob-msg ok';
      msg.innerHTML = `${ICO_CHECK}<span>Sí, llegamos a <strong>${esc(donde)}</strong>. Escribinos y coordinamos la visita.</span>`;
      cta.setAttribute('href', linkWa(`Hola ServiMax, necesito un técnico a domicilio. Estoy en ${donde}. Equipo y falla: `));
      marcar([hallado.el]);
    } else {
      const lugar = input.value.trim();
      msg.className = 'cob-msg no';
      msg.innerHTML = `${icoPin}<span>«${esc(lugar)}» no está en la lista, pero escribinos: te confirmamos si llegamos.</span>`;
      cta.setAttribute('href', linkWa(`Hola ServiMax, ¿llegan hasta ${lugar}? Necesito un técnico a domicilio.`));
      marcar([]);
    }
  };
  input.addEventListener('input', buscar);
  form.addEventListener('submit', e => { e.preventDefault(); buscar(); input.blur(); });
}

function initConsulta() {
  const form = document.getElementById('consulta');
  if (!form) return;
  const campos = [...form.querySelectorAll('[required]')];
  const marcar = (campo, texto) => {
    const err = document.getElementById(`${campo.id}-error`);
    campo.setAttribute('aria-invalid', texto ? 'true' : 'false');
    if (err) { err.textContent = texto || ''; err.hidden = !texto; }
  };
  campos.forEach(c => c.addEventListener(c.tagName === 'SELECT' ? 'change' : 'input', () => { if (c.value.trim()) marcar(c, ''); }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    let primero = null;
    campos.forEach(c => {
      const ok = c.value.trim().length > 0;
      marcar(c, ok ? '' : c.dataset.error);
      if (!ok && !primero) primero = c;
    });
    if (primero) { primero.focus(); showToast('Nos falta un dato para armar el mensaje.'); return; }
    const marca = form.elements.marca.value.trim();
    const texto = `Hola ServiMax, quiero pedir una visita.\nEquipo: ${form.elements.equipo.value}${marca ? `\nMarca: ${marca}` : ''}\nZona: ${form.elements.zona.value.trim()}\nQué le pasa: ${form.elements.falla.value.trim()}`;
    window.medirContacto?.('whatsapp', 'formulario');
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
    showToast('Listo: se abrió WhatsApp con tu consulta.');
  });
}

function initMedicion() {
  window.dataLayer = window.dataLayer || [];
  const CLAVE = 'servimax_origen';
  const params = new URLSearchParams(window.location.search);
  const origen = {};
  ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term'].forEach(k => {
    const v = params.get(k);
    if (v) origen[k] = v.slice(0, 200);
  });
  if (Object.keys(origen).length) {
    try { window.sessionStorage.setItem(CLAVE, JSON.stringify(origen)); } catch { window.__servimaxOrigen = origen; }
  }
  const origenGuardado = () => {
    try { return JSON.parse(window.sessionStorage.getItem(CLAVE)) || window.__servimaxOrigen || {}; } catch { return window.__servimaxOrigen || {}; }
  };
  window.medirContacto = (canal, ubicacion) => {
    window.dataLayer.push({ event: canal === 'llamada' ? 'contacto_llamada' : 'contacto_whatsapp', canal, ubicacion, pagina: document.body.className, ...origenGuardado() });
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="https://wa.me/"], a[href^="tel:"]');
    if (!a) return;
    const zona = a.closest('[id]:not(#mainNav)');
    const ubicacion = a.closest('.site-header') ? 'header' : a.closest('.site-footer') ? 'footer' : (zona?.id || 'sitio');
    window.medirContacto(a.getAttribute('href').startsWith('tel:') ? 'llamada' : 'whatsapp', ubicacion);
  });
}

function initFaq() {
  document.querySelectorAll('.faq-item').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

initScrollbarVar();
initMedicion();
initReveals();
initHeroMotion();
initParallax();
initNav();
initModelBarScroll();
initFloats();
initEstado();
initTabs();
initCobertura();
initConsulta();
initFaq();
