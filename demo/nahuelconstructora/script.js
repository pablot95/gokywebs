(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
      e.preventDefault();
    }
  });

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }
  if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  function initNav() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');
    const closeBtn = document.getElementById('navClose');
    if (!toggle || !nav) return;
    const header = document.querySelector('.site-header');
    let bd = document.querySelector('.nav-backdrop');
    if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; header.appendChild(bd); }
    const close = () => {
      nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
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
  }

  function initWspFloat() {
    const btn = document.getElementById('wsp-float');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
    }, { passive: true });
  }

  function initReveals() {
    const items = document.querySelectorAll('[data-animate]');
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

  function prepStrokes(paths) {
    const lengths = [];
    paths.forEach(p => {
      const L = p.getTotalLength ? p.getTotalLength() : 0;
      lengths.push(L);
      if (L) { p.style.strokeDasharray = L; p.style.strokeDashoffset = L; }
    });
    return lengths;
  }

  function initHero() {
    const planPaths = document.querySelectorAll('#heroPlan path');
    if (typeof gsap === 'undefined' || reduceMotion) return;
    prepStrokes(planPaths);
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to(planPaths, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', stagger: 0.07 }, 0)
      .from('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.7 }, 0.15)
      .from('.hero-title .line-inner', { yPercent: 112, duration: 1, stagger: 0.13 }, 0.25)
      .from('.hero-sub', { y: 22, opacity: 0, duration: 0.8 }, 0.7)
      .from('.hero-cta .btn', { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 }, 0.85)
      .from('.hero-chips li', { y: 14, opacity: 0, duration: 0.5, stagger: 0.07 }, 1)
      .from('.hero-block', { scale: 0.92, opacity: 0, duration: 0.9, transformOrigin: 'center bottom' }, 0.4)
      .from('.hero-prota', { y: 70, opacity: 0, duration: 1 }, 0.6)
      .from('.hero-tag', { x: -24, opacity: 0, duration: 0.7 }, 1.05)
      .from('.hero-sello', { scale: 0.5, opacity: 0, duration: 0.7, ease: 'back.out(1.7)' }, 1.15)
      .from('.hero-cue', { opacity: 0, duration: 0.8 }, 1.4);
    gsap.to('#heroPlan', {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
    });
  }

  function initParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
    gsap.to('.mani-media img', {
      yPercent: 7, scale: 1.06, ease: 'none',
      scrollTrigger: { trigger: '.mani-media', start: 'top bottom', end: 'bottom top', scrub: 0.6 }
    });
    gsap.fromTo('.claim-big', { x: 40 }, {
      x: -40, ease: 'none',
      scrollTrigger: { trigger: '.claim', start: 'top bottom', end: 'bottom top', scrub: 0.8 }
    });
    gsap.to('.claim-f1', { y: -26, ease: 'none', scrollTrigger: { trigger: '.claim', start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
    gsap.to('.claim-f2', { y: 26, ease: 'none', scrollTrigger: { trigger: '.claim', start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
  }

  function initCotas() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
    document.querySelectorAll('.cota-line').forEach(el => {
      gsap.from(el, {
        scaleX: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
  }

  function initCounters() {
    const nums = document.querySelectorAll('.stat-num[data-count]');
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
      nums.forEach(el => { el.textContent = el.getAttribute('data-count'); });
      return;
    }
    nums.forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.6, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.v); },
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
  }

  function initClaim() {
    const el = document.getElementById('claimBig');
    if (!el) return;
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => `<span class="w">${w}</span>`).join(' ');
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
      el.querySelectorAll('.w').forEach(s => { s.style.color = 'var(--color-text)'; });
      return;
    }
    gsap.to(el.querySelectorAll('.w'), {
      color: '#2C2114', stagger: 0.15, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 82%', end: 'top 40%', scrub: 0.5 }
    });
  }

  function initProceso() {
    const stage = document.getElementById('procStage');
    if (!stage) return;
    const pasos = stage.querySelectorAll('.proc-paso');
    const fotos = stage.querySelectorAll('.proc-foto');
    const sello = stage.querySelector('.proc-sello');
    const planPaths = stage.querySelectorAll('.proc-plan path');

    const setStep = p => {
      const idx = Math.min(3, Math.floor(p * 4));
      pasos.forEach((el, i) => el.classList.toggle('is-on', i === idx));
    };

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
      pasos.forEach(el => el.classList.add('is-on'));
      fotos.forEach((f, i) => { f.style.clipPath = 'none'; f.style.opacity = i === fotos.length - 1 ? 1 : 0; });
      if (sello) sello.style.opacity = 1;
      return;
    }

    gsap.set(fotos[0], { clipPath: 'inset(100% 0 0 0)' });
    gsap.set(fotos[1], { clipPath: 'inset(0 0 0 100%)' });
    gsap.set(fotos[2], { clipPath: 'circle(0% at 50% 55%)' });
    gsap.set(sello, { scale: 0, rotate: -20 });
    prepStrokes(planPaths);

    const buildTl = trigger => {
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: trigger });
      tl.to(planPaths, { strokeDashoffset: 0, duration: 0.9, stagger: 0.05 }, 0.05)
        .to(fotos[0], { clipPath: 'inset(0% 0 0 0)', duration: 0.8 }, 1.1)
        .to(fotos[1], { clipPath: 'inset(0 0 0 0%)', duration: 0.8 }, 2.1)
        .to(fotos[2], { clipPath: 'circle(120% at 50% 55%)', duration: 0.8 }, 3.1)
        .to(sello, { scale: 1, rotate: -6, duration: 0.3, ease: 'back.out(1.6)' }, 3.75)
        .to({}, { duration: 0.25 });
      return tl;
    };

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
      buildTl({
        trigger: stage, start: 'top top', end: '+=240%', pin: true, scrub: 0.6,
        invalidateOnRefresh: true, onUpdate: self => setStep(self.progress)
      });
      setStep(0);
    });
    mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
      stage.classList.add('is-sticky-mobile');
      requestAnimationFrame(() => ScrollTrigger.refresh());
      buildTl({
        trigger: stage, start: 'top top', end: 'bottom bottom', scrub: 0.6,
        invalidateOnRefresh: true, onUpdate: self => setStep(self.progress)
      });
      setStep(0);
      return () => stage.classList.remove('is-sticky-mobile');
    });
  }

  function initYear() {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  initNav();
  initWspFloat();
  initReveals();
  initYear();
  initHero();
  initParallax();
  initCotas();
  initCounters();
  initClaim();
  initProceso();

})();
