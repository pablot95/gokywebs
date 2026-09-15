const WHATSAPP_NUMBER = '5491171152285';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none';
  });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

function initWhatsAppLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => {
    const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(a.dataset.wspMsg)}`;
    a.setAttribute('href', href);
  });
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
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

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) {
      moved = true; vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initServRail() {
  const vp = document.getElementById('servRail');
  if (!vp) return;
  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    if (max <= 1) return;
    const atStart = vp.scrollLeft <= 0, atEnd = vp.scrollLeft >= max - 1;
    if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });
  initRailDrag(vp);
}

function initMagnetic() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || typeof gsap === 'undefined') return;
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * .22, y: (e.clientY - r.top - r.height / 2) * .32, duration: .3 });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: .45, ease: 'elastic.out(1, .55)' }));
  });
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (typeof gsap === 'undefined' || reduceMotion) {
    items.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
    return;
  }
  const presets = {
    up: { y: 0, opacity: 1, duration: .9 },
    left: { x: 0, opacity: 1, duration: .9 },
    scale: { scale: 1, y: 0, opacity: 1, duration: 1 },
    clip: { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 1.1 },
  };
  items.forEach(el => {
    gsap.to(el, {
      ...presets[el.dataset.animate || 'up'],
      ease: 'expo.out',
      delay: parseFloat(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}

function initProcesoChapter() {
  const stage = document.getElementById('procesoStage');
  const grid = document.getElementById('procesoGrid');
  const visual = document.getElementById('procesoVisual');
  const pasos = document.querySelectorAll('#procesoPasos li');
  if (!stage || !grid || !visual || !pasos.length) return;

  const nailColor = document.getElementById('nailColor');
  const nailArt = document.getElementById('nailArt');
  const nailArtDots = nailArt ? nailArt.querySelectorAll('circle') : [];
  const nailGloss = document.getElementById('nailGloss');
  const nailGlow = visual.querySelector('.nail-glow');

  const setStep = progress => {
    const idx = Math.min(pasos.length - 1, Math.floor(progress * pasos.length));
    pasos.forEach(li => li.classList.toggle('is-on', Number(li.dataset.paso) === idx));
  };

  if (typeof gsap === 'undefined') { setStep(0); return; }

  if (reduceMotion) {
    if (nailColor) nailColor.style.clipPath = 'inset(0% 0 0 0)';
    nailArtDots.forEach(dot => { dot.style.opacity = 1; });
    if (nailGloss) nailGloss.style.opacity = .55;
    if (nailGlow) nailGlow.classList.add('is-lit');
    pasos.forEach((li, i) => li.classList.toggle('is-on', i === pasos.length - 1));
    return;
  }

  const buildTimeline = () => {
    const tl = gsap.timeline({ paused: true });
    if (nailColor) tl.to(nailColor, { clipPath: 'inset(0% 0 0 0)', ease: 'none', duration: 1 }, .15);
    if (nailArtDots.length) tl.to(nailArtDots, { opacity: 1, stagger: .05, ease: 'none', duration: .6 }, 1.2);
    if (nailGloss) tl.to(nailGloss, { opacity: .6, x: 14, ease: 'none', duration: .6 }, 2.1);
    if (nailGlow) tl.call(() => nailGlow.classList.add('is-lit'), null, 2.1)
                    .call(() => nailGlow.classList.remove('is-lit'), null, 0);
    return tl;
  };

  ScrollTrigger.matchMedia({
    '(min-width: 1081px)': () => {
      const tl = buildTimeline();
      const st = ScrollTrigger.create({
        trigger: stage, start: 'top top', end: '+=220%', pin: true, scrub: .6,
        anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: self => { tl.progress(self.progress); setStep(self.progress); },
      });
      return () => st.kill();
    },
    '(max-width: 1080px) and (prefers-reduced-motion: no-preference)': () => {
      stage.classList.add('is-sticky-mobile');
      let inner = grid.querySelector('.sticky-inner');
      if (!inner) {
        inner = document.createElement('div');
        inner.className = 'sticky-inner';
        inner.appendChild(visual);
        inner.appendChild(document.getElementById('procesoPasos'));
        grid.appendChild(inner);
      }
      requestAnimationFrame(() => ScrollTrigger.refresh());
      const tl = buildTimeline();
      const st = ScrollTrigger.create({
        trigger: grid, start: 'top top', end: 'bottom bottom', scrub: .6,
        invalidateOnRefresh: true,
        onUpdate: self => { tl.progress(self.progress); setStep(self.progress); },
      });
      return () => { st.kill(); stage.classList.remove('is-sticky-mobile'); };
    },
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initWhatsAppLinks();
  initWspFloat();
  initNav();
  initServRail();
  initMagnetic();
  initReveals();
  initProcesoChapter();
});
