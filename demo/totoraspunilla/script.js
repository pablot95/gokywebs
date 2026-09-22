// Totoras Punilla — lógica compartida (index.html + modelo-2.html)

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WHATSAPP_NUMBER = '5493548411636';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const ICONOS = {
  totoras: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 21V9c0-3 1-6 2-8"/><path d="M12 21V5c0-2 1-3 2-4"/><path d="M18 21V11c0-2.5.7-4.5 1.5-6"/></svg>',
  pabilo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="12" r="7"/><path d="M11 5c-2 1.5-3 4-3 7s1 5.5 3 7M11 5c2 1.5 3 4 3 7s-1 5.5-3 7"/><path d="M17 17c1.5.8 2.5 2 3 3.5"/></svg>',
  estopa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 8c2-1 3 1 5-.5S12 5 14 7s3-1 5 .5"/><path d="M4 13c2-1 3 1 5-.5s3-2.5 5-.5 3-1 5 .5"/><path d="M4 18c2-1 3 1 5-.5s3-2.5 5-.5 3-1 5 .5"/></svg>',
  mdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="7" rx="8" ry="3"/><path d="M4 7v5c0 1.7 3.6 3 8 3s8-1.3 8-3V7"/><path d="M4 12v5c0 1.7 3.6 3 8 3s8-1.3 8-3v-5"/></svg>',
};

const CATEGORIAS = [
  { id: 'totoras', nombre: 'Totoras', desc: 'Natural, larga y teñida', tint: 'a' },
  { id: 'pabilo', nombre: 'Pabilo', desc: 'Crudo, blanco y colores', tint: 'b' },
  { id: 'estopa', nombre: 'Estopa', desc: 'Suelta, madeja y arpillera', tint: 'a' },
  { id: 'mdf', nombre: 'Bases de MDF', desc: 'Redondas, ovaladas y rectas', tint: 'b' },
];

