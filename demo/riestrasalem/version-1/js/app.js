/* V1 "Autoridad serena" — render + interacción. Usa data.js + core.js. */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const BASE = location.pathname.includes('/curso/') || location.pathname.includes('/aula/') ? '../' : '';
const IMG = c => BASE + c;
const qs = new URLSearchParams(location.search);

/* ---------- Movimiento: mask reveals ---------- */
function initReveal() {
  const els = document.querySelectorAll('[data-animate]');
  if (!('IntersectionObserver' in window) || reduce) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver((ents) => {
    ents.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target, sibs = [...el.parentElement.querySelectorAll(':scope > [data-animate]')];
        el.style.transitionDelay = Math.min(Math.max(sibs.indexOf(el),0),6) * 0.08 + 's';
        el.classList.add('in'); io.unobserve(el);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
  els.forEach(e => io.observe(e));
}
function initDraw() {
  const els = document.querySelectorAll('.draw');
  if (!('IntersectionObserver' in window) || reduce) { els.forEach(e => e.classList.add('drawn')); return; }
  const io = new IntersectionObserver((ents) => ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add('drawn'); io.unobserve(e.target); } }), { threshold: 0.4 });
  els.forEach(e => io.observe(e));
}

/* ---------- Nav ---------- */
function initNav() {
  const t = document.getElementById('navToggle'), n = document.getElementById('mobileNav');
  if (!t || !n) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const close = () => { n.classList.remove('open'); bd.classList.remove('open'); t.setAttribute('aria-expanded','false'); n.setAttribute('aria-hidden','true'); };
  const open = () => { n.classList.add('open'); bd.classList.add('open'); t.setAttribute('aria-expanded','true'); n.setAttribute('aria-hidden','false'); };
  t.addEventListener('click', () => n.classList.contains('open') ? close() : open());
  bd.addEventListener('click', close);
  n.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && n.classList.contains('open')) close(); });
}

/* ---------- Carrito ---------- */
function cartBadge() {
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    const n = Cart.count(); b.textContent = n; b.classList.toggle('has', n > 0);
    b.classList.remove('bump'); void b.offsetWidth; if (n > 0) b.classList.add('bump');
  });
}
function renderCart() {
  const box = document.getElementById('cartItems'); if (!box) return;
  const items = Cart.items();
  const totalEl = document.getElementById('cartTotal'), ahorroEl = document.getElementById('cartAhorro');
  if (!items.length) {
    box.innerHTML = '<div class="cart-empty"><p>Todavía no elegiste ninguna capacitación.</p><a class="btn btn-ghost" href="' + BASE + 'catalogo.html">Ver el catálogo</a></div>';
    if (totalEl) totalEl.textContent = formatPrecio(0);
    if (ahorroEl) ahorroEl.parentElement.hidden = true;
    const chk = document.getElementById('cartCheckout'); if (chk) chk.disabled = true;
    return;
  }
  box.innerHTML = items.map(c => {
    const d = getDocente(c.docenteId);
    return '<div class="cart-item"><img src="' + IMG(c.portada) + '" alt="" width="88" height="60" loading="lazy">' +
      '<div class="cart-item-body"><h4>' + esc(c.titulo) + '</h4><span>' + esc(d ? d.nombre : '') + ' · ' + esc(c.modalidad) + '</span>' +
      '<strong>' + formatPrecio(precioFinal(c)) + '</strong></div>' +
      '<button class="cart-remove" data-remove="' + c.id + '" aria-label="Quitar">&times;</button></div>';
  }).join('');
  if (totalEl) totalEl.textContent = formatPrecio(Cart.total());
  if (ahorroEl) { const a = Cart.ahorro(); ahorroEl.parentElement.hidden = a <= 0; ahorroEl.textContent = formatPrecio(a); }
  const chk = document.getElementById('cartCheckout'); if (chk) chk.disabled = false;
  box.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => { Cart.remove(b.dataset.remove); showToast('Quitada del carrito'); }));
}
function initCartDrawer() {
  const drawer = document.getElementById('cartDrawer'); if (!drawer) return;
  const open = () => { drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); document.body.classList.add('no-scroll'); };
  const close = () => { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); document.body.classList.remove('no-scroll'); };
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); renderCart(); open(); }));
  drawer.querySelectorAll('[data-close-cart]').forEach(b => b.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) close(); });
  const chk = document.getElementById('cartCheckout');
  if (chk) chk.addEventListener('click', () => {
    if (!Cart.count()) return;
    Cart.items().forEach(c => Progress.enroll(c.id));
    Session.enter(); Cart.clear();
    showToast('¡Listo! El pago y tu cuenta se activan al pasar a producción.');
    setTimeout(() => { location.href = BASE + 'alumno.html'; }, 1400);
  });
  document.addEventListener('cart:updated', () => { cartBadge(); renderCart(); });
  cartBadge();
}

