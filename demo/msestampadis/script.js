'use strict';

const WSP = '5492236047981';
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  { id: 'adultos', nombre: 'Remeras para adultos', img: 'images/cat-adultos.webp' },
  { id: 'infantil', nombre: 'Remeras infantiles', img: 'images/cat-infantil.webp' },
  { id: 'tazas', nombre: 'Tazas estampadas', img: 'images/cat-tazas.webp' },
  { id: 'gorras', nombre: 'Gorras y viseras', img: 'images/cat-gorras.webp' },
  { id: 'regalos', nombre: 'Regalos y combos', img: 'images/p-a-juego.webp' },
];
const COLORES = [
  { id: 'blanco', nombre: 'Blanco', hex: '#FFFFFF' },
  { id: 'negro', nombre: 'Negro', hex: '#1F1A1E' },
  { id: 'celeste', nombre: 'Celeste', hex: '#9CC7E8' },
  { id: 'crema', nombre: 'Crema', hex: '#F1E6CF' },
  { id: 'beige', nombre: 'Beige', hex: '#E2D6C2' },
];
const PRECIOS = [
  { id: 'hasta-10', nombre: 'Hasta $10.000', max: 10000 },
  { id: '10-15', nombre: '$10.000 a $15.000', min: 10000, max: 15000 },
  { id: 'mas-15', nombre: 'Más de $15.000', min: 15000 },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'nuevos', nombre: 'Más nuevos' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];
const T_ADULTO = ['S', 'M', 'L', 'XL', 'XXL'];
const T_NINO = ['2', '4', '6', '8', '10', '12', '14'];

