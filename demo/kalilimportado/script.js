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

const WSP = '5491164528183';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;

const CATEGORIAS = [
  { id: 'perfumes', nombre: 'Perfumes', bajada: 'Fragancias para él, para ella y unisex.', img: 'images/p-perfume-rosa.webp' },
  { id: 'termos', nombre: 'Termos y botellas', bajada: 'Termos, botellas y vasos térmicos de acero.', img: 'images/p-termo.webp' },
  { id: 'bazar', nombre: 'Bazar', bajada: 'Vasos, jarras, tazas y frascos para la casa.', img: 'images/p-vasos-acanalados.webp' },
  { id: 'bienestar', nombre: 'Bienestar', bajada: 'Masajeadores y rodillos para cuidarte en casa.', img: 'images/p-masajeador.webp' },
  { id: 'peluches', nombre: 'Peluches', bajada: 'Osos y conejos para regalar.', img: 'images/p-peluche-oso.webp' },
];
const PARA = { hombre: { nombre: 'Para él' }, mujer: { nombre: 'Para ella' } };
const RANGOS = {
  hasta15: { nombre: 'Menos de $15.000', max: 14999 },
  '15a35': { nombre: '$15.000 a $35.000', min: 15000, max: 35000 },
  mas35: { nombre: 'Más de $35.000', min: 35001 },
};
const ORDENES = { destacados: 'Destacados', nuevos: 'Recién llegados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const TITULO_VAR = { 'Tamaño': 'Elegí el tamaño', Fragancia: 'Elegí la fragancia', Medida: 'Elegí la medida', Pack: 'Elegí el set' };

const PRODUCTOS = [
  { id: 'perfume-ambar-intenso', nombre: 'Perfume Ámbar Intenso', cat: 'perfumes', para: ['hombre'], tipo: 'Tamaño',
    ops: [{ v: '50 ml', precio: 32900 }, { v: '100 ml', precio: 49900 }],
    descuento: 0, stock: 9, rango: 12, alta: 21, img: 'images/p-perfume-ambar.webp', alt: 'Frasco cuadrado de perfume color ámbar con tapa negra sobre una piedra clara',
    desc: 'Eau de parfum de salida especiada con fondo de ámbar, madera y vainilla. Frasco de vidrio grueso con tapa negra, para la noche o los días fríos.',
    tags: ['fragancia', 'hombre', 'amaderado', 'oriental', 'regalo'] },
  { id: 'perfume-rosa-empolvada', nombre: 'Perfume Rosa Empolvada', cat: 'perfumes', para: ['mujer'], tipo: 'Tamaño',
    ops: [{ v: '50 ml', precio: 31900 }, { v: '100 ml', precio: 47900 }],
    descuento: 0, stock: 8, rango: 1, alta: 9, img: 'images/p-perfume-rosa.webp', alt: 'Frasco redondo de perfume rosado con tapa dorada sobre una piedra',
    desc: 'Eau de parfum floral con rosa, peonía y un fondo suave de almizcle. Frasco redondo de vidrio rosado con tapa dorada.',
    tags: ['fragancia', 'mujer', 'floral', 'regalo'] },
  { id: 'perfume-citrico-amaderado', nombre: 'Perfume Cítrico Amaderado', cat: 'perfumes', para: ['hombre'], tipo: null,
    ops: [{ v: '100 ml', precio: 44900 }],
    descuento: 0, stock: 3, rango: 10, alta: 7, img: 'images/p-perfume-citrico.webp', alt: 'Frasco de perfume con líquido dorado y tapa plateada sobre un fondo claro',
    desc: 'Bergamota y limón de salida, con un fondo de cedro. Fresco para el día a día y la oficina.',
    tags: ['fragancia', 'hombre', 'citrico', 'fresco'] },
  { id: 'perfume-sal-y-madera', nombre: 'Perfume Sal y Madera', cat: 'perfumes', para: ['hombre', 'mujer'], tipo: null,
    ops: [{ v: '100 ml', precio: 46900 }],
    descuento: 0, stock: 6, rango: 4, alta: 8, img: 'images/p-perfume-sal.webp', alt: 'Frasco de perfume transparente con etiqueta blanca apoyado sobre arena',
    desc: 'Notas marinas, sal y madera clara. Una fragancia unisex y liviana que se lleva bien todo el año.',
    tags: ['fragancia', 'unisex', 'marino', 'fresco'] },
  { id: 'perfume-peonia-durazno', nombre: 'Perfume Peonía y Durazno', cat: 'perfumes', para: ['mujer'], tipo: null,
    ops: [{ v: '100 ml', precio: 42900 }],
    descuento: 10, stock: 7, rango: 13, alta: 15, img: 'images/p-perfume-peonia.webp', alt: 'Frasco cuadrado de perfume color durazno con tapa bordó',
    desc: 'Floral frutal con peonía, durazno y un fondo dulce de vainilla. Para usar de día.',
    tags: ['fragancia', 'mujer', 'frutal', 'floral'] },
  { id: 'aceite-perfumado-roll-on', nombre: 'Aceite perfumado roll-on, 6 ml', cat: 'perfumes', para: ['hombre', 'mujer'], tipo: 'Fragancia',
    ops: [{ v: 'Oud', precio: 12900 }, { v: 'Almizcle blanco', precio: 12900 }, { v: 'Vainilla', precio: 12900 }],
    descuento: 0, stock: 20, rango: 14, alta: 19, img: 'images/p-roll-on.webp', alt: 'Dos frascos chicos de aceite perfumado con tapa dorada sobre un cubo blanco',
    desc: 'Aceite perfumado concentrado en frasco de vidrio con aplicador a bolilla. Entra en cualquier bolsillo o cartera.',
    tags: ['fragancia', 'unisex', 'arabe', 'oud', 'almizcle', 'vainilla', 'cartera'] },
  { id: 'bruma-vainilla-coco', nombre: 'Bruma corporal Vainilla y Coco, 200 ml', cat: 'perfumes', para: ['mujer'], tipo: null,
    ops: [{ v: '200 ml', precio: 16900 }],
    descuento: 0, stock: 12, rango: 9, alta: 6, img: 'images/p-bruma.webp', alt: 'Frasco blanco con atomizador negro sobre una base dorada',
    desc: 'Bruma liviana para el cuerpo y el pelo, con vainilla y coco. Para refrescarte durante el día.',
    tags: ['fragancia', 'body splash', 'mujer', 'vainilla', 'coco'] },
  { id: 'oso-peluche-clasico', nombre: 'Oso de peluche clásico', cat: 'peluches', tipo: 'Medida',
    ops: [{ v: '30 cm', precio: 19900 }, { v: '50 cm', precio: 32900 }, { v: '80 cm', precio: 54900 }],
    descuento: 0, stock: 10, rango: 2, alta: 10, img: 'images/p-peluche-oso.webp', alt: 'Oso de peluche color caramelo sentado sobre un fondo claro',
    desc: 'Peluche de pelo largo y suave, color caramelo, con hocico y patitas en crema.',
    tags: ['peluche', 'oso', 'regalo', 'bebe', 'chicos'] },
  { id: 'conejo-peluche-orejon', nombre: 'Conejo de peluche orejón, 40 cm', cat: 'peluches', tipo: null,
    ops: [{ v: '40 cm', precio: 24900 }],
    descuento: 0, stock: 5, rango: 15, alta: 18, img: 'images/p-conejo.webp', alt: 'Conejo de peluche beige de orejas largas sentado junto a una ventana',
    desc: 'Conejo beige de orejas largas, blandito y liviano. Para abrazar o para decorar el cuarto.',
    tags: ['peluche', 'conejo', 'regalo', 'bebe'] },
  { id: 'osito-remerita-rayas', nombre: 'Osito con remerita a rayas, 25 cm', cat: 'peluches', tipo: null,
    ops: [{ v: '25 cm', precio: 14900 }],
    descuento: 0, stock: 2, rango: 11, alta: 5, img: 'images/p-osito.webp', alt: 'Osito de peluche con remera a rayas y un corazón rojo',
    desc: 'Osito chico con remera a rayas y un corazón bordado. Un regalo simple que siempre queda bien.',
    tags: ['peluche', 'oso', 'regalo', 'chico'] },
  { id: 'termo-acero-1l', nombre: 'Termo de acero 1 L con vaso, crema', cat: 'termos', tipo: null,
    ops: [{ v: '1 L', precio: 39900 }],
    descuento: 0, stock: 8, rango: 3, alta: 11, img: 'images/p-termo.webp', alt: 'Termo de acero color crema con su vaso al lado sobre una mesada de mármol',
    desc: 'Doble pared de acero inoxidable, tapa a rosca y un vaso de acero que hace de tapa. Para el mate, el café o la ruta.',
    tags: ['termo', 'mate', 'acero', 'cafe', 'viaje'] },
  { id: 'botella-termica-500', nombre: 'Botella térmica 500 ml, verde salvia', cat: 'termos', tipo: null,
    ops: [{ v: '500 ml', precio: 22900 }],
    descuento: 0, stock: 14, rango: 5, alta: 4, img: 'images/p-botella.webp', alt: 'Botella térmica verde salvia con tapa de acero sobre una mesada de piedra',
    desc: 'Botella de acero con doble pared y tapa a rosca. Entra en la mochila y en el portavasos del auto.',
    tags: ['botella', 'agua', 'gimnasio', 'acero'] },
  { id: 'vaso-termico-600', nombre: 'Vaso térmico 600 ml con sorbete', cat: 'termos', tipo: null,
    ops: [{ v: '600 ml', precio: 21900 }],
    descuento: 0, stock: 11, rango: 16, alta: 20, img: 'images/p-vaso-termico.webp', alt: 'Vaso térmico negro con tapa transparente y sorbete de acero',
    desc: 'Vaso de acero con doble pared, tapa transparente y sorbete de acero incluido. Para el café, el agua o el tereré.',
    tags: ['vaso', 'termico', 'cafe', 'terere', 'sorbete', 'acero'] },
  { id: 'vasos-vidrio-acanalado', nombre: 'Vasos de vidrio acanalado, 300 ml', cat: 'bazar', tipo: 'Pack',
    ops: [{ v: 'Set x2', precio: 11900 }, { v: 'Set x6', precio: 31900 }],
    descuento: 0, stock: 15, rango: 7, alta: 3, img: 'images/p-vasos-acanalados.webp', alt: 'Dos vasos de vidrio acanalado sobre una mesa de madera',
    desc: 'Vidrio con relieve acanalado, para agua, jugo o tragos. Elegí el set de 2 o de 6.',
    tags: ['vaso', 'vidrio', 'cocina', 'mesa'] },
  { id: 'ensaladera-ondulada', nombre: 'Ensaladera ondulada con cubiertos de madera', cat: 'bazar', tipo: null,
    ops: [{ v: 'Ensaladera + cubiertos', precio: 27900 }],
    descuento: 0, stock: 6, rango: 8, alta: 2, img: 'images/p-ensaladera.webp', alt: 'Ensaladera blanca de borde ondulado con cuchara y tenedor de madera',
    desc: 'Ensaladera de cerámica blanca con borde ondulado y un par de cubiertos de madera para servir.',
    tags: ['ensaladera', 'bowl', 'cocina', 'madera'] },
  { id: 'set-tazas-ceramica', nombre: 'Set de 2 tazas de cerámica', cat: 'bazar', tipo: null,
    ops: [{ v: 'Arena y negra', precio: 18900 }],
    descuento: 0, stock: 9, rango: 19, alta: 14, img: 'images/p-tazas.webp', alt: 'Dos tazas de cerámica, una arena y una negra, sobre una bandeja de madera',
    desc: 'Dos tazas de cerámica esmaltada, una arena y una negra. La bandeja de la foto no está incluida.',
    tags: ['taza', 'cafe', 'te', 'cocina', 'ceramica'] },
  { id: 'botellon-vidrio-1l', nombre: 'Botellón de vidrio, 1 L', cat: 'bazar', tipo: null,
    ops: [{ v: '1 L', precio: 13900 }],
    descuento: 0, stock: 0, rango: 21, alta: 1, img: 'images/p-botellon.webp', alt: 'Botellón de vidrio transparente con agua sobre una tabla de madera',
    desc: 'Botellón de vidrio liso para el agua de la mesa o de la heladera.',
    tags: ['botellon', 'jarra', 'vidrio', 'agua'] },
  { id: 'jarra-acanalada-vasos', nombre: 'Jarra acanalada 1 L con 3 vasos', cat: 'bazar', tipo: null,
    ops: [{ v: 'Jarra + 3 vasos', precio: 29900 }],
    descuento: 0, stock: 4, rango: 18, alta: 17, img: 'images/p-jarra-acanalada.webp', alt: 'Jarra y tres vasos de vidrio acanalado sobre una mesada de granito',
    desc: 'Jarra de vidrio acanalado con tres vasos al tono. Queda linda en la mesa y en la mesita de luz.',
    tags: ['jarra', 'vaso', 'vidrio', 'mesa'] },
  { id: 'frasco-vidrio-corcho', nombre: 'Frasco de vidrio con tapa de corcho', cat: 'bazar', tipo: 'Tamaño',
    ops: [{ v: '500 ml', precio: 7900 }, { v: '1 L', precio: 10900 }],
    descuento: 0, stock: 25, rango: 20, alta: 12, img: 'images/p-frascos.webp', alt: 'Frasco alto de vidrio con garbanzos y tapa de corcho junto a piezas de cerámica',
    desc: 'Frasco de vidrio con tapa de corcho para legumbres, café o yerba. Las piezas de cerámica de la foto no se incluyen.',
    tags: ['frasco', 'vidrio', 'cocina', 'alacena', 'yerba'] },
  { id: 'pistola-masajeadora', nombre: 'Pistola masajeadora compacta', cat: 'bienestar', tipo: null,
    ops: [{ v: 'Con 4 cabezales', precio: 69900 }],
    descuento: 15, stock: 6, rango: 17, alta: 16, img: 'images/p-masajeador.webp', alt: 'Pistola masajeadora negra apoyada sobre una mesada clara',
    desc: 'Masajeador de percusión compacto y recargable, con cabezales intercambiables para espalda, piernas y brazos.',
    tags: ['masajeador', 'masaje', 'espalda', 'contracturas', 'recargable'] },
  { id: 'rodillo-facial-jade', nombre: 'Rodillo facial de jade', cat: 'bienestar', tipo: null,
    ops: [{ v: 'Doble rodillo', precio: 14900 }],
    descuento: 0, stock: 3, rango: 6, alta: 13, img: 'images/p-rodillo-jade.webp', alt: 'Dos rodillos faciales de jade verde sobre mármol blanco con ramitas de eucalipto',
    desc: 'Rodillo de piedra con dos cabezales, uno para la cara y otro para el contorno de ojos. Para usar con tu crema o sérum.',
    tags: ['masajeador', 'facial', 'jade', 'skincare', 'rodillo'] },
  { id: 'difusor-ambientes', nombre: 'Difusor de ambientes', cat: 'bazar', tipo: null,
    ops: [{ v: '250 ml', precio: 15900 }],
    descuento: 0, stock: 0, rango: 30, alta: 0, visible: false, img: 'images/p-frascos.webp', alt: 'Próximo ingreso',
    desc: 'Próximo ingreso.', tags: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const precioOp = (p, op) => (p.descuento > 0 ? Math.round(op.precio * (1 - p.descuento / 100)) : op.precio);
const precioDesde = p => Math.min(...p.ops.map(op => precioOp(p, op)));

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const desde = p => Math.min(...p.ops.map(op => (p.descuento > 0 ? Math.round(op.precio * (1 - p.descuento / 100)) : op.precio)));
  function coincide(p, f) {
    const cat = lista(f.cat), para = lista(f.para), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (para.length && !(p.para || []).some(x => para.includes(x))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.stock && !(p.stock > 0)) return false;
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
    const cat = CATEGORIAS.find(c => c.id === p.cat);
    const para = (p.para || []).map(x => (x === 'hombre' ? 'hombre el para el' : 'mujer ella para ella'));
    if ((p.para || []).length > 1) para.push('unisex');
    textoBusqueda.set(p.id, norm([p.nombre, cat?.nombre, p.desc, p.tipo, ...para, ...p.ops.map(op => op.v), ...(p.tags || [])].join(' ')));
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

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));
const opDe = (p, v) => p.ops.find(op => op.v === v) || p.ops[0];

const Cart = {
  KEY: 'kalilimportado_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = null) {
    const items = this.get();
    const variante = v ?? producto.ops[0].v;
    const max = producto.stock ?? 99;
    const existing = items.find(i => i.id === producto.id && i.v === variante);
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, v: variante, qty: Math.min(qty, max) });
    this.save(items);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.v === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioOp(p, opDe(p, i.v)) * i.qty : s; }, 0); },
};

