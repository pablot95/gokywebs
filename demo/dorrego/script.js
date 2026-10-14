const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

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
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const enter = (el, n) => {
    const delay = Math.min(n * .1, .6);
    el.style.transitionDelay = `${delay}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (delay + 1.2) * 1000);
  };
  const io = new IntersectionObserver(entries => {
    let n = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) { enter(entry.target, n++); io.unobserve(entry.target); }
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
      if (r.bottom > 0 && r.top < window.innerHeight) { enter(el, n++); io.unobserve(el); }
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

function initMenu() {
  const toggle = document.querySelector('.menu-button');
  const nav = document.querySelector('.nav');
  if (!toggle || !nav) return;
  const close = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menú'); };
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  document.addEventListener('click', e => { if (!nav.contains(e.target) && !toggle.contains(e.target)) close(); });
}

function initGallery() {
  const dialog = document.querySelector('.gallery-dialog');
  const tiles = [...document.querySelectorAll('[data-gallery]')];
  if (!dialog || !tiles.length || !dialog.showModal) return;
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('figcaption');
  let current = 0;
  let opener = null;
  const show = index => {
    current = (index + tiles.length) % tiles.length;
    const source = tiles[current].querySelector('img');
    image.src = source.src;
    image.alt = source.alt;
    caption.textContent = tiles[current].querySelector('span').textContent.trim();
  };
  tiles.forEach((tile, index) => tile.addEventListener('click', () => {
    opener = tile;
    show(index);
    dialog.showModal();
    document.body.classList.add('no-scroll');
  }));
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.dialog-prev').addEventListener('click', () => show(current - 1));
  dialog.querySelector('.dialog-next').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.classList.remove('no-scroll'); opener?.focus(); });
  document.addEventListener('keydown', e => {
    if (!dialog.open) return;
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
}

function initWhatsAppFloat() {
  const link = document.querySelector('.whatsapp-float');
  if (!link) return;
  const update = () => { if (window.scrollY > 500) link.classList.add('is-visible'); };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

initModelBarScroll();
initMenu();
initGallery();
initWhatsAppFloat();
initReveals();
