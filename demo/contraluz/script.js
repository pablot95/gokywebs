/* global WHATSAPP, CATEGORIAS, OBRAS, FORMAS, FAQS */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const precio = (n) => '$' + Math.round(n).toLocaleString('es-AR');
  const wa = (msg) => 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg);

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
  }
  if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  function showToast(msg) {
    let wrap = document.querySelector('.toast-wrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg><span>' + esc(msg) + '</span>';
    wrap.appendChild(toast);
    setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 240); }, 3200);
  }

  function initReveals() {
    const els = document.querySelectorAll('[data-animate],[data-animate-stagger]');
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'));
      document.querySelectorAll('.obra-card').forEach((c) => c.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        if (el.hasAttribute('data-animate-stagger')) {
          [...el.children].forEach((ch, i) => { ch.style.transitionDelay = (i * 0.08) + 's'; });
        }
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
  }

  const cardsIO = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      cardsIO.unobserve(en.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }) : null;

  const iconVideo = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

  function cardHTML(o, i) {
    const tag = o.tipo === 'video'
      ? '<span class="obra-tag">' + iconVideo + 'Video · ' + esc(o.duracion) + '</span>'
      : '';
    return '<button type="button" class="obra-card" data-id="' + o.id + '" style="transition-delay:' + (Math.min(i, 7) * 0.06).toFixed(2) + 's" aria-label="Ver ' + esc(o.titulo) + '">'
      + '<span class="obra-media">'
      + '<img src="' + esc(o.img) + '" width="1200" height="1500" alt="' + esc(o.titulo) + ', ' + esc(o.lugar) + ', ' + o.anio + '" loading="lazy" decoding="async">'
      + '<span class="framemark tl"></span><span class="framemark tr"></span><span class="framemark bl"></span><span class="framemark br"></span>'
      + '</span>'
      + tag
      + '<span class="obra-cap"><b>' + esc(o.titulo) + '</b><span>' + esc(o.lugar) + ' · ' + o.anio + '</span></span>'
      + '</button>';
  }

  function pintarObra(cat) {
    const grid = document.getElementById('obraGrid');
    const vacio = document.getElementById('obraVacio');
    const info = document.getElementById('filtrosInfo');
    if (!grid) return;
    const lista = cat === 'todo' ? OBRAS : OBRAS.filter((o) => o.categoria === cat);
    grid.innerHTML = lista.map(cardHTML).join('');
    vacio.hidden = lista.length > 0;
    const nombre = CATEGORIAS.find((c) => c.id === cat)?.nombre || 'Todo';
    info.textContent = lista.length
      ? lista.length + (lista.length === 1 ? ' pieza' : ' piezas') + (cat === 'todo' ? ' en total' : ' en ' + nombre.toLowerCase())
      : '';
    document.querySelectorAll('#filtros .chip').forEach((b) => {
      const on = b.dataset.cat === cat;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    grid.querySelectorAll('.obra-card').forEach((c) => {
      if (reduce || !cardsIO) c.classList.add('in'); else cardsIO.observe(c);
    });
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }

  function initObra() {
    const cont = document.getElementById('filtros');
    if (!cont) return;
    cont.innerHTML = CATEGORIAS.map((c) =>
      '<button type="button" class="chip" data-cat="' + c.id + '" aria-pressed="false">' + esc(c.nombre) + '</button>'
    ).join('');
    cont.addEventListener('click', (e) => {
      const b = e.target.closest('.chip');
      if (b) pintarObra(b.dataset.cat);
    });
    const vacio = document.getElementById('obraVacio');
    vacio && vacio.addEventListener('click', (e) => {
      const b = e.target.closest('[data-cat]');
      if (b) pintarObra(b.dataset.cat);
    });
    document.getElementById('obraGrid').addEventListener('click', (e) => {
      const card = e.target.closest('.obra-card');
      if (card) abrirModal(Number(card.dataset.id));
    });
    pintarObra('todo');
  }

  function initFormas() {
    const grid = document.getElementById('formasGrid');
    if (!grid) return;
    const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
    grid.innerHTML = FORMAS.map((f, i) =>
      '<article class="forma' + (f.destacado ? ' destacada' : '') + '" data-animate style="opacity:0;transform:translateY(24px);transition-delay:' + (i * 0.08).toFixed(2) + 's">'
      + (f.destacado ? '<span class="forma-flag">La más elegida</span>' : '')
      + '<h3>' + esc(f.nombre) + '</h3>'
      + '<p class="forma-precio"><small>Desde</small><b>' + precio(f.desde) + '</b></p>'
      + '<p class="forma-det">' + esc(f.detalle) + '</p>'
      + '<ul>' + f.incluye.map((x) => '<li>' + check + '<span>' + esc(x) + '</span></li>').join('') + '</ul>'
      + '<a class="btn ' + (f.destacado ? 'btn-wa' : 'btn-primary') + '" href="' + wa('Hola Contraluz, me interesa la opción "' + f.nombre + '". ¿Me pasás más info?') + '" target="_blank" rel="noopener">Consultar</a>'
      + '</article>'
    ).join('');
  }

  function initFaq() {
    const cont = document.getElementById('accFaq');
    if (!cont) return;
    cont.innerHTML = FAQS.map((f, i) =>
      '<details class="acc-item" data-animate style="opacity:0;transform:translateY(24px);transition-delay:' + (Math.min(i, 5) * 0.05).toFixed(2) + 's">'
      + '<summary>' + esc(f.q) + '<span class="acc-plus" aria-hidden="true"></span></summary>'
      + '<p>' + esc(f.a) + '</p></details>'
    ).join('');
  }

  let modalPrev = null;

  function abrirModal(id) {
    const o = OBRAS.find((x) => x.id === id);
    if (!o) return;
    const modal = document.getElementById('modal');
    modalPrev = document.activeElement;
    const media = document.getElementById('modalMedia');
    media.innerHTML = o.tipo === 'video'
      ? '<video src="' + esc(o.video) + '" poster="' + esc(o.img) + '" controls autoplay muted loop playsinline width="1280" height="720"></video>'
      : '<img src="' + esc(o.img) + '" width="1200" height="1500" alt="' + esc(o.titulo) + '" decoding="async">';
    document.getElementById('modalCat').textContent = (CATEGORIAS.find((c) => c.id === o.categoria)?.nombre || '') + ' · ' + o.anio;
    document.getElementById('modalTitulo').textContent = o.titulo;
    document.getElementById('modalMeta').textContent = o.lugar + ' · ' + o.tecnica;
    document.getElementById('modalDesc').textContent = o.descripcion;
    document.getElementById('modalFormatos').textContent = 'Disponible como: ' + o.formatos;
    document.getElementById('modalWsp').href = wa('Hola Contraluz, me interesa "' + o.titulo + '" (' + o.lugar + ', ' + o.anio + '). ¿Me pasás tamaños y precios?');
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    document.getElementById('modalClose').focus();
  }

  function cerrarModal() {
    const modal = document.getElementById('modal');
    if (!modal || modal.hidden) return;
    const v = modal.querySelector('video');
    if (v) v.pause();
    modal.hidden = true;
    document.getElementById('modalMedia').innerHTML = '';
    document.body.classList.remove('no-scroll');
    if (modalPrev) modalPrev.focus();
  }

  function initModal() {
    const modal = document.getElementById('modal');
    if (!modal) return;
    document.getElementById('modalClose').addEventListener('click', cerrarModal);
    modal.querySelector('[data-close]').addEventListener('click', cerrarModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) { cerrarModal(); return; }
      if (e.key !== 'Tab' || modal.hidden) return;
      const foco = modal.querySelectorAll('button, a[href], video[controls]');
      if (!foco.length) return;
      const primero = foco[0];
      const ultimo = foco[foco.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    });
  }

  function initNav() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');
    const closeBtn = document.getElementById('navClose');
    if (toggle && nav) {
      let bd = document.querySelector('.nav-backdrop');
      if (!bd) {
        bd = document.createElement('div');
        bd.className = 'nav-backdrop';
        (document.querySelector('.site-header') || document.body).appendChild(bd);
      }
      const close = () => {
        nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
        toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
      };
      const open = () => {
        nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
        toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
        const a = nav.querySelector('a'); a && a.focus();
      };
      toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
      closeBtn && closeBtn.addEventListener('click', () => { close(); toggle.focus(); });
      bd.addEventListener('click', close);
      nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); }
      });
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

  function initHeroParallax() {
    const scene = document.querySelector('.hero-scene');
    if (!scene || reduce || window.matchMedia('(hover: none)').matches) return;
    const capas = scene.querySelectorAll('.layer');
    scene.addEventListener('pointermove', (e) => {
      const r = scene.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      capas.forEach((c) => {
        const d = Number(c.dataset.depth || 10);
        c.style.translate = (-x * d).toFixed(1) + 'px ' + (-y * d).toFixed(1) + 'px';
      });
    });
    scene.addEventListener('pointerleave', () => {
      capas.forEach((c) => { c.style.translate = '0px 0px'; });
    });
  }

  const CHAPTER_BEATS = [
    { modo: 'FOTO', data: '35 mm · f/1.8 · ISO 400', titulo: 'Del fotograma al movimiento.', texto: 'La misma escena, decidida en el mismo momento. Una la vas a colgar; la otra va a abrir tu video.' },
    { modo: 'FOTO', data: '35 mm · f/1.8 · ISO 400', titulo: 'Primero se abre el cuadro.', texto: 'La foto es 4:5 y el video es 16:9. Mismo encuadre, distinta respiración: lo que en papel es tensión, en pantalla es aire.' },
    { modo: 'REC', data: '4K · 25 fps · 1/50', titulo: 'Y entonces se mueve.', texto: 'Filmo a cien cuadros por segundo y lo bajo a veinticinco. Por eso el humo parece pensar antes de subir.' },
    { modo: 'FOTO', data: '35 mm · f/1.8 · ISO 400', titulo: 'Y vuelve a ser una foto.', texto: 'Podés llevarte la quieta, la que se mueve, o las dos. La decisión es tuya; el encuadre ya está tomado.' },
  ];

  function initChapter() {
    const chapter = document.getElementById('movimiento');
    if (!chapter) return;
    const media = chapter.querySelector('.chapter-media');
    const video = document.getElementById('chapterVideo');
    const barT = chapter.querySelector('.bar-top');
    const barB = chapter.querySelector('.bar-bottom');
    const steps = [...chapter.querySelectorAll('.chapter-steps li')];
    const hudMode = document.getElementById('hudMode');
    const hudData = document.getElementById('hudData');
    const hudTc = document.getElementById('hudTc');
    const titulo = document.getElementById('chapterTitle');
    const texto = document.getElementById('chapterText');
    let beatActual = -1;

    const pintarBeat = (i) => {
      if (i === beatActual) return;
      beatActual = i;
      const b = CHAPTER_BEATS[i];
      if (!b) return;
      hudMode.textContent = b.modo;
      hudData.textContent = b.data;
      titulo.textContent = b.titulo;
      texto.textContent = b.texto;
      steps.forEach((s, n) => s.classList.toggle('is-on', n === i));
      const enMovimiento = i === 2;
      media.classList.toggle('is-motion', enMovimiento);
      if (enMovimiento) {
        const p = video.play();
        if (p && p.catch) p.catch(() => {});
      } else {
        video.pause();
      }
    };

    const estatico = () => {
      chapter.classList.add('is-static');
      pintarBeat(2);
      video.setAttribute('preload', 'metadata');
      video.setAttribute('controls', '');
      barT.style.height = '0px';
      barB.style.height = '0px';
    };

    if (reduce || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') { estatico(); return; }

    const mm = gsap.matchMedia();

    mm.add('(min-width: 901px)', () => {
      const st = ScrollTrigger.create({
        trigger: chapter,
        start: 'top top',
        end: '+=260%',
        pin: chapter.querySelector('.chapter-sticky'),
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          const i = p < 0.24 ? 0 : p < 0.46 ? 1 : p < 0.82 ? 2 : 3;
          pintarBeat(i);
          const apertura = Math.min(1, Math.max(0, (p - 0.24) / 0.22));
          const cierre = Math.min(1, Math.max(0, (p - 0.82) / 0.18));
          const barra = (apertura - cierre) * 11;
          barT.style.height = barra.toFixed(2) + '%';
          barB.style.height = barra.toFixed(2) + '%';
          if (!video.paused && video.duration) {
            const t = video.currentTime;
            const cs = Math.floor((t % 1) * 100);
            hudTc.textContent = '00:' + String(Math.floor(t)).padStart(2, '0') + ':' + String(cs).padStart(2, '0');
          }
        },
      });
      video.setAttribute('preload', 'metadata');
      return () => { st.kill(); video.pause(); };
    });

    mm.add('(max-width: 900px)', () => {
      estatico();
      return () => { chapter.classList.remove('is-static'); video.removeAttribute('controls'); };
    });
  }

  function initWspFloat() {
    const btn = document.getElementById('wsp-float');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
  }

  function initWspLinks() {
    const generico = wa('Hola Contraluz, vi tu portfolio y quiero consultar por una obra.');
    ['wsp-float', 'ctaFinal', 'footWsp'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.href = generico;
    });
    const cta = document.getElementById('ctaFinal');
    if (cta) cta.addEventListener('click', () => showToast('Te llevamos a WhatsApp para escribirle al autor.'));
  }

  function initDevToolsGuard() {
    let overlay = null;
    let open = false;
    window.setInterval(() => {
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
      } else if (overlay) {
        overlay.classList.remove('visible');
      }
    }, 800);
  }

  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('dragstart', (e) => e.preventDefault());
  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
      e.preventDefault();
    }
  });

  function boot() {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
    initObra();
    initFormas();
    initFaq();
    initModal();
    initNav();
    initReveals();
    initHeroParallax();
    initChapter();
    initWspFloat();
    initWspLinks();
    initDevToolsGuard();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
