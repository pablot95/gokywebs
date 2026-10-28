const WSP = '5493794899025';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esM2 = document.body.classList.contains('m2');

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const CATS = {
  identidad: 'Identidad visual',
  papeleria: 'Papelería',
  packaging: 'Packaging',
  editorial: 'Editorial',
  ilustracion: 'Ilustración'
};

const OBRAS = [
  { id: 'regalo', cat: 'packaging', img: 'packaging-regalo', titulo: 'Papel de regalo ilustrado', alt: 'Caja envuelta en papel con hojas ilustradas en rosa y frambuesa, con moño de cinta', desc: 'Una estampa botánica propia para envolver: papel, cinta y etiqueta pensados juntos.', usos: ['Papel de regalo', 'Etiquetas', 'Cintas', 'Fechas especiales'] },
  { id: 'sobres', cat: 'papeleria', img: 'papeleria-sobres', titulo: 'Papelería con sobres a juego', alt: 'Tarjetas blancas, sobres frambuesa y papeles con formas geométricas rosas', desc: 'Tarjetas, sobres y hojas con la misma paleta, para una marca o para una invitación especial.', usos: ['Tarjetas personales', 'Invitaciones', 'Sobres', 'Hojas membretadas'] },
  { id: 'revista', cat: 'editorial', img: 'editorial-revista', titulo: 'Revista con formas geométricas', alt: 'Revista abierta con páginas de círculos y arcos en rosa y frambuesa', desc: 'Portada, grilla y páginas interiores para revistas, catálogos o libros que dan ganas de abrir.', usos: ['Revistas', 'Catálogos', 'Menús', 'Libros'] },
  { id: 'muestras', cat: 'identidad', img: 'identidad-muestras', titulo: 'Muestras de color para una marca', alt: 'Manos eligiendo muestras de papel en tonos frambuesa y rosa sobre la mesa de trabajo', desc: 'Antes del logo, la paleta: pruebas de color sobre papel para ver cómo se siente la marca en la mano.', usos: ['Logo', 'Paleta de color', 'Tarjetas', 'Redes'] },
  { id: 'cuaderno', cat: 'ilustracion', img: 'ilustracion-cuaderno', titulo: 'Cuaderno con tapa ilustrada', alt: 'Cuaderno con tapa ilustrada con hojas en tonos rosa y bordó sobre una mesa con flores', desc: 'Una ilustración botánica a medida para tapas de cuadernos, agendas o recetarios personalizados.', usos: ['Cuadernos', 'Agendas', 'Recetarios', 'Láminas'] },
  { id: 'bolsa', cat: 'packaging', img: 'packaging-bolsa', titulo: 'Bolsas y cajas con tu marca', alt: 'Bolsa de papel blanca con papel de seda frambuesa, cajas con formas geométricas y etiquetas', desc: 'Bolsa, caja, papel de seda y etiqueta: el empaque completo de una marca, listo para entregar.', usos: ['Bolsas', 'Cajas', 'Etiquetas colgantes', 'Papel de seda'] },
  { id: 'digital', cat: 'ilustracion', img: 'ilustracion-digital', titulo: 'Ilustración digital a medida', alt: 'Mano dibujando formas geométricas en una tableta, con tarjetas impresas alrededor', desc: 'Ilustraciones dibujadas en tableta para láminas, estampas o publicaciones en redes.', usos: ['Láminas', 'Estampas', 'Posteos', 'Historias'] }
];

const FLECHA = '<svg class="obra-flecha" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const FLECHA_ICO = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const CTA_OBRA = `<li class="obra obra--cta" data-animate="subir" style="opacity:0;transform:translateY(36px)"><a class="obra-cta" href="#contacto"><span class="obra-cta-titulo">¿Tenés una idea en mente?</span><span class="obra-cta-texto">Contámela y la diseño a tu medida, desde cero.</span><span class="obra-cta-link">Contame tu proyecto ${FLECHA_ICO}</span></a></li>`;

let filtro = 'todos';
let visibles = OBRAS;
let revealsListos = false;

function cardObra(o, i) {
  const grande = esM2 && filtro === 'todos' && i === 0;
  const sizes = grande ? '(min-width: 1024px) 50vw, 100vw' : (esM2 ? '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw' : '(min-width: 1024px) 25vw, 50vw');
  return `<li class="obra" data-animate="subir" style="opacity:0;transform:translateY(36px)">
    <button type="button" class="obra-btn" data-obra="${o.id}" aria-label="Ver en grande: ${esc(o.titulo)}">
      <span class="obra-foto"><img src="images/${o.img}-640.webp" srcset="images/${o.img}-640.webp 640w, images/${o.img}.webp 1254w" sizes="${sizes}" width="640" height="640" alt="${esc(o.alt)}"></span>
      <span class="obra-info"><span class="obra-cat">${CATS[o.cat]}</span><span class="obra-titulo">${esc(o.titulo)}</span>${FLECHA}</span>
    </button>
  </li>`;
}

