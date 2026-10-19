const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA_NUMERO = '5492974126345';
const ZONA = 'America/Argentina/Salta';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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

function waLink(texto) {
  return `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(texto)}`;
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

function fechaDeHoy() {
  try {
    const partes = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: ZONA }).formatToParts(new Date());
    const v = t => partes.find(p => p.type === t)?.value || '';
    return { dia: v('weekday'), num: v('day'), mes: v('month') };
  } catch {
    return null;
  }
}

function initHoy() {
  const f = fechaDeHoy();
  if (!f) return;
  const largo = `${f.dia} ${f.num} de ${f.mes}`;
  document.querySelectorAll('[data-hoy]').forEach(el => {
    const tipo = el.dataset.hoy;
    if (tipo === 'aviso') el.textContent = `Subido hoy, ${largo}`;
    else if (tipo === 'corto') el.textContent = `Hoy · ${f.dia.slice(0, 3)} ${f.num} ${f.mes.slice(0, 3)}`;
    else el.textContent = largo.charAt(0).toUpperCase() + largo.slice(1);
  });
}

function datosFlyers() {
  return [...document.querySelectorAll('.flyer[data-flyer]')].map(li => ({
    li,
    id: li.dataset.flyer,
    titulo: li.querySelector('h3')?.textContent.trim() || '',
    operadora: li.querySelector('.flyer-op > span')?.textContent.trim() || '',
    resumen: li.dataset.resumen || '',
    foto: li.dataset.foto || '',
    corto: li.dataset.corto || '',
    img: `images/flyer-${li.dataset.flyer}.webp`,
    chica: `images/flyer-${li.dataset.flyer}-chica.webp`,
    alt: li.querySelector('.flyer-img img')?.alt || '',
    wa: li.querySelector('.flyer-info a')?.href || waLink('Hola! Quiero consultar por una oferta de hoy.')
  }));
}

const Visor = {
  lista: [],
  i: 0,
  opener: null,
  dlg: null,
  init(lista) {
    this.dlg = document.getElementById('visor');
    if (!this.dlg || !lista.length) return;
    this.lista = lista;
    const d = this.dlg;
    d.querySelector('#visorCerrar')?.addEventListener('click', () => this.cerrar());
    d.querySelector('#visorPrev')?.addEventListener('click', () => this.mover(-1));
    d.querySelector('#visorNext')?.addEventListener('click', () => this.mover(1));
    d.addEventListener('click', e => { if (e.target === d) this.cerrar(); });
    d.addEventListener('cancel', e => { e.preventDefault(); this.cerrar(); });
    d.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); this.mover(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); this.mover(-1); }
    });
    const fig = d.querySelector('.visor-fig');
    let x0 = null;
    fig?.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    fig?.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 48) this.mover(dx < 0 ? 1 : -1);
    });
  },
  visibles() {
    const v = this.lista.filter(f => !f.li.hidden);
    return v.length ? v : this.lista;
  },
  pintar() {
    const vis = this.visibles();
    const f = vis[this.i];
    if (!f) return;
    const d = this.dlg;
    const img = d.querySelector('#visorImg');
    img.src = f.img;
    img.alt = f.alt;
    d.querySelector('#visorOp').textContent = f.operadora;
    d.querySelector('#visorTit').textContent = f.titulo;
    d.querySelector('#visorRes').textContent = f.resumen;
    d.querySelector('#visorWa').href = f.wa;
    d.querySelector('#visorCuenta').textContent = `${this.i + 1} / ${vis.length}`;
    const sig = vis[(this.i + 1) % vis.length];
    if (sig) document.createElement('img').src = sig.img;
  },
  abrir(id, opener) {
    if (!this.dlg) return;
    const vis = this.visibles();
    const k = vis.findIndex(f => f.id === id);
    this.i = k < 0 ? 0 : k;
    this.opener = opener || null;
    this.pintar();
    if (typeof this.dlg.showModal === 'function') this.dlg.showModal(); else this.dlg.setAttribute('open', '');
    document.body.classList.add('no-scroll');
    document.dispatchEvent(new CustomEvent('visor:abierto'));
    this.dlg.querySelector('.visor-caja')?.scrollTo(0, 0);
    this.dlg.querySelector('#visorCerrar')?.focus({ preventScroll: true });
  },
  cerrar() {
    if (!this.dlg) return;
    if (typeof this.dlg.close === 'function') this.dlg.close(); else this.dlg.removeAttribute('open');
    document.body.classList.remove('no-scroll');
    document.dispatchEvent(new CustomEvent('visor:cerrado'));
    this.opener?.focus();
  },
  mover(paso) {
    const n = this.visibles().length;
    this.i = (this.i + paso + n) % n;
    this.pintar();
  }
};

