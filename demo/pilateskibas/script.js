const DIAS = [
  { key: 'lun', label: 'Lunes', corto: 'LUN' },
  { key: 'mar', label: 'Martes', corto: 'MAR' },
  { key: 'mie', label: 'Miércoles', corto: 'MIÉ' },
  { key: 'jue', label: 'Jueves', corto: 'JUE' },
  { key: 'vie', label: 'Viernes', corto: 'VIE' },
  { key: 'sab', label: 'Sábado', corto: 'SÁB' }
];

const HORARIOS = {
  lun: [
    { h: '08:00', tipo: 'Mat grupal', cupo: 3 },
    { h: '09:00', tipo: 'Reformer', cupo: 1 },
    { h: '10:00', tipo: 'Mat grupal', cupo: 4 },
    { h: '16:00', tipo: 'Reformer', cupo: 0 },
    { h: '17:00', tipo: 'Mat grupal', cupo: 2 },
    { h: '18:00', tipo: 'Reformer', cupo: 3 },
    { h: '19:00', tipo: 'Mat grupal', cupo: 5 }
  ],
  mar: [
    { h: '08:00', tipo: 'Reformer', cupo: 2 },
    { h: '09:00', tipo: 'Mat grupal', cupo: 0 },
    { h: '10:00', tipo: 'Reformer', cupo: 4 },
    { h: '16:00', tipo: 'Mat grupal', cupo: 3 },
    { h: '17:00', tipo: 'Reformer', cupo: 1 },
    { h: '18:00', tipo: 'Mat grupal', cupo: 4 },
    { h: '19:00', tipo: 'Reformer', cupo: 2 }
  ],
  mie: [
    { h: '08:00', tipo: 'Mat grupal', cupo: 4 },
    { h: '09:00', tipo: 'Reformer', cupo: 3 },
    { h: '10:00', tipo: 'Mat grupal', cupo: 1 },
    { h: '16:00', tipo: 'Reformer', cupo: 2 },
    { h: '17:00', tipo: 'Mat grupal', cupo: 0 },
    { h: '18:00', tipo: 'Reformer', cupo: 4 },
    { h: '19:00', tipo: 'Mat grupal', cupo: 3 }
  ],
  jue: [
    { h: '08:00', tipo: 'Reformer', cupo: 1 },
    { h: '09:00', tipo: 'Mat grupal', cupo: 5 },
    { h: '10:00', tipo: 'Reformer', cupo: 0 },
    { h: '16:00', tipo: 'Mat grupal', cupo: 2 },
    { h: '17:00', tipo: 'Reformer', cupo: 3 },
    { h: '18:00', tipo: 'Mat grupal', cupo: 1 },
    { h: '19:00', tipo: 'Reformer', cupo: 4 }
  ],
  vie: [
    { h: '08:00', tipo: 'Mat grupal', cupo: 2 },
    { h: '09:00', tipo: 'Reformer', cupo: 4 },
    { h: '10:00', tipo: 'Mat grupal', cupo: 3 },
    { h: '16:00', tipo: 'Reformer', cupo: 1 },
    { h: '17:00', tipo: 'Mat grupal', cupo: 4 },
    { h: '18:00', tipo: 'Reformer', cupo: 2 }
  ],
  sab: [
    { h: '09:00', tipo: 'Mat grupal', cupo: 3 },
    { h: '10:00', tipo: 'Reformer', cupo: 2 },
    { h: '11:00', tipo: 'Mat grupal', cupo: 0 }
  ]
};

const WA_NUM = '5491126432081';

function slotsDelDia(key) {
  return HORARIOS[key] || [];
}

function estadoSlot(slot) {
  if (slot.cupo <= 0) return 'completo';
  if (slot.cupo <= 2) return 'ultimos';
  return 'libre';
}

function etiquetaEstado(slot) {
  const e = estadoSlot(slot);
  if (e === 'completo') return 'Completo';
  if (e === 'ultimos') return slot.cupo === 1 ? 'Queda 1 lugar' : `Quedan ${slot.cupo} lugares`;
  return 'Lugares libres';
}

function construirMensaje(diaKey, slot) {
  const dia = DIAS.find(d => d.key === diaKey);
  const nombreDia = dia ? dia.label : diaKey;
  return `Hola! Quiero reservar ${slot.tipo} el ${nombreDia} a las ${slot.h} hs. ¿Me confirmás el lugar?`;
}

function linkReserva(diaKey, slot) {
  return `https://wa.me/${WA_NUM}?text=${encodeURIComponent(construirMensaje(diaKey, slot))}`;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DIAS, HORARIOS, slotsDelDia, estadoSlot, etiquetaEstado, construirMensaje, linkReserva };
}

