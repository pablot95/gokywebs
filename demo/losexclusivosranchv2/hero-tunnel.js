(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const tunnel = document.getElementById('hero-tunnel');
    const bgSlot = document.getElementById('hero-tunnel-bg');
    if (!tunnel || !bgSlot) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gsapOK = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

    // Sin motion permitido o sin GSAP/ScrollTrigger: los beats ya quedan
    // visibles y apilados en flujo normal por CSS (default, sin .is-tunnel).
    // Nunca se activa el pin ni se carga el iframe pesado del fondo.
    if (reduced || !gsapOK) return;

    gsap.registerPlugin(ScrollTrigger);
    tunnel.classList.add('is-tunnel');

    const beats = Array.from(tunnel.querySelectorAll('.beat'));
    if (!beats.length) return;

    // ── iframe del fondo animado (aislado, decorativo) ──
    const iframe = document.createElement('iframe');
    iframe.src = 'assets/hero-bg.html';
    iframe.title = '';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    bgSlot.appendChild(iframe);

    function postProgress(p) {
      try { iframe.contentWindow?.postMessage({ type: 'scroll', progress: p }, '*'); } catch (_) {}
    }

    // Pausa/reanuda el fondo cuando el túnel sale/entra del viewport — ahorra
    // GPU y batería sin destruir el contexto WebGL (evita recargar el CDN).
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => { iframe.style.visibility = entry.isIntersecting ? 'visible' : 'hidden'; });
      }, { threshold: 0 });
      io.observe(tunnel);
    }

    gsap.set(beats[0], { autoAlpha: 1, scale: 1, filter: 'blur(0px)' });
    for (let i = 1; i < beats.length; i++) {
      gsap.set(beats[i], { autoAlpha: 0, scale: 0.52, filter: 'blur(8px)' });
    }

    const STEP = 1;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: tunnel,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: self => postProgress(self.progress),
      },
    });

    beats.forEach((beat, i) => {
      const t0 = i * STEP;
      const isFirst = i === 0;
      const isLast = i === beats.length - 1;

      if (!isFirst) {
        // Entrada: aparece desde lejos (escala chica + blur), arranca un poco
        // antes de su slot para cruzar con la salida del beat anterior.
        tl.to(beat, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', ease: 'power2.out', duration: STEP * 0.4 }, t0 - STEP * 0.15);
      }
      if (!isLast) {
        // Salida: sigue de largo hacia la cámara (escala > 1) mientras se
        // desvanece. El último beat no anima salida — transiciona al cuerpo.
        tl.to(beat, { autoAlpha: 0, scale: 1.4, filter: 'blur(6px)', ease: 'power2.in', duration: STEP * 0.3 }, t0 + STEP * 0.75);
      }
    });

    window.addEventListener('load', () => ScrollTrigger.refresh());
  });
})();
