const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492364684207';
const MARCA = 'Mueblería Junin';
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const HOME_URL = MODELO === '2' ? 'modelo-2.html' : './';

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

const AMBIENTES = [
  { id: 'living', nombre: 'Living', bajada: 'Racks, ratonas y recibidores', img: 'images/p-rack-tv.webp',
    texto: 'Racks de TV, mesas ratonas y recibidores, hechos a la medida de tu living.' },
  { id: 'comedor', nombre: 'Comedor', bajada: 'Mesas y aparadores', img: 'images/p-mesa-comedor.webp',
    texto: 'Mesas de comedor para 6 a 10 personas y aparadores con puertas para la vajilla.' },
  { id: 'dormitorio', nombre: 'Dormitorio', bajada: 'Placares y mesas de luz', img: 'images/p-placard.webp',
    texto: 'Placares de dos puertas y mesas de luz del alto de tu cama.' },
  { id: 'estudio', nombre: 'Estudio', bajada: 'Escritorios y bibliotecas', img: 'images/p-escritorio.webp',
    texto: 'Escritorios y bibliotecas para trabajar o estudiar en casa.' },
];
const TIPOS = [
  { id: 'mesas', nombre: 'Mesas y escritorios', corto: 'Mesa' },
  { id: 'guardado', nombre: 'Con puertas o cajones', corto: 'Guardado' },
  { id: 'estantes', nombre: 'Bibliotecas', corto: 'Biblioteca' },
];
const TERMINACIONES = [
  { id: 'natural', nombre: 'Natural' },
  { id: 'miel', nombre: 'Miel' },
  { id: 'nogal', nombre: 'Nogal' },
];
const PRECIOS = [
  { id: 'hasta300', nombre: 'Hasta $300.000', min: null, max: 300000 },
  { id: '300a600', nombre: '$300.000 a $600.000', min: 300001, max: 600000 },
  { id: 'mas600', nombre: 'Más de $600.000', min: 600001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];

const Tienda = crearTienda([
  { id: 'biblioteca-abierta-cinco-estantes', nombre: 'Biblioteca Abierta de Cinco Estantes', corto: 'Biblioteca', cat: 'estudio', tipo: 'estantes', term: 'natural', rango: 1,
    medidas: [{ id: '80', a: 80, p: 30, h: 180, precio: 389000 }, { id: '90', a: 90, p: 30, h: 200, precio: 449000 }, { id: '120', a: 120, p: 35, h: 200, precio: 559000 }],
    img: 'images/p-biblioteca.webp', escena: 'images/biblioteca-alta.webp', tags: 'biblioteca estanteria estante libros repisa',
    alt: 'Biblioteca abierta de madera clara con cinco estantes, libros, plantas y un canasto',
    desc: 'Cinco estantes a la vista, laterales macizos y zócalo al ras del piso. Va contra la pared o como separador entre el living y el comedor.' },
  { id: 'mesa-comedor-patas-rectas', nombre: 'Mesa de Comedor de Patas Rectas', corto: 'Mesa de comedor', cat: 'comedor', tipo: 'mesas', term: 'natural', rango: 2,
    medidas: [{ id: '160', a: 160, p: 90, h: 75, precio: 689000 }, { id: '180', a: 180, p: 90, h: 75, precio: 759000 }, { id: '220', a: 220, p: 100, h: 75, precio: 899000 }],
    img: 'images/p-mesa-comedor.webp', escena: 'images/mesa-ancha.webp', tags: 'mesa comedor cocina familia comer',
    alt: 'Mesa de comedor rectangular de madera clara con patas rectas en un ambiente luminoso',
    desc: 'Tapa gruesa de tablas unidas y cuatro patas rectas de sección cuadrada. Con 160 cm comen 6 personas; con 220 cm, hasta 10.' },
  { id: 'aparador-tres-puertas', nombre: 'Aparador de Tres Puertas', corto: 'Aparador', cat: 'comedor', tipo: 'guardado', term: 'natural', rango: 3,
    medidas: [{ id: '150', a: 150, p: 45, h: 75, precio: 619000 }, { id: '180', a: 180, p: 45, h: 75, precio: 699000 }],
    img: 'images/p-aparador.webp', escena: null, tags: 'aparador vajillero bahiut modular puertas',
    alt: 'Aparador de madera clara con tres puertas, tiradores negros y patas inclinadas',
    desc: 'Tres puertas con tirador de metal negro, un estante interior en cada módulo y patas inclinadas de estilo nórdico. Para la vajilla o debajo de la tele.' },
  { id: 'rack-tv-cuatro-cajones', nombre: 'Rack de TV con Cuatro Cajones', corto: 'Rack de TV', cat: 'living', tipo: 'guardado', term: 'natural', rango: 4,
    medidas: [{ id: '160', a: 160, p: 40, h: 50, precio: 459000 }, { id: '180', a: 180, p: 40, h: 50, precio: 519000 }, { id: '200', a: 200, p: 45, h: 50, precio: 579000 }],
    img: 'images/p-rack-tv.webp', escena: null, tags: 'rack tv television televisor mueble tele modular bajo',
    alt: 'Rack de TV bajo de madera clara con cuatro cajones y un hueco central con estante',
    desc: 'Cuatro cajones y un hueco central con estante para el deco, la consola o el parlante. Patas inclinadas y lugar atrás para pasar los cables.' },
  { id: 'mesa-ratona-con-estante', nombre: 'Mesa Ratona con Estante', corto: 'Mesa ratona', cat: 'living', tipo: 'mesas', term: 'nogal', rango: 5,
    medidas: [{ id: '100', a: 100, p: 60, h: 45, precio: 289000 }, { id: '120', a: 120, p: 70, h: 45, precio: 329000 }],
    img: 'images/p-ratona.webp', escena: null, tags: 'ratona mesa baja centro living cafe',
    alt: 'Mesa ratona rectangular de madera color nogal con estante inferior',
    desc: 'Tapa y estante inferior en tono nogal, con patas macizas en las cuatro esquinas. Abajo entran revistas, canastos o la bandeja del mate.' },
  { id: 'recibidor-dos-cajones', nombre: 'Recibidor de Dos Cajones', corto: 'Recibidor', cat: 'living', tipo: 'guardado', term: 'nogal', rango: 6,
    medidas: [{ id: '100', a: 100, p: 35, h: 80, precio: 259000 }, { id: '120', a: 120, p: 35, h: 80, precio: 289000 }],
    img: 'images/p-recibidor.webp', escena: null, tags: 'recibidor consola arrimo entrada pasillo hall',
    alt: 'Recibidor angosto de madera color nogal con dos cajones y patas finas',
    desc: 'Angosto, de patas finas y con dos cajones con pomo. Para la entrada o el pasillo: deja lugar para las llaves, el correo y una lámpara.' },
  { id: 'placard-dos-puertas-blancas', nombre: 'Placard de Dos Puertas Blancas', corto: 'Placard', cat: 'dormitorio', tipo: 'guardado', term: 'natural', rango: 7,
    medidas: [{ id: '100', a: 100, p: 55, h: 200, precio: 749000 }, { id: '120', a: 120, p: 55, h: 210, precio: 849000 }],
    img: 'images/p-placard.webp', escena: null, tags: 'placard ropero armario guardarropa ropa',
    alt: 'Placard de dos puertas blancas con estructura de madera clara y patas inclinadas',
    desc: 'Estructura de madera clara con dos puertas blancas y tiradores de madera. Por dentro lleva barral para colgar y estantes; la distribución la definimos con vos.' },
  { id: 'mesa-de-luz-dos-cajones', nombre: 'Mesa de Luz de Dos Cajones', corto: 'Mesa de luz', cat: 'dormitorio', tipo: 'guardado', term: 'natural', rango: 8,
    medidas: [{ id: '45', a: 45, p: 40, h: 55, precio: 169000 }, { id: '50', a: 50, p: 40, h: 60, precio: 189000 }],
    img: 'images/p-mesa-de-luz.webp', escena: null, tags: 'mesa de luz mesita noche cajonera',
    alt: 'Mesa de luz de madera clara con dos cajones y tiradores de madera',
    desc: 'Dos cajones amplios con tirador de madera y tapa con borde suave. La hacemos del alto de tu colchón para que quede al ras.' },
  { id: 'escritorio-con-cajon', nombre: 'Escritorio con Cajón', corto: 'Escritorio', cat: 'estudio', tipo: 'mesas', term: 'natural', rango: 9,
    medidas: [{ id: '100', a: 100, p: 50, h: 75, precio: 279000 }, { id: '120', a: 120, p: 55, h: 75, precio: 319000 }, { id: '140', a: 140, p: 60, h: 75, precio: 359000 }],
    img: 'images/p-escritorio.webp', escena: null, tags: 'escritorio home office computadora mesa de trabajo',
    alt: 'Escritorio de madera clara con un cajón central y patas inclinadas unidas por un travesaño',
    desc: 'Patas inclinadas unidas por un travesaño y un cajón central con tirador calado. El de 100 cm entra en un rincón del dormitorio.' },

  { id: 'cajonera-borrador', nombre: 'Cajonera de Cinco Cajones', corto: 'Cajonera', cat: 'dormitorio', tipo: 'guardado', term: 'natural', rango: 99, visible: false,
    medidas: [{ id: '60', a: 60, p: 45, h: 110, precio: 0 }], img: 'images/p-mesa-de-luz.webp', escena: null, tags: '', alt: 'Próximamente', desc: 'Próximamente.' },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([p.nombre, p.corto, p.cat, p.tipo, p.desc, p.tags].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const desde = p => Math.min(...p.medidas.map(m => m.precio));
  const final = p => (p.descuento > 0 ? Math.round(desde(p) * (1 - p.descuento / 100)) : desde(p));
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function indexable(p, f) {
    const cat = lista(f.cat), tipo = lista(f.tipo), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (tipo.length && !tipo.includes(p.tipo)) return false;
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
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
    }
  }
  function leerPagina(ordenados, cursor, n) {
    let i = 0;
    if (cursor != null) {
      const k = ordenados.findIndex(p => p.id === cursor);
      i = k < 0 ? ordenados.length : k + 1;
    }
    const items = ordenados.slice(i, i + limitar(n));
    const hayMas = i + items.length < ordenados.length;
    return { items, cursor: hayMas && items.length ? items[items.length - 1].id : null };
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const base = visibles.filter(p => indexable(p, filtros)).sort(comparador(orden));
    if (!filtros.q) {
      const pag = leerPagina(base, cursor, lim);
      return { items: pag.items.map(copia), cursor: pag.cursor, paginas: 1 };
    }
    const encontrados = [];
    let c = cursor, ultimo = cursor, paginas = 0, fin = false;
    while (encontrados.length < lim) {
      const pag = leerPagina(base, c, tope);
      paginas++;
      for (const p of pag.items) {
        ultimo = p.id;
        if (coincideTexto(p, filtros.q)) {
          encontrados.push(p);
          if (encontrados.length === lim) break;
        }
      }
      if (encontrados.length === lim) break;
      if (!pag.cursor) { fin = true; break; }
      c = pag.cursor;
    }
    const resto = !fin && ultimo != null && base.findIndex(p => p.id === ultimo) < base.length - 1;
    return { items: encontrados.map(copia), cursor: resto ? ultimo : null, paginas };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (indexable(p, filtros) && (!filtros.q || coincideTexto(p, filtros.q)) ? 1 : 0), 0);
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const medidaDe = (p, id) => p.medidas.find(m => m.id === id) || p.medidas[0];
const precioMedida = (p, id) => {
  const m = medidaDe(p, id);
  return p.descuento > 0 ? Math.round(m.precio * (1 - p.descuento / 100)) : m.precio;
};
const precioDesde = p => Math.min(...p.medidas.map(m => precioMedida(p, m.id)));
const txtMedida = m => `${m.a} × ${m.h} × ${m.p} cm`;
const leerOp = op => { const [med = '', term = ''] = String(op || '').split('|'); return { med, term }; };
const txtOp = (p, op) => {
  const { med, term } = leerOp(op);
  return `${txtMedida(medidaDe(p, med))}, terminación ${nombreDe(TERMINACIONES, term || p.term).toLowerCase()}`;
};
const urlProducto = p => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}`;

const Cart = {
  KEY: 'muebleriajunin_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, op = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.op || '') === op);
    if (existing) existing.qty = Math.min(existing.qty + qty, 10);
    else items.push({ id: producto.id, op, qty: Math.min(qty, 10) });
    this.save(items);
  },
  setQty(id, op, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.op || '') === op); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 10)); this.save(items);
  },
  remove(id, op) { this.save(this.get().filter(i => !(i.id === id && (i.op || '') === op))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioMedida(p, leerOp(i.op).med) * i.qty : s; }, 0); },
};

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  sillon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M5 18v2M19 18v2"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar uno"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar uno"${valor >= max ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}

function cardHTML(p) {
  const nombre = esc(p.nombre);
  const m0 = p.medidas[0];
  return `<article class="prod">
    <div class="prod__media">
      <a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async"></a>
      <span class="prod__chip">${p.medidas.length} medidas</span>
    </div>
    <div class="prod__body">
      <p class="prod__meta">${esc(nombreDe(AMBIENTES, p.cat))}</p>
      <h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      <p class="precio"><span class="precio__final" data-precio-card>${formatearPrecio(precioMedida(p, m0.id))}</span></p>
      <div class="prod__acciones">
        <label class="var-sel"><span class="sr-only">Ancho de ${nombre}</span><select data-op>${p.medidas.map(m => `<option value="${m.id}">${m.a} cm</option>`).join('')}</select></label>
        <button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar</span>${ICON.carritoMas}</button>
      </div>
      <button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}

function miniHTML(p) {
  return `<article class="mini">
    <a class="mini__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="${esc(p.alt)}" width="600" height="600" decoding="async"></a>
    <div class="mini__body">
      <h3 class="mini__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${esc(p.corto)}</a></h3>
      <p class="mini__precio">desde <strong>${formatearPrecio(precioDesde(p))}</strong></p>
      <a class="btn btn--cta btn--sm" href="${urlProducto(p)}" data-qv="${p.id}" aria-label="Ver mueble: ${esc(p.nombre)}">Ver mueble ${ICON.flecha}</a>
    </div>
  </article>`;
}

function filaHTML(p, i) {
  const anchos = p.medidas.map(m => m.a);
  return `<li data-animate="der" style="opacity:0;transform:translateX(48px)"><a class="fila" href="${urlProducto(p)}" data-qv="${p.id}" data-fila="${p.id}">
    <span class="fila__n">${String(i + 1).padStart(2, '0')}</span>
    <span class="fila__mini"><img src="${p.img}" alt="" width="120" height="120" decoding="async"></span>
    <span class="fila__txt"><span class="fila__nombre">${esc(p.nombre)}</span><span class="fila__meta">${esc(nombreDe(AMBIENTES, p.cat))} · de ${Math.min(...anchos)} a ${Math.max(...anchos)} cm de ancho</span></span>
    <span class="fila__precio"><small>desde</small>${formatearPrecio(precioDesde(p))}</span>${ICON.flecha}</a></li>`;
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
  nav.addEventListener('click', e => { if (e.target.closest('.nav-cats__panel a')) close(); });
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
    panel.innerHTML = '<div class="cats-lista">' + AMBIENTES.map(c => `
        <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
          <img src="${c.img}" alt="" width="56" height="56" decoding="async">
          <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
          <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
        </a>`).join('') + '</div>'
      + `<div class="cats-tipos"><p class="cats-tipos__tit">Por tipo</p>${TIPOS.map(t => `<a href="${CATALOGO_URL}?tipo=${t.id}">${esc(t.nombre)} <span class="cats-item__n">${Tienda.contar({ tipo: t.id })}</span></a>`).join('')}</div>`
      + `<div class="cats-pie"><a class="cats-medida" href="${HOME_URL}#a-medida">¿Otra medida? Pedilo a medida</a><a class="cats-todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a></div>`;
    let timer = 0, porHover = 0;
    const abrir = () => { clearTimeout(timer); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(timer); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      if (box.classList.contains('open') && Date.now() - porHover > 500) cerrar(); else abrir();
    });
    box.addEventListener('mouseenter', () => { if (hoverMq.matches && !box.classList.contains('open')) { porHover = Date.now(); abrir(); } });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 140); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
    panel.addEventListener('click', e => { if (e.target.closest('.cats-medida') && PAGINA === 'home') cerrar(); });
  });
}

