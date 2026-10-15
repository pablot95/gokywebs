(() => {
  'use strict';
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const modelBar = document.querySelector('.gw-modelos');
  const floatingWhatsApp = document.querySelector('.wsp-float');

  const closeMenu = () => {
    if (!menu || !nav) return;
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Abrir menú');
    document.body.classList.remove('no-scroll');
  };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('no-scroll', open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => {
    if (nav && menu && !nav.contains(event.target) && !menu.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (innerWidth > 900) closeMenu(); });

  let timer = 0, frame = 0;
  window.addEventListener('scroll', () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      floatingWhatsApp?.classList.toggle('visible', scrollY > 600);
      if (!modelBar) return;
      if (scrollY <= 8) { modelBar.classList.remove('gw-modelos--scrolling'); return; }
      modelBar.classList.add('gw-modelos--scrolling');
      clearTimeout(timer);
      timer = setTimeout(() => modelBar.classList.remove('gw-modelos--scrolling'), 120);
    });
  }, { passive: true });

  const animated = document.querySelectorAll('[data-animate]');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    animated.forEach(item => item.classList.add('in'));
  } else {
    const observer = new IntersectionObserver(entries => {
      let index = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const item = entry.target;
        item.style.transitionDelay = `${Math.min(index++ * .07, .35)}s`;
        item.classList.add('in');
        observer.unobserve(item);
        setTimeout(() => { item.style.transitionDelay = ''; }, 1100);
      }
    }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
    animated.forEach(item => observer.observe(item));
    requestAnimationFrame(() => requestAnimationFrame(() => animated.forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < innerHeight) { item.classList.add('in'); observer.unobserve(item); }
    })));
  }

  document.querySelector('[data-contact-form]')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim().slice(0, 70);
    const topic = String(data.get('topic') || '').trim();
    const details = String(data.get('details') || '').trim().slice(0, 500);
    if (!name || !topic || !details) return;
    const message = `Hola, soy ${name}. Quiero consultar por fumigación.\nSituación: ${topic}.\nDetalles y zona: ${details}`;
    const url = 'https://wa.me/5491125148369?text=' + encodeURIComponent(message);
    const opened = window.open(url, '_blank');
    if (opened) opened.opener = null;
    else location.href = url;
  });
})();
