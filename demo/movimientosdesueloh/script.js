const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491165254689';

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
  const desktopMq = window.matchMedia('(min-width: 1101px)');
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  const pasada = hero.querySelector('.hero-pasada');
  if (pasada) tl.from(pasada, { scaleY: 0, transformOrigin: '50% 0%', duration: 1.3 }, 0.1);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-dato'), { y: 16, opacity: 0, duration: 0.9 }, 0.8)
    .from(hero.querySelectorAll('.sello, .hero-tag'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const hero = document.querySelector('.hero');
  const img = hero?.querySelector('[data-hero-img]');
  if (!img) return;
  gsap.to(img, { yPercent: 4.5, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
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

function initServicios() {
  const lista = document.querySelector('.srv-lista');
  const visor = document.querySelector('.srv-visor');
  if (!lista || !visor) return;
  const filas = [...lista.querySelectorAll('.srv')];
  const fotos = [...visor.querySelectorAll('.visor-stack > *')];
  const num = visor.querySelector('.visor-n');
  const nombre = visor.querySelector('.visor-nombre');
  let actual = 0;
  const activar = i => {
    if (i === actual && filas[i].classList.contains('on')) return;
    actual = i;
    filas.forEach((f, k) => f.classList.toggle('on', k === i));
    fotos.forEach((f, k) => f.classList.toggle('on', k === i));
    if (num) num.textContent = String(i + 1).padStart(2, '0');
    if (nombre) nombre.textContent = filas[i].querySelector('h3')?.textContent || '';
  };
  filas.forEach((f, i) => {
    f.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') activar(i); });
    f.addEventListener('focusin', () => activar(i));
    f.addEventListener('click', e => { if (!e.target.closest('a')) activar(i); });
  });
}

function initTrabajos() {
  const sec = document.getElementById('trabajos');
  if (!sec) return;
  const items = [...sec.querySelectorAll('.trab')];
  const chips = [...sec.querySelectorAll('.chip')];
  const estado = sec.querySelector('.trab-estado');
  const vp = sec.querySelector('.rail-vp');

  chips.forEach(chip => chip.addEventListener('click', () => {
    const cat = chip.dataset.cat;
    chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
    let visibles = 0;
    items.forEach(it => {
      const ok = cat === 'todos' || it.dataset.cat === cat;
      it.classList.toggle('fuera', !ok);
      const btn = it.querySelector('.trab-btn');
      if (btn) btn.disabled = !ok;
      if (ok) visibles++;
    });
    if (estado) estado.textContent = visibles === 1 ? '1 trabajo a la vista' : `${visibles} trabajos a la vista`;
    if (vp) {
      vp.scrollLeft = 0;
      vp.dispatchEvent(new Event('scroll'));
    }
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));

  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const lbImg = lb.querySelector('.lb-fig img');
  const lbCap = lb.querySelector('.lb-fig figcaption');
  const prev = lb.querySelector('.lb-prev');
  const next = lb.querySelector('.lb-next');
  const cerrar = lb.querySelector('.lb-close');
  let lista = [];
  let idx = 0;
  let disparador = null;

  const pintar = () => {
    const it = lista[idx];
    if (!it) return;
    const img = it.querySelector('img');
    lbImg.src = img.getAttribute('src');
    lbImg.width = img.naturalWidth || Number(img.getAttribute('width')) || 1000;
    lbImg.height = img.naturalHeight || Number(img.getAttribute('height')) || 1000;
    lbImg.alt = img.alt;
    lbCap.textContent = `${it.querySelector('.trab-cap b')?.textContent || ''} · ${idx + 1} de ${lista.length}`;
    const solo = lista.length < 2;
    prev.hidden = solo;
    next.hidden = solo;
  };
  const abrir = (it, trigger) => {
    lista = items.filter(x => !x.classList.contains('fuera'));
    idx = Math.max(0, lista.indexOf(it));
    disparador = trigger;
    pintar();
    lb.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => lb.classList.add('open'));
    cerrar.focus();
  };
  const close = () => {
    lb.classList.remove('open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { lb.hidden = true; }, reduceMotion ? 0 : 300);
    disparador?.focus();
  };
  const mover = d => { if (lista.length < 2) return; idx = (idx + d + lista.length) % lista.length; pintar(); };

  items.forEach(it => it.querySelector('.trab-btn')?.addEventListener('click', e => abrir(it, e.currentTarget)));
  cerrar.addEventListener('click', close);
  prev.addEventListener('click', () => mover(-1));
  next.addEventListener('click', () => mover(1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  lb.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowLeft') mover(-1);
    if (e.key === 'ArrowRight') mover(1);
    if (e.key === 'Tab') {
      const foco = [...lb.querySelectorAll('button')].filter(b => !b.hidden);
      const first = foco[0];
      const last = foco[foco.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  let x0 = null;
  lbImg.addEventListener('pointerdown', e => { x0 = e.clientX; });
  lbImg.addEventListener('pointerup', e => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) mover(dx < 0 ? 1 : -1);
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
      try { vp.setPointerCapture?.(pointerId); } catch (err) { vp.classList.add('dragging'); }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { pointerId = null; }
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

function initRail() {
  const vp = document.querySelector('.rail-vp');
  if (!vp) return;
  initRailDrag(vp);
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('.rail-prev');
  const next = document.querySelector('.rail-next');
  const sync = () => {
    if (!prev || !next || !track) return;
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const paso = () => {
    const card = track?.querySelector('.trab:not(.fuera)');
    return card ? card.getBoundingClientRect().width + 14 : vp.clientWidth * 0.8;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('load', sync);
  sync();
}

function initCalc() {
  const form = document.getElementById('calcForm');
  if (!form) return;
  const largo = form.querySelector('#cLargo');
  const ancho = form.querySelector('#cAncho');
  const alto = form.querySelector('#cAlto');
  const altoOut = form.querySelector('#cAltoOut');
  const res = form.querySelector('#cRes');
  const det = form.querySelector('#cDet');
  const nota = form.querySelector('#cNota');
  const wsp = form.querySelector('#cWsp');
  const wspTxt = form.querySelector('#cWspTxt');
  const capa = document.querySelector('.capa--relleno');
  const capaTxt = capa?.querySelector('.capa-txt');
  const fmt = n => n.toLocaleString('es-AR', { maximumFractionDigits: 1 });
  const num = el => {
    const v = parseFloat(String(el?.value || '').replace(',', '.'));
    return Number.isFinite(v) ? v : 0;
  };
  const medioArriba = v => Math.ceil(v * 2) / 2;

  const calcular = () => {
    const mat = form.querySelector('input[name="material"]:checked')?.value === 'tosca' ? 'tosca' : 'tierra';
    const nombre = mat === 'tosca' ? 'tosca' : 'tierra negra';
    const l = Math.min(Math.max(num(largo), 0), 500);
    const a = Math.min(Math.max(num(ancho), 0), 500);
    const h = Math.min(Math.max(num(alto) || 20, 5), 100);
    const sup = l * a;
    const vol = medioArriba(sup * h / 100);
    if (altoOut) altoOut.textContent = `${h} cm`;
    if (capa) { capa.style.setProperty('--alto', h); capa.dataset.mat = mat; }
    if (capaTxt) capaTxt.textContent = `${h} cm de ${nombre}`;
    if (!sup) {
      res.textContent = '0';
      det.textContent = 'Poné el largo y el ancho del lugar para ver el cálculo.';
      nota.hidden = true;
      wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(`Hola, quiero consultar por ${nombre}.`)}`;
      wspTxt.textContent = `Consultar por ${nombre}`;
      return;
    }
    res.textContent = fmt(vol);
    det.textContent = `de ${nombre} para ${fmt(sup)} m² con ${h} cm de altura.`;
    if (mat === 'tosca') {
      nota.hidden = false;
      nota.textContent = `Si la vas a compactar, calculá alrededor de un 20 % más: ${fmt(medioArriba(vol * 1.2))} m³.`;
    } else {
      nota.hidden = true;
    }
    const msg = `Hola, quiero pedir ${fmt(vol)} m³ de ${nombre} para un lugar de ${fmt(l)} × ${fmt(a)} m con ${h} cm de altura.`;
    wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
    wspTxt.textContent = `Pedir ${fmt(vol)} m³ por WhatsApp`;
  };
  form.addEventListener('input', calcular);
  form.addEventListener('change', calcular);
  form.addEventListener('submit', e => e.preventDefault());
  calcular();
}

function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const tel = form.querySelector('input[name="telefono"]');
  let mask = null;
  if (tel && typeof IMask !== 'undefined') {
    mask = IMask(tel, { mask: [
      { mask: '+{54} 9 (00) 0000-0000' },
      { mask: '+{54} 9 (000) 000-0000' },
      { mask: '+{54} 9 (0000) 00-0000' }
    ] });
  }
  const marcar = (input, msg) => {
    const campo = input.closest('.campo');
    if (!campo) return;
    let err = campo.querySelector('.campo-error');
    if (msg) {
      campo.setAttribute('data-error', '');
      input.setAttribute('aria-invalid', 'true');
      if (!err) {
        err = document.createElement('span');
        err.className = 'campo-error';
        err.id = `${input.name}-error`;
        campo.appendChild(err);
      }
      err.textContent = msg;
      input.setAttribute('aria-describedby', err.id);
    } else {
      campo.removeAttribute('data-error');
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
      err?.remove();
    }
  };
  const validar = () => {
    let ok = true;
    const nombre = form.querySelector('input[name="nombre"]');
    if (nombre.value.trim().length < 2) { marcar(nombre, 'Decinos tu nombre así sabemos con quién hablamos.'); ok = false; }
    else marcar(nombre, '');
    const digitos = tel.value.replace(/\D/g, '').length;
    if (digitos < (mask ? 13 : 8)) { marcar(tel, 'Falta el teléfono completo, con la característica.'); ok = false; }
    else marcar(tel, '');
    return ok;
  };
  form.addEventListener('input', e => {
    if (e.target.closest('.campo')?.hasAttribute('data-error')) validar();
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validar()) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    const txt = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      mask?.updateValue();
      btn.disabled = false;
      btn.textContent = txt;
    }, 800);
  });
}

initServicios();
initTrabajos();
initRail();
initCalc();
initForm();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initParallax();
