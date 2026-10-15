(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('contextmenu', event => event.preventDefault());
  document.addEventListener('dragstart', event => event.preventDefault());
  document.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    if (key === 'f12' || (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].includes(key)) || (event.ctrlKey && key === 'u')) event.preventDefault();
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
    window.addEventListener('scroll', () => {
      if (!frame) frame = requestAnimationFrame(update);
    }, { passive: true });
  }

  function initWspFloat() {
    const button = document.getElementById('wsp-float');
    if (!button) return;
    const reveal = () => { if (window.scrollY > 600) button.classList.add('visible'); };
    window.addEventListener('scroll', reveal, { passive: true });
    reveal();
  }

  function initNav() {
    const button = document.querySelector('.menu-toggle');
    const nav = document.getElementById('main-nav');
    if (!button || !nav) return;
    const close = () => {
      nav.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Abrir menú');
      document.body.classList.remove('no-scroll');
    };
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('open', open);
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.classList.toggle('no-scroll', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
    document.addEventListener('click', event => { if (!nav.contains(event.target) && !button.contains(event.target)) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 940) close(); });
  }

  function initReveals() {
    const items = document.querySelectorAll('[data-animate]');
    if (!items.length) return;
    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach(element => element.classList.add('in'));
      return;
    }
    const enter = (element, index) => {
      const delay = Math.min(index * .1, .6);
      element.style.transitionDelay = `${delay}s`;
      element.classList.add('in');
      setTimeout(() => { element.style.transitionDelay = ''; }, (delay + 1.2) * 1000);
    };
    const observer = new IntersectionObserver(entries => {
      let index = 0;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          enter(entry.target, index++);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
    items.forEach(element => observer.observe(element));
    let queued = false;
    const sweep = () => {
      queued = false;
      let index = 0;
      items.forEach(element => {
        if (element.classList.contains('in')) return;
        const rect = element.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          enter(element, index++);
          observer.unobserve(element);
        }
      });
    };
    const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
    requestAnimationFrame(() => requestAnimationFrame(queueSweep));
    window.addEventListener('load', queueSweep);
    window.addEventListener('scroll', queueSweep, { passive: true });
    window.addEventListener('resize', queueSweep, { passive: true });
  }

  initModelBarScroll();
  initWspFloat();
  initNav();
  initReveals();
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('hero-ready')));
})();
