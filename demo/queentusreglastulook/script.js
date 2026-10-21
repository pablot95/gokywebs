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

const MARCA = 'Queen';
const WSP = '5491166091170';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const PARAMS = new URLSearchParams(location.search);
const KEY_TALLE = 'queen_talle';

const CATEGORIAS = [
  { id: 'dia', nombre: 'Todos los días', bajada: 'Jeans, camisas, remeras, tejidos y abrigos para usar y combinar toda la semana.', img: 'images/p-camisa-blanca.webp' },
  { id: 'noche', nombre: 'Noche', bajada: 'Vestidos, tops con brillo y satén para salir, cumpleaños y eventos.', img: 'images/p-top-lentejuelas.webp' },
];
const TIPOS = { vestidos: 'Vestidos', tops: 'Tops, blusas y camisas', bajos: 'Pantalones, jeans y polleras', abrigos: 'Blazers, tejidos y abrigos' };
const T_BASE = ['S', 'M', 'L', 'XL', 'XXL'];
const T_PLUS = ['3XL', '4XL', '5XL'];
const T_TODOS = [...T_BASE, ...T_PLUS];
const COLORES = {
  Negro: '#1D1F24', Blanco: '#F4F4F1', Marfil: '#EDE4D3', Celeste: '#7E9CC0', 'Verde salvia': '#4F7F78', 'Azul noche': '#24305A',
  Camel: '#C49A6C', Crudo: '#E8E0CC', Gris: '#A6ACB4', Beige: '#C5A983', Rojo: '#B3343B', Durazno: '#E6B39A',
  Estampado: 'linear-gradient(135deg, #1D1F24 50%, #EDE4D3 50%)',
};
const RANGOS = {
  hasta40: { nombre: 'Hasta $40.000', max: 40000 },
  '40a60': { nombre: '$40.000 a $60.000', min: 40001, max: 60000 },
  mas60: { nombre: 'Más de $60.000', min: 60001 },
};
const ORDENES = { destacados: 'Destacados', nuevos: 'Recién llegados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const GUIA = [
  ['S', 86, 90, 66, 70, 92, 96], ['M', 90, 96, 70, 76, 96, 102], ['L', 96, 102, 76, 82, 102, 108], ['XL', 102, 108, 82, 88, 108, 114],
  ['XXL', 108, 114, 88, 96, 114, 120], ['3XL', 114, 122, 96, 104, 120, 128], ['4XL', 122, 130, 104, 112, 128, 136], ['5XL', 130, 138, 112, 120, 136, 144],
];
const tl = (base, plus = []) => [...T_BASE.map((v, i) => ({ v, stock: base[i] ?? 0 })), ...plus.map((s, i) => ({ v: T_PLUS[i], stock: s }))];

