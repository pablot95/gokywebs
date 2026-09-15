const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WHATSAPP_NUMBER = '5493516373982';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
const tramo = (p, a, b) => clamp01((p - a) / (b - a));
const suave = t => t * t * (3 - 2 * t);
const mezcla = (a, b, t) => a + (b - a) * t;
const wspHref = msg => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

const GKY_SLUG_ACENTOS = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u' };
function gkySlugify(s) {
  return String(s || '').toLowerCase()
    .replace(/[áéíóúñü]/g, c => GKY_SLUG_ACENTOS[c] || c)
    .replace(/[^a-z0-9]/g, '');
}

const PALETAS = [
  { nombre: 'Original', vars: { '--color-bg': '#F6F0F2', '--color-bg-alt': '#ECE3E8', '--color-text': '#1A0918', '--color-text-muted': '#5C4658', '--color-primary': '#E600C7', '--color-secondary': '#0FFF4F', '--color-cta': '#BFE612', '--color-cta-text': '#1A0918' } },
  { nombre: 'Cálida', vars: { '--color-bg': '#F7F2EC', '--color-bg-alt': '#EEE5DA', '--color-text': '#1C1008', '--color-text-muted': '#5E4E40', '--color-primary': '#FF5A1F', '--color-secondary': '#FFE14D', '--color-cta': '#2EE6C8', '--color-cta-text': '#1C1008' } },
  { nombre: 'Fría', vars: { '--color-bg': '#F0F3F8', '--color-bg-alt': '#E2E8F1', '--color-text': '#0B1022', '--color-text-muted': '#4A5470', '--color-primary': '#2E8BFF', '--color-secondary': '#7CFFB2', '--color-cta': '#FFE14D', '--color-cta-text': '#0B1022' } },
  { nombre: 'Contraste', vars: { '--color-bg': '#F5F4EF', '--color-bg-alt': '#E8E6DE', '--color-text': '#0D0A0C', '--color-text-muted': '#4E4A4D', '--color-primary': '#FF2BD6', '--color-secondary': '#00FF85', '--color-cta': '#D4FF00', '--color-cta-text': '#0D0A0C' } },
  { nombre: 'Suave', vars: { '--color-bg': '#F7F4F5', '--color-bg-alt': '#EDE7EA', '--color-text': '#2A1A28', '--color-text-muted': '#6A5866', '--color-primary': '#E48AD4', '--color-secondary': '#B9F5C8', '--color-cta': '#D9EF8A', '--color-cta-text': '#2A1A28' } },
];

const ESPACIOS_NUEVOS = ['Boxeo', 'Manualidades', 'Apoyo escolar'];

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

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => { a.href = wspHref(a.dataset.wspMsg); });
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initReveals() {
  const items = [...document.querySelectorAll('[data-animate]')].filter(el => !el.closest('.hero'));
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const items = [...hero.querySelectorAll('[data-animate]')];
  const mostrar = () => items.forEach(el => el.classList.add('in'));
  if (reduceMotion) { mostrar(); return; }
  const orden = ['.hero-copy .eyebrow', '.hero-title', '.pieza-fondo', '.pieza-foto', '.hero-lead', '.pieza-marca', '.hero-ctas', '.pieza-merienda', '.pieza-sticker', '.hero-nota'];
  orden.forEach((sel, i) => {
    const el = hero.querySelector(sel);
    if (el) el.style.transitionDelay = `${(0.08 + i * 0.09).toFixed(2)}s`;
  });
  setTimeout(mostrar, 60);
  window.addEventListener('load', mostrar);
}

function initHeroParallax() {
  const hero = document.querySelector('.hero');
  const collage = hero?.querySelector('.collage');
  if (!collage || reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const capas = [...collage.querySelectorAll('.pieza')]
    .map(p => ({ el: p.querySelector('.mueve'), d: parseFloat(p.dataset.depth || '0') }))
    .filter(c => c.el);
  let tx = 0;
  let ty = 0;
  let pedido = false;
  const pintar = () => {
    pedido = false;
    capas.forEach(c => { c.el.style.transform = `translate3d(${(tx * c.d).toFixed(2)}px, ${(ty * c.d).toFixed(2)}px, 0)`; });
  };
  const pedir = () => { if (!pedido) { pedido = true; requestAnimationFrame(pintar); } };
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - .5) * 1.2;
    ty = ((e.clientY - r.top) / r.height - .5) * 1.2;
    pedir();
  });
  hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; pedir(); });
}

