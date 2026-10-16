const WA = '5491176266938';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

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
  const desktopMq = window.matchMedia('(min-width: 901px)');
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
    .from(hero.querySelectorAll('.sello, .hero-badge, .foto-rotulo, .hero-oficios a'), { y: 14, scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.taller__foto').forEach(fig => {
    const img = fig.querySelector('img');
    if (!img) return;
    ScrollTrigger.create({
      trigger: fig, start: 'top bottom', end: 'bottom top',
      onUpdate: self => { img.style.translate = `0 ${(-4 + 8 * self.progress).toFixed(2)}%`; }
    });
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

function initGaleria() {
  const items = [...document.querySelectorAll('.g-item')];
  const visor = document.getElementById('visor');
  if (!items.length || !visor) return;
  const img = document.getElementById('visorImg');
  const cap = document.getElementById('visorCap');
  const cuenta = document.getElementById('visorCuenta');
  const cerrarBtn = visor.querySelector('.visor__cerrar');
  let actual = 0;
  let volverA = null;
  let timer = 0;
  const pintar = () => {
    const it = items[actual];
    const foto = it.querySelector('img');
    if (!foto) return;
    img.src = foto.getAttribute('src');
    img.alt = foto.alt;
    cap.textContent = it.dataset.cap || '';
    cuenta.textContent = `${actual + 1} / ${items.length}`;
  };
  const mover = d => { actual = (actual + d + items.length) % items.length; pintar(); };
  const abrir = i => {
    actual = i;
    pintar();
    volverA = items[i];
    clearTimeout(timer);
    visor.hidden = false;
    void visor.offsetWidth;
    visor.classList.add('abierto');
    document.body.classList.add('no-scroll');
    cerrarBtn?.focus();
  };
  const cerrar = () => {
    visor.classList.remove('abierto');
    document.body.classList.remove('no-scroll');
    timer = setTimeout(() => { visor.hidden = true; }, reduceMotion ? 0 : 300);
    volverA?.focus();
  };
  items.forEach((it, i) => it.addEventListener('click', () => abrir(i)));
  visor.querySelectorAll('[data-cerrar]').forEach(b => b.addEventListener('click', cerrar));
  document.getElementById('visorPrev')?.addEventListener('click', () => mover(-1));
  document.getElementById('visorNext')?.addEventListener('click', () => mover(1));
  visor.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
    if (e.key === 'ArrowLeft') { mover(-1); return; }
    if (e.key === 'ArrowRight') { mover(1); return; }
    if (e.key !== 'Tab') return;
    const focos = [...visor.querySelectorAll('button')];
    const primero = focos[0];
    const ultimo = focos[focos.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
  let x0 = null;
  visor.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  visor.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 45) mover(dx < 0 ? 1 : -1);
  }, { passive: true });
}

function initVisorInline() {
  const thumbs = [...document.querySelectorAll('.vi__thumb')];
  const img = document.getElementById('viImg');
  if (!thumbs.length || !img) return;
  const titulo = document.getElementById('viTitulo');
  const oficio = document.getElementById('viOficio');
  const cuenta = document.getElementById('viCuenta');
  const dos = n => String(n).padStart(2, '0');
  let actual = 0;
  let pedido = 0;
  const mostrar = i => {
    actual = (i + thumbs.length) % thumbs.length;
    const t = thumbs[actual];
    const src = t.querySelector('img')?.getAttribute('src');
    if (!src) return;
    thumbs.forEach(b => b.setAttribute('aria-pressed', String(b === t)));
    if (titulo) titulo.textContent = t.dataset.cap || '';
    if (oficio) oficio.textContent = t.dataset.oficio || '';
    if (cuenta) cuenta.textContent = `${dos(actual + 1)} / ${dos(thumbs.length)}`;
    const alt = t.dataset.alt || '';
    if (reduceMotion) { img.src = src; img.alt = alt; return; }
    const este = ++pedido;
    img.classList.add('cambiando');
    const nueva = new window.Image();
    nueva.src = src;
    const listo = (nueva.decode ? nueva.decode() : Promise.resolve()).catch(() => {});
    Promise.all([listo, new Promise(r => setTimeout(r, 200))]).then(() => {
      if (este !== pedido) return;
      img.src = src;
      img.alt = alt;
      img.classList.remove('cambiando');
    });
  };
  thumbs.forEach((t, i) => t.addEventListener('click', () => mostrar(i)));
  document.getElementById('viPrev')?.addEventListener('click', () => mostrar(actual - 1));
  document.getElementById('viNext')?.addEventListener('click', () => mostrar(actual + 1));
  let x0 = null;
  img.parentElement.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  img.parentElement.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 45) mostrar(actual + (dx < 0 ? 1 : -1));
  }, { passive: true });
}

