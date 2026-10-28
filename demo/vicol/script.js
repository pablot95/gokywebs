const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491126068746';
const MARCA = 'Vicol';
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

const CATEGORIAS = [
  { id: 'blusas', nombre: 'Blusas', bajada: 'Manga globo, sin mangas y de gasa', img: 'images/p-blusa-celeste.webp',
    texto: 'Blusas de gasa, de lino y campesinas, sueltas o al cuerpo, para la semana y para salir.' },
  { id: 'vestidos', nombre: 'Vestidos', bajada: 'Cruzados y envolventes, largo midi', img: 'images/p-vestido-terracota.webp',
    texto: 'Vestidos midi cruzados, con lazo para ajustarlos a tu cintura.' },
  { id: 'tops', nombre: 'Tops', bajada: 'Musculosas y tops al cuerpo', img: 'images/p-musculosa-crudo.webp',
    texto: 'Musculosas de morley y tops al cuerpo, solos o debajo de una camisa.' },
  { id: 'pantalones', nombre: 'Pantalones', bajada: 'Sastreros y wide leg, del 36 al 46', img: 'images/p-pantalon-marino.webp',
    texto: 'Pantalones sastreros y wide leg de tiro alto, del 36 al 46.' },
];
const CALCES = [
  { id: 'cuerpo', nombre: 'Al cuerpo', holgura: 3, rango: '2 a 4 cm',
    frase: 'Sigue tu silueta sin apretar', texto: 'Tejidos con elasticidad que acompañan el cuerpo. La prenda mide apenas unos centímetros más que vos.' },
  { id: 'regular', nombre: 'Regular', holgura: 7, rango: '6 a 8 cm',
    frase: 'Entalla donde tiene que entallar', texto: 'Marca la cintura y te deja moverte. Es el calce de los vestidos cruzados y del sastrero.' },
  { id: 'holgado', nombre: 'Holgado', holgura: 14, rango: '12 cm o más',
    frase: 'Suelto, fresco y con caída', texto: 'Mucha tela que cae derecha: la blusa campesina, la de gasa y el wide leg.' },
];
const COLORES = [
  { id: 'petroleo', nombre: 'Petróleo' }, { id: 'terracota', nombre: 'Terracota' }, { id: 'celeste', nombre: 'Celeste' },
  { id: 'marfil', nombre: 'Marfil' }, { id: 'verde', nombre: 'Verde inglés' }, { id: 'crudo', nombre: 'Crudo' },
  { id: 'negro', nombre: 'Negro' }, { id: 'marino', nombre: 'Azul marino' }, { id: 'arena', nombre: 'Arena' },
];
const T_LETRAS = ['S', 'M', 'L', 'XL', 'XXL'];
const T_NUMEROS = ['36', '38', '40', '42', '44', '46'];
const TALLES = [...T_LETRAS, ...T_NUMEROS];
const PRECIOS = [
  { id: 'hasta35', nombre: 'Hasta $35.000', min: null, max: 35000 },
  { id: '35a55', nombre: '$35.000 a $55.000', min: 35001, max: 55000 },
  { id: 'mas55', nombre: 'Más de $55.000', min: 55001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  blusas: 'blusa blusas camisa camisola', vestidos: 'vestido vestidos', tops: 'top tops musculosa remera', pantalones: 'pantalon pantalones palazzo',
  cuerpo: 'al cuerpo ajustado entallado', regular: 'regular clasico', holgado: 'holgado suelto amplio oversize',
  petroleo: 'petroleo verde azulado', terracota: 'terracota ladrillo oxido', celeste: 'celeste azul claro', marfil: 'marfil blanco natural',
  verde: 'verde ingles', crudo: 'crudo beige natural blanco', negro: 'negro negra', marino: 'azul marino oscuro', arena: 'arena beige camel',
};

const Tienda = crearTienda([
  { id: 'vestido-cruzado-petroleo', nombre: 'Vestido cruzado con volado', cat: 'vestidos', calce: 'regular', color: 'petroleo', tela: 'Lino con viscosa',
    precio: 72900, descuento: 0, alta: 30, rango: 1, tag: 'Nuevo', medida: 'busto', largo: 116,
    talles: { S: 3, M: 5, L: 4, XL: 2, XXL: 1 }, img: 'images/p-vestido-petroleo.webp', escena: 'images/vestido-alto.webp',
    alt: 'Vestido midi petróleo cruzado, con manga mariposa, lazo en la cintura y volado al pie',
    desc: 'Escote cruzado en V, manga mariposa y lazo para ajustar la cintura a tu medida. La falda tiene vuelo y termina en un volado a media pierna.' },
  { id: 'blusa-campesina-celeste', nombre: 'Blusa campesina manga globo', cat: 'blusas', calce: 'holgado', color: 'celeste', tela: 'Gasa de algodón',
    precio: 41900, descuento: 0, alta: 27, rango: 2, medida: 'busto', largo: 66,
    talles: { S: 4, M: 6, L: 5, XL: 3, XXL: 2 }, img: 'images/p-blusa-celeste.webp', escena: null,
    alt: 'Blusa campesina celeste con cuello tunecino fruncido y mangas globo, colgada en una percha',
    desc: 'Cuello tunecino con frunce, manga globo con puño elástico y largo a la cadera. Fresca y suelta, para usar por fuera.' },
  { id: 'blusa-gasa-marfil', nombre: 'Blusa de gasa con botones', cat: 'blusas', calce: 'holgado', color: 'marfil', tela: 'Gasa',
    precio: 44900, descuento: 0, alta: 29, rango: 3, tag: 'Nuevo', medida: 'busto', largo: 64,
    talles: { S: 3, M: 5, L: 4, XL: 2, XXL: 0 }, img: 'images/p-blusa-marfil.webp', escena: 'images/mesa-ancha.webp',
    alt: 'Blusa marfil de gasa con escote en V, botones forrados y mangas largas con puño',
    desc: 'Escote en V con cuello mao, botones forrados y manga larga con puño fruncido. En la otra foto, con el pantalón sastrero.' },
  { id: 'vestido-envolvente-terracota', nombre: 'Vestido envolvente de lino', cat: 'vestidos', calce: 'regular', color: 'terracota', tela: 'Lino',
    precio: 69900, descuento: 0, alta: 28, rango: 4, medida: 'busto', largo: 114,
    talles: { S: 2, M: 4, L: 3, XL: 0, XXL: 1 }, img: 'images/p-vestido-terracota.webp', escena: null,
    alt: 'Vestido terracota de lino envolvente, con manga corta, lazo al costado y volado asimétrico',
    desc: 'Se cruza y se ata al costado, así lo ajustás a tu cintura. Falda envolvente con volado asimétrico y manga corta con vuelo.' },
  { id: 'musculosa-morley-cruda', nombre: 'Musculosa morley acanalada', cat: 'tops', calce: 'cuerpo', color: 'crudo', tela: 'Morley acanalado',
    precio: 22900, descuento: 0, alta: 26, rango: 5, medida: 'busto', largo: 56,
    talles: { S: 6, M: 8, L: 6, XL: 4, XXL: 2 }, img: 'images/p-musculosa-crudo.webp', escena: null,
    alt: 'Musculosa cruda de morley acanalado con cuello redondo',
    desc: 'Cuello redondo con vivo, sisa americana y tejido acanalado que se adapta al cuerpo. Sola o debajo de una camisa.' },
  { id: 'blusa-sin-mangas-verde', nombre: 'Blusa sin mangas cuello tunecino', cat: 'blusas', calce: 'regular', color: 'verde', tela: 'Lino con viscosa',
    precio: 36900, descuento: 15, alta: 24, rango: 6, medida: 'busto', largo: 64,
    talles: { S: 2, M: 3, L: 3, XL: 1, XXL: 0 }, img: 'images/p-blusa-verde.webp', escena: null,
    alt: 'Blusa verde inglés sin mangas con cuello tunecino y ruedo curvo, colgada en una percha',
    desc: 'Escote tunecino con pinzas, sisa prolija y ruedo curvo más largo atrás. Va con pantalón sastrero o con jean.' },
  { id: 'top-escote-cuadrado-negro', nombre: 'Top escote cuadrado manga globo', cat: 'tops', calce: 'cuerpo', color: 'negro', tela: 'Jersey de algodón',
    precio: 29900, descuento: 0, alta: 25, rango: 7, medida: 'busto', largo: 54,
    talles: { S: 3, M: 4, L: 2, XL: 2, XXL: 0 }, img: 'images/p-top-negro.webp', escena: null,
    alt: 'Top negro con escote cuadrado, mangas globo cortas y cortes al frente, sobre un maniquí',
    desc: 'Escote cuadrado, mangas globo cortas y cortes al frente que marcan la cintura. Con wide leg o con pollera.' },
  { id: 'pantalon-sastrero-marino', nombre: 'Pantalón sastrero recto', cat: 'pantalones', calce: 'regular', color: 'marino', tela: 'Gabardina con elastano',
    precio: 54900, descuento: 0, alta: 23, rango: 8, medida: 'cadera', largo: 104,
    talles: { 36: 2, 38: 4, 40: 5, 42: 4, 44: 2, 46: 1 }, img: 'images/p-pantalon-marino.webp', escena: 'images/mesa-ancha.webp',
    alt: 'Pantalón sastrero azul marino de tiro alto, con pinzas y pierna recta',
    desc: 'Tiro alto, pinzas al frente, bolsillos al costado y pierna recta con raya marcada. De la oficina a la cena.' },
  { id: 'pantalon-wide-leg-arena', nombre: 'Pantalón wide leg con pinzas', cat: 'pantalones', calce: 'holgado', color: 'arena', tela: 'Gabardina de algodón',
    precio: 52900, descuento: 0, alta: 22, rango: 9, medida: 'cadera', largo: 106,
    talles: { 36: 1, 38: 3, 40: 4, 42: 3, 44: 2, 46: 0 }, img: 'images/p-pantalon-arena.webp', escena: null,
    alt: 'Pantalón wide leg arena de tiro alto con botón y dos pinzas',
    desc: 'Tiro alto con botón, dos pinzas y pierna ancha que cae derecha. Cómodo para todo el día.' },

  { id: 'chaleco-sastrero-proximo', nombre: 'Chaleco sastrero', cat: 'tops', calce: 'regular', color: 'marino', tela: 'Gabardina',
    precio: 49900, descuento: 0, alta: 31, medida: 'busto', largo: 58, visible: false,
    talles: { S: 0, M: 0, L: 0 }, img: 'images/p-pantalon-marino.webp', escena: null, alt: 'Próximo ingreso', desc: 'Próximo ingreso.' },
].map(p => ({ ...p, var: { tipo: 'Talle', ops: Object.keys(p.talles).sort((a, b) => TALLES.indexOf(a) - TALLES.indexOf(b)) }, stock: Object.values(p.talles).reduce((s, n) => s + n, 0) })), { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.cat, p.desc, p.tela, ETIQUETAS[p.cat] || '', ETIQUETAS[p.calce] || '', ETIQUETAS[p.color] || '',
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const conStock = (p, t) => (p.talles?.[t] || 0) > 0;

  function coincide(p, f) {
    const cat = lista(f.cat), calce = lista(f.calce), color = lista(f.color), talle = lista(f.talle), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (calce.length && !calce.includes(p.calce)) return false;
    if (color.length && !color.includes(p.color)) return false;
    if (talle.length && !talle.some(t => conStock(p, t))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
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
    let leidas = 0;
    if (!q) {
      items.push(...base.slice(i, i + lim));
      leidas = items.length;
      const hayMas = i + items.length < base.length;
      return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, leidas };
    }
    while (i < base.length && items.length < lim) {
      const tanda = base.slice(i, i + tope);
      leidas += tanda.length;
      for (const p of tanda) {
        i++;
        if (coincideTexto(p, q)) { items.push(p); if (items.length === lim) break; }
      }
    }
    const quedan = items.length === lim && base.slice(i).some(p => coincideTexto(p, q));
    return { items: items.map(copia), cursor: quedan ? items[items.length - 1].id : null, leidas };
  }
  function contar(filtros = {}) {
    const { q, ...resto } = filtros;
    return visibles.reduce((n, p) => n + (coincide(p, resto) && (!q || coincideTexto(p, q)) ? 1 : 0), 0);
  }
  function facetas(filtros = {}) {
    const talles = {}, colores = {}, calces = {};
    visibles.forEach(p => {
      if (!coincide(p, filtros)) return;
      Object.keys(p.talles || {}).forEach(t => { if (conStock(p, t)) talles[t] = (talles[t] || 0) + 1; });
      colores[p.color] = (colores[p.color] || 0) + 1;
      calces[p.calce] = (calces[p.calce] || 0) + 1;
    });
    return { talles, colores, calces };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, facetas, obtener };
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
const stockDe = (p, op) => (op ? p.talles?.[op] || 0 : p.stock);
const tallesConStock = p => p.var.ops.filter(t => stockDe(p, t) > 0);
const esPantalon = p => p.medida === 'cadera';

const Medidas = {
  KEY: 'vicol_medidas',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return v && typeof v === 'object' ? v : null; } catch { return null; } },
  save(v) { try { localStorage.setItem(this.KEY, JSON.stringify(v)); } catch (e) { void e; } },
};
const TABLA_ARRIBA = [
  { t: 'S', busto: 88, cintura: 68, cadera: 94 }, { t: 'M', busto: 92, cintura: 72, cadera: 98 },
  { t: 'L', busto: 98, cintura: 78, cadera: 104 }, { t: 'XL', busto: 104, cintura: 84, cadera: 110 },
  { t: 'XXL', busto: 110, cintura: 90, cadera: 116 },
];
const TABLA_PANTALON = [
  { t: '36', cintura: 68, cadera: 94 }, { t: '38', cintura: 72, cadera: 98 }, { t: '40', cintura: 76, cadera: 102 },
  { t: '42', cintura: 80, cadera: 106 }, { t: '44', cintura: 84, cadera: 110 }, { t: '46', cintura: 88, cadera: 114 },
];
function indiceTabla(tabla, clave, valor) {
  const i = tabla.findIndex(f => valor <= f[clave]);
  return { i: i < 0 ? tabla.length - 1 : i, fuera: i < 0 };
}
function talleSugerido(tipo, m) {
  const tabla = tipo === 'pantalon' ? TABLA_PANTALON : TABLA_ARRIBA;
  const claves = tipo === 'pantalon' ? ['cintura', 'cadera'] : ['busto', 'cintura'];
  let i = -1, fuera = false;
  claves.forEach(c => {
    if (!(m?.[c] > 0)) return;
    const r = indiceTabla(tabla, c, m[c]);
    i = Math.max(i, r.i);
    fuera = fuera || r.fuera;
  });
  return i < 0 ? null : { talle: tabla[i].t, fuera };
}
function medidaPrenda(p, talle) {
  const tabla = esPantalon(p) ? TABLA_PANTALON : TABLA_ARRIBA;
  const fila = tabla.find(f => f.t === talle);
  if (!fila) return null;
  const holgura = CALCES.find(c => c.id === p.calce)?.holgura || 6;
  const k = tabla.indexOf(fila);
  return { contorno: fila[p.medida] + holgura, largo: p.largo + k };
}

const Cart = {
  KEY: 'vicol_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, op = '') {
    const tope = stockDe(producto, op);
    if (tope <= 0) return false;
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.op || '') === op);
    if (existing) existing.qty = Math.min(existing.qty + qty, tope);
    else items.push({ id: producto.id, op, qty: Math.min(qty, tope) });
    this.save(items);
    return true;
  },
  setQty(id, op, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.op || '') === op); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p ? stockDe(p, op) : 99)); this.save(items);
  },
  remove(id, op) { this.save(this.get().filter(i => !(i.id === id && (i.op || '') === op))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const Favs = {
  KEY: 'vicol_favs',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const set = new Set(this.get());
    const on = !set.has(id);
    if (on) set.add(id); else set.delete(id);
    try { localStorage.setItem(this.KEY, JSON.stringify([...set])); } catch (e) { void e; }
    document.dispatchEvent(new CustomEvent('favs:updated'));
    return on;
  },
};

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  corazon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  percha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.5a2 2 0 1 1 2-2"/><path d="M12 7.5v1.6L3.4 15.2a1.4 1.4 0 0 0 .8 2.5h15.6a1.4 1.4 0 0 0 .8-2.5L12 9.1"/></svg>',
  cinta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h18v8H3z"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function metaDe(p) {
  return `${nombreDe(CATEGORIAS, p.cat)} · ${nombreDe(CALCES, p.calce)}`;
}
function precioHTML(p) {
  return `<p class="precio"><span class="precio__final${p.descuento > 0 ? ' precio__final--oferta' : ''}">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="etiqueta etiqueta--oferta">-${p.descuento}%</span>`);
  if (p.tag) b.push(`<span class="etiqueta">${esc(p.tag)}</span>`);
  else if (p.stock <= 10) b.push('<span class="etiqueta etiqueta--clara">Últimas unidades</span>');
  return b.length ? `<span class="prod__badges">${b.join('')}</span>` : '';
}
const urlProducto = p => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}`;
function favHTML(p) {
  const on = Favs.has(p.id);
  return `<button type="button" class="fav" data-fav="${p.id}" aria-pressed="${on}" aria-label="Guardar en favoritos: ${esc(p.nombre)}">${ICON.corazon}</button>`;
}
function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar uno"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar uno"${valor >= max ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}
function tallesHTML(p) {
  return `<span class="prod__talles" aria-hidden="true"><span class="prod__talles-tit">Talles</span>${p.var.ops.map(t => `<span${stockDe(p, t) ? '' : ' class="sin"'}>${esc(t)}</span>`).join('')}</span>`;
}
function selectTalleHTML(p) {
  const sug = sugeridoPara(p);
  return `<label class="var-sel"><span class="sr-only">Talle de ${esc(p.nombre)}</span><select data-op><option value="">Talle</option>${p.var.ops.map(o => `<option value="${esc(o)}"${stockDe(p, o) ? '' : ' disabled'}${sug && sug === o ? ' selected' : ''}>${esc(o)}${stockDe(p, o) ? '' : ' · sin stock'}</option>`).join('')}</select></label>`;
}
function sugeridoPara(p) {
  const r = talleSugerido(esPantalon(p) ? 'pantalon' : 'arriba', Medidas.get());
  return r && stockDe(p, r.talle) > 0 ? r.talle : '';
}

function cardHTML(p) {
  const nombre = esc(p.nombre);
  return `<article class="prod">
    <div class="prod__media"><a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async"></a>${badgesHTML(p)}${favHTML(p)}${tallesHTML(p)}</div>
    <div class="prod__body">
      <p class="prod__meta">${esc(metaDe(p))}</p>
      <h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      ${precioHTML(p)}
      <div class="prod__acciones">${selectTalleHTML(p)}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar</span>${ICON.carritoMas}</button></div>
      <button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}