/* ---------- Card de curso (V1 editorial) ---------- */
function cardHTML(c, i) {
  const d = getDocente(c.docenteId), pf = precioFinal(c);
  const badge = c.nuevo ? '<span class="c-badge">Nuevo</span>' : (c.destacado ? '<span class="c-badge">Más elegido</span>' : '');
  const precio = c.descuento > 0
    ? '<span class="c-precio"><s>' + formatPrecio(c.precio) + '</s> ' + formatPrecio(pf) + '</span>'
    : '<span class="c-precio">' + formatPrecio(pf) + '</span>';
  return '<article class="c-card" data-animate style="--i:' + (i||0) + '">' +
    '<a class="c-cover" href="' + BASE + 'curso/?id=' + c.id + '"><img src="' + IMG(c.portada) + '" alt="' + esc(c.titulo) + '" width="1200" height="800" loading="lazy">' + badge + '</a>' +
    '<div class="c-body"><span class="c-area">' + esc(getCategoria(c.categoria)) + '</span>' +
    '<h3><a href="' + BASE + 'curso/?id=' + c.id + '">' + esc(c.titulo) + '</a></h3>' +
    '<span class="c-doc">' + esc(d ? d.nombre : '') + '</span>' +
    '<div class="c-meta"><span>' + esc(c.nivel) + '</span><i></i><span>' + esc(c.modalidad) + '</span><i></i><span>' + esc(c.duracion) + '</span></div>' +
    '<div class="c-foot">' + precio + '<a class="btn btn-sm" href="' + BASE + 'curso/?id=' + c.id + '">Ver curso</a></div>' +
    '</div></article>';
}

/* ---------- Home ---------- */
function initHome() {
  const dest = document.getElementById('destacados');
  if (dest) dest.innerHTML = CURSOS.filter(c => c.destacado).slice(0,3).map((c,i) => cardHTML(c,i)).join('');
  const areas = document.getElementById('areasList');
  if (areas) areas.innerHTML = CATEGORIAS.map((cat,i) => {
    const n = CURSOS.filter(c => c.categoria === cat.id).length;
    return '<a class="area-row" href="catalogo.html?cat=' + cat.id + '" data-animate style="--i:' + i + '"><span class="area-n">0' + (i+1) + '</span><span class="area-name">' + esc(cat.label) + '</span><span class="area-count">' + n + ' curso' + (n!==1?'s':'') + '</span></a>';
  }).join('');
  const docs = document.getElementById('docentesList');
  if (docs) docs.innerHTML = DOCENTES.map((d,i) => '<article class="doc-card" data-animate style="--i:' + i + '"><img src="' + esc(d.foto) + '" alt="' + esc(d.nombre) + '" width="600" height="700" loading="lazy"><div class="doc-info"><span class="doc-tag">Perfil demostrativo</span><h3>' + esc(d.nombre) + '</h3><p>' + esc(d.rol) + '</p></div></article>').join('');
}

