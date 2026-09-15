/* RED MILENIUM — render e interacción. Usa data.js + core.js. */
/* global AREAS, CURSOS, DOCENTES, NIVELES, MODALIDADES, DURACIONES, esc, formatPrecio, precioFinal, getCurso, getDocente, getArea, totalClases, cursosDeArea, waLink, Cart, Progress, Session, filtrarCursos, showToast, MotionPathPlugin, setInterval, confirm, history */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const BASE = (location.pathname.includes('/curso/') || location.pathname.includes('/aula/') || location.pathname.includes('/area/')) ? '../' : '';
const IMG = p => BASE + p;
const qs = new URLSearchParams(location.search);
const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

/* ---------- Reveals ---------- */
function initReveal() {
  const els = document.querySelectorAll('[data-animate]:not(.in)');
  if (!('IntersectionObserver' in window) || reduce) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(ents => {
    ents.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const sibs = [...el.parentElement.querySelectorAll(':scope > [data-animate]')];
      el.style.transitionDelay = Math.min(Math.max(sibs.indexOf(el), 0), 6) * 0.09 + 's';
      el.classList.add('in');
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
  els.forEach(e => io.observe(e));
}

/* ---------- Nav ---------- */
function initNav() {
  const t = document.getElementById('navToggle'), n = document.getElementById('mobileNav');
  if (!t || !n) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const close = () => { n.classList.remove('open'); bd.classList.remove('open'); t.setAttribute('aria-expanded', 'false'); n.setAttribute('inert', ''); document.body.classList.remove('no-scroll'); t.focus(); };
  const open = () => { n.classList.add('open'); bd.classList.add('open'); t.setAttribute('aria-expanded', 'true'); n.removeAttribute('inert'); document.body.classList.add('no-scroll'); n.querySelector('a')?.focus(); };
  t.addEventListener('click', () => n.classList.contains('open') ? close() : open());
  bd.addEventListener('click', close);
  n.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && n.classList.contains('open')) close(); });
}

