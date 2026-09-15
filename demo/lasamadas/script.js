const HAS_DOM = typeof document !== 'undefined';

if (HAS_DOM) {
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
      e.preventDefault();
    }
  });
}

const reduceMotion = HAS_DOM && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491165051505';
const ENVIO_GRATIS_DESDE = 60000;

const CATEGORIAS = {
  lavanderia: 'Lavandería',
  perfumeria: 'Perfumería',
  textil: 'Cuidado textil'
};

const PRODUCTOS = [
  {
    id: 'lavado-kilo', cat: 'lavanderia', tipo: 'servicio', destacado: true, descuento: 0,
    nombre: 'Lavado por kilo · puerta a puerta',
    img: 'images/pack-lavanderia-puerta-a-puerta_1x1.webp',
    desc: 'Pasamos a buscar tu bolsa, lavamos, secamos y doblamos. Volvés a tenerla en 24 a 48 horas, perfumada y atada con nuestro lazo. El retiro y la entrega no tienen costo.',
    variantes: [
      { nombre: 'Bolsa 5 kg', precio: 18900 },
      { nombre: 'Bolsa 10 kg', precio: 33900 },
      { nombre: 'Bolsa 15 kg', precio: 46900 }
    ],
    ficha: { 'Incluye': 'Lavado, secado y doblado', 'Perfumina': 'Incluida', 'Entrega': '24 a 48 h', 'Retiro': 'Sin cargo' },
    tags: ['lavado', 'kilo', 'bolsa', 'ropa', 'puerta a puerta', 'domicilio']
  },
  {
    id: 'lavado-planchado', cat: 'lavanderia', tipo: 'servicio', destacado: true, descuento: 0,
    nombre: 'Lavado + planchado',
    img: 'images/lavanderia-premium-y-planchado_4x5.webp',
    desc: 'Para la ropa que usás para trabajar o salir. Lavamos, planchamos prenda por prenda y te la devolvemos colgada en percha, lista para el placard.',
    variantes: [
      { nombre: 'Bolsa 5 kg', precio: 27900 },
      { nombre: 'Bolsa 10 kg', precio: 49900 }
    ],
    ficha: { 'Incluye': 'Lavado y planchado', 'Entrega': 'En percha', 'Plazo': '48 h', 'Retiro': 'Sin cargo' },
    tags: ['planchado', 'plancha', 'camisas', 'percha', 'lavado']
  },
  {
    id: 'ropa-blanca', cat: 'lavanderia', tipo: 'servicio', destacado: false, descuento: 0,
    nombre: 'Ropa de cama y toallones',
    img: 'images/perfumes-y-cuidado-textil_5x3.webp',
    desc: 'Sábanas, acolchados, toallas y toallones. Van a un lavado aparte con temperatura y secado propios, porque el blanco no se trata como el resto.',
    variantes: [
      { nombre: 'Juego 1 plaza', precio: 16900 },
      { nombre: 'Juego 2 plazas', precio: 22900 },
      { nombre: 'Juego king', precio: 28900 }
    ],
    ficha: { 'Incluye': 'Lavado y doblado', 'Lavado': 'Separado del resto', 'Plazo': '48 h', 'Retiro': 'Sin cargo' },
    tags: ['sabanas', 'acolchado', 'toallas', 'toallones', 'cama', 'blanco']
  },
  {
    id: 'perfume-rose', cat: 'perfumeria', tipo: 'producto', destacado: true, descuento: 10,
    nombre: 'Perfume internacional Rosé',
    img: 'images/perfume-internacional-rosado_1x1.webp',
    desc: 'Floral y luminoso, con salida de pera y corazón de rosa. Es el que más nos piden después de probar la perfumina: la misma familia olfativa, en frasco.',
    variantes: [
      { nombre: '50 ml', precio: 52900 },
      { nombre: '100 ml', precio: 79900 }
    ],
    ficha: { 'Familia': 'Floral frutal', 'Notas': 'Pera, rosa, almizcle', 'Duración': '6 a 8 h', 'Origen': 'Importado' },
    tags: ['perfume', 'rose', 'rosa', 'floral', 'frasco', 'importado', 'internacional']
  },
  {
    id: 'duo-perfumes', cat: 'perfumeria', tipo: 'producto', destacado: true, descuento: 15,
    nombre: 'Dúo de perfumes internacionales',
    img: 'images/duo-perfumes-internacionales_1x1.webp',
    desc: 'Dos perfumes que se llevan bien entre sí: uno floral para el día y uno amaderado para la noche. Viene con cinta y tarjeta, listo para regalar.',
    variantes: [{ nombre: 'Set x2 · 50 ml c/u', precio: 139900 }],
    ficha: { 'Incluye': '2 frascos de 50 ml', 'Presentación': 'Con cinta y tarjeta', 'Ideal': 'Para regalo', 'Origen': 'Importado' },
    tags: ['perfumes', 'duo', 'set', 'regalo', 'combo', 'internacional']
  },
  {
    id: 'perfumina', cat: 'textil', tipo: 'producto', destacado: true, descuento: 0,
    nombre: 'Perfumina premium textil',
    img: 'images/perfumina-premium-textil_1x1.webp',
    desc: 'La misma que usamos para terminar cada pedido de lavandería. Se rocía sobre la ropa seca, la almohada o el placard, y el perfume queda por días.',
    variantes: [
      { nombre: '250 ml', precio: 12900 },
      { nombre: '500 ml', precio: 19900 }
    ],
    ficha: { 'Uso': 'Ropa, blanquería y placard', 'Rinde': 'Hasta 250 aplicaciones', 'Fijación': 'Hasta 5 días', 'Mancha': 'No mancha las telas' },
    tags: ['perfumina', 'textil', 'aroma', 'ropa', 'spray', 'placard']
  },
  {
    id: 'duo-detergente', cat: 'textil', tipo: 'producto', destacado: false, descuento: 0,
    nombre: 'Dúo detergente + suavizante premium',
    img: 'images/detergente-y-suavizante-premium_1x1.webp',
    desc: 'Los dos productos con los que lavamos acá. Concentrados: con media tapita alcanza para un lavarropas lleno, y el suavizante deja la ropa lista para planchar.',
    variantes: [{ nombre: 'Dúo 2 L', precio: 24900 }],
    ficha: { 'Incluye': 'Detergente 1 L + suavizante 1 L', 'Rinde': '40 lavados', 'Tipo': 'Concentrado', 'Apto': 'Todo tipo de lavarropas' },
    tags: ['detergente', 'suavizante', 'jabon', 'lavado', 'duo', 'combo']
  },
  {
    id: 'sachets', cat: 'textil', tipo: 'producto', destacado: false, descuento: 0,
    nombre: 'Sachets y perlas aromáticas',
    img: 'images/sachets-y-perlas-aromaticas_1x1.webp',
    desc: 'Para el cajón, el placard o el auto. Las perlas van en el frasco abierto y los sachets entre la ropa: perfuman durante meses sin hacer nada.',
    variantes: [
      { nombre: 'Lavanda', precio: 9900 },
      { nombre: 'Rosas', precio: 9900 },
      { nombre: 'Vainilla', precio: 9900 }
    ],
    ficha: { 'Incluye': '2 sachets + frasco de perlas', 'Duración': 'Hasta 3 meses', 'Uso': 'Placard, cajón o auto', 'Aromas': 'Lavanda, rosas o vainilla' },
    tags: ['sachets', 'perlas', 'aromaticas', 'lavanda', 'placard', 'aroma']
  }
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const varianteDe = (p, nombre) => p.variantes.find(v => v.nombre === nombre) || p.variantes[0];
const precioBase = (p, vn) => varianteDe(p, vn).precio;
const precioFinal = (p, vn) => p.descuento > 0 ? Math.round(precioBase(p, vn) * (1 - p.descuento / 100)) : precioBase(p, vn);
const precioDesde = p => Math.min(...p.variantes.map(v => p.descuento > 0 ? Math.round(v.precio * (1 - p.descuento / 100)) : v.precio));
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const Cart = {
  KEY: 'lasamadas_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    if (HAS_DOM) document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, variante, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.variante === variante);
    if (existing) existing.qty = Math.min(existing.qty + qty, 99);
    else items.push({ id: producto.id, variante, qty: Math.min(qty, 99) });
    this.save(items);
  },
  setQty(id, variante, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.variante === variante);
    if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 99));
    this.save(items);
  },
  remove(id, variante) { this.save(this.get().filter(i => !(i.id === id && i.variante === variante))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  lineas() {
    return this.get().map(i => {
      const p = getProducto(i.id);
      if (!p) return null;
      return { producto: p, variante: i.variante, qty: i.qty, subtotal: precioFinal(p, i.variante) * i.qty };
    }).filter(Boolean);
  },
  total() { return this.lineas().reduce((s, l) => s + l.subtotal, 0); },
  totalProductos() { return this.lineas().filter(l => l.producto.tipo === 'producto').reduce((s, l) => s + l.subtotal, 0); }
};

function showToast(msg) {
  let wrap = document.getElementById('toastWrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.id = 'toastWrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

const ICO_LAZO = '<svg viewBox="0 0 28 22" fill="none" aria-hidden="true"><path d="M14 11c-3-2.9-6.1-2-6.1.3 0 1.6 1.6 2.5 2.9 2.5 1.5 0 2.7-1.2 3.2-2.8z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 11c3-2.9 6.1-2 6.1.3 0 1.6-1.6 2.5-2.9 2.5-1.5 0-2.7-1.2-3.2-2.8z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 11v8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

let filtroCat = 'all';
let filtroTexto = '';
const qtyCard = {};

function estadoEnvio(subtotalProductos) {
  const falta = Math.max(0, ENVIO_GRATIS_DESDE - subtotalProductos);
  return {
    falta,
    gratis: falta === 0,
    pct: Math.max(0, Math.min(100, (subtotalProductos / ENVIO_GRATIS_DESDE) * 100))
  };
}

function productosFiltrados(cat = filtroCat, texto = filtroTexto) {
  const q = normalizar(texto).trim();
  return PRODUCTOS.filter(p => {
    if (cat !== 'all' && p.cat !== cat) return false;
    if (!q) return true;
    const heno = normalizar([p.nombre, CATEGORIAS[p.cat], p.desc, p.tags.join(' '), p.variantes.map(v => v.nombre).join(' ')].join(' '));
    return q.split(/\s+/).every(t => heno.includes(t));
  });
}

function cardHTML(p) {
  const qty = qtyCard[p.id] || 1;
  const vn = p.variantes[0].nombre;
  const pf = precioFinal(p, vn);
  const multi = p.variantes.length > 1;
  const badge = p.descuento > 0
    ? `<span class="card-badge">-${p.descuento}%</span>`
    : (p.tipo === 'servicio' ? `<span class="card-badge is-serv">${ICO_LAZO}Puerta a puerta</span>` : '');
  return `
    <article class="card" data-id="${esc(p.id)}">
      ${badge}
      <button type="button" class="card-open" data-open="${esc(p.id)}" aria-label="Ver detalle de ${esc(p.nombre)}">
        <img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1254" height="1254" loading="lazy" decoding="async">
      </button>
      <div class="card-body">
        <p class="card-cat">${esc(CATEGORIAS[p.cat])}</p>
        <h3 class="card-nom">${esc(p.nombre)}</h3>
        <p class="card-precio">
          <b>${formatearPrecio(pf)}</b>
          ${p.descuento > 0 ? `<s>${formatearPrecio(precioBase(p, vn))}</s>` : ''}
          ${multi ? '<span class="card-desde">desde</span>' : ''}
        </p>
        <div class="card-acciones">
          <span class="qty">
            <button type="button" data-q="-" data-id="${esc(p.id)}" aria-label="Quitar uno">−</button>
            <span data-qty="${esc(p.id)}">${qty}</span>
            <button type="button" data-q="+" data-id="${esc(p.id)}" aria-label="Sumar uno">+</button>
          </span>
          <button type="button" class="btn-add" data-add="${esc(p.id)}">Agregar</button>
        </div>
      </div>
    </article>`;
}

function renderGrid(animarFlip) {
  const grid = document.getElementById('gridProductos');
  const vacio = document.getElementById('vacio');
  const res = document.getElementById('resultados');
  const limpiar = document.getElementById('limpiar');
  if (!grid) return;

  const lista = productosFiltrados();
  const state = (animarFlip && typeof Flip !== 'undefined' && !reduceMotion) ? Flip.getState(grid.querySelectorAll('.card')) : null;

  grid.innerHTML = lista.map(cardHTML).join('');
  vacio.hidden = lista.length > 0;
  res.textContent = lista.length === 1 ? '1 producto' : `${lista.length} productos`;
  limpiar.hidden = filtroCat === 'all' && !filtroTexto;

  if (state) {
    Flip.from(state, { duration: .5, ease: 'power2.out', absolute: true, stagger: .03 });
  } else if (!reduceMotion && typeof gsap !== 'undefined') {
    gsap.fromTo(grid.querySelectorAll('.card'),
      { y: 46, opacity: 0 },
      { y: 0, opacity: 1, duration: .8, ease: 'power3.out', stagger: .07, overwrite: true });
  }
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function initFiltros() {
  const buscar = document.getElementById('buscar');
  const clear = document.getElementById('buscarClear');
  const chips = document.getElementById('chips');
  const limpiar = document.getElementById('limpiar');
  const vacioReset = document.getElementById('vacioReset');

  buscar?.addEventListener('input', () => {
    filtroTexto = buscar.value;
    clear.hidden = !filtroTexto;
    renderGrid(true);
  });
  clear?.addEventListener('click', () => {
    buscar.value = ''; filtroTexto = ''; clear.hidden = true; renderGrid(true); buscar.focus();
  });
  chips?.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chips.querySelectorAll('.chip').forEach(c => c.classList.remove('is-on'));
      chip.classList.add('is-on');
      filtroCat = chip.dataset.cat;
      renderGrid(true);
    });
  });
  const resetTodo = () => {
    filtroCat = 'all'; filtroTexto = '';
    if (buscar) buscar.value = '';
    if (clear) clear.hidden = true;
    chips?.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-on', c.dataset.cat === 'all'));
    renderGrid(true);
  };
  limpiar?.addEventListener('click', resetTodo);
  vacioReset?.addEventListener('click', resetTodo);

  document.getElementById('gridProductos')?.addEventListener('click', e => {
    const open = e.target.closest('[data-open]');
    if (open) { abrirModal(open.dataset.open); return; }
    const q = e.target.closest('[data-q]');
    if (q) {
      const id = q.dataset.id;
      const actual = qtyCard[id] || 1;
      qtyCard[id] = Math.max(1, Math.min(99, actual + (q.dataset.q === '+' ? 1 : -1)));
      const el = document.querySelector(`[data-qty="${CSS.escape(id)}"]`);
      if (el) el.textContent = qtyCard[id];
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      Cart.add(p, p.variantes[0].nombre, qtyCard[p.id] || 1);
      qtyCard[p.id] = 1;
      const el = document.querySelector(`[data-qty="${CSS.escape(p.id)}"]`);
      if (el) el.textContent = 1;
      showToast(p.tipo === 'servicio' ? '¡Listo! Lo sumamos al retiro' : '¡Agregado! Tu pedido te espera');
    }
  });
}

