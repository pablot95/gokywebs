const WHATSAPP_NUMBER = '5491133830557';
const POR_PAGINA = 16;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate], [data-hero]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; el.style.filter = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const CATEGORIAS = [
  { id: 'mantas', nombre: 'Mantas', img: 'images/prod-manta-degrade-rosa-1000x1250.webp', alt: 'Manta tejida al crochet en franjas coral, rosa, crudo y fucsia, enrollada' },
  { id: 'sonajeros', nombre: 'Sonajeros y portachupetes', img: 'images/prod-sonajero-aro-osito-1000x1250.webp', alt: 'Sonajero de aro de madera con osito celeste tejido' },
  { id: 'escarpines', nombre: 'Escarpines', img: 'images/prod-escarpines-conejito-1000x1250.webp', alt: 'Escarpines tejidos de conejito en los pies de un bebé' },
  { id: 'apego', nombre: 'Muñecos de apego', img: 'images/prod-corazon-apego-1000x1250.webp', alt: 'Corazón de apego tejido al crochet junto a los pies de un bebé' },
  { id: 'gorritos', nombre: 'Gorritos y vinchas', img: 'images/prod-vinchas-mono-1000x1250.webp', alt: 'Dos vinchas con moño en crudo y arena' },
  { id: 'sets', nombre: 'Sets para regalar', img: 'images/prod-set-bienvenida-1000x1250.webp', alt: 'Set tejido con gorritos, escarpines, osito y manta en tonos naturales' },
];

const TECNICAS = ['Crochet', 'Dos agujas', 'Costura', 'Armado a mano'];
const TALLES = ['0-3 meses', '3-6 meses', '6-12 meses'];
const RANGOS_PRECIO = [
  { id: 'hasta-20', nombre: 'Hasta $20.000', min: 0, max: 20000 },
  { id: '20-50', nombre: '$20.000 a $50.000', min: 20000, max: 50000 },
  { id: 'mas-50', nombre: 'Más de $50.000', min: 50000, max: Infinity },
];

const IMG_CONTEXTO_TEJIDOS = 'images/contexto-tejidos-1600x1067.webp';

