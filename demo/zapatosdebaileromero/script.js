const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const WSP = '5491138310544';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const URL_HOME = MODELO === '2' ? 'modelo-2.html' : './';
const POR_PAGINA = 16;
const MAX_PARES = 12;

const CATEGORIAS = [
  { id: 'folklore', nombre: 'Folklore y malambo', corto: 'Folklore', bajada: 'Botas de caña alta, botas de malambo y zapatos con correa para el escenario.', img: 'images/p-bota-cana-alta.webp' },
  { id: 'salon', nombre: 'Salón y tango', corto: 'Salón', bajada: 'Zapatos de taco medio y de hombre, con suela de cromo para girar sin trabarse.', img: 'images/p-zapato-salon-nude.webp' },
  { id: 'salsa', nombre: 'Salsa y ritmos latinos', corto: 'Salsa', bajada: 'Sandalias de raso con tiras cruzadas y taco carrete.', img: 'images/p-sandalia-salsa-bronce.webp' },
  { id: 'flamenco', nombre: 'Flamenco', corto: 'Flamenco', bajada: 'Zapatos con correa y taco firme, para zapatear con fuerza.', img: 'images/p-zapato-flamenco-rojo.webp' },
];
const PARA = { mujer: { nombre: 'Mujer', para: 'para mujer' }, hombre: { nombre: 'Hombre', para: 'para hombre' } };
const TACOS = {
  bajo: { nombre: 'Bajo, hasta 4 cm', max: 4 },
  medio: { nombre: 'Medio, de 4,5 a 6 cm', min: 4.5, max: 6 },
  alto: { nombre: 'Alto, más de 6 cm', min: 6.5 },
};
const TALLES = {
  mujer: [[34, 22.3], [35, 23], [36, 23.6], [37, 24.3], [38, 24.9], [39, 25.6], [40, 26.3], [41, 27]],
  hombre: [[38, 25], [39, 25.6], [40, 26.3], [41, 27], [42, 27.6], [43, 28.3], [44, 29], [45, 29.6]],
};
const ORDENES = { destacados: 'Destacados', nuevos: 'Novedades', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const FABRICACION = { zapato: '15 a 20 días hábiles', bota: '25 a 30 días hábiles' };
const serie = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

const PRODUCTOS = [
  { id: 'bota-folklore-cana-alta', nombre: 'Bota de folklore caña alta', cats: ['folklore'], para: 'mujer', tipo: 'bota',
    precio: 238000, descuento: 0, taco: 5.5, material: 'Cuero vacuno', suela: 'Suela de cromo', color: 'Negro',
    talles: serie(35, 40), listos: [37, 38], rango: 1, alta: 8,
    img: 'images/p-bota-cana-alta.webp', galeria: [], alt: 'Par de botas de folklore de mujer, de caña alta, en cuero negro y con taco de 5,5 cm',
    desc: 'Caña alta con cierre interno y taco firme de 5,5 cm para zapatear sin perder el equilibrio. El cuero negro acompaña cualquier pollera o traje de gala.', tags: ['zamba', 'chacarera', 'gato', 'escenario', 'dama'] },
  { id: 'zapato-salon-hombre', nombre: 'Zapato de baile de hombre, acordonado', cats: ['salon', 'salsa'], para: 'hombre', tipo: 'zapato',
    precio: 124000, descuento: 0, taco: 2.5, material: 'Cuero', suela: 'Suela de cromo', color: 'Negro',
    talles: serie(38, 45), listos: [40, 41, 42, 43], rango: 2, alta: 4,
    img: 'images/p-zapato-salon-hombre.webp', galeria: ['images/g-puntera-hombre.webp'], alt: 'Par de zapatos de baile de hombre, negros, acordonados y de punta fina',
    desc: 'Capellada lisa, cordones y taco de 2,5 cm. La suela de cromo deja girar en el tango, el salón y la salsa sin trabarse.', tags: ['tango', 'caballero', 'oxford'] },
  { id: 'zapato-salon-nude', nombre: 'Zapato de salón cerrado, nude', cats: ['salon'], para: 'mujer', tipo: 'zapato',
    precio: 109000, descuento: 0, taco: 6, material: 'Cuero', suela: 'Suela de cromo', color: 'Nude',
    talles: serie(34, 41), listos: [36, 37, 38], rango: 3, alta: 3,
    img: 'images/p-zapato-salon-nude.webp', galeria: ['images/g-taco-nude.webp'], alt: 'Par de zapatos de salón de mujer color nude, de punta cerrada y con pulsera al tobillo',
    desc: 'Punta cerrada, pulsera al tobillo y taco de 6 cm forrado al tono. Para salón, tango y ensayos largos.', tags: ['tango', 'vals', 'pulsera', 'piel'] },
  { id: 'sandalia-salsa-bronce', nombre: 'Sandalia de salsa, raso bronce', cats: ['salsa', 'salon'], para: 'mujer', tipo: 'zapato',
    precio: 104000, descuento: 0, taco: 7.5, material: 'Raso', suela: 'Suela de cromo', color: 'Bronce',
    talles: serie(34, 41), listos: [36, 37, 38, 39], rango: 4, alta: 5,
    img: 'images/p-sandalia-salsa-bronce.webp', galeria: ['images/g-hebilla-raso.webp'], alt: 'Par de sandalias de salsa de raso bronce con tiras cruzadas y taco carrete',
    desc: 'Tiras cruzadas que sostienen el empeine y taco carrete de 7,5 cm. El tono bronce se funde con la piel y estiliza la pierna en la pista.', tags: ['bachata', 'latino', 'tango', 'satén'] },
  { id: 'zapato-flamenco-rojo', nombre: 'Zapato de flamenco rojo con correa', cats: ['flamenco', 'folklore'], para: 'mujer', tipo: 'zapato',
    precio: 118000, descuento: 0, taco: 6, material: 'Cuero', suela: 'Suela de cuero', color: 'Rojo',
    talles: serie(35, 41), listos: [37, 38], rango: 5, alta: 6,
    img: 'images/p-zapato-flamenco-rojo.webp', galeria: ['images/g-correa-roja.webp'], alt: 'Par de zapatos de flamenco rojos, con correa y taco ancho',
    desc: 'Taco ancho de 6 cm y puntera firme para el zapateado. Cuero rojo con correa regulable; también lo hacemos en negro.', tags: ['sevillanas', 'zapateado', 'correa'] },
  { id: 'bota-malambo-bordada', nombre: 'Bota de malambo con bordado', cats: ['folklore'], para: 'hombre', tipo: 'bota',
    precio: 289000, descuento: 0, taco: 3.5, material: 'Cuero vacuno', suela: 'Suela de cuero reforzada', color: 'Negro con bordado al tono',
    talles: serie(38, 45), listos: [41, 42, 43], rango: 6, alta: 9,
    img: 'images/p-bota-malambo-bordada.webp', galeria: [], alt: 'Par de botas de malambo negras con bordado en la caña',
    desc: 'Caña con bordado al tono y suela reforzada para el zapateo y el cepillado del malambo. La hacemos en tu talle y, a pedido, con el bordado en otro color.', tags: ['malambo', 'zapateo', 'gaucho', 'caballero'] },
  { id: 'zapato-folklore-correa-negro', nombre: 'Zapato de folklore con correa, negro', cats: ['folklore', 'flamenco'], para: 'mujer', tipo: 'zapato',
    precio: 112000, descuento: 0, taco: 5.5, material: 'Cuero', suela: 'Suela de cromo', color: 'Negro',
    talles: serie(34, 41), listos: [36, 37, 38, 39], rango: 7, alta: 7,
    img: 'images/p-zapato-folklore-negro.webp', galeria: ['images/g-hebilla-folklore.webp'], alt: 'Par de zapatos de folklore de mujer, negros, con correa y hebilla',
    desc: 'El clásico de los ballets folklóricos: punta redonda, correa con hebilla y taco de 5,5 cm. Interior forrado en cuero natural.', tags: ['ballet', 'academia', 'zamba', 'dama'] },
  { id: 'zapato-flamenco-flor', nombre: 'Zapato de flamenco con flor', cats: ['flamenco'], para: 'mujer', tipo: 'zapato',
    precio: 129000, descuento: 0, taco: 6, material: 'Cuero', suela: 'Suela de cuero', color: 'Rojo con flor de tela',
    talles: serie(35, 40), listos: [], rango: 8, alta: 10,
    img: 'images/p-zapato-flamenco-flor.webp', galeria: [], alt: 'Zapato de flamenco rojo con una flor de tela sobre la puntera',
    desc: 'La versión de gala del zapato de flamenco: flor de tela al tono sobre la capellada y correa con hebilla. Se hace a pedido en tu talle.', tags: ['gala', 'sevillanas', 'flor'] },
  { id: 'bota-folklore-suela', nombre: 'Bota de folklore de hombre, color suela', cats: ['folklore'], para: 'hombre', tipo: 'bota',
    precio: 246000, descuento: 0, taco: 3.5, material: 'Cuero engrasado', suela: 'Suela de cuero con taco apilado', color: 'Suela (marrón)',
    talles: serie(38, 45), listos: [40, 42], rango: 0, alta: 2,
    img: 'images/p-bota-folklore-suela.webp', galeria: ['images/g-costura-bota.webp'], alt: 'Par de botas de folklore de hombre en cuero marrón, con caña fruncida',
    desc: 'Caña fruncida de cuero engrasado, costura a la vista y taco de suela apilada. Para danzas tradicionales, peñas y presentaciones.', tags: ['gaucho', 'peña', 'marrón', 'caballero'] },
  { id: 'zapato-salon-t-raso', nombre: 'Zapato de salón en T, raso rosado', cats: ['salon', 'salsa'], para: 'mujer', tipo: 'zapato',
    precio: 114000, descuento: 0, taco: 7, material: 'Raso', suela: 'Suela de cromo', color: 'Rosa viejo',
    talles: serie(34, 40), listos: [37], rango: 0, alta: 1,
    img: 'images/p-zapato-salon-t-raso.webp', galeria: [], alt: 'Par de zapatos de salón de raso rosado con tira en T y capellada plisada',
    desc: 'Tira en T, capellada plisada y taco de 7 cm. Un clásico del salón que también se usa en los ritmos latinos.', tags: ['vals', 'tango', 'satén', 'rosa'] },
  { id: 'sandalia-salsa-negra', nombre: 'Sandalia de salsa, raso negro', cats: ['salsa', 'salon'], para: 'mujer', tipo: 'zapato',
    precio: 104000, descuento: 0, taco: 7.5, material: 'Raso', suela: 'Suela de cromo', color: 'Negro',
    talles: serie(34, 41), listos: [37, 38], rango: 0, alta: 0,
    img: 'images/p-sandalia-salsa-negra.webp', galeria: ['images/g-trenzado-negro.webp', 'images/g-taco-carrete.webp'], alt: 'Par de sandalias de salsa de raso negro, con tiras trenzadas y taco carrete',
    desc: 'Tiras trenzadas en la puntera, pulsera cruzada y taco carrete de 7,5 cm. Combina con cualquier vestuario de competencia.', tags: ['bachata', 'latino', 'tango', 'satén'] },
  { id: 'linea-flex', nombre: 'Línea Flex en cuero', cats: ['salon'], para: 'mujer', tipo: 'zapato', visible: false,
    precio: 89000, descuento: 0, taco: 5, material: 'Cuero', suela: 'Suela de cromo', color: 'A definir',
    talles: serie(35, 40), listos: [], rango: 0, alta: 11,
    img: 'images/p-zapato-salon-nude.webp', galeria: [], alt: 'Línea Flex', desc: 'Próximo ingreso.', tags: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const cm = n => String(n).replace('.', ',');
const listaTalles = ts => {
  if (!ts.length) return '';
  if (ts.length === 1) return String(ts[0]);
  const seguidos = ts.every((t, i) => i === 0 || t === ts[i - 1] + 1);
  if (seguidos && ts.length > 2) return `${ts[0]} a ${ts[ts.length - 1]}`;
  return `${ts.slice(0, -1).join(', ')} y ${ts[ts.length - 1]}`;
};

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const precio = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir);
    if (cat.length && !p.cats.some(c => cat.includes(c))) return false;
    if (f.para && p.para !== f.para) return false;
    const talle = f.talle != null && f.talle !== '' ? Number(f.talle) : null;
    if (talle != null && !p.talles.includes(talle)) return false;
    if (f.tacoMin != null && p.taco < f.tacoMin) return false;
    if (f.tacoMax != null && p.taco > f.tacoMax) return false;
    if (f.listos && !(talle != null ? p.listos.includes(talle) : p.listos.length > 0)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precio(a) - precio(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precio(b) - precio(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden));
    let inicio = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      inicio = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(inicio, inicio + lim);
    const hayMas = inicio + items.length < ordenados.length;
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

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    textoBusqueda.set(p.id, norm([
      p.nombre, p.desc, p.color, p.material, p.suela, p.tipo, PARA[p.para]?.nombre,
      ...p.cats.map(c => CATEGORIAS.find(x => x.id === c)?.nombre || c),
      ...(p.tags || []),
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
  const palabras = norm(q).split(/\s+/).filter(Boolean);
  if (!palabras.length) return { ...tienda.consultar({ filtros, orden, cursor, limite }), paginas: 1 };
  const items = [];
  let c = cursor;
  let ultimo = cursor;
  let paginas = 0;
  let agotado = false;
  while (items.length < limite) {
    const pag = tienda.consultar({ filtros, orden, cursor: c, limite: tienda.TOPE });
    paginas++;
    for (const p of pag.items) {
      ultimo = p.id;
      if (palabras.every(w => textoDe(p).includes(w))) {
        items.push(p);
        if (items.length === limite) break;
      }
    }
    if (items.length === limite) break;
    if (!pag.cursor) { agotado = true; break; }
    c = pag.cursor;
  }
  return { items, cursor: agotado ? null : ultimo, paginas };
}

function talleSugerido(medida, para) {
  const tabla = TALLES[para];
  if (!tabla || !(medida > 0)) return null;
  const i = tabla.findIndex(([, largo]) => largo >= medida - 0.1);
  if (i < 0) return { fuera: 'grande', limite: tabla[tabla.length - 1][0] };
  if (i === 0 && medida < tabla[0][1] - 0.7) return { fuera: 'chico', limite: tabla[0][0] };
  const [talle, largo] = tabla[i];
  const entre = i > 0 && largo - medida > 0.1 ? tabla[i - 1][0] : null;
  return { talle, largo, entre };
}

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));
let talleActivo = null;

const Cart = {
  KEY: 'zapatosdebaileromero_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, talle) {
    const t = Number(talle);
    if (!producto || !producto.talles.includes(t)) return false;
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.t === t);
    if (existing) existing.qty = Math.min(existing.qty + qty, MAX_PARES);
    else items.push({ id: producto.id, t, qty: Math.min(qty, MAX_PARES) });
    this.save(items);
    return true;
  },
  setQty(id, t, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.t === t); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, MAX_PARES)); this.save(items);
  },
  remove(id, t) { this.save(this.get().filter(i => !(i.id === id && i.t === t))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const Favs = {
  KEY: 'zapatosdebaileromero_favs',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const s = this.get();
    const i = s.indexOf(id);
    if (i < 0) s.push(id); else s.splice(i, 1);
    try { localStorage.setItem(this.KEY, JSON.stringify(s)); } catch (e) { void e; }
    document.dispatchEvent(new CustomEvent('favs:updated'));
    return i < 0;
  },
};

const ICO = {
  flecha: '<svg class="ico ico--flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  corazon: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  reloj: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  camion: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>',
  pasos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const HORARIO = { 1: [[540, 1080]], 2: [[540, 1080]], 3: [[540, 1080]], 4: [[540, 1080]], 5: [[540, 1080]], 6: [[540, 780]] };
const hora = min => `${Math.floor(min / 60)}${min % 60 ? ':' + String(min % 60).padStart(2, '0') : ''}`;
function ahoraEnBuenosAires(fecha = new Date()) {
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(fecha);
    const get = t => partes.find(x => x.type === t)?.value;
    return { dia: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')), min: (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10) };
  } catch {
    return { dia: fecha.getDay(), min: fecha.getHours() * 60 + fecha.getMinutes() };
  }
}
function estadoTaller({ dia, min }) {
  const hoy = HORARIO[dia] || [];
  const turno = hoy.find(([a, b]) => min >= a && min < b);
  if (turno) return { abierto: true, texto: `Abierto ahora · hasta las ${hora(turno[1])} h` };
  const prox = hoy.find(([a]) => min < a);
  if (prox) return { abierto: false, texto: `Cerrado ahora · abrimos hoy a las ${hora(prox[0])} h` };
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    if (HORARIO[d]) return { abierto: false, texto: `Cerrado ahora · abrimos ${k === 1 ? 'mañana' : 'el ' + DIAS[d]} a las ${hora(HORARIO[d][0][0])} h` };
  }
  return { abierto: false, texto: 'Cerrado ahora' };
}
function initEstado() {
  const textos = document.querySelectorAll('[data-estado]');
  const puntos = document.querySelectorAll('[data-estado-dot]');
  if (!textos.length && !puntos.length) return;
  const pintar = () => {
    const e = estadoTaller(ahoraEnBuenosAires());
    textos.forEach(t => { t.textContent = e.texto; });
    puntos.forEach(d => d.classList.toggle('is-open', e.abierto));
  };
  pintar();
  window.setInterval(pintar, 60000);
}

const catDe = p => CATEGORIAS.find(c => c.id === p.cats[0]);
const metaDe = p => `${catDe(p)?.corto || ''} · ${PARA[p.para]?.nombre || ''} · Taco ${cm(p.taco)} cm`;
const dispDe = p => (p.listos.length ? `Listo en talle${p.listos.length > 1 ? 's' : ''} ${listaTalles(p.listos)}` : `A pedido · ${FABRICACION[p.tipo]}`);
const estadoTalle = (p, t) => (p.listos.includes(t)
  ? { listo: true, texto: `Talle ${t}: listo para enviar. Sale en 24 a 48 h hábiles.` }
  : { listo: false, texto: `Talle ${t}: lo fabricamos para vos en ${FABRICACION[p.tipo]}.` });

function cardHTML(p, { anim = true } = {}) {
  let badge = '';
  if (p.descuento > 0) badge = `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>`;
  else if (p.alta >= 9) badge = '<span class="pcard__badge pcard__badge--nuevo">Nuevo</span>';
  else if (!p.listos.length) badge = '<span class="pcard__badge">A pedido</span>';
  const fav = Favs.has(p.id);
  return `<article class="pcard" data-id="${esc(p.id)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : ''}>
  <div class="pcard__media">
    <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000"></a>
    ${badge}
    <button type="button" class="pcard__fav" data-fav="${esc(p.id)}" aria-pressed="${fav}" aria-label="Guardar en favoritos: ${esc(p.nombre)}">${ICO.corazon}</button>
    <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}">Comprar ahora</button>
  </div>
  <div class="pcard__info">
    <p class="pcard__meta">${esc(metaDe(p))}</p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    <p class="pcard__var">${esc(dispDe(p))}</p>
    <p class="pcard__precio"><span>${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>
    <div class="prod-actions">
      <div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar un par">${ICO.menos}</button><span class="stepper__n" data-qty>1</span><button type="button" data-step="1" aria-label="Sumar un par">${ICO.mas}</button></div>
      <button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="Agregar al carrito: ${esc(p.nombre)}">${ICO.carrito}<span>Agregar</span></button>
    </div>
  </div>
</article>`;
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1024px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, .nav-cats__btn')?.focus();
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

function initCatsMenu(catActual = '') {
  document.querySelectorAll('[data-nav-cats]').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    const panel = box.querySelector('.nav-cats__panel');
    const lista = box.querySelector('[data-cats-lista]');
    if (!btn || !panel || !lista) return;
    lista.innerHTML = CATEGORIAS.map(c => `<li><a href="${URL_CATALOGO}?cat=${c.id}"${c.id === catActual ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="44" height="44"><span>${esc(c.nombre)}</span><span class="nav-cats__n">${Tienda.contar({ cat: c.id })}</span></a></li>`).join('');
    box.querySelectorAll('a').forEach(a => a.addEventListener('click', () => cerrar()));
    const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1024px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
    function cerrar() { clearTimeout(t); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { cerrar(); btn.focus(); } });
  });
}

