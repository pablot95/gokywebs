document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491135240018';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normaliza = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

const PIELES = [
  { id: 'seca', nombre: 'Seca' },
  { id: 'mixta', nombre: 'Mixta o grasa' },
  { id: 'sensible', nombre: 'Sensible' },
  { id: 'madura', nombre: 'Madura' },
];

const TRATAMIENTOS = [
  { id: 't1', nombre: 'Limpieza facial profunda', dur: '60 min', para: 'Mixta o grasa', perfil: ['mixta', 'acne'], desc: 'Desmaquillado, vapor, extracción de comedones y máscara calmante. Es el punto de partida de casi todos los protocolos.' },
  { id: 't2', nombre: 'Punta de diamante', dur: '45 min', para: 'Textura y manchas', perfil: ['madura', 'manchas'], desc: 'Microdermoabrasión que empareja la textura y ayuda a que los activos entren mejor. Sin tiempo de recuperación.' },
  { id: 't3', nombre: 'Peeling químico superficial', dur: '40 min', para: 'Manchas', perfil: ['manchas', 'mixta'], desc: 'Ácidos en concentración de cabina para aclarar manchas y marcas. Se hace en serie, con protector solar obligatorio entre sesiones.' },
  { id: 't4', nombre: 'Hidratación con hialurónico', dur: '50 min', para: 'Seca o deshidratada', perfil: ['seca', 'sensible'], desc: 'Ácido hialurónico de bajo y alto peso molecular con máscara oclusiva. Para piel que tira y se descama.' },
  { id: 't5', nombre: 'Dermaplaning', dur: '45 min', para: 'Todo tipo de piel', perfil: ['sensible', 'lineas'], desc: 'Exfoliación con hoja estéril que retira vello fino y células muertas. Deja la piel lisa y el maquillaje asienta distinto.' },
  { id: 't6', nombre: 'Protocolo antiage', dur: '70 min', para: 'Madura', perfil: ['madura', 'lineas'], desc: 'Combina exfoliación, activos tensores y masaje de drenaje. Se arma en serie de seis sesiones con mantenimiento mensual.' },
];

const PRODUCTOS = [
  { id: 1, nombre: 'Gel limpiador facial', ml: '200 ml', precio: 14900, img: 'p-limpiador.webp', piel: ['mixta', 'sensible'], perfil: ['mixta', 'acne'], activo: 'Ácido salicílico suave', desc: 'Limpia sin resecar. Es el paso uno de cualquier rutina: si esto no está bien elegido, lo que viene después rinde la mitad.', bullets: ['Uso diario, mañana y noche', 'No deja sensación de tirantez', 'Apto para piel con granitos'] },
  { id: 2, nombre: 'Sérum vitamina C 15%', ml: '30 ml', precio: 28500, img: 'p-serum.webp', piel: ['madura', 'mixta'], perfil: ['manchas', 'lineas', 'madura'], activo: 'Vitamina C estabilizada', desc: 'Antioxidante de la mañana. Empareja el tono y ayuda con las manchas cuando se usa con protector solar todos los días.', bullets: ['Se aplica a la mañana', 'Siempre con protector solar', 'Frasco opaco: no le da la luz'] },
  { id: 3, nombre: 'Ácido hialurónico puro', ml: '30 ml', precio: 24700, img: 'p-hialuronico.webp', piel: ['seca', 'sensible', 'madura'], perfil: ['seca', 'lineas'], activo: 'Hialurónico de doble peso', desc: 'Hidratación que se siente el mismo día. Se aplica sobre la piel húmeda y se sella con crema, si no hace el efecto contrario.', bullets: ['Sobre piel húmeda, nunca seca', 'Sellar con crema después', 'Mañana y noche'] },
  { id: 4, nombre: 'Crema de mantenimiento', ml: '50 ml', precio: 19800, img: 'p-crema.webp', piel: ['seca', 'sensible'], perfil: ['seca', 'sensible'], activo: 'Ceramidas y manteca de karité', desc: 'La crema que sella todo lo anterior. Textura media: hidrata sin dejar la cara pesada.', bullets: ['Repara la barrera de la piel', 'Textura media, no oclusiva', 'Cara, cuello y escote'] },
  { id: 5, nombre: 'Protector solar FPS 50', ml: '50 ml', precio: 22400, img: 'p-protector.webp', piel: ['seca', 'mixta', 'sensible', 'madura'], perfil: ['manchas', 'lineas', 'mixta', 'seca'], activo: 'Filtro de amplio espectro', desc: 'El producto que más cambia una piel a un año. Sin esto, cualquier tratamiento de manchas se pierde.', bullets: ['Todos los días, también nublado', 'Textura fluida, no deja blanco', 'Se reaplica cada 3 horas al sol'] },
  { id: 6, nombre: 'Mascarilla de arcilla', ml: '100 ml', precio: 16300, img: 'p-mascarilla.webp', piel: ['mixta'], perfil: ['acne', 'mixta'], activo: 'Arcilla verde y niacinamida', desc: 'Para la semana en que la piel se pone grasa. Una o dos veces por semana alcanza: más seca de más.', bullets: ['Una o dos veces por semana', 'Diez minutos, sin dejar secar del todo', 'Solo en zona T si la piel es mixta'] },
];

