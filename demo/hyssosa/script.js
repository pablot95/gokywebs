const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491133905301';

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

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

function wspLink(msg) {
  return `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
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

function tabsTeclado(tabs, activar) {
  tabs.forEach((tab, i) => {
    tab.addEventListener('keydown', e => {
      const mapa = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(e.key in mapa)) return;
      e.preventDefault();
      const j = (mapa[e.key] + tabs.length) % tabs.length;
      activar(tabs[j], true);
      tabs[j].focus();
    });
  });
}

function initMediciones() {
  const md = document.querySelector('[data-md]');
  if (!md) return;
  const tabs = [...md.querySelectorAll('[role="tab"]')];
  const activar = (tab, animar) => {
    if (tab.getAttribute('aria-selected') === 'true') return;
    tabs.forEach(t => {
      const sel = t === tab;
      t.setAttribute('aria-selected', sel ? 'true' : 'false');
      t.tabIndex = sel ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !sel;
      panel.classList.remove('is-entrando');
      if (sel && animar && !reduceMotion) { void panel.offsetWidth; panel.classList.add('is-entrando'); }
    });
    if (window.matchMedia('(max-width: 900px)').matches) tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach(t => t.addEventListener('click', () => activar(t, true)));
  tabsTeclado(tabs, activar);
}

function initTabs() {
  const cont = document.querySelector('[data-tabs]');
  if (!cont) return;
  const tabs = [...cont.querySelectorAll('[role="tab"]')];
  const activar = (tab, animar) => {
    tabs.forEach(t => {
      const sel = t === tab;
      t.setAttribute('aria-selected', sel ? 'true' : 'false');
      t.tabIndex = sel ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !sel;
      panel.classList.remove('is-entrando');
      if (sel) {
        if (animar && !reduceMotion) { void panel.offsetWidth; panel.classList.add('is-entrando'); }
        revelarNuevos(panel);
      }
    });
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach(t => t.addEventListener('click', () => activar(t, true)));
  tabsTeclado(tabs, activar);
  const irAPanel = (id, animar) => {
    const tab = tabs.find(t => t.getAttribute('aria-controls') === id);
    if (!tab) return false;
    activar(tab, animar);
    cont.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    return true;
  };
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (id && irAPanel(id, true)) { e.preventDefault(); history.replaceState(null, '', `#${id}`); }
    });
  });
  const inicial = location.hash.slice(1);
  if (inicial) irAPanel(inicial, false);
}