function fichaHTML(p, n) {
  const nombre = esc(p.nombre);
  return `<article class="ficha">
    <span class="ficha__n" aria-hidden="true">${String(n).padStart(2, '0')}</span>
    <a class="ficha__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="${esc(p.alt)}" width="400" height="400" decoding="async"></a>
    <div class="ficha__info">
      <h3 class="ficha__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      <p class="ficha__meta">${esc(nombreDe(CATEGORIAS, p.cat))} · ${esc(p.tela)}</p>
    </div>
    <ul class="ficha__talles" aria-label="Talles con stock de ${nombre}">${p.var.ops.map(t => `<li${stockDe(p, t) ? '' : ' class="sin" aria-label="Talle ' + esc(t) + ' sin stock"'}>${esc(t)}</li>`).join('')}</ul>
    ${precioHTML(p)}
    <button type="button" class="ficha__btn" data-qv-abrir="${p.id}" aria-label="Elegir talle: ${nombre}">Elegir talle${ICON.flecha}</button>
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
    panel.innerHTML = '<div class="cats-lista">' + CATEGORIAS.map(c => `
        <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
          <img src="${c.img}" alt="" width="56" height="56" decoding="async">
          <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
          <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
        </a>`).join('') + '</div>'
      + `<div class="cats-calces"><p class="cats-calces__tit">Por calce</p>${CALCES.map(c => `<a href="${CATALOGO_URL}?calce=${c.id}">${esc(c.nombre)} <span class="cats-item__n">${Tienda.contar({ calce: c.id })}</span></a>`).join('')}</div>`
      + `<div class="cats-pie"><a class="cats-oferta" href="${CATALOGO_URL}?oferta=1">Ofertas <span class="cats-item__n">${Tienda.contar({ oferta: true })}</span></a><a class="cats-todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a></div>`;
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
  });
  if (PAGINA === 'catalogo' && catActual) {
    document.querySelectorAll('.main-nav > a').forEach(a => {
      if (new URL(a.href, location.href).searchParams.get('cat') === catActual) a.setAttribute('aria-current', 'page');
    });
  }
}

