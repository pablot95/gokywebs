const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const WSP = '5493412429332';
const MINIMO = 8000;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const wspLink = lineas => `https://wa.me/${WSP}?text=${encodeURIComponent(lineas.filter(Boolean).join('\n'))}`;

const CATS = { bolsitas: 'Bolsitas', souvenirs: 'Souvenirs', centros: 'Centros de mesa', kits: 'Kits' };

const PRODUCTOS = [
  {
    id: 'bolsita-golosinera', nombre: 'Bolsita golosinera', cat: 'bolsitas', unidad: 'c/u', qtyDefault: 10,
    img: 'images/bolsita-golosinera-osito.webp', w: 644, h: 805,
    alt: 'Bolsitas golosineras con un osito y el nombre Alejo, 1° añito',
    desc: 'La bolsita de cada invitado, con el nombre y la edad de quien cumple y la temática que elijas. Viene sola o en combo con el souvenir adentro.',
    incluye: ['Diseño con nombre, edad y temática', 'Común o en papel fotográfico de 18×10×5 cm', 'Combos con librito para pintar o fotoimán'],
    tags: ['bolsa', 'golosinas', 'combo', 'librito', 'fotoiman', 'souvenir', 'osito'],
    talles: [
      { id: 'comun', label: 'Común', precio: 500, detalle: 'Bolsita golosinera común.' },
      { id: 'foto', label: 'Fotográfica', precio: 1000, detalle: 'En papel fotográfico, 18×10×5 cm.' },
      { id: 'librito', label: '+ Librito', precio: 800, detalle: 'Combo: bolsita + librito para pintar.' },
      { id: 'premium', label: 'Premium', precio: 1100, detalle: 'Combo: bolsita en papel fotográfico + librito para pintar.' },
      { id: 'iman', label: '+ Fotoimán', precio: 1500, detalle: 'Combo: bolsita + fotoimán.' }
    ]
  },
  {
    id: 'valijita', nombre: 'Valijita', cat: 'bolsitas', unidad: 'c/u', qtyDefault: 10,
    img: 'images/valijita-estrellas.webp', w: 1000, h: 1250,
    alt: 'Valijitas blancas con estrellas doradas y el nombre y la edad impresos',
    desc: 'Cajita con manija para las golosinas de cada invitado, con el nombre y la edad de quien cumple.',
    incluye: ['Diseño con nombre, edad y temática', 'Con manija para llevar', 'Se arma en el momento'],
    tags: ['valija', 'cajita', 'caja', 'estrellas', 'golosinas'],
    talles: [{ id: 'unica', label: 'Única', precio: 1200, detalle: 'Valijita con manija.' }]
  },
  {
    id: 'milk-box', nombre: 'Milk box', cat: 'bolsitas', unidad: 'c/u', qtyDefault: 10,
    img: 'images/milk-box-autitos.webp', w: 1000, h: 1250,
    alt: 'Cajitas milk box con un autito rojo y un cartel de PARE',
    desc: 'La cajita con forma de caja de leche, con la temática del cumple en todas sus caras y el nombre de quien cumple.',
    incluye: ['Diseño con nombre, edad y temática', 'Forma de caja de leche', 'Ideal para golosinas y un souvenir'],
    tags: ['caja', 'cajita', 'leche', 'autos', 'autitos', 'golosinas'],
    talles: [{ id: 'unica', label: 'Única', precio: 1800, detalle: 'Milk box con la temática completa.' }]
  },
  {
    id: 'bolsita-boutique', nombre: 'Bolsita boutique', cat: 'bolsitas', unidad: 'c/u', qtyDefault: 10,
    img: 'images/bolsita-boutique.webp', w: 1000, h: 1250,
    alt: 'Bolsitas boutique verde agua con moño rosa y etiqueta',
    desc: 'Bolsita de papel con manijas, de 14×11×5 cm, con la etiqueta del cumple. Sola o en combo con un fotoimán.',
    incluye: ['Medida 14×11×5 cm', 'Etiqueta con nombre y edad', 'Combo con fotoimán'],
    tags: ['bolsa', 'boutique', 'manija', 'fotoiman', 'combo', 'regalo'],
    talles: [
      { id: 'sola', label: 'Sola', precio: 1500, detalle: 'Bolsita boutique de 14×11×5 cm.' },
      { id: 'iman', label: '+ Fotoimán', precio: 2500, detalle: 'Combo: bolsita boutique + fotoimán.' }
    ]
  },
  {
    id: 'librito', nombre: 'Librito para pintar', cat: 'souvenirs', unidad: 'c/u', qtyDefault: 10,
    img: 'images/librito-para-pintar.webp', w: 1000, h: 1250,
    alt: 'Manos de una nena pintando un dibujo con crayones',
    desc: 'Dibujos de la temática del cumple para pintar, con el nombre de quien cumple en la tapa. Hay cuatro tamaños.',
    incluye: ['Tapa con nombre y temática', 'Dibujos de la misma temática', 'Versión con lápices incluidos'],
    tags: ['libro', 'pintar', 'colorear', 'dibujos', 'souvenir', 'lapices'],
    talles: [
      { id: '7x10', label: '7×10', precio: 400, detalle: 'Librito de 7×10 cm.' },
      { id: '9x9', label: '9×9', precio: 700, detalle: 'Librito de 9×9 cm.' },
      { id: '10x14', label: '10×14', precio: 1300, detalle: 'Librito de 10×14 cm.' },
      { id: 'lapices', label: 'Con lápices', precio: 1700, detalle: 'Librito con lápices para pintar.' }
    ]
  },
  {
    id: 'agendita', nombre: 'Agendita 7×10', cat: 'souvenirs', unidad: 'c/u', qtyDefault: 10,
    img: 'images/agendita.webp', w: 1000, h: 1250,
    alt: 'Agendita anillada rosa con lápices sobre fondo rosa',
    desc: 'Anotador anillado de 7×10 cm con 20 hojas y la tapa personalizada. Sola o con su lápiz.',
    incluye: ['20 hojas', 'Tapa con nombre y temática', 'Opción con lápiz'],
    tags: ['anotador', 'agenda', 'cuaderno', 'souvenir', 'lapiz'],
    talles: [
      { id: 'sola', label: '20 hojas', precio: 1000, detalle: 'Agendita de 7×10 cm, 20 hojas.' },
      { id: 'lapiz', label: 'Con lápiz', precio: 1300, detalle: 'Agendita de 7×10 cm con lápiz.' }
    ]
  },
  {
    id: 'centro-mesa', nombre: 'Centro de mesa', cat: 'centros', unidad: 'c/u', qtyDefault: 2,
    img: 'images/centro-de-mesa-tematico.webp', w: 1000, h: 1250,
    alt: 'Centros de mesa en forma de cubo con el número 2 y autitos amarillos arriba',
    desc: 'El centro de cada mesa con la temática del cumple: servilletero, calecita de 30 cm o centro temático con la edad.',
    incluye: ['Servilletero, calecita o temático', 'Con la edad y los personajes de la temática', 'Uno por mesa'],
    tags: ['centro', 'mesa', 'calecita', 'servilletero', 'decoracion', 'edad', 'numero'],
    talles: [
      { id: 'servilletero', label: 'Servilletero', precio: 2500, detalle: 'Centro servilletero.' },
      { id: 'calecita', label: 'Calecita', precio: 3000, detalle: 'Calecita de 30 cm.' },
      { id: 'tematico', label: 'Temático', precio: 4000, detalle: 'Centro temático o hexagonal, con la edad.' }
    ]
  },
  {
    id: 'lamparita', nombre: 'Lamparita con cuadro', cat: 'centros', unidad: 'c/u', qtyDefault: 1,
    img: 'images/lamparita-con-cuadro.webp', w: 850, h: 1063,
    alt: 'Lamparita de cartón con pantalla a lunares y un cuadro con un unicornio',
    desc: 'Lamparita de papel con su cuadrito al lado, en la temática del cumple. Queda como centro de mesa o de recuerdo.',
    incluye: ['Lamparita y cuadrito', 'Temática a elección', 'Centro de mesa o recuerdo'],
    tags: ['lampara', 'velador', 'cuadro', 'unicornio', 'centro', 'decoracion'],
    talles: [{ id: 'unica', label: 'Única', precio: 4500, detalle: 'Lamparita con cuadro.' }]
  },
  {
    id: 'kit-cumple', nombre: 'Kit cumple', cat: 'kits', unidad: 'el kit', qtyDefault: 1,
    img: 'images/kit-cumple-adorno-torta.webp', w: 1000, h: 1250,
    alt: 'Torta con adornos de papel: autitos, semáforo, árbol, cartel de PARE y el número 2',
    desc: 'La promo de la semana: todo lo de papel para el cumple en un solo pedido, con la temática que elijas.',
    incluye: ['20 bolsitas personalizadas', 'Libritos para pintar', 'Un banderín', 'Un adorno de torta'],
    tags: ['kit', 'promo', 'banderin', 'adorno', 'torta', 'topper', 'combo'],
    talles: [{ id: 'unico', label: 'Kit completo', precio: 20000, detalle: 'Promo de la semana: confirmá lo que trae por WhatsApp.' }]
  }
];