/* ---------- carrito ---------- */
function grupoHTML(titulo, ico, lineas) {
  if (!lineas.length) return '';
  return `
    <div class="cart-grupo">
      <p class="cart-grupo-tit">${ico}${esc(titulo)}</p>
      ${lineas.map(l => `
        <div class="cart-item">
          <span class="cart-item-img"><img src="${esc(l.producto.img)}" alt="" width="62" height="62"></span>
          <div>
            <p class="cart-item-nom">${esc(l.producto.nombre)}</p>
            <p class="cart-item-var">${esc(l.variante)}</p>
            <p class="cart-item-precio">${formatearPrecio(l.subtotal)}</p>
          </div>
          <div class="cart-item-side">
            <span class="cart-qty">
              <button type="button" data-cq="-" data-id="${esc(l.producto.id)}" data-var="${esc(l.variante)}" aria-label="Quitar uno">−</button>
              <span>${l.qty}</span>
              <button type="button" data-cq="+" data-id="${esc(l.producto.id)}" data-var="${esc(l.variante)}" aria-label="Sumar uno">+</button>
            </span>
            <button type="button" class="cart-del" data-del="${esc(l.producto.id)}" data-var="${esc(l.variante)}">Quitar</button>
          </div>
        </div>`).join('')}
    </div>`;
}

