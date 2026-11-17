const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const POR_PAGINA = 16;
const TOPE_LINEA = 10;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const HOME_URL = MODELO === '2' ? 'modelo-2.html' : './';
document.documentElement.classList.add('js');

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const WSP = '5491156347960';
const MARCA = 'Dozzo';
const TALLES = ['S', 'M', 'L', 'XL'];
const CATEGORIAS = [
  { id: 'deportiva', nombre: 'Deportiva', titulo: 'Ropa deportiva', img: 'images/l-deportiva.webp' },
  { id: 'urbana', nombre: 'Urbana', titulo: 'Ropa urbana', img: 'images/l-urbana.webp' },
];
const SUBS = [
  { id: 'tops', cat: 'deportiva', nombre: 'Tops', titulo: 'Tops deportivos' },
  { id: 'calzas', cat: 'deportiva', nombre: 'Calzas y bikers', titulo: 'Calzas y bikers' },
  { id: 'shorts', cat: 'deportiva', nombre: 'Shorts', titulo: 'Shorts' },
  { id: 'remeras', cat: 'urbana', nombre: 'Remeras y musculosas', titulo: 'Remeras y musculosas' },
  { id: 'abrigo', cat: 'urbana', nombre: 'Buzos y camperas', titulo: 'Buzos y camperas' },
  { id: 'pantalones', cat: 'urbana', nombre: 'Oxford y joggers', titulo: 'Calzas oxford y joggers' },
];
const FAMILIAS = [
  { id: 'negros', nombre: 'Negro', hex: '#151515' },
  { id: 'blancos', nombre: 'Blanco y crudo', hex: '#F2F0EA' },
  { id: 'grises', nombre: 'Grises', hex: '#9C9EA1' },
  { id: 'azules', nombre: 'Azules y celestes', hex: '#2F4A86' },
  { id: 'verdes', nombre: 'Verdes y turquesas', hex: '#3E8C83' },
  { id: 'rosas', nombre: 'Rosas, lilas y violetas', hex: '#C77A9B' },
  { id: 'marrones', nombre: 'Marrones y nude', hex: '#8A6248' },
];
const PRECIOS = [
  { id: 'hasta-20', nombre: 'Hasta $20.000', min: 0, max: 20000 },
  { id: '20-35', nombre: '$20.000 a $35.000', min: 20000, max: 35000 },
  { id: 'mas-35', nombre: 'Más de $35.000', min: 35000, max: Infinity },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const V = (id, nombre, hex, familia, s, m, l, xl) => ({ id, nombre, hex, familia, stock: { S: s, M: m, L: l, XL: xl } });
const NEGRO = (s, m, l, xl) => V('negro', 'Negro', '#151515', 'negros', s, m, l, xl);
const BLANCO = (s, m, l, xl) => V('blanco', 'Blanco', '#F4F4F2', 'blancos', s, m, l, xl);

const PRODUCTOS = [
  { id: 'top-cruzado-negro', num: 1, nombre: 'Top cruzado negro', cat: 'deportiva', sub: 'tops', precio: 24900, nuevo: true,
    img: 'images/p-top-negro.webp', fotos: ['images/p-top-negro.webp', 'images/p-top-negro-espalda.webp'], alt: 'Top deportivo negro con cruce adelante, visto de frente',
    desc: 'Top con cruce adelante y tiras que se cruzan en la espalda. Va solo para entrenar o abajo de una campera.',
    variantes: [NEGRO(4, 5, 3, 2)] },
  { id: 'biker-tiro-alto', num: 2, nombre: 'Biker tiro alto', cat: 'deportiva', sub: 'calzas', precio: 21900,
    img: 'images/p-biker.webp', alt: 'Bikers de tiro alto en azul noche, gris, turquesa, violeta y negro, apilados',
    desc: 'Biker de tiro alto con la cintura cruzada adelante. Para entrenar, andar en bici o abajo de una remera larga.',
    variantes: [V('azul-noche', 'Azul noche', '#2E3A4F', 'azules', 3, 4, 2, 1), V('gris', 'Gris', '#7A7D80', 'grises', 2, 3, 3, 0), V('turquesa', 'Turquesa', '#2A9590', 'verdes', 1, 2, 2, 1), V('violeta', 'Violeta', '#7E3F9E', 'rosas', 0, 2, 1, 1), NEGRO(5, 6, 4, 3)] },
  { id: 'short-running-cordon', num: 3, nombre: 'Short running con cordón', cat: 'deportiva', sub: 'shorts', precio: 19900,
    img: 'images/p-short-colores.webp', alt: 'Shorts con cordón en fucsia, topo, lila, verde, rosa y celeste, apilados',
    desc: 'Short liviano con cintura elástica, cordón y bolsillos al costado. En seis colores.',
    variantes: [V('fucsia', 'Fucsia', '#C9496A', 'rosas', 2, 3, 2, 1), V('topo', 'Topo', '#A08C86', 'marrones', 1, 2, 2, 0), V('lila', 'Lila', '#A99AD6', 'rosas', 3, 2, 1, 1), V('verde', 'Verde', '#9DB07A', 'verdes', 2, 3, 2, 1), V('rosa', 'Rosa', '#E48A9C', 'rosas', 2, 2, 1, 0), V('celeste', 'Celeste', '#BFD3E6', 'azules', 3, 4, 2, 2)] },
  { id: 'remera-corte-curvo', num: 4, nombre: 'Remera deportiva corte curvo', cat: 'urbana', sub: 'remeras', precio: 17900,
    img: 'images/p-remera-curva.webp', alt: 'Remeras de manga corta con ruedo curvo en blanco, camel y negro',
    desc: 'Remera de manga corta con el ruedo curvo, un poco más larga atrás. Para entrenar o para salir.',
    variantes: [BLANCO(3, 4, 3, 2), V('camel', 'Camel', '#A9744F', 'marrones', 2, 3, 2, 1), NEGRO(4, 5, 3, 2), V('rosa', 'Rosa', '#E2A3CB', 'rosas', 2, 2, 1, 0)] },
  { id: 'top-nadadora-blanco', num: 5, nombre: 'Top espalda nadadora blanco', cat: 'deportiva', sub: 'tops', precio: 22900,
    img: 'images/p-top-blanco.webp', alt: 'Top blanco de espalda nadadora con abertura y el logo Dozzo, visto de espalda',
    desc: 'Top de espalda nadadora con una abertura atrás y el logo Dozzo. Ideal para pilates, yoga o el gimnasio.',
    variantes: [BLANCO(2, 3, 2, 0)] },
  { id: 'top-cruzado-turquesa', num: 6, nombre: 'Top cruzado turquesa', cat: 'deportiva', sub: 'tops', precio: 24900,
    img: 'images/p-top-turquesa.webp', alt: 'Top deportivo turquesa con escote en V y cruce adelante',
    desc: 'Top con escote en V, cruce adelante y breteles anchos. Combina con calzas y bikers negros.',
    variantes: [V('turquesa', 'Turquesa', '#1F8C9C', 'verdes', 2, 4, 3, 0)] },
  { id: 'remera-basica', num: 7, nombre: 'Remera básica entallada', cat: 'urbana', sub: 'remeras', precio: 15900,
    img: 'images/p-remera-basica.webp', alt: 'Remeras básicas dobladas y apiladas en rosa, chocolate, fucsia, negro, violeta, nude, blanco y crudo',
    desc: 'La remera de todos los días: manga corta, cuello redondo y calce al cuerpo. En ocho colores.',
    variantes: [V('rosa', 'Rosa', '#E9B7C9', 'rosas', 2, 3, 2, 1), V('chocolate', 'Chocolate', '#4E3326', 'marrones', 2, 2, 2, 1), V('fucsia', 'Fucsia', '#B23A6B', 'rosas', 1, 2, 2, 0), NEGRO(4, 5, 4, 3), V('violeta', 'Violeta', '#7A4E9F', 'rosas', 2, 2, 1, 1), V('nude', 'Nude', '#D9BBA9', 'marrones', 2, 3, 2, 1), BLANCO(3, 4, 3, 2), V('crudo', 'Crudo', '#EDE6D6', 'blancos', 2, 2, 2, 1)] },
  { id: 'calza-oxford-negra', num: 8, nombre: 'Calza oxford negra', cat: 'urbana', sub: 'pantalones', precio: 34900,
    img: 'images/p-oxford.webp', alt: 'Calza oxford negra con bota ancha, combinada con remera blanca',
    desc: 'Calza de tiro alto con bota oxford. Queda bien con una remera básica y zapatillas.',
    variantes: [NEGRO(2, 3, 2, 1)] },
  { id: 'top-cruzado-azul', num: 9, nombre: 'Top cruzado azul francia', cat: 'deportiva', sub: 'tops', precio: 24900,
    img: 'images/p-top-azul.webp', alt: 'Top deportivo azul francia con escote en V y cruce adelante',
    desc: 'Top con escote en V, cruce adelante y breteles anchos, en un azul que se ve de lejos.',
    variantes: [V('azul-francia', 'Azul francia', '#2C52A8', 'azules', 3, 2, 1, 1)] },
  { id: 'top-cruzado-marino', num: 10, nombre: 'Top cruzado azul marino', cat: 'deportiva', sub: 'tops', precio: 24900, nuevo: true,
    img: 'images/p-top-marino.webp', fotos: ['images/p-top-marino.webp', 'images/p-top-marino-espalda.webp'], alt: 'Top acanalado azul marino con nudo adelante, visto de frente',
    desc: 'Top acanalado con nudo adelante y espalda nadadora.',
    variantes: [V('azul-marino', 'Azul marino', '#1F2B4A', 'azules', 0, 2, 2, 1)] },
  { id: 'top-nadadora-negro', num: 11, nombre: 'Top espalda nadadora negro', cat: 'deportiva', sub: 'tops', precio: 22900,
    img: 'images/p-top-nadadora-negro.webp', alt: 'Top negro de espalda nadadora con el logo Dozzo, visto de espalda',
    desc: 'Top de espalda nadadora con el logo Dozzo atrás. El negro que va con todo.',
    variantes: [NEGRO(3, 4, 4, 2)] },
  { id: 'remera-corta-chocolate', num: 12, nombre: 'Remera corta chocolate', cat: 'urbana', sub: 'remeras', precio: 18900,
    img: 'images/p-remera-chocolate.webp', alt: 'Remera corta color chocolate con el logo Dozzo en la manga, vista de costado',
    desc: 'Remera corta al cuerpo con el logo Dozzo en la manga. Para usar con jean o con calza.',
    variantes: [V('chocolate', 'Chocolate', '#5A3A28', 'marrones', 1, 2, 1, 0)] },
  { id: 'short-bolsillo-negro', num: 13, nombre: 'Short con bolsillo negro', cat: 'deportiva', sub: 'shorts', precio: 19900,
    img: 'images/p-short-negro.webp', alt: 'Short negro con cordón y bolsillo con cierre al costado',
    desc: 'Short liviano con cintura elástica, cordón y bolsillo con cierre al costado para las llaves.',
    variantes: [NEGRO(2, 3, 3, 1)] },
  { id: 'calza-larga-negra', num: 14, nombre: 'Calza larga tiro alto negra', cat: 'deportiva', sub: 'calzas', precio: 32900,
    img: 'images/p-calza-negra.webp', alt: 'Calza larga negra de tiro alto',
    desc: 'Calza larga de tiro alto, lisa, para entrenar o para todos los días.',
    variantes: [NEGRO(4, 6, 4, 3)] },
  { id: 'top-deportivo-liso', num: 15, nombre: 'Top deportivo liso negro', cat: 'deportiva', sub: 'tops', precio: 19900,
    img: 'images/p-top-liso.webp', alt: 'Top deportivo negro liso con espalda nadadora',
    desc: 'Top liso de espalda nadadora con banda elástica abajo. El básico para entrenar.',
    variantes: [NEGRO(5, 5, 3, 2)] },
  { id: 'short-holgado-negro', num: 16, nombre: 'Short holgado negro', cat: 'deportiva', sub: 'shorts', precio: 18900,
    img: 'images/p-short-holgado.webp', alt: 'Short negro holgado con cintura elástica',
    desc: 'Short largo y suelto con cintura elástica. Para correr, el gimnasio o el día a día.',
    variantes: [NEGRO(2, 4, 4, 3)] },
  { id: 'remera-oversize-negra', num: 17, nombre: 'Remera oversize negra', cat: 'urbana', sub: 'remeras', precio: 21900,
    img: 'images/p-remera-oversize.webp', alt: 'Remera negra oversize de hombro caído',
    desc: 'Remera de calce amplio, hombro caído y cuello redondo.',
    variantes: [NEGRO(2, 4, 4, 3)] },
  { id: 'buzo-canguro-gris', num: 18, nombre: 'Buzo canguro gris melange', cat: 'urbana', sub: 'abrigo', precio: 46900,
    img: 'images/p-buzo-gris.webp', alt: 'Buzo gris melange con capucha y bolsillo canguro',
    desc: 'Buzo con capucha, cordón y bolsillo canguro. Para después de entrenar o para la calle.',
    variantes: [V('gris-melange', 'Gris melange', '#A7A9AB', 'grises', 2, 3, 3, 2)] },
  { id: 'jogger-grafito', num: 19, nombre: 'Jogger grafito', cat: 'urbana', sub: 'pantalones', precio: 39900,
    img: 'images/p-jogger.webp', alt: 'Jogger gris grafito con cordón y puño en el tobillo',
    desc: 'Jogger con cintura elástica, cordón y puño en el tobillo.',
    variantes: [V('grafito', 'Grafito', '#3E3F42', 'grises', 2, 3, 3, 2)] },
  { id: 'rompevientos-gris', num: 20, nombre: 'Rompevientos gris con capucha', cat: 'urbana', sub: 'abrigo', precio: 54900, nuevo: true,
    img: 'images/p-rompevientos.webp', alt: 'Rompevientos gris claro con capucha y cierre al frente',
    desc: 'Campera liviana con capucha, cierre al frente y bolsillos con cierre.',
    variantes: [V('gris-perla', 'Gris perla', '#BFC1C2', 'grises', 1, 2, 2, 1)] },
  { id: 'campera-vivos-negra', num: 21, nombre: 'Campera deportiva negra con vivos', cat: 'urbana', sub: 'abrigo', precio: 58900,
    img: 'images/p-campera-vivos.webp', alt: 'Campera deportiva negra con cuello alto y vivos blancos',
    desc: 'Campera con cuello alto, cierre al frente y vivos blancos en las mangas.',
    variantes: [NEGRO(1, 2, 2, 1)] },
  { id: 'musculosa-blanca', num: 22, nombre: 'Musculosa deportiva blanca', cat: 'urbana', sub: 'remeras', precio: 14900,
    img: 'images/p-musculosa.webp', alt: 'Musculosa blanca de sisa amplia colgada en una percha',
    desc: 'Musculosa de sisa amplia y cuello redondo. Vuelve pronto: dejá tu talle por WhatsApp.',
    variantes: [BLANCO(0, 0, 0, 0)] },
];

const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const subDe = id => SUBS.find(s => s.id === id) || SUBS[0];
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const varDe = (p, color) => p?.variantes?.find(v => v.id === color) || p?.variantes?.[0] || null;
const stockDe = (p, color, talle) => Math.max(0, parseInt(varDe(p, color)?.stock?.[talle], 10) || 0);
const stockTalle = (p, talle) => (p?.variantes || []).reduce((n, v) => n + Math.max(0, parseInt(v.stock?.[talle], 10) || 0), 0);
const stockTotal = p => TALLES.reduce((n, t) => n + stockTalle(p, t), 0);
const multiColor = p => (p?.variantes?.length || 0) > 1;
const enRango = (p, id) => {
  const r = PRECIOS.find(x => x.id === id);
  if (!r) return false;
  const v = precioFinal(p);
  return v >= r.min && v < r.max;
};

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, catDe(p.cat).nombre, catDe(p.cat).titulo, subDe(p.sub).nombre, subDe(p.sub).titulo,
    ...p.variantes.map(v => v.nombre), ...p.variantes.map(v => nombreDe(FAMILIAS, v.familia)), ...(p.claves || []),
  ].join(' ')).split(/[^a-z0-9]+/).filter(Boolean)]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const ordenes = new Map();

  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), talle = lista(f.talle), color = lista(f.color), precio = lista(f.precio), excluir = lista(f.excluir), ids = lista(f.ids);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sub.length && !sub.includes(p.sub)) return false;
    if (talle.length && !talle.some(t => p.variantes.some(v => (color.length ? color.includes(v.familia) : true) && (v.stock?.[t] || 0) > 0))) return false;
    if (color.length && !p.variantes.some(v => color.includes(v.familia))) return false;
    if (precio.length && !precio.some(id => enRango(p, id))) return false;
    if (f.stock && stockTotal(p) <= 0) return false;
    if (excluir.includes(p.id)) return false;
    if (ids.length && !ids.includes(p.id)) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/[^a-z0-9]+/).filter(Boolean);
    const voces = indice.get(p.id) || [];
    const empieza = w => voces.some(v => v.startsWith(w));
    return palabras.every(w => empieza(w) || (w.length > 4 && w.endsWith('s') && empieza(w.slice(0, -1))) || (w.length > 5 && w.endsWith('es') && empieza(w.slice(0, -2))));
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    const agotado = p => (stockTotal(p) > 0 ? 0 : 1);
    switch (orden) {
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => agotado(a) - agotado(b) || (a.num || 999) - (b.num || 999) || desempate(a, b);
    }
  }
  const ordenada = orden => {
    const o = ORDENES.some(x => x.id === orden) ? orden : 'destacados';
    if (!ordenes.has(o)) ordenes.set(o, [...visibles].sort(comparador(o)));
    return ordenes.get(o);
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
    const { q, ...resto } = filtros;
    return visibles.reduce((n, p) => n + (coincide(p, resto) && (!q || coincideTexto(p, q)) ? 1 : 0), 0);
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
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const claveLinea = (id, color, talle) => `${id}|${color}|${talle}`;

const Cart = {
  KEY: 'dozzo_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, color, talle, qty = 1) {
    if (!producto) return 0;
    const v = varDe(producto, color);
    if (!v || !TALLES.includes(talle)) return 0;
    const tope = Math.min(TOPE_LINEA, stockDe(producto, v.id, talle));
    if (tope <= 0) return 0;
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, tope));
    const existing = items.find(i => i.id === producto.id && i.color === v.id && i.talle === talle);
    const antes = existing ? existing.qty : 0;
    if (existing) existing.qty = Math.min(existing.qty + n, tope);
    else items.push({ id: producto.id, color: v.id, talle, qty: n });
    this.save(items);
    return (existing ? existing.qty : n) - antes;
  },
  topeDe(i) { const p = getProducto(i.id); return p ? Math.min(TOPE_LINEA, stockDe(p, i.color, i.talle)) : 0; },
  setQty(k, qty) {
    const items = this.get();
    const it = items.find(i => claveLinea(i.id, i.color, i.talle) === k);
    if (!it) return;
    it.qty = Math.max(1, Math.min(parseInt(qty, 10) || 1, this.topeDe(it)));
    this.save(items);
  },
  remove(k) { this.save(this.get().filter(i => claveLinea(i.id, i.color, i.talle) !== k)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  sync() {
    const crudo = this.get();
    const limpias = [];
    let changed = false;
    crudo.forEach(i => {
      const p = i && getProducto(i.id);
      const v = p && p.variantes.find(x => x.id === i.color);
      if (!p || !v || !TALLES.includes(i.talle)) { changed = true; return; }
      const tope = Math.min(TOPE_LINEA, stockDe(p, v.id, i.talle));
      if (tope <= 0) { changed = true; return; }
      const qty = Math.max(1, Math.min(parseInt(i.qty, 10) || 1, tope));
      const previa = limpias.find(x => x.id === p.id && x.color === v.id && x.talle === i.talle);
      if (previa) { previa.qty = Math.min(previa.qty + qty, tope); changed = true; return; }
      if (qty !== i.qty || Object.keys(i).length !== 4) changed = true;
      limpias.push({ id: p.id, color: v.id, talle: i.talle, qty });
    });
    if (changed) this.save(limpias);
  },
};

function textoPedido(items = Cart.get()) {
  let total = 0;
  const lineas = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const sub = precioFinal(p) * i.qty;
    total += sub;
    return `• ${i.qty} × ${p.nombre} (${varDe(p, i.color).nombre}, talle ${i.talle}) — ${formatearPrecio(sub)}`;
  }).filter(Boolean);
  return `¡Hola Dozzo! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(total)}\n¿Cómo seguimos?`;
}

