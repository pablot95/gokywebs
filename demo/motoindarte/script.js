const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493516119300';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const CATEGORIAS = [
  { id: 'cascos', nombre: 'Cascos', img: 'images/cat-cascos.webp' },
  { id: 'cubiertas', nombre: 'Cubiertas', img: 'images/cat-cubiertas.webp' },
  { id: 'transmision', nombre: 'Transmisión', img: 'images/cat-transmision.webp' },
  { id: 'frenos', nombre: 'Frenos', img: 'images/cat-frenos.webp' },
  { id: 'accesorios', nombre: 'Accesorios', img: 'images/cat-accesorios.webp' }
];

const TODAS = ['honda', 'motomel', 'zanella', 'corven', 'gilera', 'guerrero', 'yamaha'];

const PRODUCTOS = [
  { id: 'cas-01', nombre: 'Casco integral vintage blanco', cat: 'cascos', sub: 'Integral', medida: 'Talles S a XL', precio: 128900, descuento: 0, stock: 6, cc: ['110', '150'], marcas: TODAS, img: 'images/casco-integral-blanco.webp', destacado: true, etiquetas: ['integral', 'blanco', 'vintage'], desc: 'Casco integral con visor transparente y interior desmontable. Calota en ABS y cierre de hebilla doble anilla. Se prueba en el local antes de llevarlo.' },
  { id: 'cas-02', nombre: 'Casco integral vintage crema', cat: 'cascos', sub: 'Integral', medida: 'Talles S a XL', precio: 128900, descuento: 10, stock: 4, cc: ['110', '150'], marcas: TODAS, img: 'images/casco-integral-crema.webp', destacado: true, etiquetas: ['integral', 'crema'], desc: 'Misma calota que el blanco, en terminación crema mate. Interior lavable y ventilación superior.' },
  { id: 'cas-03', nombre: 'Casco integral negro brillante', cat: 'cascos', sub: 'Integral', medida: 'Talles M a XL', precio: 132500, descuento: 0, stock: 3, cc: ['110', '150'], marcas: TODAS, img: 'images/casco-integral-negro.webp', destacado: false, etiquetas: ['integral', 'negro'], desc: 'Terminación negro brillante, visor oscuro incluido. Pensado para uso diario en ciudad.' },
  { id: 'cas-04', nombre: 'Casco abierto jet blanco', cat: 'cascos', sub: 'Abierto', medida: 'Talles S a L', precio: 86400, descuento: 0, stock: 8, cc: ['110', '150'], marcas: TODAS, img: 'images/casco-jet-blanco.webp', destacado: true, etiquetas: ['jet', 'abierto', 'blanco'], desc: 'Casco abierto tipo jet, liviano y fresco para el uso urbano de todos los días. Visor corto desmontable.' },
  { id: 'cas-05', nombre: 'Casco abierto jet negro', cat: 'cascos', sub: 'Abierto', medida: 'Talles S a L', precio: 86400, descuento: 15, stock: 2, cc: ['110', '150'], marcas: TODAS, img: 'images/casco-jet-negro.webp', destacado: false, etiquetas: ['jet', 'abierto', 'negro'], desc: 'Versión negra del jet, con vivo de cuero ecológico en el borde y cierre a presión.' },

  { id: 'cub-01', nombre: 'Cubierta trasera 90/90-18 mixta', cat: 'cubiertas', sub: 'Trasera', medida: '90/90-18', precio: 74200, descuento: 0, stock: 5, cc: ['150'], marcas: ['honda', 'motomel', 'corven', 'gilera', 'yamaha'], img: 'images/cubierta-mixta.webp', destacado: true, etiquetas: ['cubierta', 'trasera', 'mixta', '90/90'], desc: 'Dibujo mixto para asfalto y ripio. Medida trasera habitual en 150 cc. Se vende por unidad.' },
  { id: 'cub-02', nombre: 'Cubierta delantera 2.75-18 ruta', cat: 'cubiertas', sub: 'Delantera', medida: '2.75-18', precio: 61800, descuento: 0, stock: 7, cc: ['110'], marcas: TODAS, img: 'images/cubierta-ruta.webp', destacado: true, etiquetas: ['cubierta', 'delantera', 'ruta', '2.75'], desc: 'Dibujo de ruta con nervaduras finas: menos ruido y mejor agarre en mojado. Medida clásica de 110 cc.' },
  { id: 'cub-03', nombre: 'Cubierta taco 80/100-18', cat: 'cubiertas', sub: 'Trasera', medida: '80/100-18', precio: 82900, descuento: 8, stock: 3, cc: ['150'], marcas: ['motomel', 'zanella', 'corven', 'guerrero'], img: 'images/cubierta-taco.webp', destacado: false, etiquetas: ['cubierta', 'taco', 'enduro'], desc: 'Taco alto para tierra y calles rotas. Baja bastante el confort en asfalto: preguntanos antes si andás mayormente en ciudad.' },
  { id: 'cub-04', nombre: 'Cubierta trail 2.50-17', cat: 'cubiertas', sub: 'Delantera', medida: '2.50-17', precio: 57400, descuento: 0, stock: 4, cc: ['110'], marcas: ['honda', 'motomel', 'zanella', 'guerrero'], img: 'images/cubierta-trail.webp', destacado: false, etiquetas: ['cubierta', 'trail', '2.50'], desc: 'Medida chica de rodado 17, para 110 cc de cuadro bajo. Dibujo trail que aguanta bien el uso mixto.' },

  { id: 'tra-01', nombre: 'Kit de transmisión completo 428', cat: 'transmision', sub: 'Kits', medida: 'Paso 428', precio: 58700, descuento: 12, stock: 6, cc: ['110', '150'], marcas: TODAS, img: 'images/trans-kit.webp', destacado: true, etiquetas: ['kit', 'cadena', 'corona', 'piñon', '428'], desc: 'Cadena, corona y piñón del mismo paso, cambiados juntos como corresponde. Decinos el modelo y te confirmamos la cantidad de dientes.' },
  { id: 'tra-02', nombre: 'Corona trasera 428 z43', cat: 'transmision', sub: 'Coronas', medida: '43 dientes', precio: 24900, descuento: 0, stock: 9, cc: ['150'], marcas: ['honda', 'motomel', 'corven', 'gilera'], img: 'images/trans-corona.webp', destacado: true, etiquetas: ['corona', '428', 'z43'], desc: 'Corona de acero templado con maza mecanizada. Reemplazo directo en 150 cc de paso 428.' },
  { id: 'tra-03', nombre: 'Corona de acero z41', cat: 'transmision', sub: 'Coronas', medida: '41 dientes', precio: 22400, descuento: 0, stock: 11, cc: ['110'], marcas: TODAS, img: 'images/trans-coronas.webp', destacado: false, etiquetas: ['corona', 'z41', 'acero'], desc: 'Corona plana de 41 dientes, la medida más pedida en 110 cc. Viene sin bulones.' },
  { id: 'tra-04', nombre: 'Piñón de salida z14', cat: 'transmision', sub: 'Piñones', medida: '14 dientes', precio: 9800, descuento: 0, stock: 14, cc: ['110', '150'], marcas: TODAS, img: 'images/trans-pinon.webp', destacado: true, etiquetas: ['piñon', 'z14', 'salida'], desc: 'Piñón de ataque de 14 dientes. Si querés más fuerza de arranque, bajá un diente; para ruta, subí uno.' },
  { id: 'tra-05', nombre: 'Candado de cadena 428', cat: 'transmision', sub: 'Accesorios', medida: 'Paso 428', precio: 2600, descuento: 0, stock: 25, cc: ['110', '150'], marcas: TODAS, img: 'images/trans-candado.webp', destacado: false, etiquetas: ['candado', 'cadena', '428'], desc: 'Candado con traba de clip para cadena de paso 428. Conviene tener uno de repuesto abajo del asiento.' },
  { id: 'tra-06', nombre: 'Cadena reforzada 428 x 132', cat: 'transmision', sub: 'Cadenas', medida: '132 eslabones', precio: 34500, descuento: 0, stock: 7, cc: ['110', '150'], marcas: TODAS, img: 'images/trans-cadena-oro.webp', destacado: true, etiquetas: ['cadena', 'reforzada', '428'], desc: 'Cadena reforzada de 132 eslabones con terminación dorada. Aguanta mejor el uso con carga que la estándar.' },
  { id: 'tra-07', nombre: 'Kit corona y piñón dorado', cat: 'transmision', sub: 'Kits', medida: 'Paso 428', precio: 46900, descuento: 0, stock: 4, cc: ['150'], marcas: ['honda', 'motomel', 'yamaha', 'gilera'], img: 'images/trans-corona-oro.webp', destacado: false, etiquetas: ['kit', 'corona', 'piñon', 'dorado'], desc: 'Corona y piñón dorados, sin cadena. Para quien cambió la cadena hace poco y solo necesita los dentados.' },

  { id: 'fre-01', nombre: 'Disco de freno delantero 220 mm', cat: 'frenos', sub: 'Discos', medida: '220 mm', precio: 39800, descuento: 0, stock: 5, cc: ['150'], marcas: ['honda', 'motomel', 'corven', 'yamaha'], img: 'images/freno-disco.webp', destacado: true, etiquetas: ['disco', 'freno', '220'], desc: 'Disco perforado de 220 mm para tren delantero. Verificá la distancia entre agujeros antes de comprar o mandanos una foto.' },
  { id: 'fre-02', nombre: 'Pinza de freno delantera', cat: 'frenos', sub: 'Pinzas', medida: 'Doble pistón', precio: 67500, descuento: 5, stock: 2, cc: ['150'], marcas: ['honda', 'motomel', 'corven'], img: 'images/freno-pinza.webp', destacado: false, etiquetas: ['pinza', 'caliper', 'freno'], desc: 'Pinza de doble pistón con pastillas puestas. Se entrega sin líquido: hay que purgar el sistema al instalarla.' },

  { id: 'acc-01', nombre: 'Espejo redondo cromado (par)', cat: 'accesorios', sub: 'Espejos', medida: 'Rosca 8 mm', precio: 18400, descuento: 0, stock: 12, cc: ['110', '150'], marcas: TODAS, img: 'images/acc-espejo.webp', destacado: true, etiquetas: ['espejo', 'cromado', 'par'], desc: 'Par de espejos redondos con brazo largo y rosca de 8 mm. Entran en la mayoría de las 110 y 150 de calle.' },
  { id: 'acc-02', nombre: 'Puños de goma antideslizantes', cat: 'accesorios', sub: 'Manubrio', medida: '22 mm', precio: 7900, descuento: 0, stock: 18, cc: ['110', '150'], marcas: TODAS, img: 'images/acc-puno.webp', destacado: false, etiquetas: ['puños', 'manubrio', 'goma'], desc: 'Juego de puños de goma con nervado antideslizante para manubrio de 22 mm. Se colocan con aire comprimido o agua jabonosa.' }
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const Cart = {
  KEY: 'motoindarte_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); }
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

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => {
    a.href = 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(a.getAttribute('data-wsp-msg'));
  });
}

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cartFloat');
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 861px)');
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

