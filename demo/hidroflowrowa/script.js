const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491150607699';
const ZONA_AR = 'America/Argentina/Buenos_Aires';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-reloj'), { y: 14, opacity: 0, duration: 0.8 }, 0.78)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.65)
    .from(hero.querySelectorAll('.datos li'), { y: 24, opacity: 0, duration: 0.9, stagger: 0.1, clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const img = document.querySelector('.hero [data-hero-img]');
  if (!img) return;
  gsap.fromTo(img, { yPercent: -3 }, {
    yPercent: 3, ease: 'none',
    scrollTrigger: { trigger: img.closest('.hero'), start: 'top top', end: 'bottom top', scrub: true },
  });
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

function ahoraArgentina() {
  const partes = new Intl.DateTimeFormat('es-AR', { timeZone: ZONA_AR, hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'long' }).formatToParts(new Date());
  const get = t => partes.find(p => p.type === t)?.value || '';
  return { hora: get('hour'), minuto: get('minute'), dia: get('weekday').toLowerCase() };
}

function initReloj() {
  const els = document.querySelectorAll('[data-reloj]');
  const filas = document.querySelectorAll('[data-dia]');
  if (!els.length && !filas.length) return;
  const pintar = () => {
    let a;
    try { a = ahoraArgentina(); } catch { return; }
    if (!a.hora) return;
    const texto = `${a.hora === '01' ? 'Es la' : 'Son las'} ${a.hora}:${a.minuto} y estamos atendiendo.`;
    els.forEach(el => { el.textContent = texto; });
    filas.forEach(li => li.classList.toggle('hoy', li.dataset.dia === a.dia));
  };
  pintar();
  window.setInterval(pintar, 20000);
}

function initFaq() {
  document.querySelectorAll('.faq-item').forEach(d => d.addEventListener('toggle', refrescar));
}

function initTabs() {
  const lista = document.querySelector('[role="tablist"]');
  if (!lista) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const angosto = window.matchMedia('(max-width: 860px)');
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const sel = t === tab;
      t.setAttribute('aria-selected', sel ? 'true' : 'false');
      t.tabIndex = sel ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !sel;
      if (sel) { panel.classList.remove('entra'); void panel.offsetWidth; panel.classList.add('entra'); }
    });
    if (foco) tab.focus({ preventScroll: true });
    if (angosto.matches) lista.scrollTo({ left: tab.offsetLeft - parseFloat(window.getComputedStyle(lista).paddingLeft || 0), behavior: reduceMotion ? 'auto' : 'smooth' });
    refrescar();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t, false));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j === null) return;
      e.preventDefault();
      activar(tabs[j], true);
    });
  });
}

function initVisita() {
  const form = document.getElementById('visita');
  if (!form) return;
  const zona = form.querySelector('#v-zona');
  const err = form.querySelector('#v-zona-error');
  const previa = form.querySelector('[data-previa]');
  const btn = form.querySelector('button[type="submit"]');
  const btnTxt = form.querySelector('[data-btn-txt]');
  const armar = () => {
    const tipo = form.querySelector('input[name="tipo"]:checked')?.value || 'otra';
    const marca = form.querySelector('input[name="marca"]:checked')?.value || 'nose';
    const motivo = form.querySelector('#v-motivo')?.value || 'Otro problema';
    const z = zona?.value.trim() || '';
    const nombre = form.querySelector('#v-nombre')?.value.trim() || '';
    let bomba = tipo === 'otra' ? 'una bomba de agua' : `una bomba ${tipo}`;
    if (marca === 'Rowa') bomba += ' Rowa';
    else if (marca === 'otra') bomba += ' de otra marca';
    const lineas = [`Hola Hidroflow Rowa, necesito servicio técnico para ${bomba}.`, `Motivo: ${motivo}.`];
    if (z) lineas.push(`Zona: ${z}.`);
    if (nombre) lineas.push(`Soy ${nombre}.`);
    return lineas.join('\n');
  };
  const pintar = () => { if (previa) previa.textContent = armar(); };
  const valida = () => (zona?.value.trim().length || 0) >= 2;
  form.addEventListener('input', pintar);
  form.addEventListener('change', pintar);
  zona?.addEventListener('input', () => {
    if (valida()) { zona.removeAttribute('aria-invalid'); if (err) err.hidden = true; }
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!valida()) {
      zona?.setAttribute('aria-invalid', 'true');
      if (err) err.hidden = false;
      zona?.focus();
      refrescar();
      return;
    }
    const a = document.createElement('a');
    a.href = `https://wa.me/${WSP}?text=${encodeURIComponent(armar())}`;
    a.target = '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (btn) btn.disabled = true;
    if (btnTxt) btnTxt.textContent = 'Abriendo WhatsApp…';
    showToast('Listo: te abrimos WhatsApp con tu consulta armada.');
    setTimeout(() => {
      if (btn) btn.disabled = false;
      if (btnTxt) btnTxt.textContent = 'Enviar por WhatsApp';
      form.reset();
      pintar();
    }, 900);
  });
  pintar();
}

initModelBarScroll();
initNav();
initWspFloat();
initReloj();
initTabs();
initVisita();
initFaq();
initLeeScroll();
initReveals();
initHeroMotion();
initParallax();
