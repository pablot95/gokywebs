const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const WSP = '5492323602139';

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

function refrescar() {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function atraparFoco(cont, e) {
  const focos = [...cont.querySelectorAll('button:not([hidden]), [href], video, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!focos.length) return;
  const primero = focos[0];
  const ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

const Visor = (() => {
  const el = document.getElementById('visor');
  if (!el) return null;
  const media = document.getElementById('visorMedia');
  const cap = document.getElementById('visorCap');
  const prev = document.getElementById('visorPrev');
  const next = document.getElementById('visorNext');
  const cerrar = document.getElementById('visorCerrar');
  let lista = [];
  let idx = 0;
  let modo = 'foto';
  let ultimoFoco = null;
  let cierreTimer = 0;

  const pintarFoto = () => {
    const b = lista[idx];
    if (!b) return;
    const img = b.querySelector('img');
    media.innerHTML = `<img src="${esc(b.dataset.full)}" alt="${esc(img?.alt)}">`;
    cap.innerHTML = `<span>${esc(b.dataset.tipo)}</span>${esc(b.querySelector('.g-txt')?.textContent)}`;
    const varias = lista.length > 1;
    prev.hidden = !varias;
    next.hidden = !varias;
  };
  const abrir = () => {
    clearTimeout(cierreTimer);
    ultimoFoco = document.activeElement;
    el.hidden = false;
    document.body.classList.add('no-scroll');
    void el.offsetWidth;
    el.classList.add('abierto');
    cerrar.focus();
  };
  const close = () => {
    if (el.hidden) return;
    el.classList.remove('abierto');
    document.body.classList.remove('no-scroll');
    media.querySelector('video')?.pause();
    cierreTimer = setTimeout(() => { el.hidden = true; media.innerHTML = ''; }, 300);
    ultimoFoco?.focus();
  };
  const mover = d => {
    if (modo !== 'foto' || lista.length < 2) return;
    idx = (idx + d + lista.length) % lista.length;
    pintarFoto();
  };

  prev.addEventListener('click', () => mover(-1));
  next.addEventListener('click', () => mover(1));
  cerrar.addEventListener('click', close);
  el.addEventListener('click', e => { if (e.target === el || e.target === media) close(); });
  document.addEventListener('keydown', e => {
    if (el.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') mover(-1);
    else if (e.key === 'ArrowRight') mover(1);
    else if (e.key === 'Tab') atraparFoco(el, e);
  });

  return {
    foto(btn) {
      lista = [...document.querySelectorAll('.g-item:not([hidden]) .g-btn')];
      idx = Math.max(0, lista.indexOf(btn));
      modo = 'foto';
      pintarFoto();
      abrir();
    },
    video(src, titulo) {
      modo = 'video';
      media.innerHTML = `<video src="${esc(src)}" controls autoplay playsinline></video>`;
      cap.textContent = titulo || '';
      prev.hidden = true;
      next.hidden = true;
      abrir();
    }
  };
})();

function aplicarFiltro(f) {
  const lista = document.getElementById('gLista');
  if (!lista) return;
  document.querySelectorAll('.filtros .chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.filtro === f)));
  lista.querySelectorAll('.g-item').forEach(li => { li.hidden = !(f === 'todo' || li.dataset.cat === f); });
  const vp = document.getElementById('gVp');
  if (vp) { vp.scrollLeft = 0; vp.dispatchEvent(new window.Event('scroll')); }
  refrescar();
}

function initGaleria() {
  const lista = document.getElementById('gLista');
  if (!lista) return;
  document.querySelectorAll('.filtros .chip').forEach(c => c.addEventListener('click', () => aplicarFiltro(c.dataset.filtro)));
  document.querySelectorAll('[data-filtro]:not(.chip)').forEach(b => b.addEventListener('click', e => {
    aplicarFiltro(b.dataset.filtro);
    if (b.tagName === 'BUTTON') {
      e.preventDefault();
      document.getElementById('galeria')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  }));
  lista.addEventListener('click', e => {
    const b = e.target.closest('.g-btn');
    if (b && Visor) Visor.foto(b);
  });
}

function initRail() {
  const vp = document.getElementById('gVp');
  if (!vp) return;
  const track = vp.querySelector('.g-lista');
  const prev = document.getElementById('gPrev');
  const next = document.getElementById('gNext');
  const paso = () => {
    const it = track.querySelector('.g-item:not([hidden])');
    return it ? it.getBoundingClientRect().width + (parseFloat(window.getComputedStyle(track).columnGap) || 16) : 320;
  };
  const flechas = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();

  let abajo = false;
  let movido = false;
  let x0 = 0;
  let left0 = 0;
  let pointerId = 0;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    abajo = true; movido = false; x0 = e.clientX; left0 = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!abajo) return;
    const dx = e.clientX - x0;
    if (!movido && Math.abs(dx) > 6) {
      movido = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    if (movido) vp.scrollLeft = left0 - dx;
  });
  const fin = () => {
    if (!abajo) return;
    abajo = false;
    try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
    vp.classList.remove('dragging');
  };
  vp.addEventListener('pointerup', fin);
  vp.addEventListener('pointercancel', fin);
  vp.addEventListener('lostpointercapture', fin);
  vp.addEventListener('click', e => {
    if (movido) { e.preventDefault(); e.stopPropagation(); movido = false; }
  }, true);
}

function initVideos() {
  document.querySelectorAll('.video__btn').forEach(b => b.addEventListener('click', () => {
    const src = b.dataset.video;
    if (src && Visor) Visor.video(src, b.dataset.titulo);
    else showToast('Video en camino: se suma cuando BG comparta sus grabaciones del taller.');
  }));
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  try {
    const centro = [-34.5703, -59.105];
    const mapa = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, zoomControl: false }).setView(centro, 12);
    L.control.zoom({ position: 'topright' }).addTo(mapa);
    mapa.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    L.circle(centro, { radius: 4500, color: '#B5622C', weight: 1, fillColor: '#B5622C', fillOpacity: .1 }).addTo(mapa);
    L.circleMarker(centro, { radius: 7, color: '#fff', weight: 2, fillColor: '#233044', fillOpacity: 1 })
      .addTo(mapa)
      .bindTooltip('Luján · dirección a confirmar', { direction: 'top', offset: [0, -8] });
    window.addEventListener('load', () => mapa.invalidateSize());
    setTimeout(() => mapa.invalidateSize(), 1500);
  } catch { el.hidden = true; }
}

function initForm() {
  const form = document.getElementById('formPresupuesto');
  if (!form) return;
  const fs = document.getElementById('fsTrabajo');
  const err = document.getElementById('errTrabajo');
  const marcados = () => [...form.querySelectorAll('input[data-f="trabajo"]:checked')].map(i => i.value);
  form.addEventListener('change', e => {
    if (e.target.matches('input[data-f="trabajo"]') && marcados().length) {
      fs.removeAttribute('aria-invalid');
      err.hidden = true;
    }
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const trabajos = marcados();
    if (!trabajos.length) {
      fs.setAttribute('aria-invalid', 'true');
      err.hidden = false;
      form.querySelector('input[data-f="trabajo"]')?.focus();
      showToast('Elegí qué trabajo necesitás y armamos la consulta.');
      return;
    }
    const valor = id => form.querySelector(id)?.value.trim() || '';
    const lineas = ['Hola BG, quiero pedir un presupuesto.', `Trabajo: ${trabajos.join(', ')}`];
    if (valor('#fMedidas')) lineas.push(`Medidas aproximadas: ${valor('#fMedidas')}`);
    if (valor('#fLocalidad')) lineas.push(`Localidad: ${valor('#fLocalidad')}`);
    if (valor('#fDetalle')) lineas.push(`Detalle: ${valor('#fDetalle')}`);
    lineas.push('Te mando fotos del lugar por acá.');
    window.open(`https://wa.me/${WSP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
    showToast('Listo: abrimos WhatsApp con tu consulta.');
  });
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
    .from(hero.querySelectorAll('.sello'), { y: 14, scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.75);

  const foto = hero.querySelector('.hero__foto img');
  if (foto && typeof ScrollTrigger !== 'undefined') {
    gsap.to(foto, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
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

initModelBarScroll();
initNav();
initWspFloat();
initGaleria();
initRail();
initVideos();
initMapa();
initForm();
initHeroMotion();
initReveals();
