const WHATSAPP_NUMBER = '5491134000348';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const TRABAJOS = {
  'banco-galeria': {
    titulo: 'Banco y escalera para la galería',
    tag: 'Jardín',
    foto: 'images/rincon-galeria.webp', w: 941, h: 1672,
    alt: 'Banco macizo de madera recuperada con almohadones junto a una escalera-estante con plantas en una galería',
    desc: 'Un banco de tablones gruesos contra la pared y una escalera-estante para las plantas: juntos arman un rincón para sentarse afuera, bajo techo.',
    ficha: [['Pieza', 'Banco y escalera-estante'], ['Para', 'Galerías, patios y balcones'], ['Madera', 'Reutilizada, con sus marcas a la vista'], ['Se hace', 'A medida, o consultá si hay en stock']]
  },
  'mesa-exterior': {
    titulo: 'Mesa y banco de exterior',
    tag: 'Jardín',
    foto: 'images/mesa-exterior.webp', w: 1672, h: 941,
    alt: 'Mesa de comedor de tablones gruesos con banco a juego bajo una galería',
    desc: 'Mesa de comedor de tablones y banco a juego, pensados para comer afuera: bajo la galería, en el quincho o en el patio.',
    ficha: [['Pieza', 'Mesa de comedor y banco'], ['Para', 'Galerías, quinchos y patios'], ['Madera', 'Reutilizada, con sus marcas a la vista'], ['Se hace', 'A medida, o consultá si hay en stock']]
  },
  'mesa-ratona': {
    titulo: 'Mesa ratona de tablones',
    tag: 'Hogar',
    foto: 'images/mesa-ratona.webp', w: 1254, h: 1254,
    alt: 'Mesa ratona de tablones recuperados con marcas y clavos a la vista sobre una alfombra tejida',
    desc: 'Tapa de tablones recuperados con sus marcas, agujeros y vetas a la vista, sobre patas macizas. Una pieza que se nota hecha a mano.',
    ficha: [['Pieza', 'Mesa ratona'], ['Para', 'Living'], ['Madera', 'Reutilizada, con sus marcas a la vista'], ['Se hace', 'A medida, o consultá si hay en stock']]
  },
  'biblioteca': {
    titulo: 'Biblioteca de estantes macizos',
    tag: 'Hogar',
    foto: 'images/biblioteca.webp', w: 1254, h: 1254,
    alt: 'Biblioteca de estantes macizos de madera recuperada con libros, cuencos y plantas colgantes',
    desc: 'Estantes gruesos sobre parantes macizos, para libros, plantas y todo lo que quieras tener a mano.',
    ficha: [['Pieza', 'Biblioteca o estantería'], ['Para', 'Living, comedor o escritorio'], ['Madera', 'Reutilizada, con sus marcas a la vista'], ['Se hace', 'A medida, o consultá si hay en stock']]
  },
  'rincon-jardin': {
    titulo: 'Rincón de jardín',
    tag: 'Jardín',
    foto: 'images/rincon-jardin.webp', w: 1254, h: 1254,
    alt: 'Rincón de jardín con banco, mesa baja y cantero de madera reutilizada entre plantas con flores',
    desc: 'Banco, mesa baja y cantero en la misma madera, para armar un lugar donde quedarse en el jardín o en el deck.',
    ficha: [['Piezas', 'Banco, mesa baja y cantero'], ['Para', 'Jardín y deck'], ['Madera', 'Reutilizada, con sus marcas a la vista'], ['Se hace', 'A medida, o consultá si hay en stock']]
  }
};

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function wspUrl(texto) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
}

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => { a.href = wspUrl(a.dataset.wspMsg); });
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 981px)');
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

