document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491131539555';
const ENVIO_GRATIS_DESDE = 500000;
const CUOTAS = 12;
const ARMADO_PRECIO = 45000;

const CATEGORIAS = {
  cardio: 'Cardio',
  fuerza: 'Fuerza',
  combos: 'Combos'
};
const USOS = {
  hogar: 'Uso hogareño',
  semipro: 'Semi-profesional',
  pro: 'Profesional'
};

const PRODUCTOS = [
  {
    id: 'cinta',
    nombre: 'Cinta de correr profesional',
    cat: 'cardio',
    uso: 'pro',
    precio: 1290000,
    descuento: 0,
    badge: 'La más vendida',
    desc: 'Motor de 3 HP de uso continuo, superficie de 145 x 52 cm y amortiguación en 6 puntos. Plegado asistido con pistón, así queda contra la pared cuando no la usás.',
    ficha: { 'Motor': '3 HP continuos', 'Velocidad': 'Hasta 20 km/h', 'Superficie': '145 x 52 cm', 'Peso máximo': '150 kg', 'Plegable': 'Sí, asistido' },
    imgs: ['images/cinta-de-correr-profesional_1254x1254.webp', 'images/recorte-cinta_884x760.webp'],
    dim: [1254, 1254],
    tags: ['cinta', 'correr', 'caminar', 'running', 'trotadora', 'cardio']
  },
  {
    id: 'eliptica',
    nombre: 'Máquina elíptica',
    cat: 'cardio',
    uso: 'semipro',
    precio: 890000,
    descuento: 0,
    badge: 'Bajo impacto',
    desc: 'Entrena piernas, glúteos y tren superior sin golpear las articulaciones. Volante de inercia de 18 kg y 16 niveles de resistencia magnética.',
    ficha: { 'Volante': '18 kg', 'Resistencia': '16 niveles magnéticos', 'Zancada': '40 cm', 'Peso máximo': '130 kg', 'Monitor': 'LCD con pulsómetro' },
    imgs: ['images/maquina-eliptica_1254x1254.webp', 'images/recorte-eliptica_693x809.webp'],
    dim: [1254, 1254],
    tags: ['eliptica', 'elíptica', 'bajo impacto', 'cardio', 'rodillas']
  },
  {
    id: 'bici',
    nombre: 'Bicicleta de spinning',
    cat: 'cardio',
    uso: 'hogar',
    precio: 680000,
    descuento: 0,
    badge: '',
    desc: 'La más elegida para empezar: ocupa poco, es silenciosa y no necesita electricidad. Volante de 18 kg con resistencia por fricción y manubrio regulable.',
    ficha: { 'Volante': '18 kg', 'Resistencia': 'Fricción regulable', 'Regulación': 'Asiento y manubrio', 'Peso máximo': '120 kg', 'Ruedas': 'Sí, para moverla' },
    imgs: ['images/bicicleta-de-spinning_1254x1254.webp', 'images/recorte-bici_869x846.webp'],
    dim: [1254, 1254],
    tags: ['bici', 'bicicleta', 'spinning', 'ciclismo', 'cardio']
  },
  {
    id: 'remo',
    nombre: 'Máquina de remo',
    cat: 'cardio',
    uso: 'semipro',
    precio: 740000,
    descuento: 0,
    badge: 'Cuerpo completo',
    desc: 'El cardio más completo: mueve el 85% de los músculos en cada remada. Resistencia por aire y se guarda parada en menos de un metro cuadrado.',
    ficha: { 'Resistencia': 'Por aire, 10 niveles', 'Riel': 'Aluminio de 120 cm', 'Peso máximo': '135 kg', 'Guardado': 'Vertical', 'Monitor': 'Distancia, ritmo y calorías' },
    imgs: ['images/maquina-de-remo_1254x1254.webp', 'images/recorte-remo_900x638.webp'],
    dim: [1254, 1254],
    tags: ['remo', 'remador', 'cardio', 'espalda', 'cuerpo completo']
  },
  {
    id: 'multifuncion',
    nombre: 'Estación multifunción',
    cat: 'fuerza',
    uso: 'pro',
    precio: 1450000,
    descuento: 0,
    badge: 'Más de 20 ejercicios',
    desc: 'Reemplaza media sala de musculación: torre de peso de 90 kg, poleas altas y bajas, press de pecho, dorsalera y camilla de cuádriceps.',
    ficha: { 'Torre de peso': '90 kg', 'Ejercicios': 'Más de 20', 'Estructura': 'Acero de 2 mm', 'Medidas': '210 x 120 x 205 cm', 'Peso máximo': '150 kg' },
    imgs: ['images/maquina-multifuncion_1254x1254.webp', 'images/recorte-multifuncion_653x870.webp'],
    dim: [1254, 1254],
    tags: ['multifuncion', 'multifunción', 'fuerza', 'musculacion', 'musculación', 'poleas']
  },
  {
    id: 'banco',
    nombre: 'Banco regulable + mancuernas 20 kg',
    cat: 'fuerza',
    uso: 'hogar',
    precio: 420000,
    descuento: 0,
    badge: 'Para empezar',
    desc: 'Banco de 7 posiciones, de declinado a militar, con set de mancuernas hexagonales de goma. La base de cualquier rutina de fuerza en casa.',
    ficha: { 'Posiciones': '7 regulables', 'Mancuernas': 'Set de 20 kg', 'Estructura': 'Acero reforzado', 'Peso máximo': '250 kg', 'Tapizado': 'Ecocuero de alta densidad' },
    imgs: ['images/banco-y-mancuernas_1254x1254.webp', 'images/recorte-banco_888x637.webp'],
    dim: [1254, 1254],
    tags: ['banco', 'mancuernas', 'pesas', 'fuerza', 'musculacion']
  },
  {
    id: 'combo-home',
    nombre: 'Combo Home Gym',
    cat: 'combos',
    uso: 'hogar',
    precio: 2490000,
    descuento: 12,
    badge: 'Armado incluido',
    desc: 'Cinta profesional, bicicleta de spinning y banco con mancuernas. Todo lo que necesitás para entrenar cardio y fuerza, con el armado ya incluido.',
    ficha: { 'Incluye': 'Cinta + bici + banco', 'Armado': 'Incluido sin cargo', 'Espacio': 'Desde 2 x 2 metros', 'Garantía': '2 años en las 3 máquinas', 'Entrega': 'Coordinada en el día' },
    imgs: ['images/gimnasio-con-equipamiento-completo_1619x971.webp'],
    dim: [1600, 960],
    tags: ['combo', 'home gym', 'gimnasio', 'completo', 'pack']
  }
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const cuotaDe = n => Math.round(n / CUOTAS);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// El armado es un servicio opcional que suma al precio; los combos ya lo incluyen.
const OPCIONES_ENTREGA = ['Solo entrega', 'Entrega + armado'];
const llevaArmado = opt => opt === 'Entrega + armado';
const precioArmado = p => p.cat === 'combos' ? 0 : ARMADO_PRECIO;
const precioLinea = (p, opt) => precioFinal(p) + (llevaArmado(opt) ? precioArmado(p) : 0);

const Cart = {
  KEY: 'caprifitness_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, entrega = OPCIONES_ENTREGA[0]) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.entrega === entrega);
    if (existing) existing.qty = Math.min(existing.qty + qty, 9);
    else items.push({ id: producto.id, entrega, qty: Math.min(qty, 9) });
    this.save(items);
  },
  setQty(id, entrega, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.entrega === entrega);
    if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 9));
    this.save(items);
  },
  remove(id, entrega) { this.save(this.get().filter(i => !(i.id === id && i.entrega === entrega))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() {
    return this.get().reduce((s, i) => {
      const p = getProducto(i.id);
      return p ? s + precioLinea(p, i.entrega) * i.qty : s;
    }, 0);
  }
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

const estado = { cat: 'all', uso: 'all', q: '' };
const grid = document.getElementById('gridProductos');
const vacio = document.getElementById('vacio');
const resultados = document.getElementById('resultados');
const limpiarBtn = document.getElementById('limpiar');

function cardHTML(p) {
  const final = precioFinal(p);
  const badge = p.descuento > 0
    ? `<span class="card-badge">-${p.descuento}%</span>`
    : (p.badge ? `<span class="card-badge is-off">${esc(p.badge)}</span>` : '');
  const precio = p.descuento > 0
    ? `<s>${formatearPrecio(p.precio)}</s><b>${formatearPrecio(final)}</b>`
    : `<b>${formatearPrecio(final)}</b>`;
  return `
  <article class="card" data-id="${p.id}" data-cat="${p.cat}">
    <button type="button" class="card-open" aria-label="Ver ficha de ${esc(p.nombre)}">
      <img src="${p.imgs[0]}" alt="${esc(p.nombre)}" width="${p.dim[0]}" height="${p.dim[1]}" loading="lazy" decoding="async">
      ${badge}
      <span class="card-ver">Ver ficha</span>
    </button>
    <div class="card-body">
      <p class="card-cat">${esc(CATEGORIAS[p.cat] || '')}</p>
      <h3 class="card-name">${esc(p.nombre)}</h3>
      <p class="card-price">${precio}</p>
      <p class="card-cuotas">${CUOTAS} cuotas de ${formatearPrecio(cuotaDe(final))} sin interés</p>
      <div class="card-actions">
        <div class="card-qty">
          <button type="button" class="qty-btn" data-step="-1" aria-label="Quitar una unidad de ${esc(p.nombre)}">−</button>
          <span class="qty-val" data-qty>1</span>
          <button type="button" class="qty-btn" data-step="1" aria-label="Sumar una unidad de ${esc(p.nombre)}">+</button>
        </div>
        <button type="button" class="btn btn-primary btn-add">Agregar</button>
      </div>
    </div>
  </article>`;
}

function renderGrid() {
  if (!grid) return;
  grid.innerHTML = PRODUCTOS.map(cardHTML).join('');
  grid.querySelectorAll('.card').forEach(card => {
    card.dataset.qty = '1';
    card.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const actual = parseInt(card.dataset.qty, 10);
        const nueva = Math.max(1, Math.min(9, actual + Number(btn.dataset.step)));
        card.dataset.qty = String(nueva);
        card.querySelector('[data-qty]').textContent = nueva;
      });
    });
    card.querySelector('.card-open').addEventListener('click', () => abrirModal(card.dataset.id));
    card.querySelector('.btn-add').addEventListener('click', () => {
      const p = getProducto(card.dataset.id);
      if (!p) return;
      Cart.add(p, parseInt(card.dataset.qty, 10), OPCIONES_ENTREGA[0]);
      showToast('¡Sumada al pedido! Podés agregarle el armado en el carrito');
    });
  });
}

