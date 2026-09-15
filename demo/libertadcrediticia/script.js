document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

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
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
}

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
  const host = document.querySelector('.masthead') || document.body;
  let bd = host.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; host.appendChild(bd); }
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
  const sync = () => { if (window.innerWidth > 768) { nav.removeAttribute('inert'); } else if (!nav.classList.contains('open')) { nav.setAttribute('inert', ''); } };
  sync();
  window.addEventListener('resize', sync, { passive: true });
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  const sync = () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  };
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

function initProgreso() {
  const bar = document.createElement('div');
  bar.className = 'progreso';
  document.body.appendChild(bar);
  const sync = () => {
    const alto = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${alto > 0 ? Math.min(1, window.scrollY / alto) : 0})`;
  };
  window.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initAnclas() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      const destino = document.querySelector(id);
      if (!destino) return;
      e.preventDefault();
      destino.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

function initMagnetico() {
  if (reduceMotion || !window.matchMedia('(hover:hover)').matches) return;
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.22;
      const y = (e.clientY - r.top - r.height / 2) * 0.28;
      el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    });
    el.addEventListener('pointerleave', () => { el.style.translate = '0px 0px'; });
  });
}

function initContadores() {
  const cifras = document.querySelectorAll('[data-count]');
  if (!cifras.length) return;
  const formato = n => '$' + Math.round(n).toLocaleString('es-AR');
  const correr = el => {
    const meta = parseFloat(el.getAttribute('data-count')) || 0;
    if (reduceMotion) { el.textContent = formato(meta); return; }
    el.textContent = formato(0);
    let inicio = null;
    let listo = false;
    const dur = 1400;
    const paso = ahora => {
      if (inicio === null) inicio = ahora;
      const t = Math.min(1, (ahora - inicio) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = formato(meta * eased);
      if (t < 1) requestAnimationFrame(paso); else listo = true;
    };
    requestAnimationFrame(paso);
    setTimeout(() => { if (!listo) el.textContent = formato(meta); }, dur + 500);
  };
  if (!('IntersectionObserver' in window)) { cifras.forEach(correr); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { correr(entry.target); io.unobserve(entry.target); }
    });
  }, { threshold: 0.2 });
  cifras.forEach(el => io.observe(el));
}

function initFaq() {
  const lista = document.querySelector('[data-faq]');
  if (!lista) return;
  const items = Array.from(lista.querySelectorAll('details'));
  items.forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      items.forEach(otro => { if (otro !== item) otro.open = false; });
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  });
}

function initTelMask(input) {
  if (!input) return;
  input.addEventListener('input', () => {
    const v = input.value.replace(/\D/g, '').slice(0, 11);
    let out = v;
    if (v.length > 2 && v.length <= 6) out = `${v.slice(0, 2)} ${v.slice(2)}`;
    else if (v.length > 6 && v.length <= 10) out = `${v.slice(0, 2)} ${v.slice(2, 6)}-${v.slice(6)}`;
    else if (v.length > 10) out = `${v.slice(0, 3)} ${v.slice(3, 7)}-${v.slice(7)}`;
    input.value = out;
  });
}

function initForm() {
  const form = document.getElementById('consForm');
  if (!form) return;
  const boton = document.getElementById('consSubmit');
  const tel = form.querySelector('#f-tel');
  initTelMask(tel);

  const marcar = (campo, msg) => {
    const wrap = campo.closest('.campo');
    const salida = wrap?.querySelector('.error');
    wrap?.classList.toggle('is-error', !!msg);
    campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (salida) salida.textContent = msg || '';
    return !msg;
  };

  form.querySelectorAll('input,select,textarea').forEach(campo => {
    campo.addEventListener('input', () => {
      if (campo.closest('.campo')?.classList.contains('is-error')) marcar(campo, '');
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = form.querySelector('#f-nombre');
    const tipo = form.querySelector('#f-tipo');
    let ok = true;
    ok = marcar(nombre, nombre.value.trim().length < 3 ? 'Escribí tu nombre y apellido.' : '') && ok;
    ok = marcar(tel, tel.value.replace(/\D/g, '').length < 8 ? 'Necesitamos un teléfono para contestarte.' : '') && ok;
    ok = marcar(tipo, tipo.value ? '' : 'Elegí qué tipo de deuda es.') && ok;
    if (!ok) {
      form.querySelector('.campo.is-error input,.campo.is-error select')?.focus();
      return;
    }
    const texto = boton.textContent;
    boton.disabled = true;
    boton.textContent = 'Enviando…';
    setTimeout(() => {
      boton.disabled = false;
      boton.textContent = texto;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initBanda() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const media = document.querySelector('.banda-media');
  const img = media?.querySelector('img');
  if (!img) return;
  gsap.fromTo(img, { yPercent: -5 }, {
    yPercent: 5, ease: 'none',
    scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: .5 }
  });
}

function initFooterWord() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const word = document.querySelector('.footer-word');
  if (!word) return;
  gsap.fromTo(word, { yPercent: 14, opacity: .35 }, {
    yPercent: 0, opacity: 1, ease: 'none',
    scrollTrigger: { trigger: word, start: 'top bottom', end: 'bottom bottom', scrub: .6 }
  });
}

function initExpediente() {
  const stage = document.getElementById('expStage');
  const mesa = document.getElementById('expMesa');
  const lista = document.getElementById('expPasos');
  if (!stage || !mesa || !lista) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const hojas = ['.hoja-1', '.hoja-2', '.hoja-3', '.hoja-4'].map(s => mesa.querySelector(s)).filter(Boolean);
  const acuerdo = mesa.querySelector('.hoja-acuerdo');
  const sello = mesa.querySelector('.exp-sello');
  const firma = mesa.querySelector('#firmaPath');
  const pasos = Array.from(lista.querySelectorAll('.paso'));
  if (hojas.length < 4 || !acuerdo || !sello) return;

  const largo = firma && firma.getTotalLength ? firma.getTotalLength() : 420;
  const cortes = [0, .22, .5, .74];

  const marcarPaso = p => {
    let activo = 0;
    cortes.forEach((corte, i) => { if (p >= corte) activo = i; });
    pasos.forEach((el, i) => el.classList.toggle('is-on', i === activo));
  };

  const estadoFinal = () => {
    gsap.set(hojas, { y: (i) => i * 6, xPercent: 0, rotation: 0, scale: 1, opacity: 1 });
    gsap.set(acuerdo, { y: 0, opacity: 1, scale: 1 });
    gsap.set(sello, { scale: 1, opacity: 1, rotation: -9 });
    if (firma) gsap.set(firma, { strokeDasharray: 'none', strokeDashoffset: 0 });
  };

  const armar = () => {
    gsap.set(hojas, { y: 150, opacity: 0, rotation: 0, xPercent: 0, scale: .96 });
    gsap.set(acuerdo, { y: -120, opacity: 0, scale: .94 });
    gsap.set(sello, { scale: .3, opacity: 0, rotation: -34 });
    if (firma) gsap.set(firma, { strokeDasharray: largo, strokeDashoffset: largo });

    const tl = gsap.timeline();
    tl.to(hojas[0], { y: 0, opacity: 1, scale: 1, duration: .22, ease: 'none' }, 0)
      .to(hojas[1], { y: -10, opacity: 1, scale: 1, rotation: -13, xPercent: -48, duration: .28, ease: 'none' }, .22)
      .to(hojas[2], { y: 2, opacity: 1, scale: 1, rotation: 7, xPercent: 24, duration: .28, ease: 'none' }, .22)
      .to(hojas[3], { y: 16, opacity: 1, scale: 1, rotation: 16, xPercent: 60, duration: .28, ease: 'none' }, .22)
      .to(hojas, { rotation: 0, xPercent: 0, y: (i) => i * 6, duration: .24, ease: 'none' }, .5)
      .to(acuerdo, { y: 0, opacity: 1, scale: 1, duration: .24, ease: 'none' }, .5);
    if (firma) tl.to(firma, { strokeDashoffset: 0, duration: .16, ease: 'none' }, .74);
    tl.to(sello, { scale: 1, opacity: 1, rotation: -9, duration: .14, ease: 'back.out(2.2)' }, .86);
    return tl;
  };

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    const tl = armar();
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: '+=240%',
      pin: true, scrub: .6, invalidateOnRefresh: true, animation: tl,
      onUpdate: self => marcarPaso(self.progress)
    });
    marcarPaso(0);
    return () => { st.kill(); tl.kill(); };
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    const tl = armar();
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: 'bottom bottom',
      scrub: .6, invalidateOnRefresh: true, animation: tl,
      onUpdate: self => marcarPaso(self.progress)
    });
    marcarPaso(0);
    return () => { st.kill(); tl.kill(); };
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    stage.classList.add('is-static');
    estadoFinal();
    pasos.forEach(el => el.classList.add('is-on'));
    return () => { stage.classList.remove('is-static'); };
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
  initReveals();
  initNav();
  initWspFloat();
  initProgreso();
  initAnclas();
  initMagnetico();
  initContadores();
  initFaq();
  initForm();
  initBanda();
  initFooterWord();
  initExpediente();
});