const PRODUCTOS = [
  {
    id: 'bea-01', slug: 'sonajero-aro-osito', nombre: 'Sonajero aro osito', categoria: 'sonajeros', tecnica: 'Crochet',
    precio: 16900, descuento: 0, stock: 8, variante: null, badge: '', orden: 1, destacado: 1,
    descripcion: 'Aro de madera con un osito celeste tejido al crochet y moñito azul marino. Del tamaño justo para que lo agarre con una mano.',
    imagenes: ['images/prod-sonajero-aro-osito-1000x1250.webp', 'images/firma-sonajero-aro-osito-1200x1500.webp'],
    alt: 'Mano de bebé agarrando un sonajero de aro de madera con un osito celeste tejido', tags: ['sonajero', 'aro', 'osito', 'madera', 'juguete', 'celeste'],
  },
  {
    id: 'bea-02', slug: 'gorrito-acanalado', nombre: 'Gorrito acanalado', categoria: 'gorritos', tecnica: 'Dos agujas',
    precio: 19900, descuento: 0, stock: 9, variante: { nombre: 'Color', valores: ['Mostaza', 'Teja'] }, badge: '', orden: 2, destacado: 8,
    descripcion: 'Gorrito de punto elástico con doblez para ajustar el largo, en mostaza o teja.',
    imagenes: ['images/prod-gorrito-acanalado-1000x1250.webp', IMG_CONTEXTO_TEJIDOS],
    alt: 'Dos gorritos tejidos acanalados, uno mostaza y otro color teja', tags: ['gorro', 'gorrito', 'mostaza', 'teja', 'abrigo', 'invierno'],
  },
  {
    id: 'bea-03', slug: 'manta-crochet-degrade-rosa', nombre: 'Manta crochet degradé rosa', categoria: 'mantas', tecnica: 'Crochet',
    precio: 58900, descuento: 0, stock: 4, variante: null, badge: '', orden: 3, destacado: 3,
    descripcion: 'Franjas de coral, rosa, crudo y fucsia tejidas al crochet. Se enrolla fácil para llevarla en el bolso.',
    imagenes: ['images/prod-manta-degrade-rosa-1000x1250.webp'],
    alt: 'Manta tejida al crochet en franjas coral, rosa, crudo y fucsia, enrollada', tags: ['manta', 'mantita', 'degrade', 'coral', 'fucsia', 'rosa', 'cuna'],
  },
  {
    id: 'bea-04', slug: 'set-siesta-osito', nombre: 'Set siesta osito', categoria: 'sets', tecnica: 'Crochet',
    precio: 49900, descuento: 0, stock: 4, variante: { nombre: 'Talle', valores: ['0-3 meses', '3-6 meses'] }, badge: 'nuevo', orden: 4, destacado: 5,
    descripcion: 'Gorrito con orejitas y osito de crochet haciendo juego, en color miel. Para las primeras fotos y las siestas largas.',
    imagenes: ['images/prod-set-siesta-1000x1250.webp', 'images/hero-bebe-gorrito-osito-1600x1280.webp'],
    alt: 'Bebé dormido con gorrito tejido con orejitas y osito de crochet color miel', tags: ['set', 'regalo', 'gorrito', 'osito', 'miel', 'nacimiento', 'fotos'],
  },
  {
    id: 'bea-05', slug: 'osito-con-jardinero', nombre: 'Osito con jardinero', categoria: 'apego', tecnica: 'Dos agujas',
    precio: 29500, descuento: 0, stock: 5, variante: null, badge: '', orden: 5, destacado: 0,
    descripcion: 'Osito tejido en gris topo con jardinero verde. Blandito y chiquito, entra en la mano de un adulto.',
    imagenes: ['images/prod-osito-jardinero-1000x1250.webp', IMG_CONTEXTO_TEJIDOS],
    alt: 'Osito tejido gris con jardinero verde sobre una manta de punto arroz', tags: ['osito', 'muneco', 'apego', 'jardinero', 'verde', 'peluche'],
  },
  {
    id: 'bea-06', slug: 'escarpines-conejito', nombre: 'Escarpines conejito', categoria: 'escarpines', tecnica: 'Crochet',
    precio: 18500, descuento: 0, stock: 6, variante: { nombre: 'Talle', valores: ['0-3 meses', '3-6 meses', '6-12 meses'] }, badge: 'nuevo', orden: 6, destacado: 2,
    descripcion: 'Escarpines con orejitas y carita de conejo bordada. Caña alta para doblar y abrigar el tobillo.',
    imagenes: ['images/prod-escarpines-conejito-1000x1250.webp', 'images/firma-escarpines-conejito-1600x1067.webp'],
    alt: 'Escarpines tejidos con orejitas y carita de conejo en los pies de un bebé', tags: ['escarpines', 'conejo', 'zapatitos', 'pies', 'abrigo'],
  },
  {
    id: 'bea-07', slug: 'corazon-de-apego', nombre: 'Corazón de apego', categoria: 'apego', tecnica: 'Crochet',
    precio: 18900, descuento: 0, stock: 10, variante: null, badge: '', orden: 7, destacado: 4,
    descripcion: 'Un corazón tejido al crochet en rosa suave, del tamaño de su mano, para acompañar la siesta y los mimos.',
    imagenes: ['images/prod-corazon-apego-1000x1250.webp', 'images/firma-corazon-apego-1600x1067.webp'],
    alt: 'Corazón tejido al crochet en rosa suave junto a los pies de un bebé', tags: ['corazon', 'apego', 'dormir', 'siesta', 'amor', 'rosa'],
  },
  {
    id: 'bea-08', slug: 'set-bienvenida-tejido', nombre: 'Set bienvenida tejido', categoria: 'sets', tecnica: 'Dos agujas',
    precio: 124900, descuento: 10, stock: 2, variante: null, badge: '', orden: 8, destacado: 0,
    descripcion: 'Gorrito acanalado, escarpines lisos, osito con jardinero y manta punto arroz, en tonos naturales. Todo lo tejido para recibirlo.',
    imagenes: ['images/prod-set-bienvenida-1000x1250.webp', IMG_CONTEXTO_TEJIDOS],
    alt: 'Set tejido con gorritos, escarpines, osito y manta en tonos naturales', tags: ['set', 'regalo', 'nacimiento', 'baby shower', 'manta', 'gorro', 'osito', 'escarpines'],
  },
  {
    id: 'bea-09', slug: 'portachupete-bolitas', nombre: 'Portachupete de bolitas', categoria: 'sonajeros', tecnica: 'Armado a mano',
    precio: 13500, descuento: 0, stock: 12, variante: null, badge: '', orden: 9, destacado: 6,
    descripcion: 'Cordón con bolitas de colores, una llamita arcoíris y argolla para el chupete. Se engancha a la ropa para salir.',
    imagenes: ['images/prod-portachupete-bolitas-1000x1250.webp'],
    alt: 'Portachupete de bolitas de colores con llamita y chupete sobre madera', tags: ['portachupete', 'chupete', 'llama', 'bolitas', 'paseo'],
  },
  {
    id: 'bea-10', slug: 'gorrito-osito-con-orejitas', nombre: 'Gorrito osito con orejitas', categoria: 'gorritos', tecnica: 'Crochet',
    precio: 21500, descuento: 0, stock: 7, variante: { nombre: 'Talle', valores: ['0-3 meses', '3-6 meses'] }, badge: '', orden: 10, destacado: 0,
    descripcion: 'Gorrito color miel con orejitas redondas y tiras para atar debajo del mentón.',
    imagenes: ['images/prod-gorrito-orejitas-1000x1250.webp', 'images/hero-bebe-gorrito-osito-1600x1280.webp'],
    alt: 'Bebé dormido con gorrito tejido color miel con orejitas de osito', tags: ['gorro', 'gorrito', 'osito', 'orejas', 'miel', 'abrigo'],
  },
  {
    id: 'bea-11', slug: 'escarpines-lisos', nombre: 'Escarpines lisos', categoria: 'escarpines', tecnica: 'Dos agujas',
    precio: 15900, descuento: 0, stock: 11, variante: { nombre: 'Talle', valores: ['0-3 meses', '3-6 meses', '6-12 meses'] }, badge: '', orden: 11, destacado: 0,
    descripcion: 'Escarpines tejidos en gris topo melange, lisos y con caña. Combinan con todo lo natural.',
    imagenes: ['images/prod-escarpines-lisos-1000x1250.webp', IMG_CONTEXTO_TEJIDOS],
    alt: 'Par de escarpines tejidos lisos en gris topo', tags: ['escarpines', 'medias', 'pies', 'gris', 'topo', 'abrigo'],
  },
  {
    id: 'bea-12', slug: 'manta-trenzas-rosa', nombre: 'Manta de trenzas rosa', categoria: 'mantas', tecnica: 'Dos agujas',
    precio: 69900, descuento: 10, stock: 3, variante: null, badge: '', orden: 12, destacado: 7,
    descripcion: 'Manta con trenzas y puntos calados en rosa empolvado, para envolverlo en brazos o taparlo en el cochecito.',
    imagenes: ['images/prod-manta-trenzas-rosa-1000x1250.webp', 'images/firma-manta-trenzas-1600x1067.webp'],
    alt: 'Bebé envuelto en una manta rosa tejida con trenzas, en brazos de su mamá', tags: ['manta', 'mantita', 'trenzas', 'rosa', 'cochecito', 'nacimiento'],
  },
  {
    id: 'bea-13', slug: 'vincha-con-mono', nombre: 'Vincha con moño', categoria: 'gorritos', tecnica: 'Costura',
    precio: 9800, descuento: 0, stock: 15, variante: { nombre: 'Color', valores: ['Crudo', 'Arena'] }, badge: '', orden: 13, destacado: 0,
    descripcion: 'Vincha de tela acanalada con un moño grande y mullido, en crudo o arena.',
    imagenes: ['images/prod-vinchas-mono-1000x1250.webp'],
    alt: 'Dos vinchas de tela acanalada con moño grande en crudo y arena', tags: ['vincha', 'mono', 'moño', 'pelo', 'crudo', 'arena'],
  },
  {
    id: 'bea-14', slug: 'manta-punto-arroz', nombre: 'Manta punto arroz', categoria: 'mantas', tecnica: 'Dos agujas',
    precio: 64500, descuento: 0, stock: 0, variante: null, badge: '', orden: 14, destacado: 0,
    descripcion: 'Tejida a dos agujas en punto arroz, color natural y con caída suave.',
    imagenes: ['images/prod-manta-punto-arroz-1000x1250.webp', IMG_CONTEXTO_TEJIDOS],
    alt: 'Manta tejida en punto arroz color natural con pliegues', tags: ['manta', 'mantita', 'punto arroz', 'natural', 'cuna'],
  },
];