/* ---------- Carrito ---------- */
function cartBadge() {
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    const n = Cart.count();
    b.textContent = n;
    b.classList.toggle('has', n > 0);
    b.classList.remove('bump'); void b.offsetWidth;
    if (n > 0) b.classList.add('bump');
  });
}
function renderCart() {
  const box = document.getElementById('cartItems'); if (!box) return;
  const items = Cart.items();
  const totalEl = document.getElementById('cartTotal'), ahorroEl = document.getElementById('cartAhorro');
  const chk = document.getElementById('cartCheckout');
  if (!items.length) {
    box.innerHTML = '<div class="cart-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg><p>Todavía no elegiste ningún curso.</p><a class="btn btn-ghost" href="' + BASE + 'catalogo.html">Ver los 25 cursos</a></div>';
    if (totalEl) totalEl.textContent = formatPrecio(0);
    if (ahorroEl) ahorroEl.parentElement.hidden = true;
    if (chk) chk.disabled = true;
    return;
  }
  box.innerHTML = items.map(c => {
    const d = getDocente(c.docenteId);
    return '<div class="cart-item"><img src="' + IMG(c.portada) + '" alt="" width="84" height="58" loading="lazy">' +
      '<div><h4>' + esc(c.titulo) + '</h4><span>' + esc(d?.nombre || '') + ' · ' + esc(c.modalidad) + '</span>' +
      '<strong>' + formatPrecio(precioFinal(c)) + '</strong></div>' +
      '<button type="button" class="cart-remove" data-remove="' + c.id + '" aria-label="Quitar ' + esc(c.titulo) + '">&times;</button></div>';
  }).join('');
  if (totalEl) totalEl.textContent = formatPrecio(Cart.total());
  if (ahorroEl) { const a = Cart.ahorro(); ahorroEl.parentElement.hidden = a <= 0; ahorroEl.textContent = formatPrecio(a); }
  if (chk) chk.disabled = false;
  box.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => { Cart.remove(b.dataset.remove); showToast('Curso quitado del carrito'); }));
}
function initCartDrawer() {
  const drawer = document.getElementById('cartDrawer'); if (!drawer) return;
  let lastFocus = null;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const open = () => { lastFocus = document.activeElement; renderCart(); drawer.classList.add('open'); bd.classList.add('open'); drawer.removeAttribute('inert'); document.body.classList.add('no-scroll'); drawer.querySelector('.cart-close')?.focus(); };
  const close = () => { drawer.classList.remove('open'); bd.classList.remove('open'); drawer.setAttribute('inert', ''); document.body.classList.remove('no-scroll'); lastFocus?.focus(); };
  bd.addEventListener('click', () => { if (drawer.classList.contains('open')) close(); });
  window.rmOpenCart = open;
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); open(); }));
  drawer.querySelectorAll('[data-close-cart]').forEach(b => b.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (!drawer.classList.contains('open')) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    const f = [...drawer.querySelectorAll('button, a[href], textarea, input, select')].filter(el => !el.disabled && el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  const chk = document.getElementById('cartCheckout');
  if (chk) chk.addEventListener('click', () => {
    if (!Cart.count()) return;
    Cart.items().forEach(c => Progress.enroll(c.id));
    Session.enter(); Cart.clear();
    showToast('¡Listo! El pago y tu cuenta se activan al pasar a producción.');
    setTimeout(() => { location.href = BASE + 'alumno.html'; }, 1500);
  });
  document.addEventListener('cart:updated', () => { cartBadge(); renderCart(); });
  cartBadge();
}

/* ---------- Cards ---------- */
function precioHTML(c) {
  if (c.precio == null) return '<span class="c-precio consultar">A convenir · in-company</span>';
  const pf = precioFinal(c);
  return c.descuento > 0
    ? '<span class="c-precio"><s>' + formatPrecio(c.precio) + '</s>' + formatPrecio(pf) + '</span>'
    : '<span class="c-precio">' + formatPrecio(pf) + '</span>';
}
function cardHTML(c) {
  const d = getDocente(c.docenteId), a = getArea(c.area) || { label: '', colorInk: '#1740d8' };
  const badge = c.nuevo ? '<span class="c-badge c-badge--new">Nuevo</span>' : (c.destacado ? '<span class="c-badge">Más elegido</span>' : '');
  const href = BASE + 'curso/?id=' + c.id;
  return '<article class="c-card" data-animate style="--accent:' + a.colorInk + '">' +
    '<a class="c-cover" href="' + href + '" tabindex="-1" aria-hidden="true"><img src="' + IMG(c.portada) + '" alt="" width="1200" height="900" loading="lazy" decoding="async">' + badge + '<span class="c-cover-cta">Ver curso</span></a>' +
    '<div class="c-body"><span class="c-area">' + esc(a.label) + '</span>' +
    '<h3><a href="' + href + '">' + esc(c.titulo) + '</a></h3>' +
    '<span class="c-doc">Con ' + esc(d?.nombre || '') + '</span>' +
    '<div class="c-meta"><span>' + esc(c.nivel) + '</span><i></i><span>' + esc(c.modalidad) + '</span><i></i><span>' + esc(c.duracion) + '</span><i></i><span>' + totalClases(c) + ' clases</span></div>' +
    '<div class="c-foot">' + precioHTML(c) + '<a class="btn btn-sm" href="' + href + '">Ver curso</a></div>' +
    '</div></article>';
}
function pintarGrid(el, lista, animarYa = true) {
  el.innerHTML = lista.map(c => cardHTML(c)).join('');
  if (!animarYa) { initReveal(); return; }
  el.querySelectorAll('[data-animate]').forEach((n, i) => {
    n.style.transitionDelay = Math.min(i, 10) * 0.05 + 's';
    requestAnimationFrame(() => n.classList.add('in'));
  });
}

/* ---------- Home ---------- */
function initHome() {
  const dest = document.getElementById('destacados');
  if (dest) pintarGrid(dest, CURSOS.filter(c => c.destacado).slice(0, 8), false);

  const track = document.getElementById('areasTrack');
  if (track) track.innerHTML = AREAS.map(a => {
    const cur = cursosDeArea(a.id);
    const lista = cur.slice(0, 4).map(c => '<li>' + esc(c.titulo) + '</li>').join('');
    const resto = cur.length > 4 ? '<li class="more">+ ' + (cur.length - 4) + ' cursos más en el área</li>' : '';
    return '<article class="area-panel" style="--accent:' + a.color + ';--accent-2:' + a.colorLight + ';--on-accent:' + a.onAccent + '">' +
      '<div class="ap-copy"><span class="ap-num">' + a.n + '</span>' +
      '<h3 class="ap-label">' + esc(a.label) + '</h3>' +
      '<p class="ap-bajada">' + esc(a.bajada) + '</p>' +
      '<p class="ap-claim">' + esc(a.claim) + '</p>' +
      '<p class="ap-dato">' + esc(a.dato) + '</p>' +
      '<div class="ap-acts"><a class="btn" href="area/?a=' + a.id + '">Ver el área</a><a class="btn btn-ghost" href="catalogo.html?area=' + a.id + '">' + cur.length + ' cursos</a></div></div>' +
      '<div class="ap-visual"><div class="ap-photo"><img src="' + esc(a.portada) + '" alt="' + esc(a.label) + '" width="1200" height="900" loading="lazy" decoding="async"></div>' +
      '<div class="ap-list"><h4>Qué vas a encontrar</h4><ul>' + lista + resto + '</ul></div></div>' +
      '</article>';
  }).join('');

  const docs = document.getElementById('docentesList');
  if (docs) docs.innerHTML = DOCENTES.map(d => {
    const a = getArea(d.area);
    return '<article class="doc-card" data-animate><img src="' + esc(d.foto) + '" alt="' + esc(d.nombre) + '" width="800" height="950" loading="lazy" decoding="async"><div class="doc-info"><span class="doc-tag">Perfil demostrativo</span><h3>' + esc(d.nombre) + '</h3><p>' + esc(d.rol) + ' · ' + esc(a.label) + '</p></div></article>';
  }).join('');

  const form = document.getElementById('quickSearch');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const v = form.querySelector('input').value.trim();
    location.href = 'catalogo.html' + (v ? '?q=' + encodeURIComponent(v) : '');
  });

  initStats(); initAreasChapter(); initExport();
}

/* Contadores */
function initStats() {
  const box = document.getElementById('stats'); if (!box) return;
  const clases = CURSOS.reduce((s, c) => s + totalClases(c), 0);
  const datos = [
    { n: AREAS.length, l: 'Áreas de capacitación' },
    { n: CURSOS.length, l: 'Cursos y diplomaturas' },
    { n: clases, l: 'Clases en la plataforma' },
    { n: 12, l: 'Meses de acceso a cada curso' }
  ];
  box.innerHTML = datos.map(d => '<div class="stat"><b data-count="' + d.n + '">0</b><span>' + d.l + '</span></div>').join('');
  const nums = box.querySelectorAll('[data-count]');
  if (!('IntersectionObserver' in window) || reduce) { nums.forEach(n => n.textContent = Number(n.dataset.count).toLocaleString('es-AR')); return; }
  const io = new IntersectionObserver(ents => ents.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = Number(el.dataset.count); let t0 = null;
    const step = ts => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / 1400, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString('es-AR');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step); io.unobserve(el);
  }), { threshold: .6 });
  nums.forEach(n => io.observe(n));
}