const ICO_RETIRO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 21V9l9-6 9 6v12" stroke-linejoin="round"/><path d="M9 21v-6h6v6" stroke-linejoin="round"/></svg>';
const ICO_ENVIO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="1.5" y="6" width="13" height="10" rx="1.5"/><path d="M14.5 9.5h4l3 3.2V16h-7z" stroke-linejoin="round"/><circle cx="6" cy="18.5" r="1.6"/><circle cx="17.5" cy="18.5" r="1.6"/></svg>';

function renderCart() {
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  const envio = document.getElementById('cartEnvio');
  const badge = document.getElementById('cartBadge');
  if (!body) return;

  const lineas = Cart.lineas();
  const n = Cart.count();
  if (badge) {
    badge.textContent = n;
    badge.classList.toggle('show', n > 0);
  }

  if (!lineas.length) {
    body.innerHTML = `
      <div class="cart-vacio">
        <span class="cart-vacio-ico">${ICO_LAZO}</span>
        <h3>Todavía no elegiste nada</h3>
        <p>Sumá un lavado, un perfume o las dos cosas: se coordinan en un mismo pedido.</p>
      </div>`;
    foot.innerHTML = '';
    envio.innerHTML = '';
    return;
  }

  const servicios = lineas.filter(l => l.producto.tipo === 'servicio');
  const productos = lineas.filter(l => l.producto.tipo === 'producto');
  body.innerHTML = grupoHTML('Pasamos a buscar', ICO_RETIRO, servicios) + grupoHTML('Te enviamos', ICO_ENVIO, productos);

  if (productos.length) {
    const { falta, gratis, pct } = estadoEnvio(Cart.totalProductos());
    envio.innerHTML = !gratis
      ? `<p class="envio-txt">Te faltan <b>${formatearPrecio(falta)}</b> para el envío gratis</p><span class="envio-bar"><i style="width:${pct}%"></i></span>`
      : `<p class="envio-txt">¡Tenés envío gratis! 🎉</p><span class="envio-bar"><i style="width:100%"></i></span>`;
  } else {
    envio.innerHTML = `<p class="envio-txt">El retiro y la entrega van sin cargo 🚚</p>`;
  }

  foot.innerHTML = `
    <div class="cart-total"><span>Total del pedido</span><b>${formatearPrecio(Cart.total())}</b></div>
    <button type="button" class="btn btn-primary" id="cartWsp">Cerrar pedido por WhatsApp</button>
    <p class="cart-nota">Coordinamos retiro y envío por chat. No se paga nada en la web.</p>`;
}