/* ---------- Catálogo ---------- */
function initCatalogo() {
  const grid = document.getElementById('cursosGrid'); if (!grid) return;
  const st = { q: '', categoria: qs.get('cat') || '', nivel: '', modalidad: '' };
  const buscar = document.getElementById('buscar');
  const chipsCat = document.getElementById('chipsCat');
  const selNivel = document.getElementById('selNivel');
  const selMod = document.getElementById('selMod');
  const count = document.getElementById('resCount');
  const limpiar = document.getElementById('limpiar');

  if (chipsCat) chipsCat.innerHTML = '<button class="chip" data-cat="">Todas</button>' + CATEGORIAS.map(c => '<button class="chip" data-cat="' + c.id + '">' + esc(c.label) + '</button>').join('');
  if (selNivel) selNivel.innerHTML = '<option value="">Todos los niveles</option>' + NIVELES.map(n => '<option value="' + n + '">' + n + '</option>').join('');
  if (selMod) selMod.innerHTML = '<option value="">Toda modalidad</option>' + MODALIDADES.map(m => '<option value="' + m + '">' + m + '</option>').join('');

  function syncChips() { grid && chipsCat.querySelectorAll('.chip').forEach(ch => ch.classList.toggle('on', (ch.dataset.cat||'') === st.categoria)); }
  function render() {
    const res = filtrarCursos(st);
    if (count) count.textContent = res.length + (res.length === 1 ? ' curso' : ' cursos');
    if (!res.length) {
      grid.innerHTML = '<div class="empty"><h3>No encontramos cursos con esos criterios</h3><button class="btn btn-ghost" id="emptyClear">Limpiar filtros</button></div>';
      grid.querySelector('#emptyClear').addEventListener('click', clearAll);
      return;
    }
    grid.innerHTML = res.map((c,i) => cardHTML(c, i)).join('');
    grid.querySelectorAll('[data-animate]').forEach((el,i) => { el.style.transitionDelay = Math.min(i,8)*0.05 + 's'; requestAnimationFrame(() => el.classList.add('in')); });
  }
  function clearAll() { st.q = ''; st.categoria = ''; st.nivel = ''; st.modalidad = ''; if (buscar) buscar.value = ''; if (selNivel) selNivel.value = ''; if (selMod) selMod.value = ''; syncChips(); render(); }

  if (buscar) buscar.addEventListener('input', () => { st.q = buscar.value; render(); });
  if (chipsCat) chipsCat.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; st.categoria = b.dataset.cat || ''; syncChips(); render(); });
  if (selNivel) selNivel.addEventListener('change', () => { st.nivel = selNivel.value; render(); });
  if (selMod) selMod.addEventListener('change', () => { st.modalidad = selMod.value; render(); });
  if (limpiar) limpiar.addEventListener('click', clearAll);
  const fBtn = document.getElementById('filtrosToggle'), fPanel = document.getElementById('filtrosPanel');
  if (fBtn && fPanel) fBtn.addEventListener('click', () => { const o = fPanel.classList.toggle('open'); fBtn.setAttribute('aria-expanded', o); });
  syncChips(); render();
}