function initBuscadorHeader() {
  const btn = document.querySelector('[data-abrir-busqueda]');
  const form = document.querySelector('.header-search[hidden], .header-search.es-plegable');
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
  hero.querySelectorAll('[data-hero-img]').forEach(img => tl.from(img, { scale: 1.08, duration: 1.8, clearProps: 'transform' }, 0));
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.12)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, duration: 1.1 }, 0.22)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.4)
    .from(hero.querySelectorAll('.hero-ctas > *'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.54)
    .from(hero.querySelectorAll('.hero-datos > li'), { y: 16, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7)
    .from(hero.querySelectorAll('.hero-tejida'), { scale: 0.92, opacity: 0, duration: 0.9, ease: 'back.out(1.5)', clearProps: 'transform,opacity' }, 0.8)
    .from(hero.querySelectorAll('.hero-ficha'), { y: 22, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.9)
    .fromTo(hero.querySelectorAll('.hero-regla'), { clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)', duration: 1.2, ease: 'power2.inOut', clearProps: 'clipPath' }, 0.95);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    ScrollTrigger.create({
      trigger: el.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { el.style.translate = `0 ${(-3 + 6 * s.progress).toFixed(2)}%`; },
    });
  });
}

function pintarPrecios() {
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (p) el.textContent = formatearPrecio(precioFinal(p));
  });
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.catN });
    el.textContent = `${n} ${n === 1 ? 'prenda' : 'prendas'}`;
  });
}

