/* V2 "Aura" — render + interacción. Usa data.js + core.js. */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const BASE = location.pathname.includes('/curso/') || location.pathname.includes('/aula/') ? '../' : '';
const IMG = c => BASE + c;
const qs = new URLSearchParams(location.search);

function initReveal() {
  const els = document.querySelectorAll('[data-animate]');
  if (!('IntersectionObserver' in window) || reduce) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver((ents) => ents.forEach(e => {
    if (e.isIntersecting) { const el = e.target, sibs = [...el.parentElement.querySelectorAll(':scope > [data-animate]')]; el.style.transitionDelay = Math.min(Math.max(sibs.indexOf(el),0),6)*0.08 + 's'; el.classList.add('in'); io.unobserve(el); }
  }), { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  els.forEach(e => io.observe(e));
}
function initNav() {
  const t = document.getElementById('navToggle'), n = document.getElementById('mobileNav');
  if (!t || !n) return;
  let bd = document.querySelector('.nav-backdrop'); if (!bd) { bd = document.createElement('div'); bd.className='nav-backdrop'; document.body.appendChild(bd); }
  const close = () => { n.classList.remove('open'); bd.classList.remove('open'); t.setAttribute('aria-expanded','false'); n.setAttribute('aria-hidden','true'); };
  const open = () => { n.classList.add('open'); bd.classList.add('open'); t.setAttribute('aria-expanded','true'); n.setAttribute('aria-hidden','false'); };
  t.addEventListener('click', () => n.classList.contains('open') ? close() : open());
  bd.addEventListener('click', close);
  n.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key==='Escape' && n.classList.contains('open')) close(); });
}
function cartBadge() { document.querySelectorAll('[data-cart-count]').forEach(b => { const n = Cart.count(); b.textContent = n; b.classList.toggle('has', n>0); b.classList.remove('bump'); void b.offsetWidth; if (n>0) b.classList.add('bump'); }); }

/* Card de curso */
function cardHTML(c) {
  const pf = precioFinal(c);
  const badge = c.nuevo ? '<span class="c-badge">Nuevo</span>' : (c.destacado ? '<span class="c-badge">Popular</span>' : '');
  const precio = c.descuento>0 ? '<span class="c-precio"><s>'+formatPrecio(c.precio)+'</s> '+formatPrecio(pf)+'</span>' : '<span class="c-precio">'+formatPrecio(pf)+'</span>';
  return '<article class="c-card '+c.color+'" data-animate>'+
    '<a class="c-cover" href="'+BASE+'curso/?id='+c.id+'"><img src="'+IMG(c.portada)+'" alt="'+esc(c.titulo)+'" width="1200" height="800" loading="lazy">'+badge+'</a>'+
    '<div class="c-body">'+
    '<div class="c-chips"><span class="c-chip">'+esc(c.nivel)+'</span><span class="c-chip">'+esc(c.duracion)+'</span><span class="c-chip">'+totalClases(c)+' clases</span></div>'+
    '<h3><a href="'+BASE+'curso/?id='+c.id+'">'+esc(c.titulo)+'</a></h3>'+
    '<p class="c-sub">'+esc(c.subtitulo)+'</p>'+
    '<div class="c-foot">'+precio+'<a class="btn btn-cta btn-sm" href="'+BASE+'curso/?id='+c.id+'">Ver curso</a></div>'+
    '</div></article>';
}

