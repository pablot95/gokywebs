const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
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
    .from(hero.querySelectorAll('.frame-bar'), { y: 14, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.7);
}

function initHeroCaptions() {
  const lineas = document.querySelectorAll('.frame-cc .cc-line');
  if (lineas.length < 2 || reduceMotion) return;
  lineas.forEach(l => l.classList.remove('on'));
  setTimeout(() => lineas[0].classList.add('on'), 900);
  setTimeout(() => { lineas[0].classList.remove('on'); lineas[1].classList.add('on'); }, 3300);
}

function initTabs() {
  const lista = document.querySelector('.tabs[role="tablist"]');
  if (!lista) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    document.dispatchEvent(new CustomEvent('muestra:cambio'));
    if (foco) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activar(tab, false));
    tab.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j === null) return;
      e.preventDefault();
      activar(tabs[j], true);
    });
  });
  document.querySelectorAll('a[data-tab]').forEach(a => a.addEventListener('click', () => {
    const tab = document.getElementById('tab-' + a.dataset.tab);
    if (tab) activar(tab, false);
  }));
}

function initServCambio() {
  const grid = document.querySelector('.m2 .serv-grid');
  if (!grid) return;
  const cards = [...grid.querySelectorAll('.serv-card')];
  const activar = c => cards.forEach(x => x.classList.toggle('activa', x === c));
  cards.forEach(c => {
    c.addEventListener('mouseenter', () => activar(c));
    c.addEventListener('focusin', () => activar(c));
  });
}

function fmt(s) {
  const n = Math.max(0, Math.floor(s));
  return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
}

let vozElegida = null;
function elegirVoz() {
  const voces = window.speechSynthesis.getVoices();
  const norm = v => v.lang.replace('_', '-').toLowerCase();
  vozElegida = ['es-ar', 'es-419', 'es-us', 'es-mx', 'es-es'].map(l => voces.find(v => norm(v) === l)).find(Boolean)
    || voces.find(v => norm(v).startsWith('es')) || null;
}

function crearPlayer(panel, hayVoz) {
  const tipo = panel.dataset.tipo;
  const dur = parseFloat(panel.dataset.dur) || 20;
  const btn = panel.querySelector('.player-play');
  const seek = panel.querySelector('.player-seek');
  const tiempo = panel.querySelector('.player-time');
  const cc = panel.querySelector('.player-cc');
  const opt = panel.querySelector('.player-opt');
  const nota = panel.querySelector('.player-nota');
  if (!btn || !seek || !cc) return null;
  const cues = [...panel.querySelectorAll('.cue')].map(b => ({
    b,
    t: parseFloat(b.dataset.t) || 0,
    f: parseFloat(b.dataset.f) || 0,
    html: b.querySelector('.cue-txt')?.innerHTML || '',
    texto: b.querySelector('.cue-txt')?.textContent.trim() || ''
  }));
  const etiqueta = btn.getAttribute('aria-label') || 'Reproducir la muestra';
  let t = 0;
  let play = false;
  let ultimo = 0;
  let frame = 0;
  let activo = -1;
  let opcion = opt ? opt.getAttribute('aria-pressed') === 'true' : true;

  if (tipo === 'ad' && !hayVoz) {
    opcion = false;
    if (opt) opt.hidden = true;
    if (nota) nota.hidden = false;
  }

  const callar = () => { if (tipo === 'ad' && hayVoz) window.speechSynthesis.cancel(); };
  const hablar = i => {
    if (tipo !== 'ad' || !hayVoz || !opcion || !play || i < 0) return;
    window.speechSynthesis.cancel();
    const u = new window.SpeechSynthesisUtterance(cues[i].texto);
    u.lang = vozElegida?.lang || 'es-AR';
    if (vozElegida) u.voice = vozElegida;
    u.rate = 1.05;
    window.speechSynthesis.speak(u);
  };
  const render = () => {
    if (activo < 0 || (tipo === 'sdh' && !opcion)) { cc.innerHTML = ''; return; }
    const c = cues[activo];
    if (tipo === 'ad') {
      cc.innerHTML = `<span class="cc cc--ad"><span class="cc-ad-chip">AD</span><span>${c.html}</span></span>`;
    } else if (tipo === 'en') {
      const en = c.b.querySelector('.cue-en');
      const es = c.b.querySelector('.cue-es');
      cc.innerHTML = `<span class="cc">${opcion && en ? `<span class="cc-en">${en.innerHTML}</span>` : ''}${es ? es.innerHTML : ''}</span>`;
    } else {
      cc.innerHTML = `<span class="cc">${c.html}</span>`;
    }
  };
  const pintar = () => {
    const i = cues.findIndex(c => t >= c.t && t < c.f);
    seek.value = String(t);
    seek.setAttribute('aria-valuetext', `${fmt(t)} de ${fmt(dur)}`);
    if (tiempo) tiempo.textContent = `${fmt(t)} / ${fmt(dur)}`;
    if (i !== activo) {
      if (activo >= 0) cues[activo].b.removeAttribute('aria-current');
      activo = i;
      if (i >= 0) { cues[i].b.setAttribute('aria-current', 'true'); hablar(i); }
      render();
    }
  };
  function pausar() {
    play = false;
    btn.classList.remove('is-playing');
    btn.setAttribute('aria-label', etiqueta);
    if (frame) { window.cancelAnimationFrame(frame); frame = 0; }
    callar();
  }
  const tick = now => {
    frame = 0;
    if (!play) return;
    t = Math.min(dur, t + (now - ultimo) / 1000);
    ultimo = now;
    pintar();
    if (t >= dur) { pausar(); return; }
    frame = requestAnimationFrame(tick);
  };
  const reproducir = () => {
    if (t >= dur - 0.05) { t = 0; pintar(); }
    play = true;
    btn.classList.add('is-playing');
    btn.setAttribute('aria-label', etiqueta.replace('Reproducir', 'Pausar'));
    ultimo = window.performance.now();
    hablar(activo);
    if (!frame) frame = requestAnimationFrame(tick);
  };

  btn.addEventListener('click', () => (play ? pausar() : reproducir()));
  seek.addEventListener('input', () => {
    t = Math.min(dur, Math.max(0, parseFloat(seek.value) || 0));
    callar();
    cues.forEach(c => c.b.removeAttribute('aria-current'));
    activo = -2;
    pintar();
  });
  cues.forEach(c => c.b.addEventListener('click', () => {
    t = c.t + 0.01;
    callar();
    cues.forEach(x => x.b.removeAttribute('aria-current'));
    activo = -2;
    pintar();
    if (!play) reproducir();
  }));
  opt?.addEventListener('click', () => {
    opcion = !opcion;
    opt.setAttribute('aria-pressed', opcion ? 'true' : 'false');
    if (tipo === 'ad') { if (opcion) hablar(activo); else callar(); }
    render();
  });
  pintar();
  return { pausar };
}