/* ---------- Ficha de curso ---------- */
function initCurso() {
  const cont = document.getElementById('cursoDetalle'); if (!cont) return;
  const c = getCurso(qs.get('id'));
  document.getElementById('cursoLoading')?.remove();
  if (!c) { cont.innerHTML = '<div class="empty wrap"><h3>Curso no encontrado</h3><p>Puede que el enlace esté roto o el curso ya no esté disponible.</p><a class="btn btn-cta" href="' + BASE + 'catalogo.html">Volver al catálogo</a></div>'; return; }
  const d = getDocente(c.docenteId), pf = precioFinal(c), enrolled = Progress.isEnrolled(c.id), inCart = Cart.has(c.id);
  document.title = c.titulo + ' — Riestra&Salem';
  const modulos = c.modulos.map((m, mi) => {
    const clases = m.clases.map(cl => '<li class="cl' + (cl.preview ? ' is-preview' : '') + '"><span class="cl-ico" aria-hidden="true">' + (cl.tipo === 'lectura' ? '&#9776;' : '&#9658;') + '</span><span class="cl-t">' + esc(cl.titulo) + '</span>' + (cl.preview ? '<span class="cl-prev">Vista previa</span>' : '') + '<span class="cl-dur">' + esc(cl.duracion) + '</span></li>').join('');
    return '<details class="mod"' + (mi === 0 ? ' open' : '') + '><summary><span class="mod-n">Módulo ' + (mi+1) + '</span><span class="mod-t">' + esc(m.titulo) + '</span><span class="mod-c">' + m.clases.length + ' clases</span></summary><ul class="mod-clases">' + clases + '</ul></details>';
  }).join('');
  const precioBlock = c.descuento > 0
    ? '<div class="cd-precio"><s>' + formatPrecio(c.precio) + '</s><strong>' + formatPrecio(pf) + '</strong><span class="cd-off">-' + c.descuento + '%</span></div>'
    : '<div class="cd-precio"><strong>' + formatPrecio(pf) + '</strong></div>';
  const ctaBtn = enrolled
    ? '<a class="btn btn-cta btn-block" href="' + BASE + 'aula/?curso=' + c.id + '">Ir al aula</a>'
    : '<button class="btn btn-cta btn-block" id="ctaInscribir">' + (inCart ? 'Ya está en tu carrito' : 'Inscribirme') + '</button>';
  cont.innerHTML =
    '<nav class="crumbs wrap" aria-label="Ruta"><a href="' + BASE + 'index.html">Inicio</a> / <a href="' + BASE + 'catalogo.html">Cursos</a> / <span>' + esc(c.titulo) + '</span></nav>' +
    '<div class="cd-top wrap"><div class="cd-main">' +
      '<span class="eyebrow">' + esc(getCategoria(c.categoria)) + '</span>' +
      '<h1 data-animate>' + esc(c.titulo) + '</h1>' +
      '<p class="cd-lead" data-animate>' + esc(c.descripcionCompleta) + '</p>' +
      '<div class="cd-meta" data-animate><span>' + esc(c.nivel) + '</span><span>' + esc(c.modalidad) + '</span><span>' + esc(c.duracion) + '</span><span>' + totalClases(c) + ' clases</span></div>' +
      '<div class="cd-doc" data-animate><img src="' + IMG(d.foto) + '" alt="' + esc(d.nombre) + '" width="120" height="140"><div><span class="doc-tag">Perfil demostrativo</span><strong>' + esc(d.nombre) + '</strong><p>' + esc(d.bio) + '</p></div></div>' +
    '</div>' +
    '<aside class="cd-side"><div class="cd-card">' +
      '<div class="cd-cover"><img src="' + IMG(c.portada) + '" alt="' + esc(c.titulo) + '" width="1200" height="800"></div>' +
      precioBlock + ctaBtn +
      '<button class="btn btn-ghost btn-block" data-open-cart>Agregar al carrito</button>' +
      '<ul class="cd-incluye">' + c.incluye.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
    '</div></aside></div>' +
    '<section class="cd-sec wrap"><h2 data-animate><span class="draw-wrap">Qué vas a lograr<svg class="draw" viewBox="0 0 200 8" preserveAspectRatio="none"><path d="M2 5 Q100 1 198 5"/></svg></span></h2><ul class="cd-result" data-animate>' + c.resultados.map(r => '<li>' + esc(r) + '</li>').join('') + '</ul></section>' +
    '<section class="cd-sec wrap"><h2 data-animate>Programa</h2><div class="cd-programa">' + modulos + '</div></section>' +
    '<section class="cd-sec wrap cd-req"><div data-animate><h3>Requisitos</h3><ul>' + c.requisitos.map(r => '<li>' + esc(r) + '</li>').join('') + '</ul></div><div data-animate><h3>Incluye</h3><ul>' + c.incluye.map(r => '<li>' + esc(r) + '</li>').join('') + '</ul></div></section>' +
    relacionadosHTML(c);

  const btn = document.getElementById('ctaInscribir');
  if (btn) btn.addEventListener('click', () => { Cart.add(c.id); showToast('Agregada al carrito'); btn.textContent = 'Ya está en tu carrito'; });
  initReveal(); initDraw(); initStickyCta(c);
}
function relacionadosHTML(c) {
  const rel = CURSOS.filter(x => x.id !== c.id && x.categoria === c.categoria).slice(0,3);
  const list = (rel.length ? rel : CURSOS.filter(x => x.id !== c.id).slice(0,3));
  return '<section class="cd-sec wrap"><h2 data-animate>También te puede interesar</h2><div class="c-grid">' + list.map((x,i) => cardHTML(x,i)).join('') + '</div></section>';
}
function initStickyCta(c) {
  const bar = document.getElementById('stickyCta'); if (!bar) return;
  bar.querySelector('.sc-precio').textContent = formatPrecio(precioFinal(c));
  const act = bar.querySelector('.sc-act');
  const refresh = () => {
    if (Progress.isEnrolled(c.id)) { act.textContent = 'Ir al aula'; act.onclick = () => location.href = BASE + 'aula/?curso=' + c.id; }
    else { act.textContent = Cart.has(c.id) ? 'En el carrito' : 'Inscribirme'; act.onclick = () => { Cart.add(c.id); showToast('Agregada al carrito'); refresh(); }; }
  };
  refresh();
  const anchor = document.querySelector('.cd-side');
  if (anchor && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(([e]) => bar.classList.toggle('show', !e.isIntersecting), { rootMargin: '-40% 0px 0px 0px' });
    io.observe(anchor);
  }
}