function initRail() {
  const track = document.querySelector('[data-rail-track]');
  if (!track) return;
  const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  track.innerHTML = items.map(p => `<div class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { anim: false })}</div>`).join('');
  const vp = track.closest('[data-rail]');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 16;
  const sync = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
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
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
      const track = vp.firstElementChild;
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      const destino = [...track.children].reduce((best, it) => {
        const left = it.offsetLeft - inicio;
        return Math.abs(left - vp.scrollLeft) < Math.abs(best - vp.scrollLeft) ? left : best;
      }, 0);
      vp.scrollTo({ left: Math.max(0, Math.min(destino, vp.scrollWidth - vp.clientWidth)), behavior: reduceMotion ? 'auto' : 'smooth' });
      setTimeout(() => vp.classList.remove('dragging'), 480);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initBailesTabs() {
  document.querySelectorAll('[data-baile-prods]').forEach(cont => {
    const { items } = Tienda.consultar({ filtros: { cat: cont.dataset.baileProds }, orden: 'destacados', limite: 4 });
    items.forEach(cachear);
    cont.innerHTML = items.map(p => `<div class="tb-item" data-animate="subir" style="opacity:0;transform:translateY(44px)">${cardHTML(p, { anim: false })}</div>`).join('');
  });
}

function initCuentas() {
  document.querySelectorAll('[data-n-cat]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.nCat });
    el.textContent = `${n} ${n === 1 ? 'modelo' : 'modelos'}`;
  });
  document.querySelectorAll('[data-n-total]').forEach(el => { el.textContent = Tienda.contar({}); });
}

