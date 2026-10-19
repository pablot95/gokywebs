const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1280px)');
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
    .from(hero.querySelectorAll('.hero-marca'), { y: 30, opacity: 0, duration: 1.1 }, 0.15)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
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
  document.querySelectorAll('[role="tablist"]').forEach(list => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    if (!tabs.length) return;
    const activar = (tab, foco) => {
      if (tab.getAttribute('aria-selected') === 'true') { if (foco) tab.focus(); return; }
      let panel = null;
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        const p = document.getElementById(t.getAttribute('aria-controls'));
        if (p) { p.hidden = !on; if (on) panel = p; }
      });
      if (foco) tab.focus();
      revelarNuevos(panel);
      list.dispatchEvent(new CustomEvent('tabs:cambio', { detail: { tab, panel } }));
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => activar(t));
      t.addEventListener('keydown', e => {
        let j = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') j = 0;
        else if (e.key === 'End') j = tabs.length - 1;
        if (j !== null) { e.preventDefault(); activar(tabs[j], true); }
      });
    });
  });
}

function initMuestras() {
  const sec = document.getElementById('muestras');
  if (!sec) return;
  const consola = sec.querySelector('.mu-consola');
  const btn = consola?.querySelector('.mu-play');
  const titulo = consola?.querySelector('.mu-titulo');
  const tiempo = consola?.querySelector('.mu-tiempo');
  const estado = consola?.querySelector('.mu-estado');
  const onda = consola?.querySelector('.mu-onda');
  const lista = sec.querySelector('[role="tablist"]');
  if (!consola || !btn || !onda) return;

  for (let i = 0; i < 36; i++) {
    const b = document.createElement('span');
    const h = 22 + Math.round(Math.abs(Math.sin(i * 1.7) * 0.6 + Math.sin(i * 0.45) * 0.4) * 76);
    b.style.setProperty('--h', `${Math.min(h, 100)}%`);
    b.style.setProperty('--d', `${(i % 7) * -0.11}s`);
    onda.appendChild(b);
  }
  const barras = [...onda.children];
  let panel = sec.querySelector('.mu-panel:not([hidden])');
  let t = 0;
  let timer = 0;
  let audio = null;
  let modo = '';

  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const dur = () => Number(panel?.dataset.dur) || 30;
  const pintar = () => {
    const d = dur();
    tiempo.textContent = `${fmt(t)} / ${fmt(d)}`;
    const k = Math.round(Math.min(t / d, 1) * barras.length);
    barras.forEach((b, i) => b.classList.toggle('pasado', i < k));
    const lineas = panel ? [...panel.querySelectorAll('[data-t]')] : [];
    let act = -1;
    lineas.forEach((li, i) => { if (t >= Number(li.dataset.t)) act = i; });
    lineas.forEach((li, i) => li.classList.toggle('activa', modo !== '' && i === act));
  };
  const marcar = sonando => {
    consola.classList.toggle('sonando', sonando);
    btn.classList.toggle('pausa', sonando);
    btn.setAttribute('aria-label', sonando ? 'Pausar muestra' : 'Reproducir muestra');
  };
  const parar = reset => {
    window.clearInterval(timer);
    timer = 0;
    if (audio) audio.pause();
    marcar(false);
    if (reset) { t = 0; modo = ''; audio = null; }
    pintar();
  };
  const avanzar = () => {
    t = Math.min(t + 0.1, dur());
    pintar();
    if (t >= dur()) {
      parar(true);
      estado.textContent = 'Fin de la vista previa. ¿Te sirve este formato? Pedilo por WhatsApp.';
    }
  };
  const vistaPrevia = () => {
    modo = 'previa';
    estado.textContent = 'Vista previa sin audio: seguí el guion. La grabación real se suma pronto.';
    marcar(true);
    window.clearInterval(timer);
    timer = window.setInterval(avanzar, 100);
  };
  const conAudio = src => {
    const a = new window.Audio(src);
    audio = a;
    modo = 'audio';
    estado.textContent = '';
    a.addEventListener('timeupdate', () => { if (audio === a) { t = a.currentTime; pintar(); } });
    a.addEventListener('ended', () => { if (audio === a) parar(true); });
    a.addEventListener('error', () => { if (audio === a) { audio = null; vistaPrevia(); } }, { once: true });
    a.play().then(() => marcar(true)).catch(() => {});
  };

  btn.addEventListener('click', () => {
    if (btn.classList.contains('pausa')) { parar(false); return; }
    if (modo === 'audio' && audio) { audio.play().then(() => marcar(true)).catch(() => {}); return; }
    if (modo === 'previa') { vistaPrevia(); return; }
    const src = panel?.dataset.audio;
    if (src) conAudio(src); else vistaPrevia();
  });

  lista?.addEventListener('tabs:cambio', e => {
    parar(true);
    estado.textContent = '';
    panel = e.detail.panel;
    if (titulo && panel?.dataset.titulo) titulo.textContent = panel.dataset.titulo;
    pintar();
  });
  pintar();
}

