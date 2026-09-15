document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493513893422';
const ENVIO_GRATIS_DESDE = 120000;

const PRODUCTOS = [
  {
    id: 'p1', nombre: 'Conjunto Impulso', kicker: 'Conjunto · Mujer', tipo: 'conjuntos', genero: 'mujer',
    precio: 102000, descuento: 15, destacado: true,
    img: 'images/biker-y-top-femenino_1x1.webp', w: 1254, h: 1254,
    imgs: ['images/biker-y-top-femenino_1x1.webp', 'images/biker-y-top-femenino-recorte.webp'],
    alt: 'Conjunto femenino de top deportivo y biker de compresión negros con vivo violeta',
    desc: 'Top de sostén medio con espalda deportiva y biker de 20 cm, ambos en tela de compresión opaca. El combo que más se repite en los pedidos de verano.',
    detalles: ['Tela de compresión de 280 g, opaca a contraluz', 'Cintura ancha que no se baja en la sentadilla', 'Costura plana con vivo violeta reforzado', 'Top con copas removibles'],
    talles: [{ t: 'S', stock: 5 }, { t: 'M', stock: 8 }, { t: 'L', stock: 4 }, { t: 'XL', stock: 0 }],
    tags: 'compresion biker top conjunto verano opaca'
  },
  {
    id: 'p2', nombre: 'Calza Cadencia 7/8', kicker: 'Calza · Mujer', tipo: 'calzas', genero: 'mujer',
    precio: 54900, descuento: 0, destacado: true,
    img: 'images/calza-deportiva-femenina_1x1.webp', w: 1254, h: 1254,
    imgs: ['images/calza-deportiva-femenina_1x1.webp', 'images/calza-deportiva-femenina-recorte.webp'],
    alt: 'Calza deportiva femenina negra de tiro alto con vivo violeta',
    desc: 'Largo 7/8, tiro alto y bolsillo lateral para el celular que no rebota al correr. La calza que probamos catorce veces antes de aprobarla.',
    detalles: ['Tiro alto de 28 cm con cintura de doble capa', 'Bolsillo lateral con fuelle para celular', 'Tela opaca de 280 g, no se transparenta', 'Puño elástico que no marca el tobillo'],
    talles: [{ t: 'S', stock: 7 }, { t: 'M', stock: 11 }, { t: 'L', stock: 6 }, { t: 'XL', stock: 3 }],
    tags: 'calza legging tiro alto bolsillo correr opaca'
  },
  {
    id: 'p3', nombre: 'Campera Circuito', kicker: 'Campera · Mujer', tipo: 'abrigo', genero: 'mujer',
    precio: 98500, descuento: 0, destacado: true,
    img: 'images/campera-deportiva-femenina_1x1.webp', w: 1254, h: 1254,
    imgs: ['images/campera-deportiva-femenina_1x1.webp', 'images/campera-deportiva-femenina-recorte.webp'],
    alt: 'Campera rompeviento femenina negra con cierre completo y vivo violeta',
    desc: 'Rompeviento liviana con cierre completo y bolsillos con cierre. Se dobla en el bolso y sale sin una arruga.',
    detalles: ['Rompeviento liviano con interior de malla', 'Dos bolsillos laterales con cierre', 'Cierre completo con protector de mentón', 'Puños y cintura con elástico plano'],
    talles: [{ t: 'S', stock: 2 }, { t: 'M', stock: 4 }, { t: 'L', stock: 3 }, { t: 'XL', stock: 1 }],
    tags: 'campera rompeviento abrigo cierre bolsillos entretiempo'
  },
  {
    id: 'p4', nombre: 'Conjunto Rango', kicker: 'Conjunto · Mujer', tipo: 'conjuntos', genero: 'mujer',
    precio: 154900, descuento: 10, destacado: false,
    img: 'images/conjunto-femenino-con-campera_9x16.webp', w: 900, h: 1600,
    imgs: ['images/conjunto-femenino-con-campera_9x16.webp'],
    alt: 'Conjunto femenino de campera deportiva y calza negras en el gimnasio',
    desc: 'Campera rompeviento más calza 7/8 en el mismo negro y el mismo vivo. Para entrenar afuera cuando todavía no aflojó el frío.',
    detalles: ['Campera Circuito + Calza Cadencia en un solo pedido', 'Mismo tono de negro en las dos prendas', 'Combo con 10% sobre la compra por separado', 'Talles independientes: elegís uno por prenda al confirmar'],
    talles: [{ t: 'S', stock: 3 }, { t: 'M', stock: 5 }, { t: 'L', stock: 3 }, { t: 'XL', stock: 0 }],
    tags: 'conjunto campera calza combo invierno afuera'
  },
  {
    id: 'p5', nombre: 'Conjunto Tempo', kicker: 'Conjunto · Mujer', tipo: 'conjuntos', genero: 'mujer',
    precio: 92500, descuento: 0, destacado: false,
    img: 'images/conjunto-femenino-deportivo_1x1.webp', w: 1254, h: 1254,
    imgs: ['images/conjunto-femenino-deportivo_1x1.webp'],
    alt: 'Conjunto femenino de top deportivo y calza larga negros con vivo violeta',
    desc: 'Top de sostén medio y calza 7/8, el uniforme de las que entrenan cinco veces por semana y lavan cada dos días.',
    detalles: ['Top con banda inferior ancha que no se enrolla', 'Calza de tiro alto con bolsillo lateral', 'Secado rápido: lava a la noche, seco a la mañana', 'Etiquetas termoselladas, sin roce en la espalda'],
    talles: [{ t: 'S', stock: 4 }, { t: 'M', stock: 7 }, { t: 'L', stock: 5 }, { t: 'XL', stock: 2 }],
    tags: 'conjunto top calza uniforme entrenamiento diario'
  },
  {
    id: 'p6', nombre: 'Remera Tracción', kicker: 'Remera · Hombre', tipo: 'remeras', genero: 'hombre',
    precio: 39900, descuento: 0, destacado: false,
    img: 'images/entrenamiento-masculino-con-bandas_4x5.webp', w: 1122, h: 1402,
    imgs: ['images/entrenamiento-masculino-con-bandas_4x5.webp'],
    alt: 'Hombre entrenando con bandas elásticas y remera dry-fit negra con vivo violeta',
    desc: 'Dry-fit de calce ajustado, con costura plana en la sisa para que no roce en press ni en dominadas.',
    detalles: ['Tejido dry-fit que saca la humedad hacia afuera', 'Costura plana en sisa y hombro', 'Calce ajustado sin comprimir el pecho', 'Cuello reforzado que no se deforma'],
    talles: [{ t: 'S', stock: 6 }, { t: 'M', stock: 12 }, { t: 'L', stock: 9 }, { t: 'XL', stock: 5 }],
    tags: 'remera dry fit entrenamiento gimnasio hombre'
  },
  {
    id: 'p7', nombre: 'Conjunto Serie', kicker: 'Conjunto · Hombre', tipo: 'conjuntos', genero: 'hombre',
    precio: 149900, descuento: 15, destacado: true,
    img: 'images/jogging-masculino-con-buzo_1x1.webp', w: 1254, h: 1254,
    imgs: ['images/jogging-masculino-con-buzo_1x1.webp', 'images/jogging-masculino-con-buzo-recorte.webp'],
    alt: 'Conjunto masculino de buzo con capucha y jogging negros con vivo violeta',
    desc: 'Buzo con capucha y jogging de frisa liviana. Para llegar en frío al gimnasio y salir a la calle sin cambiarte.',
    detalles: ['Frisa liviana que abriga sin dar calor adentro', 'Buzo con capucha forrada y cierre completo', 'Jogging con puño y bolsillos con cierre', 'Cordón plano que no se mete en el túnel'],
    talles: [{ t: 'S', stock: 3 }, { t: 'M', stock: 8 }, { t: 'L', stock: 7 }, { t: 'XL', stock: 4 }],
    tags: 'conjunto buzo jogging frisa capucha invierno'
  },
  {
    id: 'p8', nombre: 'Conjunto Sprint', kicker: 'Conjunto · Hombre', tipo: 'conjuntos', genero: 'hombre',
    precio: 74900, descuento: 0, destacado: true,
    img: 'images/remera-y-short-masculino_1x1.webp', w: 1254, h: 1254,
    imgs: ['images/remera-y-short-masculino_1x1.webp', 'images/remera-y-short-masculino-recorte.webp'],
    alt: 'Conjunto masculino de remera dry-fit y short de entrenamiento negros',
    desc: 'Remera dry-fit y short de 7" con calza interna. El combo de verano, el que más sale entre noviembre y marzo.',
    detalles: ['Short de 7" con calza interna de compresión', 'Remera dry-fit de calce ajustado', 'Bolsillo trasero con cierre en el short', 'Cintura con cordón interno plano'],
    talles: [{ t: 'S', stock: 5 }, { t: 'M', stock: 10 }, { t: 'L', stock: 8 }, { t: 'XL', stock: 3 }],
    tags: 'conjunto remera short verano calza interna'
  },
  {
    id: 'p9', nombre: 'Top Pulso', kicker: 'Top · Mujer', tipo: 'tops', genero: 'mujer',
    precio: 34900, descuento: 0, destacado: true,
    img: 'images/top-pulso-femenino.webp', w: 1000, h: 1250,
    imgs: ['images/top-pulso-femenino.webp'],
    alt: 'Top deportivo femenino negro de sostén medio con banda violeta',
    desc: 'Sostén medio con banda inferior ancha y copas removibles. Aguanta trote y funcional sin ajustar de más.',
    detalles: ['Sostén medio: trote, funcional y musculación', 'Banda inferior de 5 cm que no se enrolla', 'Copas removibles', 'Espalda deportiva con tirantes anchos'],
    talles: [{ t: 'S', stock: 9 }, { t: 'M', stock: 12 }, { t: 'L', stock: 7 }, { t: 'XL', stock: 4 }],
    tags: 'top corpino sosten medio copas removibles trote'
  },
  {
    id: 'p10', nombre: 'Biker Núcleo 20 cm', kicker: 'Biker · Mujer', tipo: 'calzas', genero: 'mujer',
    precio: 46900, descuento: 10, destacado: false,
    img: 'images/biker-nucleo-femenino.webp', w: 1000, h: 1250,
    imgs: ['images/biker-nucleo-femenino.webp'],
    alt: 'Biker de compresión femenina negra de 20 centímetros con vivo violeta',
    desc: 'Largo 20 cm, tiro alto y compresión real en el muslo. La que se usa cuando hace calor y no querés que se suba.',
    detalles: ['Largo 20 cm medido desde la entrepierna', 'Compresión firme sin marcar el muslo', 'Cintura ancha con bolsillo interno para llave', 'Tela opaca de 280 g'],
    talles: [{ t: 'S', stock: 6 }, { t: 'M', stock: 9 }, { t: 'L', stock: 0 }, { t: 'XL', stock: 3 }],
    tags: 'biker calza corta compresion verano muslo'
  },
  {
    id: 'p11', nombre: 'Buzo Fondo con capucha', kicker: 'Buzo · Hombre', tipo: 'abrigo', genero: 'hombre',
    precio: 79900, descuento: 0, destacado: false,
    img: 'images/buzo-fondo-masculino.webp', w: 1000, h: 1250,
    imgs: ['images/buzo-fondo-masculino.webp'],
    alt: 'Buzo masculino negro con capucha y cierre completo con vivo violeta',
    desc: 'Cierre completo, capucha forrada y bolsillos hondos. El que te ponés arriba de todo y no te sacás hasta la entrada en calor.',
    detalles: ['Cierre completo con carro reforzado', 'Capucha forrada con cordón plano', 'Bolsillos laterales hondos', 'Frisa liviana de secado rápido'],
    talles: [{ t: 'S', stock: 2 }, { t: 'M', stock: 5 }, { t: 'L', stock: 3 }, { t: 'XL', stock: 1 }],
    tags: 'buzo campera capucha cierre frisa abrigo'
  },
  {
    id: 'p12', nombre: 'Short Descarga 7"', kicker: 'Short · Hombre', tipo: 'shorts', genero: 'hombre',
    precio: 48900, descuento: 20, destacado: false,
    img: 'images/short-descarga-masculino.webp', w: 1000, h: 1250,
    imgs: ['images/short-descarga-masculino.webp'],
    alt: 'Short de entrenamiento masculino negro con calza interna de compresión',
    desc: 'Short de 7" con calza interna de compresión. Se entrena, se corre y se sale a la calle con el mismo.',
    detalles: ['Calza interna de compresión cosida', 'Largo 7" arriba de la rodilla', 'Bolsillo trasero con cierre', 'Tela liviana con secado rápido'],
    talles: [{ t: 'S', stock: 5 }, { t: 'M', stock: 8 }, { t: 'L', stock: 6 }, { t: 'XL', stock: 0 }],
    tags: 'short bermuda calza interna correr verano'
  }
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const stockTalle = (p, t) => p?.talles.find(x => x.t === t)?.stock ?? 0;
const stockTotal = p => p.talles.reduce((s, x) => s + x.stock, 0);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const Cart = {
  KEY: 'tuindumentariafit_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, talle, qty = 1) {
    const items = this.get();
    const max = stockTalle(producto, talle) || 99;
    const existing = items.find(i => i.id === producto.id && i.talle === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, talle, qty: Math.min(qty, max) });
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.talle === talle); if (!it) return;
    const max = stockTalle(getProducto(id), talle) || 99;
    it.qty = Math.max(1, Math.min(qty, max)); this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && i.talle === talle))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); }
};

