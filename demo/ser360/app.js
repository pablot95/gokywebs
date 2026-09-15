const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = c => c.descuento > 0 ? Math.round(c.precio * (1 - c.descuento / 100)) : c.precio;
const getCurso = id => CURSOS.find(c => c.id === id);
const getCursoSlug = slug => CURSOS.find(c => c.slug === slug);
const getDocente = id => DOCENTES.find(d => d.id === id);
const allLessons = c => c.modulos.flatMap(m => m.clases);
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Cart = {
  KEY: 'ser360fable_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  has(id) { return this.get().includes(id); },
  add(id) { const items = this.get(); if (!items.includes(id)) { items.push(id); this.save(items); } },
  remove(id) { this.save(this.get().filter(x => x !== id)); },
  clear() { this.save([]); },
  count() { return this.get().length; },
  total() { return this.get().reduce((s, id) => { const c = getCurso(id); return c ? s + precioFinal(c) : s; }, 0); },
  ahorro() { return this.get().reduce((s, id) => { const c = getCurso(id); return c && c.descuento > 0 ? s + (c.precio - precioFinal(c)) : s; }, 0); }
};

const Learn = {
  KEY: 'ser360fable_learning_state',
  get() {
    try {
      const st = JSON.parse(localStorage.getItem(this.KEY)) || {};
      return {
        enrolledCourseIds: st.enrolledCourseIds || [],
        completedLessonIds: st.completedLessonIds || [],
        lastLessonByCourse: st.lastLessonByCourse || {},
        notesByLesson: st.notesByLesson || {},
        enrollments: st.enrollments || []
      };
    } catch {
      return { enrolledCourseIds: [], completedLessonIds: [], lastLessonByCourse: {}, notesByLesson: {}, enrollments: [] };
    }
  },
  save(st) { localStorage.setItem(this.KEY, JSON.stringify(st)); document.dispatchEvent(new CustomEvent('learn:updated')); },
  isEnrolled(courseId) { return this.get().enrolledCourseIds.includes(courseId); },
  enroll(courseIds) {
    const st = this.get();
    const hoy = new Date().toISOString().slice(0, 10);
    courseIds.forEach(id => {
      if (!st.enrolledCourseIds.includes(id)) {
        st.enrolledCourseIds.push(id);
        st.enrollments.push({ courseId: id, fecha: hoy });
      }
    });
    this.save(st);
  },
  toggleLesson(lessonId) {
    const st = this.get();
    const i = st.completedLessonIds.indexOf(lessonId);
    if (i >= 0) st.completedLessonIds.splice(i, 1); else st.completedLessonIds.push(lessonId);
    this.save(st);
  },
  isDone(lessonId) { return this.get().completedLessonIds.includes(lessonId); },
  setLast(courseId, lessonId) {
    const st = this.get();
    st.lastLessonByCourse[courseId] = lessonId;
    this.save(st);
  },
  progress(curso) {
    const st = this.get();
    const total = allLessons(curso).length;
    const done = allLessons(curso).filter(l => st.completedLessonIds.includes(l.id)).length;
    return { done, total, pct: total ? Math.round(done / total * 100) : 0 };
  },
  nextLesson(curso) {
    const st = this.get();
    const last = st.lastLessonByCourse[curso.id];
    const lessons = allLessons(curso);
    const pending = lessons.find(l => !st.completedLessonIds.includes(l.id));
    if (last && !st.completedLessonIds.includes(last)) return last;
    return pending ? pending.id : lessons[0].id;
  },
  saveNote(lessonId, text) {
    const st = this.get();
    if (text) st.notesByLesson[lessonId] = text; else delete st.notesByLesson[lessonId];
    localStorage.setItem(this.KEY, JSON.stringify(st));
  },
  getNote(lessonId) { return this.get().notesByLesson[lessonId] || ''; }
};

