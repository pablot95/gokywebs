const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CATEGORIAS = [
  { id: 'tazas', nombre: 'Tazas y jarros', img: 'images/tazas-estante.webp', w: 1800, h: 1200 },
  { id: 'mates', nombre: 'Mates y botellas', img: 'images/mate.webp', w: 1200, h: 1200 },
  { id: 'remeras', nombre: 'Remeras y buzos', img: 'images/remera-estampada.webp', w: 1200, h: 1500 },
  { id: 'gorras', nombre: 'Gorras y bolsas', img: 'images/gorras.webp', w: 1800, h: 1200 },
  { id: 'impresiones', nombre: 'Impresiones', img: 'images/fotos-impresas.webp', w: 1600, h: 1200 },
  { id: 'cumples', nombre: 'Cumpleaños', img: 'images/souvenirs.webp', w: 1400, h: 1400 },
];

const PRODUCTOS = [
  { id: 1, nombre: 'Taza cerámica 11 oz sublimada', cat: 'tazas', precio: 8900, descuento: 0, img: 'images/p-taza-01.webp',
    desc: 'La clásica de todos los días. Sublimamos tu foto o tu frase a todo color, apta microondas y lavavajillas.',
    tags: ['taza', 'ceramica', 'foto'], perfil: ['taza', 'regalo', 'cumple'] },
  { id: 2, nombre: 'Taza mágica que revela el diseño', cat: 'tazas', precio: 14500, descuento: 0, img: 'images/p-taza-02.webp',
    desc: 'Arranca negra y, al servir algo caliente, aparece el diseño. La favorita para regalar.',
    tags: ['taza', 'magica', 'regalo'], perfil: ['taza', 'regalo', 'cumple'], destacado: true, nuevo: true },
  { id: 3, nombre: 'Taza con interior de color', cat: 'tazas', precio: 10900, descuento: 0, img: 'images/p-taza-03.webp',
    desc: 'Exterior blanco con el estampado y el interior más el asa en el color que elijas.',
    tags: ['taza', 'color'], perfil: ['taza', 'regalo'] },
  { id: 4, nombre: 'Set de 4 tazas para el local', cat: 'tazas', precio: 32500, descuento: 10, img: 'images/tazas-estante.webp',
    desc: 'Cuatro tazas con el logo de tu negocio, listas para el mostrador o para regalar a clientes.',
    tags: ['taza', 'set', 'logo'], perfil: ['taza', 'negocio'] },

  { id: 5, nombre: 'Mate imperial sublimado con tu foto', cat: 'mates', precio: 17900, descuento: 0, img: 'images/p-mate-01.webp',
    desc: 'Mate imperial forrado y sublimado a 360°. Se puede poner una foto, un escudo o una frase.',
    tags: ['mate', 'foto', 'imperial'], perfil: ['mate', 'regalo', 'equipo'], destacado: true },
  { id: 6, nombre: 'Botella deportiva 750 ml', cat: 'mates', precio: 16500, descuento: 0, img: 'images/p-botella-01.webp',
    desc: 'Botella de aluminio con pico deportivo y estampado a todo color en la cara frontal.',
    tags: ['botella', 'deporte'], perfil: ['mate', 'equipo', 'regalo'] },
  { id: 7, nombre: 'Botella térmica con pico automático', cat: 'mates', precio: 21900, descuento: 0, img: 'images/p-botella-02.webp',
    desc: 'Doble pared, mantiene el frío 12 horas. Grabado o sublimado con nombre y logo.',
    tags: ['botella', 'termica'], perfil: ['mate', 'equipo', 'negocio'] },
  { id: 8, nombre: 'Set mate + botella para regalar', cat: 'mates', precio: 34900, descuento: 12, img: 'images/botellas.webp',
    desc: 'El combo que más se pide para cumpleaños: mate, bombilla y botella con el mismo diseño.',
    tags: ['mate', 'botella', 'set'], perfil: ['mate', 'regalo', 'cumple'] },

  { id: 9, nombre: 'Remera de algodón con estampa full', cat: 'remeras', precio: 18900, descuento: 0, img: 'images/p-remera-01.webp',
    desc: 'Algodón peinado 24/1. Estampado por transferencia con la imagen que nos mandes, sin límite de colores.',
    tags: ['remera', 'algodon', 'estampa'], perfil: ['remera', 'regalo', 'equipo'], destacado: true },
  { id: 10, nombre: 'Remera oversize sublimada', cat: 'remeras', precio: 21500, descuento: 0, img: 'images/p-remera-04.webp',
    desc: 'Corte ancho y hombro caído, con el diseño ocupando todo el frente.',
    tags: ['remera', 'oversize'], perfil: ['remera', 'regalo'], nuevo: true },
  { id: 11, nombre: 'Buzo con estampa all-over', cat: 'remeras', precio: 39900, descuento: 0, img: 'images/p-campera-01.webp',
    desc: 'Frisa perchada con la estampa cubriendo toda la prenda, frente y espalda. El abrigo del equipo o de la promo.',
    tags: ['buzo', 'campera', 'capucha', 'frisa'], perfil: ['remera', 'equipo', 'negocio'] },
  { id: 12, nombre: 'Remera de trabajo con logo', cat: 'remeras', precio: 23900, descuento: 0, img: 'images/taller-prensa.webp',
    desc: 'Para el personal del local: logo al frente, nombre en el bolsillo y espalda a elección.',
    tags: ['remera', 'trabajo', 'logo'], perfil: ['remera', 'negocio', 'equipo'] },

  { id: 13, nombre: 'Gorra de gabardina con bordado', cat: 'gorras', precio: 14900, descuento: 0, img: 'images/p-gorra-01.webp',
    desc: 'Gabardina de algodón con cierre metálico y bordado directo del logo o el nombre.',
    tags: ['gorra', 'bordado'], perfil: ['gorra', 'regalo', 'equipo'], destacado: true },
  { id: 14, nombre: 'Gorra trucker con frente estampado', cat: 'gorras', precio: 15900, descuento: 0, img: 'images/p-gorra-02.webp',
    desc: 'Frente de espuma sublimable y espalda de red. La más fresca para el verano.',
    tags: ['gorra', 'trucker'], perfil: ['gorra', 'equipo'] },
  { id: 15, nombre: 'Gorra lavada estilo vintage', cat: 'gorras', precio: 16500, descuento: 0, img: 'images/p-gorra-03.webp',
    desc: 'Tela lavada con caída suave, en colores apagados. Bordado en hilo tono sobre tono.',
    tags: ['gorra', 'vintage'], perfil: ['gorra', 'regalo'] },
  { id: 16, nombre: 'Pack de 10 gorras para el equipo', cat: 'gorras', precio: 128000, descuento: 10, img: 'images/p-gorra-04.webp',
    desc: 'Diez gorras con el mismo bordado, para el club, la barra o el personal del local.',
    tags: ['gorra', 'pack', 'equipo'], perfil: ['gorra', 'equipo', 'negocio'] },
  { id: 17, nombre: 'Totebag de lona con tu nombre', cat: 'gorras', precio: 9900, descuento: 0, img: 'images/p-bolsa-01.webp',
    desc: 'Lona cruda con manijas reforzadas y el nombre en caligrafía. Sale mucho para souvenir.',
    tags: ['bolsa', 'totebag', 'nombre'], perfil: ['bolsa', 'regalo', 'cumple'], destacado: true },
  { id: 18, nombre: 'Bolsa de lona con logo del negocio', cat: 'gorras', precio: 11500, descuento: 0, img: 'images/p-bolsa-02.webp',
    desc: 'Un poco más grande y con fuelle, para que tus clientes se lleven la compra con tu marca.',
    tags: ['bolsa', 'logo', 'negocio'], perfil: ['bolsa', 'negocio'] },
  { id: 19, nombre: 'Pack de 20 bolsas para tu local', cat: 'gorras', precio: 178000, descuento: 15, img: 'images/totebags.webp',
    desc: 'Veinte bolsas de lona con la misma estampa. El pack que más piden los comercios.',
    tags: ['bolsa', 'pack', 'negocio'], perfil: ['bolsa', 'negocio'] },

  { id: 20, nombre: 'Plancha de stickers troquelados x50', cat: 'impresiones', precio: 6500, descuento: 0, img: 'images/p-impresion-01.webp',
    desc: 'Vinilo resistente al agua, cortados con la forma de tu diseño. Ideales para packaging.',
    tags: ['stickers', 'vinilo', 'troquelado'], perfil: ['regalo', 'negocio', 'cumple'] },
  { id: 21, nombre: 'Fotos 10x15 en papel brillante x20', cat: 'impresiones', precio: 7900, descuento: 0, img: 'images/p-impresion-02.webp',
    desc: 'Revelado digital en papel fotográfico. Mandás las fotos por WhatsApp y las retirás impresas.',
    tags: ['fotos', 'revelado', 'papel'], perfil: ['regalo', 'cumple'], destacado: true },
  { id: 22, nombre: 'Anillado A4 con tapa plastificada', cat: 'impresiones', precio: 4500, descuento: 0, img: 'images/fotos-impresas.webp',
    desc: 'Fotocopias, anillado con espiral y tapa plastificada en frío. Hasta 100 hojas.',
    tags: ['anillado', 'fotocopias', 'plastificado'], perfil: ['negocio'] },

  { id: 23, nombre: 'Souvenirs con el nombre x10', cat: 'cumples', precio: 12000, descuento: 0, img: 'images/p-souvenir-01.webp',
    desc: 'Souvenirs personalizados con el nombre del cumpleañero, en el color de la temática.',
    tags: ['souvenir', 'nombre', 'cumple'], perfil: ['souvenir', 'cumple', 'regalo'], destacado: true },
  { id: 24, nombre: 'Pinches para cupcakes x24', cat: 'cumples', precio: 5900, descuento: 0, img: 'images/p-souvenir-02.webp',
    desc: 'Toppers impresos y troquelados con la temática del cumple, listos para clavar en la mesa dulce.',
    tags: ['pinches', 'toppers', 'mesa dulce'], perfil: ['souvenir', 'cumple'] },
  { id: 25, nombre: 'Centro de mesa temático', cat: 'cumples', precio: 9500, descuento: 0, img: 'images/p-souvenir-03.webp',
    desc: 'Armado con el personaje o el motivo que elijas, en el tamaño de la mesa que tengas.',
    tags: ['centro de mesa', 'cumple'], perfil: ['souvenir', 'cumple'] },
  { id: 26, nombre: 'Souvenirs de acrílico con moño x12', cat: 'cumples', precio: 15900, descuento: 0, img: 'images/p-souvenir-04.webp',
    desc: 'Corte en acrílico con el nombre grabado, bolsita transparente y moño de raso.',
    tags: ['souvenir', 'acrilico'], perfil: ['souvenir', 'cumple', 'regalo'], nuevo: true },
  { id: 27, nombre: 'Bolsitas de cumpleaños armadas x10', cat: 'cumples', precio: 13500, descuento: 0, img: 'images/p-bolsita-01.webp',
    desc: 'Bolsita de papel con el nombre impreso, cintas rizadas y el sticker de la temática.',
    tags: ['bolsitas', 'cumple'], perfil: ['souvenir', 'cumple'], destacado: true },
  { id: 28, nombre: 'Bolsitas con cintas rizadas x20', cat: 'cumples', precio: 24900, descuento: 10, img: 'images/p-bolsita-02.webp',
    desc: 'El pack grande, para cumples de veinte invitados. Elegís dos colores y la tipografía.',
    tags: ['bolsitas', 'pack', 'cumple'], perfil: ['souvenir', 'cumple'] },
  { id: 29, nombre: 'Kit completo de cumpleaños', cat: 'cumples', precio: 46000, descuento: 12, img: 'images/p-bolsita-03.webp',
    desc: 'Bolsitas, pinches, centro de mesa y stickers con la misma temática, todo del mismo diseño.',
    tags: ['kit', 'cumple', 'combo'], perfil: ['souvenir', 'cumple', 'regalo'] },
];