const Wish = {
  KEY: 'tuindumentariafit_wishlist',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const l = this.get(); const i = l.indexOf(id);
    if (i > -1) l.splice(i, 1); else l.push(id);
    localStorage.setItem(this.KEY, JSON.stringify(l));
    document.dispatchEvent(new CustomEvent('wish:updated'));
    return i === -1;
  }
};

const Vistos = {
  KEY: 'tuindumentariafit_vistos',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  push(id) {
    const l = this.get().filter(x => x !== id);
    l.unshift(id);
    localStorage.setItem(this.KEY, JSON.stringify(l.slice(0, 8)));
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

function flagsHTML(p) {
  const out = [];
  if (p.descuento > 0) out.push(`<span class="p-flag p-flag--off">-${p.descuento}%</span>`);
  if (stockTotal(p) <= 12) out.push(`<span class="p-flag p-flag--last">Últimas</span>`);
  else if (p.destacado) out.push(`<span class="p-flag">Más vendido</span>`);
  return out.length ? `<div class="p-flags">${out.join('')}</div>` : '';
}

function sizesHTML(p) {
  return `<div class="p-sizes" role="group" aria-label="Talle de ${esc(p.nombre)}">${p.talles.map(t => `
    <button type="button" class="p-size" data-size="${t.t}" data-id="${p.id}"${t.stock ? '' : ' disabled'} aria-label="Talle ${t.t}${t.stock ? '' : ', sin stock'}">${t.t}</button>`).join('')}</div>`;
}

function cardHTML(p, big) {
  const off = p.descuento > 0;
  const final = precioFinal(p);
  const agotado = stockTotal(p) === 0;
  return `
  <article class="p-card${off ? ' p-card--off' : ''}${big ? ' p-card--big' : ''}${agotado ? ' p-out' : ''}" data-id="${p.id}" data-flip-id="${p.id}">
    <div class="p-media">
      <img src="${p.img}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}" loading="lazy" decoding="async">
      ${flagsHTML(p)}
      <button type="button" class="p-open" data-open="${p.id}" aria-label="Ver ${esc(p.nombre)}"></button>
      <button type="button" class="p-wish${Wish.has(p.id) ? ' on' : ''}" data-wish="${p.id}" aria-label="Guardar ${esc(p.nombre)} en favoritos">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21.2l7.7-7.7 1.1-1a5.5 5.5 0 0 0 0-7.9z"/></svg>
      </button>
      <button type="button" class="p-quick" data-open="${p.id}">Vista rápida</button>
    </div>
    <div class="p-body">
      <span class="p-kicker">${esc(p.kicker)}</span>
      <h3 class="p-name">${esc(p.nombre)}</h3>
      <div class="p-prices">
        <span class="p-price">${formatearPrecio(final)}</span>
        ${off ? `<s class="p-old">${formatearPrecio(p.precio)}</s>` : ''}
      </div>
      ${sizesHTML(p)}
      <div class="p-actions">
        <div class="qty">
          <button type="button" data-step="-1" data-id="${p.id}" aria-label="Quitar una unidad">−</button>
          <input type="number" value="1" min="1" max="99" data-qty="${p.id}" aria-label="Cantidad de ${esc(p.nombre)}">
          <button type="button" data-step="1" data-id="${p.id}" aria-label="Sumar una unidad">+</button>
        </div>
        <button type="button" class="p-add" data-add="${p.id}"${agotado ? ' disabled' : ''}>${agotado ? 'Sin stock' : 'Agregar'}</button>
      </div>
      <button type="button" class="p-buy" data-buy="${p.id}"${agotado ? ' disabled' : ''}>Comprar ahora</button>
    </div>
  </article>`;
}

const state = { q: '', cat: 'all', tipo: 'all', talle: 'all', orden: 'destacados', shown: 8, wish: false };
const PAGE = 8;

function filtrar() {
  const q = normalizar(state.q).trim();
  let list = PRODUCTOS.filter(p => {
    if (state.wish && !Wish.has(p.id)) return false;
    if (state.cat === 'oferta') { if (p.descuento <= 0) return false; }
    else if (state.cat !== 'all' && p.genero !== state.cat) return false;
    if (state.tipo !== 'all' && p.tipo !== state.tipo) return false;
    if (state.talle !== 'all' && stockTalle(p, state.talle) <= 0) return false;
    if (q) {
      const hay = normalizar([p.nombre, p.kicker, p.tipo, p.genero, p.desc, p.tags].join(' '));
      if (!q.split(/\s+/).every(w => hay.includes(w))) return false;
    }
    return true;
  });
  if (state.orden === 'menor') list = list.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (state.orden === 'mayor') list = list.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
  else list = list.slice().sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
  return list;
}

function renderDestacados() {
  const grid = document.getElementById('gridDestacados');
  if (!grid) return;
  const dest = PRODUCTOS.filter(p => p.destacado).slice(0, 6);
  grid.innerHTML = dest.map(p => cardHTML(p, true)).join('');
}

function renderCatalogo(animate) {
  const grid = document.getElementById('gridCatalogo');
  if (!grid) return;
  const list = filtrar();
  const visibles = list.slice(0, state.shown);
  const flipOn = animate && !reduceMotion && typeof window.Flip !== 'undefined' && typeof gsap !== 'undefined';
  let snap = null;
  if (flipOn) { try { snap = window.Flip.getState(grid.querySelectorAll('.p-card')); } catch { snap = null; } }

  grid.innerHTML = visibles.map(p => cardHTML(p)).join('');

  const count = document.getElementById('resCount');
  if (count) count.textContent = list.length === 0 ? 'Sin resultados' : `${list.length} ${list.length === 1 ? 'prenda' : 'prendas'}${state.wish ? ' en favoritos' : ''}`;
  const empty = document.getElementById('empty');
  if (empty) empty.hidden = list.length !== 0;
  const more = document.getElementById('btnMore');
  if (more) more.hidden = list.length <= state.shown;
  const clear = document.getElementById('clearFilters');
  if (clear) clear.hidden = !(state.q || state.cat !== 'all' || state.tipo !== 'all' || state.talle !== 'all' || state.orden !== 'destacados' || state.wish);

  if (snap) {
    try {
      window.Flip.from(snap, {
        duration: .5, ease: 'power2.out', absolute: true, stagger: .015,
        onEnter: els => gsap.fromTo(els, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .45, stagger: .035, ease: 'power2.out' }),
        onLeave: els => gsap.to(els, { opacity: 0, scale: .96, duration: .22 })
      });
    } catch {
      grid.querySelectorAll('.p-card').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    }
  } else if (animate && !reduceMotion && typeof gsap !== 'undefined') {
    gsap.fromTo(grid.querySelectorAll('.p-card'), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .5, stagger: .035, ease: 'power2.out' });
  }
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function resetFilters() {
  state.q = ''; state.cat = 'all'; state.tipo = 'all'; state.talle = 'all'; state.orden = 'destacados'; state.shown = PAGE; state.wish = false;
  const q = document.getElementById('q'); if (q) q.value = '';
  document.getElementById('fTipo').value = 'all';
  document.getElementById('fTalle').value = 'all';
  document.getElementById('fOrden').value = 'destacados';
  document.querySelectorAll('#chips .chip').forEach(c => c.classList.toggle('is-on', c.dataset.cat === 'all'));
  renderCatalogo(true);
}

function initFilters() {
  const q = document.getElementById('q');
  let t;
  q?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { state.q = q.value; state.shown = PAGE; renderCatalogo(true); }, 180);
  });
  document.getElementById('chips')?.addEventListener('click', e => {
    const chip = e.target.closest('.chip'); if (!chip) return;
    document.querySelectorAll('#chips .chip').forEach(c => c.classList.remove('is-on'));
    chip.classList.add('is-on');
    state.cat = chip.dataset.cat; state.wish = false; state.shown = PAGE;
    renderCatalogo(true);
  });
  document.getElementById('fTipo')?.addEventListener('change', e => { state.tipo = e.target.value; state.shown = PAGE; renderCatalogo(true); });
  document.getElementById('fTalle')?.addEventListener('change', e => { state.talle = e.target.value; state.shown = PAGE; renderCatalogo(true); });
  document.getElementById('fOrden')?.addEventListener('change', e => { state.orden = e.target.value; state.shown = PAGE; renderCatalogo(true); });
  document.getElementById('btnMore')?.addEventListener('click', () => { state.shown += 12; renderCatalogo(true); });
  document.getElementById('clearFilters')?.addEventListener('click', resetFilters);
  document.getElementById('emptyClear')?.addEventListener('click', resetFilters);

  document.querySelectorAll('[data-jump]').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.jump;
      state.shown = PAGE; state.wish = false;
      if (v === 'mujer' || v === 'hombre' || v === 'oferta') {
        state.cat = v; state.tipo = 'all';
        document.querySelectorAll('#chips .chip').forEach(c => c.classList.toggle('is-on', c.dataset.cat === v));
        document.getElementById('fTipo').value = 'all';
      } else {
        state.cat = 'all'; state.tipo = v;
        document.querySelectorAll('#chips .chip').forEach(c => c.classList.toggle('is-on', c.dataset.cat === 'all'));
        document.getElementById('fTipo').value = v;
      }
      renderCatalogo(true);
      document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('.main-nav a[data-cat]').forEach(a => {
    a.addEventListener('click', () => {
      const v = a.dataset.cat;
      state.cat = v; state.tipo = 'all'; state.talle = 'all'; state.wish = false; state.shown = PAGE;
      document.querySelectorAll('#chips .chip').forEach(c => c.classList.toggle('is-on', c.dataset.cat === v));
      document.getElementById('fTipo').value = 'all';
      renderCatalogo(true);
    });
  });
}