function coincide(p) {
  if (estado.cat !== 'all' && p.cat !== estado.cat) return false;
  if (estado.uso !== 'all' && p.uso !== estado.uso) return false;
  if (!estado.q) return true;
  const q = normalizar(estado.q);
  const heno = normalizar([p.nombre, CATEGORIAS[p.cat], USOS[p.uso], p.desc, p.tags.join(' '), Object.values(p.ficha).join(' ')].join(' '));
  return q.split(/\s+/).every(t => heno.includes(t));
}

function aplicarFiltros() {
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.card'));
  const usarFlip = typeof window.Flip !== 'undefined' && typeof gsap !== 'undefined' && !reduceMotion;
  const state = usarFlip ? window.Flip.getState(cards) : null;
  let visibles = 0;
  cards.forEach(card => {
    const p = getProducto(card.dataset.id);
    const ok = p ? coincide(p) : false;
    card.style.display = ok ? '' : 'none';
    if (ok) visibles++;
  });
  if (state) {
    window.Flip.from(state, {
      duration: 0.5,
      ease: 'power2.out',
      absolute: true,
      stagger: 0.03,
      onEnter: els => gsap.fromTo(els, { opacity: 0, y: 28, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.05, ease: 'power2.out' }),
      onLeave: els => gsap.to(els, { opacity: 0, duration: 0.2 })
    });
  }
  if (vacio) vacio.hidden = visibles > 0;
  if (resultados) resultados.textContent = visibles === 1 ? '1 máquina' : `${visibles} máquinas`;
  if (limpiarBtn) limpiarBtn.hidden = estado.cat === 'all' && estado.uso === 'all' && !estado.q;
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function initFiltros() {
  const buscar = document.getElementById('buscar');
  const clear = document.getElementById('buscarClear');
  document.querySelectorAll('#chips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#chips .chip').forEach(c => c.classList.remove('is-on'));
      chip.classList.add('is-on');
      estado.cat = chip.dataset.cat;
      aplicarFiltros();
    });
  });
  document.querySelectorAll('#chipsUso .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#chipsUso .chip').forEach(c => c.classList.remove('is-on'));
      chip.classList.add('is-on');
      estado.uso = chip.dataset.uso;
      aplicarFiltros();
    });
  });
  buscar?.addEventListener('input', () => {
    estado.q = buscar.value.trim();
    if (clear) clear.hidden = !estado.q;
    aplicarFiltros();
  });
  clear?.addEventListener('click', () => {
    if (buscar) buscar.value = '';
    estado.q = '';
    clear.hidden = true;
    aplicarFiltros();
    buscar?.focus();
  });
  const reset = () => {
    estado.cat = 'all';
    estado.uso = 'all';
    estado.q = '';
    if (buscar) buscar.value = '';
    if (clear) clear.hidden = true;
    document.querySelectorAll('#chips .chip').forEach(c => c.classList.toggle('is-on', c.dataset.cat === 'all'));
    document.querySelectorAll('#chipsUso .chip').forEach(c => c.classList.toggle('is-on', c.dataset.uso === 'all'));
    aplicarFiltros();
  };
  limpiarBtn?.addEventListener('click', reset);
  document.getElementById('vacioReset')?.addEventListener('click', reset);
}