const PALETAS = [
  { nombre: 'Original', vars: { '--color-bg': '#F9FAFB', '--color-bg-alt': '#FFF0FC', '--color-text': '#211221', '--color-text-muted': '#6A546A', '--color-primary': '#FF00FF', '--color-secondary': '#FFFFFF', '--color-cta': '#B000B0', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Frutilla', vars: { '--color-bg': '#FBF8F7', '--color-bg-alt': '#FDEEF1', '--color-text': '#2A1117', '--color-text-muted': '#6E5258', '--color-primary': '#FF4F8B', '--color-secondary': '#FFFFFF', '--color-cta': '#B8104A', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Lavanda', vars: { '--color-bg': '#F8F8FC', '--color-bg-alt': '#EFEDFB', '--color-text': '#1C1631', '--color-text-muted': '#5C5771', '--color-primary': '#A58BFF', '--color-secondary': '#FFFFFF', '--color-cta': '#5A3DCC', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Menta', vars: { '--color-bg': '#F6FAF8', '--color-bg-alt': '#E8F5EE', '--color-text': '#10241C', '--color-text-muted': '#4C6158', '--color-primary': '#3FD99A', '--color-secondary': '#FFFFFF', '--color-cta': '#0A7350', '--color-cta-text': '#FFFFFF' } },
  { nombre: 'Durazno', vars: { '--color-bg': '#FBF7F2', '--color-bg-alt': '#F9EADF', '--color-text': '#2B1A11', '--color-text-muted': '#6A5649', '--color-primary': '#FF9B63', '--color-secondary': '#FFFFFF', '--color-cta': '#A8481A', '--color-cta-text': '#FFFFFF' } },
];

const ICONO_CORAZON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getPorSlug = slug => PRODUCTOS.find(p => p.slug === slug);
const varianteDefault = p => p?.variante?.valores?.[0] || '';
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const wspHref = texto => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
const guardar = (key, valor) => { try { localStorage.setItem(key, valor); return true; } catch { return false; } };
const intentar = fn => { try { fn(); return true; } catch { return false; } };

const Cart = {
  KEY: 'bruneesamor_cart',
  get() {
    let raw;
    try { raw = JSON.parse(localStorage.getItem(this.KEY)); } catch { raw = null; }
    if (!Array.isArray(raw)) return [];
    return raw.reduce((lista, i) => {
      const p = i && typeof i.id === 'string' ? getProducto(i.id) : null;
      if (!p || p.stock <= 0) return lista;
      const valores = p.variante?.valores || [];
      const variante = valores.includes(i.variante) ? i.variante : (valores[0] || '');
      const qty = Math.max(1, Math.min(Number.isFinite(Number(i.qty)) ? Math.floor(Number(i.qty)) : 1, p.stock));
      const repetido = lista.find(x => x.id === p.id && x.variante === variante);
      if (repetido) repetido.qty = Math.min(repetido.qty + qty, p.stock);
      else lista.push({ id: p.id, variante, qty });
      return lista;
    }, []);
  },
  save(items) {
    guardar(this.KEY, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1, variante = '') {
    if (!producto || producto.stock <= 0) return false;
    const v = producto.variante?.valores?.includes(variante) ? variante : varianteDefault(producto);
    const cantidad = Math.max(1, Math.floor(Number(qty)) || 1);
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.variante === v);
    if (existing) existing.qty = Math.min(existing.qty + cantidad, producto.stock ?? 99);
    else items.push({ id: producto.id, variante: v, qty: Math.min(cantidad, producto.stock ?? 99) });
    this.save(items);
    return true;
  },
  setQty(id, variante, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.variante === variante);
    if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(Math.floor(Number(qty)) || 1, p?.stock ?? 99));
    this.save(items);
  },
  remove(id, variante) { this.save(this.get().filter(i => !(i.id === id && i.variante === variante))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const Favoritos = {
  KEY: 'bruneesamor_wishlist',
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      return Array.isArray(v) ? [...new Set(v.filter(id => typeof id === 'string' && getProducto(id)))] : [];
    } catch { return []; }
  },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    if (!getProducto(id)) return false;
    const lista = this.get();
    const i = lista.indexOf(id);
    if (i >= 0) lista.splice(i, 1); else lista.push(id);
    guardar(this.KEY, JSON.stringify(lista));
    document.dispatchEvent(new CustomEvent('favs:updated'));
    return i < 0;
  },
};

const estadoInicial = () => ({ q: '', cat: 'todo', tecnica: '', talle: '', precio: '', favoritos: false, orden: 'destacados', pagina: 1 });

function textoBuscable(p) {
  const cat = CATEGORIAS.find(c => c.id === p.categoria)?.nombre || '';
  return normalizar([p.nombre, cat, p.tecnica, p.descripcion, ...(p.tags || []), ...(p.variante?.valores || [])].join(' '));
}

function filtrarProductos(productos, estado, favIds = []) {
  const tokens = normalizar(estado.q).split(/\s+/).filter(Boolean);
  const rango = RANGOS_PRECIO.find(r => r.id === estado.precio);
  const lista = productos.filter(p => {
    if (estado.cat && estado.cat !== 'todo' && p.categoria !== estado.cat) return false;
    if (estado.tecnica && p.tecnica !== estado.tecnica) return false;
    if (estado.talle && !(p.variante?.nombre === 'Talle' && p.variante.valores.includes(estado.talle))) return false;
    if (rango) {
      const f = precioFinal(p);
      if (f <= rango.min || f > rango.max) return false;
    }
    if (estado.favoritos && !favIds.includes(p.id)) return false;
    if (tokens.length) {
      const t = textoBuscable(p);
      if (!tokens.every(k => t.includes(k))) return false;
    }
    return true;
  });
  const orden = {
    'precio-asc': (a, b) => precioFinal(a) - precioFinal(b),
    'precio-desc': (a, b) => precioFinal(b) - precioFinal(a),
    nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
  }[estado.orden] || ((a, b) => (a.stock > 0 ? 0 : 1) - (b.stock > 0 ? 0 : 1) || a.orden - b.orden);
  return [...lista].sort(orden);
}

function filtrosActivos(estado) {
  return [estado.cat !== 'todo', !!estado.tecnica, !!estado.talle, !!estado.precio, estado.favoritos, !!estado.q.trim()].filter(Boolean).length;
}