/* Carrito */
function openCart() { const d = document.getElementById('cartDrawer'); if (!d) return; renderCart(); d.classList.add('open'); d.setAttribute('aria-hidden','false'); document.body.classList.add('no-scroll'); }
function closeCart() { const d = document.getElementById('cartDrawer'); if (!d) return; d.classList.remove('open'); d.setAttribute('aria-hidden','true'); document.body.classList.remove('no-scroll'); }
function renderCart() {
  const box = document.getElementById('cartItems'); if (!box) return;
  const items = Cart.items(); const totalEl = document.getElementById('cartTotal'), chk = document.getElementById('cartCheckout'), ah = document.getElementById('cartAhorro');
  if (!items.length) { box.innerHTML = '<div class="cart-empty"><p>Todavía no elegiste ningún curso.</p><a class="btn btn-ghost" href="'+BASE+'index.html#cursos">Ver los cursos</a></div>'; if (totalEl) totalEl.textContent = formatPrecio(0); if (chk) chk.disabled = true; if (ah) ah.parentElement.hidden = true; return; }
  box.innerHTML = items.map(c => '<div class="cart-item"><img src="'+IMG(c.portada)+'" alt="" width="80" height="54" loading="lazy"><div class="cart-item-body"><h4>'+esc(c.titulo)+'</h4><strong>'+formatPrecio(precioFinal(c))+'</strong></div><button class="cart-remove" data-remove="'+c.id+'" aria-label="Quitar">&times;</button></div>').join('');
  if (totalEl) totalEl.textContent = formatPrecio(Cart.total());
  if (ah) { const a = Cart.ahorro(); ah.parentElement.hidden = a<=0; ah.textContent = formatPrecio(a); }
  if (chk) chk.disabled = false;
  box.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => { Cart.remove(b.dataset.remove); showToast('Quitado del carrito'); }));
}
function initCart() {
  const d = document.getElementById('cartDrawer'); if (!d) return;
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); openCart(); }));
  d.querySelectorAll('[data-close-cart]').forEach(b => b.addEventListener('click', closeCart));
  document.addEventListener('keydown', e => { if (e.key==='Escape' && d.classList.contains('open')) closeCart(); });
  const chk = document.getElementById('cartCheckout');
  if (chk) chk.addEventListener('click', () => { if (!Cart.count()) return; Cart.items().forEach(c => Progress.enroll(c.id)); Session.enter(); Cart.clear(); showToast('¡Listo! El pago y tu cuenta se activan al pasar a producción.'); setTimeout(() => location.href = BASE + 'alumno.html', 1400); });
  document.addEventListener('cart:updated', () => { cartBadge(); renderCart(); });
  cartBadge();
}

/* Home */
function initHome() {
  const grid = document.getElementById('cursosGrid');
  if (grid) grid.innerHTML = CURSOS.map(cardHTML).join('');
  initFlip();
}
function initFlip() {
  document.querySelectorAll('[data-flip]').forEach(card => {
    const toggle = () => card.classList.toggle('flipped');
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); toggle(); } });
  });
}