const ICO = {
  flecha: '<svg class="ico ico--flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  bolsa: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
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
const HORARIO = { dias: [1, 2, 3, 4, 5, 6], turnos: [[510, 1230]] };
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
function estadoLocal({ dia, min }) {
  if (HORARIO.dias.includes(dia)) {
    const turno = HORARIO.turnos.find(([a, b]) => min >= a && min < b);
    if (turno) return { abierto: true, texto: `Atendemos ahora · hasta las ${hora(turno[1])} h` };
    const prox = HORARIO.turnos.find(([a]) => min < a);
    if (prox) return { abierto: false, texto: `Hoy atendemos desde las ${hora(prox[0])} h` };
  }
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    if (HORARIO.dias.includes(d)) return { abierto: false, texto: `Volvemos ${k === 1 ? 'mañana' : 'el ' + DIAS[d]} a las ${hora(HORARIO.turnos[0][0])} h` };
  }
  return { abierto: false, texto: 'Fuera de horario' };
}
function initEstado() {
  const textos = document.querySelectorAll('[data-estado]');
  const puntos = document.querySelectorAll('[data-estado-dot]');
  if (!textos.length && !puntos.length) return;
  const pintar = () => {
    const e = estadoLocal(ahoraEnBuenosAires());
    textos.forEach(t => { t.textContent = e.texto; });
    puntos.forEach(d => d.classList.toggle('is-open', e.abierto));
  };
  pintar();
  window.setInterval(pintar, 60000);
}

