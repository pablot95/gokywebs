const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const POR_PAGINA = 16;
const TOPE_LINEA = 10;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
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

const WSP = '5491134477479';
const MARCA = 'Valky Lencería';
const CATEGORIAS = [
  { id: 'conjuntos', nombre: 'Conjuntos', titulo: 'Conjuntos de corpiño y colaless', bajada: 'Encaje, push up y taza soft', img: 'images/c-conjuntos.webp', uno: 'conjunto', varios: 'conjuntos' },
  { id: 'packs', nombre: 'Packs x3', titulo: 'Packs de tres colaless', bajada: 'Algodón, rayados, estampados y encaje', img: 'images/c-packs.webp', uno: 'pack', varios: 'packs' },
  { id: 'bombachas', nombre: 'Bombachas', titulo: 'Bombachas y vedettinas', bajada: 'Algodón, también en talles grandes', img: 'images/c-bombachas.webp', uno: 'opción', varios: 'opciones' },
  { id: 'boxer', nombre: 'Bóxeres', titulo: 'Bóxeres de algodón', bajada: 'Para él, de M a XXL', img: 'images/c-boxer.webp', uno: 'bóxer', varios: 'bóxeres' },
];
const TALLES = ['85', '90', '95', '100', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(t => ({ id: t.toLowerCase(), nombre: t }));
const TONOS = [
  { id: 'negro', nombre: 'Negro' },
  { id: 'rojo', nombre: 'Rojo y bordó' },
  { id: 'rosa', nombre: 'Rosa y fucsia' },
  { id: 'nude', nombre: 'Nude y pastel' },
  { id: 'azul', nombre: 'Azul y gris' },
  { id: 'estampado', nombre: 'Estampados y rayados' },
];
const PRECIOS = [
  { id: 'hasta15', nombre: 'Hasta $15.000', min: 0, max: 15000 },
  { id: '15a25', nombre: '$15.000 a $25.000', min: 15000, max: 25000 },
  { id: 'mas25', nombre: 'Más de $25.000', min: 25000, max: null },
];
const CORP = ['85', '90', '95', '100'];
const CORP3 = ['85', '90', '95'];
const PRODUCTOS = [
  { id: 'encantadora', rango: 1, cat: 'conjuntos', talles: CORP3, tonos: ['azul'], nombre: 'Conjunto Encantadora azul', nota: 'Encaje azul, copa B con aro', precio: 29900, descuento: 0, etiqueta: 'Nuevo', img: 'images/p-encantadora.webp', alt: 'Conjunto Encantadora de encaje azul grisáceo: corpiño con aro y colaless', desc: 'Conjunto de encaje en azul grisáceo: corpiño con aro y copa B, y colaless haciendo juego.', ficha: ['Corpiño con aro, copa B', 'Encaje en todo el conjunto', 'Colaless con tiritas regulables', 'Breteles regulables'], claves: ['encantadora', 'celeste', 'gris', 'copa b', 'aro'] },
  { id: 'less-encaje', rango: 2, cat: 'packs', talles: ['s', 'm', 'l'], tonos: ['nude'], nombre: 'Pack colaless de encaje x3', nota: 'Encaje en tonos pastel', precio: 15900, descuento: 0, img: 'images/p-less-encaje.webp', imgs: ['images/p-less-encaje-2.webp'], alt: 'Tres colaless de encaje en nude, verde agua y salmón', desc: 'Tres colaless de encaje con moño y tiritas regulables, en tonos pastel como nude, salmón y verde agua.', ficha: ['Tres colaless por pack', 'Encaje con moño al frente', 'Tiritas regulables', 'Los tres del mismo talle'], claves: ['less', 'encaje', 'pastel', 'verde', 'salmon', 'blanco', 'tanga'] },
  { id: 'negro', rango: 3, cat: 'conjuntos', talles: CORP, tonos: ['negro'], nombre: 'Conjunto negro de encaje', nota: 'Taza soft con moño', precio: 27900, descuento: 0, img: 'images/p-negro.webp', alt: 'Conjunto negro de encaje: corpiño de taza soft con moño y colaless', desc: 'Corpiño de taza soft cubierto de encaje negro, con moño al centro, y colaless de encaje con borde festoneado.', ficha: ['Corpiño de taza soft', 'Encaje negro con moño', 'Colaless de encaje festoneado', 'Breteles regulables'], claves: ['negro', 'encaje', 'moño', 'soft'] },
  { id: 'rojo', rango: 4, cat: 'conjuntos', talles: CORP, tonos: ['rojo'], nombre: 'Conjunto rojo push up', nota: 'Push up con puntilla y colaless', precio: 26900, descuento: 15, img: 'images/p-rojo.webp', alt: 'Conjunto rojo: corpiño push up con puntilla de encaje y colaless con moño', desc: 'Corpiño push up rojo con puntilla de encaje en el escote y colaless con tiritas y moño.', ficha: ['Corpiño push up, copa B', 'Puntilla de encaje', 'Colaless con tiritas', 'Detalle de moño'], claves: ['rojo', 'push up', 'puntilla', 'san valentin'] },
  { id: 'less-algodon', rango: 5, cat: 'packs', talles: ['m', 'l', 'xl'], tonos: ['nude', 'estampado', 'negro'], nombre: 'Pack colaless de algodón x3', nota: 'Nude, estampado y negro', precio: 13900, descuento: 0, img: 'images/p-less-algodon.webp', alt: 'Tres colaless de algodón: nude, estampado con corazones y negro', desc: 'Tres colaless de algodón para todos los días: uno nude, uno estampado con corazones y uno negro.', ficha: ['Tres colaless por pack', 'Algodón', 'Nude, estampado y negro', 'Los tres del mismo talle'], claves: ['less', 'algodon', 'corazones', 'basico', 'diario'] },
  { id: 'boxer-azul', rango: 6, cat: 'boxer', talles: ['m', 'l', 'xl', 'xxl'], tonos: ['azul'], nombre: 'Bóxer ajustado azul marino', nota: 'Algodón con elástico', precio: 9900, descuento: 0, ilustrativa: true, img: 'images/p-boxer-azul.webp', alt: 'Bóxer ajustado de algodón azul marino', desc: 'Bóxer ajustado de algodón azul marino, con elástico ancho en la cintura.', ficha: ['Corte ajustado', 'Algodón', 'Elástico ancho', 'Talles M a XXL'], claves: ['boxer', 'hombre', 'azul', 'marino', 'ajustado'] },
  { id: 'bordo-rosas', rango: 7, cat: 'conjuntos', talles: CORP, tonos: ['rojo'], nombre: 'Conjunto bordó con encaje', nota: 'Push up y colaless de encaje', precio: 28900, descuento: 0, img: 'images/p-bordo-rosas.webp', alt: 'Conjunto bordó: corpiño push up y colaless de encaje entre rosas', desc: 'Corpiño push up bordó con encaje en los costados y colaless de encaje bordó.', ficha: ['Corpiño push up', 'Encaje en los costados', 'Colaless de encaje', 'Breteles regulables'], claves: ['bordo', 'vino', 'encaje', 'push up'] },
  { id: 'vedettinas', rango: 8, cat: 'bombachas', talles: ['xl', 'xxl', 'xxxl'], tonos: ['rosa', 'nude', 'negro'], colores: [{ id: 'rosa', nombre: 'Rosa', hex: '#F2B6C6' }, { id: 'nude', nombre: 'Nude', hex: '#E9BE98' }, { id: 'fucsia', nombre: 'Fucsia', hex: '#D4467E' }, { id: 'blanco', nombre: 'Blanco', hex: '#F7F4F2' }, { id: 'malva', nombre: 'Malva', hex: '#C9A0AC' }, { id: 'negro', nombre: 'Negro', hex: '#25201F' }, { id: 'verde', nombre: 'Verde', hex: '#A9BD9A' }], nombre: 'Vedettina de algodón, talles grandes', nota: 'Algodón con lunares, XL a XXXL', precio: 6900, descuento: 0, etiqueta: 'Talles grandes', img: 'images/p-vedettinas.webp', alt: 'Vedettinas de algodón con microlunares colgadas en perchas, en siete colores', desc: 'Vedettina de algodón con microlunares y tiro alto, en talles XL, XXL y XXXL. Se vende por unidad: elegí el color.', ficha: ['Algodón con microlunares', 'Tiro alto', 'Talles XL, XXL y XXXL', 'Siete colores'], claves: ['vedettina', 'bombacha', 'algodon', 'talles grandes', 'lunares', 'xxxl'] },
  { id: 'fucsia', rango: 9, cat: 'conjuntos', talles: CORP3, tonos: ['rosa'], nombre: 'Conjunto fucsia con brillo', nota: 'Taza soft brillante', precio: 24900, descuento: 0, etiqueta: 'Últimas unidades', img: 'images/p-fucsia.webp', alt: 'Conjunto fucsia con brillo: corpiño de taza soft y colaless con moño', desc: 'Corpiño de taza soft fucsia con terminación brillante y colaless haciendo juego, con moño.', ficha: ['Corpiño de taza soft', 'Terminación brillante', 'Colaless con moño', 'Breteles regulables'], claves: ['fucsia', 'rosa', 'brillo', 'soft'] },
  { id: 'less-estampados', rango: 10, cat: 'packs', talles: ['m', 'l', 'xl', 'xxl'], tonos: ['estampado', 'rojo'], nombre: 'Pack colaless estampados x3', nota: 'Flores y corazones', precio: 13900, descuento: 0, img: 'images/p-less-estampados.webp', alt: 'Tres colaless estampados: dos con flores rojas y uno bordó con corazones', desc: 'Tres colaless de algodón estampados: dos con flores y uno bordó con corazones.', ficha: ['Tres colaless por pack', 'Algodón estampado', 'Flores y corazones', 'Los tres del mismo talle'], claves: ['less', 'estampado', 'flores', 'corazones', 'cerezas'] },
  { id: 'coral', rango: 11, cat: 'conjuntos', talles: CORP, tonos: ['rosa'], nombre: 'Conjunto coral con brillo', nota: 'Push up y tanga satinada', precio: 26900, descuento: 0, img: 'images/p-coral.webp', alt: 'Conjunto coral con brillo: corpiño push up y tanga satinada con moño', desc: 'Corpiño push up coral con brillo y tanga satinada con moño, para una ocasión especial.', ficha: ['Corpiño push up', 'Terminación con brillo', 'Tanga satinada', 'Detalle de moño'], claves: ['coral', 'naranja', 'brillo', 'satinado', 'tanga'] },
  { id: 'nude-encaje', rango: 12, cat: 'conjuntos', talles: CORP, tonos: ['nude'], nombre: 'Conjunto nude con encaje', nota: 'Taza soft con encaje lateral', precio: 27900, descuento: 0, img: 'images/p-nude-encaje.webp', alt: 'Conjunto nude: corpiño de taza soft con encaje y colaless con encaje lateral', desc: 'Corpiño de taza soft nude con encaje en los costados y colaless con encaje lateral: no se marca debajo de la ropa clara.', ficha: ['Corpiño de taza soft', 'Encaje en los costados', 'Colaless con encaje lateral', 'Tono nude'], claves: ['nude', 'piel', 'beige', 'encaje', 'soft'] },
  { id: 'boxer-gris', rango: 13, cat: 'boxer', talles: ['m', 'l', 'xl', 'xxl'], tonos: ['azul'], nombre: 'Bóxer de algodón gris', nota: 'Corte suelto con botón', precio: 10900, descuento: 0, ilustrativa: true, img: 'images/p-boxer-gris.webp', alt: 'Bóxer suelto de algodón gris con botón', desc: 'Bóxer de algodón gris de corte suelto, con botón al frente y elástico forrado.', ficha: ['Corte suelto', 'Algodón', 'Botón al frente', 'Talles M a XXL'], claves: ['boxer', 'hombre', 'gris', 'suelto', 'boton'] },
  { id: 'less-rayados', rango: 14, cat: 'packs', talles: ['s', 'm', 'l'], tonos: ['estampado', 'azul'], nombre: 'Pack colaless rayados x3', nota: 'Gris, coral y crudo', precio: 12900, descuento: 0, img: 'images/p-less-rayados.webp', alt: 'Tres colaless rayados en gris, coral y crudo', desc: 'Tres colaless de algodón rayados: uno gris, uno coral y uno crudo.', ficha: ['Tres colaless por pack', 'Algodón rayado', 'Gris, coral y crudo', 'Los tres del mismo talle'], claves: ['less', 'rayas', 'rayado', 'gris', 'coral'] },
  { id: 'nude-soft', rango: 15, cat: 'conjuntos', talles: CORP3, tonos: ['nude'], nombre: 'Conjunto nude soft', nota: 'Taza soft y colaless de encaje', precio: 23900, descuento: 0, img: 'images/p-nude-soft.webp', alt: 'Conjunto nude: corpiño de taza soft con encaje y colaless de encaje', desc: 'Corpiño de taza soft nude con detalle de encaje y colaless de encaje con tiritas.', ficha: ['Corpiño de taza soft', 'Detalle de encaje', 'Colaless de encaje', 'Tono nude'], claves: ['nude', 'piel', 'soft', 'encaje', 'basico'] },
  { id: 'bombachas-lunares', rango: 16, cat: 'bombachas', talles: ['m', 'l', 'xl'], tonos: ['rosa', 'nude'], nombre: 'Pack bombachas de algodón x3', nota: 'Rosa, nude y blanco con lunares', precio: 14900, descuento: 0, ilustrativa: true, img: 'images/p-bombachas-lunares.webp', alt: 'Tres bombachas de algodón con lunares en rosa, nude y blanco, en perchas', desc: 'Tres bombachas de algodón con lunares y moñito: una rosa, una nude y una blanca.', ficha: ['Tres bombachas por pack', 'Algodón con lunares', 'Moñito al frente', 'Las tres del mismo talle'], claves: ['bombacha', 'algodon', 'lunares', 'basica'] },
  { id: 'bordo-encaje', rango: 17, cat: 'conjuntos', talles: CORP, tonos: ['rojo'], nombre: 'Conjunto bordó texturado', nota: 'Push up texturado y colaless de encaje', precio: 28900, descuento: 0, img: 'images/p-bordo-encaje.webp', alt: 'Conjunto bordó: corpiño push up texturado con encaje y colaless de encaje', desc: 'Corpiño push up bordó con textura y encaje, y colaless de encaje bordó con moño.', ficha: ['Corpiño push up texturado', 'Encaje bordó', 'Colaless de encaje', 'Breteles regulables'], claves: ['bordo', 'vino', 'texturado', 'push up'] },
  { id: 'prueba-oculto', rango: 99, cat: 'conjuntos', talles: CORP, tonos: ['negro'], nombre: 'Producto de prueba', nota: 'Oculto', precio: 1000, descuento: 0, visible: false, img: 'images/p-negro.webp', alt: 'Producto oculto', desc: 'Producto oculto de prueba: no se muestra en la tienda.', ficha: [], claves: ['prueba'] },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const talleNombre = id => nombreDe(TALLES, id) || String(id).toUpperCase();
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const enRango = (p, id) => {
  const r = PRECIOS.find(x => x.id === id);
  const v = precioFinal(p);
  return !!r && v >= r.min && (r.max == null || v < r.max);
};
const tallesTexto = p => (p.talles.length > 1 ? `Talles ${talleNombre(p.talles[0])} a ${talleNombre(p.talles[p.talles.length - 1])}` : `Talle ${talleNombre(p.talles[0])}`);

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.nota, p.desc, catDe(p.cat).nombre, catDe(p.cat).titulo,
    ...p.talles.map(talleNombre), ...p.tonos.map(t => nombreDe(TONOS, t)), ...(p.colores || []).map(c => c.nombre),
    ...(p.ficha || []), ...(p.claves || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), talle = lista(f.talle), tono = lista(f.tono), precio = lista(f.precio), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (talle.length && !p.talles.some(t => talle.includes(t))) return false;
    if (tono.length && !p.tonos.some(t => tono.includes(t))) return false;
    if (precio.length && !precio.some(id => enRango(p, id))) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/\s+/).filter(Boolean);
    const texto = indice.get(p.id) || '';
    return palabras.every(w => texto.includes(w) || (w.length > 4 && w.endsWith('s') && texto.includes(w.slice(0, -1))) || (w.length > 5 && w.endsWith('es') && texto.includes(w.slice(0, -2))));
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
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
const claveDe = i => `${i.id}|${i.talle || ''}|${i.color || ''}`;
const colorNombre = (p, id) => (p?.colores || []).find(c => c.id === id)?.nombre || '';
const varianteTexto = (p, i) => [i.talle ? `Talle ${talleNombre(i.talle)}` : '', colorNombre(p, i.color)].filter(Boolean).join(' · ');

const Cart = {
  KEY: 'valky_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (err) { void err; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, { talle = '', color = '' } = {}, qty = 1) {
    if (!producto) return 0;
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    const k = claveDe({ id: producto.id, talle, color });
    const existing = items.find(i => claveDe(i) === k);
    const antes = existing ? existing.qty : 0;
    if (existing) existing.qty = Math.min(existing.qty + n, TOPE_LINEA);
    else items.push({ id: producto.id, talle, color, qty: n });
    this.save(items);
    return (existing ? existing.qty : n) - antes;
  },
  setQty(k, qty) {
    const items = this.get();
    const it = items.find(i => claveDe(i) === k);
    if (!it) return;
    it.qty = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    this.save(items);
  },
  remove(k) { this.save(this.get().filter(i => claveDe(i) !== k)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  sync() {
    const crudo = this.get();
    const limpias = [];
    let changed = false;
    crudo.forEach(i => {
      const p = i && getProducto(i.id);
      if (!p || !p.talles.includes(i.talle)) { changed = true; return; }
      const color = p.colores ? (p.colores.some(c => c.id === i.color) ? i.color : null) : '';
      if (color === null) { changed = true; return; }
      const qty = Math.max(1, Math.min(parseInt(i.qty, 10) || 1, TOPE_LINEA));
      const linea = { id: p.id, talle: i.talle, color, qty };
      const previa = limpias.find(x => claveDe(x) === claveDe(linea));
      if (previa) { previa.qty = Math.min(previa.qty + qty, TOPE_LINEA); changed = true; return; }
      if (qty !== i.qty || color !== (i.color || '')) changed = true;
      limpias.push(linea);
    });
    if (changed) this.save(limpias);
  },
};

const SVG = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICO = {
  mas: SVG('<path d="M12 5l0 14"/><path d="M5 12l14 0"/>'),
  menos: SVG('<path d="M5 12l14 0"/>'),
  x: SVG('<path d="M18 6l-12 12"/><path d="M6 6l12 12"/>'),
  check: SVG('<path d="M5 12l5 5l10 -10"/>'),
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
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

const stepperHTML = (n = 1) => `<div class="stepper" data-stepper><button type="button" data-paso="-1" aria-label="Restar uno">${ICO.menos}</button><output data-qty>${n}</output><button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;
const precioHTML = (p, badge = true) => `<p class="precio"><span class="precio__v">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>${badge ? `<span class="precio__desc">-${p.descuento}%</span>` : ''}` : ''}</p>`;

const ANIMS = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(40px)"',
  subir24: ' data-animate="subir" style="opacity:0;transform:translateY(24px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(56px)"',
  no: '',
};
function cardHTML(p, { anim = 'subir' } = {}) {
  const a = ANIMS[anim] ?? ANIMS.subir;
  const badge = p.etiqueta ? `<span class="prod__badge">${esc(p.etiqueta)}</span>` : '';
  const off = p.descuento > 0 ? `<span class="prod__off">-${p.descuento}%</span>` : '';
  return `<article class="prod" data-id="${esc(p.id)}"${a}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img)}" alt="${esc(p.alt)}" width="900" height="900" decoding="async"></button>${badge}${off}</div>
  <div class="prod__info">
    <p class="prod__det">${esc(p.cat === 'packs' ? `Pack x3 · ${tallesTexto(p)}` : tallesTexto(p))}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    ${precioHTML(p, false)}
    <div class="prod-actions"><button type="button" class="btn btn--cta btn--sm prod-add" data-elegir="${esc(p.id)}" aria-label="Elegir talle y agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button></div>
    <button type="button" class="prod__comprar" data-elegir-comprar="${esc(p.id)}">Comprar ahora ${ICO.flecha}</button>
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

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const v = varianteTexto(p, i).toLowerCase();
    return `• ${i.qty} × ${p.nombre}${v ? ` (${v})` : ''} — ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }).filter(Boolean);
  return `Hola! Quiero hacer este pedido en ${MARCA}:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}\n¿Cómo coordinamos el pago y la entrega?`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const key = esc(claveDe(i));
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img)}" alt="" width="900" height="900">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">${esc(varianteTexto(p, i))}</p>
    <div class="linea__fila">
      <div class="stepper"><button type="button" data-linea-paso="-1" data-k="${key}" aria-label="Restar una de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-k="${key}" aria-label="Sumar una de ${esc(p.nombre)}"${i.qty >= TOPE_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
    </div>
  </div>
  <button type="button" class="linea__quitar" data-quitar="${key}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button>
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
  const pintar = () => {
    const items = Cart.get();
    const n = Cart.count();
    cuenta.textContent = n ? plural(n, 'prenda', 'prendas') : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  lista.addEventListener('click', e => {
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const k = paso.dataset.k;
      const it = Cart.get().find(x => claveDe(x) === k);
      if (it) Cart.setQty(k, it.qty + Number(paso.dataset.lineaPaso));
      [...lista.querySelectorAll(`[data-linea-paso="${paso.dataset.lineaPaso}"]`)].find(b => b.dataset.k === k && !b.disabled)?.focus();
      return;
    }
    const q = e.target.closest('[data-quitar]');
    if (!q) return;
    const id = q.dataset.quitar.split('|')[0];
    const p = getProducto(id);
    Cart.remove(q.dataset.quitar);
    if (p) showToast(`Sacaste «${p.nombre}» del carrito`);
    drawer.querySelector('.drawer__head button')?.focus();
  });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito(b)));
  pintar();
}

