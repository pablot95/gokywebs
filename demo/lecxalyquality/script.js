'use strict';

const WA = '5492942685818';
const MARCA = 'Lecxaly Quality';
const CART_KEY = 'lecxaly_cart';
const MAX_PUBLIC = 100;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const extraVariante = (p, v) => (p.variantes && p.variantes.extras && v && p.variantes.extras[v]) ? Number(p.variantes.extras[v]) : 0;
const precioBase = (p, v) => Number(p.precio || 0) + extraVariante(p, v);
const precioFinal = (p, v) => p.descuento > 0 ? Math.round(precioBase(p, v) * (1 - p.descuento / 100)) : precioBase(p, v);
const PRODUCTOS = new Map();
const getProducto = id => PRODUCTOS.get(id);
const LINEAS = { Calzado: ['Urbanas', 'Running', 'Tejidas', 'Chunky'], Indumentaria: ['Buzos', 'Remeras', 'Camperas', 'Sweaters', 'Jeans'] };
const TALLES = { Calzado: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'], Indumentaria: ['S', 'M', 'L', 'XL', 'XXL'] };
const ICONO_FLECHA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const ICONO_MAS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const ICONO_MENOS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>';
const ICONO_OJO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="3"/></svg>';

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
const refrescarScroll = () => { if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh()); };

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
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
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

let revealsListos = false;
let revealIO = null;
const revealPendientes = new Set();
function entrarReveal(el, n) {
  const d = Math.min(n * 0.1, 0.6);
  el.style.transitionDelay = `${d}s`;
  el.classList.add('in');
  revealPendientes.delete(el);
  setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
}
function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    revealIO = null;
    return;
  }
  revealIO = new IntersectionObserver(entries => {
    let n = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) { entrarReveal(entry.target, n++); revealIO.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => { revealPendientes.add(el); revealIO.observe(el); });
  let queued = false;
  const sweep = () => {
    queued = false;
    let n = 0;
    revealPendientes.forEach(el => {
      if (el.classList.contains('in')) { revealPendientes.delete(el); return; }
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { entrarReveal(el, n++); revealIO.unobserve(el); }
    });
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
  if (reduceMotion || !revealIO) { nuevos.forEach(el => el.classList.add('in')); return; }
  const limite = window.innerHeight * 1.05;
  const visibles = [];
  nuevos.forEach(el => {
    if (el.getBoundingClientRect().top < limite) visibles.push(el);
    else { revealPendientes.add(el); revealIO.observe(el); }
  });
  requestAnimationFrame(() => requestAnimationFrame(() => visibles.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    revealPendientes.delete(el);
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-marca'), { y: 18, opacity: 0, duration: 0.9 }, 0.05)
    .from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.15)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.25)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.5)
    .from(hero.querySelectorAll('.hero-ctas .btn, .hero .buscar'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.65)
    .from(hero.querySelectorAll('.cat-chip'), { scale: 0.92, opacity: 0, duration: 1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const wrap = document.querySelector('.mayorista-foto-wrap');
  if (!wrap) return;
  gsap.fromTo(wrap, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.mayorista', start: 'top bottom', end: 'bottom top', scrub: true } });
}

const Cart = {
  KEY: CART_KEY,
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, variante, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.var === variante);
    const tope = producto.stock ?? 99;
    if (existing) existing.qty = Math.min(existing.qty + qty, tope);
    else items.push({ id: producto.id, var: variante, qty: Math.min(qty, tope) });
    this.save(items);
  },
  setQty(id, variante, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.var === variante); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, variante) { this.save(this.get().filter(i => !(i.id === id && i.var === variante))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p, i.var) * i.qty : s; }, 0); },
  syncStock() {
    const items = this.get(); let changed = false;
    const filtered = items.filter(i => {
      const p = getProducto(i.id);
      if (!p || p.stock <= 0) { changed = true; return false; }
      if (i.qty > p.stock) { i.qty = p.stock; changed = true; }
      return true;
    });
    if (changed) this.save(filtered);
  },
};