const PRODUCTOS = [
  { id: 'vestido-drapeado', nombre: 'Vestido negro drapeado', cats: ['noche'], sub: 'vestidos', precio: 59900, descuento: 0, color: 'Negro', ops: tl([2, 4, 3, 2, 1], [1, 1, 0]), rango: 1, alta: 9,
    img: 'images/p-vestido-drapeado.webp', alt: 'Vestido negro sin mangas con drapeado a la cintura y falda asimétrica, colgado en una percha de madera',
    desc: 'Sin mangas, con escote redondo, drapeado anudado a la cintura y falda asimétrica con caída. Largo midi.', tags: ['vestido', 'negro', 'drapeado', 'midi', 'fiesta', 'noche', 'evento'] },
  { id: 'blusa-saten', nombre: 'Blusa satinada marfil', cats: ['noche', 'dia'], sub: 'tops', precio: 38900, descuento: 0, color: 'Marfil', ops: tl([3, 5, 4, 3, 2], [2, 1, 1]), rango: 2, alta: 8,
    img: 'images/p-blusa-saten.webp', alt: 'Blusa satinada color marfil de manga larga con puños abotonados, extendida sobre una superficie clara',
    desc: 'Satén color marfil con cuello camisero, botones al frente y mangas con puño. De día con jean y de noche con la pollera de satén.', tags: ['blusa', 'camisa', 'saten', 'marfil', 'blanca', 'manga larga'] },
  { id: 'jean-recto', nombre: 'Jean recto tiro alto', cats: ['dia'], sub: 'bajos', precio: 46900, descuento: 15, color: 'Celeste', ops: tl([3, 6, 5, 4, 2], [2, 2, 1]), rango: 3, alta: 7,
    img: 'images/p-jean-recto.webp', alt: 'Jean recto de tiro alto en lavado celeste, doblado sobre una superficie clara',
    desc: 'Cinco bolsillos, tiro alto y pierna recta hasta el tobillo. Lavado celeste clásico que va con todo.', tags: ['jean', 'denim', 'celeste', 'recto', 'tiro alto', 'pantalon'] },
  { id: 'pantalon-amplio', nombre: 'Pantalón sastrero amplio', cats: ['dia'], sub: 'bajos', precio: 44900, descuento: 0, color: 'Verde salvia', ops: tl([2, 3, 4, 2, 1], [1, 0, 0]), rango: 4, alta: 6,
    img: 'images/p-pantalon-amplio.webp', alt: 'Pantalón sastrero de pierna ancha color verde salvia con pinzas, extendido sobre lino',
    desc: 'Tiro alto con pinzas al frente, bolsillos laterales y pierna ancha que cae recta. Color verde salvia.', tags: ['pantalon', 'sastrero', 'verde', 'amplio', 'palazzo', 'oficina'] },
  { id: 'blazer-negro', nombre: 'Blazer entallado negro', cats: ['noche', 'dia'], sub: 'abrigos', precio: 69900, descuento: 0, color: 'Negro', ops: tl([1, 3, 3, 2, 1]), rango: 5, alta: 5,
    img: 'images/p-blazer-negro.webp', alt: 'Blazer negro entallado de un botón con solapa, colgado en una percha de madera',
    desc: 'Corte entallado con solapa en punta, un botón y bolsillos con tapa. Forrado. Sobre un vestido o con jean.', tags: ['blazer', 'saco', 'negro', 'sastrero', 'oficina', 'abrigo'] },
  { id: 'top-lentejuelas', nombre: 'Top de lentejuelas con escote cascada', cats: ['noche'], sub: 'tops', precio: 32900, descuento: 0, color: 'Azul noche', ops: tl([2, 4, 3, 1, 0]), rango: 6, alta: 4,
    img: 'images/p-top-lentejuelas.webp', alt: 'Top de lentejuelas azul noche con breteles finos y escote cascada, colgado',
    desc: 'Lentejuelas azul noche con breteles finos y escote cascada al frente. Con pollera de satén o pantalón negro.', tags: ['top', 'lentejuelas', 'brillo', 'azul', 'fiesta', 'noche', 'musculosa'] },
  { id: 'camisa-blanca', nombre: 'Camisa blanca oversize', cats: ['dia'], sub: 'tops', precio: 34900, descuento: 0, color: 'Blanco', ops: tl([4, 6, 6, 4, 3], [2, 2, 1]), rango: 7, alta: 3,
    img: 'images/p-camisa-blanca.webp', alt: 'Camisa blanca oversize con bolsillo al pecho y mangas arremangables, colgada en una percha',
    desc: 'Calce amplio con bolsillo al pecho y mangas con presilla para arremangar. Sola, abierta sobre una remera o atada a la cintura.', tags: ['camisa', 'blanca', 'oversize', 'algodon', 'basica'] },
  { id: 'pollera-saten', nombre: 'Pollera midi de satén', cats: ['noche'], sub: 'bajos', precio: 36900, descuento: 0, color: 'Negro', ops: tl([2, 4, 4, 3, 2], [1, 1, 1]), rango: 8, alta: 2,
    img: 'images/p-pollera-saten.webp', alt: 'Pollera midi de satén negro al bies, extendida sobre lino claro',
    desc: 'Satén negro al bies, cintura elástica escondida y largo midi con caída suave. De noche con el top de lentejuelas.', tags: ['pollera', 'falda', 'saten', 'negra', 'midi'] },
  { id: 'vestido-rojo', nombre: 'Vestido rojo plisado', cats: ['noche'], sub: 'vestidos', precio: 62900, descuento: 0, color: 'Rojo', ops: tl([1, 2, 2, 1, 1], [1, 0, 0]), alta: 15,
    img: 'images/p-vestido-rojo.webp', alt: 'Vestido rojo plisado con manga corta y volados en el ruedo, colgado en una percha de madera',
    desc: 'Plisado liviano con manga corta, cintura fruncida y volados en el ruedo. Largo a la rodilla.', tags: ['vestido', 'rojo', 'plisado', 'fiesta', 'cumpleaños', 'noche'] },
  { id: 'vestido-marfil', nombre: 'Vestido satinado marfil', cats: ['noche'], sub: 'vestidos', precio: 68900, descuento: 0, color: 'Marfil', ops: tl([1, 2, 1, 0, 0]), alta: 14,
    img: 'images/p-vestido-marfil.webp', alt: 'Vestido de satén marfil con breteles finos y escote corazón, colgado de una percha metálica',
    desc: 'Satén marfil con breteles finos, escote corazón y falda larga con caída. Para casamientos y eventos de noche.', tags: ['vestido', 'saten', 'marfil', 'largo', 'fiesta', 'casamiento', 'evento'] },
  { id: 'vestido-corset', nombre: 'Vestido corset de tul', cats: ['noche'], sub: 'vestidos', precio: 74900, descuento: 0, color: 'Durazno', ops: tl([0, 1, 2, 1, 0]), alta: 13,
    img: 'images/p-vestido-corset.webp', alt: 'Vestido color durazno con corset drapeado, moño al costado y falda de tul, colgado junto a otro vestido con brillo',
    desc: 'Corset drapeado color durazno con moño al costado y falda de tul con vuelo. Para fiestas de 15, casamientos y egresos.', tags: ['vestido', 'corset', 'tul', 'durazno', 'rosa', 'fiesta', 'evento'] },
  { id: 'vestido-halter', nombre: 'Vestido halter estampado', cats: ['noche', 'dia'], sub: 'vestidos', precio: 49900, descuento: 0, color: 'Estampado', ops: tl([1, 2, 2, 1, 0]), alta: 12,
    img: 'images/p-vestido-halter.webp', alt: 'Vestido halter con estampado blanco y negro y cintura con tiras negras, colgado en una percha de madera',
    desc: 'Escote halter con estampado blanco y negro, cintura marcada con tiras y falda con vuelo a la rodilla.', tags: ['vestido', 'halter', 'estampado', 'blanco', 'negro', 'verano'] },
  { id: 'remera-basica', nombre: 'Remera básica de algodón', cats: ['dia'], sub: 'tops', precio: 18900, descuento: 0, color: 'Blanco', ops: tl([6, 9, 9, 6, 4], [3, 2, 2]), alta: 11,
    img: 'images/p-remera-basica.webp', alt: 'Remera blanca de algodón de manga corta y cuello redondo sobre fondo gris claro',
    desc: 'Algodón con cuello redondo y manga corta. La base que va debajo del blazer, con jean o con el pantalón amplio.', tags: ['remera', 'basica', 'blanca', 'algodon', 'top', 'manga corta'] },
  { id: 'sweater-ingles', nombre: 'Sweater de punto inglés', cats: ['dia'], sub: 'abrigos', precio: 42900, descuento: 10, colores: ['Camel', 'Crudo', 'Gris'], ops: tl([3, 4, 4, 2, 1], [1, 1, 0]), alta: 10,
    img: 'images/p-sweater-ingles.webp', alt: 'Tres sweaters de punto inglés en camel, crudo y gris, doblados uno sobre otro',
    desc: 'Tejido de punto inglés con escote en V y puños elastizados. Elegí camel, crudo o gris.', tags: ['sweater', 'pulover', 'tejido', 'abrigo', 'camel', 'gris', 'crudo'] },
  { id: 'trench-beige', nombre: 'Trench con cinto', cats: ['dia'], sub: 'abrigos', precio: 89900, descuento: 0, color: 'Beige', ops: tl([1, 2, 3, 2, 1], [1, 0, 0]), alta: 16,
    img: 'images/p-trench-beige.webp', alt: 'Trench beige con solapa ancha y cinto anudado, colgado sobre una pared gris',
    desc: 'Gabardina beige con solapa ancha, cinto anudado y mangas para arremangar. Para la media estación.', tags: ['trench', 'piloto', 'gabardina', 'beige', 'abrigo', 'campera'] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const redondear = n => Math.round(n / 100) * 100;
const precioFinal = p => (p.descuento > 0 ? redondear(p.precio * (1 - p.descuento / 100)) : p.precio);
const stockTotal = p => p.ops.reduce((s, o) => s + (o.stock || 0), 0);
const tienePlus = p => p.ops.some(o => T_PLUS.includes(o.v) && o.stock > 0);
const coloresDe = p => (p.colores && p.colores.length ? p.colores : p.color ? [p.color] : []);
const catDe = id => CATEGORIAS.find(c => c.id === id);
const ocasionDe = p => p.cats.map(c => catDe(c)?.nombre).filter(Boolean).join(' · ');

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir), talles = lista(f.talles), colores = lista(f.colores);
    if (cat.length && !p.cats.some(c => cat.includes(c))) return false;
    if (f.sub && p.sub !== f.sub) return false;
    if (f.ofertas && !(p.descuento > 0)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.stock && !(stockTotal(p) > 0)) return false;
    if (f.plus && !tienePlus(p)) return false;
    if (talles.length && !p.ops.some(o => talles.includes(o.v) && o.stock > 0)) return false;
    if (colores.length && !coloresDe(p).some(c => colores.includes(c))) return false;
    if (f.precioMin != null && precioFinal(p) < f.precioMin) return false;
    if (f.precioMax != null && precioFinal(p) > f.precioMax) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
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
      p.nombre, ocasionDe(p), TIPOS[p.sub], p.desc, ...coloresDe(p), ...p.ops.filter(o => o.stock > 0).map(o => o.v), ...(p.tags || []),
      tienePlus(p) ? 'plus size talle grande talles grandes' : '', p.descuento > 0 ? 'oferta ofertas descuento' : '',
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const tokensBusqueda = new Map();
function tokensDe(p) {
  if (!tokensBusqueda.has(p.id)) tokensBusqueda.set(p.id, new Set(textoDe(p).split(/[^a-z0-9]+/).filter(Boolean)));
  return tokensBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => (w.length <= 3 ? tokensDe(p).has(w) : textoDe(p).includes(w)));

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
      if (coincideBusqueda(p, palabras)) {
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

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));
const talleDe = v => String(v).split(' · ').pop();
const stockDe = (p, v) => p.ops.find(o => o.v === talleDe(v))?.stock || 0;
const varTexto = (p, v) => {
  const partes = String(v).split(' · ');
  const color = partes.length > 1 ? partes[0] : coloresDe(p)[0];
  return [color, `talle ${talleDe(v)}`].filter(Boolean).join(' · ');
};
const leerTalle = () => { try { const t = localStorage.getItem(KEY_TALLE); return T_TODOS.includes(t) ? t : ''; } catch { return ''; } };
const guardarTalle = t => { try { localStorage.setItem(KEY_TALLE, t); } catch (e) { void e; } };