function opcionesHTML(p, pref) {
  const talles = `<fieldset class="opciones" data-grupo="talle"><legend>Talle</legend><div class="opciones__fila">${p.talles.map(t => `<label class="op-talle"><input type="radio" name="${pref}-talle" value="${esc(t)}"${p.talles.length === 1 ? ' checked' : ''}><span>${esc(talleNombre(t))}</span></label>`).join('')}</div></fieldset>`;
  const colores = p.colores ? `<fieldset class="opciones" data-grupo="color"><legend>Color</legend><div class="opciones__fila">${p.colores.map(c => `<label class="op-color"><input type="radio" name="${pref}-color" value="${esc(c.id)}"><i style="background:${esc(c.hex)}"></i><span>${esc(c.nombre)}</span></label>`).join('')}</div></fieldset>` : '';
  return talles + colores;
}
function leerOpciones(cont, p) {
  const talle = cont.querySelector('input[name$="-talle"]:checked')?.value || '';
  const color = cont.querySelector('input[name$="-color"]:checked')?.value || '';
  let error = '', foco = null;
  if (!talle) { error = 'Elegí un talle para seguir.'; foco = cont.querySelector('input[name$="-talle"]'); }
  else if (p.colores && !color) { error = 'Elegí un color para seguir.'; foco = cont.querySelector('input[name$="-color"]'); }
  return { talle, color, error, foco };
}
function mostrarError(el, r) {
  if (!el) return;
  el.textContent = r.error;
  el.hidden = !r.error;
  r.foco?.focus();
}
function avisoSumado(p, opciones, n) {
  const v = varianteTexto(p, opciones).toLowerCase();
  if (n) showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}»${v ? `, ${v},` : ''} al carrito`);
  else showToast(`Ya tenés ${TOPE_LINEA} de «${p.nombre}» en ese talle`);
}

let sheetEstado = null;
function abrirSheet(id, modo, previo) {
  const sheet = document.getElementById('talleSheet');
  const p = getProducto(id);
  if (!sheet || !p) return;
  sheetEstado = { id: p.id, modo, previo };
  sheet.querySelector('[data-sheet-body]').innerHTML = `<div class="sh">
  <div class="sh__prod"><img src="${esc(p.img)}" alt="" width="900" height="900"><div><b>${esc(p.nombre)}</b>${precioHTML(p)}</div></div>
  ${opcionesHTML(p, 'sh')}
  <p class="opciones__error" data-sheet-error role="alert" hidden></p>
  <button type="button" class="btn btn--cta btn--block sh__ok" data-sheet-ok>${modo === 'comprar' ? `Comprar ahora ${ICO.flecha}` : `${ICO.carrito}Agregar al carrito`}</button>
  <a class="qv__wsp" href="${esc(wspHref(`Hola! Tengo una duda con el talle de «${p.nombre}» en ${MARCA}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>¿Dudas con el talle? Preguntanos</span></a>