function selectedSize(scope, id) {
  const on = scope.querySelector(`.p-size.on[data-id="${id}"]`);
  return on ? on.dataset.size : null;
}

function readQty(scope, id) {
  const input = scope.querySelector(`[data-qty="${id}"]`);
  const n = parseInt(input?.value || '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function agregar(id, scope, abrirDrawer) {
  const p = getProducto(id);
  if (!p) return;
  const talle = selectedSize(scope, id);
  if (!talle) {
    showToast('Elegí tu talle antes de agregar');
    scope.querySelector(`.p-size[data-id="${id}"]:not(:disabled)`)?.focus();
    return;
  }
  const qty = readQty(scope, id);
  Cart.add(p, talle, qty);
  if (abrirDrawer) openCart();
  else showToast(`${p.nombre} talle ${talle} · sumado al carrito`);
}

function initCards() {
  document.addEventListener('click', e => {
    const size = e.target.closest('.p-size');
    if (size && !size.disabled) {
      const scope = size.closest('.p-card, .qv-info');
      scope?.querySelectorAll(`.p-size[data-id="${size.dataset.id}"]`).forEach(b => b.classList.remove('on'));
      size.classList.add('on');
      return;
    }
    const step = e.target.closest('[data-step]');
    if (step) {
      const scope = step.closest('.p-card, .qv-info');
      const input = scope?.querySelector(`[data-qty="${step.dataset.id}"]`);
      if (input) {
        const n = Math.max(1, Math.min(99, (parseInt(input.value, 10) || 1) + parseInt(step.dataset.step, 10)));
        input.value = n;
      }
      return;
    }
    const wish = e.target.closest('[data-wish]');
    if (wish) {
      const added = Wish.toggle(wish.dataset.wish);
      showToast(added ? 'Guardado en favoritos' : 'Lo sacamos de favoritos');
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add && !add.disabled) { agregar(add.dataset.add, add.closest('.p-card, .qv-info') || document, false); return; }
    const buy = e.target.closest('[data-buy]');
    if (buy && !buy.disabled) { agregar(buy.dataset.buy, buy.closest('.p-card, .qv-info') || document, true); return; }
    const open = e.target.closest('[data-open]');
    if (open) { openQuick(open.dataset.open); return; }
  });

  document.addEventListener('wish:updated', () => {
    const ids = Wish.get();
    document.querySelectorAll('[data-wish]').forEach(b => b.classList.toggle('on', ids.includes(b.dataset.wish)));
    const badge = document.getElementById('wishBadge');
    if (badge) { badge.textContent = ids.length; badge.hidden = ids.length === 0; }
  });

  document.getElementById('wishToggle')?.addEventListener('click', () => {
    if (!Wish.get().length) { showToast('Todavía no guardaste ninguna prenda'); return; }
    state.wish = true; state.cat = 'all'; state.tipo = 'all'; state.talle = 'all'; state.q = ''; state.shown = 99;
    document.getElementById('q').value = '';
    document.querySelectorAll('#chips .chip').forEach(c => c.classList.toggle('is-on', c.dataset.cat === 'all'));
    renderCatalogo(true);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
}

let lastFocus = null;

function trapFocus(container, e) {
  const f = container.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function openCart() {
  const d = document.getElementById('cartDrawer'), b = document.getElementById('cartBackdrop');
  if (!d) return;
  lastFocus = document.activeElement;
  d.classList.add('open'); b.classList.add('open'); d.removeAttribute('inert');
  document.body.classList.add('no-scroll');
  renderCart();
  setTimeout(() => document.getElementById('cartClose')?.focus(), 60);
}
function closeCart() {
  const d = document.getElementById('cartDrawer'), b = document.getElementById('cartBackdrop');
  if (!d) return;
  d.classList.remove('open'); b.classList.remove('open'); d.setAttribute('inert', '');
  document.body.classList.remove('no-scroll');
  lastFocus?.focus();
}

function renderCart() {
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2.5 3h2.2l2.3 11.2a1.7 1.7 0 0 0 1.7 1.4h8.6a1.7 1.7 0 0 0 1.7-1.3L21 7H6"/><circle cx="9.5" cy="20" r="1.6" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.6" fill="currentColor" stroke="none"/></svg></div>
        <h3>Todavía está vacío</h3>
        <p>Elegí tu talle en cualquier prenda y volvé. Te lo guardamos aunque cierres la página.</p>
        <button type="button" class="btn btn-primary" data-close-cart>Ver la colección</button>
      </div>`;
    foot.hidden = true;
  } else {
    body.innerHTML = items.map(i => {
      const p = getProducto(i.id);
      if (!p) return '';
      return `
      <div class="cart-line">
        <div class="cart-line-media"><img src="${p.img}" width="${p.w}" height="${p.h}" alt="${esc(p.nombre)}" loading="lazy"></div>
        <div>
          <p class="cart-line-name">${esc(p.nombre)}</p>
          <p class="cart-line-meta">Talle ${esc(i.talle)} · ${formatearPrecio(precioFinal(p))} c/u</p>
          <div class="qty">
            <button type="button" data-cart-step="-1" data-id="${p.id}" data-talle="${esc(i.talle)}" aria-label="Quitar una unidad">−</button>
            <input type="number" value="${i.qty}" min="1" data-cart-qty="${p.id}" data-talle="${esc(i.talle)}" aria-label="Cantidad">
            <button type="button" data-cart-step="1" data-id="${p.id}" data-talle="${esc(i.talle)}" aria-label="Sumar una unidad">+</button>
          </div>
          <button type="button" class="cart-line-rm" data-cart-rm="${p.id}" data-talle="${esc(i.talle)}">Quitar</button>
        </div>
        <p class="cart-line-price">${formatearPrecio(precioFinal(p) * i.qty)}</p>
      </div>`;
    }).join('');
    foot.hidden = false;
    document.getElementById('cartTotal').textContent = formatearPrecio(Cart.total());
  }
  const total = Cart.total();
  const bar = document.getElementById('shipBar');
  const msg = document.getElementById('shipMsg');
  const fill = document.getElementById('shipFill');
  if (bar && msg && fill) {
    const falta = ENVIO_GRATIS_DESDE - total;
    if (falta > 0) { msg.textContent = `Te faltan ${formatearPrecio(falta)} para el envío gratis`; bar.classList.remove('done'); }
    else { msg.textContent = '¡Tenés envío gratis! 🎉'; bar.classList.add('done'); }
    fill.style.width = Math.min(100, (total / ENVIO_GRATIS_DESDE) * 100) + '%';
  }
  const wsp = document.getElementById('btnWspCart');
  if (wsp) {
    const detalle = Cart.get().map(i => {
      const p = getProducto(i.id);
      return p ? `• ${p.nombre} (talle ${i.talle}) x${i.qty}` : '';
    }).filter(Boolean).join('\n');
    const txt = detalle
      ? `Hola Tu indumentaria fit, quiero confirmar este pedido:\n${detalle}\nTotal: ${formatearPrecio(Cart.total())}`
      : 'Hola Tu indumentaria fit, quiero hacer una consulta sobre la colección';
    wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(txt)}`;
  }
}

function initCart() {
  document.getElementById('cartToggle')?.addEventListener('click', openCart);
  document.getElementById('cartClose')?.addEventListener('click', closeCart);
  document.getElementById('cartBackdrop')?.addEventListener('click', closeCart);
  document.getElementById('btnCheckout')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-close-cart]')) { closeCart(); document.getElementById('destacados')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); return; }
    const rm = e.target.closest('[data-cart-rm]');
    if (rm) { Cart.remove(rm.dataset.cartRm, rm.dataset.talle); return; }
    const st = e.target.closest('[data-cart-step]');
    if (st) {
      const line = Cart.get().find(i => i.id === st.dataset.id && i.talle === st.dataset.talle);
      if (line) Cart.setQty(st.dataset.id, st.dataset.talle, line.qty + parseInt(st.dataset.cartStep, 10));
      return;
    }
  });
  document.addEventListener('change', e => {
    const inp = e.target.closest('[data-cart-qty]');
    if (inp) Cart.setQty(inp.dataset.cartQty, inp.dataset.talle, parseInt(inp.value, 10) || 1);
  });
  document.addEventListener('cart:updated', () => {
    const n = Cart.count();
    const badge = document.getElementById('cartBadge');
    if (badge) {
      badge.textContent = n; badge.hidden = n === 0;
      badge.classList.remove('pop'); void badge.offsetWidth; badge.classList.add('pop');
    }
    renderCart();
  });
  document.getElementById('cartDrawer')?.addEventListener('keydown', e => {
    if (e.key === 'Tab') trapFocus(e.currentTarget, e);
  });
}

