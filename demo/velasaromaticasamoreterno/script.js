const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493413318107';
const MARCA = 'Velas aromáticas amor eterno';
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const CATEGORIAS = [
  { id: 'velas', nombre: 'Velas aromáticas', uno: 'Vela', bajada: 'En vaso, en cuenco de yeso, burbuja y pilar', img: 'images/p-vela-cuenco.webp' },
  { id: 'souvenirs', nombre: 'Souvenirs personalizados', uno: 'Souvenir', bajada: 'Con los nombres y la fecha en la etiqueta', img: 'images/p-souvenir-corazon.webp' },
  { id: 'yeso', nombre: 'Piezas de yeso', uno: 'Yeso', bajada: 'Para decorar o para revender', img: 'images/p-bandeja-yeso.webp' },
];
const AROMAS = [
  { id: 'vainilla', nombre: 'Vainilla', color: '#EAD9B5' },
  { id: 'lavanda', nombre: 'Lavanda', color: '#B9A9D2' },
  { id: 'flores-blancas', nombre: 'Flores blancas', color: '#F3EEE6' },
  { id: 'coco-lima', nombre: 'Coco y lima', color: '#CFDDB0' },
  { id: 'sin-aroma', nombre: 'Sin aroma', color: '#FFFDFA' },
];
const PRECIOS = [
  { id: 'hasta5', nombre: 'Hasta $5.000', min: null, max: 5000 },
  { id: '5a12', nombre: '$5.000 a $12.000', min: 5001, max: 12000 },
  { id: 'mas12', nombre: 'Más de $12.000', min: 12001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  velas: 'vela velas aromatica aromaticas perfumada perfumadas vaso cuenco burbuja pilar deco regalo hogar casa',
  souvenirs: 'souvenir souvenirs evento eventos casamiento boda bautismo comunion quince 15 cumpleanos cumple baby shower personalizado personalizados etiqueta nombre nombres recuerdo fiesta',
  yeso: 'yeso deco decoracion bandeja florero platito platitos concha conchas porta anillos revender reventa negocio local',
  vainilla: 'vainilla dulce', lavanda: 'lavanda', 'flores-blancas': 'flores blancas floral', 'coco-lima': 'coco lima citrico', 'sin-aroma': 'sin aroma neutra',
};
const TODOS = ['vainilla', 'lavanda', 'flores-blancas', 'coco-lima'];

const Tienda = crearTienda([
  { id: 'vela-vaso-bambu', nombre: 'Vela aromática en vaso con tapa de bambú', cat: 'velas', aromas: TODOS, precio: 16900, descuento: 0, stock: 12, alta: 30, rango: 1, tag: 'nuevo',
    img: 'images/p-vela-vaso.webp', galeria: ['images/hero-vela.webp'],
    alt: 'Vela aromática color crema en vaso de vidrio, con la tapa de bambú apoyada al costado, sobre un lino claro',
    desc: 'Vela aromática en vaso de vidrio con tapa de bambú, para tenerla tapada cuando no está encendida. Elegí el aroma que más te guste.',
    datos: [['Envase', 'Vaso de vidrio'], ['Tapa', 'Bambú'], ['Aroma', 'A elección']] },
  { id: 'souvenir-frasco', nombre: 'Souvenir vela en frasco con moño y etiqueta', cat: 'souvenirs', aromas: TODOS, perso: true, unidad: 'c/u', precio: 3400, descuento: 0, stock: 300, alta: 29, rango: 2,
    img: 'images/p-souvenir-frasco.webp', galeria: ['images/etiqueta-souvenir.webp'],
    alt: 'Tres velas souvenir en frascos de vidrio con moño de hilo de yute y etiqueta de papel madera',
    desc: 'Vela en frasco de vidrio con moño de hilo de yute y etiqueta de papel madera con los nombres y la fecha de tu evento. Precio por unidad.',
    datos: [['Envase', 'Frasco de vidrio'], ['Detalle', 'Moño de yute y etiqueta'], ['Etiqueta', 'Con nombres y fecha']] },
  { id: 'vela-cuenco-yeso', nombre: 'Vela en cuenco de yeso con tapa de madera', cat: 'velas', aromas: TODOS, precio: 19800, descuento: 0, stock: 8, alta: 28, rango: 3,
    img: 'images/p-vela-cuenco.webp',
    alt: 'Vela crema dentro de un cuenco de yeso claro con tapa de madera, junto a flores secas',
    desc: 'Vela aromática dentro de un cuenco de yeso con tapa de madera. Cuando se termina la vela, el cuenco te queda para guardar lo que quieras.',
    datos: [['Envase', 'Cuenco de yeso'], ['Tapa', 'Madera'], ['Aroma', 'A elección']] },
  { id: 'souvenir-corazon', nombre: 'Souvenir vela corazón con moño y etiqueta', cat: 'souvenirs', aromas: TODOS, perso: true, unidad: 'c/u', precio: 2600, descuento: 0, stock: 300, alta: 27, rango: 4,
    img: 'images/p-souvenir-corazon.webp',
    alt: 'Velas souvenir con forma de corazón, cada una con moño de yute y etiqueta, sobre un plato',
    desc: 'Vela con forma de corazón, atada con hilo de yute y su etiqueta de papel madera con los nombres y la fecha. Precio por unidad.',
    datos: [['Forma', 'Corazón'], ['Detalle', 'Moño de yute y etiqueta'], ['Etiqueta', 'Con nombres y fecha']] },
  { id: 'vela-burbuja', nombre: 'Vela burbuja', cat: 'velas', aromas: ['sin-aroma', 'vainilla', 'lavanda'], precio: 7900, descuento: 0, stock: 15, alta: 26, rango: 5,
    img: 'images/p-vela-burbuja.webp',
    alt: 'Vela burbuja color marfil sobre un bloque de piedra clara',
    desc: 'La vela de cubitos redondeados que queda linda encendida o apagada. Para la mesa de luz, un estante o para regalar.',
    datos: [['Forma', 'Burbuja'], ['Color', 'Marfil'], ['Aroma', 'Sin aroma o a elección']] },
  { id: 'velas-pilar', nombre: 'Velas pilar estriadas (par)', cat: 'velas', aromas: ['sin-aroma', 'vainilla', 'flores-blancas'], precio: 12500, descuento: 10, stock: 10, alta: 24, rango: 6,
    img: 'images/p-velas-pilar.webp',
    alt: 'Dos velas pilar estriadas color celeste sobre un lino blanco',
    desc: 'Par de velas pilar con estrías, en celeste. Se paran solas sobre un plato o una bandeja.',
    datos: [['Presentación', 'Par'], ['Color', 'Celeste'], ['Aroma', 'Sin aroma o a elección']] },
  { id: 'bandeja-yeso', nombre: 'Bandeja ovalada de yeso', cat: 'yeso', precio: 9500, descuento: 0, stock: 9, alta: 25, rango: 7,
    img: 'images/p-bandeja-yeso.webp',
    alt: 'Bandeja ovalada de yeso con terminación tipo granito sobre una mesa clara',
    desc: 'Bandeja ovalada de yeso con terminación tipo granito. Para perfumes, anillos, velas o las llaves de la entrada.',
    datos: [['Material', 'Yeso'], ['Terminación', 'Tipo granito'], ['Forma', 'Ovalada']] },
  { id: 'conchas-yeso', nombre: 'Platitos concha de yeso (par)', cat: 'yeso', precio: 6900, descuento: 0, stock: 14, alta: 23, rango: 8,
    img: 'images/p-conchas-yeso.webp',
    alt: 'Dos platitos de yeso con forma de concha de mar sobre una superficie gris clara',
    desc: 'Par de platitos de yeso con forma de concha. Para anillos, aros o como detalle en el baño.',
    datos: [['Presentación', 'Par'], ['Material', 'Yeso'], ['Uso', 'Porta anillos o deco']] },
  { id: 'florero-yeso', nombre: 'Florero de yeso con ondas', cat: 'yeso', precio: 11800, descuento: 0, stock: 5, alta: 22, rango: 9,
    img: 'images/p-florero-yeso.webp',
    alt: 'Florero de yeso blanco con forma de esfera y ondas en diagonal',
    desc: 'Florero de yeso blanco con ondas en diagonal. Para flores secas o como pieza decorativa sola.',
    datos: [['Material', 'Yeso'], ['Color', 'Blanco'], ['Uso', 'Flores secas o deco']] },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.cat, p.desc, ETIQUETAS[p.cat] || '', ...(p.aromas || []).map(x => ETIQUETAS[x] || x),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), aroma = lista(f.aroma), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (aroma.length && !(p.aromas || []).some(x => aroma.includes(x))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.precioMin != null && final(p) < f.precioMin) return false;
    if (f.precioMax != null && final(p) > f.precioMax) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/\s+/).filter(Boolean);
    const texto = indice.get(p.id);
    return palabras.every(w => texto.includes(w));
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  const ordenadas = new Map();
  const ordenada = orden => {
    const o = ORDENES.some(x => x.id === orden) ? orden : 'destacados';
    if (!ordenadas.has(o)) ordenadas.set(o, [...visibles].sort(comparador(o)));
    return ordenadas.get(o);
  };
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const { q, ...resto } = filtros;
    const base = ordenada(orden).filter(p => coincide(p, resto));
    let i = 0;
    if (cursor != null) {
      const k = base.findIndex(p => p.id === cursor);
      i = k < 0 ? base.length : k + 1;
    }
    const items = [];
    let leidas = 0, paginas = 0;
    if (!q) {
      items.push(...base.slice(i, i + lim));
      leidas = items.length;
      paginas = items.length ? 1 : 0;
      const hayMas = i + items.length < base.length;
      return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, leidas, paginas };
    }
    while (i < base.length && items.length < lim) {
      const tanda = base.slice(i, i + tope);
      leidas += tanda.length;
      paginas++;
      for (const p of tanda) {
        i++;
        if (coincideTexto(p, q)) { items.push(p); if (items.length === lim) break; }
      }
    }
    const lleno = items.length === lim && i < base.length;
    return { items: items.map(copia), cursor: lleno ? items[items.length - 1].id : null, leidas, paginas };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function resumen(filtros = {}) {
    let n = 0, desde = Infinity;
    visibles.forEach(p => { if (coincide(p, filtros)) { n++; desde = Math.min(desde, final(p)); } });
    return { n, desde: n ? desde : 0 };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, resumen, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const conVar = p => (p.aromas || []).length > 1;
const limpiarTexto = s => String(s || '').replace(/[|<>]/g, '').replace(/\s+/g, ' ').trim();
const claveLinea = (id, v) => `${id}|${v || ''}`;
const EVENTOS = { casamiento: ['Casamiento', 'Nuestra boda'], bautismo: ['Bautismo', 'Mi bautismo'], comunion: ['Comunión', 'Mi comunión'], quince: ['15 años', 'Mis 15'], baby: ['Baby shower', 'Baby shower'], cumple: ['Cumpleaños', 'Mi cumple'] };
function textoVariante(aroma, perso) {
  const partes = [];
  if (aroma) partes.push(aroma === 'Sin aroma' ? aroma : `Aroma ${aroma.toLowerCase()}`);
  if (perso) {
    const ev = EVENTOS[perso.evento]?.[0] || '';
    const txt = [limpiarTexto(perso.nombres), limpiarTexto(perso.fecha)].filter(Boolean).join(', ');
    partes.push(txt ? `${ev ? `${ev}: ` : ''}${txt}` : `${ev ? `${ev}, ` : ''}etiqueta a confirmar`);
  }
  return partes.join(' · ');
}

const Cart = {
  KEY: 'velasamoreterno_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const items = this.get();
    const enCarrito = items.filter(i => i.id === producto.id).reduce((s, i) => s + i.qty, 0);
    const libre = Math.max(0, (producto.stock ?? 99) - enCarrito);
    const suma = Math.min(qty, libre);
    if (!suma) return 0;
    const existing = items.find(i => i.id === producto.id && (i.v || '') === (v || ''));
    if (existing) existing.qty += suma;
    else items.push({ id: producto.id, v: v || '', qty: suma });
    this.save(items);
    return suma;
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.v || '') === (v || '')); if (!it) return;
    const p = getProducto(id);
    const otros = items.filter(i => i !== it && i.id === id).reduce((s, i) => s + i.qty, 0);
    it.qty = Math.max(1, Math.min(qty, (p?.stock ?? 99) - otros)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (i.v || '') === (v || '')))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
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