function renderObras() {
  const ul = document.getElementById('obras');
  if (!ul) return;
  visibles = filtro === 'todos' ? OBRAS : OBRAS.filter(o => o.cat === filtro);
  ul.classList.toggle('is-filtrada', filtro !== 'todos');
  ul.innerHTML = visibles.map(cardObra).join('') + CTA_OBRA;
  const cuenta = document.getElementById('obrasCuenta');
  if (cuenta) cuenta.textContent = visibles.length === 1 ? '1 trabajo' : `${visibles.length} trabajos`;
  revelarNuevos(ul);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function setFiltro(f) {
  filtro = OBRAS.some(o => o.cat === f) ? f : 'todos';
  document.querySelectorAll('.filtro').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filtro === filtro)));
  renderObras();
}

function initFiltros() {
  document.querySelectorAll('.filtro').forEach(b => b.addEventListener('click', () => setFiltro(b.dataset.filtro)));
  document.querySelectorAll('[data-ir-filtro]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    setFiltro(a.dataset.irFiltro);
    document.getElementById('galeria')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }));
}

function initVisor() {
  const visor = document.getElementById('visor');
  const ul = document.getElementById('obras');
  if (!visor || !ul) return;
  const img = document.getElementById('visorImg');
  const cat = document.getElementById('visorCat');
  const titulo = document.getElementById('visorTitulo');
  const desc = document.getElementById('visorDesc');
  const usos = document.getElementById('visorUsos');
  const wsp = document.getElementById('visorWsp');
  const cuenta = document.getElementById('visorCuenta');
  const prev = document.getElementById('visorPrev');
  const next = document.getElementById('visorNext');
  const cerrarBtn = visor.querySelector('.visor-cerrar');
  let idx = 0;
  let ultimoFoco = null;
  let cerrarTimer = 0;

  const pintar = () => {
    const o = visibles[idx];
    if (!o) return;
    const src = `images/${o.img}.webp`;
    if (!img.src.endsWith(src)) {
      img.classList.add('cambiando');
      const pre = new window.Image();
      const aplicar = () => { img.src = src; img.alt = o.alt; img.classList.remove('cambiando'); };
      pre.onload = aplicar;
      pre.onerror = aplicar;
      pre.src = src;
      if (pre.complete) aplicar();
    } else {
      img.alt = o.alt;
    }
    cat.textContent = CATS[o.cat];
    titulo.textContent = o.titulo;
    desc.textContent = o.desc;
    usos.innerHTML = o.usos.map(u => `<li>${esc(u)}</li>`).join('');
    wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(`Hola Belu! Vi «${o.titulo}» en tu web y quiero algo así para mi proyecto.`)}`;
    cuenta.textContent = `${idx + 1} / ${visibles.length}`;
    const solo = visibles.length < 2;
    prev.hidden = solo;
    next.hidden = solo;
  };
  const abrir = i => {
    idx = i;
    ultimoFoco = document.activeElement;
    pintar();
    clearTimeout(cerrarTimer);
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    void visor.offsetWidth;
    visor.classList.add('abierto');
    cerrarBtn.focus();
  };
  const cerrar = () => {
    visor.classList.remove('abierto');
    document.body.classList.remove('no-scroll');
    cerrarTimer = setTimeout(() => { visor.hidden = true; }, reduceMotion ? 0 : 380);
    if (ultimoFoco && typeof ultimoFoco.focus === 'function') ultimoFoco.focus();
  };
  const mover = d => {
    if (visibles.length < 2) return;
    idx = (idx + d + visibles.length) % visibles.length;
    pintar();
  };

  ul.addEventListener('click', e => {
    const b = e.target.closest('[data-obra]');
    if (!b) return;
    const i = visibles.findIndex(o => o.id === b.dataset.obra);
    if (i >= 0) abrir(i);
  });
  visor.querySelectorAll('[data-cerrar]').forEach(el => el.addEventListener('click', cerrar));
  prev.addEventListener('click', () => mover(-1));
  next.addEventListener('click', () => mover(1));
  document.addEventListener('keydown', e => {
    if (visor.hidden || !visor.classList.contains('abierto')) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else if (e.key === 'ArrowLeft') mover(-1);
    else if (e.key === 'ArrowRight') mover(1);
    else if (e.key === 'Tab') {
      const focos = [...visor.querySelectorAll('button, a[href]')].filter(el => !el.hidden && el.getClientRects().length);
      if (!focos.length) return;
      const primero = focos[0];
      const ultimo = focos[focos.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
  });
  let x0 = null;
  const foto = visor.querySelector('.visor-foto');
  foto.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  foto.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) mover(dx < 0 ? 1 : -1);
  }, { passive: true });
}

function initTabs() {
  const list = document.querySelector('[role="tablist"]');
  if (!list) return;
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const activar = (t, foco) => {
    tabs.forEach(x => {
      const on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      const p = document.getElementById(x.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    if (foco) t.focus();
    list.scrollTo({ left: Math.max(0, t.offsetLeft - 24), behavior: reduceMotion ? 'auto' : 'smooth' });
    const panel = document.getElementById(t.getAttribute('aria-controls'));
    if (panel && !reduceMotion && typeof gsap !== 'undefined') {
      gsap.fromTo(panel.querySelectorAll('.tab-num, .tab-cuerpo > *'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'expo.out', clearProps: 'opacity,transform' });
    }
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach(t => t.addEventListener('click', () => activar(t)));
  list.addEventListener('keydown', e => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let j = null;
    if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = tabs.length - 1;
    if (j === null) return;
    e.preventDefault();
    activar(tabs[j], true);
  });
}

function initConsulta() {
  const form = document.getElementById('consulta');
  if (!form) return;
  const tipos = [...form.querySelectorAll('input[type="checkbox"]')];
  const para = document.getElementById('cPara');
  const cuando = document.getElementById('cCuando');
  const fecha = document.getElementById('cFecha');
  const campoFecha = document.getElementById('campoFecha');
  const nombre = document.getElementById('cNombre');
  const idea = document.getElementById('cIdea');
  const preview = document.getElementById('consultaPreview');
  const errTipos = document.getElementById('errTipos');
  const errNombre = document.getElementById('errNombre');

  const plazo = () => {
    if (cuando.value === 'sin apuro') return 'No tengo apuro.';
    if (cuando.value === 'este mes') return 'Lo necesitaría este mes.';
    if (!fecha.value) return 'Tengo una fecha en mente.';
    const [a, m, d] = fecha.value.split('-');
    return `Lo necesito para el ${d}/${m}/${a}.`;
  };
  const mensaje = () => {
    const elegidos = tipos.filter(t => t.checked).map(t => t.value);
    const n = nombre.value.trim();
    const lineas = [`Hola Belu! ${n ? `Soy ${n}. ` : ''}Te escribo desde tu web.`];
    if (elegidos.length) lineas.push(`Necesito: ${elegidos.join(', ')}.`);
    lineas.push(`Es para ${para.value}.`);
    lineas.push(plazo());
    const i = idea.value.trim();
    if (i) lineas.push(`La idea: ${i}`);
    return lineas.join('\n');
  };
  const actualizar = () => {
    campoFecha.hidden = cuando.value !== 'fecha';
    preview.textContent = mensaje();
    if (tipos.some(t => t.checked)) errTipos.hidden = true;
    if (nombre.value.trim().length > 1) { errNombre.hidden = true; nombre.removeAttribute('aria-invalid'); }
  };
  form.addEventListener('input', actualizar);
  form.addEventListener('change', actualizar);
  actualizar();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const okTipos = tipos.some(t => t.checked);
    const okNombre = nombre.value.trim().length > 1;
    errTipos.hidden = okTipos;
    errNombre.hidden = okNombre;
    if (okNombre) nombre.removeAttribute('aria-invalid'); else nombre.setAttribute('aria-invalid', 'true');
    if (!okTipos) { tipos[0].focus(); return; }
    if (!okNombre) { nombre.focus(); return; }
    window.open(`https://wa.me/${WSP}?text=${encodeURIComponent(mensaje())}`, '_blank', 'noopener');
    showToast('Listo: te abrimos WhatsApp con el mensaje armado.');
  });
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
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 769px)');
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

function initReveals() {
  revealsListos = true;
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

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  const arco = hero.querySelectorAll('.hero-arc, .collage-blob');
  if (arco.length) tl.from(arco, { scale: 0.86, opacity: 0, duration: 1.6, clearProps: 'transform,opacity' }, 0.05);
  const marcos = hero.querySelectorAll('.collage .pieza:not(.pieza--a) .pieza-marco');
  if (marcos.length) tl.from(marcos, { y: 70, opacity: 0, rotation: i => (i % 2 ? 9 : -9), duration: 1.3, stagger: 0.1, clearProps: 'transform,opacity' }, 0.35);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.75);
}

function initCollage() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const collage = document.querySelector('.collage');
  if (!collage) return;
  const vel = [-3, 9, 7, -5, 11];
  collage.querySelectorAll('.pieza').forEach((p, i) => {
    gsap.to(p, { yPercent: vel[i % vel.length], ease: 'none', scrollTrigger: { trigger: collage, start: 'top 75%', end: 'bottom top', scrub: true } });
  });
}

renderObras();
initFiltros();
initVisor();
initTabs();
initConsulta();
initReveals();
initNav();
initWspFloat();
initModelBarScroll();
initHeroMotion();
initCollage();