const Cart = {
  KEY: 'queen_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = producto.ops[0].v) {
    const items = this.get();
    const max = stockDe(producto, v) || 0;
    if (!max) return 0;
    const existing = items.find(i => i.id === producto.id && i.v === v);
    const antes = existing ? existing.qty : 0;
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, v, qty: Math.min(qty, max) });
    this.save(items);
    return (existing ? existing.qty : Math.min(qty, max)) - antes;
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.v === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p ? stockDe(p, v) || 1 : 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (v == null || i.v === v)))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const ICO = {
  flecha: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  info: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  regla: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>',
  compartir: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4"/><path d="m15.4 6.5-6.8 4"/></svg>',
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

function precioHTML(p, clase = 'precio') {
  return `<p class="${clase}"><b>${formatearPrecio(precioFinal(p))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function swatchesHTML(p) {
  return `<span class="swatches" aria-label="Color: ${esc(coloresDe(p).join(' o '))}">${coloresDe(p).map(c => `<i style="--sw:${COLORES[c] || '#ccc'}" title="${esc(c)}"></i>`).join('')}</span>`;
}
function tallesHTML(p) {
  const mio = leerTalle();
  const base = p.ops.filter(o => T_BASE.includes(o.v)).map(o => {
    const cls = [o.stock > 0 ? (o.stock <= 1 ? 'es-ultimo' : '') : 'es-agotado', o.v === mio ? 'es-mio' : ''].filter(Boolean).join(' ');
    const txt = o.stock > 0 ? (o.stock <= 1 ? `${o.v}, última unidad` : `${o.v}, con stock`) : `${o.v}, sin stock`;
    return `<li${cls ? ` class="${cls}"` : ''} aria-label="${esc(txt)}">${esc(o.v)}</li>`;
  }).join('');
  const plus = tienePlus(p) ? `<li class="es-plus${T_PLUS.includes(mio) ? ' es-mio' : ''}" aria-label="También en plus size">+ Plus</li>` : '';
  return `<ul class="talles" aria-label="Talles disponibles">${base}${plus}</ul>`;
}

function cardHTML(p, { anim = true, clase = '' } = {}) {
  const sinStock = !(stockTotal(p) > 0);
  let badge = '';
  if (p.descuento > 0) badge = `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>`;
  else if (!sinStock && stockTotal(p) <= 5) badge = '<span class="pcard__badge">Últimas unidades</span>';
  return `<article class="pcard${clase ? ' ' + clase : ''}${sinStock ? ' pcard--sin' : ''}" data-id="${esc(p.id)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : ''}>
  <div class="pcard__media">
    <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000"></a>
    ${badge}
    <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}"${sinStock ? ' disabled' : ''}>${sinStock ? 'Sin stock' : 'Comprar ahora'}</button>
  </div>
  <div class="pcard__info">
    <p class="pcard__meta">${swatchesHTML(p)}<span>${esc(ocasionDe(p))}</span></p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    ${precioHTML(p, 'pcard__precio')}
    ${tallesHTML(p)}
    <div class="prod-actions">
      <div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qty>1</span><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
      <button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="${sinStock ? 'Sin stock' : 'Agregar al carrito'}: ${esc(p.nombre)}"${sinStock ? ' disabled' : ''}>${ICO.carrito}<span>${sinStock ? 'Sin stock' : 'Agregar'}</span></button>
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
  const desktopMq = window.matchMedia('(min-width: 1101px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, .nav-drop__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuTienda(sel = {}) {
  document.querySelectorAll('[data-nav-drop]').forEach(box => {
    const btn = box.querySelector('.nav-drop__btn');
    const panel = box.querySelector('.nav-drop__panel');
    const lista = box.querySelector('[data-drop-lista]');
    if (!btn || !panel || !lista) return;
    lista.innerHTML = CATEGORIAS.map(c => {
      const actual = c.id === sel.cat && !sel.sub && !sel.plus;
      const subs = Object.entries(TIPOS).map(([k, v]) => [k, v, Tienda.contar({ cat: c.id, sub: k })]).filter(s => s[2] > 0);
      return `<li class="nav-drop__col">
      <a class="nav-drop__cat" href="${URL_CATALOGO}?cat=${c.id}"${actual ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="52" height="52"><span>${esc(c.nombre)}</span><span class="nav-drop__n">${Tienda.contar({ cat: c.id })}</span></a>
      <ul class="nav-drop__subs">${subs.map(([k, v, n]) => `<li><a href="${URL_CATALOGO}?cat=${c.id}&amp;sub=${k}"${c.id === sel.cat && k === sel.sub ? ' aria-current="page"' : ''}>${esc(v)} <small>${n}</small></a></li>`).join('')}</ul>
    </li>`;
    }).join('');
    const plusN = box.querySelector('[data-drop-plus-n]');
    if (plusN) plusN.textContent = Tienda.contar({ plus: true });
    const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1101px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
    panel.addEventListener('click', e => { if (e.target.closest('a')) cerrar(); });
  });
}

function initCuentas() {
  document.querySelectorAll('[data-cuenta]').forEach(el => {
    const f = {};
    const [tipo, valor] = el.dataset.cuenta.split(':');
    if (tipo === 'cat') f.cat = valor;
    if (tipo === 'plus') f.plus = true;
    const n = Tienda.contar(f);
    el.textContent = `${n} ${n === 1 ? 'prenda' : 'prendas'}`;
  });
}

function initRegla() {
  const mio = leerTalle();
  document.querySelectorAll('[data-regla] a[data-talle]').forEach(a => {
    a.classList.toggle('es-mio', a.dataset.talle === mio);
    if (a.dataset.talle === mio) a.setAttribute('aria-label', `Talle ${mio}, tu talle guardado`);
  });
}

function pintarRail(track, items) {
  items.forEach(cachear);
  track.innerHTML = items.map(p => `<div class="rail-item"><div class="rail-in" data-animate="der" style="opacity:0;transform:translateX(56px)">${cardHTML(p, { anim: false })}</div></div>`).join('');
}
function idsDestacados() {
  return Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 }).items.map(p => p.id);
}
function initRail() {
  const track = document.querySelector('[data-rail-track]');
  if (!track) return;
  const { items } = Tienda.consultar({ filtros: { excluir: idsDestacados() }, orden: 'nuevos', limite: 8 });
  pintarRail(track, items);
  const vp = track.closest('[data-rail]');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 20;
  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= Math.min(inicio, 2) + 2;
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
      const items = [...track.children];
      const destino = items.reduce((best, it) => {
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

function initVistaPrevia() {
  const cont = document.querySelector('[data-preview]');
  if (!cont) return;
  const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  const mosaico = cont.hasAttribute('data-mosaico');
  const todo = mosaico ? `<a class="mosaico__todo" href="${URL_CATALOGO}" data-animate="subir" style="opacity:0;transform:translateY(40px)"><span class="mosaico__todo-tit">Ver toda la colección</span><span class="mosaico__todo-n">${Tienda.contar({})} prendas del S al XXL y plus size</span>${ICO.flecha}</a>` : '';
  cont.innerHTML = items.map((p, i) => cardHTML(p, { clase: mosaico && i === 0 ? 'pcard--grande' : '' })).join('') + todo;
}

function cerrarPickers(excepto) {
  document.querySelectorAll('.picker').forEach(pk => { if (pk !== excepto) pk.remove(); });
}
function pickerHTML(p, colorSel) {
  const colores = coloresDe(p);
  const mio = leerTalle();
  const filaColor = colores.length > 1
    ? `<p class="picker__tit picker__tit--sub">Color</p><div class="picker__colores">${colores.map(c => `<button type="button" class="picker__color" data-picker-color="${esc(c)}" aria-pressed="${c === colorSel}"><i style="--sw:${COLORES[c] || '#ccc'}"></i>${esc(c)}</button>`).join('')}</div>`
    : '';
  const op = o => `<button type="button" class="picker__op${o.v === mio ? ' es-mio' : ''}" data-picker-op="${esc(o.v)}"${o.stock > 0 ? '' : ' disabled'} aria-label="Talle ${esc(o.v)}${o.stock > 0 ? (o.stock <= 1 ? ', última unidad' : '') : ', sin stock'}">${esc(o.v)}${o.stock === 1 ? '<small>última</small>' : ''}</button>`;
  const plus = p.ops.filter(o => T_PLUS.includes(o.v));
  return `<div class="picker__head"><p class="picker__tit">Elegí tu talle</p><button type="button" class="picker__cerrar" data-picker-cerrar aria-label="Cerrar">${ICO.x}</button></div>
    ${filaColor}
    <div class="picker__ops">${p.ops.filter(o => T_BASE.includes(o.v)).map(op).join('')}</div>
    ${plus.length ? `<p class="picker__tit picker__tit--sub">Plus size</p><div class="picker__ops">${plus.map(op).join('')}</div>` : `<a class="picker__plus" href="${wspLink(`Hola ${MARCA}! ¿El ${p.nombre} viene en plus size?`)}" target="_blank" rel="noopener">¿Lo buscás en plus size? Consultanos</a>`}`;
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
  pk.dataset.color = coloresDe(p)[0] || '';
  pk.innerHTML = pickerHTML(p, pk.dataset.color) + (qty > 1 ? `<p class="picker__nota">Vas a sumar ${qty} unidades.</p>` : '');
  card.appendChild(pk);
  (pk.querySelector('.picker__op.es-mio:not([disabled])') || pk.querySelector('.picker__op:not([disabled])') || pk.querySelector('.picker__cerrar'))?.focus({ preventScroll: true });
}

function sumarAlCarrito(p, qty, v, comprar) {
  const sumadas = Cart.add(p, qty, v);
  if (!sumadas) { showToast(stockDe(p, v) ? `Ya tenés todo el stock del talle ${talleDe(v)} en el carrito.` : 'Ese talle no tiene stock por ahora.'); if (comprar) abrirCarrito(); return; }
  if (comprar) { abrirCarrito(); return; }
  showToast(`Sumaste ${sumadas > 1 ? sumadas + ' × ' : ''}${p.nombre} (${varTexto(p, v)}) al carrito`);
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick && !e.target.closest('.picker')) {
      e.preventDefault();
      abrirQV(quick.dataset.quick, quick);
      return;
    }
    const step = e.target.closest('[data-step]');
    if (step) {
      const box = step.closest('[data-stepper]');
      const n = box?.querySelector('[data-qty]');
      if (!n) return;
      const card = step.closest('.pcard');
      const p = card ? getProducto(card.dataset.id) : null;
      const max = p ? Math.max(...p.ops.map(o => o.stock), 1) : 99;
      n.textContent = String(Math.max(1, Math.min(max, (parseInt(n.textContent, 10) || 1) + Number(step.dataset.step))));
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
    const colorBtn = e.target.closest('[data-picker-color]');
    if (colorBtn) {
      const pk = colorBtn.closest('.picker');
      pk.dataset.color = colorBtn.dataset.pickerColor;
      pk.querySelectorAll('[data-picker-color]').forEach(b => b.setAttribute('aria-pressed', String(b === colorBtn)));
      return;
    }
    const opBtn = e.target.closest('[data-picker-op]');
    if (opBtn) {
      const pk = opBtn.closest('.picker');
      const card = opBtn.closest('.pcard');
      const p = getProducto(card?.dataset.id);
      if (!p || !pk) return;
      const v = coloresDe(p).length > 1 ? `${pk.dataset.color} · ${opBtn.dataset.pickerOp}` : opBtn.dataset.pickerOp;
      sumarAlCarrito(p, parseInt(pk.dataset.qty, 10) || 1, v, pk.dataset.modo === 'comprar');
      pk.remove();
      if (pk.dataset.modo !== 'comprar') card.querySelector('[data-add]')?.focus({ preventScroll: true });
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

let ultimoFoco = null;
function atraparFoco(panel, e) {
  if (e.key !== 'Tab' || !panel) return;
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function guiaTablaHTML(resaltar = '') {
  return `<table><thead><tr><th scope="col">Talle</th><th scope="col">Busto</th><th scope="col">Cintura</th><th scope="col">Cadera</th></tr></thead>
    <tbody>${GUIA.map(([t, b1, b2, c1, c2, d1, d2]) => `<tr data-guia-fila="${t}"${t === resaltar ? ' class="es-actual"' : ''}${T_PLUS.includes(t) ? ' data-plus' : ''}><th scope="row">${t}</th><td>${b1}-${b2}</td><td>${c1}-${c2}</td><td>${d1}-${d2}</td></tr>`).join('')}</tbody></table>`;
}

const qvEstado = { p: null, talle: '', color: '', qty: 1 };
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  cerrarPickers();
  qvEstado.p = p;
  const mio = leerTalle();
  qvEstado.talle = p.ops.find(o => o.v === mio && o.stock > 0) ? mio : '';
  qvEstado.color = coloresDe(p)[0] || '';
  qvEstado.qty = 1;
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
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc, color: coloresDe(p).join(', '),
    brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: stockTotal(p) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function pintarQV() {
  const p = qvEstado.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const { items: rel } = Tienda.consultar({ filtros: { cat: p.cats, excluir: p.id, stock: true }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const sinStock = !(stockTotal(p) > 0);
  const colores = coloresDe(p);
  const op = p.ops.find(o => o.v === qvEstado.talle);
  const stockTxt = sinStock ? 'Sin stock por ahora' : !op ? 'Elegí un talle para ver cuántas quedan' : op.stock === 1 ? `Queda 1 en talle ${op.v}` : op.stock <= 3 ? `Quedan ${op.stock} en talle ${op.v}` : `Talle ${op.v} en stock`;
  const selColor = colores.length > 1
    ? `<div class="qv__var"><p class="qv__var-tit">Color: <b>${esc(qvEstado.color)}</b></p><div class="qv__colores" role="radiogroup" aria-label="Color">${colores.map(c => `<button type="button" class="qv__color" role="radio" aria-checked="${c === qvEstado.color}" data-qv-color="${esc(c)}"><i style="--sw:${COLORES[c] || '#ccc'}"></i>${esc(c)}</button>`).join('')}</div></div>`
    : `<p class="qv__color-fijo">${swatchesHTML(p)}Color: ${esc(colores[0] || '')}</p>`;
  const boton = o => `<button type="button" class="qv__op" role="radio" aria-checked="${o.v === qvEstado.talle}" data-qv-talle="${esc(o.v)}"${o.stock > 0 ? '' : ' disabled'}>${esc(o.v)}</button>`;
  const plus = p.ops.filter(o => T_PLUS.includes(o.v));
  const selTalle = `<div class="qv__var" data-qv-talles><p class="qv__var-tit">Talle${qvEstado.talle ? `: <b>${esc(qvEstado.talle)}</b>` : ''}</p>
    <div class="qv__ops" role="radiogroup" aria-label="Talle">${p.ops.filter(o => T_BASE.includes(o.v)).map(boton).join('')}${plus.length ? `<span class="qv__ops-sep" aria-hidden="true">Plus</span>${plus.map(boton).join('')}` : ''}</div>
    <p class="qv__aviso" data-qv-aviso hidden>Elegí un talle para sumarlo al carrito.</p></div>`;
  const compartir = `${new URL(location.pathname, location.href).href}?producto=${p.id}`;
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000">${p.descuento > 0 ? `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>` : ''}</div>
    <div class="qv__info">
      <p class="qv__meta">${esc(ocasionDe(p))} · ${esc(TIPOS[p.sub])}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      ${precioHTML(p, 'qv__precio')}
      ${selColor}
      ${selTalle}
      <p class="qv__stock${sinStock ? ' qv__stock--sin' : ''}">${sinStock || !op ? ICO.info : ICO.check}<span data-qv-stock>${esc(stockTxt)}</span></p>
      <div class="qv__acc">
        <div class="stepper" data-qv-stepper><button type="button" data-qv-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qv-qty>${qvEstado.qty}</span><button type="button" data-qv-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="btn btn--cta" data-qv-add${sinStock ? ' disabled' : ''}>${ICO.carrito}Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-comprar${sinStock ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      <details class="qv__det" open><summary>${ICO.info}Detalle de la prenda</summary><p>${esc(p.desc)}</p></details>
      <details class="qv__det"><summary>${ICO.regla}Guía de talles</summary><div class="guia"><p class="guia__tit">Medidas del cuerpo, en centímetros</p>${guiaTablaHTML(qvEstado.talle)}<p class="guia__nota">Si estás entre dos talles, escribinos y te ayudamos a elegir.</p></div></details>
      <div class="qv__links">
        <a class="qv__wsp" href="${wspLink(`Hola ${MARCA}! Quiero consultar el stock de: ${p.nombre}${qvEstado.talle ? ` (talle ${qvEstado.talle})` : ''}`)}" target="_blank" rel="noopener">${ICO.wsp}<span>${plus.length || sinStock ? 'Consultar stock por WhatsApp' : '¿Lo buscás en plus size? Consultanos'}</span></a>
        <a class="qv__share" href="https://wa.me/?text=${encodeURIComponent(`Mirá esta prenda de ${MARCA}: ${p.nombre} ${compartir}`)}" target="_blank" rel="noopener">${ICO.compartir}<span>Compartir por WhatsApp</span></a>
      </div>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">Para combinar</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><b>${formatearPrecio(precioFinal(r))}</b></button>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
}
function cerrarQV() {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  if (!document.getElementById('cartDrawer')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  setTimeout(() => { qv.hidden = true; }, 320);
  const url = new URL(location.href);
  url.searchParams.delete('producto');
  window.history.replaceState(null, '', url);
  if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus({ preventScroll: true });
}
function initQV() {
  const qv = document.getElementById('qv');
  if (!qv) return;
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const p = qvEstado.p;
    if (!p) return;
    const talleBtn = e.target.closest('[data-qv-talle]');
    if (talleBtn) {
      qvEstado.talle = talleBtn.dataset.qvTalle;
      const max = p.ops.find(o => o.v === qvEstado.talle)?.stock || 1;
      qvEstado.qty = Math.min(qvEstado.qty, max);
      const abierta = qv.querySelector('.qv__det:nth-of-type(2)')?.open;
      pintarQV();
      if (abierta) qv.querySelectorAll('.qv__det')[1].open = true;
      qv.querySelector(`[data-qv-talle="${window.CSS.escape(qvEstado.talle)}"]`)?.focus();
      return;
    }
    const colorBtn = e.target.closest('[data-qv-color]');
    if (colorBtn) {
      qvEstado.color = colorBtn.dataset.qvColor;
      pintarQV();
      qv.querySelector(`[data-qv-color="${window.CSS.escape(qvEstado.color)}"]`)?.focus();
      return;
    }
    const step = e.target.closest('[data-qv-step]');
    if (step) {
      const max = p.ops.find(o => o.v === qvEstado.talle)?.stock || Math.max(...p.ops.map(o => o.stock), 1);
      qvEstado.qty = Math.max(1, Math.min(max, qvEstado.qty + Number(step.dataset.qvStep)));
      qv.querySelector('[data-qv-qty]').textContent = String(qvEstado.qty);
      return;
    }
    const comprar = e.target.closest('[data-qv-comprar]');
    const agregar = e.target.closest('[data-qv-add]');
    if (!comprar && !agregar) return;
    if (!qvEstado.talle) {
      const aviso = qv.querySelector('[data-qv-aviso]');
      if (aviso) { aviso.hidden = false; aviso.classList.remove('sacude'); void aviso.offsetWidth; aviso.classList.add('sacude'); }
      qv.querySelector('.qv__op:not([disabled])')?.focus();
      return;
    }
    const v = coloresDe(p).length > 1 ? `${qvEstado.color} · ${qvEstado.talle}` : qvEstado.talle;
    if (comprar) { Cart.add(p, qvEstado.qty, v); cerrarQV(); abrirCarrito(); return; }
    sumarAlCarrito(p, qvEstado.qty, v, false);
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const id = PARAMS.get('producto');
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
  setTimeout(() => { dr.hidden = true; }, 380);
  if (focoCarrito && document.contains(focoCarrito)) focoCarrito.focus({ preventScroll: true });
}
function renderCarrito() {
  const body = document.getElementById('cartLines');
  const foot = document.getElementById('cartFoot');
  const cuenta = document.querySelector('[data-cart-titulo-n]');
  if (!body || !foot) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  if (cuenta) cuenta.textContent = items.length ? `(${Cart.count()})` : '';
  if (!items.length) {
    body.innerHTML = `<div class="cart-vacio">${ICO.carrito}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Elegí una prenda, marcá tu talle y sumala acá.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver a la colección</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul class="lineas">${items.map(i => {
    const p = getProducto(i.id);
    return `<li class="linea" data-linea="${esc(i.id)}" data-v="${esc(i.v)}">
      <img src="${esc(p.img)}" alt="" width="80" height="80">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(varTexto(p, i.v))} · ${formatearPrecio(precioFinal(p))} c/u</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n">${i.qty}</span><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); return `- ${i.qty} × ${p.nombre} (${varTexto(p, i.v)}): ${formatearPrecio(precioFinal(p) * i.qty)}`; }).join('\n');
  const msg = `Hola ${MARCA}! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: `;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--line" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>`;
}
function initCarrito() {
  const dr = document.getElementById('cartDrawer');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-cart]')) { abrirCarrito(); return; }
    if (e.target.closest('[data-finalizar]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  if (!dr) return;
  dr.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-cart]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea, v = linea.dataset.v;
    const step = e.target.closest('[data-linea-step]');
    if (step) {
      const it = Cart.get().find(i => i.id === id && i.v === v);
      if (it) Cart.setQty(id, v, it.qty + Number(step.dataset.lineaStep));
      [...dr.querySelectorAll('[data-linea]')].find(l => l.dataset.linea === id && l.dataset.v === v)?.querySelector(`[data-linea-step="${step.dataset.lineaStep}"]`)?.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('[data-linea-quitar]')) {
      Cart.remove(id, v);
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

function sugerirTalle(medidas) {
  const idx = (valor, desde) => {
    if (!valor) return -1;
    const i = GUIA.findIndex(f => valor <= f[desde + 1]);
    return i < 0 ? GUIA.length : i;
  };
  const partes = [['busto', 1], ['cintura', 3], ['cadera', 5]].map(([k, d]) => [k, idx(medidas[k], d)]);
  const max = Math.max(...partes.map(p => p[1]));
  if (max < 0) return null;
  return { talle: GUIA[Math.min(max, GUIA.length - 1)][0], fuera: max >= GUIA.length, partes: partes.filter(p => p[1] >= 0).map(([k, i]) => [k, GUIA[Math.min(i, GUIA.length - 1)][0]]) };
}

function initTalle() {
  const form = document.querySelector('[data-talle-form]');
  if (!form) return;
  const tabla = document.querySelector('[data-talle-tabla]');
  const res = document.querySelector('[data-talle-res]');
  if (tabla) tabla.innerHTML = guiaTablaHTML(leerTalle());
  const campos = [...form.querySelectorAll('input[type="number"]')];
  const pintar = r => {
    if (!res) return;
    if (!r) { res.hidden = true; return; }
    const n = Tienda.contar({ talles: [r.talle] });
    const esPlus = T_PLUS.includes(r.talle);
    res.hidden = false;
    res.innerHTML = `<p class="talle-res__eti">Tu talle sugerido</p>
      <p class="talle-res__talle">${esc(r.talle)}${esPlus ? '<small>plus size</small>' : ''}</p>
      <p class="talle-res__det">${r.partes.map(([k, t]) => `${k[0].toUpperCase() + k.slice(1)}: ${t}`).join(' · ')}${r.partes.length > 1 && new Set(r.partes.map(p => p[1])).size > 1 ? '. Tomamos el más grande para que te quede cómodo.' : ''}${r.fuera ? ' Tus medidas pasan la tabla: escribinos y vemos qué prendas te quedan.' : ''}</p>
      <div class="talle-res__acc">
        <a class="btn btn--cta" href="${URL_CATALOGO}?talle=${encodeURIComponent(r.talle)}">Ver ${n} ${n === 1 ? 'prenda' : 'prendas'} en talle ${esc(r.talle)}${ICO.flecha}</a>
        <button type="button" class="btn btn--line" data-talle-guardar="${esc(r.talle)}">${leerTalle() === r.talle ? `${ICO.check}Guardado como tu talle` : 'Guardar como mi talle'}</button>
      </div>`;
    tabla?.querySelectorAll('[data-guia-fila]').forEach(tr => tr.classList.toggle('es-actual', tr.dataset.guiaFila === r.talle));
  };
  const leer = () => {
    const m = {};
    let error = false;
    campos.forEach(c => {
      const v = c.value.trim() === '' ? null : Number(c.value);
      const malo = v != null && (!Number.isFinite(v) || v < 50 || v > 180);
      c.setAttribute('aria-invalid', String(malo));
      const err = form.querySelector(`[data-error-de="${c.id}"]`);
      if (err) err.hidden = !malo;
      if (malo) error = true;
      else m[c.name] = v;
    });
    return { m, error };
  };
  form.addEventListener('input', () => {
    const { m, error } = leer();
    if (error) return;
    pintar(sugerirTalle(m));
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const { m, error } = leer();
    if (error) { form.querySelector('[aria-invalid="true"]')?.focus(); return; }
    const r = sugerirTalle(m);
    if (!r) { campos[0]?.focus(); showToast('Cargá al menos una medida en centímetros.'); return; }
    pintar(r);
  });
  res?.addEventListener('click', e => {
    const b = e.target.closest('[data-talle-guardar]');
    if (!b) return;
    guardarTalle(b.dataset.talleGuardar);
    b.innerHTML = `${ICO.check}Guardado como tu talle`;
    showToast(`Listo: marcamos el talle ${b.dataset.talleGuardar} en cada prenda.`);
    document.querySelectorAll('.pcard').forEach(card => {
      const p = getProducto(card.dataset.id);
      const ul = card.querySelector('.talles');
      if (p && ul) ul.outerHTML = tallesHTML(p);
    });
    initRegla();
  });
}

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return {};
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const lista = k => (PARAMS.get(k) || '').split(',').map(s => s.trim()).filter(Boolean);
  const estado = {
    cat: valido(PARAMS.get('cat'), catIds),
    sub: valido(PARAMS.get('sub'), TIPOS),
    talles: new Set(lista('talle').map(t => t.toUpperCase()).filter(t => T_TODOS.includes(t))),
    plus: PARAMS.get('plus') === '1',
    colores: new Set(lista('color').filter(c => COLORES[c])),
    precio: valido(PARAMS.get('precio'), RANGOS),
    ofertas: PARAMS.get('ofertas') === '1',
    stock: PARAMS.get('stock') === '1',
    q: (PARAMS.get('q') || '').trim().slice(0, 60),
    orden: valido(PARAMS.get('orden'), ORDENES) || 'destacados',
  };
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const filtrosN = document.querySelector('[data-filtros-n]');
  const subsBox = document.querySelector('[data-subs]');
  const activosBox = document.querySelector('[data-activos]');

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoChip = cont.dataset.catOpciones === 'chips';
    const opciones = [{ id: '', nombre: 'Todo' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => (comoChip
      ? `<button type="button" class="chip" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.nombre)} <small data-cuenta-filtro-cat="${c.id}"></small></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Toda la colección')}</span><span class="opt__n" data-cuenta-filtro-cat="${c.id}"></span></label>`)).join('')
      + (comoChip ? '<button type="button" class="chip chip--plus" data-filtro-plus aria-pressed="false">Plus size <small data-cuenta-plus></small></button>' : '');
  });
  document.querySelectorAll('[data-talle-opciones]').forEach(cont => {
    cont.innerHTML = [['Del S al XXL', T_BASE], ['Plus size', T_PLUS]].map(([nombre, talles]) => `<div class="tgrupo"><p class="tgrupo__tit">${esc(nombre)}</p><div class="tgrupo__ops">${talles.map(t => `<label class="talle-op"><input type="checkbox" value="${esc(t)}" data-f="talle"><span>${esc(t)}</span></label>`).join('')}</div></div>`).join('');
  });
  document.querySelectorAll('[data-color-opciones]').forEach(cont => {
    const usados = Object.keys(COLORES).filter(c => Tienda.contar({ colores: [c] }) > 0);
    cont.innerHTML = usados.map(c => `<label class="color-op"><input type="checkbox" value="${esc(c)}" data-f="color"><i style="--sw:${COLORES[c]}"></i><span>${esc(c)}</span></label>`).join('');
  });
  document.querySelectorAll('[data-precio-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todos los precios'], ...Object.entries(RANGOS).map(([k, r]) => [k, r.nombre])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-precio" value="${k}" data-filtro="precio"><span>${esc(n)}</span></label>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.sub && sin !== 'sub') f.sub = estado.sub;
    if (estado.plus && sin !== 'plus') f.plus = true;
    if (estado.ofertas && sin !== 'ofertas') f.ofertas = true;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    if (estado.stock && sin !== 'stock') f.stock = true;
    if (estado.talles.size && sin !== 'talle') f.talles = [...estado.talles];
    if (estado.colores.size && sin !== 'color') f.colores = [...estado.colores];
    return f;
  };
  const pintarSubs = () => {
    if (!subsBox) return;
    const base = filtrosDe('sub');
    const tipos = Object.entries(TIPOS).filter(([k]) => Tienda.contar({ ...base, sub: k }) > 0 || k === estado.sub);
    subsBox.hidden = false;
    subsBox.innerHTML = [['', 'Todas las prendas'], ...tipos].map(([k, v]) => `<button type="button" class="chip chip--sub" data-filtro="sub" data-valor="${k}" aria-pressed="${estado.sub === k}">${esc(v)}</button>`).join('');
  };
  const pintarActivos = () => {
    if (!activosBox) return;
    const chips = [];
    if (estado.plus) chips.push(['plus', '', 'Plus size']);
    estado.talles.forEach(t => chips.push(['talle', t, `Talle ${t}`]));
    estado.colores.forEach(c => chips.push(['color', c, c]));
    if (estado.precio) chips.push(['precio', '', RANGOS[estado.precio].nombre]);
    if (estado.ofertas) chips.push(['ofertas', '', 'Con descuento']);
    if (estado.stock) chips.push(['stock', '', 'Solo con stock']);
    if (estado.q) chips.push(['q', '', `«${estado.q}»`]);
    activosBox.hidden = !chips.length;
    activosBox.innerHTML = chips.map(([f, v, t]) => `<button type="button" class="activo" data-quitar="${f}" data-valor="${esc(v)}" aria-label="Quitar filtro: ${esc(t)}">${esc(t)}${ICO.x}</button>`).join('') + (chips.length ? '<button type="button" class="activo activo--limpiar" data-limpiar>Limpiar filtros</button>' : '');
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === (estado[f] || '');
      else if (el.type === 'checkbox') el.checked = !!estado[f];
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === (estado[f] || '')));
    });
    document.querySelectorAll('[data-filtro-plus]').forEach(el => el.setAttribute('aria-pressed', String(estado.plus)));
    document.querySelectorAll('input[data-f="talle"]').forEach(el => { el.checked = estado.talles.has(el.value); });
    document.querySelectorAll('input[data-f="color"]').forEach(el => { el.checked = estado.colores.has(el.value); });
    pintarSubs();
    pintarActivos();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-filtro-cat]').forEach(el => {
      const id = el.dataset.cuentaFiltroCat;
      el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) });
    });
    document.querySelectorAll('[data-cuenta-plus]').forEach(el => { el.textContent = Tienda.contar({ ...filtrosDe('plus'), plus: true }); });
    const enPanel = estado.talles.size + estado.colores.size + (estado.precio ? 1 : 0) + (estado.ofertas ? 1 : 0) + (estado.stock ? 1 : 0) + (estado.plus && document.querySelector('#filtros [data-filtro="plus"]') ? 1 : 0) + (document.querySelector('#filtros [data-cat-opciones]') && estado.cat ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    const cat = catIds[estado.cat];
    let titulo = estado.plus && !cat && !estado.sub ? 'Plus size' : cat ? cat.nombre : estado.sub ? TIPOS[estado.sub] : estado.ofertas ? 'Con descuento' : estado.orden === 'nuevos' ? 'Recién llegados' : 'Toda la colección';
    if (cat && estado.sub) titulo = `${TIPOS[estado.sub]} · ${cat.nombre}`;
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = estado.plus && !cat ? 'Prendas que vienen del 3XL al 5XL, con el stock de cada talle a la vista.' : cat ? cat.bajada : 'Ropa de mujer para el día y la noche, del S al XXL y plus size. Elegí tu talle en cada prenda y sumala al carrito.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = titulo === 'Toda la colección'; miga.textContent = titulo; }
    document.title = `${titulo} — ${MARCA} · Tus reglas, tu look`;
    document.querySelectorAll('.nav-drop__cat, .nav-drop__subs a, .nav-drop__plus').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      const es = (u.searchParams.get('cat') || '') === estado.cat && (u.searchParams.get('sub') || '') === estado.sub && (u.searchParams.get('plus') === '1') === estado.plus && (estado.cat || estado.plus);
      if (es) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'sub', 'talle', 'plus', 'color', 'precio', 'q', 'orden', 'stock', 'ofertas'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.sub) u.searchParams.set('sub', estado.sub);
    if (estado.talles.size) u.searchParams.set('talle', [...estado.talles].join(','));
    if (estado.plus) u.searchParams.set('plus', '1');
    if (estado.colores.size) u.searchParams.set('color', [...estado.colores].join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.ofertas) u.searchParams.set('ofertas', '1');
    if (estado.stock) u.searchParams.set('stock', '1');
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
      else { const total = Tienda.contar(filtrosDe()); cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'prenda' : 'prendas'}` : ''; }
    }
    if (agregar && !res.items.length) showToast('No hay más resultados para esa búsqueda.');
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => {
    estado.cat = ''; estado.sub = ''; estado.precio = ''; estado.ofertas = false; estado.stock = false; estado.plus = false; estado.q = '';
    estado.talles.clear(); estado.colores.clear();
    if (buscar) buscar.value = '';
    aplicar();
  };

  document.addEventListener('change', e => {
    const multi = e.target.closest('input[data-f]');
    if (multi) {
      const set = multi.dataset.f === 'talle' ? estado.talles : estado.colores;
      if (multi.checked) set.add(multi.value); else set.delete(multi.value);
      aplicar();
      return;
    }
    const el = e.target.closest('input[data-filtro]');
    if (!el) return;
    const f = el.dataset.filtro;
    if (el.type === 'checkbox') estado[f] = el.checked;
    else estado[f] = el.value;
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) {
      estado[b.dataset.filtro] = b.dataset.valor || '';
      aplicar();
      return;
    }
    if (e.target.closest('[data-filtro-plus]')) { estado.plus = !estado.plus; aplicar(); return; }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const f = quitar.dataset.quitar;
      if (f === 'talle') estado.talles.delete(quitar.dataset.valor);
      else if (f === 'color') estado.colores.delete(quitar.dataset.valor);
      else if (f === 'q') { estado.q = ''; if (buscar) buscar.value = ''; }
      else estado[f] = typeof estado[f] === 'boolean' ? false : '';
      aplicar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) limpiar();
  });
  ordenSel?.addEventListener('change', () => { estado.orden = valido(ordenSel.value, ORDENES) || 'destacados'; aplicar(); });
  let tBuscar = 0;
  buscar?.addEventListener('input', () => { clearTimeout(tBuscar); tBuscar = setTimeout(() => { estado.q = buscar.value.trim().slice(0, 60); aplicar(); }, 260); });
  document.querySelector('[data-cat-buscar-form]')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tBuscar); estado.q = (buscar?.value || '').trim().slice(0, 60); aplicar(); buscar?.blur(); });
  verMas?.addEventListener('click', () => pintar(true));

  const filtros = document.getElementById('filtros');
  const abrirF = document.querySelector('[data-filtros-abrir]');
  if (filtros && window.getComputedStyle(filtros).position === 'fixed') filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  if (filtros && abrirF) {
    const bd = document.createElement('div');
    bd.className = 'filtros-bd';
    document.body.appendChild(bd);
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => { filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true'); filtros.querySelector('button, input')?.focus({ preventScroll: true }); });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    filtros.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); else if (filtros.classList.contains('open')) atraparFoco(filtros, e); });
  }

  sincronizarUI();
  escribirURL();
  pintar();
  if (PARAMS.has('q') && !estado.q && buscar) buscar.focus({ preventScroll: true });
  return { cat: estado.cat, sub: estado.sub, plus: estado.plus };
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.08, duration: 1.8 }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.sello', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
  paso('.regla', { y: 18, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.75);
  paso('.regla__item', { y: 12, opacity: 0, duration: 0.8, stagger: 0.05, clearProps: 'transform,opacity' }, 0.85);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax] > img').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${(-3 + 6 * s.progress).toFixed(2)}%`; },
    });
  });
}

[
  initModelBarScroll,
  initNav,
  initRail,
  initVistaPrevia,
  initCuentas,
  initRegla,
  () => { const sel = PAGINA === 'catalogo' ? initCatalogo() : {}; initMenuTienda(sel); },
  initTarjetas,
  initQV,
  initCarrito,
  initFloats,
  initTalle,
  initHeroMotion,
  initReveals,
  initParallax,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
