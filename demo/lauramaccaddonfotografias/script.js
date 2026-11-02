const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let revealsListos = false;

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
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    (document.querySelector('.site-header') || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 861px)');
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.08, filter: 'blur(8px)', duration: 1.8, clearProps: 'transform,filter' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.75);
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

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch (err) { }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { }
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initRailFlechas(vp) {
  const prev = document.querySelector('[data-rail="prev"]');
  const next = document.querySelector('[data-rail="next"]');
  const track = vp?.querySelector('.g-track');
  if (!vp || !prev || !next || !track) return;
  const paso = () => Math.max(260, vp.clientWidth * 0.7);
  const estado = () => {
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', estado, { passive: true });
  window.addEventListener('resize', estado, { passive: true });
  estado();
}

function initGaleria() {
  const gal = document.querySelector('[data-galeria]');
  if (!gal) return;
  const items = [...gal.querySelectorAll('.g-item')];
  const chips = [...document.querySelectorAll('.chip[data-filtro]')];
  const estadoTxt = document.querySelector('.g-estado');
  const nombres = { infancias: 'infancias', familias: 'familias' };

  chips.forEach(ch => ch.addEventListener('click', () => {
    const filtro = ch.dataset.filtro;
    chips.forEach(c => c.setAttribute('aria-pressed', String(c === ch)));
    gal.dataset.enfoque = filtro;
    let n = 0;
    items.forEach(it => {
      const fuera = filtro !== 'todas' && it.dataset.cat !== filtro;
      it.classList.toggle('fuera', fuera);
      it.disabled = fuera;
      if (!fuera) n++;
    });
    if (estadoTxt) estadoTxt.textContent = filtro === 'todas'
      ? 'Tocá una foto para verla grande.'
      : `En foco: ${nombres[filtro]} (${n} fotos). Tocá una para verla grande.`;
  }));

  const visor = document.getElementById('visor');
  if (!visor) return;
  const vImg = visor.querySelector('.visor__img');
  const vCap = visor.querySelector('.visor__cap');
  const vCont = visor.querySelector('.visor__cont');
  const btnCerrar = visor.querySelector('.visor__cerrar');
  const btnPrev = visor.querySelector('.visor__prev');
  const btnNext = visor.querySelector('.visor__next');
  let lista = [];
  let idx = 0;
  let ultimoFoco = null;
  let cierreTimer = 0;

  const mostrar = () => {
    const it = lista[idx];
    const img = it?.querySelector('img');
    if (!img) return;
    vImg.src = img.getAttribute('src');
    vImg.width = img.naturalWidth || img.width;
    vImg.height = img.naturalHeight || img.height;
    vImg.alt = img.alt;
    vCap.textContent = it.dataset.cap || '';
    vCont.textContent = `${idx + 1} de ${lista.length}`;
    const solo = lista.length < 2;
    btnPrev.hidden = solo;
    btnNext.hidden = solo;
  };
  const abrir = it => {
    lista = items.filter(x => !x.disabled);
    idx = Math.max(0, lista.indexOf(it));
    ultimoFoco = it;
    mostrar();
    clearTimeout(cierreTimer);
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => visor.classList.add('open'));
    btnCerrar.focus();
  };
  const cerrar = () => {
    visor.classList.remove('open');
    document.body.classList.remove('no-scroll');
    cierreTimer = setTimeout(() => { visor.hidden = true; }, reduceMotion ? 0 : 250);
    ultimoFoco?.focus();
  };
  const mover = d => {
    if (lista.length < 2) return;
    idx = (idx + d + lista.length) % lista.length;
    mostrar();
  };

  items.forEach(it => it.addEventListener('click', () => { if (!it.disabled) abrir(it); }));
  btnCerrar.addEventListener('click', cerrar);
  btnPrev.addEventListener('click', () => mover(-1));
  btnNext.addEventListener('click', () => mover(1));
  visor.addEventListener('click', e => { if (e.target === visor || e.target.classList.contains('visor__fig')) cerrar(); });
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else if (e.key === 'ArrowLeft') mover(-1);
    else if (e.key === 'ArrowRight') mover(1);
    else if (e.key === 'Tab') {
      const foco = [...visor.querySelectorAll('button')].filter(b => !b.hidden);
      const primero = foco[0];
      const ultimo = foco[foco.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
  });
  let x0 = null;
  vImg.addEventListener('pointerdown', e => { x0 = e.clientX; });
  vImg.addEventListener('pointerup', e => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 45) mover(dx < 0 ? 1 : -1);
  });
  vImg.addEventListener('pointercancel', () => { x0 = null; });
}

function initHistorias() {
  const lista = document.querySelector('.h-tabs');
  if (!lista) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const sel = t === tab;
      t.setAttribute('aria-selected', String(sel));
      t.tabIndex = sel ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !sel;
      panel.classList.toggle('entra', sel && !reduceMotion);
    });
    if (foco) tab.focus();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t, false));
    t.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); activar(tabs[j], true); }
    });
  });
}

function initForm() {
  const form = document.getElementById('form-consulta');
  if (!form) return;
  const nombre = form.querySelector('#f-nombre');
  const tel = form.querySelector('#f-tel');
  let mask = null;
  if (typeof IMask !== 'undefined' && tel) {
    mask = IMask(tel, { mask: [
      { mask: '+{54} 9 (000) 000-0000' },
      { mask: '+{54} 9 (00) 0000-0000' },
      { mask: '+{54} 9 (0000) 00-0000' },
    ] });
  }
  const marcar = (input, ok) => {
    const campo = input.closest('.campo');
    const err = document.getElementById(input.getAttribute('aria-describedby'));
    campo?.classList.toggle('error', !ok);
    input.setAttribute('aria-invalid', String(!ok));
    if (err) err.hidden = ok;
  };
  const telOk = () => {
    const digitos = mask ? mask.unmaskedValue.replace(/\D/g, '') : tel.value.replace(/\D/g, '');
    return digitos.length >= 12;
  };
  nombre.addEventListener('input', () => { if (nombre.getAttribute('aria-invalid') === 'true') marcar(nombre, nombre.value.trim().length > 1); });
  tel.addEventListener('input', () => { if (tel.getAttribute('aria-invalid') === 'true') marcar(tel, telOk()); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const okNombre = nombre.value.trim().length > 1;
    const okTel = telOk();
    marcar(nombre, okNombre);
    marcar(tel, okTel);
    if (!okNombre) { nombre.focus(); return; }
    if (!okTel) { tel.focus(); return; }
    const btn = form.querySelector('button[type="submit"]');
    const label = btn.querySelector('span');
    const original = label.textContent;
    btn.disabled = true;
    label.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      label.textContent = original;
      form.reset();
      mask?.updateValue();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

initNav();
initWspFloat();
initModelBarScroll();
initGaleria();
const rail = document.querySelector('.g-rail');
initRailDrag(rail);
initRailFlechas(rail);
initHistorias();
initForm();
initReveals();
initHeroMotion();
initLeeScroll();