function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach(box => {
    const tabs = [...box.querySelectorAll('[role="tab"]')].filter(t => t.closest('[data-tabs]') === box);
    if (!tabs.length) return;
    const activar = (tab, foco) => {
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (foco) tab.focus();
      box.dispatchEvent(new CustomEvent('tabs:cambio', { detail: tab.dataset.tab }));
      revelarNuevos(document.getElementById(tab.getAttribute('aria-controls')));
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    };
    tabs.forEach((t, k) => {
      t.addEventListener('click', () => activar(t));
      t.addEventListener('keydown', e => {
        let n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (k + 1) % tabs.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (k - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') n = 0;
        else if (e.key === 'End') n = tabs.length - 1;
        if (n == null) return;
        e.preventDefault();
        activar(tabs[n], true);
      });
    });
    box.activarTab = id => { const t = tabs.find(x => x.dataset.tab === id); if (t) activar(t); return !!t; };
  });
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-ir-tab]');
    if (!a) return;
    document.querySelectorAll('[data-tabs]').forEach(box => box.activarTab?.(a.dataset.irTab));
  });
}

function initTalles() {
  document.querySelectorAll('[data-tabla-talles]').forEach(cont => {
    const para = cont.dataset.tablaTalles;
    const filas = TALLES[para] || [];
    cont.innerHTML = `<table class="regla"><caption>Talles ${PARA[para]?.para || ''} y largo del pie</caption><tbody><tr><th scope="row">Talle</th>${filas.map(([t]) => `<td data-t="${t}">${t}</td>`).join('')}</tr><tr><th scope="row">Pie (cm)</th>${filas.map(([t, l]) => `<td data-t="${t}">${cm(l)}</td>`).join('')}</tr></tbody></table>`;
  });
  const form = document.querySelector('[data-calc]');
  if (!form) return;
  const input = form.querySelector('input');
  const err = form.querySelector('[data-calc-err]');
  const res = document.querySelector('[data-calc-res]');
  const box = form.closest('[data-tabs]');
  let para = 'mujer';
  let ultima = null;
  const marcar = t => {
    document.querySelectorAll('.regla td.is-tuyo').forEach(td => td.classList.remove('is-tuyo'));
    if (t != null) document.querySelectorAll(`[data-tabla-talles="${para}"] td[data-t="${t}"]`).forEach(td => td.classList.add('is-tuyo'));
  };
  const calcular = medida => {
    const r = talleSugerido(medida, para);
    if (!r || !res) return;
    const consulta = wspLink(`Hola Romero! Mi pie mide ${cm(medida)} cm. ¿Qué talle ${PARA[para].para} me recomiendan?`);
    if (r.fuera) {
      marcar(null);
      res.innerHTML = `<p class="calc__tit">${r.fuera === 'grande' ? `Tu medida pasa el talle ${r.limite}` : `Tu medida es menor al talle ${r.limite}`}</p>
        <p class="calc__nota">Fuera de la tabla también trabajamos: escribinos con tu medida y lo vemos.</p>
        <div class="calc__acc"><a class="btn btn--cta" href="${consulta}" target="_blank" rel="noopener">${ICO.wsp}Consultar mi medida</a></div>`;
    } else {
      marcar(r.talle);
      res.innerHTML = `<p class="calc__tit">Tu talle ${PARA[para].para}: <b>${r.talle}</b></p>
        <p class="calc__nota">${r.entre ? `Tu pie queda entre el ${r.entre} y el ${r.talle}: te conviene el ${r.talle}.` : `Corresponde a un pie de hasta ${cm(r.largo)} cm de largo.`}</p>
        <div class="calc__acc"><a class="btn btn--cta" href="${URL_CATALOGO}?para=${para}&amp;talle=${r.talle}">Ver modelos en talle ${r.talle}${ICO.flecha}</a><a class="link-mas" href="${consulta}" target="_blank" rel="noopener">${ICO.wsp}Consultar mi medida</a></div>`;
    }
    res.hidden = false;
  };
  const limpiarError = () => { input.removeAttribute('aria-invalid'); if (err) err.hidden = true; };
  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = parseFloat(String(input.value).replace(',', '.'));
    if (!(v >= 15 && v <= 35)) {
      input.setAttribute('aria-invalid', 'true');
      if (err) err.hidden = false;
      input.focus();
      return;
    }
    limpiarError();
    ultima = Math.round(v * 10) / 10;
    calcular(ultima);
  });
  input.addEventListener('input', () => { if (input.hasAttribute('aria-invalid')) limpiarError(); });
  box?.addEventListener('tabs:cambio', e => {
    if (!TALLES[e.detail]) return;
    para = e.detail;
    if (ultima != null) calcular(ultima);
  });
}