function mensajeWsp() {
  const lineas = Cart.lineas();
  const servicios = lineas.filter(l => l.producto.tipo === 'servicio');
  const productos = lineas.filter(l => l.producto.tipo === 'producto');
  const txt = ['Hola Las Amadas! Quiero hacer este pedido:', ''];
  if (servicios.length) {
    txt.push('— PASAN A BUSCAR —');
    servicios.forEach(l => txt.push(`• ${l.producto.nombre} (${l.variante}) x${l.qty} — ${formatearPrecio(l.subtotal)}`));
    txt.push('');
  }
  if (productos.length) {
    txt.push('— ME ENVÍAN —');
    productos.forEach(l => txt.push(`• ${l.producto.nombre} (${l.variante}) x${l.qty} — ${formatearPrecio(l.subtotal)}`));
    txt.push('');
  }
  txt.push(`Total: ${formatearPrecio(Cart.total())}`);
  if (servicios.length) txt.push('', 'Coordinamos el retiro?');
  return txt.join('\n');
}

function initCart() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  const openBtn = document.getElementById('cartBtn');
  const closeBtn = document.getElementById('cartClose');
  if (!drawer) return;

  const open = () => {
    drawer.classList.add('open'); backdrop.classList.add('open');
    drawer.removeAttribute('inert'); document.body.classList.add('no-scroll');
    closeBtn?.focus();
    if (!reduceMotion && typeof gsap !== 'undefined') {
      gsap.fromTo(drawer.querySelectorAll('.cart-item'), { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: .42, ease: 'power2.out', stagger: .05 });
    }
  };
  const close = () => {
    drawer.classList.remove('open'); backdrop.classList.remove('open');
    drawer.setAttribute('inert', ''); document.body.classList.remove('no-scroll');
    openBtn?.focus();
  };
  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) close(); });
  document.addEventListener('cart:abrir', open);

  drawer.addEventListener('click', e => {
    const cq = e.target.closest('[data-cq]');
    if (cq) {
      const linea = Cart.get().find(i => i.id === cq.dataset.id && i.variante === cq.dataset.var);
      if (linea) Cart.setQty(cq.dataset.id, cq.dataset.var, linea.qty + (cq.dataset.cq === '+' ? 1 : -1));
      return;
    }
    const del = e.target.closest('[data-del]');
    if (del) { Cart.remove(del.dataset.del, del.dataset.var); return; }
    if (e.target.closest('#cartWsp')) {
      window.open(`https://wa.me/${WSP}?text=${encodeURIComponent(mensajeWsp())}`, '_blank', 'noopener');
    }
  });

  document.addEventListener('cart:updated', () => {
    renderCart();
    const badge = document.getElementById('cartBadge');
    if (badge && Cart.count() > 0) {
      badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump');
    }
  });
  renderCart();
}