const TEMAS = { acne: 'granitos y poros', manchas: 'manchas', lineas: 'líneas finas', seca: 'tirantez y falta de brillo' };
const TIPOS = { seca: 'seca', mixta: 'mixta o grasa', sensible: 'sensible', madura: 'madura' };

const Cart = {
  KEY: 'gabinetecosmiatria_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, 20);
    else items.push({ id: producto.id, qty: Math.min(qty, 20) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 20)); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + p.precio * i.qty : s; }, 0); },
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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

let revealsListos = false;
function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.09, 0.6)}s`;
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

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.3)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function initTratamientos() {
  const grid = document.getElementById('trat-grid');
  if (!grid) return;
  grid.innerHTML = TRATAMIENTOS.map(t => `
    <article class="trat-card" data-animate="up" style="transform:translateY(24px);opacity:0">
      <div class="trat-meta">
        <span class="pill pill-a">${esc(t.dur)}</span>
        <span class="pill pill-b">${esc(t.para)}</span>
      </div>
      <h3>${esc(t.nombre)}</h3>
      <p>${esc(t.desc)}</p>
      <a class="link-todo trat-cta" href="https://wa.me/${WSP}?text=${encodeURIComponent('Hola! Quiero pedir un turno para ' + t.nombre + '.')}" target="_blank" rel="noopener">Pedir turno</a>
    </article>`).join('');
}

const estado = { q: '', piel: 'all' };

function filtrados() {
  const base = normaliza(estado.q).trim();
  const terms = base ? base.split(/\s+/) : [];
  return PRODUCTOS.filter(p => {
    if (estado.piel !== 'all' && !p.piel.includes(estado.piel)) return false;
    if (!terms.length) return true;
    const heno = normaliza([p.nombre, p.activo, p.ml, p.desc, p.piel.map(x => TIPOS[x]).join(' ')].join(' '));
    return terms.every(t => heno.includes(t));
  });
}

function cardHTML(p) {
  return `
  <article class="prod" data-id="${p.id}" data-qty="1" data-animate="up" style="transform:translateY(24px);opacity:0">
    <div class="prod-media">
      <img src="images/${esc(p.img)}" width="1000" height="1250" alt="${esc(p.nombre)}">
      <span class="pill pill-b prod-pill">${esc(p.activo)}</span>
      <button type="button" class="prod-ver" data-ver="${p.id}">Ver ficha</button>
    </div>
    <div class="prod-body">
      <h3 class="prod-nom">${esc(p.nombre)}</h3>
      <span class="prod-uni">${esc(p.ml)} · piel ${p.piel.map(x => esc(TIPOS[x])).join(', ')}</span>
      <span class="prod-precio">${formatearPrecio(p.precio)}</span>
      <div class="prod-actions">
        <div class="stepper">
          <button type="button" data-step="-1" aria-label="Quitar una unidad de ${esc(p.nombre)}">−</button>
          <output data-out>1</output>
          <button type="button" data-step="1" aria-label="Sumar una unidad de ${esc(p.nombre)}">+</button>
        </div>
        <button type="button" class="prod-add" data-add="${p.id}">Agregar</button>
      </div>
    </div>
  </article>`;
}

function pintarTienda() {
  const grid = document.getElementById('prod-grid');
  const vacio = document.getElementById('vacio');
  const count = document.getElementById('cat-count');
  const limpiar = document.getElementById('limpiar');
  if (!grid) return;
  const res = filtrados();
  grid.innerHTML = res.map(p => cardHTML(p)).join('');
  grid.hidden = res.length === 0;
  if (vacio) vacio.hidden = res.length !== 0;
  if (count) count.textContent = `${res.length} ${res.length === 1 ? 'producto' : 'productos'}`;
  const activos = (estado.piel !== 'all' ? 1 : 0) + (estado.q.trim() ? 1 : 0);
  if (limpiar) limpiar.hidden = activos === 0;
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function initTienda() {
  const grid = document.getElementById('prod-grid');
  const chips = document.getElementById('chips');
  const q = document.getElementById('q');
  const limpiar = document.getElementById('limpiar');
  const vacioLimpiar = document.getElementById('vacio-limpiar');
  if (!grid) return;

  if (chips) {
    chips.innerHTML = [{ id: 'all', nombre: 'Todos' }, ...PIELES]
      .map(p => `<button type="button" class="chip" data-chip="${p.id}" aria-pressed="${p.id === 'all'}">${esc(p.nombre)}</button>`).join('');
    chips.addEventListener('click', e => {
      const b = e.target.closest('[data-chip]');
      if (!b) return;
      estado.piel = b.dataset.chip;
      chips.querySelectorAll('[data-chip]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      pintarTienda();
    });
  }
  q?.addEventListener('input', () => { estado.q = q.value; pintarTienda(); });

  const reset = () => {
    estado.q = ''; estado.piel = 'all';
    if (q) q.value = '';
    chips?.querySelectorAll('[data-chip]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.chip === 'all')));
    pintarTienda();
  };
  limpiar?.addEventListener('click', reset);
  vacioLimpiar?.addEventListener('click', reset);

  grid.addEventListener('click', e => {
    const card = e.target.closest('.prod');
    const step = e.target.closest('[data-step]');
    if (step && card) {
      const qn = Math.max(1, Math.min(Number(card.dataset.qty || 1) + Number(step.dataset.step), 20));
      card.dataset.qty = qn;
      const out = card.querySelector('[data-out]');
      if (out) out.textContent = qn;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add && card) {
      const p = getProducto(Number(add.dataset.add));
      if (!p) return;
      Cart.add(p, Number(card.dataset.qty || 1));
      showToast('¡Agregado! Tu pedido te espera');
      return;
    }
    const ver = e.target.closest('[data-ver]');
    if (ver) { abrirModal(Number(ver.dataset.ver), ver); return; }
    if (card && !e.target.closest('button')) abrirModal(Number(card.dataset.id), card);
  });

  pintarTienda();
}

function initPiel() {
  const cont = document.getElementById('piel');
  const lab = document.getElementById('piel-lab');
  const dur = document.getElementById('piel-dur');
  const titulo = document.getElementById('piel-titulo');
  const descEl = document.getElementById('piel-desc');
  const wsp = document.getElementById('piel-wsp');
  const prods = document.getElementById('piel-prods');
  if (!cont || !prods) return;
  const sel = {};

  const puntaje = x => Object.values(sel).reduce((n, v) => n + (x.perfil.includes(v) ? 1 : 0), 0);

  const render = () => {
    const trat = TRATAMIENTOS.map(t => ({ t, n: puntaje(t) })).sort((a, b) => b.n - a.n)[0].t;
    const elegidos = PRODUCTOS.map(p => ({ p, n: puntaje(p) })).sort((a, b) => b.n - a.n || a.p.id - b.p.id).slice(0, 2);

    const tipo = sel.tipo ? TIPOS[sel.tipo] : null;
    const tema = sel.tema ? TEMAS[sel.tema] : null;
    lab.textContent = tipo && tema ? `Para piel ${tipo} con ${tema}`
      : tipo ? `Para piel ${tipo}`
      : tema ? `Para ${tema}`
      : 'Lo que más pedimos, en general';

    const previo = prods.dataset.ids;
    dur.textContent = trat.dur;
    titulo.textContent = trat.nombre;
    descEl.textContent = trat.desc;
    wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(
      [`Hola! Quiero pedir un turno para ${trat.nombre}.`,
        tipo ? `Tengo piel ${tipo}.` : null,
        tema ? `Lo que me preocupa: ${tema}.` : null].filter(Boolean).join('\n'))}`;

    prods.innerHTML = elegidos.map(({ p }) => `
      <div class="piel-p" data-piel-id="${p.id}">
        <span class="piel-p-media"><img src="images/${esc(p.img)}" width="1000" height="1250" alt="${esc(p.nombre)}"></span>
        <div>
          <p class="piel-p-nom">${esc(p.nombre)}</p>
          <p class="piel-p-por">${esc(p.activo)} · ${formatearPrecio(p.precio)}</p>
        </div>
        <button type="button" class="piel-p-add" data-piel-add="${p.id}">Agregar</button>
      </div>`).join('');
    prods.dataset.ids = elegidos.map(x => x.p.id).join(',');

    if (reduceMotion || previo === prods.dataset.ids) return;
    prods.querySelectorAll('[data-piel-id]').forEach(el => el.animate(
      [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
      { duration: 220, easing: 'cubic-bezier(0.23,1,0.32,1)' }
    ));
  };

  cont.querySelectorAll('.piel-chip').forEach(chip => chip.addEventListener('click', () => {
    const q = chip.closest('.piel-q');
    const key = q.dataset.key;
    const ya = sel[key] === chip.dataset.val;
    q.querySelectorAll('.piel-chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
    if (ya) delete sel[key];
    else { sel[key] = chip.dataset.val; chip.setAttribute('aria-pressed', 'true'); }
    render();
  }));

  prods.addEventListener('click', e => {
    const b = e.target.closest('[data-piel-add]');
    if (!b) return;
    const p = getProducto(Number(b.dataset.pielAdd));
    if (!p) return;
    Cart.add(p, 1);
    showToast(`${p.nombre} sumado al pedido`);
  });

  render();
}

