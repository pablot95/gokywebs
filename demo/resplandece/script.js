const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492901611396';
const ZONA = 'America/Argentina/Ushuaia';
const POR_PAGINA = 16;
const DIAS_MIN = 21;
const DIAS_MAX = 28;
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
  { id: 'mates', nombre: 'Mates', bajada: 'Algarrobo revestido en resina', img: 'images/esencia-verde.webp',
    texto: 'Mates de algarrobo revestidos en resina. Cada uno tiene su veta y su color: no hay dos iguales.' },
  { id: 'sets', nombre: 'Sets', bajada: 'Mate y azucarera a juego', img: 'images/set-grafito.webp',
    texto: 'Mate y azucarera con la misma madera y la misma resina, para que la mesa combine.' },
  { id: 'accesorios', nombre: 'Accesorios', bajada: 'Azucareras y yerberas', img: 'images/p-azucarera-grafito.webp',
    texto: 'Azucareras y yerberas de algarrobo para completar la mesa del mate.' },
];
const RESINAS = [
  { id: 'verde', nombre: 'Verde', img: 'images/r-verde.webp' },
  { id: 'ambar', nombre: 'Ámbar', img: 'images/r-ambar.webp' },
  { id: 'azul', nombre: 'Azul', img: 'images/r-azul.webp' },
  { id: 'negro', nombre: 'Negro', img: 'images/r-negro.webp' },
  { id: 'perla', nombre: 'Perla', img: 'images/r-perla.webp' },
  { id: 'rubi', nombre: 'Rubí', img: 'images/r-rubi.webp' },
  { id: 'grafito', nombre: 'Grafito', img: 'images/r-grafito.webp' },
];
const FORMAS = [{ id: 'redondo', nombre: 'Redondo' }, { id: 'cintura', nombre: 'Con cintura' }];
const BOCAS = [{ id: 'virola', nombre: 'Virola de acero' }, { id: 'madera', nombre: 'Borde de madera' }];
const PRECIOS = [
  { id: 'hasta40', nombre: 'Hasta $40.000', min: null, max: 40000 },
  { id: '40a50', nombre: '$40.000 a $50.000', min: 40001, max: 50000 },
  { id: 'mas50', nombre: 'Más de $50.000', min: 50001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'nuevos', nombre: 'Recién terminados' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS_CAT = {
  mates: 'mate mates algarrobo resina epoxi calabaza',
  sets: 'set sets juego combo regalo azucarera mate',
  accesorios: 'accesorio accesorios azucarera yerbera caja',
};

const ESC_MESA = 'images/mesa-mates.webp';

const COLECCION = [
  { id: 'esencia-verde', nombre: 'Mate Esencia Verde', cat: 'mates', precio: 42000, descuento: 0, stock: 3, alta: 10, rango: 1,
    resina: 'verde', forma: 'redondo', boca: 'virola', img: 'images/p-esencia-verde.webp', escena: 'images/esencia-verde.webp',
    alt: 'Mate redondo de algarrobo con un río de resina verde esmeralda y virola de acero',
    desc: 'Algarrobo de veta marcada con un río de resina verde que lo recorre de arriba abajo. Boca con virola de acero.' },
  { id: 'flujo-ambar', nombre: 'Mate Flujo Ámbar', cat: 'mates', precio: 42000, descuento: 0, stock: 2, alta: 9, rango: 2,
    resina: 'ambar', forma: 'cintura', boca: 'virola', img: 'images/p-flujo-ambar.webp', escena: 'images/flujo-ambar.webp',
    alt: 'Mate con cintura de algarrobo y resina ámbar mezclada con la veta, con virola de acero',
    desc: 'La resina ámbar se mezcla con la veta como si fuera parte de la madera. Forma con cintura y virola de acero.' },
  { id: 'set-grafito', nombre: 'Set Mate y Azucarera Grafito', cat: 'sets', precio: 78000, descuento: 0, stock: 2, alta: 8, rango: 3,
    resina: 'grafito', forma: 'cintura', boca: 'madera', img: 'images/p-set-grafito.webp', escena: 'images/set-grafito.webp',
    alt: 'Mate y azucarera con tapa de algarrobo y resina gris grafito sobre una mesa de madera',
    desc: 'Mate y azucarera de algarrobo con resina gris grafito, hechos a juego. La azucarera lleva tapa de madera.' },
  { id: 'oceano', nombre: 'Mate Océano', cat: 'mates', precio: 42000, descuento: 0, stock: 3, alta: 7, rango: 4,
    resina: 'azul', forma: 'cintura', boca: 'virola', img: 'images/p-oceano.webp', escena: 'images/oceano.webp',
    alt: 'Mate con cintura de algarrobo cruzado por una veta de resina celeste, junto a un termo verde',
    desc: 'Una veta de resina celeste grisácea cruza el algarrobo como una ola. Virola de acero en la boca.' },
  { id: 'noche-dorada', nombre: 'Mate Noche Dorada', cat: 'mates', precio: 48000, descuento: 0, stock: 1, alta: 14, tag: 'Nuevo',
    resina: 'negro', forma: 'redondo', boca: 'madera', img: 'images/p-noche-dorada.webp', escena: ESC_MESA,
    alt: 'Mate redondo mitad algarrobo y mitad resina negra con hojuelas doradas',
    desc: 'Mitad algarrobo, mitad resina negra con hojuelas doradas atrapadas adentro. Borde de madera.' },
  { id: 'ola', nombre: 'Mate Ola', cat: 'mates', precio: 46000, descuento: 0, stock: 2, alta: 13,
    resina: 'azul', forma: 'redondo', boca: 'madera', img: 'images/p-ola.webp', escena: ESC_MESA,
    alt: 'Mate redondo de algarrobo con resina azul y turquesa arremolinada en la base',
    desc: 'Resina en azules y turquesas que se arremolina en la base del mate. Borde de madera.' },
  { id: 'perla', nombre: 'Mate Perla', cat: 'mates', precio: 44000, descuento: 0, stock: 2, alta: 12,
    resina: 'perla', forma: 'redondo', boca: 'madera', img: 'images/p-perla.webp', escena: ESC_MESA,
    alt: 'Mate redondo de algarrobo con resina blanca perlada',
    desc: 'Resina blanca perlada con reflejos que cambian con la luz, contra la veta oscura del algarrobo.' },
  { id: 'rubi', nombre: 'Mate Rubí', cat: 'mates', precio: 44000, descuento: 0, stock: 1, alta: 11,
    resina: 'rubi', forma: 'redondo', boca: 'madera', img: 'images/p-rubi.webp', escena: ESC_MESA,
    alt: 'Mate redondo de algarrobo con resina roja translúcida',
    desc: 'Resina roja translúcida que muestra la profundidad del color a contraluz. Borde de madera.' },
  { id: 'esmeralda', nombre: 'Mate Esmeralda', cat: 'mates', precio: 44000, descuento: 0, stock: 2, alta: 6,
    resina: 'verde', forma: 'redondo', boca: 'madera', img: 'images/p-esmeralda.webp', escena: ESC_MESA,
    alt: 'Mate redondo de algarrobo envuelto a medias en resina verde intensa',
    desc: 'Resina verde intensa que envuelve medio mate y se funde con la veta. Borde de madera.' },
  { id: 'noche', nombre: 'Mate Noche', cat: 'mates', precio: 40000, descuento: 10, stock: 3, alta: 5,
    resina: 'negro', forma: 'cintura', boca: 'virola', img: 'images/p-noche.webp', escena: 'images/portada-noche.webp',
    alt: 'Mate con cintura revestido en resina negra brillante con virola de acero',
    desc: 'Revestido por completo en resina negra brillante, con virola de acero. El más sobrio de la colección.' },
  { id: 'mate-grafito', nombre: 'Mate Grafito', cat: 'mates', precio: 42000, descuento: 0, stock: 2, alta: 4,
    resina: 'grafito', forma: 'cintura', boca: 'madera', img: 'images/p-mate-grafito.webp', escena: 'images/set-grafito.webp',
    alt: 'Mate de algarrobo con la base bañada en resina gris grafito',
    desc: 'Algarrobo con la base bañada en resina gris grafito de vetas suaves. Es el mate del set, también por separado.' },
  { id: 'azucarera-grafito', nombre: 'Azucarera Grafito', cat: 'accesorios', precio: 36000, descuento: 0, stock: 2, alta: 3,
    resina: 'grafito', img: 'images/p-azucarera-grafito.webp', escena: 'images/set-grafito.webp',
    alt: 'Azucarera de algarrobo y resina gris con tapa de madera',
    desc: 'Azucarera de algarrobo y resina gris con tapa de madera. Hace juego con el Mate Grafito.' },
  { id: 'yerbera', nombre: 'Yerbera de algarrobo', cat: 'accesorios', precio: 32000, descuento: 0, stock: 3, alta: 2,
    img: 'images/p-yerbera.webp', escena: ESC_MESA,
    alt: 'Caja yerbera de algarrobo con tapa sobre una mesa de madera',
    desc: 'Caja de algarrobo con tapa para guardar la yerba junto al mate.' },
  { id: 'mate-bosque', nombre: 'Mate Bosque', cat: 'mates', precio: 44000, descuento: 0, stock: 0, alta: 15, visible: false,
    resina: 'verde', forma: 'redondo', boca: 'madera', img: 'images/p-esmeralda.webp', escena: ESC_MESA,
    alt: 'Mate de algarrobo y resina verde', desc: 'Próximamente.' },
];

function crearTienda(coleccion, { tope = 100, extra = () => '' } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.cat, p.desc, nombreDe(RESINAS, p.resina), p.resina ? 'resina' : '',
    nombreDe(FORMAS, p.forma), nombreDe(BOCAS, p.boca), extra(p),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));

  function coincide(p, f) {
    const cat = lista(f.cat), resina = lista(f.resina), forma = lista(f.forma), boca = lista(f.boca), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (resina.length && !resina.includes(p.resina)) return false;
    if (forma.length && !forma.includes(p.forma)) return false;
    if (boca.length && !boca.includes(p.boca)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado === true && !p.rango) return false;
    if (f.destacado === false && p.rango) return false;
    if (f.precioMin != null && final(p) < f.precioMin) return false;
    if (f.precioMax != null && final(p) > f.precioMax) return false;
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const texto = indice.get(p.id);
      if (!palabras.every(w => texto.includes(w))) return false;
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
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
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

const Tienda = crearTienda(COLECCION, { tope: 100, extra: p => ETIQUETAS_CAT[p.cat] || '' });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => Tienda.obtener(id);
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

function calcularPago(total) {
  const t = Math.max(0, Math.round(Number(total) || 0));
  const sena = Math.round(t / 2);
  return { total: t, sena, saldo: t - sena };
}
function fechaEntrega(desde = new Date()) {
  const a = new Date(desde.getTime() + DIAS_MIN * 864e5);
  const b = new Date(desde.getTime() + DIAS_MAX * 864e5);
  const partes = d => {
    const p = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', timeZone: ZONA }).formatToParts(d);
    return { dia: p.find(x => x.type === 'day')?.value, mes: p.find(x => x.type === 'month')?.value };
  };
  const pa = partes(a), pb = partes(b);
  const texto = pa.mes === pb.mes ? `entre el ${pa.dia} y el ${pb.dia} de ${pb.mes}` : `entre el ${pa.dia} de ${pa.mes} y el ${pb.dia} de ${pb.mes}`;
  return { desde: a, hasta: b, texto };
}

const Cart = {
  KEY: 'resplandece_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
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

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6" stroke-linecap="round"/></svg>',
  calendario: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  hoja: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function metaDe(p) {
  if (p.cat === 'mates') return `Resina ${nombreDe(RESINAS, p.resina).toLowerCase()} · ${nombreDe(FORMAS, p.forma).toLowerCase()}`;
  if (p.cat === 'sets') return 'Mate + azucarera';
  return p.resina ? `Accesorio · resina ${nombreDe(RESINAS, p.resina).toLowerCase()}` : 'Accesorio · algarrobo';
}
function puntoResina(p) {
  const r = RESINAS.find(x => x.id === p.resina);
  return r ? `<span class="punto-resina" style="background-image:url('${r.img}')" aria-hidden="true"></span>` : '<span class="punto-resina punto-resina--madera" aria-hidden="true"></span>';
}
function precioHTML(p) {
  return `<p class="precio"><span class="precio__final">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.tag) b.push(`<span class="badge">${esc(p.tag)}</span>`);
  else if (p.stock === 1) b.push('<span class="badge badge--claro">Queda 1</span>');
  return b.length ? `<span class="prod__badges">${b.join('')}</span>` : '';
}
const urlProducto = p => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}`;
function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar uno"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar uno"${valor >= max ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}

function cardHTML(p, { variante = MODELO === '2' ? 'foto' : 'clasica', grande = false, compacta = false } = {}) {
  const nombre = esc(p.nombre);
  const img = `<img src="${p.img}" alt="${esc(p.alt)}" width="720" height="900" decoding="async">`;
  if (variante === 'foto') {
    return `<article class="prod prod--foto${grande ? ' prod--grande' : ''}">
      <a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" aria-label="Ver detalle: ${nombre}">${img}${badgesHTML(p)}</a>
      <div class="prod__info">
        <p class="prod__meta">${puntoResina(p)}${esc(metaDe(p))}</p>
        <h3 class="prod__nombre">${nombre}</h3>
        ${precioHTML(p)}
      </div>
      <button type="button" class="prod-add prod-add--redondo" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}">${ICON.carritoMas}</button>
    </article>`;
  }
  if (compacta) {
    return `<article class="prod prod--compacta">
      <a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true">${img}${badgesHTML(p)}</a>
      <div class="prod__body">
        <p class="prod__meta">${puntoResina(p)}${esc(metaDe(p))}</p>
        <h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
        <div class="prod__fila">${precioHTML(p)}<button type="button" class="prod-add prod-add--icono" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}">${ICON.carritoMas}</button></div>
      </div>
    </article>`;
  }
  return `<article class="prod">
    <a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true">${img}${badgesHTML(p)}</a>
    <div class="prod__body">
      <p class="prod__meta">${puntoResina(p)}${esc(metaDe(p))}</p>
      <h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      ${precioHTML(p)}
      <div class="prod__acciones">${stepperHTML(p.stock)}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span>${ICON.carritoMas}</button></div>
      <button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>
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
const refrescarTriggers = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

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

const Capas = {
  abiertas: [],
  abrir(capa) { this.abiertas.push(capa); document.body.classList.add('no-scroll'); },
  cerrar(capa) { this.abiertas = this.abiertas.filter(c => c !== capa); if (!this.abiertas.length && !document.querySelector('.main-nav.open')) document.body.classList.remove('no-scroll'); },
};
function enfocables(cont) {
  return [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(el => el.getClientRects().length);
}
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = enfocables(cont);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 981px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!Capas.abiertas.length) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button.nav-cats__btn')?.focus();
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

function initCatsMenu() {
  const params = new URLSearchParams(location.search);
  const catActual = PAGINA === 'catalogo' ? params.get('cat') : null;
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 981px)');
  document.querySelectorAll('[data-nav-cats]').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    const panel = box.querySelector('.nav-cats__panel');
    if (!btn || !panel) return;
    panel.innerHTML = CATEGORIAS.map(c => `
      <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
        <img src="${c.img}" alt="" width="48" height="48" decoding="async">
        <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
        <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
      </a>`).join('')
      + `<p class="cats-resinas__titulo">Por color de resina</p><div class="cats-resinas">${RESINAS.map(r => `<a href="${CATALOGO_URL}?resina=${r.id}" aria-label="Resina ${esc(r.nombre)}"><span class="punto-resina" style="background-image:url('${r.img}')" aria-hidden="true"></span>${esc(r.nombre)}</a>`).join('')}</div>`
      + `<a class="cats-todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a>`;
    let timer = 0;
    const abrir = () => { clearTimeout(timer); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(timer); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 140); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
  });
}

function initResinas() {
  document.querySelectorAll('[data-resinas]').forEach(ul => {
    ul.innerHTML = RESINAS.map(r => {
      const n = Tienda.contar({ resina: r.id });
      return `<li data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)">
        <a class="resina" href="${CATALOGO_URL}?resina=${r.id}">
          <span class="resina__muestra"><img src="${r.img}" alt="" width="240" height="240" decoding="async"></span>
          <span class="resina__nombre">${esc(r.nombre)}</span>
          <span class="resina__n">${n} ${n === 1 ? 'modelo' : 'modelos'}</span>
        </a>
      </li>`;
    }).join('');
  });
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.catN });
    el.textContent = `${n} ${n === 1 ? 'modelo' : 'modelos'}`;
  });
}