const ICO = {
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
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

const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const els = [...cont.querySelectorAll(ENFOCABLES)].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!els.length) return;
  const primero = els[0], ultimo = els[els.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
const capas = [];
function abrirCapa(el, { alCerrar } = {}) {
  const previo = document.activeElement;
  el.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('open')));
  const onKey = e => {
    if (capas[capas.length - 1]?.el !== el) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrarCapa(el); }
    else atraparFoco(el, e);
  };
  document.addEventListener('keydown', onKey);
  capas.push({ el, previo, onKey, alCerrar });
}
function cerrarCapa(el, { devolverFoco = true } = {}) {
  const i = capas.findIndex(c => c.el === el);
  if (i < 0) return;
  const [capa] = capas.splice(i, 1);
  document.removeEventListener('keydown', capa.onKey);
  el.classList.remove('open');
  setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, reduceMotion ? 0 : 380);
  if (!capas.length && !document.getElementById('mainNav')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  capa.alCerrar?.();
  if (devolverFoco && capa.previo && document.contains(capa.previo)) capa.previo.focus({ preventScroll: true });
}

function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--desc">-${p.descuento}%</span>`);
  if (p.tag === 'nuevo') b.push('<span class="badge badge--nuevo">Nuevo</span>');
  if (p.perso) b.push('<span class="badge badge--perso">Personalizable</span>');
  else if (p.stock > 0 && p.stock <= 5) b.push('<span class="badge badge--pocas">Últimas unidades</span>');
  return b.length ? `<div class="prod__badges">${b.join('')}</div>` : '';
}
function precioHTML(p) {
  const u = p.unidad ? ` <small>${esc(p.unidad)}</small>` : '';
  return p.descuento > 0
    ? `<p class="precio precio--desc"><b>${formatearPrecio(precioFinal(p))}</b><s>${formatearPrecio(p.precio)}</s>${u}</p>`
    : `<p class="precio">${formatearPrecio(p.precio)}${u}</p>`;
}
function etiquetaCard(p) {
  const uno = CATEGORIAS.find(c => c.id === p.cat)?.uno || '';
  const n = (p.aromas || []).filter(a => a !== 'sin-aroma').length;
  const extra = conVar(p) ? (n ? `${n} ${n === 1 ? 'aroma' : 'aromas'}` : '') : '';
  return [uno, extra].filter(Boolean).join(' · ');
}