let drawerAbierto = false, focoPrevio = null;
function pintarDrawer() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-foot');
  const total = document.getElementById('drawer-total');
  const wsp = document.getElementById('drawer-wsp');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="carro-vacio">
      <h3>Todavía no elegiste ningún producto</h3>
      <p>Podés arrancar por la sección "Tu piel" y ver qué te conviene.</p>
      <button type="button" class="btn btn-cta" data-cerrar-drawer>Ver los productos</button>
    </div>`;
    if (foot) foot.hidden = true;
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<div class="ci" data-ci="${p.id}">
      <div class="ci-media"><img src="images/${esc(p.img)}" width="1000" height="1250" alt="${esc(p.nombre)}"></div>
      <div>
        <h3 class="ci-nom">${esc(p.nombre)}</h3>
        <p class="ci-uni">${esc(p.ml)}</p>
        <div class="stepper">
          <button type="button" data-ci-step="-1" aria-label="Quitar una unidad de ${esc(p.nombre)}">−</button>
          <output>${i.qty}</output>
          <button type="button" data-ci-step="1" aria-label="Sumar una unidad de ${esc(p.nombre)}">+</button>
        </div>
      </div>
      <div class="ci-right">
        <span class="ci-precio">${formatearPrecio(p.precio * i.qty)}</span>
        <button type="button" class="ci-del" data-ci-del>Quitar</button>
      </div>
    </div>`;
  }).join('');
  if (foot) foot.hidden = false;
  if (total) total.textContent = formatearPrecio(Cart.total());
  if (wsp) {
    const lineas = items.map(i => {
      const p = getProducto(i.id);
      return p ? `• ${i.qty} × ${p.nombre} (${p.ml}) — ${formatearPrecio(p.precio * i.qty)}` : '';
    }).filter(Boolean);
    const msg = ['Hola! Quiero llevarme estos productos:', ...lineas, `Total: ${formatearPrecio(Cart.total())}`].join('\n');
    wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
  }
}

function abrirDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!drawer || drawerAbierto) return;
  focoPrevio = document.activeElement;
  drawer.hidden = false; if (bd) bd.hidden = false;
  requestAnimationFrame(() => drawer.classList.add('open'));
  document.body.classList.add('no-scroll');
  drawerAbierto = true;
  pintarDrawer();
  document.getElementById('drawer-close')?.focus();
}
function cerrarDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!drawer || !drawerAbierto) return;
  drawer.classList.remove('open');
  document.body.classList.remove('no-scroll');
  drawerAbierto = false;
  const fin = () => { drawer.hidden = true; if (bd) bd.hidden = true; };
  if (reduceMotion) fin(); else setTimeout(fin, 360);
  focoPrevio?.focus?.();
}

function initDrawer() {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  document.getElementById('cart-header')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawer-close')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click', cerrarDrawer);
  drawer.addEventListener('click', e => {
    const ci = e.target.closest('[data-ci]');
    const step = e.target.closest('[data-ci-step]');
    if (step && ci) {
      const id = Number(ci.dataset.ci);
      const actual = Cart.get().find(i => i.id === id)?.qty || 1;
      const siguiente = actual + Number(step.dataset.ciStep);
      if (siguiente < 1) Cart.remove(id); else Cart.setQty(id, siguiente);
      return;
    }
    if (e.target.closest('[data-ci-del]') && ci) { Cart.remove(Number(ci.dataset.ci)); return; }
    if (e.target.closest('[data-cerrar-drawer]')) {
      cerrarDrawer();
      document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });
  document.getElementById('checkout')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  drawer.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = [...drawer.querySelectorAll('button, a[href], input')].filter(x => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  document.addEventListener('cart:updated', () => { if (drawerAbierto) pintarDrawer(); });
}

let modalAbierto = false, focoModal = null;
function abrirModal(id, trigger) {
  const bd = document.getElementById('modal-backdrop');
  const cont = document.getElementById('modal-in');
  const p = getProducto(id);
  if (!bd || !cont || !p) return;
  focoModal = trigger || document.activeElement;
  cont.innerHTML = `
    <div class="modal-media"><img src="images/${esc(p.img)}" width="1000" height="1250" alt="${esc(p.nombre)}"></div>
    <div class="modal-body" data-qty="1">
      <span class="pill pill-b">${esc(p.activo)}</span>
      <h3 id="modal-nombre">${esc(p.nombre)}</h3>
      <p class="modal-uni">${esc(p.ml)} · para piel ${p.piel.map(x => esc(TIPOS[x])).join(', ')}</p>
      <p class="modal-desc">${esc(p.desc)}</p>
      <ul class="modal-dl">${p.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>
      <p class="modal-precio">${formatearPrecio(p.precio)}</p>
      <div class="modal-acts">
        <div class="stepper">
          <button type="button" data-mstep="-1" aria-label="Quitar una unidad">−</button>
          <output data-mout>1</output>
          <button type="button" data-mstep="1" aria-label="Sumar una unidad">+</button>
        </div>
        <button type="button" class="btn btn-cta" data-madd="${p.id}">Agregar al pedido</button>
      </div>
    </div>`;
  bd.hidden = false;
  document.body.classList.add('no-scroll');
  modalAbierto = true;
  document.getElementById('modal-close')?.focus();
}
function cerrarModal() {
  const bd = document.getElementById('modal-backdrop');
  if (!bd || !modalAbierto) return;
  bd.hidden = true;
  document.body.classList.remove('no-scroll');
  modalAbierto = false;
  focoModal?.focus?.();
}

function initModal() {
  const bd = document.getElementById('modal-backdrop');
  if (!bd) return;
  document.getElementById('modal-close')?.addEventListener('click', cerrarModal);
  bd.addEventListener('click', e => {
    if (e.target === bd) { cerrarModal(); return; }
    const body = bd.querySelector('.modal-body');
    const step = e.target.closest('[data-mstep]');
    if (step && body) {
      const q = Math.max(1, Math.min(Number(body.dataset.qty || 1) + Number(step.dataset.mstep), 20));
      body.dataset.qty = q;
      const out = bd.querySelector('[data-mout]');
      if (out) out.textContent = q;
      return;
    }
    const add = e.target.closest('[data-madd]');
    if (add && body) {
      const p = getProducto(Number(add.dataset.madd));
      if (!p) return;
      Cart.add(p, Number(body.dataset.qty || 1));
      showToast('¡Agregado! Tu pedido te espera');
    }
  });
  bd.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = [...bd.querySelectorAll('button, a[href], input')].filter(x => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
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
    const header = document.querySelector('.top');
    (header || document.body).appendChild(bd);
  }
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
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', abrirDrawer);
  sync();
}

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.hero-copy > *', { y: 22, opacity: 0, duration: .85, stagger: .085 })
    .from('.hero-foto', { scale: 1.06, opacity: 0, duration: 1.2, ease: 'power3.out' }, .1)
    .from('[data-hero="ficha"]', { y: 20, opacity: 0, duration: .8 }, .65)
    .from('.pill-seam', { y: 12, opacity: 0, duration: .6 }, .8);

  const limpiarHero = () => {
    if (tl.progress() < 1) tl.progress(1);
    tl.kill();
    gsap.set(['.hero-copy > *', '.hero-foto', '[data-hero="ficha"]', '.pill-seam'], { clearProps: 'all' });
  };
  tl.eventCallback('onComplete', limpiarHero);
  setTimeout(limpiarHero, 2400);
}