const ETAPAS = [
  { id: 'pago', nombre: 'Pago aprobado', txt: 'Mercado Pago confirmó el pago.' },
  { id: 'preparando', nombre: 'Preparando tu pedido', txt: 'Estamos armando el paquete.' },
  { id: 'camino', nombre: 'En camino', txt: 'El pedido ya salió hacia tu casa.' },
  { id: 'entregado', nombre: 'Entregado', txt: '¡Listo! Ya lo tenés.' },
];
function normalizarCodigo(txt) {
  const m = String(txt || '').trim().toUpperCase().replace(/\s+/g, '').match(/^(?:DZ-?)?(\d{5})$/);
  return m ? `DZ-${m[1]}` : null;
}
function etapaDe(codigo) {
  const c = normalizarCodigo(codigo);
  if (!c) return -1;
  return c.slice(3).split('').reduce((s, d) => s + Number(d), 0) % ETAPAS.length;
}
function nuevoCodigo(azar = Math.random) {
  for (let k = 0; k < 50; k++) {
    const n = String(10000 + Math.floor(azar() * 90000));
    const c = `DZ-${n}`;
    if (etapaDe(c) === 0) return c;
  }
  return 'DZ-40000';
}

const SVG = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICO = {
  mas: SVG('<path d="M12 5l0 14"/><path d="M5 12l14 0"/>'),
  menos: SVG('<path d="M5 12l14 0"/>'),
  x: SVG('<path d="M18 6l-12 12"/><path d="M6 6l12 12"/>'),
  check: SVG('<path d="M5 12l5 5l10 -10"/>'),
  camion: SVG('<path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5"/>'),
  paquete: SVG('<path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5"/><path d="M12 12l8 -4.5"/><path d="M12 12l0 9"/><path d="M12 12l-8 -4.5"/>'),
  tarjeta: SVG('<path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"/><path d="M3 10l18 0"/><path d="M7 15l.01 0"/><path d="M11 15l2 0"/>'),
  casa: SVG('<path d="M5 12l-2 0l9 -9l9 9l-2 0"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"/><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"/>'),
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: SVG('<path d="M5 12l14 0"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/>'),
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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
function abrirCapa(el, { alCerrar, previo = document.activeElement } = {}) {
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
  if (i < 0) return null;
  const [capa] = capas.splice(i, 1);
  document.removeEventListener('keydown', capa.onKey);
  el.classList.remove('open');
  setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, reduceMotion ? 0 : 400);
  if (!capas.length && !document.getElementById('mainNav')?.classList.contains('open') && !document.getElementById('filtros')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  capa.alCerrar?.();
  if (devolverFoco && capa.previo && document.contains(capa.previo)) capa.previo.focus({ preventScroll: true });
  return capa;
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1025px)');
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
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } else if (nav.classList.contains('open')) atraparFoco(nav, e); });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuCategorias() {
  const params = new URLSearchParams(location.search);
  const cat = params.get('cat') || '';
  const sub = params.get('sub') || '';
  const otros = ['talle', 'color', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const cur = PAGINA === 'catalogo' && cat === c.id && !sub && !otros;
      const subs = SUBS.filter(s => s.cat === c.id).map(s => {
        const curS = PAGINA === 'catalogo' && sub === s.id && !otros;
        return `<li><a href="${CATALOGO_URL}?cat=${c.id}&amp;sub=${s.id}"${curS ? ' aria-current="page"' : ''}><span>${esc(s.nombre)}</span><small>${Tienda.contar({ sub: s.id })}</small></a></li>`;
      }).join('');
      return `<li class="cats-menu__grupo"><a class="cats-menu__cat" href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><span class="cats-menu__foto"><img src="${esc(c.img)}" alt="" width="870" height="1088"></span><span><b>${esc(c.nombre)}</b><small>${plural(Tienda.contar({ cat: c.id }), 'prenda', 'prendas')}</small></span></a><ul class="cats-menu__subs">${subs}</ul></li>`;
    }).join('');
  });
  const desktop = window.matchMedia('(min-width: 1025px)');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  document.querySelectorAll('.nav-cats').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    let t = 0, porHover = false;
    const abrir = () => { clearTimeout(t); box.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); porHover = false; box.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      if (!box.classList.contains('is-open')) { abrir(); porHover = false; }
      else if (porHover) porHover = false;
      else cerrar();
    });
    box.addEventListener('mouseenter', () => { if (hover.matches && !box.classList.contains('is-open')) { abrir(); porHover = true; } else clearTimeout(t); });
    box.addEventListener('mouseleave', () => { if (hover.matches) t = setTimeout(cerrar, 120); });
    box.addEventListener('focusout', e => { if (desktop.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (!box.contains(e.target) && desktop.matches) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('is-open')) { cerrar(); btn.focus(); } });
  });
}