const MESA_PRODUCTOS = {
  taza: { img: 'images/p-taza-01.webp', cap: 'Taza cerámica 11 oz', alt: 'Taza de cerámica sublimada con un diseño a color', cat: 'tazas' },
  mate: { img: 'images/p-mate-01.webp', cap: 'Mate imperial forrado', alt: 'Mate imperial listo para sublimar', cat: 'mates' },
  remera: { img: 'images/p-remera-01.webp', cap: 'Remera de algodón 24/1', alt: 'Remera blanca con una estampa a todo color', cat: 'remeras' },
  gorra: { img: 'images/p-gorra-01.webp', cap: 'Gorra de gabardina', alt: 'Gorra de gabardina lista para bordar', cat: 'gorras' },
  bolsa: { img: 'images/p-bolsa-01.webp', cap: 'Totebag de lona cruda', alt: 'Bolsa de lona con un nombre impreso en caligrafía', cat: 'gorras' },
  souvenir: { img: 'images/p-souvenir-01.webp', cap: 'Souvenir personalizado', alt: 'Souvenir de cumpleaños con el nombre impreso', cat: 'cumples' },
};

const MESA_OCASIONES = {
  regalo: {
    pie: 'Una foto tuya, en buena calidad',
    arte: '<div class="arte-foto"><img src="images/p-impresion-02.webp" alt="Foto impresa lista para sublimar" width="1200" height="1200"></div>',
  },
  cumple: {
    pie: 'El nombre y la edad del cumpleañero',
    arte: '<div><p class="arte-frase">Feliz cumple<em>Mili</em></p><p class="arte-puntos"><i style="background:#0D7EE0"></i><i style="background:#10131A"></i><i style="background:#F5B301"></i><i style="background:#0960AC"></i></p></div>',
  },
  negocio: {
    pie: 'El logo de tu negocio, vectorizado',
    arte: '<div class="arte-logo">Tu logo<span>en curvas</span></div>',
  },
  equipo: {
    pie: 'El escudo y el número de cada uno',
    arte: '<div class="arte-escudo">10</div>',
  },
};

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const nombreCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const Cart = {
  KEY: 'danyy_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, 99);
    else items.push({ id: producto.id, qty: Math.min(qty, 99) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 99)); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
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

function cardHTML(p, opciones = {}) {
  const final = precioFinal(p);
  const badge = p.descuento > 0
    ? `<span class="prod-badge">-${p.descuento}%</span>`
    : (p.nuevo ? '<span class="prod-badge badge-nuevo">Nuevo</span>' : '');
  const tachado = p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : '';
  const razon = opciones.razon ? `<p class="prod-por">${esc(opciones.razon)}</p>` : '';
  return `<article class="prod" data-animate="fondo" data-bi-id="${p.id}" style="transform:scale(.94);opacity:0">
    <button type="button" class="prod-media" data-ver="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      <img src="${p.img}" alt="${esc(p.nombre)}" width="1200" height="1200" decoding="async">
      ${badge}
      <span class="prod-ver">Ver más</span>
    </button>
    <div class="prod-info">
      <p class="prod-cat">${esc(nombreCat(p.cat))}</p>
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      ${razon}
      <p class="prod-precio"><strong>${formatearPrecio(final)}</strong> ${tachado}</p>
      <div class="prod-actions">
        <div class="stepper">
          <button type="button" data-paso="-1" data-id="${p.id}" aria-label="Restar uno">−</button>
          <output data-qty="${p.id}">1</output>
          <button type="button" data-paso="1" data-id="${p.id}" aria-label="Sumar uno">+</button>
        </div>
        <button type="button" class="btn btn-cta btn-sm prod-add" data-add="${p.id}">Agregar</button>
      </div>
    </div>
  </article>`;
}

function qtyDe(scope, id) {
  const out = scope?.querySelector(`[data-qty="${id}"]`);
  return Math.max(1, parseInt(out?.textContent || '1', 10) || 1);
}

function initAcciones(root) {
  root.addEventListener('click', e => {
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const scope = paso.closest('.prod, .modal-info');
      const out = scope?.querySelector(`[data-qty="${paso.dataset.id}"]`);
      if (out) {
        const v = Math.max(1, Math.min(99, (parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso)));
        out.textContent = v;
      }
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(Number(add.dataset.add));
      if (!p) return;
      const scope = add.closest('.prod, .modal-info');
      Cart.add(p, qtyDe(scope, p.id));
      showToast('¡Agregado! Ya está en tu pedido');
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(Number(comprar.dataset.comprar));
      if (!p) return;
      const scope = comprar.closest('.prod, .modal-info');
      Cart.add(p, qtyDe(scope, p.id));
      cerrarModal();
      abrirDrawer();
      return;
    }
    const ver = e.target.closest('[data-ver]');
    if (ver && !document.getElementById('rail-vp')?.classList.contains('dragging')) {
      abrirModal(Number(ver.dataset.ver));
    }
  });
}