function openQuick(id) {
  const p = getProducto(id);
  const modal = document.getElementById('qv');
  const inner = document.getElementById('qvInner');
  const back = document.getElementById('qvBackdrop');
  if (!p || !modal || !inner) return;
  lastFocus = document.activeElement;
  const off = p.descuento > 0;
  const final = precioFinal(p);
  const cuota = Math.round(final / 6);
  const vistos = Vistos.get().filter(x => x !== p.id).map(getProducto).filter(Boolean).slice(0, 4);
  const sugeridos = vistos.length ? vistos : PRODUCTOS.filter(x => x.id !== p.id && x.genero === p.genero).slice(0, 4);

  inner.innerHTML = `
    <div class="qv-grid">
      <div class="qv-gal">
        <div class="qv-main${p.imgs[0].includes('-recorte') ? ' is-cut' : ''}" id="qvMain">
          <img src="${p.imgs[0]}" alt="${esc(p.alt)}" width="${p.w}" height="${p.h}">
        </div>
        ${p.imgs.length > 1 ? `<div class="qv-thumbs">${p.imgs.map((src, i) => `
          <button type="button" class="qv-thumb${i === 0 ? ' on' : ''}" data-thumb="${esc(src)}" aria-label="Ver imagen ${i + 1}"><img src="${esc(src)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}
      </div>
      <div class="qv-info">
        <span class="p-kicker">${esc(p.kicker)}</span>
        <h2 id="qvName">${esc(p.nombre)}</h2>
        <div class="qv-prices">
          <span class="p-price">${formatearPrecio(final)}</span>
          ${off ? `<s class="p-old">${formatearPrecio(p.precio)}</s><span class="p-flag p-flag--off">-${p.descuento}%</span>` : ''}
        </div>
        <p class="qv-cuotas">6 cuotas de ${formatearPrecio(cuota)} · 10% off pagando por transferencia</p>
        <p class="qv-desc">${esc(p.desc)}</p>
        <ul class="qv-det">${p.detalles.map(d => `<li>${esc(d)}</li>`).join('')}</ul>
        <p class="qv-lbl"><span>Elegí tu talle</span><a href="#talles" data-close-qv>Ver medidas</a></p>
        <div class="qv-sizes" role="group" aria-label="Talle">${p.talles.map(t => `
          <button type="button" class="p-size" data-size="${t.t}" data-id="${p.id}"${t.stock ? '' : ' disabled'} aria-label="Talle ${t.t}${t.stock ? '' : ', sin stock'}">${t.t}</button>`).join('')}</div>
        <div class="qv-actions">
          <div class="qty">
            <button type="button" data-step="-1" data-id="${p.id}" aria-label="Quitar una unidad">−</button>
            <input type="number" value="1" min="1" max="99" data-qty="${p.id}" aria-label="Cantidad">
            <button type="button" data-step="1" data-id="${p.id}" aria-label="Sumar una unidad">+</button>
          </div>
          <button type="button" class="p-add" data-add="${p.id}">Agregar al carrito</button>
          <button type="button" class="btn btn-ghost" data-buy="${p.id}">Comprar ahora</button>
        </div>
        <p class="qv-stock">${stockTotal(p)} unidades disponibles · despacho en 48 hs desde Córdoba</p>
      </div>
    </div>
    ${sugeridos.length ? `<div class="qv-seen">
      <h3>${vistos.length ? 'Vistos recientemente' : 'También te puede interesar'}</h3>
      <div class="qv-seen-list">${sugeridos.map(s => `
        <button type="button" data-open="${s.id}">
          <span class="qv-seen-media"><img src="${s.img}" alt="${esc(s.nombre)}" loading="lazy"></span>
          <span class="qv-seen-n">${esc(s.nombre)}</span>
        </button>`).join('')}</div>
    </div>` : ''}`;

  Vistos.push(p.id);
  modal.setAttribute('aria-labelledby', 'qvName');
  modal.classList.add('open'); back.classList.add('open'); modal.removeAttribute('inert');
  document.body.classList.add('no-scroll');
  inner.scrollTop = 0;
  setTimeout(() => document.getElementById('qvClose')?.focus(), 60);
  if (!reduceMotion && typeof gsap !== 'undefined') {
    const bloques = inner.querySelectorAll('.qv-info > *');
    gsap.fromTo(bloques, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .45, stagger: .045, ease: 'power2.out', delay: .1 });
    setTimeout(() => bloques.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; }), 1400);
  }
  const ld = document.getElementById('qvLd');
  if (ld) ld.remove();
  const s = document.createElement('script');
  s.type = 'application/ld+json'; s.id = 'qvLd';
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: p.img, description: p.desc,
    brand: { '@type': 'Brand', name: 'Tu indumentaria fit' },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: stockTotal(p) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' }
  });
  document.head.appendChild(s);
}