const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getTalle = (p, id) => p?.talles.find(t => t.id === id) || p?.talles[0];
const precioTalle = (p, id) => getTalle(p, id)?.precio ?? 0;
const precioMin = p => Math.min(...p.talles.map(t => t.precio));

const limpiarPers = (pers = {}) => ({
  nombre: String(pers.nombre || '').trim().slice(0, 18),
  edad: String(pers.edad || '').trim().slice(0, 12),
  tema: String(pers.tema || '').trim().slice(0, 28),
  fecha: String(pers.fecha || '').trim().slice(0, 10)
});
const lineKey = l => [l.id, l.talle, l.pers?.nombre, l.pers?.edad, l.pers?.tema, l.pers?.fecha].map(v => v || '').join('|');

const Cart = {
  KEY: 'noemidesingok_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || this.memoria || []; } catch { return this.memoria || []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { this.memoria = items; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, talle, pers = {}) {
    const items = this.get();
    const linea = { id: producto.id, talle: getTalle(producto, talle).id, qty, pers: limpiarPers(pers) };
    const existing = items.find(i => lineKey(i) === lineKey(linea));
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 999);
    else items.push({ ...linea, qty: Math.min(qty, producto.stock ?? 999) });
    this.save(items);
  },
  setQty(key, qty) {
    const items = this.get(); const it = items.find(i => lineKey(i) === key); if (!it) return;
    const p = getProducto(it.id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 999)); this.save(items);
  },
  remove(key) { this.save(this.get().filter(i => lineKey(i) !== key)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  lines() { return this.get().filter(i => getProducto(i.id)).length; },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioTalle(p, i.talle) * i.qty : s; }, 0); }
};