function initPlayers() {
  const paneles = [...document.querySelectorAll('.muestra[data-tipo]')];
  if (!paneles.length) return;
  const hayVoz = 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance !== 'undefined';
  if (hayVoz) {
    elegirVoz();
    window.speechSynthesis.addEventListener?.('voiceschanged', elegirVoz);
  }
  const players = paneles.map(p => crearPlayer(p, hayVoz)).filter(Boolean);
  document.addEventListener('muestra:cambio', () => players.forEach(p => p.pausar()));
  document.addEventListener('visibilitychange', () => { if (document.hidden) players.forEach(p => p.pausar()); });
}

function initForm() {
  const form = document.getElementById('form-contacto');
  if (!form) return;
  const reglas = [
    ['f-nombre', 'e-nombre', v => v.trim().length >= 2],
    ['f-contacto', 'e-contacto', v => /\S+@\S+\.\S+/.test(v.trim()) || v.replace(/\D/g, '').length >= 8],
    ['f-mensaje', 'e-mensaje', v => v.trim().length >= 4]
  ];
  const validar = ([id, eid, ok]) => {
    const campo = document.getElementById(id);
    const err = document.getElementById(eid);
    if (!campo || !err) return true;
    const bien = ok(campo.value);
    campo.setAttribute('aria-invalid', bien ? 'false' : 'true');
    err.hidden = bien;
    return bien;
  };
  reglas.forEach(r => document.getElementById(r[0])?.addEventListener('blur', e => { if (e.target.value) validar(r); }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const malos = reglas.filter(r => !validar(r));
    if (malos.length) { document.getElementById(malos[0][0])?.focus(); return; }
    const btn = form.querySelector('[type="submit"]');
    if (!btn) return;
    const txt = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = txt;
      form.reset();
      form.querySelectorAll('[aria-invalid]').forEach(c => c.removeAttribute('aria-invalid'));
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
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

initNav();
initWspFloat();
initModelBarScroll();
initTabs();
initPlayers();
initServCambio();
initForm();
initReveals();
initHeroMotion();
initHeroCaptions();
