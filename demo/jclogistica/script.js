const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491136814656';

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

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

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
  tl.from(hero.querySelectorAll('.franjas i'), { xPercent: -70, opacity: 0, duration: 1.1, stagger: 0.12, clearProps: 'transform,opacity' }, 0.15)
    .from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-kicker, .hero-lead'), { y: 26, opacity: 0, duration: 1, stagger: 0.08 }, 0.42)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-badge, .hero__nota'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.68);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    gsap.fromTo(el, { yPercent: -3 }, {
      yPercent: 3,
      ease: 'none',
      scrollTrigger: { trigger: el.closest('.hero') || el, start: 'top top', end: 'bottom top', scrub: true }
    });
  });
}

function initTabs() {
  const lista = document.querySelector('.tabs__lista');
  if (!lista) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
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
}

function initGaleria() {
  const lista = document.getElementById('galeria-lista');
  const visor = document.getElementById('visor');
  if (!lista || !visor) return;
  const items = [...lista.querySelectorAll('.foto')];
  const img = document.getElementById('visorImg');
  const pie = document.getElementById('visorPie');
  const botones = [...visor.querySelectorAll('button')];
  let actual = 0;
  let ultimoFoco = null;
  const mostrar = i => {
    actual = (i + items.length) % items.length;
    const it = items[actual];
    const mini = it.querySelector('img');
    img.src = mini?.getAttribute('src') || '';
    img.alt = mini?.alt || '';
    img.setAttribute('width', mini?.getAttribute('width') || '1254');
    img.setAttribute('height', mini?.getAttribute('height') || '1254');
    const t = it.querySelector('.foto__pie strong')?.textContent || '';
    const d = it.querySelector('.foto__pie span')?.textContent || '';
    pie.textContent = `${t} · ${d} (${actual + 1}/${items.length})`;
  };
  const abrir = i => {
    ultimoFoco = document.activeElement;
    mostrar(i);
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    visor.querySelector('.visor__btn--cerrar')?.focus();
  };
  const cerrar = () => {
    visor.hidden = true;
    document.body.classList.remove('no-scroll');
    ultimoFoco?.focus?.();
  };
  items.forEach((it, i) => it.querySelector('.foto__btn')?.addEventListener('click', e => {
    if (lista.dataset.arrastrado) { e.preventDefault(); return; }
    abrir(i);
  }));
  visor.querySelectorAll('[data-cerrar]').forEach(el => el.addEventListener('click', cerrar));
  visor.querySelector('.visor__btn--prev')?.addEventListener('click', () => mostrar(actual - 1));
  visor.querySelector('.visor__btn--next')?.addEventListener('click', () => mostrar(actual + 1));
  document.addEventListener('keydown', e => {
    if (visor.hidden) return;
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'ArrowRight') mostrar(actual + 1);
    else if (e.key === 'ArrowLeft') mostrar(actual - 1);
    else if (e.key === 'Tab') {
      const i = botones.indexOf(document.activeElement);
      e.preventDefault();
      botones[(i + (e.shiftKey ? -1 : 1) + botones.length) % botones.length].focus();
    }
  });
}

