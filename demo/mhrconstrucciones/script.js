const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491134879280';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const fmt = n => '$' + Math.round(n).toLocaleString('es-AR');

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
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
  syncInert();
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.09, 0.63)}s`;
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => {
    a.href = `https://wa.me/${WSP}?text=${encodeURIComponent(a.dataset.wspMsg)}`;
  });
}

function initHero() {
  const hero = document.querySelector('.hero--banner');
  if (!hero) return;
  const slides = [...hero.querySelectorAll('.hero__slide')];
  const dots = [...hero.querySelectorAll('.hero__dot')];
  const textos = [...hero.querySelectorAll('.hero__mensaje-texto')];
  if (slides.length < 2) return;
  let i = 0;
  const ir = n => {
    slides[i].classList.remove('is-activo'); dots[i]?.classList.remove('is-activo'); textos[i]?.classList.remove('is-activo');
    i = n;
    slides[i].classList.add('is-activo'); dots[i]?.classList.add('is-activo'); textos[i]?.classList.add('is-activo');
  };
  dots.forEach((d, n) => d.addEventListener('click', () => { ir(n); reiniciar(); }));
  let timer;
  const reiniciar = () => {
    clearInterval(timer);
    if (reduceMotion) return;
    timer = setInterval(() => ir((i + 1) % slides.length), 4600);
  };
  reiniciar();
}

/* ===== Rubros / catálogo de trabajos (compartido por las dos páginas) ===== */
const RUBROS = [
  { id: 'obranueva', nombre: 'Obra nueva', img: 'images/cat-obranueva.webp', desc: 'De los cimientos a la llave en mano', m2min: 650000, m2max: 900000, plazo: '4 a 8 meses según metros' },
  { id: 'refacciones', nombre: 'Refacciones', img: 'images/cat-cocina.webp', desc: 'Ampliaciones y renovaciones integrales', m2min: 120000, m2max: 220000, plazo: '3 a 8 semanas según alcance' },
  { id: 'techos', nombre: 'Techos', img: 'images/cat-techos.webp', desc: 'Cubiertas nuevas y reparación de filtraciones', m2min: 90000, m2max: 140000, plazo: '1 a 3 semanas' },
  { id: 'piletas', nombre: 'Piletas', img: 'images/cat-piletas.webp', desc: 'Piscinas de hormigón, de cero o remodeladas', m2min: 0, m2max: 0, plazo: 'a definir en la visita' },
  { id: 'durlok', nombre: 'Durlok', img: 'images/obra-9x16.webp', desc: 'Tabiques y cielorrasos en placa de yeso', m2min: 45000, m2max: 75000, plazo: '1 a 2 semanas' },
  { id: 'pintura', nombre: 'Pintura', img: 'images/cat-pintura.webp', desc: 'Interior, exterior y tratamiento de humedad', m2min: 8000, m2max: 14000, plazo: '3 a 10 días' },
  { id: 'electricidad', nombre: 'Electricidad', img: 'images/cat-electricidad.webp', desc: 'Instalaciones, tableros y puesta a tierra', m2min: 0, m2max: 0, plazo: 'a definir en la visita' },
  { id: 'plomeria', nombre: 'Plomería', img: 'images/cat-plomeria.webp', desc: 'Instalación sanitaria y reparación de cañerías', m2min: 0, m2max: 0, plazo: 'a definir en la visita' },
  { id: 'ceramica', nombre: 'Cerámica', img: 'images/cat-ceramica.webp', desc: 'Colocación de piso y revestimiento', m2min: 35000, m2max: 60000, plazo: '4 a 10 días' },
  { id: 'hierro', nombre: 'Estructuras de hierro', img: 'images/cat-hierro.webp', desc: 'Vigas, columnas y refuerzos estructurales', m2min: 0, m2max: 0, plazo: 'a definir en la visita' }
];
const VISITA = ['piletas', 'electricidad', 'plomeria', 'hierro'];

function mensajeRubro(rubro) {
  return `Hola, quiero pedir presupuesto para un trabajo de ${rubro.nombre.toLowerCase()}. ¿Me pasan los datos que necesitan para cotizarlo?`;
}