const drawer = document.getElementById('cartDrawer');
const cartBackdrop = document.getElementById('cartBackdrop');
let ultimoFocoDrawer = null;

function renderCart() {
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  const envio = document.getElementById('cartEnvio');
  const badge = document.getElementById('cartBadge');
  if (!body || !foot || !envio) return;
  const items = Cart.get();
  const total = Cart.total();

  if (badge) {
    const n = Cart.count();
    badge.textContent = String(n);
    badge.style.display = n ? 'grid' : 'none';
  }

  if (!items.length) {
    envio.hidden = true;
    body.innerHTML = `
      <div class="cart-vacio">
        <span class="cart-vacio-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg></span>
        <h3>Todavía no elegiste ninguna</h3>
        <p>Mirá las máquinas y armá tu gimnasio. Te asesoramos sin compromiso.</p>
        <button type="button" class="btn btn-primary" data-cerrar-drawer>Ver las máquinas</button>
      </div>`;
    foot.innerHTML = '';
    return;
  }

  envio.hidden = false;
  const falta = ENVIO_GRATIS_DESDE - total;
  const pct = Math.min(100, Math.round(total / ENVIO_GRATIS_DESDE * 100));
  envio.innerHTML = falta > 0
    ? `<span>Te faltan <b>${formatearPrecio(falta)}</b> para el envío gratis</span><span class="envio-barra"><i style="width:${pct}%"></i></span>`
    : `<span><b>¡Tenés envío gratis! 🎉</b> Coordinamos la entrega en CABA y GBA</span><span class="envio-barra"><i style="width:100%"></i></span>`;

  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const armado = llevaArmado(i.entrega) && precioArmado(p) > 0;
    return `
      <div class="cart-item" data-id="${p.id}" data-entrega="${esc(i.entrega)}">
        <img src="${p.imgs[0]}" alt="${esc(p.nombre)}" width="74" height="74" loading="lazy" decoding="async">
        <div>
          <h4>${esc(p.nombre)}</h4>
          <p class="cart-item-opt">${esc(i.entrega)}${armado ? ` · +${formatearPrecio(precioArmado(p))}` : ''}</p>
          <div class="cart-item-row">
            <div class="cart-qty">
              <button type="button" data-step="-1" aria-label="Quitar una unidad de ${esc(p.nombre)}">−</button>
              <span>${i.qty}</span>
              <button type="button" data-step="1" aria-label="Sumar una unidad de ${esc(p.nombre)}">+</button>
            </div>
            <span class="cart-item-precio">${formatearPrecio(precioLinea(p, i.entrega) * i.qty)}</span>
          </div>
          <button type="button" class="cart-quitar">Quitar</button>
        </div>
      </div>`;
  }).join('');

  body.querySelectorAll('.cart-item').forEach(row => {
    const id = row.dataset.id;
    const entrega = row.dataset.entrega;
    row.querySelectorAll('.cart-qty button').forEach(btn => {
      btn.addEventListener('click', () => {
        const it = Cart.get().find(x => x.id === id && x.entrega === entrega);
        if (!it) return;
        Cart.setQty(id, entrega, it.qty + Number(btn.dataset.step));
      });
    });
    row.querySelector('.cart-quitar').addEventListener('click', () => Cart.remove(id, entrega));
  });

  foot.innerHTML = `
    <div class="cart-total"><span>Total</span><b>${formatearPrecio(total)}</b></div>
    <div class="cart-cuotas"><span>${CUOTAS} cuotas sin interés</span><span>${formatearPrecio(cuotaDe(total))} por mes</span></div>
    <p class="cart-nota">El envío y el armado se coordinan por WhatsApp después de la compra.</p>
    <button type="button" class="btn btn-primary btn-block" id="finalizar">Finalizar compra</button>
    <a class="btn btn-ghost btn-block" id="pedirWsp" href="#" target="_blank" rel="noopener">Consultar por WhatsApp</a>`;

  document.getElementById('finalizar').addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  const wsp = document.getElementById('pedirWsp');
  const detalle = items.map(i => {
    const p = getProducto(i.id);
    return p ? `• ${p.nombre} (${i.entrega}) x${i.qty} — ${formatearPrecio(precioLinea(p, i.entrega) * i.qty)}` : '';
  }).filter(Boolean).join('\n');
  wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(`Hola Capri Fitness! Quiero consultar por estas máquinas:\n${detalle}\n\nTotal: ${formatearPrecio(total)} (${CUOTAS} cuotas de ${formatearPrecio(cuotaDe(total))})`)}`;
}

function abrirDrawer() {
  if (!drawer) return;
  ultimoFocoDrawer = document.activeElement;
  drawer.classList.add('open');
  drawer.removeAttribute('inert');
  cartBackdrop?.classList.add('open');
  document.body.classList.add('no-scroll');
  drawer.querySelector('#cartClose')?.focus();
}
function cerrarDrawer() {
  if (!drawer) return;
  drawer.classList.remove('open');
  drawer.setAttribute('inert', '');
  cartBackdrop?.classList.remove('open');
  document.body.classList.remove('no-scroll');
  ultimoFocoDrawer?.focus();
}

function initCart() {
  document.getElementById('cartBtn')?.addEventListener('click', abrirDrawer);
  document.getElementById('cartClose')?.addEventListener('click', cerrarDrawer);
  cartBackdrop?.addEventListener('click', cerrarDrawer);
  document.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-drawer]')) {
      cerrarDrawer();
      document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });
  document.addEventListener('cart:updated', () => {
    renderCart();
    const badge = document.getElementById('cartBadge');
    if (badge) {
      badge.classList.remove('bump');
      void badge.offsetWidth;
      badge.classList.add('bump');
    }
  });
  renderCart();
}

const modal = document.getElementById('modalProducto');
const modalInner = document.getElementById('modalInner');
const modalBackdrop = document.getElementById('modalBackdrop');
let ultimoFocoModal = null;
let modalQty = 1;
let modalEntrega = OPCIONES_ENTREGA[0];

function abrirModal(id) {
  const p = getProducto(id);
  if (!p || !modal || !modalInner) return;
  modalQty = 1;
  modalEntrega = OPCIONES_ENTREGA[0];
  const final = precioFinal(p);
  const precio = p.descuento > 0
    ? `<s>${formatearPrecio(p.precio)}</s><b>${formatearPrecio(final)}</b>`
    : `<b>${formatearPrecio(final)}</b>`;
  const relacionados = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  const armadoIncluido = precioArmado(p) === 0;

  modalInner.innerHTML = `
    <div class="modal-grid">
      <div class="modal-media">
        <div class="modal-foto"><img id="modalFoto" src="${p.imgs[0]}" alt="${esc(p.nombre)}" width="${p.dim[0]}" height="${p.dim[1]}" decoding="async"></div>
        ${p.imgs.length > 1 ? `<div class="modal-thumbs">${p.imgs.map((src, i) => `<button type="button" class="${i === 0 ? 'is-on' : ''}" data-src="${src}" aria-label="Ver imagen ${i + 1} de ${esc(p.nombre)}"><img src="${src}" alt="" width="56" height="56"></button>`).join('')}</div>` : ''}
      </div>
      <div class="modal-info">
        <p class="card-cat">${esc(CATEGORIAS[p.cat] || '')} · ${esc(USOS[p.uso] || '')}</p>
        <h3>${esc(p.nombre)}</h3>
        <p class="modal-precio">${precio}</p>
        <p class="modal-cuotas">${CUOTAS} cuotas de ${formatearPrecio(cuotaDe(final))} sin interés</p>
        <p class="modal-desc">${esc(p.desc)}</p>
        <dl class="ficha">
          ${Object.entries(p.ficha).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}
        </dl>
        <span class="opt-label">Entrega</span>
        <div class="opciones" id="modalOpciones">
          ${OPCIONES_ENTREGA.map((o, i) => `<button type="button" class="opcion ${i === 0 ? 'is-on' : ''}" data-opt="${esc(o)}">${esc(o)}${i === 1 && !armadoIncluido ? ` +${formatearPrecio(precioArmado(p))}` : ''}${i === 1 && armadoIncluido ? ' (incluido)' : ''}</button>`).join('')}
        </div>
        <div class="modal-qty">
          <div class="card-qty">
            <button type="button" class="qty-btn" data-step="-1" aria-label="Quitar una unidad">−</button>
            <span class="qty-val" id="modalQtyVal">${modalQty}</span>
            <button type="button" class="qty-btn" data-step="1" aria-label="Sumar una unidad">+</button>
          </div>
          <span class="cart-nota" id="modalSubtotal">${formatearPrecio(precioLinea(p, modalEntrega) * modalQty)}</span>
        </div>
        <div class="modal-acciones">
          <button type="button" class="btn btn-primary btn-block" id="modalAdd">Agregar al carrito</button>
          <button type="button" class="btn btn-ghost btn-block" id="modalNow">Comprar ahora</button>
        </div>
      </div>
    </div>
    ${relacionados.length ? `<div class="modal-relacionados">
      <h4>También te puede servir</h4>
      <div class="rel-lista">${relacionados.map(r => `
        <button type="button" class="rel-item" data-rel="${r.id}">
          <img src="${r.imgs[0]}" alt="${esc(r.nombre)}" width="${r.dim[0]}" height="${r.dim[1]}" loading="lazy" decoding="async">
          <b>${esc(r.nombre)}</b>
          <span>${formatearPrecio(precioFinal(r))}</span>
        </button>`).join('')}</div>
    </div>` : ''}`;

  const actualizar = () => {
    modalInner.querySelector('#modalQtyVal').textContent = modalQty;
    modalInner.querySelector('#modalSubtotal').textContent = formatearPrecio(precioLinea(p, modalEntrega) * modalQty);
  };
  modalInner.querySelectorAll('.modal-qty .qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modalQty = Math.max(1, Math.min(9, modalQty + Number(btn.dataset.step)));
      actualizar();
    });
  });
  modalInner.querySelectorAll('#modalOpciones .opcion').forEach(btn => {
    btn.addEventListener('click', () => {
      modalInner.querySelectorAll('#modalOpciones .opcion').forEach(b => b.classList.remove('is-on'));
      btn.classList.add('is-on');
      modalEntrega = btn.dataset.opt;
      actualizar();
    });
  });
  modalInner.querySelectorAll('.modal-thumbs button').forEach(btn => {
    btn.addEventListener('click', () => {
      modalInner.querySelectorAll('.modal-thumbs button').forEach(b => b.classList.remove('is-on'));
      btn.classList.add('is-on');
      modalInner.querySelector('#modalFoto').src = btn.dataset.src;
    });
  });
  modalInner.querySelector('#modalAdd').addEventListener('click', () => {
    Cart.add(p, modalQty, modalEntrega);
    showToast('¡Sumada al pedido!');
  });
  modalInner.querySelector('#modalNow').addEventListener('click', () => {
    Cart.add(p, modalQty, modalEntrega);
    cerrarModal();
    abrirDrawer();
  });
  modalInner.querySelectorAll('.rel-item').forEach(btn => {
    btn.addEventListener('click', () => abrirModal(btn.dataset.rel));
  });

  if (!modal.classList.contains('open')) ultimoFocoModal = document.activeElement;
  modal.classList.add('open');
  modal.removeAttribute('inert');
  modalBackdrop?.classList.add('open');
  document.body.classList.add('no-scroll');
  modal.querySelector('#modalClose')?.focus();
}

function cerrarModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('inert', '');
  modalBackdrop?.classList.remove('open');
  document.body.classList.remove('no-scroll');
  ultimoFocoModal?.focus();
}

function initModal() {
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  modalBackdrop?.addEventListener('click', cerrarModal);
}

function initFocusTrap() {
  const sel = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (modal?.classList.contains('open')) { cerrarModal(); return; }
      if (drawer?.classList.contains('open')) { cerrarDrawer(); return; }
    }
    if (e.key !== 'Tab') return;
    const panel = modal?.classList.contains('open') ? modal : (drawer?.classList.contains('open') ? drawer : null);
    if (!panel) return;
    const focusables = Array.from(panel.querySelectorAll(sel)).filter(el => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
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
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
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
  const mq = window.matchMedia('(min-width: 769px)');
  const sync = () => { if (mq.matches) { nav.removeAttribute('inert'); close(); } else if (!nav.classList.contains('open')) nav.setAttribute('inert', ''); };
  mq.addEventListener('change', sync);
  sync();
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
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-wall', { xPercent: 14, opacity: 0, duration: 1.1 }, 0)
    .from('.hero-ring', { scale: 0.82, opacity: 0, duration: 1 }, 0.15)
    .from('.hero-piece-main', { y: 52, rotate: -5, opacity: 0, duration: 1.15 }, 0.25)
    .from('.hero-piece-sec', { y: 34, x: 26, opacity: 0, duration: 0.9 }, 0.55)
    .from('.hero-scene .tag-price', { y: -20, opacity: 0, duration: 0.7 }, 0.72);
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const foto = document.querySelector('.showroom-media img');
  if (foto) {
    gsap.fromTo(foto, { yPercent: -4, scale: 1.07 }, {
      yPercent: 4, scale: 1.07, ease: 'none',
      scrollTrigger: { trigger: '.showroom-media', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }
  const copy = document.querySelector('.showroom-copy');
  if (copy) {
    gsap.fromTo(copy, { y: 26 }, {
      y: -18, ease: 'none',
      scrollTrigger: { trigger: '.showroom', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }
  gsap.utils.toArray('.ben-ico').forEach((ico, i) => {
    gsap.from(ico, {
      scale: 0.86, rotate: -8, opacity: 0, duration: 0.6, delay: i * 0.08, ease: 'back.out(1.6)',
      scrollTrigger: { trigger: '.beneficios', start: 'top 78%' }
    });
  });
  gsap.from('.seam-cut', {
    y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.seam-cut', start: 'top 92%' }
  });
  gsap.from('.cierre-cut', {
    y: 50, opacity: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.cierre', start: 'top 72%' }
  });
}

/* Posiciones finales de cada máquina dentro de la sala, como fracción del alto
   y ancho del stage. Se recalculan en cada refresh (invalidateOnRefresh) para
   que el capítulo no quede corrido al rotar el teléfono o cambiar de breakpoint. */
const POS_MAQUINAS = [
  { fx: -0.28, fy: 0.06 },
  { fx: 0.30, fy: 0.10 },
  { fx: -0.05, fy: -0.20 },
  { fx: 0.02, fy: 0.26 },
  { fx: 0.34, fy: -0.20 }
];

function initArmado() {
  const stage = document.getElementById('armadoStage');
  const visual = document.getElementById('armadoVisual');
  const pasos = document.getElementById('armadoPasos');
  if (!stage || !visual || !pasos) return;

  const maquinas = Array.from(visual.querySelectorAll('.am-maq'));
  const sala = [visual.querySelector('.sala-pared'), visual.querySelector('.sala-piso')].filter(Boolean);
  const items = Array.from(pasos.children);

  maquinas.forEach(btn => {
    btn.addEventListener('click', () => abrirModal(btn.dataset.prod));
  });

  const setStep = progress => {
    const i = Math.min(items.length - 1, Math.max(0, Math.floor(progress * items.length)));
    items.forEach((li, n) => li.classList.toggle('is-on', n === i));
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    stage.classList.add('is-static');
    items.forEach(li => li.classList.add('is-on'));
    return;
  }

  const construir = tl => {
    gsap.set(maquinas, { xPercent: -50, yPercent: -50, x: 0, y: 40, scale: 0.6, opacity: 0 });
    gsap.set(sala, { opacity: 0.35 });
    tl.to(sala, { opacity: 1, duration: 0.2, ease: 'none' }, 0);
    // Entran de a pares, alineadas con los 4 bloques de texto del capítulo.
    [[0, 1], [2, 3], [4]].forEach((grupo, n) => {
      const t = 0.22 + n * 0.25;
      grupo.forEach((idx, k) => {
        tl.to(maquinas[idx], {
          x: () => POS_MAQUINAS[idx].fx * visual.clientWidth,
          y: () => POS_MAQUINAS[idx].fy * visual.clientHeight,
          scale: 1,
          opacity: 1,
          duration: 0.26,
          ease: 'power2.out'
        }, t + k * 0.05);
      });
    });
    tl.to({}, { duration: 0.06 });
  };

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: '+=240%',
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: self => setStep(self.progress)
      }
    });
    construir(tl);
    setStep(0);
    return () => { gsap.set([maquinas, sala], { clearProps: 'all' }); };
  });

  mm.add('(max-width: 1080px)', () => {
    stage.classList.add('is-sticky-mobile');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: self => setStep(self.progress)
      }
    });
    construir(tl);
    setStep(0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      stage.classList.remove('is-sticky-mobile');
      gsap.set([maquinas, sala], { clearProps: 'all' });
    };
  });
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  if (typeof window.Flip !== 'undefined') gsap.registerPlugin(window.Flip);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}

document.documentElement.classList.add('js-ready');
requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add('hero-in')));
renderGrid();
initFiltros();
aplicarFiltros();
initCart();
initModal();
initFocusTrap();
initNav();
initWspFloat();
initReveals();
initHero();
initParallax();
initArmado();
const anioEl = document.getElementById('anio');
if (anioEl) anioEl.textContent = new Date().getFullYear();

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());

  /* Las posiciones de pin/scrub (como el armado) se calculan con el alto de
     página que hay en ese momento. Cualquier cosa que crezca la página
     DESPUÉS — imágenes con loading="lazy" que recién cargan al acercarse al
     viewport, el swap de la tipografía web, lo que sea — deja esas
     posiciones desactualizadas: el pin se activa en el scroll equivocado y
     su contenido queda pisado con secciones que todavía no terminaron de
     desplazarse. Un ResizeObserver sobre <body> no sirve acá (su propio
     box no sigue el alto real del documento), así que se sondea scrollHeight
     directo, que es la métrica que ScrollTrigger realmente usa para
     pin/scrub. No corta a un tiempo fijo (una conexión lenta puede tardar
     más que eso en terminar de cargar) — corta sola a los 2s de que la
     altura deja de moverse. */
  let lastScrollHeight = document.documentElement.scrollHeight;
  let stableTicks = 0;
  const pollScrollHeight = () => {
    const h = document.documentElement.scrollHeight;
    if (h !== lastScrollHeight) {
      lastScrollHeight = h;
      stableTicks = 0;
      ScrollTrigger.refresh();
    } else {
      stableTicks++;
    }
    if (stableTicks < 20) setTimeout(pollScrollHeight, 100);
  };
  setTimeout(pollScrollHeight, 100);
}