function limpiarCarrito() {
  const items = Cart.get();
  const validos = items.filter(i => getProducto(i.id) && Number.isFinite(i.qty) && i.qty > 0);
  if (validos.length !== items.length) Cart.save(validos);
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

function updateCartBadge() {
  const n = Cart.lines();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

const ICON = {
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg>'
};

const tienda = { q: '', cats: new Set(), precio: null, orden: 'recomendados', page: 1, talleSel: {} };
const PAGE = 16;
let revealsListos = false;
let pintarMesaRef = null;
let cerrarFiltrosRef = null;
let revealIO = null;

function filtrarProductos() {
  const palabras = normalizar(tienda.q).split(/\s+/).filter(Boolean);
  const lista = PRODUCTOS.filter(p => {
    if (tienda.cats.size && !tienda.cats.has(p.cat)) return false;
    if (tienda.precio === 'b1' && !p.talles.some(t => t.precio <= 1000)) return false;
    if (tienda.precio === 'b2' && !p.talles.some(t => t.precio >= 1000 && t.precio <= 2500)) return false;
    if (tienda.precio === 'b3' && !p.talles.some(t => t.precio > 2500)) return false;
    if (palabras.length) {
      const texto = normalizar([p.nombre, CATS[p.cat], p.desc, p.tags.join(' '), p.talles.map(t => t.label + ' ' + t.detalle).join(' ')].join(' '));
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  });
  if (tienda.orden === 'menor') lista.sort((a, b) => precioMin(a) - precioMin(b));
  if (tienda.orden === 'mayor') lista.sort((a, b) => precioMin(b) - precioMin(a));
  return lista;
}

function tallesHTML(p) {
  if (p.talles.length < 2) return '';
  const sel = getTalle(p, tienda.talleSel[p.id]).id;
  const visibles = p.talles.length > 3 ? p.talles.slice(0, 2) : p.talles;
  const chips = visibles.map(t => `<button type="button" class="talle" data-talle="${t.id}" aria-pressed="${t.id === sel}">${esc(t.label)}</button>`).join('');
  const mas = p.talles.length > 3 ? `<button type="button" class="talle talle--more" data-open="${p.id}" aria-label="Ver las ${p.talles.length} opciones de ${esc(p.nombre)}">+${p.talles.length - 2}</button>` : '';
  return `<div class="talles" role="group" aria-label="Tamaño u opción">${chips}${mas}</div>`;
}

function cardHTML(p, i) {
  const t = getTalle(p, tienda.talleSel[p.id]);
  return `<article class="prod is-entering" style="--d:${Math.min(i * 0.09, 0.7)}s" data-id="${p.id}">
    <button type="button" class="prod-media" data-open="${p.id}" aria-label="Ver detalle: ${esc(p.nombre)}">
      <img src="${p.img}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}">
      <span class="prod-quick">${ICON.eye}Ver detalle</span>
      ${p.talles.length > 1 ? `<span class="prod-opts">${p.talles.length} opciones</span>` : ''}
    </button>
    <p class="label-tag prod-badge"><span class="label-band"></span><span>${CATS[p.cat]}</span></p>
    <div class="prod-body">
      <h3 class="prod-name"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
      ${tallesHTML(p)}
      <p class="prod-price"><span data-card-price>${formatearPrecio(t.precio)}</span><small>${esc(p.unidad)}</small></p>
      <div class="prod-actions">
        <div class="stepper" role="group" aria-label="Cantidad de ${esc(p.nombre)}">
          <button type="button" data-step="-1" aria-label="Restar uno">${ICON.minus}</button>
          <output data-qty aria-live="polite">${p.qtyDefault}</output>
          <button type="button" data-step="1" aria-label="Sumar uno">${ICON.plus}</button>
        </div>
        <button type="button" class="prod-add" data-add="${p.id}"><span class="add-long">Agregar al carrito</span><span class="add-short">Agregar</span></button>
      </div>
      <button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}

function renderCatalogo(animar = true) {
  const grid = $('#catalogo');
  const lista = filtrarProductos();
  const visibles = lista.slice(0, tienda.page * PAGE);
  grid.innerHTML = visibles.map(cardHTML).join('');
  if (!animar) grid.querySelectorAll('.prod').forEach(c => c.classList.remove('is-entering'));
  $('#catalogoEmpty').hidden = lista.length > 0;
  $('#verMas').hidden = visibles.length >= lista.length;
  $$('[data-result-count]').forEach(el => { el.textContent = lista.length; });
  renderFiltrosActivos();
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function renderFiltrosActivos() {
  const cont = $('#activeFilters');
  const chips = [];
  if (tienda.q) chips.push({ tipo: 'q', label: `“${tienda.q}”` });
  tienda.cats.forEach(c => chips.push({ tipo: 'cat', valor: c, label: CATS[c] }));
  if (tienda.precio) chips.push({ tipo: 'precio', label: $(`[data-precio="${tienda.precio}"]`)?.textContent || '' });
  cont.innerHTML = chips.map(c => `<button type="button" class="af-chip" data-quitar="${c.tipo}" data-valor="${c.valor || ''}" aria-label="Quitar filtro ${esc(c.label)}">${esc(c.label)}${ICON.x}</button>`).join('');
}

function syncControles() {
  $$('input[data-cat-check]').forEach(i => { i.checked = tienda.cats.has(i.value); });
  $$('[data-precio]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.precio === tienda.precio)));
  const buscar = $('#buscar'); if (buscar.value !== tienda.q) buscar.value = tienda.q;
  $('#orden').value = tienda.orden;
}

function aplicarCambio() { tienda.page = 1; syncControles(); renderCatalogo(); }

function limpiarFiltros() { tienda.q = ''; tienda.cats.clear(); tienda.precio = null; aplicarCambio(); }

function filtrarPorCategoria(cat) {
  tienda.q = ''; tienda.precio = null; tienda.cats = new Set([cat]); aplicarCambio();
  const destino = $('#tienda');
  destino.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function qtyDeCard(card) { return clamp(parseInt($('[data-qty]', card)?.textContent, 10) || 1, 1, 999); }

function agregar(p, qty, talle, pers, abrir = false) {
  Cart.add(p, qty, talle, pers);
  const t = getTalle(p, talle);
  showToast(`Sumaste ${qty} × ${p.nombre}${p.talles.length > 1 ? ' (' + t.label + ')' : ''}`);
  if (abrir) openCartDrawer();
}

function initTienda() {
  const grid = $('#catalogo');
  renderCatalogo(false);

  grid.addEventListener('click', e => {
    const card = e.target.closest('.prod');
    if (!card) return;
    const p = getProducto(card.dataset.id);
    const step = e.target.closest('[data-step]');
    if (step) {
      const out = $('[data-qty]', card);
      out.textContent = clamp(qtyDeCard(card) + Number(step.dataset.step), 1, 999);
      return;
    }
    const talle = e.target.closest('[data-talle]');
    if (talle) {
      tienda.talleSel[p.id] = talle.dataset.talle;
      $$('[data-talle]', card).forEach(b => b.setAttribute('aria-pressed', String(b === talle)));
      $('[data-card-price]', card).textContent = formatearPrecio(precioTalle(p, talle.dataset.talle));
      return;
    }
    if (e.target.closest('[data-add]')) { agregar(p, qtyDeCard(card), tienda.talleSel[p.id], {}); return; }
    if (e.target.closest('[data-buy]')) { agregar(p, qtyDeCard(card), tienda.talleSel[p.id], {}, true); return; }
    const open = e.target.closest('[data-open]');
    if (open) openQuickView(p.id, open);
  });

  let t;
  $('#buscar').addEventListener('input', e => {
    clearTimeout(t);
    t = setTimeout(() => { tienda.q = e.target.value.trim(); tienda.page = 1; renderCatalogo(); }, 180);
  });
  $$('input[data-cat-check]').forEach(i => i.addEventListener('change', () => {
    if (i.checked) tienda.cats.add(i.value); else tienda.cats.delete(i.value);
    aplicarCambio();
  }));
  $$('[data-precio]').forEach(b => b.addEventListener('click', () => {
    tienda.precio = tienda.precio === b.dataset.precio ? null : b.dataset.precio;
    aplicarCambio();
  }));
  $('#orden').addEventListener('change', e => { tienda.orden = e.target.value; aplicarCambio(); });
  $('#filtersClear').addEventListener('click', limpiarFiltros);
  $('#emptyClear').addEventListener('click', limpiarFiltros);
  $('#verMas').addEventListener('click', () => { tienda.page += 1; renderCatalogo(); revelarNuevos(grid); });
  $('#activeFilters').addEventListener('click', e => {
    const b = e.target.closest('[data-quitar]'); if (!b) return;
    if (b.dataset.quitar === 'q') tienda.q = '';
    if (b.dataset.quitar === 'cat') tienda.cats.delete(b.dataset.valor);
    if (b.dataset.quitar === 'precio') tienda.precio = null;
    aplicarCambio();
  });

  $$('.shortcut, [data-footer-cat]').forEach(b => b.addEventListener('click', e => {
    e.preventDefault();
    filtrarPorCategoria(b.dataset.cat || b.dataset.footerCat);
  }));

  $('#headerSearch').addEventListener('click', () => {
    const movil = window.matchMedia('(max-width: 1080px)').matches;
    if (movil) { openFiltros(); setTimeout(() => $('#buscar').focus(), 380); return; }
    $('#tienda').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => $('#buscar').focus({ preventScroll: true }), reduceMotion ? 0 : 500);
  });

  const panel = $('#filtersPanel');
  const abrir = $('#filtersOpen');
  $('#filtersOpen').addEventListener('click', openFiltros);
  $('#filtersClose').addEventListener('click', closeFiltros);
  $('#filtersApply').addEventListener('click', closeFiltros);
  panel.addEventListener('keydown', e => {
    if (e.key === 'Escape' && panel.classList.contains('open')) closeFiltros();
    if (e.key === 'Tab' && panel.classList.contains('open')) atraparFoco(e, panel);
  });

  function openFiltros() {
    panel.classList.add('open'); abrir.setAttribute('aria-expanded', 'true');
    $('#overlay').classList.add('open'); document.body.classList.add('no-scroll');
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true');
    setTimeout(() => $('#filtersClose').focus(), 60);
  }
  function closeFiltros() {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open'); abrir.setAttribute('aria-expanded', 'false');
    panel.removeAttribute('role'); panel.removeAttribute('aria-modal');
    if (!$('#cartDrawer').classList.contains('open')) { $('#overlay').classList.remove('open'); document.body.classList.remove('no-scroll'); }
    abrir.focus({ preventScroll: true });
    $('#tienda').scrollIntoView({ behavior: 'auto', block: 'start' });
  }
  cerrarFiltrosRef = closeFiltros;
}

function focusables(cont) {
  return $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', cont).filter(el => el.offsetParent !== null || el === document.activeElement);
}
function atraparFoco(e, cont) {
  const f = focusables(cont); if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

let qvOpener = null;
function openQuickView(id, opener) {
  const p = getProducto(id);
  if (!p) return;
  qvOpener = opener || document.activeElement;
  const wrap = $('#quickView');
  const modal = $('#qvModal');
  let talle = getTalle(p, tienda.talleSel[p.id]).id;
  let qty = p.qtyDefault;
  const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).concat(PRODUCTOS.filter(x => x.cat !== p.cat && x.id !== p.id)).slice(0, 3);
  modal.innerHTML = `
    <button type="button" class="close-btn modal-close" data-close-modal aria-label="Cerrar">${ICON.x}</button>
    <div class="modal-media"><img src="${p.img}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}"></div>
    <div class="modal-info">
      <p class="label-tag"><span class="label-band"></span><span>${CATS[p.cat]}</span></p>
      <h2 id="qv-title">${esc(p.nombre)}</h2>
      <p class="prod-price"><span id="qvPrice">${formatearPrecio(precioTalle(p, talle))}</span><small>${esc(p.unidad)}</small></p>
      ${p.talles.length > 1 ? `<div class="modal-talles"><p class="modal-talles-title">Tamaño u opción</p><div class="talles" role="group" aria-label="Tamaño u opción">${p.talles.map(t => `<button type="button" class="talle" data-qv-talle="${t.id}" aria-pressed="${t.id === talle}">${esc(t.label)} · ${formatearPrecio(t.precio)}</button>`).join('')}</div><p class="talle-detail" id="qvDetail">${esc(getTalle(p, talle).detalle)}</p></div>` : `<p class="talle-detail">${esc(getTalle(p, talle).detalle)}</p>`}
      <p class="modal-desc">${esc(p.desc)}</p>
      <ul class="modal-incluye">${p.incluye.map(i => `<li>${ICON.check}<span>${esc(i)}</span></li>`).join('')}</ul>
      <div class="modal-fields">
        <div class="field"><label for="qvNombre">Nombre</label><input type="text" id="qvNombre" maxlength="18" placeholder="Martina" autocomplete="off"></div>
        <div class="field"><label for="qvEdad">Edad</label><input type="text" id="qvEdad" maxlength="12" placeholder="5 años" autocomplete="off"></div>
        <div class="field"><label for="qvTema">Temática</label><input type="text" id="qvTema" maxlength="28" placeholder="Unicornios" autocomplete="off"></div>
      </div>
      <div class="modal-actions">
        <div class="stepper" role="group" aria-label="Cantidad">
          <button type="button" data-qv-step="-1" aria-label="Restar uno">${ICON.minus}</button>
          <output id="qvQty" aria-live="polite">${qty}</output>
          <button type="button" data-qv-step="1" aria-label="Sumar uno">${ICON.plus}</button>
        </div>
        <button type="button" class="prod-add" id="qvAdd">Agregar al carrito</button>
        <button type="button" class="btn btn-ghost" id="qvBuy">Comprar ahora</button>
      </div>
      <a class="modal-wsp" id="qvWsp" href="https://wa.me/${WSP}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp antes de pedir</a>
      <div class="modal-rel">
        <h3>También para el cumple</h3>
        <div class="rel-list">${rel.map(r => `<button type="button" class="rel-item" data-rel="${r.id}"><span><img src="${r.img}" width="${r.w}" height="${r.h}" alt="" loading="lazy"></span><span>${esc(r.nombre)}</span><span>desde ${formatearPrecio(precioMin(r))}</span></button>`).join('')}</div>
      </div>
    </div>`;

  const pers = () => ({ nombre: $('#qvNombre').value, edad: $('#qvEdad').value, tema: $('#qvTema').value });
  const syncWsp = () => {
    const t = getTalle(p, talle); const d = limpiarPers(pers());
    $('#qvWsp').href = wspLink([
      `¡Hola Noemi! Quiero consultar por: ${p.nombre}${p.talles.length > 1 ? ' (' + t.label + ')' : ''}.`,
      `Cantidad: ${qty}`,
      d.nombre ? `Para: ${d.nombre}${d.edad ? ' · ' + d.edad : ''}` : '',
      d.tema ? `Temática: ${d.tema}` : ''
    ]);
  };
  syncWsp();
  modal.onclick = e => {
    const tb = e.target.closest('[data-qv-talle]');
    if (tb) {
      talle = tb.dataset.qvTalle;
      $$('[data-qv-talle]', modal).forEach(b => b.setAttribute('aria-pressed', String(b === tb)));
      $('#qvPrice').textContent = formatearPrecio(precioTalle(p, talle));
      const det = $('#qvDetail'); if (det) det.textContent = getTalle(p, talle).detalle;
      syncWsp();
      return;
    }
    const st = e.target.closest('[data-qv-step]');
    if (st) { qty = clamp(qty + Number(st.dataset.qvStep), 1, 999); $('#qvQty').textContent = qty; syncWsp(); return; }
    if (e.target.closest('#qvAdd')) { agregar(p, qty, talle, pers()); return; }
    if (e.target.closest('#qvBuy')) { closeQuickView(false); agregar(p, qty, talle, pers(), true); return; }
    const r = e.target.closest('[data-rel]');
    if (r) { openQuickView(r.dataset.rel, qvOpener); return; }
    if (e.target.closest('[data-close-modal]')) closeQuickView();
  };
  modal.oninput = syncWsp;

  if (wrap.hidden) {
    wrap.hidden = false;
    document.body.classList.add('no-scroll');
  }
  modal.scrollTop = 0;
  const url = new URL(location.href); url.searchParams.set('producto', p.id); window.history.replaceState(null, '', url);
  setTimeout(() => $('.modal-close', modal)?.focus(), 40);
}

function closeQuickView(devolverFoco = true) {
  const wrap = $('#quickView');
  if (wrap.hidden) return;
  wrap.hidden = true;
  if (!$('#cartDrawer').classList.contains('open')) document.body.classList.remove('no-scroll');
  const url = new URL(location.href); url.searchParams.delete('producto'); window.history.replaceState(null, '', url);
  if (devolverFoco && qvOpener && document.contains(qvOpener)) qvOpener.focus({ preventScroll: true });
}

function initQuickView() {
  const wrap = $('#quickView');
  wrap.addEventListener('click', e => { if (e.target.matches('[data-close-modal], .modal-backdrop')) closeQuickView(); });
  wrap.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); closeQuickView(); }
    if (e.key === 'Tab') atraparFoco(e, $('#qvModal'));
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-open]');
    if (b && !b.closest('#catalogo') && !b.closest('#qvModal')) openQuickView(b.dataset.open, b);
  });
  const slug = new URLSearchParams(location.search).get('producto');
  if (slug && getProducto(slug)) openQuickView(slug);
}

let drawerOpener = null;
function openCartDrawer() {
  const drawer = $('#cartDrawer');
  drawerOpener = document.activeElement;
  renderCarrito();
  drawer.hidden = false;
  void drawer.offsetWidth;
  drawer.classList.add('open');
  $('#overlay').classList.add('open');
  document.body.classList.add('no-scroll');
  setTimeout(() => $('[data-close-drawer]', drawer)?.focus(), 60);
}
function closeCartDrawer() {
  const drawer = $('#cartDrawer');
  if (!drawer.classList.contains('open')) return;
  drawer.classList.remove('open');
  $('#overlay').classList.remove('open');
  if ($('#quickView').hidden) document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!drawer.classList.contains('open')) drawer.hidden = true; }, 420);
  if (drawerOpener && document.contains(drawerOpener)) drawerOpener.focus({ preventScroll: true });
}

function persTexto(pers) {
  const d = limpiarPers(pers);
  const partes = [d.nombre && `<b>${esc(d.nombre)}</b>`, d.edad && esc(d.edad), d.tema && esc(d.tema)].filter(Boolean);
  const fecha = d.fecha ? ` · ${esc(fechaLarga(d.fecha))}` : '';
  return partes.length ? `Para ${partes.join(' · ')}${fecha}` : 'Nombre y temática: los coordinás con Noemi';
}

function renderCarrito() {
  const body = $('#cartBody');
  const items = Cart.get().filter(i => getProducto(i.id));
  if (!items.length) {
    body.innerHTML = `<div class="cart-empty"><p class="ntag ntag--mid"><i></i><b>Todavía vacío</b></p><p>Sumá bolsitas, souvenirs o centros de mesa y armamos el pedido del cumple.</p><a class="btn btn-ink" href="#tienda" data-close-drawer>Ir a la tienda</a></div>`;
  } else {
    body.innerHTML = items.map((i, n) => {
      const p = getProducto(i.id); const t = getTalle(p, i.talle); const k = lineKey(i);
      return `<div class="cart-line" style="--d:${Math.min(n * 0.06, 0.4)}s" data-key="${esc(k)}">
        <img src="${p.img}" width="${p.w}" height="${p.h}" alt="">
        <div>
          <h3>${esc(p.nombre)}</h3>
          <p class="cart-line-meta">${p.talles.length > 1 ? esc(t.label) + ' · ' : ''}${formatearPrecio(t.precio)} ${esc(p.unidad)}<br>${persTexto(i.pers)}</p>
          <div class="stepper" role="group" aria-label="Cantidad de ${esc(p.nombre)}">
            <button type="button" data-line-step="-1" aria-label="Restar uno">${ICON.minus}</button>
            <output aria-live="polite">${i.qty}</output>
            <button type="button" data-line-step="1" aria-label="Sumar uno">${ICON.plus}</button>
          </div>
        </div>
        <div class="cart-line-right">
          <span class="cart-line-price">${formatearPrecio(t.precio * i.qty)}</span>
          <button type="button" class="cart-remove" data-line-remove aria-label="Quitar ${esc(p.nombre)}">${ICON.trash}</button>
        </div>
      </div>`;
    }).join('');
  }
  const total = Cart.total();
  $('#cartTotal').textContent = formatearPrecio(total);
  $('#cartFoot').hidden = !items.length;
  const falta = Math.max(0, MINIMO - total);
  const meter = $('#cartMeter');
  meter.style.setProperty('--f', Math.min(1, total / MINIMO));
  meter.closest('.min-meter').classList.toggle('is-ok', falta === 0);
  $('#cartMin').textContent = falta ? `Te faltan ${formatearPrecio(falta)}` : 'Superada';
  const checkout = $('#checkout');
  checkout.disabled = falta > 0;
  checkout.textContent = falta ? `Sumá ${formatearPrecio(falta)} para llegar al mínimo` : 'Finalizar compra';
  $('#cartWsp').href = wspLink(['¡Hola Noemi! Te paso mi pedido desde la web:', ...items.map(i => {
    const p = getProducto(i.id); const t = getTalle(p, i.talle); const d = limpiarPers(i.pers);
    return `• ${i.qty} × ${p.nombre}${p.talles.length > 1 ? ' (' + t.label + ')' : ''} = ${formatearPrecio(t.precio * i.qty)}${d.nombre ? ' · para ' + d.nombre : ''}${d.edad ? ', ' + d.edad : ''}${d.tema ? ' · ' + d.tema : ''}`;
  }), `Total: ${formatearPrecio(total)}`]);
}

function initCarrito() {
  limpiarCarrito();
  updateCartBadge();
  $('#headerCart').addEventListener('click', openCartDrawer);
  const drawer = $('#cartDrawer');
  drawer.addEventListener('click', e => {
    const line = e.target.closest('.cart-line');
    if (e.target.closest('[data-close-drawer]')) { closeCartDrawer(); return; }
    if (!line) return;
    const key = line.dataset.key;
    const st = e.target.closest('[data-line-step]');
    if (st) { const it = Cart.get().find(i => lineKey(i) === key); if (it) Cart.setQty(key, it.qty + Number(st.dataset.lineStep)); return; }
    if (e.target.closest('[data-line-remove]')) {
      const it = Cart.get().find(i => lineKey(i) === key);
      Cart.remove(key);
      if (it) showToast(`Sacaste ${getProducto(it.id)?.nombre || 'el producto'} del pedido`);
    }
  });
  drawer.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCartDrawer();
    if (e.key === 'Tab') atraparFoco(e, drawer);
  });
  $('#overlay').addEventListener('click', () => { closeCartDrawer(); cerrarFiltrosRef?.(); });
  document.addEventListener('cart:updated', () => { if (drawer.classList.contains('open')) renderCarrito(); });
  $('#checkout').addEventListener('click', () => {
    if (Cart.total() < MINIMO) return;
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
    if (!reduceMotion && typeof confetti === 'function') {
      confetti({ particleCount: 90, spread: 70, origin: { x: .82, y: .82 }, colors: ['#FF00FF', '#CB8FE3', '#2A1433', '#FFFFFF'], disableForReducedMotion: true });
    }
  });
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

function initWspLinks() {
  $$('[data-wsp-msg]').forEach(a => { a.href = wspLink([a.dataset.wspMsg]); });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
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

const armar = { guests: 15, mesas: 2, bolsa: 'golosinera', adentro: 'librito', centro: 'tematico' };

const BOLSAS = [
  { id: 'golosinera', label: 'Golosinera', prod: 'bolsita-golosinera', talle: 'comun', precio: 500, img: 'images/bolsita-golosinera-osito.webp' },
  { id: 'fotografica', label: 'Fotográfica', prod: 'bolsita-golosinera', talle: 'foto', precio: 1000, img: 'images/bolsita-golosinera-osito.webp' },
  { id: 'valijita', label: 'Valijita', prod: 'valijita', talle: 'unica', precio: 1200, img: 'images/valijita-estrellas.webp' },
  { id: 'boutique', label: 'Boutique', prod: 'bolsita-boutique', talle: 'sola', precio: 1500, img: 'images/bolsita-boutique.webp' },
  { id: 'milkbox', label: 'Milk box', prod: 'milk-box', talle: 'unica', precio: 1800, img: 'images/milk-box-autitos.webp' }
];
const ADENTRO = [
  { id: 'nada', label: 'Nada más', precio: 0 },
  { id: 'librito', label: 'Librito 7×10', precio: 400, prod: 'librito', talle: '7x10' },
  { id: 'agendita', label: 'Agendita', precio: 1000, prod: 'agendita', talle: 'sola' },
  { id: 'iman', label: 'Fotoimán 7×10', precio: 1300, soloCombo: true }
];
const COMBOS = {
  'golosinera+librito': { prod: 'bolsita-golosinera', talle: 'librito', precio: 800, nombre: 'Combo golosinera + librito' },
  'fotografica+librito': { prod: 'bolsita-golosinera', talle: 'premium', precio: 1100, nombre: 'Combo premium: fotográfica + librito' },
  'golosinera+iman': { prod: 'bolsita-golosinera', talle: 'iman', precio: 1500, nombre: 'Combo golosinera + fotoimán' },
  'boutique+iman': { prod: 'bolsita-boutique', talle: 'iman', precio: 2500, nombre: 'Combo boutique + fotoimán' }
};
const CENTROS = [
  { id: 'servilletero', label: 'Servilletero', precio: 2500 },
  { id: 'calecita', label: 'Calecita 30 cm', precio: 3000 },
  { id: 'tematico', label: 'Temático', precio: 4000 }
];

function fechaLarga(v) {
  if (!v) return '';
  const d = new Date(v + 'T12:00:00');
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
}

function calcularArmado() {
  const g = armar.guests;
  const bolsa = BOLSAS.find(b => b.id === armar.bolsa);
  const adentro = ADENTRO.find(a => a.id === armar.adentro);
  const combo = COMBOS[`${bolsa.id}+${adentro.id}`];
  const lineas = [];
  let porInvitado; let ahorro = 0;
  if (combo) {
    porInvitado = combo.precio;
    ahorro = bolsa.precio + adentro.precio - combo.precio;
    lineas.push({ label: combo.nombre, sub: `${g} × ${formatearPrecio(combo.precio)}`, total: g * combo.precio, cart: { id: combo.prod, talle: combo.talle, qty: g } });
  } else {
    porInvitado = bolsa.precio + (adentro.soloCombo ? 0 : adentro.precio);
    lineas.push({ label: bolsa.label, sub: `${g} × ${formatearPrecio(bolsa.precio)}`, total: g * bolsa.precio, cart: { id: bolsa.prod, talle: bolsa.talle, qty: g } });
    if (adentro.prod) lineas.push({ label: adentro.label, sub: `${g} × ${formatearPrecio(adentro.precio)}`, total: g * adentro.precio, cart: { id: adentro.prod, talle: adentro.talle, qty: g } });
  }
  const centro = CENTROS.find(c => c.id === armar.centro);
  if (armar.mesas > 0) lineas.push({ label: `Centro de mesa · ${centro.label}`, sub: `${armar.mesas} × ${formatearPrecio(centro.precio)}`, total: armar.mesas * centro.precio, cart: { id: 'centro-mesa', talle: centro.id, qty: armar.mesas } });
  const total = lineas.reduce((s, l) => s + l.total, 0);
  return { lineas, total, porInvitado, ahorro, combo, bolsa, adentro, centro };
}

function persArmado() {
  return limpiarPers({ nombre: $('#cNombre').value, edad: $('#cEdad').value, tema: $('#cTema').value, fecha: $('#cFecha').value });
}

let totalPrevio = null;
function renderArmado() {
  const r = calcularArmado();
  const d = persArmado();
  $('#rName').textContent = d.nombre || 'Tu cumpleañero';
  $('#rMeta').textContent = [d.edad, d.tema].filter(Boolean).join(' · ') || 'edad y temática a elegir';
  $('#rGuests').textContent = armar.guests;
  $('#liveGuests').textContent = armar.guests;
  $('#liveTotal').textContent = formatearPrecio(r.total);
  const big = $('#rTotal');
  big.textContent = formatearPrecio(r.total);
  if (totalPrevio !== null && totalPrevio !== r.total && !reduceMotion) { big.classList.remove('is-tick'); void big.offsetWidth; big.classList.add('is-tick'); }
  totalPrevio = r.total;
  $('#rLines').innerHTML = r.lineas.map(l => `<li><span><b>${esc(l.label)}</b><small>${esc(l.sub)}</small></span><span>${formatearPrecio(l.total)}</span></li>`).join('');
  const comboEl = $('#rCombo');
  comboEl.hidden = !r.combo;
  if (r.combo) comboEl.textContent = `Combo aplicado: ${formatearPrecio(r.porInvitado)} por invitado, ${formatearPrecio(r.ahorro)} menos que por separado (${formatearPrecio(r.ahorro * armar.guests)} en total).`;
  const falta = Math.max(0, MINIMO - r.total);
  const meter = $('#rMeter');
  meter.style.setProperty('--f', Math.min(1, r.total / MINIMO));
  meter.closest('.min-meter').classList.toggle('is-ok', falta === 0);
  $('#rMin').textContent = falta ? `Te faltan ${formatearPrecio(falta)}` : 'Superada';
  $('#rWsp').href = wspLink([
    '¡Hola Noemi! Quiero reservar una fecha para un cumple.',
    d.nombre ? `Cumpleañero: ${d.nombre}${d.edad ? ' · ' + d.edad : ''}` : '',
    d.tema ? `Temática: ${d.tema}` : '',
    d.fecha ? `Fecha: ${fechaLarga(d.fecha)}` : 'Fecha: a confirmar',
    `Invitados: ${armar.guests}`,
    'Pedido:',
    ...r.lineas.map(l => `• ${l.sub.replace('×', 'x')} · ${l.label} = ${formatearPrecio(l.total)}`),
    `Total estimado: ${formatearPrecio(r.total)}`
  ]);
  const imanOk = ['golosinera', 'boutique'].includes(armar.bolsa);
  $$('[data-adentro="iman"]').forEach(b => b.setAttribute('aria-disabled', String(!imanOk)));
  $('#adentroHint').classList.toggle('is-warn', armar.adentro === 'nada' && !imanOk && armar.imanAvisado);
  $$('[data-mesa-guests]').forEach(el => { el.textContent = armar.guests; });
  pintarMesaRef?.();
}

function renderOpcionesArmado() {
  $('#optBolsa').innerHTML = BOLSAS.map(b => `<button type="button" class="opt" data-bolsa="${b.id}" aria-pressed="${b.id === armar.bolsa}"><img src="${b.img}" width="52" height="52" alt=""><span><b>${esc(b.label)}</b><small>${formatearPrecio(b.precio)} c/u</small></span></button>`).join('');
  $('#optAdentro').innerHTML = ADENTRO.map(a => `<button type="button" class="chip" data-adentro="${a.id}" aria-pressed="${a.id === armar.adentro}">${esc(a.label)}${a.precio ? ` <small>${a.soloCombo ? 'en combo' : '+' + formatearPrecio(a.precio)}</small>` : ''}</button>`).join('');
  $('#optCentro').innerHTML = CENTROS.map(c => `<button type="button" class="chip" data-centro="${c.id}" aria-pressed="${c.id === armar.centro}">${esc(c.label)} <small>${formatearPrecio(c.precio)}</small></button>`).join('');
}

function setGuests(v) {
  armar.guests = clamp(Math.round(Number(v) || 1), 1, 80);
  $('#invitados').value = armar.guests;
  renderArmado();
}

function initArmado() {
  renderOpcionesArmado();
  const hoy = new Date(); hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  $('#cFecha').min = hoy.toISOString().slice(0, 10);
  $('#armarForm').addEventListener('click', e => {
    const g = e.target.closest('[data-guests]');
    if (g) { setGuests(armar.guests + Number(g.dataset.guests)); return; }
    const m = e.target.closest('[data-mesas]');
    if (m) { armar.mesas = clamp(armar.mesas + Number(m.dataset.mesas), 0, 12); $('#mesas').textContent = armar.mesas; renderArmado(); return; }
    const b = e.target.closest('[data-bolsa]');
    if (b) {
      armar.bolsa = b.dataset.bolsa;
      if (armar.adentro === 'iman' && !['golosinera', 'boutique'].includes(armar.bolsa)) { armar.adentro = 'nada'; armar.imanAvisado = true; showToast('El fotoimán va en combo con la golosinera común o la boutique'); }
      $$('[data-bolsa]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      $$('[data-adentro]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.adentro === armar.adentro)));
      renderArmado(); return;
    }
    const a = e.target.closest('[data-adentro]');
    if (a) {
      if (a.getAttribute('aria-disabled') === 'true') { armar.imanAvisado = true; showToast('Elegí la golosinera común o la boutique para sumar el fotoimán'); renderArmado(); return; }
      armar.adentro = a.dataset.adentro;
      $$('[data-adentro]').forEach(x => x.setAttribute('aria-pressed', String(x === a)));
      renderArmado(); return;
    }
    const c = e.target.closest('[data-centro]');
    if (c) { armar.centro = c.dataset.centro; $$('[data-centro]').forEach(x => x.setAttribute('aria-pressed', String(x === c))); renderArmado(); }
  });
  $('#invitados').addEventListener('change', e => setGuests(e.target.value));
  $('#invitados').addEventListener('input', e => { if (e.target.value !== '') setGuests(e.target.value); });
  ['#cNombre', '#cEdad', '#cTema', '#cFecha'].forEach(s => $(s).addEventListener('input', renderArmado));
  $('#rAdd').addEventListener('click', () => {
    const r = calcularArmado(); const d = persArmado();
    r.lineas.forEach(l => { const p = getProducto(l.cart.id); if (p) Cart.add(p, l.cart.qty, l.cart.talle, d); });
    showToast(`Sumaste el pedido de ${armar.guests} invitados: ${formatearPrecio(r.total)}`);
  });
  renderArmado();
}

function initMesa() {
  const sec = $('#mesa'); const view = $('#mesaView'); const cam = $('#mesaCam');
  if (!sec || !view || !cam) return;
  const IW = 3200, IH = 2134, R = IW / IH;
  const STOPS = [
    { fx: .546, fy: .553, z: 2.7, prod: 'milk-box', talle: 'unica', qty: () => armar.guests },
    { fx: .217, fy: .536, z: 2.5, prod: 'centro-mesa', talle: 'tematico', qty: () => Math.max(1, armar.mesas) },
    { fx: .482, fy: .47, z: 2.3, prod: 'kit-cumple', talle: 'unico', qty: () => 1 }
  ];
  const FULL = { fx: .5, fy: .5, z: 1, tx: .5, ty: .5 };
  const pins = $$('.mesa-pin', view);
  const slides = $$('.mesa-slide', sec);
  const bars = $$('.mesa-steps i', sec);
  const SEG = [[.10, .34], [.34, .58], [.58, .82], [.82, 1]];
  const HOLD = [[.2, .36], [.44, .6], [.68, .84]];
  let W = 0, H = 0, imgW = 0, imgH = 0, movil = false, activo = -2, pendiente = false;

  const stopState = i => ({ fx: STOPS[i].fx, fy: STOPS[i].fy, z: STOPS[i].z * (movil ? .9 : 1), tx: movil ? .5 : .66, ty: movil ? .5 : .44 });
  const keys = () => [[0, FULL], [.10, FULL], [.22, stopState(0)], [.34, stopState(0)], [.46, stopState(1)], [.58, stopState(1)], [.70, stopState(2)], [.82, stopState(2)], [.92, FULL], [1, FULL]];
  const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function medir() {
    const r = view.getBoundingClientRect();
    W = r.width; H = r.height;
    if (W / H > R) { imgW = W; imgH = W / R; } else { imgH = H; imgW = H * R; }
    cam.style.width = imgW + 'px'; cam.style.height = imgH + 'px';
    movil = window.matchMedia('(max-width: 760px)').matches;
  }

  function camara(p) {
    const k = keys();
    let a = k[0], b = k[k.length - 1];
    for (let i = 0; i < k.length - 1; i++) { if (p >= k[i][0] && p <= k[i + 1][0]) { a = k[i]; b = k[i + 1]; break; } }
    const t = b[0] === a[0] ? 0 : ease(clamp((p - a[0]) / (b[0] - a[0]), 0, 1));
    const s = {};
    ['fx', 'fy', 'z', 'tx', 'ty'].forEach(key => { s[key] = a[1][key] + (b[1][key] - a[1][key]) * t; });
    let X = s.tx * W - s.z * s.fx * imgW;
    let Y = s.ty * H - s.z * s.fy * imgH;
    X = clamp(X, W - s.z * imgW, 0);
    Y = clamp(Y, H - s.z * imgH, 0);
    return { X, Y, z: s.z };
  }

  function progreso() {
    const r = sec.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    return total > 0 ? clamp(-r.top / total, 0, 1) : 0;
  }

  function textos(i) {
    const g = armar.guests; const m = Math.max(1, armar.mesas);
    const centro = precioTalle(getProducto('centro-mesa'), 'tematico');
    const milk = precioTalle(getProducto('milk-box'), 'unica');
    const kit = precioTalle(getProducto('kit-cumple'), 'unico');
    $('#mesaStep').textContent = i < 3 ? `Pieza ${i + 1} de 3` : 'Toda la mesa';
    const sub = [`${formatearPrecio(milk * g)} para ${g} invitados`, `${formatearPrecio(centro * m)} para ${m} ${m === 1 ? 'mesa' : 'mesas'}`, `${formatearPrecio(kit)} el kit`, `${formatearPrecio(milk * g + centro * m + kit)} en total`][clamp(i, 0, 3)];
    $('#mesaSub').textContent = sub;
    const t0 = $('[data-mesa-total="0"]'); if (t0) t0.textContent = `${formatearPrecio(milk * g)} para ${g}`;
    const t1 = $('[data-mesa-total="1"]'); if (t1) t1.textContent = `${formatearPrecio(centro * m)} para ${m} ${m === 1 ? 'mesa' : 'mesas'}`;
    const q0 = $('[data-mesa-qty="0"]'); if (q0) q0.textContent = g;
    const q1 = $('[data-mesa-qty="1"]'); if (q1) q1.textContent = m;
    $('#mesaList').innerHTML = [
      [`${g} × Milk box`, milk * g], [`${m} × Centro de mesa temático`, centro * m], ['1 × Kit cumple con adorno de torta', kit]
    ].map(([l, v]) => `<li><span>${esc(l)}</span><span>${formatearPrecio(v)}</span></li>`).join('');
    $('#mesaTotal').textContent = formatearPrecio(milk * g + centro * m + kit);
  }

  function pintar(pForzado) {
    pendiente = false;
    const p = typeof pForzado === 'number' ? pForzado : progreso();
    const c = camara(p);
    cam.style.transform = `translate3d(${c.X.toFixed(1)}px, ${c.Y.toFixed(1)}px, 0) scale(${c.z.toFixed(4)})`;
    sec.classList.toggle('is-past-intro', p >= .08);
    sec.classList.toggle('is-touring', p >= .1 && p < .9);
    const idx = p < .08 ? -1 : p < .40 ? 0 : p < .64 ? 1 : p < .86 ? 2 : 3;
    if (idx !== activo) {
      activo = idx;
      slides.forEach((s, i) => { const on = i === idx; s.classList.toggle('is-active', on); s.setAttribute('aria-hidden', String(!on)); s.inert = !on; });
    }
    textos(Math.max(0, idx));
    SEG.forEach(([a, b], i) => { if (bars[i]) bars[i].style.setProperty('--s', clamp((p - a) / (b - a), 0, 1).toFixed(3)); });
    pins.forEach((pin, i) => {
      const [a, b] = HOLD[i];
      const on = p >= a && p <= b;
      pin.classList.toggle('is-active', on);
      if (on) {
        const s = STOPS[i];
        const x = c.X + c.z * s.fx * imgW;
        const y = c.Y + c.z * s.fy * imgH;
        pin.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%)`;
      }
    });
  }
  const pedir = () => { if (!pendiente) { pendiente = true; requestAnimationFrame(() => pintar()); } };

  sec.addEventListener('click', e => {
    const add = e.target.closest('[data-mesa-add]');
    if (add) {
      const s = STOPS[Number(add.dataset.mesaAdd)]; const p = getProducto(s.prod);
      if (p) agregar(p, s.qty(), s.talle, {});
      return;
    }
    if (e.target.closest('#mesaAddAll')) {
      STOPS.forEach(s => { const p = getProducto(s.prod); if (p) Cart.add(p, s.qty(), s.talle, {}); });
      showToast('¡Toda la mesa quedó en el carrito!');
      return;
    }
    if (e.target.closest('#mesaArmar')) {
      armar.bolsa = 'milkbox'; if (armar.adentro === 'iman') armar.adentro = 'nada'; armar.centro = 'tematico';
      renderOpcionesArmado(); renderArmado();
    }
  });

  medir();
  pintarMesaRef = () => pintar();
  if (reduceMotion) {
    sec.classList.add('is-static', 'is-past-intro');
    cam.style.transform = `translate3d(${(W - imgW) / 2}px, ${(H - imgH) / 2}px, 0)`;
    slides.forEach((s, i) => { const on = i === 3; s.classList.toggle('is-active', on); s.inert = !on; });
    textos(3);
    pintarMesaRef = () => textos(3);
    window.addEventListener('resize', () => { medir(); cam.style.transform = `translate3d(${(W - imgW) / 2}px, ${(H - imgH) / 2}px, 0)`; }, { passive: true });
    return;
  }
  pintar();
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', () => { medir(); pedir(); }, { passive: true });
  window.addEventListener('load', () => { medir(); pintar(); });
}

function initMicro() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.to(".hero-visual", { yPercent: -4, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 } });
  gsap.fromTo('.insta-grid', { yPercent: 4 }, { yPercent: -2, ease: 'none', scrollTrigger: { trigger: '.insta', start: 'top bottom', end: 'bottom top', scrub: .8 } });
}

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
  revealIO = io;
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
  cont.querySelectorAll('[data-animate]:not(.in)').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight) el.classList.add('in');
    else if (revealIO) revealIO.observe(el);
    else el.classList.add('in');
  });
}

initTienda();
initQuickView();
initCarrito();
initArmado();
initMesa();
initReveals();
initNav();
initFloats();
initWspLinks();
initMicro();