function initHero() {
  const cont = document.getElementById('heroSlides');
  if (!cont) return;
  const slides = [...cont.querySelectorAll('.slide')];
  const dots = [...document.querySelectorAll('.hero-dots .dot')];
  let actual = 0;
  let timer = null;

  const ir = i => {
    actual = (i + slides.length) % slides.length;
    slides.forEach((s, k) => {
      const on = k === actual;
      s.classList.toggle('is-on', on);
      if (on) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true');
      s.querySelectorAll('a, button').forEach(el => { el.tabIndex = on ? 0 : -1; });
    });
    dots.forEach((d, k) => { d.classList.toggle('is-on', k === actual); d.setAttribute('aria-selected', k === actual ? 'true' : 'false'); });
  };

  const arrancar = () => {
    if (reduceMotion || slides.length < 2) return;
    detener();
    timer = window.setInterval(() => ir(actual + 1), 6000);
  };
  const detener = () => { if (timer) { window.clearInterval(timer); timer = null; } };

  dots.forEach(d => d.addEventListener('click', () => { ir(+d.dataset.dot); arrancar(); }));
  cont.addEventListener('pointerenter', detener);
  cont.addEventListener('pointerleave', arrancar);
  cont.addEventListener('focusin', detener);
  ir(0);
  arrancar();
}