function resumenVar(p) {
  if (p.ops.length === 1) return p.ops[0].v;
  if (p.tipo === 'Fragancia') return `${p.ops.length} fragancias`;
  return p.ops.map(op => op.v).join(' · ');
}
function paraTexto(p) {
  const para = p.para || [];
  if (!para.length) return '';
  if (para.length > 1) return 'Unisex';
  return PARA[para[0]]?.nombre || '';
}
const metaDe = p => [CATEGORIAS.find(c => c.id === p.cat)?.nombre, paraTexto(p)].filter(Boolean).join(' · ');

function cardHTML(p, { anim = true } = {}) {
  const varias = p.ops.length > 1 && new Set(p.ops.map(op => op.precio)).size > 1;
  const base = Math.min(...p.ops.map(op => op.precio));
  let badge = '';
  if (p.descuento > 0) badge = `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>`;
  else if (p.stock > 0 && p.stock <= 3) badge = '<span class="pcard__badge">Últimas unidades</span>';
  else if (p.alta >= 18) badge = '<span class="pcard__badge pcard__badge--nuevo">Nuevo ingreso</span>';
  const sinStock = !(p.stock > 0);
  return `<article class="pcard${sinStock ? ' pcard--agotado' : ''}" data-id="${esc(p.id)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : ''}>
  <div class="pcard__media">
    <div class="pcard__foto" data-quick="${esc(p.id)}"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="880" height="1100"></div>
    ${badge}
    <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}"${sinStock ? ' disabled' : ''}>Comprar ahora</button>
  </div>
  <div class="pcard__info">
    <p class="pcard__meta">${esc(metaDe(p))}</p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    <p class="pcard__var">${esc(resumenVar(p))}</p>
    <p class="pcard__precio">${varias ? '<span class="desde">desde</span>' : ''}<span>${formatearPrecio(precioDesde(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(base)}</s>` : ''}</p>
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
    lista.innerHTML = CATEGORIAS.map(c => `<li><a href="${URL_CATALOGO}?cat=${c.id}"${c.id === catActual ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="44" height="55"><span>${esc(c.nombre)}</span><span class="nav-cats__n">${Tienda.contar({ cat: c.id })}</span></a></li>`).join('');
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