function initGaleria() {
  const lb = document.getElementById('lb');
  const btns = [...document.querySelectorAll('[data-trabajo]')];
  if (!lb || !btns.length) return;
  const visor = document.getElementById('lbVisor');
  const img = document.getElementById('lbImg');
  const tag = document.getElementById('lbTag');
  const titulo = document.getElementById('lbTitulo');
  const desc = document.getElementById('lbDesc');
  const ficha = document.getElementById('lbFicha');
  const wsp = document.getElementById('lbWsp');
  const cont = document.getElementById('lbCont');
  const cerrar = document.getElementById('lbCerrar');
  let idx = 0;
  let trigger = null;
  let cambio = 0;

  const pintar = (i, animar) => {
    idx = (i + btns.length) % btns.length;
    const t = TRABAJOS[btns[idx].dataset.trabajo];
    if (!t) return;
    visor.classList.remove('is-zoom');
    img.style.transformOrigin = '50% 50%';
    const poner = () => {
      img.src = t.foto; img.width = t.w; img.height = t.h; img.alt = t.alt;
      img.classList.remove('is-cambiando');
    };
    clearTimeout(cambio);
    if (animar && !reduceMotion) { img.classList.add('is-cambiando'); cambio = setTimeout(poner, 180); } else poner();
    tag.textContent = t.tag;
    titulo.textContent = t.titulo;
    desc.textContent = t.desc;
    ficha.innerHTML = t.ficha.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');
    wsp.href = wspUrl(`Hola Adumir! Vi en la web «${t.titulo}» y quiero consultar por una igual o parecida.`);
    cont.textContent = `${idx + 1} de ${btns.length}`;
  };

  btns.forEach((b, i) => b.addEventListener('click', () => {
    trigger = b;
    pintar(i, false);
    if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
    document.body.classList.add('no-scroll');
    cerrar.focus();
  }));

  const cerrarLb = () => { if (lb.open) lb.close(); };
  lb.addEventListener('close', () => {
    document.body.classList.remove('no-scroll');
    visor.classList.remove('is-zoom');
    trigger?.focus();
  });
  cerrar.addEventListener('click', cerrarLb);
  lb.addEventListener('click', e => { if (e.target === lb) cerrarLb(); });
  document.getElementById('lbPrev')?.addEventListener('click', e => { e.stopPropagation(); pintar(idx - 1, true); });
  document.getElementById('lbNext')?.addEventListener('click', e => { e.stopPropagation(); pintar(idx + 1, true); });
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); pintar(idx - 1, true); }
    if (e.key === 'ArrowRight') { e.preventDefault(); pintar(idx + 1, true); }
  });

  const origen = e => {
    const r = visor.getBoundingClientRect();
    const x = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1) * 100;
    const y = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
  };
  visor.addEventListener('click', e => {
    if (e.target.closest('button')) return;
    if (!visor.classList.contains('is-zoom')) origen(e);
    visor.classList.toggle('is-zoom');
  });
  visor.addEventListener('pointermove', e => { if (visor.classList.contains('is-zoom')) origen(e); });
}

function initVideos() {
  const cards = [...document.querySelectorAll('[data-video]')];
  const vb = document.getElementById('vb');
  if (!cards.length || !vb) return;
  const video = document.getElementById('vbVideo');
  const pend = document.getElementById('vbPendiente');
  const poster = document.getElementById('vbPoster');
  const tituloPend = document.getElementById('vbTituloPend');
  const pie = document.getElementById('vbPie');
  const cerrar = document.getElementById('vbCerrar');
  const estado = new Map();
  let trigger = null;

  const dur = s => {
    if (!isFinite(s) || s <= 0) return 'Video';
    const m = Math.floor(s / 60);
    const ss = String(Math.round(s % 60)).padStart(2, '0');
    return `${m}:${ss}`;
  };
  const tituloDe = btn => btn.querySelector('.video__titulo')?.textContent.trim() || 'Video de trabajo';

  const probar = btn => {
    const li = btn.closest('.video');
    const label = btn.querySelector('[data-video-estado]');
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.muted = true;
    v.addEventListener('loadedmetadata', () => {
      estado.set(btn, true);
      li?.classList.add('is-listo');
      if (label) label.textContent = dur(v.duration);
    }, { once: true });
    v.addEventListener('error', () => {
      estado.set(btn, false);
      li?.classList.add('is-pendiente');
    }, { once: true });
    v.src = btn.dataset.video;
  };
  if (document.readyState === 'complete') cards.forEach(probar);
  else window.addEventListener('load', () => cards.forEach(probar), { once: true });

  const mostrarPendiente = btn => {
    video.pause();
    video.removeAttribute('src');
    video.hidden = true;
    poster.src = btn.dataset.poster;
    tituloPend.textContent = tituloDe(btn);
    pend.hidden = false;
    pie.hidden = true;
  };
  const mostrarVideo = btn => {
    pend.hidden = true;
    pie.hidden = false;
    video.hidden = false;
    video.poster = btn.dataset.poster;
    video.onerror = () => { estado.set(btn, false); mostrarPendiente(btn); };
    video.src = btn.dataset.video;
    video.play().catch(() => {});
  };

  cards.forEach(btn => btn.addEventListener('click', () => {
    trigger = btn;
    pie.textContent = tituloDe(btn);
    if (estado.get(btn) === false) mostrarPendiente(btn); else mostrarVideo(btn);
    if (typeof vb.showModal === 'function') vb.showModal(); else vb.setAttribute('open', '');
    document.body.classList.add('no-scroll');
    cerrar.focus();
  }));

  const cerrarVb = () => { if (vb.open) vb.close(); };
  vb.addEventListener('close', () => {
    video.onerror = null;
    video.pause();
    video.removeAttribute('src');
    video.load();
    document.body.classList.remove('no-scroll');
    trigger?.focus();
  });
  cerrar.addEventListener('click', cerrarVb);
  vb.addEventListener('click', e => { if (e.target === vb) cerrarVb(); });
}