function cardHTML(p, estilo = 'ficha', animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : '';
  const clases = estilo === 'vitrina' ? 'prod prod--vitrina' : 'prod prod--ficha';
  const accion = p.perso
    ? `<button type="button" class="btn btn--ghost btn--sm prod-add" data-qv="${esc(p.id)}">Personalizar</button>`
    : conVar(p)
      ? `<button type="button" class="btn btn--ghost btn--sm prod-add" data-qv="${esc(p.id)}">Elegir aroma</button>`
      : `<div class="stepper" data-stepper><button type="button" data-paso="-1" aria-label="Restar uno" disabled>${ICO.menos}</button><output aria-live="polite">1</output><button type="button" data-paso="1" aria-label="Sumar uno"${p.stock <= 1 ? ' disabled' : ''}>${ICO.mas}</button></div><button type="button" class="btn btn--cta btn--sm prod-add" data-add="${esc(p.id)}">Agregar</button>`;
  return `<article class="${clases}" data-id="${esc(p.id)}"${anim}>
  <button type="button" class="prod__media" data-qv="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}">${badgesHTML(p)}<img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1200" height="1200" decoding="async"></button>
  <div class="prod__body">
    <p class="prod__cat">${esc(etiquetaCard(p))}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    ${precioHTML(p)}
    <div class="prod-actions">${accion}</div>
  </div>
</article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-cart-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${n} ${n === 1 ? 'producto' : 'productos'}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${i.qty} × ${p.nombre}${i.v ? ` (${i.v})` : ''} — ${formatearPrecio(precioFinal(p) * i.qty)}` : '';
  }).filter(Boolean);
  return `Hola! Quiero hacer este pedido en ${MARCA}:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
}

function initDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  const lista = drawer.querySelector('[data-drawer-lista]');
  const vacio = drawer.querySelector('[data-drawer-vacio]');
  const foot = drawer.querySelector('[data-drawer-foot]');
  const total = drawer.querySelector('[data-drawer-total]');
  const cuenta = drawer.querySelector('[data-drawer-cuenta]');
  const wsp = drawer.querySelector('[data-drawer-wsp]');
  const pintar = () => {
    const items = Cart.get();
    const n = Cart.count();
    cuenta.textContent = n ? `${n} ${n === 1 ? 'producto' : 'productos'}` : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => {
      const p = getProducto(i.id);
      if (!p) return '';
      const otros = items.filter(x => x !== i && x.id === i.id).reduce((s, x) => s + x.qty, 0);
      const tope = (p.stock ?? 99) - otros;
      const clave = esc(claveLinea(i.id, i.v));
      return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img)}" alt="" width="76" height="76">
  <div class="linea__info">
    <div class="linea__top"><div><p class="linea__nombre">${esc(p.nombre)}</p>${i.v ? `<p class="linea__var">${esc(i.v)}</p>` : ''}</div>
    <button type="button" class="linea__quitar" data-quitar="${clave}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button></div>
    <div class="linea__bottom"><div class="stepper"><button type="button" data-linea="${clave}" data-paso="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span>${i.qty}</span><button type="button" data-linea="${clave}" data-paso="1" aria-label="Sumar uno"${i.qty >= tope ? ' disabled' : ''}>${ICO.mas}</button></div>
    <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p></div>
  </div>
</li>`;
    }).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  lista.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) { const k = q.dataset.quitar.indexOf('|'); Cart.remove(q.dataset.quitar.slice(0, k), q.dataset.quitar.slice(k + 1)); return; }
    const b = e.target.closest('[data-linea]');
    if (b) {
      const k = b.dataset.linea.indexOf('|');
      const id = b.dataset.linea.slice(0, k), v = b.dataset.linea.slice(k + 1);
      const it = Cart.get().find(i => i.id === id && (i.v || '') === v);
      if (it) Cart.setQty(id, v, it.qty + Number(b.dataset.paso));
    }
  });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  drawer.querySelector('[data-finalizar]')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = () => { pintar(); abrirCapa(drawer); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', window.abrirCarrito));
  pintar();
}

