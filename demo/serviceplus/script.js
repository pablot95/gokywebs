const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491171037075';
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

const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

function initWspLinks() {
  document.querySelectorAll('a[data-wsp-msg]').forEach(a => {
    a.href = wspHref(a.dataset.wspMsg);
  });
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
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
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

const ZONAS = {
  caba: {
    nombre: 'Capital Federal',
    titulo: 'Sí, llegamos a Capital Federal',
    txt: 'Todos los barrios porteños: de Núñez a La Boca y de Palermo a Liniers.',
    boton: 'Pedí tu visita en Capital',
    coords: [[-34.5355, -58.4630], [-34.5410, -58.4740], [-34.5470, -58.4930], [-34.5530, -58.5040], [-34.5620, -58.5150], [-34.5730, -58.5260], [-34.5850, -58.5310], [-34.6040, -58.5290], [-34.6190, -58.5300], [-34.6350, -58.5290], [-34.6520, -58.5290], [-34.6620, -58.5230], [-34.6740, -58.5000], [-34.6880, -58.4790], [-34.7050, -58.4610], [-34.6950, -58.4500], [-34.6800, -58.4330], [-34.6650, -58.4200], [-34.6580, -58.4010], [-34.6520, -58.3830], [-34.6440, -58.3650], [-34.6380, -58.3540], [-34.6290, -58.3500], [-34.6150, -58.3540], [-34.6000, -58.3620], [-34.5880, -58.3700], [-34.5780, -58.3870], [-34.5650, -58.4020], [-34.5550, -58.4130], [-34.5450, -58.4370]]
  },
  vl: {
    nombre: 'Vicente López',
    titulo: 'Sí, llegamos a Vicente López',
    txt: 'Vicente López, Olivos, La Lucila, Florida, Munro, Villa Martelli y Carapachay.',
    boton: 'Pedí tu visita en Vicente López',
    coords: [[-34.5355, -58.4630], [-34.5410, -58.4740], [-34.5470, -58.4930], [-34.5530, -58.5040], [-34.5480, -58.5250], [-34.5380, -58.5420], [-34.5250, -58.5520], [-34.5100, -58.5560], [-34.5060, -58.5400], [-34.5040, -58.5200], [-34.5010, -58.5020], [-34.4960, -58.4880], [-34.5060, -58.4790], [-34.5170, -58.4700], [-34.5280, -58.4650]]
  },
  si: {
    nombre: 'San Isidro',
    titulo: 'Sí, llegamos a San Isidro',
    txt: 'San Isidro, Martínez, Acassuso, Beccar, Boulogne y Villa Adelina.',
    boton: 'Pedí tu visita en San Isidro',
    coords: [[-34.4960, -58.4880], [-34.5010, -58.5020], [-34.5040, -58.5200], [-34.5060, -58.5400], [-34.5100, -58.5560], [-34.5130, -58.5700], [-34.5020, -58.5840], [-34.4880, -58.5880], [-34.4760, -58.5700], [-34.4640, -58.5480], [-34.4520, -58.5300], [-34.4560, -58.5150], [-34.4660, -58.5020], [-34.4800, -58.4930]]
  },
  sf: {
    nombre: 'San Fernando',
    titulo: 'Sí, llegamos a San Fernando',
    txt: 'San Fernando, Victoria y Virreyes: el límite norte de la zona que cubrimos.',
    boton: 'Pedí tu visita en San Fernando',
    coords: [[-34.4520, -58.5300], [-34.4640, -58.5480], [-34.4760, -58.5700], [-34.4880, -58.5880], [-34.4720, -58.6000], [-34.4560, -58.5960], [-34.4400, -58.5850], [-34.4300, -58.5700], [-34.4330, -58.5550], [-34.4420, -58.5420]]
  },
  otra: {
    nombre: 'otra zona',
    titulo: '¿Estás en otra zona?',
    txt: 'Por ahora trabajamos en Capital y zona norte hasta San Fernando. Escribinos igual y te decimos si podemos llegar.',
    boton: 'Consultar por mi zona',
    msg: 'Hola Service Plus! Estoy en otra zona y quería saber si llegan.'
  }
};

function initCobertura() {
  const grupo = document.querySelector('.zonas');
  if (!grupo) return;
  const titulo = document.getElementById('zonaTitulo');
  const txt = document.getElementById('zonaTxt');
  const wsp = document.getElementById('zonaWsp');
  const botones = [...grupo.querySelectorAll('.zona')];
  const mapaEl = document.getElementById('mapa');
  const banda = mapaEl?.closest('.cobertura--banda');
  const ficha = banda?.querySelector('.cobertura__ficha');
  const capas = {};
  let mapa = null;
  const azul = '#2b40ae';
  const estilos = {
    base: { color: azul, weight: 1.5, opacity: 0.9, fillColor: azul, fillOpacity: 0.16 },
    activo: { color: azul, weight: 2.5, opacity: 1, fillColor: azul, fillOpacity: 0.4 },
    apagado: { color: azul, weight: 1, opacity: 0.45, fillColor: azul, fillOpacity: 0.06 }
  };

  const encuadrar = clave => {
    if (!mapa) return;
    const lista = clave && capas[clave] ? [capas[clave]] : Object.values(capas);
    if (!lista.length) return;
    const limites = L.latLngBounds([]);
    lista.forEach(capa => limites.extend(capa.getBounds()));
    let izq = 24;
    if (ficha && window.innerWidth > 900) {
      izq = Math.max(24, ficha.getBoundingClientRect().right - mapaEl.getBoundingClientRect().left + 24);
    }
    mapa.fitBounds(limites, { paddingTopLeft: [izq, 24], paddingBottomRight: [24, 24], maxZoom: 13, animate: !reduceMotion });
  };

  const elegir = clave => {
    const z = ZONAS[clave];
    if (!z) return;
    botones.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.zona === clave)));
    titulo.textContent = z.titulo;
    txt.textContent = z.txt;
    wsp.textContent = z.boton;
    wsp.href = wspHref(z.msg || `Hola Service Plus! Estoy en ${z.nombre} y quiero coordinar una visita del service.`);
    Object.entries(capas).forEach(([k, capa]) => {
      capa.setStyle(clave === 'otra' ? estilos.base : (k === clave ? estilos.activo : estilos.apagado));
    });
    encuadrar(clave === 'otra' ? null : clave);
  };

  if (mapaEl && typeof L !== 'undefined') {
    mapa = L.map(mapaEl, {
      zoomControl: false,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      scrollWheelZoom: false,
      dragging: !L.Browser.mobile,
      tap: false,
      attributionControl: true
    }).setView([-34.56, -58.49], 11);
    L.control.zoom({ position: 'topright' }).addTo(mapa);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap'
    }).addTo(mapa);
    Object.entries(ZONAS).forEach(([k, z]) => {
      if (!z.coords) return;
      const capa = L.polygon(z.coords, estilos.base).addTo(mapa);
      capa.bindTooltip(z.nombre, { permanent: true, direction: 'center', className: 'zona-label' });
      capa.on('click', () => elegir(k));
      capas[k] = capa;
    });
    encuadrar(null);
    let t = 0;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        mapa.invalidateSize();
        const activo = botones.find(b => b.getAttribute('aria-pressed') === 'true')?.dataset.zona;
        encuadrar(activo && activo !== 'otra' ? activo : null);
      }, 200);
    });
  }

  botones.forEach(b => b.addEventListener('click', () => elegir(b.dataset.zona)));
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
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el arrastre funciona igual */ }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
      setTimeout(() => vp.classList.remove('dragging'), 60);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initRail() {
  const vp = document.getElementById('railTrabajos');
  if (!vp) return;
  initRailDrag(vp);
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const sync = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const mover = dir => vp.scrollBy({ left: dir * Math.max(240, vp.clientWidth * 0.7), behavior: reduceMotion ? 'auto' : 'smooth' });
  prev?.addEventListener('click', () => mover(-1));
  next?.addEventListener('click', () => mover(1));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initForm() {
  const form = document.getElementById('form');
  if (!form) return;
  const tel = form.querySelector('#f-tel');
  let mask = null;
  if (tel && typeof IMask !== 'undefined') {
    mask = IMask(tel, { mask: [
      { mask: '+{54} 9 (00) 0000-0000' },
      { mask: '+{54} 9 (000) 000-0000' },
      { mask: '+{54} 9 (0000) 00-0000' }
    ] });
  }
  const reglas = {
    'f-nombre': el => el.value.trim().length >= 2,
    'f-tel': el => el.value.replace(/\D/g, '').length >= (mask ? 13 : 10),
    'f-equipo': el => !!el.value,
    'f-zona': el => !!el.value,
    'f-msj': el => el.value.trim().length >= 4
  };
  const marcar = (el, ok) => {
    const err = document.getElementById(el.getAttribute('aria-describedby'));
    el.setAttribute('aria-invalid', String(!ok));
    if (err) err.hidden = ok;
  };
  const validar = el => {
    const ok = reglas[el.id](el);
    marcar(el, ok);
    return ok;
  };
  Object.keys(reglas).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => { if (el.value) validar(el); });
    el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => { if (el.getAttribute('aria-invalid') === 'true') validar(el); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const campos = Object.keys(reglas).map(id => document.getElementById(id)).filter(Boolean);
    const malos = campos.filter(el => !validar(el));
    if (malos.length) { malos[0].focus(); return; }
    const btn = form.querySelector('[type="submit"]');
    const texto = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      mask?.updateValue();
      campos.forEach(el => el.removeAttribute('aria-invalid'));
      btn.disabled = false;
      btn.textContent = texto;
    }, 800);
  });
}

function initFaq() {
  document.querySelectorAll('.faq__item').forEach(d => d.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

[initWspLinks, initModelBarScroll, initWspFloat, initNav, initCobertura, initRail, initForm, initFaq, initReveals, initHeroMotion].forEach(fn => {
  try { fn(); } catch (e) { console.error(e); }
});