function setParam(k, v) {
  try {
    const u = new URL(location.href);
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
    else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
    window.history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? `?${u.searchParams.toString().replace(/%2C/g, ',')}` : '') + u.hash);
  } catch (err) { void err; }
}

const stepperHTML = (n = 1, cls = '', max = TOPE_LINEA) => `<div class="stepper${cls}" data-stepper data-max="${max}"><button type="button" data-paso="-1" aria-label="Restar uno">${ICO.menos}</button><output data-qty>${n}</output><button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;
const precioHTML = p => {
  const fin = precioFinal(p);
  if (p.descuento > 0) return `<p class="precio precio--oferta"><span class="precio__v">${formatearPrecio(fin)}</span><s>${formatearPrecio(p.precio)}</s><span class="precio__etq">-${p.descuento}%</span></p>`;
  return `<p class="precio"><span class="precio__v">${formatearPrecio(fin)}</span></p>`;
};
const numHTML = n => `N°${String(n).padStart(2, '0')}`;
function badgeHTML(p) {
  const tot = stockTotal(p);
  if (tot <= 0) return '<span class="badge badge--agotado">Agotado</span>';
  if (tot <= 4) return '<span class="badge badge--ultimas">Últimas unidades</span>';
  if (p.nuevo) return '<span class="badge badge--nuevo">Nuevo</span>';
  return '';
}
function coloresHTML(p) {
  if (!multiColor(p)) return '';
  const vs = p.variantes;
  const vis = vs.slice(0, vs.length > 5 ? 4 : 5);
  const resto = vs.length - vis.length;
  return `<span class="prod__colores" role="img" aria-label="${vs.length} colores: ${esc(vs.map(v => v.nombre).join(', '))}">${vis.map(v => `<i style="--sw:${esc(v.hex)}"></i>`).join('')}${resto ? `<b>+${resto}</b>` : ''}</span>`;
}
function tallesTexto(p) {
  const con = TALLES.filter(t => stockTalle(p, t) > 0);
  if (!con.length) return 'Sin stock por ahora';
  return `Talles con stock: ${con.join(', ')}`;
}
function miniTallesHTML(p) {
  return `<p class="tallesmini"><span class="sr-only">${esc(tallesTexto(p))}.</span>${TALLES.map(t => `<span aria-hidden="true"${stockTalle(p, t) > 0 ? '' : ' class="is-sin"'}>${t}</span>`).join('')}</p>`;
}
function tallesBtnsHTML(p, color, sel) {
  return `<div class="talles" role="group" aria-label="Talle de ${esc(p.nombre)}">${TALLES.map(t => {
    const n = stockDe(p, color, t);
    return `<button type="button" class="talle${n ? '' : ' is-sin'}" data-talle="${t}" aria-pressed="${sel === t}"${n ? '' : ` disabled aria-label="Talle ${t}, agotado"`}>${t}</button>`;
  }).join('')}</div>`;
}
const textoStock = n => (n <= 0 ? 'Sin stock en ese talle' : n === 1 ? 'Queda 1' : `Quedan ${n}`);
function stockTxtHTML(p, color, talle) {
  if (!talle) return 'Elegí tu talle';
  return `${textoStock(stockDe(p, color, talle))} en ${talle}`;
}

const ANIMS = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(32px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(48px)"',
  no: '',
};
const MSG_AVISO = p => `¡Hola Dozzo! Quiero que me avisen cuando vuelva «${p.nombre}». Mi talle es: `;
function cardHTML(p, { anim = 'subir', talle = '' } = {}) {
  const a = ANIMS[anim] ?? ANIMS.subir;
  const v = p.variantes[0];
  const hay = stockTotal(p) > 0;
  const simple = hay && !multiColor(p);
  const pre = simple && talle && stockDe(p, v.id, talle) > 0 ? talle : '';
  const id = esc(p.id);
  let cuerpo;
  if (simple) {
    const max = pre ? Math.min(TOPE_LINEA, stockDe(p, v.id, pre)) : TOPE_LINEA;
    cuerpo = `${tallesBtnsHTML(p, v.id, pre)}${miniTallesHTML(p)}
    <p class="prod__stock" data-stock-txt aria-live="polite">${esc(stockTxtHTML(p, v.id, pre))}</p>
    <div class="prod-actions">${stepperHTML(1, ' stepper--card', max)}<button type="button" class="btn btn--cta btn--sm prod-add" data-agregar aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button></div>
    <button type="button" class="prod__comprar" data-comprar>Comprar ahora ${ICO.flecha}</button>
    <button type="button" class="btn btn--cta btn--sm prod__elegir" data-qv="${id}">Elegir talle</button>`;
  } else if (hay) {
    cuerpo = `${miniTallesHTML(p)}
    <p class="prod__stock prod__stock--multi">${p.variantes.length} colores</p>
    <button type="button" class="btn btn--cta btn--sm prod__elegir prod__elegir--siempre" data-qv="${id}">Elegir color y talle</button>`;
  } else {
    cuerpo = `${miniTallesHTML(p)}
    <a class="btn btn--ghost btn--sm prod__aviso" href="${esc(wspHref(MSG_AVISO(p)))}" target="_blank" rel="noopener">${ICO.wsp}<span>Avisame cuando vuelva</span></a>`;
  }
  return `<article class="prod${simple ? ' prod--simple' : ''}${hay ? '' : ' is-agotado'}" data-id="${id}"${a}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${id}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="1000" decoding="async"><span class="prod__mirar" aria-hidden="true">Ver ficha</span></button><span class="prod__num" aria-hidden="true">${numHTML(p.num)}</span>${badgeHTML(p)}${coloresHTML(p)}</div>
  <div class="prod__info" data-ficha data-id="${id}" data-color="${esc(v.id)}" data-talle="${pre}">
    <p class="prod__det">${esc(catDe(p.cat).nombre)} · ${esc(subDe(p.sub).nombre)}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${id}">${esc(p.nombre)}</button></h3>
    ${precioHTML(p)}
    ${cuerpo}
  </div>