function initTabs() {
  const tabs = [...document.querySelectorAll('.tab')];
  if (!tabs.length) return;
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      if (on && panel.hidden) {
        panel.hidden = false;
        panel.classList.remove('entrando');
        void panel.offsetWidth;
        panel.classList.add('entrando');
      } else if (!on) {
        panel.hidden = true;
      }
    });
    if (foco) tab.focus();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t));
    t.addEventListener('keydown', e => {
      let n = null;
      if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = tabs.length - 1;
      if (n !== null) { e.preventDefault(); activar(tabs[n], true); }
    });
  });
  document.querySelectorAll('[data-tab]').forEach(a => a.addEventListener('click', () => {
    const t = document.getElementById(`tab-${a.dataset.tab}`);
    if (t) activar(t);
  }));
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = L.latLng(-34.4705, -58.7587);
  const tactil = window.matchMedia('(pointer: coarse)').matches;
  const mapa = L.map(el, { scrollWheelZoom: false, dragging: !tactil, tap: false, zoomControl: true }).setView(centro, 14);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19
  }).addTo(mapa);
  L.circle(centro, { radius: 850, color: '#2456B5', weight: 1.5, fillColor: '#2456B5', fillOpacity: 0.14 })
    .addTo(mapa)
    .bindTooltip('Taller en Tortuguitas', { permanent: true, direction: 'top', className: 'mapa-tip', offset: [0, -6] });
  mapa.fitBounds(centro.toBounds(3600));
  const correr = () => {
    mapa.invalidateSize();
    mapa.setView(centro, mapa.getZoom(), { animate: false });
    if (el.closest('.ubic-ancho') && window.matchMedia('(min-width: 861px)').matches) mapa.panBy([-Math.round(el.clientWidth * 0.18), 0], { animate: false });
  };
  correr();
  window.addEventListener('load', correr);
}

function initPresupuesto() {
  const form = document.getElementById('presuForm');
  if (!form) return;
  const detalle = form.querySelector('textarea');
  const preview = document.getElementById('presuPreview');
  const error = document.getElementById('presuError');
  const nombreInput = form.querySelector('input[name="nombre"]');
  const armar = () => {
    const oficio = form.querySelector('input[name="oficio"]:checked')?.value || '';
    const tiene = [...form.querySelectorAll('input[data-tiene]:checked')].map(i => i.value);
    const nombre = nombreInput?.value.trim() || '';
    const texto = detalle?.value.trim() || '';
    const lineas = [nombre ? `Hola, soy ${nombre}. Quiero pedir un presupuesto.` : 'Hola, quiero pedir un presupuesto.'];
    if (oficio === 'No sé') lineas.push('Oficio: no sé bien cuál corresponde');
    else if (oficio) lineas.push(`Oficio: ${oficio}`);
    lineas.push(`Lo que necesito: ${texto || '…'}`);
    if (tiene.length) lineas.push(`Tengo para mostrar: ${tiene.join(', ')}`);
    return lineas.join('\n');
  };
  const pintar = () => { if (preview) preview.textContent = armar(); };
  form.addEventListener('input', pintar);
  form.addEventListener('change', pintar);
  pintar();
  detalle?.addEventListener('input', () => {
    if (detalle.value.trim() && error && !error.hidden) { error.hidden = true; detalle.removeAttribute('aria-invalid'); }
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!detalle?.value.trim()) {
      if (error) error.hidden = false;
      detalle?.setAttribute('aria-invalid', 'true');
      detalle?.focus();
      return;
    }
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(armar())}`, '_blank', 'noopener');
    showToast('Te abrimos WhatsApp con el mensaje listo para enviar.');
  });
}

[initModelBarScroll, initWspFloat, initNav, initHeroMotion, initTabs, initGaleria, initVisorInline, initPresupuesto, initMapa, initParallax, initReveals].forEach(fn => {
  try { fn(); } catch (e) { console.error(e); }
});
