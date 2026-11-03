document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA_NUM = '5492966227675';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

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

let revealsListos = false;
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
}

function initReveals() {
  revealsListos = true;
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

function initTabs() {
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  const head = document.querySelector('.servicios-head');
  if (!tabs.length) return;
  const activar = (id, foco) => {
    const tab = tabs.find(t => t.id === id);
    if (!tab) return;
    tabs.forEach(t => {
      const sel = t === tab;
      t.setAttribute('aria-selected', sel ? 'true' : 'false');
      t.tabIndex = sel ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !sel;
    });
    if (foco) tab.focus();
    revelarNuevos(document.getElementById(tab.getAttribute('aria-controls')));
    refrescar();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t.id, false));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j === null) return;
      e.preventDefault();
      activar(tabs[j].id, true);
    });
  });
  document.querySelectorAll('a[data-tab]').forEach(a => a.addEventListener('click', e => {
    const id = a.dataset.tab;
    if (!tabs.some(t => t.id === id)) return;
    e.preventDefault();
    activar(id, false);
    (head || tabs[0]).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }));
}

const HORARIOS = { 0: [], 1: [[9, 13], [16, 20]], 2: [[9, 13], [16, 20]], 3: [[9, 13], [16, 20]], 4: [[9, 13], [16, 20]], 5: [[9, 13], [16, 20]], 6: [[10, 13]] };
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

function ahoraArgentina() {
  const d = new Date(Date.now() - 3 * 3600 * 1000);
  return { dia: d.getUTCDay(), min: d.getUTCHours() * 60 + d.getUTCMinutes() };
}

function estadoHorario() {
  const { dia, min } = ahoraArgentina();
  const abierto = HORARIOS[dia].some(([a, b]) => min >= a * 60 && min < b * 60);
  if (abierto) return { abierto, texto: 'Ahora: atendiendo consultas' };
  for (let k = 0; k < 8; k++) {
    const dd = (dia + k) % 7;
    const prox = HORARIOS[dd].find(([a]) => k > 0 || a * 60 > min);
    if (prox) {
      const cuando = k === 0 ? 'hoy' : k === 1 ? 'mañana' : `el ${DIAS[dd]}`;
      return { abierto, texto: `Fuera de horario · Respondo ${cuando} desde las ${prox[0]} h` };
    }
  }
  return { abierto, texto: 'Consultas por WhatsApp' };
}

function initHorario() {
  const estados = document.querySelectorAll('[data-estado]');
  if (!estados.length) return;
  const pintar = () => {
    const { dia } = ahoraArgentina();
    document.querySelectorAll('tr[data-dia]').forEach(tr => {
      const hoy = tr.dataset.dia === String(dia);
      tr.classList.toggle('hoy', hoy);
      const th = tr.querySelector('th');
      const badge = th?.querySelector('.hoy-badge');
      if (hoy && !badge && th) th.insertAdjacentHTML('beforeend', '<span class="hoy-badge">Hoy</span>');
      if (!hoy && badge) badge.remove();
    });
    const est = estadoHorario();
    estados.forEach(el => {
      el.classList.toggle('abierto', est.abierto);
      const t = el.querySelector('[data-estado-txt]');
      if (t) t.textContent = est.texto;
    });
  };
  pintar();
  setInterval(pintar, 60000);
}

const MOTIVOS = {
  familiar: 'por un acompañamiento para un familiar mayor',
  duelo: 'por el espacio de acompañamiento en el duelo',
  charla: 'para saber cuándo es la próxima charla o taller',
  otra: 'para hacerte una consulta',
};

function initConsulta() {
  const box = document.querySelector('[data-consulta]');
  if (!box) return;
  const preview = box.querySelector('[data-preview]');
  const enviar = box.querySelector('[data-enviar]');
  const error = box.querySelector('[data-error]');
  const grupo = box.querySelector('[data-grupo-para]');
  const nombre = box.querySelector('input[name="nombre"]');
  const mensaje = box.querySelector('textarea[name="mensaje"]');
  if (!preview || !enviar) return;
  const armar = () => {
    const para = box.querySelector('input[name="para"]:checked')?.value || '';
    const dia = box.querySelector('input[name="dia"]:checked')?.value || '';
    const n = (nombre?.value || '').trim().replace(/\s+/g, ' ');
    const m = (mensaje?.value || '').trim().replace(/\s+/g, ' ');
    let txt = '¡Hola Giuli!';
    if (n) txt += ` Soy ${n}.`;
    txt += ` Te escribo ${MOTIVOS[para] || MOTIVOS.otra}.`;
    if (dia === 'cualquiera') txt += ' Cualquier día me queda bien.';
    else if (dia) txt += ` Me queda mejor el ${dia}.`;
    if (m) txt += ` ${m}`;
    preview.textContent = txt;
    enviar.href = `https://wa.me/${WA_NUM}?text=${encodeURIComponent(txt)}`;
    return para;
  };
  box.addEventListener('change', e => {
    if (e.target.name === 'para' && error) { error.hidden = true; grupo?.classList.remove('error'); refrescar(); }
    armar();
  });
  box.addEventListener('input', armar);
  enviar.addEventListener('click', e => {
    const para = armar();
    if (para) { showToast('Abrimos WhatsApp con tu mensaje listo para enviar.'); return; }
    e.preventDefault();
    if (error) error.hidden = false;
    grupo?.classList.add('error');
    box.querySelector('input[name="para"]')?.focus();
    showToast('Elegí para quién es la consulta y armamos el mensaje.');
    refrescar();
  });
  armar();
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

function initFaq() {
  document.querySelectorAll('.faq-item').forEach(d => d.addEventListener('toggle', refrescar));
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.08, duration: 1.8, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(8px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('h1 .raya'), document.body.classList.contains('m2') ? { scaleX: 0, transformOrigin: '50% 50%', duration: 1, clearProps: 'transform' } : { scaleY: 0, transformOrigin: '50% 0%', duration: 1, clearProps: 'transform' }, 0.35)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .foto-nota'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7);
}

initTabs();
initReveals();
initNav();
initModelBarScroll();
initWspFloat();
initHorario();
initConsulta();
initFaq();
initLeeScroll();
initHeroMotion();