</article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-abrir-carrito][aria-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'prenda', 'prendas')}, ${formatearPrecio(Cart.total())}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const key = esc(claveLinea(i.id, i.color, i.talle));
  const tope = Cart.topeDe(i);
  const v = varDe(p, i.color);
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <span class="linea__foto"><img src="${esc(p.img)}" alt="" width="800" height="1000"></span>
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var"><i class="linea__sw" style="--sw:${esc(v.hex)}" aria-hidden="true"></i>${esc(v.nombre)} · Talle ${esc(i.talle)}</p>
    <div class="linea__fila">
      <div class="stepper"><button type="button" data-linea-paso="-1" data-k="${key}" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-k="${key}" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= tope ? ' disabled' : ''}>${ICO.mas}</button></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
    </div>
    ${i.qty >= tope ? `<p class="linea__tope">${tope === 1 ? 'Es la última de ese talle' : `Hay ${tope} en ese talle`}</p>` : ''}
  </div>
  <button type="button" class="linea__quitar" data-quitar="${key}" aria-label="Quitar ${esc(p.nombre)}, talle ${esc(i.talle)}">${ICO.x}</button>
</li>`;
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
  const prueba = drawer.querySelector('[data-pedido-prueba]');
  const pintar = () => {
    const items = Cart.get();
    const n = Cart.count();
    cuenta.textContent = n ? plural(n, 'prenda', 'prendas') : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    drawer.querySelector('.drawer__cuerpo').hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  lista.addEventListener('click', e => {
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const k = paso.dataset.k;
      const it = Cart.get().find(x => claveLinea(x.id, x.color, x.talle) === k);
      if (it) Cart.setQty(k, it.qty + Number(paso.dataset.lineaPaso));
      [...lista.querySelectorAll(`[data-linea-paso="${paso.dataset.lineaPaso}"]`)].find(b => b.dataset.k === k && !b.disabled)?.focus();
      return;
    }
    const q = e.target.closest('[data-quitar]');
    if (!q) return;
    const p = getProducto(q.dataset.quitar.split('|')[0]);
    Cart.remove(q.dataset.quitar);
    if (p) showToast(`Sacaste «${p.nombre}» del carrito`);
    drawer.querySelector('.drawer__head button')?.focus();
  });
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-drawer-cerrar]')) { cerrarCapa(drawer, { devolverFoco: !e.target.closest('a') }); return; }
    if (e.target.closest('[data-finalizar]')) {
      showToast('¡Genial! El pago online se activa al pasar la web a producción.');
      if (prueba) {
        const cod = nuevoCodigo();
        try { sessionStorage.setItem('dozzo_codigo', cod); } catch (err) { void err; }
        prueba.querySelector('[data-codigo]').textContent = cod;
        prueba.querySelector('a').href = `${HOME_URL}?codigo=${cod}#envio`;
        prueba.hidden = false;
        prueba.classList.remove('is-nuevo'); void prueba.offsetWidth; prueba.classList.add('is-nuevo');
      }
    }
  });
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito(b)));
  pintar();
}