const Tienda = crearTienda([
  { id: 'remera-formas', nombre: 'Remera Formas', cat: 'adultos', color: 'blanco', precio: 18900, descuento: 0, stock: 12, alta: 15, rango: 1, etiqueta: 'nuevo', talles: T_ADULTO,
    img: 'images/p-formas.webp', escena: 'images/portada.webp', alt: 'Remera blanca con semicírculos azul petróleo, naranja, mostaza y verde',
    desc: 'Remera blanca con una composición de semicírculos en azul petróleo, naranja, mostaza y verde. La estampa va grande, de frente.', tags: 'geometrica circulos colores' },
  { id: 'remera-negra-sol-rojo', nombre: 'Remera negra Sol rojo', cat: 'adultos', color: 'negro', precio: 19900, descuento: 0, stock: 8, alta: 13, rango: 2, talles: T_ADULTO,
    img: 'images/p-sol-rojo.webp', escena: 'images/remeras-negras.webp', alt: 'Remera negra con un sol rojo y formas en azul, mostaza y crema',
    desc: 'Remera negra con una estampa abstracta: un sol rojo, formas en azul, mostaza y crema y trazos finos, de frente.', tags: 'abstracta negra sol' },
  { id: 'remera-con-tu-diseno', nombre: 'Remera blanca con tu diseño', cat: 'adultos', color: 'blanco', precio: 15900, descuento: 0, stock: 40, alta: 9, rango: 3, personalizable: true, talles: T_ADULTO,
    img: 'images/p-remera-lisa.webp', escena: 'images/taller.webp', alt: 'Remeras blancas lisas dobladas sobre la mesa del taller, listas para estampar',
    desc: 'Remera blanca lisa estampada con el diseño que nos mandes: un dibujo, un logo, una foto o una frase.', tags: 'personalizada logo foto frase empresa egresados' },
  { id: 'remera-infantil-arcoiris-sol', nombre: 'Remera infantil Arcoíris y sol', cat: 'infantil', color: 'celeste', precio: 14500, descuento: 0, stock: 10, alta: 10, rango: 4, talles: T_NINO,
    img: 'images/p-arcoiris-sol.webp', alt: 'Remera infantil celeste con un arcoíris, dos nubes y un sol',
    desc: 'Remera infantil celeste con un arcoíris de colores, dos nubes y un sol amarillo en el pecho.', tags: 'arcoiris nubes sol nene nena chicos' },
  { id: 'remera-punto-y-medio', nombre: 'Remera Punto y medio', cat: 'adultos', color: 'blanco', precio: 16900, descuento: 0, stock: 9, alta: 7, rango: 5, talles: T_ADULTO,
    img: 'images/p-punto.webp', alt: 'Remera blanca con una estampa chica de círculos fucsia y lila en el pecho',
    desc: 'Remera blanca con una estampa chica en el pecho: un punto y dos medios círculos en fucsia y lila.', tags: 'minimalista circulos fucsia lila' },
  { id: 'gorra-ola', nombre: 'Gorra Ola fucsia', cat: 'gorras', color: 'blanco', precio: 13900, descuento: 0, stock: 7, alta: 12, rango: 6,
    img: 'images/p-gorra-ola.webp', alt: 'Gorra blanca con una estampa de ondas fucsia en el frente',
    desc: 'Gorra blanca con una estampa de ondas en fucsia en el frente.', tags: 'visera ondas fucsia' },
  { id: 'remera-infantil-gatito', nombre: 'Remera infantil Gatito al sol', cat: 'infantil', color: 'crema', precio: 14500, descuento: 0, stock: 11, alta: 16, rango: 7, etiqueta: 'nuevo', talles: T_NINO,
    img: 'images/p-gatito.webp', escena: 'images/remeras-ninos.webp', alt: 'Remera infantil crema con un gatito rosa y un sol amarillo',
    desc: 'Remera infantil color crema con un gatito rosa de cachetes naranjas y un sol amarillo.', tags: 'gato gatito sol nene nena chicos' },
  { id: 'taza-hojas', nombre: 'Taza Hojas', cat: 'tazas', color: 'blanco', precio: 9900, descuento: 0, stock: 14, alta: 8, rango: 8,
    img: 'images/p-taza-hojas.webp', alt: 'Taza blanca estampada con hojas fucsia alrededor',
    desc: 'Taza blanca con hojas en fucsia estampadas alrededor de toda la taza.', tags: 'hojas fucsia plantas' },
  { id: 'remera-negra-recortes', nombre: 'Remera negra Recortes', cat: 'adultos', color: 'negro', precio: 19900, descuento: 0, stock: 6, alta: 14, etiqueta: 'nuevo', talles: T_ADULTO,
    img: 'images/p-hojas-espalda.webp', escena: 'images/remeras-negras.webp', alt: 'Espalda de una remera negra con hojas verdes y formas azul, mostaza y coral',
    desc: 'Remera negra con la estampa en la espalda: hojas verdes, un círculo crema y formas en azul, mostaza y coral.', tags: 'abstracta negra espalda hojas' },
  { id: 'remera-infantil-arcoiris', nombre: 'Remera infantil Arcoíris', cat: 'infantil', color: 'blanco', precio: 13900, descuento: 10, stock: 8, alta: 6, talles: T_NINO,
    img: 'images/p-arcoiris-blanca.webp', escena: 'images/portada.webp', alt: 'Remera infantil blanca con un arcoíris en tonos naranja, mostaza y azul',
    desc: 'Remera infantil blanca con un arcoíris de cuatro colores: naranja, mostaza, verde agua y azul.', tags: 'arcoiris nene nena chicos' },
  { id: 'remera-infantil-jardin', nombre: 'Remera infantil Jardín', cat: 'infantil', color: 'crema', precio: 14500, descuento: 0, stock: 9, alta: 17, etiqueta: 'nuevo', talles: T_NINO,
    img: 'images/p-jardin.webp', escena: 'images/remeras-ninos.webp', alt: 'Remeras infantiles dobladas con flores fucsia, lunares verdes y margaritas',
    desc: 'Remera infantil color crema con flores fucsia, hojas verdes y lunares, estampada de lado a lado.', tags: 'flores lunares margaritas nena chicos' },
  { id: 'taza-flores-acuarela', nombre: 'Taza Flores de acuarela', cat: 'tazas', color: 'blanco', precio: 10500, descuento: 0, stock: 10, alta: 18, etiqueta: 'nuevo',
    img: 'images/p-taza-flores.webp', alt: 'Taza blanca con flores de acuarela fucsia y violeta',
    desc: 'Taza blanca con flores de acuarela en fucsia y violeta, con hojas y pimpollos.', tags: 'flores acuarela violeta regalo' },
  { id: 'taza-con-tu-diseno', nombre: 'Taza con tu foto o frase', cat: 'tazas', color: 'blanco', precio: 9500, descuento: 0, stock: 40, alta: 5, personalizable: true,
    img: 'images/p-tazas-blancas.webp', escena: 'images/taller.webp', alt: 'Tazas blancas lisas sobre la mesa del taller, listas para estampar',
    desc: 'Taza blanca estampada con tu foto, tu logo o la frase que quieras.', tags: 'personalizada foto frase logo regalo' },
  { id: 'gorra-medio-sol', nombre: 'Gorra Medio sol', cat: 'gorras', color: 'beige', precio: 13900, descuento: 0, stock: 4, alta: 4,
    img: 'images/p-gorra-medio-sol.webp', escena: 'images/portada.webp', alt: 'Gorra beige con un círculo mitad naranja y mitad azul',
    desc: 'Gorra beige con un círculo partido en naranja y azul petróleo en el frente.', tags: 'visera geometrica circulo' },
  { id: 'gorra-con-tu-logo', nombre: 'Gorra con tu logo', cat: 'gorras', color: 'blanco', precio: 12900, descuento: 0, stock: 30, alta: 3, personalizable: true,
    img: 'images/p-gorra-lisa.webp', escena: 'images/taller.webp', alt: 'Gorra blanca lisa sobre la mesa del taller, lista para estampar',
    desc: 'Gorra blanca estampada con tu logo, el nombre de tu equipo o una frase.', tags: 'visera personalizada logo equipo empresa' },
  { id: 'remeras-a-juego', nombre: 'Remeras a juego: adulto y chico', cat: 'regalos', color: 'blanco', precio: 31900, descuento: 0, stock: 6, alta: 19, etiqueta: 'nuevo',
    img: 'images/p-a-juego.webp', escena: 'images/portada.webp', alt: 'Remera blanca de adulto con semicírculos y remera infantil con arcoíris colgadas juntas',
    desc: 'Una remera de adulto con semicírculos y una de chico con arcoíris, de la misma familia de colores. Los dos talles los elegís cuando coordinamos el pedido.', tags: 'combo familia papa mama hijo hija regalo' },
  { id: 'set-tazas-geometria', nombre: 'Set de 2 tazas Geometría', cat: 'regalos', color: 'blanco', precio: 18900, descuento: 10, stock: 5, alta: 2,
    img: 'images/p-tazas-geo.webp', escena: 'images/portada.webp', alt: 'Dos tazas estampadas con formas geométricas sobre una base de madera',
    desc: 'Dos tazas con formas geométricas en azul petróleo, mostaza y coral: una con semicírculos y otra con un mosaico.', tags: 'combo regalo tazas geometrica' },
  { id: 'buzo-con-tu-diseno', nombre: 'Buzo con tu diseño', cat: 'adultos', color: 'blanco', precio: 27900, descuento: 0, stock: 0, alta: 1, visible: false, talles: T_ADULTO,
    img: 'images/p-remera-lisa.webp', alt: 'Próximo ingreso', desc: 'Próximo ingreso.' },
], {
  tope: 100,
  texto: p => [p.nombre, nombreDe(CATEGORIAS, p.cat), nombreDe(COLORES, p.color), p.desc, p.tags, p.personalizable ? 'con tu diseno personalizado personalizable' : ''].join(' '),
});