async function api(params = {}) {
  const url = new URL('api/productos.php', location.href);
  Object.entries(params).forEach(([k, v]) => { if (v !== '' && v != null) url.searchParams.set(k, String(v)); });
  const r = await window.fetch(url, { headers: { Accept: 'application/json' } });
  if (!r.ok) throw new Error('No se pudo cargar el catálogo');
  const data = await r.json();
  if (!Array.isArray(data.items) || data.items.length > MAX_PUBLIC) throw new Error('La respuesta superó el máximo de 100');
  data.items.forEach(p => PRODUCTOS.set(p.id, p));
  return data;
}

function estiloFoto(p) {
  const f = p.foco || { x: 50, y: 50, z: 1 };
  const z = Math.max(1, Number(f.z) || 1);
  const minimo = 100 - z * 100;
  const l = Math.max(minimo, Math.min(0, 50 - (Number(f.x) || 50) * z));
  const t = Math.max(minimo, Math.min(0, 50 - (Number(f.y) || 50) * z));
  return `--z:${z};--l:${l.toFixed(1)}%;--t:${t.toFixed(1)}%;--ox:${f.x || 50}%;--oy:${f.y || 50}%`;
}
const imagenSrc = p => `images/${encodeURIComponent(p.imagen)}`;
const esIphone = p => p.categoria === 'iPhone';
const etiquetaVariante = p => esIphone(p) ? 'Capacidad' : 'Talle';
const resumenVariantes = p => {
  const ops = p.variantes?.opciones || [];
  if (!ops.length) return '';
  if (esIphone(p)) return ops.join(' · ');
  return ops.length > 3 ? `Talles ${ops[0]} al ${ops[ops.length - 1]}` : `Talles ${ops.join(', ')}`;
};
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge-off">-${p.descuento}%</span>`);
  if (p.nuevo) b.push('<span class="badge">Nuevo</span>');
  if (p.stock > 0 && p.stock <= (esIphone(p) ? 2 : 5)) b.push('<span class="badge badge-stock">Últimas unidades</span>');
  if (p.stock <= 0) b.push('<span class="badge badge-stock">Sin stock</span>');
  return b.length ? `<span class="badges">${b.join('')}</span>` : '';
}
function precioHTML(p, v) {
  const final = precioFinal(p, v);
  const desde = esIphone(p) && !v && p.variantes?.opciones?.length > 1 ? '<small style="font:600 .74rem var(--font-body);color:var(--color-text-muted)">desde</small>' : '';
  if (p.descuento > 0) return `<span class="prod-precio precio">${desde}<span class="off">${formatearPrecio(final)}</span><s>${formatearPrecio(precioBase(p, v))}</s></span>`;
  return `<span class="prod-precio precio">${desde}${formatearPrecio(final)}</span>`;
}
function cardHTML(p, animar = true) {
  const sub = esIphone(p) ? `<span class="iphone-cond"><i></i>${esc(p.condicion || '')}</span>` : `<span class="prod-sub">${esc(p.categoria)} · ${esc(p.subcategoria)}</span>`;
  const variantes = esIphone(p)
    ? `<span class="caps">${(p.variantes?.opciones || []).map(o => `<span>${esc(o)}</span>`).join('')}</span>`
    : `<span class="prod-var">${esc(resumenVariantes(p))}${p.color ? ' · ' + esc(p.color) : ''}</span>`;
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(48px)"' : '';
  return `<article class="card" data-id="${esc(p.id)}"${anim}>
    <button type="button" class="prod-foto" style="${estiloFoto(p)}" data-ver="${esc(p.id)}" aria-label="Ver detalle de ${esc(p.nombre)}"><img src="${imagenSrc(p)}" width="1254" height="1254" alt="${esc(p.alt || p.nombre)}">${badgesHTML(p)}<span class="ver">${ICONO_OJO}Vista rápida</span></button>
    <div class="prod-info">
      ${sub}
      <h3 class="prod-nombre" data-ver="${esc(p.id)}">${esc(p.nombre)}</h3>
      ${precioHTML(p)}
      ${variantes}
      <div class="prod-actions">
        <div class="stepper"><button type="button" data-qty="-1" aria-label="Restar cantidad">${ICONO_MENOS}</button><output>1</output><button type="button" data-qty="1" aria-label="Sumar cantidad">${ICONO_MAS}</button></div>
        <button type="button" class="prod-add" data-elegir="${esc(p.id)}">${esIphone(p) ? 'Elegir capacidad' : 'Elegir talle'}</button>
      </div>
    </div>
  </article>`;
}
const skeletonsHTML = n => Array.from({ length: n }, () => '<div class="skel" aria-hidden="true"></div>').join('');
const vacioHTML = (titulo, texto, accion) => `<div class="vacio"><h3>${esc(titulo)}</h3><p>${esc(texto)}</p>${accion ? `<button type="button" class="btn btn-ghost btn-sm" data-limpiar-todo>${esc(accion)}</button>` : ''}</div>`;