function initCategorias() {
  const cont = document.getElementById('catLista');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(c => {
    const n = PRODUCTOS.filter(p => p.cat === c.id).length;
    return `<li data-animate style="opacity:0;transform:translateY(26px)">
      <button type="button" class="cat-btn" data-cat="${esc(c.id)}">
        <span class="cat-foto"><img src="${esc(c.img)}" alt="${esc(c.nombre)}" width="700" height="700" decoding="async"></span>
        <span class="cat-nombre">${esc(c.nombre)}</span>
        <span class="cat-n">${n} piezas</span>
      </button>
    </li>`;
  }).join('');
  cont.querySelectorAll('.cat-btn').forEach(b => {
    b.addEventListener('click', () => aplicarFiltroCategoria(b.dataset.cat));
  });
}

function cardHTML(p, opciones = {}) {
  const final = precioFinal(p);
  const badge = p.descuento > 0 ? `<span class="badge-desc">-${p.descuento}%</span>` : '';
  const precio = p.descuento > 0
    ? `<span class="precio">${formatearPrecio(final)}</span><s class="precio-viejo">${formatearPrecio(p.precio)}</s>`
    : `<span class="precio">${formatearPrecio(final)}</span>`;
  const cc = p.cc.length === 2 ? '110 y 150' : p.cc[0] + ' cc';
  const clase = opciones.rail ? 'prod prod-rail' : 'prod';
  const anim = opciones.rail ? '' : ' data-animate style="transform:translateY(26px)"';
  return `<article class="${clase}" data-id="${esc(p.id)}"${anim}>
    <div class="prod-foto">
      <img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1200" height="1200" loading="lazy" decoding="async">
      ${badge}
      <button type="button" class="prod-ojo" data-ver="${esc(p.id)}" aria-label="Vista rápida de ${esc(p.nombre)}">Vista rápida</button>
    </div>
    <div class="prod-cuerpo">
      <p class="prod-meta"><span class="prod-cc">${esc(cc)}</span><span class="prod-medida">${esc(p.medida)}</span></p>
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      <p class="prod-precio">${precio}</p>
      <p class="prod-stock">${p.stock > 0 ? p.stock + ' en stock' : 'Sin stock'}</p>
      <div class="prod-actions">
        <div class="stepper" data-stepper="${esc(p.id)}">
          <button type="button" class="step-menos" aria-label="Quitar una unidad">−</button>
          <span class="step-n">1</span>
          <button type="button" class="step-mas" aria-label="Sumar una unidad">+</button>
        </div>
        <button type="button" class="btn btn-cta prod-add" data-add="${esc(p.id)}">Agregar<span class="add-extra"> al carrito</span></button>
      </div>
    </div>
  </article>`;
}