function initRiel() {
  const rail = document.querySelector('body.m2 .galeria');
  if (!rail) return;
  const paso = () => (rail.querySelector('.foto')?.getBoundingClientRect().width || 300) + 16;
  document.querySelectorAll('[data-riel]').forEach(b => b.addEventListener('click', () => {
    rail.scrollBy({ left: (b.dataset.riel === 'next' ? 1 : -1) * paso(), behavior: reduceMotion ? 'auto' : 'smooth' });
  }));
  let abajo = false;
  let movido = false;
  let inicioX = 0;
  let inicioScroll = 0;
  rail.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    abajo = true;
    movido = false;
    inicioX = e.clientX;
    inicioScroll = rail.scrollLeft;
  });
  window.addEventListener('pointermove', e => {
    if (!abajo) return;
    const dx = e.clientX - inicioX;
    if (!movido && Math.abs(dx) > 6) { movido = true; rail.classList.add('dragging'); rail.dataset.arrastrado = '1'; }
    if (movido) rail.scrollLeft = inicioScroll - dx;
  });
  window.addEventListener('pointerup', e => {
    if (!abajo) return;
    abajo = false;
    if (!movido) return;
    const dx = e.clientX - inicioX;
    const base = rail.getBoundingClientRect().left;
    const inicio = parseFloat(window.getComputedStyle(rail).scrollPaddingInlineStart) || 0;
    const posiciones = [...rail.querySelectorAll('.foto')].map(c => rail.scrollLeft + c.getBoundingClientRect().left - base - inicio);
    let destino = null;
    if (dx < -60) destino = posiciones.find(p => p > inicioScroll + 4);
    else if (dx > 60) destino = [...posiciones].reverse().find(p => p < inicioScroll - 4);
    if (destino == null) destino = posiciones.reduce((a, p) => (Math.abs(p - rail.scrollLeft) < Math.abs(a - rail.scrollLeft) ? p : a), posiciones[0] || 0);
    rail.scrollTo({ left: Math.max(0, destino), behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(() => { delete rail.dataset.arrastrado; }, 80);
    setTimeout(() => rail.classList.remove('dragging'), 520);
  });
}

function initHojaDeRuta() {
  const form = document.getElementById('hoja');
  if (!form) return;
  const selO = form.elements.origen;
  const selD = form.elements.destino;
  const fecha = form.elements.fecha;
  const outKm = document.getElementById('rutaKm');
  const outUnidad = document.getElementById('rutaUnidad');
  const errD = document.getElementById('destino-err');
  const UNIDADES = { cajas: 'Utilitario', pallets: 'Camión con caja', completa: 'Semirremolque', otra: 'La definimos con vos' };
  const lugares = {};
  [...selD.options].forEach(o => { lugares[o.value] = { nombre: o.textContent, ll: o.dataset.ll.split(',').map(Number) }; });
  const hoy = new Date();
  if (fecha) fecha.min = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

  const rad = x => x * Math.PI / 180;
  const distancia = (a, b) => {
    const dLa = rad(b[0] - a[0]);
    const dLo = rad(b[1] - a[1]);
    const h = Math.sin(dLa / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLo / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.sqrt(h));
  };
  const kmRuta = (a, b) => {
    const d = distancia(a, b);
    const k = d < 80 ? d * 1.3 : d * 1.1;
    return k < 100 ? Math.max(5, Math.round(k / 5) * 5) : Math.round(k / 10) * 10;
  };
  const arco = (a, b) => {
    const [y1, x1] = a;
    const [y2, x2] = b;
    const cx = (x1 + x2) / 2 - (y2 - y1) * 0.16;
    const cy = (y1 + y2) / 2 + (x2 - x1) * 0.16;
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      pts.push([(1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t * t * y2, (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t * t * x2]);
    }
    return pts;
  };
  const carga = () => form.querySelector('input[name="carga"]:checked')?.value || 'otra';
  const etiqueta = () => form.querySelector('input[name="carga"]:checked')?.nextElementSibling?.textContent || 'Otra carga';
  const fmtFecha = v => {
    if (!v) return 'a coordinar';
    const [a, m, d] = v.split('-');
    return `${d}/${m}/${a}`;
  };

  let mapa = null;
  let capaRuta = null;
  const puntos = {};
  const esM2 = document.body.classList.contains('m2');
  const elMapa = document.getElementById('mapa');
  if (elMapa && typeof L !== 'undefined') {
    mapa = L.map(elMapa, { scrollWheelZoom: false, zoomSnap: 0.25, attributionControl: true });
    mapa.setView([-34.6, -61], 5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 18 }).addTo(mapa);
    Object.entries(lugares).forEach(([id, l]) => {
      const p = L.circleMarker(l.ll, { radius: 5, color: '#FAFAF7', weight: 2, fillColor: '#8F7E00', fillOpacity: 1, className: 'punto' }).addTo(mapa);
      p.bindTooltip(l.nombre, { direction: 'top', offset: [0, -6] });
      p.on('click', () => {
        if (id === selO.value) { showToast('Ese es el origen: elegí otro punto como destino'); return; }
        selD.value = id;
        pintar(true);
      });
      puntos[id] = p;
    });
  }

  const dibujar = (o, d, animar) => {
    if (!mapa) return;
    if (capaRuta) capaRuta.remove();
    const pts = arco(o.ll, d.ll);
    const base = L.polyline(pts, { color: '#0B0B0A', weight: 6, opacity: 0.9, lineCap: 'round', className: 'ruta-base', interactive: false });
    const centro = L.polyline(pts, { color: '#FAFAF7', weight: 1.5, dashArray: '6 8', className: 'ruta-centro', interactive: false });
    const pin = (l, cls) => L.marker(l.ll, { interactive: false, keyboard: false, icon: L.divIcon({ className: `pin-ruta ${cls}`, html: `<span class="pin-ruta__r"></span><span class="pin-ruta__t">${esc(l.nombre)}</span>`, iconSize: [0, 0] }) });
    capaRuta = L.layerGroup([base, centro, pin(o, 'pin-ruta--origen'), pin(d, 'pin-ruta--destino')]).addTo(mapa);
    const ancho = elMapa.clientWidth;
    const izquierda = esM2 && window.innerWidth > 900 ? Math.min(ancho * 0.45, (form.getBoundingClientRect().right - elMapa.getBoundingClientRect().left) + 40) : 40;
    mapa.fitBounds(L.latLngBounds([o.ll, d.ll]), { paddingTopLeft: [izquierda, 70], paddingBottomRight: [40, 60], maxZoom: 10, animate: false });
    const path = base.getElement();
    const linea = centro.getElement();
    if (!path || !animar || reduceMotion) return;
    const largo = path.getTotalLength();
    path.style.transition = 'none';
    path.style.strokeDasharray = `${largo}`;
    path.style.strokeDashoffset = `${largo}`;
    if (linea) { linea.style.transition = 'none'; linea.style.opacity = '0'; }
    path.getBoundingClientRect();
    path.style.transition = '';
    if (linea) linea.style.transition = '';
    requestAnimationFrame(() => {
      path.style.strokeDashoffset = '0';
      if (linea) linea.style.opacity = '1';
    });
    setTimeout(() => { path.style.strokeDasharray = ''; path.style.strokeDashoffset = ''; }, 1500);
  };

  let visto = false;
  const pintar = animar => {
    const o = lugares[selO.value];
    const d = lugares[selD.value];
    const igual = selO.value === selD.value;
    if (igual) selD.setAttribute('aria-invalid', 'true'); else selD.removeAttribute('aria-invalid');
    if (errD) errD.hidden = !igual;
    outUnidad.textContent = UNIDADES[carga()] || UNIDADES.otra;
    if (!o || !d || igual) { outKm.textContent = '—'; return; }
    outKm.textContent = `≈ ${kmRuta(o.ll, d.ll).toLocaleString('es-AR')} km`;
    Object.entries(puntos).forEach(([id, p]) => p.setStyle({ fillColor: id === selD.value || id === selO.value ? '#0B0B0A' : '#8F7E00' }));
    dibujar(o, d, animar && visto);
  };

  form.addEventListener('change', e => pintar(e.target === selO || e.target === selD));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const o = lugares[selO.value];
    const d = lugares[selD.value];
    if (!o || !d || selO.value === selD.value) {
      selD.focus();
      showToast('Elegí un destino distinto del origen');
      return;
    }
    const detalle = (form.elements.detalle?.value || '').trim();
    const msg = [
      'Hola J&C Logística, quiero cotizar un envío.',
      `Origen: ${o.nombre}`,
      `Destino: ${d.nombre}`,
      `Carga: ${etiqueta()}`,
      `Unidad sugerida: ${UNIDADES[carga()]}`,
      `Distancia aprox.: ${kmRuta(o.ll, d.ll).toLocaleString('es-AR')} km`,
      `Fecha: ${fmtFecha(fecha?.value)}`,
      detalle ? `Detalle: ${detalle}` : ''
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    showToast('Abrimos WhatsApp con tu hoja de ruta');
  });

  pintar(false);
  if (mapa) {
    window.addEventListener('load', () => { mapa.invalidateSize(); pintar(false); });
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        if (!entries.some(en => en.isIntersecting)) return;
        io.disconnect();
        visto = true;
        mapa.invalidateSize();
        setTimeout(() => pintar(true), 350);
      }, { threshold: 0.35 });
      io.observe(elMapa);
    } else visto = true;
  }
}

function initFaq() {
  document.querySelectorAll('.faq__item').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
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

[initTabs, initGaleria, initRiel, initHojaDeRuta, initFaq, initHeroMotion, initParallax, initReveals, initNav, initWspFloat, initModelBarScroll]
  .forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