function crearTienda(coleccion, { tope = 100, texto = p => p.nombre } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm(texto(p))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  function coincide(p, f) {
    const cat = lista(f.cat), color = lista(f.color), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (color.length && !color.includes(p.color)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.tu && !p.personalizable) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
    if (f.destacado === true && !p.rango) return false;
    if (f.precioMin != null && final(p) < f.precioMin) return false;
    if (f.precioMax != null && final(p) > f.precioMax) return false;
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const t = indice.get(p.id) || '';
      if (!palabras.every(w => t.includes(w))) return false;
    }
    return true;
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
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = Math.min(Math.max(parseInt(limite, 10) || 1, 1), tope);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden));
    let desde = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      desde = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(desde, desde + lim);
    const hayMas = desde + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const getProducto = id => Tienda.obtener(id);
function nombreDe(arr, id) { return arr.find(x => x.id === id)?.nombre || ''; }
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const conTalle = p => (p.talles || []).length > 0;

const Cart = {
  KEY: 'msestampadis_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, talle = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.talle || '') === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, talle, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.talle || '') === talle); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && (i.talle || '') === talle))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const ICON = {
  flecha: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  mas: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  carrito: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle class="i-dot" cx="9.5" cy="20" r="1.5"/><circle class="i-dot" cx="17.5" cy="20" r="1.5"/></svg>',
  talle: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3 4 5.5 2.5 10l3 1.2V21h13v-9.8l3-1.2L20 5.5 16 3a4 4 0 0 1-8 0Z"/></svg>',
  basura: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/></svg>',
  cerrar: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  wsp: '<svg class="i i-fill" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
  reg: '<svg class="reg" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="10"/><path d="M20 1v38M1 20h38"/></svg>',
};

function precioHTML(p) {
  if (p.descuento > 0) return `<p class="precio precio--off"><span>${formatearPrecio(precioFinal(p))}</span><s>${formatearPrecio(p.precio)}</s></p>`;
  return `<p class="precio"><span>${formatearPrecio(p.precio)}</span></p>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.personalizable) b.push('<span class="badge badge--tu">Con tu diseño</span>');
  else if (p.etiqueta === 'nuevo') b.push('<span class="badge">Nuevo</span>');
  if (p.stock > 0 && p.stock <= 4) b.push('<span class="badge">Últimas unidades</span>');
  return b.length ? `<span class="badges">${b.join('')}</span>` : '';
}
function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICON.menos}</button><input type="number" inputmode="numeric" min="1" max="${max}" value="${valor}" aria-label="Cantidad"><button type="button" data-step="1" aria-label="Sumar uno">${ICON.mas}</button></div>`;
}
function accionesHTML(p, compacta) {
  if (conTalle(p)) {
    return `<div class="prod-actions"><button type="button" class="btn btn--cta prod-add" data-quick="${p.id}" aria-label="Elegir talle de ${esc(p.nombre)}">${ICON.talle}<span class="prod-add__txt">Elegir talle</span></button></div>`;
  }
  if (compacta) {
    return `<div class="prod-actions"><button type="button" class="btn btn--cta prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICON.carrito}<span class="prod-add__txt">Agregar</span></button></div>`;
  }
  return `<div class="prod-actions">${stepperHTML(p.stock)}<button type="button" class="btn btn--cta prod-add prod-add--ico" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICON.carrito}<span class="prod-add__txt">Agregar</span></button></div><button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>`;
}
function cardHTML(p, { animar = true, compacta = false } = {}) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(48px)"' : '';
  return `<article class="card${compacta ? ' card--compacta' : ''}"${anim} data-id="${p.id}">
    <button type="button" class="card__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}"><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async">${badgesHTML(p)}<span class="card__ver">Ver detalle</span></button>
    <div class="card__info">
      <p class="card__cat">${esc(nombreDe(CATEGORIAS, p.cat))}</p>
      <h3 class="card__nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      ${precioHTML(p)}
      ${accionesHTML(p, compacta)}
    </div>
  </article>`;
}

let revealsListos = false;
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