const Session = {
  KEY: 'ser360fable_demo_session',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)); } catch { return null; } },
  start() {
    if (this.get()) return this.get();
    const s = { nombre: 'Sofía', inicio: new Date().toISOString().slice(0, 10) };
    localStorage.setItem(this.KEY, JSON.stringify(s));
    this.seed();
    return s;
  },
  seed() {
    const st = Learn.get();
    if (st.enrolledCourseIds.length > 0) return;
    st.enrolledCourseIds = ['c3', 'c2', 'c1'];
    st.enrollments = [
      { courseId: 'c3', fecha: '2026-06-02' },
      { courseId: 'c2', fecha: '2026-06-28' },
      { courseId: 'c1', fecha: '2026-07-18' }
    ];
    st.completedLessonIds = allLessons(getCurso('c3')).map(l => l.id)
      .concat(['c2m1l1', 'c2m1l2', 'c2m1l3', 'c2m2l1']);
    st.lastLessonByCourse = { c3: 'c3m3l3', c2: 'c2m2l1' };
    Learn.save(st);
  },
  end() { localStorage.removeItem(this.KEY); }
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function trapFocus(container, e) {
  const focusables = container.querySelectorAll('a[href], button:not([disabled]), textarea, input, [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const first = focusables[0], last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

let drawerTrigger = null;

function buildDrawer() {
  const wrap = document.createElement('div');
  wrap.id = 'cart-root';
  wrap.innerHTML = `
    <div class="drawer-overlay" id="drawer-overlay" hidden></div>
    <aside class="cart-drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-label="Carrito de cursos" hidden>
      <div class="cart-head">
        <h2>Tu inscripción</h2>
        <button type="button" class="icon-btn" id="cart-close" aria-label="Cerrar carrito">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="cart-body" id="cart-body"></div>
      <div class="cart-foot" id="cart-foot"></div>
    </aside>`;
  document.body.appendChild(wrap);
  document.getElementById('cart-close').addEventListener('click', closeDrawer);
  document.getElementById('drawer-overlay').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => {
    const drawer = document.getElementById('cart-drawer');
    if (drawer.hidden) return;
    if (e.key === 'Escape') closeDrawer();
    if (e.key === 'Tab') trapFocus(drawer, e);
  });
}

function renderDrawer(success = false) {
  const body = document.getElementById('cart-body');
  const foot = document.getElementById('cart-foot');
  if (!body) return;
  const items = Cart.get();
  if (success) {
    body.innerHTML = `
      <div class="cart-empty">
        <span class="ring-badge" aria-hidden="true">✓</span>
        <h3>¡Inscripción demo lista!</h3>
        <p>El pago y la creación automática de tu cuenta se activan al llevar la plataforma a producción. Para esta demostración ya quedaste dentro: tus cursos te esperan en el panel.</p>
        <a class="btn btn-primary" href="alumno.html">Ir a mi panel</a>
      </div>`;
    foot.innerHTML = '';
    return;
  }
  if (!items.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg class="cart-empty-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.2 14.6h10.9c.8 0 1.5-.5 1.8-1.2l2.9-6.9c.3-.7-.2-1.5-1-1.5H6.1l-.8-2.2C5.1 2.3 4.6 2 4.1 2H1.9C1.4 2 1 2.4 1 2.9s.4.9.9.9h1.6l3.3 9.2-1.2 2.2c-.6 1.2.2 2.6 1.6 2.6h12c.5 0 .9-.4.9-.9s-.4-.9-.9-.9H7.5l.9-1.6c-.4.1-.8.2-1.2.2z"/><circle cx="8.5" cy="20.5" r="1.8"/><circle cx="17.5" cy="20.5" r="1.8"/></svg>
        <h3>Todavía no elegiste ningún curso</h3>
        <p>Explorá el catálogo y sumá el primero: tu recorrido empieza con una clase.</p>
        <a class="btn btn-primary" href="index.html#cursos">Ver los cursos</a>
      </div>`;
    foot.innerHTML = '';
    return;
  }
  body.innerHTML = items.map(id => {
    const c = getCurso(id);
    if (!c) return '';
    const final = precioFinal(c);
    return `
      <article class="cart-item">
        <img src="${c.portada}" alt="Portada de ${esc(c.titulo)}" width="96" height="72" loading="lazy" decoding="async">
        <div class="cart-item-info">
          <span class="cart-item-cat">${esc(c.categoria)} · ${esc(c.modalidad)}</span>
          <h3>${esc(c.titulo)}</h3>
          <p class="cart-item-price">${formatearPrecio(final)}${c.descuento > 0 ? ` <s>${formatearPrecio(c.precio)}</s>` : ''}</p>
        </div>
        <button type="button" class="icon-btn cart-remove" data-remove="${c.id}" aria-label="Quitar ${esc(c.titulo)} del carrito">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
        </button>
      </article>`;
  }).join('');
  const ahorro = Cart.ahorro();
  foot.innerHTML = `
    ${ahorro > 0 ? `<p class="cart-save">Estás ahorrando ${formatearPrecio(ahorro)}</p>` : ''}
    <div class="cart-total"><span>Total</span><strong>${formatearPrecio(Cart.total())}</strong></div>
    <button type="button" class="btn btn-primary btn-block" id="cart-checkout">Finalizar inscripción</button>
    <p class="cart-note">Demo: sin pagos reales ni datos de tarjeta.</p>`;
  body.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => { Cart.remove(b.dataset.remove); renderDrawer(); }));
  const chk = document.getElementById('cart-checkout');
  if (chk) chk.addEventListener('click', () => {
    const ids = Cart.get();
    Session.start();
    Learn.enroll(ids);
    Cart.clear();
    renderDrawer(true);
    showToast('Inscripción demo confirmada');
  });
}

function openDrawer(trigger) {
  drawerTrigger = trigger || null;
  renderDrawer();
  document.getElementById('drawer-overlay').hidden = false;
  const drawer = document.getElementById('cart-drawer');
  drawer.hidden = false;
  requestAnimationFrame(() => { document.body.classList.add('drawer-open'); });
  document.body.style.overflow = 'hidden';
  const closeBtn = document.getElementById('cart-close');
  if (closeBtn) closeBtn.focus();
}

function closeDrawer() {
  document.body.classList.remove('drawer-open');
  document.body.style.overflow = '';
  setTimeout(() => {
    document.getElementById('cart-drawer').hidden = true;
    document.getElementById('drawer-overlay').hidden = true;
  }, 320);
  if (drawerTrigger) { drawerTrigger.focus(); drawerTrigger = null; }
}

function updateCartBadge() {
  document.querySelectorAll('.cart-badge').forEach(b => {
    const n = Cart.count();
    b.textContent = n;
    b.classList.toggle('show', n > 0);
    if (n > 0) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  });
}

function addCurso(id, opts = {}) {
  const c = getCurso(id);
  if (!c) return;
  if (Learn.isEnrolled(id)) { showToast('Ese curso ya está en tu cuenta demo'); return; }
  if (Cart.has(id)) {
    if (opts.open) openDrawer(opts.trigger); else showToast('Ya lo tenés en el carrito');
    return;
  }
  Cart.add(id);
  if (opts.open) openDrawer(opts.trigger); else showToast('¡Sumado! Tu inscripción te espera');
}

function initMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;
  const close = () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) nav.querySelector('a')?.focus();
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); }
  });
}

function initHeader() {
  document.querySelectorAll('.cart-open').forEach(btn => {
    btn.addEventListener('click', () => openDrawer(btn));
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); });
  updateCartBadge();
}

function initReveals() {
  const els = document.querySelectorAll('[data-animate]');
  if (!els.length) return;
  if (REDUCED || !('IntersectionObserver' in window)) {
    els.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.classList.add('in'); });
    document.querySelectorAll('.img-reveal').forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const el = en.target;
        const delay = parseFloat(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('in'), delay);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  els.forEach(el => io.observe(el));
  document.querySelectorAll('.img-reveal').forEach(el => io.observe(el));
}

function initStack() {
  const cards = Array.from(document.querySelectorAll('.stack-card'));
  if (!cards.length || REDUCED) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    for (let i = 0; i < cards.length - 1; i++) {
      const r = cards[i].getBoundingClientRect();
      const rn = cards[i + 1].getBoundingClientRect();
      const d = rn.top - r.top;
      const p = Math.min(1, Math.max(0, 1 - d / (r.height || 1)));
      cards[i].style.transform = `scale(${1 - p * 0.06})`;
      cards[i].style.filter = `brightness(${1 - p * 0.12})`;
    }
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

function initTextFill() {
  const el = document.getElementById('manifiesto-text');
  if (!el) return;
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map(w => `<span class="mw">${esc(w)}</span>`).join(' ');
  const spans = el.querySelectorAll('.mw');
  if (REDUCED) { spans.forEach(s => s.classList.add('fill')); return; }
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.82 - r.top) / (r.height + vh * 0.35)));
    const n = Math.round(p * spans.length);
    spans.forEach((s, i) => s.classList.toggle('fill', i < n));
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

function initHeroParallax() {
  const cols = document.querySelectorAll('.hero-strip [data-speed]');
  if (!cols.length || REDUCED) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    if (y > window.innerHeight * 1.4) return;
    cols.forEach(c => { c.style.transform = `translateY(${y * parseFloat(c.dataset.speed)}px)`; });
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
}

function cursoCard(c) {
  const d = getDocente(c.docenteId);
  const final = precioFinal(c);
  const badge = c.nuevo ? '<span class="badge badge-nuevo">Nuevo</span>' : (c.destacado ? '<span class="badge">Más elegido</span>' : '');
  return `
  <article class="curso-card" data-animate="up" style="transform:translateY(40px);opacity:0">
    <a class="curso-card-media" href="curso.html?slug=${c.slug}" aria-label="Ver curso ${esc(c.titulo)}">
      <img src="${c.portada}" alt="Portada del curso ${esc(c.titulo)}" width="800" height="600" loading="lazy" decoding="async">
      ${badge}
      ${c.descuento > 0 ? `<span class="badge badge-desc">-${c.descuento}%</span>` : ''}
    </a>
    <div class="curso-card-body">
      <span class="curso-card-cat">${esc(c.categoria)} · ${esc(c.nivel)}</span>
      <h3><a href="curso.html?slug=${c.slug}">${esc(c.titulo)}</a></h3>
      <p class="curso-card-doc">${esc(d?.nombre || '')}</p>
      <ul class="curso-card-meta">
        <li>${esc(c.duracion)}</li><li>${c.cantidadClases} clases</li><li>${esc(c.modalidad)}</li>
      </ul>
      <div class="curso-card-foot">
        <p class="curso-card-price">${formatearPrecio(final)}${c.descuento > 0 ? ` <s>${formatearPrecio(c.precio)}</s>` : ''}</p>
        <div class="curso-card-actions">
          <a class="btn btn-ghost btn-sm" href="curso.html?slug=${c.slug}">Ver curso</a>
          <button type="button" class="btn btn-primary btn-sm" data-add="${c.id}">Inscribirme</button>
        </div>
      </div>
    </div>
  </article>`;
}

function initCatalogo() {
  const grid = document.getElementById('cursos-grid');
  if (!grid) return;
  const input = document.getElementById('curso-search');
  const chipsWrap = document.getElementById('curso-chips');
  const count = document.getElementById('curso-count');
  const clearBtn = document.getElementById('curso-clear');
  let cat = 'todos';
  const cats = [...new Set(CURSOS.map(c => c.categoria))];
  chipsWrap.innerHTML = `<button type="button" class="chip active" data-cat="todos" aria-pressed="true">Todos</button>` +
    cats.map(c => `<button type="button" class="chip" data-cat="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join('');
  const hash = new URLSearchParams(location.search).get('cat');
  const render = () => {
    const q = norm(input.value);
    const list = CURSOS.filter(c => {
      if (cat !== 'todos' && c.categoria !== cat) return false;
      if (!q) return true;
      const doc = getDocente(c.docenteId);
      const blob = norm([c.titulo, c.categoria, c.nivel, c.modalidad, c.descripcionCorta, doc?.nombre, ...(c.etiquetas || [])].join(' '));
      return q.split(/\s+/).every(w => blob.includes(w));
    });
    count.textContent = list.length === 1 ? '1 curso encontrado' : `${list.length} cursos encontrados`;
    clearBtn.hidden = !q && cat === 'todos';
    if (!list.length) {
      grid.innerHTML = `
        <div class="sin-resultados">
          <h3>Nada por acá… todavía</h3>
          <p>No encontramos cursos con esa búsqueda. Probá con otra palabra o mirá el catálogo completo.</p>
          <button type="button" class="btn btn-ghost" id="sr-clear">Limpiar búsqueda</button>
        </div>`;
      document.getElementById('sr-clear').addEventListener('click', resetFilters);
      return;
    }
    grid.innerHTML = list.map(cursoCard).join('');
    grid.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.classList.add('in'); });
    grid.querySelectorAll('[data-add]').forEach(b => b.addEventListener('click', () => addCurso(b.dataset.add, { open: true, trigger: b })));
  };
  const resetFilters = () => {
    input.value = ''; cat = 'todos';
    chipsWrap.querySelectorAll('.chip').forEach(ch => {
      const on = ch.dataset.cat === 'todos';
      ch.classList.toggle('active', on);
      ch.setAttribute('aria-pressed', String(on));
    });
    render();
  };
  chipsWrap.querySelectorAll('.chip').forEach(ch => ch.addEventListener('click', () => {
    cat = ch.dataset.cat;
    chipsWrap.querySelectorAll('.chip').forEach(x => {
      const on = x === ch;
      x.classList.toggle('active', on);
      x.setAttribute('aria-pressed', String(on));
    });
    render();
  }));
  input.addEventListener('input', render);
  clearBtn.addEventListener('click', resetFilters);
  if (hash && cats.includes(hash)) {
    cat = hash;
    chipsWrap.querySelectorAll('.chip').forEach(x => {
      const on = x.dataset.cat === hash;
      x.classList.toggle('active', on);
      x.setAttribute('aria-pressed', String(on));
    });
  }
  render();
}