function initTrabajosGrid(root) {
  const grid = root.querySelector('[data-trabajos-grid]');
  const chips = [...document.querySelectorAll('.chip-rubro')];
  const masBtn = root.querySelector('[data-trabajos-mas]');
  if (!grid) return;
  const flipDisponible = typeof gsap !== 'undefined' && typeof Flip !== 'undefined';
  let activo = null;
  let mostrarTodo = false;

  const tarjeta = (r, destacada) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'trabajo-card' + (destacada ? ' is-destacada' : '');
    card.dataset.rubro = r.id;
    card.setAttribute('aria-pressed', String(activo === r.id));
    card.innerHTML = `<img src="${r.img}" alt="${esc(r.desc)}" loading="lazy" decoding="async">
      <span class="trabajo-card__n">${String(RUBROS.indexOf(r) + 1).padStart(2, '0')}</span>
      ${activo === r.id ? '<span class="trabajo-card__badge">Elegido</span>' : ''}
      <span class="trabajo-card__pie"><h3>${esc(r.nombre)}</h3></span>`;
    card.addEventListener('click', () => elegir(r.id));
    return card;
  };

  const render = () => {
    const state = flipDisponible ? Flip.getState(grid.children) : null;
    grid.innerHTML = '';
    const ordenados = activo
      ? [...RUBROS].sort((a, b) => (a.id === activo ? -1 : b.id === activo ? 1 : 0))
      : RUBROS;
    const visibles = mostrarTodo ? ordenados : ordenados.slice(0, 8);
    visibles.forEach((r, idx) => grid.appendChild(tarjeta(r, idx === 0 && !!activo)));
    if (masBtn) masBtn.textContent = mostrarTodo ? 'Ver menos' : `Ver los ${RUBROS.length - 8} trabajos restantes`;
    if (flipDisponible && state && !reduceMotion) {
      Flip.from(state, { duration: .55, ease: 'power2.out', stagger: .02, absolute: true });
    }
  };

  const aplicar = id => {
    activo = id;
    chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.rubro === activo)));
    render();
  };
  const elegir = id => {
    const nuevo = activo === id ? null : id;
    aplicar(nuevo);
    root.dispatchEvent(new CustomEvent('rubro:elegido', { detail: { id: activo } }));
  };

  chips.forEach(chip => chip.addEventListener('click', () => elegir(chip.dataset.rubro)));
  masBtn?.addEventListener('click', () => { mostrarTodo = !mostrarTodo; render(); });
  root.addEventListener('rubro:elegido', e => { if (e.detail.id !== activo) aplicar(e.detail.id); });
  render();

  return { elegir, get activo() { return activo; } };
}

function initCotizador(root, trabajos) {
  const caja = root.querySelector('[data-cotizador]');
  if (!caja) return;
  const rango = caja.querySelector('[data-cotizador-m2]');
  const valorM2 = caja.querySelector('[data-cotizador-m2-valor]');
  const monto = caja.querySelector('[data-cotizador-monto]');
  const plazo = caja.querySelector('[data-cotizador-plazo]');
  const nota = caja.querySelector('[data-cotizador-nota]');
  const cta = caja.querySelector('[data-cotizador-cta]');
  const tituloRubro = caja.querySelector('[data-cotizador-rubro]');
  let rubroId = 'refacciones';

  const pintar = () => {
    const r = RUBROS.find(x => x.id === rubroId);
    tituloRubro.textContent = r.nombre;
    const m2 = Number(rango.value);
    valorM2.textContent = `${m2} m²`;
    if (VISITA.includes(r.id)) {
      rango.closest('.cotizador__campo').style.opacity = '.4';
      rango.disabled = true;
      monto.textContent = 'A coordinar en la visita';
      plazo.textContent = `Plazo estimado: ${r.plazo}`;
      nota.textContent = 'Este trabajo no se estima por m² — un técnico lo mide en el lugar.';
      cta.dataset.wspMsg = mensajeRubro(r);
    } else {
      rango.closest('.cotizador__campo').style.opacity = '1';
      rango.disabled = false;
      const total = [r.m2min * m2, r.m2max * m2];
      monto.textContent = `${fmt(total[0])} – ${fmt(total[1])}`;
      plazo.textContent = `Plazo estimado: ${r.plazo}`;
      nota.textContent = 'Rango estimado sobre materiales y mano de obra estándar — no es un presupuesto formal, eso lo dejamos por escrito después de ver el lugar.';
      cta.dataset.wspMsg = `Hola, quiero pedir presupuesto para un trabajo de ${r.nombre.toLowerCase()} de aproximadamente ${m2} m². El estimado que vi fue de ${fmt(total[0])} a ${fmt(total[1])}, ¿coordinamos una visita?`;
    }
    cta.href = `https://wa.me/${WSP}?text=${encodeURIComponent(cta.dataset.wspMsg)}`;
  };

  rango?.addEventListener('input', pintar);
  root.addEventListener('rubro:elegido', e => { if (e.detail.id) { rubroId = e.detail.id; pintar(); } });
  caja.querySelectorAll('[data-cotizador-rubro-btn]').forEach(btn => {
    btn.addEventListener('click', () => { rubroId = btn.dataset.cotizadorRubroBtn; trabajos?.elegir?.(rubroId); pintar(); });
  });
  pintar();
}