const PRODUCTOS = [
  { id: 'tot-fina', slug: 'totora-natural-fina', nombre: 'Totora natural fina', categoria: 'totoras', subcategoria: 'Natural', precio: 4200, descuento: 0, stock: 40, variantes: [], descripcion: 'Totora natural de fibra fina, ideal para tejidos delicados, individuales y piezas de terminación prolija. Atado de 1 kg.', imagenes: [], tags: ['totora', 'fina', 'natural', 'tejido'] },
  { id: 'tot-gruesa', slug: 'totora-natural-gruesa', nombre: 'Totora natural gruesa', categoria: 'totoras', subcategoria: 'Natural', precio: 4800, descuento: 0, stock: 35, variantes: [], descripcion: 'Totora de fibra gruesa, la que más rinde para cestos y piezas grandes. Atado de 1 kg.', imagenes: ['images/totora-atados.webp'], tags: ['totora', 'gruesa', 'natural', 'cestos'] },
  { id: 'tot-larga', slug: 'totora-extra-larga', nombre: 'Totora extra larga', categoria: 'totoras', subcategoria: 'Larga', precio: 6500, descuento: 0, stock: 18, variantes: [], descripcion: 'Totora de fibra extra larga, pensada para muebles, revestimientos y piezas de gran formato. Atado de 1 kg.', imagenes: ['images/totora-reed.webp'], tags: ['totora', 'larga', 'muebles', 'revestimiento'] },
  { id: 'tot-estera', slug: 'estera-de-totora', nombre: 'Estera de totora tejida', categoria: 'totoras', subcategoria: 'Tejida', precio: 12000, descuento: 0, stock: 10, variantes: [], descripcion: 'Estera de totora ya tejida, en rollo. Lista para forrar o usar como base de trabajo. Aprox. 1 x 2 m.', imagenes: [], tags: ['totora', 'estera', 'rollo', 'tejida'] },
  { id: 'tot-tenida', slug: 'totora-tenida-verde', nombre: 'Totora teñida verde', categoria: 'totoras', subcategoria: 'Teñida', precio: 3800, descuento: 15, stock: 22, variantes: [], descripcion: 'Totora teñida en verde, para sumar color a cestos y piezas decorativas. Atado de 500 g.', imagenes: [], tags: ['totora', 'teñida', 'verde', 'color'] },

  { id: 'pab-crudo3', slug: 'pabilo-crudo-3mm', nombre: 'Pabilo crudo 3mm', categoria: 'pabilo', subcategoria: 'Crudo', precio: 5200, descuento: 0, stock: 50, variantes: [], descripcion: 'Pabilo de algodón crudo, grosor 3mm. Cono de 500 g, ideal para crochet y macramé fino.', imagenes: ['images/pabilo-carretes-natural.webp'], tags: ['pabilo', 'crudo', '3mm', 'crochet'] },
  { id: 'pab-crudo5', slug: 'pabilo-crudo-5mm', nombre: 'Pabilo crudo 5mm', categoria: 'pabilo', subcategoria: 'Crudo', precio: 9800, descuento: 0, stock: 38, variantes: [], descripcion: 'Pabilo crudo grueso, grosor 5mm, el más elegido para cestería y piezas de mayor volumen. Cono de 1 kg.', imagenes: ['images/pabilo-bobinas-taller.webp'], tags: ['pabilo', 'crudo', '5mm', 'grueso', 'cesteria'] },
  { id: 'pab-blanco', slug: 'pabilo-blanco-3mm', nombre: 'Pabilo blanco 3mm', categoria: 'pabilo', subcategoria: 'Blanco', precio: 5600, descuento: 0, stock: 30, variantes: [], descripcion: 'Pabilo blanqueado, grosor 3mm. Cono de 500 g, para piezas de tono claro y parejo.', imagenes: [], tags: ['pabilo', 'blanco', '3mm'] },
  { id: 'pab-rosa', slug: 'pabilo-rosa-viejo', nombre: 'Pabilo color rosa viejo', categoria: 'pabilo', subcategoria: 'Color', precio: 3200, descuento: 0, stock: 26, variantes: [], descripcion: 'Pabilo teñido rosa viejo, grosor 3mm. Ovillo de 200 g.', imagenes: ['images/pabilo-colores.webp'], tags: ['pabilo', 'color', 'rosa', 'ovillo'] },
  { id: 'pab-oliva', slug: 'pabilo-verde-oliva', nombre: 'Pabilo color verde oliva', categoria: 'pabilo', subcategoria: 'Color', precio: 3200, descuento: 0, stock: 26, variantes: [], descripcion: 'Pabilo teñido verde oliva, grosor 3mm. Ovillo de 200 g.', imagenes: ['images/pabilo-colores.webp'], tags: ['pabilo', 'color', 'verde', 'oliva', 'ovillo'] },
  { id: 'pab-mostaza', slug: 'pabilo-mostaza', nombre: 'Pabilo color mostaza', categoria: 'pabilo', subcategoria: 'Color', precio: 3200, descuento: 0, stock: 24, variantes: [], descripcion: 'Pabilo teñido mostaza, grosor 3mm. Ovillo de 200 g.', imagenes: [], tags: ['pabilo', 'color', 'mostaza', 'ovillo'] },
  { id: 'pab-terracota', slug: 'pabilo-terracota', nombre: 'Pabilo color terracota', categoria: 'pabilo', subcategoria: 'Color', precio: 3200, descuento: 10, stock: 20, variantes: [], descripcion: 'Pabilo teñido terracota, grosor 3mm. Ovillo de 200 g.', imagenes: [], tags: ['pabilo', 'color', 'terracota', 'ovillo'] },

  { id: 'est-1kg', slug: 'estopa-natural-1kg', nombre: 'Estopa natural x 1kg', categoria: 'estopa', subcategoria: 'Natural', precio: 3600, descuento: 0, stock: 32, variantes: [], descripcion: 'Estopa de fibra natural suelta, para relleno, base de tejido y trabajos de cestería. Bolsa de 1 kg.', imagenes: ['images/estopa-fibra-natural.webp'], tags: ['estopa', 'fibra', 'natural', 'relleno'] },
  { id: 'est-500g', slug: 'estopa-natural-500g', nombre: 'Estopa natural x 500g', categoria: 'estopa', subcategoria: 'Natural', precio: 2100, descuento: 0, stock: 40, variantes: [], descripcion: 'Estopa de fibra natural suelta en bolsa chica, para probar o proyectos puntuales. 500 g.', imagenes: [], tags: ['estopa', 'fibra', 'natural', 'chica'] },
  { id: 'est-madeja', slug: 'estopa-en-madeja', nombre: 'Estopa en madeja', categoria: 'estopa', subcategoria: 'Madeja', precio: 4500, descuento: 0, stock: 15, variantes: [], descripcion: 'Estopa presentada en madeja, más fácil de dosificar para trabajos prolijos. 1 kg aproximado.', imagenes: [], tags: ['estopa', 'madeja'] },
  { id: 'est-arpillera', slug: 'arpillera-en-rollo', nombre: 'Arpillera en rollo', categoria: 'estopa', subcategoria: 'Arpillera', precio: 8500, descuento: 0, stock: 12, variantes: [], descripcion: 'Arpillera de estopa tejida, en rollo de 5 metros. Para forrar, tapizar o como base decorativa.', imagenes: [], tags: ['estopa', 'arpillera', 'tela', 'rollo'] },

  { id: 'mdf-15', slug: 'base-mdf-redonda-15cm', nombre: 'Base MDF redonda 15cm', categoria: 'mdf', subcategoria: 'Redonda', precio: 1400, descuento: 0, stock: 60, variantes: [], descripcion: 'Base de MDF redonda, 15 cm de diámetro, con orificios para empezar a tejer. 3mm de espesor.', imagenes: [], tags: ['mdf', 'base', 'redonda', '15cm'] },
  { id: 'mdf-20', slug: 'base-mdf-redonda-20cm', nombre: 'Base MDF redonda 20cm', categoria: 'mdf', subcategoria: 'Redonda', precio: 1900, descuento: 0, stock: 55, variantes: [], descripcion: 'Base de MDF redonda, 20 cm de diámetro, con orificios para empezar a tejer. 3mm de espesor.', imagenes: ['images/bases-mdf-formas.webp'], tags: ['mdf', 'base', 'redonda', '20cm'] },
  { id: 'mdf-25', slug: 'base-mdf-redonda-25cm', nombre: 'Base MDF redonda 25cm', categoria: 'mdf', subcategoria: 'Redonda', precio: 2600, descuento: 0, stock: 40, variantes: [], descripcion: 'Base de MDF redonda, 25 cm de diámetro, con orificios para empezar a tejer. 3mm de espesor.', imagenes: [], tags: ['mdf', 'base', 'redonda', '25cm'] },
  { id: 'mdf-30', slug: 'base-mdf-redonda-30cm', nombre: 'Base MDF redonda 30cm', categoria: 'mdf', subcategoria: 'Redonda', precio: 3400, descuento: 12, stock: 24, variantes: [], descripcion: 'Base de MDF redonda, 30 cm de diámetro, para cestos grandes. 3mm de espesor.', imagenes: [], tags: ['mdf', 'base', 'redonda', '30cm', 'grande'] },
  { id: 'mdf-oval', slug: 'base-mdf-ovalada-20x30', nombre: 'Base MDF ovalada 20x30cm', categoria: 'mdf', subcategoria: 'Ovalada', precio: 3100, descuento: 0, stock: 20, variantes: [], descripcion: 'Base de MDF ovalada, 20 x 30 cm, con orificios. Ideal para canastos alargados.', imagenes: ['images/bases-mdf-formas.webp'], tags: ['mdf', 'base', 'ovalada'] },
  { id: 'mdf-rect', slug: 'base-mdf-rectangular-15x25', nombre: 'Base MDF rectangular 15x25cm', categoria: 'mdf', subcategoria: 'Rectangular', precio: 2800, descuento: 0, stock: 18, variantes: [], descripcion: 'Base de MDF rectangular, 15 x 25 cm, con orificios. Para bandejas y canastos de línea recta.', imagenes: [], tags: ['mdf', 'base', 'rectangular'] },
];

