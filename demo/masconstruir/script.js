const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA = '5491149164154';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const ICO_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const GUIA_AMBIENTES = {
  bano: { nombre: 'Baño', foto: 'images/bano.webp', alt: 'Baño renovado con vanitory blanco, inodoro y mampara de vidrio', trabajos: ['plomeria', 'pintura'] },
  cocina: { nombre: 'Cocina y lavadero', foto: 'images/plomeria.webp', alt: 'Sifón y llaves de paso cromados debajo de una bacha', trabajos: ['plomeria', 'gas'] },
  living: { nombre: 'Living y dormitorios', foto: 'images/living.webp', alt: 'Living de un departamento con piso de madera y ventanal', trabajos: ['seco', 'pintura'] },
  frente: { nombre: 'Frente y exterior', foto: 'images/frente.webp', alt: 'Frente de una casa con paredes claras, puerta negra y jardín', trabajos: ['revestimiento', 'pintura'] },
  casa: { nombre: 'Toda la casa', foto: 'images/pasillo.webp', alt: 'Pasillo de un departamento con paredes recién pintadas y piso de madera', trabajos: ['plomeria', 'gas', 'seco', 'revestimiento', 'pintura'] },
};

const GUIA_TRABAJOS = {
  plomeria: { nombre: 'Plomería', pedir: 'Foto de la pérdida, la grifería o los sanitarios que querés cambiar' },
  gas: { nombre: 'Gas', pedir: 'Foto del artefacto a gas y de su etiqueta con marca y modelo' },
  seco: { nombre: 'Construcción en seco', pedir: 'Largo y alto de la pared o del cielorraso que querés hacer' },
  revestimiento: { nombre: 'Revestimiento plástico', pedir: 'Medidas aproximadas del frente o de la pared a revestir' },
  pintura: { nombre: 'Pintura', pedir: 'Cuántos ambientes son y si hay humedad o pintura descascarada' },
};

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
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
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
  syncInert();
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
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.15)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.4)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55)
    .from(hero.querySelectorAll('.hero-regla'), { scaleX: 0, transformOrigin: '0 50%', duration: 1, clearProps: 'transform' }, 0.7)
    .from(hero.querySelectorAll('.franja, .hero-chips li'), { y: 24, opacity: 0, duration: 1, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7);
}

function initCapas() {
  const sec = document.querySelector('.capas-track');
  if (!sec) return;
  const textos = [...sec.querySelectorAll('.capa-texto')];
  const fotos = [...sec.querySelectorAll('.capa-foto')];
  const marcas = [...sec.querySelectorAll('.capa-marca')];
  const N = Math.min(textos.length, 4);
  if (!N) return;
  const clamp01 = v => Math.max(0, Math.min(1, v));
  let actual = 0;
  let frame = 0;
  const activar = i => {
    if (i === actual) return;
    actual = i;
    textos.forEach((t, k) => { t.classList.toggle('is-on', k === i); t.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
    fotos.forEach((f, k) => f.classList.toggle('is-on', k === i));
    marcas.forEach((m, k) => {
      m.classList.toggle('is-on', k === i);
      m.classList.toggle('is-done', k < i);
      if (k === i) m.setAttribute('aria-current', 'step'); else m.removeAttribute('aria-current');
    });
  };
  const update = () => {
    frame = 0;
    const total = sec.offsetHeight - window.innerHeight;
    const p = total > 0 ? clamp01(-sec.getBoundingClientRect().top / total) : 0;
    const i = Math.min(N - 1, Math.floor(p * N * 0.9999));
    activar(i);
    const local = clamp01(p * N - i);
    marcas.forEach((m, k) => m.style.setProperty('--fill', k < i ? '1' : k === i ? local.toFixed(3) : '0'));
    if (!reduceMotion) {
      const img = fotos[i]?.querySelector('img');
      if (img) img.style.scale = (1.06 - local * 0.06).toFixed(4);
    }
  };
  const ir = i => {
    const top = sec.getBoundingClientRect().top + window.scrollY;
    const total = sec.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + total * ((i + 0.5) / N), behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  marcas.forEach((m, k) => m.addEventListener('click', () => ir(k)));
  document.querySelectorAll('[data-capa]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    ir(Math.min(N - 1, Number(a.dataset.capa) || 0));
  }));
  const pedir = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  update();
}

function initSello() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.sello').forEach(s => {
    const anillo = s.querySelector('.sello-anillo');
    if (!anillo) return;
    ScrollTrigger.create({
      trigger: s,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: st => { anillo.style.transform = `rotate(${(st.progress * 150 - 75).toFixed(1)}deg)`; },
    });
  });
}

