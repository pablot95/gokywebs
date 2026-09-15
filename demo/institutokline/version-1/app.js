(function () {
  'use strict';

  const IC = {
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  };
  const claseIcon = (t) => t === 'ejercicio' ? IC.pencil : t === 'lectura' ? IC.doc : t === 'pdf' ? IC.doc : IC.play;
  const durLabel = (c) => (c && c.duracion ? c.duracion.split('·')[0].trim() : '');

  function showToast(msg) {
    let wrap = document.querySelector('.toast-wrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = IC.check + '<span>' + esc(msg) + '</span>';
    wrap.appendChild(toast);
    setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 240); }, 3200);
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initReveals() {
    const els = document.querySelectorAll('[data-animate],[data-animate-mask]');
    if (reduce || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
  }

  function initWspFloat() {
    const btn = document.getElementById('wsp-float');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
    }, { passive: true });
  }

  function initParallax() {
    const el = document.querySelector('[data-parallax]');
    if (!el || reduce) return;
    window.addEventListener('scroll', () => {
      const r = el.getBoundingClientRect();
      const off = (window.innerHeight / 2 - (r.top + r.height / 2)) * 0.12;
      el.style.transform = 'translateX(' + off + 'px)';
    }, { passive: true });
  }

  /* ---------- focus trap ---------- */
  function trap(container, e) {
    if (e.key !== 'Tab') return;
    const f = container.querySelectorAll('a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- header / nav ---------- */
  function initHeader() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');
    if (toggle && nav) {
      const close = () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
      toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
        if (open) { const l = nav.querySelector('a'); l && l.focus(); }
      });
      nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    }
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  /* ---------- cart drawer ---------- */
  let lastFocused = null;
  function initCartUI() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('overlay');
    const openBtn = document.getElementById('cartBtn');
    const closeBtn = document.getElementById('cartClose');
    if (!drawer || !overlay) { syncBadge(); return; }

    const open = () => {
      lastFocused = document.activeElement;
      renderCart();
      overlay.classList.add('open'); drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      if (window.lenis) window.lenis.stop();
      document.body.style.overflow = 'hidden';
      closeBtn && closeBtn.focus();
    };
    const close = () => {
      overlay.classList.remove('open'); drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      if (window.lenis) window.lenis.start();
      document.body.style.overflow = '';
      lastFocused && lastFocused.focus();
    };
    openBtn && openBtn.addEventListener('click', open);
    closeBtn && closeBtn.addEventListener('click', close);
    overlay && overlay.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) close();
      if (drawer.classList.contains('open')) trap(drawer, e);
    });

    const checkout = document.getElementById('checkoutBtn');
    checkout && checkout.addEventListener('click', () => {
      const ids = Cart.get();
      if (!ids.length) return;
      Learning.startSession();
      Learning.enroll(ids);
      Cart.clear();
      renderCart();
      showToast('¡Listo! Ya tenés acceso en el aula demo.');
      setTimeout(close, 900);
    });

    document.addEventListener('cart:updated', () => { syncBadge(true); renderCart(); });
    syncBadge();
  }

  function syncBadge(bump) {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const n = Cart.count();
    badge.textContent = n;
    badge.classList.toggle('show', n > 0);
    if (bump && n > 0) { badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump'); }
  }

  function renderCart() {
    const body = document.getElementById('cartBody');
    const foot = document.getElementById('cartFoot');
    if (!body) return;
    const ids = Cart.get();
    if (!ids.length) {
      body.innerHTML = '<div class="cart-empty">' + IC.cart + '<h4>Todavía no elegiste ningún curso</h4><p>Sumá el programa que te interese y empezá cuando quieras.</p></div>';
      if (foot) foot.hidden = true;
      return;
    }
    body.innerHTML = ids.map((id) => {
      const c = getCursoById(id); if (!c) return '';
      const d = getDocente(c.docenteId);
      return '<div class="cart-line"><img src="' + c.portada + '" alt="" width="74" height="60"><div class="cl-info"><h4>' + esc(c.titulo) + '</h4><div class="cl-meta">' + esc(d?.nombre || '') + ' · ' + esc(c.nivel) + '</div><div class="cl-price">' + fmt(precioFinal(c)) + '</div></div><button class="cl-remove" data-remove="' + c.id + '" aria-label="Quitar ' + esc(c.titulo) + '">' + IC.trash + '</button></div>';
    }).join('');
    body.querySelectorAll('[data-remove]').forEach((b) => b.addEventListener('click', () => Cart.remove(b.dataset.remove)));
    if (foot) {
      foot.hidden = false;
      const ahorro = Cart.ahorro();
      document.getElementById('cartAhorro').textContent = '-' + fmt(ahorro);
      document.getElementById('cartAhorroRow').style.display = ahorro > 0 ? 'flex' : 'none';
      document.getElementById('cartTotal').textContent = fmt(Cart.total());
    }
  }

  function addToCart(id) {
    const c = getCursoById(id); if (!c) return;
    if (Cart.has(id)) { showToast('Ese curso ya está en tu inscripción'); return; }
    Cart.add(id);
    showToast('Agregado: ' + c.titulo);
  }

  /* ---------- course card ---------- */
  function courseCard(c) {
    const d = getDocente(c.docenteId);
    const pf = precioFinal(c);
    const badges = [];
    if (c.nuevo) badges.push('<span class="badge badge-new">Nuevo</span>');
    if (c.enVivo) badges.push('<span class="badge badge-live">En vivo</span>');
    if (c.descuento > 0) badges.push('<span class="badge badge-off">-' + c.descuento + '%</span>');
    return '<article class="course-card" data-animate data-cat="' + esc(c.categoria) + '">' +
      '<div class="cc-media">' + (badges.length ? '<div class="cc-badges">' + badges.join('') + '</div>' : '') +
      '<a href="curso.html?slug=' + c.slug + '" tabindex="-1" aria-hidden="true"><img src="' + c.portada + '" width="400" height="300" alt="' + esc(c.titulo) + '" loading="lazy"></a></div>' +
      '<div class="cc-body">' +
      '<div class="cc-eyebrow">' + esc(c.categoria) + ' <span class="lvl">· ' + esc(c.nivel) + '</span></div>' +
      '<h3 class="cc-title"><a href="curso.html?slug=' + c.slug + '">' + esc(c.titulo) + '</a></h3>' +
      '<div class="cc-teacher"><img src="' + (d?.foto || '') + '" alt="" width="26" height="26"> ' + esc(d?.nombre || '') + '</div>' +
      '<div class="cc-meta"><span>' + IC.clock + durLabel(c) + '</span><span>' + IC.list + totalClases(c) + ' clases</span></div>' +
      '<div class="cc-foot"><div class="cc-price"><span class="now">' + fmt(pf) + '</span>' + (c.descuento > 0 ? '<span class="was">' + fmt(c.precio) + '</span>' : '') + '</div>' +
      '<div class="cc-actions"><a class="btn btn-ghost" href="curso.html?slug=' + c.slug + '">Ver curso</a>' +
      '<button class="add-btn" data-add="' + c.id + '" aria-label="Agregar ' + esc(c.titulo) + ' a la inscripción">' + IC.plus + '</button></div></div></div></article>';
  }

  function wireAdds(scope) {
    (scope || document).querySelectorAll('[data-add]').forEach((b) => {
      if (b.dataset.wired) return; b.dataset.wired = '1';
      b.addEventListener('click', () => addToCart(b.dataset.add));
    });
  }

  function initSplit() {
    const els = document.querySelectorAll('[data-split]');
    if (!els.length) return;
    if (reduce || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('split-ready')); return; }
    els.forEach((el) => { el.querySelectorAll('.split-line>span').forEach((l, i) => { l.style.transitionDelay = (i * 0.09) + 's'; }); });
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('split-ready'); io.unobserve(en.target); } }), { threshold: 0.2 });
    els.forEach((e) => io.observe(e));
  }
  function initHeroParallax() {
    const el = document.querySelector('[data-parallax-hero]');
    if (!el || reduce) return;
    window.addEventListener('scroll', () => { const y = window.scrollY; if (y < 900) el.style.transform = 'translateY(' + (y * 0.1) + 'px)'; }, { passive: true });
  }

  /* ---------- HOME ---------- */
  function initHome() {
    initSplit();
    initHeroParallax();
    const grid = document.getElementById('courses');
    const chipsWrap = document.getElementById('catChips');
    const search = document.getElementById('courseSearch');
    const count = document.getElementById('resultsCount');
    let cat = 'Todos';

    const cats = ['Todos'].concat(CATEGORIAS);
    chipsWrap.innerHTML = cats.map((c, i) => '<button class="chip" data-cat="' + esc(c) + '" aria-pressed="' + (i === 0) + '">' + esc(c) + '</button>').join('');
    const setCat = (name) => { cat = name; chipsWrap.querySelectorAll('.chip').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.cat === name))); render(); };
    chipsWrap.querySelectorAll('.chip').forEach((ch) => ch.addEventListener('click', () => setCat(ch.dataset.cat)));
    document.querySelectorAll('.area-card[data-cat]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); setCat(a.dataset.cat); const t = document.getElementById('cursos'); t && t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }));

    function render() {
      const q = normalize(search ? search.value : '');
      let list = CURSOS.filter((c) => cat === 'Todos' || c.categoria === cat);
      if (q) list = list.filter((c) => {
        const d = getDocente(c.docenteId);
        return normalize(c.titulo + ' ' + c.categoria + ' ' + c.nivel + ' ' + c.descripcion + ' ' + (d?.nombre || '')).includes(q);
      });
      if (!list.length) {
        grid.innerHTML = '<div class="no-results"><h3>No encontramos cursos con ese filtro</h3><p>Probá con otra categoría o limpiá la búsqueda.</p><button class="btn btn-ghost" id="clearFilters" style="margin-top:1rem">Limpiar filtros</button></div>';
        document.getElementById('clearFilters').addEventListener('click', () => { cat = 'Todos'; if (search) search.value = ''; chipsWrap.querySelectorAll('.chip').forEach((x, i) => x.setAttribute('aria-pressed', String(i === 0))); render(); });
      } else {
        grid.innerHTML = list.map(courseCard).join('');
        wireAdds(grid);
        grid.querySelectorAll('[data-animate]').forEach((e) => e.classList.add('in'));
      }
      if (count) count.textContent = list.length + (list.length === 1 ? ' curso' : ' cursos');
    }
    search && search.addEventListener('input', render);
    render();

    const teachers = document.getElementById('teachers');
    if (teachers) teachers.innerHTML = DOCENTES.map((d) => '<article class="teacher" data-animate><div class="teacher-photo"><img src="' + d.foto + '" width="360" height="360" alt="' + esc(d.nombre) + ', ' + esc(d.rol) + '" loading="lazy"></div><div class="teacher-body"><h3>' + esc(d.nombre) + '</h3><div class="teacher-role">' + esc(d.rol) + '</div><p>' + esc(d.bio) + '</p></div></article>').join('');

    const faq = document.getElementById('faqAcc');
    if (faq) faq.innerHTML = FAQ_GLOBAL.map((f) => '<details class="acc-item"><summary><span>' + esc(f.q) + '</span><span class="acc-plus"></span></summary><div class="acc-body" style="padding-left:1.2rem">' + esc(f.a) + '</div></details>').join('');

    initReveals();
  }

  /* ---------- FICHA ---------- */
  function initCurso() {
    const root = document.getElementById('fichaRoot');
    const slug = new URLSearchParams(location.search).get('slug');
    const c = getCurso(slug);
    if (!c) {
      root.innerHTML = '<div class="container not-found"><h1>No encontramos ese curso</h1><p>El programa que buscás no existe o cambió de dirección.</p><a class="btn btn-primary" href="index.html#cursos">Ver todos los programas</a></div>';
      return;
    }
    const d = getDocente(c.docenteId);
    const pf = precioFinal(c);
    document.title = c.titulo + ' — Instituto Kline';
    const md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', c.resumen);

    const clasesTotal = totalClases(c);
    const learnHtml = c.resultados.map((r) => '<li>' + IC.check + '<span>' + esc(r) + '</span></li>').join('');
    const programHtml = c.modulos.map((m, i) => {
      const rows = m.clases.map((cl) => '<div class="lesson-row"><span class="lt-ico">' + claseIcon(cl.tipo) + '</span><span class="lt-title">' + esc(cl.titulo) + '</span>' + (cl.preview ? '<a class="lt-preview" href="aula.html?curso=' + c.slug + '&clase=' + cl.id + '">Vista previa</a>' : '') + '<span class="lt-dur">' + esc(cl.duracion) + '</span></div>').join('');
      return '<details class="program-mod"' + (i === 0 ? ' open' : '') + '><summary><span class="acc-num">' + String(i + 1).padStart(2, '0') + '</span><span>' + esc(m.titulo) + '</span><span class="mod-count">' + m.clases.length + ' clases</span><span class="acc-plus"></span></summary>' + rows + '</details>';
    }).join('');
    const incluyeHtml = c.incluye.map((x) => '<li>' + IC.check + '<span>' + esc(x) + '</span></li>').join('');
    const reqHtml = c.requisitos.map((x) => '<li>' + IC.check + '<span>' + esc(x) + '</span></li>').join('');
    const faqHtml = FAQ_GLOBAL.map((f) => '<details class="acc-item"><summary><span>' + esc(f.q) + '</span><span class="acc-plus"></span></summary><div class="acc-body" style="padding-left:1.2rem">' + esc(f.a) + '</div></details>').join('');
    const related = CURSOS.filter((x) => x.id !== c.id && x.categoria === c.categoria).concat(CURSOS.filter((x) => x.id !== c.id && x.categoria !== c.categoria)).slice(0, 3);

    root.innerHTML =
      '<div class="container"><nav class="breadcrumbs" aria-label="Ruta"><a href="index.html">Inicio</a><span>/</span><a href="index.html#cursos">' + esc(c.categoria) + '</a><span>/</span><span>' + esc(c.titulo) + '</span></nav></div>' +
      '<div class="container ficha-hero">' +
      '<div class="ficha-main" data-animate><div class="cc-eyebrow">' + esc(c.categoria) + ' <span class="lvl">· ' + esc(c.nivel) + '</span></div>' +
      '<h1>' + esc(c.titulo) + '</h1><p class="ficha-lead">' + esc(c.resumen) + '</p>' +
      '<div class="ficha-facts"><span class="ficha-fact">' + IC.clock + esc(c.duracion) + '</span><span class="ficha-fact">' + IC.list + clasesTotal + ' clases</span><span class="ficha-fact">' + IC.doc + esc(c.modalidad) + '</span></div>' +
      '<div class="ficha-teacher-row"><img src="' + (d?.foto || '') + '" alt="' + esc(d?.nombre || '') + '" width="48" height="48"><div><b>' + esc(d?.nombre || '') + '</b><br><small>' + esc(d?.rol || '') + '</small></div></div></div>' +
      '<aside class="ficha-aside"><div class="buy-card" data-animate style="transition-delay:.1s"><div class="buy-media"><img src="' + c.portada + '" width="400" height="250" alt="' + esc(c.titulo) + '"><div class="play-poster"><span>' + IC.play + '</span></div></div>' +
      '<div class="buy-body"><div class="buy-price"><span class="now">' + fmt(pf) + '</span>' + (c.descuento > 0 ? '<span class="was">' + fmt(c.precio) + '</span><span class="off">-' + c.descuento + '%</span>' : '') + '</div>' +
      '<div class="buy-guarantee">' + IC.check + '7 días de garantía. Si no es para vos, te devolvemos todo.</div>' +
      '<div class="buy-actions"><button class="btn btn-primary btn-block" data-buy="' + c.id + '">Inscribirme ahora</button><button class="btn btn-ghost btn-block" data-add="' + c.id + '">Agregar a la inscripción</button></div>' +
      '<ul class="buy-includes">' + incluyeHtml + '</ul></div></div></aside></div>' +
      '<section class="ficha-section"><div class="container ficha-block" data-animate><h2>Qué vas a lograr</h2><ul class="learn-grid">' + learnHtml + '</ul></div></section>' +
      '<section class="ficha-section bg-alt"><div class="container ficha-block" data-animate><h2>El programa, clase por clase</h2><p class="muted" style="margin-bottom:1.4rem;max-width:40rem">' + esc(c.descripcion) + '</p>' + programHtml + '</div></section>' +
      '<section class="ficha-section"><div class="container ficha-block" data-animate><h2>Requisitos</h2><ul class="req-list">' + reqHtml + '</ul></div></section>' +
      '<section class="ficha-section bg-alt"><div class="container ficha-block" data-animate><h2>Quién te va a guiar</h2><div class="teacher-full"><img src="' + (d?.foto || '') + '" alt="' + esc(d?.nombre || '') + '" width="110" height="110"><div><h3>' + esc(d?.nombre || '') + '</h3><div class="role">' + esc(d?.rol || '') + '</div><p>' + esc(d?.bio || '') + '</p></div></div></div></section>' +
      '<section class="ficha-section"><div class="container ficha-block" data-animate><h2>Preguntas frecuentes</h2><div class="faq-wrap accordion">' + faqHtml + '</div></div></section>' +
      '<section class="ficha-section bg-alt"><div class="container ficha-block" data-animate><h2>También te puede interesar</h2><div class="related-grid">' + related.map(courseCard).join('') + '</div></div></section>';

    injectFichaSchema(c, d, pf);

    const sticky = document.getElementById('stickyBuy');
    if (sticky) {
      sticky.querySelector('.sb-price').textContent = fmt(pf);
      sticky.querySelector('[data-buy]').dataset.buy = c.id;
    }

    root.addEventListener('click', (e) => {
      const add = e.target.closest('[data-add]');
      const buy = e.target.closest('[data-buy]');
      if (add) addToCart(add.dataset.add);
      if (buy) { addToCart(buy.dataset.buy); document.getElementById('cartBtn').click(); }
    });
    if (sticky) sticky.querySelector('[data-buy]').addEventListener('click', () => { addToCart(c.id); document.getElementById('cartBtn').click(); });

    if (sticky && 'IntersectionObserver' in window) {
      const anchor = root.querySelector('.buy-actions');
      const io = new IntersectionObserver((ents) => ents.forEach((en) => { sticky.style.display = en.isIntersecting ? 'none' : ''; }), { threshold: 0 });
      if (anchor) io.observe(anchor);
    }
    initReveals();
  }

  function injectFichaSchema(c, d, pf) {
    const data = {
      '@context': 'https://schema.org', '@type': 'Course', name: c.titulo, description: c.resumen,
      provider: { '@type': 'EducationalOrganization', name: 'Instituto Instituto Kline' },
      offers: { '@type': 'Offer', price: String(pf), priceCurrency: 'ARS', category: 'Paid' },
    };
    if (d) data.instructor = { '@type': 'Person', name: d.nombre };
    const s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(data); document.head.appendChild(s);
  }

  /* ---------- PANEL ALUMNO ---------- */
  function initAlumno() {
    const root = document.getElementById('alumnoRoot');
    const render = () => {
      if (!Learning.isSessionActive()) { renderGate(root); return; }
      renderPanel(root);
    };
    document.addEventListener('learning:updated', render);
    render();
  }

  function renderGate(root) {
    root.innerHTML = '<div class="container"><div class="gate"><div class="panel-avatar">S</div><h1>Área de alumnos</h1><p>Entrá en modo demostración para ver cómo un alumno de Instituto Kline sigue sus cursos, su progreso y sus certificados.</p><button class="btn btn-primary" id="demoIn">Entrar como alumno demo</button><p style="margin-top:1rem;font-size:.82rem" class="muted">No se pide contraseña. Es una sesión de demostración.</p></div></div>';
    document.getElementById('demoIn').addEventListener('click', () => { Learning.startSession(); showToast('¡Bienvenido al aula demo!'); });
  }

  function renderPanel(root) {
    const st = Learning.get();
    const enrolled = st.enrolledCourseIds.map(getCursoById).filter(Boolean);
    const enProgreso = enrolled.filter((c) => { const p = Learning.progress(c.id); return p > 0 && p < 100; });
    const completados = enrolled.filter((c) => Learning.progress(c.id) === 100);
    const pendientes = enrolled.filter((c) => Learning.progress(c.id) === 0);

    const pcard = (c) => {
      const p = Learning.progress(c.id);
      const last = st.lastLessonByCourse[c.id];
      const clases = todasLasClases(c);
      const nextLesson = clases.find((cl) => !st.completedLessonIds.includes(cl.id));
      const target = last || (nextLesson && nextLesson.id) || (clases[0] && clases[0].id);
      const done = p === 100;
      return '<div class="pcourse"><img src="' + c.portada + '" alt="" width="120" height="78"><div class="pc-info"><h3>' + esc(c.titulo) + '</h3><div class="pc-bar"><b style="width:' + p + '%"></b></div><div class="pc-meta">' + p + '% completado · ' + clases.filter((cl) => st.completedLessonIds.includes(cl.id)).length + '/' + clases.length + ' clases</div></div><div class="pc-cta">' + (done ? '<span class="pc-done-badge">' + IC.check + 'Completado</span>' : '<a class="btn btn-primary" href="aula.html?curso=' + c.slug + (target ? '&clase=' + target : '') + '">' + (p > 0 ? 'Continuar' : 'Empezar') + '</a>') + '</div></div>';
    };

    let html = '<section class="panel-hero"><div class="container"><div class="panel-avatar">A</div><div class="panel-hi"><h1>¡Hola de nuevo!</h1><p>Este es tu espacio de aprendizaje en Instituto Kline.</p></div><span class="demo-tag">Modo demostración</span></div></section>';
    html += '<div class="container"><div class="panel-stats"><div class="pstat"><div class="n">' + enrolled.length + '</div><div class="l">Cursos inscriptos</div></div><div class="pstat"><div class="n">' + enProgreso.length + '</div><div class="l">En progreso</div></div><div class="pstat"><div class="n">' + completados.length + '</div><div class="l">Completados</div></div></div>';

    if (!enrolled.length) {
      html += '<div class="empty-state">' + IC.list + '<h3>Todavía no tenés cursos</h3><p>Explorá los programas y sumá el primero para verlo acá.</p><a class="btn btn-primary" href="index.html#cursos">Ver cursos</a></div>';
    } else {
      if (enProgreso.length || pendientes.length) {
        const activos = enProgreso.concat(pendientes);
        html += '<div class="panel-sec-head"><h2>Seguí aprendiendo</h2></div><div class="progress-list">' + activos.map(pcard).join('') + '</div>';
      }
      if (completados.length) html += '<div class="panel-sec-head"><h2>Completados</h2></div><div class="progress-list">' + completados.map(pcard).join('') + '</div>';
    }
    html += '<div class="panel-sec-head"><h2>Descubrí más</h2></div><div class="courses">' + CURSOS.filter((c) => !st.enrolledCourseIds.includes(c.id)).slice(0, 3).map(courseCard).join('') + '</div>';
    html += '<div style="text-align:center;margin:2.5rem 0"><button class="btn btn-ghost" id="resetDemo">Reiniciar demo</button></div></div>';
    root.innerHTML = html;

    wireAdds(root);
    document.getElementById('resetDemo').addEventListener('click', () => {
      if (confirm('¿Reiniciar la demostración? Se borran tu progreso y tu carrito de este demo.')) { Learning.reset(); showToast('Demo reiniciada'); }
    });
    initReveals();
  }

  /* ---------- AULA ---------- */
  function initAula() {
    const root = document.getElementById('aulaRoot');
    const params = new URLSearchParams(location.search);
    const c = getCurso(params.get('curso'));
    if (!c) { root.innerHTML = '<div class="aula-locked" style="margin:3rem auto;max-width:32rem">' + IC.lock + '<h2>Curso no encontrado</h2><p>Elegí un curso desde tu panel para entrar al aula.</p><a class="btn btn-primary" href="alumno.html">Ir a mi panel</a></div>'; return; }

    const clases = todasLasClases(c);
    let claseId = params.get('clase');
    let clase = clases.find((x) => x.id === claseId);
    if (!clase) { const st0 = Learning.get(); clase = clases.find((x) => x.id === st0.lastLessonByCourse[c.id]) || clases[0]; claseId = clase.id; }

    const enrolled = Learning.isEnrolled(c.id);
    const canView = enrolled || clase.preview;

    const idx = clases.findIndex((x) => x.id === claseId);
    const prev = clases[idx - 1];
    const next = clases[idx + 1];
    if (enrolled) Learning.setLastLesson(c.id, claseId);

    const sideMods = c.modulos.map((m) => {
      const lessons = m.clases.map((cl) => {
        const done = Learning.isLessonDone(cl.id);
        const active = cl.id === claseId;
        const locked = !enrolled && !cl.preview;
        return '<a class="aula-lesson' + (active ? ' active' : '') + (done ? ' done' : '') + '" href="aula.html?curso=' + c.slug + '&clase=' + cl.id + '"><span class="al-check">' + (done ? IC.check : '') + '</span><span class="al-title">' + esc(cl.titulo) + '</span>' + (locked ? '<span class="al-lock">' + IC.lock + '</span>' : '<span class="al-dur">' + esc(cl.duracion) + '</span>') + '</a>';
      }).join('');
      return '<div class="aula-mod-title">' + esc(m.titulo) + '</div>' + lessons;
    }).join('');

    const prog = Learning.progress(c.id);
    const mainInner = canView
      ? '<div class="player"><span class="p-demo">Modo demostración</span><div class="p-inner"><div class="p-play" id="playBtn" role="button" tabindex="0" aria-label="Reproducir clase">' + IC.play + '</div><div class="p-label">' + esc(clase.titulo) + '</div></div></div>' +
        '<div class="lesson-head"><div><h1>' + esc(clase.titulo) + '</h1><div class="lh-meta"><span>' + esc(clase.duracion) + '</span><span>' + esc(clase.tipo) + '</span></div></div></div>' +
        '<div class="aula-actions">' + (enrolled ? '<button class="btn btn-complete' + (Learning.isLessonDone(claseId) ? ' done' : '') + '" id="completeBtn">' + (Learning.isLessonDone(claseId) ? IC.check + 'Completada' : 'Marcar como completada') + '</button>' : '<span class="muted" style="font-size:.86rem">Vista previa gratuita · inscribite para acceder a todo el curso</span>') +
        '<div class="aula-nav"><a class="btn" id="prevBtn"' + (prev ? ' href="aula.html?curso=' + c.slug + '&clase=' + prev.id + '"' : ' aria-disabled="true"') + '>← Anterior</a><a class="btn" id="nextBtn"' + (next ? ' href="aula.html?curso=' + c.slug + '&clase=' + next.id + '"' : ' aria-disabled="true"') + '>Siguiente →</a></div></div>' +
        (enrolled ? '<div class="notes-box"><h3>' + IC.pencil + ' Tus notas</h3><textarea id="notes" placeholder="Anotá lo que no querés olvidarte de esta clase…">' + esc(Learning.getNote(claseId)) + '</textarea><div class="notes-saved" id="notesSaved"></div></div>' : '')
      : '<div class="aula-locked">' + IC.lock + '<h2>Esta clase es parte del curso completo</h2><p>Inscribite en «' + esc(c.titulo) + '» para desbloquear todas las clases, los materiales y tu certificado.</p><a class="btn btn-primary" href="curso.html?slug=' + c.slug + '">Ver el curso e inscribirme</a></div>';

    root.innerHTML =
      '<div class="aula-shell">' +
      '<aside class="aula-side" id="aulaSide"><div class="aula-side-head"><a class="brand" href="index.html" aria-label="Instituto Kline, inicio"><img class="brand-logo" src="images/logo.jpg" alt="Instituto Kline"></a><div class="course-name">' + esc(c.titulo) + '</div><div class="aula-prog"><div class="bar"><b style="width:' + prog + '%"></b></div><small>' + prog + '% completado</small></div></div><nav class="aula-modules" aria-label="Contenido del curso">' + sideMods + '</nav></aside>' +
      '<main class="aula-main"><div class="aula-topbar"><button class="icon-btn aula-menu-btn" id="aulaMenuBtn" aria-label="Abrir índice del curso"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button><a class="back-to-selector" href="../index.html">← Volver a elegir versión</a><a class="panel-link" href="alumno.html">Mi panel →</a></div>' + mainInner + '</main></div>';

    document.title = clase.titulo + ' — ' + c.titulo;

    const menuBtn = document.getElementById('aulaMenuBtn');
    const side = document.getElementById('aulaSide');
    menuBtn && menuBtn.addEventListener('click', () => side.classList.toggle('open'));
    side && side.querySelectorAll('.aula-lesson').forEach((a) => a.addEventListener('click', () => side.classList.remove('open')));

    const playBtn = document.getElementById('playBtn');
    playBtn && playBtn.addEventListener('click', () => showToast('La reproducción real se activa al pasar la plataforma a producción.'));
    playBtn && playBtn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showToast('La reproducción real se activa al pasar la plataforma a producción.'); } });

    const completeBtn = document.getElementById('completeBtn');
    completeBtn && completeBtn.addEventListener('click', () => {
      const nowDone = !Learning.isLessonDone(claseId);
      Learning.toggleLesson(claseId, nowDone);
      showToast(nowDone ? 'Clase completada ✓' : 'Clase marcada como pendiente');
      initAula();
    });

    const notes = document.getElementById('notes');
    if (notes) {
      let t;
      notes.addEventListener('input', () => {
        clearTimeout(t);
        t = setTimeout(() => { Learning.setNote(claseId, notes.value.trim()); const s = document.getElementById('notesSaved'); if (s) { s.textContent = 'Guardado ✓'; setTimeout(() => s.textContent = '', 1500); } }, 500);
      });
    }
    const active = side && side.querySelector('.aula-lesson.active');
    if (active) active.scrollIntoView({ block: 'center' });
  }

  /* ---------- boot ---------- */
  function boot() {
    initReveals(); initWspFloat(); initHeader(); initCartUI();
    const page = document.body.dataset.page;
    if (page === 'home') initHome();
    else if (page === 'curso') initCurso();
    else if (page === 'alumno') initAlumno();
    else if (page === 'aula') initAula();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