function initRail() {
  const vp = document.getElementById('railVp');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  track.innerHTML = Tienda.consultar({ orden: 'nuevos', limite: 8 }).items
    .map(p => `<li data-animate="der" style="opacity:0;transform:translateX(48px)">${cardHTML(p)}</li>`).join('');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.querySelector('li')?.getBoundingClientRect().width || 280) + 18;
  const flechas = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();

  let pointerId = null, startX = 0, startLeft = 0, moved = false, matar = false;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    if (e.target.closest('button, select, input')) return;
    pointerId = e.pointerId; startX = e.clientX; startLeft = vp.scrollLeft; moved = false;
  });
  vp.addEventListener('pointermove', e => {
    if (pointerId === null || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    vp.scrollLeft = startLeft - dx;
  });
  const fin = () => {
    if (pointerId === null) return;
    try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
    if (moved) { matar = true; setTimeout(() => { matar = false; }, 0); }
    vp.classList.remove('dragging');
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', fin);
  vp.addEventListener('pointercancel', fin);
  vp.addEventListener('lostpointercapture', fin);
  vp.addEventListener('click', e => { if (matar) { e.preventDefault(); e.stopPropagation(); matar = false; } }, true);
}

function initCalces() {
  const box = document.getElementById('calces');
  if (!box) return;
  const tabs = [...box.querySelectorAll('[role="tab"]')];
  const panel = document.getElementById('calcesPanel');
  const frase = document.getElementById('calceFrase');
  const texto = document.getElementById('calceTexto');
  const holgura = document.getElementById('calceHolgura');
  const link = document.getElementById('calceLink');
  const lista = document.getElementById('calceLista');
  if (!tabs.length || !panel || !lista) return;
  const mostrar = (id, foco) => {
    const c = CALCES.find(x => x.id === id) || CALCES[0];
    tabs.forEach(t => {
      const on = t.dataset.calce === c.id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on) { panel.setAttribute('aria-labelledby', t.id); if (foco) t.focus(); }
    });
    frase.textContent = c.frase;
    texto.textContent = c.texto;
    holgura.textContent = c.rango;
    link.href = `${CATALOGO_URL}?calce=${c.id}`;
    link.querySelector('span').textContent = `Ver todo lo ${c.id === 'cuerpo' ? 'que va al cuerpo' : c.nombre.toLowerCase()}`;
    const items = Tienda.consultar({ filtros: { calce: c.id }, orden: 'destacados', limite: 4 }).items;
    lista.innerHTML = items.map((p, i) => `<li data-animate="subir" style="opacity:0;transform:translateY(32px)">${fichaHTML(p, i + 1)}</li>`).join('');
    revelarNuevos(lista);
    refrescarTriggers();
  };
  box.addEventListener('click', e => {
    const t = e.target.closest('[role="tab"]');
    if (t) mostrar(t.dataset.calce);
  });
  box.querySelector('[role="tablist"]')?.addEventListener('keydown', e => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let j = null;
    if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = tabs.length - 1;
    if (j === null) return;
    e.preventDefault();
    mostrar(tabs[j].dataset.calce, true);
  });
  mostrar(tabs[0].dataset.calce);
}