function lessonIcon(tipo) {
  if (tipo === 'video') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8z"/></svg>';
  if (tipo === 'pdf') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>';
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>';
}

function initCursoPage() {
  const root = document.getElementById('curso-root');
  if (!root) return;
  const slug = new URLSearchParams(location.search).get('slug');
  const c = getCursoSlug(slug);
  if (!c) {
    document.title = 'Curso no encontrado — Instituto Ser 360';
    root.innerHTML = `
      <section class="not-found">
        <span class="ring-badge" aria-hidden="true">360°</span>
        <h1>Ese curso no está en nuestro recorrido</h1>
        <p>El enlace puede estar vencido o mal escrito. El catálogo completo te espera con los cursos activos.</p>
        <a class="btn btn-primary" href="index.html#cursos">Volver al catálogo</a>
      </section>`;
    return;
  }
  const d = getDocente(c.docenteId) || DOCENTES[0];
  const final = precioFinal(c);
  const enrolled = Learn.isEnrolled(c.id);
  document.title = `${c.titulo} — Instituto Ser 360`;
  const relacionados = CURSOS.filter(x => x.id !== c.id)
    .sort((a, b) => (b.categoria === c.categoria) - (a.categoria === c.categoria)).slice(0, 3);
  root.innerHTML = `
  <nav class="breadcrumbs" aria-label="Migas de pan">
    <a href="index.html">Inicio</a><span aria-hidden="true">/</span>
    <a href="index.html#cursos">Cursos</a><span aria-hidden="true">/</span>
    <span aria-current="page">${esc(c.titulo)}</span>
  </nav>
  <section class="ficha-top">
    <div class="ficha-main">
      <span class="eyebrow">${esc(c.categoria)} · ${esc(c.nivel)} · ${esc(c.modalidad)}</span>
      <h1>${esc(c.titulo)}</h1>
      <p class="ficha-lead">${esc(c.descripcionCorta)}</p>
      <div class="ficha-media img-reveal">
        <img src="${c.portada}" alt="Portada del curso ${esc(c.titulo)}" width="1600" height="1200" decoding="async">
      </div>
      <div class="ficha-block" data-animate="up" style="transform:translateY(36px);opacity:0">
        <h2>Qué vas a lograr</h2>
        <ul class="check-list">${c.resultados.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
        <p>${esc(c.descripcionCompleta)}</p>
      </div>
      <div class="ficha-block" data-animate="up" style="transform:translateY(36px);opacity:0">
        <h2>Programa del curso</h2>
        <p class="programa-hint">La primera clase es abierta: podés probarla sin inscribirte.</p>
        <div class="programa">
          ${c.modulos.map((m, mi) => `
          <details class="modulo" ${mi === 0 ? 'open' : ''}>
            <summary><span class="modulo-num">0${mi + 1}</span><span class="modulo-title">${esc(m.titulo)}</span><span class="modulo-count">${m.clases.length} clases</span><svg class="modulo-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></summary>
            <ul class="clase-list">
              ${m.clases.map(l => {
                const open = enrolled || l.preview;
                return `<li class="clase ${open ? '' : 'locked'}">
                  ${open
                    ? `<a href="aula.html?curso=${c.slug}&clase=${l.id}">${lessonIcon(l.tipo)}<span>${esc(l.titulo)}</span>${l.preview && !enrolled ? '<em class="tag-preview">Clase abierta</em>' : ''}<small>${esc(l.duracion)}</small></a>`
                    : `<span class="clase-locked">${lessonIcon(l.tipo)}<span>${esc(l.titulo)}</span><svg class="lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg><small>${esc(l.duracion)}</small></span>`}
                </li>`;
              }).join('')}
            </ul>
          </details>`).join('')}
        </div>
      </div>
      <div class="ficha-cols">
        <div class="ficha-block" data-animate="left" style="transform:translateX(-32px);opacity:0">
          <h2>Requisitos</h2>
          <ul class="dot-list">${c.requisitos.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
        </div>
        <div class="ficha-block" data-animate="up" style="transform:translateY(36px);opacity:0">
          <h2>Qué incluye</h2>
          <ul class="check-list">${c.incluye.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
        </div>
      </div>
      <div class="ficha-block docente-block" data-animate="up" style="transform:translateY(36px);opacity:0">
        <h2>Quién te acompaña</h2>
        <article class="docente-inline">
          <img src="${d.foto}" alt="Foto de ${esc(d.nombre)}" width="120" height="120" loading="lazy" decoding="async">
          <div>
            <h3>${esc(d.nombre)}</h3>
            <p class="docente-rol">${esc(d.rol)}</p>
            <p>${esc(d.bio)}</p>
          </div>
        </article>
      </div>
    </div>
    <aside class="buy-card" id="buy-card" data-animate="right" style="transform:translateX(32px);opacity:0">
      <p class="buy-price">${formatearPrecio(final)}${c.descuento > 0 ? ` <s>${formatearPrecio(c.precio)}</s> <span class="badge badge-desc">-${c.descuento}%</span>` : ''}</p>
      ${enrolled
        ? `<a class="btn btn-primary btn-block" href="aula.html?curso=${c.slug}">Continuar en el aula</a>
           <p class="buy-note">Ya estás en este curso con tu cuenta demo.</p>`
        : `<button type="button" class="btn btn-primary btn-block" id="buy-now">Comprar ahora</button>
           <button type="button" class="btn btn-ghost btn-block" id="buy-add">Agregar al carrito</button>`}
      <ul class="buy-meta">
        <li><strong>${esc(c.duracion)}</strong> de contenido</li>
        <li><strong>${c.cantidadClases}</strong> clases en ${c.modulos.length} módulos</li>
        <li>Acceso <strong>sin vencimiento</strong></li>
        <li>Certificado de finalización propio</li>
      </ul>
      <a class="buy-question" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola Ser 360, tengo una consulta sobre el curso ' + c.titulo)}" target="_blank" rel="noopener">¿Dudas? Escribinos por WhatsApp</a>
    </aside>
  </section>
  <section class="relacionados">
    <span class="eyebrow">Seguí el recorrido</span>
    <h2>También te puede sumar</h2>
    <div class="rel-grid">${relacionados.map(cursoCard).join('')}</div>
  </section>
  <div class="sticky-cta" id="sticky-cta" hidden>
    <p>${formatearPrecio(final)}</p>
    ${enrolled ? `<a class="btn btn-primary" href="aula.html?curso=${c.slug}">Ir al aula</a>` : `<button type="button" class="btn btn-primary" id="sticky-buy">Comprar ahora</button>`}
  </div>`;
  root.querySelectorAll('[data-add]').forEach(b => b.addEventListener('click', () => addCurso(b.dataset.add, { open: true, trigger: b })));
  const buyNow = document.getElementById('buy-now');
  if (buyNow) buyNow.addEventListener('click', () => addCurso(c.id, { open: true, trigger: buyNow }));
  const buyAdd = document.getElementById('buy-add');
  if (buyAdd) buyAdd.addEventListener('click', () => { addCurso(c.id); });
  const stickyBuy = document.getElementById('sticky-buy');
  if (stickyBuy) stickyBuy.addEventListener('click', () => addCurso(c.id, { open: true, trigger: stickyBuy }));
  const buyCard = document.getElementById('buy-card');
  const sticky = document.getElementById('sticky-cta');
  if (buyCard && sticky && 'IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => {
      sticky.hidden = en.isIntersecting || window.innerWidth > 900;
    }, { threshold: 0 }).observe(buyCard);
  }
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Course',
        name: c.titulo,
        description: c.descripcionCorta,
        provider: { '@type': 'EducationalOrganization', name: 'Instituto Ser 360' },
        offers: { '@type': 'Offer', price: final, priceCurrency: 'ARS' }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: './index.html' },
          { '@type': 'ListItem', position: 2, name: 'Cursos', item: './index.html#cursos' },
          { '@type': 'ListItem', position: 3, name: c.titulo }
        ]
      }
    ]
  });
  document.head.appendChild(ld);
  initReveals();
}

function progressRing(pct) {
  const r = 26, circ = 2 * Math.PI * r;
  return `
  <svg class="ring" viewBox="0 0 64 64" role="img" aria-label="Progreso ${pct} por ciento">
    <circle cx="32" cy="32" r="${r}" fill="none" stroke="var(--color-primary-soft)" stroke-width="6"/>
    <circle cx="32" cy="32" r="${r}" fill="none" stroke="var(--color-primary)" stroke-width="6" stroke-linecap="round"
      stroke-dasharray="${circ}" stroke-dashoffset="${circ * (1 - pct / 100)}" transform="rotate(-90 32 32)"/>
    <text x="32" y="37" text-anchor="middle">${pct}%</text>
  </svg>`;
}

function initAlumnoPage() {
  const root = document.getElementById('alumno-root');
  if (!root) return;
  const render = () => {
    const s = Session.get();
    if (!s) {
      root.innerHTML = `
      <section class="panel-login">
        <span class="ring-badge" aria-hidden="true">360°</span>
        <h1>Tu panel de alumno</h1>
        <p>Acá viven tus cursos, tu progreso y tus certificados. En esta demostración podés entrar sin contraseña y recorrerlo con datos de ejemplo.</p>
        <button type="button" class="btn btn-primary" id="demo-login">Entrar como alumno demo</button>
        <p class="panel-login-note">No pedimos ni guardamos datos reales.</p>
      </section>`;
      document.getElementById('demo-login').addEventListener('click', () => { Session.start(); render(); showToast('¡Sesión demo iniciada!'); });
      return;
    }
    const st = Learn.get();
    const enrolled = st.enrolledCourseIds.map(getCurso).filter(Boolean);
    const enProgreso = enrolled.filter(c => { const p = Learn.progress(c); return p.done > 0 && p.pct < 100; });
    const completados = enrolled.filter(c => Learn.progress(c).pct === 100);
    const pendientes = enrolled.filter(c => Learn.progress(c).done === 0);
    const continueCurso = enProgreso[0] || pendientes[0];
    const filaCurso = c => {
      const p = Learn.progress(c);
      const next = Learn.nextLesson(c);
      return `
      <article class="panel-curso">
        <img src="${c.portada}" alt="Portada de ${esc(c.titulo)}" width="140" height="105" loading="lazy" decoding="async">
        <div class="panel-curso-info">
          <h3><a href="curso.html?slug=${c.slug}">${esc(c.titulo)}</a></h3>
          <p>${p.done} de ${p.total} clases completadas</p>
          <div class="bar" role="progressbar" aria-valuenow="${p.pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Progreso de ${esc(c.titulo)}"><span style="width:${p.pct}%"></span></div>
        </div>
        <div class="panel-curso-side">
          ${progressRing(p.pct)}
          <a class="btn ${p.pct === 100 ? 'btn-ghost' : 'btn-primary'} btn-sm" href="aula.html?curso=${c.slug}&clase=${next}">${p.pct === 100 ? 'Repasar' : (p.done === 0 ? 'Empezar' : 'Continuar')}</a>
        </div>
      </article>`;
    };
    root.innerHTML = `
    <section class="panel-head">
      <div class="panel-hola">
        <span class="avatar" aria-hidden="true">${esc(s.nombre[0])}</span>
        <div>
          <span class="eyebrow">Modo demostración</span>
          <h1>¡Hola, ${esc(s.nombre)}!</h1>
          <p>Tu recorrido: ${enrolled.length} ${enrolled.length === 1 ? 'curso' : 'cursos'} · ${completados.length} ${completados.length === 1 ? 'completado' : 'completados'}</p>
        </div>
      </div>
      ${continueCurso ? `
      <div class="panel-continue">
        <span class="eyebrow">Seguí donde dejaste</span>
        <h2>${esc(continueCurso.titulo)}</h2>
        <a class="btn btn-primary" href="aula.html?curso=${continueCurso.slug}&clase=${Learn.nextLesson(continueCurso)}">Continuar aprendiendo</a>
      </div>` : ''}
    </section>
    ${enrolled.length === 0 ? `
    <section class="panel-vacio">
      <h2>Todavía no empezaste ningún curso</h2>
      <p>Elegí el primero del catálogo y arrancá hoy: la primera clase de cada curso es abierta.</p>
      <a class="btn btn-primary" href="index.html#cursos">Ver los cursos</a>
    </section>` : `
    ${enProgreso.length ? `<section class="panel-sec"><h2>En progreso</h2>${enProgreso.map(filaCurso).join('')}</section>` : ''}
    ${pendientes.length ? `<section class="panel-sec"><h2>Por empezar</h2>${pendientes.map(filaCurso).join('')}</section>` : ''}
    ${completados.length ? `<section class="panel-sec"><h2>Completados</h2>${completados.map(filaCurso).join('')}
      <div class="certs">
        ${completados.map(c => `
        <article class="cert-card">
          <div>
            <span class="eyebrow">Certificado de finalización propio</span>
            <h3>${esc(c.titulo)}</h3>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-cert="${c.id}">Ver certificado</button>
        </article>`).join('')}
      </div>
      <div id="cert-view" hidden></div>
    </section>` : ''}
    <section class="panel-sec">
      <h2>Historial de inscripciones</h2>
      <ul class="historial">
        ${st.enrollments.slice().reverse().map(e => {
          const c = getCurso(e.courseId);
          return c ? `<li><span>${esc(e.fecha)}</span><strong>${esc(c.titulo)}</strong><em>Inscripción demo</em></li>` : '';
        }).join('')}
      </ul>
    </section>`}
    <section class="panel-foot">
      <button type="button" class="btn btn-ghost btn-sm" id="demo-logout">Cerrar sesión demo</button>
      <button type="button" class="link-danger" id="demo-reset">Reiniciar demo</button>
    </section>`;
    document.getElementById('demo-logout').addEventListener('click', () => { Session.end(); render(); });
    document.getElementById('demo-reset').addEventListener('click', () => {
      if (window.confirm('Esto borra el progreso, el carrito y la sesión de esta demostración. ¿Reiniciar?')) {
        localStorage.removeItem(Cart.KEY);
        localStorage.removeItem(Learn.KEY);
        localStorage.removeItem(Session.KEY);
        location.reload();
      }
    });
    root.querySelectorAll('[data-cert]').forEach(b => b.addEventListener('click', () => {
      const c = getCurso(b.dataset.cert);
      const view = document.getElementById('cert-view');
      if (!c || !view) return;
      view.hidden = false;
      view.innerHTML = `
      <div class="certificado">
        <span class="ring-badge" aria-hidden="true">360°</span>
        <p class="cert-inst">Instituto Ser 360</p>
        <h3>Certificado de finalización</h3>
        <p>Se deja constancia de que <strong>${esc(s.nombre)} (demo)</strong> completó el curso</p>
        <p class="cert-curso">${esc(c.titulo)}</p>
        <p class="cert-fecha">Emitido en modo demostración · ${new Date().toLocaleDateString('es-AR')}</p>
        <p class="cert-nota">El certificado descargable con datos reales se habilita al pasar la plataforma a producción.</p>
      </div>`;
      view.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
    }));
  };
  render();
}

const LECTURAS = [
  'Antes de avanzar, tomate dos minutos para pensar en una situación reciente donde esta habilidad te hubiera cambiado el resultado. Anotala: va a ser tu caso de práctica durante todo el curso.',
  'La idea central de esta clase es simple de entender y difícil de sostener: los cambios chicos, repetidos en contextos reales, le ganan a cualquier maratón de teoría. Por eso cada ejercicio te pide aplicar una sola cosa por vez.',
  'Para cerrar, elegí UNA acción concreta que puedas hacer esta semana. Escribila en tus notas con fecha y lugar. En la próxima clase vas a revisar cómo salió: ese repaso es donde ocurre el aprendizaje.'
];

function initAulaPage() {
  const root = document.getElementById('aula-root');
  if (!root) return;
  const params = new URLSearchParams(location.search);
  const c = getCursoSlug(params.get('curso'));
  if (!c) {
    root.innerHTML = `
      <section class="not-found">
        <span class="ring-badge" aria-hidden="true">360°</span>
        <h1>Aula no encontrada</h1>
        <p>El curso que buscás no existe o el enlace está incompleto.</p>
        <a class="btn btn-primary" href="index.html#cursos">Volver al catálogo</a>
      </section>`;
    return;
  }
  const lessons = allLessons(c);
  let claseId = params.get('clase');
  if (!claseId || !lessons.some(l => l.id === claseId)) claseId = Learn.nextLesson(c);
  const renderAula = () => {
    const enrolled = Learn.isEnrolled(c.id);
    const clase = lessons.find(l => l.id === claseId) || lessons[0];
    const canView = enrolled || clase.preview;
    const idx = lessons.indexOf(clase);
    const p = Learn.progress(c);
    document.title = `${clase.titulo} — Aula Ser 360`;
    if (canView && enrolled) Learn.setLast(c.id, clase.id);
    const sidebar = `
      <div class="aula-side-head">
        <a class="aula-back" href="curso.html?slug=${c.slug}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5m7-7l-7 7 7 7"/></svg>
          ${esc(c.titulo)}
        </a>
        <div class="bar" role="progressbar" aria-valuenow="${p.pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Progreso del curso"><span style="width:${p.pct}%"></span></div>
        <p class="aula-progress-label">${p.pct}% completado · ${p.done}/${p.total} clases</p>
      </div>
      ${c.modulos.map((m, mi) => `
      <details class="aula-mod" ${m.clases.some(l => l.id === clase.id) ? 'open' : ''}>
        <summary><span class="modulo-num">0${mi + 1}</span> ${esc(m.titulo)}<svg class="modulo-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></summary>
        <ul>
          ${m.clases.map(l => {
            const open = enrolled || l.preview;
            const done = Learn.isDone(l.id);
            return `<li class="${l.id === clase.id ? 'current' : ''} ${done ? 'done' : ''}">
              ${open
                ? `<button type="button" class="aula-lesson" data-goto="${l.id}">${done ? '<span class="tick" aria-label="Completada">✓</span>' : lessonIcon(l.tipo)}<span>${esc(l.titulo)}</span><small>${esc(l.duracion)}</small></button>`
                : `<span class="aula-lesson locked">${lessonIcon(l.tipo)}<span>${esc(l.titulo)}</span><svg class="lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></span>`}
            </li>`;
          }).join('')}
        </ul>
      </details>`).join('')}`;
    let main;
    if (!canView) {
      main = `
      <div class="aula-blocked">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
        <h1>Esta clase es parte del curso completo</h1>
        <p>Estás viendo el aula en modo demostración. Para desbloquear todas las clases, inscribite desde la ficha del curso — o probá la clase abierta de cada curso, sin costo.</p>
        <div class="aula-blocked-actions">
          <a class="btn btn-primary" href="curso.html?slug=${c.slug}">Ver el curso</a>
          <button type="button" class="btn btn-ghost" data-goto="${lessons.find(l => l.preview)?.id || lessons[0].id}">Probar la clase abierta</button>
        </div>
      </div>`;
    } else {
      let contenido;
      if (clase.tipo === 'video') {
        contenido = `
        <div class="player img-reveal">
          <img src="${c.portada}" alt="Vista previa de la clase ${esc(clase.titulo)}" width="1600" height="900" decoding="async">
          <button type="button" class="player-play" id="player-play" aria-label="Reproducir clase demo">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <div class="player-note" id="player-note" hidden>
            <p><strong>Contenido de muestra.</strong> Los videos reales se cargan al llevar la plataforma a producción; el aula, el progreso y las notas ya funcionan como los va a ver cada alumno.</p>
          </div>
        </div>`;
      } else if (clase.tipo === 'lectura') {
        contenido = `
        <div class="lectura">
          <span class="eyebrow">Material de lectura</span>
          ${LECTURAS.map(t => `<p>${esc(t)}</p>`).join('')}
          <p class="lectura-demo">Texto de muestra: el material real de «${esc(clase.titulo)}» se carga en producción.</p>
        </div>`;
      } else {
        contenido = `
        <div class="recurso">
          <span class="eyebrow">Recurso descargable</span>
          <h2>${esc(clase.titulo)}</h2>
          <p>Esta clase incluye una guía en PDF lista para imprimir o completar en pantalla. Abajo tenés un adelanto del contenido.</p>
          <ul class="check-list">
            <li>Plantilla paso a paso para aplicar lo visto en el módulo</li>
            <li>Ejemplos completados como referencia</li>
            <li>Espacio de registro para tus propios casos</li>
          </ul>
          <button type="button" class="btn btn-ghost" disabled>Descargar PDF (se habilita en producción)</button>
        </div>`;
      }
      const done = Learn.isDone(clase.id);
      main = `
      <div class="aula-lesson-head">
        <span class="eyebrow">${esc(clase.tipo === 'video' ? 'Clase en video' : clase.tipo === 'lectura' ? 'Lectura' : 'Recurso')} · ${esc(clase.duracion)}${clase.preview && !enrolled ? ' · Clase abierta' : ''}</span>
        <h1>${esc(clase.titulo)}</h1>
      </div>
      ${contenido}
      <div class="aula-actions">
        <button type="button" class="btn btn-ghost btn-sm" id="lesson-prev" ${idx === 0 ? 'disabled' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5m7-7l-7 7 7 7"/></svg> Anterior
        </button>
        ${enrolled ? `<button type="button" class="btn ${done ? 'btn-done' : 'btn-primary'}" id="lesson-done" aria-pressed="${done}">${done ? '✓ Clase completada' : 'Marcar como completada'}</button>` : `<a class="btn btn-primary" href="curso.html?slug=${c.slug}">Inscribirme al curso</a>`}
        <button type="button" class="btn btn-ghost btn-sm" id="lesson-next" ${idx === lessons.length - 1 ? 'disabled' : ''}>
          Siguiente <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
        </button>
      </div>
      ${enrolled ? `
      <div class="aula-notas">
        <label for="nota-input">Tus notas de esta clase</label>
        <textarea id="nota-input" rows="4" placeholder="Anotá acá tus ideas, ejemplos o pendientes…">${esc(Learn.getNote(clase.id))}</textarea>
        <span class="nota-status" id="nota-status" aria-live="polite"></span>
      </div>` : ''}`;
    }
    root.innerHTML = `
    <div class="aula-layout">
      <button type="button" class="btn btn-ghost btn-sm aula-index-toggle" id="aula-index-toggle" aria-expanded="false" aria-controls="aula-side">Ver índice del curso</button>
      <aside class="aula-side" id="aula-side">${sidebar}</aside>
      <section class="aula-main" id="contenido-aula">${main}</section>
    </div>
    <p class="aula-demo-tag">Modo demostración</p>`;
    root.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => {
      claseId = b.dataset.goto;
      window.history.replaceState(null, '', `aula.html?curso=${c.slug}&clase=${claseId}`);
      renderAula();
      window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
    }));
    const goto = i => {
      if (i < 0 || i >= lessons.length) return;
      claseId = lessons[i].id;
      window.history.replaceState(null, '', `aula.html?curso=${c.slug}&clase=${claseId}`);
      renderAula();
      window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
    };
    document.getElementById('lesson-prev')?.addEventListener('click', () => goto(idx - 1));
    document.getElementById('lesson-next')?.addEventListener('click', () => goto(idx + 1));
    document.getElementById('lesson-done')?.addEventListener('click', () => {
      Learn.toggleLesson(clase.id);
      renderAula();
      if (Learn.progress(c).pct === 100) showToast('¡Curso completado! Tu certificado está en el panel');
    });
    document.getElementById('player-play')?.addEventListener('click', () => {
      const note = document.getElementById('player-note');
      if (note) note.hidden = false;
    });
    const nota = document.getElementById('nota-input');
    if (nota) {
      let t;
      nota.addEventListener('input', () => {
        clearTimeout(t);
        t = setTimeout(() => {
          Learn.saveNote(clase.id, nota.value.trim());
          const st = document.getElementById('nota-status');
          if (st) { st.textContent = 'Guardado ✓'; setTimeout(() => { st.textContent = ''; }, 1800); }
        }, 500);
      });
    }
    const idxToggle = document.getElementById('aula-index-toggle');
    const side = document.getElementById('aula-side');
    if (idxToggle && side) idxToggle.addEventListener('click', () => {
      const open = side.classList.toggle('open');
      idxToggle.setAttribute('aria-expanded', String(open));
      idxToggle.textContent = open ? 'Ocultar índice' : 'Ver índice del curso';
    });
    initReveals();
  };
  renderAula();
}

function initBanners() {
  const sec = document.getElementById('banners');
  const inner = document.getElementById('banners-inner');
  if (!sec || !inner) return;
  const hoy = new Date().toISOString().slice(0, 10);
  const activos = BANNERS.filter(b => !b.vigencia || b.vigencia >= hoy);
  if (!activos.length) return;
  sec.hidden = false;
  const slide = b => `<a class="banner-slide" href="${esc(b.destino)}"><img src="${esc(b.imagen)}" alt="${esc(b.alt)}" width="1400" height="500" loading="lazy" decoding="async"></a>`;
  if (activos.length === 1) {
    inner.innerHTML = slide(activos[0]);
    return;
  }
  let i = 0, timer = null;
  inner.innerHTML = `
    <div class="banner-track" id="banner-track">${activos.map(slide).join('')}</div>
    <div class="banner-controls">
      <button type="button" class="icon-btn" id="banner-prev" aria-label="Anuncio anterior"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>
      <div class="banner-dots" id="banner-dots" role="tablist" aria-label="Elegir anuncio">${activos.map((_, n) => `<button type="button" class="banner-dot${n === 0 ? ' active' : ''}" data-dot="${n}" aria-label="Anuncio ${n + 1}"></button>`).join('')}</div>
      <button type="button" class="icon-btn" id="banner-next" aria-label="Anuncio siguiente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></button>
      <button type="button" class="icon-btn" id="banner-pause" aria-label="Pausar rotación" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 5v14M14 5v14"/></svg></button>
    </div>`;
  const track = document.getElementById('banner-track');
  const dots = Array.from(inner.querySelectorAll('.banner-dot'));
  const go = n => {
    i = (n + activos.length) % activos.length;
    track.style.transform = `translateX(-${i * 100}%)`;
    dots.forEach((d, k) => d.classList.toggle('active', k === i));
  };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
  const play = () => { if (!REDUCED && !timer) timer = setInterval(() => go(i + 1), 6000); };
  document.getElementById('banner-prev').addEventListener('click', () => { stop(); go(i - 1); });
  document.getElementById('banner-next').addEventListener('click', () => { stop(); go(i + 1); });
  dots.forEach(d => d.addEventListener('click', () => { stop(); go(parseInt(d.dataset.dot, 10)); }));
  const pauseBtn = document.getElementById('banner-pause');
  pauseBtn.addEventListener('click', () => {
    const paused = pauseBtn.getAttribute('aria-pressed') === 'true';
    pauseBtn.setAttribute('aria-pressed', String(!paused));
    if (paused) play(); else stop();
  });
  let x0 = null;
  track.addEventListener('pointerdown', e => { x0 = e.clientX; });
  track.addEventListener('pointerup', e => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) { stop(); go(dx < 0 ? i + 1 : i - 1); }
  });
  play();
}

function initHome() {
  initBanners();
  initCatalogo();
  initStack();
  initTextFill();
  initHeroParallax();
  document.querySelectorAll('.home-cat-link').forEach(a => a.addEventListener('click', e => {
    const catBtn = document.querySelector(`#curso-chips .chip[data-cat="${a.dataset.cat}"]`);
    if (catBtn) { e.preventDefault(); catBtn.click(); document.getElementById('cursos').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }); }
  }));
}

document.addEventListener('DOMContentLoaded', () => {
  buildDrawer();
  initHeader();
  initMenu();
  initWspFloat();
  const page = document.body.dataset.page;
  if (page === 'home') initHome();
  if (page === 'curso') initCursoPage();
  if (page === 'alumno') initAlumnoPage();
  if (page === 'aula') initAulaPage();
  if (page !== 'curso') initReveals();
});