function initVisor() {
  const visor = document.getElementById('visor');
  const tiles = [...document.querySelectorAll('[data-visor]')];
  if (!visor || !tiles.length) return;
  const img = visor.querySelector('[data-visor-img]');
  const cap = visor.querySelector('[data-visor-cap]');
  const num = visor.querySelector('[data-visor-n]');
  let i = 0, foco = null, t = 0;
  const pintar = () => {
    const im = tiles[i].querySelector('img');
    img.src = im.getAttribute('src');
    img.alt = im.alt;
    cap.textContent = tiles[i].dataset.cap || '';
    num.textContent = `${i + 1} / ${tiles.length}`;
  };
  const abrir = k => {
    clearTimeout(t);
    i = k; foco = document.activeElement; pintar();
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => visor.classList.add('open')));
    visor.querySelector('.visor__cerrar')?.focus({ preventScroll: true });
  };
  const cerrar = () => {
    visor.classList.remove('open');
    document.body.classList.remove('no-scroll');
    t = setTimeout(() => { visor.hidden = true; }, 300);
    if (foco && document.contains(foco)) foco.focus({ preventScroll: true });
  };
  const mover = d => { i = (i + d + tiles.length) % tiles.length; pintar(); };
  tiles.forEach((tile, k) => tile.addEventListener('click', () => abrir(k)));
  visor.addEventListener('click', e => {
    if (e.target.closest('[data-visor-cerrar]')) cerrar();
    else if (e.target.closest('[data-visor-prev]')) mover(-1);
    else if (e.target.closest('[data-visor-next]')) mover(1);
  });
  visor.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'ArrowLeft') mover(-1);
    else if (e.key === 'ArrowRight') mover(1);
    else atraparFoco(visor.querySelector('.visor__panel'), e);
  });
}