/* ---------- categorías ---------- */

function initCategorias() {
  const cont = document.getElementById('cats-grid');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(c => {
    const n = PRODUCTOS.filter(p => p.cat === c.id).length;
    return `<a class="cat" href="#catalogo" data-cat-ir="${c.id}" data-animate="fondo" style="transform:scale(.94);opacity:0">
      <span class="cat-media"><img src="${c.img}" alt="${esc(c.nombre)}" width="${c.w}" height="${c.h}" decoding="async"></span>
      <span class="cat-cuerpo">
        <span>
          <span class="cat-nombre">${esc(c.nombre)}</span><br>
          <span class="cat-cant">${n} ${n === 1 ? 'producto' : 'productos'}</span>
        </span>
        <span class="cat-flecha"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span>
      </span>
    </a>`;
  }).join('');
  cont.addEventListener('click', e => {
    const a = e.target.closest('[data-cat-ir]');
    if (a) aplicarCategoria(a.dataset.catIr);
  });
}

/* ---------- rail de destacados ---------- */

function initRail() {
  const track = document.getElementById('rail-track');
  const vp = document.getElementById('rail-vp');
  if (!track || !vp) return;
  const destacados = PRODUCTOS.filter(p => p.destacado).slice(0, 8);
  track.innerHTML = destacados.map(p => `<div class="rail-card">${cardHTML(p)}</div>`).join('');

  const prev = document.getElementById('rail-prev');
  const next = document.getElementById('rail-next');
  const paso = () => vp.clientWidth * 0.72;
  const sincronizar = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: 'smooth' }));
  vp.addEventListener('scroll', sincronizar, { passive: true });
  window.addEventListener('resize', sincronizar, { passive: true });
  sincronizar();

  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    const enBorde = (e.deltaY < 0 && vp.scrollLeft <= 0) || (e.deltaY > 0 && vp.scrollLeft >= max - 1);
    if (enBorde) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });

  let down = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const end = () => {
    if (!down) return;
    down = false;
    if (pointerId !== null) { try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ } }
    pointerId = null;
    setTimeout(() => { vp.classList.remove('dragging'); moved = false; }, 0);
  };
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
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
}