/* ---------- modal ---------- */
let modalVarSel = null;
let modalQty = 1;
let modalProdId = null;
let lastFocus = null;

function modalHTML(p) {
  const vn = modalVarSel || p.variantes[0].nombre;
  const pf = precioFinal(p, vn);
  const multi = p.variantes.length > 1;
  return `
    <div class="modal-grid">
      <div class="modal-media"><img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1254" height="1254"></div>
      <div class="modal-info">
        <p class="card-cat">${esc(CATEGORIAS[p.cat])}</p>
        <h3>${esc(p.nombre)}</h3>
        <p class="modal-precio">
          <b>${formatearPrecio(pf)}</b>
          ${p.descuento > 0 ? `<s>${formatearPrecio(precioBase(p, vn))}</s><span class="card-badge" style="position:static">-${p.descuento}%</span>` : ''}
        </p>
        <p class="modal-desc">${esc(p.desc)}</p>
        ${multi ? `<p class="var-label">${p.cat === 'lavanderia' ? 'Elegí el tamaño' : p.id === 'sachets' ? 'Elegí el aroma' : 'Elegí la presentación'}</p>
        <div class="var-opts">${p.variantes.map(v => `<button type="button" class="var-opt${v.nombre === vn ? ' is-on' : ''}" data-var="${esc(v.nombre)}">${esc(v.nombre)}</button>`).join('')}</div>` : ''}
        <dl class="modal-ficha">
          ${Object.entries(p.ficha).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}
        </dl>
        <div class="modal-acciones">
          <span class="qty">
            <button type="button" data-mq="-" aria-label="Quitar uno">−</button>
            <span id="modalQty">${modalQty}</span>
            <button type="button" data-mq="+" aria-label="Sumar uno">+</button>
          </span>
          <button type="button" class="btn btn-ghost" id="modalAdd">Agregar</button>
          <button type="button" class="btn btn-primary" id="modalBuy">Comprar ahora</button>
        </div>
        <p class="modal-nota">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01" stroke-linecap="round"/></svg>
          ${p.tipo === 'servicio' ? 'Pasamos a buscarlo por tu casa, sin cargo.' : 'Envío gratis en compras desde ' + formatearPrecio(ENVIO_GRATIS_DESDE) + '.'}
        </p>
      </div>
    </div>`;
}