/* Coreografía mayor: conmutador horizontal de áreas */
function initAreasChapter() {
  const chapter = document.getElementById('areas'); if (!chapter) return;
  const track = document.getElementById('areasTrack');
  const bar = document.getElementById('areasBar');
  const num = document.getElementById('areasNum');
  const setStep = i => {
    if (num) num.innerHTML = '<b>0' + (i + 1) + '</b> / 04';
    if (bar) bar.style.transform = 'scaleX(' + ((i + 1) / AREAS.length) + ')';
    chapter.style.setProperty('--accent', AREAS[i].color);
    chapter.style.setProperty('--accent-2', AREAS[i].colorLight);
  };
  setStep(0);
  if (!hasGsap || reduce) {
    document.documentElement.classList.add('no-gsap');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(ents => ents.forEach(e => { if (e.isIntersecting) setStep([...track.children].indexOf(e.target)); }), { threshold: .45 });
      [...track.children].forEach(p => io.observe(p));
    }
    return;
  }
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const dist = () => Math.max(track.scrollWidth - window.innerWidth, 1);
    const tw = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: chapter, pin: true, scrub: .55, start: 'top top',
        end: () => '+=' + dist(), invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: self => setStep(Math.min(Math.round(self.progress * (AREAS.length - 1)), AREAS.length - 1))
      }
    });
    return () => { tw.scrollTrigger?.kill(); gsap.set(track, { x: 0 }); };
  });
  mm.add('(max-width: 899px)', () => {
    const io = new IntersectionObserver(ents => ents.forEach(e => { if (e.isIntersecting) setStep([...track.children].indexOf(e.target)); }), { threshold: .4 });
    [...track.children].forEach(p => io.observe(p));
    return () => io.disconnect();
  });
}

/* Momento firma: la ruta de Oficios for Export */
function initExport() {
  const svg = document.getElementById('routeSvg'); if (!svg) return;
  const path = svg.querySelector('#routePath');
  const draw = svg.querySelector('#routeDraw');
  const plane = svg.querySelector('#routePlane');
  const dots = svg.querySelector('#routeDots');
  const labels = ['Elegís el oficio', 'Práctica guiada', 'Normas y vocabulario', 'Porfolio y certificado'];
  const len = path.getTotalLength();
  labels.forEach((l, i) => {
    const p = path.getPointAtLength(len * (i / (labels.length - 1)));
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'route-dot');
    g.innerHTML = '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="5"></circle>' +
      '<text x="' + p.x.toFixed(1) + '" y="' + (p.y - 14).toFixed(1) + '" text-anchor="' + (i === 0 ? 'start' : (i === labels.length - 1 ? 'end' : 'middle')) + '">' + l + '</text>';
    dots.appendChild(g);
  });
  draw.style.strokeDasharray = len;
  if (!hasGsap || reduce) {
    draw.style.strokeDashoffset = 0;
    if (plane) { const p = path.getPointAtLength(len); plane.setAttribute('transform', 'translate(' + p.x + ',' + p.y + ')'); }
    return;
  }
  draw.style.strokeDashoffset = len;
  const tl = gsap.timeline({ scrollTrigger: { trigger: '#exportSec', start: 'top 72%', end: 'bottom 65%', scrub: .7 } });
  tl.to(draw, { strokeDashoffset: 0, ease: 'none' }, 0);
  if (plane && typeof MotionPathPlugin !== 'undefined') {
    tl.to(plane, { motionPath: { path: path, align: path, alignOrigin: [.5, .5], autoRotate: true }, ease: 'none' }, 0);
  } else if (plane) {
    plane.style.display = 'none';
  }
  const word = document.getElementById('exportWord');
  if (word) gsap.to(word, { xPercent: -22, ease: 'none', scrollTrigger: { trigger: '#exportSec', start: 'top bottom', end: 'bottom top', scrub: .8 } });
}