function mensajePedido(items) {
  const lineas = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return null;
    return `${i.qty}x ${p.nombre}${i.variante ? ' | ' + i.variante : ''} | ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }).filter(Boolean);
  const total = items.reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0);
  return ['Hola BruneEsAmor, quiero hacer este pedido:', '', ...lineas, '', `Total: ${formatearPrecio(total)}`, '', '¿Me confirman disponibilidad y cómo seguimos?'].join('\n');
}

function precioHTML(p) {
  const f = precioFinal(p);
  return p.descuento > 0
    ? `<p class="prod-precio"><span class="precio-final is-oferta">${formatearPrecio(f)}</span><s class="precio-orig">${formatearPrecio(p.precio)}</s><span class="precio-off">-${p.descuento}%</span></p>`
    : `<p class="prod-precio"><span class="precio-final">${formatearPrecio(f)}</span></p>`;
}

function cardHTML(p, opts = {}) {
  const tag = opts.tag || 'li';
  const anim = opts.animar === false ? '' : ` data-animate style="${opts.desde || 'transform:translateY(44px);opacity:0'}"`;
  const fav = (opts.favs || []).includes(p.id);
  const agotado = p.stock <= 0;
  const badge = agotado
    ? '<span class="etiqueta prod-badge is-agotado">Agotado</span>'
    : p.badge === 'nuevo' ? '<span class="etiqueta prod-badge">Nuevo</span>' : '';
  const acciones = agotado
    ? `<div class="prod-actions"><a class="btn btn-ghost prod-consulta" href="${esc(wspHref(`Hola BruneEsAmor, quiero consultar si vuelve a haber ${p.nombre}.`))}" target="_blank" rel="noopener noreferrer">Consultar</a></div>`
    : `<div class="prod-actions">
        <div class="stepper">
          <button type="button" class="step-btn" data-step="-1" aria-label="Restar una unidad de ${esc(p.nombre)}">−</button>
          <input class="step-val" type="number" inputmode="numeric" min="1" max="${p.stock}" value="1" aria-label="Cantidad de ${esc(p.nombre)}">
          <button type="button" class="step-btn" data-step="1" aria-label="Sumar una unidad de ${esc(p.nombre)}">+</button>
        </div>
        <button type="button" class="btn btn-cta prod-add" data-add="${p.id}"><span class="lbl-largo">Agregar al carrito</span><span class="lbl-corto">Agregar</span></button>
      </div>
      <button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>`;
  return `<${tag} class="prod-card${agotado ? ' is-agotado' : ''}" data-id="${p.id}"${anim}>
    <div class="prod-media">
      <button type="button" class="prod-img-btn" data-quick="${p.id}" aria-label="Ver la ficha de ${esc(p.nombre)}">
        <img src="${p.imagenes[0]}" width="1000" height="1250" alt="${esc(p.alt)}" decoding="async">
      </button>
      ${badge}
      <button type="button" class="prod-fav" data-fav="${p.id}" aria-pressed="${fav}" aria-label="${fav ? 'Quitar' : 'Guardar'} ${esc(p.nombre)} ${fav ? 'de' : 'en'} favoritas">${ICONO_CORAZON}</button>
      <span class="prod-quick" aria-hidden="true">Vista rápida</span>
    </div>
    <div class="prod-body">
      <h3 class="prod-nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="prod-tecnica">${esc(p.tecnica)}${p.variante?.nombre === 'Talle' ? ' · por talle' : ''}</p>
      ${precioHTML(p)}
      ${acciones}
    </div>
  </${tag}>`;
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

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

let revealsListos = false;
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

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  nuevos.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`; });
  setTimeout(() => nuevos.forEach(el => el.classList.add('in')), 40);
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
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
  cart?.addEventListener('click', () => openCartDrawer(cart));
  sync();
}

function initWspLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => { a.href = wspHref(a.dataset.wspMsg); });
}

function scrollATienda() {
  document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function initBuscarHeader() {
  document.getElementById('searchBtn')?.addEventListener('click', () => {
    scrollATienda();
    setTimeout(() => document.getElementById('buscar')?.focus({ preventScroll: true }), reduceMotion ? 0 : 650);
  });
}

function initCategorias() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map(c => {
    const n = PRODUCTOS.filter(p => p.categoria === c.id).length;
    return `<li data-animate style="clip-path:inset(100% 0 0 0);opacity:0">
      <button type="button" class="cat-tile" data-cat="${c.id}" aria-label="Ver ${esc(c.nombre)} en la tienda">
        <img src="${c.img}" width="1000" height="1250" alt="${esc(c.alt)}" decoding="async">
        <span class="cat-label"><span class="etiqueta">${n} ${n === 1 ? 'pieza' : 'piezas'}</span><span class="cat-nombre">${esc(c.nombre)}</span></span>
      </button>
    </li>`;
  }).join('');
  grid.addEventListener('click', e => {
    const b = e.target.closest('[data-cat]');
    if (b) irAFiltro({ cat: b.dataset.cat });
  });
}