function enfocables(cont) {
  return [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
}
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = enfocables(cont);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
let overlaysAbiertos = 0;
function bloquearScroll(on) {
  overlaysAbiertos = Math.max(0, overlaysAbiertos + (on ? 1 : -1));
  document.body.classList.toggle('no-scroll', overlaysAbiertos > 0);
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  const header = document.querySelector('.site-header');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 961px)');
  const close = () => {
    if (!nav.classList.contains('open')) return;
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); bloquearScroll(false);
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); bloquearScroll(true);
    nav.querySelector('a, .nav-cats__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function catActual() {
  if (PAGINA !== 'catalogo') return [];
  const v = new URLSearchParams(location.search).get('cat') || '';
  return v.split(',').filter(id => CATEGORIAS.some(c => c.id === id));
}
function initCatsMenu() {
  const box = document.querySelector('[data-nav-cats]');
  const panel = document.getElementById('catsPanel');
  if (!box || !panel) return;
  const btn = box.querySelector('.nav-cats__btn');
  const activas = catActual();
  panel.innerHTML = CATEGORIAS.map(c => {
    const n = Tienda.contar({ cat: c.id });
    const cur = activas.length === 1 && activas[0] === c.id ? ' aria-current="page"' : '';
    return `<a class="cat-link" href="${CATALOGO_URL}?cat=${c.id}"${cur}><img src="${c.img}" alt="" width="46" height="46"><span class="cat-link__nombre">${esc(c.nombre)}</span><span class="cat-link__n">${n}</span></a>`;
  }).join('') + `<a class="cat-link cat-link--todo" href="${CATALOGO_URL}">Ver todo el catálogo${ICON.flecha}</a>`;
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 961px)');
  let timer = 0;
  const abrir = () => { clearTimeout(timer); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(timer); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (box.classList.contains('open') ? cerrar() : abrir()));
  box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
  box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 120); } });
  box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
  document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero1__tinta'), { scaleY: 0, transformOrigin: '50% 0%', duration: 1.1, clearProps: 'transform' }, 0)
    .from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-kicker'), { y: 22, opacity: 0, duration: 1 }, 0.38)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.48)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-badge:not(.reg)'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7);
  const regs = hero.querySelectorAll('.reg--a, .reg--b');
  if (regs.length) tl.from(regs, { x: i => (i ? 12 : -12), y: i => (i ? 10 : -10), opacity: 0, duration: 1.3, ease: 'power3.out', clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const foto = document.querySelector('.taller__foto img');
  if (!foto) return;
  gsap.fromTo(foto, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.taller', start: 'top bottom', end: 'bottom top', scrub: true } });
}

function initRail() {
  const vp = document.querySelector('[data-rail]');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.querySelector('.rail-item')?.getBoundingClientRect().width || 280) + 16;
  const syncFlechas = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', syncFlechas, { passive: true });
  window.addEventListener('resize', syncFlechas, { passive: true });
  syncFlechas();

  let down = false, moved = false, startX = 0, startLeft = 0, pointerId = null, killClick = false;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    if (moved) { e.preventDefault(); vp.scrollLeft = startLeft - dx; }
  });
  const end = () => {
    if (!down) return;
    down = false;
    if (moved) {
      killClick = true;
      setTimeout(() => { killClick = false; }, 60);
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
    }
    vp.classList.remove('dragging');
    moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', end);
  vp.addEventListener('click', e => { if (killClick) { e.preventDefault(); e.stopPropagation(); killClick = false; } }, true);
}

let railIds = [];
function initHome() {
  if (PAGINA !== 'home') return;
  document.querySelectorAll('[data-cat-count]').forEach(el => { el.textContent = Tienda.contar({ cat: el.dataset.catCount }); });
  const total = Tienda.contar({});
  document.querySelectorAll('[data-total-productos]').forEach(el => { el.textContent = total; });

  const track = document.getElementById('railTrack');
  if (track) {
    const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
    railIds = items.map(p => p.id);
    track.innerHTML = items.map(p => `<div class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { animar: false, compacta: true })}</div>`).join('');
  }
  const grid = document.getElementById('prevGrid');
  if (grid) {
    const cuantos = MODELO === '2' ? 7 : 8;
    const { items } = Tienda.consultar({ filtros: { excluir: railIds }, orden: 'nuevos', limite: cuantos });
    let html = items.map(p => cardHTML(p)).join('');
    if (MODELO === '2') {
      html += `<a class="mosaico-cta" href="${CATALOGO_URL}" data-animate="subir" style="opacity:0;transform:translateY(48px)"><span class="mosaico-cta__n">${total}</span><span class="mosaico-cta__t">Ver todo el catálogo${ICON.flecha}</span></a>`;
    }
    grid.innerHTML = html;
  }
}