const DESTACADOS_IDS = ['tot-gruesa', 'pab-crudo5', 'mdf-20', 'tot-larga', 'pab-rosa', 'est-1kg', 'mdf-oval', 'pab-oliva'];

// Calculadora de materiales — cantidades estimadas, no exactas
const PROYECTOS_CALC = [
  { id: 'individual', nombre: 'Individual o posavasos', items: [{ id: 'tot-fina', qty: 1 }, { id: 'pab-rosa', qty: 1 }, { id: 'mdf-15', qty: 1 }] },
  { id: 'chico', nombre: 'Cesto chico (~20 cm)', items: [{ id: 'tot-fina', qty: 2 }, { id: 'pab-crudo3', qty: 1 }, { id: 'mdf-15', qty: 1 }] },
  { id: 'mediano', nombre: 'Cesto mediano (~30 cm)', items: [{ id: 'tot-gruesa', qty: 3 }, { id: 'pab-crudo5', qty: 1 }, { id: 'mdf-20', qty: 1 }] },
  { id: 'grande', nombre: 'Cesto grande (~40 cm)', items: [{ id: 'tot-gruesa', qty: 5 }, { id: 'pab-crudo5', qty: 2 }, { id: 'mdf-30', qty: 1 }] },
  { id: 'cortina', nombre: 'Cortina de totora (por metro)', items: [{ id: 'tot-larga', qty: 1 }, { id: 'pab-crudo5', qty: 1 }] },
];

const CAPITULOS = [
  { cat: 'totoras', titulo: 'Totoras', texto: 'Fibra natural, larga o teñida. La base de todo cesto, individual o revestimiento.', img: 'images/totora-reed.webp' },
  { cat: 'pabilo', titulo: 'Pabilo', texto: 'Crudo, blanco o en color. Conos y ovillos para coser, tejer y rematar cada pieza.', img: 'images/pabilo-colores.webp' },
  { cat: 'estopa', titulo: 'Estopa', texto: 'Fibra suelta o en arpillera, para relleno, base y terminaciones con cuerpo.', img: 'images/estopa-fibra-natural.webp' },
  { cat: 'mdf', titulo: 'Bases de MDF', texto: 'Redondas, ovaladas o rectangulares, con orificios listos para empezar a tejer.', img: 'images/bases-mdf-formas.webp' },
];

