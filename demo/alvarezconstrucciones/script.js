'use strict';

const WA = '5491165548507';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const waLink = texto => `https://wa.me/${WA}?text=${encodeURIComponent(texto)}`;
let revealsListos = false;

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span></span>';
  toast.querySelector('span').textContent = msg;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3400);
}

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.07, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
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

const refrescarScroll = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function initAntiCopia() {
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
      e.preventDefault();
    }
  });
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1025px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button:not(.nav-close)')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  if (!wsp) return;
  const sync = () => { if (window.scrollY > 600) wsp.classList.add('visible'); };
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

function trampaFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function crearDialogo(id, etiqueta) {
  document.body.insertAdjacentHTML('beforeend', `<div class="dlg-bd" id="${id}" hidden><div class="dlg" role="dialog" aria-modal="true" aria-label="${etiqueta}"><button type="button" class="icon-btn dlg-close" aria-label="Cerrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button><div class="dlg-cuerpo"></div></div></div>`);
  const bd = document.getElementById(id);
  const dlg = $('.dlg', bd);
  const cuerpo = $('.dlg-cuerpo', bd);
  let opener = null;
  const cerrar = () => {
    bd.classList.remove('open');
    bd.hidden = true;
    document.body.classList.remove('no-scroll');
    opener?.focus?.();
  };
  const abrir = html => {
    if (bd.hidden) opener = document.activeElement;
    cuerpo.innerHTML = html;
    bd.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => bd.classList.add('open')));
    dlg.scrollTop = 0;
    $('.dlg-close', bd).focus();
  };
  bd.addEventListener('click', e => { if (e.target === bd) cerrar(); });
  $('.dlg-close', bd).addEventListener('click', cerrar);
  bd.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); trampaFoco(dlg, e); });
  return { abrir, cerrar, bd, dlg, cuerpo };
}

function irAPresupuesto(servicio) {
  const form = document.getElementById('presupuesto');
  if (!form) return;
  if (servicio) {
    const chk = form.querySelector(`input[name="servicio"][value="${window.CSS.escape(servicio)}"]`);
    if (chk && !chk.checked) { chk.checked = true; chk.dispatchEvent(new Event('change', { bubbles: true })); }
  }
  form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  setTimeout(() => form.querySelector('textarea, input[type="text"]')?.focus({ preventScroll: true }), reduceMotion ? 0 : 700);
}

function initServiciosModal() {
  const tiles = $$('[data-srv-abrir]');
  if (!tiles.length) return;
  const d = crearDialogo('dlg-servicio', 'Detalle del servicio');
  d.dlg.classList.add('dlg--servicio');
  tiles.forEach(t => t.addEventListener('click', e => {
    e.preventDefault();
    const tpl = document.getElementById(`tpl-${t.dataset.srvAbrir}`);
    if (tpl) d.abrir(tpl.innerHTML);
  }));
  d.cuerpo.addEventListener('click', e => {
    const b = e.target.closest('[data-presupuesto]');
    if (!b) return;
    e.preventDefault();
    d.cerrar();
    irAPresupuesto(b.dataset.presupuesto);
  });
}

function initPedidoLinks() {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-presupuesto]');
    if (!b || b.closest('.dlg')) return;
    e.preventDefault();
    irAPresupuesto(b.dataset.presupuesto);
  });
}

