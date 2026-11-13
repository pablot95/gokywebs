const WHATSAPP_NUMBER = '5491131137778';
const reduceMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('dragstart', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if (
    k === 'f12' ||
    (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) ||
    (e.ctrlKey && k === 'u')
  )
    e.preventDefault();
});
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined')
  gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined')
  document
    .querySelectorAll('[data-animate]')
    .forEach((el) => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined')
  window.addEventListener('load', () => ScrollTrigger.refresh());
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
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 220);
  }, 3200);
}
function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  btn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola María José, quiero consultar por los masajes.')}`;
  const show = () => {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
      window.removeEventListener('scroll', show);
    }
  };
  window.addEventListener('scroll', show, { passive: true });
  show();
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
  const desktopMq = window.matchMedia('(min-width: 769px)');
  const close = () => {
    nav.classList.remove('open');
    bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    nav.removeAttribute('role');
    nav.removeAttribute('aria-modal');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open');
    bd.classList.add('open');
    nav.removeAttribute('inert');
    nav.setAttribute('role', 'dialog');
    nav.setAttribute('aria-modal', 'true');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () =>
    nav.classList.contains('open') ? close() : open(),
  );
  closeBtn?.addEventListener('click', () => {
    close();
    toggle.focus();
  });
  bd.addEventListener('click', () => {
    close();
    toggle.focus();
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (!nav.classList.contains('open')) return;
    if (e.key === 'Escape') {
      close();
      toggle.focus();
    }
    if (e.key === 'Tab') {
      const items = [...nav.querySelectorAll('a, button')];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  const syncInert = () => {
    if (desktopMq.matches) {
      close();
      nav.removeAttribute('inert');
    } else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }
  const entrar = (el, n) => {
    const d = Math.min(n * 0.1, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(
      () => {
        el.style.transitionDelay = '';
      },
      (d + 1.2) * 1000,
    );
  };
  const io = new IntersectionObserver(
    (entries) => {
      let n = 0;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entrar(entry.target, n++);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: '0px 0px -7% 0px' },
  );
  items.forEach((el) => io.observe(el));
  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    let n = 0;
    items.forEach((el) => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        entrar(el, n++);
        io.unobserve(el);
      } else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(sweep);
    }
  };
  requestAnimationFrame(() => requestAnimationFrame(queueSweep));
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}
function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.08, duration: 1.6 }, 0);
  tl.from(
    hero.querySelectorAll('.hero-eyebrow'),
    { y: 18, opacity: 0, duration: 0.8, clearProps: 'transform,opacity' },
    0.1,
  )
    .from(
      hero.querySelectorAll('h1'),
      { y: 32, opacity: 0, duration: 1, clearProps: 'transform,opacity' },
      0.2,
    )
    .from(
      hero.querySelectorAll('.hero-lead'),
      { y: 24, opacity: 0, duration: 0.8, clearProps: 'transform,opacity' },
      0.35,
    )
    .from(
      hero.querySelectorAll('.hero-ctas > *'),
      {
        y: 22,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        clearProps: 'transform,opacity',
      },
      0.45,
    )
    .from(
      hero.querySelectorAll('.hero-badge'),
      { opacity: 0, duration: 0.7, clearProps: 'opacity' },
      0.6,
    );
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
    showTimer = setTimeout(
      () => bar.classList.remove('gw-modelos--scrolling'),
      120,
    );
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!frame) frame = requestAnimationFrame(update);
    },
    { passive: true },
  );
}
function initMap() {
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;
  el.textContent = '';
  const map = L.map(el, { scrollWheelZoom: false }).setView(
    [-34.667, -58.392],
    14,
  );
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);
  const observer = new window.ResizeObserver(() => map.invalidateSize());
  observer.observe(el);
}
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const name = form.elements.namedItem('nombre');
  const phone = form.elements.namedItem('telefono');
  const submit = form.querySelector('[type="submit"]');
  let busy = false;
  const mask =
    typeof IMask !== 'undefined'
      ? IMask(phone, { mask: '0000 00000000000' })
      : null;
  const setError = (el, text) => {
    document.getElementById(`${el.id}Error`).textContent = text;
    el.setAttribute('aria-invalid', String(Boolean(text)));
  };
  [name, phone].forEach((el) =>
    el.addEventListener('input', () => setError(el, '')),
  );
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (busy) return;
    const nameValid = name.value.trim().length >= 2;
    const phoneDigits = phone.value.replace(/\D/g, '');
    const phoneValid = phoneDigits.length >= 10 && phoneDigits.length <= 15;
    setError(name, nameValid ? '' : 'Escribí tu nombre para continuar.');
    setError(
      phone,
      phoneValid ? '' : 'Revisá el número: incluí el código de área.',
    );
    if (!nameValid || !phoneValid) {
      (nameValid ? phone : name).focus();
      return;
    }
    busy = true;
    submit.disabled = true;
    const label = submit.innerHTML;
    submit.textContent = 'Enviando…';
    setTimeout(() => {
      showToast(
        '¡Gracias! El envío de mensajes se activa al pasar la web a producción.',
      );
      form.reset();
      if (mask) mask.value = '';
      busy = false;
      submit.disabled = false;
      submit.innerHTML = label;
    }, 800);
  });
  submit.disabled = false;
}
document.querySelectorAll('details').forEach((el) =>
  el.addEventListener('toggle', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }),
);
initNav();
initWspFloat();
initModelBarScroll();
initMap();
initContactForm();
initHeroMotion();
initReveals();
