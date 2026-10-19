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

const WSP = '5491128262007';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;

const CATEGORIAS = [
  { id: 'remeras', nombre: 'Remeras', bajada: 'Manga corta y manga larga, con diseños de Smash o con tu idea.', img: 'images/p-remera.webp' },
  { id: 'buzos', nombre: 'Buzos', bajada: 'Buzos de frisa estampados, listos o con tu diseño.', img: 'images/p-buzo.webp' },
  { id: 'bolsas', nombre: 'Bolsas', bajada: 'Tote bags de lienzo y bolsas de friselina con tu logo.', img: 'images/p-tote.webp' },
  { id: 'mochilas', nombre: 'Mochilas y riñoneras', bajada: 'Para llevar la estampa a todos lados.', img: 'images/p-mochila.webp' },
  { id: 'tazas', nombre: 'Tazas', bajada: 'Tazas estampadas para regalar o para tu marca.', img: 'images/p-taza.webp' },
  { id: 'gorras', nombre: 'Gorras', bajada: 'Gorras de gabardina con estampa al frente.', img: 'images/p-gorra.webp' },
  { id: 'cajas', nombre: 'Cajas para emprendimientos', bajada: 'Cajas de cartón kraft con tu logo, en tres medidas.', img: 'images/p-cajas.webp' },
];
const TIPOS = { listo: 'Diseños Smash', idea: 'Con tu idea' };
const RANGOS = {
  hasta15: { nombre: 'Menos de $15.000', max: 14999 },
  '15a30': { nombre: '$15.000 a $30.000', min: 15000, max: 30000 },
  mas30: { nombre: 'Más de $30.000', min: 30001 },
};
const ORDENES = { destacados: 'Destacados', nuevos: 'Recién estampados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const TITULO_VAR = { Talle: 'Elegí el talle', Material: 'Elegí la bolsa', Medida: 'Elegí la medida' };
const TINTA = { petroleo: '#2F6E73', naranja: '#C8703A', crema: '#E6DCC6', terracota: '#B4583A', profundo: '#1F5A5C' };
const TALLES = ['S', 'M', 'L', 'XL', 'XXL'];
const talles = (precio, escala) => TALLES.map(v => ({ v, precio, ...(escala ? { escala } : {}) }));
const NOTA_IDEA = 'Cuando nos mandes el pedido, pasanos tu diseño o tu logo por WhatsApp. El precio es para una estampa a un color: si tu diseño lleva más colores, te lo confirmamos al cotizar.';

const PRODUCTOS = [
  { id: 'remera-formas', nombre: 'Remera Formas, algodón crudo', cat: 'remeras', tipo: 'listo', var: 'Talle', ops: talles(21900), tintas: ['petroleo'], descuento: 0, stock: 14, rango: 1, alta: 14,
    img: 'images/p-remera.webp', alt: 'Remera de algodón crudo colgada en una percha de madera, con formas geométricas estampadas en verde petróleo',
    desc: 'Remera de algodón color crudo con la estampa Formas en verde petróleo: un sol, medias lunas y arcos, a un color. La tinta al agua se absorbe en la tela y queda suave al tacto.',
    tags: ['geometrica', 'crudo', 'verde', 'manga corta', 'algodon'] },
  { id: 'remera-olas', nombre: 'Remera manga larga Olas', cat: 'remeras', tipo: 'listo', var: 'Talle', ops: talles(26900), tintas: ['naranja'], descuento: 0, stock: 9, rango: 4, alta: 13,
    img: 'images/p-remera-olas.webp', alt: 'Remera gris de manga larga estirada sobre fondo crema, con ondas anchas estampadas en naranja',
    desc: 'Manga larga gris jaspeada con cuatro ondas anchas en naranja que cruzan el frente de lado a lado. Puños y cuello con rib.',
    tags: ['ondas', 'naranja', 'gris', 'manga larga', 'algodon'] },
  { id: 'buzo-laberinto', nombre: 'Buzo Laberinto azul marino', cat: 'buzos', tipo: 'listo', var: 'Talle', ops: talles(44900), tintas: ['crema'], descuento: 0, stock: 6, rango: 2, alta: 12,
    img: 'images/p-buzo.webp', alt: 'Buzo azul marino doblado con una forma orgánica grande estampada en color crema',
    desc: 'Buzo de frisa azul marino, cuello redondo, con la estampa Laberinto en crema: una forma orgánica grande que ocupa todo el frente.',
    tags: ['buzo', 'frisa', 'azul', 'marino', 'organico', 'abrigo'] },
  { id: 'tote-sol', nombre: 'Tote bag Sol de lienzo', cat: 'bolsas', tipo: 'listo', var: null, ops: [{ v: 'Unidad', precio: 13900 }], tintas: ['naranja'], descuento: 0, stock: 18, rango: 3, alta: 11,
    img: 'images/p-tote.webp', alt: 'Bolsa tote de lienzo crudo apoyada en una mesa, con un círculo naranja grande estampado',
    desc: 'Tote bag de lienzo crudo con manijas largas para llevar al hombro y un sol naranja estampado a un color. Entra una notebook, el mate y lo que haga falta.',
    tags: ['tote', 'bolsa', 'lienzo', 'naranja', 'sol', 'circulo'] },
  { id: 'taza-medialunas', nombre: 'Taza Medialunas', cat: 'tazas', tipo: 'listo', var: null, ops: [{ v: 'Taza 330 ml', precio: 11900 }], tintas: ['petroleo', 'naranja'], descuento: 0, stock: 20, rango: 5, alta: 10,
    img: 'images/p-taza.webp', alt: 'Taza de cerámica crema con medias lunas en verde petróleo y círculos naranjas',
    desc: 'Taza de cerámica color crema con medias lunas en verde petróleo y naranja, a dos colores. Para el café de todos los días o para regalar.',
    tags: ['taza', 'ceramica', 'regalo', 'cafe', 'geometrica'] },
  { id: 'rinonera-totem', nombre: 'Riñonera Tótem', cat: 'mochilas', tipo: 'listo', var: null, ops: [{ v: 'Unidad', precio: 19900 }], tintas: ['terracota', 'naranja'], descuento: 0, stock: 3, rango: 6, alta: 9,
    img: 'images/p-rinonera.webp', alt: 'Riñonera negra con cierre y una pequeña figura de círculo, media luna y triángulo estampada en tonos naranja',
    desc: 'Riñonera negra con bolsillo principal con cierre, tira regulable con hebilla y el tótem de Smash estampado en terracota y naranja.',
    tags: ['rinonera', 'negra', 'cintura', 'totem', 'accesorio'] },
  { id: 'mochila-ramas', nombre: 'Mochila Ramas de lienzo', cat: 'mochilas', tipo: 'listo', var: null, ops: [{ v: 'Unidad', precio: 36900 }], tintas: ['petroleo'], descuento: 0, stock: 5, rango: 7, alta: 8,
    img: 'images/p-mochila.webp', alt: 'Mochila de lienzo crudo con solapa y hebilla, con ramas de hojas estampadas en verde petróleo',
    desc: 'Mochila de lienzo crudo con solapa, hebilla y bolsillo delantero. Lleva ramas de hojas estampadas en verde petróleo sobre la tapa y el bolsillo.',
    tags: ['mochila', 'lienzo', 'hojas', 'ramas', 'verde', 'botanica'] },
  { id: 'gorra-equilibrio', nombre: 'Gorra Equilibrio', cat: 'gorras', tipo: 'listo', var: null, ops: [{ v: 'Talle único', precio: 15900 }], tintas: ['profundo'], descuento: 0, stock: 11, rango: 8, alta: 7,
    img: 'images/p-gorra.webp', alt: 'Gorra blanca de gabardina con un círculo y una media luna estampados en verde petróleo al frente',
    desc: 'Gorra de gabardina blanca de seis paneles, con regulador atrás. Al frente, la figura Equilibrio: un círculo sobre una media luna, en verde petróleo.',
    tags: ['gorra', 'blanca', 'visera', 'cap', 'regulable'] },
  { id: 'remera-tu-diseno', nombre: 'Remera con tu diseño', cat: 'remeras', tipo: 'idea', var: 'Talle', ops: talles(24900, [[12, 18900], [50, 14900]]), tintas: ['tu'], descuento: 0, aPedido: true, alta: 6,
    img: 'images/p-remera-detalle.webp', alt: 'Detalle de una estampa geométrica en verde petróleo sobre una remera cruda, como ejemplo de estampa a un color',
    desc: 'Remera de algodón con tu dibujo, tu frase o el logo de tu marca, estampada con tinta al agua. Podés mezclar talles: el precio por cantidad se calcula con el total de remeras.',
    tags: ['personalizada', 'logo', 'equipo', 'evento', 'egresados', 'marca', 'algodon'] },
  { id: 'buzo-tu-diseno', nombre: 'Buzo con tu diseño', cat: 'buzos', tipo: 'idea', var: 'Talle', ops: talles(46900, [[12, 39900], [50, 34900]]), tintas: ['tu'], descuento: 0, aPedido: true, alta: 5,
    img: 'images/p-buzo-detalle.webp', alt: 'Detalle de una estampa crema sobre un buzo azul marino, como ejemplo de estampa a un color',
    desc: 'Buzo de frisa con tu diseño en el frente. Ideal para equipos, egresados o tu marca de ropa. Podés mezclar talles en el mismo pedido.',
    tags: ['personalizado', 'buzo', 'frisa', 'egresados', 'equipo', 'marca', 'logo'] },
  { id: 'bolsas-logo', nombre: 'Bolsas con tu logo', cat: 'bolsas', tipo: 'idea', var: 'Material', ops: [{ v: 'Friselina 30×40 cm', precio: 3900, escala: [[50, 2400], [200, 1700]] }, { v: 'Lienzo 35×40 cm', precio: 9900, escala: [[50, 7400], [200, 6200]] }], tintas: ['tu'], descuento: 0, aPedido: true, alta: 4,
    img: 'images/p-bolsa-detalle.webp', alt: 'Detalle de una bolsa de lienzo con un círculo naranja estampado y la manija cruzando adelante',
    desc: 'Bolsas para tu emprendimiento con tu logo estampado: de friselina, livianas y económicas, o de lienzo, para que tu clienta la siga usando. La foto muestra la de lienzo.',
    tags: ['friselina', 'lienzo', 'packaging', 'emprendimiento', 'logo', 'tote', 'negocio'] },
  { id: 'taza-tu-diseno', nombre: 'Taza con tu diseño', cat: 'tazas', tipo: 'idea', var: null, ops: [{ v: 'Taza 330 ml', precio: 13900, escala: [[12, 10900], [50, 8900]] }], tintas: ['tu'], descuento: 0, aPedido: true, alta: 3,
    img: 'images/p-taza-detalle.webp', alt: 'Detalle de una taza crema con formas estampadas en verde petróleo y naranja',
    desc: 'Taza de cerámica con tu diseño, tu frase o tu logo. Para regalos, eventos o para tu marca.',
    tags: ['taza', 'regalo', 'personalizada', 'evento', 'logo', 'ceramica'] },
  { id: 'cajas-logo', nombre: 'Cajas de cartón con tu logo', cat: 'cajas', tipo: 'idea', var: 'Medida', ops: [{ v: 'Chica 15×15×15 cm', precio: 2900, escala: [[50, 1900], [200, 1400]] }, { v: 'Mediana 20×20×20 cm', precio: 3600, escala: [[50, 2400], [200, 1800]] }, { v: 'Grande 30×30×30 cm', precio: 4900, escala: [[50, 3400], [200, 2600]] }], tintas: ['tu'], descuento: 0, aPedido: true, alta: 2,
    img: 'images/p-cajas.webp', alt: 'Caja de cartón kraft cerrada con círculos y medias lunas grandes estampados en verde petróleo',
    desc: 'Cajas de cartón kraft para enviar o regalar, con tu logo estampado en la tapa y los lados. Llegan armables, en tres medidas.',
    tags: ['caja', 'carton', 'kraft', 'packaging', 'envio', 'emprendimiento', 'logo'] },
  { id: 'gorra-tu-logo', nombre: 'Gorra con tu logo', cat: 'gorras', tipo: 'idea', var: null, ops: [{ v: 'Talle único', precio: 17900, escala: [[12, 13900], [50, 11400]] }], tintas: ['tu'], descuento: 0, aPedido: true, alta: 1,
    img: 'images/p-gorra-detalle.webp', alt: 'Detalle de una gorra blanca con un círculo y una media luna estampados en verde petróleo',
    desc: 'Gorra de gabardina con tu logo al frente, regulable. Para equipos, eventos o el uniforme de tu local.',
    tags: ['gorra', 'logo', 'equipo', 'uniforme', 'personalizada'] },
  { id: 'rinonera-tu-logo', nombre: 'Riñonera con tu logo', cat: 'mochilas', tipo: 'idea', var: null, ops: [{ v: 'Unidad', precio: 1 }], tintas: ['tu'], descuento: 0, aPedido: true, alta: 15, visible: false,
    img: 'images/p-rinonera.webp', alt: 'Próximamente', desc: 'Próximamente.', tags: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const catDe = id => CATEGORIAS.find(c => c.id === id);
const precioOp = (p, op, n = 1) => {
  let pr = op.precio;
  (op.escala || []).forEach(([desde, valor]) => { if (n >= desde) pr = valor; });
  return p.descuento > 0 ? Math.round(pr * (1 - p.descuento / 100)) : pr;
};
const precioDesde = p => Math.min(...p.ops.map(op => precioOp(p, op)));
const precioMinimo = p => Math.min(...p.ops.map(op => precioOp(p, op, 1e9)));
const escalones = (p, op) => {
  const pasos = [[1, op.precio], ...(op.escala || [])];
  return pasos.map(([desde, valor], i) => ({ desde, hasta: pasos[i + 1] ? pasos[i + 1][0] - 1 : null, precio: p.descuento > 0 ? Math.round(valor * (1 - p.descuento / 100)) : valor }));
};
const rotuloEscalon = e => (e.hasta == null ? `${e.desde} o más` : e.desde === e.hasta ? `${e.desde} u` : `${e.desde} a ${e.hasta} u`);

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const desde = p => Math.min(...p.ops.map(op => (p.descuento > 0 ? Math.round(op.precio * (1 - p.descuento / 100)) : op.precio)));
  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (f.tipo && p.tipo !== f.tipo) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.stock && !(p.aPedido || p.stock > 0)) return false;
    if (f.precioMin != null && desde(p) < f.precioMin) return false;
    if (f.precioMax != null && desde(p) > f.precioMax) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => desde(a) - desde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => desde(b) - desde(a) || desempate(a, b);
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
    const cat = catDe(p.cat);
    textoBusqueda.set(p.id, norm([
      p.nombre, cat?.nombre, p.desc, TIPOS[p.tipo], p.tipo === 'idea' ? 'personalizado personalizada a pedido con tu idea diseno propio' : 'diseno smash listo estampado',
      ...p.ops.map(op => op.v), ...(p.tags || []),
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const tokensBusqueda = new Map();
function tokensDe(p) {
  if (!tokensBusqueda.has(p.id)) tokensBusqueda.set(p.id, new Set(textoDe(p).split(/[^a-z0-9×]+/).filter(Boolean)));
  return tokensBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => (w.length <= 2 ? tokensDe(p).has(w) : textoDe(p).includes(w)));

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
const opDe = (p, v) => p.ops.find(op => op.v === v) || p.ops[0];
const maxDe = p => (p.aPedido ? 999 : p.stock ?? 99);

const Cart = {
  KEY: 'smash_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { console.warn(e); } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = null) {
    const items = this.get();
    const variante = v ?? producto.ops[0].v;
    const max = maxDe(producto);
    const existing = items.find(i => i.id === producto.id && i.v === variante);
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, v: variante, qty: Math.min(qty, max) });
    this.save(items);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.v === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p ? maxDe(p) : 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  unidadesDe(id) { return this.get().filter(i => i.id === id).reduce((s, i) => s + i.qty, 0); },
  unitario(i) { const p = getProducto(i.id); return p ? precioOp(p, opDe(p, i.v), this.unidadesDe(i.id)) : 0; },
  total() { return this.get().reduce((s, i) => s + this.unitario(i) * i.qty, 0); },
};

const ICO = {
  flecha: '<svg class="ico ico--flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  info: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  pincel: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m14.6 3.4 6 6"/><path d="M18 6.8 9.2 15.6"/><path d="M8.6 15.4a3 3 0 0 0-4.2 0c-1 1-1 3.4-2.4 4.6 2.4.6 5 .4 6.6-1.2a3 3 0 0 0 0-3.4Z"/><path d="m13.2 4.8 6 6"/></svg>',
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

const tintasHTML = p => `<span class="tintas" aria-hidden="true">${(p.tintas || []).map(t => (t === 'tu' ? '<i class="tu"></i>' : `<i style="background:${TINTA[t] || '#264653'}"></i>`)).join('')}</span>`;
const metaDe = p => (p.tipo === 'idea' ? `Con tu idea · ${catDe(p.cat)?.nombre || ''}` : catDe(p.cat)?.nombre || '');
const coloresDe = p => (p.tipo === 'idea' ? 'Tu diseño' : `Tinta al agua · ${p.tintas.length === 1 ? '1 color' : `${p.tintas.length} colores`}`);

function cardHTML(p, { anim = true } = {}) {
  const varias = p.ops.length > 1 && new Set(p.ops.map(op => op.precio)).size > 1;
  let tag = '';
  if (p.tipo === 'idea') tag = '<span class="pcard__tag pcard__tag--idea">Con tu idea</span>';
  else if (p.stock > 0 && p.stock <= 3) tag = '<span class="pcard__tag pcard__tag--poco">Últimas unidades</span>';
  else if (p.rango && p.rango <= 3) tag = '<span class="pcard__tag">Recién estampado</span>';
  const sinStock = !(p.aPedido || p.stock > 0);
  const tope = p.ops[0].escala?.at(-1)?.[0];
  const escala = p.ops.some(op => op.escala) ? `<p class="pcard__escala"><span class="esc-largo">Por cantidad, desde</span><span class="esc-corto">${tope}+ u:</span> ${formatearPrecio(precioMinimo(p))} c/u</p>` : '';
  return `<article class="pcard" data-id="${esc(p.id)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : ''}>
  <div class="pcard__media">
    <div class="pcard__foto" data-quick="${esc(p.id)}"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="800"></div>
    ${tag}
    <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}"${sinStock ? ' disabled' : ''}>Comprar ahora</button>
  </div>
  <div class="pcard__info">
    <p class="pcard__meta">${tintasHTML(p)}<span>${esc(metaDe(p))}</span></p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    <p class="pcard__precio">${varias ? '<small class="desde">desde</small>' : ''}<span>${formatearPrecio(precioDesde(p))}</span></p>
    ${escala}
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
    lista.innerHTML = CATEGORIAS.map(c => `<li><a href="${URL_CATALOGO}?cat=${c.id}"${c.id === catActual ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="40" height="40"><span>${esc(c.nombre)}</span><span class="nav-cats__n">${Tienda.contar({ cat: c.id })}</span></a></li>`).join('');
    lista.querySelectorAll('a').forEach(a => a.addEventListener('click', () => cerrar()));
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
  const { items } = Tienda.consultar({ filtros: { destacado: true, tipo: 'listo' }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  track.innerHTML = items.map(p => `<div class="rail-item"><div class="rail-in" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { anim: false })}</div></div>`).join('');
  const vp = track.closest('[data-rail]');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 18;
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

function initPerso() {
  const grid = document.querySelector('[data-perso-grid]');
  if (!grid) return;
  const { items } = Tienda.consultar({ filtros: { tipo: 'idea' }, orden: 'nuevos', limite: 6 });
  items.forEach(cachear);
  grid.innerHTML = items.map(p => cardHTML(p)).join('');
}

function initMosaico() {
  const grid = document.querySelector('[data-mosaico]');
  if (!grid) return;
  const { items } = Tienda.consultar({ filtros: { destacado: true, tipo: 'listo' }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  const total = Tienda.contar({});
  grid.innerHTML = items.map(p => cardHTML(p)).join('') + `<div data-animate="subir" style="opacity:0;transform:translateY(44px)"><a class="mosaico__todo" href="${URL_CATALOGO}"><b>${total}</b><span>productos para estampar o llevar listos</span><span class="link-flecha">Ver todo el catálogo${ICO.flecha}</span></a></div>`;
}

function initListaCantidad() {
  const box = document.querySelector('[data-lista-cant]');
  if (!box) return;
  const { items } = Tienda.consultar({ filtros: { tipo: 'idea' }, orden: 'nuevos', limite: 6 });
  items.forEach(cachear);
  box.innerHTML = items.map(p => {
    const e = escalones(p, p.ops[0]);
    const celda = (x, cls = '') => (x ? `<p class="lista-cant__p${cls}"><small>${esc(rotuloEscalon(x))}: </small>${formatearPrecio(x.precio)}${x.desde > 1 ? '<small> c/u</small>' : ''}</p>` : '<p class="lista-cant__p">—</p>');
    const sub = p.var === 'Talle' ? `Talles ${p.ops[0].v} a ${p.ops[p.ops.length - 1].v}` : p.ops.length > 1 ? `${p.ops.length} ${p.var === 'Medida' ? 'medidas' : 'opciones'} · precios de ${p.ops[0].v.toLowerCase()}` : p.ops[0].v;
    return `<div class="lista-cant__fila" data-animate="subir" style="opacity:0;transform:translateY(24px)">
      <img src="${esc(p.img)}" alt="" width="64" height="64">
      <div class="lista-cant__nom"><button type="button" data-quick="${esc(p.id)}">${esc(p.nombre)}</button><small>${esc(sub)}</small></div>
      ${celda(e[0])}${celda(e[1])}${celda(e[2], ' p-desde')}
      <button type="button" class="btn btn--ghost" data-quick="${esc(p.id)}">Cotizar</button>
    </div>`;
  }).join('');
}

function initCuentas() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
    if (el.closest('[data-cat-opciones]')) return;
    const n = Tienda.contar({ cat: el.dataset.cuentaCat });
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
  document.querySelectorAll('[data-cuenta-total]').forEach(el => { el.textContent = String(Tienda.contar({})); });
}

function cerrarPickers(excepto) {
  document.querySelectorAll('.picker').forEach(pk => { if (pk !== excepto) pk.remove(); });
}
function abrirPicker(card, p, modo) {
  cerrarPickers();
  const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
  const tit = TITULO_VAR[p.var] || 'Elegí una opción';
  const pk = document.createElement('div');
  pk.className = 'picker';
  pk.setAttribute('role', 'dialog');
  pk.setAttribute('aria-label', tit);
  pk.dataset.modo = modo;
  pk.dataset.qty = String(qty);
  const mismoPrecio = new Set(p.ops.map(op => op.precio)).size === 1;
  pk.innerHTML = `<div class="picker__head"><p class="picker__tit">${esc(tit)}</p><button type="button" class="picker__cerrar" data-picker-cerrar aria-label="Cerrar">${ICO.x}</button></div>
    <div class="picker__ops">${p.ops.map((op, i) => `<button type="button" class="picker__op" data-picker-op="${i}"><span>${esc(op.v.replace(/ cm$/, ''))}</span>${mismoPrecio ? '' : `<small>${formatearPrecio(precioOp(p, op))}</small>`}</button>`).join('')}</div>
    ${qty > 1 ? `<p class="picker__nota">Vas a sumar ${qty} unidades.</p>` : ''}`;
  card.appendChild(pk);
  pk.querySelector('.picker__op')?.focus();
}

function sumarAlCarrito(p, qty, v, comprar) {
  Cart.add(p, qty, v);
  const op = opDe(p, v);
  const detalle = p.ops.length > 1 ? ` (${op.v})` : '';
  if (comprar) abrirCarrito();
  else showToast(`Sumaste ${qty > 1 ? qty + ' × ' : ''}${p.nombre}${detalle} al carrito`);
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) {
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
      const max = p ? maxDe(p) : 99;
      n.textContent = String(Math.max(1, Math.min(max, (parseInt(n.textContent, 10) || 1) + Number(step.dataset.step))));
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add) {
      const card = add.closest('.pcard');
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p || !card) return;
      const comprar = add.hasAttribute('data-comprar');
      if (p.ops.length > 1) { abrirPicker(card, p, comprar ? 'comprar' : 'agregar'); return; }
      const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
      sumarAlCarrito(p, qty, p.ops[0].v, comprar);
      return;
    }
    const opBtn = e.target.closest('[data-picker-op]');
    if (opBtn) {
      const pk = opBtn.closest('.picker');
      const card = opBtn.closest('.pcard');
      const p = getProducto(card?.dataset.id);
      if (!p || !pk) return;
      const op = p.ops[Number(opBtn.dataset.pickerOp)] || p.ops[0];
      sumarAlCarrito(p, parseInt(pk.dataset.qty, 10) || 1, op.v, pk.dataset.modo === 'comprar');
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

let ultimoFoco = null;
function atraparFoco(panel, e) {
  if (e.key !== 'Tab') return;
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

const qvEstado = { p: null, op: 0, qty: 1 };
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  cerrarPickers();
  qvEstado.p = p; qvEstado.op = 0; qvEstado.qty = 1;
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
    brand: { '@type': 'Brand', name: 'Smash' },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: precioMinimo(p), highPrice: Math.max(...p.ops.map(op => precioOp(p, op))), availability: p.aPedido ? 'https://schema.org/PreOrder' : p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function pintarResumenQV() {
  const qv = document.getElementById('qv');
  const p = qvEstado.p;
  if (!qv || !p) return;
  const op = p.ops[qvEstado.op];
  const enCarrito = Cart.unidadesDe(p.id);
  const n = qvEstado.qty + (p.ops.some(o => o.escala) ? enCarrito : 0);
  const unit = precioOp(p, op, n);
  const precio = qv.querySelector('[data-qv-precio]');
  if (precio) precio.textContent = formatearPrecio(unit);
  const total = qv.querySelector('[data-qv-total]');
  if (total) total.innerHTML = `${qvEstado.qty} × ${formatearPrecio(unit)} = <b>${formatearPrecio(unit * qvEstado.qty)}</b>${enCarrito && op.escala ? ` <span>(contamos las ${enCarrito} que ya tenés en el carrito)</span>` : ''}`;
  qv.querySelectorAll('[data-escalon]').forEach(li => {
    const d = Number(li.dataset.escalon), h = li.dataset.hasta ? Number(li.dataset.hasta) : Infinity;
    li.classList.toggle('activa', n >= d && n <= h);
  });
}
function pintarQV() {
  const p = qvEstado.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const op = p.ops[qvEstado.op];
  const tit = TITULO_VAR[p.var] || '';
  const { items: rel } = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 });
  let relacionados = rel;
  if (relacionados.length < 3) {
    const extra = Tienda.consultar({ filtros: { tipo: p.tipo, excluir: [p.id, ...rel.map(r => r.id)] }, orden: 'destacados', limite: 3 - rel.length }).items;
    relacionados = rel.concat(extra);
  }
  relacionados.forEach(cachear);
  const mismoPrecio = new Set(p.ops.map(o => o.precio)).size === 1;
  const stock = p.aPedido ? 'Se estampa a pedido' : p.stock > 3 ? 'En stock' : p.stock > 0 ? `Quedan ${p.stock}` : 'Sin stock por ahora';
  const variantes = p.ops.length > 1 ? `<div class="qv__var"><p class="qv__var-tit">${esc(tit)}</p><div class="qv__ops" role="radiogroup" aria-label="${esc(tit)}">${p.ops.map((o, i) => `<button type="button" class="qv__op" role="radio" aria-checked="${i === qvEstado.op}" data-qv-op="${i}"><span>${esc(o.v)}</span>${mismoPrecio ? '' : `<small>${formatearPrecio(precioOp(p, o))}</small>`}</button>`).join('')}</div></div>` : '';
  const escala = op.escala ? `<div class="qv__escala"><p class="qv__escala-tit">Precio por unidad según la cantidad</p><ol>${escalones(p, op).map(e => `<li data-escalon="${e.desde}"${e.hasta ? ` data-hasta="${e.hasta}"` : ''}><b>${formatearPrecio(e.precio)}</b>${esc(rotuloEscalon(e))}</li>`).join('')}</ol></div>` : '';
  const maxQ = maxDe(p);
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="800">${p.tipo === 'idea' ? '<span class="pcard__tag pcard__tag--idea">Con tu idea</span>' : ''}</div>
    <div class="qv__info">
      <p class="qv__meta">${tintasHTML(p)}<span>${esc(metaDe(p))} · ${esc(coloresDe(p))}</span></p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <p class="qv__precio"><span data-qv-precio>${formatearPrecio(precioOp(p, op))}</span>${op.escala ? '<small>c/u</small>' : ''}</p>
      ${variantes}
      ${escala}
      <div class="qv__acc">
        <div class="qv__cant"><button type="button" data-qv-step="-1" aria-label="Restar uno">${ICO.menos}</button><input type="number" inputmode="numeric" min="1" max="${maxQ}" value="${qvEstado.qty}" aria-label="Cantidad" data-qv-cant><button type="button" data-qv-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="btn btn--cta" data-qv-add${p.aPedido || p.stock > 0 ? '' : ' disabled'}>${ICO.carrito}Agregar al carrito</button>
      </div>
      <p class="qv__total" data-qv-total></p>
      <button type="button" class="btn btn--ghost" data-qv-comprar${p.aPedido || p.stock > 0 ? '' : ' disabled'}>Comprar ahora</button>
      <p class="qv__stock">${ICO.check}${esc(stock)} · confirmás el pedido por WhatsApp</p>
      <p class="qv__desc">${esc(p.desc)}</p>
      ${p.tipo === 'idea' ? `<p class="qv__nota">${ICO.pincel}<span>${esc(NOTA_IDEA)}</span></p>` : ''}
      <a class="qv__wsp" href="${wspLink(p.tipo === 'idea' ? `Hola Smash! Quiero cotizar: ${p.nombre}. Les cuento mi idea y la cantidad:` : `Hola Smash! Tengo una consulta sobre: ${p.nombre}`)}" target="_blank" rel="noopener">${ICO.wsp}${p.tipo === 'idea' ? 'Mandanos tu diseño por WhatsApp' : '¿Dudas con el talle? Preguntanos por WhatsApp'}</a>
      ${relacionados.length ? `<div class="qv__rel"><p class="qv__rel-tit">También te puede gustar</p><div class="qv__rel-grid">${relacionados.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><b>${formatearPrecio(precioDesde(r))}</b></button>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
  pintarResumenQV();
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
  const fijarCant = v => {
    const p = qvEstado.p;
    if (!p) return;
    qvEstado.qty = Math.max(1, Math.min(maxDe(p), parseInt(v, 10) || 1));
    const inp = qv.querySelector('[data-qv-cant]');
    if (inp && document.activeElement !== inp) inp.value = String(qvEstado.qty);
    pintarResumenQV();
  };
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const opBtn = e.target.closest('[data-qv-op]');
    if (opBtn) {
      qvEstado.op = Number(opBtn.dataset.qvOp);
      pintarQV();
      qv.querySelector(`[data-qv-op="${qvEstado.op}"]`)?.focus();
      return;
    }
    const step = e.target.closest('[data-qv-step]');
    if (step) { fijarCant(qvEstado.qty + Number(step.dataset.qvStep)); return; }
    const add = e.target.closest('[data-qv-add], [data-qv-comprar]');
    if (add && qvEstado.p) {
      const p = qvEstado.p;
      const comprar = add.hasAttribute('data-qv-comprar');
      if (comprar) { Cart.add(p, qvEstado.qty, p.ops[qvEstado.op].v); cerrarQV(); abrirCarrito(); return; }
      sumarAlCarrito(p, qvEstado.qty, p.ops[qvEstado.op].v, false);
      pintarResumenQV();
    }
  });
  qv.addEventListener('input', e => { if (e.target.matches('[data-qv-cant]')) fijarCant(e.target.value); });
  qv.addEventListener('change', e => { if (e.target.matches('[data-qv-cant]')) { e.target.value = String(qvEstado.qty); } });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && e.target.closest('[data-qv-op]') && qvEstado.p) {
      const n = qvEstado.p.ops.length;
      qvEstado.op = (qvEstado.op + (e.key === 'ArrowRight' ? 1 : n - 1)) % n;
      pintarQV();
      qv.querySelector(`[data-qv-op="${qvEstado.op}"]`)?.focus();
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
    body.innerHTML = `<div class="cart-vacio"><span class="formas" aria-hidden="true"><span></span><span></span><span></span></span><p class="cart-vacio__tit">Tu carrito está vacío</p><p>Elegí un diseño de Smash o traé tu idea para estampar.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul>${items.map(i => {
    const p = getProducto(i.id);
    const op = opDe(p, i.v);
    const unit = Cart.unitario(i);
    const porCant = op.escala && unit < op.precio ? ` (precio por ${Cart.unidadesDe(p.id)} u)` : '';
    return `<li class="linea" data-linea="${esc(i.id)}" data-v="${esc(i.v)}">
      <img src="${esc(p.img)}" alt="" width="72" height="72">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(op.v)} · ${formatearPrecio(unit)} c/u${esc(porCant)}</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n">${i.qty}</span><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}</button></div></div>
      <p class="linea__precio">${formatearPrecio(unit * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const hayIdea = items.some(i => getProducto(i.id)?.tipo === 'idea');
  const lineas = items.map(i => { const p = getProducto(i.id); const op = opDe(p, i.v); return `- ${i.qty} × ${p.nombre}${p.ops.length > 1 || p.var ? ` (${op.v})` : ''}: ${formatearPrecio(Cart.unitario(i) * i.qty)}`; }).join('\n');
  const msg = `Hola Smash! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}${hayIdea ? '\nLes mando mi diseño por acá.' : ''}\nMi nombre es: `;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <p class="drawer__nota">${ICO.info}${hayIdea ? 'En los personalizados, el precio por unidad baja con la cantidad. Te confirmamos colores, fecha y entrega por WhatsApp.' : 'Te confirmamos talle, stock y entrega por WhatsApp.'}</p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--ghost" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>`;
}
function initCarrito() {
  const dr = document.getElementById('cartDrawer');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-cart]')) { abrirCarrito(); }
  });
  if (!dr) return;
  dr.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-cart]')) { cerrarCarrito(); return; }
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
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