/* Ficha */
function initCurso() {
  const cont = document.getElementById('cursoDetalle'); if (!cont) return;
  const c = getCurso(qs.get('id'));
  document.getElementById('cursoLoading')?.remove();
  if (!c) { cont.innerHTML = '<div class="empty wrap"><h3>Curso no encontrado</h3><a class="btn btn-cta" href="'+BASE+'index.html#cursos">Ver los cursos</a></div>'; return; }
  const pf = precioFinal(c), enrolled = Progress.isEnrolled(c.id), inCart = Cart.has(c.id);
  document.title = c.titulo + ' — Tarotstar';
  const modulos = c.modulos.map((m, mi) => {
    const clases = m.clases.map(cl => '<li class="cl'+(cl.preview?' is-preview':'')+'"><span class="cl-ico" aria-hidden="true">'+(cl.tipo==='lectura'?'&#9776;':'&#9658;')+'</span><span class="cl-t">'+esc(cl.titulo)+'</span>'+(cl.preview?'<span class="cl-prev">Vista previa</span>':'')+'<span class="cl-dur">'+esc(cl.dur)+'</span></li>').join('');
    return '<details class="mod"'+(mi===0?' open':'')+'><summary><span class="mod-n">Módulo '+(mi+1)+'</span><span class="mod-t">'+esc(m.titulo)+'</span><span class="mod-c">'+m.clases.length+' clases</span></summary><ul class="mod-clases">'+clases+'</ul></details>';
  }).join('');
  const precioBlock = c.descuento>0 ? '<div class="cd-precio"><s>'+formatPrecio(c.precio)+'</s><strong>'+formatPrecio(pf)+'</strong><span class="cd-off">-'+c.descuento+'%</span></div>' : '<div class="cd-precio"><strong>'+formatPrecio(pf)+'</strong></div>';
  const cta = enrolled ? '<a class="btn btn-cta btn-block" href="'+BASE+'aula/?curso='+c.id+'">Ir al aula</a>' : '<button class="btn btn-cta btn-block" id="ctaIns">'+(inCart?'Ya está en tu carrito':'Inscribirme')+'</button>';
  cont.innerHTML =
    '<nav class="crumbs wrap" aria-label="Ruta"><a href="'+BASE+'index.html">Inicio</a> / <a href="'+BASE+'index.html#cursos">Cursos</a> / <span>'+esc(c.titulo)+'</span></nav>'+
    '<div class="cd-top wrap"><div class="cd-main">'+
      '<span class="eyebrow">'+esc(c.nivel)+' · '+esc(c.modalidad)+'</span>'+
      '<h1 data-animate>'+esc(c.titulo)+'</h1><p class="cd-lead" data-animate>'+esc(c.descripcion)+'</p>'+
      '<div class="cd-meta" data-animate><span>'+esc(c.duracion)+'</span><span>'+totalClases(c)+' clases</span><span>Acceso de por vida</span></div>'+
    '</div><aside class="cd-side"><div class="cd-card">'+
      '<div class="cd-cover"><img src="'+IMG(c.portada)+'" alt="'+esc(c.titulo)+'" width="1200" height="800"></div>'+
      precioBlock + cta + '<button class="btn btn-ghost btn-block" data-open-cart>Agregar al carrito</button>'+
      '<ul class="cd-incluye">'+c.incluye.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>'+
    '</div></aside></div>'+
    '<section class="cd-sec wrap"><h2 data-animate>Qué vas a aprender</h2><ul class="cd-result" data-animate>'+c.aprendes.map(r=>'<li>'+esc(r)+'</li>').join('')+'</ul></section>'+
    '<section class="cd-sec wrap"><h2 data-animate>Programa</h2><div class="cd-prog">'+modulos+'</div></section>'+
    '<section class="cd-sec wrap cd-doc-sec"><h2 data-animate>Quién te acompaña</h2><div class="cd-doc" data-animate><div class="cd-doc-mark" aria-hidden="true">✦</div><div><strong>'+esc(DOCENTE.nombre)+'</strong><span class="doc-role">'+esc(DOCENTE.rol)+'</span><p>'+esc(DOCENTE.bio)+'</p></div></div></section>'+
    relacionados(c);
  const b = document.getElementById('ctaIns');
  if (b) b.addEventListener('click', () => { Cart.add(c.id); showToast('Sumado a tu carrito'); b.textContent = 'Ya está en tu carrito'; });
  initReveal(); initStickyCta(c);
}
function relacionados(c) {
  const rel = CURSOS.filter(x => x.id !== c.id).slice(0,3);
  return '<section class="cd-sec wrap"><h2 data-animate>Seguí explorando</h2><div class="c-grid">'+rel.map(cardHTML).join('')+'</div></section>';
}
function initStickyCta(c) {
  const bar = document.getElementById('stickyCta'); if (!bar) return;
  bar.querySelector('.sc-precio').textContent = formatPrecio(precioFinal(c));
  const act = bar.querySelector('.sc-act');
  const refresh = () => { if (Progress.isEnrolled(c.id)) { act.textContent = 'Ir al aula'; act.onclick = () => location.href = BASE+'aula/?curso='+c.id; } else { act.textContent = Cart.has(c.id)?'En el carrito':'Inscribirme'; act.onclick = () => { Cart.add(c.id); showToast('Sumado a tu carrito'); refresh(); }; } };
  refresh();
  const anchor = document.querySelector('.cd-side');
  if (anchor && 'IntersectionObserver' in window) { const io = new IntersectionObserver(([e]) => bar.classList.toggle('show', !e.isIntersecting), { rootMargin:'-40% 0px 0px 0px' }); io.observe(anchor); }
}