function initCompras() {
  document.addEventListener('click', e => {
    const paso = e.target.closest('[data-stepper] [data-paso]');
    if (paso) {
      const st = paso.closest('[data-stepper]');
      const card = st.closest('[data-id]');
      const p = card ? getProducto(card.dataset.id) : null;
      const out = st.querySelector('output');
      const max = Math.max(1, p?.stock ?? 99);
      const n = Math.max(1, Math.min(max, Number(out.textContent) + Number(paso.dataset.paso)));
      out.textContent = n;
      st.querySelector('[data-paso="-1"]').disabled = n <= 1;
      st.querySelector('[data-paso="1"]').disabled = n >= max;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const out = add.closest('.prod-actions')?.querySelector('output');
      const qty = Number(out?.textContent || 1);
      const sumo = Cart.add(p, qty);
      if (sumo) {
        showToast(`Sumaste ${sumo > 1 ? `${sumo} × ` : ''}${p.nombre} al carrito`);
        if (out) { out.textContent = 1; const st = out.closest('[data-stepper]'); st.querySelector('[data-paso="-1"]').disabled = true; st.querySelector('[data-paso="1"]').disabled = (p.stock ?? 99) <= 1; }
      } else showToast('Ya tenés en el carrito todas las unidades disponibles');
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) { e.preventDefault(); abrirVistaRapida(qv.dataset.qv); }
  });
}