function initTabs() {
  const sec = document.querySelector('[data-tabs]');
  if (!sec) return;
  const tabs = $$('[role="tab"]', sec);
  const lista = $('[role="tablist"]', sec);
  const elegir = (tab, foco = false) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) {
        panel.hidden = !on;
        if (on) { panel.classList.remove('entra'); void panel.offsetWidth; panel.classList.add('entra'); }
      }
    });
    if (foco) tab.focus();
    const izq = tab.offsetLeft - lista.clientWidth / 2 + tab.offsetWidth / 2;
    lista.scrollTo({ left: Math.max(0, izq), behavior: reduceMotion ? 'auto' : 'smooth' });
    refrescarScroll();
  };
  tabs.forEach(t => t.addEventListener('click', () => elegir(t)));
  lista.addEventListener('keydown', e => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let n = null;
    if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
    if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
    if (e.key === 'Home') n = tabs[0];
    if (e.key === 'End') n = tabs[tabs.length - 1];
    if (n) { e.preventDefault(); elegir(n, true); }
  });
  $$('[data-ir-tab]').forEach(a => a.addEventListener('click', e => {
    const tab = document.getElementById(`tab-${a.dataset.irTab}`);
    if (!tab) return;
    e.preventDefault();
    elegir(tab);
    sec.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }));
}

function initGaleria() {
  const sec = document.querySelector('[data-galeria]');
  if (!sec) return;
  const items = $$('[data-foto]', sec);
  const filtros = $$('[data-filtro]', sec);
  const d = crearDialogo('dlg-visor', 'Visor de fotos');
  d.dlg.classList.add('dlg--visor');
  let visibles = items;
  let actual = 0;
  const pintar = () => {
    const it = visibles[actual];
    d.cuerpo.innerHTML = `<figure class="visor"><img src="${it.dataset.foto}" alt="${it.querySelector('img').alt}" width="1100" height="1100"><figcaption><strong>${it.dataset.titulo}</strong><span>${actual + 1} / ${visibles.length}</span></figcaption></figure>
      <button type="button" class="visor-nav visor-nav--prev" data-visor="-1" aria-label="Foto anterior"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>
      <button type="button" class="visor-nav visor-nav--next" data-visor="1" aria-label="Foto siguiente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>`;
  };
  const mover = paso => { actual = (actual + paso + visibles.length) % visibles.length; pintar(); };
  items.forEach(it => it.addEventListener('click', e => {
    e.preventDefault();
    actual = Math.max(0, visibles.indexOf(it));
    d.abrir('');
    pintar();
    $('.dlg-close', d.bd).focus();
  }));
  d.cuerpo.addEventListener('click', e => {
    const b = e.target.closest('[data-visor]');
    if (b) mover(Number(b.dataset.visor));
  });
  d.bd.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') mover(1);
    if (e.key === 'ArrowLeft') mover(-1);
  });
  filtros.forEach(f => f.addEventListener('click', () => {
    filtros.forEach(x => x.setAttribute('aria-pressed', String(x === f)));
    const cat = f.dataset.filtro;
    items.forEach(it => {
      const ok = !cat || it.dataset.cat.split(' ').includes(cat);
      it.parentElement.hidden = !ok;
      if (ok) it.parentElement.classList.remove('in');
    });
    visibles = items.filter(it => !it.parentElement.hidden);
    sec.querySelector('[data-galeria-grid]')?.classList.toggle('filtrada', !!cat);
    revelarNuevos(sec);
    refrescarScroll();
  }));
}

function initRail() {
  const rail = document.querySelector('[data-rail]');
  if (!rail) return;
  const prev = $('[data-rail-prev]');
  const next = $('[data-rail-next]');
  let down = false, x0 = 0, s0 = 0, movido = false;
  rail.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    down = true; movido = false; x0 = e.clientX; s0 = rail.scrollLeft;
  });
  rail.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 6 && !movido) { movido = true; rail.classList.add('arrastrando'); try { rail.setPointerCapture(e.pointerId); } catch { /* sin captura */ } }
    if (movido) rail.scrollLeft = s0 - dx;
  });
  const soltar = e => {
    if (!down) return;
    down = false;
    rail.classList.remove('arrastrando');
    try { rail.releasePointerCapture(e.pointerId); } catch { /* sin captura */ }
  };
  rail.addEventListener('pointerup', soltar);
  rail.addEventListener('pointercancel', soltar);
  rail.addEventListener('click', e => { if (movido) { e.preventDefault(); e.stopImmediatePropagation(); movido = false; } }, true);
  const paso = () => (rail.querySelector('li')?.getBoundingClientRect().width || 300) + 16;
  const estado = () => {
    const pad = parseFloat(getComputedStyle(rail).paddingInlineStart) || 0;
    if (prev) prev.disabled = rail.scrollLeft <= pad + 2;
    if (next) next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
  };
  prev?.addEventListener('click', () => rail.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => rail.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  rail.addEventListener('scroll', estado, { passive: true });
  window.addEventListener('resize', estado, { passive: true });
  estado();
}