function initGuia() {
  const form = document.getElementById('guiaCalce');
  if (!form) return;
  const campos = { busto: document.getElementById('gBusto'), cintura: document.getElementById('gCintura'), cadera: document.getElementById('gCadera') };
  const arriba = document.getElementById('guiaArriba');
  const pantalon = document.getElementById('guiaPantalon');
  const txt = document.getElementById('guiaTxt');
  const ver = document.getElementById('guiaVer');
  const wsp = document.getElementById('guiaWsp');
  const res = document.getElementById('guiaRes');
  const guardadas = Medidas.get();
  if (guardadas) Object.entries(campos).forEach(([k, el]) => { if (el && guardadas[k] > 0) el.value = guardadas[k]; });
  const leer = () => {
    const m = {};
    Object.entries(campos).forEach(([k, el]) => {
      const v = Number(el?.value);
      if (v >= 50 && v <= 160) m[k] = Math.round(v);
    });
    return m;
  };
  const pintar = guardar => {
    const m = leer();
    const a = talleSugerido('arriba', m);
    const p = talleSugerido('pantalon', m);
    res.classList.toggle('is-listo', !!(a || p));
    arriba.textContent = a ? a.talle : '—';
    pantalon.textContent = p ? p.talle : '—';
    if (!a && !p) {
      txt.textContent = 'Cargá al menos una medida en centímetros y te decimos qué talle pedir.';
      ver.hidden = true;
      wsp.href = wspHref(`Hola ${MARCA}! Quiero que me ayuden a elegir el talle.`);
      return;
    }
    const talles = [a?.talle, p?.talle].filter(Boolean);
    const n = Tienda.contar({ talle: talles });
    txt.textContent = (a?.fuera || p?.fuera)
      ? 'Tus medidas pasan la tabla. Escribinos y te confirmamos cómo calza cada prenda antes de comprar.'
      : `${n} ${n === 1 ? 'prenda tiene' : 'prendas tienen'} stock en tu talle. Si estás entre dos, en las prendas al cuerpo elegí el más grande.`;
    ver.hidden = !n;
    ver.href = `${CATALOGO_URL}?talle=${talles.join(',')}`;
    const medidas = Object.entries(m).map(([k, v]) => `${k} ${v} cm`).join(', ');
    wsp.href = wspHref(`Hola ${MARCA}! Según la guía soy talle ${a ? a.talle : '—'} arriba y ${p ? p.talle : '—'} de pantalón (${medidas}). ¿Me lo confirman?`);
    if (guardar) Medidas.save(m);
  };
  form.addEventListener('input', () => pintar(true));
  form.addEventListener('submit', e => { e.preventDefault(); pintar(true); });
  pintar(false);
}