/* ---------- Catálogo ---------- */
function initCatalogo() {
  const grid = document.getElementById('cursosGrid'); if (!grid) return;
  const st = { q: qs.get('q') || '', area: qs.get('area') || '', nivel: '', modalidad: '', rango: '' };
  const PASO = 12; let visibles = PASO;
  const buscar = document.getElementById('buscar');
  const chipsArea = document.getElementById('chipsArea');
  const selNivel = document.getElementById('selNivel');
  const selMod = document.getElementById('selMod');
  const selDur = document.getElementById('selDur');
  const count = document.getElementById('resCount');
  const more = document.getElementById('verMas');

  if (chipsArea) chipsArea.innerHTML = '<button type="button" class="chip" data-area="">Todas</button>' + AREAS.map(a => '<button type="button" class="chip" data-area="' + a.id + '">' + esc(a.label) + '</button>').join('');
  if (selNivel) selNivel.innerHTML = '<option value="">Todos los niveles</option>' + NIVELES.map(n => '<option value="' + n + '">' + n + '</option>').join('');
  if (selMod) selMod.innerHTML = '<option value="">Toda modalidad</option>' + MODALIDADES.map(m => '<option value="' + m + '">' + m + '</option>').join('');
  if (selDur) selDur.innerHTML = '<option value="">Cualquier duración</option>' + DURACIONES.map(d => '<option value="' + d.id + '">' + d.label + '</option>').join('');

  const syncChips = () => chipsArea?.querySelectorAll('.chip').forEach(ch => ch.classList.toggle('on', (ch.dataset.area || '') === st.area));

  function render() {
    const res = filtrarCursos(st);
    if (count) count.innerHTML = '<b>' + res.length + '</b> ' + (res.length === 1 ? 'curso encontrado' : 'cursos encontrados');
    if (!res.length) {
      grid.innerHTML = '<div class="empty"><h3>No encontramos cursos con esos filtros</h3><p>Probá con otra palabra o mirá el catálogo completo.</p><button type="button" class="btn btn-cta" id="emptyClear">Limpiar filtros</button></div>';
      grid.querySelector('#emptyClear').addEventListener('click', clearAll);
      if (more) more.hidden = true;
      return;
    }
    pintarGrid(grid, res.slice(0, visibles));
    if (more) more.hidden = res.length <= visibles;
    if (hasGsap) ScrollTrigger.refresh();
  }
  function clearAll() {
    st.q = ''; st.area = ''; st.nivel = ''; st.modalidad = ''; st.rango = ''; visibles = PASO;
    if (buscar) buscar.value = '';
    if (selNivel) selNivel.value = ''; if (selMod) selMod.value = ''; if (selDur) selDur.value = '';
    syncChips(); render();
  }
  const reset = () => { visibles = PASO; render(); };
  if (buscar) { buscar.value = st.q; buscar.addEventListener('input', () => { st.q = buscar.value; reset(); }); }
  if (chipsArea) chipsArea.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; st.area = b.dataset.area || ''; syncChips(); reset(); });
  if (selNivel) selNivel.addEventListener('change', () => { st.nivel = selNivel.value; reset(); });
  if (selMod) selMod.addEventListener('change', () => { st.modalidad = selMod.value; reset(); });
  if (selDur) selDur.addEventListener('change', () => { st.rango = selDur.value; reset(); });
  document.getElementById('limpiar')?.addEventListener('click', clearAll);
  more?.addEventListener('click', () => { visibles += PASO; render(); });
  const fBtn = document.getElementById('filtrosToggle'), fPanel = document.getElementById('filtrosPanel');
  if (fBtn && fPanel) fBtn.addEventListener('click', () => { const o = fPanel.classList.toggle('open'); fBtn.setAttribute('aria-expanded', String(o)); });
  syncChips(); render();
}

/* ---------- Página de área ---------- */
function initArea() {
  const cont = document.getElementById('areaCont'); if (!cont) return;
  const a = getArea(qs.get('a'));
  if (!a) {
    cont.innerHTML = '<div class="empty wrap"><h3>Área no encontrada</h3><p>Puede que el enlace esté roto.</p><a class="btn btn-cta" href="' + BASE + 'catalogo.html">Ver todos los cursos</a></div>';
    return;
  }
  document.title = a.label + ' — RED MILENIUM';
  document.querySelector('meta[name="description"]')?.setAttribute('content', a.claim + ' ' + a.intro.slice(0, 90));
  const cursos = cursosDeArea(a.id);
  const hero = document.getElementById('areaHero');
  hero.style.setProperty('--accent', a.color);
  hero.style.setProperty('--accent-2', a.colorLight);
  hero.innerHTML = '<div class="wrap">' +
    '<nav class="crumbs" aria-label="Ruta"><a href="' + BASE + 'index.html">Inicio</a> / <span>' + esc(a.label) + '</span></nav>' +
    '<span class="area-hero-tag">' + a.n + '</span>' +
    '<h1>' + esc(a.claim) + '</h1>' +
    '<p>' + esc(a.intro) + '</p>' +
    '<div class="area-nav">' + AREAS.map(x => '<a href="?a=' + x.id + '"' + (x.id === a.id ? ' class="on" aria-current="page"' : '') + '>' + esc(x.label) + '</a>').join('') + '</div>' +
    '</div>';
  cont.innerHTML =
    '<section class="sec-alt"><div class="wrap">' +
      '<span class="eyebrow">' + esc(a.label) + '</span>' +
      '<p class="area-dato" data-animate>' + esc(a.dato) + '<small>Dato de contexto del mercado aportado por RED MILENIUM. Las fuentes se citan al pasar la web a producción.</small></p>' +
      '<div class="area-info" style="margin-top:1.6rem">' +
        '<div class="area-box" data-animate><h3>Para vos</h3><p>' + esc(a.individuos) + '</p></div>' +
        '<div class="area-box" data-animate><h3>Para tu empresa o institución</h3><p>' + esc(a.organizaciones) + '</p></div>' +
      '</div></div></section>' +
    '<section><div class="wrap"><div class="head-row"><div class="sec-head"><span class="eyebrow">Cursos del área</span><h2>' + cursos.length + ' formaciones en ' + esc(a.label) + '</h2></div>' +
      '<a class="btn btn-ghost" href="' + BASE + 'catalogo.html?area=' + a.id + '">Verlas en el catálogo</a></div>' +
      '<div class="c-grid" id="areaGrid"></div></div></section>' +
    '<section class="sec-dark"><div class="wrap center"><h2>¿Querés esta área para tu equipo?</h2><p>Armamos el programa a medida y lo damos en vivo para tu empresa o institución.</p>' +
      '<div class="cta-acts"><a class="btn btn-cta" href="' + waLink('Hola RED MILENIUM, me interesa el área ' + a.label + ' para mi equipo. ¿Cómo seguimos?') + '" target="_blank" rel="noopener">Consultar por WhatsApp</a>' +
      '<a class="btn btn-ghost" href="' + BASE + 'catalogo.html">Ver todo el catálogo</a></div></div></section>';
  pintarGrid(document.getElementById('areaGrid'), cursos);
  initReveal();
}

