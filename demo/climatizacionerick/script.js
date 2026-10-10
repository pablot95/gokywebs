const WHATSAPP_NUMBER = '5491124696351';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const wspHref = texto => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
const num = (n, dec = 0) => Number(n).toLocaleString('es-AR', { minimumFractionDigits: dec, maximumFractionDigits: dec });

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    (document.querySelector('.site-header') || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 961px)');
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
  syncInert();
}

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => { a.href = wspHref(a.dataset.wspMsg); });
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, duration: 1.2 }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.42)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.58)
    .from(hero.querySelectorAll('.hero-firma'), { y: 16, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.75)
    .from(hero.querySelectorAll('.hero-cota'), { scaleX: 0, opacity: 0, transformOrigin: '0% 50%', duration: 1.1, clearProps: 'transform,opacity' }, 0.5);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const media = document.querySelector('.hero-media');
  const pic = media?.querySelector('picture');
  if (!pic) return;
  gsap.fromTo(pic, { yPercent: -3 }, {
    yPercent: 3,
    ease: 'none',
    scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true },
  });
}

const CALC = {
  solPorM2: { poco: 100, tarde: 120, mucho: 140 },
  ambiente: { dormitorio: 1, living: 1, cocina: 1.15, local: 1.2 },
  nombreAmbiente: { dormitorio: 'Dormitorio', living: 'Living o comedor', cocina: 'Cocina', local: 'Local u oficina' },
  nombreSol: { poco: 'Poco sol', tarde: 'Sol de tarde', mucho: 'Mucho sol' },
  porPersona: 100,
  equipos: [2250, 3000, 4500, 5500, 6000],
};

function calcularFrigorias({ largo, ancho, ambiente, sol, personas }) {
  const m2 = largo * ancho;
  const base = m2 * (CALC.solPorM2[sol] || CALC.solPorM2.poco);
  const total = Math.round((base * (CALC.ambiente[ambiente] || 1) + Math.max(0, personas - 2) * CALC.porPersona) / 50) * 50;
  const equipo = CALC.equipos.find(e => e >= total) || null;
  return { m2, total, equipo };
}

function dibujarPlano(cont, largo, ancho, m2) {
  const W = 300, H = 210, maxW = 230, maxH = 130, top = 46;
  const s = Math.min(maxW / largo, maxH / ancho);
  const w = Math.max(40, largo * s), h = Math.max(30, ancho * s);
  const x = (W - w) / 2 + 12, y = top + (maxH - h) / 2;
  const f = n => num(n, Number.isInteger(n) ? 0 : 1);
  const aire = Math.min(56, w * 0.42);
  cont.innerHTML = `<svg viewBox="0 0 ${W} ${H}" fill="none" stroke="currentColor" stroke-linecap="round">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#fff" stroke-width="1.6"/>
    <rect x="${x + w / 2 - aire / 2}" y="${y + 5}" width="${aire}" height="9" rx="2" fill="currentColor" fill-opacity=".14" stroke-width="1.2"/>
    <path d="M${x + w / 2 - aire * 0.3} ${y + 22} q${aire * 0.3} 9 ${aire * 0.6} 0 M${x + w / 2 - aire * 0.4} ${y + 33} q${aire * 0.4} 11 ${aire * 0.8} 0" stroke-width="1.1" stroke-opacity=".6"/>
    <path d="M${x} ${y - 16} H${x + w} M${x} ${y - 21} V${y - 11} M${x + w} ${y - 21} V${y - 11}" stroke-width="1"/>
    <path d="M${x - 16} ${y} V${y + h} M${x - 21} ${y} H${x - 11} M${x - 21} ${y + h} H${x - 11}" stroke-width="1"/>
    <text x="${x + w / 2}" y="${y - 24}" text-anchor="middle" fill="currentColor" stroke="none" font-family="Sora, sans-serif" font-size="11" font-weight="600">${f(largo)} m</text>
    <text x="${x - 26}" y="${y + h / 2}" text-anchor="middle" fill="currentColor" stroke="none" font-family="Sora, sans-serif" font-size="11" font-weight="600" transform="rotate(-90 ${x - 26} ${y + h / 2})">${f(ancho)} m</text>
    <text x="${x + w / 2}" y="${y + h / 2 + 12}" text-anchor="middle" fill="#121A3F" stroke="none" font-family="Sora, sans-serif" font-size="${h < 50 ? 12 : 16}" font-weight="700">${num(m2, Number.isInteger(m2) ? 0 : 1)} m²</text>
  </svg>`;
}