function leerStepper(id) {
  const st = document.querySelector(`[data-stepper="${id}"] .step-n`);
  return st ? Math.max(1, parseInt(st.textContent, 10) || 1) : 1;
}

function conectarCards(scope) {
  scope.querySelectorAll('.stepper').forEach(st => {
    const n = st.querySelector('.step-n');
    const id = st.dataset.stepper;
    const p = getProducto(id);
    const tope = p?.stock ?? 99;
    st.querySelector('.step-menos')?.addEventListener('click', () => { n.textContent = Math.max(1, (+n.textContent || 1) - 1); });
    st.querySelector('.step-mas')?.addEventListener('click', () => { n.textContent = Math.min(tope, (+n.textContent || 1) + 1); });
  });
  scope.querySelectorAll('[data-add]').forEach(b => {
    b.addEventListener('click', () => {
      const p = getProducto(b.dataset.add);
      if (!p) return;
      Cart.add(p, leerStepper(p.id));
      showToast(`${p.nombre} va al carrito`);
    });
  });
  scope.querySelectorAll('[data-ver]').forEach(b => {
    b.addEventListener('click', () => abrirModal(b.dataset.ver));
  });
}

function initRail() {
  const vp = document.getElementById('rail');
  if (!vp) return;
  const destacados = PRODUCTOS.filter(p => p.destacado);
  if (destacados.length < 6) {
    vp.classList.add('rail-grid');
    vp.innerHTML = `<div class="rail-track">${destacados.map(p => cardHTML(p, { rail: true })).join('')}</div>`;
  } else {
    vp.innerHTML = `<div class="rail-track">${destacados.map(p => cardHTML(p, { rail: true })).join('')}</div>`;
  }
  conectarCards(vp);

  const track = vp.querySelector('.rail-track');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');

  const syncFlechas = () => {
    if (!prev || !next || !track) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const paso = () => Math.max(240, vp.clientWidth * 0.8);
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: 'smooth' }));
  vp.addEventListener('scroll', syncFlechas, { passive: true });
  window.addEventListener('resize', syncFlechas, { passive: true });
  syncFlechas();

  let down = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    down = true; moved = false; startX = e.clientX; startScroll = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    vp.scrollLeft = startScroll - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      vp.classList.remove('dragging');
      const matar = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', matar, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', matar, { capture: true }), 60);
    }
    moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
}