function abrirModal(id) {
  const p = getProducto(id);
  if (!p) return;
  const modal = document.getElementById('modalProducto');
  const backdrop = document.getElementById('modalBackdrop');
  const inner = document.getElementById('modalInner');
  if (!modal) return;
  lastFocus = document.activeElement;
  modalProdId = id;
  modalVarSel = p.variantes[0].nombre;
  modalQty = 1;
  inner.innerHTML = modalHTML(p);
  modal.classList.add('open'); backdrop.classList.add('open');
  modal.removeAttribute('inert'); document.body.classList.add('no-scroll');
  modal.scrollTop = 0;
  document.getElementById('modalClose')?.focus();
}

function cerrarModal() {
  const modal = document.getElementById('modalProducto');
  const backdrop = document.getElementById('modalBackdrop');
  if (!modal?.classList.contains('open')) return;
  modal.classList.remove('open'); backdrop.classList.remove('open');
  modal.setAttribute('inert', ''); document.body.classList.remove('no-scroll');
  lastFocus?.focus();
}

function initModal() {
  const modal = document.getElementById('modalProducto');
  const backdrop = document.getElementById('modalBackdrop');
  if (!modal) return;
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  backdrop?.addEventListener('click', cerrarModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarModal(); });

  modal.addEventListener('click', e => {
    const p = getProducto(modalProdId);
    if (!p) return;
    const v = e.target.closest('[data-var]');
    if (v) {
      modalVarSel = v.dataset.var;
      document.getElementById('modalInner').innerHTML = modalHTML(p);
      return;
    }
    const mq = e.target.closest('[data-mq]');
    if (mq) {
      modalQty = Math.max(1, Math.min(99, modalQty + (mq.dataset.mq === '+' ? 1 : -1)));
      const el = document.getElementById('modalQty');
      if (el) el.textContent = modalQty;
      return;
    }
    if (e.target.closest('#modalAdd')) {
      Cart.add(p, modalVarSel, modalQty);
      showToast(p.tipo === 'servicio' ? '¡Listo! Lo sumamos al retiro' : '¡Agregado! Tu pedido te espera');
      return;
    }
    if (e.target.closest('#modalBuy')) {
      Cart.add(p, modalVarSel, modalQty);
      cerrarModal();
      document.dispatchEvent(new CustomEvent('cart:abrir'));
    }
  });
}