function initLee() {
  const el = document.querySelector('[data-lee]');
  if (!el) return;
  const palabras = el.textContent.trim().split(/\s+/);
  el.innerHTML = palabras.map(p => `<span class="lee-p">${esc(p)}</span>`).join(' ');
  if (reduceMotion || typeof ScrollTrigger === 'undefined') { el.classList.add('lee-listo'); return; }
  const spans = [...el.querySelectorAll('.lee-p')];
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    end: 'bottom 45%',
    scrub: true,
    onUpdate(self) {
      const n = Math.round(self.progress * spans.length);
      spans.forEach((s, i) => s.classList.toggle('on', i < n));
    }
  });
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function initVencimientos() {
  const box = document.querySelector('[data-venc]');
  if (!box) return;
  const filas = [...box.querySelectorAll('[data-venc-fila]')];
  const lista = box.querySelector('[data-venc-res]');
  const resumen = box.querySelector('[data-venc-resumen]');
  const cta = box.querySelector('[data-venc-cta]');
  const hoy = new Date();
  const hoyIdx = hoy.getFullYear() * 12 + hoy.getMonth();
  const nombreMes = idx => `${MESES[idx % 12]} de ${Math.floor(idx / 12)}`;

  filas.forEach(f => {
    const anio = f.querySelector('[data-anio]');
    for (let y = hoy.getFullYear(); y >= hoy.getFullYear() - 6; y--) anio.insertAdjacentHTML('beforeend', `<option value="${y}">${y}</option>`);
  });

  const leer = f => {
    const nombre = f.dataset.nombre;
    const mes = f.querySelector('[data-mes]');
    const anio = f.querySelector('[data-anio]');
    const sin = f.querySelector('[data-sin]');
    mes.disabled = sin.checked;
    anio.disabled = sin.checked;
    if (sin.checked) return { nombre, estado: 'sin', etiqueta: 'A hacer', det: 'Sin medición registrada' };
    if (mes.value === '' || anio.value === '') return { nombre, estado: 'vacio', etiqueta: 'Sin cargar', det: 'Sin fecha cargada' };
    const idx = Number(anio.value) * 12 + Number(mes.value);
    if (idx > hoyIdx) return { nombre, estado: 'vacio', etiqueta: 'Revisar', det: 'Ese mes todavía no llegó' };
    const vence = idx + 12;
    const diff = vence - hoyIdx;
    if (diff < 0) return { nombre, estado: 'vencida', etiqueta: 'Vencida', det: `Venció en ${nombreMes(vence)}`, renovar: `venció en ${nombreMes(vence)}` };
    if (diff <= 2) return { nombre, estado: 'por-vencer', etiqueta: 'Por vencer', det: `Vence en ${nombreMes(vence)}`, renovar: `vence en ${nombreMes(vence)}` };
    return { nombre, estado: 'vigente', etiqueta: 'Vigente', det: `Vigente hasta ${nombreMes(vence)}` };
  };

  const pintar = () => {
    const datos = filas.map(leer);
    lista.innerHTML = datos.map(d => `<li><strong>${esc(d.nombre)}</strong><span class="estado estado--${d.estado}">${d.etiqueta}</span><span class="det">${esc(d.det)}</span></li>`).join('');
    const cargadas = datos.filter(d => d.estado !== 'vacio');
    const renovar = datos.filter(d => ['vencida', 'por-vencer', 'sin'].includes(d.estado));
    if (!cargadas.length) resumen.textContent = 'Cargá al menos una medición';
    else if (!renovar.length) resumen.textContent = 'Todo al día por ahora';
    else resumen.textContent = renovar.length === 1 ? '1 medición para renovar' : `${renovar.length} mediciones para renovar`;
    let msg;
    if (renovar.length) {
      msg = `Hola HyS SOSA, quiero coordinar estas mediciones:\n${renovar.map(d => `- ${d.nombre}: ${d.renovar || 'sin medición registrada'}`).join('\n')}`;
      cta.lastElementChild.textContent = 'Coordinar por WhatsApp';
    } else if (cargadas.length) {
      msg = `Hola HyS SOSA, quiero agendar las próximas mediciones:\n${cargadas.map(d => `- ${d.nombre}: ${d.det.toLowerCase()}`).join('\n')}`;
      cta.lastElementChild.textContent = 'Agendar las próximas';
    } else {
      msg = 'Hola HyS SOSA, quiero coordinar las mediciones de iluminación, ruido y puesta a tierra.';
      cta.lastElementChild.textContent = 'Consultar por WhatsApp';
    }
    cta.href = wspLink(msg);
  };

  box.addEventListener('change', pintar);
  pintar();
}

function initForm() {
  const form = document.querySelector('[data-form]');
  if (!form) return;
  const tel = form.querySelector('#f-tel');
  if (tel && typeof IMask !== 'undefined') IMask(tel, { mask: '+{54} 9 00 0000-0000' });
  const marcar = (input, msg) => {
    const err = document.getElementById(`${input.id}-error`);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) { err.textContent = msg; err.hidden = !msg; }
  };
  form.querySelectorAll('input, select, textarea').forEach(el => el.addEventListener('input', () => {
    if (el.getAttribute('aria-invalid') === 'true') marcar(el, '');
  }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = form.querySelector('#f-nombre');
    let ok = true;
    if (nombre.value.trim().length < 2) { marcar(nombre, 'Contanos tu nombre'); ok = false; } else marcar(nombre, '');
    if (tel.value.replace(/\D/g, '').length < 12) { marcar(tel, 'Falta el número completo, con el 11'); ok = false; } else marcar(tel, '');
    if (!ok) { form.querySelector('[aria-invalid="true"]')?.focus(); return; }
    const btn = form.querySelector('button[type="submit"]');
    const txt = btn.lastElementChild;
    const antes = txt.textContent;
    btn.disabled = true;
    txt.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      txt.textContent = antes;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
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
    .from(hero.querySelectorAll('.regla'), { scaleX: 0, transformOrigin: '0 50%', duration: 1, clearProps: 'transform' }, 0.4)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.indice li'), { x: -24, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7)
    .from(hero.querySelectorAll('.sello-anim'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.75);
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

initVencimientos();
initReveals();
initMediciones();
initTabs();
initLee();
initForm();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