function initFlyers() {
  const lista = datosFlyers();
  if (!lista.length) return;
  Visor.init(lista);
  lista.forEach(f => {
    f.li.querySelector('.flyer-ver')?.addEventListener('click', e => Visor.abrir(f.id, e.currentTarget));
  });

  const chips = [...document.querySelectorAll('.chip[data-filtro]')];
  const cuenta = document.querySelectorAll('[data-cuenta]');
  const vacio = document.querySelector('[data-vacio]');
  cuenta.forEach(el => { el.textContent = lista.length; });
  chips.forEach(chip => chip.addEventListener('click', () => {
    const filtro = chip.dataset.filtro;
    chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
    let n = 0;
    lista.forEach(f => {
      const ok = filtro === 'todas' || (f.li.dataset.tipos || '').split(' ').includes(filtro);
      f.li.hidden = !ok;
      if (ok) n++;
    });
    if (vacio) vacio.hidden = n > 0;
    const vp = document.querySelector('.hscroll');
    if (vp) { vp.scrollLeft = 0; vp.dispatchEvent(new CustomEvent('scroll')); }
    refrescar();
  }));
}

function intentar(fn) {
  try { fn(); return true; } catch { return false; }
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      intentar(() => vp.setPointerCapture?.(pointerId));
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      intentar(() => vp.releasePointerCapture?.(pointerId));
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initRail() {
  const vp = document.querySelector('.hscroll');
  if (!vp) return;
  const track = vp.querySelector('.flyers-rail');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail="prev"]');
  const next = document.querySelector('[data-rail="next"]');
  const paso = () => {
    const card = track?.querySelector('.flyer:not([hidden])');
    return card ? card.getBoundingClientRect().width + 20 : 320;
  };
  const sync = () => {
    if (!prev || !next || !track) return;
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initPlayer() {
  const player = document.getElementById('player');
  if (!player) return;
  const lista = datosFlyers();
  if (!lista.length) return;
  const barras = player.querySelector('.player-barras');
  const img = player.querySelector('#playerImg');
  const tit = player.querySelector('#playerTit');
  const op = player.querySelector('#playerOp');
  const wa = player.querySelector('#playerWa');
  const ver = player.querySelector('.player-flyer');
  const pausa = player.querySelector('.player-pausa');
  const circulos = document.querySelector('[data-destacadas]');
  const MS = 5200;
  player.style.setProperty('--player-ms', `${MS}ms`);
  barras.innerHTML = lista.map(() => '<span class="player-barra"><i></i></span>').join('');
  const bars = [...barras.children];
  if (circulos) {
    circulos.insertAdjacentHTML('beforeend', lista.map((f, k) => `<button type="button" class="destacada" data-k="${k}" aria-label="Ver el flyer ${esc(f.titulo)}"><span class="destacada-aro"><img src="${esc(f.foto)}" width="64" height="64" alt=""></span>${esc(f.corto)}</button>`).join(''));
  }
  let i = 0;
  let pausadoUsuario = reduceMotion;
  let pausadoSistema = false;
  const estado = () => {
    const p = pausadoUsuario || pausadoSistema;
    player.classList.toggle('pausado', p);
    if (pausa) {
      pausa.setAttribute('aria-pressed', String(pausadoUsuario));
      pausa.setAttribute('aria-label', pausadoUsuario ? 'Reanudar los flyers' : 'Pausar los flyers');
      pausa.querySelector('[data-icono="pausa"]')?.toggleAttribute('hidden', pausadoUsuario);
      pausa.querySelector('[data-icono="play"]')?.toggleAttribute('hidden', !pausadoUsuario);
    }
  };
  const ir = k => {
    i = (k + lista.length) % lista.length;
    const f = lista[i];
    bars.forEach((b, n) => {
      b.classList.toggle('vista', n < i);
      b.classList.remove('actual');
    });
    void bars[i].offsetWidth;
    bars[i].classList.add('actual');
    if (img.getAttribute('src') !== f.chica) {
      img.classList.add('cambiando');
      setTimeout(() => {
        img.src = f.chica;
        img.srcset = `${f.chica} 540w, ${f.img} 1080w`;
        img.alt = f.alt;
        img.classList.remove('cambiando');
      }, reduceMotion ? 0 : 220);
    }
    if (tit) tit.textContent = f.titulo;
    if (op) op.textContent = f.operadora;
    if (wa) wa.href = f.wa;
    ver?.setAttribute('aria-label', `Ver en grande el flyer ${f.titulo}`);
    circulos?.querySelectorAll('button.destacada').forEach(c => c.classList.toggle('activa', Number(c.dataset.k) === i));
  };
  bars.forEach(b => b.querySelector('i').addEventListener('animationend', () => {
    if (b.classList.contains('actual') && !reduceMotion) ir(i + 1);
  }));
  circulos?.addEventListener('click', e => {
    const b = e.target.closest('button.destacada');
    if (!b) return;
    ir(Number(b.dataset.k));
  });
  ver?.addEventListener('click', e => Visor.abrir(lista[i].id, e.currentTarget));
  pausa?.addEventListener('click', () => { pausadoUsuario = !pausadoUsuario; estado(); });
  player.addEventListener('mouseenter', () => { pausadoSistema = true; estado(); });
  player.addEventListener('mouseleave', () => { pausadoSistema = false; estado(); });
  document.addEventListener('visor:abierto', () => { pausadoSistema = true; estado(); });
  document.addEventListener('visor:cerrado', () => { pausadoSistema = false; estado(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => {
      player.classList.toggle('fuera', !en.isIntersecting);
      if (!en.isIntersecting) { pausadoSistema = true; estado(); }
      else if (!document.querySelector('#visor[open]') && !player.matches(':hover')) { pausadoSistema = false; estado(); }
    }).observe(player);
  }
  ir(0);
  estado();
}

function initTabs() {
  const lista = document.querySelector('.tabs[role="tablist"]');
  if (!lista) return;
  const tabs = [...lista.querySelectorAll('[role="tab"]')];
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !on;
      if (on) {
        panel.classList.remove('entra');
        void panel.offsetWidth;
        panel.classList.add('entra');
      }
    });
    if (foco) tab.focus();
    refrescar();
  };
  tabs.forEach((t, k) => {
    t.addEventListener('click', () => activar(t, false));
    t.addEventListener('keydown', e => {
      let n = null;
      if (e.key === 'ArrowRight') n = (k + 1) % tabs.length;
      if (e.key === 'ArrowLeft') n = (k - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') n = 0;
      if (e.key === 'End') n = tabs.length - 1;
      if (n !== null) { e.preventDefault(); activar(tabs[n], true); }
    });
  });
}

function initConsulta() {
  const form = document.getElementById('consultaForm');
  if (!form) return;
  const destino = form.elements.destino;
  const err = document.getElementById('err-destino');
  const btn = form.querySelector('button[type="submit"]');
  const textoBtn = btn?.innerHTML;
  const limpiar = () => { destino.removeAttribute('aria-invalid'); if (err) err.textContent = ''; };
  destino.addEventListener('input', limpiar);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = destino.value.trim();
    if (d.length < 2) {
      destino.setAttribute('aria-invalid', 'true');
      if (err) err.textContent = 'Contanos a dónde querés ir, aunque sea una idea.';
      destino.focus();
      return;
    }
    limpiar();
    const cuando = form.elements.cuando.value.trim();
    const partes = [
      `Hola! Quiero viajar a ${d}`,
      cuando ? `en ${cuando}` : '',
      `(${form.elements.viajeros.value}, saliendo desde ${form.elements.salida.value}).`,
      `Me interesa: ${form.elements.servicio.value}. ¿Me pasan opciones?`
    ].filter(Boolean);
    window.open(waLink(partes.join(' ')), '_blank', 'noopener');
    if (btn) { btn.disabled = true; btn.textContent = 'Abriendo WhatsApp…'; }
    showToast('¡Listo! Te abrimos WhatsApp con tu consulta escrita.');
    setTimeout(() => { if (btn) { btn.disabled = false; btn.innerHTML = textoBtn; } form.reset(); }, 900);
  });
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = L.latLng(-25.4995, -64.9752);
  let mapa = null;
  const crear = () => {
    if (mapa) return;
    mapa = L.map(el, { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView(centro, 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    L.circle(centro, { radius: 260, color: '#2A7259', weight: 1, fillColor: '#3C9678', fillOpacity: .14 }).addTo(mapa);
    L.marker(centro, { icon: L.divIcon({ className: 'mapa-pin', html: '<span></span>', iconSize: [40, 40] }), keyboard: false, title: 'Zona de la oficina' }).addTo(mapa);
    setTimeout(() => mapa.invalidateSize(), 1300);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      if (entries.some(en => en.isIntersecting)) { crear(); io.disconnect(); }
    }, { rootMargin: '400px 0px' });
    io.observe(el);
  } else {
    crear();
  }
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
    .from(hero.querySelectorAll('.sello, .hero-badge, .destacada, .player'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.08, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  const wrap = document.querySelector('[data-parallax]');
  const img = wrap?.querySelector('img');
  if (!img) return;
  ScrollTrigger.create({
    trigger: wrap.closest('.hero') || wrap,
    start: 'top top',
    end: 'bottom top',
    onUpdate: self => { img.style.translate = `0 ${(self.progress * 7).toFixed(2)}%`; }
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

[initHoy, initFlyers, initRail, initPlayer, initTabs, initConsulta, initMapa, initHeroMotion, initParallax, initReveals, initNav, initWspFloat, initModelBarScroll].forEach(fn => {
  try { fn(); } catch (e) { console.error(e); }
});