const QV = { p: null, op: '', foto: 0, opener: null };
function medidasHTML(p) {
  const filas = p.var.ops.map(t => {
    const m = medidaPrenda(p, t);
    return m ? `<tr${QV.op === t ? ' class="es-tuyo"' : ''}><th scope="row">${esc(t)}</th><td>${m.contorno}</td><td>${m.largo}</td><td>${stockDe(p, t) ? stockDe(p, t) : 'Sin stock'}</td></tr>` : '';
  }).join('');
  return `<details class="qv__medidas"${Medidas.get() ? ' open' : ''}>
    <summary>${ICON.cinta}Medidas de la prenda</summary>
    <table><caption class="sr-only">Medidas de ${esc(p.nombre)} por talle, en centímetros</caption>
      <thead><tr><th scope="col">Talle</th><th scope="col">${esPantalon(p) ? 'Cadera' : 'Busto'}</th><th scope="col">Largo</th><th scope="col">Stock</th></tr></thead>
      <tbody>${filas}</tbody></table>
    <p>Medidas de la prenda en cm, tomadas en plano y multiplicadas por dos. Holgura ${esc(nombreDe(CALCES, p.calce).toLowerCase())}: ${esc(CALCES.find(c => c.id === p.calce)?.rango || '')}.</p>
  </details>`;
}
function consejoHTML(p) {
  const m = Medidas.get();
  const sug = talleSugerido(esPantalon(p) ? 'pantalon' : 'arriba', m);
  if (!sug) return `<p class="qv__consejo">${ICON.cinta}<span>¿No sabés tu talle? <a href="${HOME_URL}#talles" class="qv__guia">Cargá tus medidas en la guía</a> y te lo sugerimos acá.</span></p>`;
  const prenda = medidaPrenda(p, sug.talle);
  const clave = p.medida;
  const holg = m?.[clave] > 0 && prenda ? prenda.contorno - m[clave] : null;
  const hay = stockDe(p, sug.talle) > 0;
  return `<p class="qv__consejo is-listo">${ICON.cinta}<span>Para tus medidas: <strong>talle ${esc(sug.talle)}</strong>${holg != null ? `, te queda con ${holg} cm de holgura en ${clave}` : ''}.${hay ? '' : ' Ese talle está sin stock: escribinos y te avisamos cuando entre.'}</span></p>`;
}
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const fotos = [{ src: p.img, alt: p.alt }];
  if (p.escena) fotos.push({ src: p.escena, alt: p.escena.includes('mesa') ? 'Blusa marfil de gasa con el pantalón sastrero azul marino' : `Otra vista: ${p.alt}` });
  const msg = `Hola ${MARCA}! Quiero consultar por ${p.nombre}${QV.op ? ` (talle ${QV.op})` : ''}.`;
  const on = Favs.has(p.id);
  const actual = fotos[QV.foto];
  const forma = actual.src.includes('alto') ? ' qv__principal--alta' : actual.src.includes('mesa') ? ' qv__principal--ancha' : '';
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal${forma}"><img src="${actual.src}" alt="${esc(actual.alt)}" width="800" height="800"></div>
        ${fotos.length > 1 ? `<div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver otra foto' : 'Ver la foto de la prenda'}"><img src="${f.src}" alt="" width="72" height="72"></button>`).join('')}</div>` : ''}
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(cat?.nombre || '')} · Calce ${esc(nombreDe(CALCES, p.calce).toLowerCase())}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p)}
        <p class="qv__desc">${esc(p.desc)}</p>
        <dl class="qv__ficha"><div><dt>Tela</dt><dd>${esc(p.tela)}</dd></div><div><dt>Color</dt><dd>${esc(nombreDe(COLORES, p.color))}</dd></div><div><dt>Calce</dt><dd>${esc(nombreDe(CALCES, p.calce))}</dd></div></dl>
        <div>
          <p class="f-grupo__titulo">Talle</p>
          <div class="qv__ops" role="group" aria-label="Elegí tu talle">${p.var.ops.map(o => `<button type="button" class="qv__op" data-qv-op="${esc(o)}" aria-pressed="${QV.op === o}"${stockDe(p, o) ? '' : ' disabled aria-label="Talle ' + esc(o) + ', sin stock"'}>${esc(o)}</button>`).join('')}</div>
          <p class="qv__aviso" id="qvAviso" aria-live="polite"></p>
        </div>
        ${consejoHTML(p)}
        <div class="qv__compra">
          ${stepperHTML(QV.op ? stockDe(p, QV.op) : 1)}
          <button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
        </div>
        ${medidasHTML(p)}
        <div class="qv__extra">
          <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar talle por WhatsApp</a>
          <button type="button" class="qv__fav" data-fav="${p.id}" aria-pressed="${on}">${ICON.corazon}<span>${on ? 'En tus favoritos' : 'Guardar en favoritos'}</span></button>
        </div>
        ${rel.length ? `<div class="qv__rel"><h3>Más ${esc(cat?.nombre?.toLowerCase() || 'prendas')}</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.img}" alt="" width="400" height="400"></span><span>${esc(r.nombre)}</span><span class="precio__final">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, color: nombreDe(COLORES, p.color), material: p.tela,
    image: new URL(p.img, location.href).href, category: cat?.nombre, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function abrirQV(id, opener, op = '') {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p;
  QV.op = p.var.ops.includes(op) && stockDe(p, op) > 0 ? op : sugeridoPara(p);
  QV.foto = 0;
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
    if (e.target.closest('.qv__guia') && PAGINA === 'home') { cerrarQV(); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) { QV.foto = Number(foto.dataset.qvFoto); renderQV(); return; }
    const o = e.target.closest('[data-qv-op]');
    if (o) {
      QV.op = o.dataset.qvOp;
      const abiertas = modal.querySelector('.qv__medidas')?.open;
      renderQV();
      const det = modal.querySelector('.qv__medidas');
      if (det && abiertas) det.open = true;
      modal.querySelector(`[data-qv-op="${CSS.escape(QV.op)}"]`)?.focus();
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      if (!QV.op) {
        const aviso = document.getElementById('qvAviso');
        if (aviso) aviso.textContent = 'Elegí tu talle para sumarla al carrito.';
        modal.querySelector('[data-qv-op]:not([disabled])')?.focus();
        return;
      }
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty, QV.op);
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${p.nombre} (talle ${QV.op}) al carrito.`);
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
  return `<li class="linea" data-linea="${p.id}" data-linea-op="${esc(op)}">
    <img src="${p.img}" alt="" width="72" height="72">
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta">${op ? `Talle ${esc(op)} · ` : ''}${formatearPrecio(precioFinal(p))} c/u</p>
      ${stepperHTML(stockDe(p, op), i.qty)}
    </div>
    <div class="linea__lado"><span>${formatearPrecio(precioFinal(p) * i.qty)}</span><button type="button" class="linea__quitar" data-quitar>Quitar</button></div>
  </li>`;
}
function renderCarrito() {
  const items = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!items || !foot) return;
  const lineas = Cart.get().filter(i => getProducto(i.id));
  if (!lineas.length) {
    items.innerHTML = `<div class="drawer__vacio">${ICON.percha}<p>Tu carrito está vacío. Hay blusas, vestidos y pantalones esperando tu talle.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver al catálogo ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  const total = Cart.total();
  document.getElementById('cartTotal').textContent = formatearPrecio(total);
  const texto = [`Hola ${MARCA}! Quiero hacer este pedido:`, ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${i.qty} × ${p.nombre}${i.op ? ` (talle ${i.op})` : ''}: ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }), `Total: ${formatearPrecio(total)}`].join('\n');
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