function initBuscadorHeader() {
  const btn = document.querySelector('[data-abrir-busqueda]');
  const form = document.getElementById('busquedaHeader');
  if (!btn || !form) return;
  form.classList.add('es-plegable');
  const input = form.querySelector('input');
  const cerrar = () => { form.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => {
    const abrir = form.hidden;
    form.hidden = !abrir;
    btn.setAttribute('aria-expanded', String(abrir));
    if (abrir) setTimeout(() => input?.focus(), 30);
  });
  form.addEventListener('keydown', e => { if (e.key === 'Escape') { cerrar(); btn.focus(); } });
  form.querySelector('[data-cerrar-busqueda]')?.addEventListener('click', () => { cerrar(); btn.focus(); });
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  hero.querySelectorAll('[data-hero-img]').forEach(img => tl.from(img, { scale: 1.09, duration: 1.8, clearProps: 'transform' }, 0));
  tl.from(hero.querySelectorAll('.hero-biblio'), { y: 64, opacity: 0, duration: 1.3, clearProps: 'transform,opacity' }, 0.15)
    .from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.12)
    .from(hero.querySelectorAll('h1'), { y: 44, opacity: 0, duration: 1.1 }, 0.22)
    .fromTo(hero.querySelectorAll('.trazo--hero'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power2.inOut', clearProps: 'clipPath' }, 0.7)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.42)
    .from(hero.querySelectorAll('.hero-ctas > *'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56)
    .from(hero.querySelectorAll('.hero-sello, .ficha'), { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: 'back.out(1.4)', clearProps: 'transform,opacity' }, 0.8);
}

function pintarPrecios() {
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (p) el.textContent = formatearPrecio(precioDesde(p));
  });
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.catN });
    el.textContent = `${n} ${n === 1 ? 'mueble' : 'muebles'}`;
  });
  document.querySelectorAll('[data-cat-num]').forEach(el => { el.textContent = Tienda.contar({ cat: el.dataset.catNum }); });
}