function cerrarPickers(excepto) {
  document.querySelectorAll('.picker').forEach(pk => { if (pk !== excepto) pk.remove(); });
}
function abrirPicker(card, p, modo) {
  cerrarPickers();
  const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
  const pk = document.createElement('div');
  pk.className = 'picker';
  pk.setAttribute('role', 'dialog');
  pk.setAttribute('aria-label', `Elegí tu talle: ${p.nombre}`);
  pk.dataset.modo = modo;
  pk.dataset.qty = String(qty);
  const nota = p.listos.length
    ? `<p class="picker__nota"><span class="punto" aria-hidden="true"></span>Listo para enviar · el resto, a pedido</p>`
    : `<p class="picker__nota">Se hace a pedido: ${esc(FABRICACION[p.tipo])}</p>`;
  pk.innerHTML = `<div class="picker__head"><p class="picker__tit">Elegí tu talle</p><button type="button" class="picker__cerrar" data-picker-cerrar aria-label="Cerrar">${ICO.x}</button></div>
    <div class="picker__ts">${p.talles.map(t => `<button type="button" class="talle${p.listos.includes(t) ? ' talle--listo' : ''}${t === talleActivo ? ' is-sel' : ''}" data-picker-t="${t}" aria-label="Talle ${t}${p.listos.includes(t) ? ', listo para enviar' : ', a pedido'}">${t}</button>`).join('')}</div>
    ${nota}${qty > 1 ? `<p class="picker__nota">Vas a sumar ${qty} pares.</p>` : ''}
    <a class="picker__guia" href="${URL_HOME}#talles">¿No sabés tu talle?</a>`;
  card.appendChild(pk);
  (pk.querySelector('.is-sel') || pk.querySelector('[data-picker-t]'))?.focus({ preventScroll: true });
}

function sumarAlCarrito(p, qty, talle, comprar) {
  if (!Cart.add(p, qty, talle)) return;
  if (comprar) abrirCarrito();
  else showToast(`Sumaste ${qty > 1 ? qty + ' pares de ' : ''}${p.nombre}, talle ${talle}, al carrito`);
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const fav = e.target.closest('[data-fav]');
    if (fav) {
      const agregado = Favs.toggle(fav.dataset.fav);
      fav.classList.remove('latido'); void fav.offsetWidth; if (agregado) fav.classList.add('latido');
      const p = getProducto(fav.dataset.fav);
      showToast(agregado ? `Guardaste ${p?.nombre || 'el modelo'} en favoritos` : 'Lo sacaste de tus favoritos');
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) {
      e.preventDefault();
      abrirQV(quick.dataset.quick, quick.closest('.pcard')?.querySelector('.pcard__nombre a') || quick);
      return;
    }
    const step = e.target.closest('[data-step]');
    if (step) {
      const n = step.closest('[data-stepper]')?.querySelector('[data-qty]');
      if (!n) return;
      n.textContent = String(Math.max(1, Math.min(MAX_PARES, (parseInt(n.textContent, 10) || 1) + Number(step.dataset.step))));
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add) {
      const card = add.closest('.pcard');
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p || !card) return;
      abrirPicker(card, p, add.hasAttribute('data-comprar') ? 'comprar' : 'agregar');
      return;
    }
    const tBtn = e.target.closest('[data-picker-t]');
    if (tBtn) {
      const pk = tBtn.closest('.picker');
      const card = tBtn.closest('.pcard');
      const p = getProducto(card?.dataset.id);
      if (!p || !pk) return;
      sumarAlCarrito(p, parseInt(pk.dataset.qty, 10) || 1, Number(tBtn.dataset.pickerT), pk.dataset.modo === 'comprar');
      pk.remove();
      card.querySelector('[data-add]')?.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('[data-picker-cerrar]')) {
      const card = e.target.closest('.pcard');
      e.target.closest('.picker')?.remove();
      card?.querySelector('[data-add]')?.focus({ preventScroll: true });
      return;
    }
    if (!e.target.closest('.picker')) cerrarPickers();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const pk = document.querySelector('.picker');
    if (!pk) return;
    const card = pk.closest('.pcard');
    pk.remove();
    card?.querySelector('[data-add]')?.focus({ preventScroll: true });
  });
}

