document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

function initDevToolsGuard() {
  let overlay = null;
  let open = false;
  setInterval(() => {
    const isOpen = window.outerWidth - window.innerWidth > 200 || window.outerHeight - window.innerHeight > 200;
    if (isOpen === open) return;
    open = isOpen;
    if (open) {
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'devtools-overlay';
        overlay.innerHTML = '<p>Contenido protegido.</p>';
        document.body.appendChild(overlay);
      }
      overlay.classList.add('visible');
    } else if (overlay) {
      overlay.classList.remove('visible');
    }
  }, 800);
}

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = typeof gsap !== 'undefined';
const hasST = typeof ScrollTrigger !== 'undefined';

if (hasGsap && hasST) gsap.registerPlugin(ScrollTrigger);

if (!hasGsap) {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1;
    el.style.transform = 'none';
  });
}

function esc(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    wrap.setAttribute('aria-live', 'polite');
    document.body.appendChild(wrap);
  }
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

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  if (!toggle || !nav) return;
  const close = () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
  };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      close();
      toggle.focus();
    }
  });
  document.addEventListener('click', e => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) close();
  });
}

function initMarquee() {
  const track = document.getElementById('marquee-track');
  if (!track) return;
  track.innerHTML += track.innerHTML;
}

function initHero() {
  const scene = document.getElementById('hero-scene');
  if (hasGsap && !reduced) {
    const parts = gsap.utils.toArray('[data-hero]');
    gsap.set(parts, { opacity: 0, y: 26 });
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo('.hero__bg img', { scale: 1.09 }, { scale: 1, duration: 1.6, ease: 'power2.out' }, 0)
      .to(parts, { opacity: 1, y: 0, duration: .95, stagger: .11 }, .15);
  }
  if (!scene) return;
  if (reduced || window.matchMedia('(hover: none)').matches) return;
  let raf = 0;
  window.addEventListener('mousemove', e => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const r = scene.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const x = (e.clientX - (r.left + r.width / 2)) / r.width;
      const y = (e.clientY - (r.top + r.height / 2)) / r.height;
      scene.style.setProperty('--px', Math.max(-1, Math.min(1, x)).toFixed(3));
      scene.style.setProperty('--py', Math.max(-1, Math.min(1, y)).toFixed(3));
    });
  }, { passive: true });
}

function initReveals() {
  if (!hasGsap || !hasST) return;
  const items = gsap.utils.toArray('[data-animate]');
  if (reduced) {
    gsap.set(items, { opacity: 1, x: 0, y: 0, clearProps: 'clipPath,transform' });
    return;
  }
  items.forEach(el => {
    const type = el.getAttribute('data-animate');
    const delay = Number(el.getAttribute('data-animate-stagger') || 0) * .11;
    const from = { opacity: 0 };
    const to = { opacity: 1, duration: .95, ease: 'power3.out', delay };

    if (type === 'up') { from.y = 40; to.y = 0; }
    if (type === 'side') { from.x = -32; to.x = 0; }
    if (type === 'wipe') {
      from.clipPath = 'inset(0 0 105% 0)';
      to.clipPath = 'inset(0 0 -5% 0)';
      to.duration = 1.05;
      el.classList.add('sweep');
    }
    if (type === 'mask') {
      from.clipPath = 'inset(105% 0 0 0)';
      to.clipPath = 'inset(-2% 0 0 0)';
      to.duration = 1.2;
      const img = el.querySelector('img');
      if (img) gsap.fromTo(img, { scale: 1.16 }, {
        scale: 1, duration: 1.5, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    }

    to.scrollTrigger = { trigger: el, start: 'top 88%', once: true };
    to.onStart = () => el.classList.add('is-in');
    gsap.fromTo(el, from, to);
  });
}

function initRoute() {
  const section = document.querySelector('.route');
  const line = document.getElementById('routemap-line');
  const van = document.getElementById('routemap-van');
  const stops = Array.prototype.slice.call(document.querySelectorAll('.stop'));
  const marks = Array.prototype.slice.call(document.querySelectorAll('.wp'));
  if (!section || !line || !van || !stops.length) return;

  const len = line.getTotalLength();
  line.style.strokeDasharray = String(len);
  line.style.strokeDashoffset = String(len);

  const counted = new Set();
  const countKm = index => {
    const el = stops[index] ? stops[index].querySelector('.km') : null;
    if (!el || counted.has(index)) return;
    counted.add(index);
    const target = Number(el.getAttribute('data-km') || 0);
    if (!target) { el.textContent = '0'; return; }
    if (!hasGsap || reduced) { el.textContent = target.toLocaleString('es-AR'); return; }
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.1,
      ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString('es-AR'); }
    });
  };

  let current = -1;
  const setActive = index => {
    if (index === current) return;
    current = index;
    stops.forEach((s, i) => s.classList.toggle('is-active', i === index));
    marks.forEach((m, i) => m.classList.toggle('is-active', i === index));
    countKm(index);
  };

  const place = p => {
    const t = Math.max(0.0005, Math.min(1, p));
    const pt = line.getPointAtLength(len * t);
    const next = line.getPointAtLength(Math.min(len, len * t + 8));
    const ang = Math.atan2(next.y - pt.y, next.x - pt.x) * 180 / Math.PI;
    van.setAttribute('transform', `translate(${pt.x.toFixed(2)} ${pt.y.toFixed(2)}) rotate(${ang.toFixed(2)})`);
  };

  const draw = p => {
    const clamped = Math.max(0, Math.min(1, p));
    line.style.strokeDashoffset = String(len * (1 - clamped));
    place(clamped);
    setActive(clamped < .3 ? 0 : clamped < .58 ? 1 : clamped < .84 ? 2 : 3);
  };

  const showAll = () => {
    section.classList.add('route--static');
    line.style.strokeDashoffset = '0';
    place(1);
    stops.forEach(s => s.classList.add('is-active'));
    marks.forEach(m => m.classList.add('is-active'));
    stops.forEach((s, i) => countKm(i));
  };

  if (!hasGsap || !hasST || reduced) { showAll(); return; }

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1025px)', () => {
    draw(0);
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=170%',
      pin: '#route-pin',
      scrub: .6,
      onUpdate: self => draw(self.progress)
    });
    return () => { st.kill(); };
  });
  mm.add('(max-width: 1024px)', () => {
    showAll();
    return () => {
      section.classList.remove('route--static');
      stops.forEach(s => s.classList.remove('is-active'));
      marks.forEach(m => m.classList.remove('is-active'));
      current = -1;
      counted.clear();
    };
  });
}