const DESTACADOS_M1 = ['biblioteca-abierta-cinco-estantes', 'mesa-comedor-patas-rectas', 'aparador-tres-puertas'];
function initHome() {
  if (PAGINA !== 'home') return;
  const dest = document.getElementById('destM1');
  if (dest) {
    dest.innerHTML = Tienda.consultar({ filtros: { ids: DESTACADOS_M1 }, limite: 3 }).items
      .map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${miniHTML(p)}</li>`).join('');
  }
  const prev = document.getElementById('previewLista');
  if (prev) {
    prev.innerHTML = Tienda.consultar({ filtros: { excluir: DESTACADOS_M1 }, limite: 6 }).items
      .map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p)}</li>`).join('');
  }
  const indice = document.getElementById('indiceLista');
  if (indice) {
    indice.innerHTML = Tienda.consultar({ filtros: { excluir: 'mesa-comedor-patas-rectas' }, limite: 8 }).items.map(filaHTML).join('');
    initIndiceVisor(indice);
  }
}

function initIndiceVisor(lista) {
  const foto = document.getElementById('indiceFoto');
  const cap = document.getElementById('indiceCap');
  if (!foto || !cap) return;
  let actual = '';
  const mostrar = id => {
    const p = getProducto(id);
    if (!p || id === actual) return;
    actual = id;
    lista.querySelectorAll('[data-fila]').forEach(a => a.classList.toggle('is-activa', a.dataset.fila === id));
    foto.classList.add('cambia');
    setTimeout(() => {
      foto.src = p.img;
      foto.alt = p.alt;
      cap.innerHTML = `<strong>${esc(p.nombre)}</strong><span>desde ${formatearPrecio(precioDesde(p))}</span>`;
      foto.classList.remove('cambia');
    }, reduceMotion ? 0 : 160);
  };
  lista.addEventListener('pointerover', e => { const a = e.target.closest('[data-fila]'); if (a) mostrar(a.dataset.fila); });
  lista.addEventListener('focusin', e => { const a = e.target.closest('[data-fila]'); if (a) mostrar(a.dataset.fila); });
  const primera = lista.querySelector('[data-fila]');
  if (primera) mostrar(primera.dataset.fila);
}