function initDual() {
  const sec = document.getElementById('lo-que-viene');
  const escena = document.getElementById('dualEscena');
  const copyA = document.getElementById('copyA');
  const copyB = document.getElementById('copyB');
  const fondoA = document.getElementById('fondoA');
  const fondoB = document.getElementById('fondoB');
  const hudNum = document.getElementById('hudNum');
  const hudNuevo = document.getElementById('hudNuevo');
  if (!sec || !escena || !copyA || !copyB || !fondoA || !fondoB) return;

  let cuenta = -1;
  const setCuenta = n => {
    if (n === cuenta || !hudNum) return;
    const subio = cuenta !== -1 && n > cuenta;
    cuenta = n;
    hudNum.textContent = String(4 + n);
    if (hudNuevo) hudNuevo.textContent = n === 0 ? 'abiertos hoy' : `+ ${ESPACIOS_NUEVOS[n - 1]}`;
    if (subio && !reduceMotion) {
      hudNum.classList.remove('pop');
      void hudNum.offsetWidth;
      hudNum.classList.add('pop');
    }
  };

  if (reduceMotion) {
    setCuenta(ESPACIOS_NUEVOS.length);
    return;
  }

  const progreso = () => {
    const r = sec.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    return total > 0 ? clamp01(-r.top / total) : 0;
  };

  const pintar = p => {
    const w = mezcla(108, -8, suave(tramo(p, .04, .70)));
    escena.style.setProperty('--w', w.toFixed(2));

    const saleA = suave(tramo(p, .08, .28));
    copyA.style.transform = `translateX(${mezcla(0, -70, saleA).toFixed(1)}px)`;
    copyA.style.opacity = (1 - saleA).toFixed(3);
    copyA.style.pointerEvents = saleA > .85 ? 'none' : 'auto';
    fondoA.style.transform = `scale(${mezcla(1, 1.07, p).toFixed(4)})`;

    const entraB = suave(tramo(p, .46, .68));
    copyB.style.transform = `translateY(${mezcla(40, 0, entraB).toFixed(1)}px)`;
    copyB.style.opacity = entraB.toFixed(3);
    copyB.style.pointerEvents = entraB < .15 ? 'none' : 'auto';
    fondoB.style.transform = `scale(${mezcla(1.09, 1, suave(tramo(p, .18, .9))).toFixed(4)})`;

    setCuenta([75, 45, 15].filter(x => w < x).length);
  };

  const calcular = () => pintar(progreso());
  let pedido = false;
  const pedir = () => {
    if (pedido) return;
    pedido = true;
    requestAnimationFrame(() => { pedido = false; calcular(); });
  };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', calcular);
  calcular();
}

function initHoy() {
  const fila = document.querySelector(`.dia[data-dia="${new Date().getDay()}"]`);
  if (!fila) return;
  fila.classList.add('is-hoy');
  const nota = document.getElementById('pizarraHoy');
  if (nota) nota.textContent = 'Marcamos el día de hoy. Confirmá el horario por WhatsApp antes de venir.';
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false;
  let moved = false;
  let startX = 0;
  let startScroll = 0;
  let pointerId = null;
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
      try { vp.setPointerCapture?.(pointerId); } catch { vp.classList.add('dragging'); }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { vp.classList.remove('dragging'); }
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
  const vp = document.getElementById('railVp');
  if (!vp) return;
  initRailDrag(vp);
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const paso = () => Math.max(260, vp.clientWidth * .7);
  const sync = () => {
    if (prev) prev.disabled = vp.scrollLeft <= 4;
    if (next) next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 4;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('load', sync);
  sync();
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
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: .4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

function copiarTexto(texto) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(texto);
  return new Promise((resolve, reject) => {
    const ta = document.createElement('textarea');
    ta.value = texto;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    if (ok) resolve(); else reject(new Error('copy'));
  });
}

function initCopiar() {
  document.querySelectorAll('[data-copiar]').forEach(btn => {
    btn.addEventListener('click', () => {
      const valor = document.getElementById(btn.dataset.copiar)?.textContent.trim();
      if (!valor) return;
      const label = btn.querySelector('span');
      copiarTexto(valor)
        .then(() => {
          btn.classList.add('ok');
          if (label) label.textContent = 'Copiado';
          showToast('Copiado. La cuenta real de la fundación se carga al pasar la web a producción.');
          setTimeout(() => {
            btn.classList.remove('ok');
            if (label) label.textContent = 'Copiar';
          }, 2200);
        })
        .catch(() => showToast('No pudimos copiarlo: seleccioná el dato y copialo a mano.'));
    });
  });
}

function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const tel = form.querySelector('#f-tel');
  const mask = window.IMask && tel ? window.IMask(tel, {
    mask: [
      { mask: '+{54} 9 (00) 0000-0000' },
      { mask: '+{54} 9 (000) 000-0000' },
      { mask: '+{54} 9 (0000) 00-0000' },
    ],
  }) : null;

  const campos = [
    { el: form.querySelector('#f-nombre'), ok: v => v.trim().length >= 2 },
    { el: tel, ok: v => { const d = (mask ? mask.unmaskedValue : v).replace(/\D/g, ''); return mask ? d.length >= 12 : d.length >= 10; } },
    { el: form.querySelector('#f-motivo'), ok: v => v !== '' },
    { el: form.querySelector('#f-msg'), ok: v => v.trim().length >= 10 },
  ].filter(c => c.el);

  const marcar = (c, valido) => {
    c.el.setAttribute('aria-invalid', valido ? 'false' : 'true');
    const err = document.getElementById(`${c.el.id}-error`);
    if (err) err.hidden = valido;
  };

  campos.forEach(c => {
    c.el.addEventListener('blur', () => { if (c.el.value) marcar(c, c.ok(c.el.value)); });
    c.el.addEventListener('input', () => { if (c.el.getAttribute('aria-invalid') === 'true' && c.ok(c.el.value)) marcar(c, true); });
    c.el.addEventListener('change', () => { if (c.el.getAttribute('aria-invalid') === 'true' && c.ok(c.el.value)) marcar(c, true); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let primero = null;
    campos.forEach(c => {
      const valido = c.ok(c.el.value);
      marcar(c, valido);
      if (!valido && !primero) primero = c.el;
    });
    if (primero) {
      primero.focus();
      primero.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      return;
    }
    const btn = form.querySelector('.form-submit');
    const texto = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = texto;
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      mask?.updateValue();
      campos.forEach(c => c.el.removeAttribute('aria-invalid'));
    }, 800);
  });
}