function initTecnicas() {
  const ul = document.getElementById('tecnicasLista');
  if (!ul) return;
  ul.innerHTML = TECNICAS.map(t => {
    const n = PRODUCTOS.filter(p => p.tecnica === t).length;
    return n ? `<li><button type="button" class="tecnica-link" data-tecnica="${esc(t)}">${esc(t)} <span>${n} ${n === 1 ? 'pieza' : 'piezas'}</span></button></li>` : '';
  }).join('');
  ul.addEventListener('click', e => {
    const b = e.target.closest('[data-tecnica]');
    if (b) irAFiltro({ tecnica: b.dataset.tecnica });
  });
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      intentar(() => vp.setPointerCapture?.(pointerId));
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      intentar(() => vp.releasePointerCapture?.(pointerId));
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initRail() {
  const vp = document.getElementById('railVp');
  const track = document.getElementById('railTrack');
  if (!vp || !track) return;
  const favs = Favoritos.get();
  const lista = PRODUCTOS.filter(p => p.destacado > 0 && p.stock > 0).sort((a, b) => a.destacado - b.destacado).slice(0, 8);
  track.innerHTML = lista.map(p => cardHTML(p, { favs, desde: 'transform:translateX(64px);opacity:0' })).join('');
  track.querySelectorAll('[data-animate]').forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.14, 0.7)}s`; });
  initRailDrag(vp);
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const paso = () => {
    const card = track.querySelector('.prod-card');
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 16;
    return card ? (card.getBoundingClientRect().width + gap) * 2 : 560;
  };
  const sync = () => {
    if (prev) prev.disabled = vp.scrollLeft <= 8;
    if (next) next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 8;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('load', sync);
  sync();
}

function pulso(el) {
  if (!el) return;
  el.classList.remove('agregado'); void el.offsetWidth; el.classList.add('agregado');
}

function avisarAgregado(p, qty, variante) {
  showToast(`${qty > 1 ? qty + ' × ' : ''}${p.nombre}${variante ? ' (' + variante + ')' : ''} ya está en tu carrito.`);
}

function syncFavBotones(id) {
  const p = getProducto(id);
  if (!p) return;
  const on = Favoritos.has(id);
  document.querySelectorAll(`[data-fav="${id}"]`).forEach(b => {
    b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', `${on ? 'Quitar' : 'Guardar'} ${p.nombre} ${on ? 'de' : 'en'} favoritas`);
    b.classList.remove('late'); void b.offsetWidth;
    if (on && !reduceMotion) b.classList.add('late');
  });
}

function initCardAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const input = step.parentElement?.querySelector('.step-val');
      if (!input) return;
      const max = Number(input.max) || 99;
      input.value = Math.max(1, Math.min(max, (Number(input.value) || 1) + Number(step.dataset.step)));
      return;
    }
    const add = e.target.closest('[data-add], [data-buy]');
    if (add) {
      const p = getProducto(add.dataset.add || add.dataset.buy);
      if (!p) return;
      const qty = Number(add.closest('.prod-card')?.querySelector('.step-val')?.value) || 1;
      if (!Cart.add(p, qty)) return;
      if (add.dataset.buy) openCartDrawer(add);
      else { avisarAgregado(p, qty, varianteDefault(p)); pulso(add); }
      return;
    }
    const addSlug = e.target.closest('[data-add-slug]');
    if (addSlug) {
      const p = getPorSlug(addSlug.dataset.addSlug);
      if (p && Cart.add(p, 1)) { avisarAgregado(p, 1, varianteDefault(p)); pulso(addSlug); }
      return;
    }
    const fav = e.target.closest('[data-fav]');
    if (fav) {
      const p = getProducto(fav.dataset.fav);
      if (!p) return;
      const activo = Favoritos.toggle(p.id);
      syncFavBotones(p.id);
      showToast(activo ? `Guardaste ${p.nombre} en tus favoritas.` : `Sacaste ${p.nombre} de tus favoritas.`);
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) abrirQuickView(quick.dataset.quick, quick);
  });
  document.addEventListener('change', e => {
    if (!e.target.matches('.step-val')) return;
    const max = Number(e.target.max) || 99;
    e.target.value = Math.max(1, Math.min(max, Math.floor(Number(e.target.value)) || 1));
  });
}

const estado = estadoInicial();

function chipHTML(filtro, valor, texto, n) {
  return `<button type="button" class="chip" data-filtro="${filtro}" data-valor="${esc(valor)}" aria-pressed="false">${esc(texto)}${n !== undefined ? ` <span class="chip-n">${n}</span>` : ''}</button>`;
}

function syncControles() {
  document.querySelectorAll('.chip[data-filtro]').forEach(c => {
    const f = c.dataset.filtro;
    c.setAttribute('aria-pressed', String(estado[f] === c.dataset.valor));
  });
  const favChip = document.getElementById('chipFavoritos');
  if (favChip) favChip.setAttribute('aria-pressed', String(estado.favoritos));
  const buscar = document.getElementById('buscar');
  if (buscar && buscar.value !== estado.q) buscar.value = estado.q;
  const orden = document.getElementById('orden');
  if (orden) orden.value = estado.orden;
}

function syncFavCount() {
  const el = document.getElementById('favCount');
  if (el) el.textContent = `(${Favoritos.get().length})`;
}

function renderCatalogo({ append = false } = {}) {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const favs = Favoritos.get();
  const lista = filtrarProductos(PRODUCTOS, estado, favs);
  const visibles = lista.slice(0, estado.pagina * POR_PAGINA);
  if (append) {
    const ya = grid.children.length;
    grid.insertAdjacentHTML('beforeend', visibles.slice(ya).map(p => cardHTML(p, { favs })).join(''));
  } else {
    grid.innerHTML = visibles.map(p => cardHTML(p, { favs })).join('');
  }
  revelarNuevos(grid);
  const vacio = document.getElementById('catalogoVacio');
  if (vacio) vacio.hidden = lista.length > 0;
  grid.hidden = lista.length === 0;
  const verMas = document.getElementById('verMas');
  if (verMas) verMas.hidden = visibles.length >= lista.length;
  const n = filtrosActivos(estado);
  const resultados = document.getElementById('resultados');
  if (resultados) resultados.textContent = n ? `${lista.length} de ${PRODUCTOS.length} piezas` : `${lista.length} ${lista.length === 1 ? 'pieza' : 'piezas'}`;
  const limpiar = document.getElementById('limpiarFiltros');
  if (limpiar) limpiar.hidden = n === 0;
  const filtrosN = document.getElementById('filtrosN');
  if (filtrosN) { filtrosN.textContent = n; filtrosN.hidden = n === 0; }
  syncControles();
  syncFavCount();
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function irAFiltro(parcial) {
  Object.assign(estado, estadoInicial(), parcial);
  renderCatalogo();
  scrollATienda();
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const contar = fn => PRODUCTOS.filter(fn).length;
  const chipsCat = document.getElementById('chipsCat');
  if (chipsCat) chipsCat.innerHTML = chipHTML('cat', 'todo', 'Todo', PRODUCTOS.length) + CATEGORIAS.map(c => chipHTML('cat', c.id, c.nombre, contar(p => p.categoria === c.id))).join('');
  const chipsTecnica = document.getElementById('chipsTecnica');
  if (chipsTecnica) chipsTecnica.innerHTML = TECNICAS.map(t => chipHTML('tecnica', t, t, contar(p => p.tecnica === t))).join('');
  const chipsTalle = document.getElementById('chipsTalle');
  if (chipsTalle) chipsTalle.innerHTML = TALLES.map(t => chipHTML('talle', t, t, contar(p => p.variante?.nombre === 'Talle' && p.variante.valores.includes(t)))).join('');
  const chipsPrecio = document.getElementById('chipsPrecio');
  if (chipsPrecio) chipsPrecio.innerHTML = RANGOS_PRECIO.map(r => chipHTML('precio', r.id, r.nombre, contar(p => precioFinal(p) > r.min && precioFinal(p) <= r.max))).join('');

  document.querySelector('.tienda')?.addEventListener('click', e => {
    const chip = e.target.closest('.chip[data-filtro]');
    if (!chip) return;
    const f = chip.dataset.filtro;
    const v = chip.dataset.valor;
    if (f === 'cat') estado.cat = v;
    else estado[f] = estado[f] === v ? '' : v;
    estado.pagina = 1;
    renderCatalogo();
  });

  document.getElementById('chipFavoritos')?.addEventListener('click', () => {
    estado.favoritos = !estado.favoritos;
    estado.pagina = 1;
    renderCatalogo();
    if (estado.favoritos && !Favoritos.get().length) showToast('Todavía no guardaste favoritas: tocá el corazón de una pieza.');
  });

  let t;
  document.getElementById('buscar')?.addEventListener('input', e => {
    clearTimeout(t);
    t = setTimeout(() => { estado.q = e.target.value; estado.pagina = 1; renderCatalogo(); }, 180);
  });
  document.getElementById('orden')?.addEventListener('change', e => { estado.orden = e.target.value; estado.pagina = 1; renderCatalogo(); });

  const limpiar = () => { Object.assign(estado, estadoInicial()); renderCatalogo(); };
  document.getElementById('limpiarFiltros')?.addEventListener('click', limpiar);
  document.getElementById('vacioLimpiar')?.addEventListener('click', limpiar);
  document.getElementById('verMas')?.addEventListener('click', () => { estado.pagina += 1; renderCatalogo({ append: true }); });

  const toggle = document.getElementById('filtrosToggle');
  const panel = document.getElementById('filtrosPanel');
  toggle?.addEventListener('click', () => {
    const abierto = panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(abierto));
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });

  document.addEventListener('favs:updated', () => {
    syncFavCount();
    if (estado.favoritos) renderCatalogo();
  });
  renderCatalogo();
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

function trapFocus(cont, e) {
  if (e.key !== 'Tab') return;
  const els = [...cont.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
  if (!els.length) return;
  const first = els[0];
  const last = els[els.length - 1];
  if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
  else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
}

let drawerTrigger = null;
let drawerTimer = null;

function renderDrawer(animar = false) {
  const items = Cart.get();
  const ul = document.getElementById('drawerItems');
  if (!ul) return;
  ul.innerHTML = items.map((i, n) => {
    const p = getProducto(i.id);
    return `<li class="drawer-item${animar ? ' entra' : ''}" style="animation-delay:${animar ? (n * 0.06).toFixed(2) : 0}s" data-linea="${p.id}|${esc(i.variante)}">
      <div class="drawer-item-img"><img src="${p.imagenes[0]}" width="1000" height="1250" alt="${esc(p.alt)}"></div>
      <div>
        <p class="drawer-item-nombre">${esc(p.nombre)}</p>
        ${i.variante ? `<p class="drawer-item-var">${esc(p.variante.nombre)}: ${esc(i.variante)}</p>` : ''}
        <p class="drawer-item-var">${formatearPrecio(precioFinal(p))} c/u</p>
        <div class="stepper">
          <button type="button" class="step-btn" data-linea-step="-1" aria-label="Restar una unidad de ${esc(p.nombre)}">−</button>
          <input class="step-val" data-linea-val type="number" inputmode="numeric" min="1" max="${p.stock}" value="${i.qty}" aria-label="Cantidad de ${esc(p.nombre)}">
          <button type="button" class="step-btn" data-linea-step="1" aria-label="Sumar una unidad de ${esc(p.nombre)}">+</button>
        </div>
      </div>
      <div class="drawer-item-der">
        <span class="drawer-item-sub">${formatearPrecio(precioFinal(p) * i.qty)}</span>
        <button type="button" class="drawer-quitar" data-quitar>Quitar</button>
      </div>
    </li>`;
  }).join('');
  const vacio = document.getElementById('drawerVacio');
  const foot = document.getElementById('drawerFoot');
  if (vacio) vacio.hidden = items.length > 0;
  if (foot) foot.hidden = items.length === 0;
  ul.hidden = items.length === 0;
  const total = document.getElementById('drawerTotal');
  if (total) total.textContent = formatearPrecio(Cart.total());
  const count = document.getElementById('drawerCount');
  if (count) { const n = Cart.count(); count.textContent = n ? `(${n})` : ''; }
  const wsp = document.getElementById('cartWsp');
  if (wsp && items.length) wsp.href = wspHref(mensajePedido(items));
}

function openCartDrawer(trigger) {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || !bd) return;
  if (!document.getElementById('qvBackdrop')?.hidden) cerrarQuickView(false);
  clearTimeout(drawerTimer);
  drawerTrigger = trigger || document.activeElement;
  renderDrawer(!reduceMotion);
  drawer.hidden = false;
  bd.hidden = false;
  setTimeout(() => { drawer.classList.add('open'); bd.classList.add('open'); }, 20);
  document.body.classList.add('no-scroll');
  setTimeout(() => document.getElementById('drawerClose')?.focus(), 40);
}

function closeCartDrawer(devolverFoco = true) {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || drawer.hidden) return;
  drawer.classList.remove('open');
  bd?.classList.remove('open');
  drawerTimer = setTimeout(() => { drawer.hidden = true; if (bd) bd.hidden = true; }, 380);
  if (document.getElementById('qvBackdrop')?.hidden) document.body.classList.remove('no-scroll');
  if (devolverFoco !== false) drawerTrigger?.focus?.();
}

function initDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const ul = document.getElementById('drawerItems');
  if (!drawer || !ul) return;
  document.getElementById('cartBtn')?.addEventListener('click', e => openCartDrawer(e.currentTarget));
  document.getElementById('drawerClose')?.addEventListener('click', () => closeCartDrawer());
  document.getElementById('drawerBackdrop')?.addEventListener('click', () => closeCartDrawer());
  document.getElementById('drawerVerTienda')?.addEventListener('click', () => closeCartDrawer(false));
  drawer.addEventListener('keydown', e => { if (e.key === 'Escape') closeCartDrawer(); else trapFocus(drawer, e); });
  ul.addEventListener('click', e => {
    const li = e.target.closest('[data-linea]');
    if (!li) return;
    const [id, variante] = li.dataset.linea.split('|');
    if (e.target.closest('[data-quitar]')) {
      Cart.remove(id, variante);
      document.getElementById('drawerClose')?.focus();
      return;
    }
    const st = e.target.closest('[data-linea-step]');
    if (!st) return;
    const actual = Cart.get().find(i => i.id === id && i.variante === variante);
    if (!actual) return;
    Cart.setQty(id, variante, actual.qty + Number(st.dataset.lineaStep));
    ul.querySelector(`[data-linea="${li.dataset.linea}"] [data-linea-step="${st.dataset.lineaStep}"]`)?.focus();
  });
  ul.addEventListener('change', e => {
    if (!e.target.matches('[data-linea-val]')) return;
    const [id, variante] = e.target.closest('[data-linea]').dataset.linea.split('|');
    Cart.setQty(id, variante, e.target.value);
  });
  document.getElementById('checkoutBtn')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => {
    updateCartBadge();
    if (!drawer.hidden) renderDrawer(false);
  });
}

let qvTrigger = null;
let qvTimer = null;

function mensajeConsulta(p, variante) {
  return `Hola BruneEsAmor, quiero consultar por ${p.nombre}${variante ? ' (' + variante + ')' : ''}.`;
}

function abrirQuickView(id, trigger) {
  const p = getProducto(id);
  const bd = document.getElementById('qvBackdrop');
  const body = document.getElementById('qvBody');
  if (!p || !bd || !body) return;
  if (bd.hidden) qvTrigger = trigger || document.activeElement;
  clearTimeout(qvTimer);
  const variante = varianteDefault(p);
  const cat = CATEGORIAS.find(c => c.id === p.categoria);
  const fav = Favoritos.has(p.id);
  const relacionados = [
    ...PRODUCTOS.filter(x => x.id !== p.id && x.categoria === p.categoria && x.stock > 0),
    ...PRODUCTOS.filter(x => x.id !== p.id && x.categoria !== p.categoria && x.tecnica === p.tecnica && x.stock > 0),
  ].slice(0, 3);
  body.dataset.id = p.id;
  body.dataset.variante = variante;
  body.innerHTML = `
    <div class="qv-galeria">
      <div class="qv-img"><img id="qvImg" src="${p.imagenes[0]}" width="1000" height="1250" alt="${esc(p.alt)}"></div>
      ${p.imagenes.length > 1 ? `<div class="qv-thumbs">${p.imagenes.map((src, i) => `<button type="button" class="qv-thumb" data-thumb="${src}" aria-pressed="${i === 0}" aria-label="${i === 0 ? 'Ver la foto de la pieza' : 'Ver la pieza en contexto'}"><img src="${src}" alt=""></button>`).join('')}</div>` : ''}
    </div>
    <div class="qv-info">
      <p class="etiqueta">${esc(cat?.nombre || '')} · ${esc(p.tecnica)}</p>
      <h2 id="qvTitle">${esc(p.nombre)}</h2>
      ${precioHTML(p)}
      <p class="qv-desc">${esc(p.descripcion)}</p>
      ${p.variante ? `<fieldset class="qv-var"><legend>${esc(p.variante.nombre)}</legend><div class="chips">${p.variante.valores.map((v, i) => `<button type="button" class="chip" data-var="${esc(v)}" aria-pressed="${i === 0}">${esc(v)}</button>`).join('')}</div></fieldset>` : ''}
      ${p.stock > 0 ? `<div class="qv-acciones">
        <div class="stepper">
          <button type="button" class="step-btn" data-step="-1" aria-label="Restar una unidad">−</button>
          <input class="step-val" id="qvQty" type="number" inputmode="numeric" min="1" max="${p.stock}" value="1" aria-label="Cantidad">
          <button type="button" class="step-btn" data-step="1" aria-label="Sumar una unidad">+</button>
        </div>
        <button type="button" class="btn btn-cta" id="qvAdd">Agregar al carrito</button>
        <button type="button" class="btn btn-ghost" id="qvBuy">Comprar ahora</button>
      </div>` : '<p class="qv-desc"><strong>Agotada por ahora.</strong> Escribinos y te avisamos cuando vuelva.</p>'}
      <div class="qv-mini">
        <button type="button" class="link-hilo qv-fav" data-fav="${p.id}" aria-pressed="${fav}" aria-label="${fav ? 'Quitar' : 'Guardar'} ${esc(p.nombre)} ${fav ? 'de' : 'en'} favoritas"><span>${fav ? 'Quitar de favoritas' : 'Guardar en favoritas'}</span></button>
        <a class="link-hilo" id="qvWsp" href="${esc(wspHref(mensajeConsulta(p, variante)))}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a>
      </div>
      ${relacionados.length ? `<div class="qv-rel"><p class="qv-rel-titulo">También te puede gustar</p><ul class="qv-rel-lista">${relacionados.map(r => `<li><button type="button" class="qv-rel-btn" data-quick="${r.id}"><span><img src="${r.imagenes[0]}" width="1000" height="1250" alt="${esc(r.alt)}"></span><span>${esc(r.nombre)}</span><span>${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>` : ''}
    </div>`;
  document.getElementById('quickView')?.scrollTo(0, 0);
  if (bd.hidden) {
    bd.hidden = false;
    document.body.classList.add('no-scroll');
    setTimeout(() => bd.classList.add('open'), 20);
  }
  setTimeout(() => document.getElementById('qvClose')?.focus(), 40);
  intentar(() => window.history.replaceState(null, '', `?producto=${p.slug}${location.hash}`));
}

function cerrarQuickView(devolverFoco = true) {
  const bd = document.getElementById('qvBackdrop');
  if (!bd || bd.hidden) return;
  bd.classList.remove('open');
  qvTimer = setTimeout(() => { bd.hidden = true; }, 300);
  if (document.getElementById('cartDrawer')?.hidden) document.body.classList.remove('no-scroll');
  intentar(() => window.history.replaceState(null, '', location.pathname + location.hash));
  if (devolverFoco) qvTrigger?.focus?.();
}

function initQuickView() {
  const bd = document.getElementById('qvBackdrop');
  const body = document.getElementById('qvBody');
  const qv = document.getElementById('quickView');
  if (!bd || !body || !qv) return;
  document.getElementById('qvClose')?.addEventListener('click', () => cerrarQuickView());
  bd.addEventListener('click', e => { if (e.target === bd) cerrarQuickView(); });
  qv.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarQuickView(); else trapFocus(qv, e); });
  body.addEventListener('click', e => {
    const p = getProducto(body.dataset.id);
    if (!p) return;
    const thumb = e.target.closest('[data-thumb]');
    if (thumb) {
      const img = document.getElementById('qvImg');
      if (img) img.src = thumb.dataset.thumb;
      body.querySelectorAll('[data-thumb]').forEach(t => t.setAttribute('aria-pressed', String(t === thumb)));
      return;
    }
    const chip = e.target.closest('[data-var]');
    if (chip) {
      body.dataset.variante = chip.dataset.var;
      body.querySelectorAll('[data-var]').forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
      const wsp = document.getElementById('qvWsp');
      if (wsp) wsp.href = wspHref(mensajeConsulta(p, chip.dataset.var));
      return;
    }
    const add = e.target.closest('#qvAdd, #qvBuy');
    if (add) {
      const qty = Number(document.getElementById('qvQty')?.value) || 1;
      if (!Cart.add(p, qty, body.dataset.variante)) return;
      if (add.id === 'qvBuy') { cerrarQuickView(false); openCartDrawer(qvTrigger); }
      else { avisarAgregado(p, qty, body.dataset.variante); pulso(add); }
    }
  });
}

