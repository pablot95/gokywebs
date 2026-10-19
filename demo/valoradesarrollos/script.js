const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const WSP = '5492974526442';

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

const SERVICIOS = {
  remodelacion: ['Demolición y retiro de escombros', 'Instalaciones sanitarias, de gas y eléctricas', 'Revestimientos, sanitarios y muebles de cocina', 'Pintura y terminaciones'],
  restauracion: ['Relevamiento de muros, humedades y fisuras', 'Revoques, molduras y cielorrasos de yeso', 'Carpinterías de madera y herrería', 'Fachadas y balcones'],
  pisos: ['Colocación de pisos de madera y flotantes', 'Pulido y plastificado de parquet', 'Reposición de tablas y zócalos', 'Nivelación de carpetas'],
  proyecto: ['Relevamiento y medición del inmueble', 'Planos y propuesta de distribución', 'Elección de materiales y terminaciones', 'Presupuesto y cronograma por etapas'],
};

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
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initEscena() {
  const escena = document.getElementById('escena');
  if (!escena) return;
  const sticky = escena.querySelector('.escena-sticky');
  const laser = escena.querySelector('.laser');
  const dato = escena.querySelector('[data-avance]');
  if (reduceMotion) { escena.classList.add('is-static'); return; }
  const clamp01 = v => Math.min(1, Math.max(0, v));
  const pintar = p => {
    const w = 102 - 104 * clamp01((p - 0.12) / 0.72);
    sticky.style.setProperty('--w', w.toFixed(2));
    sticky.style.setProperty('--lo', w > 99.5 || w < 0.5 ? '0' : '1');
    if (dato) dato.textContent = `${Math.round(100 * clamp01((100 - w) / 100))}%`;
    laser?.classList.toggle('cerca-inicio', w > 76);
    laser?.classList.toggle('cerca-fin', w < 24);
  };
  let frame = 0;
  const update = () => {
    frame = 0;
    const r = escena.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    pintar(total > 0 ? clamp01(-r.top / total) : 0);
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  update();
}

function crearCapa(capa) {
  let previo = null;
  let timer = 0;
  const enfocables = () => [...capa.querySelectorAll('a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  const abrir = () => {
    clearTimeout(timer);
    previo = document.activeElement;
    capa.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => capa.classList.add('abierto')));
    enfocables()[0]?.focus();
  };
  const cerrar = () => {
    capa.classList.remove('abierto');
    document.body.classList.remove('no-scroll');
    timer = setTimeout(() => { capa.hidden = true; }, 320);
    previo?.focus?.();
  };
  capa.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
    if (e.key !== 'Tab') return;
    const f = enfocables();
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  return { abrir, cerrar };
}