/* ---------- Ficha de curso ---------- */
function initCurso() {
  const cont = document.getElementById('cursoDetalle'); if (!cont) return;
  const c = getCurso(qs.get('id'));
  document.getElementById('cursoLoading')?.remove();
  if (!c) {
    cont.innerHTML = '<div class="empty wrap"><h3>No encontramos ese curso</h3><p>Puede que el enlace esté roto o que el curso ya no esté disponible.</p><a class="btn btn-cta" href="' + BASE + 'catalogo.html">Volver al catálogo</a></div>';
    return;
  }
  const a = getArea(c.area), d = getDocente(c.docenteId);
  const enrolled = Progress.isEnrolled(c.id), inCart = Cart.has(c.id);
  document.title = c.titulo + ' — RED MILENIUM';
  document.querySelector('meta[name="description"]')?.setAttribute('content', c.descripcionCorta);

  const modulos = c.modulos.map((m, mi) => {
    const clases = m.clases.map(cl => {
      const ico = cl.tipo === 'lectura' ? '&#9776;' : (cl.tipo === 'pdf' ? '&#9660;' : '&#9658;');
      return '<li class="cl"><span class="cl-ico" aria-hidden="true">' + ico + '</span><span class="cl-t">' + esc(cl.titulo) + '</span>' +
        (cl.preview ? '<span class="cl-prev">Vista previa</span>' : '<span></span>') + '<span class="cl-dur">' + esc(cl.duracion) + '</span></li>';
    }).join('');
    return '<details class="mod"' + (mi === 0 ? ' open' : '') + '><summary><span class="mod-n">Módulo ' + (mi + 1) + '</span><span class="mod-t">' + esc(m.titulo) + '</span><span class="mod-c">' + m.clases.length + ' clases</span></summary><ul class="mod-clases">' + clases + '</ul></details>';
  }).join('');

  let precioBlock, ctaBtn, segundo;
  if (c.precio == null) {
    precioBlock = '<p class="cd-consultar">Programa in-company · presupuesto a medida</p>';
    ctaBtn = '<a class="btn btn-cta btn-block" href="' + waLink('Hola RED MILENIUM, quiero información del programa in-company "' + c.titulo + '".') + '" target="_blank" rel="noopener">Pedir propuesta por WhatsApp</a>';
    segundo = '<a class="btn btn-ghost btn-block" href="' + BASE + 'area/?a=' + a.id + '">Ver el área ' + esc(a.label) + '</a>';
  } else {
    const pf = precioFinal(c);
    precioBlock = c.descuento > 0
      ? '<div class="cd-precio"><s>' + formatPrecio(c.precio) + '</s><strong>' + formatPrecio(pf) + '</strong><span class="cd-off">-' + c.descuento + '%</span></div>'
      : '<div class="cd-precio"><strong>' + formatPrecio(pf) + '</strong></div>';
    ctaBtn = enrolled
      ? '<a class="btn btn-cta btn-block" href="' + BASE + 'aula/?curso=' + c.id + '">Ir al aula</a>'
      : '<button type="button" class="btn btn-cta btn-block" id="ctaInscribir">' + (inCart ? 'Ya está en tu carrito' : 'Sumar al carrito') + '</button>';
    segundo = '<button type="button" class="btn btn-ghost btn-block" data-open-cart>Ver mi carrito</button>';
  }

  cont.innerHTML =
    '<nav class="crumbs wrap" aria-label="Ruta"><a href="' + BASE + 'index.html">Inicio</a> / <a href="' + BASE + 'area/?a=' + a.id + '">' + esc(a.label) + '</a> / <span>' + esc(c.titulo) + '</span></nav>' +
    '<div class="cd-top wrap"><div class="cd-main">' +
      '<span class="eyebrow">' + esc(a.label) + '</span>' +
      '<h1 data-animate>' + esc(c.titulo) + '</h1>' +
      '<p class="cd-lead" data-animate>' + esc(c.descripcionCompleta) + '</p>' +
      '<div class="cd-meta" data-animate><span>' + esc(c.nivel) + '</span><span>' + esc(c.modalidad) + '</span><span>Carga horaria: ' + esc(c.duracion) + '</span><span>' + totalClases(c) + ' clases</span><span>Acceso 12 meses</span></div>' +
      '<div class="cd-doc" data-animate><img src="' + IMG(d?.foto || 'images/doc-1.webp') + '" alt="' + esc(d?.nombre || '') + '" width="92" height="108" loading="lazy"><div><span class="doc-tag">Perfil demostrativo</span><strong>' + esc(d?.nombre || '') + '</strong><p>' + esc(d?.bio || '') + '</p></div></div>' +
    '</div>' +
    '<aside class="cd-side"><div class="cd-card">' +
      '<div class="cd-cover"><img src="' + IMG(c.portada) + '" alt="' + esc(c.titulo) + '" width="1200" height="900"></div>' +
      precioBlock + ctaBtn + segundo +
      '<ul class="cd-incluye">' + c.incluye.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
    '</div></aside></div>' +
    '<section class="cd-sec wrap"><h2 data-animate>Qué vas a poder hacer</h2><ul class="cd-result">' + c.resultados.map(r => '<li data-animate>' + esc(r) + '</li>').join('') + '</ul></section>' +
    '<section class="cd-sec wrap"><h2 data-animate>Programa</h2><div class="cd-programa">' + modulos + '</div></section>' +
    '<section class="cd-sec wrap cd-req"><div data-animate><h3>Requisitos</h3><ul>' + c.requisitos.map(r => '<li>' + esc(r) + '</li>').join('') + '</ul></div>' +
      '<div data-animate><h3>Qué incluye</h3><ul>' + c.incluye.map(r => '<li>' + esc(r) + '</li>').join('') + '</ul></div></section>' +
    faqCursoHTML(c) +
    relacionadosHTML(c);

  document.getElementById('ctaInscribir')?.addEventListener('click', e => {
    Cart.add(c.id); showToast('Curso sumado al carrito'); e.target.textContent = 'Ya está en tu carrito';
  });
  cont.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', ev => { ev.preventDefault(); window.rmOpenCart?.(); }));
  initStickyCta(c); initReveal();
  const ld = document.getElementById('cursoLd');
  if (ld) ld.textContent = JSON.stringify([{
    '@context': 'https://schema.org', '@type': 'Course', name: c.titulo, description: c.descripcionCorta,
    provider: { '@type': 'EducationalOrganization', name: 'RED MILENIUM', sameAs: 'https://instagram.com/redmilenium' },
    inLanguage: 'es-AR',
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: c.duracion },
    offers: c.precio == null ? undefined : { '@type': 'Offer', price: precioFinal(c), priceCurrency: 'ARS', availability: 'https://schema.org/InStock', category: 'Curso online' }
  }, {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: '../index.html' },
      { '@type': 'ListItem', position: 2, name: a.label, item: '../area/?a=' + a.id },
      { '@type': 'ListItem', position: 3, name: c.titulo }
    ]
  }]);
}
function faqCursoHTML(c) {
  const preguntas = c.precio == null
    ? [['¿Se puede cursar de forma individual?', 'No: es un programa in-company. Se dicta para el equipo de una empresa o institución, con una reunión de diagnóstico previa.'],
       ['¿Cómo se define el precio?', 'Según la cantidad de participantes, la carga horaria acordada y el alcance del programa. Se envía una propuesta escrita.'],
       ['¿Es presencial o por videollamada?', 'Los encuentros son en vivo y se coordinan por videollamada; en Tucumán también pueden ser presenciales.']]
    : [['¿Cuándo empiezo?', 'En el momento: al inscribirte se habilita el aula y el curso queda disponible por 12 meses.'],
       ['¿Qué pasa si me atraso?', 'No hay fechas de entrega: cursás a tu ritmo y el progreso queda guardado clase por clase.'],
       ['¿El certificado es oficial?', 'Es un certificado propio de RED MILENIUM que acredita la cursada completa. No es un título oficial ni una habilitación profesional.']];
  return '<section class="cd-sec wrap"><h2 data-animate>Preguntas sobre este curso</h2><div class="faq-list">' +
    preguntas.map(([q, r]) => '<details class="faq"><summary>' + esc(q) + '</summary><p>' + esc(r) + '</p></details>').join('') +
    '</div></section>';
}
function relacionadosHTML(c) {
  const rel = CURSOS.filter(x => x.id !== c.id && x.area === c.area).slice(0, 4);
  const list = rel.length ? rel : CURSOS.filter(x => x.id !== c.id).slice(0, 4);
  return '<section class="cd-sec wrap"><h2 data-animate>Seguí por acá</h2><div class="c-grid">' + list.map(x => cardHTML(x)).join('') + '</div></section>';
}
function initStickyCta(c) {
  const bar = document.getElementById('stickyCta'); if (!bar) return;
  const precioEl = bar.querySelector('.sc-precio'), act = bar.querySelector('.sc-act');
  if (c.precio == null) {
    precioEl.textContent = 'In-company';
    act.textContent = 'Consultar';
    act.onclick = () => window.open(waLink('Hola RED MILENIUM, quiero información del programa in-company "' + c.titulo + '".'), '_blank', 'noopener');
  } else {
    precioEl.textContent = formatPrecio(precioFinal(c));
    const refresh = () => {
      if (Progress.isEnrolled(c.id)) { act.textContent = 'Ir al aula'; act.onclick = () => { location.href = BASE + 'aula/?curso=' + c.id; }; }
      else { act.textContent = Cart.has(c.id) ? 'En el carrito' : 'Sumar al carrito'; act.onclick = () => { Cart.add(c.id); showToast('Curso sumado al carrito'); refresh(); }; }
    };
    refresh();
  }
  const anchor = document.querySelector('.cd-side');
  if (anchor && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(([e]) => bar.classList.toggle('show', !e.isIntersecting), { rootMargin: '-45% 0px 0px 0px' });
    io.observe(anchor);
  }
}