let qvEstado = null;
function abrirVistaRapida(id, { reemplazar = false } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  const fotos = [p.img, ...(p.galeria || [])];
  const unico = (p.aromas || []).length === 1 ? nombreDe(AROMAS, p.aromas[0]) : '';
  qvEstado = { id: p.id, v: unico, qty: p.perso ? 20 : 1 };
  const max = Math.max(1, p.stock ?? 99);
  qvEstado.qty = Math.min(qvEstado.qty, max);
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  const aromas = (p.aromas || []).map(a => AROMAS.find(x => x.id === a)).filter(Boolean);
  body.innerHTML = `<div class="qv__grid">
  <div class="qv__galeria">
    <div class="qv__principal"><img src="${esc(fotos[0])}" alt="${esc(p.alt)}" width="1200" height="1200" data-qv-foto></div>
    ${fotos.length > 1 ? `<div class="qv__thumbs">${fotos.map((f, k) => `<button type="button" data-qv-thumb="${esc(f)}" aria-pressed="${k === 0}" aria-label="Ver foto ${k + 1}"><img src="${esc(f)}" alt="" width="64" height="64"></button>`).join('')}</div>` : ''}
  </div>
  <div class="qv__info">
    <p class="prod__cat">${esc(etiquetaCard(p))}</p>
    <h2>${esc(p.nombre)}</h2>
    ${precioHTML(p)}
    <p class="qv__desc">${esc(p.desc)}</p>
    ${conVar(p) ? `<div class="qv__var"><p>Aroma: <span data-qv-elegida>elegí uno</span></p><div class="chips" role="group" aria-label="Aroma">${aromas.map(a => `<button type="button" class="chip" data-qv-op="${esc(a.nombre)}" aria-pressed="false"><i class="punto" style="--c:${a.color}"></i>${esc(a.nombre)}</button>`).join('')}</div><p class="qv__error" data-qv-error hidden>Elegí el aroma para sumarlo al carrito.</p></div>` : ''}
    ${p.perso ? `<div class="qv__perso"><p>Etiqueta personalizada<span>Si preferís, dejala en blanco y la coordinamos por WhatsApp.</span></p>
      <label class="campo"><span>Evento</span><select data-qv-evento>${Object.entries(EVENTOS).map(([k, [n]]) => `<option value="${k}">${esc(n)}</option>`).join('')}</select></label>
      <div class="campos-2"><label class="campo"><span>Nombres o texto</span><input type="text" maxlength="22" autocomplete="off" placeholder="Sofi &amp; Martín" data-qv-nombres></label><label class="campo"><span>Fecha</span><input type="text" maxlength="14" autocomplete="off" placeholder="14 · 03 · 27" data-qv-fecha></label></div>
    </div>` : ''}
    <dl class="qv__datos">${(p.datos || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    ${p.perso ? `<div class="qv__rapidas"><span>Cantidad rápida:</span>${[10, 25, 50].map(n => `<button type="button" class="chip" data-qv-rapida="${n}">${n}</button>`).join('')}</div>` : ''}
    <div class="qv__acciones">
      <div class="stepper"><button type="button" data-qv-paso="-1" aria-label="Restar uno"${qvEstado.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output data-qv-cant aria-live="polite">${qvEstado.qty}</output><button type="button" data-qv-paso="1" aria-label="Sumar uno"${qvEstado.qty >= max ? ' disabled' : ''}>${ICO.mas}</button></div>
      <button type="button" class="btn btn--ghost" data-qv-agregar>Agregar al carrito</button>
      <button type="button" class="btn btn--cta" data-qv-comprar>Comprar ahora</button>
    </div>
    <p class="qv__stock">${p.perso ? 'Precio por unidad · el total se ve en el carrito' : p.stock === 1 ? 'Queda 1 sola' : p.stock <= 5 ? `Quedan ${p.stock}` : `Hay ${p.stock} disponibles`}</p>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede gustar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}${r.unidad ? ` ${esc(r.unidad)}` : ''}</small></button></li>`).join('')}</ul></div>` : ''}`;
  modal.querySelector('.qv__panel').scrollTop = 0;
  ponerJsonLdProducto(p);
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { alCerrar: () => { if (PAGINA === 'catalogo') setParam('producto', null); } });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') setParam('producto', p.id);
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  const ponerCant = (p, n) => {
    const max = Math.max(1, p.stock ?? 99);
    qvEstado.qty = Math.max(1, Math.min(max, n));
    modal.querySelector('[data-qv-cant]').textContent = qvEstado.qty;
    modal.querySelector('[data-qv-paso="-1"]').disabled = qvEstado.qty <= 1;
    modal.querySelector('[data-qv-paso="1"]').disabled = qvEstado.qty >= max;
  };
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const th = e.target.closest('[data-qv-thumb]');
    if (th) {
      modal.querySelector('[data-qv-foto]').src = th.dataset.qvThumb;
      modal.querySelectorAll('[data-qv-thumb]').forEach(b => b.setAttribute('aria-pressed', String(b === th)));
      return;
    }
    const op = e.target.closest('[data-qv-op]');
    if (op) {
      qvEstado.v = op.dataset.qvOp;
      modal.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b === op)));
      modal.querySelector('[data-qv-elegida]').textContent = qvEstado.v;
      modal.querySelector('[data-qv-error]').hidden = true;
      return;
    }
    const paso = e.target.closest('[data-qv-paso]');
    if (paso) { ponerCant(p, qvEstado.qty + Number(paso.dataset.qvPaso)); return; }
    const rapida = e.target.closest('[data-qv-rapida]');
    if (rapida) { ponerCant(p, Number(rapida.dataset.qvRapida)); return; }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      if (conVar(p) && !qvEstado.v) {
        modal.querySelector('[data-qv-error]').hidden = false;
        modal.querySelector('[data-qv-op]')?.focus();
        return;
      }
      const perso = p.perso ? {
        evento: modal.querySelector('[data-qv-evento]')?.value,
        nombres: modal.querySelector('[data-qv-nombres]')?.value,
        fecha: modal.querySelector('[data-qv-fecha]')?.value,
      } : null;
      const v = textoVariante(conVar(p) ? qvEstado.v : '', perso);
      const sumo = Cart.add(p, qvEstado.qty, v);
      if (!sumo) { showToast('Ya tenés en el carrito todas las unidades disponibles'); return; }
      if (comprar) { cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(); }
      else showToast(`Sumaste ${sumo > 1 ? `${sumo} × ` : ''}${p.nombre}${qvEstado.v ? ` (${qvEstado.v.toLowerCase()})` : ''} al carrito`);
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}