/* Panel */
function initAlumno() {
  const cont = document.getElementById('alumnoCont'); if (!cont) return;
  const st = Progress.get(); const enrolled = st.enrolledCourseIds.map(getCurso).filter(Boolean);
  const gate = document.getElementById('alumnoGate');
  if (!Session.isIn() && !enrolled.length) { if (gate) gate.hidden = false; cont.hidden = true; return; }
  if (gate) gate.hidden = true; cont.hidden = false;
  const stats = document.getElementById('alStats');
  const enProg = enrolled.filter(c => { const p = Progress.courseProgress(c); return p>0 && p<100; }).length;
  const comp = enrolled.filter(c => Progress.courseProgress(c)===100).length;
  if (stats) stats.innerHTML = '<div><strong>'+enrolled.length+'</strong><span>Cursos</span></div><div><strong>'+enProg+'</strong><span>En curso</span></div><div><strong>'+comp+'</strong><span>Completados</span></div>';
  const grid = document.getElementById('misCursos');
  if (!enrolled.length) grid.innerHTML = '<div class="empty"><h3>Todavía no tenés cursos</h3><a class="btn btn-cta" href="index.html#cursos">Ver los cursos</a></div>';
  else grid.innerHTML = enrolled.map(c => { const p = Progress.courseProgress(c), last = Progress.getLast(c.id); return '<article class="al-card"><img src="'+esc(c.portada)+'" alt="" width="1200" height="800" loading="lazy"><div class="al-body"><h3>'+esc(c.titulo)+'</h3><div class="al-bar"><span style="width:'+p+'%"></span></div><div class="al-foot"><span>'+p+'% completado</span><a class="btn btn-sm btn-cta" href="aula/?curso='+c.id+(last?'&clase='+last:'')+'">'+(p>0?'Continuar':'Empezar')+'</a></div></div></article>'; }).join('');
  const reset = document.getElementById('resetDemo');
  if (reset) reset.addEventListener('click', () => { if (confirm('¿Reiniciar la demo? Se borra tu progreso e inscripciones de prueba.')) { Progress.reset(); Session.exit(); location.reload(); } });
}
function initGate() { const b = document.getElementById('enterDemo'); if (!b) return; b.addEventListener('click', () => { Session.enter(); if (!Progress.get().enrolledCourseIds.length) { Progress.enroll(1); Progress.enroll(3); } location.reload(); }); }