function closeQuick() {
  const modal = document.getElementById('qv'), back = document.getElementById('qvBackdrop');
  if (!modal) return;
  modal.classList.remove('open'); back.classList.remove('open'); modal.setAttribute('inert', '');
  modal.removeAttribute('aria-labelledby');
  document.body.classList.remove('no-scroll');
  lastFocus?.focus();
}

function initQuick() {
  document.getElementById('qvClose')?.addEventListener('click', closeQuick);
  document.getElementById('qvBackdrop')?.addEventListener('click', closeQuick);
  document.getElementById('qv')?.addEventListener('click', e => {
    const th = e.target.closest('[data-thumb]');
    if (th) {
      const main = document.getElementById('qvMain');
      const img = main?.querySelector('img');
      if (img) { img.src = th.dataset.thumb; main.classList.toggle('is-cut', th.dataset.thumb.includes('-recorte')); }
      document.querySelectorAll('.qv-thumb').forEach(b => b.classList.remove('on'));
      th.classList.add('on');
      return;
    }
    if (e.target.closest('[data-close-qv]')) closeQuick();
  });
  document.getElementById('qv')?.addEventListener('keydown', e => {
    if (e.key === 'Tab') trapFocus(e.currentTarget, e);
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (document.getElementById('qv')?.classList.contains('open')) { closeQuick(); return; }
    if (document.getElementById('cartDrawer')?.classList.contains('open')) closeCart();
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
  const sync = () => { if (mq.matches) nav.removeAttribute('inert'); else if (!nav.classList.contains('open')) nav.setAttribute('inert', ''); };
  mq.addEventListener('change', sync); sync();
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
  const title = document.getElementById('heroTitle');
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (title && typeof window.SplitText !== 'undefined') {
    try {
      const split = new window.SplitText(title, { type: 'lines', mask: 'lines' });
      tl.from(split.lines, { yPercent: 112, duration: .95, stagger: .085 }, .1);
    } catch {
      title.style.opacity = 1;
    }
  }
  tl.from('.hero-field', { yPercent: -18, opacity: 0, duration: 1.1, ease: 'power2.out' }, 0)
    .from('.hero-block', { scaleY: .45, opacity: 0, transformOrigin: 'bottom center', duration: .95 }, .2)
    .from('.hero-tube', { scaleY: 0, opacity: 0, transformOrigin: 'top center', duration: .8 }, .38)
    .from('.hero-fig-b', { yPercent: 12, opacity: 0, duration: 1 }, .42)
    .from('.hero-fig-a', { yPercent: 16, opacity: 0, duration: 1.05 }, .52)
    .from('.hero-tag', { x: -26, opacity: 0, duration: .7 }, .95);

  if (typeof ScrollTrigger === 'undefined') return;
  gsap.to('.hero-fig-a img', { yPercent: -5, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 } });
  gsap.to('.hero-fig-b img', { yPercent: -9, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 } });
  gsap.to('.ed-media img', { yPercent: -4, scale: 1.05, ease: 'none', scrollTrigger: { trigger: '.ed-media', start: 'top bottom', end: 'bottom top', scrub: .8 } });
}