function initFavs() {
  const pintar = () => {
    const ids = Favs.get();
    document.querySelectorAll('[data-fav-count]').forEach(b => { b.textContent = ids.length; b.hidden = !ids.length; });
    document.querySelectorAll('[data-fav]').forEach(b => b.setAttribute('aria-pressed', String(ids.includes(b.dataset.fav))));
  };
  document.addEventListener('favs:updated', pintar);
  pintar();
}

let ultimoFoco = null;
function atraparFoco(panel, e) {
  if (e.key !== 'Tab' || !panel) return;
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

const qvEstado = { p: null, t: null, qty: 1, img: 0 };
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  cerrarPickers();
  qvEstado.p = p; qvEstado.qty = 1; qvEstado.img = 0;
  qvEstado.t = p.talles.includes(talleActivo) ? talleActivo : null;
  if (!qv.classList.contains('open')) ultimoFoco = origen || document.activeElement;
  pintarQV();
  qv.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => qv.classList.add('open')));
  qv.querySelector('.qv__panel').scrollTop = 0;
  qv.querySelector('.qv__close')?.focus({ preventScroll: true });
  const url = new URL(location.href);
  url.searchParams.set('producto', p.id);
  window.history.replaceState(null, '', url);
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc,
    brand: { '@type': 'Brand', name: 'Zapatos de baile Romero' },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.listos.length ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder' },
  });
}
function pintarQV() {
  const p = qvEstado.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const imgs = [p.img, ...(p.galeria || [])];
  const est = qvEstado.t ? estadoTalle(p, qvEstado.t) : null;
  const { items: rel } = Tienda.consultar({ filtros: { cat: p.cats[0], excluir: p.id }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const foco = qvEstado.t ?? p.talles[0];
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media">
      <div class="qv__foto"><img src="${esc(imgs[qvEstado.img] || p.img)}" alt="${esc(p.alt)}" width="1000" height="1000"></div>
      ${imgs.length > 1 ? `<div class="qv__thumbs">${imgs.map((src, i) => `<button type="button" class="qv__thumb" data-qv-img="${i}" aria-label="Ver foto ${i + 1} de ${imgs.length}" aria-pressed="${i === qvEstado.img}"><img src="${esc(src)}" alt="" width="120" height="120"></button>`).join('')}</div>` : ''}
    </div>
    <div class="qv__info">
      <p class="qv__meta">${esc(metaDe(p))}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <p class="qv__precio">${formatearPrecio(precioFinal(p))}${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>
      <div class="qv__talles">
        <div class="qv__talles-head"><p class="qv__var-tit" id="qvTallesTit">Elegí tu talle</p><a class="qv__guia" href="${URL_HOME}#talles" data-qv-guia>Guía de talles</a></div>
        <div class="qv__ts" role="radiogroup" aria-labelledby="qvTallesTit">${p.talles.map(t => `<button type="button" class="talle${p.listos.includes(t) ? ' talle--listo' : ''}" role="radio" aria-checked="${t === qvEstado.t}" tabindex="${t === foco ? 0 : -1}" data-qv-t="${t}" aria-label="Talle ${t}${p.listos.includes(t) ? ', listo para enviar' : ', a pedido'}">${t}</button>`).join('')}</div>
        <p class="qv__disp${est ? (est.listo ? ' is-listo' : ' is-pedido') : ''}" data-qv-disp aria-live="polite">${est ? esc(est.texto) : (p.listos.length ? 'Los talles con punto están listos para enviar; el resto lo fabricamos para vos.' : `Este modelo se hace a pedido en tu talle: ${esc(FABRICACION[p.tipo])}.`)}</p>
      </div>
      <div class="qv__acc">
        <div class="stepper"><button type="button" data-qv-step="-1" aria-label="Restar un par">${ICO.menos}</button><span class="stepper__n" data-qv-qty>${qvEstado.qty}</span><button type="button" data-qv-step="1" aria-label="Sumar un par">${ICO.mas}</button></div>
        <button type="button" class="btn btn--cta" data-qv-add>${ICO.carrito}Agregar al carrito</button>
        <button type="button" class="btn btn--ghost" data-qv-comprar>Comprar ahora</button>
      </div>
      <p class="qv__desc">${esc(p.desc)}</p>
      <dl class="qv__ficha"><div><dt>Material</dt><dd>${esc(p.material)}</dd></div><div><dt>Suela</dt><dd>${esc(p.suela)}</dd></div><div><dt>Taco</dt><dd>${cm(p.taco)} cm</dd></div><div><dt>Color</dt><dd>${esc(p.color)}</dd></div></dl>
      <a class="qv__wsp" href="${wspLink(`Hola Romero! Tengo una consulta sobre: ${p.nombre}`)}" target="_blank" rel="noopener">${ICO.wsp}Consultar este modelo por WhatsApp</a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También te puede interesar</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><b>${formatearPrecio(precioFinal(r))}</b></button>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
}
function cerrarQV() {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  if (!document.getElementById('cartDrawer')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!qv.classList.contains('open')) qv.hidden = true; }, 320);
  const url = new URL(location.href);
  url.searchParams.delete('producto');
  window.history.replaceState(null, '', url);
  if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus({ preventScroll: true });
}
function qvSumar(comprar) {
  const p = qvEstado.p;
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  if (!qvEstado.t) {
    const disp = qv.querySelector('[data-qv-disp]');
    if (disp) { disp.textContent = 'Elegí un talle para sumarlo al carrito.'; disp.className = 'qv__disp is-error'; }
    qv.querySelector('[data-qv-t]')?.focus();
    return;
  }
  Cart.add(p, qvEstado.qty, qvEstado.t);
  if (comprar) { cerrarQV(); abrirCarrito(); }
  else showToast(`Sumaste ${qvEstado.qty > 1 ? qvEstado.qty + ' pares de ' : ''}${p.nombre}, talle ${qvEstado.t}, al carrito`);
}
function initQV() {
  const qv = document.getElementById('qv');
  if (!qv) return;
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    if (e.target.closest('[data-qv-guia]')) { cerrarQV(); return; }
    const tBtn = e.target.closest('[data-qv-t]');
    if (tBtn) {
      qvEstado.t = Number(tBtn.dataset.qvT);
      pintarQV();
      qv.querySelector(`[data-qv-t="${qvEstado.t}"]`)?.focus();
      return;
    }
    const th = e.target.closest('[data-qv-img]');
    if (th) { qvEstado.img = Number(th.dataset.qvImg); pintarQV(); qv.querySelector(`[data-qv-img="${qvEstado.img}"]`)?.focus(); return; }
    const step = e.target.closest('[data-qv-step]');
    if (step) {
      qvEstado.qty = Math.max(1, Math.min(MAX_PARES, qvEstado.qty + Number(step.dataset.qvStep)));
      qv.querySelector('[data-qv-qty]').textContent = String(qvEstado.qty);
      return;
    }
    if (e.target.closest('[data-qv-add]')) { qvSumar(false); return; }
    if (e.target.closest('[data-qv-comprar]')) qvSumar(true);
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    const tBtn = e.target.closest('[data-qv-t]');
    if (tBtn && ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key) && qvEstado.p) {
      const ts = qvEstado.p.talles;
      const k = ts.indexOf(Number(tBtn.dataset.qvT));
      const n = ts[(k + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : ts.length - 1)) % ts.length];
      qvEstado.t = n;
      pintarQV();
      qv.querySelector(`[data-qv-t="${n}"]`)?.focus();
      e.preventDefault();
      return;
    }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const id = new URLSearchParams(location.search).get('producto');
  if (id && Tienda.obtener(id)) abrirQV(id, null);
}