function abrirDesdeUrl() {
  const slug = new URLSearchParams(location.search).get('producto');
  const p = slug ? getPorSlug(slug) : null;
  if (p) abrirQuickView(p.id, document.getElementById('tienda'));
}

function initFirma() {
  const track = document.getElementById('firmaTrack');
  if (!track) return;
  const textos = [...track.querySelectorAll('.firma-texto')];
  const shots = [...track.querySelectorAll('.shot')];
  const marcas = [...track.querySelectorAll('.marca')];
  const hora = document.getElementById('firmaHora');
  const momento = document.getElementById('firmaMomento');
  if (!textos.length) return;
  const N = Math.min(textos.length, 4);
  let actual = -1;

  const activar = i => {
    if (i === actual) return;
    actual = i;
    textos.forEach((x, n) => { const on = n === i; x.classList.toggle('is-on', on); x.inert = !on; x.setAttribute('aria-hidden', String(!on)); });
    shots.forEach((s, n) => s.classList.toggle('is-on', n === i));
    marcas.forEach((m, n) => { m.classList.toggle('is-on', n === i); m.classList.toggle('is-pasada', n < i); m.setAttribute('aria-current', n === i ? 'step' : 'false'); });
    if (hora) {
      hora.textContent = textos[i].dataset.hora;
      hora.classList.remove('cambia'); void hora.offsetWidth;
      if (!reduceMotion) hora.classList.add('cambia');
    }
    if (momento) momento.textContent = textos[i].dataset.momento;
  };

  const progreso = () => {
    const r = track.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    return total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
  };

  const calcular = () => {
    const p = progreso();
    const i = Math.min(N - 1, Math.floor(p * N * 0.9999));
    activar(i);
    if (reduceMotion) return;
    const local = Math.min(1, Math.max(0, p * N - i));
    const img = shots[i]?.querySelector('img');
    if (img) img.style.transform = `scale(${(1.08 - local * 0.08).toFixed(4)})`;
  };

  let pedido = false;
  const pedir = () => { if (pedido) return; pedido = true; requestAnimationFrame(() => { pedido = false; calcular(); }); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', calcular);
  marcas.forEach((m, n) => m.addEventListener('click', () => {
    const total = track.offsetHeight - window.innerHeight;
    const top = window.scrollY + track.getBoundingClientRect().top + total * ((n + 0.5) / N);
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }));
  calcular();
}

function initHero() {
  const piezas = document.querySelectorAll('[data-hero]');
  const trazo = document.querySelector('.hilo-trazo');
  if (typeof gsap === 'undefined' || reduceMotion) {
    piezas.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
    if (trazo) trazo.style.strokeDashoffset = '0';
    return;
  }
  const copy = [...document.querySelectorAll('.hero-copy [data-hero]')];
  const fotos = [...document.querySelectorAll('.hero-collage .pieza')];
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.to(copy[0], { y: 0, opacity: 1, duration: .8 })
    .to('.hero-title', { clipPath: 'inset(0 0 0% 0)', y: 0, opacity: 1, duration: 1.1, clearProps: 'clipPath' }, .1)
    .to(copy.slice(2), { y: 0, opacity: 1, duration: .8, stagger: .12 }, .38)
    .to(fotos, { y: 0, rotation: 0, scale: 1, opacity: 1, duration: 1.2, stagger: .14, ease: 'back.out(1.3)' }, .15)
    .to('.colgante', { y: 0, rotation: 0, opacity: 1, duration: 1, ease: 'elastic.out(1, .6)' }, .95);
  if (trazo) tl.to(trazo, { strokeDashoffset: 0, duration: 1.7, ease: 'power2.inOut' }, .55);
  setTimeout(() => { if (tl.progress() < 1) tl.progress(1); }, 3000);

  const collage = document.getElementById('heroCollage');
  if (collage && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const capas = [...collage.querySelectorAll('[data-depth]')];
    collage.addEventListener('pointermove', e => {
      const r = collage.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - .5;
      const dy = (e.clientY - r.top) / r.height - .5;
      capas.forEach(c => {
        const d = Number(c.dataset.depth) || 6;
        c.style.setProperty('--px', `${(-dx * d).toFixed(1)}px`);
        c.style.setProperty('--py', `${(-dy * d).toFixed(1)}px`);
      });
    });
    collage.addEventListener('pointerleave', () => capas.forEach(c => { c.style.setProperty('--px', '0px'); c.style.setProperty('--py', '0px'); }));
  }
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
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: .4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const img = document.querySelector('.hecho-media img');
  if (img) gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.hecho-media', start: 'top bottom', end: 'bottom top', scrub: true } });
}

function initPreciosEstaticos() {
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getPorSlug(el.dataset.precioDe);
    if (p) el.textContent = formatearPrecio(precioFinal(p));
  });
  const desde = document.getElementById('heroDesde');
  if (desde) desde.textContent = formatearPrecio(Math.min(...PRODUCTOS.map(precioFinal)));
  const piezas = document.getElementById('heroPiezas');
  if (piezas) piezas.textContent = PRODUCTOS.length;
}