/* ---------- Panel del alumno ---------- */
function initAlumno() {
  const cont = document.getElementById('alumnoCont'); if (!cont) return;
  const gate = document.getElementById('alumnoGate');
  const st = Progress.get();
  const enrolled = st.enrolledCourseIds.map(getCurso).filter(Boolean);
  if (!Session.isIn() && !enrolled.length) { if (gate) gate.hidden = false; cont.hidden = true; return; }
  if (gate) gate.hidden = true;
  cont.hidden = false;

  const grid = document.getElementById('misCursos');
  if (!enrolled.length) {
    grid.innerHTML = '<div class="empty"><h3>Todavía no tenés cursos en tu cuenta demo</h3><p>Elegí uno del catálogo y probá el aula.</p><a class="btn btn-cta" href="catalogo.html">Ver el catálogo</a></div>';
  } else {
    grid.innerHTML = enrolled.map(c => {
      const p = Progress.courseProgress(c), last = Progress.getLast(c.id), a = getArea(c.area);
      return '<article class="al-card" style="--accent:' + a.colorInk + '"><img src="' + esc(c.portada) + '" alt="" width="1200" height="675" loading="lazy">' +
        '<div class="al-body"><span class="c-area">' + esc(a.label) + '</span><h3>' + esc(c.titulo) + '</h3>' +
        '<div class="al-bar"><span style="width:' + p + '%"></span></div>' +
        '<div class="al-foot"><span>' + p + '% completado</span><a class="btn btn-sm" href="aula/?curso=' + c.id + (last ? '&clase=' + last : '') + '">' + (p > 0 ? 'Continuar' : 'Empezar') + '</a></div>' +
        (p === 100 ? '<span class="al-cert">✓ Certificado disponible (demo)</span>' : '') +
        '</div></article>';
    }).join('');
  }
  const enProgreso = enrolled.filter(c => { const p = Progress.courseProgress(c); return p > 0 && p < 100; });
  const completados = enrolled.filter(c => Progress.courseProgress(c) === 100);
  const stats = document.getElementById('alStats');
  if (stats) stats.innerHTML =
    '<div><strong>' + enrolled.length + '</strong><span>Inscripciones</span></div>' +
    '<div><strong>' + enProgreso.length + '</strong><span>En curso</span></div>' +
    '<div><strong>' + completados.length + '</strong><span>Completados</span></div>';

  const cont2 = document.getElementById('continuar');
  if (cont2) {
    const target = enProgreso[0] || enrolled.find(c => Progress.courseProgress(c) < 100);
    if (target) {
      const last = Progress.getLast(target.id);
      cont2.hidden = false;
      cont2.innerHTML = '<span class="eyebrow">Seguí donde dejaste</span><h3>' + esc(target.titulo) + '</h3>' +
        '<a class="btn btn-cta" href="aula/?curso=' + target.id + (last ? '&clase=' + last : '') + '">Continuar aprendiendo</a>';
    } else { cont2.hidden = true; }
  }
  document.getElementById('resetDemo')?.addEventListener('click', () => {
    if (confirm('¿Reiniciar la demo? Se borra tu progreso y tus inscripciones de prueba.')) {
      Progress.reset(); Session.exit(); Cart.clear(); location.reload();
    }
  });
}
function initGate() {
  document.getElementById('enterDemo')?.addEventListener('click', () => {
    Session.enter();
    if (!Progress.get().enrolledCourseIds.length) { Progress.enroll(1); Progress.enroll(6); Progress.enroll(23); }
    location.reload();
  });
}