let focoCarrito = null;
function abrirCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr) return;
  cerrarPickers();
  if (!dr.classList.contains('open')) focoCarrito = document.activeElement;
  renderCarrito();
  dr.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => dr.classList.add('open')));
  dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
}
function cerrarCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr || dr.hidden) return;
  dr.classList.remove('open');
  if (document.getElementById('qv')?.hidden !== false) document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!dr.classList.contains('open')) dr.hidden = true; }, 380);
  if (focoCarrito && document.contains(focoCarrito)) focoCarrito.focus({ preventScroll: true });
}
function renderCarrito() {
  const body = document.getElementById('cartLines');
  const foot = document.getElementById('cartFoot');
  const cuenta = document.querySelector('[data-cart-titulo-n]');
  if (!body || !foot) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  if (cuenta) cuenta.textContent = items.length ? `(${Cart.count()} ${Cart.count() === 1 ? 'par' : 'pares'})` : '';
  if (!items.length) {
    body.innerHTML = `<div class="cart-vacio">${ICO.pasos}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Elegí tu baile y tu talle: si no está listo, lo fabricamos para vos.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver a la colección</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  const aPedido = items.some(i => !getProducto(i.id).listos.includes(i.t));
  body.innerHTML = `<ul>${items.map(i => {
    const p = getProducto(i.id);
    const listo = p.listos.includes(i.t);
    return `<li class="linea" data-linea="${esc(i.id)}" data-t="${i.t}">
      <img src="${esc(p.img)}" alt="" width="74" height="74">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">Talle ${i.t} · <span class="${listo ? 'es-listo' : 'es-pedido'}">${listo ? 'listo para enviar' : `a pedido, ${esc(FABRICACION[p.tipo])}`}</span></p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar un par">${ICO.menos}</button><span class="stepper__n">${i.qty}</span><button type="button" data-linea-step="1" aria-label="Sumar un par">${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}, talle ${i.t}">${ICO.basura}</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); return `- ${i.qty} × ${p.nombre} (talle ${i.t}${p.listos.includes(i.t) ? ', listo' : ', a pedido'}): ${formatearPrecio(precioFinal(p) * i.qty)}`; }).join('\n');
  const msg = `Hola Romero! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: `;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <p class="drawer__nota">${ICO.camion}<span>Envíos a todo el país.${aPedido ? ' Los pares a pedido se confirman con una seña.' : ''}</span></p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--ghost" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>`;
}
function initCarrito() {
  const dr = document.getElementById('cartDrawer');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-cart]')) abrirCarrito();
  });
  if (!dr) return;
  dr.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-cart]')) { cerrarCarrito(); return; }
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea, t = Number(linea.dataset.t);
    const step = e.target.closest('[data-linea-step]');
    if (step) {
      const it = Cart.get().find(i => i.id === id && i.t === t);
      if (it) Cart.setQty(id, t, it.qty + Number(step.dataset.lineaStep));
      [...dr.querySelectorAll('[data-linea]')].find(l => l.dataset.linea === id && Number(l.dataset.t) === t)?.querySelector(`[data-linea-step="${step.dataset.lineaStep}"]`)?.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('[data-linea-quitar]')) {
      Cart.remove(id, t);
      dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
    }
  });
  dr.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarCarrito(); return; }
    atraparFoco(dr.querySelector('.drawer__panel'), e);
  });
  document.addEventListener('cart:updated', () => { if (!dr.hidden) renderCarrito(); });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

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

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return '';
  const params = new URLSearchParams(location.search);
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const talleValido = (v, para) => {
    const n = parseInt(v, 10);
    const lista = para ? TALLES[para].map(([t]) => t) : [...new Set([...TALLES.mujer, ...TALLES.hombre].map(([t]) => t))];
    return lista.includes(n) ? String(n) : '';
  };
  const estado = {
    cat: valido(params.get('cat'), catIds),
    para: valido(params.get('para'), PARA),
    talle: '',
    taco: valido(params.get('taco'), TACOS),
    listos: params.get('listos') === '1',
    favoritos: params.get('favoritos') === '1',
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: valido(params.get('orden'), ORDENES) || 'destacados',
  };
  estado.talle = talleValido(params.get('talle'), estado.para);
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const limpiarBtns = document.querySelectorAll('[data-limpiar]');
  const filtrosN = document.querySelector('[data-filtros-n]');
  const favAviso = document.querySelector('[data-favs-aviso]');

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoBoton = cont.dataset.catOpciones === 'botones';
    const opciones = [{ id: '', nombre: 'Todos los bailes' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => (comoBoton
      ? `<button type="button" class="chip" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.id ? c.corto : 'Todos')} <small data-cuenta-cat="${c.id}"></small></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.nombre)}</span><span class="opt__n" data-cuenta-cat="${c.id}"></span></label>`)).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');
  document.querySelectorAll('select[data-filtro="taco"]').forEach(s => { s.innerHTML = `<option value="">Cualquier taco</option>${Object.entries(TACOS).map(([k, t]) => `<option value="${k}">${esc(t.nombre)}</option>`).join('')}`; });
  const pintarTalles = () => {
    const lista = estado.para ? TALLES[estado.para].map(([t]) => t) : [...new Set([...TALLES.mujer, ...TALLES.hombre].map(([t]) => t))].sort((a, b) => a - b);
    document.querySelectorAll('select[data-filtro="talle"]').forEach(s => { s.innerHTML = `<option value="">Todos los talles</option>${lista.map(t => `<option value="${t}">Talle ${t}</option>`).join('')}`; });
  };

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.para && sin !== 'para') f.para = estado.para;
    if (estado.talle && sin !== 'talle') f.talle = Number(estado.talle);
    if (estado.taco && sin !== 'taco') { const r = TACOS[estado.taco]; if (r.min != null) f.tacoMin = r.min; if (r.max != null) f.tacoMax = r.max; }
    if (estado.listos && sin !== 'listos') f.listos = true;
    if (estado.favoritos) f.ids = Favs.get();
    return f;
  };
  const sincronizarUI = () => {
    pintarTalles();
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === estado[f];
      else if (el.type === 'checkbox') el.checked = !!estado[f];
      else if (el.tagName === 'SELECT') el.value = estado[f] || '';
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === estado[f]));
    });
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
      const id = el.dataset.cuentaCat;
      el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) });
    });
    document.querySelectorAll('[data-cuenta-para]').forEach(el => {
      const id = el.dataset.cuentaPara;
      el.textContent = Tienda.contar({ ...filtrosDe('para'), ...(id ? { para: id } : {}) });
    });
    const activos = ['cat', 'para', 'talle', 'taco'].filter(k => estado[k]).length + (estado.listos ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = activos; filtrosN.hidden = !activos; }
    limpiarBtns.forEach(b => { b.hidden = !(activos || estado.q || estado.favoritos); });
    if (favAviso) favAviso.hidden = !estado.favoritos;
    const cat = catIds[estado.cat];
    const para = PARA[estado.para];
    let titulo = estado.favoritos ? 'Tus favoritos' : cat ? cat.nombre : para ? 'Calzado de baile' : 'Toda la colección';
    if (!estado.favoritos && para) titulo += ` ${para.para}`;
    if (estado.talle) titulo += ` · talle ${estado.talle}`;
    talleActivo = estado.talle ? Number(estado.talle) : null;
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = estado.favoritos ? 'Los modelos que guardaste con el corazón. Quedan en este navegador.' : cat ? `${cat.bajada} Si tu talle no está listo, lo fabricamos.` : 'Folklore, malambo, salón, tango, salsa y flamenco, para hombre y mujer. Si tu talle no está listo, lo fabricamos.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = titulo === 'Toda la colección'; miga.textContent = titulo; }
    document.title = `${titulo} — Zapatos de baile Romero`;
    document.querySelectorAll('.nav-cats__lista a').forEach(a => {
      if (a.getAttribute('href') === `${URL_CATALOGO}?cat=${estado.cat}`) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'para', 'talle', 'taco', 'listos', 'favoritos', 'q', 'orden', 'buscar'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.para) u.searchParams.set('para', estado.para);
    if (estado.talle) u.searchParams.set('talle', estado.talle);
    if (estado.taco) u.searchParams.set('taco', estado.taco);
    if (estado.listos) u.searchParams.set('listos', '1');
    if (estado.favoritos) u.searchParams.set('favoritos', '1');
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => cardHTML(p)).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    const mostrados = grid.children.length;
    if (verMas) verMas.hidden = !cursor;
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (cuenta) {
      if (estado.q) cuenta.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      else { const total = Tienda.contar(filtrosDe()); cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'modelo' : 'modelos'}` : ''; }
    }
    if (agregar && !res.items.length) showToast('No hay más resultados para esa búsqueda.');
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };

  document.addEventListener('change', e => {
    const el = e.target.closest('[data-filtro]');
    if (!el) return;
    const f = el.dataset.filtro;
    if (el.type === 'checkbox') estado[f] = el.checked;
    else estado[f] = el.value;
    if (f === 'para') estado.talle = talleValido(estado.talle, estado.para);
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) {
      estado[b.dataset.filtro] = b.dataset.valor || '';
      if (b.dataset.filtro === 'para') estado.talle = talleValido(estado.talle, estado.para);
      aplicar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) {
      estado.cat = ''; estado.para = ''; estado.talle = ''; estado.taco = ''; estado.listos = false; estado.favoritos = false; estado.q = '';
      if (buscar) buscar.value = '';
      aplicar();
      return;
    }
    if (e.target.closest('[data-quitar-favs]')) { estado.favoritos = false; aplicar(); }
  });
  document.addEventListener('favs:updated', () => { if (estado.favoritos) aplicar(); });
  ordenSel?.addEventListener('change', () => { estado.orden = valido(ordenSel.value, ORDENES) || 'destacados'; aplicar(); });
  let tBuscar = 0;
  buscar?.addEventListener('input', () => { clearTimeout(tBuscar); tBuscar = setTimeout(() => { estado.q = buscar.value.trim().slice(0, 60); aplicar(); }, 260); });
  document.querySelector('[data-cat-buscar-form]')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tBuscar); estado.q = (buscar?.value || '').trim().slice(0, 60); aplicar(); buscar?.blur(); });
  verMas?.addEventListener('click', () => pintar(true));

  const filtros = document.getElementById('filtros');
  const abrirF = document.querySelector('[data-filtros-abrir]');
  if (filtros && abrirF) {
    const bd = document.createElement('div');
    bd.className = 'filtros-bd';
    document.body.appendChild(bd);
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => { filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true'); filtros.querySelector('input, select, button')?.focus({ preventScroll: true }); });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); });
  }

  document.querySelectorAll('a[href="#catBuscar"]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    buscar?.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    buscar?.focus({ preventScroll: true });
  }));

  sincronizarUI();
  escribirURL();
  pintar();
  if (params.get('buscar') === '1' && buscar) buscar.focus({ preventScroll: true });
  return estado.cat;
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero-datos li, .sello', { y: 14, opacity: 0, duration: 1, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75);
  hero.querySelectorAll('.cinta__banda').forEach((path, k) => {
    const largo = path.getTotalLength();
    gsap.fromTo(path, { strokeDasharray: largo, strokeDashoffset: largo }, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', delay: 0.25 + k * 0.2, clearProps: 'strokeDasharray,strokeDashoffset' });
  });
  const pespunte = hero.querySelectorAll('.cinta__pespunte');
  if (pespunte.length) gsap.from(pespunte, { opacity: 0, duration: 1.2, delay: 1.3, clearProps: 'opacity' });
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax] > img').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${(-4 + 8 * s.progress).toFixed(2)}%`; },
    });
  });
}

[
  initModelBarScroll,
  initNav,
  initEstado,
  initRail,
  initBailesTabs,
  initCuentas,
  () => { const cat = PAGINA === 'catalogo' ? initCatalogo() : ''; initCatsMenu(cat || ''); },
  initTabs,
  initTalles,
  initVisor,
  initTarjetas,
  initFavs,
  initQV,
  initCarrito,
  initFloats,
  initHeroMotion,
  initReveals,
  initParallax,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