/* ---------- Panel del alumno ---------- */
function initAlumno() {
  const cont = document.getElementById('alumnoCont'); if (!cont) return;
  const st = Progress.get();
  const enrolled = st.enrolledCourseIds.map(getCurso).filter(Boolean);
  const gate = document.getElementById('alumnoGate');
  if (!Session.isIn() && !enrolled.length) { if (gate) gate.hidden = false; cont.hidden = true; return; }
  if (gate) gate.hidden = true; cont.hidden = false;
  const enProgreso = enrolled.filter(c => { const p = Progress.courseProgress(c); return p > 0 && p < 100; });
  const completados = enrolled.filter(c => Progress.courseProgress(c) === 100);
  const pendientes = enrolled.filter(c => Progress.courseProgress(c) === 0);
  const grid = document.getElementById('misCursos');
  if (!enrolled.length) { grid.innerHTML = '<div class="empty"><h3>Todavía no tenés cursos</h3><a class="btn btn-cta" href="catalogo.html">Explorar el catálogo</a></div>'; }
  else grid.innerHTML = enrolled.map(c => {
    const p = Progress.courseProgress(c), last = Progress.getLast(c.id);
    return '<article class="al-card"><img src="' + esc(c.portada) + '" alt="" width="1200" height="800" loading="lazy"><div class="al-body"><span class="c-area">' + esc(getCategoria(c.categoria)) + '</span><h3>' + esc(c.titulo) + '</h3><div class="al-bar"><span style="width:' + p + '%"></span></div><div class="al-foot"><span>' + p + '% completado</span><a class="btn btn-sm" href="aula/?curso=' + c.id + (last ? '&clase=' + last : '') + '">' + (p > 0 ? 'Continuar' : 'Empezar') + '</a></div></div></article>';
  }).join('');
  const stats = document.getElementById('alStats');
  if (stats) stats.innerHTML = '<div><strong>' + enrolled.length + '</strong><span>Inscripciones</span></div><div><strong>' + enProgreso.length + '</strong><span>En curso</span></div><div><strong>' + completados.length + '</strong><span>Completados</span></div>';
  const reset = document.getElementById('resetDemo');
  if (reset) reset.addEventListener('click', () => { if (confirm('¿Reiniciar la demo? Se borrará tu progreso y tus inscripciones de prueba.')) { Progress.reset(); Session.exit(); location.reload(); } });
}
function initGate() {
  const btn = document.getElementById('enterDemo'); if (!btn) return;
  btn.addEventListener('click', () => { Session.enter(); if (!Progress.get().enrolledCourseIds.length) { Progress.enroll(1); Progress.enroll(4); } location.reload(); });
}