/* ---------- Aula ---------- */
function initAula() {
  const cont = document.getElementById('aulaCont'); if (!cont) return;
  const c = getCurso(qs.get('curso'));
  if (!c) {
    cont.innerHTML = '<div class="empty wrap"><h3>No encontramos ese curso</h3><a class="btn btn-cta" href="' + BASE + 'catalogo.html">Volver al catálogo</a></div>';
    return;
  }
  document.title = 'Aula · ' + c.titulo + ' — RED MILENIUM';
  if (!Progress.isEnrolled(c.id)) {
    cont.innerHTML = '<div class="empty wrap"><h3>Este curso no está en tu cuenta demo</h3><p>El acceso al aula es demostrativo: sumá el curso desde su ficha y entrá con la cuenta de prueba.</p>' +
      '<a class="btn btn-cta" href="' + BASE + 'curso/?id=' + c.id + '">Ver el curso</a> <a class="btn btn-ghost" href="' + BASE + 'alumno.html">Mi panel</a></div>';
    return;
  }
  const flat = [];
  c.modulos.forEach(m => m.clases.forEach(cl => flat.push({ ...cl, modulo: m.titulo })));
  let currentId = qs.get('clase') || Progress.getLast(c.id) || flat[0].id;
  if (!flat.find(x => x.id === currentId)) currentId = flat[0].id;

  const sidebar = c.modulos.map(m => {
    const items = m.clases.map(cl => '<li><button type="button" class="aula-cl" data-clase="' + cl.id + '"><span class="ck" aria-hidden="true"></span><span class="aula-cl-t">' + esc(cl.titulo) + '</span><span class="aula-cl-d">' + esc(cl.duracion) + '</span></button></li>').join('');
    return '<div class="aula-mod"><h4>' + esc(m.titulo) + '</h4><ul>' + items + '</ul></div>';
  }).join('');

  cont.innerHTML = '<div class="aula-grid">' +
    '<aside class="aula-side" id="aulaSide"><a class="aula-back" href="' + BASE + 'alumno.html">&larr; Mi panel</a><h3>' + esc(c.titulo) + '</h3>' +
    '<div class="aula-prog"><div class="aula-prog-bar"><span id="aulaBar"></span></div><span id="aulaProgTxt"></span></div>' + sidebar + '</aside>' +
    '<div class="aula-main"><button type="button" class="btn btn-ghost btn-sm aula-menu" id="aulaMenu" aria-label="Ver el índice de clases">Índice de clases</button>' +
      '<div class="aula-stage" id="aulaStage"></div>' +
      '<div class="aula-bar"><button type="button" class="btn btn-ghost" id="aulaPrev">&larr; Anterior</button><button type="button" class="btn btn-cta" id="aulaDone"></button><button type="button" class="btn btn-ghost" id="aulaNext">Siguiente &rarr;</button></div>' +
      '<div class="aula-notes"><label for="aulaNote">Mis notas de esta clase</label><textarea id="aulaNote" placeholder="Escribí tus apuntes… se guardan en este navegador."></textarea></div>' +
    '</div></div>';

  const stage = document.getElementById('aulaStage'), bar = document.getElementById('aulaBar'), progTxt = document.getElementById('aulaProgTxt');
  const note = document.getElementById('aulaNote'), doneBtn = document.getElementById('aulaDone'), side = document.getElementById('aulaSide');
  const idx = () => flat.findIndex(x => x.id === currentId);

  function renderStage() {
    const cl = flat[idx()], done = Progress.isDone(c.id, cl.id);
    const tipo = cl.tipo === 'lectura' ? 'Lectura' : (cl.tipo === 'pdf' ? 'Material descargable' : 'Video');
    stage.innerHTML = '<div class="stage-media"><span class="stage-tipo">' + tipo + (cl.preview ? ' · Vista previa' : '') + '</span>' +
      '<span class="stage-play" aria-hidden="true">' + (cl.tipo === 'lectura' ? '&#9776;' : '&#9658;') + '</span>' +
      '<p class="stage-demo">Contenido demostrativo: los videos y materiales reales se cargan al pasar la plataforma a producción.</p></div>' +
      '<div class="stage-head"><span class="stage-mod">' + esc(cl.modulo) + '</span><h2>' + esc(cl.titulo) + '</h2><span class="stage-dur">' + esc(cl.duracion) + ' · clase ' + (idx() + 1) + ' de ' + flat.length + '</span></div>';
    document.querySelectorAll('.aula-cl').forEach(b => {
      b.classList.toggle('active', b.dataset.clase === currentId);
      b.classList.toggle('done', Progress.isDone(c.id, b.dataset.clase));
    });
    doneBtn.textContent = done ? '✓ Completada' : 'Marcar como completada';
    doneBtn.classList.toggle('is-done', done);
    note.value = Progress.getNote(c.id, cl.id);
    Progress.setLast(c.id, cl.id);
    const url = new URL(location.href); url.searchParams.set('clase', cl.id); history.replaceState(null, '', url);
    const p = Progress.courseProgress(c);
    bar.style.width = p + '%'; progTxt.textContent = p + '% completado';
    document.getElementById('aulaPrev').disabled = idx() === 0;
    document.getElementById('aulaNext').disabled = idx() === flat.length - 1;
  }
  function go(id) { if (flat.find(x => x.id === id)) { currentId = id; renderStage(); if (window.innerWidth < 980) side.classList.remove('open'); } }

  cont.querySelectorAll('.aula-cl').forEach(b => b.addEventListener('click', () => go(b.dataset.clase)));
  document.getElementById('aulaPrev').addEventListener('click', () => { const i = idx(); if (i > 0) go(flat[i - 1].id); });
  document.getElementById('aulaNext').addEventListener('click', () => { const i = idx(); if (i < flat.length - 1) go(flat[i + 1].id); });
  doneBtn.addEventListener('click', () => { Progress.toggleLesson(c.id, currentId); renderStage(); });
  note.addEventListener('input', () => Progress.saveNote(c.id, currentId, note.value));
  document.getElementById('aulaMenu').addEventListener('click', () => side.classList.toggle('open'));
  renderStage();
}