function initMapa() {
  const el = document.getElementById('mapa');
  const Leaf = window.L;
  if (!el || !Leaf) return;
  const centro = [-31.4167, -64.1833];
  const mapa = Leaf.map(el, { scrollWheelZoom: false }).setView(centro, 14);
  Leaf.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  const icono = Leaf.divIcon({ className: 'pin', html: '<span class="pin-dot"></span>', iconSize: [34, 34], iconAnchor: [17, 40] });
  Leaf.marker(centro, { icon: icono, keyboard: false, title: 'Maranatha en las calles' }).addTo(mapa);
  window.addEventListener('load', () => mapa.invalidateSize());
}

function initColorSwitch() {
  const btn = document.getElementById('color-switch');
  const backdrop = document.getElementById('palette-panel-backdrop');
  const closeBtn = document.getElementById('palette-panel-close');
  const grid = document.getElementById('palette-grid');
  if (!btn || !backdrop || !grid || !PALETAS?.length) return;
  const KEY = 'maranathaenlascalles_paleta';

  const aplicar = (paleta, guardar = true) => {
    const root = document.documentElement.style;
    Object.entries(paleta.vars).forEach(([prop, val]) => root.setProperty(prop, val));
    grid.querySelectorAll('.paleta-swatch').forEach(sw => sw.classList.toggle('activa', sw.dataset.nombre === paleta.nombre));
    if (guardar) { try { localStorage.setItem(KEY, JSON.stringify(paleta)); } catch { grid.dataset.sinGuardar = '1'; } }
  };

  grid.innerHTML = PALETAS.map(p => `
    <button type="button" class="paleta-swatch" data-nombre="${esc(p.nombre)}" aria-label="Paleta ${esc(p.nombre)}"
      style="--sw-bg:${p.vars['--color-bg']};--sw-primary:${p.vars['--color-primary']};--sw-cta:${p.vars['--color-cta']}">
      <span class="paleta-swatch-dots" aria-hidden="true"></span>
      <span class="paleta-swatch-label">${esc(p.nombre)}</span>
    </button>`).join('');
  grid.querySelectorAll('.paleta-swatch').forEach(sw => {
    sw.addEventListener('click', () => aplicar(PALETAS.find(p => p.nombre === sw.dataset.nombre)));
  });

  const open = () => { backdrop.hidden = false; window.lenis?.stop(); document.body.classList.add('no-scroll'); };
  const close = () => { backdrop.hidden = true; window.lenis?.start(); document.body.classList.remove('no-scroll'); btn.focus(); };
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

  const guardada = (() => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } })();
  const activa = PALETAS.find(p => p.nombre === guardada?.nombre) || PALETAS[0];
  grid.querySelectorAll('.paleta-swatch').forEach(sw => sw.classList.toggle('activa', sw.dataset.nombre === activa.nombre));

  const sendBtn = document.getElementById('palette-send');
  sendBtn?.addEventListener('click', () => {
    const elegida = PALETAS.find(p => p.nombre === grid.querySelector('.paleta-swatch.activa')?.dataset.nombre) || activa;
    sendBtn.disabled = true; sendBtn.textContent = 'Enviando…';
    const slugUrl = (location.pathname.match(/\/demo\/([^/]+)/) || [])[1] || document.title;
    const negocio = (document.title.split(/\s[—|]\s|\s-\s/)[0] || document.title || '').trim();
    window.__gkySendPaleta?.({ slug: gkySlugify(slugUrl), negocio, paletaNombre: elegida.nombre, paletaVars: elegida.vars, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la paleta en Firestore:', err));
    setTimeout(() => {
      sendBtn.disabled = false; sendBtn.textContent = 'Enviar estos colores';
      showToast('¡Listo! Le avisamos a Gokywebs.');
    }, 700);
  });
}

initWspLinks();
initNav();
initWspFloat();
initHero();
initHeroParallax();
initDual();
initHoy();
initRail();
initReveals();
initLeeScroll();
initCopiar();
initForm();
initMapa();
initColorSwitch();