function initTripForm() {
  const form = document.getElementById('tripform');
  if (!form) return;
  const destino = document.getElementById('f-destino');

  destino.addEventListener('input', () => {
    if (destino.value.trim()) destino.removeAttribute('aria-invalid');
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!destino.value.trim()) {
      destino.setAttribute('aria-invalid', 'true');
      destino.focus();
      showToast('Nos falta el destino para poder cotizarte.');
      return;
    }

    const val = id => {
      const el = document.getElementById(id);
      return el && el.value ? el.value.trim() : '';
    };
    const servicio = val('f-servicio');
    const origen = val('f-origen') || 'Campana';
    const dest = val('f-destino');
    const fecha = val('f-fecha');
    const hora = val('f-hora');
    const pas = Number(val('f-pasajeros') || 0);
    const mas = Number(val('f-mascotas') || 0);
    const detalle = val('f-detalle');

    let cuando = '';
    if (fecha) {
      const parts = fecha.split('-');
      cuando = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    if (hora) cuando = cuando ? `${cuando} a las ${hora} h` : `a las ${hora} h`;

    const viajan = [];
    if (pas > 0) viajan.push(`${pas} ${pas === 1 ? 'persona' : 'personas'}`);
    if (mas > 0) viajan.push(`${mas} ${mas === 1 ? 'mascota' : 'mascotas'}`);

    const lineas = [
      'Hola Traslados Vic, quiero pedir un presupuesto.',
      `Servicio: ${servicio}`,
      `Tramo: ${origen} a ${dest}`
    ];
    if (cuando) lineas.push(`Cuándo: ${cuando}`);
    if (viajan.length) lineas.push(`Viajan: ${viajan.join(' y ')}`);
    if (detalle) lineas.push(`Detalle: ${detalle}`);

    const btn = form.querySelector('button[type="submit"]');
    const label = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = 'Armando el mensaje…';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = label;
      showToast('Listo: revisá el mensaje y enviálo por WhatsApp.');
      window.open('https://wa.me/5493489323365?text=' + encodeURIComponent(lineas.join('\n')), '_blank', 'noopener');
    }, 700);
  });
}

function initMap() {
  const node = document.getElementById('map');
  if (!node || typeof L === 'undefined') return;
  const map = L.map(node, {
    center: [-34.1637, -58.9594],
    zoom: 13,
    scrollWheelZoom: false,
    attributionControl: true
  });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19
  }).addTo(map);
  L.circleMarker([-34.1637, -58.9594], {
    radius: 9,
    color: '#8fc0ff',
    weight: 2,
    fillColor: '#3b86ff',
    fillOpacity: .9
  }).addTo(map).bindPopup('Traslados Vic — base en Campana');
}

function init() {
  document.body.classList.add('js-ready');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  initDevToolsGuard();
  initWspFloat();
  initScrollProgress();
  initNav();
  initMarquee();
  initHero();
  initReveals();
  initRoute();
  initTripForm();
  initMap();

  if (hasST) {
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