</div>`;
  sheet.setAttribute('aria-label', `Elegí el talle: ${p.nombre}`);
  abrirCapa(sheet, { previo });
  setTimeout(() => sheet.querySelector('input')?.focus(), 80);
}
function initSheet() {
  const sheet = document.getElementById('talleSheet');
  if (!sheet) return;
  sheet.addEventListener('click', e => {
    if (e.target.closest('[data-sheet-cerrar]')) { cerrarCapa(sheet); return; }
    if (!e.target.closest('[data-sheet-ok]') || !sheetEstado) return;
    const p = getProducto(sheetEstado.id);
    const cont = sheet.querySelector('.sh');
    const r = leerOpciones(cont, p);
    if (r.error) { mostrarError(cont.querySelector('[data-sheet-error]'), r); return; }
    const n = Cart.add(p, r, 1);
    const { modo, previo } = sheetEstado;
    if (modo === 'comprar') {
      cerrarCapa(sheet, { devolverFoco: false });
      window.abrirCarrito?.(previo);
      return;
    }
    cerrarCapa(sheet);
    avisoSumado(p, r, n);
    if (previo && !reduceMotion) { previo.classList.remove('sumado'); void previo.offsetWidth; previo.classList.add('sumado'); }
  });
  sheet.addEventListener('change', e => {
    if (e.target.matches('input[type="radio"]')) { const er = sheet.querySelector('[data-sheet-error]'); if (er) er.hidden = true; }
  });
}

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('#quickView') || e.target.closest('#talleSheet')) return;
    const s = e.target.closest('[data-elegir]');
    const c = e.target.closest('[data-elegir-comprar]');
    if (s || c) {
      e.preventDefault();
      abrirSheet(s ? s.dataset.elegir : c.dataset.elegirComprar, s ? 'agregar' : 'comprar', s || c);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      e.preventDefault();
      abrirVistaRapida(qv.dataset.qv, { previo: qv });
    }
  });
}

let qvEstado = null;
function relacionados(p) {
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  return rel;
}
function qvHTML(p) {
  const rel = relacionados(p);
  const c = catDe(p.cat);
  const fotos = [p.img, ...(p.imgs || [])];
  const thumbs = fotos.length > 1 ? `<div class="qv__thumbs">${fotos.map((f, i) => `<button type="button" data-qv-thumb="${esc(f)}" aria-pressed="${i === 0}" aria-label="Ver la foto ${i + 1}"><img src="${esc(f)}" alt="" width="900" height="900"></button>`).join('')}</div>` : '';
  return `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media">
    <figure class="qv__foto"><img data-qv-img src="${esc(p.img)}" alt="${esc(p.alt)}" width="900" height="900"></figure>
    ${thumbs}
    ${p.ilustrativa ? '<p class="qv__nota-foto">Foto ilustrativa</p>' : ''}
  </div>
  <div class="qv__info">
    <p class="qv__cat">${esc(c.titulo)}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="qv__nota">${esc(p.nota)}</p>
    ${precioHTML(p)}
    ${opcionesHTML(p, 'qv')}
    <p class="opciones__error" data-qv-error role="alert" hidden></p>
    <div class="qv__acciones">${stepperHTML(1)}<button type="button" class="btn btn--cta prod-add" data-qv-agregar>${ICO.carrito}<span>Agregar al carrito</span></button></div>
    <button type="button" class="btn btn--ghost btn--block" data-qv-comprar>Comprar ahora ${ICO.flecha}</button>
    <p class="qv__desc">${esc(p.desc)}</p>
    <ul class="qv__incluye">${(p.ficha || []).map(t => `<li>${ICO.check}<span>${esc(t)}</span></li>`).join('')}</ul>
    <a class="qv__wsp" href="${esc(wspHref(`Hola! Tengo una duda con el talle de «${p.nombre}» en ${MARCA}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>¿Dudas con el talle? Preguntanos</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede gustar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="900" height="900"><span>${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
}
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  qvEstado = { id: p.id };
  modal.querySelector('[data-qv-body]').innerHTML = qvHTML(p);
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
  modal.addEventListener('change', e => {
    if (e.target.matches('input[type="radio"]')) { const er = modal.querySelector('[data-qv-error]'); if (er) er.hidden = true; }
  });
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const cont = modal.querySelector('.qv__grid');
    const thumb = e.target.closest('[data-qv-thumb]');
    if (thumb) {
      cont.querySelector('[data-qv-img]').src = thumb.dataset.qvThumb;
      cont.querySelectorAll('[data-qv-thumb]').forEach(b => b.setAttribute('aria-pressed', String(b === thumb)));
      return;
    }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const out = cont.querySelector('[data-qty]');
      out.textContent = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso), TOPE_LINEA));
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const r = leerOpciones(cont, p);
      if (r.error) { mostrarError(cont.querySelector('[data-qv-error]'), r); return; }
      const qty = parseInt(cont.querySelector('[data-qty]')?.textContent, 10) || 1;
      const n = Cart.add(p, r, qty);
      cont.querySelector('[data-qty]').textContent = '1';
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else avisoSumado(p, r, n);
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, sku: p.id,
    image: new URL(p.img, location.href).href, category: catDe(p.cat).titulo, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: MARCA } },
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
  const cat = (params.get('cat') || '').split(',').filter(id => CATEGORIAS.some(c => c.id === id));
  const otros = ['talle', 'tono', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: c.id });
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="800" height="1000"><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><em>${plural(n, c.uno, c.varios)}</em></a></li>`;
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

function initRail() {
  const cont = document.querySelector('[data-rail]');
  if (!cont) return;
  cont.innerHTML = Tienda.consultar({ filtros: { cat: 'conjuntos' }, limite: 8 }).items.map(p => cardHTML(p, { anim: 'der' })).join('');
}

function initTalleGrid() {
  const grid = document.querySelector('[data-talle-grid]');
  if (!grid) return;
  const link = document.querySelector('[data-talle-link]');
  const txt = link?.querySelector('span');
  const tabs = [...document.querySelectorAll('[data-talle-tab]')];
  const pintar = (t, revelar) => {
    const f = { cat: 'conjuntos' };
    if (t) f.talle = t;
    grid.innerHTML = Tienda.consultar({ filtros: f, limite: 8 }).items.map(p => cardHTML(p)).join('');
    const n = Tienda.contar(f);
    if (link) link.href = `${CATALOGO_URL}?cat=conjuntos${t ? `&talle=${t}` : ''}`;
    if (txt) txt.textContent = t ? `Ver los ${n} conjuntos en talle ${talleNombre(t)}` : 'Ver todos los conjuntos';
    if (revelar) revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach(b => b.addEventListener('click', () => {
    tabs.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    pintar(b.dataset.talleTab, true);
  }));
  pintar('', false);
}

function initPacks() {
  const ul = document.querySelector('[data-packs]');
  if (!ul) return;
  ul.innerHTML = Tienda.consultar({ filtros: { cat: 'packs' }, limite: 4 }).items.map(p => `<li${ANIMS.subir24}><button type="button" class="pk__btn" data-qv="${esc(p.id)}"><img src="${esc(p.img)}" alt="" width="900" height="900"><span><b>${esc(p.nombre)}</b><small>${esc(`${tallesTexto(p)} · ${p.nota}`)}</small></span><em>${formatearPrecio(precioFinal(p))}</em>${ICO.flecha}</button></li>`).join('');
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
  document.querySelectorAll('[data-rail-vp]').forEach(vp => {
    initRailDrag(vp);
    const sec = vp.closest('section');
    const prev = sec?.querySelector('[data-rail-prev]');
    const next = sec?.querySelector('[data-rail-next]');
    const track = vp.querySelector('.rail-track');
    if (!prev || !next || !track) return;
    const paso = () => {
      const card = track.firstElementChild;
      const gap = parseFloat(window.getComputedStyle(track).columnGap) || 20;
      const w = card ? card.getBoundingClientRect().width + gap : vp.clientWidth * 0.8;
      return w * Math.max(1, Math.floor(vp.clientWidth / w) - 1);
    };
    const sync = () => {
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      prev.disabled = vp.scrollLeft <= inicio + 2;
      next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    prev.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  });
}

function initMapa() {
  document.querySelectorAll('[data-mapa]').forEach(el => {
    if (typeof L === 'undefined') { el.classList.add('mapa--sin'); return; }
    const centro = [-27.4874, -55.1229];
    const mapa = L.map(el, { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView(centro, 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    const icono = L.divIcon({ className: 'pin-logo', html: '<img src="images/logo-valky.webp" alt="" width="58" height="58">', iconSize: [58, 58], iconAnchor: [29, 29] });
    L.marker(centro, { icon: icono, keyboard: false, title: `${MARCA}, 9 de Julio 1087` }).addTo(mapa);
    const ancho = window.matchMedia('(min-width: 901px)');
    const centrar = () => {
      mapa.invalidateSize();
      mapa.setView(centro, 16, { animate: false });
      if (MODELO === '2' && ancho.matches) {
        const card = document.querySelector('.ubic__texto');
        const w = card ? card.getBoundingClientRect().width : 0;
        mapa.panBy([-(w / 2 + 14), 0], { animate: false });
      }
    };
    window.addEventListener('load', centrar);
    ancho.addEventListener('change', centrar);
    centrar();
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
  const migaSep = document.querySelector('[data-miga-sep]');
  const params = new URLSearchParams(location.search);
  const GRUPOS = { cat: CATEGORIAS, talle: TALLES, tono: TONOS, precio: PRECIOS };
  const valida = (arr, lista) => [...new Set((arr || '').toLowerCase().split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    talle: valida(params.get('talle'), TALLES),
    tono: valida(params.get('tono'), TONOS),
    precio: valida(params.get('precio'), PRECIOS),
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
  const opcion = (grupo, item, marcado, n) => (grupo === 'talle'
    ? `<label class="op-talle${n ? '' : ' is-cero'}"><input type="checkbox" data-f="talle" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span></label>`
    : `<label class="opcion${n ? '' : ' is-cero'}"><input type="checkbox" data-f="${grupo}" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`);
  function pintarFiltros() {
    Object.keys(GRUPOS).forEach(k => {
      const box = document.querySelector(`[data-f-${k}]`);
      if (!box) return;
      box.innerHTML = GRUPOS[k].map(it => opcion(k, it, e[k].includes(it.id), Tienda.contar({ ...filtros(k), [k]: it.id }))).join('');
    });
  }
  function tituloActual() {
    const solo = k => e[k].length === 1 && Object.keys(GRUPOS).every(g => g === k || !e[g].length);
    if (solo('cat')) return CATEGORIAS.find(x => x.id === e.cat[0])?.titulo || '';
    if (solo('talle')) return `Talle ${talleNombre(e.talle[0])}`;
    if (solo('tono')) return TONOS.find(x => x.id === e.tono[0])?.nombre || '';
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...Object.keys(GRUPOS).flatMap(k => e[k].map(id => ({ k, id, t: k === 'talle' ? `Talle ${talleNombre(id)}` : nombreDe(GRUPOS[k], id) }))),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + e[k].length, 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Todo el catálogo';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Catálogo'} — ${MARCA}`;
    document.querySelectorAll('[data-cats-menu] a').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (e.cat.length === 1 && e.cat[0] === id && t && Object.keys(GRUPOS).every(g => g === 'cat' || !e[g].length)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
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
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, { anim: 'subir' })).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = Tienda.contar(f);
    contador.innerHTML = `${total} <small>${total === 1 ? 'producto' : 'productos'}${e.q ? ` para «${esc(e.q)}»` : ''}</small>`;
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
    e[g] = [...document.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
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

function initProductoUrl() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) setTimeout(() => abrirVistaRapida(id), 80);
  else if (id) setParam('producto', null);
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
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desdeA = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desdeA('[data-hero-img]', { scale: 1.09, duration: 1.8 }, 0);
  desdeA('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  desdeA('.hero-eyebrow .lazo path', { strokeDashoffset: 60, duration: 1.4, stagger: 0.08, ease: 'power2.out' }, 0.2);
  desdeA('h1', { y: 34, opacity: 0, filter: 'blur(8px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  desdeA('.hero__regla', { scaleX: 0, duration: 1.1, clearProps: 'transform' }, 0.45);
  desdeA('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.45);
  desdeA('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  desdeA('.hero__sello', { scale: 0.92, opacity: 0, rotate: -10, duration: 1.2, clearProps: 'transform,opacity' }, 0.7);
  desdeA('.hero__talles-t, .hero__fila > span', { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75);
  desdeA('.chip-talle', { y: 12, opacity: 0, duration: 0.7, stagger: 0.035, clearProps: 'transform,opacity' }, 0.8);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.hero__foto img, .hero2__arco img').forEach(el => {
    gsap.to(el, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
  });
}

[initRail, initTalleGrid, initPacks, initMenuCategorias, initCatalogo, initReveals, initHeroMotion, initParallax, initRails, initMapa,
  initNav, initDrawer, initVistaRapida, initSheet, initCompras, initFloats, initModelBarScroll, initProductoUrl].forEach(fn => {
  try { fn(); } catch (err) { console.error(err); }
});
Cart.sync();
updateCartBadge();