function initGuia() {
  const raiz = document.getElementById('guia');
  const res = document.querySelector('.guia-res');
  if (!raiz || !res) return;
  const foto = document.getElementById('guiaFoto');
  const titulo = document.getElementById('guiaTitulo');
  const chips = document.getElementById('guiaChips');
  const pedir = document.getElementById('guiaPedir');
  const wa = document.getElementById('guiaWa');
  const zona = document.getElementById('guiaZona');
  if (!foto || !titulo || !chips || !pedir || !wa) return;
  const valor = n => raiz.querySelector(`input[name="${n}"]:checked`)?.value || '';
  const trabajos = () => [...raiz.querySelectorAll('.guia-trabajos input:checked')].map(i => i.value).filter(t => GUIA_TRABAJOS[t]);
  const enLista = arr => (arr.length <= 1 ? arr.join('') : `${arr.slice(0, -1).join(', ')} y ${arr[arr.length - 1]}`);
  let fotoActual = foto.getAttribute('src');
  const ponerFoto = amb => {
    if (amb.foto === fotoActual) return;
    fotoActual = amb.foto;
    foto.classList.add('cambiando');
    const nueva = new window.Image();
    const poner = () => {
      if (fotoActual !== amb.foto) return;
      foto.src = amb.foto;
      foto.alt = amb.alt;
      foto.classList.remove('cambiando');
    };
    nueva.onload = poner;
    nueva.onerror = poner;
    nueva.src = amb.foto;
    if (nueva.complete) poner();
  };
  const pintar = () => {
    const amb = GUIA_AMBIENTES[valor('ambiente')] || GUIA_AMBIENTES.bano;
    const tipo = valor('inmueble') || 'departamento';
    const cuando = valor('cuando') || 'lo antes posible';
    const ts = trabajos();
    const lugar = (zona?.value || '').trim();
    titulo.textContent = `${amb.nombre} · ${tipo === 'casa' ? 'Casa' : 'Departamento'}`;
    chips.innerHTML = ts.map(t => `<li>${esc(GUIA_TRABAJOS[t].nombre)}</li>`).join('');
    chips.hidden = !ts.length;
    if (ts.length) {
      const items = ['Fotos del ambiente con luz de día, de lejos y de cerca', ...ts.map(t => GUIA_TRABAJOS[t].pedir)];
      if (tipo === 'departamento') items.push('Días y horarios de obra que permite el edificio');
      pedir.innerHTML = items.map(t => `<li>${ICO_CHECK}<span>${esc(t)}</span></li>`).join('');
    } else {
      pedir.innerHTML = '<li class="guia-vacio">Elegí al menos un trabajo y te decimos qué mandarnos.</li>';
    }
    ponerFoto(amb);
    const nombres = ts.map(t => GUIA_TRABAJOS[t].nombre.toLowerCase());
    const msg = [
      'Hola MAS CONSTRUIR, quiero pedir un presupuesto.',
      `• Ambiente: ${amb.nombre.toLowerCase()}`,
      `• Trabajos: ${enLista(nombres)}`,
      `• Inmueble: ${tipo}`,
      lugar ? `• Zona: ${lugar}` : '',
      `• Para: ${cuando}`,
      'Les mando fotos y medidas.',
    ].filter(Boolean).join('\n');
    wa.href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
    wa.setAttribute('aria-disabled', ts.length ? 'false' : 'true');
  };
  raiz.addEventListener('change', e => {
    const el = e.target;
    if (el.name === 'ambiente') {
      const amb = GUIA_AMBIENTES[el.value];
      if (amb) raiz.querySelectorAll('.guia-trabajos input').forEach(i => { i.checked = amb.trabajos.includes(i.value); });
    }
    pintar();
  });
  zona?.addEventListener('input', pintar);
  wa.addEventListener('click', e => {
    if (!trabajos().length) {
      e.preventDefault();
      showToast('Elegí al menos un trabajo para armar el mensaje.');
    }
  });
  pintar();
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
initWspFloat();
initHeroMotion();
initCapas();
initGuia();
initSello();
initReveals();