const HORARIOS = [
  { dia: 1, nombre: 'Lunes', desde: 9, hasta: 18 },
  { dia: 2, nombre: 'Martes', desde: 9, hasta: 18 },
  { dia: 3, nombre: 'Miércoles', desde: 9, hasta: 18 },
  { dia: 4, nombre: 'Jueves', desde: 9, hasta: 18 },
  { dia: 5, nombre: 'Viernes', desde: 9, hasta: 18 },
  { dia: 6, nombre: 'Sábado', desde: 9, hasta: 13 },
  { dia: 0, nombre: 'Domingo', desde: null, hasta: null },
];
function ahoraAR() {
  try { return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' })); } catch { return new Date(); }
}
function estadoLocal(fecha = ahoraAR()) {
  const dia = fecha.getDay();
  const h = fecha.getHours() + fecha.getMinutes() / 60;
  const hoy = HORARIOS.find(x => x.dia === dia);
  if (hoy?.desde != null && h >= hoy.desde && h < hoy.hasta) return { abierto: true, hoy, corto: `Abierto ahora · hasta las ${hoy.hasta}`, frase: `ahora estamos atendiendo, hasta las ${hoy.hasta}` };
  let cuando = '';
  let prox = null;
  if (hoy?.desde != null && h < hoy.desde) { prox = hoy; cuando = 'hoy'; }
  for (let k = 1; !prox && k <= 7; k++) {
    const d = HORARIOS.find(x => x.dia === (dia + k) % 7);
    if (d?.desde != null) { prox = d; cuando = k === 1 ? 'mañana' : `el ${d.nombre.toLowerCase()}`; }
  }
  return { abierto: false, hoy, corto: `Cerrado · abrimos ${cuando} a las ${prox.desde}`, frase: `ahora estamos cerrados; te respondemos ${cuando} desde las ${prox.desde}` };
}
function initHorarios() {
  const est = estadoLocal();
  document.querySelectorAll('[data-estado]').forEach(el => {
    el.textContent = est.corto;
    el.classList.toggle('abierto', est.abierto);
  });
  document.querySelectorAll('[data-horarios-lista]').forEach(ul => {
    ul.innerHTML = HORARIOS.map(x => `<li${x.dia === est.hoy?.dia ? ' class="hoy"' : ''}><span>${x.nombre}</span><span>${x.desde == null ? 'Cerrado' : `${x.desde} a ${x.hasta} h`}</span></li>`).join('');
  });
}
function textoHorario() {
  const est = estadoLocal();
  return `Atendemos de lunes a viernes de 9 a 18 y los sábados de 9 a 13. Hoy: ${est.frase}.`;
}

const CHAT = [
  { id: 'unidad', chip: '¿Hacen por unidad?', claves: ['unidad', 'una sola', 'uno solo', 'minimo', 'pocas', 'pocos', 'por cantidad', 'mayor'], resp: () => 'Sí: estampamos desde una sola prenda. Si llevás más, el precio por unidad baja: en cada producto «Con tu idea» ves cuánto.' },
  { id: 'precio', chip: '¿Cuánto sale?', claves: ['precio', 'cuanto', 'cuesta', 'sale', 'valor', 'costo', 'lista'], resp: () => 'Cada producto tiene su precio en la tienda. En los personalizados pagás menos por unidad cuanta más cantidad llevás. Para tu diseño exacto te pasamos la cotización.' },
  { id: 'plazo', chip: '¿Cuánto tarda?', claves: ['tarda', 'demora', 'plazo', 'cuando', 'dias', 'listo', 'rapido', 'urgente', 'fecha'], resp: () => 'Depende de la cantidad y de los colores del diseño. Te pasamos la fecha de entrega junto con la cotización.' },
  { id: 'tinta', chip: '¿Qué tinta usan?', claves: ['tinta', 'agua', 'lavado', 'lava', 'dura', 'plastico', 'tacto', 'calidad', 'sale con'], resp: () => 'Tintas al agua: se absorben en la tela y quedan suaves al tacto, sin una capa plástica encima.' },
  { id: 'horario', chip: '¿Qué horario tienen?', claves: ['horario', 'hora', 'abren', 'cierran', 'abierto', 'atienden', 'sabado', 'domingo', 'feriado'], resp: () => textoHorario() },
  { id: 'donde', chip: '¿Dónde están?', claves: ['donde', 'direccion', 'ubicacion', 'local', 'zona', 'mapa', 'retiro', 'retirar', 'pasar', 'taller'], resp: () => 'Estamos en Buenos Aires. Te pasamos la dirección exacta por WhatsApp para coordinar el retiro o la entrega.' },
  { id: 'emprende', chip: 'Tengo un emprendimiento', claves: ['emprend', 'logo', 'marca', 'bolsa', 'caja', 'friselina', 'packaging', 'negocio', 'local'], resp: () => 'Estampamos tu logo en bolsas de friselina o lienzo, cajas de cartón, remeras, gorras y tazas. Mandanos el logo y la cantidad y te cotizamos.', wsp: 'Hola Smash! Tengo un emprendimiento y quiero cotizar productos con mi logo:' },
  { id: 'pago', chip: null, claves: ['pago', 'pagar', 'tarjeta', 'transferencia', 'mercado', 'efectivo', 'cuotas', 'abonar'], resp: () => 'Los medios de pago te los confirmamos por WhatsApp cuando cerramos el pedido.' },
  { id: 'envio', chip: null, claves: ['envio', 'envian', 'mandan', 'entrega', 'correo', 'domicilio', 'llega'], resp: () => 'Coordinamos la entrega por WhatsApp cuando el pedido está listo.' },
  { id: 'cotizar', chip: 'Quiero cotizar mi diseño', claves: ['cotiz', 'presupuesto', 'diseno', 'idea', 'personaliz', 'estampar', 'dibujo', 'frase'], resp: () => 'Genial. Contanos qué querés estampar y cuántas unidades, y mandanos el diseño. Te dejamos el mensaje listo:', wsp: 'Hola Smash! Quiero cotizar mi diseño. Quiero estampar:' },
];
function responderChat(texto) {
  const t = norm(texto);
  let mejor = null, puntos = 0;
  CHAT.forEach(r => {
    const n = r.claves.reduce((s, k) => s + (t.includes(k) ? 1 : 0), 0);
    if (n > puntos) { puntos = n; mejor = r; }
  });
  return mejor;
}
function initChat() {
  document.querySelectorAll('[data-chat]').forEach(chat => {
    const msgs = chat.querySelector('[data-chat-msgs]');
    const chips = chat.querySelector('[data-chat-chips]');
    const form = chat.querySelector('[data-chat-form]');
    const input = form?.querySelector('input');
    const wspHead = chat.querySelector('[data-chat-wsp]');
    if (!msgs) return;
    const hora = () => { const d = ahoraAR(); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
    const bajar = () => { msgs.scrollTop = msgs.scrollHeight; };
    const agregar = (html, quien) => {
      const m = document.createElement('div');
      m.className = `msg msg--${quien}`;
      m.innerHTML = `${html}<span class="msg__hora">${hora()}</span>`;
      msgs.appendChild(m);
      bajar();
      return m;
    };
    let ocupado = false;
    const botDice = (html, extra = '') => new Promise(res => {
      const escribe = document.createElement('div');
      escribe.className = 'msg msg--bot msg--escribiendo';
      escribe.setAttribute('aria-label', 'Escribiendo');
      escribe.innerHTML = '<i></i><i></i><i></i>';
      msgs.appendChild(escribe);
      bajar();
      setTimeout(() => { escribe.remove(); agregar(html + extra, 'bot'); res(); }, reduceMotion ? 0 : Math.min(500 + html.length * 6, 1300));
    });
    const preguntar = async (texto, r = responderChat(texto)) => {
      if (ocupado || !texto.trim()) return;
      ocupado = true;
      agregar(esc(texto), 'yo');
      const consulta = `Hola Smash! ${texto.trim()}`;
      if (wspHead) wspHead.href = wspLink(consulta);
      if (r) {
        const boton = r.wsp ? `<br><a class="btn btn--wsp" href="${wspLink(r.wsp)}" target="_blank" rel="noopener">${ICO.wsp}Seguir por WhatsApp</a>` : '';
        await botDice(esc(r.resp()), boton);
      } else {
        await botDice('No tengo esa respuesta guardada, pero te leemos por WhatsApp: te dejamos tu pregunta lista para enviar.', `<br><a class="btn btn--wsp" href="${wspLink(consulta)}" target="_blank" rel="noopener">${ICO.wsp}Enviar por WhatsApp</a>`);
      }
      ocupado = false;
    };
    if (chips) {
      chips.innerHTML = CHAT.filter(r => r.chip).map(r => `<button type="button" class="chat__chip" data-chat-r="${r.id}">${esc(r.chip)}</button>`).join('');
      chips.addEventListener('click', e => {
        const b = e.target.closest('[data-chat-r]');
        if (!b) return;
        preguntar(b.textContent, CHAT.find(r => r.id === b.dataset.chatR));
      });
    }
    form?.addEventListener('submit', e => {
      e.preventDefault();
      const v = (input?.value || '').trim().slice(0, 240);
      if (!v) { input?.focus(); return; }
      input.value = '';
      preguntar(v);
    });
    const est = estadoLocal();
    agregar(`¡Hola! Gracias por escribirle a Smash. Esta es la respuesta automática: ${esc(est.frase)}. Elegí una pregunta o escribila y te contesto al instante.`, 'bot');
  });
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  try {
    const centro = L.latLng(-34.6037, -58.3816);
    const mapa = L.map(el, { center: centro, zoom: 13, scrollWheelZoom: false, zoomControl: false, attributionControl: true, dragging: !window.matchMedia('(pointer: coarse)').matches, tap: false });
    L.control.zoom({ position: 'topright', zoomInTitle: 'Acercar', zoomOutTitle: 'Alejar' }).addTo(mapa);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    const icono = L.divIcon({ className: 'pin', html: '<span class="pin__dot"></span>', iconSize: [44, 44], iconAnchor: [22, 44] });
    L.marker(centro, { icon: icono, keyboard: false, title: 'Smash' }).addTo(mapa);
    L.circle(centro, { radius: 900, color: '#264653', weight: 1, fillColor: '#264653', fillOpacity: 0.08 }).addTo(mapa);
    const ancho = el.closest('.enc2__mapa');
    const refrescar = () => {
      mapa.invalidateSize();
      mapa.setView(centro, 13, { animate: false });
      if (ancho && window.innerWidth > 860) mapa.panBy([-Math.round(el.clientWidth * 0.2), 0], { animate: false });
    };
    refrescar();
    window.addEventListener('load', refrescar);
    window.addEventListener('resize', refrescar, { passive: true });
    setTimeout(refrescar, 600);
  } catch (e) { console.error(e); }
}

function initLeerScroll() {
  document.querySelectorAll('[data-leer]').forEach(p => {
    const palabras = p.textContent.trim().split(/\s+/);
    p.innerHTML = palabras.map(w => `<span class="leer__w">${esc(w)}</span>`).join(' ');
    const spans = [...p.querySelectorAll('.leer__w')];
    if (reduceMotion || typeof ScrollTrigger === 'undefined') { spans.forEach(s => s.classList.add('on')); return; }
    ScrollTrigger.create({
      trigger: p, start: 'top 82%', end: 'bottom 48%',
      onUpdate: s => { const n = Math.round(s.progress * spans.length); spans.forEach((sp, i) => sp.classList.toggle('on', i < n)); },
      onLeave: () => spans.forEach(sp => sp.classList.add('on')),
    });
  });
}

const SOPORTES = [
  { cat: 'remeras', nombre: 'Remeras', img: 'images/p-remera.webp', alt: 'Remera cruda con formas geométricas en verde petróleo, colgada en una percha', texto: 'Manga corta o larga, con un diseño de Smash o con tu idea. Podés mezclar talles en el mismo pedido.' },
  { cat: 'buzos', nombre: 'Buzos', img: 'images/p-buzo.webp', alt: 'Buzo azul marino doblado con una forma orgánica en crema', texto: 'Buzos de frisa con estampa grande al frente, para el invierno, tu equipo o tu marca.' },
  { cat: 'bolsas', nombre: 'Bolsas', img: 'images/p-tote.webp', alt: 'Bolsa tote de lienzo con un círculo naranja estampado', texto: 'Tote bags de lienzo y bolsas de friselina con el logo de tu emprendimiento.' },
  { cat: 'tazas', nombre: 'Tazas', img: 'images/p-taza.webp', alt: 'Taza crema con medias lunas en verde petróleo y naranja', texto: 'Tazas estampadas para regalar, para un evento o para tu marca.' },
  { cat: 'mochilas', nombre: 'Mochilas y riñoneras', img: 'images/p-mochila.webp', alt: 'Mochila de lienzo con ramas de hojas en verde petróleo', texto: 'Mochilas de lienzo y riñoneras con la estampa a la vista.' },
  { cat: 'gorras', nombre: 'Gorras', img: 'images/p-gorra.webp', alt: 'Gorra blanca con un círculo y una media luna en verde petróleo', texto: 'Gorras de gabardina regulables, con la estampa o tu logo al frente.' },
  { cat: 'cajas', nombre: 'Cajas', img: 'images/p-cajas.webp', alt: 'Caja de cartón kraft con círculos grandes en verde petróleo', texto: 'Cajas de cartón kraft con tu logo, en tres medidas, para enviar tus pedidos.' },
];
function initEstampador() {
  const box = document.querySelector('[data-estampador]');
  if (!box) return;
  const tabs = box.querySelector('[data-est-tabs]');
  const foto = box.querySelector('[data-est-foto]');
  const rasqueta = box.querySelector('.estampador__rasqueta');
  const nom = box.querySelector('[data-est-nombre]');
  const txt = box.querySelector('[data-est-texto]');
  const num = box.querySelector('[data-est-num]');
  const cta = box.querySelector('[data-est-cta]');
  const panel = box.querySelector('[data-est-panel]');
  if (!tabs || !foto) return;
  tabs.innerHTML = SOPORTES.map((s, i) => `<button type="button" role="tab" class="estampador__tab" id="est-tab-${s.cat}" aria-controls="estPanel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-est="${i}">${esc(s.nombre)}</button>`).join('');
  let actual = 0;
  const mostrar = (i, animar = true) => {
    const s = SOPORTES[i];
    if (!s) return;
    actual = i;
    tabs.querySelectorAll('[data-est]').forEach((b, k) => { b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
    panel?.setAttribute('aria-labelledby', `est-tab-${s.cat}`);
    const n = Tienda.contar({ cat: s.cat });
    if (nom) nom.textContent = s.nombre;
    if (txt) txt.textContent = s.texto;
    if (num) num.textContent = `${String(i + 1).padStart(2, '0')} / ${String(SOPORTES.length).padStart(2, '0')} · ${n} ${n === 1 ? 'producto' : 'productos'}`;
    if (cta) { cta.href = `${URL_CATALOGO}?cat=${s.cat}`; cta.querySelector('span').textContent = `Ver ${s.nombre.toLowerCase()}`; }
    const vieja = foto.querySelector('img:last-of-type');
    if (vieja && vieja.getAttribute('src') === s.img) return;
    const img = document.createElement('img');
    img.src = s.img; img.alt = s.alt; img.width = 900; img.height = 900;
    if (!animar || reduceMotion) {
      foto.querySelectorAll('img').forEach(x => x.remove());
      foto.appendChild(img);
      return;
    }
    img.className = 'entra';
    foto.appendChild(img);
    if (rasqueta) { rasqueta.classList.remove('pasa'); void rasqueta.offsetWidth; rasqueta.classList.add('pasa'); }
    requestAnimationFrame(() => requestAnimationFrame(() => img.classList.add('ya')));
    setTimeout(() => { foto.querySelectorAll('img').forEach(x => { if (x !== img) x.remove(); }); img.className = ''; }, 950);
  };
  tabs.addEventListener('click', e => { const b = e.target.closest('[data-est]'); if (b) mostrar(Number(b.dataset.est)); });
  tabs.addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const n = SOPORTES.length;
    const i = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : (actual + (e.key === 'ArrowRight' ? 1 : n - 1)) % n;
    mostrar(i);
    tabs.querySelector(`[data-est="${i}"]`)?.focus();
  });
  mostrar(0, false);
}

function initTinta() {
  const tintas = document.querySelectorAll('.hero .tinta');
  if (!tintas.length || reduceMotion) return;
  tintas.forEach(t => t.style.setProperty('--tinta', '0'));
  requestAnimationFrame(() => requestAnimationFrame(() => tintas.forEach(t => t.style.setProperty('--tinta', '1'))));
}

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return '';
  const params = new URLSearchParams(location.search);
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const estado = {
    cat: valido(params.get('cat'), catIds),
    tipo: valido(params.get('tipo'), TIPOS),
    precio: valido(params.get('precio'), RANGOS),
    stock: params.get('stock') === '1',
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: valido(params.get('orden'), ORDENES) || 'destacados',
  };
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const limpiarBtns = document.querySelectorAll('[data-limpiar]');
  const filtrosN = document.querySelector('[data-filtros-n]');

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoBoton = cont.dataset.catOpciones === 'botones';
    const opciones = [{ id: '', nombre: 'Todo' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => comoBoton
      ? `<button type="button" class="chip" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.nombre)} <small data-cuenta-cat="${c.id}"></small></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Todas')}</span><span class="opt__n" data-cuenta-cat="${c.id}"></span></label>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.tipo && sin !== 'tipo') f.tipo = estado.tipo;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    if (estado.stock && sin !== 'stock') f.stock = true;
    return f;
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === estado[f];
      else if (el.type === 'checkbox') el.checked = !!estado[f];
      else if (el.tagName === 'SELECT') el.value = estado[f] || '';
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === estado[f]));
    });
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cat-opciones] [data-cuenta-cat]').forEach(el => {
      const id = el.dataset.cuentaCat;
      el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) });
    });
    document.querySelectorAll('[data-cuenta-tipo]').forEach(el => {
      const id = el.dataset.cuentaTipo;
      el.textContent = Tienda.contar({ ...filtrosDe('tipo'), ...(id ? { tipo: id } : {}) });
    });
    const activos = ['cat', 'tipo', 'precio'].filter(k => estado[k]).length + (estado.stock ? 1 : 0);
    if (filtrosN) { const enPanel = ['tipo', 'precio'].filter(k => estado[k]).length + (estado.stock ? 1 : 0) + (document.querySelector('#filtros [data-cat-opciones]') ? (estado.cat ? 1 : 0) : 0); filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    limpiarBtns.forEach(b => { b.hidden = !(activos || estado.q); });
    const cat = catIds[estado.cat];
    const tipo = TIPOS[estado.tipo];
    let titulo = cat ? cat.nombre : tipo || 'Todo el catálogo';
    if (cat && tipo) titulo += ` · ${tipo}`;
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? cat.bajada : estado.tipo === 'idea' ? 'Remeras, buzos, bolsas, tazas, gorras y cajas con tu diseño o tu logo. El precio por unidad baja con la cantidad.' : estado.tipo === 'listo' ? 'Diseños de Smash ya estampados con tinta al agua, listos para llevar.' : 'Remeras, buzos, bolsas, mochilas, riñoneras, tazas, gorras y cajas: con diseños de Smash o con tu idea.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = !cat && !tipo; miga.textContent = titulo; }
    document.title = `${titulo} — Smash`;
    document.querySelectorAll('.nav-cats__lista a').forEach(a => {
      if (a.getAttribute('href') === `${URL_CATALOGO}?cat=${estado.cat}`) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'tipo', 'precio', 'q', 'orden', 'stock', 'buscar'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.tipo) u.searchParams.set('tipo', estado.tipo);
    if (estado.precio) u.searchParams.set('precio', estado.precio);
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
      else { const total = Tienda.contar(filtrosDe()); cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'producto' : 'productos'}` : ''; }
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
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) { estado[b.dataset.filtro] = b.dataset.valor || ''; aplicar(); return; }
    if (e.target.closest('[data-limpiar]')) {
      estado.cat = ''; estado.tipo = ''; estado.precio = ''; estado.stock = false; estado.q = '';
      if (buscar) buscar.value = '';
      aplicar();
    }
  });
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
    abrirF.addEventListener('click', () => { filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true'); filtros.querySelector('input, button')?.focus({ preventScroll: true }); });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); });
  }

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
  paso('.sello', { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7);
  paso('.estampador', { y: 40, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.75);
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
  initRail,
  initPerso,
  initMosaico,
  initListaCantidad,
  initCuentas,
  () => { const cat = PAGINA === 'catalogo' ? initCatalogo() : ''; initCatsMenu(cat || ''); },
  initTarjetas,
  initQV,
  initCarrito,
  initFloats,
  initHorarios,
  initChat,
  initEstampador,
  initMapa,
  initLeerScroll,
  initTinta,
  initHeroMotion,
  initReveals,
  initParallax,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