const ORDEN_TIPOS = {
  mesa: { nombre: 'Mesa', dims: [160, 75, 90], prod: 'mesa-comedor-patas-rectas' },
  biblioteca: { nombre: 'Biblioteca', dims: [90, 200, 30], prod: 'biblioteca-abierta-cinco-estantes' },
  placard: { nombre: 'Placard', dims: [120, 210, 55], prod: 'placard-dos-puertas-blancas' },
  rack: { nombre: 'Rack de TV', dims: [180, 50, 40], prod: 'rack-tv-cuatro-cajones' },
  escritorio: { nombre: 'Escritorio', dims: [120, 75, 55], prod: 'escritorio-con-cajon' },
  aparador: { nombre: 'Aparador', dims: [160, 75, 45], prod: 'aparador-tres-puertas' },
  luz: { nombre: 'Mesa de luz', dims: [50, 60, 40], prod: 'mesa-de-luz-dos-cajones' },
  otro: { nombre: 'Otro mueble', dims: [100, 100, 50], prod: null },
};
const LIMITES = { ancho: [20, 400], alto: [20, 260], prof: [20, 150] };

function croquisDe(tipo, ancho, alto) {
  const piso = 186, maxW = 236, maxH = 150;
  const s = Math.min(maxW / ancho, maxH / alto);
  const w = ancho * s, h = alto * s, x = (320 - w) / 2, y = piso - h;
  const r = (rx, ry, rw, rh) => `M${rx.toFixed(1)} ${ry.toFixed(1)}h${rw.toFixed(1)}v${rh.toFixed(1)}h${(-rw).toFixed(1)}z`;
  const l = (x1, y1, x2, y2) => `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
  const d = [];
  const pata = Math.max(3, Math.min(w * 0.05, 10));
  if (tipo === 'mesa' || tipo === 'escritorio') {
    const tapa = Math.max(4, h * 0.09);
    d.push(r(x, y, w, tapa));
    d.push(r(x + w * 0.04, y + tapa, pata, h - tapa), r(x + w * 0.96 - pata, y + tapa, pata, h - tapa));
    if (tipo === 'escritorio') d.push(r(x + w * 0.34, y + tapa, w * 0.32, Math.max(6, h * 0.16)), l(x + w * 0.04 + pata, y + h * 0.82, x + w * 0.96 - pata, y + h * 0.82));
  } else if (tipo === 'biblioteca') {
    d.push(r(x, y, w, h));
    const n = Math.max(2, Math.min(7, Math.round(alto / 38)));
    for (let i = 1; i < n; i++) d.push(l(x, y + (h * i) / n, x + w, y + (h * i) / n));
  } else {
    const patas = tipo === 'luz' ? h * 0.1 : h * 0.12;
    const cuerpo = h - patas;
    d.push(r(x, y, w, cuerpo));
    d.push(l(x + w * 0.08, y + cuerpo, x + w * 0.05, piso), l(x + w * 0.92, y + cuerpo, x + w * 0.95, piso));
    if (tipo === 'placard') {
      d.push(l(x + w / 2, y, x + w / 2, y + cuerpo), l(x + w / 2 - 6, y + cuerpo * 0.42, x + w / 2 - 6, y + cuerpo * 0.58), l(x + w / 2 + 6, y + cuerpo * 0.42, x + w / 2 + 6, y + cuerpo * 0.58));
    } else if (tipo === 'aparador') {
      d.push(l(x + w / 3, y, x + w / 3, y + cuerpo), l(x + (2 * w) / 3, y, x + (2 * w) / 3, y + cuerpo));
      [1, 3, 5].forEach(k => d.push(l(x + (w * k) / 6 - 5, y + cuerpo * 0.14, x + (w * k) / 6 + 5, y + cuerpo * 0.14)));
    } else if (tipo === 'rack') {
      d.push(l(x + w * 0.3, y, x + w * 0.3, y + cuerpo), l(x + w * 0.7, y, x + w * 0.7, y + cuerpo));
      d.push(l(x, y + cuerpo / 2, x + w * 0.3, y + cuerpo / 2), l(x + w * 0.7, y + cuerpo / 2, x + w, y + cuerpo / 2), l(x + w * 0.3, y + cuerpo * 0.55, x + w * 0.7, y + cuerpo * 0.55));
    } else if (tipo === 'luz') {
      d.push(l(x, y + cuerpo / 2, x + w, y + cuerpo / 2));
      d.push(l(x + w / 2 - 6, y + cuerpo * 0.25, x + w / 2 + 6, y + cuerpo * 0.25), l(x + w / 2 - 6, y + cuerpo * 0.75, x + w / 2 + 6, y + cuerpo * 0.75));
    } else {
      d.push(r(x + 8, y + 8, Math.max(0, w - 16), Math.max(0, cuerpo - 16)));
    }
  }
  const cotaY = y - 14, cotaX = x + w + 14;
  const cotas = [
    l(x, cotaY, x + w, cotaY), l(x, cotaY - 5, x, cotaY + 5), l(x + w, cotaY - 5, x + w, cotaY + 5),
    l(cotaX, y, cotaX, piso), l(cotaX - 5, y, cotaX + 5, y), l(cotaX - 5, piso, cotaX + 5, piso),
  ].join('');
  return `<path class="croquis__piso" d="M16 ${piso}H304"/>
    <path class="croquis__mueble" pathLength="1" d="${d.join('')}"/>
    <path class="croquis__cota" d="${cotas}"/>
    <text class="croquis__txt" x="${(x + w / 2).toFixed(1)}" y="${(cotaY - 7).toFixed(1)}" text-anchor="middle">${ancho} cm</text>
    <text class="croquis__txt" x="${(cotaX + 8).toFixed(1)}" y="${(y + h / 2 + 4).toFixed(1)}">${alto} cm</text>`;
}

function initOrden() {
  const form = document.getElementById('ordenForm');
  if (!form) return;
  const $ = id => document.getElementById(id);
  const ancho = $('oAncho'), alto = $('oAlto'), prof = $('oProf');
  const svg = $('oCroquis'), aviso = $('oAviso'), wsp = $('oWsp'), parecido = $('oParecido');
  const hoy = new Date();
  $('oFecha').textContent = hoy.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  let tipoPrevio = '';
  let visto = false, tDibujo = 0;
  const dibujar = () => {
    if (reduceMotion) return;
    svg.classList.add('dibuja');
    clearTimeout(tDibujo);
    tDibujo = setTimeout(() => svg.classList.remove('dibuja'), 1400);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      if (entries.some(en => en.isIntersecting)) { visto = true; dibujar(); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(svg);
  }
  const leer = () => ({
    tipo: form.querySelector('[name="o-tipo"]:checked')?.value || 'mesa',
    term: form.querySelector('[name="o-term"]:checked')?.value || 'natural',
    ancho: Math.round(Number(ancho.value)), alto: Math.round(Number(alto.value)), prof: Math.round(Number(prof.value)),
    prov: $('oProv').value, loc: $('oLocalidad').value.trim(), nota: $('oNota').value.trim(),
  });
  const fuera = (v, [min, max]) => !(v >= min && v <= max);
  const pintar = () => {
    const o = leer();
    const t = ORDEN_TIPOS[o.tipo] || ORDEN_TIPOS.mesa;
    if (o.tipo !== tipoPrevio) {
      if (tipoPrevio) { [ancho.value, alto.value, prof.value] = t.dims; Object.assign(o, { ancho: t.dims[0], alto: t.dims[1], prof: t.dims[2] }); }
      tipoPrevio = o.tipo;
      if (visto) dibujar();
    }
    const errores = [];
    [[ancho, 'ancho', o.ancho], [alto, 'alto', o.alto], [prof, 'prof', o.prof]].forEach(([inp, k, v]) => {
      const mal = fuera(v, LIMITES[k]);
      inp.setAttribute('aria-invalid', String(mal));
      if (mal) errores.push(`${k === 'prof' ? 'la profundidad' : `el ${k}`}: entre ${LIMITES[k][0]} y ${LIMITES[k][1]} cm`);
    });
    aviso.textContent = errores.length ? `Revisá ${errores.join(' y ')}.` : '';
    wsp.setAttribute('aria-disabled', String(!!errores.length));
    if (!errores.length) svg.innerHTML = croquisDe(o.tipo, o.ancho, o.alto);
    const medidas = `${o.ancho || '—'} × ${o.alto || '—'} × ${o.prof || '—'} cm`;
    $('oMueble').textContent = t.nombre;
    $('oMedidas').textContent = medidas;
    $('oTerm').textContent = nombreDe(TERMINACIONES, o.term);
    $('oEntrega').textContent = [o.loc, o.prov].filter(Boolean).join(', ') || 'A coordinar';
    const p = t.prod ? getProducto(t.prod) : null;
    if (p) {
      const cerca = p.medidas.reduce((a, b) => (Math.abs(b.a - o.ancho) < Math.abs(a.a - o.ancho) ? b : a));
      parecido.innerHTML = `<span class="ticket__parecido-tit">Lo más parecido del catálogo</span>
        <button type="button" class="ticket__prod" data-qv-abrir="${p.id}" data-qv-med="${cerca.id}"><img src="${p.img}" alt="" width="120" height="120"><span><strong>${esc(p.nombre)}</strong><span>${txtMedida(cerca)} · ${formatearPrecio(precioMedida(p, cerca.id))}</span></span></button>`;
    } else {
      parecido.innerHTML = '<span class="ticket__parecido-tit">Lo diseñamos desde cero</span><p>Contanos para qué lo querés y mandanos una foto del lugar: te proponemos el diseño con el presupuesto.</p>';
    }
    const msg = [`Hola ${MARCA}! Quiero pedir un mueble a medida:`,
      `- Mueble: ${t.nombre}`,
      `- Medidas: ${o.ancho} cm de ancho × ${o.alto} cm de alto × ${o.prof} cm de profundidad`,
      `- Terminación: ${nombreDe(TERMINACIONES, o.term)}`,
      `- Entrega: ${[o.loc, o.prov].filter(Boolean).join(', ') || 'a coordinar'}`,
      ...(o.nota ? [`- Detalle: ${o.nota}`] : []),
      '¿Me pasan el presupuesto?'].join('\n');
    wsp.href = wspHref(msg);
  };
  form.addEventListener('input', pintar);
  form.addEventListener('change', pintar);
  form.addEventListener('submit', e => { e.preventDefault(); pintar(); if (wsp.getAttribute('aria-disabled') !== 'true') window.open(wsp.href, '_blank', 'noopener'); });
  wsp.addEventListener('click', e => {
    if (wsp.getAttribute('aria-disabled') === 'true') { e.preventDefault(); aviso.focus?.(); showToast('Revisá las medidas antes de mandar la orden.'); }
  });
  pintar();
}

const QV = { p: null, med: '', term: '', foto: 0, opener: null };
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const amb = AMBIENTES.find(c => c.id === p.cat);
  const m = medidaDe(p, QV.med);
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  const fotos = [{ src: p.img, alt: p.alt }];
  if (p.escena) fotos.push({ src: p.escena, alt: `Otra vista: ${p.alt}` });
  const op = `${m.id}|${QV.term}`;
  const msg = `Hola ${MARCA}! Quiero consultar por ${p.nombre} (${txtOp(p, op)}). ¿Se puede hacer en otra medida?`;
  const alta = fotos[QV.foto].src.includes('alta') || fotos[QV.foto].src.includes('ancha');
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal${alta ? ' qv__principal--escena' : ''}"><img src="${fotos[QV.foto].src}" alt="${esc(fotos[QV.foto].alt)}" width="800" height="800"></div>
        ${fotos.length > 1 ? `<div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver el mueble en su ambiente' : 'Ver la foto del mueble'}"><img src="${f.src}" alt="" width="72" height="72"></button>`).join('')}</div>` : ''}
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(amb?.nombre || '')} · Se fabrica a pedido</p>
        <h2>${esc(p.nombre)}</h2>
        <p class="precio"><span class="precio__final">${formatearPrecio(precioMedida(p, m.id))}</span><span class="precio__nota">en ${esc(txtMedida(m))}</span></p>
        <p class="qv__desc">${esc(p.desc)}</p>
        <div>
          <p class="f-grupo__titulo">Medida <small>ancho × alto × profundidad</small></p>
          <div class="qv__meds" role="group" aria-label="Elegí la medida">${p.medidas.map(x => `<button type="button" class="qv__med" data-qv-med="${x.id}" aria-pressed="${x.id === m.id}"><strong>${esc(txtMedida(x))}</strong><span>${formatearPrecio(precioMedida(p, x.id))}</span></button>`).join('')}</div>
        </div>
        <div>
          <p class="f-grupo__titulo">Terminación</p>
          <div class="qv__terms" role="group" aria-label="Elegí la terminación">${TERMINACIONES.map(t => `<button type="button" class="qv__term" data-qv-term="${t.id}" aria-pressed="${t.id === QV.term}"><i class="swatch swatch--${t.id}" aria-hidden="true"></i>${esc(t.nombre)}</button>`).join('')}</div>
        </div>
        <div class="qv__compra">
          ${stepperHTML(10)}
          <button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
        </div>
        <div class="qv__extra">
          <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar otra medida por WhatsApp</a>
          <a class="qv__medida" href="${HOME_URL}#a-medida">Diseñarlo a medida</a>
        </div>
        <p class="qv__nota">Plazo de fabricación y envío a tu provincia: se confirman con el presupuesto.</p>
        ${rel.length ? `<div class="qv__rel"><h3>También para ${esc(amb?.nombre?.toLowerCase() || 'tu casa')}</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.img}" alt="" width="400" height="400"></span><span>${esc(r.corto)}</span><span class="precio__final">desde ${formatearPrecio(precioDesde(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, category: amb?.nombre, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: precioDesde(p), highPrice: Math.max(...p.medidas.map(x => precioMedida(p, x.id))), offerCount: p.medidas.length, availability: 'https://schema.org/MadeToOrder' },
  });
}
function abrirQV(id, opener, med = '') {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p; QV.med = medidaDe(p, med).id; QV.term = p.term; QV.foto = 0;
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
    if (e.target.closest('.qv__medida') && PAGINA === 'home') { cerrarQV(); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) { QV.foto = Number(foto.dataset.qvFoto); renderQV(); return; }
    const med = e.target.closest('[data-qv-med]');
    if (med) { QV.med = med.dataset.qvMed; renderQV(); modal.querySelector(`[data-qv-med="${QV.med}"]`)?.focus(); return; }
    const term = e.target.closest('[data-qv-term]');
    if (term) { QV.term = term.dataset.qvTerm; renderQV(); modal.querySelector(`[data-qv-term="${QV.term}"]`)?.focus(); return; }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      const op = `${QV.med}|${QV.term}`;
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty, op);
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${p.corto} (${txtOp(p, op)}) al carrito.`);
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
  const op = i.op || '';
  const precio = precioMedida(p, leerOp(op).med);
  return `<li class="linea" data-linea="${p.id}" data-linea-op="${esc(op)}">
    <img src="${p.img}" alt="" width="72" height="72">
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta">${esc(txtOp(p, op))}</p>
      ${stepperHTML(10, i.qty)}
    </div>
    <div class="linea__lado"><span>${formatearPrecio(precio * i.qty)}</span><button type="button" class="linea__quitar" data-quitar>Quitar</button></div>
  </li>`;
}
function renderCarrito() {
  const items = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!items || !foot) return;
  const lineas = Cart.get().filter(i => getProducto(i.id));
  if (!lineas.length) {
    items.innerHTML = `<div class="drawer__vacio">${ICON.sillon}<p>Tu carrito está vacío. Elegí un mueble, su medida y su terminación, y aparece acá.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver al catálogo ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  const total = Cart.total();
  document.getElementById('cartTotal').textContent = formatearPrecio(total);
  const texto = [`Hola ${MARCA}! Quiero hacer este pedido:`, ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${i.qty} × ${p.nombre} (${txtOp(p, i.op)}): ${formatearPrecio(precioMedida(p, leerOp(i.op).med) * i.qty)}`;
  }), `Total: ${formatearPrecio(total)}`, 'Entrega en: '].join('\n');
  const wsp = document.getElementById('cartWsp');
  if (wsp) wsp.href = wspHref(texto);
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
    const id = linea.dataset.linea, op = linea.dataset.lineaOp || '';
    const it = Cart.get().find(i => i.id === id && (i.op || '') === op);
    if (e.target.closest('[data-quitar]')) { Cart.remove(id, op); return; }
    if (it && e.target.closest('[data-mas]')) Cart.setQty(id, op, it.qty + 1);
    if (it && e.target.closest('[data-menos]')) Cart.setQty(id, op, it.qty - 1);
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
    cart?.classList.toggle('visible', scrolled || (Cart.count() > 0 && window.scrollY > 160));
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