function initMoto() {
  const sel = document.getElementById('motoMarca');
  const vacio = document.getElementById('motoVacio');
  const ok = document.getElementById('motoOk');
  const cant = document.getElementById('motoCant');
  const detalle = document.getElementById('motoDetalle');
  const desde = document.getElementById('motoDesde');
  const ver = document.getElementById('motoVer');
  if (!sel || !ok) return;

  let ultimo = null;

  const calcular = () => {
    const ccEl = document.querySelector('input[name="cc"]:checked');
    const cc = ccEl ? ccEl.value : '';
    const marca = sel.value;
    if (!cc || !marca) { ok.hidden = true; vacio.hidden = false; ultimo = null; return; }
    const compat = PRODUCTOS.filter(p => p.cc.includes(cc) && p.marcas.includes(marca));
    ultimo = { cc, marca, compat };
    vacio.hidden = true;
    ok.hidden = false;
    cant.textContent = compat.length;
    const nombreMarca = sel.options[sel.selectedIndex].textContent;
    detalle.textContent = `piezas para tu ${nombreMarca} ${cc}`;
    if (compat.length) {
      const min = Math.min(...compat.map(precioFinal));
      desde.textContent = `Desde ${formatearPrecio(min)} · ${new Set(compat.map(p => p.cat)).size} rubros`;
    } else {
      desde.textContent = 'Todavía no cargamos piezas para esa combinación. Preguntanos por WhatsApp.';
    }
  };

  document.querySelectorAll('input[name="cc"]').forEach(r => r.addEventListener('change', calcular));
  sel.addEventListener('change', calcular);

  ver?.addEventListener('click', () => {
    if (!ultimo) return;
    estado.cc = ultimo.cc;
    estado.marca = ultimo.marca;
    estado.cat = '';
    estado.texto = '';
    const buscar = document.getElementById('buscar');
    if (buscar) buscar.value = '';
    renderCatalogo(true);
    document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  calcular();
}

const VID_RUBROS = [{ id: '', nombre: 'Todo' }].concat(CATEGORIAS.map(c => ({ id: c.id, nombre: c.nombre })));

function initVidriera() {
  const chips = document.getElementById('vidChips');
  const mosaico = document.getElementById('vidMosaico');
  const cant = document.getElementById('vidCant');
  const label = document.getElementById('vidLabel');
  const desde = document.getElementById('vidDesde');
  const pieza = document.getElementById('vidPieza');
  const add = document.getElementById('vidAdd');
  const ver = document.getElementById('vidVer');
  if (!chips || !mosaico) return;

  const piezas = [
    'cas-01', 'cub-01', 'tra-01', 'fre-01', 'acc-01', 'cas-04', 'cub-03', 'tra-06'
  ].map(getProducto).filter(Boolean);

  let rubro = '';
  let destacada = piezas[0];

  chips.innerHTML = VID_RUBROS.map((r, i) => `<button type="button" class="vid-chip${i === 0 ? ' is-on' : ''}" role="tab" aria-selected="${i === 0}" data-rubro="${esc(r.id)}">${esc(r.nombre)}</button>`).join('');

  mosaico.innerHTML = piezas.map(p => `<figure class="tile" data-id="${esc(p.id)}" data-cat="${esc(p.cat)}">
      <img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1200" height="1200" loading="lazy" decoding="async">
      <figcaption><span class="tile-cat">${esc(CATEGORIAS.find(c => c.id === p.cat)?.nombre || '')}</span><span class="tile-nombre">${esc(p.nombre)}</span></figcaption>
    </figure>`).join('');

  const tiles = [...mosaico.querySelectorAll('.tile')];

  function pintarPanel() {
    const lista = rubro ? piezas.filter(p => p.cat === rubro) : piezas;
    const enCatalogo = rubro ? PRODUCTOS.filter(p => p.cat === rubro) : PRODUCTOS;
    destacada = lista[0] || piezas[0];
    cant.textContent = enCatalogo.length;
    label.textContent = rubro ? `piezas de ${(CATEGORIAS.find(c => c.id === rubro)?.nombre || '').toLowerCase()}` : 'piezas en la vidriera';
    const min = Math.min(...enCatalogo.map(precioFinal));
    desde.textContent = `Desde ${formatearPrecio(min)}`;
    pieza.innerHTML = `<p class="vid-pieza-nombre">${esc(destacada.nombre)}</p><p class="vid-pieza-precio">${formatearPrecio(precioFinal(destacada))}</p>`;
    add.textContent = `Agregar ${destacada.cat === 'cascos' ? 'el casco' : 'la pieza'} al carrito`;
    ver.textContent = rubro ? `Ver las ${enCatalogo.length} en el catálogo` : 'Ver el catálogo completo';
  }

  function aplicar(nuevo) {
    rubro = nuevo;
    const estadoFlip = (typeof window.Flip !== 'undefined' && !reduceMotion) ? window.Flip.getState(tiles) : null;
    tiles.forEach(t => {
      const activo = t.dataset.cat === rubro;
      t.classList.toggle('is-on', !!rubro && activo);
      t.classList.toggle('is-off', !!rubro && !activo);
    });
    const orden = tiles.slice().sort((a, b) => {
      const av = (!rubro || a.dataset.cat === rubro) ? 0 : 1;
      const bv = (!rubro || b.dataset.cat === rubro) ? 0 : 1;
      return av - bv;
    });
    orden.forEach(t => mosaico.appendChild(t));
    if (estadoFlip) window.Flip.from(estadoFlip, { duration: 0.62, ease: 'power3.inOut', absolute: true, stagger: 0.03 });
    chips.querySelectorAll('.vid-chip').forEach(c => {
      const on = c.dataset.rubro === rubro;
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    pintarPanel();
  }

  chips.querySelectorAll('.vid-chip').forEach(c => c.addEventListener('click', () => aplicar(c.dataset.rubro)));
  tiles.forEach(t => t.addEventListener('click', () => abrirModal(t.dataset.id)));

  add.addEventListener('click', () => {
    if (!destacada) return;
    Cart.add(destacada, 1);
    showToast(`${destacada.nombre} va al carrito`);
  });
  ver.addEventListener('click', () => {
    if (rubro) aplicarFiltroCategoria(rubro);
    else { estado.cat = ''; renderCatalogo(true); document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }
  });

  aplicar('');
}

const estado = { texto: '', cat: '', cc: '', marca: '', soloStock: false, pagina: 1 };
const POR_PAGINA = 16;

function filtrar() {
  const q = normalizar(estado.texto).split(/\s+/).filter(Boolean);
  return PRODUCTOS.filter(p => {
    if (estado.cat && p.cat !== estado.cat) return false;
    if (estado.cc && !p.cc.includes(estado.cc)) return false;
    if (estado.marca && !p.marcas.includes(estado.marca)) return false;
    if (estado.soloStock && p.stock <= 0) return false;
    if (!q.length) return true;
    const heno = normalizar([p.nombre, p.sub, p.medida, p.desc, p.etiquetas.join(' '), CATEGORIAS.find(c => c.id === p.cat)?.nombre].join(' '));
    return q.every(t => heno.includes(t));
  });
}

function renderCatalogo(reiniciar = false) {
  const cont = document.getElementById('catalogo');
  const res = document.getElementById('resultados');
  const vacio = document.getElementById('sinResultados');
  const mas = document.getElementById('verMas');
  if (!cont) return;
  if (reiniciar) estado.pagina = 1;

  const lista = filtrar();
  const visibles = lista.slice(0, estado.pagina * POR_PAGINA);

  cont.innerHTML = visibles.map(p => cardHTML(p)).join('');
  conectarCards(cont);

  const partes = [];
  if (estado.cat) partes.push(CATEGORIAS.find(c => c.id === estado.cat)?.nombre);
  if (estado.cc) partes.push(estado.cc + ' cc');
  if (estado.marca) partes.push(estado.marca[0].toUpperCase() + estado.marca.slice(1));
  if (estado.soloStock) partes.push('con stock');
  res.textContent = `${lista.length} ${lista.length === 1 ? 'pieza' : 'piezas'}${partes.length ? ' · ' + partes.join(' · ') : ''}`;

  vacio.hidden = lista.length > 0;
  cont.hidden = lista.length === 0;
  mas.hidden = visibles.length >= lista.length;

  const badge = document.getElementById('filtrosBadge');
  const activos = [estado.cat, estado.cc, estado.marca, estado.soloStock ? 'x' : ''].filter(Boolean).length;
  if (badge) { badge.textContent = activos; badge.hidden = activos === 0; }

  revelarNuevos(cont);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function aplicarFiltroCategoria(cat) {
  estado.cat = cat;
  estado.texto = '';
  const buscar = document.getElementById('buscar');
  if (buscar) buscar.value = '';
  renderCatalogo(true);
  sincronizarChips();
  document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
}

function sincronizarChips() {
  document.querySelectorAll('#chipsCat .chip').forEach(c => c.classList.toggle('is-on', c.dataset.valor === estado.cat));
  document.querySelectorAll('#chipsCc .chip').forEach(c => c.classList.toggle('is-on', c.dataset.valor === estado.cc));
  document.querySelectorAll('#chipsStock .chip').forEach(c => c.classList.toggle('is-on', estado.soloStock));
}

function initCatalogo() {
  const chipsCat = document.getElementById('chipsCat');
  const chipsCc = document.getElementById('chipsCc');
  const chipsStock = document.getElementById('chipsStock');
  const buscar = document.getElementById('buscar');
  const mas = document.getElementById('verMas');

  chipsCat.innerHTML = CATEGORIAS.map(c => `<button type="button" class="chip" data-valor="${esc(c.id)}">${esc(c.nombre)}</button>`).join('');
  chipsCc.innerHTML = ['110', '150'].map(v => `<button type="button" class="chip" data-valor="${v}">${v} cc</button>`).join('');
  chipsStock.innerHTML = '<button type="button" class="chip" data-valor="stock">Solo con stock</button>';

  chipsCat.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => {
    estado.cat = estado.cat === c.dataset.valor ? '' : c.dataset.valor;
    sincronizarChips(); renderCatalogo(true);
  }));
  chipsCc.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => {
    estado.cc = estado.cc === c.dataset.valor ? '' : c.dataset.valor;
    sincronizarChips(); renderCatalogo(true);
  }));
  chipsStock.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => {
    estado.soloStock = !estado.soloStock;
    sincronizarChips(); renderCatalogo(true);
  }));

  let t = null;
  buscar?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { estado.texto = buscar.value; renderCatalogo(true); }, 180);
  });

  document.getElementById('limpiarFiltros')?.addEventListener('click', () => {
    estado.texto = ''; estado.cat = ''; estado.cc = ''; estado.marca = ''; estado.soloStock = false;
    if (buscar) buscar.value = '';
    sincronizarChips(); renderCatalogo(true);
  });

  const toggle = document.getElementById('filtrosToggle');
  const panel = document.getElementById('filtrosPanel');
  toggle?.addEventListener('click', () => {
    const abierto = panel.classList.toggle('abierto');
    toggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });

  document.getElementById('buscarToggle')?.addEventListener('click', () => {
    document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(() => buscar?.focus(), reduceMotion ? 0 : 520);
  });

  document.querySelectorAll('[data-filtro-cc]').forEach(b => b.addEventListener('click', () => {
    estado.cc = b.dataset.filtroCc;
    estado.cat = '';
    sincronizarChips();
    renderCatalogo(true);
    document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }));

  document.querySelectorAll('.slide-cta [data-cat]').forEach(b => b.addEventListener('click', () => {
    estado.cat = b.dataset.cat;
    sincronizarChips();
    renderCatalogo(true);
  }));

  mas?.addEventListener('click', () => { estado.pagina++; renderCatalogo(); });

  renderCatalogo(true);
}