/* ---------- catálogo ---------- */

const PAGINA = 16;
let visibles = PAGINA;
let catActiva = 'todas';

function filtrados() {
  const q = normalizar(document.getElementById('q')?.value.trim() || '');
  return PRODUCTOS.filter(p => {
    if (catActiva !== 'todas' && p.cat !== catActiva) return false;
    if (!q) return true;
    const heno = normalizar([p.nombre, nombreCat(p.cat), p.desc, ...(p.tags || [])].join(' '));
    return q.split(/\s+/).every(t => heno.includes(t));
  });
}

function pintarCatalogo() {
  const grid = document.getElementById('grid');
  const vacio = document.getElementById('vacio');
  const vermas = document.getElementById('vermas');
  const res = document.getElementById('resultados');
  if (!grid) return;
  const lista = filtrados();
  const trozo = lista.slice(0, visibles);
  grid.innerHTML = trozo.map(p => cardHTML(p)).join('');
  grid.hidden = lista.length === 0;
  if (vacio) vacio.hidden = lista.length > 0;
  if (vermas) vermas.hidden = visibles >= lista.length;
  if (res) res.textContent = `${lista.length} ${lista.length === 1 ? 'producto' : 'productos'}`;
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function pintarChips() {
  const cont = document.getElementById('chips');
  if (!cont) return;
  const items = [{ id: 'todas', nombre: 'Todas' }, ...CATEGORIAS];
  cont.innerHTML = items.map(c =>
    `<button type="button" class="chip" data-chip="${c.id}" aria-pressed="${c.id === catActiva}">${esc(c.nombre)}</button>`
  ).join('');
}

function aplicarCategoria(id) {
  catActiva = id;
  visibles = PAGINA;
  const q = document.getElementById('q');
  if (q) q.value = '';
  pintarChips();
  pintarCatalogo();
  document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function initCatalogo() {
  pintarChips();
  pintarCatalogo();
  document.getElementById('chips')?.addEventListener('click', e => {
    const b = e.target.closest('[data-chip]');
    if (!b) return;
    catActiva = b.dataset.chip;
    visibles = PAGINA;
    pintarChips();
    pintarCatalogo();
  });
  let t = null;
  document.getElementById('q')?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { visibles = PAGINA; pintarCatalogo(); }, 160);
  });
  document.getElementById('vermas')?.addEventListener('click', () => {
    visibles += PAGINA;
    pintarCatalogo();
  });
  document.getElementById('limpiar')?.addEventListener('click', () => {
    catActiva = 'todas';
    visibles = PAGINA;
    const q = document.getElementById('q');
    if (q) q.value = '';
    pintarChips();
    pintarCatalogo();
  });
}