function avisoSumado(p, n, talle) {
  if (n) showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» talle ${talle} al carrito`);
  else showToast(`Ya tenés en el carrito todas las de talle ${talle}`);
}
function bump(el) {
  if (!el || reduceMotion) return;
  el.classList.remove('sumado'); void el.offsetWidth; el.classList.add('sumado');
}
const cantDe = cont => {
  const st = cont?.querySelector('[data-stepper]');
  const out = st?.querySelector('[data-qty]');
  const max = Math.max(1, parseInt(st?.dataset.max, 10) || TOPE_LINEA);
  const n = Math.max(1, Math.min(parseInt(out?.textContent, 10) || 1, max));
  if (out) out.textContent = '1';
  return n;
};
const pasoStepper = paso => {
  const st = paso.closest('[data-stepper]');
  const out = st.querySelector('[data-qty]');
  const max = Math.max(1, parseInt(st.dataset.max, 10) || TOPE_LINEA);
  const n = (parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso);
  out.textContent = Math.max(1, Math.min(n, max));
  if (n > max) showToast(max === 1 ? 'Queda una sola en ese talle' : `Hay ${max} en ese talle`);
};
function elegirTalle(ficha, talle) {
  const p = getProducto(ficha.dataset.id);
  if (!p) return;
  ficha.dataset.talle = talle;
  ficha.querySelectorAll('[data-talle]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.talle === talle)));
  ficha.classList.remove('is-falta');
  const txt = ficha.querySelector('[data-stock-txt]');
  if (txt) txt.textContent = stockTxtHTML(p, ficha.dataset.color, talle);
  const st = ficha.querySelector('[data-stepper]');
  if (st) {
    const max = Math.max(1, Math.min(TOPE_LINEA, stockDe(p, ficha.dataset.color, talle)));
    st.dataset.max = max;
    const out = st.querySelector('[data-qty]');
    if ((parseInt(out.textContent, 10) || 1) > max) out.textContent = max;
  }
}
function faltaTalle(ficha) {
  ficha.classList.remove('is-falta'); void ficha.offsetWidth; ficha.classList.add('is-falta');
  const txt = ficha.querySelector('[data-stock-txt]');
  if (txt) txt.textContent = 'Primero elegí tu talle';
  ficha.querySelector('[data-talle]:not([disabled])')?.focus();
}

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('#quickView')) return;
    const paso = e.target.closest('[data-ficha] [data-paso]');
    if (paso) { pasoStepper(paso); return; }
    const t = e.target.closest('[data-ficha] [data-talle]');
    if (t) { elegirTalle(t.closest('[data-ficha]'), t.dataset.talle); return; }
    const ag = e.target.closest('[data-agregar]');
    const cm = e.target.closest('[data-comprar]');
    if (ag || cm) {
      const ficha = (ag || cm).closest('[data-ficha]');
      const p = ficha && getProducto(ficha.dataset.id);
      if (!p) return;
      const talle = ficha.dataset.talle;
      if (!talle) { faltaTalle(ficha); return; }
      const n = Cart.add(p, ficha.dataset.color, talle, cantDe(ficha));
      if (cm) window.abrirCarrito?.(cm);
      else { avisoSumado(p, n, talle); bump(ag); }
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      e.preventDefault();
      const ficha = qv.closest('[data-ficha]') || qv.closest('.prod')?.querySelector('[data-ficha]');
      abrirVistaRapida(qv.dataset.qv, { previo: qv, color: qv.dataset.qvColor || ficha?.dataset.color, talle: ficha?.dataset.talle || qv.dataset.qvTalle || '' });
    }
  });
}

let qvEstado = null;
function relacionados(p) {
  let rel = Tienda.consultar({ filtros: { sub: p.sub, excluir: [p.id], stock: true }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { cat: p.cat, stock: true, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  return rel;
}
function qvTallesHTML(p, color, sel) {
  return TALLES.map(t => {
    const n = stockDe(p, color, t);
    return `<button type="button" class="qv-talle${n ? '' : ' is-sin'}" data-qv-talle="${t}" aria-pressed="${sel === t}"${n ? '' : ' disabled'} aria-label="Talle ${t}: ${n ? textoStock(n).toLowerCase() : 'agotado'}"><b>${t}</b><small>${n ? (n === 1 ? 'Última' : `Quedan ${n}`) : 'Agotado'}</small></button>`;
  }).join('');
}
function qvHTML(p, color, talle) {
  const rel = relacionados(p);
  const v = varDe(p, color);
  const fotos = p.fotos || [p.img];
  const hay = stockTotal(p) > 0;
  const max = talle ? Math.max(1, Math.min(TOPE_LINEA, stockDe(p, v.id, talle))) : TOPE_LINEA;
  return `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media">
    <figure class="qv__foto"><img data-qv-img src="${esc(fotos[0])}" alt="${esc(p.alt)}" width="800" height="1000"><span class="prod__num" aria-hidden="true">${numHTML(p.num)}</span></figure>
    ${fotos.length > 1 ? `<div class="qv__thumbs">${fotos.map((f, k) => `<button type="button" class="qv__thumb" data-qv-foto="${esc(f)}" aria-pressed="${k === 0}" aria-label="${k === 0 ? 'Ver de frente' : 'Ver de espalda'}"><img src="${esc(f)}" alt="" width="800" height="1000"></button>`).join('')}</div>` : ''}
    <p class="qv__nota-foto">Precio y stock de ejemplo: en la web real van los tuyos.</p>
  </div>
  <div class="qv__info">
    <p class="qv__cat">${esc(catDe(p.cat).nombre)} · ${esc(subDe(p.sub).nombre)}</p>
    <h2>${esc(p.nombre)}</h2>
    ${precioHTML(p)}
    <div class="qv__grupo"><p class="qv__t">Color: <b data-qv-color-n>${esc(v.nombre)}</b></p>${multiColor(p) ? `<div class="swatches" role="group" aria-label="Color">${p.variantes.map(x => `<button type="button" class="swatch" data-qv-color="${esc(x.id)}" aria-pressed="${x.id === v.id}" aria-label="${esc(x.nombre)}${stockTotal({ variantes: [x] }) ? '' : ', agotado'}" style="--sw:${esc(x.hex)}"></button>`).join('')}</div>` : ''}</div>
    <div class="qv__grupo"><p class="qv__t">Talle</p><div class="qv-talles" role="group" aria-label="Talle" data-qv-talles>${qvTallesHTML(p, v.id, talle)}</div></div>
    ${hay ? `<p class="qv__stock" data-qv-stock aria-live="polite">${esc(stockTxtHTML(p, v.id, talle))}</p>
    <div class="qv__acciones">${stepperHTML(1, '', max)}<button type="button" class="btn btn--cta prod-add" data-qv-agregar>${ICO.carrito}<span>Agregar al carrito</span></button></div>
    <button type="button" class="btn btn--ghost btn--block" data-qv-comprar>Comprar ahora ${ICO.flecha}</button>
    <p class="qv__mp">${ICO.tarjeta}<span>Pagás con Mercado Pago y te llega el código para seguir el envío.</span></p>` : `<a class="btn btn--cta btn--block" href="${esc(wspHref(MSG_AVISO(p)))}" target="_blank" rel="noopener">${ICO.wsp}<span>Avisame cuando vuelva</span></a>`}
    <p class="qv__desc">${esc(p.desc)}</p>
    <dl class="qv__ficha"><div><dt>Línea</dt><dd>${esc(catDe(p.cat).nombre)}</dd></div><div><dt>Tipo</dt><dd>${esc(subDe(p.sub).nombre)}</dd></div><div><dt>Colores</dt><dd>${esc(p.variantes.map(x => x.nombre).join(', '))}</dd></div><div><dt>Talles</dt><dd>S, M, L y XL</dd></div></dl>
    <a class="qv__wsp" href="${esc(wspHref(`¡Hola Dozzo! Quería consultar por: ${p.nombre}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>Combina con</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><span class="qv__rel-foto"><img src="${esc(r.img)}" alt="" width="800" height="1000"></span><span class="qv__rel-n">${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
}
function pintarQvVariante(modal, p) {
  const v = varDe(p, qvEstado.color);
  modal.querySelector('[data-qv-color-n]').textContent = v.nombre;
  modal.querySelectorAll('[data-qv-color]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.qvColor === v.id)));
  if (qvEstado.talle && stockDe(p, v.id, qvEstado.talle) <= 0) qvEstado.talle = '';
  modal.querySelector('[data-qv-talles]').innerHTML = qvTallesHTML(p, v.id, qvEstado.talle);
  const txt = modal.querySelector('[data-qv-stock]');
  if (txt) txt.textContent = stockTxtHTML(p, v.id, qvEstado.talle);
  const st = modal.querySelector('[data-stepper]');
  if (st) {
    const max = qvEstado.talle ? Math.max(1, Math.min(TOPE_LINEA, stockDe(p, v.id, qvEstado.talle))) : TOPE_LINEA;
    st.dataset.max = max;
    const out = st.querySelector('[data-qty]');
    if ((parseInt(out.textContent, 10) || 1) > max) out.textContent = max;
  }
}
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement, color, talle = '' } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  let v = varDe(p, color);
  if (stockTotal({ variantes: [v] }) <= 0) v = p.variantes.find(x => stockTotal({ variantes: [x] }) > 0) || v;
  const t = TALLES.includes(talle) && stockDe(p, v.id, talle) > 0 ? talle : '';
  qvEstado = { id: p.id, color: v.id, talle: t };
  modal.querySelector('[data-qv-body]').innerHTML = qvHTML(p, v.id, t);
  modal.querySelector('.qv__panel').scrollTop = 0;
  modal.setAttribute('aria-label', `Detalle: ${p.nombre}`);
  ponerJsonLdProducto(p);
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { previo, alCerrar: () => setParam('producto', null) });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  setParam('producto', p.id);
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const paso = e.target.closest('[data-paso]');
    if (paso) { pasoStepper(paso); return; }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) {
      modal.querySelector('[data-qv-img]').src = foto.dataset.qvFoto;
      modal.querySelectorAll('[data-qv-foto]').forEach(b => b.setAttribute('aria-pressed', String(b === foto)));
      return;
    }
    const col = e.target.closest('[data-qv-color]');
    if (col) { qvEstado.color = col.dataset.qvColor; pintarQvVariante(modal, p); return; }
    const tal = e.target.closest('[data-qv-talle]');
    if (tal) {
      qvEstado.talle = tal.dataset.qvTalle;
      pintarQvVariante(modal, p);
      modal.querySelector(`[data-qv-talle="${qvEstado.talle}"]`)?.focus();
      return;
    }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      if (!qvEstado.talle) {
        const txt = modal.querySelector('[data-qv-stock]');
        if (txt) txt.textContent = 'Primero elegí tu talle';
        const box = modal.querySelector('[data-qv-talles]');
        box.classList.remove('is-falta'); void box.offsetWidth; box.classList.add('is-falta');
        box.querySelector('[data-qv-talle]:not([disabled])')?.focus();
        return;
      }
      const n = Cart.add(p, qvEstado.color, qvEstado.talle, cantDe(modal.querySelector('.qv__info')));
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else { avisoSumado(p, n, qvEstado.talle); bump(agregar); }
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, category: `${catDe(p.cat).titulo} > ${subDe(p.sub).titulo}`, brand: { '@type': 'Brand', name: MARCA },
    color: p.variantes.map(v => v.nombre).join(', '), size: TALLES.join(', '),
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), itemCondition: 'https://schema.org/NewCondition', availability: stockTotal(p) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', seller: { '@type': 'Organization', name: MARCA } },
  });
}