function initEntrega() {
  const pintar = () => {
    const f = fechaEntrega();
    document.querySelectorAll('[data-eta]').forEach(el => { el.textContent = f.texto; });
  };
  pintar();
  window.setInterval(pintar, 3600000);
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-trust li, .hero-nota'), { y: 16, opacity: 0, duration: 1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const sec = el.closest('section') || el;
    gsap.to(el, { yPercent: Number(el.dataset.parallax) || 6, ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
  });
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
      trigger: el, start: 'top 85%', end: 'bottom 55%', scrub: 0.4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

function initRail() {
  const vp = document.querySelector('[data-rail]');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  let down = false, moved = false, startX = 0, startLeft = 0, pointerId = null;
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
    if (moved) { vp.scrollLeft = startLeft - dx; e.preventDefault(); }
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
    if (moved) requestAnimationFrame(() => vp.classList.remove('dragging'));
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  const paso = () => (track.querySelector('li')?.getBoundingClientRect().width || 280) + 20;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  const sync = () => {
    if (prev) prev.disabled = vp.scrollLeft <= 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initHome() {
  if (PAGINA !== 'home') return;
  const destacados = document.getElementById('gridDestacados');
  if (destacados) {
    const items = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 4 }).items;
    destacados.innerHTML = items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p, { variante: 'clasica', compacta: true })}</li>`).join('');
  }
  const mas = document.getElementById('gridMasModelos');
  if (mas) {
    const items = Tienda.consultar({ filtros: { destacado: false }, orden: 'nuevos', limite: 8 }).items;
    mas.innerHTML = items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p, { variante: 'clasica', compacta: true })}</li>`).join('');
  }
  const mosaico = document.getElementById('mosaico');
  const rail = document.getElementById('railNuevos');
  if (mosaico) {
    const pagina = Tienda.consultar({ orden: 'destacados', limite: 7 });
    mosaico.innerHTML = pagina.items.map((p, k) => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p, { variante: 'foto', grande: k === 0 })}</li>`).join('')
      + `<li data-animate="subir" style="opacity:0;transform:translateY(40px)"><a class="mosaico-cta" href="${CATALOGO_URL}"><span class="mosaico-cta__muestras" aria-hidden="true">${RESINAS.slice(0, 5).map(r => `<span class="punto-resina" style="background-image:url('${r.img}')"></span>`).join('')}</span><strong>Todos los modelos, con filtro por color de resina</strong><span class="mosaico-cta__link">Ver el catálogo ${ICON.flecha}</span></a></li>`;
    if (rail) {
      const siguiente = Tienda.consultar({ orden: 'destacados', cursor: pagina.cursor, limite: 8 });
      rail.innerHTML = siguiente.items.map(p => `<li data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { variante: 'foto' })}</li>`).join('');
    }
  }
}

const QV = { p: null, foto: 0, opener: null };
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  if (rel.length < 3) rel.push(...Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, orden: 'destacados', limite: 3 - rel.length }).items);
  const fotos = [{ src: p.img, alt: p.alt }, { src: p.escena, alt: `En la mesa: ${p.alt}` }];
  const pago = calcularPago(precioFinal(p));
  const msg = `Hola Resplandece! Quiero encargar el ${p.nombre} (${formatearPrecio(precioFinal(p))}). ¿Está disponible?`;
  const specs = [['Madera', 'Algarrobo']];
  if (p.resina) specs.push(['Resina', nombreDe(RESINAS, p.resina)]);
  if (p.forma) specs.push(['Forma', nombreDe(FORMAS, p.forma)]);
  if (p.boca) specs.push(['Boca', nombreDe(BOCAS, p.boca)]);
  specs.push(['Disponibles', p.stock === 1 ? 'Queda 1' : `${p.stock} en stock`]);
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal${QV.foto ? ' es-escena' : ''}"><img src="${fotos[QV.foto].src}" alt="${esc(fotos[QV.foto].alt)}" width="720" height="900"></div>
        <div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver la foto en la mesa' : 'Ver la foto del producto'}"><img src="${f.src}" alt="" width="64" height="64"></button>`).join('')}</div>
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(cat?.nombre || '')}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p)}
        <p class="qv__desc">${esc(p.desc)}</p>
        <dl class="qv__specs">${specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${k === 'Resina' ? puntoResina(p) : ''}${esc(v)}</dd></div>`).join('')}</dl>
        <div class="qv__pago">
          <p class="qv__pago-fila"><span>Para encargarlo (50%)</span><strong>${formatearPrecio(pago.sena)}</strong></p>
          <p class="qv__pago-fila"><span>Al recibirlo (50%)</span><strong>${formatearPrecio(pago.saldo)}</strong></p>
          <p class="qv__eta">${ICON.calendario}<span>Los pedidos tardan de 3 a 4 semanas. Si lo encargás hoy, estaría listo <strong data-eta>${esc(fechaEntrega().texto)}</strong>.</span></p>
        </div>
        <div class="qv__compra">
          ${stepperHTML(p.stock)}
          <button type="button" class="btn btn--dark" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
        </div>
        <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a>
        ${rel.length ? `<div class="qv__rel"><h3>También te puede gustar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span class="qv__rel-foto"><img src="${r.img}" alt="" width="720" height="900"></span><span>${esc(r.nombre)}</span><span class="precio__final">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, category: cat?.nombre, material: 'Algarrobo y resina',
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function abrirQV(id, opener) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p; QV.foto = 0;
  if (!yaAbierto) QV.opener = opener || document.activeElement;
  renderQV();
  modal.querySelector('.qv__panel')?.scrollTo(0, 0);
  if (!yaAbierto) {
    modal.hidden = false;
    Capas.abrir(modal);
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.set('producto', p.id); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
}
function cerrarQV() {
  const modal = document.getElementById('quickView');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 320);
  Capas.cerrar(modal);
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  QV.opener?.focus?.();
}
function initQV() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) { QV.foto = Number(foto.dataset.qvFoto); renderQV(); return; }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty);
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${p.nombre} al carrito.`);
    }
  });
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarQV(); }
    atraparFoco(modal, e);
  });
}

function lineaHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  return `<li class="linea" data-linea="${p.id}">
    <img src="${p.img}" alt="" width="72" height="90">
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta">${formatearPrecio(precioFinal(p))} c/u</p>
      ${stepperHTML(p.stock, i.qty)}
    </div>
    <div class="linea__lado"><span>${formatearPrecio(precioFinal(p) * i.qty)}</span><button type="button" class="linea__quitar" data-quitar>Quitar</button></div>
  </li>`;
}
function textoPedido(lineas, total) {
  const pago = calcularPago(total);
  return ['Hola Resplandece! Quiero hacer este pedido:', ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${i.qty} × ${p.nombre}: ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }), `Total: ${formatearPrecio(pago.total)}`, `Para encargarlo (50%): ${formatearPrecio(pago.sena)}`, `Al recibirlo (50%): ${formatearPrecio(pago.saldo)}`].join('\n');
}
function renderCarrito() {
  const items = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!items || !foot) return;
  const lineas = Cart.get().filter(i => getProducto(i.id));
  if (!lineas.length) {
    items.innerHTML = `<div class="drawer__vacio">${ICON.hoja}<p>Tu carrito está vacío. Cada mate es único: elegí el tuyo por color de resina.</p><a class="btn btn--dark" href="${CATALOGO_URL}">Ver los modelos ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  const total = Cart.total();
  const pago = calcularPago(total);
  document.getElementById('cartTotal').textContent = formatearPrecio(pago.total);
  const sena = document.getElementById('cartSena');
  const saldo = document.getElementById('cartSaldo');
  if (sena) sena.textContent = formatearPrecio(pago.sena);
  if (saldo) saldo.textContent = formatearPrecio(pago.saldo);
  const wsp = document.getElementById('cartWsp');
  if (wsp) wsp.href = wspHref(textoPedido(lineas, total));
}
let cartOpener = null;
function abrirCarrito() {
  const d = document.getElementById('cartDrawer');
  if (!d || !d.hidden) return;
  cartOpener = document.activeElement;
  renderCarrito();
  d.hidden = false;
  Capas.abrir(d);
  requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('open')));
  setTimeout(() => d.querySelector('.drawer__head .icon-btn')?.focus(), 60);
}
function cerrarCarrito() {
  const d = document.getElementById('cartDrawer');
  if (!d || d.hidden) return;
  d.classList.remove('open');
  setTimeout(() => { d.hidden = true; }, reduceMotion ? 0 : 380);
  Capas.cerrar(d);
  cartOpener?.focus?.();
}
function initCarrito() {
  const d = document.getElementById('cartDrawer');
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', abrirCarrito));
  if (!d) return;
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-carrito]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea;
    const it = Cart.get().find(i => i.id === id);
    if (e.target.closest('[data-quitar]')) { Cart.remove(id); return; }
    if (it && e.target.closest('[data-mas]')) Cart.setQty(id, it.qty + 1);
    if (it && e.target.closest('[data-menos]')) Cart.setQty(id, it.qty - 1);
  });
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarCarrito(); }
    atraparFoco(d, e);
  });
  document.getElementById('checkoutBtn')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
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
    const qv = e.target.closest('[data-qv]');
    if (qv && !e.target.closest('.qv')) { e.preventDefault(); abrirQV(qv.dataset.qv, qv); return; }
    const st = e.target.closest('[data-stepper]');
    if (st && !e.target.closest('[data-linea]') && !e.target.closest('.qv')) {
      const out = st.querySelector('output');
      const max = Number(st.dataset.max) || 99;
      let v = Number(out.textContent) || 1;
      if (e.target.closest('[data-mas]')) v = Math.min(v + 1, max);
      else if (e.target.closest('[data-menos]')) v = Math.max(v - 1, 1);
      else return;
      out.textContent = v;
      st.querySelector('[data-menos]').disabled = v <= 1;
      st.querySelector('[data-mas]').disabled = v >= max;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const qty = Number(add.closest('.prod__acciones')?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty);
      showToast(`Sumaste ${p.nombre} al carrito.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const qty = Number(comprar.closest('.prod__body')?.querySelector('.prod__acciones [data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty);
      abrirCarrito();
    }
  });
  document.addEventListener('click', e => {
    const st = e.target.closest('.qv [data-stepper]');
    if (!st) return;
    const out = st.querySelector('output');
    const max = Number(st.dataset.max) || 99;
    let v = Number(out.textContent) || 1;
    if (e.target.closest('[data-mas]')) v = Math.min(v + 1, max);
    else if (e.target.closest('[data-menos]')) v = Math.max(v - 1, 1);
    else return;
    out.textContent = v;
    st.querySelector('[data-menos]').disabled = v <= 1;
    st.querySelector('[data-mas]').disabled = v >= max;
  });
}

function syncModelosLink() {
  const otro = document.querySelector('.gw-modelos__btn:not([aria-current])');
  if (!otro || PAGINA !== 'catalogo') return;
  otro.href = `${MODELO === '2' ? 'catalogo.html' : 'catalogo-2.html'}${location.search}`;
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const valido = (v, arr) => (arr.some(x => x.id === v) ? v : '');
  const multi = (clave, arr) => (params.get(clave) || '').split(',').filter(v => arr.some(x => x.id === v));
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS),
    resina: multi('resina', RESINAS), forma: multi('forma', FORMAS), boca: multi('boca', BOCAS),
    precio: valido(params.get('precio'), PRECIOS), orden: valido(params.get('orden'), ORDENES) || 'destacados',
    q: (params.get('q') || '').trim().slice(0, 60),
  };
  const compatibles = () => {
    if (e.cat === 'accesorios') { e.forma = []; e.boca = []; }
  };
  compatibles();

  const form = document.getElementById('filtros');
  const cuerpo = document.getElementById('filtrosBody');
  const buscar = document.getElementById('buscar');
  const orden = document.getElementById('orden');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const verMas = document.getElementById('verMas');
  const vacio = document.getElementById('vacio');
  const activos = document.getElementById('activos');
  const nBadge = document.querySelector('[data-filtros-n]');
  const chips = document.getElementById('chipsCat');
  let cursor = null, mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.resina.length) f.resina = e.resina;
    if (e.forma.length) f.forma = e.forma;
    if (e.boca.length) f.boca = e.boca;
    const r = PRECIOS.find(x => x.id === e.precio);
    if (r) { f.precioMin = r.min; f.precioMax = r.max; }
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (tipo, nombre, valor, etiqueta, marcado, n) => `<label class="f-op"><input type="${tipo}" name="${nombre}" value="${valor}" data-f="${nombre.replace(/-.*$/, '')}"${marcado ? ' checked' : ''}>${etiqueta}${n != null ? `<small>${n}</small>` : ''}</label>`;
  function pintarFiltros() {
    const base = e.cat ? { cat: e.cat } : {};
    const grupos = [];
    grupos.push(`<fieldset class="f-grupo"><legend>Categoría</legend>
      ${opcion('radio', 'cat', '', 'Todo el catálogo', !e.cat, Tienda.contar({}))}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }))).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Color de resina</legend><div class="f-resinas">
      ${RESINAS.map(r => `<label class="f-resina"><input type="checkbox" name="resina-${r.id}" value="${r.id}" data-f="resina"${e.resina.includes(r.id) ? ' checked' : ''}><span class="f-resina__muestra" style="background-image:url('${r.img}')" aria-hidden="true"></span><span class="f-resina__nombre">${esc(r.nombre)}</span><small>${Tienda.contar({ ...base, resina: r.id })}</small></label>`).join('')}</div></fieldset>`);
    if (e.cat !== 'accesorios') {
      grupos.push(`<fieldset class="f-grupo"><legend>Forma</legend>
        ${FORMAS.map(x => opcion('checkbox', `forma-${x.id}`, x.id, x.nombre, e.forma.includes(x.id), Tienda.contar({ ...base, forma: x.id }))).join('')}</fieldset>`);
      grupos.push(`<fieldset class="f-grupo"><legend>Boca</legend>
        ${BOCAS.map(x => opcion('checkbox', `boca-${x.id}`, x.id, x.nombre, e.boca.includes(x.id), Tienda.contar({ ...base, boca: x.id }))).join('')}</fieldset>`);
    }
    grupos.push(`<fieldset class="f-grupo"><legend>Precio</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio)}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id)).join('')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const resinaUnica = e.resina.length === 1 ? RESINAS.find(r => r.id === e.resina[0]) : null;
    const titulo = cat ? cat.nombre : resinaUnica ? `Resina ${resinaUnica.nombre.toLowerCase()}` : 'Todos los modelos';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : 'Mates de algarrobo revestidos en resina, sets y accesorios. Los pedidos tardan de 3 a 4 semanas: 50% al encargar y 50% al recibir.';
    document.title = `${titulo} — Resplandece`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) { miga.hidden = !cat; if (migaSep) migaSep.hidden = !cat; miga.textContent = cat ? cat.nombre : ''; miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : CATALOGO_URL; }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`)].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.resina.forEach(v => quitar.push(['resina', v, `Resina ${nombreDe(RESINAS, v).toLowerCase()}`]));
    e.forma.forEach(v => quitar.push(['forma', v, nombreDe(FORMAS, v)]));
    e.boca.forEach(v => quitar.push(['boca', v, nombreDe(BOCAS, v)]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'resina', 'forma', 'boca', 'precio', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.resina.length) u.searchParams.set('resina', e.resina.join(','));
    if (e.forma.length) u.searchParams.set('forma', e.forma.join(','));
    if (e.boca.length) u.searchParams.set('boca', e.boca.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  function pintar(reiniciar) {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; total = Tienda.contar(filtros()); }
    const res = Tienda.consultar({ filtros: filtros(), orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p)}</li>`).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    contador.textContent = `${total} ${total === 1 ? 'modelo' : 'modelos'}`;
    vacio.hidden = total > 0;
    grid.hidden = total === 0;
    verMas.hidden = !cursor;
    mostrando.hidden = total === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    revelarNuevos(grid);
    refrescarTriggers();
  }
  function aplicar() {
    compatibles();
    pintarFiltros();
    pintarCabecera();
    pintarActivos();
    syncURL();
    pintar(true);
  }

  orden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${o.nombre}</option>`).join('');
  buscar.value = e.q;
  pintarFiltros();
  pintarCabecera();
  pintarActivos();
  syncURL();
  pintar(true);

  form.addEventListener('change', ev => {
    const inp = ev.target;
    const grupo = inp.dataset.f;
    if (!grupo) return;
    if (grupo === 'cat') e.cat = inp.value;
    else if (grupo === 'precio') e.precio = inp.value;
    else {
      const set = new Set(e[grupo]);
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
      e[grupo] = [...set];
    }
    aplicar();
  });
  form.addEventListener('submit', ev => ev.preventDefault());
  let t = 0;
  buscar.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { e.q = buscar.value.trim().slice(0, 60); aplicar(); }, 250); });
  buscar.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); e.q = buscar.value.trim().slice(0, 60); aplicar(); });
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.resina = []; e.forma = []; e.boca = []; e.precio = ''; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat]');
    if (!a) return;
    ev.preventDefault();
    e.cat = a.dataset.chipCat;
    aplicar();
  });
  document.querySelectorAll('a[href="#buscar"]').forEach(a => a.addEventListener('click', ev => {
    ev.preventDefault();
    buscar.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    buscar.focus({ preventScroll: true });
  }));
  document.querySelectorAll('.cats-item, .cats-resinas a, .cats-todo, .resinas a.resina').forEach(a => a.addEventListener('click', ev => {
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.resina = (u.searchParams.get('resina') || '').split(',').filter(v => RESINAS.some(r => r.id === v));
    e.forma = []; e.boca = []; e.precio = ''; e.q = ''; buscar.value = '';
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));

  initFiltrosDrawer(form);
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirQV(prod), 80);
  if (location.hash === '#buscar') setTimeout(() => buscar.focus({ preventScroll: false }), 60);
}

function initFiltrosDrawer(form) {
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  if (!form || !abrirBtn) return;
  const mq = window.matchMedia('(max-width: 1024px)');
  let bd = document.querySelector('.filtros-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); }
  const esDrawer = () => MODELO === '2' || mq.matches;
  const abrir = () => {
    form.classList.add('open'); bd.classList.add('open'); form.removeAttribute('inert');
    abrirBtn.setAttribute('aria-expanded', 'true'); Capas.abrir(form);
    setTimeout(() => form.querySelector('.filtros__cerrar')?.focus(), 60);
  };
  function cerrar() {
    if (!form.classList.contains('open')) return;
    form.classList.remove('open'); bd.classList.remove('open');
    if (esDrawer()) form.setAttribute('inert', '');
    abrirBtn.setAttribute('aria-expanded', 'false'); Capas.cerrar(form);
    abrirBtn.focus();
  }
  const modo = () => {
    const d = esDrawer();
    form.classList.toggle('es-drawer', d);
    if (d) { form.setAttribute('role', 'dialog'); form.setAttribute('aria-modal', 'true'); if (!form.classList.contains('open')) form.setAttribute('inert', ''); }
    else { form.removeAttribute('role'); form.removeAttribute('aria-modal'); form.removeAttribute('inert'); cerrar(); }
  };
  abrirBtn.addEventListener('click', abrir);
  bd.addEventListener('click', cerrar);
  form.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrar));
  form.addEventListener('keydown', ev => {
    if (!form.classList.contains('open')) return;
    if (ev.key === 'Escape') cerrar();
    atraparFoco(form, ev);
  });
  mq.addEventListener('change', modo);
  modo();
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

document.addEventListener('cart:updated', updateCartBadge);

initCatsMenu();
initResinas();
initHome();
initCatalogo();
initEntrega();
initReveals();
initNav();
initHeroMotion();
initParallax();
initLeeScroll();
initRail();
initQV();
initCarrito();
initAcciones();
initFloats();
initModelBarScroll();
syncModelosLink();
updateCartBadge();
