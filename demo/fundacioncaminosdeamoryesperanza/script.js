const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

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

let revealsListos = false;

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
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 1081px)');
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  paso('.hero-card', { y: 24, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.05);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.15);
  paso('h1', { y: 34, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.25);
  paso('.hero-lead', { y: 22, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.sello, .hero-badge', { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.12, clearProps: 'transform,opacity' }, 0.7);
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

function initTabs() {
  if (!document.body.classList.contains('m1')) return;
  const list = document.querySelector('.tabs[role="tablist"]');
  if (!list) return;
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
  const elegir = (idx, foco) => {
    tabs.forEach((t, i) => {
      const activa = i === idx;
      t.setAttribute('aria-selected', activa ? 'true' : 'false');
      t.tabIndex = activa ? 0 : -1;
      if (panels[i]) panels[i].hidden = !activa;
    });
    if (foco) tabs[idx].focus();
    revelarNuevos(panels[idx]);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => elegir(i, false));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); elegir(j, true); }
    });
  });
  panels.forEach((p, i) => { if (p) p.hidden = i !== 0; });
}

function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const nombre = form.querySelector('#f-nombre');
  const tel = form.querySelector('#f-tel');
  const btn = form.querySelector('button[type="submit"]');
  const marcar = (input, errId, mal) => {
    const err = document.getElementById(errId);
    input.setAttribute('aria-invalid', mal ? 'true' : 'false');
    if (mal) input.setAttribute('aria-describedby', errId); else input.removeAttribute('aria-describedby');
    if (err) err.hidden = !mal;
  };
  const telOk = v => {
    let d = v.replace(/\D/g, '');
    if (d.startsWith('549')) d = d.slice(3);
    else if (d.startsWith('54')) d = d.slice(2);
    if (d.startsWith('0')) d = d.slice(1);
    return d.length === 10;
  };
  [nombre, tel].forEach(input => input?.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') !== 'true') return;
    if (input === nombre) marcar(nombre, 'e-nombre', nombre.value.trim().length < 2);
    else marcar(tel, 'e-tel', !telOk(tel.value));
  }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const malNombre = nombre.value.trim().length < 2;
    const malTel = !telOk(tel.value);
    marcar(nombre, 'e-nombre', malNombre);
    marcar(tel, 'e-tel', malTel);
    if (malNombre || malTel) { (malNombre ? nombre : tel).focus(); return; }
    const txt = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = txt;
      form.reset();
      [nombre, tel].forEach(i => i.removeAttribute('aria-invalid'));
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
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

initModelBarScroll();
initTabs();
initReveals();
initNav();
initWspFloat();
initHeroMotion();
initLeeScroll();
initForm();