function initProductoUrl() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) setTimeout(() => abrirVistaRapida(id), 80);
  else if (id) setParam('producto', null);
}

function initCuentas() {
  document.querySelectorAll('[data-n-cat]').forEach(el => { el.textContent = plural(Tienda.contar({ cat: el.dataset.nCat }), 'prenda', 'prendas'); });
  document.querySelectorAll('[data-n-sub]').forEach(el => { el.textContent = String(Tienda.contar({ sub: el.dataset.nSub })); });
  document.querySelectorAll('[data-n-total]').forEach(el => { el.textContent = String(Tienda.contar({})); });
}

function initGaleria() {
  const box = document.querySelector('[data-galeria]');
  if (!box) return;
  const grid = box.querySelector('[data-galeria-grid]');
  const tabs = box.querySelector('[data-galeria-tabs]');
  const mas = box.querySelector('[data-galeria-mas]');
  const OPS = [{ id: '', nombre: 'Todas' }, ...CATEGORIAS.map(c => ({ id: c.id, nombre: c.nombre }))];
  let actual = '';
  tabs.innerHTML = OPS.map(o => `<button type="button" class="tab" data-tab="${esc(o.id)}" aria-pressed="${o.id === actual}"><span>${esc(o.nombre)}</span><small>${Tienda.contar(o.id ? { cat: o.id } : {})}</small></button>`).join('');
  const pintar = () => {
    const f = actual ? { cat: actual } : {};
    const total = Tienda.contar(f);
    tabs.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tab === actual)));
    grid.innerHTML = Tienda.consultar({ filtros: f, limite: 8 }).items.map(p => cardHTML(p, { anim: 'subir' })).join('');
    mas.href = `${CATALOGO_URL}${actual ? `?cat=${actual}` : ''}`;
    mas.querySelector('span').textContent = actual ? `Ver las ${total} prendas de la línea ${catDe(actual).nombre.toLowerCase()}` : `Ver las ${total} prendas`;
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.addEventListener('click', ev => {
    const t = ev.target.closest('[data-tab]');
    if (!t || !OPS.some(o => o.id === t.dataset.tab) || t.dataset.tab === actual) return;
    actual = t.dataset.tab;
    pintar();
  });
  pintar();
}