/* ---------- Aula ---------- */
function initAula() {
  const cont = document.getElementById('aulaCont'); if (!cont) return;
  const c = getCurso(qs.get('curso'));
  if (!c) { cont.innerHTML = '<div class="empty wrap"><h3>Curso no encontrado</h3><a class="btn btn-cta" href="' + BASE + 'catalogo.html">Volver al catálogo</a></div>'; return; }
  if (!Progress.isEnrolled(c.id)) {
    cont.innerHTML = '<div class="empty wrap"><h3>Acceso demostrativo</h3><p>Este curso no está en tu cuenta demo. Inscribite para ver el aula.</p><a class="btn btn-cta" href="' + BASE + 'curso/?id=' + c.id + '">Ver el curso</a> <a class="btn btn-ghost" href="' + BASE + 'alumno.html">Mi panel</a></div>';
    return;
  }
  const flat = []; c.modulos.forEach(m => m.clases.forEach(cl => flat.push({ ...cl, modulo: m.titulo })));
  let currentId = qs.get('clase') || Progress.getLast(c.id) || flat[0].id;
  if (!flat.find(x => x.id === currentId)) currentId = flat[0].id;

  const sidebar = c.modulos.map((m, mi) => {
    const items = m.clases.map(cl => '<li><button class="aula-cl" data-clase="' + cl.id + '"><span class="ck" aria-hidden="true"></span><span class="aula-cl-t">' + esc(cl.titulo) + '</span><span class="aula-cl-d">' + esc(cl.duracion) + '</span></button></li>').join('');
    return '<div class="aula-mod"><h4>' + esc(m.titulo) + '</h4><ul>' + items + '</ul></div>';
  }).join('');
  cont.innerHTML =
    '<div class="aula-grid">' +
    '<aside class="aula-side" id="aulaSide"><a class="aula-back" href="' + BASE + 'alumno.html">&larr; Mi panel</a><h3>' + esc(c.titulo) + '</h3><div class="aula-prog"><div class="aula-prog-bar"><span id="aulaBar"></span></div><span id="aulaProgTxt"></span></div>' + sidebar + '</aside>' +
    '<div class="aula-main"><button class="aula-menu" id="aulaMenu" aria-label="Ver índice">Índice de clases</button>' +
      '<div class="aula-stage" id="aulaStage"></div>' +
      '<div class="aula-bar"><button class="btn btn-ghost" id="aulaPrev">&larr; Anterior</button><button class="btn btn-cta" id="aulaDone"></button><button class="btn btn-ghost" id="aulaNext">Siguiente &rarr;</button></div>' +
      '<div class="aula-notes"><label for="aulaNote">Mis notas de esta clase</label><textarea id="aulaNote" placeholder="Escribí tus apuntes… se guardan en este navegador."></textarea></div>' +
    '</div></div>';

  const stage = document.getElementById('aulaStage'), bar = document.getElementById('aulaBar'), progTxt = document.getElementById('aulaProgTxt');
  const note = document.getElementById('aulaNote'), doneBtn = document.getElementById('aulaDone');
  const side = document.getElementById('aulaSide');

  function idx() { return flat.findIndex(x => x.id === currentId); }
  function renderStage() {
    const cl = flat[idx()];
    const done = Progress.isDone(c.id, cl.id);
    stage.innerHTML = '<div class="stage-media"><span class="stage-tipo">' + (cl.tipo === 'lectura' ? 'Lectura' : 'Video') + (cl.preview ? ' · Vista previa' : '') + '</span><span class="stage-play" aria-hidden="true">' + (cl.tipo === 'lectura' ? '&#9776;' : '&#9658;') + '</span><p class="stage-demo">Contenido demostrativo</p></div>' +
      '<div class="stage-head"><span class="stage-mod">' + esc(cl.modulo) + '</span><h2>' + esc(cl.titulo) + '</h2><span class="stage-dur">' + esc(cl.duracion) + '</span></div>';
    document.querySelectorAll('.aula-cl').forEach(b => {
      const on = b.dataset.clase === currentId;
      b.classList.toggle('active', on);
      b.classList.toggle('done', Progress.isDone(c.id, b.dataset.clase));
    });
    doneBtn.textContent = done ? '✓ Completada' : 'Marcar como completada';
    doneBtn.classList.toggle('is-done', done);
    note.value = Progress.getNote(c.id, cl.id);
    Progress.setLast(c.id, cl.id);
    const url = new URL(location); url.searchParams.set('clase', cl.id); history.replaceState(null, '', url);
    updateProg();
  }
  function updateProg() {
    const p = Progress.courseProgress(c);
    bar.style.width = p + '%'; progTxt.textContent = p + '% completado';
  }
  function go(id) { if (flat.find(x => x.id === id)) { currentId = id; renderStage(); if (window.innerWidth < 900) side.classList.remove('open'); } }

  cont.querySelectorAll('.aula-cl').forEach(b => b.addEventListener('click', () => go(b.dataset.clase)));
  document.getElementById('aulaPrev').addEventListener('click', () => { const i = idx(); if (i > 0) go(flat[i-1].id); });
  document.getElementById('aulaNext').addEventListener('click', () => { const i = idx(); if (i < flat.length-1) go(flat[i+1].id); });
  doneBtn.addEventListener('click', () => { Progress.toggleLesson(c.id, currentId); renderStage(); });
  note.addEventListener('input', () => Progress.saveNote(c.id, currentId, note.value));
  document.getElementById('aulaMenu').addEventListener('click', () => side.classList.toggle('open'));
  renderStage();
}

/* ---------- Router ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initNav(); initCartDrawer();
  const page = document.body.dataset.page;
  if (page === 'home') initHome();
  if (page === 'catalogo') initCatalogo();
  if (page === 'curso') initCurso();
  if (page === 'alumno') { initGate(); initAlumno(); }
  if (page === 'aula') initAula();
  initReveal(); initDraw();
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
});