let modalPrevio = null;

function abrirModal(id) {
  const p = getProducto(id);
  const modal = document.getElementById('modal');
  const cuerpo = document.getElementById('modalCuerpo');
  if (!p || !modal || !cuerpo) return;
  modalPrevio = document.activeElement;
  const final = precioFinal(p);
  const cc = p.cc.length === 2 ? '110 y 150 cc' : p.cc[0] + ' cc';
  const relacionados = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  cuerpo.innerHTML = `
    <div class="modal-foto"><img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1200" height="1200" decoding="async"></div>
    <div class="modal-datos">
      <p class="modal-meta"><span class="prod-cc">${esc(cc)}</span><span class="prod-medida">${esc(p.medida)}</span></p>
      <h2 id="modalTitulo">${esc(p.nombre)}</h2>
      <p class="modal-precio">${p.descuento > 0 ? `<span class="precio">${formatearPrecio(final)}</span><s class="precio-viejo">${formatearPrecio(p.precio)}</s><span class="badge-desc badge-inline">-${p.descuento}%</span>` : `<span class="precio">${formatearPrecio(final)}</span>`}</p>
      <p class="modal-desc">${esc(p.desc)}</p>
      <ul class="modal-fichas">
        <li><span>Rubro</span><strong>${esc(CATEGORIAS.find(c => c.id === p.cat)?.nombre || '')} · ${esc(p.sub)}</strong></li>
        <li><span>Medida</span><strong>${esc(p.medida)}</strong></li>
        <li><span>Entra en</span><strong>${esc(cc)}</strong></li>
        <li><span>Stock</span><strong>${p.stock} unidades</strong></li>
      </ul>
      <div class="modal-acciones">
        <div class="stepper" data-stepper="${esc(p.id)}">
          <button type="button" class="step-menos" aria-label="Quitar una unidad">−</button>
          <span class="step-n">1</span>
          <button type="button" class="step-mas" aria-label="Sumar una unidad">+</button>
        </div>
        <button type="button" class="btn btn-cta btn-lg" data-add="${esc(p.id)}">Agregar al carrito</button>
      </div>
      <a class="link-flecha" href="https://wa.me/${WSP}" data-wsp-msg="Hola Moto Indarte, quiero consultar por ${p.nombre} (${p.medida}). ¿Me entra en mi moto?" target="_blank" rel="noopener">Consultar compatibilidad por WhatsApp <span aria-hidden="true">→</span></a>
    </div>
    ${relacionados.length ? `<div class="modal-relacionados">
      <p class="modal-rel-titulo">También te puede servir</p>
      <div class="rel-grid">${relacionados.map(r => `<button type="button" class="rel" data-ver="${esc(r.id)}">
        <img src="${esc(r.img)}" alt="${esc(r.nombre)}" width="600" height="600" loading="lazy" decoding="async">
        <span class="rel-nombre">${esc(r.nombre)}</span>
        <span class="rel-precio">${formatearPrecio(precioFinal(r))}</span>
      </button>`).join('')}</div>
    </div>` : ''}`;
  conectarCards(cuerpo);
  initWspLinks();
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  document.getElementById('modalClose')?.focus();
}