function initPresupuesto() {
  const form = document.getElementById('presupuesto');
  if (!form) return;
  const vista = $('[data-vista]', form.closest('section') || document);
  const valor = n => (form.elements[n]?.value || '').trim();
  const texto = () => {
    const servicios = $$('input[name="servicio"]:checked', form).map(i => i.value);
    const lugar = $('input[name="lugar"]:checked', form)?.value || '';
    const lineas = ['Hola! Quiero pedir un presupuesto a Alvarez construcciones.'];
    if (servicios.length) lineas.push(`Trabajo: ${servicios.join(', ')}.`);
    if (lugar) lineas.push(`Lugar: ${lugar}.`);
    if (valor('zona')) lineas.push(`Zona: ${valor('zona')}.`);
    if (valor('detalle')) lineas.push(valor('detalle'));
    if (valor('nombre')) lineas.push(`Soy ${valor('nombre')}.`);
    return lineas.join('\n');
  };
  const pintar = () => {
    if (vista) vista.textContent = texto();
    $('[data-enviar-wsp]', form).href = waLink(texto());
  };
  form.addEventListener('input', pintar);
  form.addEventListener('change', e => {
    if (e.target.name === 'servicio') form.querySelector('.chips-srv')?.classList.remove('falta');
    pintar();
  });
  $('[data-enviar-wsp]', form).addEventListener('click', e => {
    const servicios = $$('input[name="servicio"]:checked', form);
    if (!servicios.length) {
      e.preventDefault();
      form.querySelector('.chips-srv')?.classList.add('falta');
      form.querySelector('input[name="servicio"]')?.focus();
      showToast('Elegí al menos un trabajo para armar el mensaje.');
      return;
    }
    showToast('Abrimos WhatsApp con tu pedido listo para enviar.');
  });
  form.addEventListener('submit', e => { e.preventDefault(); $('[data-enviar-wsp]', form).click(); });
  pintar();
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.09, duration: 1.8 }, 0);
  const tapa = hero.querySelector('.hero-foto-tapa');
  if (tapa) tl.fromTo(tapa, { scaleY: 1 }, { scaleY: 0, duration: 1.1, ease: 'power3.inOut' }, 0);
  tl.from(hero.querySelectorAll('.eyebrow'), { y: 16, opacity: 0, duration: 0.9 }, 0.15)
    .from(hero.querySelectorAll('h1 .h1-linea'), { y: 40, opacity: 0, duration: 1.1, stagger: 0.12 }, 0.25)
    .from(hero.querySelectorAll('.hero-sub, .hero-lead'), { y: 22, opacity: 0, duration: 1, stagger: 0.1 }, 0.5)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.65)
    .from(hero.querySelectorAll('.sello-garantia, .hero-panel'), { y: 18, opacity: 0, duration: 0.9, stagger: 0.1, clearProps: 'transform,opacity' }, 0.85);
  if (typeof ScrollTrigger !== 'undefined') {
    const foto = hero.querySelector('[data-parallax]');
    if (foto) gsap.to(foto, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
}

function iniciar() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
  initAntiCopia();
  initModelBarScroll();
  initNav();
  initServiciosModal();
  initPedidoLinks();
  initTabs();
  initGaleria();
  initRail();
  initPresupuesto();
  initFloats();
  initHeroMotion();
  initReveals();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
else iniciar();