function initCalculadora() {
  const calc = document.getElementById('calc');
  if (!calc) return;
  const largo = calc.querySelector('#calc-largo');
  const ancho = calc.querySelector('#calc-ancho');
  const personas = calc.querySelector('#calc-personas');
  const plano = calc.querySelector('[data-plano]');
  const outFrig = calc.querySelector('[data-calc="frig"]');
  const outEquipo = calc.querySelector('[data-calc="equipo"]');
  const cta = calc.querySelector('[data-calc-wsp]');
  if (!largo || !ancho || !personas || !plano || !outFrig || !outEquipo || !cta) return;
  const medida = el => {
    const v = parseFloat(String(el.value).replace(',', '.'));
    return Number.isFinite(v) ? Math.min(30, Math.max(1, v)) : 1;
  };
  const gente = () => Math.min(30, Math.max(1, parseInt(personas.value, 10) || 1));
  const radio = nombre => calc.querySelector(`input[name="${nombre}"]:checked`)?.value;
  let mostrado = parseInt(String(outFrig.textContent).replace(/\D/g, ''), 10) || 0;
  let anim = 0;

  const animarCifra = destino => {
    window.cancelAnimationFrame(anim);
    if (reduceMotion) { outFrig.textContent = num(destino); mostrado = destino; return; }
    const desde = mostrado, t0 = window.performance.now(), dur = 600;
    const paso = t => {
      const p = Math.min(Math.max((t - t0) / dur, 0), 1);
      const v = Math.round(desde + (destino - desde) * (1 - Math.pow(1 - p, 3)));
      outFrig.textContent = num(v);
      mostrado = v;
      if (p < 1) anim = requestAnimationFrame(paso);
    };
    anim = requestAnimationFrame(paso);
  };

  const actualizar = () => {
    const datos = { largo: medida(largo), ancho: medida(ancho), ambiente: radio('calc-ambiente') || 'dormitorio', sol: radio('calc-sol') || 'poco', personas: gente() };
    const r = calcularFrigorias(datos);
    dibujarPlano(plano, datos.largo, datos.ancho, r.m2);
    animarCifra(r.total);
    outEquipo.textContent = r.equipo
      ? `${num(r.equipo)} frigorías (≈ ${num(r.equipo * 1.163 / 1000, 1)} kW)`
      : 'más de 6.000 frigorías: lo evaluamos en la visita';
    const med = n => num(n, Number.isInteger(n) ? 0 : 1);
    const lineas = [
      'Hola Climatización Erick, quiero asesoramiento para un aire acondicionado.',
      '',
      `• Ambiente: ${CALC.nombreAmbiente[datos.ambiente]} de ${med(datos.largo)} × ${med(datos.ancho)} m (${med(Math.round(r.m2 * 10) / 10)} m²)`,
      `• Sol: ${CALC.nombreSol[datos.sol]}`,
      `• Personas: ${datos.personas}`,
      `• Cuenta de la web: ${num(r.total)} frigorías${r.equipo ? ` → equipo de ${num(r.equipo)} frigorías` : ''}`,
      '',
      '¿Me confirman qué equipo conviene?',
    ];
    cta.href = wspHref(lineas.join('\n'));
  };

  calc.addEventListener('input', actualizar);
  calc.addEventListener('change', actualizar);
  [largo, ancho].forEach(el => el.addEventListener('blur', () => { el.value = String(medida(el)); actualizar(); }));
  personas.addEventListener('blur', () => { personas.value = String(gente()); actualizar(); });
  calc.querySelectorAll('[data-paso]').forEach(b => b.addEventListener('click', () => {
    personas.value = String(Math.min(30, Math.max(1, gente() + Number(b.dataset.paso))));
    actualizar();
  }));
  cta.addEventListener('click', () => showToast('Te abrimos WhatsApp con la cuenta lista para enviar.'));
  actualizar();
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const entrar = (el, n) => {
    const d = Math.min(n * 0.1, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  };
  const io = new IntersectionObserver(entries => {
    let n = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) { entrar(entry.target, n++); io.unobserve(entry.target); }
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
      if (r.bottom > 0 && r.top < window.innerHeight) { entrar(el, n++); io.unobserve(el); }
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

initModelBarScroll();
initNav();
initWspLinks();
initWspFloat();
initCalculadora();
initHeroMotion();
initParallax();
initReveals();