function initServicios() {
  const modal = document.getElementById('servModal');
  const botones = document.querySelectorAll('[data-abrir-servicio]');
  if (!modal || !botones.length) return;
  const capa = crearCapa(modal);
  const foto = modal.querySelector('.modal-foto img');
  const wsp = modal.querySelector('#modalWsp');
  botones.forEach(btn => btn.addEventListener('click', () => {
    const card = btn.closest('[data-servicio]');
    if (!card) return;
    const titulo = card.querySelector('h3')?.textContent.trim() || '';
    const img = card.querySelector('img');
    modal.querySelector('.modal-num').textContent = card.querySelector('.serv-num')?.textContent || '';
    modal.querySelector('.modal-titulo').textContent = titulo;
    modal.querySelector('.modal-texto').textContent = card.querySelector('.serv-cuerpo p')?.textContent.trim() || '';
    modal.querySelector('.modal-lista').innerHTML = (SERVICIOS[card.dataset.servicio] || []).map(t => `<li>${esc(t)}</li>`).join('');
    modal.setAttribute('aria-label', titulo);
    if (img && foto) { foto.src = img.getAttribute('src').replace('-chica', ''); foto.alt = img.alt; }
    if (wsp) wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(`Hola Valora, quiero consultar por ${titulo.toLowerCase()}.`)}`;
    capa.abrir();
  }));
  modal.querySelectorAll('[data-cerrar]').forEach(el => el.addEventListener('click', capa.cerrar));
}

function initVisor() {
  const visor = document.getElementById('visor');
  const botones = [...document.querySelectorAll('[data-visor]')];
  if (!visor || !botones.length) return;
  const capa = crearCapa(visor);
  const img = visor.querySelector('.visor-fig img');
  const cap = visor.querySelector('figcaption');
  const fotos = botones.map(b => {
    const im = b.querySelector('img');
    return {
      src: (im?.getAttribute('src') || '').replace('-chica', ''),
      alt: im?.alt || '',
      txt: [b.querySelector('.gal-k')?.textContent, b.querySelector('.gal-v')?.textContent].filter(Boolean).join(' · '),
    };
  });
  let i = 0;
  const mostrar = n => {
    i = (n + fotos.length) % fotos.length;
    img.src = fotos[i].src;
    img.alt = fotos[i].alt;
    cap.textContent = `${fotos[i].txt} — ${i + 1} de ${fotos.length}`;
  };
  botones.forEach((b, n) => b.addEventListener('click', () => { mostrar(n); capa.abrir(); }));
  visor.querySelector('.visor-prev')?.addEventListener('click', () => mostrar(i - 1));
  visor.querySelector('.visor-next')?.addEventListener('click', () => mostrar(i + 1));
  visor.querySelector('.visor-cerrar')?.addEventListener('click', capa.cerrar);
  visor.addEventListener('click', e => { if (e.target === visor) capa.cerrar(); });
  visor.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') mostrar(i - 1);
    if (e.key === 'ArrowRight') mostrar(i + 1);
  });
}

function initRail() {
  const vp = document.querySelector('.gal-vp');
  if (!vp) return;
  const track = vp.querySelector('.gal');
  const items = [...vp.querySelectorAll('.gal-item')];
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const inicio = () => parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
  const max = () => vp.scrollWidth - vp.clientWidth;
  const destinos = () => items.map(it => Math.min(max(), Math.max(0, it.offsetLeft - inicio())));
  const ir = left => vp.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' });
  const estado = () => {
    if (prev) prev.disabled = vp.scrollLeft <= 2;
    if (next) next.disabled = vp.scrollLeft >= max() - 2;
  };
  const paso = (desde, dir) => {
    const xs = destinos();
    const t = dir > 0 ? xs.find(x => x > desde + 4) : [...xs].reverse().find(x => x < desde - 4);
    return t ?? (dir > 0 ? max() : 0);
  };
  prev?.addEventListener('click', () => ir(paso(vp.scrollLeft, -1)));
  next?.addEventListener('click', () => ir(paso(vp.scrollLeft, 1)));
  let frame = 0;
  vp.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; estado(); }); }, { passive: true });
  window.addEventListener('resize', estado, { passive: true });
  estado();

  let down = false;
  let moved = false;
  let suprimir = false;
  let startX = 0;
  let startLeft = 0;
  let lastX = 0;
  let pid = 0;
  let soltarTimer = 0;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; suprimir = false;
    startX = lastX = e.clientX; startLeft = vp.scrollLeft; pid = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    lastX = e.clientX;
    const dx = lastX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      clearTimeout(soltarTimer);
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pid); } catch (err) { void err; }
    }
    if (moved) vp.scrollLeft = startLeft - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pid); } catch (err) { void err; }
    if (!moved) return;
    suprimir = true;
    const dx = lastX - startX;
    const xs = destinos();
    const destino = Math.abs(dx) > 60 ? paso(startLeft, dx < 0 ? 1 : -1) : xs.reduce((a, b) => (Math.abs(b - vp.scrollLeft) < Math.abs(a - vp.scrollLeft) ? b : a), xs[0] ?? 0);
    ir(destino);
    soltarTimer = setTimeout(() => vp.classList.remove('dragging'), 520);
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('click', e => {
    if (suprimir) { e.preventDefault(); e.stopPropagation(); suprimir = false; }
  }, true);
}

function initForm() {
  const form = document.getElementById('formContacto');
  if (!form) return;
  const nombre = form.querySelector('#f-nombre');
  const tel = form.querySelector('#f-tel');
  const btn = form.querySelector('[type="submit"]');
  const marcar = (input, errorId, ok) => {
    const err = document.getElementById(errorId);
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (ok) input.removeAttribute('aria-describedby'); else input.setAttribute('aria-describedby', errorId);
    if (err) err.hidden = ok;
    return ok;
  };
  tel?.addEventListener('input', () => { tel.value = tel.value.replace(/[^\d\s+()-]/g, ''); });
  [[nombre, 'e-nombre'], [tel, 'e-tel']].forEach(([input, id]) => input?.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') === 'true') marcar(input, id, true);
  }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const okNombre = marcar(nombre, 'e-nombre', nombre.value.trim().length >= 2);
    const okTel = marcar(tel, 'e-tel', tel.value.replace(/\D/g, '').length >= 8);
    if (!okNombre || !okTel) {
      (okNombre ? tel : nombre).focus();
      return;
    }
    const texto = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      btn.disabled = false;
      btn.textContent = texto;
    }, 800);
  });
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.enfoque-foto img').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${(-4 + 8 * s.progress).toFixed(2)}%`; },
    });
  });
}

[initNav, initWspFloat, initModelBarScroll, initHeroMotion, initEscena, initServicios, initVisor, initRail, initForm, initReveals, initParallax].forEach(fn => {
  try { fn(); } catch (err) { console.error(err); }
});
