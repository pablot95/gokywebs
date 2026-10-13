(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#main-nav');
  const floatButton = document.querySelector('#wsp-float');
  const modelBar = document.querySelector('.gw-modelos');
  let scrollTimer;

  function closeMenu() {
    if (!menuButton || !menu) return;
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú');
  }

  menuButton?.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', (event) => {
    if (menu?.classList.contains('open') && !menu.contains(event.target) && !menuButton?.contains(event.target)) closeMenu();
  });

  function updateScrollUI() {
    floatButton?.classList.toggle('visible', window.scrollY > 600);
    modelBar?.classList.add('scrolling');
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => modelBar?.classList.remove('scrolling'), 120);
  }
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  floatButton?.classList.toggle('visible', window.scrollY > 600);

  const animated = document.querySelectorAll('[data-animate]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' });
    animated.forEach((element) => observer.observe(element));
  } else {
    animated.forEach((element) => element.classList.add('in'));
  }

  document.addEventListener('contextmenu', (event) => event.preventDefault());
  document.addEventListener('dragstart', (event) => event.preventDefault());
  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (event.key === 'F12' || (event.ctrlKey && (key === 'u' || (event.shiftKey && ['i', 'j', 'c'].includes(key))))) {
      event.preventDefault();
    }
  });
})();