function initLeeScroll() {
  const els = document.querySelectorAll('[data-lee]');
  if (!els.length) return;
  els.forEach(el => {
    const palabras = el.textContent.trim().split(/\s+/);
    if (palabras.length < 2) return;
    el.textContent = '';
    palabras.forEach((palabra, i) => {
      const s = document.createElement('span');
      s.className = 'lee-w';
      s.textContent = palabra;
      el.appendChild(s);
      if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    document.querySelectorAll('.lee-w').forEach(w => w.classList.add('on'));
    return;
  }
  els.forEach(el => {
    const ws = el.querySelectorAll('.lee-w');
    if (!ws.length) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: .4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

function initJsonLd() {
  const graph = [{
    '@type': 'BeautySalon',
    '@id': 'https://gokywebs.com/demo/tienegabinetecosmiatria/#negocio',
    name: 'Gabinete de Cosmiatría',
    description: 'Gabinete de cosmiatría con turno exclusivo: limpieza facial profunda, punta de diamante, peeling, hidratación, dermaplaning y protocolo antiage.',
    telephone: '+5491135240018',
    email: 'hola@gabinetedecosmiatria.com',
    priceRange: '$$',
    areaServed: { '@type': 'Country', name: 'Argentina' },
    address: { '@type': 'PostalAddress', addressCountry: 'AR' },
    image: 'https://gokywebs.com/demo/tienegabinetecosmiatria/images/hero-tratamiento.webp',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Tratamientos',
      itemListElement: TRATAMIENTOS.map(t => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: t.nombre, description: t.desc },
      })),
    },
  }];
  PRODUCTOS.forEach(p => graph.push({
    '@type': 'Product',
    name: p.nombre,
    description: p.desc,
    image: `https://gokywebs.com/demo/tienegabinetecosmiatria/images/${p.img}`,
    offers: { '@type': 'Offer', price: p.precio, priceCurrency: 'ARS', availability: 'https://schema.org/InStock' },
  }));
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  document.head.appendChild(s);
}

const GKY_SLUG_ACENTOS = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u' };
function gkySlugify(s) {
  return String(s || '').toLowerCase()
    .replace(/[áéíóúñü]/g, c => GKY_SLUG_ACENTOS[c] || c)
    .replace(/[^a-z0-9]/g, '');
}

function initFeedbackFloat() {
  const GKY_FEEDBACK_WHATSAPP = '5491125068578';
  const btn = document.getElementById('feedback-float');
  const backdrop = document.getElementById('feedback-modal-backdrop');
  const closeBtn = document.getElementById('feedback-modal-close');
  const starsWrap = document.getElementById('feedback-stars');
  const coloresEl = document.getElementById('feedback-colores');
  const contenidoEl = document.getElementById('feedback-contenido');
  const otrosEl = document.getElementById('feedback-otros');
  const submitBtn = document.getElementById('feedback-submit');
  if (!btn || !backdrop) return;

  const stars = [...starsWrap.querySelectorAll('.feedback-star')];
  let rating = 0;
  const paintStars = (n) => stars.forEach((s, i) => {
    s.classList.toggle('active', i < n);
    s.setAttribute('aria-pressed', i < n ? 'true' : 'false');
  });
  stars.forEach((s, i) => {
    s.addEventListener('click', () => { rating = i + 1; paintStars(rating); });
    s.addEventListener('mouseenter', () => paintStars(i + 1));
  });
  starsWrap.addEventListener('mouseleave', () => paintStars(rating));

  const open = () => {
    backdrop.hidden = false;
    document.body.classList.add('no-scroll');
    (stars[0] || coloresEl)?.focus();
  };
  const close = () => {
    backdrop.hidden = true;
    document.body.classList.remove('no-scroll');
    btn.focus();
  };
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

  submitBtn.addEventListener('click', () => {
    const colores = coloresEl.value.trim();
    const contenido = contenidoEl.value.trim();
    const otros = otrosEl.value.trim();
    if (!rating && !colores && !contenido && !otros) { coloresEl.focus(); return; }

    const slugUrl = (location.pathname.match(/\/demo\/([^/]+)/) || [])[1] || document.title;
    const slug = gkySlugify(slugUrl);
    const negocio = (document.title.split(/\s[—|]\s|\s-\s/)[0] || document.title || '').trim();
    const estrellas = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) + ` (${rating}/5)` : 'Sin calificar';
    const lineas = [
      `Devolución de la demo${negocio ? ' — ' + negocio : ''}`,
      `Calificación: ${estrellas}`,
      colores ? `Colores: ${colores}` : null,
      contenido ? `Contenido: ${contenido}` : null,
      otros ? `Otros: ${otros}` : null,
      location.href,
    ].filter(Boolean);

    window.open(`https://wa.me/${GKY_FEEDBACK_WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
    window.__gkySendResena?.({ slug, negocio, rating: rating || null, colores, contenido, otros, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la devolución en Firestore:', err));

    if (typeof showToast === 'function') showToast('¡Gracias por tu devolución!'); else window.alert('¡Gracias por tu devolución!');
    close();
    rating = 0; paintStars(0); coloresEl.value = ''; contenidoEl.value = ''; otrosEl.value = '';
  });

  if (reduceMotion) return;
  let hideTimer = null;
  window.addEventListener('scroll', () => {
    btn.classList.add('is-hidden');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => btn.classList.remove('is-hidden'), 550);
  }, { passive: true });
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none';
  });
}

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (modalAbierto) { cerrarModal(); return; }
  if (drawerAbierto) cerrarDrawer();
});

const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();

initTratamientos();
initTienda();
initPiel();
initReveals();
initNav();
initDrawer();
initModal();
initFloats();
initHero();
initLeeScroll();
initJsonLd();
initFeedbackFloat();
updateCartBadge();

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