function initBeam() {
  const stage = document.getElementById('beamStage');
  const grid = document.getElementById('beamGrid');
  const light = document.getElementById('beamLight');
  const stepsWrap = document.getElementById('beamSteps');
  if (!stage || !grid || !light || !stepsWrap) return;
  const pieces = Array.from(document.querySelectorAll('.beam-piece'));
  const steps = Array.from(stepsWrap.querySelectorAll('.beam-step'));
  const num = document.getElementById('beamNum');
  const MARKS = [0.14, 0.33, 0.52, 0.71];
  let current = -1;

  const setStep = prog => {
    let i = 0;
    for (let k = 0; k < MARKS.length; k++) if (prog >= MARKS[k]) i = k;
    if (i === current) return;
    current = i;
    pieces.forEach((el, k) => el.classList.toggle('is-lit', k === i));
    steps.forEach((el, k) => el.classList.toggle('is-on', k === i));
    if (num) num.textContent = String(i + 1).padStart(2, '0');
  };

  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    stage.classList.add('is-static');
    pieces.forEach(el => el.classList.add('is-lit'));
    steps.forEach(el => el.classList.add('is-on'));
    return;
  }

  grid.classList.add('is-armed');
  stepsWrap.classList.add('is-armed');
  setStep(0);

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, start: 'top top', end: '+=260%', pin: true, scrub: .6,
        invalidateOnRefresh: true, onUpdate: self => setStep(self.progress)
      }
    });
    tl.fromTo(light, { xPercent: -75 }, { xPercent: 335, ease: 'none' }, 0);
    return () => { current = -1; };
  });
  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, start: 'top top', end: 'bottom bottom', scrub: .6,
        invalidateOnRefresh: true, onUpdate: self => setStep(self.progress)
      }
    });
    tl.fromTo(light, { yPercent: -70 }, { yPercent: 330, ease: 'none' }, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { stage.classList.remove('is-sticky-mobile'); current = -1; };
  });
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap !== 'undefined' && typeof window.Flip !== 'undefined') gsap.registerPlugin(window.Flip);
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }
  document.documentElement.classList.add('js-ready');
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  renderDestacados();
  renderCatalogo(false);
  initFilters();
  initCards();
  initCart();
  initQuick();
  initNav();
  initWspFloat();
  initReveals();
  initHero();
  initBeam();
  initSmoothAnchors();

  document.dispatchEvent(new CustomEvent('cart:updated'));
  document.dispatchEvent(new CustomEvent('wish:updated'));

  if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
});