function chipsHTML(opciones, activo = '', todo = 'Todos') {
  return [`<button type="button" class="chip${activo === '' ? ' on' : ''}" data-val="">${esc(todo)}</button>`]
    .concat(opciones.map(o => `<button type="button" class="chip${o.length <= 3 ? ' chip-talle' : ''}${activo === o ? ' on' : ''}" data-val="${esc(o)}">${esc(o)}</button>`)).join('');
}

const TIENDAS = {};
function crearTienda(cfg) {
  const root = document.querySelector(cfg.root);
  if (!root) return null;
  const grid = root.querySelector('.catalogo-grid');
  const mas = root.querySelector('[data-mas]');
  const estado = root.querySelector('[data-estado]');
  const cuenta = root.querySelector('[data-cuenta]');
  const cuentaFiltros = root.querySelector('[data-cuenta-filtros]');
  const limpiar = root.querySelector('[data-limpiar]');
  const st = { items: [], cursor: null, total: 0, loading: false, gen: 0 };
  const grupos = () => $$('[data-filtro]', root);
  const leer = () => {
    const f = {};
    grupos().forEach(el => {
      const k = el.dataset.filtro;
      if (el.tagName === 'INPUT') f[k] = el.value.trim();
      else if (el.tagName === 'SELECT') f[k] = el.value;
      else f[k] = el.querySelector('.chip.on')?.dataset.val ?? '';
    });
    return f;
  };
  const hayFiltros = f => Object.entries(f).some(([k, v]) => v && !(k === 'orden' && v === 'nuevo'));
  const sincronizarDependientes = () => {
    if (!cfg.dependientes) return;
    const f = leer();
    const subBox = root.querySelector('[data-filtro="sub"]');
    const talleBox = root.querySelector('[data-filtro="talle"]');
    const cats = f.categoria ? [f.categoria] : Object.keys(LINEAS);
    if (subBox) {
      const lineas = cats.flatMap(c => LINEAS[c]);
      subBox.innerHTML = chipsHTML(lineas, lineas.includes(f.sub) ? f.sub : '', 'Todas');
    }
    if (talleBox) {
      const talles = cats.flatMap(c => TALLES[c]);
      talleBox.innerHTML = chipsHTML(talles, talles.includes(f.talle) ? f.talle : '', 'Todos');
    }
  };
  const actualizarCuenta = () => {
    const f = leer();
    const unidad = cfg.unidad;
    const total = st.total;
    const texto = total === 0 ? `0 ${unidad[1]}` : total === 1 ? `1 ${unidad[0]}` : `${total} ${unidad[1]}`;
    if (cuenta) cuenta.textContent = st.items.length < total ? `${texto} · mostrando ${st.items.length}` : texto;
    if (cuentaFiltros) cuentaFiltros.textContent = hayFiltros(f) ? `${texto} con estos filtros` : '';
    if (limpiar) limpiar.hidden = !hayFiltros(f);
  };
  const pintar = (reset, nuevos) => {
    if (reset) {
      grid.innerHTML = st.items.length ? st.items.map(p => cardHTML(p)).join('') : vacioHTML(cfg.vacio[0], cfg.vacio[1], 'Ver todo');
    } else {
      grid.insertAdjacentHTML('beforeend', nuevos.map(p => cardHTML(p)).join(''));
    }
    actualizarCuenta();
    revelarNuevos(grid);
    refrescarScroll();
  };
  async function cargar(reset = false) {
    if (reset) { st.gen++; st.items = []; st.cursor = null; st.loading = false; grid.innerHTML = skeletonsHTML(Math.min(cfg.limit, 8)); if (cuenta) cuenta.textContent = 'Cargando…'; }
    const gen = st.gen;
    if (st.loading) return;
    st.loading = true;
    if (mas) { mas.hidden = true; }
    if (estado) estado.textContent = '';
    try {
      const f = leer();
      const data = await api({ scope: cfg.scope, limit: cfg.limit, cursor: reset ? '' : st.cursor, q: f.q, categoria: f.categoria, sub: f.sub, talle: f.talle, condicion: f.condicion, precio_max: f.precioMax, orden: f.orden });
      if (gen !== st.gen) return;
      st.items.push(...data.items);
      if (st.items.length > MAX_PUBLIC) st.items.splice(0, st.items.length - MAX_PUBLIC);
      st.cursor = data.nextCursor;
      st.total = Number(data.total ?? st.items.length);
      pintar(reset, data.items);
    } catch {
      if (gen === st.gen) {
        if (estado) estado.textContent = 'No pudimos cargar los productos. Probá de nuevo en un momento.';
        if (!st.items.length) grid.innerHTML = vacioHTML('El catálogo no está disponible por ahora', 'Reintentá en unos segundos o escribinos por WhatsApp.', '');
      }
    } finally {
      if (gen === st.gen) { st.loading = false; if (mas) mas.hidden = !st.cursor; }
    }
  }
  const reiniciar = () => { actualizarCuenta(); cargar(true); };
  let timer = 0;
  root.addEventListener('input', e => {
    const el = e.target;
    if (el.matches('[data-filtro="q"]')) { clearTimeout(timer); timer = setTimeout(reiniciar, 260); }
  });
  root.addEventListener('change', e => { if (e.target.matches('select[data-filtro]')) reiniciar(); });
  root.addEventListener('submit', e => { if (e.target.matches('[data-buscador]')) { e.preventDefault(); clearTimeout(timer); reiniciar(); } });
  root.addEventListener('click', e => {
    const chip = e.target.closest('[data-filtro] .chip');
    if (chip) {
      const box = chip.closest('[data-filtro]');
      if (chip.classList.contains('on') && chip.dataset.val !== '' && box.dataset.filtro !== 'orden') {
        box.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.dataset.val === ''));
      } else {
        box.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === chip));
      }
      if (box.dataset.filtro === 'categoria') sincronizarDependientes();
      reiniciar();
      return;
    }
    if (e.target.closest('[data-limpiar], [data-limpiar-todo]')) { limpiarTodo(); return; }
    if (e.target.closest('[data-mas]')) { cargar(false); return; }
    const step = e.target.closest('[data-qty]');
    if (step) {
      const out = step.parentElement.querySelector('output');
      out.value = String(Math.max(1, Math.min(99, Number(out.value) + Number(step.dataset.qty))));
      return;
    }
    const elegir = e.target.closest('[data-elegir]');
    if (elegir) {
      const p = getProducto(elegir.dataset.elegir);
      const qty = Number(elegir.parentElement.querySelector('output')?.value) || 1;
      if (p) abrirModal(p, qty);
      return;
    }
    const ver = e.target.closest('[data-ver]');
    if (ver) { const p = getProducto(ver.dataset.ver); if (p) abrirModal(p); }
  });
  function limpiarTodo() {
    grupos().forEach(el => {
      if (el.tagName === 'INPUT') el.value = '';
      else if (el.tagName === 'SELECT') el.selectedIndex = 0;
      else el.querySelectorAll('.chip').forEach((c, i) => c.classList.toggle('on', i === 0));
    });
    sincronizarDependientes();
    reiniciar();
  }
  function setCategoria(cat) {
    const box = root.querySelector('[data-filtro="categoria"]');
    if (!box) return;
    box.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.dataset.val === cat));
    sincronizarDependientes();
    reiniciar();
  }
  function setBusqueda(q) {
    const input = root.querySelector('input[data-filtro="q"]');
    if (input) input.value = q;
    reiniciar();
  }
  sincronizarDependientes();
  cargar(true);
  return { root, cargar, reiniciar, limpiarTodo, setCategoria, setBusqueda, estado: st };
}