/* ---------- nav / wsp / reveals ---------- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  const header = document.querySelector('.site-header');
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; header.appendChild(bd); }
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
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
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initReveals() {
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

function initHero() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-bg img', { scale: 1.08, duration: 1.3, ease: 'power2.out' }, 0)
    .from('.hero-eyebrow', { y: 16, opacity: 0, duration: .6 }, .15)
    .from('.hero-title .hl i', { yPercent: 112, duration: .9, stagger: .085 }, .2)
    .from('.hero-sub', { y: 20, opacity: 0, duration: .7 }, .5)
    .from('.hero-cta .btn', { y: 18, opacity: 0, duration: .6, stagger: .09 }, .62)
    .from('.scene-disc', { scale: .82, opacity: 0, duration: .9 }, .3)
    .from('.scene-hero-cut', { y: 46, opacity: 0, rotate: -5, duration: 1.05 }, .38)
    .from('.scene-tag', { scale: .86, opacity: 0, duration: .55, ease: 'back.out(1.7)' }, .95);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const amt = parseFloat(el.dataset.parallax) || .1;
    gsap.to(el, {
      yPercent: amt * 100,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: .6, invalidateOnRefresh: true }
    });
  });
  gsap.utils.toArray('.nosotras-cut').forEach(el => {
    gsap.to(el, {
      y: -26, ease: 'none',
      scrollTrigger: { trigger: '.nosotras', start: 'top bottom', end: 'top center', scrub: .6, invalidateOnRefresh: true }
    });
  });
}

/* ---------- coreografia mayor: el recorrido del lazo ---------- */
const REC_FONDOS = ['#eef0f5', '#f9fafb', '#fdf6f8', '#f2ecfb'];
const REC_CHIPS = ['Lunes, 9:40', 'Lunes, 15:20', 'Martes, 11:00', 'Miércoles, 10:15'];