/* ---------- la mesa de trabajo ---------- */

function initMesa() {
  const cont = document.getElementById('mesa');
  const out = document.getElementById('mesa-out');
  if (!cont || !out) return;
  const arte = document.getElementById('hoja-arte');
  const pie = document.getElementById('hoja-pie');
  const img = document.getElementById('mesa-img');
  const cap = document.getElementById('mesa-cap');
  const vermas = document.getElementById('mesa-vermas');
  const sel = { producto: 'taza', ocasion: 'regalo' };

  const etiquetas = {
    taza: 'tazas', mate: 'mates y botellas', remera: 'remeras', gorra: 'gorras',
    bolsa: 'bolsas', souvenir: 'souvenirs',
    regalo: 'para regalar', cumple: 'para un cumpleaños', negocio: 'para tu negocio', equipo: 'para el equipo',
  };

  const puntaje = p => (p.perfil?.includes(sel.producto) ? 2 : 0) + (p.perfil?.includes(sel.ocasion) ? 1 : 0);

  const pintar = () => {
    const prod = MESA_PRODUCTOS[sel.producto];
    const oca = MESA_OCASIONES[sel.ocasion];
    if (prod && img && cap) {
      img.src = prod.img; img.alt = prod.alt; cap.textContent = prod.cap;
    }
    if (oca && arte && pie) { arte.innerHTML = oca.arte; pie.textContent = oca.pie; }
    if (vermas) vermas.dataset.cat = prod?.cat || 'todas';

    const razon = `Elegido por: ${etiquetas[sel.producto]} · ${etiquetas[sel.ocasion]}`;
    const elegidos = [...PRODUCTOS]
      .map(p => ({ p, n: puntaje(p) }))
      .sort((a, b) => b.n - a.n || a.p.id - b.p.id)
      .slice(0, 3);

    const previos = new Map([...out.querySelectorAll('[data-bi-id]')].map(el => [el.dataset.biId, el.getBoundingClientRect()]));
    out.innerHTML = elegidos.map(({ p }) => cardHTML(p, { razon })).join('');
    out.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
    if (reduceMotion) return;
    out.querySelectorAll('[data-bi-id]').forEach(el => {
      const antes = previos.get(el.dataset.biId);
      if (!antes) {
        el.animate([{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'cubic-bezier(0.23,1,0.32,1)' });
        return;
      }
      const ahora = el.getBoundingClientRect();
      const dx = antes.left - ahora.left, dy = antes.top - ahora.top;
      if (!dx && !dy) return;
      el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 260, easing: 'cubic-bezier(0.23,1,0.32,1)' });
    });
  };

  cont.querySelectorAll('.bi-chip').forEach(chip => chip.addEventListener('click', () => {
    const q = chip.closest('.bi-q');
    const key = q.dataset.key;
    if (sel[key] === chip.dataset.val) return;
    q.querySelectorAll('.bi-chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
    chip.setAttribute('aria-pressed', 'true');
    sel[key] = chip.dataset.val;
    pintar();
  }));

  vermas?.addEventListener('click', e => {
    e.preventDefault();
    aplicarCategoria(vermas.dataset.cat || 'todas');
  });

  pintar();
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

/* ---------- carrito ---------- */

let ultimoFocoDrawer = null;

function pintarDrawer() {
  const body = document.getElementById('drawer-body');
  const total = document.getElementById('drawer-total');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="carrito-vacio">
      <div class="carrito-vacio-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg></div>
      <p>Todavía no elegiste nada. Empezá por lo que más sale del taller.</p>
      <a class="btn btn-cta" href="#elegidos" data-cerrar-drawer>Ver los más pedidos</a>
    </div>`;
  } else {
    body.innerHTML = items.map(i => {
      const p = getProducto(i.id);
      if (!p) return '';
      return `<div class="linea">
        <img src="${p.img}" alt="${esc(p.nombre)}" width="140" height="140" decoding="async">
        <div>
          <p class="linea-nombre">${esc(p.nombre)}</p>
          <p class="linea-precio">${formatearPrecio(precioFinal(p))} c/u</p>
        </div>
        <div class="linea-acc">
          <div class="stepper">
            <button type="button" data-cart-menos="${p.id}" aria-label="Restar uno">−</button>
            <output>${i.qty}</output>
            <button type="button" data-cart-mas="${p.id}" aria-label="Sumar uno">+</button>
          </div>
          <button type="button" class="linea-quitar" data-cart-quitar="${p.id}">Quitar</button>
        </div>
      </div>`;
    }).join('');
  }
  if (total) total.textContent = formatearPrecio(Cart.total());
}

function abrirDrawer() {
  const d = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!d || !bd) return;
  ultimoFocoDrawer = document.activeElement;
  bd.hidden = false; d.hidden = false;
  requestAnimationFrame(() => { bd.classList.add('open'); d.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('drawer-close')?.focus();
}

function cerrarDrawer() {
  const d = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!d || !bd) return;
  d.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { d.hidden = true; bd.hidden = true; }, 340);
  ultimoFocoDrawer?.focus?.();
}

function initDrawer() {
  pintarDrawer();
  document.getElementById('cart-open')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawer-close')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click', cerrarDrawer);
  document.addEventListener('cart:updated', pintarDrawer);
  document.getElementById('drawer-body')?.addEventListener('click', e => {
    const mas = e.target.closest('[data-cart-mas]');
    const menos = e.target.closest('[data-cart-menos]');
    const quitar = e.target.closest('[data-cart-quitar]');
    const cerrar = e.target.closest('[data-cerrar-drawer]');
    if (mas) { const id = Number(mas.dataset.cartMas); Cart.setQty(id, (Cart.get().find(i => i.id === id)?.qty || 1) + 1); }
    if (menos) {
      const id = Number(menos.dataset.cartMenos);
      const q = Cart.get().find(i => i.id === id)?.qty || 1;
      if (q <= 1) Cart.remove(id); else Cart.setQty(id, q - 1);
    }
    if (quitar) Cart.remove(Number(quitar.dataset.cartQuitar));
    if (cerrar) cerrarDrawer();
  });
  document.getElementById('checkout')?.addEventListener('click', () => {
    if (!Cart.count()) { showToast('Tu pedido todavía está vacío'); return; }
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !document.getElementById('drawer')?.hidden) cerrarDrawer();
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

/* ---------- vista rápida ---------- */

let ultimoFocoModal = null;

function abrirModal(id) {
  const p = getProducto(id);
  const modal = document.getElementById('modal');
  const bd = document.getElementById('modal-backdrop');
  const cont = document.getElementById('modal-in');
  if (!p || !modal || !bd || !cont) return;
  ultimoFocoModal = document.activeElement;
  const final = precioFinal(p);
  const tachado = p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : '';
  const relacionados = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  cont.innerHTML = `<div class="modal-media"><img src="${p.img}" alt="${esc(p.nombre)}" width="1200" height="1200" decoding="async"></div>
    <div class="modal-info">
      <p class="prod-cat">${esc(nombreCat(p.cat))}</p>
      <h3>${esc(p.nombre)}</h3>
      <p class="modal-precio"><strong>${formatearPrecio(final)}</strong> ${tachado}</p>
      <p class="modal-desc">${esc(p.desc)}</p>
      <div class="modal-tags">${(p.tags || []).map(t => `<span class="modal-tag">${esc(t)}</span>`).join('')}</div>
      <div class="modal-acc">
        <div class="stepper">
          <button type="button" data-paso="-1" data-id="${p.id}" aria-label="Restar uno">−</button>
          <output data-qty="${p.id}">1</output>
          <button type="button" data-paso="1" data-id="${p.id}" aria-label="Sumar uno">+</button>
        </div>
        <button type="button" class="btn btn-cta" data-add="${p.id}">Agregar al carrito</button>
        <button type="button" class="btn btn-linea" data-comprar="${p.id}">Comprar ahora</button>
      </div>
      ${relacionados.length ? `<div class="modal-rel">
        <h4>También te puede interesar</h4>
        <div class="modal-rel-grid">${relacionados.map(r => `<button type="button" class="modal-rel-item" data-ver="${r.id}">
          <img src="${r.img}" alt="${esc(r.nombre)}" width="600" height="600" decoding="async"><span>${esc(r.nombre)}</span>
        </button>`).join('')}</div>
      </div>` : ''}
    </div>`;
  bd.hidden = false; modal.hidden = false;
  document.body.classList.add('no-scroll');
  document.getElementById('modal-close')?.focus();
}

function cerrarModal() {
  const modal = document.getElementById('modal');
  const bd = document.getElementById('modal-backdrop');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  if (bd) bd.hidden = true;
  document.body.classList.remove('no-scroll');
  ultimoFocoModal?.focus?.();
}

function initModal() {
  document.getElementById('modal-close')?.addEventListener('click', cerrarModal);
  document.getElementById('modal-backdrop')?.addEventListener('click', cerrarModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarModal(); });
  const modal = document.getElementById('modal');
  if (modal) {
    initAcciones(modal);
    modal.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const focos = modal.querySelectorAll('button, [href], input, textarea, output[tabindex]');
      if (!focos.length) return;
      const primero = focos[0], ultimo = focos[focos.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    });
  }
}

/* ---------- nav, flotantes, devolución ---------- */

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.barra');
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
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
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
  const paintStars = n => stars.forEach((s, i) => {
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
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

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

/* ---------- reveals y movimiento ---------- */

let revealsListos = false;

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.06, 0.42)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
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

function initLectura() {
  const el = document.querySelector('[data-lee]');
  if (!el) return;
  const palabras = el.textContent.trim().split(/\s+/);
  el.innerHTML = palabras.map(p => `<span class="w">${esc(p)}</span>`).join(' ');
  const spans = [...el.querySelectorAll('.w')];
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    spans.forEach(s => s.classList.add('on'));
    return;
  }
  ScrollTrigger.create({
    trigger: el,
    start: 'top 78%',
    end: 'bottom 46%',
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: self => {
      const corte = Math.round(self.progress * spans.length);
      spans.forEach((s, i) => s.classList.toggle('on', i < corte));
    },
  });
}

function initParallaxWordmark() {
  const el = document.querySelector('.edito-wordmark');
  if (!el || reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.fromTo(el, { yPercent: 14 }, {
    yPercent: -14, ease: 'none',
    scrollTrigger: { trigger: '.edito', start: 'top bottom', end: 'bottom top', scrub: .6, invalidateOnRefresh: true },
  });
}

function initHero() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const foto = document.querySelector('.hero-foto img');
  if (foto) gsap.fromTo(foto, { scale: 1.08 }, { scale: 1, duration: 1.2, ease: 'power2.out' });
}

/* ---------- arranque ---------- */

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

document.addEventListener('cart:updated', updateCartBadge);

initCategorias();
initRail();
initCatalogo();
initMesa();
initReveals();
initNav();
initModal();
initDrawer();
initFloats();
initAcciones(document.getElementById('catalogo'));
initAcciones(document.getElementById('elegidos'));
initAcciones(document.getElementById('mesa'));
initLectura();
initParallaxWordmark();
initHero();
initFeedbackFloat();
updateCartBadge();

const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();