function conjunto(nombre, limite) {
  if (nombre === 'nuevos') return Tienda.consultar({ orden: 'nuevos', limite }).items.map(cachear);
  const excluir = Tienda.consultar({ orden: 'nuevos', limite: 8 }).items.map(p => p.id);
  return Tienda.consultar({ filtros: { excluir }, orden: 'destacados', limite }).items.map(cachear);
}

function initRail() {
  document.querySelectorAll('[data-rail-track]').forEach(track => {
    const items = conjunto(track.dataset.set || 'nuevos', 8);
    track.innerHTML = items.map(p => `<div class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { anim: false })}</div>`).join('');
    const vp = track.closest('[data-rail]');
    const sec = track.closest('section');
    initRailDrag(vp);
    const prev = sec?.querySelector('[data-rail-prev]');
    const next = sec?.querySelector('[data-rail-next]');
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

function initGrillas() {
  document.querySelectorAll('[data-grid-set]').forEach(cont => {
    cont.innerHTML = conjunto(cont.dataset.gridSet, 8).map(p => cardHTML(p)).join('');
  });
}

function initMosaico() {
  const cont = document.querySelector('[data-mosaico]');
  if (!cont) return;
  const items = conjunto('nuevos', 7);
  const total = Tienda.contar({});
  cont.innerHTML = items.map((p, i) => `<div class="mos-item${i === 0 ? ' mos-item--grande' : ''}" data-animate="subir" style="opacity:0;transform:translateY(44px)">${cardHTML(p, { anim: false })}</div>`).join('')
    + `<div class="mos-item mos-item--todo" data-animate="subir" style="opacity:0;transform:translateY(44px)"><a class="mosaico__todo" href="${URL_CATALOGO}"><span><strong>Ver los ${total} productos</strong><span>Perfumes, termos, bazar, bienestar y peluches</span></span>${ICO.flecha}</a></div>`;
}

function initCuentas() {
  document.querySelectorAll('[data-n-cat]').forEach(el => { el.textContent = Tienda.contar({ cat: el.dataset.nCat }); });
  document.querySelectorAll('[data-n-cat-txt]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.nCatTxt });
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
  document.querySelectorAll('[data-n-para]').forEach(el => {
    const n = Tienda.contar({ cat: 'perfumes', para: el.dataset.nPara });
    el.textContent = `${n} ${n === 1 ? 'perfume' : 'perfumes'}`;
  });
  document.querySelectorAll('[data-n-total]').forEach(el => { el.textContent = Tienda.contar({}); });
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (p) el.textContent = formatearPrecio(precioDesde(p));
  });
}

function cerrarPickers() {
  document.querySelectorAll('.picker').forEach(pk => pk.remove());
}
function abrirPicker(card, p, modo) {
  cerrarPickers();
  const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
  const tit = TITULO_VAR[p.tipo] || 'Elegí una opción';
  const pk = document.createElement('div');
  pk.className = 'picker';
  pk.setAttribute('role', 'dialog');
  pk.setAttribute('aria-label', tit);
  pk.dataset.modo = modo;
  pk.dataset.qty = String(qty);
  pk.innerHTML = `<div class="picker__head"><p class="picker__tit">${esc(tit)}</p><button type="button" class="picker__cerrar" data-picker-cerrar aria-label="Cerrar">${ICO.x}</button></div>
    <div class="picker__ops">${p.ops.map((op, i) => `<button type="button" class="picker__op" data-picker-op="${i}"><span>${esc(op.v)}</span><b>${formatearPrecio(precioOp(p, op))}</b></button>`).join('')}</div>
    ${qty > 1 ? `<p class="picker__nota">Vas a sumar ${qty} unidades.</p>` : ''}`;
  card.querySelector('.pcard__media')?.appendChild(pk);
  pk.querySelector('.picker__op')?.focus({ preventScroll: true });
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
      const max = p?.stock || 99;
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
  if (e.key !== 'Tab' || !panel) return;
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
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: precioDesde(p), highPrice: Math.max(...p.ops.map(op => precioOp(p, op))), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function pintarQV() {
  const p = qvEstado.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const op = p.ops[qvEstado.op];
  const tit = TITULO_VAR[p.tipo] || '';
  const { items: rel } = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const stock = p.stock > 3 ? 'En stock' : p.stock > 0 ? `Quedan ${p.stock}` : 'Sin stock por ahora';
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="880" height="1100"></div>
    <div class="qv__info">
      <p class="qv__meta">${esc(metaDe(p))}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <p class="qv__precio"><span>${formatearPrecio(precioOp(p, op))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(op.precio)}</s><em>-${p.descuento}%</em>` : ''}</p>
      ${p.ops.length > 1 ? `<div class="qv__var"><p class="qv__var-tit">${esc(tit)}</p><div class="qv__ops" role="radiogroup" aria-label="${esc(tit)}">${p.ops.map((o, i) => `<button type="button" class="qv__op" role="radio" aria-checked="${i === qvEstado.op}" data-qv-op="${i}"><b>${esc(o.v)}</b><span>${formatearPrecio(precioOp(p, o))}</span></button>`).join('')}</div></div>` : `<p class="qv__unica">${esc(op.v)}</p>`}
      <p class="qv__stock${p.stock > 0 ? '' : ' qv__stock--no'}">${ICO.check}${esc(stock)} · coordinamos la entrega por WhatsApp</p>
      <div class="qv__acc">
        <div class="stepper" data-qv-stepper><button type="button" data-qv-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qv-qty>${qvEstado.qty}</span><button type="button" data-qv-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="btn btn--cta" data-qv-add${p.stock > 0 ? '' : ' disabled'}>${ICO.carrito}Agregar al carrito</button>
        <button type="button" class="btn btn--ghost" data-qv-comprar${p.stock > 0 ? '' : ' disabled'}>Comprar ahora</button>
      </div>
      <p class="qv__desc">${esc(p.desc)}</p>
      <a class="qv__wsp" href="${wspLink(`Hola Kalil importado! Tengo una consulta sobre: ${p.nombre}`)}" target="_blank" rel="noopener">${ICO.wsp}¿Dudas? Preguntanos por WhatsApp</a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También te puede interesar</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="176" height="220"><span>${esc(r.nombre)}</span><b>${formatearPrecio(precioDesde(r))}</b></button>`).join('')}</div></div>` : ''}
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
    const opBtn = e.target.closest('[data-qv-op]');
    if (opBtn) {
      qvEstado.op = Number(opBtn.dataset.qvOp);
      pintarQV();
      qv.querySelector(`[data-qv-op="${qvEstado.op}"]`)?.focus();
      return;
    }
    const step = e.target.closest('[data-qv-step]');
    if (step) {
      qvEstado.qty = Math.max(1, Math.min(qvEstado.p?.stock || 99, qvEstado.qty + Number(step.dataset.qvStep)));
      qv.querySelector('[data-qv-qty]').textContent = String(qvEstado.qty);
      return;
    }
    const add = e.target.closest('[data-qv-add], [data-qv-comprar]');
    if (add && qvEstado.p) {
      const p = qvEstado.p;
      const comprar = add.hasAttribute('data-qv-comprar');
      Cart.add(p, qvEstado.qty, p.ops[qvEstado.op].v);
      if (comprar) { cerrarQV(); abrirCarrito(); }
      else showToast(`Sumaste ${qvEstado.qty > 1 ? qvEstado.qty + ' × ' : ''}${p.nombre}${p.ops.length > 1 ? ` (${p.ops[qvEstado.op].v})` : ''} al carrito`);
    }
  });
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
    body.innerHTML = `<div class="cart-vacio">${ICO.bolsa}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Sumá un perfume, un termo o lo que te guste de la tienda.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul>${items.map(i => {
    const p = getProducto(i.id);
    const op = opDe(p, i.v);
    return `<li class="linea" data-linea="${esc(i.id)}" data-v="${esc(i.v)}">
      <img src="${esc(p.img)}" alt="" width="64" height="80">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(op.v)} · ${formatearPrecio(precioOp(p, op))} c/u</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n">${i.qty}</span><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioOp(p, op) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); const op = opDe(p, i.v); return `- ${i.qty} × ${p.nombre}${p.ops.length > 1 ? ` (${op.v})` : ''}: ${formatearPrecio(precioOp(p, op) * i.qty)}`; }).join('\n');
  const msg = `Hola Kalil importado! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}`;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <p class="drawer__nota">La entrega la coordinamos por WhatsApp, de lunes a sábados de 8:30 a 20:30.</p>
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

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return '';
  const params = new URLSearchParams(location.search);
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const estado = {
    cat: valido(params.get('cat'), catIds),
    para: valido(params.get('para'), PARA),
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
  const precioSel = document.querySelector('select[data-filtro="precio"]');
  if (precioSel) precioSel.innerHTML = `<option value="">Cualquier precio</option>${Object.entries(RANGOS).map(([k, r]) => `<option value="${k}">${esc(r.nombre)}</option>`).join('')}`;

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.para && sin !== 'para') f.para = estado.para;
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
    document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
      const id = el.dataset.cuentaCat;
      el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) });
    });
    document.querySelectorAll('[data-cuenta-para]').forEach(el => {
      const id = el.dataset.cuentaPara;
      el.textContent = Tienda.contar({ ...filtrosDe('para'), ...(id ? { para: id } : {}) });
    });
    const activos = ['cat', 'para', 'precio'].filter(k => estado[k]).length + (estado.stock ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = activos; filtrosN.hidden = !activos; }
    limpiarBtns.forEach(b => { if (!b.closest('[data-cat-vacio]')) b.hidden = !(activos || estado.q); });
    const cat = catIds[estado.cat];
    const para = PARA[estado.para];
    const titulo = cat ? `${cat.nombre}${para && cat.id === 'perfumes' ? ' ' + para.nombre.toLowerCase() : ''}` : para ? `Perfumes ${para.nombre.toLowerCase()}` : 'Todo el catálogo';
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? cat.bajada : 'Perfumes, termos, bazar, bienestar y peluches. Lo que va llegando, a un toque del carrito.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = !cat && !para; miga.textContent = titulo; }
    document.title = `${titulo} — Kalil importado`;
    document.querySelectorAll('.nav-cats__lista a').forEach(a => {
      if (a.getAttribute('href') === `${URL_CATALOGO}?cat=${estado.cat}`) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'para', 'precio', 'q', 'orden', 'stock', 'buscar'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.para) u.searchParams.set('para', estado.para);
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
    if (f === 'para' && estado.para && estado.cat && estado.cat !== 'perfumes') estado.cat = 'perfumes';
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) {
      estado[b.dataset.filtro] = b.dataset.valor || '';
      if (b.dataset.filtro === 'cat' && estado.cat && estado.cat !== 'perfumes') estado.para = '';
      aplicar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) {
      estado.cat = ''; estado.para = ''; estado.precio = ''; estado.stock = false; estado.q = '';
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
    const cerrarF = () => {
      if (!filtros.classList.contains('open')) return;
      filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true });
    };
    abrirF.addEventListener('click', () => { filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true'); filtros.querySelector('input, select, button')?.focus({ preventScroll: true }); });
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
  paso('.hero-rule', { scaleX: 0, transformOrigin: '0 50%', duration: 0.9, clearProps: 'transform' }, 0.05);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn, .hero-buscar', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero-chips .chip', { y: 16, opacity: 0, duration: 0.8, stagger: 0.06, clearProps: 'transform,opacity' }, 0.72);
  paso('.pin', { scale: 0.92, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.9);
  paso('.etiqueta', { y: -40, rotation: -14, opacity: 0, duration: 1.4, ease: 'elastic.out(1, 0.6)', clearProps: 'transform,opacity' }, 0.75);
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
  initEstado,
  initRail,
  initGrillas,
  initMosaico,
  initCuentas,
  () => { const cat = PAGINA === 'catalogo' ? initCatalogo() : ''; initCatsMenu(cat || ''); },
  initTarjetas,
  initQV,
  initCarrito,
  initFloats,
  initHeroMotion,
  initReveals,
  initParallax,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
