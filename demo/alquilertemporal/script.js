const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3400);
}

function observeRevealElements(els, options) {
  const targets = new Map();
  els.forEach(el => {
    const target = el.dataset.animate === 'clip' ? el.parentElement : el;
    if (!target) return;
    const group = targets.get(target) || [];
    group.push(el);
    targets.set(target, group);
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      targets.get(e.target)?.forEach(el => el.classList.add('is-in'));
      io.unobserve(e.target);
    });
  }, options);
  targets.forEach((_, target) => io.observe(target));
}

function initReveal() {
  const els = document.querySelectorAll('[data-animate]');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(el => el.classList.add('is-in')); return;
  }
  observeRevealElements(els, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
}

function menuKeydown(e) { if (e.key === 'Escape') closeMenu(); }
function closeMenu() {
  const menu = document.getElementById('nav-mobile');
  const toggle = document.getElementById('menu-toggle');
  if (!menu || !menu.classList.contains('open')) return;
  menu.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('show');
  toggle?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', menuKeydown);
  toggle?.focus();
}
function initMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('nav-mobile');
  const overlay = document.getElementById('overlay');
  if (!toggle || !menu) return;
  const openMenu = () => {
    menu.classList.add('open');
    overlay?.classList.add('show');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    menu.querySelector('a')?.focus();
    document.addEventListener('keydown', menuKeydown);
  };
  toggle.addEventListener('click', () => { menu.classList.contains('open') ? closeMenu() : openMenu(); });
  overlay?.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    let valido = true;
    form.querySelectorAll('[required]').forEach(campo => {
      const ok = campo.value.trim() !== '' && (campo.type !== 'email' || /.+@.+\..+/.test(campo.value));
      campo.classList.toggle('is-error', !ok);
      if (!ok) valido = false;
    });
    if (!valido) { showToast('Revisá los campos marcados, por favor.'); return; }
    const txt = btn.textContent;
    btn.disabled = true; btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false; btn.textContent = txt; form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 850);
  });
  form.querySelectorAll('[required]').forEach(c => c.addEventListener('input', () => c.classList.remove('is-error')));
}

function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target; io.unobserve(el);
      const end = parseFloat(el.dataset.count);
      const suf = el.dataset.suffix || '';
      if (reduce) { el.textContent = end.toLocaleString('es-AR') + suf; return; }
      const dur = 1400, t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const val = Math.round(end * (1 - Math.pow(1 - p, 3)));
        el.textContent = val.toLocaleString('es-AR') + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

function initMap() {
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;
  const lat = parseFloat(el.dataset.lat), lng = parseFloat(el.dataset.lng), zoom = parseInt(el.dataset.zoom || '15', 10);
  const dark = el.dataset.tiles === 'dark';
  const map = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView([lat, lng], zoom);
  L.tileLayer(`https://{s}.basemaps.cartocdn.com/${dark ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`, {
    attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: 'abcd', maxZoom: 19,
  }).addTo(map);
  const color = el.dataset.marker || '#111';
  const icon = L.divIcon({ className: 'map-pin', html: `<span style="--pin:${color}"></span>`, iconSize: [26, 26], iconAnchor: [13, 26] });
  L.marker([lat, lng], { icon }).addTo(map);
  map.on('click', () => map.scrollWheelZoom.enable());
  map.on('mouseout', () => map.scrollWheelZoom.disable());
  el.dataset.leaflet = 'ready';
}

function initYear() {
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
}

function initAnchors() {
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
      history.replaceState(null, '', id);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-ready');
  initMenu();
  initWspFloat();
  initForm();
  initCounters();
  initMap();
  initYear();
  initAnchors();
  initReveal();
});