function syncFavs() {
  const favs = Favs.get();
  document.querySelectorAll('[data-fav]').forEach(b => {
    const on = favs.includes(b.dataset.fav);
    b.setAttribute('aria-pressed', String(on));
    const t = b.querySelector('span');
    if (t) t.textContent = on ? 'En tus favoritos' : 'Guardar en favoritos';
  });
  document.querySelectorAll('[data-favs-n]').forEach(el => { el.textContent = favs.length; el.hidden = !favs.length; });
}

function initAcciones() {
  document.addEventListener('click', e => {
    const fav = e.target.closest('[data-fav]');
    if (fav) {
      const p = getProducto(fav.dataset.fav);
      if (!p) return;
      const on = Favs.toggle(p.id);
      fav.classList.remove('pop'); void fav.offsetWidth; fav.classList.add('pop');
      showToast(on ? `Guardaste ${p.nombre} en favoritos.` : `Sacaste ${p.nombre} de favoritos.`);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv && !e.target.closest('.qv')) { e.preventDefault(); abrirQV(qv.dataset.qv, qv); return; }
    const abrir = e.target.closest('[data-qv-abrir]');
    if (abrir) { abrirQV(abrir.dataset.qvAbrir, abrir); return; }
    const st = e.target.closest('[data-stepper]');
    if (st && !e.target.closest('[data-linea]')) {
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
      const op = add.closest('.prod__acciones')?.querySelector('[data-op]')?.value || '';
      if (!op) { abrirQV(p.id, add); return; }
      Cart.add(p, 1, op);
      showToast(`Sumaste ${p.nombre} (talle ${op}) al carrito.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const op = comprar.closest('.prod__body')?.querySelector('[data-op]')?.value || '';
      if (!op) { abrirQV(p.id, comprar); return; }
      Cart.add(p, 1, op);
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
  const valido = (v, arr) => (arr.some(x => (x.id ?? x) === v) ? v : '');
  const multi = (clave, arr) => (params.get(clave) || '').split(',').filter(v => arr.some(x => (x.id ?? x) === v));
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS), calce: multi('calce', CALCES), color: multi('color', COLORES), talle: multi('talle', TALLES),
    precio: valido(params.get('precio'), PRECIOS), oferta: params.get('oferta') === '1', fav: params.get('fav') === '1',
    orden: valido(params.get('orden'), ORDENES) || 'destacados', q: (params.get('q') || '').trim().slice(0, 60),
  };
  const tallesValidos = () => {
    const f = Tienda.facetas(e.cat ? { cat: e.cat } : {});
    return TALLES.filter(t => f.talles[t]);
  };
  const compatibles = () => {
    const ok = tallesValidos();
    e.talle = e.talle.filter(t => ok.includes(t));
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
  const vacioTxt = document.getElementById('vacioTxt');
  const activos = document.getElementById('activos');
  const nBadge = document.querySelector('[data-filtros-n]');
  const chips = document.getElementById('chipsCat');
  let cursor = null, mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.calce.length) f.calce = e.calce;
    if (e.color.length) f.color = e.color;
    if (e.talle.length) f.talle = e.talle;
    if (e.oferta) f.oferta = true;
    if (e.fav) f.ids = Favs.get();
    const r = PRECIOS.find(x => x.id === e.precio);
    if (r) { f.precioMin = r.min; f.precioMax = r.max; }
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (tipo, nombre, valor, etiqueta, marcado, n, grupo) => `<label class="f-op"><input type="${tipo}" name="${nombre}" value="${valor}" data-f="${grupo}"${marcado ? ' checked' : ''}><span>${etiqueta}</span>${n != null ? `<small>${n}</small>` : ''}</label>`;
  const chipTalle = t => `<label class="f-talle"><input type="checkbox" name="talle-${t}" value="${t}" data-f="talle"${e.talle.includes(t) ? ' checked' : ''}><span>${t}</span></label>`;
  function pintarFiltros() {
    const base = e.cat ? { cat: e.cat } : {};
    const fac = Tienda.facetas(base);
    const grupos = [];
    grupos.push(`<fieldset class="f-grupo"><legend>Categoría</legend>
      ${opcion('radio', 'cat', '', 'Toda la tienda', !e.cat, Tienda.contar({}), 'cat')}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }), 'cat')).join('')}</fieldset>`);
    const calces = CALCES.filter(c => fac.calces[c.id]);
    if (calces.length) grupos.push(`<fieldset class="f-grupo"><legend>Calce</legend>
      ${calces.map(c => opcion('checkbox', `calce-${c.id}`, c.id, esc(c.nombre), e.calce.includes(c.id), fac.calces[c.id], 'calce')).join('')}</fieldset>`);
    const letras = T_LETRAS.filter(t => fac.talles[t]);
    const numeros = T_NUMEROS.filter(t => fac.talles[t]);
    if (letras.length || numeros.length) grupos.push(`<fieldset class="f-grupo"><legend>Talle con stock</legend>
      ${letras.length ? `<p class="f-sub">Blusas, vestidos y tops</p><div class="f-talles">${letras.map(chipTalle).join('')}</div>` : ''}
      ${numeros.length ? `<p class="f-sub">Pantalones</p><div class="f-talles">${numeros.map(chipTalle).join('')}</div>` : ''}</fieldset>`);
    const colores = COLORES.filter(c => fac.colores[c.id]);
    if (colores.length) grupos.push(`<fieldset class="f-grupo"><legend>Color</legend><div class="f-colores">
      ${colores.map(c => `<label class="f-color"><input type="checkbox" name="color-${c.id}" value="${c.id}" data-f="color"${e.color.includes(c.id) ? ' checked' : ''}><i class="swatch swatch--${c.id}" aria-hidden="true"></i><span>${c.nombre}</span></label>`).join('')}</div></fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Precio</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio, null, 'precio')}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id, null, 'precio')).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Mostrar</legend>
      ${opcion('checkbox', 'oferta', '1', 'Solo ofertas', e.oferta, Tienda.contar({ ...base, oferta: true }), 'oferta')}
      ${opcion('checkbox', 'fav', '1', 'Mis favoritos', e.fav, Favs.get().length, 'fav')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const calce = !cat && e.calce.length === 1 ? CALCES.find(c => c.id === e.calce[0]) : null;
    const titulo = cat ? cat.nombre : calce ? `Calce ${calce.nombre.toLowerCase()}` : e.oferta ? 'Ofertas' : e.fav ? 'Tus favoritos' : e.talle.length ? `En tu talle` : e.orden === 'nuevos' ? 'Recién salido del taller' : 'Toda la colección';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : calce ? calce.texto : e.oferta ? 'Prendas con descuento, mientras haya talle.' : e.fav ? 'Lo que guardaste con el corazón, para decidir con calma.' : e.talle.length ? `Prendas con stock en talle ${e.talle.join(' y ')}.` : 'Blusas, vestidos, tops y pantalones de confección propia. Elegís tu talle y lo sumás al carrito.';
    document.title = `${titulo} — ${MARCA}`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) {
      const nombre = cat ? cat.nombre : calce ? calce.nombre : e.oferta ? 'Ofertas' : '';
      miga.hidden = !nombre; if (migaSep) migaSep.hidden = !nombre;
      miga.textContent = nombre;
      miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : calce ? `${CATALOGO_URL}?calce=${calce.id}` : `${CATALOGO_URL}?oferta=1`;
    }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.querySelectorAll('.main-nav > a').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id && id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat && !e.oferta ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`),
      `<a class="chip chip--oferta" href="${CATALOGO_URL}?oferta=1" data-chip-oferta${e.oferta && !e.cat ? ' aria-current="page"' : ''}>Ofertas <small>${Tienda.contar({ oferta: true })}</small></a>`].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.calce.forEach(v => quitar.push(['calce', v, `Calce ${nombreDe(CALCES, v).toLowerCase()}`]));
    e.talle.forEach(v => quitar.push(['talle', v, `Talle ${v}`]));
    e.color.forEach(v => quitar.push(['color', v, nombreDe(COLORES, v)]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.oferta) quitar.push(['oferta', '1', 'Solo ofertas']);
    if (e.fav) quitar.push(['fav', '1', 'Mis favoritos']);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'calce', 'color', 'talle', 'precio', 'oferta', 'fav', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.calce.length) u.searchParams.set('calce', e.calce.join(','));
    if (e.talle.length) u.searchParams.set('talle', e.talle.join(','));
    if (e.color.length) u.searchParams.set('color', e.color.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.oferta) u.searchParams.set('oferta', '1');
    if (e.fav) u.searchParams.set('fav', '1');
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
    contador.textContent = `${total} ${total === 1 ? 'prenda' : 'prendas'}`;
    vacio.hidden = total > 0;
    grid.hidden = total === 0;
    if (vacioTxt) vacioTxt.textContent = e.fav && !Favs.get().length
      ? 'Todavía no guardaste favoritos. Tocá el corazón de una prenda y aparece acá.'
      : 'No encontramos prendas con esos filtros. Probá con otra palabra o sacá algún filtro.';
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
    if (grupo === 'cat') { e.cat = inp.value; }
    else if (grupo === 'precio') e.precio = inp.value;
    else if (grupo === 'oferta' || grupo === 'fav') e[grupo] = inp.checked;
    else {
      const set = new Set(e[grupo]);
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
      e[grupo] = [...set];
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
  const limpiar = () => { e.cat = ''; e.calce = []; e.color = []; e.talle = []; e.precio = ''; e.oferta = false; e.fav = false; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'oferta' || k === 'fav') e[k] = false;
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat], [data-chip-oferta]');
    if (!a) return;
    ev.preventDefault();
    if (a.hasAttribute('data-chip-oferta')) { e.cat = ''; e.oferta = true; }
    else { e.cat = a.dataset.chipCat; e.oferta = false; }
    aplicar();
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('.cats-item, .cats-calces a, .cats-todo, .cats-oferta, .main-nav > a, a[data-ir-catalogo]');
    if (!a) return;
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.calce = (u.searchParams.get('calce') || '').split(',').filter(v => CALCES.some(x => x.id === v));
    e.oferta = u.searchParams.get('oferta') === '1';
    e.orden = valido(u.searchParams.get('orden'), ORDENES) || 'destacados';
    orden.value = e.orden;
    e.color = []; e.talle = []; e.precio = ''; e.fav = u.searchParams.get('fav') === '1'; e.q = ''; buscar.value = '';
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
  document.addEventListener('favs:updated', () => {
    pintarFiltros();
    if (e.fav) aplicar();
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
document.addEventListener('favs:updated', syncFavs);

[initCatsMenu, pintarPrecios, initRail, initCalces, initGuia, initCatalogo, initReveals, initNav, initBuscadorHeader, initHeroMotion, initParallax,
  initQV, initCarrito, initAcciones, initFloats, initModelBarScroll, syncModelosLink, updateCartBadge, syncFavs]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
