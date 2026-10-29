const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA_NUM = '5491137857481';
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

function waLink(msg) {
  return `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`;
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
    .from(hero.querySelectorAll('.hero__cinta, .ficha__celda'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const media = document.querySelector('.hero2__media');
  if (!media) return;
  gsap.to(media, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.hero--fondo', start: 'top top', end: 'bottom top', scrub: true } });
}

function initFiltros() {
  const grid = document.getElementById('mosaico');
  const chips = [...document.querySelectorAll('[data-filtro]')];
  if (!grid || !chips.length) return;
  chips.forEach(c => c.addEventListener('click', () => {
    const f = c.dataset.filtro;
    chips.forEach(x => x.setAttribute('aria-pressed', String(x === c)));
    grid.classList.toggle('filtrado', f !== 'todos');
    grid.querySelectorAll('.trabajo').forEach(t => { t.hidden = f !== 'todos' && t.dataset.servicio !== f; });
    revelarNuevos(grid);
    refrescar();
  }));
}

function initRiel() {
  const vp = document.getElementById('riel');
  if (!vp) return;
  const prev = document.querySelector('[data-riel="prev"]');
  const next = document.querySelector('[data-riel="next"]');
  let pointerId = null;
  let startX = 0;
  let startLeft = 0;
  let moved = false;
  let arrastrando = false;
  let matarClick = false;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    arrastrando = true; moved = false; pointerId = e.pointerId; startX = e.clientX; startLeft = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!arrastrando) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch (err) { /* sin capture igual se arrastra */ }
    }
    if (moved) vp.scrollLeft = startLeft - dx;
  });
  const fin = () => {
    if (!arrastrando) return;
    arrastrando = false;
    try { vp.releasePointerCapture?.(pointerId); } catch (err) { /* ya liberado */ }
    if (moved) { matarClick = true; setTimeout(() => { matarClick = false; }, 60); }
    vp.classList.remove('dragging');
  };
  vp.addEventListener('pointerup', fin);
  vp.addEventListener('pointercancel', fin);
  vp.addEventListener('lostpointercapture', fin);
  vp.addEventListener('click', e => { if (matarClick) { e.preventDefault(); e.stopPropagation(); } }, true);
  const paso = () => (vp.querySelector('.trabajo')?.getBoundingClientRect().width || 320) + 12;
  const mover = dir => vp.scrollBy({ left: dir * paso(), behavior: reduceMotion ? 'auto' : 'smooth' });
  prev?.addEventListener('click', () => mover(-1));
  next?.addEventListener('click', () => mover(1));
  const sync = () => {
    if (prev) prev.disabled = vp.scrollLeft <= 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initVisor() {
  const visor = document.getElementById('visor');
  if (!visor) return;
  const img = document.getElementById('visorImg');
  const tit = document.getElementById('visorTit');
  const srv = document.getElementById('visorSrv');
  let lista = [];
  let idx = 0;
  let origen = null;
  const pintar = () => {
    const b = lista[idx];
    if (!b) return;
    const mini = b.querySelector('img');
    img.width = Number(mini?.getAttribute('width')) || 1000;
    img.height = Number(mini?.getAttribute('height')) || 1000;
    img.src = b.dataset.src;
    img.alt = mini?.alt || '';
    tit.textContent = b.dataset.titulo || '';
    srv.textContent = b.dataset.servicioTxt || '';
  };
  const abrir = b => {
    lista = [...document.querySelectorAll('[data-visor]')].filter(x => x.offsetParent !== null);
    idx = Math.max(0, lista.indexOf(b));
    origen = b;
    pintar();
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    visor.querySelector('.visor__btn--cerrar')?.focus();
  };
  const cerrar = () => {
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    origen?.focus();
  };
  const mover = d => { if (!lista.length) return; idx = (idx + d + lista.length) % lista.length; pintar(); };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-visor]');
    if (b) abrir(b);
  });
  visor.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar]')) { cerrar(); return; }
    const n = e.target.closest('[data-visor-nav]');
    if (n) mover(Number(n.dataset.visorNav));
  });
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'ArrowRight') mover(1);
    else if (e.key === 'ArrowLeft') mover(-1);
    else if (e.key === 'Tab') {
      const focos = [...visor.querySelectorAll('button')];
      const i = focos.indexOf(document.activeElement);
      e.preventDefault();
      focos[(i + (e.shiftKey ? -1 : 1) + focos.length) % focos.length].focus();
    }
  });
}