const QV = { p: null, talle: '', foto: 0, opener: null };
function qvHTML(p) {
  const fotos = [p.img, p.escena].filter(Boolean);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, orden: 'destacados', limite: 3 }).items;
  const tallesHTML = conTalle(p) ? `<div class="qv__grupo"><p class="qv__label" id="qvTalleLabel">Talle <span>${p.cat === 'infantil' ? '(años)' : ''}</span></p><div class="chips" id="qvTalles" role="group" aria-labelledby="qvTalleLabel">${p.talles.map(t => `<button type="button" class="chip" data-talle="${t}" aria-pressed="${QV.talle === t}">${t}</button>`).join('')}</div></div>` : '';
  const disenoHTML = p.personalizable ? `<div class="qv__diseno"><p><strong>¿Cómo nos mandás tu diseño?</strong> Después de comprar, nos escribís por WhatsApp con la imagen, el logo o la frase y te confirmamos cómo queda.</p><a class="btn btn--line" href="${wspHref(`¡Hola MS Estampadis! Quiero hacer «${p.nombre}» con mi diseño. ¿Me pasás info?`)}" target="_blank" rel="noopener">${ICON.wsp}Consultar mi diseño</a></div>` : '';
  return `<div class="qv__grid">
    <div class="qv__galeria">
      <div class="qv__foto"><img id="qvImg" src="${fotos[QV.foto] || p.img}" alt="${esc(p.alt)}" width="800" height="800"></div>
      ${fotos.length > 1 ? `<div class="qv__miniaturas">${fotos.map((f, i) => `<button type="button" class="qv__mini" data-qv-foto="${i}" aria-pressed="${i === QV.foto}" aria-label="Ver foto ${i + 1}"><img src="${f}" alt="" width="68" height="68"></button>`).join('')}</div>` : ''}
    </div>
    <div class="qv__info">
      <p class="qv__cat">${esc(nombreDe(CATEGORIAS, p.cat))}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <div class="qv__precio">${precioHTML(p)}</div>
      <p class="qv__desc">${esc(p.desc)}</p>
      ${tallesHTML}
      <div class="qv__grupo"><p class="qv__label">Cantidad</p>${stepperHTML(p.stock)}</div>
      <div class="qv__compra">
        <button type="button" class="btn btn--cta" data-qv-add>${ICON.carrito}Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-buy>Comprar ahora</button>
      </div>
      <p class="qv__stock">${p.stock <= 4 ? `Quedan ${p.stock} en stock.` : 'Hay stock.'} La entrega la coordinamos por WhatsApp.</p>
      ${disenoHTML}
    </div>
  </div>
  ${rel.length ? `<div class="qv__rel"><p class="qv__rel-t">También te puede interesar</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="rel" data-qv-rel="${r.id}"><img src="${r.img}" alt="" width="64" height="64"><span><span class="rel__n">${esc(r.nombre)}</span><span class="rel__p">${formatearPrecio(precioFinal(r))}</span></span></button>`).join('')}</div></div>` : ''}`;
}
function ldProducto(p) {
  let el = document.getElementById('ldProducto');
  if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = 'ldProducto'; document.head.appendChild(el); }
  const base = location.href.split(/[?#]/)[0].replace(/[^/]*$/, '');
  el.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, image: base + p.img,
    brand: { '@type': 'Brand', name: 'MS Estampadis' },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' } });
}
function renderQV() {
  const cont = document.getElementById('qvContenido');
  if (!cont || !QV.p) return;
  cont.innerHTML = qvHTML(QV.p);
}
function abrirQV(id, opener) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  const yaAbierto = !qv.hidden;
  QV.p = p; QV.talle = ''; QV.foto = 0;
  if (!yaAbierto) QV.opener = opener || document.activeElement;
  renderQV();
  ldProducto(p);
  if (!yaAbierto) {
    qv.hidden = false;
    bloquearScroll(true);
    requestAnimationFrame(() => requestAnimationFrame(() => qv.classList.add('abierto')));
  }
  const panel = qv.querySelector('.qv__panel');
  panel.scrollTop = 0;
  panel.focus({ preventScroll: true });
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.set('producto', p.id); window.history.replaceState(null, '', u);
  }
}
function cerrarQV() {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('abierto');
  setTimeout(() => { qv.hidden = true; }, reduceMotion ? 0 : 320);
  bloquearScroll(false);
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u);
  }
  QV.opener?.focus?.({ preventScroll: true });
}
function cantidadDe(cont) {
  const input = cont?.querySelector('[data-stepper] input');
  const v = parseInt(input?.value, 10);
  return Number.isFinite(v) && v > 0 ? v : 1;
}
function qvAgregar(comprar) {
  const p = QV.p;
  if (!p) return;
  if (conTalle(p) && !QV.talle) {
    const chips = document.getElementById('qvTalles');
    if (chips) {
      chips.classList.remove('sacudir'); void chips.offsetWidth; chips.classList.add('sacudir', 'falta');
      chips.querySelector('.chip')?.focus();
    }
    showToast('Elegí un talle para seguir.');
    return;
  }
  const qty = Math.min(cantidadDe(document.getElementById('qvContenido')), p.stock || 99);
  Cart.add(p, qty, QV.talle);
  if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
  else showToast(`Sumaste ${p.nombre}${QV.talle ? ` (talle ${QV.talle})` : ''} al carrito.`);
}
function initQV() {
  const qv = document.getElementById('qv');
  if (!qv) return;
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarQV(); return; }
    const chip = e.target.closest('[data-talle]');
    if (chip) {
      QV.talle = chip.dataset.talle;
      const chips = chip.parentElement;
      chips.classList.remove('falta');
      chips.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
      return;
    }
    const mini = e.target.closest('[data-qv-foto]');
    if (mini) {
      QV.foto = +mini.dataset.qvFoto;
      const fotos = [QV.p.img, QV.p.escena].filter(Boolean);
      document.getElementById('qvImg').src = fotos[QV.foto];
      qv.querySelectorAll('[data-qv-foto]').forEach(m => m.setAttribute('aria-pressed', String(m === mini)));
      return;
    }
    if (e.target.closest('[data-qv-add]')) { qvAgregar(false); return; }
    if (e.target.closest('[data-qv-buy]')) { qvAgregar(true); return; }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) abrirQV(rel.dataset.qvRel);
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarQV(); return; }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const slug = new URLSearchParams(location.search).get('producto');
  if (slug && getProducto(slug)) abrirQV(slug, document.getElementById('grid'));
}

let carritoOpener = null;
function lineaHTML(i, nueva) {
  const p = getProducto(i.id);
  if (!p) return '';
  return `<div class="linea${nueva ? ' entra' : ''}" data-linea="${i.id}" data-talle="${esc(i.talle || '')}">
    <img src="${p.img}" alt="" width="76" height="76">
    <div>
      <p class="linea__n">${esc(p.nombre)}</p>
      <p class="linea__v">${i.talle ? `Talle ${esc(i.talle)} · ` : ''}${formatearPrecio(precioFinal(p))} c/u</p>
      <div class="linea__acc">${stepperHTML(p.stock, i.qty)}<button type="button" class="linea__quitar" data-quitar aria-label="Quitar ${esc(p.nombre)}">${ICON.basura}</button></div>
    </div>
    <p class="linea__p">${formatearPrecio(precioFinal(p) * i.qty)}</p>
  </div>`;
}
let lineasPrevias = new Set();
function renderCarrito() {
  const lista = document.getElementById('cartLista');
  const pie = document.getElementById('cartPie');
  if (!lista || !pie) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  const n = items.reduce((s, i) => s + i.qty, 0);
  const cartN = document.getElementById('cartN');
  if (cartN) cartN.textContent = n ? `(${n})` : '';
  if (!items.length) {
    lista.innerHTML = `<div class="carrito-vacio">${ICON.reg}<p class="carrito-vacio__t">Tu carrito está vacío</p><p>Elegí una estampa de la tienda o mandanos tu diseño por WhatsApp.</p><a class="btn btn--dark" href="${CATALOGO_URL}">Ver el catálogo</a></div>`;
    pie.hidden = true;
    lineasPrevias = new Set();
    return;
  }
  pie.hidden = false;
  const claves = items.map(i => `${i.id}|${i.talle || ''}`);
  lista.innerHTML = items.map((i, k) => lineaHTML(i, !lineasPrevias.has(claves[k]))).join('');
  lineasPrevias = new Set(claves);
  document.getElementById('cartTotal').textContent = formatearPrecio(Cart.total());
  const resumen = items.map(i => { const p = getProducto(i.id); return `• ${i.qty} × ${p.nombre}${i.talle ? ` (talle ${i.talle})` : ''}`; }).join('\n');
  const wa = document.getElementById('cartWa');
  if (wa) wa.href = wspHref(`¡Hola MS Estampadis! Tengo este pedido en el carrito:\n${resumen}\nTotal: ${formatearPrecio(Cart.total())}\n¿Me ayudás con el diseño?`);
}
function abrirCarrito() {
  const d = document.getElementById('drawer');
  if (!d || !d.hidden) return;
  carritoOpener = document.activeElement;
  renderCarrito();
  d.hidden = false;
  bloquearScroll(true);
  requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('abierto')));
  d.querySelector('.drawer__panel').focus({ preventScroll: true });
}
function cerrarCarrito() {
  const d = document.getElementById('drawer');
  if (!d || d.hidden) return;
  d.classList.remove('abierto');
  setTimeout(() => { d.hidden = true; }, reduceMotion ? 0 : 400);
  bloquearScroll(false);
  carritoOpener?.focus?.({ preventScroll: true });
}
function initCarrito() {
  const d = document.getElementById('drawer');
  if (!d) return;
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', abrirCarrito));
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cart-cerrar]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea, talle = linea.dataset.talle || '';
    if (e.target.closest('[data-quitar]')) { Cart.remove(id, talle); return; }
    const step = e.target.closest('[data-step]');
    if (step) {
      const it = Cart.get().find(i => i.id === id && (i.talle || '') === talle);
      if (it) Cart.setQty(id, talle, it.qty + Number(step.dataset.step));
    }
  });
  d.addEventListener('change', e => {
    const input = e.target.closest('[data-stepper] input');
    const linea = e.target.closest('[data-linea]');
    if (input && linea) Cart.setQty(linea.dataset.linea, linea.dataset.talle || '', parseInt(input.value, 10) || 1);
  });
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarCarrito(); return; }
    atraparFoco(d.querySelector('.drawer__panel'), e);
  });
  document.getElementById('cartFinalizar')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderCarrito(); });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
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
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-stepper] [data-step]');
    if (step && !step.closest('#drawer')) {
      const input = step.parentElement.querySelector('input');
      const max = parseInt(input.max, 10) || 99;
      input.value = Math.max(1, Math.min(max, (parseInt(input.value, 10) || 1) + Number(step.dataset.step)));
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) { abrirQV(quick.dataset.quick, quick); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const qty = cantidadDe(add.closest('.card'));
      Cart.add(p, qty);
      add.closest('.card')?.querySelector('[data-stepper] input')?.setAttribute('value', '1');
      const input = add.closest('.card')?.querySelector('[data-stepper] input');
      if (input) input.value = 1;
      showToast(`Sumaste ${p.nombre} al carrito.`);
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const p = getProducto(buy.dataset.buy);
      if (!p) return;
      Cart.add(p, cantidadDe(buy.closest('.card')));
      abrirCarrito();
    }
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('[data-stepper] input');
    if (!input || input.closest('#drawer')) return;
    const max = parseInt(input.max, 10) || 99;
    input.value = Math.max(1, Math.min(max, parseInt(input.value, 10) || 1));
  });
  document.addEventListener('cart:updated', updateCartBadge);
}

function initGaleria() {
  const lb = document.getElementById('lb');
  const items = [...document.querySelectorAll('.foto-item')];
  if (!lb || !items.length) return;
  const img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCap');
  let i = 0, opener = null;
  const pintar = () => {
    const it = items[i];
    img.src = it.dataset.foto;
    img.alt = it.querySelector('img')?.alt || '';
    cap.textContent = it.dataset.cap || '';
  };
  const abrir = (k, from) => {
    i = k; opener = from; pintar();
    lb.hidden = false; bloquearScroll(true);
    requestAnimationFrame(() => requestAnimationFrame(() => lb.classList.add('abierto')));
    lb.querySelector('[data-lb-cerrar]').focus();
  };
  const cerrar = () => {
    if (lb.hidden) return;
    lb.classList.remove('abierto');
    setTimeout(() => { lb.hidden = true; }, reduceMotion ? 0 : 300);
    bloquearScroll(false);
    opener?.focus({ preventScroll: true });
  };
  const mover = d => { i = (i + d + items.length) % items.length; pintar(); };
  items.forEach((it, k) => it.addEventListener('click', () => abrir(k, it)));
  lb.addEventListener('click', e => {
    if (e.target.closest('[data-lb-cerrar]') || e.target === lb) cerrar();
    else if (e.target.closest('[data-lb-prev]')) mover(-1);
    else if (e.target.closest('[data-lb-next]')) mover(1);
  });
  lb.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'ArrowLeft') mover(-1);
    else if (e.key === 'ArrowRight') mover(1);
    else atraparFoco(lb, e);
  });
}

function initForm() {
  const form = document.getElementById('formContacto');
  if (!form) return;
  const tel = document.getElementById('fTel');
  if (typeof IMask !== 'undefined' && tel) IMask(tel, { mask: '+{54} 9 000 000-0000' });
  const marcar = (input, errId, ok) => {
    input.closest('.campo').classList.toggle('error', !ok);
    input.setAttribute('aria-invalid', String(!ok));
    if (!ok) input.setAttribute('aria-describedby', errId); else input.removeAttribute('aria-describedby');
    document.getElementById(errId).hidden = ok;
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = document.getElementById('fNombre');
    const okNombre = nombre.value.trim().length >= 2;
    const digitos = tel.value.replace(/\D/g, '');
    const okTel = digitos.length >= 10;
    marcar(nombre, 'fNombreErr', okNombre);
    marcar(tel, 'fTelErr', okTel);
    if (!okNombre) { nombre.focus(); return; }
    if (!okTel) { tel.focus(); return; }
    const btn = form.querySelector('[type="submit"]');
    const txt = btn.textContent;
    btn.disabled = true; btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false; btn.textContent = txt;
      form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

function initCatalogo() {
  if (PAGINA !== 'catalogo') return;
  const grid = document.getElementById('grid');
  const form = document.getElementById('filtros');
  if (!grid || !form) return;
  const buscar = document.getElementById('buscar');
  const ordenSel = document.getElementById('orden');
  const verMas = document.getElementById('verMas');
  const masInfo = document.getElementById('masInfo');
  const vacio = document.getElementById('vacio');
  const contador = document.getElementById('contador');
  const activos = document.getElementById('activos');
  const migaCat = document.getElementById('migaCat');
  const h1 = document.getElementById('h1');
  const nFiltros = document.getElementById('nFiltros');

  const qs = new URLSearchParams(location.search);
  const valida = (v, arr) => (v || '').split(',').filter(id => arr.some(x => x.id === id));
  const estado = {
    cat: valida(qs.get('cat'), CATEGORIAS),
    color: valida(qs.get('color'), COLORES),
    precio: PRECIOS.some(x => x.id === qs.get('precio')) ? qs.get('precio') : '',
    tu: qs.get('tu') === '1',
    oferta: qs.get('oferta') === '1',
    q: (qs.get('q') || '').slice(0, 60),
    orden: ORDENES.some(o => o.id === qs.get('orden')) ? qs.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;

  ordenSel.innerHTML = ORDENES.map(o => `<option value="${o.id}">${o.nombre}</option>`).join('');
  ordenSel.value = estado.orden;
  buscar.value = estado.q;

  const filtrosDe = (sin = {}) => {
    const r = PRECIOS.find(x => x.id === estado.precio);
    return {
      cat: sin.cat ? [] : estado.cat,
      color: sin.color ? [] : estado.color,
      precioMin: sin.precio ? null : r?.min ?? null,
      precioMax: sin.precio ? null : r?.max ?? null,
      tu: sin.tu ? false : estado.tu,
      oferta: sin.oferta ? false : estado.oferta,
      q: estado.q,
    };
  };

  function pintarFiltros() {
    document.getElementById('fCat').innerHTML = CATEGORIAS.map(c => `<label class="opcion"><input type="checkbox" data-f="cat" value="${c.id}"${estado.cat.includes(c.id) ? ' checked' : ''}><span>${esc(c.nombre)}</span><span class="opcion__n" data-n-cat="${c.id}"></span></label>`).join('');
    document.getElementById('fColor').innerHTML = COLORES.map(c => `<label class="chip-color"><input type="checkbox" data-f="color" value="${c.id}"${estado.color.includes(c.id) ? ' checked' : ''} aria-label="${c.nombre}"><span class="chip-color__dot" style="background:${c.hex}"></span>${c.nombre}</label>`).join('');
    document.getElementById('fPrecio').innerHTML = [{ id: '', nombre: 'Todos los precios' }, ...PRECIOS].map(r => `<label class="opcion"><input type="radio" name="precio" value="${r.id}"${estado.precio === r.id ? ' checked' : ''}><span>${r.nombre}</span></label>`).join('');
    form.querySelector('[data-f="tu"]').checked = estado.tu;
    form.querySelector('[data-f="oferta"]').checked = estado.oferta;
  }
  function pintarConteos() {
    CATEGORIAS.forEach(c => {
      const el = form.querySelector(`[data-n-cat="${c.id}"]`);
      if (el) el.textContent = Tienda.contar({ ...filtrosDe({ cat: true }), cat: [c.id] });
    });
    const nTu = form.querySelector('[data-n-tu]');
    if (nTu) nTu.textContent = Tienda.contar({ ...filtrosDe({ tu: true }), tu: true });
    const nOf = form.querySelector('[data-n-oferta]');
    if (nOf) nOf.textContent = Tienda.contar({ ...filtrosDe({ oferta: true }), oferta: true });
  }
  function pintarCabecera(total) {
    const cats = estado.cat.map(id => nombreDe(CATEGORIAS, id));
    const una = estado.cat.length === 1;
    h1.textContent = una ? cats[0] : 'Catálogo de estampados';
    migaCat.hidden = !una;
    migaCat.textContent = una ? cats[0] : '';
    document.title = `${una ? cats[0] : 'Catálogo de estampados'} — MS Estampadis`;
    contador.innerHTML = total === 1 ? '<strong>1</strong> producto' : `<strong>${total}</strong> productos`;
    document.querySelectorAll('[data-n-total]').forEach(el => { el.textContent = total; });
    document.querySelectorAll('.cat-link').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (una && id === estado.cat[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  function pintarActivos() {
    const chips = [];
    estado.cat.forEach(id => chips.push({ t: nombreDe(CATEGORIAS, id), quitar: () => { estado.cat = estado.cat.filter(x => x !== id); } }));
    estado.color.forEach(id => chips.push({ t: nombreDe(COLORES, id), quitar: () => { estado.color = estado.color.filter(x => x !== id); } }));
    if (estado.precio) chips.push({ t: nombreDe(PRECIOS, estado.precio), quitar: () => { estado.precio = ''; } });
    if (estado.tu) chips.push({ t: 'Con tu diseño', quitar: () => { estado.tu = false; } });
    if (estado.oferta) chips.push({ t: 'En oferta', quitar: () => { estado.oferta = false; } });
    if (estado.q) chips.push({ t: `«${estado.q}»`, quitar: () => { estado.q = ''; buscar.value = ''; } });
    activos.innerHTML = chips.map((c, i) => `<button type="button" class="activo" data-activo="${i}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)}${ICON.cerrar}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="activo activo--limpiar" data-limpiar>Limpiar filtros</button>' : '');
    activos._chips = chips;
    const n = chips.length - (estado.q ? 1 : 0);
    nFiltros.hidden = n === 0;
    nFiltros.textContent = n;
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'color', 'precio', 'tu', 'oferta', 'q', 'orden'].forEach(k => u.searchParams.delete(k));
    if (estado.cat.length) u.searchParams.set('cat', estado.cat.join(','));
    if (estado.color.length) u.searchParams.set('color', estado.color.join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.tu) u.searchParams.set('tu', '1');
    if (estado.oferta) u.searchParams.set('oferta', '1');
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  function pintar(reiniciar) {
    const filtros = filtrosDe();
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const pagina = Tienda.consultar({ filtros, orden: estado.orden, cursor, limite: POR_PAGINA });
    cursor = pagina.cursor;
    grid.insertAdjacentHTML('beforeend', pagina.items.map(p => cardHTML(p)).join(''));
    mostrados += pagina.items.length;
    const total = Tienda.contar(filtros);
    vacio.hidden = total > 0;
    verMas.hidden = !cursor;
    masInfo.textContent = total ? `Estás viendo ${mostrados} de ${total}` : '';
    if (reiniciar) pintarCabecera(total);
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  function aplicar() {
    pintarActivos();
    pintarConteos();
    syncURL();
    pintar(true);
  }

  pintarFiltros();
  pintarActivos();
  pintarConteos();
  syncURL();
  pintar(true);

  form.addEventListener('change', e => {
    const t = e.target;
    if (t.dataset.f === 'cat') estado.cat = [...form.querySelectorAll('[data-f="cat"]:checked')].map(i => i.value);
    else if (t.dataset.f === 'color') estado.color = [...form.querySelectorAll('[data-f="color"]:checked')].map(i => i.value);
    else if (t.name === 'precio') estado.precio = t.value;
    else if (t.dataset.f === 'tu') estado.tu = t.checked;
    else if (t.dataset.f === 'oferta') estado.oferta = t.checked;
    else return;
    aplicar();
  });
  ordenSel.addEventListener('change', () => { estado.orden = ordenSel.value; aplicar(); });
  let tq = 0;
  buscar.addEventListener('input', () => {
    clearTimeout(tq);
    tq = setTimeout(() => { estado.q = buscar.value.trim().slice(0, 60); aplicar(); }, 260);
  });
  buscar.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); clearTimeout(tq); estado.q = buscar.value.trim().slice(0, 60); aplicar(); } });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => {
    Object.assign(estado, { cat: [], color: [], precio: '', tu: false, oferta: false, q: '' });
    buscar.value = '';
    pintarFiltros();
    aplicar();
  };
  document.getElementById('limpiar')?.addEventListener('click', limpiar);
  document.addEventListener('click', e => {
    if (e.target.closest('[data-limpiar]')) { limpiar(); return; }
    const chip = e.target.closest('[data-activo]');
    if (chip && activos._chips) {
      activos._chips[+chip.dataset.activo]?.quitar();
      pintarFiltros();
      aplicar();
    }
  });
  if (location.hash === '#buscar') setTimeout(() => buscar.focus({ preventScroll: true }), 300);
  initFiltrosDrawer(form);
}