/* Aula */
function initAula() {
  const cont = document.getElementById('aulaCont'); if (!cont) return;
  const c = getCurso(qs.get('curso'));
  if (!c) { cont.innerHTML = '<div class="empty wrap"><h3>Curso no encontrado</h3><a class="btn btn-cta" href="'+BASE+'index.html#cursos">Ver los cursos</a></div>'; return; }
  if (!Progress.isEnrolled(c.id)) { cont.innerHTML = '<div class="empty wrap"><h3>Acceso demostrativo</h3><p>Este curso no está en tu cuenta demo. Inscribite para ver el aula.</p><a class="btn btn-cta" href="'+BASE+'curso/?id='+c.id+'">Ver el curso</a></div>'; return; }
  const flat = []; c.modulos.forEach(m => m.clases.forEach(cl => flat.push({ ...cl, modulo: m.titulo })));
  let cur = qs.get('clase') || Progress.getLast(c.id) || flat[0].id;
  if (!flat.find(x => x.id === cur)) cur = flat[0].id;
  const side = c.modulos.map(m => '<div class="aula-mod"><h4>'+esc(m.titulo)+'</h4><ul>'+m.clases.map(cl => '<li><button class="aula-cl" data-clase="'+cl.id+'"><span class="ck" aria-hidden="true"></span><span class="aula-cl-t">'+esc(cl.titulo)+'</span><span class="aula-cl-d">'+esc(cl.dur)+'</span></button></li>').join('')+'</ul></div>').join('');
  cont.innerHTML = '<div class="aula-grid"><aside class="aula-side" id="aulaSide"><a class="aula-back" href="'+BASE+'alumno.html">&larr; Mi panel</a><h3>'+esc(c.titulo)+'</h3><div class="aula-prog"><div class="aula-prog-bar"><span id="aulaBar"></span></div><span id="aulaProgTxt"></span></div>'+side+'</aside>'+
    '<div class="aula-main"><button class="aula-menu" id="aulaMenu">Índice de clases</button><div class="aula-stage" id="aulaStage"></div>'+
    '<div class="aula-bar"><button class="btn btn-ghost" id="aulaPrev">&larr; Anterior</button><button class="btn btn-cta" id="aulaDone"></button><button class="btn btn-ghost" id="aulaNext">Siguiente &rarr;</button></div>'+
    '<div class="aula-notes"><label for="aulaNote">Mis notas de esta clase</label><textarea id="aulaNote" placeholder="Escribí tus apuntes… se guardan en este navegador."></textarea></div></div></div>';
  const stage = document.getElementById('aulaStage'), bar = document.getElementById('aulaBar'), progTxt = document.getElementById('aulaProgTxt'), note = document.getElementById('aulaNote'), done = document.getElementById('aulaDone'), sideEl = document.getElementById('aulaSide');
  const idx = () => flat.findIndex(x => x.id === cur);
  function updateProg() { const p = Progress.courseProgress(c); bar.style.width = p+'%'; progTxt.textContent = p+'% completado'; }
  function render() {
    const cl = flat[idx()], d = Progress.isDone(c.id, cl.id);
    stage.innerHTML = '<div class="stage-media"><span class="stage-tipo">'+(cl.tipo==='lectura'?'Lectura':'Video')+(cl.preview?' · Vista previa':'')+'</span><span class="stage-play" aria-hidden="true">'+(cl.tipo==='lectura'?'&#9776;':'&#9658;')+'</span><p class="stage-demo">Contenido demostrativo</p></div><div class="stage-head"><span class="stage-mod">'+esc(cl.modulo)+'</span><h2>'+esc(cl.titulo)+'</h2><span class="stage-dur">'+esc(cl.dur)+'</span></div>';
    document.querySelectorAll('.aula-cl').forEach(b => { b.classList.toggle('active', b.dataset.clase===cur); b.classList.toggle('done', Progress.isDone(c.id, b.dataset.clase)); });
    done.textContent = d ? '✓ Completada' : 'Marcar como completada'; done.classList.toggle('is-done', d);
    note.value = Progress.getNote(c.id, cl.id); Progress.setLast(c.id, cl.id);
    const url = new URL(location); url.searchParams.set('clase', cl.id); history.replaceState(null,'',url); updateProg();
  }
  function go(id) { if (flat.find(x=>x.id===id)) { cur = id; render(); if (window.innerWidth<900) sideEl.classList.remove('open'); } }
  cont.querySelectorAll('.aula-cl').forEach(b => b.addEventListener('click', () => go(b.dataset.clase)));
  document.getElementById('aulaPrev').addEventListener('click', () => { const i = idx(); if (i>0) go(flat[i-1].id); });
  document.getElementById('aulaNext').addEventListener('click', () => { const i = idx(); if (i<flat.length-1) go(flat[i+1].id); });
  done.addEventListener('click', () => { Progress.toggleLesson(c.id, cur); render(); });
  note.addEventListener('input', () => Progress.saveNote(c.id, cur, note.value));
  document.getElementById('aulaMenu').addEventListener('click', () => sideEl.classList.toggle('open'));
  render();
}

document.addEventListener('DOMContentLoaded', () => {
  initNav(); initCart(); cartBadge();
  const page = document.body.dataset.page;
  if (page === 'home') initHome();
  if (page === 'curso') initCurso();
  if (page === 'alumno') { initGate(); initAlumno(); }
  if (page === 'aula') initAula();
  initReveal();
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
});