function initTiendas() {
  TIENDAS.catalogo = crearTienda({ root: '#catalogo', scope: 'catalogo', limit: 16, dependientes: true, unidad: ['producto', 'productos'], vacio: ['No encontramos productos con esa combinación', 'Probá con otra palabra, otro talle o limpiá los filtros.'] });
  TIENDAS.iphone = crearTienda({ root: '#iphone', scope: 'iphone', limit: 8, dependientes: false, unidad: ['equipo', 'equipos'], vacio: ['No hay equipos con esa combinación', 'Probá otra capacidad o condición, o consultanos por WhatsApp.'] });
  const irA = sel => document.querySelector(sel)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  document.addEventListener('click', e => {
    const link = e.target.closest('[data-ir-categoria]');
    if (!link || !TIENDAS.catalogo) return;
    e.preventDefault();
    TIENDAS.catalogo.setCategoria(link.dataset.irCategoria);
    irA('#catalogo');
  });
  $$('form[data-buscador]').filter(f => !f.closest('#catalogo')).forEach(form => {
    const input = form.querySelector('input');
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!TIENDAS.catalogo) return;
      TIENDAS.catalogo.setBusqueda(input.value.trim());
      irA('#catalogo');
    });
  });
  const toggleFiltros = document.getElementById('filtros-toggle');
  const lateral = document.querySelector('.filtros-lateral');
  if (toggleFiltros && lateral) {
    toggleFiltros.addEventListener('click', () => {
      const abierto = lateral.classList.toggle('open');
      toggleFiltros.setAttribute('aria-expanded', String(abierto));
      toggleFiltros.querySelector('span').textContent = abierto ? 'Ocultar filtros' : 'Filtrar';
      refrescarScroll();
    });
  }
}

