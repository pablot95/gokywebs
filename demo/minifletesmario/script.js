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
  addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
}

function initMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;
  const close = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    nav.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  };
  toggle.addEventListener('click', () => {
    const opening = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(opening));
    toggle.setAttribute('aria-label', opening ? 'Cerrar menú' : 'Abrir menú');
    nav.classList.toggle('is-open', opening);
    document.body.classList.toggle('no-scroll', opening);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) close();
  });
  addEventListener('resize', () => {
    if (innerWidth > 700) close();
  });
}

function initReveals() {
  const items = [...document.querySelectorAll('[data-animate]')];
  if (!items.length || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -5% 0px', threshold: .05 });
  items.forEach(item => observer.observe(item));
}

initModelBarScroll();
initMenu();
initReveals();