function intentar(fn) {
  try { fn(); return true; } catch { return false; }
}

function initRailDrag() {
  document.querySelectorAll('.gal-rail').forEach(vp => {
    let x0 = 0;
    let s0 = 0;
    let moved = false;
    let activo = false;
    let pointerId = null;
    vp.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      activo = true;
      moved = false;
      x0 = e.clientX;
      s0 = vp.scrollLeft;
      pointerId = e.pointerId;
    });
    vp.addEventListener('pointermove', e => {
      if (!activo) return;
      const dx = e.clientX - x0;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        vp.classList.add('dragging');
        intentar(() => vp.setPointerCapture?.(pointerId));
      }
      if (moved) vp.scrollLeft = s0 - dx;
    });
    const fin = () => {
      if (!activo) return;
      activo = false;
      intentar(() => vp.releasePointerCapture?.(pointerId));
      if (!moved) return;
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    };
    vp.addEventListener('pointerup', fin);
    vp.addEventListener('pointercancel', fin);
    vp.addEventListener('lostpointercapture', fin);
  });
}

function initVisor() {
  const visor = document.getElementById('visor');
  const items = [...document.querySelectorAll('.gal-item')];
  if (!visor || !items.length) return;
  const img = visor.querySelector('.visor-fig img');
  const cap = visor.querySelector('.visor-cap');
  const cont = visor.querySelector('.visor-cont');
  let i = 0;
  let volver = null;
  const mostrar = n => {
    i = (n + items.length) % items.length;
    const it = items[i];
    img.src = it.dataset.full;
    img.alt = it.querySelector('img')?.alt || '';
    cap.textContent = it.dataset.cap || '';
    cont.textContent = `${i + 1} / ${items.length}`;
  };
  const abrir = n => {
    volver = document.activeElement;
    mostrar(n);
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    visor.querySelector('.visor-cerrar')?.focus();
  };
  const cerrar = () => {
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    volver?.focus();
  };
  items.forEach((it, n) => it.addEventListener('click', () => abrir(n)));
  visor.querySelector('.visor-cerrar')?.addEventListener('click', cerrar);
  visor.querySelectorAll('.visor-prev').forEach(b => b.addEventListener('click', () => mostrar(i - 1)));
  visor.querySelectorAll('.visor-next').forEach(b => b.addEventListener('click', () => mostrar(i + 1)));
  visor.addEventListener('click', e => { if (e.target === visor) cerrar(); });
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'ArrowLeft') mostrar(i - 1);
    else if (e.key === 'ArrowRight') mostrar(i + 1);
    else if (e.key === 'Tab') {
      const foc = [...visor.querySelectorAll('button')].filter(b => b.getClientRects().length);
      if (!foc.length) return;
      const pri = foc[0];
      const ult = foc[foc.length - 1];
      if (e.shiftKey && document.activeElement === pri) { e.preventDefault(); ult.focus(); }
      else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
    }
  });
}

function initVideos() {
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      const src = card.dataset.video;
      if (!src) {
        card.classList.add('sin-video');
        showToast('Este video se suma pronto, con el material real de los eventos.');
        setTimeout(() => card.classList.remove('sin-video'), 3200);
        return;
      }
      if (card.querySelector('video')) return;
      const v = document.createElement('video');
      v.src = src;
      v.controls = true;
      v.playsInline = true;
      v.addEventListener('error', () => { v.remove(); card.classList.add('sin-video'); }, { once: true });
      card.appendChild(v);
      v.play().catch(() => {});
    });
  });
}

function initForm() {
  const form = document.getElementById('form-contacto');
  if (!form) return;
  const reglas = {
    nombre: v => v.trim().length >= 2 || 'Contame tu nombre.',
    telefono: v => v.replace(/\D/g, '').length >= 8 || 'Dejame un WhatsApp para responderte.',
    tipo: v => v !== '' || 'Elegí qué necesitás.',
  };
  const validar = campo => {
    const regla = reglas[campo.name];
    if (!regla) return true;
    const r = regla(campo.value);
    const caja = campo.closest('.campo');
    const msg = caja?.querySelector('.msg-error');
    const ok = r === true;
    caja?.classList.toggle('error', !ok);
    campo.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (msg) msg.textContent = ok ? '' : r;
    return ok;
  };
  form.querySelectorAll('input, select, textarea').forEach(c => {
    c.addEventListener('blur', () => validar(c));
    c.addEventListener('input', () => { if (c.closest('.campo')?.classList.contains('error')) validar(c); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const campos = [...form.querySelectorAll('input, select, textarea')];
    const malos = campos.filter(c => !validar(c));
    if (malos.length) { malos[0].focus(); return; }
    const btn = form.querySelector('button[type="submit"]');
    const txt = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = txt;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initTabs();
initMuestras();
initRailDrag();
initVisor();
initVideos();
initForm();
initReveals();