let capaAbierta = null;
let ultimoFoco = null;
function abrirCapa(el) {
  if (capaAbierta && capaAbierta !== el) cerrarCapa(true);
  ultimoFoco = document.activeElement;
  capaAbierta = el;
  document.getElementById('capa')?.classList.add('open');
  el.classList.add('open');
  el.removeAttribute('inert');
  document.body.classList.add('no-scroll');
  window.lenis?.stop();
  requestAnimationFrame(() => { (el.querySelector('[data-foco-inicial]') || el.querySelector('button, a[href], input, select')).focus(); });
}
function cerrarCapa(silencioso = false) {
  if (!capaAbierta) return;
  const el = capaAbierta;
  el.classList.remove('open');
  el.setAttribute('inert', '');
  capaAbierta = null;
  if (!silencioso) {
    document.getElementById('capa')?.classList.remove('open');
    document.body.classList.remove('no-scroll');
    window.lenis?.start();
    ultimoFoco?.focus?.();
  }
  if (el.id === 'modal') {
    const url = new URL(location.href);
    if (url.searchParams.has('producto')) { url.searchParams.delete('producto'); window.history.replaceState(null, '', url); }
    document.getElementById('jsonld-producto')?.remove();
  }
}
document.addEventListener('keydown', e => {
  if (!capaAbierta) return;
  if (e.key === 'Escape') { cerrarCapa(); return; }
  if (e.key === 'Tab') {
    const focusables = $$('button:not([disabled]), a[href], input, select, [tabindex="0"]', capaAbierta).filter(el => el.offsetParent);
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

function openCartDrawer() {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  renderDrawer();
  abrirCapa(drawer);
}
function lineaWhatsApp(linea) {
  const p = getProducto(linea.id);
  if (!p) return '';
  return `${linea.qty}x ${p.nombre} | ${etiquetaVariante(p)} ${linea.var} | ${formatearPrecio(precioFinal(p, linea.var) * linea.qty)}`;
}
function renderDrawer() {
  const cont = document.getElementById('drawer-items');
  if (!cont) return;
  const items = Cart.get();
  const resumen = document.getElementById('drawer-resumen');
  const n = Cart.count();
  if (resumen) resumen.textContent = n ? `${n} ${n === 1 ? 'unidad' : 'unidades'}` : 'Carrito';
  if (!items.length) {
    cont.innerHTML = '<div class="drawer-vacio"><h3>Todavía no sumaste nada</h3><p>Elegí modelos y talles desde el catálogo, o un equipo desde la tienda iPhone.</p><button type="button" class="btn btn-primary btn-sm" data-ir-catalogo>Ir al catálogo</button></div>';
  } else {
    cont.innerHTML = items.map(l => {
      const p = getProducto(l.id);
      if (!p) return '';
      return `<div class="linea" data-id="${esc(l.id)}" data-var="${esc(l.var)}">
        <div class="prod-foto" style="${estiloFoto(p)}"><img src="${imagenSrc(p)}" width="1254" height="1254" alt=""></div>
        <div class="linea-info"><b>${esc(p.nombre)}</b><span>${esc(etiquetaVariante(p))} ${esc(l.var)} · ${formatearPrecio(precioFinal(p, l.var))} c/u</span><span class="prod-precio precio">${formatearPrecio(precioFinal(p, l.var) * l.qty)}</span></div>
        <div class="linea-acciones"><div class="stepper"><button type="button" data-linea-qty="-1" aria-label="Restar cantidad">${ICONO_MENOS}</button><output>${l.qty}</output><button type="button" data-linea-qty="1" aria-label="Sumar cantidad">${ICONO_MAS}</button></div><button type="button" class="quitar" data-quitar>Quitar</button></div>
      </div>`;
    }).join('');
  }
  const total = document.getElementById('drawer-total');
  if (total) total.textContent = formatearPrecio(Cart.total());
  const checkout = document.getElementById('drawer-checkout');
  if (checkout) checkout.disabled = !items.length;
  const wsp = document.getElementById('drawer-wsp');
  if (wsp) {
    const lineas = ['Hola ' + MARCA + ', quiero hacer este pedido:', '', ...items.map(lineaWhatsApp).filter(Boolean), '', 'Total: ' + formatearPrecio(Cart.total()), '', '¿Me confirman disponibilidad y forma de pago?'];
    wsp.href = `https://wa.me/${WA}?text=${encodeURIComponent(lineas.join('\n'))}`;
    wsp.classList.toggle('btn-deshabilitado', !items.length);
    wsp.setAttribute('aria-disabled', String(!items.length));
    if (!items.length) wsp.setAttribute('tabindex', '-1'); else wsp.removeAttribute('tabindex');
  }
}
function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', () => { updateCartBadge(); renderDrawer(); });

async function hidratarCarrito() {
  const items = Cart.get();
  const faltan = [...new Set(items.map(i => i.id))].filter(id => !PRODUCTOS.has(id));
  if (faltan.length) {
    try { await api({ scope: 'ids', ids: faltan.slice(0, 50).join(','), limit: 50 }); } catch { /* sin red el carrito queda como está */ }
  }
  Cart.syncStock();
  updateCartBadge();
  renderDrawer();
}

function initDrawer() {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  $$('[data-open-cart]').forEach(b => b.addEventListener('click', openCartDrawer));
  document.getElementById('capa')?.addEventListener('click', () => cerrarCapa());
  $$('[data-cerrar]', drawer).forEach(b => b.addEventListener('click', () => cerrarCapa()));
  drawer.addEventListener('click', e => {
    const linea = e.target.closest('.linea');
    const step = e.target.closest('[data-linea-qty]');
    if (step && linea) {
      const l = Cart.get().find(i => i.id === linea.dataset.id && i.var === linea.dataset.var);
      if (l) Cart.setQty(l.id, l.var, l.qty + Number(step.dataset.lineaQty));
      return;
    }
    if (e.target.closest('[data-quitar]') && linea) { Cart.remove(linea.dataset.id, linea.dataset.var); return; }
    if (e.target.closest('[data-ir-catalogo]')) { cerrarCapa(); document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); return; }
    if (e.target.closest('#drawer-checkout')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    const wsp = e.target.closest('#drawer-wsp');
    if (wsp && wsp.getAttribute('aria-disabled') === 'true') { e.preventDefault(); showToast('Sumá al menos un producto para enviar el pedido.'); }
  });
}

let modalProducto = null;
let modalVariante = '';
function fichaHTML(p) {
  const celdas = esIphone(p)
    ? [['Modelo', p.subcategoria], ['Color', p.color || '—'], ['Condición', p.condicion || '—'], ['Capacidades', (p.variantes?.opciones || []).join(' · ')]]
    : [['Línea', `${p.categoria} · ${p.subcategoria}`], ['Color', p.color || '—'], ['Talles', (p.variantes?.opciones || []).join(' · ')], ['Material', p.material || '—']];
  return `<div class="modal-ficha">${celdas.map(([k, v]) => `<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</div>`;
}
function relacionadosHTML(p) {
  const rel = [...PRODUCTOS.values()].filter(x => x.id !== p.id && x.categoria === p.categoria && x.visible !== false)
    .sort((a, b) => (b.subcategoria === p.subcategoria) - (a.subcategoria === p.subcategoria)).slice(0, 3);
  if (!rel.length) return '';
  return `<div class="relacionados"><span>También te puede interesar</span><div class="relacionados-lista">${rel.map(x => `<button type="button" class="rel" data-ver="${esc(x.id)}"><span class="prod-foto" style="${estiloFoto(x)}"><img src="${imagenSrc(x)}" width="1254" height="1254" alt=""></span><b>${esc(x.nombre)}</b><i>${formatearPrecio(precioFinal(x))}</i></button>`).join('')}</div></div>`;
}
function abrirModal(p, qty = 1) {
  const modal = document.getElementById('modal');
  const body = document.getElementById('modal-body');
  if (!modal || !body) return;
  modalProducto = p;
  const opciones = p.variantes?.opciones || [];
  modalVariante = opciones[0] || '';
  const wspIphone = esIphone(p) ? `<a class="link" href="https://wa.me/${WA}?text=${encodeURIComponent(`Hola ${MARCA}, quiero consultar por el ${p.nombre} (${p.condicion || ''}).`)}" target="_blank" rel="noopener noreferrer">Consultar este equipo por WhatsApp${ICONO_FLECHA}</a>` : '';
  body.innerHTML = `
    <div class="modal-foto" style="${estiloFoto(p)}"><img src="${imagenSrc(p)}" width="1254" height="1254" alt="${esc(p.alt || p.nombre)}">${badgesHTML(p)}</div>
    <div class="modal-info">
      ${esIphone(p) ? `<span class="iphone-cond"><i></i>${esc(p.condicion || '')}</span>` : `<span class="prod-sub">${esc(p.categoria)} · ${esc(p.subcategoria)}</span>`}
      <h2 id="modal-titulo">${esc(p.nombre)}</h2>
      <div id="modal-precio">${precioHTML(p, modalVariante)}</div>
      <p class="modal-desc">${esc(p.descripcion || '')}</p>
      ${fichaHTML(p)}
      ${opciones.length ? `<div class="variantes"><div class="variantes-titulo"><span>${esc(etiquetaVariante(p))}</span><b id="modal-var-label">${esc(modalVariante)}</b></div><div class="chips" id="modal-variantes">${opciones.map((o, i) => `<button type="button" class="chip${o.length <= 3 ? ' chip-talle' : ''}${i === 0 ? ' on' : ''}" data-variante="${esc(o)}"${i === 0 ? ' data-foco-inicial' : ''}>${esc(o)}</button>`).join('')}</div></div>` : ''}
      <div class="modal-actions">
        <div class="stepper"><button type="button" data-modal-qty="-1" aria-label="Restar cantidad">${ICONO_MENOS}</button><output id="modal-qty">${Math.max(1, Math.min(99, qty))}</output><button type="button" data-modal-qty="1" aria-label="Sumar cantidad">${ICONO_MAS}</button></div>
        <button type="button" class="prod-add" id="modal-add"${p.stock <= 0 ? ' disabled' : ''}>Agregar al carrito</button>
        <button type="button" class="btn btn-ghost" id="modal-comprar"${p.stock <= 0 ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      ${wspIphone}
      ${relacionadosHTML(p)}
    </div>`;
  const url = new URL(location.href);
  url.searchParams.set('producto', p.id);
  window.history.replaceState(null, '', url);
  document.getElementById('jsonld-producto')?.remove();
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.id = 'jsonld-producto';
  ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(imagenSrc(p), location.href).href, description: p.descripcion || '', brand: { '@type': 'Brand', name: MARCA }, offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p, modalVariante), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' } });
  document.head.appendChild(ld);
  abrirCapa(modal);
  document.getElementById('modal-caja').scrollTop = 0;
}
function initModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  $$('[data-cerrar]', modal).forEach(b => b.addEventListener('click', () => cerrarCapa()));
  modal.addEventListener('click', e => {
    const variante = e.target.closest('[data-variante]');
    if (variante) {
      modalVariante = variante.dataset.variante;
      $$('#modal-variantes .chip').forEach(c => c.classList.toggle('on', c === variante));
      const label = document.getElementById('modal-var-label'); if (label) label.textContent = modalVariante;
      const precio = document.getElementById('modal-precio'); if (precio && modalProducto) precio.innerHTML = precioHTML(modalProducto, modalVariante);
      return;
    }
    const step = e.target.closest('[data-modal-qty]');
    if (step) {
      const out = document.getElementById('modal-qty');
      out.value = String(Math.max(1, Math.min(99, Number(out.value) + Number(step.dataset.modalQty))));
      return;
    }
    if (e.target.closest('#modal-add') && modalProducto) {
      const qty = Number(document.getElementById('modal-qty').value) || 1;
      Cart.add(modalProducto, modalVariante, qty);
      showToast(`${modalProducto.nombre} · ${etiquetaVariante(modalProducto).toLowerCase()} ${modalVariante} × ${qty} sumado al pedido`);
      return;
    }
    if (e.target.closest('#modal-comprar') && modalProducto) {
      const qty = Number(document.getElementById('modal-qty').value) || 1;
      Cart.add(modalProducto, modalVariante, qty);
      cerrarCapa();
      openCartDrawer();
      return;
    }
    const ver = e.target.closest('[data-ver]');
    if (ver) { const p = getProducto(ver.dataset.ver); if (p) abrirModal(p); }
  });
}
async function initProductoDesdeURL() {
  const id = new URL(location.href).searchParams.get('producto');
  if (!id) return;
  try {
    const data = await api({ scope: 'ids', ids: id, limit: 1 });
    if (data.items[0]) abrirModal(data.items[0]);
  } catch { /* un slug inválido no abre nada */ }
}

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  if (!wsp && !cart) return;
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

initModelBarScroll();
initNav();
initDrawer();
initModal();
initTiendas();
initReveals();
initHeroMotion();
initParallax();
initFloats();
hidratarCarrito().then(initProductoDesdeURL);