function initRecorrido() {
  const stage = document.getElementById('recStage');
  const pasos = document.getElementById('recPasos');
  const chip = document.getElementById('recChip');
  const path = document.getElementById('cintaPath');
  const mono = document.getElementById('cintaMono');
  if (!stage || !pasos || !path) return;

  const items = Array.from(pasos.children);
  const largo = path.getTotalLength();
  path.style.strokeDasharray = largo;
  path.style.strokeDashoffset = largo;

  const setStep = progress => {
    const i = Math.min(items.length - 1, Math.max(0, Math.floor(progress * items.length)));
    items.forEach((li, n) => li.classList.toggle('is-on', n === i));
    if (chip) chip.textContent = REC_CHIPS[i];
    stage.style.backgroundColor = REC_FONDOS[i];
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    stage.classList.add('is-static');
    items.forEach(li => li.classList.add('is-on'));
    path.style.strokeDashoffset = 0;
    if (mono) mono.style.opacity = 1;
    return;
  }

  const construir = tl => {
    tl.to(path, { strokeDashoffset: 0, duration: .82, ease: 'none' }, 0)
      .fromTo(mono, { opacity: 0, scale: .6, transformOrigin: '160px 308px' },
        { opacity: 1, scale: 1, duration: .16, ease: 'back.out(2.2)' }, .82)
      .to({}, { duration: .06 });
  };

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, start: 'top top', end: '+=260%',
        pin: true, scrub: .6, invalidateOnRefresh: true,
        onUpdate: self => setStep(self.progress)
      }
    });
    construir(tl);
    setStep(0);
    return () => { gsap.set([path, mono], { clearProps: 'all' }); };
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, start: 'top top', end: 'bottom bottom',
        scrub: .6, invalidateOnRefresh: true,
        onUpdate: self => setStep(self.progress)
      }
    });
    construir(tl);
    setStep(0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      stage.classList.remove('is-sticky-mobile');
      gsap.set([path, mono], { clearProps: 'all' });
    };
  });
}

/* ---------- arranque ---------- */
if (HAS_DOM) {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    if (typeof Flip !== 'undefined') gsap.registerPlugin(Flip);
  }
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
  }

  renderGrid(false);
  initFiltros();
  initCart();
  initModal();
  initNav();
  initWspFloat();
  initReveals();
  initHero();
  initParallax();
  initRecorrido();

  const anioEl = document.getElementById('anio');
  if (anioEl) anioEl.textContent = new Date().getFullYear();

  (function inyectarSchemaProductos() {
    const base = location.href.split('#')[0];
    const grafo = PRODUCTOS.map(p => ({
      '@type': 'Product',
      name: p.nombre,
      description: p.desc,
      image: new URL(p.img, base).href,
      category: CATEGORIAS[p.cat],
      brand: { '@type': 'Brand', name: 'Las Amadas' },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'ARS',
        lowPrice: precioDesde(p),
        highPrice: Math.max(...p.variantes.map(v => p.descuento > 0 ? Math.round(v.precio * (1 - p.descuento / 100)) : v.precio)),
        offerCount: p.variantes.length,
        availability: 'https://schema.org/InStock'
      }
    }));
    const tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': grafo });
    document.head.appendChild(tag);
  })();

  if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());
    let lastH = document.documentElement.scrollHeight;
    let estables = 0;
    const vigilarAlto = () => {
      const h = document.documentElement.scrollHeight;
      if (h !== lastH) { lastH = h; estables = 0; ScrollTrigger.refresh(); }
      else estables++;
      if (estables < 20) setTimeout(vigilarAlto, 100);
    };
    setTimeout(vigilarAlto, 100);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PRODUCTOS, CATEGORIAS, ENVIO_GRATIS_DESDE, Cart,
    normalizar, formatearPrecio, getProducto, varianteDe,
    precioBase, precioFinal, precioDesde, productosFiltrados,
    estadoEnvio, mensajeWsp
  };
}