function cerrarModal() {
  const modal = document.getElementById('modal');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('no-scroll');
  modalPrevio?.focus();
}

function initModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  modal.querySelector('[data-modal-close]')?.addEventListener('click', cerrarModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) cerrarModal();
    if (e.key === 'Tab' && !modal.hidden) atraparFoco(e, modal.querySelector('.modal-caja'));
  });
}

function atraparFoco(e, caja) {
  if (!caja) return;
  const focos = caja.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focos.length) return;
  const primero = focos[0];
  const ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

let drawerPrevio = null;

function abrirDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer) return;
  drawerPrevio = document.activeElement;
  drawer.classList.add('abierto');
  drawer.removeAttribute('inert');
  bd?.classList.add('abierto');
  document.body.classList.add('no-scroll');
  document.getElementById('drawerClose')?.focus();
}

function cerrarDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer) return;
  drawer.classList.remove('abierto');
  drawer.setAttribute('inert', '');
  bd?.classList.remove('abierto');
  document.body.classList.remove('no-scroll');
  drawerPrevio?.focus();
}

function renderDrawer() {
  const cuerpo = document.getElementById('drawerCuerpo');
  const pie = document.getElementById('drawerPie');
  if (!cuerpo || !pie) return;
  const items = Cart.get();
  if (!items.length) {
    cuerpo.innerHTML = `<div class="drawer-vacio">
      <p class="drawer-vacio-titulo">El carrito está vacío</p>
      <p>Arrancá por tu moto y sumá solo lo que le entra.</p>
      <button type="button" class="btn btn-cta btn-lg" id="drawerIrTienda">Ver el catálogo</button>
    </div>`;
    pie.innerHTML = '';
    document.getElementById('drawerIrTienda')?.addEventListener('click', () => {
      cerrarDrawer();
      document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    return;
  }
  cuerpo.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<article class="linea" data-linea="${esc(p.id)}">
      <img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="300" height="300" loading="lazy" decoding="async">
      <div class="linea-datos">
        <p class="linea-nombre">${esc(p.nombre)}</p>
        <p class="linea-medida">${esc(p.medida)}</p>
        <p class="linea-precio">${formatearPrecio(precioFinal(p))}</p>
        <div class="linea-qty">
          <button type="button" data-menos="${esc(p.id)}" aria-label="Quitar una unidad de ${esc(p.nombre)}">−</button>
          <span>${i.qty}</span>
          <button type="button" data-mas="${esc(p.id)}" aria-label="Sumar una unidad de ${esc(p.nombre)}">+</button>
        </div>
      </div>
      <button type="button" class="linea-quitar" data-quitar="${esc(p.id)}" aria-label="Quitar ${esc(p.nombre)} del carrito">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </article>`;
  }).join('');

  pie.innerHTML = `<div class="drawer-total"><span>Total</span><strong>${formatearPrecio(Cart.total())}</strong></div>
    <button type="button" class="btn btn-cta btn-lg" id="finalizar">Finalizar compra</button>
    <button type="button" class="btn btn-linea" id="vaciar">Vaciar carrito</button>`;

  cuerpo.querySelectorAll('[data-menos]').forEach(b => b.addEventListener('click', () => {
    const it = Cart.get().find(x => x.id === b.dataset.menos);
    if (!it) return;
    if (it.qty <= 1) Cart.remove(b.dataset.menos); else Cart.setQty(b.dataset.menos, it.qty - 1);
  }));
  cuerpo.querySelectorAll('[data-mas]').forEach(b => b.addEventListener('click', () => {
    const it = Cart.get().find(x => x.id === b.dataset.mas);
    if (it) Cart.setQty(b.dataset.mas, it.qty + 1);
  }));
  cuerpo.querySelectorAll('[data-quitar]').forEach(b => b.addEventListener('click', () => Cart.remove(b.dataset.quitar)));

  document.getElementById('finalizar')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.getElementById('vaciar')?.addEventListener('click', () => { Cart.clear(); showToast('Carrito vacío'); });
}

function initDrawer() {
  document.getElementById('cartHeader')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarDrawer);
  document.addEventListener('keydown', e => {
    const drawer = document.getElementById('drawer');
    if (!drawer?.classList.contains('abierto')) return;
    if (e.key === 'Escape') cerrarDrawer();
    if (e.key === 'Tab') atraparFoco(e, drawer);
  });
  document.addEventListener('cart:updated', renderDrawer);
  renderDrawer();
  updateCartBadge();
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const mapa = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView([-31.4201, -64.1888], 14);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19
  }).addTo(mapa);
  L.circleMarker([-31.4201, -64.1888], {
    radius: 11, color: '#14171C', weight: 3, fillColor: '#FFFF00', fillOpacity: 1
  }).addTo(mapa).bindPopup('Moto Indarte · Córdoba Capital');
}

let revealsListos = false;

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
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
  if (!revealsListos) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
  setTimeout(() => cont.querySelectorAll('[data-animate]:not(.in)').forEach(el => el.classList.add('in')), 700);
}

function initMovimiento() {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  if (typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  if (reduceMotion) return;

  document.querySelectorAll('[data-parallax]').forEach(el => {
    const img = el.querySelector('img');
    if (!img) return;
    const factor = parseFloat(el.getAttribute('data-parallax')) || 0.05;
    gsap.fromTo(img,
      { yPercent: -factor * 100 },
      { yPercent: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }
    );
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}

initWspLinks();
initNav();
initHero();
initCategorias();
initRail();
initMoto();
initVidriera();
initCatalogo();
initModal();
initDrawer();
initMapa();
initReveals();
initFloats();
initMovimiento();