function initPorTalle() {
  const box = document.querySelector('[data-portalle]');
  if (!box) return;
  const chips = document.querySelector('[data-portalle-chips]');
  const grid = box.querySelector('[data-portalle-grid]');
  const mas = box.querySelector('[data-portalle-mas]');
  const estado = box.querySelector('[data-portalle-estado]');
  if (!chips || !grid) return;
  const OPS = [{ id: '', nombre: 'Todos' }, ...TALLES.map(t => ({ id: t, nombre: t }))];
  let actual = '';
  chips.innerHTML = OPS.map(o => {
    const n = Tienda.contar(o.id ? { talle: o.id } : { stock: true });
    return `<button type="button" class="tchip${o.id ? '' : ' tchip--todos'}" data-tchip="${o.id}" aria-pressed="${o.id === actual}" aria-label="${o.id ? `Talle ${o.id}: ${plural(n, 'prenda', 'prendas')} con stock` : `Todos los talles: ${plural(n, 'prenda', 'prendas')} con stock`}"><b>${esc(o.nombre)}</b><small aria-hidden="true">${n}</small></button>`;
  }).join('');
  const pintar = () => {
    const f = actual ? { talle: actual } : { stock: true };
    const total = Tienda.contar(f);
    chips.querySelectorAll('[data-tchip]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tchip === actual)));
    grid.innerHTML = Tienda.consultar({ filtros: f, limite: 8 }).items.map(p => cardHTML(p, { anim: 'subir', talle: actual })).join('');
    estado.textContent = actual ? `En talle ${actual} hay ${plural(total, 'prenda', 'prendas')} con stock` : `${plural(total, 'prenda', 'prendas')} con stock, en todos los talles`;
    mas.href = `${CATALOGO_URL}${actual ? `?talle=${actual}` : ''}`;
    mas.querySelector('span').textContent = actual ? `Ver las ${total} prendas en talle ${actual}` : `Ver las ${Tienda.contar({})} prendas`;
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  chips.addEventListener('click', ev => {
    const b = ev.target.closest('[data-tchip]');
    if (!b || !OPS.some(o => o.id === b.dataset.tchip) || b.dataset.tchip === actual) return;
    actual = b.dataset.tchip;
    pintar();
    if (b.closest('.hero')) document.getElementById('portalle')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
  pintar();
}

function initLooks() {
  document.querySelectorAll('[data-look]').forEach(ul => {
    const items = ul.dataset.look.split(',').map(s => { const [id, color] = s.split(':'); return { p: getProducto(id), color }; }).filter(x => x.p);
    ul.innerHTML = items.map(({ p, color }) => {
      const v = varDe(p, color);
      return `<li><span class="look__sw" style="--sw:${esc(v.hex)}" aria-hidden="true"></span><span class="look__n"><b>${esc(p.nombre)}</b><small>${esc(v.nombre)} · ${formatearPrecio(precioFinal(p))}</small></span><button type="button" class="look__btn" data-qv="${esc(p.id)}" data-qv-color="${esc(v.id)}">Elegir talle</button></li>`;
    }).join('');
  });
}

function initEnvio() {
  const form = document.getElementById('tracker');
  if (!form) return;
  const input = form.querySelector('input');
  const err = form.querySelector('[data-tracker-error]');
  const res = document.querySelector('[data-tracker-res]');
  const mostrar = (txt, foco = false) => {
    const cod = normalizarCodigo(txt);
    if (!cod) {
      err.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      res.hidden = true;
      if (foco) input.focus();
      return;
    }
    err.hidden = true;
    input.removeAttribute('aria-invalid');
    input.value = cod;
    const k = etapaDe(cod);
    res.innerHTML = `<p class="seguir__cod"><span>Pedido</span><b>${esc(cod)}</b><em>${esc(ETAPAS[k].nombre)}</em></p>
      <ol class="etapas">${ETAPAS.map((e, i) => `<li class="etapa${i < k ? ' is-hecha' : ''}${i === k ? ' is-actual' : ''}"${i === k ? ' aria-current="step"' : ''}><span class="etapa__punto" aria-hidden="true">${i <= k ? ICO.check : ''}</span><span class="etapa__txt"><b>${esc(e.nombre)}</b><small>${esc(e.txt)}</small></span></li>`).join('')}</ol>`;
    res.hidden = false;
    res.classList.remove('is-nuevo'); void res.offsetWidth; res.classList.add('is-nuevo');
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  form.addEventListener('submit', e => { e.preventDefault(); mostrar(input.value, true); });
  document.querySelectorAll('[data-codigo-ej]').forEach(b => b.addEventListener('click', () => { input.value = b.dataset.codigoEj; mostrar(b.dataset.codigoEj); }));
  const deUrl = new URLSearchParams(location.search).get('codigo');
  if (deUrl && normalizarCodigo(deUrl)) { mostrar(deUrl); setParam('codigo', null); }
}

function initCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const verMas = document.getElementById('verMas');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const vacio = document.getElementById('vacio');
  const activos = document.getElementById('filtrosActivos');
  const panel = document.getElementById('filtros');
  const inputQ = document.getElementById('q');
  const selOrden = document.getElementById('orden');
  const titulo = document.getElementById('catTitulo');
  const miga = document.getElementById('migaCat');
  const migaSep = document.querySelector('[data-miga-sep]');
  const params = new URLSearchParams(location.search);
  const TALLE_OPS = TALLES.map(t => ({ id: t, nombre: `Talle ${t}` }));
  const GRUPOS = { cat: CATEGORIAS, sub: SUBS, talle: TALLE_OPS, color: FAMILIAS, precio: PRECIOS };
  const valida = (txt, lista) => [...new Set((txt || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const e = {
    cat: valida((params.get('cat') || '').toLowerCase(), CATEGORIAS),
    sub: valida((params.get('sub') || '').toLowerCase(), SUBS),
    talle: valida((params.get('talle') || '').toUpperCase(), TALLE_OPS),
    color: valida((params.get('color') || '').toLowerCase(), FAMILIAS),
    precio: valida((params.get('precio') || '').toLowerCase(), PRECIOS),
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;
  const filtros = (sin = '') => {
    const f = {};
    Object.keys(GRUPOS).forEach(k => { if (sin !== k && e[k].length) f[k] = e[k]; });
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (grupo, item, marcado, n) => {
    const sw = grupo === 'color' ? `<i class="opcion__sw" style="--sw:${esc(item.hex)}" aria-hidden="true"></i>` : '';
    const cls = grupo === 'talle' ? 'opcion opcion--talle' : 'opcion';
    const txt = grupo === 'talle' ? item.id : item.nombre;
    const lbl = grupo === 'talle' ? ` aria-label="Talle ${esc(item.id)}"` : '';
    return `<label class="${cls}${n ? '' : ' is-cero'}"><input type="checkbox" data-f="${grupo}" value="${esc(item.id)}"${marcado ? ' checked' : ''}${lbl}>${sw}<span>${esc(txt)}</span><small>${n}</small></label>`;
  };
  function pintarFiltros() {
    Object.keys(GRUPOS).forEach(k => {
      document.querySelectorAll(`[data-f-${k}]`).forEach(box => {
        box.innerHTML = GRUPOS[k].map(it => opcion(k, it, e[k].includes(it.id), Tienda.contar({ ...filtros(k), [k]: it.id }))).join('');
      });
    });
  }
  function tituloActual() {
    const solo = (...ks) => Object.keys(GRUPOS).every(g => ks.includes(g) || !e[g].length);
    if (e.sub.length === 1 && solo('sub', 'cat') && (!e.cat.length || (e.cat.length === 1 && subDe(e.sub[0]).cat === e.cat[0]))) return subDe(e.sub[0]).titulo;
    if (e.cat.length === 1 && solo('cat')) return catDe(e.cat[0]).titulo;
    if (e.talle.length === 1 && solo('talle')) return `Prendas en talle ${e.talle[0]}`;
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...Object.keys(GRUPOS).flatMap(k => e[k].map(id => ({ k, id, t: k === 'talle' ? `Talle ${id}` : nombreDe(GRUPOS[k], id) }))),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = (chips.length ? '<span class="f-activos__t">Estás viendo:</span>' : '') + chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + (MODELO === '2' && k === 'talle' ? 0 : e[k].length), 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Todas las prendas';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Catálogo'} — ${MARCA}, indumentaria deportiva y urbana`;
    document.querySelectorAll('[data-cats-menu] a').forEach(a => {
      const u = new URL(a.href, location.href).searchParams;
      const ok = solo => solo && !e.talle.length && !e.color.length && !e.precio.length && !e.q;
      const esCat = u.get('cat') && !u.get('sub') && e.cat.length === 1 && e.cat[0] === u.get('cat') && !e.sub.length;
      const esSub = u.get('sub') && e.sub.length === 1 && e.sub[0] === u.get('sub');
      if (ok(esCat || esSub)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  function sincronizarUrl() {
    Object.keys(GRUPOS).forEach(k => setParam(k, e[k]));
    setParam('q', e.q);
    setParam('orden', e.orden === 'destacados' ? '' : e.orden);
  }
  function render(reiniciar = true) {
    const f = filtros();
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: f, orden: e.orden, cursor, limite: POR_PAGINA });
    const talle = e.talle.length === 1 ? e.talle[0] : '';
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, { anim: 'subir', talle })).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = Tienda.contar(f);
    contador.innerHTML = `${total} <small>${total === 1 ? 'prenda' : 'prendas'}${e.q ? ` para «${esc(e.q)}»` : ''}</small>`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.hidden = mostrados === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    document.querySelectorAll('[data-ver-n]').forEach(el => { el.textContent = `${total}`; });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  function aplicar() { pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true); }
  document.addEventListener('change', ev => {
    const inp = ev.target.closest('[data-f]');
    if (!inp) return;
    const g = inp.dataset.f;
    e[g] = [...new Set([...document.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value))];
    if (g === 'cat' && e.sub.length && e.cat.length) e.sub = e.sub.filter(s => e.cat.includes(subDe(s).cat));
    aplicar();
  });
  let tq = 0;
  inputQ.value = e.q;
  const buscar = () => { e.q = inputQ.value.trim().slice(0, 60); pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true); };
  inputQ.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(buscar, 220); });
  inputQ.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); buscar(); inputQ.blur(); });
  selOrden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  selOrden.addEventListener('change', () => { e.orden = selOrden.value; sincronizarUrl(); render(true); });
  const limpiar = () => { Object.keys(GRUPOS).forEach(k => { e[k] = []; }); e.q = ''; inputQ.value = ''; aplicar(); };
  document.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const qf = ev.target.closest('[data-quitar-f]');
    if (qf) {
      const k = qf.dataset.quitarF, v = qf.dataset.v;
      if (GRUPOS[k]) e[k] = e[k].filter(x => x !== v);
      else { e.q = ''; inputQ.value = ''; }
      aplicar();
    }
  });
  verMas.addEventListener('click', () => render(false));
  const bd = document.querySelector('.filtros-backdrop');
  const mq = window.matchMedia('(max-width: 1024px)');
  const syncPanel = () => { if (mq.matches && !panel.classList.contains('open')) panel.setAttribute('inert', ''); else panel.removeAttribute('inert'); if (!mq.matches) { panel.classList.remove('open'); bd?.classList.remove('open'); } };
  const abrirPanel = () => { panel.classList.add('open'); bd?.classList.add('open'); document.body.classList.add('no-scroll'); panel.removeAttribute('inert'); panel.querySelector('button, input')?.focus(); };
  const cerrarPanel = () => { panel.classList.remove('open'); bd?.classList.remove('open'); if (!capas.length) document.body.classList.remove('no-scroll'); syncPanel(); };
  mq.addEventListener('change', syncPanel);
  syncPanel();
  if (mq.matches) panel.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  document.querySelectorAll('[data-abrir-filtros]').forEach(b => b.addEventListener('click', abrirPanel));
  document.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => { cerrarPanel(); document.querySelector('[data-abrir-filtros]')?.focus(); }));
  bd?.addEventListener('click', cerrarPanel);
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && panel.classList.contains('open')) cerrarPanel(); else if (panel.classList.contains('open')) atraparFoco(panel, ev); });
  pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true);
  if (params.get('buscar') === '1') { setParam('buscar', null); setTimeout(() => inputQ.focus(), 120); }
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
function initRails() {
  document.querySelectorAll('[data-rail-vp]').forEach(initRailDrag);
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
  const hero = document.querySelector('.hero');
  if (!hero) return;
  if (reduceMotion || typeof gsap === 'undefined') { hero.classList.add('is-listo'); return; }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: () => hero.classList.add('is-listo') });
  const desdeA = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desdeA('.vidriera__pano', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.3, stagger: 0.14, ease: 'power4.out', clearProps: 'clipPath' }, 0);
  desdeA('[data-hero-img]', { scale: 1.1, duration: 1.8, stagger: 0.14 }, 0);
  desdeA('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.25);
  desdeA('h1', { y: 34, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.32);
  desdeA('.hero-lead', { y: 20, opacity: 0, duration: 1 }, 0.5);
  desdeA('.hero-ctas .btn', { y: 16, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.62);
  desdeA('.hero-barra', { scaleX: 0, transformOrigin: '0 50%', duration: 0.9, ease: 'power3.out', clearProps: 'transform' }, 0.3);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-hero-img]').forEach(el => {
    gsap.to(el, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
  });
}

[initCuentas, initGaleria, initPorTalle, initLooks, initMenuCategorias, initCatalogo, initReveals, initHeroMotion, initParallax, initRails,
  initNav, initDrawer, initVistaRapida, initCompras, initEnvio, initFloats, initModelBarScroll, initProductoUrl].forEach(fn => {
  try { fn(); } catch (err) { console.error(err); }
});
Cart.sync();
updateCartBadge();