function initJsonLdProductos() {
  const base = 'https://gokywebs.com/demo/bruneesamor/';
  const data = {
    '@context': 'https://schema.org',
    '@graph': PRODUCTOS.map(p => ({
      '@type': 'Product', name: p.nombre, description: p.descripcion, image: base + p.imagenes[0], sku: p.id,
      category: CATEGORIAS.find(c => c.id === p.categoria)?.nombre, brand: { '@type': 'Brand', name: 'BruneEsAmor' },
      offers: { '@type': 'Offer', price: precioFinal(p), priceCurrency: 'ARS', availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: `${base}?producto=${p.slug}` },
    })),
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

function initColorSwitch() {
  const btn = document.getElementById('color-switch');
  const backdrop = document.getElementById('palette-panel-backdrop');
  const closeBtn = document.getElementById('palette-panel-close');
  const grid = document.getElementById('palette-grid');
  if (!btn || !backdrop || !grid || !PALETAS?.length) return;
  const KEY = 'bruneesamor_paleta';

  const aplicar = (paleta, persistir = true) => {
    const root = document.documentElement.style;
    Object.entries(paleta.vars).forEach(([prop, val]) => root.setProperty(prop, val));
    grid.querySelectorAll('.paleta-swatch').forEach(sw => sw.classList.toggle('activa', sw.dataset.nombre === paleta.nombre));
    if (persistir) guardar(KEY, JSON.stringify(paleta));
  };

  grid.innerHTML = PALETAS.map(p => `
    <button type="button" class="paleta-swatch" data-nombre="${esc(p.nombre)}" aria-label="Paleta ${esc(p.nombre)}"
      style="--sw-bg:${p.vars['--color-bg']};--sw-primary:${p.vars['--color-primary']};--sw-cta:${p.vars['--color-cta']}">
      <span class="paleta-swatch-dots" aria-hidden="true"></span>
      <span class="paleta-swatch-label">${esc(p.nombre)}</span>
    </button>`).join('');
  grid.querySelectorAll('.paleta-swatch').forEach(sw => {
    sw.addEventListener('click', () => aplicar(PALETAS.find(p => p.nombre === sw.dataset.nombre)));
  });

  const open = () => { backdrop.hidden = false; window.lenis?.stop(); document.body.classList.add('no-scroll'); };
  const close = () => { backdrop.hidden = true; window.lenis?.start(); document.body.classList.remove('no-scroll'); btn.focus(); };
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

  const guardada = (() => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } })();
  const activa = PALETAS.find(p => p.nombre === guardada?.nombre) || PALETAS[0];
  grid.querySelectorAll('.paleta-swatch').forEach(sw => sw.classList.toggle('activa', sw.dataset.nombre === activa.nombre));

  const sendBtn = document.getElementById('palette-send');
  sendBtn?.addEventListener('click', () => {
    const elegida = PALETAS.find(p => p.nombre === grid.querySelector('.paleta-swatch.activa')?.dataset.nombre) || activa;
    sendBtn.disabled = true; sendBtn.textContent = 'Enviando…';
    const slugUrl = (location.pathname.match(/\/demo\/([^/]+)/) || [])[1] || document.title;
    const negocio = (document.title.split(/\s[—|]\s|\s-\s/)[0] || document.title || '').trim();
    window.__gkySendPaleta?.({ slug: window.gkySlugify(slugUrl), negocio, paletaNombre: elegida.nombre, paletaVars: elegida.vars, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la paleta en Firestore:', err));
    setTimeout(() => {
      sendBtn.disabled = false; sendBtn.textContent = 'Enviar estos colores';
      if (typeof showToast === 'function') showToast('¡Listo! Le avisamos a Gokywebs.'); else window.alert('¡Listo! Le avisamos a Gokywebs.');
    }, 700);
  });
}

initPreciosEstaticos();
initCategorias();
initTecnicas();
initRail();
initCatalogo();
initReveals();
initNav();
initWspLinks();
initBuscarHeader();
initCardAcciones();
initDrawer();
initQuickView();
initFirma();
initHero();
initLeeScroll();
initParallax();
initFloats();
initColorSwitch();
initJsonLdProductos();
updateCartBadge();
abrirDesdeUrl();
