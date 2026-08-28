const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491167459403';

document.body.classList.add('js-on');

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

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

function initHeroSign() {
  const sign = document.getElementById('heroSign');
  if (!sign) return;
  const l1 = sign.querySelector('.hero-sign-l1');
  const l2 = sign.querySelector('.hero-sign-l2');
  if (typeof gsap === 'undefined' || reduceMotion) { sign.classList.add('lit', 'breathing'); return; }
  sign.classList.add('lit');
  gsap.set([l1, l2], { opacity: 0 });
  gsap.timeline({ delay: .2, onComplete: () => sign.classList.add('breathing') })
    .to(l1, { opacity: 1, duration: .05 })
    .to(l1, { opacity: .12, duration: .08 })
    .to(l1, { opacity: 1, duration: .04 })
    .to(l1, { opacity: .4, duration: .1 })
    .to(l1, { opacity: 1, duration: .45, ease: 'power2.out' })
    .to(l2, { opacity: 1, duration: .05 }, '-=.32')
    .to(l2, { opacity: .1, duration: .09 })
    .to(l2, { opacity: 1, duration: .04 })
    .to(l2, { opacity: .45, duration: .11 })
    .to(l2, { opacity: 1, duration: .55, ease: 'power2.out' });
}

function initHeroParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const img = document.querySelector('.hero-bg img');
  const fig = document.querySelector('.hero-fig');
  if (img) {
    gsap.fromTo(img, { scale: 1.1 }, { scale: 1, duration: 1.6, ease: 'power2.out' });
    gsap.to(img, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5 }
    });
  }
  if (fig) {
    gsap.to(fig, {
      yPercent: -5, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 }
    });
  }
  const porqueFig = document.querySelector('.porque-fig img');
  if (porqueFig) {
    gsap.fromTo(porqueFig, { yPercent: -4 }, {
      yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: '.porque-fig', start: 'top bottom', end: 'bottom top', scrub: .6 }
    });
  }
}

function hexToRgba(hex, a) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

function initConfigurador() {
  const input = document.getElementById('configTexto');
  const pared = document.getElementById('pared');
  const texto = document.getElementById('paredTexto');
  const reflejo = document.getElementById('paredReflejo');
  const medida = document.getElementById('paredMedida');
  const resumen = document.getElementById('configResumen');
  const resto = document.getElementById('configResto');
  const wsp = document.getElementById('configWsp');
  const cartel = pared?.querySelector('.pared-cartel');
  if (!input || !pared || !texto || !wsp) return;

  const MAX = 16;
  const escalas = { '60': .8, '80': 1, '120': 1.22 };
  const estado = {
    texto: 'TU LOCAL',
    color: 'verde', hex: '#35F58A',
    tam: '80', tamLabel: '80 cm',
    sop: 'acrilico', sopLabel: 'acrílico transparente'
  };

  function reignite() {
    if (reduceMotion || typeof gsap === 'undefined' || !cartel) return;
    gsap.timeline()
      .fromTo(cartel, { scale: .975 }, { scale: 1, duration: .5, ease: 'back.out(2.2)' }, 0)
      .set(texto, { opacity: .2 }, 0)
      .to(texto, { opacity: 1, duration: .05 }, .04)
      .to(texto, { opacity: .35, duration: .07 })
      .to(texto, { opacity: 1, duration: .38, ease: 'power2.out' });
  }

  function render(animar) {
    const t = (input.value || '').trim() || 'TU LOCAL';
    estado.texto = t;
    texto.textContent = t;
    reflejo.textContent = t;
    const fit = t.length > 12 ? .6 : t.length > 8 ? .78 : 1;
    pared.style.setProperty('--escala', escalas[estado.tam] || 1);
    pared.style.setProperty('--fit', fit);
    pared.style.setProperty('--glow', estado.hex);
    pared.style.setProperty('--glow-soft', hexToRgba(estado.hex, .5));
    pared.dataset.soporte = estado.sop;
    medida.textContent = estado.tamLabel;
    resto.textContent = Math.max(0, MAX - t.length);
    resumen.innerHTML = `Cartel de neón LED que dice <b>«${esc(t)}»</b>, en <b>${esc(estado.color)}</b>, de <b>${esc(estado.tamLabel)}</b>, sobre <b>${esc(estado.sopLabel)}</b>.`;
    const msg = `Hola David! Vi la web de Multiservice Ya y quiero un cartel de neón LED que diga "${t}", en ${estado.color}, de ${estado.tamLabel}, sobre ${estado.sopLabel}. ¿Me pasás el presupuesto?`;
    wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
    if (animar) reignite();
  }

  function marcar(grupo, btn) {
    grupo.querySelectorAll('.chip').forEach(c => {
      const on = c === btn;
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  let tecleo;
  input.addEventListener('input', () => {
    clearTimeout(tecleo);
    render(false);
    tecleo = setTimeout(() => reignite(), 260);
  });

  const gColor = document.getElementById('chipsColor');
  gColor?.addEventListener('click', e => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    estado.color = btn.dataset.color;
    estado.hex = btn.dataset.hex;
    marcar(gColor, btn);
    render(true);
  });

  const gTam = document.getElementById('chipsTam');
  gTam?.addEventListener('click', e => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    estado.tam = btn.dataset.tam;
    estado.tamLabel = btn.dataset.label;
    marcar(gTam, btn);
    render(true);
  });

  const gSop = document.getElementById('chipsSop');
  gSop?.addEventListener('click', e => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    estado.sop = btn.dataset.sop;
    estado.sopLabel = btn.dataset.label;
    marcar(gSop, btn);
    render(true);
  });

  wsp.addEventListener('click', () => showToast('Te abrimos WhatsApp con tu cartel ya cargado.'));

  render(false);
}

function initCircuito() {
  const stage = document.getElementById('circuitoStage');
  const live = document.getElementById('cirLive');
  const pasos = Array.from(document.querySelectorAll('#circuitoPasos li'));
  const nodos = Array.from(document.querySelectorAll('.cir-nodo'));
  if (!stage || !live || !pasos.length) return;

  const largo = live.getTotalLength();
  live.style.strokeDasharray = largo;

  const encenderTodo = () => {
    stage.classList.add('no-choreo');
    live.style.strokeDashoffset = 0;
    pasos.forEach(li => li.classList.add('is-on'));
    nodos.forEach(n => n.classList.add('on'));
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    encenderTodo();
    return;
  }

  live.style.strokeDashoffset = largo;
  const paso = 1 / pasos.length;

  const setProgreso = p => {
    live.style.strokeDashoffset = largo * (1 - p);
    const idx = Math.min(pasos.length - 1, Math.floor(p / paso));
    pasos.forEach((li, i) => li.classList.toggle('is-on', i === idx));
    nodos.forEach((n, i) => n.classList.toggle('on', p >= i * paso));
  };

  const crear = (start, end) => {
    const t = ScrollTrigger.create({
      trigger: stage, start, end,
      scrub: .6,
      invalidateOnRefresh: true,
      onUpdate: self => setProgreso(self.progress)
    });
    return () => t.kill();
  };

  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => crear('top center', 'bottom center'));
  mm.add('(max-width: 900px)', () => crear('top top', 'bottom bottom'));

  setProgreso(0);
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 901px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
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
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  window.addEventListener('resize', syncInert, { passive: true });
  syncInert();
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initAnio() {
  const el = document.getElementById('anio');
  if (el) el.textContent = new Date().getFullYear();
}

initHeroSign();
initHeroParallax();
initConfigurador();
initCircuito();
initReveals();
initNav();
initWspFloat();
initAnio();