function initForm() {
  const form = document.getElementById('formContacto');
  if (!form) return;
  const tel = form.querySelector('#fTel');
  let mask = null;
  if (tel && typeof IMask !== 'undefined') {
    mask = IMask(tel, { mask: [
      { mask: '+{54} 9 (00) 0000-0000' },
      { mask: '+{54} 9 (000) 000-0000' },
      { mask: '+{54} 9 (0000) 00-0000' }
    ] });
  }
  const reglas = {
    fNombre: v => v.trim().length >= 2,
    fTel: v => v.replace(/\D/g, '').length >= (mask ? 13 : 8),
    fTipo: v => v !== ''
  };
  const validar = campo => {
    const ok = reglas[campo.id](campo.value);
    const field = campo.closest('.field');
    const err = document.getElementById(`${campo.id}Error`);
    field?.classList.toggle('is-error', !ok);
    campo.setAttribute('aria-invalid', String(!ok));
    if (err) err.hidden = ok;
    return ok;
  };
  Object.keys(reglas).forEach(id => {
    const campo = form.querySelector(`#${id}`);
    campo?.addEventListener('blur', () => { if (campo.value || campo.closest('.field')?.classList.contains('is-error')) validar(campo); });
    campo?.addEventListener('change', () => { if (campo.closest('.field')?.classList.contains('is-error')) validar(campo); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const campos = Object.keys(reglas).map(id => form.querySelector(`#${id}`)).filter(Boolean);
    const malos = campos.filter(c => !validar(c));
    if (malos.length) {
      malos[0].focus();
      malos[0].scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      return;
    }
    const btn = form.querySelector('[type="submit"]');
    const txt = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      if (mask) mask.value = '';
      btn.disabled = false;
      btn.innerHTML = txt;
    }, 800);
  });
}

function initLeeScroll() {
  const els = document.querySelectorAll('[data-lee]');
  if (!els.length) return;
  els.forEach(el => {
    const palabras = el.textContent.trim().split(/\s+/);
    if (palabras.length < 2) return;
    el.textContent = '';
    palabras.forEach((palabra, i) => {
      const s = document.createElement('span');
      s.className = 'lee-w';
      s.textContent = palabra;
      el.appendChild(s);
      if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    document.querySelectorAll('.lee-w').forEach(w => w.classList.add('on'));
    return;
  }
  els.forEach(el => {
    const ws = el.querySelectorAll('.lee-w');
    if (!ws.length) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: .4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      }
    });
  });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const media = document.querySelector('.hero--foto [data-hero-media]');
  if (!media) return;
  gsap.to(media, {
    yPercent: 6, ease: 'none',
    scrollTrigger: { trigger: '.hero--foto', start: 'top top', end: 'bottom top', scrub: true }
  });
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

initWspLinks();
initNav();
initWspFloat();
initModelBarScroll();
initGaleria();
initVideos();
initForm();
initLeeScroll();
initHeroMotion();
initParallax();
initReveals();