/* ===== Carrito ===== */
const Cart = {
  KEY: 'totoraspunilla_cart',
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
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

/* ===== Toast ===== */
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

/* ===== Render de card de producto ===== */
function mediaHtml(p) {
  const foto = p.imagenes && p.imagenes[0];
  if (foto) return `<img src="${esc(foto)}" alt="${esc(p.nombre)}" loading="lazy" width="600" height="600">`;
  const cat = CATEGORIAS.find(c => c.id === p.categoria);
  const spec = p.subcategoria || '';
  return `<div class="prod-placa" data-tint="${cat ? cat.tint : 'a'}">${ICONOS[p.categoria] || ''}<span class="prod-placa__spec">${esc(spec)}</span></div>`;
}

function cardHtml(p) {
  const pf = precioFinal(p);
  const off = p.descuento > 0 ? `<span class="off">-${p.descuento}%</span>` : '';
  const original = p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : '';
  const cat = CATEGORIAS.find(c => c.id === p.categoria);
  return `
  <article class="prod-card" data-id="${p.id}" data-animate style="opacity:0;transform:translateY(24px)">
    <div class="prod-media">
      ${p.descuento > 0 ? `<span class="prod-badge tag">-${p.descuento}%</span>` : ''}
      <button type="button" class="prod-fav" data-fav="${p.id}" aria-pressed="false" aria-label="Guardar en favoritos">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20.5s-7.5-4.6-10-9.3C.4 7.8 2 4.5 5.3 4c2-.3 3.7.6 4.7 2.2C11 4.6 12.7 3.7 14.7 4c3.3.5 4.9 3.8 3.3 7.2-2.5 4.7-10 9.3-10 9.3z"/></svg>
      </button>
      <a href="#" class="prod-media-link" data-quickview="${p.id}" style="display:block;width:100%;height:100%">${mediaHtml(p)}</a>
    </div>
    <div class="prod-info">
      <span class="prod-cat">${esc(cat ? cat.nombre : '')}</span>
      <a href="#" class="prod-nombre" data-quickview="${p.id}" style="text-decoration:none">${esc(p.nombre)}</a>
      <div class="prod-precio">${off}<b>${formatearPrecio(pf)}</b>${original}</div>
      <div class="prod-actions">
        <div class="stepper" data-stepper="${p.id}">
          <button type="button" data-step="-1" aria-label="Restar">−</button>
          <output>1</output>
          <button type="button" data-step="1" aria-label="Sumar">+</button>
        </div>
        <button type="button" class="btn btn-cta btn-sm prod-add" data-add="${p.id}">Agregar</button>
      </div>
    </div>
  </article>`;
}

/* ===== Categorías ===== */
function initCategorias() {
  const grid = document.getElementById('categoriasGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map(c => `
    <button type="button" class="categoria-circulo" data-cat-filter="${c.id}" data-animate style="opacity:0;transform:translateY(20px)">
      <span class="categoria-circulo__ico">${ICONOS[c.id]}</span>
      <span>${esc(c.nombre)}</span>
      <small>${esc(c.desc)}</small>
    </button>`).join('');
  grid.querySelectorAll('[data-cat-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      aplicarFiltroCategoria(btn.dataset.catFilter);
      document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

/* ===== Calculadora de materiales ===== */
function initCalculadora() {
  const sel = document.getElementById('calcSelect');
  const resultado = document.getElementById('calcResultado');
  const itemsWrap = document.getElementById('calcItems');
  const totalOut = document.getElementById('calcTotal');
  const addBtn = document.getElementById('calcAdd');
  if (!sel || !resultado) return;

  sel.innerHTML = '<option value="">Elegí qué querés armar…</option>' + PROYECTOS_CALC.map(p => `<option value="${p.id}">${esc(p.nombre)}</option>`).join('');

  const render = () => {
    const proyecto = PROYECTOS_CALC.find(p => p.id === sel.value);
    if (!proyecto) { resultado.hidden = true; return; }
    let total = 0;
    itemsWrap.innerHTML = proyecto.items.map(it => {
      const p = getProducto(it.id); if (!p) return '';
      const sub = precioFinal(p) * it.qty; total += sub;
      return `<div class="calc-item"><span class="calc-item__nombre">${esc(p.nombre)}</span><span class="calc-item__qty">x${it.qty}</span></div>`;
    }).join('');
    totalOut.innerHTML = `<span>Total estimado</span><b>${formatearPrecio(total)}</b>`;
    resultado.hidden = false;
    resultado.dataset.proyecto = proyecto.id;
  };
  sel.addEventListener('change', render);

  addBtn?.addEventListener('click', () => {
    const proyecto = PROYECTOS_CALC.find(p => p.id === resultado.dataset.proyecto);
    if (!proyecto) return;
    proyecto.items.forEach(it => { const p = getProducto(it.id); if (p) Cart.add(p, it.qty); });
    showToast('¡Sumamos el kit al carrito!');
  });
}

/* ===== Rail de destacados ===== */
function initRail() {
  const vp = document.getElementById('railVp');
  const track = document.getElementById('railTrack');
  if (!vp || !track) return;
  const productos = DESTACADOS_IDS.map(getProducto).filter(Boolean);
  track.innerHTML = productos.map(p => `<div class="rail-card">${cardHtml(p)}</div>`).join('');

  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
  const syncArrows = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -320, behavior: 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: 320, behavior: 'smooth' }));
  vp.addEventListener('scroll', syncArrows, { passive: true });
  syncArrows();

  let down = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    down = true; moved = false; startX = e.clientX; startScroll = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true; vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    if (moved) vp.scrollLeft = startScroll - dx;
  });
  const end = () => {
    down = false; vp.classList.remove('dragging');
    try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
    setTimeout(() => { moved = false; }, 30);
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);

  bindCardEvents(track);
}

/* ===== Capítulos (momento propio) ===== */
function initCapitulos() {
  const track = document.querySelector('.capitulos-track');
  const scene = document.querySelector('.capitulos-scene');
  if (!track || !scene) return;
  const visual = scene.querySelector('.capitulos-visual');
  const panel = scene.querySelector('.capitulos-panel');
  visual.innerHTML = CAPITULOS.map((c, i) => `<img class="capitulos-visual__img${i === 0 ? ' activo' : ''}" src="${esc(c.img)}" alt="${esc(c.titulo)}" loading="${i === 0 ? 'eager' : 'lazy'}">`).join('') + '<div class="capitulos-visual__scrim"></div>';

  const stepsHtml = CAPITULOS.map(() => '<div class="capitulos-step"><i></i></div>').join('');

  const render = i => {
    const c = CAPITULOS[i];
    const disponibles = PRODUCTOS.filter(p => p.categoria === c.cat);
    const desde = Math.min(...disponibles.map(precioFinal));
    panel.innerHTML = `
      <span class="capitulos-index">0${i + 1} / 0${CAPITULOS.length}</span>
      <h3>${esc(c.titulo)}</h3>
      <p>${esc(c.texto)}</p>
      <div class="capitulos-dato"><b>${formatearPrecio(desde)}</b><span>desde, ${disponibles.length} variantes</span></div>
      <div class="capitulos-steps">${stepsHtml}</div>
      <div class="capitulos-cta"><button type="button" class="btn btn-outline" data-cap-ver="${c.cat}">Ver ${esc(c.titulo.toLowerCase())}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></div>`;
    panel.querySelectorAll('.capitulos-step').forEach((el, idx) => {
      el.querySelector('i').style.width = idx < i ? '100%' : (idx === i ? '100%' : '0%');
      el.querySelector('i').style.opacity = idx <= i ? '1' : '.35';
    });
    visual.querySelectorAll('.capitulos-visual__img').forEach((img, idx) => img.classList.toggle('activo', idx === i));
    panel.querySelector('[data-cap-ver]')?.addEventListener('click', () => {
      aplicarFiltroCategoria(c.cat);
      document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  };
  render(0);

  if (reduceMotion) return;
  let actual = 0;
  const onScroll = () => {
    const OFF = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
    const r = track.getBoundingClientRect();
    const scrollable = track.offsetHeight - scene.offsetHeight;
    if (scrollable <= 0) return;
    const avance = Math.min(Math.max(OFF - r.top, 0), scrollable);
    const progreso = avance / scrollable;
    const i = Math.min(CAPITULOS.length - 1, Math.floor(progreso * CAPITULOS.length));
    if (i !== actual) { actual = i; render(i); }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}

/* ===== Catálogo (buscador + filtros + paginación) ===== */
const catState = { q: '', categorias: new Set(), precios: new Set(), pagina: 16 };
const RANGOS_PRECIO = [
  { id: 'bajo', nombre: 'Hasta $3.000', test: p => precioFinal(p) < 3000 },
  { id: 'medio', nombre: '$3.000 – $6.000', test: p => precioFinal(p) >= 3000 && precioFinal(p) <= 6000 },
  { id: 'alto', nombre: 'Más de $6.000', test: p => precioFinal(p) > 6000 },
];

function aplicarFiltroCategoria(catId) {
  catState.categorias = new Set(catId ? [catId] : []);
  document.querySelectorAll('[data-f="categoria"]').forEach(cb => { cb.checked = cb.value === catId; });
  document.querySelectorAll('.chip[data-chip-cat]').forEach(ch => ch.setAttribute('aria-pressed', String(ch.dataset.chipCat === catId)));
  catState.pagina = 16;
  renderCatalogo();
}

function filtrarProductos() {
  const q = normalizar(catState.q);
  return PRODUCTOS.filter(p => {
    if (catState.categorias.size && !catState.categorias.has(p.categoria)) return false;
    if (catState.precios.size) {
      const rangos = RANGOS_PRECIO.filter(r => catState.precios.has(r.id));
      if (!rangos.some(r => r.test(p))) return false;
    }
    if (!q) return true;
    const hay = normalizar([p.nombre, p.categoria, p.subcategoria, p.descripcion, ...(p.tags || [])].join(' '));
    return hay.includes(q);
  });
}

let revealsListos = false;
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
  });
}

function renderCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const filtrados = filtrarProductos();
  const visibles = filtrados.slice(0, catState.pagina);
  grid.innerHTML = visibles.map(cardHtml).join('');
  bindCardEvents(grid);
  revelarNuevos(grid);

  const verMasWrap = document.getElementById('verMasWrap');
  const verMasBtn = document.getElementById('verMasBtn');
  if (verMasWrap) verMasWrap.hidden = filtrados.length <= catState.pagina;
  if (verMasBtn) verMasBtn.textContent = `Ver más (+${Math.min(16, filtrados.length - catState.pagina)})`;

  const vacio = document.getElementById('catalogoVacio');
  if (vacio) vacio.classList.toggle('visible', filtrados.length === 0);

  const count = document.getElementById('catalogoCount');
  if (count) count.textContent = `${filtrados.length} producto${filtrados.length === 1 ? '' : 's'}`;

  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;

  const catGrupo = document.getElementById('filtroCategoriaGrupo');
  if (catGrupo) {
    catGrupo.innerHTML = CATEGORIAS.map(c => `
      <label class="filtro-check"><input type="checkbox" data-f="categoria" value="${c.id}"><span>${esc(c.nombre)}</span><small>${PRODUCTOS.filter(p => p.categoria === c.id).length}</small></label>`).join('');
  }
  const precioGrupo = document.getElementById('filtroPrecioGrupo');
  if (precioGrupo) {
    precioGrupo.innerHTML = RANGOS_PRECIO.map(r => `
      <label class="filtro-check"><input type="checkbox" data-f="precio" value="${r.id}"><span>${esc(r.nombre)}</span></label>`).join('');
  }

  const search = document.getElementById('catalogoSearch');
  search?.addEventListener('input', () => { catState.q = search.value; catState.pagina = 16; renderCatalogo(); });

  document.querySelectorAll('.chip[data-chip-cat]').forEach(chip => {
    chip.addEventListener('click', () => {
      const val = chip.dataset.chipCat;
      const activo = chip.getAttribute('aria-pressed') === 'true';
      document.querySelectorAll('.chip[data-chip-cat]').forEach(c => c.setAttribute('aria-pressed', 'false'));
      catState.categorias = new Set(activo ? [] : (val ? [val] : []));
      catState.pagina = 16;
      renderCatalogo();
    });
  });

  document.querySelectorAll('[data-f="categoria"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const marcados = [...document.querySelectorAll('[data-f="categoria"]:checked')].map(c => c.value);
      catState.categorias = new Set(marcados);
      catState.pagina = 16;
      renderCatalogo();
    });
  });
  document.querySelectorAll('[data-f="precio"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const marcados = [...document.querySelectorAll('[data-f="precio"]:checked')].map(c => c.value);
      catState.precios = new Set(marcados);
      catState.pagina = 16;
      renderCatalogo();
    });
  });

  document.getElementById('catalogoClear')?.addEventListener('click', () => {
    catState.q = ''; catState.categorias = new Set(); catState.precios = new Set(); catState.pagina = 16;
    if (search) search.value = '';
    document.querySelectorAll('[data-f="categoria"], [data-f="precio"]').forEach(cb => { cb.checked = false; });
    document.querySelectorAll('.chip[data-chip-cat]').forEach((c, i) => c.setAttribute('aria-pressed', String(i === 0)));
    renderCatalogo();
  });

  document.getElementById('verMasBtn')?.addEventListener('click', () => { catState.pagina += 16; renderCatalogo(); });

  renderCatalogo();
}

/* ===== Acciones de card: stepper, agregar, quickview, favoritos ===== */
function bindCardEvents(scope) {
  scope.querySelectorAll('[data-stepper]').forEach(st => {
    const out = st.querySelector('output');
    st.querySelectorAll('[data-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = Math.max(1, Math.min(99, parseInt(out.textContent, 10) + parseInt(btn.dataset.step, 10)));
        out.textContent = val;
      });
    });
  });
  scope.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = getProducto(btn.dataset.add); if (!p) return;
      const st = scope.querySelector(`[data-stepper="${p.id}"] output`) || document.querySelector(`[data-stepper="${p.id}"] output`);
      const qty = st ? parseInt(st.textContent, 10) : 1;
      Cart.add(p, qty);
      showToast(`${p.nombre} agregado al carrito`);
      const badge = btn.closest('.prod-card')?.querySelector('.prod-badge');
      if (badge) { badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump'); }
    });
  });
  scope.querySelectorAll('[data-quickview]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); abrirVistaRapida(el.dataset.quickview); });
  });
  scope.querySelectorAll('[data-fav]').forEach(btn => {
    const KEY = 'totoraspunilla_wishlist';
    const get = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
    const activo = get().includes(btn.dataset.fav);
    btn.setAttribute('aria-pressed', String(activo));
    btn.addEventListener('click', () => {
      let ids = get();
      const on = btn.getAttribute('aria-pressed') === 'true';
      ids = on ? ids.filter(id => id !== btn.dataset.fav) : [...ids, btn.dataset.fav];
      localStorage.setItem(KEY, JSON.stringify(ids));
      btn.setAttribute('aria-pressed', String(!on));
    });
  });
}

/* ===== Vista rápida ===== */
let quickviewLastFocus = null;
function abrirVistaRapida(id) {
  const p = getProducto(id); if (!p) return;
  const backdrop = document.getElementById('modalBackdrop');
  const box = document.getElementById('modalVistaRapida');
  if (!backdrop || !box) return;
  const cat = CATEGORIAS.find(c => c.id === p.categoria);
  const relacionados = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 3);

  box.innerHTML = `
    <button type="button" class="modal-close" id="modalClose" aria-label="Cerrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    <div class="modal-grid">
      <div class="modal-media">${mediaHtml(p)}</div>
      <div class="modal-info">
        <span class="prod-cat">${esc(cat ? cat.nombre : '')}</span>
        <h3>${esc(p.nombre)}</h3>
        <div class="prod-precio">${p.descuento > 0 ? `<span class="off">-${p.descuento}%</span>` : ''}<b>${formatearPrecio(precioFinal(p))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</div>
        <p class="desc">${esc(p.descripcion)}</p>
        <div class="modal-actions">
          <div class="stepper" data-stepper="${p.id}"><button type="button" data-step="-1" aria-label="Restar">−</button><output>1</output><button type="button" data-step="1" aria-label="Sumar">+</button></div>
          <button type="button" class="btn btn-cta prod-add" data-add="${p.id}">Agregar al carrito</button>
        </div>
      </div>
    </div>
    ${relacionados.length ? `<div class="relacionados"><p class="titulo">También te puede interesar</p><div class="relacionados-grid">${relacionados.map(cardHtml).join('')}</div></div>` : ''}`;

  bindCardEvents(box);
  document.getElementById('modalClose').addEventListener('click', cerrarVistaRapida);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) cerrarVistaRapida(); });

  quickviewLastFocus = document.activeElement;
  backdrop.hidden = false;
  document.body.classList.add('no-scroll');
  window.lenis?.stop();
  document.getElementById('modalClose').focus();
}
function cerrarVistaRapida() {
  const backdrop = document.getElementById('modalBackdrop');
  if (!backdrop || backdrop.hidden) return;
  backdrop.hidden = true;
  document.body.classList.remove('no-scroll');
  window.lenis?.start();
  quickviewLastFocus?.focus();
}
function initVistaRapida() {
  const backdrop = document.getElementById('modalBackdrop');
  if (!backdrop) return;
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !backdrop.hidden) cerrarVistaRapida(); });
}

/* ===== Carrito: drawer ===== */
function renderCartDrawer() {
  const itemsWrap = document.getElementById('cartItems');
  const emptyWrap = document.getElementById('cartEmpty');
  const foot = document.getElementById('cartFoot');
  const totalOut = document.getElementById('cartTotal');
  if (!itemsWrap) return;
  const items = Cart.get();
  if (!items.length) {
    itemsWrap.hidden = true; if (foot) foot.hidden = true; if (emptyWrap) emptyWrap.hidden = false;
    return;
  }
  itemsWrap.hidden = false; if (foot) foot.hidden = false; if (emptyWrap) emptyWrap.hidden = true;
  itemsWrap.innerHTML = items.map(it => {
    const p = getProducto(it.id); if (!p) return '';
    return `<div class="cart-item">
      <div class="cart-item__img">${mediaHtml(p)}</div>
      <div class="cart-item__info">
        <div class="cart-item__nombre">${esc(p.nombre)}</div>
        <div class="cart-item__row">
          <div class="stepper" data-cart-stepper="${p.id}"><button type="button" data-cstep="-1" aria-label="Restar">−</button><output>${it.qty}</output><button type="button" data-cstep="1" aria-label="Sumar">+</button></div>
          <b>${formatearPrecio(precioFinal(p) * it.qty)}</b>
        </div>
        <button type="button" class="cart-item__remove" data-remove="${p.id}">Quitar</button>
      </div>
    </div>`;
  }).join('');
  itemsWrap.querySelectorAll('[data-cart-stepper]').forEach(st => {
    const id = st.dataset.cartStepper; const out = st.querySelector('output');
    st.querySelectorAll('[data-cstep]').forEach(btn => btn.addEventListener('click', () => {
      Cart.setQty(id, parseInt(out.textContent, 10) + parseInt(btn.dataset.cstep, 10));
    }));
  });
  itemsWrap.querySelectorAll('[data-remove]').forEach(btn => btn.addEventListener('click', () => Cart.remove(btn.dataset.remove)));
  if (totalOut) totalOut.textContent = formatearPrecio(Cart.total());
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  renderCartDrawer();
}
document.addEventListener('cart:updated', updateCartBadge);

function openCartDrawer() {
  const backdrop = document.getElementById('cartDrawerBackdrop');
  if (!backdrop) return;
  renderCartDrawer();
  backdrop.classList.add('open');
  document.body.classList.add('no-scroll');
  window.lenis?.stop();
}
function closeCartDrawer() {
  const backdrop = document.getElementById('cartDrawerBackdrop');
  if (!backdrop) return;
  backdrop.classList.remove('open');
  document.body.classList.remove('no-scroll');
  window.lenis?.start();
}
function initCartDrawer() {
  const backdrop = document.getElementById('cartDrawerBackdrop');
  if (!backdrop) return;
  document.querySelectorAll('[data-cart-open]').forEach(b => b.addEventListener('click', openCartDrawer));
  document.getElementById('cartDrawerClose')?.addEventListener('click', closeCartDrawer);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeCartDrawer(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && backdrop.classList.contains('open')) closeCartDrawer(); });
  document.getElementById('cartCheckout')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.getElementById('cartEmptyLink')?.addEventListener('click', closeCartDrawer);
  updateCartBadge();
}

/* ===== Flotantes: carrito + WhatsApp ===== */
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

/* ===== Filtros mobile (Modelo B) ===== */
function initFiltrosMobile() {
  const panel = document.getElementById('catalogoFiltros');
  const toggle = document.getElementById('filtrosToggle');
  const close = document.getElementById('filtrosClose');
  if (!panel || !toggle) return;
  let bd = document.querySelector('.filtros-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); }
  const open = () => { panel.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); };
  const shut = () => { panel.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); };
  toggle.addEventListener('click', open);
  close?.addEventListener('click', shut);
  bd.addEventListener('click', shut);
}

/* ===== Hero banner: mensajes rotativos (Modelo A) ===== */
function initHeroMsgs() {
  const msgs = document.querySelectorAll('#heroMsgs .hero-banner__msg');
  if (msgs.length < 2 || reduceMotion) return;
  let i = 0;
  setInterval(() => {
    msgs[i].classList.remove('active');
    i = (i + 1) % msgs.length;
    msgs[i].classList.add('active');
  }, 3200);
}

/* ===== Nav mobile ===== */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const header = document.querySelector('.site-header');
  (header || document.body).appendChild(bd);
  const desktopMq = window.matchMedia('(min-width: 981px)');
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

/* ===== Mapa ===== */
function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const coords = [-31.0004, -64.4756]; // Centro de Cosquín, Valle de Punilla
  const map = L.map(el, { scrollWheelZoom: false }).setView(coords, 13);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19,
  }).addTo(map);
  const icon = L.divIcon({
    className: '', html: `<div style="width:34px;height:34px;border-radius:50% 50% 50% 0;background:${getComputedStyle(document.documentElement).getPropertyValue('--color-primary')};transform:rotate(-45deg);display:grid;place-items:center"><div style="transform:rotate(45deg);width:12px;height:12px;border-radius:50%;background:#fff"></div></div>`,
    iconSize: [34, 34], iconAnchor: [17, 34],
  });
  L.marker(coords, { icon }).addTo(map);
}

/* ===== Reveals ===== */
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) { revealsListos = true; return; }
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`; });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    revealsListos = true;
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); } });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false; let pending = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); } else pending++;
    });
    if (!pending) { window.removeEventListener('scroll', queueSweep); window.removeEventListener('resize', queueSweep); }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
  revealsListos = true;
}

/* ===== Anti-copia ===== */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

/* ===== GSAP guard ===== */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

/* ===== Arranque ===== */
initNav();
initHeroMsgs();
initCategorias();
initRail();
initCapitulos();
initCalculadora();
initCatalogo();
initFiltrosMobile();
initVistaRapida();
initCartDrawer();
initFloats();
initMapa();
initReveals();
