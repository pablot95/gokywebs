const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
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
  if (img) tl.from(img, { scale: 1.08, duration: 1.8 }, 0);
  const foto = hero.querySelector('.hero--split .hero__foto');
  if (foto) tl.from(foto, { y: 30, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.05);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 16, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 32, opacity: 0, filter: 'blur(8px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 22, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 18, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero__servicios li'), { y: 12, opacity: 0, duration: 0.8, stagger: 0.06, clearProps: 'transform,opacity' }, 0.75);
}

function initLectura() {
  const el = document.querySelector('[data-lectura]');
  if (!el) return;
  const palabras = el.textContent.trim().split(/\s+/);
  el.innerHTML = palabras.map(w => `<span class="lw">${esc(w)}</span>`).join(' ');
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') { el.classList.add('leida'); return; }
  gsap.fromTo(el.querySelectorAll('.lw'), { color: 'rgba(234, 243, 242, 0.48)' }, {
    color: '#ffffff', ease: 'none', stagger: 0.12,
    scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 46%', scrub: true },
  });
}

function initTabs() {
  const lista = document.querySelector('[role="tablist"]');
  if (!lista) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const elegir = (tab, foco) => {
    tabs.forEach(t => {
      const activa = t === tab;
      t.setAttribute('aria-selected', String(activa));
      t.tabIndex = activa ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !activa;
    });
    if (foco) tab.focus();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => elegir(tab, false));
    tab.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); elegir(tabs[j], true); }
    });
  });
}

function initVisor() {
  const visor = document.getElementById('visor');
  const items = [...document.querySelectorAll('[data-visor]')];
  if (!visor || !items.length) return;
  const panel = visor.querySelector('.visor__panel');
  const img = document.getElementById('visor-img');
  const tit = document.getElementById('visor-tit');
  const fotos = items.map(b => ({
    src: b.querySelector('img').getAttribute('src'),
    alt: b.querySelector('img').getAttribute('alt'),
    titulo: b.querySelector('.galeria__pie').textContent.trim(),
  }));
  let actual = 0;
  let ultimoFoco = null;
  const mostrar = i => {
    actual = (i + fotos.length) % fotos.length;
    const f = fotos[actual];
    img.src = f.src;
    img.alt = f.alt;
    tit.innerHTML = `${esc(f.titulo)}<small>${actual + 1} de ${fotos.length}</small>`;
  };
  const abrir = (i, trigger) => {
    ultimoFoco = trigger;
    mostrar(i);
    visor.hidden = false;
    void visor.offsetWidth;
    visor.classList.add('open');
    document.body.classList.add('no-scroll');
    panel.focus({ preventScroll: true });
  };
  const cerrar = () => {
    if (!visor.classList.contains('open')) return;
    visor.classList.remove('open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { if (!visor.classList.contains('open')) visor.hidden = true; }, 400);
    ultimoFoco?.focus({ preventScroll: true });
  };
  items.forEach((b, i) => b.addEventListener('click', () => abrir(i, b)));
  visor.addEventListener('click', e => {
    if (e.target.closest('[data-visor-cerrar]')) { cerrar(); return; }
    const paso = e.target.closest('[data-visor-paso]');
    if (paso) mostrar(actual + Number(paso.dataset.visorPaso));
  });
  visor.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrar(); return; }
    if (e.key === 'ArrowRight') { mostrar(actual + 1); return; }
    if (e.key === 'ArrowLeft') { mostrar(actual - 1); return; }
    if (e.key === 'Tab') {
      const f = [...panel.querySelectorAll('button')];
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

function initForm() {
  const form = document.getElementById('form-consulta');
  if (!form) return;
  const tel = form.querySelector('#f-telefono');
  let mascara = null;
  if (tel && typeof window.IMask !== 'undefined') {
    mascara = window.IMask(tel, { mask: [
      { mask: '+{54} 9 (00) 0000-0000' },
      { mask: '+{54} 9 (000) 000-0000' },
      { mask: '+{54} 9 (0000) 00-0000' },
    ] });
  }
  const reglas = {
    'f-nombre': () => form.querySelector('#f-nombre').value.trim().length >= 2 || 'Contanos cómo te llamás.',
    'f-telefono': () => {
      const v = mascara ? mascara.unmaskedValue : tel.value.replace(/\D/g, '');
      return v.length >= 12 || 'Dejanos un teléfono con la característica.';
    },
    'f-para': () => !!form.querySelector('input[name="para"]:checked') || 'Elegí para quién es la consulta.',
  };
  const marcar = (id, r) => {
    const ok = r === true;
    const error = form.querySelector(`#${id}-error`);
    if (error) error.textContent = ok ? '' : r;
    if (id === 'f-para') form.querySelectorAll('input[name="para"]').forEach(i => i.setAttribute('aria-invalid', String(!ok)));
    else form.querySelector(`#${id}`).setAttribute('aria-invalid', String(!ok));
    return ok;
  };
  const validar = id => marcar(id, reglas[id]());
  ['f-nombre', 'f-telefono'].forEach(id => {
    const campo = form.querySelector(`#${id}`);
    campo.addEventListener('blur', () => { if (campo.value) validar(id); });
    campo.addEventListener('input', () => { if (campo.getAttribute('aria-invalid') === 'true') validar(id); });
  });
  form.querySelectorAll('input[name="para"]').forEach(i => i.addEventListener('change', () => validar('f-para')));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ids = Object.keys(reglas);
    const resultados = ids.map(validar);
    if (resultados.includes(false)) {
      const id = ids[resultados.indexOf(false)];
      (id === 'f-para' ? form.querySelector('input[name="para"]') : form.querySelector(`#${id}`))?.focus();
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    const texto = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      mascara?.updateValue();
      form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
      btn.disabled = false;
      btn.textContent = texto;
    }, 800);
  });
}

initModelBarScroll();
initNav();
initWspFloat();
initTabs();
initReveals();
initHeroMotion();
initLectura();
initVisor();
initForm();