function initAcciones() {
  document.addEventListener('change', e => {
    const sel = e.target.closest('.prod [data-op]');
    if (!sel) return;
    const card = sel.closest('.prod');
    const id = card?.querySelector('[data-add]')?.dataset.add;
    const p = id ? getProducto(id) : null;
    const precio = card?.querySelector('[data-precio-card]');
    if (p && precio) precio.textContent = formatearPrecio(precioMedida(p, sel.value));
  });
  document.addEventListener('click', e => {
    const qv = e.target.closest('[data-qv]');
    if (qv && !e.target.closest('.qv')) { e.preventDefault(); abrirQV(qv.dataset.qv, qv); return; }
    const abrir = e.target.closest('[data-qv-abrir]');
    if (abrir) { abrirQV(abrir.dataset.qvAbrir, abrir, abrir.dataset.qvMed || ''); return; }
    const st = e.target.closest('[data-stepper]');
    if (st && !e.target.closest('[data-linea]')) {
      const out = st.querySelector('output');
      const max = Number(st.dataset.max) || 10;
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
      const med = add.closest('.prod__acciones')?.querySelector('[data-op]')?.value || p.medidas[0].id;
      const op = `${med}|${p.term}`;
      Cart.add(p, 1, op);
      showToast(`Sumaste ${p.corto} (${txtOp(p, op)}) al carrito.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const med = comprar.closest('.prod__body')?.querySelector('[data-op]')?.value || p.medidas[0].id;
      Cart.add(p, 1, `${med}|${p.term}`);
      abrirCarrito();
    }
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
    cat: valido(params.get('cat'), AMBIENTES), tipo: multi('tipo', TIPOS), precio: valido(params.get('precio'), PRECIOS),
    orden: valido(params.get('orden'), ORDENES) || 'destacados', q: (params.get('q') || '').trim().slice(0, 60),
  };
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
    if (e.tipo.length) f.tipo = e.tipo;
    const r = PRECIOS.find(x => x.id === e.precio);
    if (r) { f.precioMin = r.min; f.precioMax = r.max; }
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (tipo, nombre, valor, etiqueta, marcado, n, grupo) => `<label class="f-op"><input type="${tipo}" name="${nombre}" value="${valor}" data-f="${grupo}"${marcado ? ' checked' : ''}><span>${etiqueta}</span>${n != null ? `<small>${n}</small>` : ''}</label>`;
  function pintarFiltros() {
    const base = e.cat ? { cat: e.cat } : {};
    cuerpo.innerHTML = [
      `<fieldset class="f-grupo"><legend>Ambiente</legend>
        ${opcion('radio', 'cat', '', 'Toda la casa', !e.cat, Tienda.contar({}), 'cat')}
        ${AMBIENTES.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }), 'cat')).join('')}</fieldset>`,
      `<fieldset class="f-grupo"><legend>Tipo de mueble</legend>
        ${TIPOS.map(t => opcion('checkbox', `tipo-${t.id}`, t.id, esc(t.nombre), e.tipo.includes(t.id), Tienda.contar({ ...base, tipo: t.id }), 'tipo')).join('')}</fieldset>`,
      `<fieldset class="f-grupo"><legend>Precio desde</legend>
        ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio, null, 'precio')}
        ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id, Tienda.contar({ ...base, precioMin: r.min, precioMax: r.max }), 'precio')).join('')}</fieldset>`,
      `<div class="f-medida"><p>¿No está la medida que buscás?</p><a href="${HOME_URL}#a-medida">Pedilo a medida ${ICON.flecha}</a></div>`,
    ].join('');
  }
  function pintarCabecera() {
    const cat = AMBIENTES.find(c => c.id === e.cat);
    const tipo = !cat && e.tipo.length === 1 ? TIPOS.find(t => t.id === e.tipo[0]) : null;
    const titulo = cat ? cat.nombre : tipo ? tipo.nombre : 'Todos los muebles';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : 'Elegí el mueble, la medida y la terminación. Si no está la medida que necesitás, te lo hacemos a medida.';
    document.title = `${titulo} — ${MARCA}`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) {
      const nombre = cat ? cat.nombre : tipo ? tipo.nombre : '';
      miga.hidden = !nombre; if (migaSep) migaSep.hidden = !nombre;
      miga.textContent = nombre;
      miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : tipo ? `${CATALOGO_URL}?tipo=${tipo.id}` : CATALOGO_URL;
    }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat ? ' aria-current="page"' : ''}>Toda la casa <small>${Tienda.contar({})}</small></a>`,
      ...AMBIENTES.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`)].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.tipo.forEach(v => quitar.push(['tipo', v, nombreDe(TIPOS, v)]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length + (e.cat ? 1 : 0) > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'tipo', 'precio', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.tipo.length) u.searchParams.set('tipo', e.tipo.join(','));
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
    contador.textContent = `${total} ${total === 1 ? 'mueble' : 'muebles'}`;
    vacio.hidden = total > 0;
    grid.hidden = total === 0;
    verMas.hidden = !cursor || mostrados >= total;
    mostrando.hidden = total === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    revelarNuevos(grid);
    refrescarTriggers();
  }
  function aplicar() {
    pintarFiltros();
    pintarCabecera();
    pintarActivos();
    syncURL();
    pintar(true);
  }

  orden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${o.nombre}</option>`).join('');
  buscar.value = e.q;
  aplicar();

  form.addEventListener('change', ev => {
    const inp = ev.target;
    const grupo = inp.dataset.f;
    if (!grupo) return;
    if (grupo === 'cat') e.cat = inp.value;
    else if (grupo === 'precio') e.precio = inp.value;
    else {
      const set = new Set(e.tipo);
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
      e.tipo = [...set];
    }
    aplicar();
  });
  form.addEventListener('submit', ev => ev.preventDefault());
  let t = 0;
  const leerBusqueda = v => { e.q = v.trim().slice(0, 60); aplicar(); };
  buscar.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => leerBusqueda(buscar.value), 250); });
  buscar.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); leerBusqueda(buscar.value); });
  document.querySelectorAll('.header-search').forEach(f => f.addEventListener('submit', ev => {
    ev.preventDefault();
    const v = f.querySelector('input')?.value || '';
    buscar.value = v;
    leerBusqueda(v);
    if (f.classList.contains('es-plegable')) {
      f.hidden = true;
      document.querySelector('[data-abrir-busqueda]')?.setAttribute('aria-expanded', 'false');
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.tipo = []; e.precio = ''; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e.tipo = e.tipo.filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat]');
    if (!a) return;
    ev.preventDefault();
    e.cat = a.dataset.chipCat;
    aplicar();
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('.cats-item, .cats-tipos a, .cats-todo, .main-nav > a, a[data-ir-catalogo]');
    if (!a) return;
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL) || u.hash) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), AMBIENTES);
    e.tipo = (u.searchParams.get('tipo') || '').split(',').filter(v => TIPOS.some(x => x.id === v));
    e.precio = ''; e.q = ''; buscar.value = '';
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  });

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
  const modo = () => {
    const d = esDrawer();
    form.classList.toggle('es-drawer', d);
    if (d) { form.setAttribute('role', 'dialog'); form.setAttribute('aria-modal', 'true'); if (!form.classList.contains('open')) form.setAttribute('inert', ''); }
    else { form.removeAttribute('role'); form.removeAttribute('aria-modal'); form.removeAttribute('inert'); cerrar(); }
  };
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

[initCatsMenu, pintarPrecios, initHome, initOrden, initCatalogo, initReveals, initNav, initBuscadorHeader, initHeroMotion,
  initQV, initCarrito, initAcciones, initFloats, initModelBarScroll, syncModelosLink, updateCartBadge]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