/* ---------- Base ---------- */
function initHeaderScroll() {
  const h = document.querySelector('.header-inner');
  const hero = document.querySelector('.hero, .page-hero');
  if (!h || !hero || !document.body.classList.contains('has-dark-hero')) return;
  const onScroll = () => h.classList.toggle('on-dark', window.scrollY + 96 < hero.offsetHeight - 100);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}
function initWsp() {
  const b = document.getElementById('wsp-float'); if (!b) return;
  window.addEventListener('scroll', () => { b.classList.toggle('visible', window.scrollY > 600); }, { passive: true });
}
function initAntiCopy() {
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
  });
  let overlay = null, open = false;
  setInterval(() => {
    const isOpen = window.outerWidth - window.innerWidth > 200 || window.outerHeight - window.innerHeight > 200;
    if (isOpen === open) return;
    open = isOpen;
    if (open) {
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'devtools-overlay';
        overlay.innerHTML = '<p>Contenido protegido.</p>';
        document.body.appendChild(overlay);
      }
      overlay.classList.add('visible');
    } else if (overlay) overlay.classList.remove('visible');
  }, 800);
}

document.addEventListener('DOMContentLoaded', () => {
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  if (hasGsap && typeof MotionPathPlugin !== 'undefined') gsap.registerPlugin(MotionPathPlugin);
  if (!hasGsap) document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });

  initNav(); initCartDrawer(); initWsp(); initAntiCopy();
  const page = document.body.dataset.page;
  if (page === 'home') initHome();
  if (page === 'catalogo') initCatalogo();
  if (page === 'area') initArea();
  if (page === 'curso') initCurso();
  if (page === 'alumno') { initGate(); initAlumno(); }
  if (page === 'aula') initAula();
  initHeaderScroll();
  initReveal();
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
  if (hasGsap) window.addEventListener('load', () => ScrollTrigger.refresh());
});