function initBuscadorTipo(root) {
  const grid = root.querySelector('.buscador-tipo__grid');
  const catalogo = document.querySelector('[data-catalogo]');
  if (!grid) return;
  grid.querySelectorAll('.buscador-tipo__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      grid.querySelectorAll('.buscador-tipo__btn').forEach(b => b.classList.remove('is-activo'));
      btn.classList.add('is-activo');
      catalogo?.dispatchEvent(new CustomEvent('rubro:elegido', { detail: { id: btn.dataset.rubro } }));
      document.getElementById('trabajos')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

function initFiltrosLaterales(root) {
  const panel = root.querySelector('[data-filtros-panel]');
  if (!panel) return;
  const grid = root.querySelector('[data-trabajos-grid]');
  const limpiar = panel.querySelector('.filtros-limpiar');
  const checks = () => [...panel.querySelectorAll('input[type="checkbox"]')];

  const aplicar = () => {
    const activos = checks().filter(c => c.checked).map(c => c.value);
    if (!grid) return;
    [...grid.children].forEach(card => {
      const visible = !activos.length || activos.includes(card.dataset.rubro);
      card.style.display = visible ? '' : 'none';
    });
  };
  checks().forEach(c => c.addEventListener('change', aplicar));
  limpiar?.addEventListener('click', () => { checks().forEach(c => (c.checked = false)); aplicar(); });
}

function initRailDrag(root) {
  root.querySelectorAll('.rail').forEach(rail => {
    let down = false, moved = false, startX = 0, startScroll = 0;
    rail.addEventListener('mousedown', e => {
      down = true; moved = false; startX = e.pageX; startScroll = rail.scrollLeft;
      rail.classList.add('is-dragging');
    });
    window.addEventListener('mousemove', e => {
      if (!down) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 6) moved = true;
      rail.scrollLeft = startScroll - dx;
    });
    window.addEventListener('mouseup', () => { down = false; rail.classList.remove('is-dragging'); });
    rail.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  });
}

function initMovimiento() {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof Flip !== 'undefined') gsap.registerPlugin(Flip);
  if (reduceMotion) return;
  const heroImg = document.querySelector('.hero__slide.is-activo img, .hero--corto');
  if (heroImg) gsap.fromTo(heroImg, { scale: 1.06 }, { scale: 1, duration: 1.3, ease: 'power2.out' });
  window.addEventListener('load', () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); });
}

document.addEventListener('DOMContentLoaded', () => {
  const anio = document.getElementById('anio');
  if (anio) anio.textContent = String(new Date().getFullYear());
  initNav();
  initWspFloat();
  initWspLinks();
  initHero();
  initRailDrag(document);
  document.querySelectorAll('[data-catalogo]').forEach(root => {
    const trabajos = initTrabajosGrid(root);
    initCotizador(root, trabajos);
    initFiltrosLaterales(root);
  });
  initBuscadorTipo(document);
  initMovimiento();
  initReveals();
});