function initTabs() {
  const lista = document.querySelector('.tabs__lista');
  if (!lista) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const activar = (t, foco) => {
    tabs.forEach(x => {
      const on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(x.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (foco) t.focus();
    refrescar();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
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

const PARTES = { techo: 'Techo', espejo: 'Espejo', puerta: 'Puerta', guardabarros: 'Guardabarros', optica: 'Óptica', capot: 'Capot', paragolpes: 'Paragolpes', interior: 'Interior', todo: 'Todo el auto' };
const DANIOS = { rayon: 'Rayón', golpe: 'Golpe o abolladura', rotura: 'Fisura o rotura', opaca: 'Pintura opaca o gastada', limpieza: 'Necesita limpieza' };

function servicioPara(parte, danio) {
  if (!danio) return 'Elegí qué le pasó';
  if (parte === 'interior') return ['limpieza', 'opaca'].includes(danio) ? 'Detailing de interior y tapizados' : 'Interior: lo vemos con tus fotos';
  if (parte === 'todo') return { limpieza: 'Detailing completo', opaca: 'Pulido y corrección de pintura', rayon: 'Pulido y corrección de pintura', golpe: 'Chapa y pintura: lo vemos con tus fotos', rotura: 'Chapa y pintura: lo vemos con tus fotos' }[danio];
  if (parte === 'optica') return ['golpe', 'rotura'].includes(danio) ? 'Revisión de la óptica: te decimos si se repara' : 'Restauración de ópticas';
  if (parte === 'paragolpes') return { rotura: 'Reparación de paragolpes plástico y pintura', golpe: 'Reparación de paragolpes plástico y pintura', rayon: 'Retoque de pintura del paragolpes', opaca: 'Pulido del paragolpes', limpieza: 'Detailing exterior' }[danio];
  return { golpe: 'Chapa: enderezado y pintura de la pieza', rotura: 'Chapa y pintura de la pieza', rayon: 'Pulido o pintura, según la profundidad del rayón', opaca: 'Pulido y corrección de pintura', limpieza: 'Detailing exterior' }[danio];
}

function initDanio() {
  const seccion = document.getElementById('danio');
  if (!seccion) return;
  const lista = document.getElementById('ordenLista');
  const cuenta = document.getElementById('ordenCuenta');
  const auto = document.getElementById('danioAuto');
  const cta = document.getElementById('danioWsp');
  const elegidas = [];
  let danio = null;

  const pintar = () => {
    seccion.querySelectorAll('[data-parte]').forEach(b => b.setAttribute('aria-pressed', String(elegidas.includes(b.dataset.parte))));
    seccion.querySelectorAll('[data-danio]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.danio === danio)));
    cuenta.textContent = elegidas.length === 1 ? '1 parte' : `${elegidas.length} partes`;
    if (!elegidas.length) {
      lista.innerHTML = '<li class="orden__vacio">Tocá una parte del auto para empezar.</li>';
    } else {
      lista.innerHTML = elegidas.map(p => `<li><span class="orden__parte">${esc(PARTES[p])}${danio ? ` · ${esc(DANIOS[danio])}` : ''}</span><span class="orden__srv">${esc(servicioPara(p, danio))}</span></li>`).join('');
    }
    const lineas = ['Hola Pain cars los locos, quiero un presupuesto.'];
    const queAuto = auto?.value.trim();
    if (queAuto) lineas.push(`Auto: ${queAuto}`);
    if (danio) lineas.push(`Qué le pasó: ${DANIOS[danio]}`);
    if (elegidas.length) {
      lineas.push('Partes:');
      elegidas.forEach(p => lineas.push(`- ${PARTES[p]}${danio ? `: ${servicioPara(p, danio)}` : ''}`));
    }
    lineas.push('Les mando fotos.');
    cta.href = waLink(lineas.join('\n'));
  };

  seccion.addEventListener('click', e => {
    const p = e.target.closest('[data-parte]');
    if (p) {
      const k = p.dataset.parte;
      const i = elegidas.indexOf(k);
      if (i >= 0) elegidas.splice(i, 1);
      else if (k === 'todo') { elegidas.length = 0; elegidas.push('todo'); }
      else {
        const t = elegidas.indexOf('todo');
        if (t >= 0) elegidas.splice(t, 1);
        elegidas.push(k);
      }
      pintar();
      return;
    }
    const d = e.target.closest('[data-danio]');
    if (d) {
      danio = danio === d.dataset.danio ? null : d.dataset.danio;
      pintar();
    }
  });
  auto?.addEventListener('input', pintar);
  pintar();
}

function initForm() {
  const f = document.getElementById('formContacto');
  if (!f) return;
  f.addEventListener('submit', e => {
    e.preventDefault();
    f.querySelectorAll('.campo').forEach(c => { c.classList.remove('error'); c.querySelector('.campo__error')?.remove(); });
    f.querySelectorAll('[aria-invalid]').forEach(i => i.removeAttribute('aria-invalid'));
    let ok = true;
    const marcar = (input, msg) => {
      ok = false;
      const c = input.closest('.campo');
      c.classList.add('error');
      input.setAttribute('aria-invalid', 'true');
      const s = document.createElement('span');
      s.className = 'campo__error';
      s.textContent = msg;
      c.appendChild(s);
    };
    if (f.elements.nombre.value.trim().length < 2) marcar(f.elements.nombre, 'Contanos tu nombre.');
    if (f.elements.celular.value.replace(/\D/g, '').length < 8) marcar(f.elements.celular, 'Revisá el celular: faltan números.');
    if (!ok) { f.querySelector('[aria-invalid="true"]')?.focus(); return; }
    const btn = f.querySelector('[type="submit"]');
    const html = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = html;
      f.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initFaq() {
  document.querySelectorAll('.faq').forEach(d => d.addEventListener('toggle', refrescar));
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

initModelBarScroll();
initNav();
initWspFloat();
initHeroMotion();
initParallax();
initFiltros();
initRiel();
initVisor();
initTabs();
initDanio();
initForm();
initFaq();
initReveals();