function setParam(k, v) {
  try {
    const u = new URL(location.href);
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
    else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
    history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? `?${u.searchParams}` : '') + u.hash);
  } catch { }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 901px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!capas.length) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button:not(.nav-close)')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
  const header = document.querySelector('.site-header');
  const marcar = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', marcar, { passive: true });
  marcar();
}

function initMenuCategorias() {
  const actual = new URLSearchParams(location.search).get('cat');
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const r = Tienda.resumen({ cat: c.id });
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${PAGINA === 'catalogo' && actual === c.id ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="48" height="48"><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><em>${r.n}</em></a></li>`;
    }).join('');
  });
  document.querySelectorAll('.nav-cats').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    const hover = window.matchMedia('(hover: hover) and (min-width: 901px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); box.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); box.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('is-open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hover.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hover.matches) t = setTimeout(cerrar, 120); });
    box.addEventListener('focusout', e => { if (hover.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (!box.contains(e.target) && window.matchMedia('(min-width: 901px)').matches) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('is-open')) { cerrar(); btn.focus(); } });
  });
}

function initResumenes() {
  document.querySelectorAll('[data-cat-resumen]').forEach(el => {
    const r = Tienda.resumen({ cat: el.dataset.catResumen });
    el.innerHTML = `${r.n} ${r.n === 1 ? 'producto' : 'productos'} · desde ${formatearPrecio(r.desde)} ${ICO.flecha}`;
  });
}

function idsDe(el, attr) {
  return (el.getAttribute(attr) || '').split(',').map(s => s.trim()).filter(Boolean);
}
function productosPorIds(ids) {
  const res = Tienda.consultar({ filtros: { ids }, limite: Math.min(ids.length, 8) });
  const orden = new Map(ids.map((id, k) => [id, k]));
  return res.items.sort((a, b) => orden.get(a.id) - orden.get(b.id));
}
function initPreviews() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    cont.innerHTML = productosPorIds(idsDe(cont, 'data-preview')).map(p => cardHTML(p, cont.dataset.estilo || 'ficha')).join('');
  });
  document.querySelectorAll('[data-rail]').forEach(track => {
    track.innerHTML = productosPorIds(idsDe(track, 'data-rail')).map(p => `<div class="rail-item"><div data-animate="der" style="opacity:0;transform:translateX(56px)">${cardHTML(p, 'vitrina', false)}</div></div>`).join('');
  });
}

function initCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const verMas = document.getElementById('verMas');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const vacio = document.getElementById('vacio');
  const activos = document.getElementById('activos');
  const panel = document.getElementById('filtros');
  const inputQ = document.getElementById('q');
  const selOrden = document.getElementById('orden');
  const titulo = document.getElementById('catTitulo');
  const miga = document.getElementById('migaCat');
  const estilo = MODELO === '2' ? 'vitrina' : 'ficha';
  const params = new URLSearchParams(location.search);
  const valida = (arr, lista) => (arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id));
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    aroma: valida(params.get('aroma'), AROMAS),
    precio: PRECIOS.some(x => x.id === params.get('precio')) ? params.get('precio') : '',
    q: (params.get('q') || '').slice(0, 60),
    orden: ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;
  const filtros = (sin = '') => {
    const f = {};
    if (sin !== 'cat' && e.cat.length) f.cat = e.cat;
    if (sin !== 'aroma' && e.aroma.length) f.aroma = e.aroma;
    const pr = PRECIOS.find(x => x.id === e.precio);
    if (sin !== 'precio' && pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    return f;
  };
  const opcion = (tipo, grupo, item, marcado, n, extra = '') =>
    `<label class="opcion${n ? '' : ' is-cero'}"><input type="${tipo}" data-f="${grupo}" value="${esc(item.id)}"${tipo === 'radio' ? ` name="f-${grupo}"` : ''}${marcado ? ' checked' : ''}>${extra}<span>${esc(item.nombre)}</span><small>${n}</small></label>`;
  function pintarFiltros() {
    panel.querySelector('[data-f-cats]').innerHTML = CATEGORIAS.map(c => opcion('checkbox', 'cat', c, e.cat.includes(c.id), Tienda.contar({ ...filtros('cat'), cat: c.id }))).join('');
    panel.querySelector('[data-f-aroma]').innerHTML = AROMAS.map(a => opcion('checkbox', 'aroma', a, e.aroma.includes(a.id), Tienda.contar({ ...filtros('aroma'), aroma: a.id }), `<i class="punto" style="--c:${a.color}"></i>`)).join('');
    panel.querySelector('[data-f-precio]').innerHTML = [{ id: '', nombre: 'Todos los precios', min: null, max: null }, ...PRECIOS].map(pr => opcion('radio', 'precio', pr, e.precio === pr.id, Tienda.contar({ ...filtros('precio'), precioMin: pr.min, precioMax: pr.max }))).join('');
  }
  function pintarActivos() {
    const chips = [
      ...e.cat.map(id => ({ k: 'cat', id, t: nombreDe(CATEGORIAS, id) })),
      ...e.aroma.map(id => ({ k: 'aroma', id, t: nombreDe(AROMAS, id) })),
      ...(e.precio ? [{ k: 'precio', id: e.precio, t: nombreDe(PRECIOS, e.precio) }] : []),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = e.cat.length + e.aroma.length + (e.precio ? 1 : 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const unaCat = e.cat.length === 1 ? CATEGORIAS.find(c => c.id === e.cat[0]) : null;
    if (titulo) titulo.textContent = unaCat ? unaCat.nombre : 'Todo el catálogo';
    if (miga) { miga.hidden = !unaCat; miga.textContent = unaCat ? unaCat.nombre : ''; }
    document.title = `${unaCat ? unaCat.nombre : 'Catálogo'} — ${MARCA} | Velas, souvenirs y yeso`;
  }
  function sincronizarUrl() {
    setParam('cat', e.cat); setParam('aroma', e.aroma); setParam('precio', e.precio); setParam('q', e.q);
    setParam('orden', e.orden === 'destacados' ? '' : e.orden);
  }
  function render(reiniciar = true) {
    const f = { ...filtros(), ...(e.q ? { q: e.q } : {}) };
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: f, orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, estilo)).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = e.q ? null : Tienda.contar(filtros());
    contador.innerHTML = e.q
      ? `${mostrados}${cursor ? '+' : ''} <small>${mostrados === 1 && !cursor ? 'resultado' : 'resultados'} para «${esc(e.q)}»</small>`
      : `${total} <small>${total === 1 ? 'producto' : 'productos'}</small>`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.hidden = mostrados === 0;
    mostrando.textContent = e.q ? `Mostrando ${mostrados}${cursor ? ' · hay más resultados' : ''}` : `Mostrando ${mostrados} de ${total}`;
    document.querySelectorAll('[data-ver-n]').forEach(el => { el.textContent = e.q ? 'los' : `${total}`; });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  function aplicar() { pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true); }
  panel.addEventListener('change', ev => {
    const inp = ev.target.closest('[data-f]');
    if (!inp) return;
    const g = inp.dataset.f;
    if (g === 'precio') e.precio = inp.value;
    else e[g] = [...panel.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
    aplicar();
  });
  let tq = 0;
  inputQ.value = e.q;
  inputQ.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); }, 220); });
  inputQ.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); inputQ.blur(); });
  selOrden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  selOrden.addEventListener('change', () => { e.orden = selOrden.value; sincronizarUrl(); render(true); });
  const limpiar = () => { e.cat = []; e.aroma = []; e.precio = ''; e.q = ''; inputQ.value = ''; aplicar(); };
  document.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const qf = ev.target.closest('[data-quitar-f]');
    if (qf) {
      const k = qf.dataset.quitarF, v = qf.dataset.v;
      if (k === 'cat' || k === 'aroma') e[k] = e[k].filter(x => x !== v);
      else if (k === 'precio') e.precio = '';
      else { e.q = ''; inputQ.value = ''; }
      aplicar();
    }
  });
  verMas.addEventListener('click', () => render(false));
  const bd = document.querySelector('.filtros-backdrop');
  const abrirPanel = () => { panel.classList.add('open'); bd?.classList.add('open'); document.body.classList.add('no-scroll'); panel.removeAttribute('inert'); panel.querySelector('button, input')?.focus(); };
  const cerrarPanel = () => { panel.classList.remove('open'); bd?.classList.remove('open'); if (!capas.length) document.body.classList.remove('no-scroll'); syncPanel(); };
  const mq = window.matchMedia('(max-width: 1024px)');
  const syncPanel = () => { if (mq.matches && !panel.classList.contains('open')) panel.setAttribute('inert', ''); else panel.removeAttribute('inert'); if (!mq.matches) { panel.classList.remove('open'); bd?.classList.remove('open'); } };
  mq.addEventListener('change', syncPanel);
  syncPanel();
  if (mq.matches) panel.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  document.querySelectorAll('[data-abrir-filtros]').forEach(b => b.addEventListener('click', abrirPanel));
  document.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => { cerrarPanel(); document.querySelector('[data-abrir-filtros]')?.focus(); }));
  bd?.addEventListener('click', cerrarPanel);
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && panel.classList.contains('open')) cerrarPanel(); else if (panel.classList.contains('open')) atraparFoco(panel, ev); });
  pintarFiltros(); pintarActivos(); render(true);
  if (params.get('buscar') === '1') { setParam('buscar', null); setTimeout(() => { if (mq.matches) abrirPanel(); inputQ.focus(); }, 120); }
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirVistaRapida(prod), 60);
}

function initEtiqueta() {
  const form = document.querySelector('[data-etiqueta]');
  if (!form) return;
  const p = getProducto('souvenir-frasco');
  if (!p) return;
  const inNombres = form.querySelector('[data-et-nombres]');
  const inFecha = form.querySelector('[data-et-fecha]');
  const selAroma = form.querySelector('[data-et-aroma]');
  const out = form.querySelector('[data-et-cant]');
  const tagEvento = document.querySelector('[data-tag-evento]');
  const tagNombres = document.querySelector('[data-tag-nombres]');
  const tagFecha = document.querySelector('[data-tag-fecha]');
  const total = form.querySelector('[data-et-total]');
  const detalle = form.querySelector('[data-et-detalle]');
  const wsp = form.querySelector('[data-et-wsp]');
  const menos = form.querySelector('[data-et-paso="-5"]');
  const mas = form.querySelector('[data-et-paso="5"]');
  const est = { evento: 'casamiento', qty: Number(out.textContent) || 20 };
  const max = p.stock ?? 300;
  const pintar = () => {
    const nombres = limpiarTexto(inNombres.value);
    const fecha = limpiarTexto(inFecha.value);
    tagEvento.textContent = EVENTOS[est.evento][1];
    tagNombres.textContent = nombres || 'Tus nombres';
    tagFecha.textContent = fecha || 'La fecha';
    out.textContent = est.qty;
    menos.disabled = est.qty <= 1;
    mas.disabled = est.qty >= max;
    total.textContent = formatearPrecio(precioFinal(p) * est.qty);
    detalle.textContent = `${est.qty} × ${formatearPrecio(precioFinal(p))}`;
    const etiqueta = [nombres, fecha].filter(Boolean).join(' · ');
    wsp.href = wspHref(`Hola! Quiero consultar por ${est.qty} souvenirs de vela en frasco para ${EVENTOS[est.evento][0].toLowerCase()}, aroma ${selAroma.value.toLowerCase()}${etiqueta ? `, con la etiqueta «${etiqueta}»` : ''}.`);
  };
  form.addEventListener('click', e => {
    const ch = e.target.closest('[data-evento]');
    if (ch) {
      est.evento = ch.dataset.evento;
      form.querySelectorAll('[data-evento]').forEach(b => b.setAttribute('aria-pressed', String(b === ch)));
      pintar();
      return;
    }
    const paso = e.target.closest('[data-et-paso]');
    if (paso) {
      const d = Number(paso.dataset.etPaso);
      if (d > 0) est.qty = est.qty < 5 ? 5 : est.qty + 5;
      else est.qty = est.qty <= 5 ? 1 : est.qty - 5;
      est.qty = Math.max(1, Math.min(max, est.qty));
      pintar();
    }
  });
  form.addEventListener('input', pintar);
  form.addEventListener('change', pintar);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = textoVariante(selAroma.value, { evento: est.evento, nombres: inNombres.value, fecha: inFecha.value });
    const sumo = Cart.add(p, est.qty, v);
    if (!sumo) { showToast('Ya tenés en el carrito todas las unidades disponibles'); return; }
    const nombres = limpiarTexto(inNombres.value);
    showToast(`Sumaste ${sumo} souvenirs${nombres ? ` con la etiqueta «${nombres}»` : ''} al carrito`);
  });
  pintar();
}

function estadoHorario(ahora = new Date()) {
  let dia = ahora.getDay(), min = ahora.getHours() * 60 + ahora.getMinutes();
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(ahora);
    const v = t => partes.find(x => x.type === t)?.value;
    dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(v('weekday'));
    min = (Number(v('hour')) % 24) * 60 + Number(v('minute'));
  } catch { }
  const habil = dia >= 1 && dia <= 5;
  if (habil && min >= 540 && min < 1200) return { abierto: true, texto: 'Atendiendo ahora · hasta las 20 h' };
  if (habil && min < 540) return { abierto: false, texto: 'Abrimos hoy a las 9 h' };
  if (dia >= 1 && dia <= 4) return { abierto: false, texto: 'Abrimos mañana a las 9 h' };
  if (dia === 0) return { abierto: false, texto: 'Abrimos mañana a las 9 h' };
  return { abierto: false, texto: 'Abrimos el lunes a las 9 h' };
}
function initHorario() {
  const els = document.querySelectorAll('[data-horario-estado]');
  if (!els.length) return;
  const pintar = () => {
    const s = estadoHorario();
    els.forEach(el => { el.textContent = s.texto; el.classList.toggle('is-cerrado', !s.abierto); });
  };
  pintar();
  setInterval(pintar, 60000);
}

function initRail() {
  const vp = document.querySelector('.rail-vp');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (vp.querySelector('.rail-item')?.getBoundingClientRect().width || 300) + 20;
  const flechas = () => {
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();
  let x0 = 0, s0 = 0, activo = false, moved = false, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    activo = true; moved = false; x0 = e.clientX; s0 = vp.scrollLeft; pointerId = e.pointerId; vp.dataset.arrastrado = '0';
  });
  vp.addEventListener('pointermove', e => {
    if (!activo) return;
    const dx = e.clientX - x0;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { }
    }
    if (moved) vp.scrollLeft = s0 - dx;
  });
  const end = () => {
    if (!activo) return;
    activo = false;
    try { vp.releasePointerCapture?.(pointerId); } catch { }
    if (moved) {
      vp.dataset.arrastrado = '1';
      setTimeout(() => { vp.dataset.arrastrado = '0'; }, 60);
    }
    vp.classList.remove('dragging');
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', end);
  vp.addEventListener('click', e => { if (vp.dataset.arrastrado === '1') { e.preventDefault(); e.stopPropagation(); } }, true);
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
  sync();
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

let revealsListos = false;
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
}

function initReveals() {
  revealsListos = true;
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desde = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desde('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desde('h1', { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.15);
  desde('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.45);
  desde('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  desde('.hero-badge', { y: 14, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.7);
  desde('.sello', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.75);
  const trazo = hero.querySelector('.hero__trazo path');
  if (trazo) tl.fromTo(trazo, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut' }, 0.55);
}

initPreviews();
initResumenes();
initMenuCategorias();
initCatalogo();
initReveals();
initHeroMotion();
initNav();
initDrawer();
initVistaRapida();
initCompras();
initEtiqueta();
initHorario();
initRail();
initFloats();
initModelBarScroll();
Cart.syncStock();
updateCartBadge();
