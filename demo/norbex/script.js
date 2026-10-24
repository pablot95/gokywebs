const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let revealsListos = false;

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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
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
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero2__indice li'), { y: 16, opacity: 0, duration: 0.8, stagger: 0.07, clearProps: 'transform,opacity' }, 0.75)
    .from(hero.querySelectorAll('.hero-badge'), { scale: 0.94, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.8);
}

function initFiltros() {
  const grid = document.getElementById('trabajosGrid');
  if (!grid) return;
  const botones = [...document.querySelectorAll('.filtro')];
  const items = [...grid.querySelectorAll('.trabajo')];
  botones.forEach(b => b.addEventListener('click', () => {
    const f = b.dataset.filtro;
    botones.forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
    items.forEach(it => { it.hidden = f !== 'todos' && !it.dataset.cat.split(' ').includes(f); });
    revelarNuevos(grid);
    refrescar();
  }));
}

function initVisor() {
  const visor = document.getElementById('visor');
  if (!visor) return;
  const img = document.getElementById('visorImg');
  const tag = document.getElementById('visorTag');
  const texto = document.getElementById('visorTexto');
  const cuenta = document.getElementById('visorCuenta');
  const cerrarBtn = visor.querySelector('.visor__cerrar');
  const btns = [...document.querySelectorAll('.trabajo__btn')];
  let lista = [];
  let idx = 0;
  let origen = null;

  const pintar = () => {
    const b = lista[idx];
    if (!b) return;
    const mini = b.querySelector('img');
    img.setAttribute('width', mini.getAttribute('width'));
    img.setAttribute('height', mini.getAttribute('height'));
    img.src = b.dataset.full;
    img.alt = mini.alt;
    tag.textContent = b.dataset.tag || '';
    const pie = b.querySelector('.trabajo__pie');
    texto.textContent = pie ? [...pie.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim() : '';
    cuenta.textContent = `${idx + 1} / ${lista.length}`;
  };
  const abrir = b => {
    lista = btns.filter(x => !x.closest('[hidden]'));
    idx = Math.max(0, lista.indexOf(b));
    origen = b;
    pintar();
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    cerrarBtn.focus();
  };
  const cerrar = () => {
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    origen?.focus();
  };
  const mover = paso => { idx = (idx + paso + lista.length) % lista.length; pintar(); };

  btns.forEach(b => b.addEventListener('click', () => abrir(b)));
  visor.querySelectorAll('[data-cerrar]').forEach(el => el.addEventListener('click', cerrar));
  visor.querySelector('.visor__prev').addEventListener('click', () => mover(-1));
  visor.querySelector('.visor__next').addEventListener('click', () => mover(1));
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else if (e.key === 'ArrowLeft') mover(-1);
    else if (e.key === 'ArrowRight') mover(1);
    else if (e.key === 'Tab') {
      const focos = [...visor.querySelectorAll('button')];
      const i = focos.indexOf(document.activeElement);
      e.preventDefault();
      const sig = e.shiftKey ? (i <= 0 ? focos.length - 1 : i - 1) : (i === -1 || i === focos.length - 1 ? 0 : i + 1);
      focos[sig].focus();
    }
  });
}

function initServTabs() {
  const tabs = [...document.querySelectorAll('.serv-tab')];
  if (!tabs.length) return;
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (foco) tab.focus();
    revelarNuevos(document.getElementById(tab.getAttribute('aria-controls')));
    refrescar();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', e => {
      const sig = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!sig) return;
      e.preventDefault();
      activar(tabs[(i + sig + tabs.length) % tabs.length], true);
    });
  });
  document.querySelectorAll('a[data-servicio]').forEach(a => a.addEventListener('click', () => {
    const t = tabs.find(x => x.dataset.servicio === a.dataset.servicio);
    if (t) activar(t);
  }));
}

function initForm() {
  const form = document.getElementById('formContacto');
  if (!form) return;
  const reglas = [
    ['f-nombre', 'e-nombre', v => v.trim().length >= 2],
    ['f-tel', 'e-tel', v => v.replace(/\D/g, '').length >= 8],
    ['f-msg', 'e-msg', v => v.trim().length >= 3]
  ];
  const validar = (campo, error, ok) => {
    const c = document.getElementById(campo);
    const valido = ok(c.value);
    c.setAttribute('aria-invalid', valido ? 'false' : 'true');
    document.getElementById(error).hidden = valido;
    return valido;
  };
  reglas.forEach(([campo, error, ok]) => {
    document.getElementById(campo).addEventListener('input', e => {
      if (e.target.getAttribute('aria-invalid') === 'true') validar(campo, error, ok);
    });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const resultados = reglas.map(r => validar(...r));
    if (resultados.includes(false)) {
      document.getElementById(reglas[resultados.indexOf(false)][0]).focus();
      refrescar();
      return;
    }
    const btn = form.querySelector('.form__enviar');
    const label = btn.querySelector('span');
    btn.disabled = true;
    label.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      reglas.forEach(([campo]) => document.getElementById(campo).removeAttribute('aria-invalid'));
      btn.disabled = false;
      label.textContent = 'Enviar consulta';
    }, 800);
  });
}

initFiltros();
initVisor();
initServTabs();
initForm();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