function initFiltrosDrawer(form) {
  const abrirBtn = document.getElementById('abrirFiltros');
  if (!abrirBtn) return;
  const fondo = document.createElement('div');
  fondo.className = 'filtros-fondo';
  document.body.appendChild(fondo);
  const mq = window.matchMedia('(max-width: 900px)');
  const abrir = () => {
    form.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
    form.classList.add('abierto'); fondo.classList.add('abierto');
    abrirBtn.setAttribute('aria-expanded', 'true'); bloquearScroll(true);
    form.querySelector('input')?.focus({ preventScroll: true });
  };
  const cerrar = () => {
    if (!form.classList.contains('abierto')) return;
    form.classList.remove('abierto'); fondo.classList.remove('abierto');
    abrirBtn.setAttribute('aria-expanded', 'false'); bloquearScroll(false);
    abrirBtn.focus({ preventScroll: true });
  };
  abrirBtn.addEventListener('click', abrir);
  fondo.addEventListener('click', cerrar);
  form.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrar));
  form.addEventListener('keydown', e => {
    if (!form.classList.contains('abierto')) return;
    if (e.key === 'Escape') cerrar();
    else atraparFoco(form, e);
  });
  mq.addEventListener('change', () => { if (!mq.matches) cerrar(); });
}

function syncModelosLink() {
  if (PAGINA !== 'catalogo') return;
  const q = location.search;
  document.querySelectorAll('.gw-modelos__btn').forEach(a => {
    const base = a.getAttribute('href').split('?')[0];
    a.setAttribute('href', base + q);
  });
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

initModelBarScroll();
syncModelosLink();
initCatsMenu();
initNav();
initHome();
initCatalogo();
initReveals();
initHeroMotion();
initParallax();
initRail();
initQV();
initCarrito();
initFloats();
initAcciones();
initGaleria();
initForm();
updateCartBadge();