if (typeof document !== 'undefined') {
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

    function initHero() {
      if (typeof gsap === 'undefined' || reduceMotion) return;
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-bg img', { scale: 1.08, duration: 1.4, ease: 'power2.out' }, 0)
        .from('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.7 }, 0.15)
        .from('.hero-title .line-inner', { yPercent: 112, duration: 1, stagger: 0.13 }, 0.25)
        .from('.hero-sub', { y: 22, opacity: 0, duration: 0.8 }, 0.7)
        .from('.hero-cta .btn', { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 }, 0.85)
        .from('.hero-chips li', { y: 14, opacity: 0, duration: 0.5, stagger: 0.07 }, 1)
        .from('.hero-prota', { y: 80, opacity: 0, duration: 1.05 }, 0.5)
        .from('.hero-eq span', { scaleY: 0, transformOrigin: 'bottom', duration: 0.6, stagger: 0.08 }, 0.9)
        .from('.hero-sello', { scale: 0.5, opacity: 0, duration: 0.7, ease: 'back.out(1.7)' }, 1.1)
        .from('.hero-cue', { opacity: 0, duration: 0.8 }, 1.4);
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.to('.hero-bg img', {
          yPercent: 8, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
        });
      }
    }

    function initEqLines() {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
      document.querySelectorAll('.eq-line').forEach(el => {
        gsap.from(el.querySelectorAll('i'), {
          scaleY: 0, duration: 0.7, ease: 'power3.out', stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 88%' }
        });
      });
    }

    function initChat() {
      const chat = document.getElementById('chatDemo');
      if (!chat) return;
      if (reduceMotion || !('IntersectionObserver' in window)) { chat.classList.add('play'); return; }
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => { if (en.isIntersecting) { chat.classList.add('play'); io.disconnect(); } });
      }, { threshold: 0.4 });
      io.observe(chat);
      window.addEventListener('load', () => {
        const r = chat.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) { chat.classList.add('play'); io.disconnect(); }
      });
    }

    function initSemana() {
      const stage = document.getElementById('semStage');
      if (!stage) return;
      const pasos = stage.querySelectorAll('.sem-paso');
      const cols = stage.querySelectorAll('.sem-col');
      const celdas = stage.querySelectorAll('.sem-col i');
      const pago = stage.querySelector('.sem-pago');
      const badge = stage.querySelector('.sem-badge');

      const setStep = p => {
        const idx = Math.min(3, Math.floor(p * 4));
        pasos.forEach((el, i) => el.classList.toggle('is-on', i === idx));
      };

      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
        pasos.forEach(el => el.classList.add('is-on'));
        celdas.forEach((c, i) => { if (i % 3 === 0) c.classList.add('on'); });
        return;
      }

      gsap.set(cols, { yPercent: 30, opacity: 0 });
      gsap.set(pago, { x: -110, opacity: 0 });
      gsap.set(badge, { scale: 0, rotate: 14 });

      const buildTl = trigger => {
        const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: trigger });
        tl.to(cols, { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.09 }, 0.05)
          .to(celdas, {
            backgroundColor: 'rgba(139, 224, 74, 0.16)',
            borderColor: 'rgba(139, 224, 74, 0.5)',
            duration: 0.09, stagger: 0.045
          }, 1.05)
          .to(pago, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 2.35)
          .to(badge, { scale: 1, rotate: 3, duration: 0.35, ease: 'back.out(1.6)' }, 3.2)
          .to({}, { duration: 0.4 });
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

    function initWidget() {
      const wDias = document.getElementById('wDias');
      const wSlots = document.getElementById('wSlots');
      const wResumen = document.getElementById('wResumen');
      const wCta = document.getElementById('wCta');
      if (!wDias || !wSlots || !wResumen || !wCta) return;

      let diaActivo = 'lun';
      let slotActivo = null;

      const renderDias = () => {
        wDias.innerHTML = DIAS.map(d =>
          `<button type="button" class="widget-dia${d.key === diaActivo ? ' active' : ''}" role="tab" aria-selected="${d.key === diaActivo}" data-dia="${d.key}">${d.corto}</button>`
        ).join('');
      };

      const renderSlots = () => {
        const slots = slotsDelDia(diaActivo);
        wSlots.innerHTML = slots.map((s, i) => {
          const estado = estadoSlot(s);
          const sel = slotActivo && slotActivo.h === s.h ? ' selected' : '';
          return `<button type="button" class="slot${sel}" data-i="${i}" ${estado === 'completo' ? 'disabled' : ''}>
            <span class="slot-hora">${s.h}</span>
            <span class="slot-tipo">${s.tipo}</span>
            <span class="slot-estado">${etiquetaEstado(s)}</span>
          </button>`;
        }).join('');
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      };

      const renderResumen = () => {
        if (!slotActivo) {
          wResumen.textContent = 'Elegí un día y un horario para armar tu reserva.';
          wCta.setAttribute('aria-disabled', 'true');
          return;
        }
        const dia = DIAS.find(d => d.key === diaActivo);
        wResumen.innerHTML = `<strong>${slotActivo.tipo}</strong> · ${dia ? dia.label : ''} ${slotActivo.h} hs — ${etiquetaEstado(slotActivo)}`;
        wCta.href = linkReserva(diaActivo, slotActivo);
        wCta.removeAttribute('aria-disabled');
      };

      wDias.addEventListener('click', e => {
        const btn = e.target.closest('.widget-dia');
        if (!btn) return;
        diaActivo = btn.getAttribute('data-dia');
        slotActivo = null;
        renderDias(); renderSlots(); renderResumen();
      });

      wSlots.addEventListener('click', e => {
        const btn = e.target.closest('.slot');
        if (!btn || btn.disabled) return;
        slotActivo = slotsDelDia(diaActivo)[parseInt(btn.getAttribute('data-i'), 10)] || null;
        renderSlots(); renderResumen();
      });

      renderDias(); renderSlots(); renderResumen();
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
    initEqLines();
    initChat();
    initSemana();
    initWidget();

  })();
}
